<template>
  <main id="geoDisterProcuct">

    <ul class="elements cf">
      <li @click="toggleElement(opt, index)" v-for="(opt, index) of elements" :key="opt.key">
        <em :class="opt.key"></em>
        <div :class="['el', {'on': opt.selected}]">{{ opt.name }}</div>
      </li>
    </ul>
  </main>
</template>


<script lang="ts">
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  import { riskWarningClient } from '../../util/clientHelper'

  let L,zmap

  @Component
  export default class geoDisterProduct extends Vue {
    @Prop() date: Date
    @Prop() hour: number
    @Prop() minute: number
    @Prop() url: string
    @Action('systemStore/storeSwanMessageTip_global') storeSwanMessageTip_global
    elements: any[] = [
      { key: 'tfEffeTime', name: '24小时', selected: false, timeEffe: 24,  layer: null},
      { key: 'feEffeTime', name: '48小时', selected: false, timeEffe: 48,  layer: null},
      { key: 'stEffeTime', name: '72小时', selected: false, timeEffe: 72,  layer: null},
      { key: 'nsEffeTime', name: '96小时', selected: false, timeEffe: 96,  layer: null},
      { key: 'otzEffeTime', name: '120小时', selected: false, timeEffe: 120,  layer: null},
      { key: 'offEffeTime', name: '144小时', selected: false, timeEffe: 144,  layer: null},
      { key: 'oseEffeTime', name: '168小时', selected: false, timeEffe: 168,  layer: null},
      { key: 'ontEffeTime', name: '192小时', selected: false, timeEffe: 192,  layer: null},
      { key: 'tosEffeTime', name: '216小时', selected: false, timeEffe: 216,  layer: null},
      { key: 'tfzEffeTime', name: '240小时', selected: false, timeEffe: 240,  layer: null}
    ]
    bounds: any = null
    mapLayer: any = null
    selecteHour: string = '00'
    oldKey: string = ''
    lastZoom: number = 0

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      zmap.on('moveend', this.changeLayer);
    }
    destroyed() {
      this.removeImageLayer()
      zmap.off('moveend', this.changeLayer)
    }

    toggleElement(opt, index) {
      if(this.elements[index].selected) {
        this.elements[index].selected = false;
        this.removeMsgTip(index);
        this.removeImageLayer();
        return;
      }
      this.elements.forEach((el, i) => {
        el.selected = i === index;
      });
      this.lastZoom = zmap.getZoom();
      this.getGeoDisterProdImgUrl(opt.timeEffe, index, this.lastZoom)
    }

    async getGeoDisterProdImgUrl(effTime: number, index: number, mapZoom: number) {

      //判断 选择小时 < 12 主动跳到 00, >=12 都为 12
      if (this.hour < 12) {
        this.selecteHour = '00'
      }else {
        this.selecteHour = '12'
      }
      let dateTime: string = moment(this.date).format('YYYY-MM-DD') + ` ${this.selecteHour}:00:00:00`
      let bounds = zmap.getBounds(),
        left = bounds._southWest.lng,
        right = bounds._northEast.lng,
        top = bounds._northEast.lat,
        bottom = bounds._southWest.lat
      this.bounds = [[top,left], [bottom,right]]

      let x = right - left,
        y = top - bottom,
        scale = y / x;

      let width: number = window.innerWidth || document.body.clientWidth,
        height: number = Math.round(width * scale) //window.innerHeight || document.body.clientHeight// Math.round(width * scale) // 按上下,左右的比例来
      let ref = await riskWarningClient.getGeoDisterProductData(this.url ,dateTime, effTime, left, right, top, bottom, width, height);
      this.addImgLayerToMap(index, ref, mapZoom);
    }

    addImgLayerToMap(index, imgUrl, mapZoom) {
      let image = new Image()
      image.onload = () => {
        this.showSelectedMsgTip(index, true);
        if (this.elements[index].selected) {

          if (this.lastZoom != mapZoom){
            console.log('不同层级忽略', this.lastZoom, mapZoom)
            return;
          }
          console.log('相同层级', this.lastZoom, mapZoom)
          if (this.mapLayer === null) {
            this.mapLayer = L.imageOverlay(imgUrl, this.bounds)
            this.mapLayer.addTo(zmap)
          } else {
            this.mapLayer.setUrl(imgUrl)
            let bounds = L.latLngBounds(L.latLng(this.bounds[0][0], this.bounds[0][1]), L.latLng(this.bounds[1][0], this.bounds[1][1]))
            this.mapLayer.setBounds(bounds)
          }
        } else {
          this.removeImageLayer()
        }
      }
      image.onerror = () => {
        this.showSelectedMsgTip(index, false)
        this.removeImageLayer()
      }
      image.src = imgUrl
    }

    removeImageLayer() {
      if (this.mapLayer === null)return
      zmap.removeLayer(this.mapLayer)
      this.mapLayer = null
    }

    showSelectedMsgTip(index: number, hasData: boolean) {
      //先移除上个
      this.storeSwanMessageTip_global({ key: this.oldKey, type: 'remove' })
      let dateTime: string = moment(this.date).format('YYYY-MM-DD') + ` ${this.selecteHour}:00`
      let typeStr = this.getViewType();
      this.storeSwanMessageTip_global({ key: typeStr + this.elements[index].name, time: dateTime, hasData: hasData, type: 'add' });
      this.oldKey = typeStr + this.elements[index].name;
    }
    removeMsgTip(index: number) {
      let typeStr = this.getViewType();
      this.storeSwanMessageTip_global({ key: typeStr + this.elements[index].name, type: 'remove' })
    }

    getViewType(){
      let typeStr: string = ''
      if (this.url === 'geo') {
        typeStr = '地址灾害'
      }else if (this.url === 'flood') {
        typeStr = '山洪风险'
      }else {
        typeStr = '流域风险'
      }
      return typeStr;
    }

    @Watch('date')
    ondateChanged (val: Date, oldVal: Date) {
      this.changeLayer(1)
    }

    @Watch('hour')
    onHourChanged (val: number, oldVal: number) {

      this.changeLayer(2)
    }

    changeLayer(endMap) {
      for (let index = 0; index < this.elements.length; index++) {
        if (this.elements[index].selected) {
          //地图层级变化是, 低于 8 不去从新请求图片
          this.lastZoom = zmap.getZoom();
          if (zmap.getZoom() >= 8 || endMap === 1 || endMap === 2) {
            if (endMap === 2 && ((this.hour < 12 && this.selecteHour === '00') || (this.hour >= 12 && this.selecteHour === '12'))) {
              return
            }
            this.getGeoDisterProdImgUrl(this.elements[index].timeEffe, index, zmap.getZoom());
          }
        }
      }
    }

  }

</script>


<style lang='scss' scoped>
  #geoDisterProcuct{
    position: relative;
    padding-bottom: 5px;
    border-bottom: 1px solid #e6e6e6;
  ul.elements li em {
  &.tfEffeTime { background: rgb(252, 48, 47); }
  &.feEffeTime { background: rgb(48, 48, 47); }
  &.stEffeTime { background: rgb(1, 128, 1); }
  &.nsEffeTime { background: rgb(128, 48, 0); }
  &.otzEffeTime { background: rgb(190, 92, 100); }
  &.offEffeTime { background: rgb(170, 58, 175); }
  &.oseEffeTime { background: rgb(33, 33, 251); }
  &.ontEffeTime { background: rgb(103, 151, 204); }
  &.tosEffeTime { background: rgb(11, 101, 101); }
  &.tfzEffeTime { background: rgb(0, 0, 0); }
  }
  }
</style>
