<template>
  <main id="MessageRelease" class="decision-popup" v-drag>
    <header>
      <span>信息发布</span>
      <a @click="closeFunc"></a>
    </header>
    <div class="content">
      <div class="tabs">
        <ul>
          <li v-for="(el, key) in tabOpts" :key="key"
              @click="tabSelected = key" :class="{on: tabSelected === key}">{{ el }}</li>
        </ul>
      </div>
      <component :is="currentView"></component>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import TargetRelease from './TargetRelease.vue'
  import ProvinceRelease from './ProvinceRelease.vue'
  import MessageMonitor from './MessageMonitor.vue'

  @Component
  export default class MessageRelease extends Vue {
    @Prop({ default: Function }) closeFunc
    tabOpts: any = {
      target: '靶向发布',
      prov: '省突发布',
      // message: '短信管理'
    }
    tabSelected: 'target' | 'prov' | 'message' = 'target'
    currentView: any = TargetRelease

    @Watch('tabSelected')
    ontabSelectedChanged (val: string, oldVal: string) {
      if (val === 'target') this.currentView = TargetRelease
      else if (val === 'prov') this.currentView = ProvinceRelease
      else this.currentView = MessageMonitor
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#MessageRelease {
  position: absolute;
  top: 0;
  left: 60px;
  width: 380px;
  .content {
    padding: 10px 20px;
    .tabs {
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      ul {
        li {
          display: inline-block;
          width: 70px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #777;
          background: #f5f5f5;
          cursor: pointer;
          &.on {
            color: #fff;
            background: $themeColor;
          }
          &:first-child ~ li{
            margin-left: 2px;
          }
        }
      }
    }
    .prov {
      position: relative;
    }
    .message {
      position: relative;
    }
  }
}
</style>