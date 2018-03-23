<template>
  <main id="PhoneLive">
    <component :is="livePanelView" :liveData="dataForLive" :closeSelf="closeLivePanel"></component>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { RtmpClient } from '@/util/ClientHelper'
  import LivePanel from './LivePanel.vue'

  let L: any = null,
      zmap: any = null,
      layers: any[] = []

  @Component
  export default class PhoneLive extends Vue {
    requestInterval: any = null
    livePanelView: any = null
    liveList: any[] = []
    dataForLive: any = null

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']

      this.getLiveList()
        .then(() => {
          if (this.liveList.length === 0)
            Vue['prototype']['$message']({ type: 'warning', message: '当前没有直播' })
        })
      this.requestInterval = setInterval(() => {
        this.getLiveList()
      }, 10000)
    }
    
    beforeDestroy() {
      clearInterval(this.requestInterval)
      this.clearLayer()
      layers = []
      L = null
      zmap = null
    }

    closeLivePanel() {
      this.livePanelView = null
    }

    clearLayer() {
      if (!layers.length) return
      for (let el of layers)
        zmap.removeLayer(el)
      layers = []
    }

    async getLiveList() {
      let res = await RtmpClient.getLiveRoomList()
      this.clearLayer()
      this.liveList = []
      if (!res) return
      for (let el of res) {
        el.content = JSON.parse(el.content)
        let marker = L.marker([el.content.lat, el.content.lon], {
          icon: L.icon({
            iconUrl: 'static/img/DecisionCommand/phone_live.png',
            iconSize: [33, 39],
            iconAnchor: [16.5, 19.5]
          })
        })
        marker.on('click', e => {
          this.dataForLive = el
          this.livePanelView = LivePanel
        })
        marker.addTo(zmap)
        layers.push(marker)
      }
      this.liveList = res
      
      if (this.dataForLive) {
        let flag = res.find(el => el.chatid === this.dataForLive.chatid)
        if (!flag) {
          this.dataForLive = null
          this.livePanelView = null
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
#PhoneLive {
  
}
</style>