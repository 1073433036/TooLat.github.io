<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import { Getter } from 'vuex-class'

  @Component
  export default class App extends Vue {
    @Getter('systemStore/systemTitle_global') systemTitle

    mounted(): void {
      document.title = this.systemTitle;
    }
  }
</script>

<style lang="scss" scoped>
  #app {
    width: 100%;
    height: 100%;
    position: relative;
    font-family: "Arial","sans-serif",'Microsoft YaHei';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
