<template>
  <main id="WarningSystemEntry">
    <rain-warning />
    <wind-warning />
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import RainWarning from './RainWarning.vue'
  import WindWarning from './WindWarning.vue'

  @Component({
    components: {
      RainWarning,
      WindWarning
    }
  })
  export default class WarningSystemEntry extends Vue {
  
  }
</script>

<style lang='scss' scoped>
#WarningSystemEntry{
  
}
</style>