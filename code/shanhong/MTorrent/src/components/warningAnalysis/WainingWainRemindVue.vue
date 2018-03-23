<template>
  <main id="WainingWainRemindV">
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
  import moment from 'moment'

  import warningRemindToolUtil from '../../util/riskWarningUtil/warningRemindToolUtil'

  import remindZmapUtil from '../../util/riskWarningUtil/remindZmapUtil'

  let L,zmap

  @Component
  export default class WainingWainRemindVue extends Vue {
    @Prop() date: Date
    @Prop() hour: number
    @Prop() minute: number
    @Getter('systemStore/userInfo_global') userInfo_global: any
    @Getter('systemStore/resetThresholdp_global') resetThresholdp_global: any
    elements: any[] = [
      { key: 'strongRainfall',name: '强降雨', selected: true },
      { key: 'qpf',name: 'QPF', selected: true },
      { key: 'strongEcho', name: '强回波', selected: true },
      { key: 'bigWindRemind',name: '大风提醒', selected: true },
      // { key: 'wainingLeakage',name: '预警漏发', selected: false },
      // { key: 'wainingUpgrate',name: '预警升级', selected: false },
      // { key: 'arieLinkage',name: '区域联动', selected: false },
    ]
    zmapUtil: any = null;
    warningToolClass: any = null;
    echoNotify: any = null;
    qpfNotify: any = null;
    bigWindNotify: any = null;
    strongRainfallNotify: any = null;
    //存储 预警等级数组
    remindLevels: any = {
      strongRainfall: 0,
      qpf: 0,
      echo: 0,
      bigWindRemind: 0,
    }

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']

      this.zmapUtil = new remindZmapUtil();
      this.warningToolClass = new warningRemindToolUtil();
      this.stronRainfallInit();
      this.qpfInit();
      this.strongEchoInit();
      this.bigWindWarnInit();
    }
    beforeDestroy() {
      this.removeNotify();
    }

    getDateTime() {
      let hour = this.hour >= 10 ? this.hour : '0' + this.hour
      let minute = this.minute >= 10 ? this.minute : '0' + this.minute
      return moment(this.date).format('YYYY-MM-DD ') + hour + ':' + minute + ':00'
    }

    //移除notify
    removeNotify() {
      if (this.echoNotify != null) {
        this.echoNotify.close()
        this.echoNotify = null
      }
      if (this.qpfNotify != null) {
        this.qpfNotify.close()
        this.qpfNotify = null
      }
      if (this.bigWindNotify != null) {
        this.bigWindNotify.close()
        this.bigWindNotify = null
      }
      if (this.strongRainfallNotify != null) {
        this.strongRainfallNotify.close()
        this.strongRainfallNotify = null
      }
    }

    toggleElement(opt: any) {
      opt.selected = !opt.selected
      if (opt.key === 'strongEcho') {
        if (opt.selected) {
          this.strongEchoInit();
        }else {
          if (this.echoNotify != null) {
            this.echoNotify.close()
            this.echoNotify = null
          }
        }
      }else if (opt.key === 'qpf'){
        if (opt.selected) {
          this.qpfInit();
        }else {
          if (this.qpfNotify != null) {
            this.qpfNotify.close()
            this.qpfNotify = null
          }
        }
      }else if (opt.key === 'strongRainfall'){
        if (opt.selected) {
          this.stronRainfallInit();
        }else {
          if (this.strongRainfallNotify != null) {
            this.strongRainfallNotify.close()
            this.strongRainfallNotify = null
          }
        }
      }else {
        if (opt.selected) {
          this.bigWindWarnInit();
        }else {
          if (this.bigWindNotify != null) {
            this.bigWindNotify.close()
            this.bigWindNotify = null
          }
        }
      }
    }

    //强降雨
    async stronRainfallInit() {
      let msg = await this.warningToolClass.getWarningRemindData('rainfall', this.getDateTime());
      if (!msg || this.$route.name != "warningAnalysis") return;
      if (this.strongRainfallNotify != null) {
        this.strongRainfallNotify.close()
        this.strongRainfallNotify = null
      }
      if (msg.length === 3){
        this.remindLevels.strongRainfall = msg[2];
      }
      this.strongRainfallNotify = Vue['prototype']['$notify']({
        title: msg[0],
        message: msg[1],
        type: 'warning',
        duration: 0,
        offset: 110,
        onClose: () => {
          if (this.remindLevels.strongRainfall != 0) {
            this.zmapUtil.clearLayer('strongRainfall')
            this.remindLevels.strongRainfall = 0
          }
          // this.elements[0].selected = false;
        }
      })
      // this.elements[0].selected = true;
    }


    //大风提醒
    async bigWindWarnInit() {
      let msg = await this.warningToolClass.getWarningRemindData('winwarn', this.getDateTime());
      if (!msg || this.$route.name != "warningAnalysis") return;
      if (this.bigWindNotify != null) {
        this.bigWindNotify.close()
        this.bigWindNotify = null
      }
      if (msg.length === 3){
        this.remindLevels.bigWindRemind = msg[2];
      }
      this.bigWindNotify = Vue['prototype']['$notify']({
        title: msg[0],
        message: msg[1],
        type: 'warning',
        duration: 0,
        offset: 110,
        onClose: () => {
          if (this.remindLevels.bigWindRemind != 0) {
            this.zmapUtil.clearLayer('bigWindRemind')
            this.remindLevels.bigWindRemind = 0
          }
          // this.elements[3].selected = false;
        }
      })
      // this.elements[3].selected = true;
    }

    //初始化 强回波 工具
    async strongEchoInit() {

      let msg = await this.warningToolClass.getWarningRemindData('echo', this.getDateTime());
      if (!msg || this.$route.name != "warningAnalysis") return;
      if (this.echoNotify != null) {
        this.echoNotify.close()
        this.echoNotify = null
      }
      if (msg.length === 3){
        this.remindLevels.echo = msg[2];
      }
      this.echoNotify = Vue['prototype']['$notify']({
        title: msg[0],
        message: msg[1],
        type: 'warning',
        duration: 0,
        offset: 110,
        onClose: () => {
          if (this.remindLevels.echo != 0) {
            this.zmapUtil.clearLayer('echo')
            this.remindLevels.echo = 0
          }
          // this.elements[2].selected = false;
        }
      })
      // this.elements[2].selected = true;
    }

    async qpfInit() {
      let msg = await this.warningToolClass.getWarningRemindData('qpf', this.getDateTime());
      if (!msg || this.$route.name != "warningAnalysis"){
        return;
      }
      if (this.qpfNotify != null) {
        this.qpfNotify.close()
        this.qpfNotify = null
      }
      if (msg.length === 3){
        this.remindLevels.qpf = msg[2];
      }
      this.qpfNotify = Vue['prototype']['$notify']({
        title: msg[0],
        message: msg[1],
        type: 'warning',
        duration: 0,
        offset: 110,
        onClose: () => {
          if (this.remindLevels.qpf != 0) {
            this.zmapUtil.clearLayer('qpf')
            this.remindLevels.qpf = 0
          }
          // this.elements[1].selected = false;
        }
      })
      // this.elements[1].selected = true;
    }

    //根据监听变化, 对比填充地图 -> 只填充最大的
    doWithLevel() {
      let maxLeve = 0;
      let mapLayerId = ''
      for (let key in this.remindLevels) {
        if (this.remindLevels[key] != 0) {
          if (this.remindLevels[key] > maxLeve) {
            maxLeve = this.remindLevels[key];
            mapLayerId = key
          }
        }
      }
      if (maxLeve > 0) {
        console.log(maxLeve, mapLayerId)
        this.zmapUtil.drawBoundary(maxLeve, mapLayerId)
      }
    }

    // 时间改变
    async datetimeChanged() {
      for (let el of this.elements) {
        if (!el.selected) continue
        if (el.key === 'strongRainfall') this.stronRainfallInit();
        else if (el.key === 'qpf') this.qpfInit();
        else if (el.key === 'strongEcho') this.strongEchoInit();
        else if (el.key === 'bigWindRemind') this.bigWindWarnInit();
      }
    }

    @Watch('remindLevels', {deep:true})
    onRemindLevelsChange (val: any, oldVal: any) {
      this.doWithLevel();
    }

    @Watch('resetThresholdp_global.RainWarning')
    onRainWarningChanged (val: boolean, oldVal: boolean) {
      this.stronRainfallInit()
    }
    @Watch('resetThresholdp_global.QPFWarning')
    onQPFWarningChanged (val: boolean, oldVal: boolean) {
      this.qpfInit()
    }
    @Watch('resetThresholdp_global.CappiWarning')
    onCappiWarningChanged (val: boolean, oldVal: boolean) {
      this.strongEchoInit()
    }
    @Watch('resetThresholdp_global.WindWarning')
    onWindWarningChanged (val: boolean, oldVal: boolean) {
      this.bigWindWarnInit();
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
  #WainingWainRemindV{
    position: relative;
    padding-bottom: 5px;
    border-bottom: 1px solid #e6e6e6;
  }
</style>
