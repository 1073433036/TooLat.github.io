<template>

  <main id="riskWarn" class="global-panel" v-drag>

    <header>
      <el-date-picker
        v-model="date"
        type="date"
        size="small"
        :editable="false"
        :clearable="false"
        @change='selectDay'>

      </el-date-picker>

      <div class="hour-min hour" @mouseenter="toggleSelectList('hour')" @mouseleave="isHourListOn = false">
        <span>{{ hour >= 10 ? hour : '0' + hour }}</span>
        <ul class="list scroll-bar" v-show="isHourListOn" ref="hourList">
          <li @click="selectHour(0)" :class="{'on': hour === 0}">00</li>
          <li v-for="i in 23" :key="i" @click="selectHour(i)" :class="{'on': hour === i}">
            {{ i >= 10 ? i : '0' + i }}
          </li>
        </ul>
      </div>

      <div class="hour-min minute" @mouseenter="toggleSelectList('minute')" @mouseleave="isMinuteListOn = false">
        <span>{{ minute >= 10 ? minute : '0' + minute }}</span>
        <ul class="list scroll-bar" v-show="isMinuteListOn" ref="minuteList">
          <li @click="selectMinute(0)" :class="{'on': minute === 0}">00</li>
          <li v-for="i in 9" :key="i" @click="selectMinute(i*6)" :class="{'on': minute === i*6}">
            {{ 6*i >= 10 ? 6*i : '0' + 6*i }}
          </li>
        </ul>
      </div>
      <i :class="['update-btn', {on: isAutoUpdate}]" :title="isAutoUpdate ? '自动更新中' : '点击自动更新数据'"
         @click="isAutoUpdate = !isAutoUpdate"></i>
    </header>

    <div class="content">

      <ul class="list ns">
        <li :class="{'on': tabOpt.rainfall}">
          <div class="title" @click="toggleTab('rainfall')"> 定量降水预报(QPF)  </div>
          <rainfall-hour-select v-show="tabOpt.rainfall" :hourClick="rainfallHourClick"/>

        </li>
        <li :class="{'on': tabOpt.geology}">
          <div class="title" @click="toggleTab('geology')">地质灾害产品
          </div>
          <products-vue :date="date" :hour="hour" url="geo" v-show="tabOpt.geology" />

        </li>
        <li :class="{'on': tabOpt.mTorrent}">
          <div class="title" @click="toggleTab('mTorrent')">
            山洪风险产品
            </div>
          <products-vue :date="date" :hour="hour" url="flood" v-show="tabOpt.mTorrent" />

        </li>
        <li :class="{'on': tabOpt.basin}">
          <div class="title" @click="toggleTab('basin')">流域风险产品</div>
          <products-vue :date="date" :hour="hour" url="river" v-show="tabOpt.basin" />

        </li>
        <li :class="{'on': tabOpt.riskPoints}">
          <div class="title" @click="toggleTab('riskPoints')">隐患点</div>
          <risk-point-vue :isOn="tabOpt.riskPoints" v-show="tabOpt.riskPoints" />
        </li>
      </ul>

      <div class="rainData-div" :class="{show: isShowRainData}" :style="[{top: rainDataDivScrTop + 'px'}, {left: rainDataDivScrLeft + 'px'}]">
        <p>{{rfRainData}}</p>
      </div>

    </div>

  </main>



</template>



<script lang='ts'>

  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import rainfallHourSelect from './RiskHourSelected.vue'
