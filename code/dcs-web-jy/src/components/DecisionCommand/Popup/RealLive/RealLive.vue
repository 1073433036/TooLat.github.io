<template>
  <main id="RealLive" class="decision-popup ns" v-drag>
    <header>
      <span>实况监测</span>
      <a @click="closeFunc"></a>
    </header>
    <div class="content">
      <ul class="opts">

        <li class="opt weatherForecast">
          <div class="header">
            <span>天气推演</span>
            <div class="switch" @click="toggleOptSelected('weatherForecast')"
                :class="{on: panelStatus.weatherForecast}">
              <div class="track"></div>
              <div class="btn"></div>
            </div>
          </div>
        </li>

        <li :class="['opt', 'weatherMonitor', {on: panelStatus.weatherMonitor}]">
          <div class="header" @click="toggleOptSelected('weatherMonitor')">
            <span>气象监测</span>
            <div class="icon"></div>
          </div>
          <div class="wrapper" id="WeatherMonitor" v-show="panelStatus.weatherMonitor">
            <ul class="cf decision-chk-group">
              <li v-for="el of weatherMonitorOpts" :key="el.key"
                  :class="{on: el.selected}" @click="toggleWeatherMonitorOpts(el)">
                <em></em>
                <span>{{ el.name }}</span>
              </li>
            </ul>
          </div>
        </li>
        <component :is="tideMonitorView" v-show="panelStatus.weatherMonitor"></component>
        <component :is="stationLiveView" v-show="panelStatus.weatherMonitor"></component>

        <li :class="['opt', 'waterMonitor', {on: panelStatus.waterMonitor}]">
          <div class="header" @click="toggleOptSelected('waterMonitor')">
            <span>水文监测</span>
            <div class="icon"></div>
          </div>
          <water-monitor v-show="panelStatus.waterMonitor" :isPanelShow="panelStatus.waterMonitor" />
        </li>

        <li :class="['opt', 'disasterMonitor', {on: panelStatus.disasterMonitor}]">
          <div class="header" @click="toggleOptSelected('disasterMonitor')">
            <span>灾害监测</span>
            <div class="icon"></div>
          </div>
          <disaster-monitor v-show="panelStatus.disasterMonitor" :isPanelShow="panelStatus.disasterMonitor" />
        </li>

        <li :class="['opt', 'shipMonitor', {on: panelStatus.shipMonitor}]">
          <div class="header" @click="toggleOptSelected('shipMonitor')">
            <span>船舶监测</span>
            <div class="icon"></div>
          </div>
          <ship-monitor v-show="panelStatus.shipMonitor" :isPanelShow="panelStatus.shipMonitor" />
        </li>

      </ul>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import TideMonitor from './TideMonitor.vue'
  import StationLive from './StationLive.vue'
  import WaterMonitor from './WaterMonitor.vue'
  import DisasterMonitor from './DisasterMonitor.vue'
  import ShipMonitor from './ShipMonitor.vue'

  @Component({
    components: {
      WaterMonitor,
      DisasterMonitor,
      ShipMonitor,
    }
  })
  export default class RealLive extends Vue {
    @Prop({ default: Function }) closeFunc
    @Getter('decisionStore/alarmTyphTsid_global') alarmTyphTsid_global
    @Action('decisionStore/storeAlarmTyphTsid_global') storeAlarmTyphTsid_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/selectDisasterType_global') selectDisasterType_global
    @Action('decisionStore/toggleTyphTimelineStatus_global') toggleTyphTimelineStatus_global
    
    panelStatus: any = {
      weatherForecast: false,
      weatherMonitor: false,
      waterMonitor: false,
      disasterMonitor: false,
      shipMonitor: false
    }
    tideMonitorView: any = null
    stationLiveView: any = null
    weatherMonitorOpts: any[] = [
      { key: 'typhoon', name: '台风路径', selected: false },
      { key: 'station', name: '站点实况', selected: false },
      { key: 'product', name: '气象产品监测', selected: false }
    ]

    mounted() {
      this.panelStatus.weatherMonitor = true
      let el = this.weatherMonitorOpts.find(el => el.key === 'station')
      this.toggleWeatherMonitorOpts(el)

      if (this.alarmTyphTsid_global.tsid) {
        this.openTyphPanel()
      }
    }

    // 通过报警监控台风 打开 台风路径面板
    @Watch('alarmTyphTsid_global.flag')
    onalarmTyphTsid_globalChanged (val: any, oldVal: any) {
      this.openTyphPanel()
    }

    openTyphPanel() {
      this.storeAlarmTyphTsid_global(0)
      let el = this.weatherMonitorOpts[0]
      if (!el.selected)
        this.toggleWeatherMonitorOpts(el)
    }

    beforeDestroy() {
      if (this.panelStatus.weatherForecast)
        this.storePopupStatus_global({ key: 'weatherForecast', action: false })
      if (this.panelStatus.weatherMonitor)
        this.clearWeatherMonitor()
    }

    toggleOptSelected(key) {
      this.panelStatus[key] = !this.panelStatus[key]
      if (this.panelStatus[key]) {
        if (key === 'weatherForecast') {
          let opt = this.weatherMonitorOpts.find(el => el.key === 'product')
          if (opt.selected) {     // 避免与气象产品监测冲突
            opt.selected = false
            this.storePopupStatus_global({ key: 'swanProduct', action: false })
          }
          this.storePopupStatus_global({ key: 'weatherForecast', action: true })
        }
      } else {
        if (key === 'weatherForecast')
          this.storePopupStatus_global({ key: 'weatherForecast', action: false })
      }
    }

    async toggleWeatherMonitorOpts(el) {
      el.selected = !el.selected
      if (el.selected) {
        if (el.key === 'typhoon') {
          this.tideMonitorView = TideMonitor
          this.selectDisasterType_global('tide')
        } else if (el.key === 'station')
          this.stationLiveView = StationLive
        else if (el.key === 'product') {
          if (this.panelStatus.weatherForecast) {     // 避免与天气推演冲突
            this.panelStatus.weatherForecast = false
            this.storePopupStatus_global({ key: 'weatherForecast', action: false })
          }
          this.storePopupStatus_global({ key: 'swanProduct', action: true })
        }
      } else {
        if (el.key === 'typhoon') {
          this.tideMonitorView = null
          this.selectDisasterType_global('')
          this.toggleTyphTimelineStatus_global('search')
        } else if (el.key === 'station')
          this.stationLiveView = null
        else if (el.key === 'product')
          this.storePopupStatus_global({ key: 'swanProduct', action: false })
      }
    }

    clearWeatherMonitor() {
      for (let el of this.weatherMonitorOpts) {
        if (!el.selected) continue
        el.selected = false
        if (el.key === 'typhoon') {
          this.selectDisasterType_global('')
          this.toggleTyphTimelineStatus_global('search')
        } else if (el.key === 'station')
          this.stationLiveView = null
        else if (el.key === 'product')
          this.storePopupStatus_global({ key: 'swanProduct', action: false })
      }
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#RealLive {
  position: absolute;
  top: 0;
  left: 60px;
  width: 300px;
  .content {
    padding: 10px 10px 10px 20px;
    ul.opts {
      li.opt {
        position: relative;
        padding: 10px 0;
        &::after {
          position: absolute;
          top: 10px;
          left: 0;
          width: 2px;
          height: 20px;
          content: '';
        }
        &.weatherForecast::after { background: #33bf9f; }
        &.weatherMonitor::after { background: #3594d2; }
        &.waterMonitor::after { background: #9244bb; }
        &.disasterMonitor::after { background: #f19149; }
        &.shipMonitor::after { background: #33bf9f; }
        .header {
          position: relative;
          width: 100%;
          height: 20px;
          cursor: pointer;
          span {
            position: absolute;
            top: 0;
            left: 20px;
            display: inline-block;
            line-height: 20px;
          }
          .switch {
            position: absolute;
            top: 0;
            left: 196px;
            .track {
              position: absolute;
              top: 2px;
              left: 0;
              width: 40px;
              height: 16px;
              background: #9b9b9b;
              border-radius: 8px;
              cursor: pointer;
              transition: all .15s linear;
            }
            .btn {
              position: absolute;
              top: -2px;
              left: 0;
              width: 24px;
              height: 24px;
              border-radius: 12px;
              background: #fff;
              box-shadow: 0 0 5px #8d9db5; 
              cursor: pointer;
              transition: all .15s linear;
            }
            &.on {
              .track {
                background: #8dd4f8;
              }
              .btn {
                left: 16px;
                box-shadow: none;
                background: $themeColor;
              }
            }
          }
          .icon {
            position: absolute;
            top: 4px;
            left: 212px;
            width: 8px;
            height: 12px;
            transform: rotate(90deg);
            background: url(~Img/DecisionCommand/extend.png) no-repeat 0 0 / 400% 100%;
          }
        }
        .wrapper {
          margin-top: 10px;
          padding: 0 20px;
        }
        &.on {
          background: #f5f5f5;
          &::after {
            top: 0;
            height: 100%;
          }
          .header {
            .icon {
              background: url(~Img/DecisionCommand/extend.png) no-repeat 33.3% 0 / 400% 100%;
              transform: rotate(-90deg);
            }
          }
        }
      }
    }
  }
}
</style>