<template>
  <main id="WainingSwanProduct">
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
  import { warningAnalysisClient } from '../../util/clientHelper'
  import moment from 'moment'
  import swamUrlConf from '../../config/swanUrlConf'
  import { WarningMessageHelper } from '../../util/WarningMessageHelper'
  let L,zmap

  @Component
  export default class WainingSwanProductVue extends Vue {
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

    warningMessaageLayerGroup: any = null
    cappiThreeKmLayer: any = null

    elements: any = {
      qpe1: { name: 'QPE1小时', url: swamUrlConf.qpe1, timeInterval: 'sixmin', colorParam: 'rain', time: '', layer: null, selected: false },
      cappi3: { name: 'CAPPI3公里', url: swamUrlConf.cappi3, timeInterval: 'sixmin', colorParam: 'cappi', time: '', layer: null, selected: false },
      titan: { name: 'TITAN', url: swamUrlConf.titan, timeInterval: 'sixmin', colorParam: '', time: '', layer: null, selected: false },
      alarm: { name: '预警信息', timeInterval: 'sixmin', colorParam: '', time: '', layer: null, selected: false },
    }
    bounds: any = []
    timeoutHolder: any = null

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      zmap.on('moveend', () => {
        if (this.timeoutHolder) {
          clearTimeout(this.timeoutHolder)
          this.timeoutHolder = null
        }
        this.timeoutHolder = setTimeout(() => {
          this.datetimeChanged()
          this.timeoutHolder = null
        }, 500)
      })
    }

    // 初始化时 默认选中所有元素
    @Watch('zmapViewer_global')
    onzmapViewer_globalChanged (val: any, oldVal: any) {
      this.toggleElement('cappi3')
    }

    beforeDestroy(){
      this.isComponentAlive = false
    }

    toggleElement(key: string) {
      this.elements[key].selected = !this.elements[key].selected
      if (this.elements[key].selected) {
        if (key === 'alarm') {
          this.clickWarningMessage(key)
        }else {
          let url = this.getImageUrl(key)
          this.addImageLayer(key, url)
          if (this.elements[key].colorParam)
            this.storeColorbar_global({ key: this.elements[key].colorParam, type: 'add' })
        }
      } else {
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


    // 预警信息
    async clickWarningMessage(key: string) {
      let opt = this.elements[key]
      let min = this.minute - this.minute % 6
//      let datetime = moment(this.date).add(this.hour, 'hours').add(min, 'minutes').format('YYYY-MM-DD HH:mm:00')
      let datetime = moment(new Date()).format('YYYY-MM-DD HH:mm:00')
      this.elements[key].time = datetime
      let resultData = await warningAnalysisClient.getWaningMessage('广东,,')
      console.log('###########', resultData)
      if (opt.selected===false) {
        this.storePopupStatus_global({ key: 'warningMsgTable', action: false })
        this.removeImageLayer(key)
        this.storeSwanMessageTip_global({ key: this.elements[key].name, type: 'remove' })
        return
      }
      if (resultData){
        if (resultData.DATA instanceof Array) {
          this.removeImageLayer(key)
//          let layerMarkGroup = L.layerGroup().addTo(zmap);
          let refArr = this.getAreaMessages(resultData.DATA);
          if (refArr.length === 0) {
            this.showNotifyMessage('请求成功,但该地区没有(台风/暴雨)预警信息' ,'info')
            this.storeSwanMessageTip_global({ key: this.elements[key].name, time: this.elements[key].time, hasData: true, type: 'add' })
            return
          }
          this.storeWarningMsgDatas_global(refArr)
          this.storePopupStatus_global({ key: 'warningMsgTable', action: true })
          let helper = new WarningMessageHelper(zmap)
          let layer = helper.addMarkToZmap(refArr, 'sw')
          opt.layer = layer
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

//info
    showNotifyMessage(message: string, typeStr: string){

      Vue['prototype']['$message']({
        type: 'warning',
        message: message
      })
    }

    getAreaMessages(data: any[]) {

      let refArr:any = []
//      let cityStr:string = this.userInfo_global.user.cityName
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

    // 时间改变
    datetimeChanged() {
      for (let key in this.elements) {
        if (this.elements[key].selected && key != 'alarm') {
          let url = this.getImageUrl(key)
          this.addImageLayer(key, url)
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
  #WainingSwanProduct{
    position: relative;
    padding-bottom: 5px;
    border-bottom: 1px solid #e6e6e6;
  }
</style>
