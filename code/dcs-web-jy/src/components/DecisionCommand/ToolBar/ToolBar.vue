<template>
  <main id="ToolBar" class="cf">
    <transition name="slide-fade">
      <ul class="tool-bar-wrapper cf" v-if="!isPanelHide">
        <li v-for="(el, key) in toolList" :key="key" :title="el.name" 
            :class="[key, {on: toolSelected === key}]" @click="toggleListSelected(key)"></li>
      </ul>
    </transition>
    <div class="extend-btn" @click="isPanelHide = !isPanelHide" :class="{on: isPanelHide}">工具栏</div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { MeasureHelper } from '@/util/MeasureHelper'

  let L: any = null,
      zmap: any = null
  let measureHelper: any

  @Component
  export default class ToolBar extends Vue {
    @Getter('decisionStore/popupStatus_global') popupStatus_global
    @Getter('decisionStore/zmapLayer_global') zmapLayer_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    isPanelHide: boolean = true
    toolList: any = {
      video: { name: '直播', popup: 'phoneLive' },
      disaster: { name: '灾情模拟', popup: 'disasterImitate' },
      // ship: { name: '渔船管理', popup: 'shipManage' },
      area: { name: '圈选区域', popup: 'targetRelease' },
      resocure: { name: '救援库', popup: 'rescueLib' },
      experts: { name: '专家库', popup: 'expertLib' },
      search: { name: '信息检索', popup: 'infoSearch' },
      nav: { name: '路线导航', popup: 'routeNav' },
      measure: { name: '测距' }
    }
    toolSelected: string = ''

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
    }
    
    beforeDestroy() {
      if (measureHelper) {
        measureHelper.removeMeasure()
        measureHelper = null
      }
      L = null
      zmap = null
    }

    toggleListSelected(key) {
      this.toolSelected = this.toolSelected === key ? '' : key
    }

    @Watch('toolSelected')
    ontoolSelectedChanged (val: string, oldVal: string) {
      if (val === 'measure') {
        measureHelper = new MeasureHelper(L, zmap, this.zmapLayer_global)
        measureHelper.startMeasure()
      } else if (val !== '') {
        this.storePopupStatus_global({ key: this.toolList[val].popup, action: true })
      }

      if (oldVal === 'measure') {
        measureHelper.removeMeasure()
        measureHelper = null
      } else if (oldVal !== '') {
        this.storePopupStatus_global({ key: this.toolList[oldVal].popup, action: false })
      }
    }

    @Watch('zmapLayer_global')
    onzmapLayer_globalChanged (val: string, oldVal: string) {
      measureHelper && measureHelper.toggleZmapLayer(val)
    }

    @Watch('popupStatus_global.disasterImitate')
    onDisasterImitateChanged (val: boolean, oldVal: boolean) {
      if (!val && this.toolSelected === 'disaster')
        this.toolSelected = ''
    }

    @Watch('popupStatus_global.rescueLib')
    onRescueLibChanged (val: boolean, oldVal: boolean) {
      if (!val && this.toolSelected === 'resocure')
        this.toolSelected = ''
    }

    @Watch('popupStatus_global.expertLib')
    onExpertLibChanged (val: boolean, oldVal: boolean) {
      if (!val && this.toolSelected === 'experts')
        this.toolSelected = ''
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#ToolBar {
  position: absolute;
  top: 70px;
  right: 20px; /*no*/
  background: #fff;
  box-shadow: 0 0 10px #8d9db5; /*no*/
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px); /*no*/
    opacity: 0;
  }
  ul.tool-bar-wrapper {
    float: left;
    li {
      float: left;
      width: 36px; /*no*/
      height: 36px; /*no*/
      cursor: pointer;
      &.video {
        background: url(~Img/DecisionCommand/toolbar.png) no-repeat 0 0 / 800% 200%;
        &:hover, &.on { background: url(~Img/DecisionCommand/toolbar.png) no-repeat 0 100% / 800% 200%; }
      }
      &.disaster {
        background: url(~Img/DecisionCommand/toolbar_disaster.png) no-repeat 0 0 / 100% 200%;
        &:hover, &.on { background: url(~Img/DecisionCommand/toolbar_disaster.png) no-repeat 0 100% / 100% 200%; }
      }
      &.ship {
        background: url(~Img/DecisionCommand/toolbar.png) no-repeat 14.2% 0 / 800% 200%;
        &:hover, &.on { background: url(~Img/DecisionCommand/toolbar.png) no-repeat 14.2% 100% / 800% 200%; }
      }
      &.area {
        background: url(~Img/DecisionCommand/toolbar.png) no-repeat 28.4% 0 / 800% 200%;
        &:hover, &.on { background: url(~Img/DecisionCommand/toolbar.png) no-repeat 28.4% 100% / 800% 200%; }
      }
      &.resocure {
        background: url(~Img/DecisionCommand/toolbar.png) no-repeat 42.6% 0 / 800% 200%;
        &:hover, &.on { background: url(~Img/DecisionCommand/toolbar.png) no-repeat 42.6% 100% / 800% 200%; }
      }
      &.experts {
        background: url(~Img/DecisionCommand/toolbar.png) no-repeat 56.8% 0 / 800% 200%;
        &:hover, &.on { background: url(~Img/DecisionCommand/toolbar.png) no-repeat 56.8% 100% / 800% 200%; }
      }
      &.search {
        background: url(~Img/DecisionCommand/toolbar.png) no-repeat 71% 0 / 800% 200%;
        &:hover, &.on { background: url(~Img/DecisionCommand/toolbar.png) no-repeat 71% 100% / 800% 200%; }
      }
      &.nav {
        background: url(~Img/DecisionCommand/toolbar.png) no-repeat 85.2% 0 / 800% 200%;
        &:hover, &.on { background: url(~Img/DecisionCommand/toolbar.png) no-repeat 85.2% 100% / 800% 200%; }
      }
      &.measure {
        background: url(~Img/DecisionCommand/toolbar.png) no-repeat 100% 0 / 800% 200%;
        &:hover, &.on { background: url(~Img/DecisionCommand/toolbar.png) no-repeat 100% 100% / 800% 200%; }
      }
    }
  }
  .extend-btn {
    position: relative;
    float: right;
    width: 72px; /*no*/
    height: 36px; /*no*/
    line-height: 36px; /*no*/
    text-align: center;
    text-indent: 10px; /*no*/
    color: #a2a2a2;
    cursor: pointer;
    &:hover {
      color: $themeColor;
      text-decoration: underline;
      &::after {
        background: url(~Img/DecisionCommand/extend.png) no-repeat calc(100%/3) 0 / 400% 100%;
      }
    }
    &::after {
      position: absolute;
      content: '';
      top: 12px; /*no*/
      left: 8px; /*no*/
      width: 6px; /*no*/
      height: 10px; /*no*/
      background: url(~Img/DecisionCommand/extend.png) no-repeat 0 0 / 400% 100%;
    }
    &.on::after {
      transform: rotate(180deg);
    }
  }
}
</style>