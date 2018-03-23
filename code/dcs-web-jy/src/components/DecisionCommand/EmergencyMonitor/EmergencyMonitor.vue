<template>
  <main id="EmergencyMonitor" :class="{up: typhTimelineStatus_global !== 'search'}">
    <div :class="['icon-wrapper', {warning: isWarning}]" @click="togglePopup"></div>
    <div class="emergency-option-wrapper decision-popup" v-show="isPopupOn">
      <header><span>通知</span><a @click="isPopupOn = false"></a></header>
      <div class="content">
        <div class="lists">
          <ul>
            <li v-for="el of emergencyOptions" :key="el.key" @click="emergencyOptionSelected = el.key" :title="el.name" 
                :class="[el.key, {on: emergencyOptionSelected === el.key, emergency: el.emergency}]"></li>
          </ul>
        </div>
        <div class="wrapper">
          <online-plan v-show="emergencyOptionSelected === 'plan'" />
          <alarm-monitor v-show="emergencyOptionSelected === 'alarm'" :clearHolder="clearAlarmDataHolder" />
          <message-monitor v-show="emergencyOptionSelected === 'message'" />
          <video-monitor v-show="emergencyOptionSelected === 'video'" />
        </div>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import OnlinePlan from './OnlinePlan.vue'
  import AlarmMonitor from './AlarmMonitor.vue'
  import MessageMonitor from './MessageMonitor.vue'
  import VideoMonitor from './VideoMonitor.vue'

  @Component({
    components: {
      OnlinePlan,
      AlarmMonitor,
      MessageMonitor,
      VideoMonitor
    }
  })
  export default class EmergencyMonitor extends Vue {
    @Getter('decisionStore/emergencyMonitor_global') emergencyMonitor_global
    @Getter('decisionStore/typhTimelineStatus_global') typhTimelineStatus_global

    emergencyOptions: any[] = [
      { key: 'plan', name: '预案在线', emergency: false },
      { key: 'alarm', name: '报警监控', emergency: false },
      // { key: 'message', name: '未读短信', emergency: false },
      // { key: 'video', name: '直播请求', emergency: false },
    ]
    emergencyOptionSelected: 'plan' | 'alarm' | 'message' | 'video' = 'plan'
    isPopupOn: boolean = false
    clearAlarmDataHolder: number = Date.now()   // 子组件监听变化清除地图上山洪内涝地质灾害数据
    get isWarning(): boolean {
      for (let el of this.emergencyOptions) {
        if (el.emergency) return true
      }
      return false
    }
    
    @Watch('isWarning')
    onisWarningChanged (val: boolean, oldVal: boolean) {
      if (val && !this.isPopupOn) this.togglePopup()
    }

    togglePopup() {
      if (!this.isPopupOn) {
        for (let el of this.emergencyOptions) {
          if (el.emergency) {
            this.emergencyOptionSelected = el.key
            break
          }
        }
      }
      this.isPopupOn = !this.isPopupOn
    }

    @Watch('emergencyOptionSelected')
    onemergencyOptionSelectedChanged (val: any, oldVal: any) {
      if (oldVal === 'alarm') this.clearAlarmDataHolder = Date.now()
    }

    @Watch('isPopupOn')
    onisPopupOnChanged (val: boolean, oldVal: boolean) {
      if (this.emergencyOptionSelected === 'alarm') this.clearAlarmDataHolder = Date.now()
    }

    @Watch('emergencyMonitor_global.onlinePlan')
    onOnlinePlanChanged (val: boolean, oldVal: boolean) {
      let item = this.emergencyOptions.find(el => el.key === 'plan')
      item.emergency = val
    }

    @Watch('emergencyMonitor_global.alarmMonitor')
    onAlarmMonitorChanged (val: boolean, oldVal: boolean) {
      let item = this.emergencyOptions.find(el => el.key === 'alarm')
      item.emergency = val
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#EmergencyMonitor {
  position: absolute;
  bottom: 90px;
  right: 20px; /*no*/
  transition: all .3s linear;
  &.up {
    transform: translateY(-110px); /*no*/
  }
  .icon-wrapper {
    position: relative;
    width: 36px;
    height: 36px;
    box-shadow: 0 0 10px #8d9db5;
    cursor: pointer;
    background: #fff url(~Img/DecisionCommand/notice.png) no-repeat center center / 18.5px 18px;
    &.warning::after {
      position: absolute;
      top: 5px;
      right: 5.5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #f00;
      content: '';
    }
  }
  .emergency-option-wrapper {
    z-index: 9;
    position: absolute;
    top: -250px;
    left: 36px;
    width: 360px;
    transform: translateX(-100%);
    header { cursor: default; }
    .content {
      position: relative;
      height: 200px;
      .lists {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-right: 1px solid #d2d4db;
        ul {
          li {
            position: relative;
            width: 50px;
            height: 40px;
            cursor: pointer;
            &.emergency {
              &::after {
                position: absolute;
                content: '';
                top: 10px;
                left: 30px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #f00;
              }
            }
            &.plan { background: url(~Img/DecisionCommand/emergency.png) no-repeat 0 0 / 200% 400%; }
            &.alarm { background: url(~Img/DecisionCommand/emergency.png) no-repeat 0 33.3% / 200% 400%; }
            &.message { background: url(~Img/DecisionCommand/emergency.png) no-repeat 0 66.6% / 200% 400%; }
            &.video { background: url(~Img/DecisionCommand/emergency.png) no-repeat 0 100% / 200% 400%; }
            &.on {
              background-color: #eee;
              &.plan { background: url(~Img/DecisionCommand/emergency.png) no-repeat 100% 0 / 200% 400%; }
              &.alarm { background: url(~Img/DecisionCommand/emergency.png) no-repeat 100% 33.3% / 200% 400%; }
              &.message { background: url(~Img/DecisionCommand/emergency.png) no-repeat 100% 66.6% / 200% 400%; }
              &.video { background: url(~Img/DecisionCommand/emergency.png) no-repeat 100% 100% / 200% 400%; }
            }
          }
        }
      }
      .wrapper {
        position: absolute;
        top: 0;
        left: 50px;
        width: calc(100% - 50px);
        height: 100%;
      }
    }
  }
}
</style>