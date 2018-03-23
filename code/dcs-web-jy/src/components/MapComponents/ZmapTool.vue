<template>
  <main id="ZmapTool">
    <!-- <div class="latlng">{{ latlng }}</div> -->
    <div :class="['tool', {up: typhTimelineStatus_global !== 'search'}]">
      <div class="review box" @click.stop="review" title="恢复初始位置"></div>
      <div class="zoom-in box" @click.stop="zoomIn" title="放大"></div>
      <div class="zoom-out box" @click.stop="zoomOut" title="缩小"></div>
      <div class="map-layer box" @mouseenter="layerPanel = true" @mouseleave="layerPanel = false">
        <!-- <div class="inner" :class="zmapLayer_global">
          <span>{{ layers.find(el => el.key === zmapLayer_global) 
              && layers.find(el => el.key === zmapLayer_global).name }}</span>
        </div> -->
        <transition name="slide-fade">
          <div class="layer-panel" v-if="layerPanel">
            <div class="layer-gap"></div>
            <ul class="cf">
              <li v-for="el of layers" :class="[el.key, {'on': el.key === zmapLayer_global}]"
                  @click.stop="toggleLayer(el.key)" :key="el.key">
                <span>{{ el.name }}</span>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  let zmap: any
  interface LayerInfo {
    key: string,
    name: string
  }

  @Component
  export default class ZmapTool extends Vue {
    @Getter('decisionStore/zmapLayer_global') zmapLayer_global
    @Getter('decisionStore/zmapViewer_global') zmapViewer_global
    @Getter('decisionStore/typhTimelineStatus_global') typhTimelineStatus_global
    @Action('decisionStore/storeZmapLayer_global') storeZmapLayer_global

    latlng: string = '113.154, 23.085'
    layerPanel: boolean = false
    layers: LayerInfo[] = [
      { key: 'tianditu', name: '天地图' },
      { key: 'satellite', name: '卫星图' },
      { key: 'business', name: '业务图' },
      { key: 'terrain', name: '地形图' },
    ]

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

    toggleLayer(key) {
      this.storeZmapLayer_global(key)
      // this.layerPanel = false
    }
  }
</script>

<style lang='scss' scoped>
@import '../../styles/theme.scss'; 
#ZmapTool{
  z-index: 9;
  .latlng {
    position: absolute;
    width: 105px; /*no*/
    height: 24px; /*no*/
    bottom: 20px; /*no*/
    left: 20px; /*no*/
    line-height: 24px; /*no*/
    text-align: center;
    background: #fff;
    border-radius: 2px; /*no*/
    box-shadow: 0 0 3px #8d9db5; /*no*/
  }
  .tool {
    position: absolute;
    left: 20px; /*no*/
    bottom: 40px; /*no*/
    transition: all .3s linear;
    &.up {
      transform: translateY(-128px); /*no*/
    }
    .box {
      width: 30px; /*no*/
      height: 30px; /*no*/
      box-shadow: 0 0 3px #8d9db5; /*no*/
      cursor: pointer;
    }
    .review {
      margin-bottom: 5px; /*no*/
      background: #fff url(~Img/zmaptool/map-tool.png) no-repeat 0 0 / 400% 200%;
      &:hover{
        background: #fff url(~Img/zmaptool/map-tool.png) no-repeat 0 100% / 400% 200%;
      }
    }
    .zoom-in {
      background: #fff url(~Img/zmaptool/map-tool.png) no-repeat 33.3% 0 / 400% 200%;
      &:hover{
        background: #fff url(~Img/zmaptool/map-tool.png) no-repeat 33.3% 100% / 400% 200%;
      }
    }
    .zoom-out {
      background: #fff url(~Img/zmaptool/map-tool.png) no-repeat 66.6% 0 / 400% 200%;
      &:hover{
        background: #fff url(~Img/zmaptool/map-tool.png) no-repeat 66.6% 100% / 400% 200%;
      }
    }
    .map-layer {
      margin-top: 5px; /*no*/
      background: #fff url(~Img/zmaptool/map-tool.png) no-repeat 100% 0 / 400% 200%;
      &:hover{
        background: #fff url(~Img/zmaptool/map-tool.png) no-repeat 100% 100% / 400% 200%;
      }
    }
    .layer-panel {
      position: absolute;
      left: 30px; /*no*/
      bottom: 0; /*no*/
      height: 70px;
      width: 375px;
      font-size: 0;
      .layer-gap {
        width: 5px;
        height: 100%;
        display: inline-block;
        vertical-align: top;
      }
      ul {
        width: 360px;
        height: 100%;
        display: inline-block;
        vertical-align: top;
        background-color: #fff;
        padding-right: 10px;
        li {
          position: relative;
          margin-top: 10px;
          margin-left: 10px;
          float: left;
          width: 80px;
          height: 50px;
          border: 1px solid #fff; /*no*/
          box-sizing: border-box;
          cursor: pointer;
          span {
            position: absolute;
            display: inline-block;
            right: 0;
            bottom: 0;
            padding: 0 5px;
            height: 20px;
            line-height: 20px;
            color: #fff;
            font-size: 12px;
          }
          &.satellite {
            background: url(~Img/zmaptool/satellite.png) no-repeat 0 0 / 100% 100%;
          }
          &.terrain {
            background: url(~Img/zmaptool/terrain.png) no-repeat 0 0 / 100% 100%;
          }
          &.business {
            background: url(~Img/zmaptool/business.png) no-repeat 0 0 / 100% 100%;
            span {
              color: #555;
            }
          }
          &.tianditu {
            background: url(~Img/zmaptool/tianditu.png) no-repeat 0 0 / 100% 100%;
            span {
              color: #555;
            }
          }
          &.on, &:hover {
            border: 1px solid $themeColor; /*no*/
            span {
              color: #fff;
              background: $themeColor;
            }
          }
        }
      }
    }
    .slide-fade-enter-active, .slide-fade-leave-active {
      transition: all .3s ease;
    }
    .slide-fade-enter, .slide-fade-leave-to {
      transform: translateX(-10px); /*no*/
      opacity: 0;
    }
  }
}
</style>