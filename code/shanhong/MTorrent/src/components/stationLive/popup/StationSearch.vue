<template>
  <main id="StationSearch" class="global-popup" v-drag>
    <header>
      <span>站点搜索</span>
      <em @click="storePopupStatus_global({ key: 'StationSearch', action: false })"></em>
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
  export default class StationSearch extends Vue {
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
  }
</script>

<style lang='scss' scoped>
#StationSearch{
  position: absolute;
  top: 110px;
  right: 10px;
  width: 300px;
  .content {
    height: 200px;
  }
}
</style>