//  import productsVue from  './geoDisterProduct.vue'
  import productsVue from  './GeoDisterSelectedVue.vue'
  import riskPointVue from  './riskPoints.vue'
  import {getSelectedHour, getUrlStrWithParas, getFormatTimeStr, imgUrlIsEffective} from '../../util/riskWarningTool'
  import { riskWarningClient } from '../../util/clientHelper'
  import * as urlConfig from '../../util/urlTool'
  import * as rainLayerColor from '../../util/rainLayerColor'
  import moment from 'moment'
  let L:any,
    zmap:any,
    WeatherScence

  @Component({
    components: {
      rainfallHourSelect,
      productsVue,
      riskPointVue,
    }
  })
  export default class RiskWarn extends Vue {
    @Action('systemStore/storeResetVuex_global') storeResetVuex_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    @Action('systemStore/storeRainColorDatas_global') storeRainColorDatas_global: any
    @Action('systemStore/storeSwanMessageTip_global') storeSwanMessageTip_global

    isAutoUpdate: boolean = true
    intervalHolder: any = null
    intervalProduct: any = null

    date:Date = new Date
    hour:number = 0
    minute:number = 0
    isHourListOn: boolean = false
    isMinuteListOn: boolean = false
    tabOpt:any = {
      rainfall: true,
      geology: true,
      mTorrent: false,
      basin: false,
      riskPoints: false
    }

    gridinfo: any = null
    rainData: any
    rainState: any = null

    rainDataDivScrTop: number = 0
    rainDataDivScrLeft: number = 0
    isShowRainData: boolean = false //是否展示雨量值 view
    rfRainData: string = '雨量: 0mm'  //返回 雨量值
    oldKey: string = ''

    riskwarningLayers: any = {
      QPF: {selectedKey: '', selectedLayer: null}
    }

    mounted() {
      this.storeResetVuex_global()
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      WeatherScence = global['WeatherScence']
      this.initTime();
      this.intervalProduct = setInterval(this.initTime, 6*60*1000)
      this.intervalHolder = setInterval(this.dateTimeChangeToGetData, 6*60*1000)

//      this.hour = new Date().getHours()
//      let time = new Date().getTime()
//      this.minute = new Date(time - time % (6*60*1000)).getMinutes()
      this.storeRainColorDatas_global({title: 'QPF', colorsObj: rainLayerColor.colorTabel});
      let thisSelf = this;
      zmap.on('mouseout', function (e) {
        thisSelf.isShowRainData = false;
      })
    }
    destroyed () {
      if (!this.intervalHolder) return
      clearInterval(this.intervalHolder)
      this.intervalHolder = null
      clearInterval(this.intervalProduct)
      this.intervalProduct = null
    }

    initTime() {
      let time = Date.now() - 15*60*1000
      this.date = new Date(moment(time).format('YYYY/MM/DD 00:00:00'))
      this.hour = new Date(time).getHours()
      this.minute = new Date(time - time % (6*60*1000)).getMinutes()
    }

//  地图监听事件
    linstenMapMove(pos) {
      if (this.gridinfo === null) {
        return
      }
      this.rainDataDivScrTop = pos.containerPoint.y - 10;
      this.rainDataDivScrLeft = pos.containerPoint.x + 20;
      let log = pos.latlng.lng
      let lat = pos.latlng.lat
      let rf = WeatherScence.interpModel(this.rainData, this.gridinfo, log, lat);
      this.isShowRainData = true
      if (rf < 0) {
        this.isShowRainData = false
      }
      rf = Math.floor(rf * 10) / 10
      this.rfRainData = '雨量： ' + rf + ' mm'
    }

    toggleTab(key) {
      this.tabOpt[key] = !this.tabOpt[key]
    }

    selectDay(dateTime){
      this.dateTimeChangeToGetData()
    }

    // 时 分
    toggleSelectList(key) {
      if (key === 'hour') {
        this.isHourListOn = true
        this.$nextTick(() => {
          let hourEle = <HTMLDivElement>this.$refs.hourList
          hourEle.scrollTop = 24 * this.hour - 24 * 4
        })
      } else if (key === 'minute') {
        this.isMinuteListOn = true
        this.$nextTick(() => {
          let minuteEle = <HTMLDivElement>this.$refs.minuteList
          minuteEle.scrollTop = 24 * this.minute / 6 - 24 * 4
        })
      }
    }
    selectHour(h) {
      if (h === this.hour) {
        return
      }
      this.hour = h
      this.isHourListOn = false
      this.dateTimeChangeToGetData()
    }
    selectMinute(m) {
      if (m === this.minute) {
        return
      }
      this.minute = m
      this.isMinuteListOn = false
      this.dateTimeChangeToGetData()
    }


//  点击选择对应的小时
    async rainfallHourClick(key, val, totalState){

      if (val) {
        this.storePopupStatus_global({ key: 'rainColorsBar', action: true })
      }else {
        this.storePopupStatus_global({ key: 'rainColorsBar', action: false })
      }

      //移除监听
      zmap.off('mousemove', this.linstenMapMove);
      this.isShowRainData = false
      this.rainState = totalState;
      this.radioClearOldLayer("QPF")
      let h: number = getSelectedHour(key);
      if (val) {
        let timeStr: string = getFormatTimeStr(moment(this.date).format('YYYY-MM-DD'), this.hour, this.minute);
        this.riskwarningLayers["QPF"].selectedKey = key
        let refData = await riskWarningClient.getQPFMessageData(timeStr, h)
        console.log(refData)
        if (this.rainState[key] === false) {
          return
        }
        if (refData) {
          this.showSelectedMsgTip(h, true)
          // if (h < 4) {
          //   refData.gridinfo.xgap = 0.01
          //   refData.gridinfo.ygap = 0.01
          // }else {
          //   refData.gridinfo.xgap = 0.05
          //   refData.gridinfo.ygap = 0.05
          // }
          refData.gridinfo.xgap = 0.05
          refData.gridinfo.ygap = 0.05

          this.rainData = refData.rain;
          this.gridinfo = refData.gridinfo;
          zmap.on('mousemove', this.linstenMapMove)
          let shadeLayer  = L.shadeLayer(refData.rain, refData.gridinfo, rainLayerColor.colorTabel, L.Util.Bounds.SimpleGuangDong, {debug:false})
          shadeLayer .addTo(zmap);
          this.riskwarningLayers["QPF"].selectedLayer = shadeLayer
        }else {
          this.showSelectedMsgTip(h, false)
          this.radioClearOldLayer("QPF");
          this.gridinfo = null;
        }

      } else  {
        this.riskwarningLayers["QPF"].selectedKey = ''
        this.gridinfo = null;
        this.removeMsgTip(h);
      }
    }

    showSelectedMsgTip(index: number, hasData: boolean) {
      //先移除上个
      this.storeSwanMessageTip_global({ key: this.oldKey, type: 'remove' })
      let dateTime: string = moment(this.date).format('YYYY-MM-DD') + ` ${this.hour > 9 ? this.hour : '0' + this.hour}:00`
      this.storeSwanMessageTip_global({ key: 'QPF' + index+'时', time: dateTime, hasData: hasData, type: 'add' });
      this.oldKey = 'QPF' + index+'时';
    }
    removeMsgTip(index: number) {
      this.storeSwanMessageTip_global({ key: 'QPF' + index+'时', type: 'remove' })
    }


    dateTimeChangeToGetData() {
      for (let ele in this.riskwarningLayers) {
        if (this.riskwarningLayers[ele].selectedKey != '' && ele === "QPF") {
          this.rainfallHourClick(this.riskwarningLayers[ele].selectedKey, true, this.rainState);
        }
      }
    }


//    /单选,清除的layer
    radioClearOldLayer(typeKey: string) {
      if (this.riskwarningLayers[typeKey].selectedLayer != null) {
        zmap.removeLayer(this.riskwarningLayers[typeKey].selectedLayer);
        this.riskwarningLayers[typeKey].selectedLayer = null
      }
    }

    @Watch('isAutoUpdate')
    onisAutoUpdateChanged (val: boolean, oldVal: boolean) {
      if (val) {
        this.intervalProduct = setInterval(this.initTime, 6*60*1000)
        this.intervalHolder = setInterval(this.dateTimeChangeToGetData, 6*60*1000)
      }
      else {
        clearInterval(this.intervalProduct)
        clearInterval(this.intervalHolder)
        this.intervalHolder = null
        this.intervalProduct = null
      }
    }



    geologyHourClick(key, val, state){
      // alert(key);
    }
    mTorrentHourClick(key, val, state){
      // alert(key);
    }
    basinHourClick(key, val, state){
      // alert(key);
    }


    showErrorMessage(message: string){
      Vue['prototype']['$message']({
        type: 'warning',
        message: message
      })
    }
  }




</script>



<style lang='scss' scoped>
  #riskWarn {
    top: 60px;
    left: 0;
    background-color: #ffffff;
    width: 280px;
  .content {
    ul {
      background-color: #ffffff;
    li {

      margin-top: 1.5px;
      margin-bottom: 1.5px;
      border-left: 3px solid transparent;
      /*border-top: 1px solid #e6e6e6;*/
    &:last-child { border-bottom: none;}
    &:first-of-type {
       margin-top: 0px;
     }
    &.on {
       border-left: 3px solid #f3ac12;
       border-bottom: 1px solid #e6e6e6;
       &:last-child { border-bottom: none;}
     }
    }
    }
    .rainData-div {
      background-color: #4c4f4f;
      border-radius: 4px;
      position: fixed;
      display: none;
      &.show {
         display: block;
      }
      p {
        color: white;
        padding: 5px;
        text-align: left;
        white-space: nowrap;
      }
    }
    }
  }
</style>
