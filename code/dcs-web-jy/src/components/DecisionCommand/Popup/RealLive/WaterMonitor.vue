<template>
  <div class="wrapper" id="WaterMonitor">
    <ul class="decision-chk-group cf">
      <li v-for="el of waterMonitorOpts" :key="el.key"
          :class="{on: el.isSelected}" @click="toggleWaterMonitorOpts(el)">
        <em></em>
        <span>{{ el.name }}</span>
      </li>
      <li :class="{on: isAlterLevelShow}" @click="toggleAlterLevel">
        <em></em>
        <span>显示警戒水位</span>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { geoClient, hydrologyClient } from '@/util/ClientHelper'
  import { ZmapHelper } from '@/util/zmapHelper'

  let L: any = null,
      zmap: any = null,
      areaBounds: any[] = []

  interface WaterOpts {
    key: string
    name: string
    isSelected: boolean
  }

  @Component
  export default class WaterMonitor extends Vue {
    @Prop() isPanelShow
    @Getter('systemStore/region_global') region_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storedetailNameInfo_global') storedetailNameInfo_global
    @Action('decisionStore/storeWaterMonitorDetailInfo_global') storeWaterMonitorDetailInfo_global

    isCompomentAlive: boolean = true
    waterMonitorOpts: WaterOpts[] = [
      { key: 'reservoirs', name: '水库', isSelected: false },
      { key: 'rivers', name: '河流', isSelected: false }
    ]
    waterInfo: any = {}
    isAlterLevelShow: boolean = false

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      zmap.on('zoomend', this.zoomChanged)
    }
    
    beforeDestroy() {
      zmap.off('zoomend', this.zoomChanged)      
      for (let el of this.waterMonitorOpts) {
        if (el.isSelected)
          this.removeOpts(el.key)
      }
      this.storePopupStatus_global({ key: 'waterMonitorDetail', action: false })
      L = null
      zmap = null
      areaBounds = []
      this.isCompomentAlive = false
    }

    @Watch('isPanelShow')
    onisPanelShowChanged (val: boolean, oldVal: boolean) {
      if (!val) return
      let flag = false
      for (let el of this.waterMonitorOpts) {
        if (el.isSelected) {
          flag = true
          break
        }
      }
      if (flag) return
      this.toggleWaterMonitorOpts(this.waterMonitorOpts[0])
    }

    zoomChanged(e) {
      let zoom = e.target.getZoom()
      let alertLevelEles = document.querySelectorAll('.water-panel-wrapper .alertlevel'),
          waterLevelEles = document.querySelectorAll('.water-panel-wrapper .waterlevel'),
          arrowEles = document.querySelectorAll('.water-panel-wrapper .arrow')
      let alertLevelElesArr = Array.prototype.slice.call(alertLevelEles),
          waterLevelElesArr = Array.prototype.slice.call(waterLevelEles),
          arrowElesArr = Array.prototype.slice.call(arrowEles)
      alertLevelElesArr.forEach(el => el.style.visibility = (zoom < 8 || !this.isAlterLevelShow) ? 'hidden' : 'visible')
      let visibility = zoom < 8 ? 'hidden' : 'visible'
      waterLevelElesArr.forEach(el => el.style.visibility = visibility)
      arrowElesArr.forEach(el => el.style.visibility = visibility)
    }

    toggleWaterMonitorOpts(el) {
      el.isSelected = !el.isSelected
      if (el.isSelected) {
        if (el.key === 'reservoirs') this.addReservoirs(el)
        else this.addRivers(el)
      }
      else this.removeOpts(el.key)
    }

    async addReservoirs(item) {
      let type = item.key
      let res: false | ReservoirInfo[] = await hydrologyClient.getInfo(type)
      if (!this.isCompomentAlive || !item.isSelected) return
      if (!res) {
        Vue['prototype']['$message']({ type: 'error', message: '数据获取失败' })
        return
      }
      this.waterInfo = {}
      for (let el of res) {
        let reg = new RegExp(this.region_global.cityName)
        if (reg.test(el.city))
          this.waterInfo[el.id] = el
      }
      this.addStation(type)
    }

    async addRivers(item) {
      let type = item.key
      let res: false | RiverInfo[] = await hydrologyClient.getInfo(type)
      if (!this.isCompomentAlive || !item.isSelected) return
      if (!res) {
        Vue['prototype']['$message']({ type: 'error', message: '数据获取失败' })
        return
      }
      this.waterInfo = {}
      for (let el of res) {
        if (!areaBounds.length)
          await this.getBoundary()
        if (!this.isCompomentAlive || !item.isSelected) return
        let isPointInPolygon = false
        for (let bound of areaBounds) {
          isPointInPolygon = ZmapHelper.isPointInPolygon([el.lat, el.lon], bound)
          if (isPointInPolygon) break
        }
        if (isPointInPolygon)
          this.waterInfo[el.id] = el
      }
      this.addStation(type)
    }

    addStation(type: 'reservoirs' | 'rivers') {
      for (let id in this.waterInfo) {
        let el = this.waterInfo[id]
        let level = ''
        if (!el.alertlevel || !el.waterlevel) level = 'one'
        else {
          if (el.waterlevel > el.alertlevel) level = 'four'
          else {
            let per = el.waterlevel / el.alertlevel
            if (per < 0.65) level = 'one'
            else if (per < 0.8) level = 'two'
            else level = 'three'
          }
        }
        let marker = L.marker([el.lat, el.lon], {
          icon: L.divIcon({
            className: 'water-panel-wrapper',
            html: `
              <div class="alertlevel" style="visibility: ${this.isAlterLevelShow ? 'visible' : 'hidden'}">
                ${el.alertlevel || '--'}
              </div>
              <div class="${level} waterlevel">${el.waterlevel || '--'}</div>
              <svg class="${level} arrow" width="8px" height="3px">
                <path d="M0 0 L8 0 L4 3 Z " />
              </svg>
              <i class="${level}"></i>
            `,
            iconSize: [60, 48],
            iconAnchor: [30, 39]
          })
        })
        marker.on('mouseover', e => {
          let x = e.containerPoint.x,
              y = e.containerPoint.y + 65
          let dist = {
            name: 'river' in el ? el.staname : el.address,
            pos: { x, y }
          }
          this.storedetailNameInfo_global(dist)
          this.storePopupStatus_global({ key: 'detailName', action: true })
        })
        marker.on('mouseout', e => {
          this.storePopupStatus_global({ key: 'detailName', action: false })
          this.storedetailNameInfo_global(null)
        })
        marker.on('click', e => {
          this.storePopupStatus_global({ key: 'detailName', action: false })
          this.storedetailNameInfo_global(null)

          // this.storeWaterMonitorDetailInfo_global(null)
          // this.storePopupStatus_global({ key: 'waterMonitorDetail', action: false })

          let x = e.containerPoint.x,
              y = e.containerPoint.y
          el.pos = { x, y }
          el.level = level
          el.waterType = type
          this.storeWaterMonitorDetailInfo_global(el)
          this.storePopupStatus_global({ key: 'waterMonitorDetail', action: true })
        })
        marker.id = type
        marker.addTo(zmap)
      }
    }

    async getBoundary() {
      let data = await geoClient.findCity(this.region_global.cityId)
      if (!data) return
      let bound = JSON.parse(data.bound)
      for (let opt of bound) {
        let latlngs: any[] = []
        for (let el of opt)
          latlngs.push([el[1], el[0]])
        areaBounds.push(latlngs)
      }
    }

    toggleAlterLevel() {
      this.isAlterLevelShow = !this.isAlterLevelShow
      let visibility = this.isAlterLevelShow ? 'visible' : 'hidden'
      let els = document.querySelectorAll('.alertlevel')
      let elsArr = Array.prototype.slice.call(els)
      elsArr.forEach(el => {
        el.style.visibility = visibility
      })
    }

    removeOpts(type) {
      zmap.eachLayer(e => {
        if (e.id === type)
          zmap.removeLayer(e)
      })
    }
  }
