<template>
  <main id="WindPicking" :style="{top: info.pos.y + 10 + 'px',left: info.pos.x + 10 + 'px'}">
    <div class="col cf">
      <div class="text">风速：</div>
      <div class="val">{{ windVel }}</div>
    </div>
    <div class="col cf">
      <div class="text">风向：</div>
      <div class="val">{{ `${info.dirDes} (${Math.floor(info.dir * 100) / 100}°)` }}</div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class WindPicking extends Vue {
    @Getter('decisionStore/windPickingValue_global') info
    get windVel() {
      let str = ''
      if (this.info.vel > 300) str = '---'
      else str = `${this.info.velDes} (${Math.floor(this.info.vel * 100) / 100}m/s)`
      return str
    }
  }
</script>

<style lang='scss' scoped>
#WindPicking {
  position: absolute;
  z-index: 100;
  padding: 10px;
  width: 170px;
  background: #fff;
  box-shadow: 0 0 5px #8d9db5;
  .col {
    height: 24px;
    line-height: 24px;
    .text {
      float: left;
      width: 50px;
      color: #777;
    }
    .val {
      float: left;
      width: 120px;
    }
  }
}
</style>