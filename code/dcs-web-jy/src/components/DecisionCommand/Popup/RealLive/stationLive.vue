<template>
  <main id="StationLive">
    <div class="header cf">
      <span>站点实况</span>
      <el-date-picker v-model="date" size="small" :editable="false" format="yyyy-MM-dd HH:mm"
            :clearable="false" type="datetime"></el-date-picker>
    </div>

    <ul class="decision-chk-group cf">
      <li v-for="el of stations" :key="el.key" :class="{on: el.isSelected}"
          @click="toggleStation(el)">
        <em></em>
        <span>{{ el.name }}</span>
      </li>
    </ul>

    <ul class="elems cf">
      <li v-for="el of elems" :key="el.key" :class="{on: elementsSelected === el.key}"
          @click="selectElement(el)">
        {{ el.name }}
      </li>
    </ul>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { stationClient } from '@/util/ClientHelper'
  import { StationConf } from '@/config/StationLiveConf'
  import moment from 'moment'

  let L: any = null,
      zmap: any = null,
      realInfo: any = {}
  function isDataQualified(el, key) {
    if (!el
        || !el[key]
        || Math.abs(el[key]) > 8888
        || (key === 'ps' && el[key] === 333.29)
        || (key === 'wd3smaxdf' && el[key] < 0)
        || (key === 'tempdaymax' && el[key] < -50)
        || (key === 'tempdaymin' && el[key] < -50)
        || (key === 'rfhour' && el[key] < 0)
        || (key === 'rfday' && el[key] < 0))
      return false
    else
      return true
  }

  @Component
  export default class StationLive extends Vue {
    @Getter('decisionStore/region_global') region_global
    @Getter('decisionStore/zmapViewer_global') zmapViewer_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storestationLiveDetailInfo_global') storestationLiveDetailInfo_global
    @Action('decisionStore/storeColorTable_global') storeColorTable_global

    isCompomentAlive: boolean = true
    date: Date = new Date()
    stations: any[] = [
      { key: 'A', name: '国家站', isSelected: true },
      { key: 'B', name: '区域站', isSelected: false },
    ]
    elems: any[] = [
      { key: 'temp', name: '气温', unit: '℃', type: 'temp', label: '温度' },
      { key: 'ps', name: '气压', unit: 'hPa', type: 'mslp', label: '气压' },
      { key: 'rh', name: '湿度', unit: '%', type: 'rh', label: '湿度' },
      { key: 'wd3smaxdf', name: '极大风', unit: 'm/s', type: 'wind', label: '风速' },
      { key: 'tempdaymax',  name: '日最高温', unit: '℃', type: 'temp', label: '温度' },
      { key: 'tempdaymin',  name: '日最低温', unit: '℃', type: 'temp', label: '温度' },
      { key: 'rfhour', name: '小时雨量', unit: 'mm', type: 'rain', label: '降雨' },
      { key: 'rfday', name: '日雨量', unit: 'mm', type: 'rain', label: '降雨' }
    ]
    elementsSelected: string = ''
    hasInitData: boolean = false

    async mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      let date = Date.now() - 10*60*1000   
      this.date = new Date(date)
      setTimeout(() => this.hasInitData = true, 0)
      for (let el of this.stations) {
        await this.findStationInfo(el.key)
        await this.findStationData(el.key)
      }
      this.selectElement(this.elems[0])

      zmap.on('zoomend', this.zoomendEvent)
      zmap.on('resize', this.dataChanged)
    }

    beforeDestroy() {
      this.clearExtremumTip()
      zmap.off('zoomend', this.zoomendEvent)
      zmap.off('resize', this.dataChanged)
      this.removeStations()
      if (this.elementsSelected) {
        let opt = this.elems.find(item => item.key === this.elementsSelected)
        this.storeColorTable_global({ type: 'delete', data: { type: opt.type, flag: opt.type } })
      }
      L = null
      zmap = null
      realInfo = {}
      this.isCompomentAlive = false
    }

    zoomendEvent() {
      if (zmap.getZoom() <= 7) this.removeStations()
      else this.dataChanged()
      this.storestationLiveDetailInfo_global(null)
      this.storePopupStatus_global({ key: 'stationLiveDetail', action: false })
    }

    // 切换站点显示
    async toggleStation(el) {
      el.isSelected = !el.isSelected
      this.addExtremumTip()
      if (el.isSelected) {
        this.dataChanged()
      } else {
        this.removeLayer(el.key)
      }
    }

    // 获取站点信息
    async findStationInfo(key) {
      let res = await stationClient.findStationInfo(key, this.region_global.cityName)
      if (!this.isCompomentAlive) return
      if (!res) {
        Vue['prototype']['$message']({ type: 'error', message: '站点数据获取失败' })
        return
      }
      realInfo[key] = {}
      for (let el of res) {
        realInfo[key][el.station_id] = el
      }
    }

    // 获取站点实况信息
    async findStationData(key) {
      for (let id in realInfo[key]) {
        realInfo[key][id].datetime = null
        realInfo[key][id].elements = null
      }
      let date: any = new Date(this.date).getTime()
      date = date - date % (5*60*1000)
      let datetime = moment(date).format('YYYY-MM-DD HH:mm:00')
      let res = await stationClient.findStationData(datetime, key, this.region_global.cityName)
      if (!this.isCompomentAlive) return
      if (!res) {
        Vue['prototype']['$message']({ type: 'error', message: '站点实况数据获取失败' })
        return
      }
      for (let el of res) {
        if (el.station_id in realInfo[key]) {
          realInfo[key][el.station_id].datetime = el.datetime
          realInfo[key][el.station_id].elements = el.elements
        }
      }
      console.log(realInfo)
    }
    
    // 元素选择
    async selectElement(el) {
      let isFirstTime = !this.elementsSelected
      if (isFirstTime)
        zmap.setView(this.zmapViewer_global.center, this.zmapViewer_global.zoom, { animate: true, duration: 0.75 })
      let lastEleSelected = this.elementsSelected
      this.elementsSelected = lastEleSelected === el.key ? '' : el.key
      if (this.elementsSelected) {
        this.addExtremumTip()
        this.dataChanged(isFirstTime)
        if (lastEleSelected) {
          let opt = this.elems.find(item => item.key === lastEleSelected)
          this.storeColorTable_global({ type: 'delete', data: { type: opt.type, flag: opt.type } })
        }
        this.storeColorTable_global({ type: 'add', data: { type: el.type, flag: el.type, label: el.label } })
      } else {
        this.clearExtremumTip()
        this.removeStations()
        this.storeColorTable_global({ type: 'delete', data: { type: el.type, flag: el.type } })
      }
    }
    
    // 极值统计
    addExtremumTip() {
      let isStationSelected = false
      for (let opt of this.stations) {
        if (opt.isSelected) {
          isStationSelected = true
          break
        }
      }
      if (!isStationSelected || !this.elementsSelected) {
        this.clearExtremumTip()
        return
      }

      let el = this.elems.find(i => i.key === this.elementsSelected)
      let list: any[] = []      // 获取当前元素所有站点有效数据

      for (let opt of this.stations) {
        if (!opt.isSelected) continue
        for (let i in realInfo[opt.key]) {
          let elements = realInfo[opt.key][i].elements
          let flag = isDataQualified(elements, el.key)
          if (!flag) continue
          list.push(realInfo[opt.key][i])
        }
      }
      
      list.sort((a, b) => a.elements[el.key] - b.elements[el.key])
      let isEleExistence: boolean =  false
      let e = document.querySelector('#station-extremum')
      if (e) isEleExistence = true

      if (list.length) {
        let max = list[list.length - 1]
        let min = list[0]
        if (!e) {
          e = document.createElement('div')
          e.id = 'station-extremum'
        }
        let innerHtml = `
          <ul>
            <li class="top">
              <i></i>
              <span>最高${el.name} : </span>
              <span class="detail">
                ${max.info.cname} ${Math.round(max.elements[el.key]*10)/10} ${el.unit}
              </span>
            </li>
            <li class="bottom">
              <i></i>
              <span>最低${el.name} : </span>
              <span class="detail">
                ${min.info.cname} ${Math.round(min.elements[el.key]*10)/10} ${el.unit}
              </span>
            </li>
          </ul>
        `
        e.innerHTML = innerHtml
        !isEleExistence && document.body.appendChild(e)

        let maxSpanEl = <HTMLSpanElement>document.querySelector('#station-extremum .top .detail')
        maxSpanEl.onclick = () => zmap.setView([max.location.lat, max.location.lon], 13, { animate: true, duration: 0.75 })
        let minSpanEl = <HTMLSpanElement>document.querySelector('#station-extremum .bottom .detail')
        minSpanEl.onclick = () => zmap.setView([min.location.lat, min.location.lon], 13, { animate: true, duration: 0.75 })
      } else {
        e && document.body.removeChild(e)
      }
    }

    clearExtremumTip() {
      let e = document.querySelector('#station-extremum')
      e && document.body.removeChild(e)
    }

    dataChanged(isFirstTime?: boolean) {
      this.removeStations()
      let type = this.elementsSelected
      if (!type) return
      let doc: any = window['document'].documentElement
      let fontSize = doc.style.fontSize.slice(0, -2)
      let zoomLevel = zmap.getZoom()

      for (let el of this.stations) {
        if (!el.isSelected) continue
        if (zoomLevel > 9) {
          for (let id in realInfo[el.key]) {
            let item = realInfo[el.key][id]
            let cname = item.info.cname

            let cnameNumber = cname.match(/\d/g)
            let cnameWidth: number
            if (cnameNumber)
              cnameWidth = cnameNumber.length * 7 + (cname.length - cnameNumber.length) * 12
            else
              cnameWidth = 12 * cname.length

            let width = cnameWidth + (type === 'ps' ? 95 : 75) * (fontSize / 192)
            let height = 30 * (fontSize / 192)
            let val = isDataQualified(item.elements, type)
              ? Math.round(item.elements[type]*10)/10
              : null
            let color = StationConf.getColorLevel(this.elementsSelected, val)
            let icon = L.divIcon({
              className: isFirstTime ? 'leaflet-stations-first' : 'leaflet-stations',
              html: `
                <div class="info">
                  <span class="name">
                    ${cname}
                  </span><span class="val${type === 'ps'? ' long' : ''}" style="background: ${color}">
                    ${val === null ? '无' : val}
                  </span>
                </div>
                <i style="background: ${color}"></i>
              `,
              iconSize: [width, height],
              iconAnchor: [width/2, height*2]
            })
            
            let marker = L.marker([item.location.lat, item.location.lon], { icon })
            marker.on('mouseover', e => {
              let x = e.containerPoint.x,
                y = e.containerPoint.y
              item.pos = { x, y }
              item.time = item.datetime ? moment(item.datetime).format('MM-DD HH:mm') : '无'
              this.storestationLiveDetailInfo_global(item)
              this.storePopupStatus_global({ key: 'stationLiveDetail', action: true })
            })
            marker.on('mouseout', e => {
              this.storestationLiveDetailInfo_global(null)
              this.storePopupStatus_global({ key: 'stationLiveDetail', action: false })
            })
            marker.id = el.key
            zmap.addLayer(marker)
          }
        } else {
          for (let id in realInfo[el.key]) {
            let item = realInfo[el.key][id]
            let val = isDataQualified(item.elements, type)
              ? Math.round(item.elements[type]*10)/10
              : null
            let color = StationConf.getColorLevel(this.elementsSelected, val)
            let icon = L.divIcon({
              className: 'leaflet-stations-marker',
              html: `<i style="background: ${color}"></i>`,
              iconSize: [10, 10],
              iconAnchor: [5, 5]
            })

            let marker = L.marker([item.location.lat, item.location.lon], { icon })
            marker.on('mouseover', e => {
              let x = e.containerPoint.x,
                y = e.containerPoint.y
              let doc: any = window['document'].documentElement
              let f = doc.style.fontSize.slice(0, -2)
              let r = f / 192
              y += 55*r
              item.pos = { x, y }
              item.time = item.datetime ? moment(item.datetime).format('MM-DD HH:mm') : '无'
              this.storestationLiveDetailInfo_global(item)
              this.storePopupStatus_global({ key: 'stationLiveDetail', action: true })
            })
            marker.on('mouseout', e => {
              this.storestationLiveDetailInfo_global(null)
              this.storePopupStatus_global({ key: 'stationLiveDetail', action: false })
            })
            marker.on('click', e => {
              zmap.setView([item.location.lat, item.location.lon], 13, { animate: true, duration: 0.75 })
            })
            marker.id = el.key
            zmap.addLayer(marker)
          }
        }
      }
      
    }

    removeStations() {
      for (let el of this.stations) {
        if (el.isSelected)
          this.removeLayer(el.key)
      }
    }

    removeLayer(key) {
      zmap.eachLayer(e => {
        if (e.id === key)
          zmap.removeLayer(e)
      })
    }

    @Watch('date')
    async ondateChanged (val: Date, oldVal: Date) {
      if (this.hasInitData) {
        for (let el of this.stations) {
          await this.findStationData(el.key)
        }
        if (this.elementsSelected) {
          this.addExtremumTip()
          this.dataChanged()
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#StationLive {
  margin: 10px 0;
  padding: 10px;
  background: #f5f5f5;
  .header {
    padding-left: 10px;
    height: 30px;
    line-height: 30px;
  }
  ul.elems {
    li {
      float: left;
      margin-right: 5px;
      margin-bottom: 5px;
      line-height: 24px;
      width: 74px;
      color: #5a5e66;
      text-indent: 5px;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
        color: $themeColor;
      }
      &.on {
        color: $themeColor;
        background: #e8e8e8;
      }
    }
  }
  .decision-chk-group {
    width: 90%;
    margin-left: 5%;
  }
}
</style>

<style lang='scss'>
@import '../../../../styles/theme.scss';
#StationLive {
  .el-date-editor.el-input {
    float: right;
    width: 110px; /*no*/
    .el-input__inner {
      border: none;
      width: 110px; /*no*/
      padding: 0;
      color: $themeColor;
      background: #f5f5f5;
      cursor: pointer;
    }
  }
  .el-input--small .el-input__inner {
    height: 24px;
  }
  .el-input--small .el-input__icon {
    display: none;
  }
}