</script>

<style lang='scss'>
.water-panel-wrapper {
  .alertlevel {
    z-index: 1;
    position: absolute;
    padding: 0 5px; /*no*/
    top: -13px; /*no*/
    right: 4px; /*no*/
    min-width: 20px; /*no*/
    height: 18px; /*no*/
    line-height: 18px; /*no*/
    color: #fff;
    text-align: center;
    background: #485156;
    border-radius: 2px; /*no*/
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
  }
  .waterlevel {
    width: 60px; /*no*/
    height: 24px; /*no*/
    line-height: 24px; /*no*/
    color: #fff;
    text-shadow: 1px 1px 1px #000; /*no*/
    text-align: center;
    border-radius: 2px; /*no*/
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
    &.one { background: #00A0E9; }
    &.two { background: #FCEE21; }
    &.three { background: #F7931E; }
    &.four { background: #ED1C24; }
  }
  .arrow {
    position: absolute;
    top: 24px; /*no*/
    left: 26px; /*no*/
    &.one { fill: #00A0E9; }
    &.two { fill: #FCEE21; }
    &.three { fill: #F7931E; }
    &.four { fill: #ED1C24; }
  }
  i {
    position: absolute;
    top: 32px; /*no*/
    left: 23px; /*no*/
    display: inline-block;
    width: 6px; /*no*/
    height: 6px; /*no*/
    background: #485156;
    border: 4px solid #485156; /*no*/
    border-radius: 50%;
    &.one { border-color: #00A0E9; }
    &.two { border-color: #FCEE21; }
    &.three { border-color: #F7931E; }
    &.four { border-color: #ED1C24; }
    &::before {
      z-index: -1;
      content: '';
      position: absolute;
      top: -6px; /*no*/
      left: -6px; /*no*/
      width: 18px; /*no*/
      height: 18px; /*no*/
      background: #fff;
      border-radius: 50%;
    }
  }
}
</style>
