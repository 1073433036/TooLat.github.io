<template>
  <div id="map-container" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import mapLayerConf from '@/config/MapLayersConf'
  import { geoClient } from '@/util/ClientHelper'

  let zmap: any = null,
      zmapLayers: any[] = []
  let L

  @Component
  export default class Zmap extends Vue {
    @Getter('systemStore/region_global') region_global
    @Getter('decisionStore/zmapLayer_global') zmapLayer_global
    @Action('decisionStore/storeZmapViewer_global') storeZmapViewer_global

    async mounted() {
      L = window['L']
      let global: any = <any>window
      zmap = global['zmap'] = L.map('map-container', {
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false
      })
      if (this.zmapLayer_global === 'tianditu') {
        zmapLayers.push(L.chinaLayer('TianDiTu.Normal.Map', { maxZoom: 18, minZoom: 2 }))
        zmapLayers.push(L.chinaLayer('TianDiTu.Normal.Annotion', { maxZoom: 18, minZoom: 2 }))
      }
      else
        zmapLayers.push(L.tileLayer(mapLayerConf[this.zmapLayer_global]))
      zmapLayers.map(el => el.addTo(zmap))
      window["windRenderer"] = L.svg()
      window["windRenderer"].addTo(zmap)
      zmap.setView([23.085, 113.154033], 8)
      this.drawBounds()
    }

    async drawBounds() {
      let res = await geoClient.findCity(this.region_global.cityId)
      if (!res) {
        Vue['prototype']['$message']({ type: 'error', message: '地图边界获取失败' })
        this.storeZmapViewer_global({ center: [23.085, 113.154033], zoom: 8 })
        return
      }
      let bound = JSON.parse(res.bound)
      for (let opt of bound) {
        let latlngs: any[] = []
        for (let el of opt)
          latlngs.push([el[1], el[0]])
        L.polyline(latlngs, {color: 'rgba(255, 0, 0, .7)'}).addTo(zmap)
      }
      let center = JSON.parse(res.center)
      let zoom = 10
      zmap.setView([center.y, center.x], zoom)
      this.storeZmapViewer_global({ center: [center.y, center.x], zoom })
    }

    destroyed() {
      let global: any = <any>window
      delete global['zmap']
    }

    @Watch('zmapLayer_global')
    onzmapLayer_globalChanged (val: string, oldVal: string) {
      let layers = []
      if (val === 'tianditu') {
        layers.push(L.chinaLayer('TianDiTu.Normal.Map', { maxZoom: 18, minZoom: 2 }))
        layers.push(L.chinaLayer('TianDiTu.Normal.Annotion', { maxZoom: 18, minZoom: 2 }))
      }
      else
        layers.push(L.tileLayer(mapLayerConf[val]))
      layers.map(el => el.addTo(zmap))
      if (zmapLayers.length)
        zmapLayers.map(el => zmap.removeLayer(el))
      zmapLayers = layers
    }
  }
</script>

<style lang="scss" scoped>
  #map-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>
