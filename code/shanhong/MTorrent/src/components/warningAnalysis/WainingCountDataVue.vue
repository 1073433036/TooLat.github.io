<template>
  <main id="WainingCountData">
    <ul class="elements cf">
      <li @click="toggleElement(opt, index)" v-for="(opt, index) of elements" :key="opt.key">
        <em :class="opt.key"></em>
        <div :class="['el', {'on': opt.selected}]">{{ opt.name }}</div>
      </li>
    </ul>
    <div class="rainData-div" :class="{show: isShowRainData}" :style="[{top: rainDataDivScrTop + 'px'}, {left: rainDataDivScrLeft + 'px'}]">
      <p>{{rfRainData}}</p>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { productClient, riskWarningClient, warningAnalysisClient } from '../../util/clientHelper'
  import moment from 'moment'
  import { Coder } from '../../util/Coder'
  import * as rainLayerColor from '../../util/rainLayerColor'

  let L,zmap,WeatherScence

  @Component
  export default class WainingCountDataVue extends Vue {
    @Prop() date: Date
    @Prop() hour: number
    @Prop() minute: number
    @Action('systemStore/storeSwanMessageTip_global') storeSwanMessageTip_global
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    @Action('systemStore/storeRainColorDatas_global') storeRainColorDatas_global: any

    elements: any[] = [
      { key: 'twForeRainfall', name: '24小时降水', selected: false, rainType: '24',  layer: null},
      { key: 'oneRainfall',name: '1小时降水', selected: false, rainType: '1',  layer: null },
      { key: 'threeRainfall',name: '3小时降水', selected: false , rainType: '3',  layer: null},
      { key: 'twBeforeRainfall',name: '20小时后降水', selected: false, rainType: '20', layer: null},
    ]

    // 雨量相关参数
    meteoList: any = []
    rainGradeInfo: any = {}
    gridinfo: any = {}
    rainDatas: any = null
    mapRainLayer: any = null

    //鼠标提示框
    rainDataDivScrTop: number = 0
    rainDataDivScrLeft: number = 0
    isShowRainData: boolean = false //是否展示雨量值 view
    rfRainData: string = '雨量: 0mm'  //返回 雨量值

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      WeatherScence = global['WeatherScence']

      this.getMeteoList();
      this.storeRainColorDatas_global({
        title: '降雨统计',
        colorsObj: rainLayerColor.colorTabel
      });
      let thisSelf = this;
      zmap.on('mouseout', function (e) {
        thisSelf.isShowRainData = false;
      })
    }

    linstenMapMove(pos) {
      if (this.gridinfo === null || this.mapRainLayer === null) {
        return
      }

      this.rainDataDivScrTop = pos.containerPoint.y - 10;
      this.rainDataDivScrLeft = pos.containerPoint.x + 20;

      let log = pos.latlng.lng
      let lat = pos.latlng.lat
      let rf = WeatherScence.interpModel(this.rainDatas, this.gridinfo, log, lat);
      this.isShowRainData = true
      if (rf < 0) {
        this.isShowRainData = false
      }
      rf = rf.toFixed(1)
      this.rfRainData = '雨量: ' + rf + 'mm'
    }


