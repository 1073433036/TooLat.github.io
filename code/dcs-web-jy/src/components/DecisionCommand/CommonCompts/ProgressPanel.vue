<template>
  <main id="ProgressPanel">
    <main class="play-control-container">
      <fieldset class="play-time-line-wrapper">
        <section class="play-time-line">
          <div class="datetime-indicator shadow"
              :style="{transition: isProgressTransition ? `all ${animationDuration - 1}s linear` : '', transform: `translateX(${progress}px)`}"
              v-show="isPlaying !== 'stop'">
            <article>
              <div>{{ playingDateString.date }}</div>
              <div>{{ playingDateString.hour }}</div>
            </article>
            <svg width="10px" height="4px">
              <path d="M 0,0 L 10,0 L 5,4 Z"></path>
            </svg>
          </div>
          <div style="position: absolute; z-index: 28"
              class="background-bar-wrapper"
              v-on:click.stop="changeRangeByClick">
            <span class="gray-bar"
                  :style="{transition: isProgressTransition ? `all ${animationDuration - 1}s linear` : '', width: progress + 'px'}"></span>
            <span class="color-bar"
                  :style="{transition: isProgressTransition ? `all ${animationDuration - 1}s linear` : '', width: progress + 'px'}"></span>
            <em class="end-point-wrapper">
              <span class="end-point"
                    :style="{transition: isProgressTransition ? `all ${animationDuration - 1}s linear` : '', transform: `translateX(${progress}px)`}"></span>
            </em>
          </div>
        </section>
        <section class="time-indicator">
          <span class="time-indicator-item" v-for="el in 9" :key="el"></span>
        </section>
        <section class="time-wrapper" style="position: absolute; z-index: 30">
          <span v-for="el in forseeData" :key="el"
                v-on:mouseout="isShowingTipDateString = false"
                v-on:mouseover="displayTipDateStringPanel(el)"
                v-on:click="changeRangeByHour(el)">{{ el * multiplier }}</span>
        </section>
        <section class="scroll-bar" v-show="scrollBtnWidth !== 93">
          <span class="start-box"></span>
          <div class="scroll-btn" v-on:mousedown="startScroll"
              :style="{width: scrollBtnWidth + '%', left: actualPositionX + 'px'}"></div>
          <span class="end-box"></span>
        </section>
      </fieldset>
      <fieldset class="play-btn-wrapper" v-on:click="togglePlaying"
          :title="isPlaying === 'playing' ? '暂停' : '播放'">
        <span :class="[isPlaying === 'playing' ? 'playing' : 'stop']"></span>
      </fieldset>
      <!-- <fieldset class="stop-btn-wrapper" v-on:click="isPlaying = 'stop'" title="终止">
        <span></span>
      </fieldset> -->
    </main>
    <main class="datetime-indicator shadow"
          v-show="isShowingTipDateString"
          style="z-index: 29;left: -10px; top: 10px"
          :style="{transform: `translateX(${tipDatetimeIndex * 27}px)`}">
      <article>
        <div>{{tipDateString.date}}</div>
        <div>{{tipDateString.hour}}</div>
      </article>
      <svg width="10px" height="4px">
        <path d="M 0,0 L 10,0 L 5,4 Z"></path>
      </svg>
    </main>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'

  let progressTimeout: any = null, progressInterval: any = null

  @Component
  export default class ProgressPanel extends Vue {
    @Prop({ default: 10 }) forseeData
    @Prop({ default: 1 }) multiplier
    @Prop({ default: 0 }) startHourSelected
    @Prop({ default: false }) isGlobalTimeZone
    @Prop() elementSelected
    @Prop() onForseeHourOver
    @Prop({ default: new Object({ date: '', hour: '' }) }) playingDateString
    @Prop({ default: new Object({ date: '', hour: '' }) }) tipDateString
    @Prop({ default: 0 }) forceStopPlaying
    @Prop({ default: 0 }) forcePausePlaying
    @Prop({ default: false }) isComputeStartPositionNeeded
    @Prop({ default: Function }) onPlaying
    @Prop({ default: Function }) onPlayingChange
    @Prop({ default: Function }) onPlayingStop
    @Prop({ default: Function }) onPlayingStart
    @Prop({ default: false }) isContinuePlaying
    @Prop({ default: 1 }) startPlayingSeed
    @Prop({ default: null }) startChangeTextColor
    @Prop({ default: 3 }) animationDuration
    @Prop({ default: false }) isLoadData
    @Prop() toggleLoadData

    hourWrapperWidth: number = 0
    playingSeed: number = 1
    hourItemTotalWidth: number = 168 * 27
    xSubtract: number = 0
    actualPositionX: number = 10
    xOffset: number = 0
    timeout: any = null
    maxPositionX: number = 0
    minPositionX: number = 0
    scrollBarWidth: number = 0
    isPlaying: 'playing' | 'pause' | 'stop' = 'stop'
    // progress: number = 251
    progress: number = 8
    isShowingTipDateString: boolean = false
    toggleTimeoutDelay: boolean = true
    tipDatetimeIndex: number = 1
    isProgressTransition: boolean = false

    get scrollBtnWidth() {
      let present = (259 / this.hourItemTotalWidth)
      if (present > 1)
        return 100 - 7
      else
        return (present * 100 - 7).toFixed(1)
    }

    mounted() {
      let windHeight = document.body.clientHeight
      this.hourItemTotalWidth = this.forseeData * 27
      let timeWrapperEl = <HTMLTableSectionElement>document.querySelector('.time-wrapper')
      this.hourWrapperWidth = timeWrapperEl.clientWidth
      let scrollBarEl = <HTMLTableSectionElement>document.querySelector('.scroll-bar')
      let scrollBtnEl = <HTMLDivElement>document.querySelector('.scroll-btn')
      this.scrollBarWidth = scrollBarEl.clientWidth - 20 - scrollBtnEl.clientWidth
      let startBoxEl = <HTMLSpanElement>document.querySelector('.start-box')
      this.minPositionX = startBoxEl.getBoundingClientRect().left

      if (this.isComputeStartPositionNeeded)
        this.computeStartPosition()
    }

    @Watch('forseeData')
    onforseeDataChanged(val: any, oldVal: any): void {
      this.hourItemTotalWidth = this.forseeData * 27
      this.actualPositionX = 10
    }

    @Watch('forceStopPlaying')
    onforceStopPlayingChanged(val: any, oldVal: any): void {
      this.isPlaying = 'stop'
    }

    @Watch('forcePausePlaying')
    onforcePausePlayingChanged(val: any, oldVal: any): void {
      this.isPlaying = 'pause'
    }

    @Watch('isPlaying')
    async onisPlayingChange(val: 'playing' | 'stop' | 'pause', oldVal: 'playing' | 'stop' | 'pause') {
      this.onPlaying(val)
      if (val === 'playing' && oldVal === 'stop') {         // 从头播放
        this.playingSeed = this.computeLeadTimeRange().startHour

        this.startPlayingInterval()

        this.progress = 8
        setTimeout(() => {
          this.isProgressTransition = true
        }, 0)

        this.onPlayingStart(this.playingSeed)
      } else if (val === 'pause' && oldVal === 'playing') {   // 暂停
        this.isProgressTransition = false
        clearTimeout(progressTimeout)
        progressTimeout = null
        clearInterval(progressInterval)
        progressInterval = null
      } else if (val === 'playing' && oldVal === 'pause') {   // 继续播放
        this.isProgressTransition = true
        this.startPlayingInterval(true)
      } else if (val === 'stop') {      // 终止
        this.isProgressTransition = false
        clearTimeout(progressTimeout)
        progressTimeout = null
        clearInterval(progressInterval)
        progressInterval = null

        this.playingSeed = this.computeLeadTimeRange().startHour
        this.actualPositionX = 10
        this.progress = 8

        this.onPlayingStop(this.playingSeed)
      }
    }

    @Watch('playingSeed')
    onplayingSeedChanged(val: any, oldVal: any): void {
      if (this.isPlaying !== 'stop')
        this.onPlayingChange(val)
    }

    @Watch('elementSelected')
    onelementSelectedChanged(val: any, oldVal: any): void {
      this.hourItemTotalWidth = this.forseeData * 27
      if (this.isComputeStartPositionNeeded)
        this.computeStartPosition()
    }

    changeRangeByHour(hour: number) {
      if (this.isPlaying !== 'pause') return
      let timeWrapperEl = <HTMLTableSectionElement>document.querySelector('.time-wrapper')
      let startHour = timeWrapperEl.scrollLeft / 27 + 1
      this.progress = (hour - startHour) * 27 + 8
      this.playingSeed = hour
    }

    changeRangeByClick(e: MouseEvent) {
      if (this.isPlaying !== 'pause') return

      let colorBarEl = <HTMLSpanElement>document.querySelector('.color-bar')
      let clickPositionX = e.clientX - colorBarEl.getBoundingClientRect().left
      let computedNumber = (clickPositionX - 8) % 27
      if (computedNumber > 13.5) {
        this.progress = clickPositionX - computedNumber + 27
      } else {
        this.progress = clickPositionX - computedNumber
      }
    }

    // 播放循环核心函数
    startPlayingInterval(isPauseToPlaying: boolean = false) {
      let range = this.computeLeadTimeRange(),
        startHour = range.startHour,
        endHour = range.endHour,
        eachScale: number = 0
      if (isPauseToPlaying) {       // 是否是继续播放
        if (this.playingSeed === endHour) {
          this.isProgressTransition = false
          this.$nextTick(() => {
            this.playingSeed = startHour
            this.progress = 8
            setTimeout(() => {
              this.isProgressTransition = true
            }, 0)
          })
        } else {
          this.playingSeed++
          this.progress = (this.playingSeed - startHour) * 27 + 8
        }
      }

      const timeoutFn = () => {
        if (this.playingSeed === this.forseeData || startHour + 9 === this.playingSeed && !this.isContinuePlaying) {
          progressTimeout = null
          this.toggleLoadData()
          this.isPlaying = 'pause'
          return
        } else if (this.isContinuePlaying && startHour + 9 === this.playingSeed) {
          this.isProgressTransition = false

          if (this.maxPositionX === 0) {
            let endBoxEl = <HTMLSpanElement>document.querySelector('.end-box')
            let scrollBtnEl = <HTMLDivElement>document.querySelector('.scroll-btn')
            this.maxPositionX = endBoxEl.getBoundingClientRect().left - scrollBtnEl.clientWidth
          }

          let offsetPercent: number = 0,
            isNotEnoughItem: boolean = false

          if (this.playingSeed + 10 > this.forseeData) {
            isNotEnoughItem = true
            this.actualPositionX = this.maxPositionX - this.minPositionX
          } else {
            isNotEnoughItem = false
            console.info(this.playingSeed)
            this.actualPositionX = this.playingSeed * 27 / (this.hourItemTotalWidth - 270)
              * (this.maxPositionX - this.minPositionX - 10) + 10
          }


          this.$nextTick(() => {
            startHour = this.computeLeadTimeRange().startHour
            this.progress = (this.playingSeed - startHour) * 27 + 8
            setTimeout(() => {
              this.isProgressTransition = true
            }, 0)
          })
        }

        this.playingSeed++
        this.progress = (this.playingSeed - startHour) * 27 + 8

        replayFn()
      }

      const replayFn = () => {
        if (this.isLoadData) {      // 数据加载完成
          this.toggleLoadData()
          progressTimeout = setTimeout(timeoutFn, this.animationDuration * 1000)
        } else {
          progressInterval = setInterval(() => {
            if (this.isLoadData) {
              clearInterval(progressInterval)
              progressInterval = null
              this.toggleLoadData()
              progressTimeout = setTimeout(timeoutFn, this.animationDuration * 1000)
            }
          }, 100)
        }
      }

      replayFn()
    }

    togglePlaying() {
      if (!this.toggleTimeoutDelay) return
      this.toggleTimeoutDelay = false
      setTimeout(() => {
        this.toggleTimeoutDelay = true
      }, 200)
      if (this.isPlaying === 'stop')
        this.isPlaying = 'playing'
      else if (this.isPlaying === 'pause')
        this.isPlaying = 'playing'
      else if (this.isPlaying === 'playing')
        this.isPlaying = 'pause'
    }

    displayTipDateStringPanel(el) {
      if (this.isPlaying === 'playing') return

      this.isShowingTipDateString = true
      let index = el - this.computeLeadTimeRange().startHour
      this.tipDatetimeIndex = index
      this.onForseeHourOver(el)

    }

    computeLeadTimeRange() {
      let timeWrapperEl = <HTMLTableSectionElement>document.querySelector('.time-wrapper')
      let startHour = timeWrapperEl.scrollLeft / 27 + 1
      let endHour = this.forseeData < 10 ? startHour + this.forseeData - 1 : startHour + 9
      return {
        startHour, endHour
      }
    }

    startScroll(e: MouseEvent) {
      if (this.isPlaying !== 'stop') return

      e.preventDefault()
      let endBoxEl = <HTMLSpanElement>document.querySelector('.end-box')
      let scrollBtnEl = <HTMLDivElement>document.querySelector('.scroll-btn')
      this.maxPositionX = endBoxEl.getBoundingClientRect().left - scrollBtnEl.clientWidth
      this.xSubtract = e.clientX - scrollBtnEl.getBoundingClientRect().left
      document.body.addEventListener('mousemove', this.scrollMove)
    }


    endScroll() {
      document.body.removeEventListener('mousemove', this.scrollMove)
    }

    scrollMove(e: any) {
      e.preventDefault()
      document.body.addEventListener('mouseup', this.endScroll)
      this.xOffset = e.clientX - this.xSubtract
      if (this.xOffset < this.minPositionX + 10) {
        this.actualPositionX = 10
      } else if(this.xOffset > this.maxPositionX) {
        this.actualPositionX = this.maxPositionX - this.minPositionX
      } else {
        this.actualPositionX = this.xOffset - this.minPositionX
      }
    }

    @Watch('actualPositionX')
    onactualPositionXChanged(val: any, oldVal: any): void {
      let scrollBarEl = <HTMLTableSectionElement>document.querySelector('.scroll-bar')
      let scrollBtnEl = <HTMLDivElement>document.querySelector('.scroll-btn')
      let scrollBarWidth = scrollBarEl.clientWidth - 20 - scrollBtnEl.clientWidth

      let leftPercentage = (val - 10) / scrollBarWidth
      let scrollWidth = this.hourItemTotalWidth - 270
      let scrollLeft = deterPercentage()
      let timeWrapperEl = <HTMLTableSectionElement>document.querySelector('.time-wrapper')
      timeWrapperEl.scrollLeft = scrollLeft
      function deterPercentage() {
        if (leftPercentage === 0) {
          return 0
        } else if (leftPercentage >= 1) {
          return scrollWidth
        }
        let preNumber: number = scrollWidth * leftPercentage,
          computedNumber: number = preNumber % 27

        if (computedNumber !== 0) {
          return preNumber - computedNumber + 27
        } else {
          return preNumber
        }
      }
    }

    computeStartPosition() {
      if (this.startPlayingSeed !== 0) {
        this.$nextTick(() => {
          let endBoxEl = <HTMLSpanElement>document.querySelector('.end-box')
          let scrollBtnEl = <HTMLDivElement>document.querySelector('.scroll-btn')
          this.maxPositionX = endBoxEl.getBoundingClientRect().left - scrollBtnEl.clientWidth
          let actualPositionX = this.startPlayingSeed * 27 / (this.hourItemTotalWidth - 270)
            * (this.maxPositionX - this.minPositionX - 10) + 10
          console.info(actualPositionX)
          if (actualPositionX > (this.maxPositionX - this.minPositionX))
            this.actualPositionX = this.maxPositionX - this.minPositionX
          else
            this.actualPositionX = actualPositionX
        })
      } else {
        let _playingSeed = 0,
          nowDateObj = moment(),
          seed: number = 0
        let scrollBarEl = <HTMLTableSectionElement>document.querySelector('.scroll-bar')
        let scrollBtnEl = <HTMLDivElement>document.querySelector('.scroll-btn')
        let maxPositionX = scrollBarEl.clientWidth - 20 - scrollBtnEl.clientWidth

        if (this.forseeData <= 10) {
          this.actualPositionX = 10
          return
        }
        if (this.isGlobalTimeZone) {
          let hour = Number(nowDateObj.format('HH'))
          let subtract = 0

          if (hour > 23) {
            subtract = 20
          } else {
            subtract = 8
          }
          let startHour = hour - subtract
          if (this.multiplier === 1)
            seed = startHour
          else
            seed = (startHour - startHour % this.multiplier) / this.multiplier
        } else {
          let minute = Number(nowDateObj.format('mm'))
          seed = (minute - minute % this.multiplier) / this.multiplier
        }

        if (seed != 0)
          seed -= 1
        let offsetPercent = seed * 27 / (this.hourItemTotalWidth - 270)
        this.actualPositionX = offsetPercent * maxPositionX + 10
      }
    }
  }
