<template>
  <main id="VideoMonitor" class="decision-popup" v-drag>
    <header>
      <span>视频监控</span>
      <a @click="closeFunc"></a>
    </header>
    <div class="content">
      <ul class="cf decision-chk-group">
        <li v-for="el of videoList" :key="el.key" :class="{on: el.selected}" @click="toggleVideo(el)">
          <em></em>
          <span>{{ el.name }}</span>
        </li>
      </ul>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { videoClient } from '@/util/ClientHelper'

  let L: any = null,
      zmap: any = null

  @Component
  export default class VideoMonitor extends Vue {
    @Prop({ default: Function }) closeFunc
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storeVideoDetailInfo_global') storeVideoDetailInfo_global
    isCompomentAlive: boolean = true
    videoList: any[] = [
      { key: 'typhoon', name: '水库监控', selected: false },
      { key: 'rain', name: '林火监控', selected: false },
      { key: 'wind', name: '公安监控', selected: false },
      { key: 'thunder', name: '公共视频', selected: false }
    ]
    videoSelected: any[] =[]
    videoInfo: any = {}

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      this.toggleVideo(this.videoList[0])
    }
    
    beforeDestroy() {
      L = null
      zmap = null
      this.isCompomentAlive = false
    }

    toggleVideo(el) {
      el.selected = !el.selected
      if (el.selected) {
        this.getVideoInfo(el.key)
      } else {
        this.clearInfo(el.key)
      }
    }

    async getVideoInfo(type) {
      let res = await videoClient.findVideoInfo()
      console.log(res)
      // if (!this.isCompomentAlive) return
      // if (!res) {
      //   Vue['prototype']['$message']({ type: 'error', message: '视频数据获取失败' })
      //   return
      // }
      // this.videoInfo = res
      // this.addVideoInfo()
    }

    addVideoInfo() {
      // this.storeVideoDetailInfo_global(info)
      // this.storePopupStatus_global({ key: 'videoDetail', action: true })
    }

    clearInfo(type) {

    }
  }
</script>

<style lang='scss' scoped>
#VideoMonitor {
  position: absolute;
  top: 0;
  left: 60px;
  width: 225px;
  .content {
    padding: 10px 17px;
  }
}
</style>