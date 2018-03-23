<template>
  <main id="RainWarning">
    
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { productClient, userThresholdsClient } from '../../util/clientHelper'
  import { rainWarningDefault } from '../../config/thresholdConf'
  import moment from 'moment'

  let stationInfo = {}

  @Component
  export default class RainWarning extends Vue {
    @Getter('systemStore/resetThresholdp_global') resetThresholdp_global: any
    intervalHolder: any = null
    rainWarningInfo: any = {}

    async mounted() {
      await this.getStationInfo()
      this.getStationData()
      this.intervalHolder = setInterval(this.getStationData, 5*60*1000)
    }

    beforeDestroy() {
      clearInterval(this.intervalHolder)
      this.intervalHolder = null
    }

    async getStationInfo() {
      let res = await productClient.findStationInfo('a', sessionStorage.cityname)
      if (res) {
        let obj = {}
        for (let item of res) {
          obj[item.station_id] = item
        }
        stationInfo = obj
      }
    }

    async getStationData() {
      for (let i in stationInfo) {
        stationInfo[i].datetime = null
        stationInfo[i].elems = null
      }
      let datetime: any = Date.now() - Date.now()%(5*60*1000)
      datetime = moment(datetime).format('YYYY-MM-DD HH:mm:00')
      // datetime = '2017-10-12 10:00:00'
      let res = await productClient.findStationData('a', datetime, sessionStorage.cityname)
      if (!res || !res.length) return
      for (let opt of res) {
        let id = opt.id
        if (stationInfo[id]) {
          stationInfo[id].datetime = opt.datetime
          stationInfo[id].elems = opt.elems
        }
      }
      console.log(stationInfo)
    }

    async getRainWarningThreshold() {
      let userid = sessionStorage.userId
      let res = await userThresholdsClient.getUserThreshold(userid)
      this.rainWarningInfo = res || Object.assign({ userid }, rainWarningDefault)
    }
    
    @Watch('resetThresholdp_global.RainWarning')
    onRainWarningChanged (val: boolean, oldVal: boolean) {
      this.getRainWarningThreshold()
    }
  }
</script>

<style lang='scss' scoped>
#RainWarning{
  
}
</style>