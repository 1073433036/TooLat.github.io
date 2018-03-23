<template>
  <main id="vwp" class="global-popup" v-drag>
    <header>
      <span>风廊线</span>
      <em @click="storePopupStatus_global({ key: 'WindCorridor', action: false })"></em>
    </header>
    <div class="content">
      <div class="opt">
        日期：
        <el-date-picker
          v-model="date"
          size="small"
          :editable="false"
          :clearable="false"
          type="date">
        </el-date-picker>
        日
        <select v-model="hour">
          <option :value="0">00</option>
          <option v-for="i in 23" :key="i" :value="i">{{ i >= 10 ? i : '0' + i }}</option>
        </select>
        时
        <select v-model="minute">
          <option :value="0">00</option>
          <option v-for="i in 9" :key="i" :value="i*6">{{ i*6 >= 10 ? i*6 : '0' + i*6 }}</option>
        </select>
        分
        <select v-model="currentSeleRatarStation">
          <option v-for="ratar in windRatarStations" :key="ratar.addr" :value="ratar.obtid">{{ratar.addr}}</option>
        </select>
        雷达站点

        <select v-model="selectedType">
          <option v-for="type in ratarTypes" :key="type" :value="type">{{type}}</option>
        </select>
        雷达类型
      </div>
      <figure class="data-class">
        <canvas height="1605px"
                id="WindRadarCanvas"
                width="740px"></canvas>
      </figure>
      <figure class="ruler">
        <canvas height="550px"
                id="rulerWindRadarCanvas"
                width="80px"></canvas>
      </figure>
      <figure class="dateTime-class">
        <canvas height="50px"
                id="dateTimeWindRadarCanvas"
                width="740px"></canvas>
      </figure>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  import {windProfileClient} from '../../util/clientHelper'
  import {getVelLevel} from '../../util/windHelper'
  import WindRadarDrawer from '../../util/newVWPUtil'
  @Component
  export default class vwp extends Vue {
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any

    date: Date = new Date()
    hour: number = new Date().getHours()
    minute: number = 0
    imgUrl: string = ''
    windRatarStations: any[] = []
    currentSeleRatarStation: string = ''

    ratarTypes: string[] = ['ROBS', 'HOBS', 'OOBS']
    selectedType: string = ''


    mounted() {
      let date = Date.now() - Date.now() % (6*60*1000)
      let time = Date.now() - 15*60*1000
      this.date = new Date(moment(time).format('YYYY/MM/DD 00:00:00'))
      this.hour = new Date(time).getHours()
      this.minute = new Date(date).getMinutes()
      this.selectedType = this.ratarTypes[0]
      this.getRatarStationData();
    }

    async getRatarStationData() {
      let refData = await windProfileClient.getRatarStations();
      if (refData) {
        this.windRatarStations = refData;
        this.currentSeleRatarStation = this.windRatarStations[0].obtid
        this.getRatarData()
      }
    }



    async getRatarData() {
      if (this.currentSeleRatarStation === '')
        return

      let datetime = moment(this.date).add(this.hour, 'hours').add(this.minute, 'minutes').format('YYYY-MM-DD HH:mm:00')
      let refData = await windProfileClient.getRatarData(datetime,this.currentSeleRatarStation, this.selectedType)
      console.log(refData)

      if (refData) {
        let drawer = new WindRadarDrawer('multiple', 'WindRadarCanvas', 'rulerWindRadarCanvas', 'dateTimeWindRadarCanvas')
        drawer.setDrawType('single')
        drawer.setData(refData.tagObject)
        let newTime = moment(this.date).add(this.hour, 'hours').add(this.minute, 'minutes').format('YYYY-MM-DD HH:mm')
        drawer.draw(newTime, '雷达站:' + this.getRadarCNName())
      }

    }

    getRadarCNName() {
      for(let item of this.windRatarStations){
        if(item.obtid === this.currentSeleRatarStation)
          return item.addr
      }
    }

    @Watch('date')
    onDateChanged(val: any, oldVal: any) {
      this.getRatarData()
    }

    @Watch('hour')
    onHourChanged(val: any, oldVal: any) {
      this.getRatarData()
    }

    @Watch('minute')
    onMinuteChanged(val: any, oldVal: any) {
      this.getRatarData()
    }

    @Watch('currentSeleRatarStation')
    onCurrentSeleRatarStationChange(newVal: any, oldVal: any) {
      this.getRatarData()
    }

    @Watch('selectedType')
    onSelectedTypeChange(newVal: any, oldVal: any) {
      this.getRatarData()
    }

  }
</script>

<style lang='scss' scoped>
  #vwp {
    position: absolute;
    top: calc(50% - 269px);
    left: calc(50% - 390px);
    overflow: hidden;
    background-color: #ffffff;
    width: 900px;
  .content {
    height: 580px;
    .opt {
      width: calc(100% - 10px);
      height: 44px;
      color: #999;
      line-height: 44px;
      padding-left: 10px;
      border-bottom: 1px solid #ccc;
      select {
        margin: 0 10px;
        width: 60px;
        height: 24px;
        padding-left: 6px;
        border: 1px solid #dcdcdc;
        border-radius: 2px;
      }
    }
    figure {
      float: left;
      margin: 0;
      padding: 0;
      height: 550px;
    }
    .data-class {
      margin-left: 40px;
      width: 740px;
      overflow: hidden;
      overflow-y: auto;
    }
    .ruler {
      width: 80px;
    }
    .dateTime-class {
      height: 30px;
      width: 740px;
      margin: 0 40px;
    }
  }
  }
</style>

<style lang='scss'>
  #vwp {
  .el-date-editor.el-input {
    margin-left: 0;
    width: 134px;
  }
  .el-input__inner {
    color: #000;
    border: 1px solid #dcdcdc;
    background: #fff;
  }
  .el-input--small .el-input__inner {
    height: 24px;
  }
  .el-input__inner {
    border-radius: 4px;
  }
  }
</style>
