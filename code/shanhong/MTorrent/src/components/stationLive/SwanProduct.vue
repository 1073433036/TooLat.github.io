<template>
  <main id="SwanProduct">
    <ul class="elements cf">
      <li @click="toggleElement(key)" v-for="(opt, key) in elements" :key="key">
        <div :class="['el', {'on': opt.selected}]">{{ opt.name }}</div>
      </li>
    </ul>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  import swamUrlConf from '../../config/swanUrlConf'
  import { warningAnalysisClient, swanClient } from '../../util/clientHelper'
  import { getVelLevel } from '../../util/windHelper'
  import {getMarskUrl} from '../../util/warningAnalysisTool'
  import jsonp from 'jsonp'
  import { WarningMessageHelper } from '../../util/WarningMessageHelper'

  let L,zmap
  let lightingMarker: any[] = []
  let cotrecMarker: any[] = []

  @Component
  export default class SwanProduct extends Vue {
    @Prop() date: Date
    @Prop() hour: number
    @Prop() minute: number
    @Getter('systemStore/zmapViewer_global') zmapViewer_global
    @Action('systemStore/storeColorbar_global') storeColorbar_global
    @Action('systemStore/storeSwanMessageTip_global') storeSwanMessageTip_global
    @Getter('systemStore/userInfo_global') userInfo_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    @Action('systemStore/storeWarningMsgDatas_global') storeWarningMsgDatas_global: any

    isComponentAlive: boolean = true
    elements: any = {
      qpe1: { name: 'QPE1小时', url: swamUrlConf.qpe1, timeInterval: 'sixmin', colorParam: 'rain', time: '', layer: null, selected: false },
      mtop: { name: '回波顶高', url: swamUrlConf.mtop, timeInterval: 'sixmin', colorParam: 'mtop', time: '', layer: null, selected: false },
      mcr: { name: '组合反射率', url: swamUrlConf.mcr, timeInterval: 'sixmin', colorParam: 'mcr', time: '', layer: null, selected: false },
      mvil: { name: 'VIL', url: swamUrlConf.mvil, timeInterval: 'sixmin', colorParam: 'mvil', time: '', layer: null, selected: false },
      cappi1: { name: 'CAPPI1公里', url: swamUrlConf.cappi1, timeInterval: 'sixmin', colorParam: 'cappi', time: '', layer: null, selected: false },
      cappi3: { name: 'CAPPI3公里', url: swamUrlConf.cappi3, timeInterval: 'sixmin', colorParam: 'cappi', time: '', layer: null, selected: false },
      cappi5: { name: 'CAPPI5公里', url: swamUrlConf.cappi5, timeInterval: 'sixmin', colorParam: 'cappi', time: '', layer: null, selected: false },
      stmtra: { name: '雷暴跟踪', url: swamUrlConf.stmtra, timeInterval: 'sixmin', colorParam: '', time: '', layer: null, selected: false },
      titan: { name: 'TITAN', url: swamUrlConf.titan, timeInterval: 'sixmin', colorParam: '', time: '', layer: null, selected: false },
      cotrec: { name: 'COTREC', timeInterval: 'sixmin', colorParam: '', time: '', layer: null, selected: false },
      thunder: { name: '闪电', timeInterval: 'sixmin', colorParam: '', time: '', layer: null, selected: false },
      alarm: { name: '预警信息', timeInterval: 'sixmin', colorParam: '', time: '', layer: null, selected: false },
    }
    bounds: any = []
    timeoutHolder: any = null

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      lightingMarker = []
      cotrecMarker = []
      zmap.on('moveend', () => {
        if (this.timeoutHolder) {
          clearTimeout(this.timeoutHolder)
          this.timeoutHolder = null
        }
        this.timeoutHolder = setTimeout(() => {
          this.changeLayer()
          this.timeoutHolder = null
        }, 500)
      })
    }

    @Watch('zmapViewer_global')
    onzmapViewer_globalChanged (val: any, oldVal: any) {
      this.toggleElement('cappi3')      // 初始化地图之后默认勾选
    }

    beforeDestroy() {
      zmap.off('moveend', this.changeLayer)
      this.isComponentAlive = false
    }

    toggleElement(key: string) {
      this.elements[key].selected = !this.elements[key].selected
      if (this.elements[key].selected) {
        if (key === 'alarm') {
          this.clickWarningMessage(key)
        } else if (key === 'thunder') {
          this.getLightning()
        } else if (key === 'cotrec') {
          this.getCotrec()
        } else {
          let url = this.getImageUrl(key)
          console.log(url)
          this.addImageLayer(key, url)
          if (this.elements[key].colorParam)
            this.storeColorbar_global({ key: this.elements[key].colorParam, type: 'add' })
        }
      } else {
        if (key === 'thunder') {
          this.storeSwanMessageTip_global({ key: '闪电', type: 'remove' })
          this.removeLightning()
          return
        } else if (key === 'cotrec') {
          this.storeSwanMessageTip_global({ key: 'COTREC', type: 'remove' })
          this.removeCotrec()
          return
        }
        this.storePopupStatus_global({ key: 'warningMsgTable', action: false })
        this.removeImageLayer(key)
        if (this.elements[key].colorParam)
          this.storeColorbar_global({ key: this.elements[key].colorParam, type: 'remove' })
        this.storeSwanMessageTip_global({ key: this.elements[key].name, type: 'remove' })
      }
    }

    getImageUrl(key: string) {
      let bounds = zmap.getBounds(),
        left = bounds._southWest.lng,
        right = bounds._northEast.lng,
        top = bounds._northEast.lat,
        bottom = bounds._southWest.lat
      this.bounds = [[top,left], [bottom,right]]
      let datetime
      switch (this.elements[key].timeInterval) {
        case 'onehour':
          datetime = moment(this.date).add(this.hour, 'hours').format('YYYY-MM-DD HH:mm:00')
          break;
        default:
          let min = this.minute - this.minute % 6
          datetime = moment(this.date).add(this.hour, 'hours').add(min, 'minutes').format('YYYY-MM-DD HH:mm:00')
          break;
      }
      this.elements[key].time = datetime
      let width = window.innerWidth || document.body.clientWidth,
          height = window.innerHeight || document.body.clientHeight
      let url = this.elements[key].url.replace('{datetime}', datetime).replace('{left}',left).replace('{right}',right).replace('{top}',top).replace('{bottom}',bottom).replace('{width}',width).replace('{height}',height)
      return url
    }

    addImageLayer(key: string, url: string) {
      let image = new Image()
      image.onload = () => {
        if (this.elements[key].selected && this.isComponentAlive) {
          if (!this.elements[key].layer) {
            this.elements[key].layer = L.imageOverlay(url, this.bounds)
            this.elements[key].layer.addTo(zmap)
          } else {
            this.elements[key].layer.setUrl(url)
            let bounds = L.latLngBounds(L.latLng(this.bounds[0][0], this.bounds[0][1]), L.latLng(this.bounds[1][0], this.bounds[1][1]))
            this.elements[key].layer.setBounds(bounds)
          }
          this.storeSwanMessageTip_global({ key: this.elements[key].name, time: this.elements[key].time, hasData: true, type: 'add' })
        } else {
          this.removeImageLayer(key)
          this.storeSwanMessageTip_global({ key: this.elements[key].name, type: 'remove' })
        }
      }
      image.onerror = () => {
        this.removeImageLayer(key)
        if (this.elements[key].selected && this.isComponentAlive)
          this.storeSwanMessageTip_global({ key: this.elements[key].name, time: this.elements[key].time, hasData: false, type: 'add' })
        else
          this.storeSwanMessageTip_global({ key: this.elements[key].name, type: 'remove' })
      }
      image.src = url
    }

    removeImageLayer(key: string) {
      if (!this.elements[key].layer) return
      zmap.removeLayer(this.elements[key].layer)
      this.elements[key].layer = null
    }

    // 闪电  getUparLPDDLJTimeRange
    async getLightning() {
      this.removeLightning()
      let min = this.minute - this.minute % 6
      let eTime = moment(this.date).add(this.hour, 'hours').add(min, 'minutes'),
          // sTime = moment(eTime).subtract(6, 'minutes')
          sTime = moment(eTime).subtract(1, 'hours')
      let time = moment(eTime).format('YYYY-MM-DD HH:mm:00')
      let startTime = moment(sTime).format('YYYYMMDDHHmm00'),
          endTime = moment(eTime).format('YYYYMMDDHHmm00')
      // startTime = '20171015090000'
      // endTime = '20171015100000'
      let url = `/di/http.action?userId=idc&pwd=U3cuYV&interfaceId=getUparLPDDLJTimeRange&dataFormat=jsonp&s_ymdhms=${startTime}&e_ymdhms=${endTime}&_=${Date.now()}`
      
      let host = window.location.host
      let flag = host === '113.108.192.98:8080' || host === '10.12.12.84:8080'
      url = (flag ? ('http://' + host) : 'http://172.22.1.175') + url
      
      let res: any
      jsonp(url, { name: 'jsoncallback' }, (err, res) => {
        if (err) {
          this.storeSwanMessageTip_global({ key: '闪电', time, hasData: false, type: 'add' })
          return
        }
        let data = res.DATA
        this.storeSwanMessageTip_global({ key: '闪电', time, hasData: true, type: 'add' })
        if (!data.length) return
        for (let el of data) {
          let lon = el.V06001,
              lat = el.V05001
          let iconUrl = el.V73016 >= 0 ? 'static/img/lightingZ.png ' : 'static/img/lightingF.png'
          let marker = L.marker([lat, lon], { icon: L.icon({ iconUrl, iconSize: [14, 14], iconAnchor: [7, 7] }) })
          let popup = L.popup({ closeButton: false })
          marker.on('mouseover', e => {
            let lonPos = lon >= 0 ? '东经' : '西经'
            let latPos = lat >= 0 ? '北纬' : '南纬'
            popup.setLatLng([lat, lon])
              .setContent(`
                <div class="thunder-popup cf">
                  <div class="name">位置</div>
                  <div class="val">${lonPos + ' ' + Number(lon).toFixed(1) + ', ' + latPos + ' ' + Number(lat).toFixed(1)}</div>
                </div>
                <div class="thunder-popup cf">
                  <div class="name">时间</div>
                  <div class="val">${el.DDATETIME.slice(0, el.DDATETIME.length - 2)}</div>
                </div>
                <div class="thunder-popup cf">
                  <div class="name">电流</div>
                  <div class="val">${el.V73016}</div>
                </div>
              `)
              .openOn(zmap)
          })
          marker.on('mouseout', e => {
            popup.removeFrom(zmap)
          })
          lightingMarker.push(marker)
          marker.addTo(zmap)
        }
      })
    }
    removeLightning() {
      if (!lightingMarker.length) return
      for (let el of lightingMarker)
        zmap.removeLayer(el)
      lightingMarker = []
    }

    // COTREC
    async getCotrec() {
      this.removeCotrec()
      let min = this.minute - this.minute % 6
      let datetime = moment(this.date).add(this.hour, 'hours').add(min, 'minutes').format('YYYY-MM-DD HH:mm:00')
      // datetime = '2017-10-15 20:00:00'      // !!!
      let u = await swanClient.findTemporaryData(datetime, 'swan', 3, 'cotrec_u', 0)
      let v = await swanClient.findTemporaryData(datetime, 'swan', 3, 'cotrec_v', 0)
      if (!u) {
        this.storeSwanMessageTip_global({ key: 'COTREC', time: datetime, hasData: false, type: 'add' })
        return
      }
      let uData = u[0].data, vData = v[0].data
      let top = u[0].gridScale.top,
          left = u[0].gridScale.left,
          ystep = u[0].gridScale.ystep,
          xstep = u[0].gridScale.xstep
      uData.map((opt, i) => {
        opt.map((item, index) => {
          let cotrec_u = item
          let cotrec_v = vData[i][index]
          let lat = top - ystep * i
          let lon = left + xstep * index
          let vel = Math.sqrt(cotrec_u * cotrec_u + cotrec_v * cotrec_v)
          let dir = 180 + Math.atan2(cotrec_u, cotrec_v) * 180 / Math.PI

          let angleMarker = L.angleMarker([lat, lon], {
            icon: new L.Icon({
              iconUrl: `static/img/wind/${getVelLevel(vel)}.png`,
              iconSize: [18,32],
              iconAnchor: [0, 32]
            }),
            iconAngle: dir,
            iconOrigin: '0% 100%',
            zIndexOffset: -1
          })
          cotrecMarker.push(angleMarker)
          zmap.addLayer(angleMarker)
        })
      })
      this.storeSwanMessageTip_global({ key: 'COTREC', time: datetime, hasData: true, type: 'add' })
    }
    removeCotrec() {
      if (!cotrecMarker.length) return
      for (let marker of cotrecMarker) {
        zmap.removeLayer(marker)
      }
      cotrecMarker = []
    }

    // 预警信息
    async clickWarningMessage(key: string) {
      let opt = this.elements[key]
      let min = this.minute - this.minute % 6
      let datetime = moment(new Date()).format('YYYY-MM-DD HH:mm:00')
      this.elements[key].time = datetime
      let resultData = await warningAnalysisClient.getWaningMessage('广东,,')
      if (opt.selected===false) {
        this.storePopupStatus_global({ key: 'warningMsgTable', action: false })
        this.removeImageLayer(key)
        this.storeSwanMessageTip_global({ key: this.elements[key].name, type: 'remove' })
        return
      }
      if (resultData){
        if (resultData.DATA instanceof Array) {
          this.removeImageLayer(key)
          let layerMarkGroup = L.layerGroup().addTo(zmap);
          let refArr = this.getAreaMessages(resultData.DATA);
          if (refArr.length === 0) {
            // this.showNotifyMessage('请求成功,但该地区没有(台风/暴雨)预警信息' ,'info')
            this.storeSwanMessageTip_global({ key: this.elements[key].name, time: this.elements[key].time, hasData: true, type: 'add' })
            return
          }
          this.storeWarningMsgDatas_global(refArr)
          this.storePopupStatus_global({ key: 'warningMsgTable', action: true })

          let helper = new WarningMessageHelper(zmap)
          let layer = helper.addMarkToZmap(refArr, 'sw')
          layerMarkGroup = layer
          opt.layer = layerMarkGroup
          this.storeSwanMessageTip_global({ key: this.elements[key].name, time: this.elements[key].time, hasData: true, type: 'add' })
        }else {
          this.storeSwanMessageTip_global({ key: this.elements[key].name, time: this.elements[key].time, hasData: false, type: 'add' })
          return
        }
      }else {
        this.removeImageLayer(key)
        if (this.elements[key].selected && this.isComponentAlive)
          this.storeSwanMessageTip_global({ key: this.elements[key].name, time: this.elements[key].time, hasData: false, type: 'add' })
        else
          this.storeSwanMessageTip_global({ key: this.elements[key].name, type: 'remove' })
      }

    }
    showNotifyMessage(message: string, typeStr: string){
      Vue['prototype']['$message']({
        type: 'warning',
        message: message
      })
    }
    getAreaMessages(data: any[]) {
      let refArr: any = []
      let cityStr: string = ''
      //判断用户属于: 省 , 市, 区
      if (Number(sessionStorage.countyId) === 0){ //市 或者区
        if (Number(sessionStorage.cityid) === 0) {
          cityStr = sessionStorage.cityName  //省
        }else {
          cityStr = sessionStorage.cityName  //市
        }
      }else {
        cityStr = sessionStorage.countyName;  //区
      }
      for (let index in data) {
        let ele = data[index]
        if (cityStr === '广东' || ele.V_CITY === cityStr) {

          if (Number(ele.V_TFLEV) > 0) {
            ele.DDATETIME = ele.DDATETIME.split('.')[0]
            this.$set(ele, 'riskType', '台风')
            this.$set(ele, 'riskLevel', ele.V_TFLEV + '级')
            refArr.push(ele)
          }
          if (Number(ele.V_BYLEV) > 0) {
            ele.DDATETIME = ele.DDATETIME.split('.')[0]
            this.$set(ele, 'riskType', '暴雨')
            this.$set(ele, 'riskLevel', ele.V_BYLEV + '级')
            refArr.push(ele)
          }
        }
      }
      return refArr
    }

    @Watch('date')
    ondateChanged (val: Date, oldVal: Date) {
      this.changeLayer()
      this.timeChanged()
    }

    @Watch('hour')
    onhourChanged (val: number, oldVal: number) {
      this.changeLayer()
      this.timeChanged()
    }

    @Watch('minute')
    onminuteChanged (val: number, oldVal: number) {
      this.changeLayer()
      this.timeChanged()
    }

    timeChanged() {
      if (this.elements.thunder.selected) this.getLightning()
      if (this.elements.cotrec.selected) this.getCotrec()
    }

    changeLayer() {
      for (let key in this.elements) {
        if (key === 'thunder' || key === 'cotrec' || key === 'alarm') continue
        if (this.elements[key].selected) {
          let url = this.getImageUrl(key)
          this.addImageLayer(key, url)
        }
      }
    }

  }
</script>

<style lang='scss' scoped>
#SwanProduct {
  ul.elements {
    margin: 8px 0 12px;
    li .el {
      left: 20px;
      width: 110px;
    }
  }
}
</style>
