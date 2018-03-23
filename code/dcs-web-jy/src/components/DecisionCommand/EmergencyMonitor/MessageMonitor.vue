<template>
  <main id="MessageMonitor">
    未读短信
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class MessageMonitor extends Vue {
  
  }
</script>

<style lang='scss' scoped>
#MessageMonitor {
  
}
</style>