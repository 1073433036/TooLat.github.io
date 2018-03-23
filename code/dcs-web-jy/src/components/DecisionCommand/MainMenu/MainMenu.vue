<template>
  <main id="MainMenu">
    <ul class="menu ns">
      <li v-for="el of menuList" :key="el.key" :title="el.name" 
          :class="[el.key, {on: menuSelected === el.key || hoverMenu === el.key}]" @click="toggleMenu(el.key)"
          @mousemove="hoverMenu = el.key" @mouseout="hoverMenu = ''">
        <template v-if="menuSelected === el.key || hoverMenu === el.key">
          <span>{{ el.name.slice(0, 2) }}</span>
          <span>{{ el.name.slice(2, 4) }}</span>
        </template>    
      </li>
      <!-- <li title="返回首页" class="back" @click="linkToMainView"></li> -->
    </ul>
    <transition name="slide-fade">
      <component :is="currentView" :closeFunc="closePanel"></component>
    </transition>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  import DisasterAnalysis from '../Popup/DisasterAnalysis.vue'
  import RealLive from '../Popup/RealLive/RealLive.vue'
  import VideoMonitor from '../Popup/Video/VideoMonitor.vue'
  import EmergencyPlan from '../Popup/EmergencyPlan/EmergencyPlan.vue'
  import MessageRelease from '../Popup/MessageRelease/MessageRelease.vue'
  import BasicInfo from '../Popup/BasicInfo.vue'
  import EmergencyDeal from '../popup/EmergencyDeal.vue'

  @Component
  export default class MainMenu extends Vue {
    @Getter('decisionStore/alarmTyphTsid_global') alarmTyphTsid_global
    @Getter('decisionStore/dealPlanInfo_global') dealPlanInfo_global

    menuList: any[] = [
      { key: 'disasterAnalysis', name: '灾害分析' },
      { key: 'realLive', name: '实况监测' },
      { key: 'videoMonitor', name: '视频监控' },
      { key: 'emergencyPlan', name: '应急预案' },
      { key: 'messageRelease', name: '信息发布' },
      { key: 'basicInfo', name: '基础信息' },
      { key: 'emergencyDeal', name: '应急处置' }
    ]
    menuSelected: string = ''
    hoverMenu: string = ''
    currentView: any = null

    @Watch('alarmTyphTsid_global.flag')
    onalarmTyphTsid_globalChanged (val: any, oldVal: any) {
      this.menuSelected = 'realLive'
    }

    toggleMenu(key) {
      this.menuSelected = this.menuSelected === key ? '' : key
    }

    @Watch('menuSelected')
    onmenuSelectedChanged (val: string, oldVal: string) {
      switch(val) {
        case 'disasterAnalysis':
          this.currentView = DisasterAnalysis
          break
        case 'realLive':
          this.currentView = RealLive
          break
        case 'videoMonitor':
          this.currentView = VideoMonitor
          break
        case 'emergencyPlan':
          this.currentView = EmergencyPlan
          break
        case 'messageRelease':
          this.currentView = MessageRelease
          break
        case 'basicInfo':
          this.currentView = BasicInfo
          break
        case 'emergencyDeal':
          this.currentView = EmergencyDeal
          break
        default:
          this.currentView = null 
      }
    }

    closePanel() {
      this.menuSelected = ''
    }

    linkToMainView() {
      this.$router.push({ name: 'MainViewer' })
    }

    @Watch('dealPlanInfo_global')
    ondealPlanInfo_globalChanged (val: any, oldVal: any) {
      if (Object.keys(val).length)
        this.menuSelected = 'emergencyPlan'
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#MainMenu {
  z-index: 9;
  position: absolute;
  top: 50%;
  left: 20px; /*no*/
  margin-top: -225px;
  box-shadow: 0 0 10px -4px black;
  ul.menu {
    li {
      width: 50px;
      height: 50px;
      color: #fff;
      text-align: center;
      cursor: pointer;
      background: #fff;
      span {
        display: inline-block;
        width: 50px;
        height: 25px;
        line-height: 30px;
        &:last-child { line-height: 10px; }
      }
      &.disasterAnalysis {
        background: #fff url(~Img/DecisionCommand/sidebar.png) no-repeat 0 0 / 500% 100%;
      }
      &.realLive {
        background: #fff url(~Img/DecisionCommand/sidebar.png) no-repeat 25% 0 / 500% 100%;
      }
      &.videoMonitor {
        background: #fff url(~Img/DecisionCommand/sidebar.png) no-repeat 50% 0 / 500% 100%;
      }
      &.emergencyPlan {
        background: #fff url(~Img/DecisionCommand/sidebar.png) no-repeat 75% 0 / 500% 100%;
      }
      &.messageRelease {
        background: #fff url(~Img/DecisionCommand/sidebar.png) no-repeat 100% 0 / 500% 100%;
      }
      &.basicInfo {
        background: #fff url(~Img/DecisionCommand/sidebar_info.png) no-repeat 0 0 / 100% 100%;
      }
      &.emergencyDeal {
        background: #fff url(~Img/DecisionCommand/sidebar_deal.png) no-repeat 0 0 / 100% 100%;
      }
      &.back {
        margin-top: 10px;
        background: $themeColor url(~Img/DecisionCommand/sidebar_home.png) no-repeat center / 50% 50%;
      }
      &.on { background: $themeColor; }
    }
  }
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(-10px);
    opacity: 0;
  }
}
</style>