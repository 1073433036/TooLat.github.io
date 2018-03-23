<template>
  <div id="map-container" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import mapLayerConf from '../config/mapLayersConf'
  import { geoClient } from '../util/clientHelper'

  let L: any, zmap: any

  @Component
  export default class Zmap extends Vue {
    @Action('systemStore/storeZmapViewer_global') storeZmapViewer_global: any

    async mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap'] = L.map('map-container', {
        minZoom: 3,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false
      })
      // L.tileLayer(mapLayerConf.terrain).addTo(zmap)
      let layer = L.chinaLayer('GaoDe.Normal.Map', { maxZoom: 18, minZoom: 3 })
      layer.id = 'mapLayer'
      layer.addTo(zmap)
      window["windRenderer"] = L.svg()
      window["windRenderer"].addTo(zmap)
      this.drawBoundary()
    }

    async drawBoundary() {
      let data
      if (sessionStorage.countyId != 0)
        data = await geoClient.findCounty(sessionStorage.countyId)
      else if (sessionStorage.cityid != 0) 
        data = await geoClient.findCity(sessionStorage.cityid)
      else
        data = await geoClient.getProv()
      if (!data) {
        Vue['prototype']['$message']({
          type: 'warning',
          message: '地图边界获取失败'
        })
        zmap.setView([23.085, 113.154033], 8)
        this.storeZmapViewer_global({ center: [23.085, 113.154033], zoom: 8 })
        return
      }
      if (sessionStorage.countyId != 0) {
        let bound = data.boundary
        for (let opt of bound) {
          let latlngs: any[] = []
          for (let el of opt)
            latlngs.push([el.y, el.x])
          L.polyline(latlngs, {color: 'rgba(255, 0, 0, .7)'}).addTo(zmap)
        }
      } else {
        let bound = JSON.parse(data.bound)
        for (let opt of bound) {
          let latlngs: any[] = []
          for (let el of opt)
            latlngs.push([el[1], el[0]])
          L.polyline(latlngs, {color: 'rgba(255, 0, 0, .7)'}).addTo(zmap)
        }
      }
      
      let center, zoom
      if (sessionStorage.countyId != 0) {
        center = JSON.parse(data.center)
        zoom = 11
      } else if (sessionStorage.cityid != 0) {
        center = JSON.parse(data.center)
        zoom = 9
      } else {
        let centerString = data.center
        let c = centerString.match(/(\d*\.\d*)/g)
        center = { x: c[0], y: c[1] }
        zoom = 7
      }
      zmap.setView([center.y, center.x], zoom)
      this.storeZmapViewer_global({ center: [center.y, center.x], zoom })
    }
  }
</script>

<style lang="scss" scoped>
  #map-container {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 0;
  }
</style>
