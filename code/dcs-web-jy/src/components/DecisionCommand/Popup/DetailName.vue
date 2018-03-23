<template>
  <main id="detailName" :style="{ top: info.pos.y - 15 + 'px', left: info.pos.x + 'px' }">
    {{ info.name }}
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class detailName extends Vue {
    @Getter('decisionStore/detailNameInfo_global') info
  }
</script>

<style lang='scss' scoped>
#detailName {
  z-index: 1;
  position: absolute;
  transform: translate(-50%, -100%);
  background: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px #8d9db5;  
}
</style>