<template>
  <main id="VideoDetail" v-drag :style="{ top: pos.y + 'px', left: pos.x + 'px' }" ref="panel">
    <header>
      <span>XX 水库</span>
      <i class="close-icon" @click="closePopup"></i>
    </header>
    <div class="content">
      <img :src="info.url">
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class VideoDetail extends Vue {
    @Getter('decisionStore/videoDetailInfo_global') info
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    pos: any = { x: 0, y: 0 }

    mounted() {
      this.computedPos()
    }

    computedPos() {
      let x = this.info.pos.x,
          y = this.info.pos.y
      let el = <HTMLDivElement>this.$refs.panel
      let elWidth = el.clientWidth,
          elHeight = el.clientHeight
      this.pos.x = x - elWidth / 2
      this.pos.y = (y - 20 < elHeight) ? (y + 20) : (y - elHeight - 20)
    }

    @Watch('info')
    oninfoChanged (val: any, oldVal: any) {
      if (val) this.computedPos()
    }

    closePopup() {
      this.storePopupStatus_global({ key: 'videoDetail', action: false })
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#VideoDetail {
  position: absolute;
  z-index: 1;
  width: 304px;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px #8d9db5;
  header {
    height: 25px;
    line-height: 25px;
    cursor: move;
    span {
      height: 25px;
      line-height: 25px;
      color: $themeColor;
    }
    i.close-icon {
      background: url(~Img/DecisionCommand/close_black.png) no-repeat 100% 0 / 200% 100%;
      width: 11.5px;
      height: 13px;
      position: absolute;
      top: 16px;
      cursor: pointer;
      right: 14px;
    }
  }
  .content {

  }
}
</style>