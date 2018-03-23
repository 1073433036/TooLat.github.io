<template>
  <main id="RainPicking" :style="{top: info.pos.y + 10 + 'px',left: info.pos.x + 10 + 'px'}">
    <div class="col cf">
      <div class="text">雨量：</div>
      <div class="val">{{ `${Math.floor(info.val * 100) / 100}mm` }}</div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class RainPicking extends Vue {
    @Getter('decisionStore/rainPickingValue_global') info
  }
</script>

<style lang='scss' scoped>
#RainPicking {
  position: absolute;
  z-index: 100;
  padding: 10px;
  width: 130px;
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
      width: 60px;
    }
  }
}
</style>