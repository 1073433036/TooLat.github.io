<template>
  <main id="map-control">
    <div class="zoom-in box" @click.stop="zoomIn" title="放大"></div>
    <div class="zoom-out box" @click.stop="zoomOut" title="缩小"></div>
    <div class="review box" @click.stop="review" title="复位"></div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Prop } from 'vue-property-decorator'

  @Component
  export default class ZmapTool extends Vue {
    @Prop()
    center: number[]

    @Prop()
    map: any

    zoomIn() {
      this.map && this.map.zoomIn();
    }
    zoomOut() {
      this.map && this.map.zoomOut();
    }
    review() {
      this.map && this.map.setView(this.center, 8);
    }
  }
</script>

<style lang='scss' scoped>
#map-control{
  position: absolute;
  right: 10px;
  bottom: 10px;
  .box {
    width: 30px;
    height: 30px;
    box-shadow: 0 0 3px rgba(0, 0, 0, .35);
    cursor: pointer;
  }
  .zoom-in { 
    background: #fff url(~Img/zmaptool/zoomIn.png) no-repeat center; 
  }
  .zoom-out {
    margin-top: 1px;
    background: #fff url(~Img/zmaptool/zoomOut.png) no-repeat center;
  }
  .review {
    margin-top: 20px;
    background: #fff url(~Img/zmaptool/review.png) no-repeat center;
  }
}
</style>