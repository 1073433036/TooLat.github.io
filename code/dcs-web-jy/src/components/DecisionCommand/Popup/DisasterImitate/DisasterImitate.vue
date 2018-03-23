<template>
  <main id="DisasterImitate" v-drag>
    <header>
      <span>灾情模拟</span>
      <i @click="storePopupStatus_global({ key: 'disasterImitate', action: false })">×</i>
    </header>
    <div class="content">
      <ul class="tabs">
        <li v-for="(el, key) in tabOpts" :key="key" @click="tabOptSelected = key"
            :class="{on: tabOptSelected === key}">{{ el }}</li>
      </ul>
      <component :is="currentView"></component>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import FireImitate from './FireImitate.vue'
  import PollutionImitate from './PollutionImitate.vue'

  @Component
  export default class DisasterImitate extends Vue {
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storeColorTable_global') storeColorTable_global
    tabOpts: any = {
      fire: '火情模拟',
      pollution: '污染扩散'
    }
    tabOptSelected: 'fire' | 'pollution' = 'fire'
    currentView: any = FireImitate

    mounted() {
      this.storeColorTable_global({ type: 'add', data: { type: 'fire', flag: 'fire', label: '火情模拟' } })
    }

    beforeDestroy() {
      this.storeColorTable_global({ type: 'delete', data: { type: this.tabOptSelected, flag: this.tabOptSelected } })
      this.storePopupStatus_global({ key: 'modelResult', action: false })
    }

    @Watch('tabOptSelected')
    ontabOptsChanged (val: any, oldVal: any) {
      this.storeColorTable_global({ type: 'delete', data: { type: oldVal, flag: oldVal } })
      this.storeColorTable_global({ type: 'add', data: { type: val, flag: val, label: val === 'fire' ? '火情模拟' : '污染模拟' } })
      this.storePopupStatus_global({ key: 'modelResult', action: false })
      switch(val) {
        case 'fire': this.currentView = FireImitate; break;
        case 'pollution': this.currentView = PollutionImitate; break;
      }
    }
  }
</script>

<style lang='scss'>
@import '../../../../styles/theme.scss';
#DisasterImitate {
  z-index: 1;
  position: absolute;
  top: 116px; /*no*/
  right: 80px; /*no*/
  width: 376px;
  background: #fff;
  box-shadow: 0 0 10px #8d9db5;
  header {
    height: 30px;
    line-height: 30px;
    text-indent: 10px;
    font-weight: bold;
    cursor: move;
    color: #1c1c1c;
    i {
      position: absolute;
      top: 0;
      right: 10px;
      display: inline-block;
      width: 30px;
      height: 30px;
      font-size: 26px;
      line-height: 30px;
      text-align: center;
      text-indent: 0;
      color: #9c9fa7;
      cursor: pointer;
      &:hover { color: #1c1c1c; }
    }
  }
  .content {
    padding: 0 10px 10px;
    ul.tabs {
      display: flex;
      justify-content: center;
      li {
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        background: #f2f2f2;
        &.on {
          color: #fff;
          background: $themeColor;
        }
      }
    }
    .progress-wrapper {
      position: absolute;
      width: 100%;
      height: 24px; /*no*/
      display: flex;
      justify-content: center;
      >svg {
        polygon {
          fill: #faebdd;
          &.on { fill: #f3a459; }
          &.error { fill: #ff6f6f; }
        }
        &:not(:first-child) { margin-left: -7px; /*no*/ }
      }
      .step {
        display: inline-block;
        width: 74px; /*no*/
        height: 24px; /*no*/
        line-height: 24px; /*no*/
        text-align: center;
        color: #f3a459;
        &.on { color: #fff; }
        &:first-child { text-indent: -5px; /*no*/ }
        &:last-child { text-indent: 5px; /*no*/ }
        &:not(:first-child) { margin-left: -7px; /*no*/ }
      }
    }
    .info {
      position: relative;
      margin-top: 10px;
      height: 30px;
      line-height: 30px;
      &.point {
        margin-top: 5px;
        i {
          position: absolute;
          top: 6px;
          left: 3.5px;
          display: inline-block;
          width: 13px;
          height: 16px;
          background: url(~Img/DecisionCommand/toolbar_disaster_nav.png) no-repeat center / 100% 100%;
        }
        span {
          position: absolute;
          top: 0;
          left: 20px;
          display: inline-block;
          max-width: 330px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #aaa;
          cursor: pointer;
          &:hover {
            color: #666;
            text-decoration: underline;
          }
        }
      }
      .text {
        float: left;
        width: 23%;
      }
      .val {
        float: left;
        width: 77%;
        input {
          width: 205px;
          height: 30px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          &[type="text"] {
            padding: 0 10px;
          }
          &[type="number"] {
            padding-left: 10px;
          }
          &::-webkit-input-placeholder { color: #999; }
          &:-moz-placeholder { color: #999; }
          &::-moz-placeholder { color: #999; }
          &:-ms-input-placeholderr { color: #999; }
        }
        select {
          width: 205px;
          height: 30px;
          box-sizing: border-box;
          background: #f2f2f2;
          border-color: #f2f2f2;
        }
      }
    }
    .btn-wrapper {
      margin-top: 10px;
      position: relative;
      height: 24px;
      line-height: 24px;
      .primary-btn {
        display: inline-block;
        margin-left: 105px;
        width: 80px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        color: #fff;
        background: $themeColor;
        cursor: pointer;
        &:hover { background: rgba(17, 169, 245, .8); }
        &.plain {
          color: $themeColor;
          background: #fff;
          &:hover { background: #fdfafa; }
        }
      }
      .record {
        display: inline-block;
        margin-left: 20px;
        color: $themeColor;
        cursor: pointer;
        user-select: none;
        &:hover { text-decoration: underline; }
      }
    }
    .record-wrapper {
      margin-top: 10px;
      border-top: 1px solid #d7d7d7;
      ul {
        margin-top: 10px;
        height: 120px;
        overflow-y: auto;
        overflow-x: hidden;
        border: 1px solid #d7d7d7;
        border-radius: 4px;
        li {
          position: relative;
          box-sizing: border-box;
          height: 24px;
          line-height: 24px;
          color: #545454;
          cursor: pointer;
          &.on, &:hover { background: #dfe7f3; }
          span {
            position: absolute;
            top: 0;
            left: 15px;
            display: inline-block;
            width: 300px;
            height: 24px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          i {
            position: absolute;
            top: 0;
            left: 315px;
            display: inline-block;
            width: 24px;
            height: 24px;
            color: #999;
            text-align: center;
            font-size: 28px;
            &:hover { color: $themeColor; }
          }
        }
      }
    }
  }
}
</style>