//  获取列表 和 个点数据
    async getMeteoList() {
      let refData = await warningAnalysisClient.getMeteoList();
      if (refData) {
        this.meteoList = refData;
        this.getRainGradeInfo()
      }else {
        console.log("请求获取文件列表数据失败")
      }
    }

    async getRainGradeInfo() {
      let gradeInfo = await warningAnalysisClient.getMeteoInfoData(this.meteoList[this.meteoList.length - 1])
      if(gradeInfo) {
        this.rainGradeInfo = gradeInfo;
        this.gridinfo = {
          top: gradeInfo.topLat,
          left: gradeInfo.leftLon,
          bottom: gradeInfo.topLat - ((gradeInfo.latDim - 1) * gradeInfo.latGap),
          right: gradeInfo.leftLon + ((gradeInfo.lonDim - 1) * gradeInfo.lonGap),
          xgap: gradeInfo.lonGap,
          ygap: gradeInfo.latGap,
          xdim: gradeInfo.lonDim,
          ydim: gradeInfo.latDim
        }
      }else {
        this.showErrorMessage("请求获取数据失败")
      }
    }

    async getRainDatas(timeNum: string) {
      if (this.meteoList.length < 1) {
        this.getMeteoList();
        return
      }
      if (JSON.stringify(this.rainGradeInfo) == '{}') {
        this.getRainGradeInfo()
        return
      }
      let modelName: string = this.rainGradeInfo["modelName"];
      let filepath: string = this.rainGradeInfo["filepath"];
      let fileName: string = this.rainGradeInfo["filename"];
      let level: number = this.rainGradeInfo["levels"][0];
      let rainDatas = await warningAnalysisClient.getMeteoRainsData(modelName, filepath, fileName, level, timeNum)
      if(rainDatas) {

        this.rainDatas = rainDatas
        let shadeLayer  = L.shadeLayer(rainDatas, this.gridinfo, rainLayerColor.colorTabel, L.Util.Bounds.SimpleGuangDong, {debug:false})
        if (this.mapRainLayer != null) {
          this.removeImageLayer()
        }
        shadeLayer .addTo(zmap);
        zmap.on('mousemove', this.linstenMapMove)
        this.mapRainLayer = shadeLayer;
      }else {
        this.showErrorMessage("请求获取数据失败")
      }
    }

    toggleElement(opt: any, index: number) {
      zmap.off('mousemove', this.linstenMapMove);
      this.isShowRainData = false

      if (!this.elements[index].selected) {
        this.storePopupStatus_global({ key: 'rainColorsBar', action: true })
      }else {
        this.storePopupStatus_global({ key: 'rainColorsBar', action: false })
      }

      if(this.elements[index].selected) {
        this.elements[index].selected = false;
        //移除layer
        this.removeImageLayer()
        return;
      }
      this.elements.forEach((el, i) => {
        el.selected = i === index;
      });

      if (opt.rainType === '20') {
        let dateTime = new Date();
        let curHour = dateTime.getHours();
        let calHour = 0 // 和上个 20 点对比的差值
        if (curHour > 20) {
          calHour = curHour - 20;
        }else if (curHour === 20){
          calHour = 24;
        }else {
          calHour = 4 + curHour;
        }
        console.log(calHour);
        this.getRainDatas(`${calHour}`)
      }else {
        this.getRainDatas(opt.rainType)
      }
    }

    removeImageLayer() {
      if (!this.mapRainLayer) return
      zmap.removeLayer(this.mapRainLayer)
      this.mapRainLayer = null
    }

    beforeDestroy(){
      this.removeImageLayer()
    }

    showErrorMessage(message: string){
      Vue['prototype']['$message']({
        type: 'warning',
        message: message
      })
    }


    // 时间改变
    datetimeChanged() {
      let hour = this.hour >= 10 ? this.hour : '0' + this.hour
      let minute = this.minute >= 10 ? this.minute : '0' + this.minute
      let datetime = moment(this.date).format('YYYY-MM-DD ') + hour + ':' + minute + ':00'
      console.log(datetime)
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
  #WainingCountData{
    position: relative;
    padding-bottom: 5px;
    border-bottom: 1px solid #e6e6e6;
    ul.elements li em {
      &.twForeRainfall { background: rgb(1, 128, 1); }
      &.oneRainfall { background: rgb(253, 160, 40); }
      &.threeRainfall { background: rgb(253, 160, 40);}
      &.twBeforeRainfall { background: rgb(128, 48, 0); }
    }
    .rainData-div {
      background-color: #4c4f4f;
      border-radius: 4px;
      position: fixed;
      z-index: 9999;
      display: none;
      &.show {
         display: block;
      }
      p {
        color: white;
        padding: 5px;
        white-space: nowrap;
        text-align: left;
      }
    }
  }
</style>
