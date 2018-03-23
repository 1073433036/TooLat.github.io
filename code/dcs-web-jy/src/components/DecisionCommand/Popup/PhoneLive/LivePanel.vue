<template>
  <main id="LivePanel" class="decision-popup" v-drag>
    <header>
      <span>直播者: {{ liveData.content.anchorName }}</span>
      <span>地址: {{ liveData.content.address }}</span>
      <a @click="closeSelf"></a>
    </header>
    <div class="content">
      <object width="100%" height="100%">
        <embed wmode="transparent" bgcolor="#000"  id="rtmp-player" src="./static/RtmpStreamer.swf" 
            width="100%" height="100%" allowScriptAccess="always" quality="best" type="application/x-shockwave-flash"></embed>
      </object>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { RtmpStreamer } from "./rtmp-streamer.min"
  import { geoClient, RtmpClient } from '@/util/ClientHelper'

  let player, streamer

  @Component
  export default class LivePanel extends Vue {
    @Prop() closeSelf
    @Prop() liveData

    async created() {
      let urls = this.liveData.rtmpurl.split('/')
      let name = urls.pop()
      let url = urls.join("/")
      console.log(url)
      window['setSWFIsReady'] = function () {
        player = document.getElementById('rtmp-player')
        player.play(url, name)
      }
    }
  }
</script>

<style lang='scss' scoped>
#LivePanel {
  position: absolute;
  top: 50vh;
  left: 50vw;
  margin: -300px 0 0 -500px;
  width: 1000px;
  .content {
    position: relative;
    box-sizing: border-box;
    padding: 15px;
    height: 570px;
    embed {
      border: 1px solid #ddd;
    }
  }
}
</style>