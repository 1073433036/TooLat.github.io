<template>
  <main id="SwanProduct" :class="['cf', {up: typhTimelineStatus_global !== 'search'}]">
    <div class="time-wrapper">
      <el-date-picker v-model="datetime" size="small" :editable="false" format="yyyy-MM-dd HH:mm"
            :clearable="false" type="datetime"></el-date-picker>
    </div>
    <div class="left-wrapper">
      <div class="tabs">
        <ul class="cf">
          <li v-for="el of elementsList" :key="el.key" @click="selectElement(el.key)"
              :class="{on: elementSelected === el.key}">{{ el.name }}</li>
        </ul>
      </div>
      <div class="time">
        <div class="inner"></div>
        <div :class="['progress', {on: transitionHolder}]" :style="{width: (timeIndex-1)*11.1 + '%'}"></div>
        <ul>
          <li v-for="i in timeNumber" :key="i" @click="toggleTimeIndex(i)" :title="getFormatTime(i)"></li>
        </ul>
        <div :class="['curbtn', {on: transitionHolder}]" :style="{left: (timeIndex-1)*11 + '%'}"
            :title="getFormatTime(timeIndex)">{{ timeIndex }}</div>
      </div>
    </div>
    <div :class="['btn-wrapper', {on: isPlaying}]" :title="isPlaying ? '暂停' : '播放'" @click="play">
      <div class="play-btn"></div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  import jsonp from 'jsonp'

  let L: any = null,
      zmap: any = null
  let cappiLayer: any = null,
      cloudLayer: any = null,
      thunderMarker: any[] = []

  @Component
  export default class SwanProduct extends Vue {
    @Getter('decisionStore/typhTimelineStatus_global') typhTimelineStatus_global
    @Action('decisionStore/storeColorTable_global') storeColorTable_global

    isComponetAlive: boolean = true
    elementsList: any[] = [
      { key: 'thunder', name: '闪电' },
      { key: 'cappi', name: '雷达' },
      { key: 'cloud', name: '云图' }
    ]
    elementSelected: string = ''
    datetime: Date = new Date()
    hasInitTime: boolean = false
    urlConf = {
      thunder: 'http://172.22.1.175/di/http.action?userId=idc&pwd=U3cuYV&interfaceId=getUparLPDDLJTimeRange&dataFormat=jsonp&s_ymdhms={startTime}&e_ymdhms={endTime}',
      // cappi: 'http://10.148.83.228:8922/dataunit/temporary/renderTemporaryData?datetime={datetime}&type=swan&element=cappi&time=0&level=3&top={top}&bottom={bottom}&left={left}&right={right}&width={width}&height={height}',
      cappi: 'http://10.148.83.228:8921/temporary/forecast/renderGrid?datetime={datetime}&element=cappi&model=swan&leadtime=0&level=3&left={left}&right={right}&top={top}&bottom={bottom}&width={width}&height={height}',
      // cloud: 'http://119.29.102.103:8111/Satelite/renderCloud?datetime={datetime}&dataType=VIS&top=53.55&bottom=3.86&left=73.66&right=150&width=600&height=600'
      // cloud: 'http://119.29.102.103:8111/Satelite/renderCloud?datetime={datetime}&dataType=IR3&top=53.55&bottom=3.86&left=73.66&right=150&width=600&height=600'
      cloud: 'http://119.29.102.103:8111/Satelite/renderCloud?datetime={datetime}&dataType=IR1&top=53.55&bottom=3.86&left=73.66&right=150&width=600&height=600'
    }
    bounds: any = []
    cloudBounds: any[] = [[53.55, 73.66], [3.86, 150]]
    timeNumber: number = 10       // 时间个数
    timeIndex: number = 10        // 当前选中时间下标
    timeInterval: number = 6      // 时间间隔
    isPlaying: boolean = false
    transitionHolder: boolean = false
    hasLoadData: boolean = false
    intervalHolder: any = null

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      let datetime = Date.now() - Date.now() / (12*60*1000)
      this.datetime = new Date(datetime)
      setTimeout(() => this.hasInitTime = true, 0)
      this.elementSelected = 'cappi'
    }

    beforeDestroy() {
      this.isComponetAlive = false
      this.removeThunder()

      this.removeCappiLayer()
      zmap.off('moveend', this.addCappiLayer)
      this.storeColorTable_global({ type: 'delete', data: { type: 'radar', flag: 'radar' } })
      
      this.removeCloudLayer()
    }

    selectElement(key) {
      this.elementSelected = key
    }

    @Watch('elementSelected')
    onelementSelectedChanged (val: string, oldVal: string) {
      if (val === 'thunder') {
        this.addThunderLayer()
      } else if (val === 'cappi') {
        this.addCappiLayer()
        zmap.on('moveend', this.addCappiLayer)
        this.storeColorTable_global({ type: 'add', data: { type: 'radar', flag: 'radar', label: '雷达' } })
      } else if (val === 'cloud') {
        this.addCloudLayer()
      }

      if (oldVal === 'thunder') {
        this.removeThunder()
      } else if (oldVal === 'cappi') {
        this.removeCappiLayer()
        zmap.off('moveend', this.addCappiLayer)
        this.storeColorTable_global({ type: 'delete', data: { type: 'radar', flag: 'radar' } })
      } else if (oldVal === 'cloud') {
        this.removeCloudLayer()
      }
    }

    @Watch('datetime')
    ondatetimeChanged (val: any, oldVal: any) {
      if (!this.hasInitTime) return
      switch(this.elementSelected) {
        case 'thunder':
          this.addThunderLayer()
          break
        case 'cappi':
          this.addCappiLayer()
          break
        case 'cloud':
          this.addCloudLayer()
          break
      }
    }

    getFormatTime(index) {
      let time = new Date(this.datetime).getTime()
      time = time - time % (6*60*1000)
      time = time - (this.timeNumber - index) * this.timeInterval*60*1000
      return moment(new Date(time)).format('HH:mm')
    }

    // 闪电
    async addThunderLayer() {
      this.hasLoadData = false
      this.removeThunder()
      let time = new Date(this.datetime).getTime()
      time = time - time % (6*60*1000)
      time = time - (this.timeNumber - this.timeIndex) * this.timeInterval*60*1000
      let eTime = new Date(time),
          sTime = new Date(time - 60*60*1000)
      let startTime = moment(sTime).format('YYYYMMDDHHmm00'),
          endTime = moment(eTime).format('YYYYMMDDHHmm00')
      // startTime = '20171015090000'
      // endTime = '20171015100000'
      let url = this.urlConf.thunder.replace('{startTime}', startTime).replace('{endTime}', endTime)
      console.log(url)
      jsonp(url, { name: 'jsoncallback' }, (err, res) => {
        this.hasLoadData = true
        if (!this.isComponetAlive || this.elementSelected !== 'thunder') return
        if (err) {
          Vue['prototype']['$message']({ type: 'error', message: '闪电数据获取失败' })
          return
        }
        let data = res.DATA
        for (let el of data) {
          let lon = el.V06001,
              lat = el.V05001
          let iconUrl = el.V73016 >= 0 ? 'static/img/DecisionCommand/lightingZ.png ' : 'static/img/DecisionCommand/lightingF.png'
          let iconHeight = el.V73016 >= 0 ? 14 : 2
          let marker = L.marker([lat, lon], { icon: L.icon({ iconUrl, iconSize: [14, iconHeight] }) })
          thunderMarker.push(marker)
          marker.addTo(zmap)
        }
      })
    }
    removeThunder() {
      if (!thunderMarker.length) return
      for (let el of thunderMarker)
        zmap.removeLayer(el)
      thunderMarker = []
    }

    // 雷达
    addCappiLayer() {
      this.hasLoadData = false
      let bounds = zmap.getBounds(),
        left = bounds._southWest.lng,
        right = bounds._northEast.lng,
        top = bounds._northEast.lat,
        bottom = bounds._southWest.lat
      this.bounds = [[top,left], [bottom,right]]
      let time = new Date(this.datetime).getTime()
      time = time - time % (6*60*1000)
      time = time - (this.timeNumber - this.timeIndex) * this.timeInterval*60*1000
      let datetime = moment(time).format('YYYY-MM-DD HH:mm:00')
      let width = String(window.innerWidth || document.body.clientWidth),
          height = String(window.innerHeight || document.body.clientHeight)
      let url = this.urlConf.cappi.replace('{datetime}', datetime).replace('{left}',left).replace('{right}',right).replace('{top}',top).replace('{bottom}',bottom).replace('{width}',width).replace('{height}',height)
      console.log(url)
      this.loadImage(url)
      .then(() => {
        this.hasLoadData = true
        if (!this.isComponetAlive || this.elementSelected !== 'cappi') {
          this.removeCappiLayer()
          return
        }
        if (!cappiLayer) {
          cappiLayer = L.imageOverlay(url, this.bounds)
          cappiLayer.addTo(zmap)
        } else {
          cappiLayer.setUrl(url)
          let bounds = L.latLngBounds(L.latLng(this.bounds[0][0], this.bounds[0][1]), L.latLng(this.bounds[1][0], this.bounds[1][1]))
          cappiLayer.setBounds(bounds)
        }
      })
      .catch(() => {
        this.hasLoadData = true
        this.removeCappiLayer()
      })
    }
    removeCappiLayer() {
      if (cappiLayer) {
        zmap.removeLayer(cappiLayer)
        cappiLayer = null
      }
    }

    // 云图
    addCloudLayer() {
      this.hasLoadData = false
      let time = new Date(this.datetime).getTime()
      time = time - time % (6*60*1000)
      time = time - (this.timeNumber - this.timeIndex) * this.timeInterval*60*1000
      let datetime = moment(time).format('YYYY-MM-DD HH:mm:00')
      let url = this.urlConf.cloud.replace('{datetime}', datetime)
      console.log(url)
      this.loadImage(url)
      .then(() => {
        this.hasLoadData = true
        if (!this.isComponetAlive || this.elementSelected !== 'cloud') {
          this.removeCloudLayer()
          return
        }
        if (!cloudLayer) {
          cloudLayer = L.imageOverlay(url, this.cloudBounds)
          cloudLayer.addTo(zmap)
        } else {
          cloudLayer.setUrl(url)
        }
      })
      .catch(() => {
        this.hasLoadData = true
        this.removeCloudLayer()
      })
    }
    removeCloudLayer() {
      if (cloudLayer) {
        zmap.removeLayer(cloudLayer)
        cloudLayer = null
      }
    }

    loadImage(url: string) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () =>  resolve()
        img.onerror = () => reject()
        img.src = url
      })
    }

    play() {
      this.isPlaying = !this.isPlaying
      if (this.isPlaying) {
        this.transitionHolder = true
        this.$nextTick(() => {
          this.playEvet()
          this.intervalHolder = setInterval(this.playEvet, 2500)
        })
      } else {
        this.transitionHolder = false
        if (this.intervalHolder) {
          clearInterval(this.intervalHolder)
          this.intervalHolder = null
        }
      }
    }
    playEvet() {
      if (!this.hasLoadData) {
        clearInterval(this.intervalHolder)
        this.intervalHolder = null
        let holder = setInterval(() => {
          if (this.hasLoadData) {
            clearInterval(holder)
            this.intervalHolder = setInterval(this.playEvet, 2500)
          }
        }, 100)
        return
      }
      if (this.timeIndex === this.timeNumber) {
        this.transitionHolder = false
        this.$nextTick(() => {
          this.timeIndex = 1
          setTimeout(() => this.transitionHolder = true, 10)
        })
      } else {
        this.timeIndex++
      }
    }

    toggleTimeIndex(index) {
      if (this.isPlaying) return
      this.timeIndex = index
    }

    @Watch('timeIndex')
    ontimeIndexChanged (val: number, oldVal: number) {
      if (this.elementSelected === 'thunder') {
        this.addThunderLayer()
      } else if (this.elementSelected === 'cappi') {
        this.addCappiLayer()
        zmap.on('moveend', this.addCappiLayer)
      } else if (this.elementSelected === 'cloud') {
        this.addCloudLayer()
      }
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#SwanProduct {
  position: absolute;
  top: calc(100vh - 80px); /*no*/
  right: 70px; /*no*/
  height: 50px; /*no*/
  box-shadow: 0 0 10px #8d9db5;
  transition: all .3s linear;
  &.up {
    transform: translateY(-128px); /*no*/
  }
  .time-wrapper {
    position: absolute;
    top: -30px; /*no*/
    left: 0;
    height: 24px; /*no*/
    background: #fff;
    box-shadow: 0 0 5px #8d9db5; /*no*/
  }
  .left-wrapper {
    float: left;
    width: 268px; /*no*/
    height: 100%;
    background: $themeColor;
    .tabs {
      height: 22px; /*no*/
      padding-top: 4px; /*no*/
      ul {
        li {
          float: left;
          width: 64px; /*no*/
          height: 22px; /*no*/
          line-height: 22px; /*no*/
          color: #fff;
          text-align: center;
          border-radius: 11px; /*no*/
          cursor: pointer;
          &.on { background: #1092d3; }
          &:first-child {
            margin-left: 38px; /*no*/
          }
        }
      }
    }
    .time {
      position: relative;
      margin: 4px 10px; /*no*/
      height: 16px; /*no*/
      .inner {
        position: absolute;
        top: 7px; /*no*/
        left: 0px;
        width: 100%;
        height: 2px; /*no*/
        background: #45c0fc;
        border-radius: 3px; /*no*/
      }
      .progress {
        position: absolute;
        top: 7px; /*no*/
        left: 0px; /*no*/
        width: 10%;
        height: 2px; /*no*/
        background: #fff;
        border-radius: 3px; /*no*/
        &.on {
          transition: all 2.3s linear;
        }
      }
      ul {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 16px; /*no*/
        display: flex;
        justify-content: space-between;
        align-items: center;
        li {
          position: relative;
          margin-left: -4px; /*no*/
          width: 8px; /*no*/
          height: 8px; /*no*/
          border-radius: 50%;
          background: #45c0fc;
          cursor: pointer;
          &::after {
            position: absolute;
            top: 2px; /*no*/
            left: 2px; /*no*/
            content: '';
            width: 4px; /*no*/
            height: 4px; /*no*/
            border-radius: 50%;
            background: #fff;
          }
        }
      }
      .curbtn {
        position: absolute;
        top: 0;
        left: 0;
        margin-left: -6px; /*no*/
        box-sizing: border-box;
        width: 16px; /*no*/
        height: 16px; /*no*/
        color: $themeColor;
        line-height: 16px; /*no*/
        text-align: center;
        border-left: 1px solid $themeColor;
        border-right: 1px solid $themeColor;
        background: #fff;
        border-radius: 0;
        cursor: pointer;
        &.on {
          transition: all 2.3s linear;
        }
      }
    }
  }
  .btn-wrapper {
    position: relative;
    float: left;
    width: 50px; /*no*/
    height: 100%;
    background: #fff;
    cursor: pointer;
    .play-btn {
      position: absolute;
      top: 15px; /*no*/
      left: 16px; /*no*/
      width: 0;
      height: 0;
      border-top: 10px solid transparent; /*no*/
      border-bottom: 10px solid transparent; /*no*/
      border-left: 18px solid #7dd0f9; /*no*/
      cursor: pointer;
      &:hover { border-left: 20px solid $themeColor; } 
    }
    &.on {
      .play-btn {
        width: 18px; /*no*/
        height: 20px; /*no*/
        border: none;
        &::before {
          position: absolute;
          top: 0;
          left: 2px; /*no*/
          width: 4px; /*no*/
          height: 20px; /*no*/
          content: '';
          background: #7dd0f9;
        }
        &::after {
          position: absolute;
          top: 0;
          right: 2px; /*no*/
          width: 4px; /*no*/
          height: 20px; /*no*/
          content: '';
          background: #7dd0f9;
        }
        &:hover {
          &::before, &::after { background: $themeColor; }
        }
      }
    }
  }
}
</style>

<style lang='scss'>
#SwanProduct {
  .el-date-editor.el-input {
    width: 140px; /*no*/
  }
  .el-input__inner {
    height: 24px; /*no*/
    padding: 0;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .el-input__prefix {
    display: none;
  }
}
</style>