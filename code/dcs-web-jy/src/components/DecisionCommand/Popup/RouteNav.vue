<template>
  <main id="RouteNav">
    <div class="tab cf">
      <div :class="['drive', {on: routeWay === 'speedFirst' || routeWay === 'distanceFirst'}]"
          @click="routeWay = 'speedFirst'"><em></em></div>
      <div :class="['walk', {on: routeWay === 'walking'}]" @click="routeWay = 'walking'">
        <em></em>
      </div>
    </div>
    <div class="address start-address" @click="selectStartPoint">
      <em></em>
      <span :title="startPointAddress" :class="{on: startPointAddress !== '点击获取起点位置'}">
        {{ typeof startPointAddress === 'string' ? startPointAddress : '未知' }}
      </span>
    </div>
    <div class="address end-address" @click="selectEndPoint">
      <em></em>
      <span :title="endPointAddress" :class="{on: endPointAddress !== '点击获取终点位置'}">
        {{ typeof endPointAddress === 'string' ? endPointAddress : '未知' }}
      </span>
    </div>
    <div class="result cf">
      <template v-if="routeWay === 'speedFirst' || routeWay === 'distanceFirst'">
        <div :class="['result-drive', {on: routeWay === 'speedFirst'}]" @click="routeWay = 'speedFirst'">
          <span class="desc">时间最短</span>
          <span>{{ route.speedFirst.duration }}小时</span>
          <span>{{ route.speedFirst.distance }}公里</span>
        </div>
        <div :class="['result-drive', {on: routeWay === 'distanceFirst'}]" @click="routeWay = 'distanceFirst'">
          <span class="desc">距离最短</span>
          <span>{{ route.distanceFirst.duration }}小时</span>
          <span>{{ route.distanceFirst.distance }}公里</span>
        </div>
      </template>
      <div v-else class="result-walk cf">
        <span>{{ route.walking.duration }}小时</span>
        <span>{{ route.walking.distance }}公里</span>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import jsonp from 'jsonp'

  let L: any,
      zmap: any,
      startPoint: any,
      endPoint: any,
      routeLine: any

  @Component
  export default class RouteNav extends Vue {
    routeWay: 'speedFirst' | 'distanceFirst' | 'walking' = 'speedFirst'
    startPointAddress: string = '点击获取起点位置'
    endPointAddress: string = '点击获取终点位置'
    hasAddStartPoint: boolean = false
    lnglatOfStartPoint: any = { lng: 0, lat: 0 }
    route: any = {
      speedFirst: {
				duration: 0,
        distance: 0,
        steps: null
			},
			distanceFirst: {
				duration: 0,
				distance: 0,
        steps: null
			},
			walking: {
				duration: 0,
				distance: 0,
        steps: null
			}
    }

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      this.selectStartPoint()
    }

    beforeDestroy() {
      this.clearRoute()
      L = null
      zmap = null
    }

    selectStartPoint() {
      this.clearRoute()
      zmap.on('mousemove', this.zmapMousemoveEvent)
      zmap.on('click', this.zmapClickEvent)
    }

    selectEndPoint() {
      if (!endPoint) return
      this.endPointAddress = '点击获取终点位置'
      for (let i in this.route) {
        this.route[i].duration = 0
        this.route[i].distance = 0
        this.route[i].steps = null
      }
      if (endPoint) zmap.removeLayer(endPoint)
      if (routeLine) zmap.removeLayer(routeLine)
      this.hasAddStartPoint = true
      zmap.on('mousemove', this.zmapMousemoveEvent)
      zmap.on('click', this.zmapClickEvent)
    }
    
    zmapMousemoveEvent(e: any) {
      if (!this.hasAddStartPoint) {
        if (startPoint) zmap.removeLayer(startPoint)
        startPoint = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: L.icon({
            className: 'ponit',
            iconUrl: 'static/img/DecisionCommand/route_start.png',
            iconSize: [22, 29],
            iconAnchor: [11, 29],
          })
        })
        startPoint.addTo(zmap)
      } else {
        if (endPoint) zmap.removeLayer(endPoint)
        endPoint = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: L.icon({
            className: 'ponit',
            iconUrl: 'static/img/DecisionCommand/route_end.png',
            iconSize: [22, 29],
            iconAnchor: [11, 29],
          })
        })
        endPoint.addTo(zmap)
      }
    }

    async zmapClickEvent(e: any) {
      let lng = e.latlng.lng,
          lat = e.latlng.lat
      if (!this.hasAddStartPoint) {
        this.hasAddStartPoint = true
        this.lnglatOfStartPoint.lng = lng
        this.lnglatOfStartPoint.lat = lat
        let url = `http://restapi.amap.com/v3/geocode/regeo?key=67fbfcb22d9900a94cc95af73378c865&location=${lng},${lat}&extensions=base&batch=false&roadlevel=1`
        jsonp(url, { timeout: 5000 }, (err, res) => {
          if (res.info === 'OK')
            this.startPointAddress = res.regeocode.formatted_address
        })
      } else {
        this.hasAddStartPoint = false
        zmap.off('mousemove', this.zmapMousemoveEvent)
        zmap.off('click', this.zmapClickEvent)
        let url = `http://restapi.amap.com/v3/geocode/regeo?key=67fbfcb22d9900a94cc95af73378c865&location=${lng},${lat}&extensions=base&batch=false&roadlevel=1`
        jsonp(url, { timeout: 5000 }, (err, res) => {
          this.endPointAddress = res.regeocode.formatted_address
        })
        this.getRoute('speedFirst', lng, lat)       // 時間最短
        this.getRoute('distanceFirst', lng, lat)    // 距離最短
        this.getRoute('walking', lng, lat)          // 步行
      }
    }

    getRoute(type: 'speedFirst' | 'distanceFirst' | 'walking', lng, lat) {
      let url
      if (type === 'speedFirst')
        url = `http://restapi.amap.com/v3/direction/driving?key=67fbfcb22d9900a94cc95af73378c865&origin=${this.lnglatOfStartPoint.lng},${this.lnglatOfStartPoint.lat}&destination=${lng},${lat}&extensions=base&strategy=0`
      else if (type === 'distanceFirst')
        url = `http://restapi.amap.com/v3/direction/driving?key=67fbfcb22d9900a94cc95af73378c865&origin=${this.lnglatOfStartPoint.lng},${this.lnglatOfStartPoint.lat}&destination=${lng},${lat}&extensions=base&strategy=2`
      else
        url = `http://restapi.amap.com/v3/direction/walking?key=67fbfcb22d9900a94cc95af73378c865&origin=${this.lnglatOfStartPoint.lng},${this.lnglatOfStartPoint.lat}&destination=${lng},${lat}`
      jsonp(url, { timeout: 5000 }, (err, res) => {
        if (!res.route) {
          this.route[type].duration = 0
          this.route[type].distance = 0
          this.route[type].steps = null
          return
        }
        this.route[type].duration = (res.route.paths[0].duration / 3600).toFixed(1)
        this.route[type].distance = (res.route.paths[0].distance / 1000).toFixed(1)
        this.route[type].steps = res.route.paths[0].steps
        if (this.routeWay === type)
          this.drawRouteLine()
      })
    }
    
    @Watch('routeWay')
    onrouteWayChanged (val: any, oldVal: any) {
      this.drawRouteLine()
    }

    drawRouteLine() {
      let steps = this.route[this.routeWay].steps
      if (!steps) {
        if (routeLine) zmap.removeLayer(routeLine)
        return
      }
      if (routeLine) zmap.removeLayer(routeLine)
      let pathArray: any[] = []
      let buffer
      for (let item of steps) {
        buffer = item.polyline.split(';')
        for (let el of buffer) {
          el = el.split(',')
          pathArray.push([el[1], el[0]])
        }
      }
      routeLine =  L.polyline(pathArray, {
        color: this.getRandomColor(),
        weight: 4
      })
      routeLine.addTo(zmap)
    }

    getRandomColor() { 
      return "#" + ("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6)
    }

    clearRoute() {
      this.hasAddStartPoint = false
      this.lnglatOfStartPoint.lng = 0
      this.lnglatOfStartPoint.lat = 0
      this.startPointAddress = '点击获取起点位置'
      this.endPointAddress = '点击获取终点位置'
      for (let i in this.route) {
        this.route[i].duration = 0
        this.route[i].distance = 0
        this.route[i].steps = null
      }
      if (startPoint) zmap.removeLayer(startPoint)
      if (endPoint) zmap.removeLayer(endPoint)
      if (routeLine) zmap.removeLayer(routeLine)
      if(zmap.hasEventListeners('mousemove'))
        zmap.off('mousemove', this.zmapMousemoveEvent)
      if(zmap.hasEventListeners('click'))
        zmap.off('click', this.zmapClickEvent)
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#RouteNav {
  position: absolute;
  top: 116px; /*no*/
  right: 80px; /*no*/
  width: 170px;
  background: #fff;
  box-shadow: 0 0 10px #8d9db5; 
  .tab {
    margin: 10px 0;
    .drive, .walk {
      float: left;
      width: 56px;
      height: 24px;
      background-color: #f5f5f5;
      cursor: pointer;
      &:hover { background-color: #eceaea; }
      &.on {
        background-color: $themeColor;
        &:hover { background-color: rgba(17, 169, 245, .8); }
      }
      em {
        display: inline-block;
        width: 18px;
        height: 18px;
        margin: 3px 0 0 19px;
      }
    }
    .drive {
      margin-left: 29px;
      em { background: url(~Img/DecisionCommand/route-tab.png) no-repeat 66.6% 0 / 400% 100%; }
      &.on em { background: url(~Img/DecisionCommand/route-tab.png) no-repeat 100% 0 / 400% 100%; }
    }
    .walk {
      em { background: url(~Img/DecisionCommand/route-tab.png) no-repeat 0 0 / 400% 100%; }
      &.on em { background: url(~Img/DecisionCommand/route-tab.png) no-repeat 33.3% 0 / 400% 100%; }
    }
  }
  .address {
    position: relative;
    height: 24px;
    line-height: 24px;
    em {
      position: absolute;
      top: 2px;
      left: 10px;
      display: inline-block;
      width: 14px;
      height: 18px;
    }
    span {
      position: absolute;
      top: 0;
      left: 35px;
      width: 125px;
      display: inline-block;
      overflow: hidden;
      color: #989898;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &.on { color: #000; }
      &:hover { text-decoration: underline; }
    }
    &.start-address {
      em { background: url(~Img/DecisionCommand/route_start.png) no-repeat 0 0 / 100% 100%; }
    }
    &.end-address {
      em { background: url(~Img/DecisionCommand/route_end.png) no-repeat 0 0 / 100% 100%; }
    }
  }
  .result {
    margin: 5px 0 10px 0;
    .result-drive {
      float: left;
      width: 84px;
      cursor: pointer;
      &:first-child { border-right: 1px solid #eceaea }
      &.on {
        // background: #f5f5f5;
        font-weight: bold;
      }
      span {
        display: inline-block;
        padding-left: 10px;
        width: calc(100% -10px);
        height: 20px;
        line-height: 20px;
        &.desc {
          color: $themeColor;
          line-height: 14px;
        }  
      }
    }
    .result-walk {
      span {
        float: left;
        display: inline-block;
        text-indent: 10px;
        width: 50%;
        height: 20px;
        line-height: 20px;
      }
    }
  }
}
</style>