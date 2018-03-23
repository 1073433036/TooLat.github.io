<template>
  <main id="VideoSceen">
    <div></div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class VideoSceen extends Vue {
  
  }
</script>

<style lang='scss' scoped>
#VideoSceen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
</style>