<template>
  <main id="WaterReal">
    <ul class="checkbox cf">
      <li @click="toggleStation(opt)" v-for="opt of stations" :key="opt.type">
        <em :class="['checkbox', {'on': opt.selected}]"></em>
        <span>{{ opt.name }}</span>
        <p @click.stop="openTablePanel(opt.type)"></p>
      </li>
    </ul>
    <ul class="elements cf">
      <li @click="toggleElement(opt)" v-for="opt of elements" :key="opt.key">
        <em :class="opt.key"></em>
        <div :class="['el', {'on': opt.selected}]">{{ opt.name }}</div>
      </li>
    </ul>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { geoClient, hydrologyClient } from '../../util/clientHelper'
  import { ZmapHelper } from '../../util/zmapHelper'
  import moment from 'moment'

  let L,zmap
  let realInfo: any = {}
  const clusterGroupOpt = {
    animate: false,
    disableClusteringAtZoom: 9,
    maxClusterRadius: 120,
    chunkedLoading: true
  }
  const maxLength = 100     // for L.MarkerClusterGroup
  let areaBounds: any[] = []

  @Component
  export default class WaterReal extends Vue {
    @Getter('systemStore/userInfo_global') userInfo_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    @Action('systemStore/storehydrologyRealInfo_global') storehydrologyRealInfo_global: any
    @Action('systemStore/storehydrologyChartInfo_global') storehydrologyChartInfo_global: any
    @Action('systemStore/storehydrologyTableType_global') storehydrologyTableType_global: any
    @Prop() date: string
    @Prop() hour: string
    @Prop() minute: string

    stations: any[] = [
      { type: 'rivers', name: '水文站', selected: false },
      { type: 'reservoirs', name: '水库', selected: false }
    ]
    elements: any[] = [
      { key: 'waterlevel', name: '水位[M]', selected: false },
      { key: 'fluctuate',name: '水势[涨平落]', selected: false },
      { key: 'alertlevel',name: '警戒水位[M]', selected: false }
    ]
    intervalHolder: any = null
    
    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      this.initInterval()
      zmap.on('zoomend', () => {
        this.storePopupStatus_global({ key: 'HydrologyReal', action: false })
      })
    }

    beforeDestroy() {
      if (this.intervalHolder) {
        clearInterval(this.intervalHolder)
        this.intervalHolder = null
      }
      realInfo = {}
      areaBounds = []
    }

    initInterval() {
      this.intervalHolder = setInterval(() => {
        for (let opt of this.stations) {
          if (opt.selected)
            this.getHydrologyInfo(opt)
        }
      }, 60*60*1000)
    }

    toggleStation(opt: any) {
      opt.selected = !opt.selected
      if (opt.selected)
        this.getHydrologyInfo(opt)
      else
        this.removeLayer(opt.type)
    }

    async getHydrologyInfo(opt) {
      let data = await hydrologyClient.getInfo(opt.type)
      if (!opt.selected) return
      if (!data) {
        Vue['prototype']['$message']({
          type: 'warning',
          message: '水文数据获取失败'
        })
        return
      }
      let obj = {}
      let updatetime
      for (let item of data) {
        // obj[item.id] = item
        if (opt.type === 'rivers') {
          if (!areaBounds.length)
            await this.getBoundary()
          // 判断河流是否在当前分区内
          let isPointInPolygon = false
          for (let bound of areaBounds) {
            isPointInPolygon = ZmapHelper.isPointInPolygon([item.lat, item.lon], bound)
            if (isPointInPolygon) break
          }
          if (isPointInPolygon)
            obj[item.id] = item
        } else if (opt.type === 'reservoirs') {
          if (this.userInfo_global.user.countyId) {
            let reg = new RegExp(this.userInfo_global.user.countyName.slice(0, 2))
            if (reg.test(item.county))
              obj[item.id] = item
          } else if (this.userInfo_global.user.cityid) {
            let reg = new RegExp(this.userInfo_global.user.cityName.slice(0, 2))
            if (reg.test(item.city))
              obj[item.id] = item
          } else {
            obj[item.id] = item
          }
        }
        if (!updatetime && item.updatetime)
          updatetime = item.updatetime
      }
      realInfo[opt.type] = obj
      console.log(realInfo)
      await this.getFluctuate(opt.type, updatetime)               // 水势
      this.addStation(opt.type, realInfo[opt.type])
      for (let el of this.elements) {
        if (el.selected) this.addReal(opt.type, el, realInfo[opt.type])
      }
    }
    
    addStation(key, data) {
      this.removeLayer(key)
      let group = Object.keys(data).length >= maxLength ? new L.MarkerClusterGroup(clusterGroupOpt) : new L.LayerGroup()
      for (let i in data) {
        let item = data[i]
        let suffix = (typeof item.waterlevel === 'number' && typeof item.alertlevel === 'number' && item.waterlevel > item.alertlevel) ? '_over' : ''
        let fluctuate = ''
        if (typeof item.fluctuate === 'number') {
          fluctuate = item.fluctuate > 0 ? '_up' : '_down'
        }
        let icon = L.icon({
          className: 'ponit',
          iconUrl: `static/img/hydrology/${key}${suffix}${fluctuate}.png`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })
        let marker = L.marker([item.lat, item.lon], { icon, zIndexOffset: 1 })
        marker.on('mouseover', e => {
          let x = e.containerPoint.x,
              y = e.containerPoint.y
          item.pos = { x, y }
          item.stationType = key
          this.storehydrologyRealInfo_global(item)
          this.storePopupStatus_global({ key: 'HydrologyReal', action: true })
        })
        marker.on('mouseout', e => {
          this.storehydrologyRealInfo_global(null)
          this.storePopupStatus_global({ key: 'HydrologyReal', action: false })
        })
        marker.on('click', e => {
          this.storehydrologyChartInfo_global(item)
          this.storePopupStatus_global({ key: 'HydrologyChart', action: true })
        })
        group.addLayer(marker)
      }
      group.id = key
      zmap.addLayer(group)
    }

    async getFluctuate(type, endTime) {
      endTime = new Date(endTime)
      let startTime: any = moment(endTime).subtract(1, 'hours')
      endTime = moment(endTime).format('YYYY-MM-DD HH:00:00')
      startTime = moment(startTime).format('YYYY-MM-DD HH:00:00')
      let res = await hydrologyClient.getFluctuate(type, startTime, endTime)
      if (!res) return
      console.log(res)
      for (let el of res) {
        let id = type === 'rivers' ? el.STACODE : el.V01301
        let waterLevel = type === 'rivers' ? 'WATERLEV' : 'RZ'
        if (!realInfo[type][id]) continue
        realInfo[type][id].fluctuate = el[waterLevel] ? Math.floor(Number(el[waterLevel]) * 100) / 100 : el[waterLevel]
      }
    }

    addReal(type, el, data) {
      this.removeLayer(type + '_' + el.key)
      if (!data) return
      let group = Object.keys(data).length >= maxLength ? new L.MarkerClusterGroup(clusterGroupOpt) : new L.LayerGroup()
      for (let i in data) {
        let opt = data[i]
        const icon = L.divIcon({
          className: `station-el-wraper`,
          html: `<span class="station-el station-${el.key}">${ opt[el.key] ? opt[el.key] + '米' : ''}</span>`
        })
        let marker = L.marker([opt.lat, opt.lon], { icon, zIndexOffset: -1 })
        group.addLayer(marker)
      }
      group.id = type + '_' + el.key
      zmap.addLayer(group)
    }

    toggleElement(el: any) {
      el.selected = !el.selected
      if (el.selected) {
        for (let opt of this.stations) {
          if (!opt.selected) continue
          this.addReal(opt.type, el, realInfo[opt.type])
        }
      } else {
        this.removeLayer(el.key)
      }
    }

    removeLayer(key) {
      let reg = new RegExp(key)
      zmap.eachLayer(e => {
        if(reg.test(e.id)) zmap.removeLayer(e)
      })
    }

    openTablePanel(key) {
      this.storehydrologyTableType_global(key)
      this.storePopupStatus_global({ key: 'HydrologyTable', action: true })
    }

    async getBoundary() {
      let data
      if (this.userInfo_global.user.countyId)
        data = await geoClient.findCounty(this.userInfo_global.user.countyId)
      else if (this.userInfo_global.user.cityid) 
        data = await geoClient.findCity(this.userInfo_global.user.cityid)
      else
        data = await geoClient.getProv()
      if (!data) return
      if (this.userInfo_global.user.countyId) {
        let bound = data.boundary
        for (let opt of bound) {
          let latlngs: any[] = []
          for (let el of opt)
            latlngs.push([el.y, el.x])
          areaBounds.push(latlngs)
        }
      }
      else {
        let bound = JSON.parse(data.bound)
        for (let opt of bound) {
          let latlngs: any[] = []
          for (let el of opt)
            latlngs.push([el[1], el[0]])
          areaBounds.push(latlngs)
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
#WaterReal{
  position: relative;
  padding: 8px 0 5px;
  .checkbox li p {
    position: absolute;
    top: 0;
    left: 80px;
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url(~Img/stationlive/table.png) no-repeat center / 14px 14px;
    cursor: pointer;
    &:hover { background: url(~Img/stationlive/table_cover.png) no-repeat center / 14px 14px; }
  }
  ul.elements li em {
    &.waterlevel { background: rgb(0, 126, 126); }
    &.fluctuate { background: rgb(140, 140, 140); }
    &.alertlevel { background: rgb(253, 142, 141); }
  }
}
</style>