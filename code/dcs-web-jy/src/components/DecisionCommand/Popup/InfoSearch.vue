<template>
  <main id="InfoSearch" v-drag>
    <!-- <header>
      <ul class="tabs">
        <li :class="{on: tabSelected === 'search'}" @click="tabSelected = 'search'">搜索</li>
        <li :class="{on: tabSelected === 'area'}" @click="tabSelected = 'area'">任意面</li>
      </ul>
    </header> -->
    <div class="content">
      <template v-if="tabSelected === 'search'">
        <div class="query">
          <select v-model="typeSelect">
            <option v-for="(el, key) in searchTypes" :key="key" :value="key">{{ el.text }}</option>
          </select>
          <input type="text" v-model="searchString" :placeholder="searchTypes[typeSelect].placeholder">
        </div>
        <div class="result" v-if="resultLists.length">
          <ul>
            <li v-for="(el, index) in resultLists" :key="index" :title="el.name"
                @click="flyToPoi(el)">{{ el.name }}</li>
          </ul>
        </div>
      </template>
      <template v-else>
        <ul class="types">
          <li v-for="(el, key) in drawTool" :key="key" :class="key"
              @click="selectDrawTool(key)" :title="el"></li>
        </ul>
      </template>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { geoConf } from '@/config/geographyConf'
  import { assistClient, stationClient } from '@/util/ClientHelper'

  let L: any = null,
      zmap: any = null

  @Component
  export default class InfoSearch extends Vue {
    @Getter('decisionStore/region_global') region_global

    tabSelected: 'search' | 'area' = 'search'
    searchTypes: any = {
      poi: { text: 'POI', placeholder: '请输入POI名称' },
      station: { text: '监测站', placeholder: '请输入站点编号或名称' }
    }
    typeSelect: 'poi' | 'station' = 'poi'
    geographyInfo: any = {}
    geographyData: any = {}
    stationData: any[] = []
    searchString: string = ''
    resultLists: any[] = []
    searchMarker: any = null
    searchMarkerName: any = null
    drawTool: any = {
      circle: '圆形',
      rect: '矩形',
      polygon: '多边形',
      cancel: '撤消',
      delete: '删除'
    }
    
    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']

      let obj = {}
      let dist = JSON.parse(JSON.stringify(geoConf.elements))
      for (let el of dist) {
        let dist: any = { name: el.name, sub: {} }
        el.type && (dist.type = el.type)
        for (let opt of el.sub) {
          dist.sub[opt.key] = opt
        }
        obj[el.key] = dist
      }
      this.geographyInfo = { ...obj }
      this.getAllPois()
      this.getStationInfo()
    }

    beforeDestroy() {
      this.removeSearchMarker()
      L = null
      zmap = null
    }

    // @Watch('tabSelected')
    // ontabSelectedChanged (val: any, oldVal: any) {
    //   switch(val) {
    //     case 'search':
    //       break
    //     case 'area':
    //       break
    //   }
    // }

    @Watch('typeSelect')
    ontypeSelectChanged (val: any, oldVal: any) {
      this.searchString = ''
      this.removeSearchMarker()
    }

    @Watch('searchString')
    onsearchStringChanged (val: string, oldVal: string) {
      this.resultLists = []
      if (!val) return
      let reg = new RegExp(val)
      if (this.typeSelect === 'poi') {
        for (let i in this.geographyData) {
          for (let el of this.geographyData[i]) {
            if (reg.test(el.name))
              this.resultLists.push(el)
          }
        }
      } else {
        for (let el of this.stationData) {
          if (reg.test(el.name) || reg.test(el.station_id))
            this.resultLists.push(el)
        }
      }
    }

    async getAllPois() {
      for (let i in this.geographyInfo) {
        let el = this.geographyInfo[i]
        for (let j in el.sub) {
          let opt = el.sub[j]

          let type, category
          if ('type' in opt) type = opt.type
          else {
            type = el.type
            category = opt.name
          }

          let res
          if (opt.key === 'service') {    // 气象服务站
            res = await assistClient.findServicePoi()
            if (res) {
              for (let el of res) {
                el.name = el.station.split('(')[0]
              }
            }
          }
          else if (opt.key === 'building')      // 施工隐患点
            res = await assistClient.findBuildingPoi()
          else
            res = await assistClient.findAssistplace(type, this.region_global.cityId, category)
          this.geographyData[i + '_' + j] = res ? res : []
        }
      }
    }

    async getStationInfo() {
      let res = await stationClient.findStationInfo('A,B', this.region_global.cityName)
      if (res) {
        for (let el of res) {
          el.name = el.info.cname
          el.lat = el.location.lat
          el.lon = el.location.lon
        }
        this.stationData = res
      } else
        this.stationData = []
    }

    flyToPoi(el) {
      this.removeSearchMarker()
      this.searchMarker = L.marker([el.lat, el.lon], {
        icon: L.icon({
          iconUrl: `static/img/DecisionCommand/search_point.png`,
          iconSize: [19, 33],
          iconAnchor: [9.5, 33]
        })
      }).addTo(zmap)
      let str = el.name.replace(/[\u0391-\uFFE5]/g, "aa")
      let width = str.length * 14 / 2
      this.searchMarkerName = L.marker([el.lat, el.lon], {
        icon: L.divIcon({
          className: 'search-point',
          html: `<div class="search-point-name">${el.name}</div>`,
          iconSize: [width, 14],
          iconAnchor: [width/2, -5]
        })
      }).addTo(zmap)
      zmap.setView([el.lat, el.lon], 11, { animate: true, duration: 0.75 })
    }

    removeSearchMarker() {
      if (this.searchMarker) {
        zmap.removeLayer(this.searchMarker)
        this.searchMarker = null
      }
      if (this.searchMarkerName) {
        zmap.removeLayer(this.searchMarkerName)
        this.searchMarkerName = null
      }
    }

    selectDrawTool(key) {
      switch (key) {
        case 'circle':
          break
        case 'rect':
          break
        case 'polygon':
          break
        case 'cancel':
          break
        case 'delete':
          break
      }
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#InfoSearch {
  z-index: 1;
  position: absolute;
  top: 116px; /*no*/
  right: 80px; /*no*/
  width: 300px; /*no*/
  box-sizing: border-box;
  padding: 10px; /*no*/
  background: #fff;
  box-shadow: 0 0 10px #8d9db5; /*no*/
  header {
    margin-bottom: 10px; /*no*/
    ul.tabs {
      display: flex;
      justify-content: center;
      li {
        display: inline-block;
        width: 73px; /*no*/
        height: 24px; /*no*/
        line-height: 24px; /*no*/
        text-align: center;
        color: #999;
        background: #f5f5f5;
        cursor: pointer;
        &.on {
          color: #fff;
          background: $themeColor;
        }
        &:not(:firsh-child) {
          margin-left: 1px; /*no*/
        }
      }
    }
  }
  .content {
    .query {
      position: relative;
      width: 100%;
      height: 24px; /*no*/
      select {
        position: absolute;
        top: 0;
        left: 0;
        color: #fff;
        background: $themeColor;
        outline: none;
        width: 80px; /*no*/
        height: 100%;
        border: none;
        >option {
          border: none;
        }
      }
      input[type="text"] {
        position: absolute;
        top: 0;
        left: 80px; /*no*/
        width: 200px; /*no*/
        height: 100%;
        box-sizing: border-box;
        padding: 0 10px; /*no*/
        border: 1px solid #ccc; /*no*/
        border-left: none;
      }
    }
    .result {
      margin-top: 10px; /*no*/
      position: relative;
      width: 100%;
      ul {
        max-height: 220px;
        overflow: auto;
        li {
          padding: 0 10px; /*no*/
          box-sizing: border-box;
          height: 22px; /*no*/
          line-height: 22px; /*no*/
          color: #888;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          &.on { color: $themeColor; }
          &:hover {
            background: #eee;
          }
        }
      }
    }
    ul.types {
      margin-left: 40px; /*no*/
      padding: 0 20px; /*no*/
      width: 160px; /*no*/
      display: flex;
      justify-content: space-between;
      li {
        display: inline-block;
        width: 25px; /*no*/
        height: 24px; /*no*/
        background-image: url(~Img/DecisionCommand/info_search.png);
        background-repeat: no-repeat;
        background-size: 500% 100%;
        box-shadow: 0 0 5px #cbd3de; /*no*/
        cursor: pointer;
        &.circle { background-position: 0 0; }
        &.rect { background-position: 25% 0; }
        &.polygon { background-position: 50% 0; }
        &.cancel { background-position: 75% 0; }
        &.delete { background-position: 100% 0; }
      }
    }
  }
}
</style>

<style lang='scss'>
.search-point-name {
  color: rgb(217, 55, 55);
  font-size: 14px; /*no*/
  line-height: 14px; /*no*/
  font-weight: bold;
  white-space: nowrap;
}
</style>