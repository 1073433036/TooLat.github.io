<template>

  <div id="serviceIframe-div">

    <iframe @load="loaded" ref="iframeRef" frameborder=0 width="100%" height="100%" :src="iframeStr">

    </iframe>

  </div>


</template>


<script lang="ts">

  import Vue from 'vue'
  import {Component, Prop, Watch} from 'vue-property-decorator'
  @Component
  export default class serviceIframe extends Vue {
    @Prop() iframeStr: string
    mounted(){
//      let iframeRef = <HTMLDivElement>this.$refs.iframeRef
    }
    loaded() {
      
    }

    @Watch('iframeStr')
    iframeStrDidChange(){
//      alert(this.iframeStr)
    }
  }
</script>

<style lang="scss" scoped>
  #serviceIframe-div {
    position: relative;
    height: 100%;
    width: 100%;
    iframe {
      height: 100%;
      width: 100%;
    }
  }


</style>
