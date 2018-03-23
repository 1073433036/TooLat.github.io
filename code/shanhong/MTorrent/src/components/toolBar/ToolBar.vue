<template>
  <main id="ToolBar" class="cf">

    <div class="show-hide-tag"
        @click="isPanelShow = !isPanelShow"
        :title="isPanelShow ? '隐藏工具栏' : '打开工具栏'"
        :class="{'close': !isPanelShow}"></div>
    <transition name="slide-fade">
      <ul class="too-list cf" v-show="isPanelShow">
        <measure />
        <li v-for="opt of toolMenu" :key="opt.key" @click="toggleMenu(opt)" :class="{'on': opt.selected}">
          <em :class="opt.key"></em>
          <span>{{ opt.text }}</span>
        </li>
      </ul>
    </transition>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import mapLayerConf from '../../config/mapLayersConf'
  import Measure from './Measure.vue'

  let L: any,
      zmap: any,
      graticule: any,
      satilliteLayer: any

  @Component({
    components: {
      Measure
    }
  })
  export default class ToolBar extends Vue {
    @Getter('systemStore/popupStatus_global') popupStatus_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    @Action('systemStore/storeCappiProfile_global') storeCappiProfile_global: any

    isPanelShow: boolean = false
    toolMenu: any = [
      { key: 'cappi', text: '剖面图', selected: false },
      { key: 'wind', text: '风廓线', selected: false },
      { key: 'layer', text: '卫星图', selected: false },
      { key: 'latlng', text: '经纬线', selected: false }
    ]

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
    }

    toggleMenu(opt: any) {
      opt.selected = !opt.selected
      if (opt.selected) {
        // if (opt.key === 'search')
        //   this.storePopupStatus_global({ key: 'StationSearch', action: true })
        if (opt.key === 'cappi')
          this.getCappiProfile()
        else if (opt.key === 'wind')
          this.storePopupStatus_global({ key: 'WindCorridor', action: true })
        else if (opt.key === 'layer') {
          satilliteLayer = L.tileLayer(mapLayerConf.satillite)
          // satilliteLayer = L.chinaLayer('GaoDe.Satellite.Map', { maxZoom: 18, minZoom: 2 })
          satilliteLayer.addTo(zmap)
          zmap.eachLayer(e => {
            if (e.id === 'mapLayer')
              zmap.removeLayer(e)
          })
          // L.chinaLayer('GaoDe.Satellite.Annotion', {maxZoom: 18, minZoom: 3}).addTo(zmap)
        }
        else if (opt.key === 'latlng')
          this.addLatLng()
      } else {
        // if (opt.key === 'search')
        //   this.storePopupStatus_global({ key: 'StationSearch', action: false })
        if (opt.key === 'cappi') {
          this.removeCappiProfile()
          this.storePopupStatus_global({ key: 'CappiProfile', action: false })
        }
        else if (opt.key === 'wind')
          this.storePopupStatus_global({ key: 'WindCorridor', action: false })
        else if (opt.key === 'layer') {
          let layer = L.chinaLayer('GaoDe.Normal.Map', { maxZoom: 18, minZoom: 3 })
          layer.id = 'mapLayer'
          layer.addTo(zmap)
          zmap.removeLayer(satilliteLayer)
          satilliteLayer = null
        }
        else if (opt.key === 'latlng')
          this.removeLatLng()
      }
    }

    // 弹窗关闭时 关闭导航选中
    closeOptSelected(key) {
      for (let opt of this.toolMenu) {
        if (opt.key === key && opt.selected) {
          opt.selected = false
          break
        }
      }
    }

    // 站点搜索
    // @Watch('popupStatus_global.StationSearch')
    // onStationSearchChanged(val: boolean, oldVal: boolean) {
    //   if (!val) this.closeOptSelected('search')
    // }

    // 雷达剖面
    profileLatLng: any = { SLat: null, SLon: null, ELat: null, ELon: null }
    startPoint: any = null
    polyline: any = null
    getCappiProfile() {
      zmap.on('click', this.cappiClickEvent)
    }
    cappiClickEvent(e: any) {
      if (!this.startPoint) {
        let lat = Number(e.latlng.lat.toFixed(2)),
            lng = Number(e.latlng.lng.toFixed(2))
        this.profileLatLng.SLat = lat
        this.profileLatLng.SLon = lng
        this.startPoint = L.marker([lat, lng], {
          icon: L.icon({
            className: 'point',
            iconUrl: 'static/img/measure_circle.png',
            iconSize: [10, 10],
            iconAnchor: [5, 5],
          })
        })
        this.startPoint.addTo(zmap)
        zmap.on('mousemove', this.cappiMousemoveEvent)
      } else {
        this.profileLatLng.ELat = Number(e.latlng.lat.toFixed(2))
        this.profileLatLng.ELon = Number(e.latlng.lng.toFixed(2))
        this.storeCappiProfile_global(this.profileLatLng)
        this.storePopupStatus_global({ key: 'CappiProfile', action: true })
        this.removeCappiProfile()
      }
    }
    cappiMousemoveEvent(e: any) {
      if (this.polyline) zmap.removeLayer(this.polyline)
      this.polyline = L.polyline([[this.profileLatLng.SLat, this.profileLatLng.SLon], [e.latlng.lat, e.latlng.lng]], {
        color: '#f00',
        weight: 2
      })
      this.polyline.addTo(zmap)
    }
    removeCappiProfile() {
      zmap.off('click', this.cappiClickEvent)
      zmap.off('mousemove', this.cappiMousemoveEvent)
      if (this.startPoint) {
        zmap.removeLayer(this.startPoint)
        this.startPoint = null
      }
      if (this.polyline) {
        zmap.removeLayer(this.polyline)
        this.polyline = null
      }
    }
    @Watch('popupStatus_global.CappiProfile')
    onCappiProfileChanged(val: boolean, oldVal: boolean) {
      if (!val) this.closeOptSelected('cappi')
    }

    // 风廊线
    @Watch('popupStatus_global.WindCorridor')
    onWindCorridorChanged(val: boolean, oldVal: boolean) {
      if (!val) this.closeOptSelected('wind')
    }

    // 经纬线
    addLatLng() {
      graticule =  L.latlngGraticule({
        showLabel: true,
        fontColor: '#999',
        zoomInterval: [
          {start: 2, end: 3, interval: 30},
          {start: 4, end: 4, interval: 10},
          {start: 5, end: 7, interval: 5},
          {start: 8, end: 18, interval: 1}
        ]
      }).addTo(zmap);
    }
    removeLatLng() {
      zmap.removeLayer(graticule)
      graticule = null
    }
  }
