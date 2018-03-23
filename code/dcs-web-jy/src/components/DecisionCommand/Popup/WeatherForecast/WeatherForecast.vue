<template>
  <main id="WeatherForecast" :class="['cf', {up: typhTimelineStatus_global !== 'search'}]">
    <main class="weather-option-container">
    <div v-on:click.stop="toggleElementSelection"
             :class="['stn', 'right-line', {on: isElementSelectionShow}]">
      <span>{{ elementSelectedString }}</span>
    </div>
    <el-date-picker v-model="dateTime" size="small" :editable="false"
            :clearable="false" type="date"></el-date-picker>
    <div v-on:click.stop="toggleHourSelection"
        :class="['stn', 'left-line', {on: isHourSelectionShow}]">
      <span>{{ hourSelectedString }}</span>
    </div>
  </main>
  <main class="time-category">{{ timeCategory }}</main>
  <progress-panel :onPlaying="onPlaying"
                :forceStopPlaying="forceStopPlaying"
                :isComputeStartPositionNeeded="false"
                :isLoadData="isLoadData"
                :isContinuePlaying="true"
                :toggleLoadData="toggleLoadData"
                :onPlayingStart="onPlayingStart"
                :onPlayingChange="onPlayingChange"
                :onPlayingStop="onPlayingStop"
                :onForseeHourOver="onForseeHourOver"
                :playingDateString="playingDateString"
                :tipDateString="tipDateString"
                :elementSelected="elementSelected"
                :animationDuration="4"
                :dateString="dateString"
                :isGlobalTimeZone="elementSelected.includes('wind')"
                :forseeData="forseeHourData[elementSelected]"
                :multiplier="seedMultiplier"
                :startHourSelected="hourSelected"></progress-panel>
    <transition name="top-fade">
      <main v-show="isElementSelectionShow"
            class="element-selection-wrapper">
        <div :class="{on: elementSelected === 'qpfhour'}"
            v-on:click="selectElement('qpfhour', '短临降雨')">短临降雨</div>
        <div :class="{on: elementSelected === 'wind'}"
            v-on:click="selectElement('wind', '风')">风</div>
      </main>
    </transition>
    <transition name="top-fade">
      <main v-show="isHourSelectionShow"
            class="element-selection-wrapper hour-selection"
            :style="{left: '188px', top: (elementSelected === 'qpfhour' ? '-89px' : '-45px')}">
        <div :class="['hour-detail', {'on': hourSelected === el}]" v-on:click="selectHour(el)"
            v-for="el in leadTimeForRender" :key="el">
          {{ elementSelected.includes('wind') ? (el == 12 ? '20' : '08') : el }}:00
        </div>
      </main>
    </transition>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import ProgressPanel from '../../CommonCompts/ProgressPanel.vue'
  import moment from 'moment'
  import { weatherForecastClient } from '@/util/ClientHelper'
  import { colors_rain } from '@/config/rainConf'

  let L: any = null,
      zmap: any = null,
      windlayer: any = null,
      rainlayer: any = null

  @Component({
    components: {
      ProgressPanel
    },
  })
  export default class WeatherForecast extends Vue {
    @Getter('decisionStore/typhTimelineStatus_global') typhTimelineStatus_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storeWindPickingValue_global') storeWindPickingValue_global
    @Action('decisionStore/storerainPickingValue_global') storerainPickingValue_global
    @Action('decisionStore/storeColorTable_global') storeColorTable_global
    isComponentAlive: boolean = true
    playingStatus: string = ''
    timeCategory: '分' | '时' = '时'
    dateTime: Date = new Date           // 日历日期
    dateString: string = ''             // 日历日期字符串

    isElementSelectionShow: boolean = false           // 元素选择框
    elementSelected: 'qpfhour' | 'wind' = 'qpfhour'
    elementSelectedString: string = '短临降雨'

    isHourSelectionShow: boolean = false              // 小时选择框
    hourSelected: number = 0
    hourSelectedString: string = '00:00'

    windRegion: 0 | 1 | 2 = 0
    seedMultiplier: number = 1     // 时间间隔

    forseeHourData = {             // 预测时间个数
      qpfhour: 3,
      wind: 56
    }
    leadTimeHolder: { wind: number[], rain: number[] } = {    // 起报时间
      wind: [0, 12],
      rain: (() => {
        let arr: number[] = []
        for (let i = 0; i < 24; i++) arr.push(i)
        return arr
      })()
    }
    leadTimeForRender: number[] = this.leadTimeHolder.rain

    tipDateString: any = { date: '', hour: '' }
    playingDateString: any = { date: '', hour: '' }

    forceStopPlaying = Date.now()
    isLoadData: boolean = false                 // 用于判断数据添加是否完成

    async mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      this.dateString = moment().format('YYYY-MM-DD')
      this.selectHour(Number(moment().format('HH')))
      this.storeColorTable_global({ type: 'add', data: { type: 'rain', flag: 'rain', label: '降雨' } })
    
      let res = await weatherForecastClient.getLastRainField()
      if (!res || !res.startTime) return
      let startTime = res.startTime
      this.dateString = moment(startTime).format('YYYY-MM-DD')
      this.selectHour(Number(moment(startTime).format('HH')))
    }
    
    beforeDestroy() {
      this.deleteColorBar()
      this.clearWindField()
      this.clearRainField()
      L = null
      zmap = null
      this.isComponentAlive = false
    }

    // 用于播放回调
    toggleLoadData() {
      this.isLoadData = false
    }

    @Watch('dateTime')
    ondateTimeChanged (val: any, oldVal: any) {
      this.dateString = moment(val).format('YYYY-MM-DD')
    }

    deleteColorBar() {
      if (this.elementSelected === 'qpfhour')
        this.storeColorTable_global({ type: 'delete', data: { type: 'rain', flag: 'rain' } })
      // else if (this.elementSelected === 'wind')
      //   this.storeColorTable_global({ type: 'delete', data: { type: 'wind', flag: 'wind' } })
    }

    // 元素选择
    selectElement(element, string: string) {
      this.isElementSelectionShow = false
      if (this.elementSelected === element) return
      this.deleteColorBar()
      if (element === 'qpfhour')
        this.storeColorTable_global({ type: 'add', data: { type: 'rain', flag: 'rain', label: '降雨' } })
      // else if (element === 'wind')
      //   this.storeColorTable_global({ type: 'add', data: { type: 'wind', flag: 'wind', label: '风速' } })
      this.elementSelected = element
      this.elementSelectedString = string
      if (element.includes('wind')) {
        this.leadTimeForRender = this.leadTimeHolder.wind
        switch (element) {
          case 'wind0': this.windRegion = 0; break;
          case 'wind1': this.windRegion = 1; break;
          case 'wind2': this.windRegion = 2; break;
          default: this.windRegion = 0; break;
        }
      }
      else
        this.leadTimeForRender = this.leadTimeHolder.rain

      if (this.elementSelected.includes('wind')) {
        this.hourSelected = this.leadTimeForRender[0]
        this.hourSelectedString = moment(`${this.dateString} ${this.hourSelected}:00`).add(8, 'hours').format('HH:00')
      } else
        this.selectHour(Number(moment().format('HH')))
    }

    // 元素切换
    @Watch('elementSelected')
    onelementSelectedChanged(val: any, oldVal: any): void {
      this.forceStopPlaying = Date.now()
      if (val === 'qpfhour') {
        this.seedMultiplier = 1
        this.timeCategory = '时'
      } else if (val === 'wind') {
        this.seedMultiplier = 3
        this.timeCategory = '时'
      }
      if (oldVal === 'qpfhour')
        this.clearRainField()
      else if (oldVal === 'wind')
        this.clearWindField()
    }

    // 切换显示元素选择面板
    toggleElementSelection() {
      this.isHourSelectionShow = false
      this.isElementSelectionShow = !this.isElementSelectionShow
    }

    // 切换显示小时面板
    toggleHourSelection() {
      this.isElementSelectionShow = false
      this.isHourSelectionShow = !this.isHourSelectionShow
      if (this.isHourSelectionShow)
        this.$nextTick(() => {
          let hourSelectionEl = <HTMLDivElement>document.querySelector('.hour-selection')
          hourSelectionEl.scrollTop = (this.hourSelected - 1) * 22
        })
    }

    // 小时选择
    selectHour(hour) {
      this.hourSelected = hour
      if (this.elementSelected.includes('wind'))
        this.hourSelectedString = moment(`${this.dateString} ${this.hourSelected}:00`).add(8, 'hours').format('HH:00')
      else
        this.hourSelectedString = moment(`${this.dateString} ${this.hourSelected}:00`).format('HH:00')
      this.isHourSelectionShow = false
    }

    // 播放状态改变
    onPlaying(val) {
      this.playingStatus = val
    }

    // 初始播放事件
    async onPlayingStart(val) {
      this.playingDateString = this.computeDateTimeString(val)

      if (this.elementSelected === 'qpfhour') {
        await this.drawRainField(val)
        zmap.on('mousemove', this.getPointRainEvent)
      } else {
        await this.drawWindField()
        zmap.on('mousemove', this.getPointWindEvent)
      }
    }

    // 播放事件
    async onPlayingChange(val: any, oldVal: any) {
      this.playingDateString = this.computeDateTimeString(val)
      if (this.elementSelected === 'qpfhour') 
        this.drawRainField(val)
      else if (this.elementSelected.includes('wind'))
        this.drawWindField()
    }

    // 终止播放事件
    async onPlayingStop(val: number, oldVal: number) {
      this.clearWindField()
      this.clearRainField()
    }

    onForseeHourOver(el) {
      this.tipDateString = this.computeDateTimeString(el)
    }

    computeDateTimeString(playingSeed) {
      let date
      if (this.elementSelected.includes('wind')) {
        date = moment(`${this.dateString} ${this.hourSelected === 0 ? '00' : 12}:00:00`)
        date.add(8, 'hours')
        date.add(playingSeed * this.seedMultiplier, 'hours')
      }
      else if (this.elementSelected === 'qpfhour') {
        date = moment(`${this.dateString} ${this.hourSelected}:00:00`)
        date.add(playingSeed * this.seedMultiplier, 'hours')
      }
      else {
        date = moment(`${this.dateString} ${this.hourSelected}:00:00`)
        date.add(playingSeed * this.seedMultiplier, 'minutes')
      }

      return {
        date: date.format('YYYY-MM-DD'),
        hour: date.format('HH:mm')
      }
    }

    /***** 数据处理 *****/
    getDateStringForFetch() {
      let dateObj = moment(`${this.dateString} ${this.hourSelected}:00`)
      if (this.elementSelected.includes('wind'))
        return dateObj.subtract(12, 'hours').format('YYYY-MM-DD HH:mm:00')
      else
        return dateObj.format('YYYY-MM-DD HH:00:00')
    }

    // 获取格点风场数据 绘制
    async drawWindField() {
      let date = `${this.playingDateString.date} ${this.playingDateString.hour}:00`
      let res = await weatherForecastClient.getWindField(date)
      if (!res) Vue['prototype']['$message']({ type: 'error', message: '选中时次无数据' })
      if (!this.isComponentAlive || this.playingStatus === 'stop' || !res) {
        if (windlayer) {
          zmap.removeLayer(windlayer)
          windlayer = null
        }
        // this.isLoadData = false
        this.isLoadData = true   
        return     
      }
      // res.gridinfo.xgap = res.gridinfo.xgrap
      // res.gridinfo.ygap = res.gridinfo.ygrap
      if (windlayer) zmap.removeLayer(windlayer)
      setTimeout(() => {
        windlayer = L.windLayer(res.u10m, res.v10m, res.gridinfo, 'line')
        windlayer.addTo(zmap)
        this.isLoadData = true
      }, 0)
    }

    // 风场数据获取 鼠标移动事件
    getPointWindEvent(e) {
      if (!windlayer) {
        this.storePopupStatus_global({ key: 'windPicking', action: false })
        return
      }
      let pointWind = windlayer.interp(e.latlng.lng, e.latlng.lat)
      if (!pointWind || pointWind.vel > 300) {
        this.storePopupStatus_global({ key: 'windPicking', action: false })
        return
      }
      let x = e.containerPoint.x,
          y = e.containerPoint.y
      pointWind.pos = { x, y }
      this.storeWindPickingValue_global(pointWind)
      this.storePopupStatus_global({ key: 'windPicking', action: true })
    }

    // 清除风场数据
    clearWindField() {
      if (windlayer) {
        zmap.removeLayer(windlayer)
        windlayer = null
      }
      zmap.off('mousemove', this.getPointWindEvent)
      this.storePopupStatus_global({ key: 'windPicking', action: false })
    }

    // 获取短临降雨数据
    async drawRainField(playingSeed) {
      let dateTime = this.getDateStringForFetch()
      let res = await weatherForecastClient.getRainField(dateTime, playingSeed * this.seedMultiplier * 60)
      if (!res || res.rain[0][0] === null)
        Vue['prototype']['$message']({ type: 'error', message: '选中时次无数据' })
      if (!this.isComponentAlive || this.playingStatus === 'stop' || !res || res.rain[0][0] === null) {
        if (rainlayer) {
          zmap.removeLayer(rainlayer)
          rainlayer = null
        }
        // this.isLoadData = false
        this.isLoadData = true 
        return      
      }
      // res.gridinfo.xgap = res.gridinfo.xgrap
      // res.gridinfo.ygap = res.gridinfo.ygrap
      if (rainlayer) zmap.removeLayer(rainlayer)
      
      res.rain.map((el, i, self) => {
        el.map((opt, j) => {
          if (typeof opt !== 'number' || isNaN(opt))
            self[i][j] = 0
        })
      })
      setTimeout(() => {
        // rainlayer = L.shadeLayer(res.rain, res.gridinfo, colors_rain)        
        rainlayer = L.shadeLayer(res.rain, res.gridinfo, colors_rain, L.Util.Bounds.SimpleGuangDong, {debug:false})
        rainlayer.addTo(zmap)
        this.isLoadData = true
      }, 0)
    }

    // 雨量详细数据获取 鼠标移动事件
    getPointRainEvent(e) {
      if (!rainlayer) {
        this.storePopupStatus_global({ key: 'rainPicking', action: false })
        return
      }
      let val = rainlayer.interp(e.latlng.lng, e.latlng.lat)
      let x = e.containerPoint.x,
          y = e.containerPoint.y
      let dist = {
        val,
        pos: { x, y }
      }
      this.storerainPickingValue_global(dist)
      this.storePopupStatus_global({ key: 'rainPicking', action: true })
    }

    // 清除降雨数据
    clearRainField() {
      if (rainlayer) {
        zmap.removeLayer(rainlayer)
        rainlayer = null
      }
      zmap.off('mousemove', this.getPointRainEvent)
      this.storePopupStatus_global({ key: 'rainPicking', action: false })
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#WeatherForecast {
  position: absolute;
  top: calc(100vh - 105px); /*no*/
  right: 75px; /*no*/
  transition: all .3s linear;
  &.up {
    transform: translateY(-128px); /*no*/
  }
}

