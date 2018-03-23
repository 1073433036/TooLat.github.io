<template>
  <li @click="measure" :class="{'on': isMeasureOn}">
    <em class="measure"></em>
    <span>&nbsp;测&nbsp;&nbsp;距</span>
  </li>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  let zmap: any, L: any, icon: any
  let points: any[] = [], polylines: any[] = [], distances: any[] = [], divIcons: any[] = []
  let movePolyline: any = null
  const polylineOpts = {
    color: '#dd6c91', 
    weight: 2, 
    dashArray: '4, 5', 
    dashOffset: '2',
  }
  const fontColor = '#f00'

  @Component
  export default class Measure extends Vue {
    isMeasureOn: boolean = false
    clickIndex: number = -1

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      icon = L.icon({
        className: 'point',
        iconUrl: 'static/img/measure_circle.png', 
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      })
    }

    measure() {
      this.isMeasureOn = !this.isMeasureOn
      if (this.isMeasureOn)
        this.startMeasure()
      else
        this.removeMeasure()
    }

    // 开始测量
    startMeasure() {
      ++this.clickIndex
      points.push([])
      polylines.push([])
      distances.push([])
      divIcons.push([])
      zmap.on('mousemove', this.mouseMoveEvent)
      zmap.on('click', this.clickEvent)
      zmap.on('contextmenu', this.contextmenuEvent)
    }

    // 鼠标移动事件
    mouseMoveEvent(e: any) {
      let text = points[this.clickIndex].length ? '左键点击测量，右键点击结束测量' : '左键点击开始测量'
      let left = e.containerPoint.x + 10, top = e.containerPoint.y + 10
      if (!document.querySelector('#measureTip')) {
        let ele = document.createElement('div')
        ele.id = 'measureTip'
        ele.style.position = 'absolute'
        ele.style.top = top + 'px'
        ele.style.left = left + 'px'
        ele.style.padding = '0 10px'
        ele.style.background = '#fff'
        ele.style.lineHeight = '22px'
        ele.style.fontSize = '12px'
        ele.style.color = '#999'
        ele.style.borderRadius = '4px'
        ele.style.zIndex = '999'
        ele.innerHTML = text
        document.body.appendChild(ele)
      } else {
        let ele: HTMLElement = <HTMLElement>document.querySelector('#measureTip')
        ele.style.top = top + 'px'
        ele.style.left = left + 'px'
        ele.innerHTML = text
      }
      if (points[this.clickIndex].length) {
        if (movePolyline) zmap.removeLayer(movePolyline)
        let lastPoint = points[this.clickIndex][points[this.clickIndex].length - 1]
        let lat = e.latlng.lat, lng = e.latlng.lng
        let lastPointLatLng = lastPoint.getLatLng()
        movePolyline = L.polyline([[lastPointLatLng.lat, lastPointLatLng.lng], [lat, lng]], polylineOpts)
        movePolyline.addTo(zmap)
      }
    }

    // 左键点击事件
    clickEvent(e: any) {
      if (!points[this.clickIndex].length) {        // 第一个点
        this.addPoint(e)
      } else {
        let lastPoint = points[this.clickIndex][points[this.clickIndex].length - 1]
        let point = this.addPoint(e)
        this.addPolylineLabel(lastPoint, point)
      }
    }

    // 右键点击事件
    contextmenuEvent(e: any) {
      if (!points[this.clickIndex].length) return
      zmap.off('click', this.clickEvent)
      zmap.off('mousemove', this.mouseMoveEvent)
      let ele = document.querySelector('#measureTip')
      if (ele) document.body.removeChild(ele)
        
      let lastPoint = points[this.clickIndex][points[this.clickIndex].length - 1]
      let lastPointLatLng = lastPoint.getLatLng()

      // 距离总计
      if (points[this.clickIndex].length > 2) {
        const opts = L.divIcon({
          className: 'lastDivIcon',
          html: `<div class="lastDivIcon" style="position:absolute;padding:6px"><span style="display: inline-block; white-space: nowrap; color: ${fontColor};">总计：${eval(distances[this.clickIndex].join('+')).toFixed(2)}公里</span></div>`
        });
        let divIcon = L.marker([lastPointLatLng.lat, lastPointLatLng.lng], { icon: opts })
        divIcon.id = 'lastDivIcon'
        divIcon.addTo(zmap)
      }

      if (movePolyline) {
        zmap.removeLayer(movePolyline)
        movePolyline = null
      }

      zmap.off('contextmenu', this.contextmenuEvent)

      setTimeout(() => {
        this.startMeasure()
      }, 0);
    }

    // 添加点
    addPoint(e: any) {
      let marker = L.marker([e.latlng.lat, e.latlng.lng], { icon })
      points[this.clickIndex].push(marker)
      marker.id = 'measurePoint'
      marker.addTo(zmap)
      return marker
    }

    // 添加连线 距离div
    addPolylineLabel(lastPoint: any, point: any) {
      // polyline
      let lastPointLatLng = lastPoint.getLatLng(),
          pointLatLng = point.getLatLng()
      let polyline = L.polyline([[lastPointLatLng.lat, lastPointLatLng.lng], [pointLatLng.lat, pointLatLng.lng]], polylineOpts)
      polyline.id = 'measurePolyline'
      polyline.addTo(zmap)
      polylines[this.clickIndex].push(polyline)
      // label
      let centerPoint = [(lastPointLatLng.lat + pointLatLng.lat) / 2, (lastPointLatLng.lng + pointLatLng.lng) / 2]
      let distance = L.latLng(lastPointLatLng.lat, lastPointLatLng.lng).distanceTo([pointLatLng.lat, pointLatLng.lng])
      distance = (distance / 1000).toFixed(2)
      distances[this.clickIndex].push(distance)
      const opts = L.divIcon({
        className: 'divIcon',
        html: `<div class="distanceIcon" style="position:absolute;padding:6px"><span style="display: inline-block; white-space: nowrap; color: ${fontColor};">${distance}公里</span></div>`
      });
      let divIcon = L.marker(centerPoint, { icon: opts })
      divIcon.id = 'measureDivIcon'
      divIcon.addTo(zmap)
      divIcons[this.clickIndex].push(divIcon)
    }

    // 移除测量数据
    removeMeasure() {
      this.clickIndex = -1
      zmap.off('click', this.clickEvent)
      zmap.off('contextmenu', this.contextmenuEvent)
      zmap.off('mousemove', this.mouseMoveEvent)
      let ele = document.querySelector('#measureTip')
      if (ele) document.body.removeChild(ele)
      if (movePolyline) {
        zmap.removeLayer(movePolyline)
        movePolyline = null
      }
      if (!points.length) return
      zmap.eachLayer((e: any) => {
        if (e.id === 'measurePoint' || e.id === 'measurePolyline' || e.id === 'measureDivIcon' || e.id === 'lastDivIcon')
          zmap.removeLayer(e)
      })
      points = [], polylines = [], distances = [], divIcons = []
    }
  }
</script>

<style lang='scss' scoped>

</style>