</script>

<style lang='scss'>
@mixin line {
  position: absolute;
  top: 9px;
  right: 0;
  content: '';
  width: 0;
  height: 22px;
  border-right: 1px dashed #d9d9d9;
}
#ToolBar{
  position: absolute;
  top: 60px;
  right: 10px;
  height: 40px;
  font-size: 14px;
  user-select: none;
  background: #f0f0f0;
  cursor: pointer;
  box-shadow: 0 0 5px #62738c;
  border-radius: 3px;
  .show-hide-tag {
    position: relative;
    float: left;
    width: 16px;
    height: 100%;
    background: url(~Img/toolbar/arrow.png) no-repeat center;
    border-radius: 3px 0 0 3px;
    &:hover { background-color: #fff; }
    &.close {
      width: 40px;
      background: url(~Img/toolbar/tool.png) no-repeat center;
      transition: all .3s ease .3s;
      &::after { border: 0px }
    }
    &::after { @include line }
  }
  ul.too-list {
    float: left;
    height: 100%;
    li {
      float: left;
      position: relative;
      width: 110px;
      height: 100%;
      line-height: 40px;
      &::after { @include line }
      &:last-child:after {
         border: 0;
      }
      em {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 36px;
        height: 40px;
        &.measure { background: url(~Img/toolbar/measure.png) no-repeat center; }
        &.cappi { background: url(~Img/toolbar/cappi.png) no-repeat center; }
        &.wind { background: url(~Img/toolbar/wind.png) no-repeat center; }
        &.layer { background: url(~Img/toolbar/layer.png) no-repeat center; }
        &.latlng { background: url(~Img/toolbar/latlng.png) no-repeat center; }
      }
      span {
        margin-left: 36px;
        color: #545454;
      }
      &:hover, &.on {
        background: #fff;
        em {
          &.measure { background: url(~Img/toolbar/measure_cover.png) no-repeat center; }
          &.cappi { background: url(~Img/toolbar/cappi_cover.png) no-repeat center; }
          &.wind { background: url(~Img/toolbar/wind_cover.png) no-repeat center; }
          &.layer { background: url(~Img/toolbar/layer_cover.png) no-repeat center; }
          &.latlng { background: url(~Img/toolbar/latlng_cover.png) no-repeat center; }
        }
        span {
          color: #f3ac12;
          font-weight: bold;
        }
      }
    }
  }
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