@keyframes s {
  0% {
    opacity: 0.6;
  }
  to {
    opacity: 1;
  }
}
.leaflet-stations-first {
  animation: s 1s;
}
.leaflet-stations, .leaflet-stations-first {
  .info {
    box-shadow: 0 0 5px #8d9db5;
    span {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      white-space: nowrap;
    }
    .name {
      padding: 0 5px;
      background: #fff;
    }
    .val {
      width: 65px;
      text-align: center;
      color: #fff;
      background: #000;
      &.long {
        width: 85px;
      }
    }
  }
  i {
    position: absolute;
    top: 55px;
    left: calc(50% - 5px);
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: #000;
    &::after {
      position: absolute;
      top: -25px;
      left: 4px;
      content: '';
      width: 2px;
      height: 25px;
      background: inherit;
    }
  }
}
.leaflet-stations-marker {
  i {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    border: 1px solid #999;
  }
}

#station-extremum {
  position: absolute;
  top: 80px;
  right: 20px; /*no*/
  transform: translateY(36px); /*no*/
  padding: 10px; /*no*/
  box-sizing: border-box;
  background: rgba(255, 255, 255, .8);
  box-shadow: 0 0 5px #ccc; /*no*/
  >ul {
    >li {
      height: 17px; /*no*/
      line-height: 17px; /*no*/
      &:not(:first-child) {
        margin-top: 5px; /*no*/
      }
      i {
        margin-right: 10px;
        float: left;
        display: inline-block;
        width: 13.5px; /*no*/
        height: 17px; /*no*/
        background-image: url(~Img/DecisionCommand/home_station_ex.png);
        background-repeat: no-repeat;
        background-size: 200% 100%;
      }
      &.top i { background-position: 0 0; }
      &.bottom i { background-position: 100% 0; }
      span.detail {
        cursor: pointer;
        &:hover {
          color: $themeColor;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>