<template>
  <main id="StationReal">
    <ul class="checkbox cf">
      <li @click="toggleStation(opt)" v-for="opt of stations" :key="opt.type">
        <em :class="['checkbox', {'on': opt.selected}]"></em>
        <span>{{ opt.name }}</span>
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
  import { productClient } from '../../util/clientHelper'
  import { getVelLevel } from '../../util/windHelper'
  import moment from 'moment'
  import Vacuate from '../../util/vacuate'

  let L, zmap, vacuate: any = {}, vacuateMarkers: any = {}
  let realInfo: any = {}
  const clusterGroupOpt = {
    animate: false,
    disableClusteringAtZoom: 11,
    maxClusterRadius: 120,
    chunkedLoading: true
  }
  const maxLength = 100     // for L.MarkerClusterGroup

  @Component
  export default class StationReal extends Vue {
    @Getter('systemStore/userInfo_global') userInfo_global: any
    @Getter('systemStore/zmapViewer_global') zmapViewer_global
    @Action('systemStore/storeStationRealInfo_global') storeStationRealInfo_global: any
    @Action('systemStore/storeStationTableInfo_global') storeStationTableInfo_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    @Prop() date: Date
    @Prop() hour: number
    @Prop() minute: number

    isComponentAlive: boolean = true
    stations: any[] = [
      { type: 'a', name: '自动站', selected: false },
      { type: 'b', name: '区域站', selected: false }
    ]
    elements: any[] = [
      { key: 'temp', name: '气温', unit: '℃', selected: false },
      { key: 'ps', name: '气压', unit: 'hpa', selected: false },
      { key: 'rfhour', name: '降水', unit: 'mm', selected: false },
      { key: 'dp', name: '露点温度', unit: '℃', selected: false },
      { key: 'wd2df', name: '2分钟风', unit: 'm/s', selected: false },
      { key: 'wd10df', name: '10分钟风', unit: 'm/s', selected: false },
      { key: 'wd10maxdf', name: '最大风', unit: 'm/s', selected: false },
      { key: 'rh', name: '相对湿度', unit: '%', selected: false },
      { key: 'rfday',  name: '日雨量', unit: 'mm', selected: false },
      { key: 'tempdaymax',  name: '日最高温度', unit: '℃', selected: false },
      { key: 't24',  name: '24时变温', unit: '℃', selected: false },
      { key: 'tempdaymin',  name: '日最低温度', unit: '℃', selected: false },
    ]
    stationIcon: any = null
    listener: any = {}

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      realInfo = {}
      this.stationIcon = L.icon({
        className: 'ponit',
        iconUrl: 'static/img/station.png',
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      })

      zmap.on('zoomend', () => {
        // zmap.eachLayer(e => {
        //   if (/a_/.test(e.id) || /b_/.test(e.id)) {
        //     e.eachLayer(i => {
        //       let opacity = zmap.getZoom() < 9 ? 0 : 1
        //       i.setOpacity(opacity)
        //     })
        //   }
        // })
        this.storePopupStatus_global({ key: 'StationReal', action: false })
      })
    }

    // 初始化时 默认选中元素
    initialization() {
      // for (let el of this.elements)
      //   if (el.key === 'temp' || el.key === 'ps' || el.key === 'rfhour' || el.key === 'wd2df' || el.key === 'rh')
      //     el.selected = true
      this.elements.find(el => el.key === 'temp').selected = true
      for (let el of this.stations)
        this.toggleStation(el)
    }
    @Watch('zmapViewer_global')
    onzmapViewer_globalChanged (val: any, oldVal: any) {
      if (this.userInfo_global.user) this.initialization()
    }
    @Watch('userInfo_global')
    onuserInfo_globalChanged (val: any, oldVal: any) {
      if (this.zmapViewer_global.zoom) this.initialization()
    }

    beforeDestroy() {
      this.isComponentAlive = false
    }

    async toggleStation(opt: any) {
      opt.selected = !opt.selected
      if (opt.selected) {
        if (!realInfo[opt.type]) {
          let city = this.userInfo_global.user.cityid ? this.userInfo_global.user.cityName : ''
          let data = await productClient.findStationInfo(opt.type, city)
          if (!this.isComponentAlive || !opt.selected) return
          if (!data) {
            Vue['prototype']['$message']({
              type: 'warning',
              message: '站点数据获取失败'
            })
            return
          }
          let obj = {}
          for (let item of data) {
            if (this.userInfo_global.user.countyId) {     // 获取指定区县站点
              let reg = new RegExp(this.userInfo_global.user.countyName.slice(0, 2))
              if (reg.test(item.location.county))
                obj[item.station_id] = item
            } else {
              obj[item.station_id] = item
            }
          }

          // 揭东县站点添加 站点名称修改
          if (opt.type === 'b' && this.userInfo_global.user.countyId === 121) {
            obj['G2998'] = {
              station_id: 'G2998',
              types: 'B',
              info: { cname: '揭东区埔田镇万竹园' },
              location: {
                lon: 116.405,
                lat: 23.613,
                hgt: null,
                province: '广东',
                city: '揭阳',
                county: '揭东'
              }
            }
            obj['G2997'] = {
              station_id: 'G2997',
              types: 'B',
              info: { cname: '产业园区白塔镇望天湖' },
              location: {
                lon: 116.175,
                lat: 23.624,
                hgt: null,
                province: '广东',
                city: '揭阳',
                county: '揭东'
              }
            }
          }

          for (let i in obj) {
            if (i === 'G2920') obj[i].info.cname = '空港区地都镇政府'
            else if (i === 'G2923') obj[i].info.cname = '空港区玉滘镇政府'
            else if (i === 'G2991') obj[i].info.cname = '空港区砲台镇水利所'
            else if (i === 'G2990') obj[i].info.cname = '空港区登岗镇登岗村站'
            else if (i === 'G2994') obj[i].info.cname = '空港区东径农场'
            else if (i === 'G2901') obj[i].info.cname = '揭东区埔田镇马硕学校'
            else if (i === 'G2921') obj[i].info.cname = '揭东区玉湖镇政府'
            else if (i === 'G2924') obj[i].info.cname = '揭东区新亨镇计生所'
            else if (i === 'G2928') obj[i].info.cname = '揭东区锡场镇计生所'
            else if (i === 'G2929') obj[i].info.cname = '揭东区云路镇水利所'
            else if (i === 'G2993') obj[i].info.cname = '揭东区玉湖镇坪上村'
            else if (i === 'G2998') obj[i].info.cname = '揭东区埔田镇万竹园'
            else if (i === 'G2922') obj[i].info.cname = '产业园区霖磐镇霖磐中学'
            else if (i === 'G2913') obj[i].info.cname = '产业园区磐东镇浦东学校'
            else if (i === 'G2925') obj[i].info.cname = '产业园区月城镇水利所'
            else if (i === 'G2926') obj[i].info.cname = '产业园区龙尾镇政府'
            else if (i === 'G2927') obj[i].info.cname = '产业园区桂岭镇政府'
            else if (i === 'G2992') obj[i].info.cname = '产业园区白塔镇政府'
            else if (i === 'G2997') obj[i].info.cname = '产业园区白塔镇望天湖'
          }
          
          console.log(obj)
          realInfo[opt.type] = obj
        }
        this.addStation(opt.type, realInfo[opt.type])
        this.getProduct(opt.type)
      } else {
        this.removeLayer(opt.type)
      }
    }

    // 添加站点图标
    addStation(key, data) {
      // let group = Object.keys(data).length >= maxLength ? new L.MarkerClusterGroup(clusterGroupOpt) : new L.LayerGroup()
      let tmp: any[] = []
      for (let i in data) {
        let item = data[i]
        let marker = L.marker([item.location.lat,item.location.lon], { icon: this.stationIcon, zIndexOffset: 1 })
        marker.on('mouseover', e => {
          let x = e.containerPoint.x,
              y = e.containerPoint.y
          item.pos = { x, y }
          if (item.datetime)
            item.datetime = moment(item.datetime).format('YYYY-MM-DD HH:mm:ss')
          this.storeStationRealInfo_global(item)
          this.storePopupStatus_global({ key: 'StationReal', action: true })
        })
        marker.on('mouseout', e => {
          this.storeStationRealInfo_global(null)
          this.storePopupStatus_global({ key: 'StationReal', action: false })
        })
        marker.on('click', e => {
          if (item.datetime) {
            this.storeStationTableInfo_global(item)
            this.storePopupStatus_global({ key: 'StationTable', action: true })
          }
        })
        // group.addLayer(marker)
        tmp.push({marker, x: item.location.lat, y: item.location.lon})
      }
      // group.id = key
      // zmap.addLayer(group)
      this.renderData(tmp, 'distance2', key)
    }

    renderData(tmp, type: 'distance2' | 'manhattan', key) {
      vacuate[key] = new Vacuate(tmp, type)
      let cb = () => { this.render2(key) }
      this.listener[key] = cb
      zmap.on('moveend', cb)
      this.render2(key)
    }

    render2(key) {
      vacuateMarkers[key] && vacuateMarkers[key].eachLayer(e => {
        zmap.removeLayer(e)
      })
      if (zmap.getZoom() <= 5) return
      let markers = vacuate[key].render(zmap, L)
      vacuateMarkers[key] = markers
      zmap.addLayer(markers)
    }

    // 获取实况数据
    async getProduct(key) {       // key为站点类型
      for (let i in realInfo[key]) {
        realInfo[key][i].datetime = null
        realInfo[key][i].elements = null
      }
      let datetime = moment(this.date).add(this.hour, 'hours').add(this.minute, 'minutes').format('YYYY-MM-DD HH:mm:00')
      let city = this.userInfo_global.user.cityid ? this.userInfo_global.user.cityName : ''
      let data = await productClient.findStationData(key, datetime, city)
      if (!data || !data.length) {
        for (let el of this.elements) {
          if (el.selected)
            this.removeLayer(key + '_' + el.key)
        }
        return
      }
      for (let opt of data) {
        let id = opt.station_id
        if (realInfo[key][id]) {
          realInfo[key][id].datetime = opt.datetime
          realInfo[key][id].elements = opt.elements
          if (opt.elements.tempdaymax && opt.elements.tempdaymin)
            realInfo[key][id].elements.t24 = Math.floor((opt.elements.tempdaymax - opt.elements.tempdaymin)*100) / 100
          else
            realInfo[key][id].elements.t24 = 9999
        }
      }
      console.log(realInfo)

      // 添加已选中实况元素数据
      for (let el of this.elements) {
        if (el.selected) {
          if (/wd/.test(el.key))
            this.addWind(key, el, realInfo[key])
          else
            this.addReal(key, el, realInfo[key])
        }
      }
    }

    // 添加站点实况数据
    addReal(type, el, data) {      // type: 站点类型， el: 实况元素
      this.removeLayer(type + '_' + el.key)
      if (!data) return
      // let group = Object.keys(data).length >= maxLength ? new L.MarkerClusterGroup(clusterGroupOpt) : new L.LayerGroup()
      let tmp: any[] = []
      for (let i in data) {
        let opt = data[i]
        if (!opt.elements || opt.elements[el.key] === undefined) continue
        let val = opt.elements[el.key]
        if (val === -999.9 || val === -9999.9 || val === 9999 || val === -9999 || (el.key === 'dp' && val === 99) || (el.key === 'ps' && val === 333.29))
          continue
        val = Math.floor(val*100)/100 + ' ' + el.unit
        const opts = L.divIcon({
          className: `station-el-wraper`,
          html: `<span class="station-el station-${el.key}">${val}</span>`
        })
        let marker = L.marker([opt.location.lat, opt.location.lon], { icon: opts, zIndexOffset: -1 })
        // group.addLayer(marker)
        tmp.push({marker, x: opt.location.lat, y: opt.location.lon})
      }
      // group.id = type + '_' + el.key         // 站点类型_元素类型
      // zmap.addLayer(group)
      this.renderData(tmp, 'manhattan', type + '_' + el.key)
    }

    // 添加站点风力风向数据
    addWind(type, el, data) {
      this.removeLayer(type + '_' + el.key)
      // let group = Object.keys(data).length >= maxLength ? new L.MarkerClusterGroup(clusterGroupOpt) : new L.LayerGroup(),
      //     iconGroup = Object.keys(data).length >= maxLength ? new L.MarkerClusterGroup(clusterGroupOpt) : new L.LayerGroup()
      let tmp: any[] = []
      for (let i in data) {
        let opt = data[i]
        if (!opt.elements) continue
        let angleMarker = L.angleMarker([opt.location.lat, opt.location.lon], {
          icon: new L.Icon({
            iconUrl: `static/img/stationWind/wind${getVelLevel(opt.elements[el.key])}.png`,
            iconSize: [16,30],
            iconAnchor: [0, 30]
          }),
          iconAngle: opt.elements[el.key.replace('df', 'dd')],
          iconOrigin: '0% 100%',
          zIndexOffset: -1
        })

        let opts = L.divIcon({
          className: `station-el-wraper`,
          html: `<span class='station-el station-${el.key}'>${Math.floor(opt.elements[el.key] * 100) / 100} ${el.unit}</span>`
        })
        let marker = L.marker([opt.location.lat, opt.location.lon], { icon: opts, zIndexOffset: -1  })           // 风速
        // iconGroup.addLayer(angleMarker)
        // group.addLayer(marker)
        tmp.push({marker: angleMarker, x: opt.location.lat, y: opt.location.lon})
      }
      // iconGroup.id = type + '_' + el.key
      // zmap.addLayer(iconGroup)
      // group.id = type + '_' + el.key
      // // zmap.addLayer(group)
      this.renderData(tmp, 'distance2', type + '_' + el.key)
    }

    // 切换实况数据
    toggleElement(el: any) {
      el.selected = !el.selected
      if (el.selected) {
        for (let item of this.elements) {
          if (item.key === el.key) continue
          if (item.selected) {
            item.selected = false
            this.removeLayer(item.key)
          }
        }

        for (let opt of this.stations) {
          if (!opt.selected) continue
          if (/wd/.test(el.key))
            this.addWind(opt.type, el, realInfo[opt.type])
          else
            this.addReal(opt.type, el, realInfo[opt.type])
        }
      } else {
        this.removeLayer(el.key)
      }
    }

    // 删除图层数据
    removeLayer(key) {
      let reg = new RegExp(key)
      // zmap.eachLayer(e => {
      //   if(reg.test(e.id)) zmap.removeLayer(e)
      // })
      for (let i in vacuateMarkers) {
        if(!reg.test(i)) continue
        vacuateMarkers[i].eachLayer(e => {
          zmap.removeLayer(e)
        })
        delete vacuateMarkers[i]

        delete vacuate[i]

        zmap.off('moveend', this.listener[i])
        this.$delete(this.listener, i)
      }
    }

    // 时间改变
    datetimeChanged() {
      for (let opt of this.stations) {
        if (opt.selected) {
          this.getProduct(opt.type)
        }
      }
    }

    @Watch('date')
    onDateChanged (val: any, oldVal: any) {
      this.datetimeChanged()
    }
    @Watch('hour')
    onHourChanged (val: any, oldVal: any) {
      this.datetimeChanged()
    }
    @Watch('minute')
    onMinuteChanged (val: any, oldVal: any) {
      this.datetimeChanged()
    }
  }
</script>

<style lang='scss' scoped>
#StationReal{
  position: relative;
  border-bottom: 1px solid #e6e6e6;
  ul.elements li em {
    &.temp { background: rgb(252, 48, 47); }
    &.ps { background: rgb(48, 48, 47); }
    &.rfhour { background: rgb(1, 128, 1); }
    &.dp { background: rgb(128, 48, 0); }
    &.wd2df { background: rgb(0, 222, 0); }
    &.wd10df { background: rgb(170, 58, 175); }
    &.wd10maxdf { background: rgb(170, 58, 175); }
    &.rh { background: rgb(153, 51, 204); }
    &.rfday { background: rgb(1, 181, 1); }
    &.tempdaymax { background: rgb(255, 0, 0); }
    &.t24 { background: rgb(0, 0, 0); }
    &.tempdaymin { background: rgb(33, 33, 251); }
  }
}
</style>
