<template>
  <main id="ZmapTool">
    <div class="latlng">{{ latlng }}</div>
    <div class="tool">
      <div class="zoom-in box" @click="zoomIn" title="放大"></div>
      <div class="zoom-out box" @click="zoomOut" title="缩小"></div>
      <div class="review box" @click="review" title="恢复初始位置"></div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  let zmap: any

  @Component
  export default class ZmapTool extends Vue {
    @Getter('systemStore/zmapViewer_global') zmapViewer_global: any

    latlng: string = '113.154, 23.085'

    mounted() {
      let global: any = <any>window
      zmap = global['zmap']
      zmap.on('mousemove', pos => {
        this.latlng = pos.latlng.lng.toFixed(3) + ', ' + pos.latlng.lat.toFixed(3)
      })
    }

    zoomIn() {
      zmap.zoomIn()
    }
    zoomOut() {
      zmap.zoomOut()
    }
    review() {
      zmap.setView(this.zmapViewer_global.center, this.zmapViewer_global.zoom)
    }
  }
</script>

<style lang='scss' scoped>
#ZmapTool{
  .latlng {
    position: absolute;
    width: 105px;
    height: 24px;
    bottom: 10px;
    left: 10px;
    line-height: 24px;
    text-align: center;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 0 3px rgba(0, 0, 0, .35);
  }
  .tool {
    position: absolute;
    right: 10px;
    bottom: 10px;
    .box {
      width: 30px;
      height: 30px;
      box-shadow: 0 0 3px rgba(0, 0, 0, .35);
      cursor: pointer;
    }
    .zoom-in { background: #fff url(~Img/zmaptool/zoomIn.png) no-repeat center; }
    .zoom-out {
      margin-top: 1px;
      background: #fff url(~Img/zmaptool/zoomOut.png) no-repeat center;
    }
    .review {
      margin-top: 20px;
      background: #fff url(~Img/zmaptool/review.png) no-repeat center;
    }
  }
}
</style>