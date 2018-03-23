<template>
  <main class="wrapper" id="ShipMonitor">
    <ul class="decision-chk-group cf">
      <li :class="{on: isShipLoaded}" @click="toggleShipInfo">
        <em></em>
        <span>AIS</span>
      </li>
    </ul>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { shipClient } from '@/util/ClientHelper'

  let L: any = null,
      zmap: any = null,
      shipInfoMarker = {}
  const shipDetailDist = {
    MMSI: '船舶唯一标识',
    NAME_EN: '英文名称',
    CALLSIGN: '观察船呼号',
    V05001: '纬度',
    V06001: '经度',
    COURSE: '航线',
    SOG: '对地航速',
    STATE: '状态',
    LENGTH: '船身长度',
    WIDTH: '船身宽度',
    IMO: '船舶名称代码',
    DRAUGHT: '吃水受限',
    VESSELTYPE: '船舶类型',
    AISCLASS: '船舶设备',
    DEST: '目的地',
    ETA: '预计到达时间',
    DEVICETYPE: '设备类型',
  }
  const createPopup = (opt: ShipDetail) => {
    let ul = ''
    for (let i in shipDetailDist) {
      ul += `<li>
        <span class="name">${shipDetailDist[i]}</span>
        <span class="val">${opt[i] || '---'}</span>
      </li>`
    }
    return L.popup({
      className: 'ship-detail-popup',
      closeButton: false
    }).setContent(`
      <section class="ship-detail-wrapper">
        <ul>${ul}</ul>
      </section>
    `)
  }
  

  @Component
  export default class ShipMonitor extends Vue {
    @Prop() isPanelShow
    bound = {
      latStart: 21.31,
      latEnd: 23.785,
      lonStart: 115.455,
      lonEnd: 117.444,
    }
    shipInfo: any = {}
    isShipLoaded: boolean = false
    intervalHolder: any = null
    
    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      this.intervalHolder = setInterval(() => {
        if (this.isShipLoaded) this.getCurrentShip()
      }, 5*60*1000)
    }
    
    beforeDestroy() {
      clearInterval(this.intervalHolder)
      this.removeShip()
      L = null
      zmap = null
    }

    @Watch('isPanelShow')
    onisPanelShowChanged (val: boolean, oldVal: boolean) {
      if (val && !this.isShipLoaded)
        this.toggleShipInfo()
    }

    toggleShipInfo() {
      this.isShipLoaded = !this.isShipLoaded
      if (this.isShipLoaded)
        this.getCurrentShip()
      else
        this.removeShip()
    }

    async getCurrentShip() {
      let latStart = this.bound.latStart,
          latEnd = this.bound.latEnd,
          lonStart = this.bound.lonStart,
          lonEnd = this.bound.lonEnd
      let res: ShipInfo | false = await shipClient.getCurrentShip(latStart, latEnd, lonStart, lonEnd)
      if (!res) {
        Vue['prototype']['$message']({ type: 'error', message: '船舶数据获取失败' })
        return
      }
      this.shipInfo = res

      this.addShip()
    }

    // async getShip() {
    //   let latStart = this.bound.latStart,
    //       latEnd = this.bound.latEnd,
    //       lonStart = this.bound.lonStart,
    //       lonEnd = this.bound.lonEnd
    //   let time
    //   let res: ShipInfo | false = await shipClient.getShip(time, latStart, latEnd, lonStart, lonEnd)
    // }

    addShip() {
      this.removeShip()
      for (let type in this.shipInfo) {
        shipInfoMarker[type] = []
        let el = this.shipInfo[type]
        for (let opt of el) {
          let popupHolder = createPopup(opt)

          let marker = L.angleMarker([opt.V05001, opt.V06001], {
            icon: new L.Icon({
              iconUrl: `static/img/DecisionCommand/ais/${type}.png`,
              iconSize: [8, 25.5],
              iconAnchor: [4, 12.75]
            }),
            iconAngle: opt.COG / 10,
            iconOrigin: '0% 100%',
            zIndexOffset: -1
          }).bindPopup(popupHolder)

          marker.addTo(zmap)
          shipInfoMarker[type].push(marker)
        }
      }
    }

    removeShip() {
      if (!Object.keys(shipInfoMarker).length) return
      for (let type in shipInfoMarker) {
        for (let el of shipInfoMarker[type]) {
          zmap.removeLayer(el)
        }
      }
      shipInfoMarker = {}
    }
  }
</script>

<style lang='scss' scoped>
#ShipMonitor {
  
}
</style>

<style lang='scss'>
.ship-detail-popup {
  .leaflet-popup-content-wrapper {
    border-radius: 0;
    .leaflet-popup-content {
      margin: 10px; /*no*/
    }
  }
  .leaflet-popup-tip-container {
    .leaflet-popup-tip {
      width: 12px; /*no*/
      height: 12px; /*no*/
    }
  }
  .ship-detail-wrapper {
    >ul {
      >li {
        height: 18px; /*no*/
        line-height: 18px; /*no*/
        span {
          display: inline-block;
          box-sizing: border-box;
          padding: 0 5px; /*no*/
          &.name {
            color: #888;
            min-width: 100px; /*no*/
          }
          &.val {
            min-width: 100px; /*no*/
          }
        }
      }
    }
  }
}
</style>