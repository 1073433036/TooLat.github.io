<template>
  <main id="AlarmMonitor">
    <ul>
      <li class="cf">
        <div class="name">台风</div>
        <div :class="['cont', 'typh-info', {warning: isTyphWarning}]" @click="selectTyph">
          <span>{{ typhWarningTip }}</span>
        </div>
      </li>
      <li class="cf">
        <div class="name">山洪</div>
        <div :class="['cont', {red: torrentWarning.length}]" @click="toggleOpt('torrent')">
          <span class="val">{{ torrentWarning.length }}</span><span> 个</span>
        </div>
      </li>
      <li class="cf">
        <div class="name">内涝</div>
        <div :class="['cont', {red: waterlogWarning.length}]" @click="toggleOpt('waterlog')">
          <span class="val">{{ waterlogWarning.length }}</span><span> 个</span>
        </div>
      </li>
      <li class="cf">
        <div class="name">地质灾害</div>
        <div :class="['cont', {red: geolWarning.length}]" @click="toggleOpt('geol')">
          <span class="val">{{ geolWarning.length }}</span><span> 个</span>
        </div>
      </li>
      <!-- <li class="cf">
        <div class="name">台风</div>
        <div class="cont">
          <i></i>
          <span class="level">I级</span>
        </div>
        <div class="desc"><em></em></div>
      </li> -->
    </ul>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { geoClient, typhoonClient, warningClient } from '@/util/ClientHelper'
  import { ZmapHelper } from '@/util/zmapHelper'

  let L: any = null,
      zmap: any = null,
      areaBounds: any[] = []
  // let border = {
  //   left: 0,
  //   right: 0,
  //   top: 0,
  //   bottom: 0
  // }
    function isPointInBounds(point) {
      let isPointInPolygon
      for (let bound of areaBounds) {
        isPointInPolygon = ZmapHelper.isPointInPolygon(point, bound)
        if (isPointInPolygon) return true
      }
      return false
    }

  @Component
  export default class AlarmMonitor extends Vue {
    @Getter('decisionStore/region_global') region_global
    @Action('decisionStore/storeEmergencyMonitor_global') storeEmergencyMonitor_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storedetailNameInfo_global') storedetailNameInfo_global
    @Action('decisionStore/storeAlarmMonitorDetail_global') storeAlarmMonitorDetail_global
    @Action('decisionStore/storeAlarmTyphFlag_global') storeAlarmTyphFlag_global
    @Action('decisionStore/storeAlarmTyphTsid_global') storeAlarmTyphTsid_global
    @Prop() clearHolder
    intervalHolder: any = null
    get isAlarmWarning(): boolean {
      if (this.isTyphWarning) return true
      if (this.torrentWarning.length || this.geolWarning.length || this.waterlogWarning.length) return true
      return false
    }
    @Watch('isAlarmWarning')
    onisAlarmWarningChanged (val: boolean, oldVal: boolean) {
      this.storeEmergencyMonitor_global({ key: 'alarmMonitor', action: val })
    }

    isTyphWarning: boolean = false
    newestTyph: TyphoonInfo | any = null
    get typhWarningTip(): string {
      if (this.isTyphWarning) {
        let tscname =
          (this.newestTyph && this.newestTyph.info && this.newestTyph.info.cname)
          ? this.newestTyph.info.cname
          : '未命名'
        return (this.newestTyph && this.newestTyph.intlid) + ' ' + tscname
      }
      else
        return '无'
    }

    torrentWarning: Torrentwarning[] = []
    geolWarning: GeolWarning[] = []
    waterlogWarning: WaterlogWarning[] = []
    showOpts: any = {       // 用于判断是否 已将数据展示在地图上
      torrent: false,
      waterlog: false,
      geol: false
    }

    async mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      // await this.getBorder()
      await this.getBoundary()
      this.getWarning()
      this.intervalHolder = setInterval(this.getWarning, 60*1000)
    }

    // async getBorder() {
    //   let res = await geoClient.findCity(this.region_global.cityId)
    //   if (res) {
    //     let b = JSON.parse(res.border)
    //     border.left = b.left
    //     border.right = b.right
    //     border.top = b.top
    //     border.bottom = b.bottom
    //   }
    // }

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

    getWarning() {
      this.getTyphoonWarning()
      this.getTorrentwarning()
      this.getGeolWarning()
      this.getWaterlogWarning()
    }

    beforeDestroy() {
      clearInterval(this.intervalHolder)
      this.intervalHolder = null
      L = null
      zmap = null
      areaBounds = []
    }

    // 台风
    async getTyphoonWarning() {
      // let res: false | null | TyphoonWarning[] = await warningClient.getTyphoonWarning(border.left, border.right, border.top, border.bottom)
      // if (res) {
      //   this.isTyphWarning = true
      //   this.newestTyph = res[0]
      // } else {
      //   this.isTyphWarning = false
      // }
      let res: TyphoonInfo[] | false = await typhoonClient.findTyphoonInfo()
      if (!res || !res.length) return
      let arr: TyphoonInfo[] = []
      arr = res.filter(a => a.maxtime)
      arr.sort((a, b) => b.maxtime - a.maxtime)
      
      let nowDate: Date = new Date()
      nowDate.setHours(nowDate.getHours() - 12)
      let newestTyph = arr[0]
      let time = new Date(newestTyph.maxtime).getTime()
      if (time > new Date(nowDate).getTime()) {
        this.isTyphWarning = true
        this.newestTyph = newestTyph
      } else {
        this.isTyphWarning = false
      }
    }

    selectTyph() {
      if (!this.newestTyph) return
      this.storeAlarmTyphFlag_global()
      this.storeAlarmTyphTsid_global(this.newestTyph.tsid)
    }

    // 山洪
    async getTorrentwarning() {
      let res: false | null | Torrentwarning[] = await warningClient.getTorrentwarning()
      this.torrentWarning = []
      if (res) {
        let flag
        for (let el of res) {
          flag = isPointInBounds([el.lat, el.lon])
          if (flag)
            this.torrentWarning.push(el)
        }
      }
    }

    // 地质灾害
    async getGeolWarning() {
      let res: false | null | GeolWarning[] = await warningClient.getGeolWarning()
      this.geolWarning = []
      if (res) {
        let flag
        for (let el of res) {
          flag = isPointInBounds([el.lat, el.lon])
          if (flag)
            this.geolWarning.push(el)
        }
      }
    }

    // 内涝
    async getWaterlogWarning() {
      let res: false | null | WaterlogWarning[] = await warningClient.getWaterlogWarning()
      this.waterlogWarning = []
      if (res) {
        let flag
        for (let el of res) {
          flag = isPointInBounds([el.lat, el.lon])
          if (flag)
            this.waterlogWarning.push(el)
        }
      }
    }

    // 显示 山洪、地质灾害、内涝 数据
    toggleOpt(type: 'torrent' | 'waterlog' | 'geol') {
      let list: any[] = []
      switch(type) {
        case 'torrent': list = this.torrentWarning; break
        case 'waterlog': list = this.waterlogWarning; break
        case 'geol': list = this.geolWarning; break
      }
      if (!list.length) return
      this.showOpts[type] = !this.showOpts[type]
      if (this.showOpts[type]) {
        for (let el of list) {
          let marker = L.marker([el.lat, el.lon], {
            icon: L.icon({
              iconUrl: `static/img/DecisionCommand/modelIcon/${type}/green.png`,
              iconSize: [25, 40],
              iconAnchor: [12.5, 20]
            })
          })
          marker.on('mouseover', e => {
            let x = e.containerPoint.x,
                y = e.containerPoint.y - 10
            if (!el.name) return
            let dist = {
              name: el.name,
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
            // let x = e.containerPoint.x,
            //     y = e.containerPoint.y
            // el.pos = { x, y }
            el.latlon = el.lon.toFixed(2) + (el.lon >= 0 ? '°E' : '°W') + ', ' + el.lat.toFixed(2) + (el.lat >= 0 ? '°N' : '°S')
            el.alarmType = type
            this.storeAlarmMonitorDetail_global(el)
            this.storePopupStatus_global({ key: 'alarmMonitorDetail', action: true })
          })
          marker.id = 'e_' + type
          marker.addTo(zmap)
        }
      } else {
        this.clearLayer('e_' + type)
      }
    }

    clearLayer(type: string) {
      zmap.eachLayer(e => {
        if (e.id === type)
          zmap.removeLayer(e)
      })
    }

    // 清除已展示在地图上的数据
    @Watch('clearHolder')
    onclearHolderChanged (val: number, oldVal: number) {
      for (let i in this.showOpts) {
        if (this.showOpts[i]) {
          this.clearLayer('e_' + i)
          this.showOpts[i] = false
        }
      }
      this.storeAlarmMonitorDetail_global({})
      this.storePopupStatus_global({ key: 'alarmMonitorDetail', action: false })
    }
  }
</script>

<style lang='scss' scoped>
#AlarmMonitor {
  width: 100%;
  height: 100%;
  ul {
    li {
      margin: 10px 0;
      .name {
        float: left;
        width: 100px;
        color: #6d6c6c;
        text-align: center;
      }
      .cont {
        position: relative;
        float: left;
        width: 120px;
        cursor: pointer;
        &.typh-info.warning {
          &:hover span {
            text-decoration: underline;
          }
          span {
            color: #f00;
          }
        }
        &.red {
          &:hover span {
            text-decoration: underline;
            text-decoration-color: #000;
          }
          span.val {
            color: #f00;
          }
        }
        // i {
        //   display: inline-block;
        //   width: 16px;
        //   height: 16px;
        //   background: orange;
        //   border-radius: 8px;
        // }
        // span.level {
        //   color: #1c1c1c;
        // }
      }
      .desc {
        float: left;
        position: relative;
        em {
          display: inline-block;
          width: 16px;
          height: 16px;
          background: #a3a3a3;
          border-radius: 8px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
