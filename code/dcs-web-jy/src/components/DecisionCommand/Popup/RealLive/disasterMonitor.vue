<template>
  <div class="wrapper" id="DisasterMonitor">
    <ul class="cf decision-chk-group">
      <li v-for="el of disasterMonitorOpts" :key="el.key"
          :class="{on: el.isSelected}" @click="toggleOpts(el)">
        <em></em>
        <span>{{ el.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { disasterMoniterClient } from '@/util/ClientHelper'

  let L: any = null,
      zmap: any = null

  @Component
  export default class DisasterMonitor extends Vue {
    @Prop() isPanelShow
    @Getter('decisionStore/region_global') region_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storedetailNameInfo_global') storedetailNameInfo_global
    @Action('decisionStore/storeDisasterDetailInfo_global') storeDisasterDetailInfo_global

    isCompomentAlive: boolean = true
    disasterMonitorOpts: any[] = [
      { key: 'waterlog', name: '内涝', isSelected: false },
      { key: 'geol', name: '地质灾害', isSelected: false },
      { key: 'forest', name: '森林火险', isSelected: false },
      { key: 'torrent', name: '山洪', isSelected: false },
    ]

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
    }

    beforeDestroy() {
      for (let el of this.disasterMonitorOpts) {
        if (el.isSelected)
          this.removeOpts(el.key)
      }
      this.closeAllDetailPopup()
      this.storeDisasterDetailInfo_global({})
      L = null
      zmap = null
      this.isCompomentAlive = false
    }

    @Watch('isPanelShow')
    onisPanelShowChanged (val: boolean, oldVal: boolean) {
      if (!val) return
      let flag = false
      for (let el of this.disasterMonitorOpts) {
        if (el.isSelected) {
          flag = true
          break
        }
      }
      if (flag) return
      this.toggleOpts(this.disasterMonitorOpts[0])
    }

    toggleOpts(el) {
      el.isSelected = !el.isSelected
      if (el.isSelected) this.addDisasterMonitor(el.key)
      else {
        this.storePopupStatus_global({ key: el.key + 'Detail', action: false })
        this.removeOpts(el.key)
      }
    }

    closeAllDetailPopup() {
      for (let el of this.disasterMonitorOpts) {
        this.storePopupStatus_global({ key: el.key + 'Detail', action: false })
      }
    }

    async addDisasterMonitor(type) {
      let res
      if (type === 'forest')
        res = await disasterMoniterClient.getForestPoi()
      else
        res = await disasterMoniterClient.selectByGeoId(type, this.region_global.cityId)
      if (!this.isCompomentAlive) return
      if (!res) {
        Vue['prototype']['$message']({ type: 'error', message: '数据获取失败' })
        return
      }
      if (!res.length) {
        Vue['prototype']['$message']({ type: 'warning', message: '暂无该类型数据' })
        return
      }
      for (let el of res) {
        let marker = L.marker([el.lat, el.lon], {
          icon: L.icon({
            iconUrl: `static/img/DecisionCommand/modelIcon/${type}/green.png`,
            iconSize: [25, 40],
            iconAnchor: [12.5, 20]
          })
        })
        marker.on('mouseover', e => {
          let x = e.containerPoint.x,
              y = e.containerPoint.y - 10
          let name = type === 'forest' ? el.address : el.name
          if (!name) return
          let dist = {
            name,
            pos: { x, y }
          }
          this.storedetailNameInfo_global(dist)
          this.storePopupStatus_global({ key: 'detailName', action: true })
        })
        marker.on('mouseout', e => {
          this.storePopupStatus_global({ key: 'detailName', action: false })
          this.storedetailNameInfo_global(null)
        })
        marker.on('click', e => {
          this.storePopupStatus_global({ key: 'detailName', action: false })
          this.storedetailNameInfo_global(null)
          this.closeAllDetailPopup()
          // let x = e.containerPoint.x,
          //     y = e.containerPoint.y
          // el.pos = { x, y }
          el.latlon = el.lon.toFixed(2) + (el.lon >= 0 ? '°E' : '°W') + ', ' + el.lat.toFixed(2) + (el.lat >= 0 ? '°N' : '°S')
          this.storeDisasterDetailInfo_global(el)
          this.storePopupStatus_global({ key: type + 'Detail', action: true })
        })
        marker.id = type
        marker.addTo(zmap)
      }
    }

    removeOpts(type) {
      zmap.eachLayer(e => {
        if (e.id === type)
          zmap.removeLayer(e)
      })
    }
  }
</script>

<style lang='scss' scoped>
#DisasterMonitor {
  
}
</style>