.time-category {
  font-size: 10px; /*no*/
  color: #929292;
  position: absolute;
  bottom: 11.5px; /*no*/
  left: 4px; /*no*/
}

.weather-option-container {
  margin-bottom: 2px; /*no*/
  height: 26px; /*no*/
  width: 100%;
  cursor: pointer;
  .stn {
    box-sizing: border-box;
    background-color: #fff;
    color: #5a5e66;
    height: 26px; /*no*/
    width: 92px; /*no*/
    float: left;
    position: relative;
    line-height: 26px; /*no*/
    text-align: center;
    &:hover, &.on {
      background: #f2f2f2;
    }
    &:active {
      background: #e0e0e0;
    }
    &.right-line {
      border-right: 1px solid #eee; /*no*/
    }
    &.left-line {
      border-left: 1px solid #eee; /*no*/
    }
  }
}

.element-selection-wrapper {
  position: absolute;
  top: -57px; /*no*/
  overflow: hidden;
  box-sizing: border-box;
  background-color: #fff;
  color: #5a5e66;
  width: 92px; /*no*/
  div {
    padding: 0 10px; /*no*/
    font-size: 12px; /*no*/
    height: 28px; /*no*/
    line-height: 28px; /*no*/
    cursor: pointer;
    &:hover { background: #f2f2f2; }
    &:active { background: #e0e0e0; }
    &.on { color: $themeColor; }
  }
}

.hour-selection {
  max-height: 88px; /*no*/
  overflow-y: auto;
  .hour-detail {
    height: 22px; /*no*/
    line-height: 22px; /*no*/
    text-align: center;
    cursor: pointer;
  }
  &::-webkit-scrollbar {
    width: 8px; /*no*/
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px; /*no*/
  }
}


.top-fade-enter-active, .top-fade-leave-active {
  transition: all .3s ease;
}
.top-fade-enter, .top-fade-leave-to {
  transform: translateY(1px); /*no*/
  opacity: 0;
}
</style>

<style lang='scss'>
@import '../../../../styles/theme.scss';
#WeatherForecast {
  .el-date-editor.el-input {
    float: left;
    width: 96px; /*no*/
    height: 26px; /*no*/
    line-height: 26px; /*no*/
    .el-input__inner {
      box-sizing: border-box;
      padding: 0;
      text-align: center;
      border: none;
      border-radius: 0;
      cursor: pointer;
      &:hover { background: #f2f2f2; }
      &:active { background: #e0e0e0; }
    }
    .el-input__prefix, .el-input__suffix {
      display: none;
    }
  }
  .el-input--small .el-input__inner {
    height: 26px; /*no*/
  }
}
</style>