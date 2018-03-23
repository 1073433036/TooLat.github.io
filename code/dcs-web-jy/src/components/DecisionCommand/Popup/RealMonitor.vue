<template>
  <main id="RealMonitor" class="decision-popup" v-drag>
    <header>
      <span>实时监控</span>
      <a @click="storePopupStatus_global({ key: 'realMonitor', action: false })"></a>
    </header>
    <div class="content">
      
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class RealMonitor extends Vue {
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global

  }
</script>

<style lang='scss' scoped>
#RealMonitor {
  position: absolute;
  top: 280px;
  right: 110px;
  width: 500px;
  .content {
    height: 300px;
  }
}
</style>