<template>
  <main id="ColorBar" :style="{bottom: popupStatus_global.rainColorsBar ? '40px' : '10px'}">
    <ul>
      <li v-for="(el, key) in elements" :key="key" v-show="colorbar_global[key]">
        <span>{{ el.unit }}</span>
        <img :src="el.url">
      </li>
    </ul>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import swamUrlConf from '../../config/swanUrlConf'

  @Component
  export default class ColorBar extends Vue {
    @Getter('systemStore/colorbar_global') colorbar_global
    @Getter('systemStore/popupStatus_global') popupStatus_global

    elements: any = {
      rain: { url: swamUrlConf.qpeColorBar, unit: 'QPE [mm]' },
      mtop: { url: swamUrlConf.mtopColorBar, unit: '回波顶高 [dBz]' },
      mcr: { url: swamUrlConf.mcrColorBar, unit: '组合反射率 [dBz]' },
      mvil: { url: swamUrlConf.mvilColorBar, unit: '液态降水 [kg/m2]' },
      cappi: { url: swamUrlConf.cappiColorBar, unit: 'CAPPI [dBz]' },
    }
  }
</script>

<style lang='scss' scoped>
#ColorBar{
  position: absolute;
  bottom: 10px;
  left: 125px;
  ul {
    background: rgba(172, 175, 177, 0.34);
    border-radius: 2px;
    li {
      position: relative;
      width: 520px;
      height: 28px;
      line-height: 28px;
      span {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 110px;
        text-indent: 10px;
        white-space: nowrap;
      }
      img {
        position: absolute;
        top: 2px;
        left: 110px;
        width: 400px;
        height: 24px;
      }
    }
  }
}
</style>