</script>

<style lang='scss' scoped>
#ProgressPanel {
  @import '../../../styles/theme';
  .datetime-indicator {
    position: absolute;
    width: 68px; /*no*/
    height: 32px; /*no*/
    line-height: 16px; /*no*/
    text-align: center;
    box-shadow: 0 0 5px gray; /*no*/
    left: -18px; /*no*/
    top: -2px; /*no*/
    transform: translateX(0);
    background-color: $themeColor;
    z-index: 2;
    article {
      color: #fff;
      font-size: 12px; /*no*/
    }
    svg {
      transform: translateY(-8px); /*no*/
      display: inline-block;
      path {
        fill: $themeColor;
      }
    }
  }

  .play-control-container {
    height: 46px; /*no*/
    width: 326px; /*no*/
    background-color: #fff;
    .play-time-line-wrapper {
      float: left;
      height: 100%;
      width: 280px; /*no*/
      .end-point-wrapper {
        display: block;
        width: 100%;
        position: relative;
        transform: translateX(-9px); /*no*/
      }
      .end-point {
        width: 12px; /*no*/
        height: 12px; /*no*/
        position: absolute;
        box-sizing: border-box;
        border: solid white 3px; /*no*/
        background-color: $themeColor;
        border-radius: 50%;
        box-shadow: 0px 2px 3px rgba(14, 50, 68, .7); /*no*/
        top: -3px; /*no*/
        left: -1.5px; /*no*/
      }
      .background-bar-wrapper {
        width: 250px; /*no*/
        margin: 9px 0 0 20px; /*no*/
        height: 6px; /*no*/
        background-color: #ddd;
        border-radius: 5px; /*no*/
        position: relative;
        cursor: pointer;
        .gray-bar, .color-bar {
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 5px; /*no*/
        }
        .gray-bar {
          background-color: #d9e0ea;
        }
        .color-bar {
          background-color: $themeColor;
        }
      }
      .time-indicator {
        transform: translateY(15px); /*no*/
        margin-left: 23px; /*no*/
        width: 248px; /*no*/
        height: 4px; /*no*/
        white-space: nowrap;
        .time-indicator-item {
          height: 100%;
          width: 26px; /*no*/
          float: left;
          border-left: solid 1px #3f587a; /*no*/
          &:last-of-type {
            border-right: solid 1px #3f587a; /*no*/
          }
        }
      }
      .time-wrapper {
        transform: translateY(15px); /*no*/
        width: 263px; /*no*/
        overflow-x: hidden;
        margin-left: 16px; /*no*/
        white-space: nowrap;
        span {
          color: #000;
          display: inline-block;
          font-size: 10px; /*no*/
          line-height: 14px; /*no*/
          height: 14px; /*no*/
          width: 17px; /*no*/
          cursor: pointer;
          text-align: center;
          padding-right: 5px; /*no*/
          margin-right: 5px; /*no*/
          &:hover {
            background-color: #fff;
            color: $themeColor;
          }
        }
      }
      .scroll-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 8px; /*no*/
        width: 279px; /*no*/
        background-color: #fff;
        .scroll-btn {
          height: 8px; /*no*/
          position: absolute;
          left: 10px; /*no*/
          background-color: #d7dadf;
          border-radius: 5px; /*no*/
          width: 100px; /*no*/
        }
        .start-box, .end-box {
          height: 100%;
          width: 10px; /*no*/
          display: block;
          position: absolute;
          background-position: center;
          background-repeat: no-repeat;
        }
        .start-box {
          border-radius: 0 0 0 3px; /*no*/
          background-image: url(~Img/DecisionCommand/ProgressPanel/date_left.png);
        }
        .end-box {
          right: 0;
          transform: rotateZ(180deg);
          background-image: url(~Img/DecisionCommand/ProgressPanel/date_left.png);
        }
      }
    }
  }

  .play-btn-wrapper {
    height: 100%;
    float: left;
    width: 46px; /*no*/
    background-color: $themeColor;
    text-align: center;
    cursor: pointer;
    span {
      margin: 14px; /*no*/
      display: inline-block;
      background-repeat: no-repeat;
      background-position: 0 0;
      &.playing {
        box-sizing: border-box;
        margin: 14px 16px; /*no*/
        width: 12px; /*no*/
        height: 18px; /*no*/
        border-left: 3px solid rgba(255, 255, 255, .8); /*no*/
        border-right: 3px solid rgba(255, 255, 255, .8); /*no*/
      }
      &.stop {
        margin: 14px 15px; /*no*/
        width: 0;
        height: 0;
        border-top: 9px solid transparent; /*no*/
        border-bottom: 9px solid transparent; /*no*/
        border-left: 16px solid rgba(255, 255, 255, .8); /*no*/
      }
    }
    &:hover {
      span.playing {
        border-color: #fff;
      }
      span.stop {
        border-left: 16px solid #fff; /*no*/
      }
    }
  }

  .stop-btn-wrapper {
    height: 26px; /*no*/
    float: left;
    width: 26px; /*no*/
    background-color: $themeColor;
    text-align: center;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    right: -27px; /*no*/
    &:hover {
      span {
        background-color: #fff;
      }
    }
    span {
      margin: 8px; /*no*/
      display: inline-block;
      background-repeat: no-repeat;
      width: 10px; /*no*/
      height: 10px; /*no*/
      background-position: 0 0;
      background-color: rgba(255, 255, 255, .8);
    }
  }
}
</style>
