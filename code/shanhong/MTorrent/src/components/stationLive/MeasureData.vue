<template>
  <main id="MeasureData">
    24小时降水
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  let L,zmap

  @Component
  export default class MeasureData extends Vue {
    @Prop() date: string
    @Prop() hour: string
    @Prop() minute: string

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
    }
  }
</script>

<style lang='scss' scoped>
#MeasureData{
  position: relative;
}
</style>