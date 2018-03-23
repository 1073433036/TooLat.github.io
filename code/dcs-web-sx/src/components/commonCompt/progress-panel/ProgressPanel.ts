import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ProgressPanel.html?style=./ProgressPanel.scss'
import moment from 'moment'

let progressTimeout: any = null, progressInterval: any = null

@WithRender
@Component
export default class ProgressPanel extends Vue {
  @Prop({ default: 10 }) forseeData: number
  @Prop({ default: 1 }) multiplier: number
  @Prop({ default: 0 }) startHourSelected: number
  @Prop({ default: false }) isGlobalTimeZone: boolean
  @Prop() elementSelected: string
  @Prop() onForseeHourOver: Function
  @Prop({ default: new Object({ date: '', hour: '' }) }) playingDateString: any
  @Prop({ default: new Object({ date: '', hour: '' }) }) tipDateString: any
  @Prop({ default: 0 }) forceStopPlaying: number
  @Prop({ default: 0 }) forcePausePlaying: number
  @Prop({ default: false }) isComputeStartPositionNeeded: boolean
  @Prop({ default: Function }) onPlaying: Function
  @Prop({ default: Function }) onPlayingChange: Function
  @Prop({ default: Function }) onPlayingStop: Function
  @Prop({ default: Function }) onPlayingStart: Function
  @Prop({ default: false }) isContinuePlaying: boolean
  @Prop({ default: 1 }) startPlayingSeed: number
  @Prop({ default: null }) startChangeTextColor: number
  @Prop({ default: 3 }) animationDuration: number
  @Prop({ default: false }) isLoadData: boolean
  @Prop() toggleLoadData: Function

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
    let mainMenuY = document.querySelector('#mainMenu').getBoundingClientRect().top
    let windHeight = document.body.clientHeight
    this.hourItemTotalWidth = this.forseeData * 27
    this.hourWrapperWidth = document.querySelector('.time-wrapper').clientWidth
    this.scrollBarWidth = document.querySelector('.scroll-bar').clientWidth - 20 -
      document.querySelector('.scroll-btn').clientWidth
    this.minPositionX = document.querySelector('.start-box').getBoundingClientRect().left

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
    let startHour = document.querySelector('.time-wrapper').scrollLeft / 27 + 1
    this.progress = (hour - startHour) * 27 + 8
    this.playingSeed = hour
  }

  changeRangeByClick(e: MouseEvent) {
    if (this.isPlaying !== 'pause') return

    let clickPositionX = e.clientX - document.querySelector('.color-bar').getBoundingClientRect().left
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

        if (this.maxPositionX === 0)
          this.maxPositionX = document.querySelector('.end-box').getBoundingClientRect().left
            - document.querySelector('.scroll-btn').clientWidth

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
    let startHour = document.querySelector('#ProgressPanel .time-wrapper').scrollLeft / 27 + 1
    let endHour = this.forseeData < 10 ? startHour + this.forseeData - 1 : startHour + 9
    return {
      startHour, endHour
    }
  }

  startScroll(e: MouseEvent) {
    if (this.isPlaying !== 'stop') return

    e.preventDefault()
    this.maxPositionX = document.querySelector('.end-box').getBoundingClientRect().left
      - document.querySelector('.scroll-btn').clientWidth
    this.xSubtract = e.clientX - document.querySelector('.scroll-btn').getBoundingClientRect().left
    document.body.addEventListener('mousemove', this.scrollMove)
  }


  endScroll() {
    document.body.removeEventListener('mousemove', this.scrollMove)
  }

  scrollMove(e: MouseEvent) {
    e.preventDefault()
    document.body.addEventListener('mouseup', this.endScroll)
    this.xOffset = e.clientX - this.xSubtract
    if (this.xOffset < this.minPositionX + 10) {
      this.actualPositionX = 10
      return
    }
    if (this.xOffset > this.maxPositionX) {
      this.actualPositionX = this.maxPositionX - this.minPositionX
      return
    }
    this.actualPositionX = this.xOffset - this.minPositionX
  }

  @Watch('actualPositionX')
  onactualPositionXChanged(val: any, oldVal: any): void {
    let scrollBarWidth = document.querySelector('.scroll-bar').clientWidth - 20 -
      document.querySelector('.scroll-btn').clientWidth

    let leftPercentage = (val - 10) / scrollBarWidth
    let scrollWidth = this.hourItemTotalWidth - 270
    let scrollLeft = deterPercentage()
    document.querySelector('.time-wrapper').scrollLeft = scrollLeft
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
        this.maxPositionX = document.querySelector('.end-box').getBoundingClientRect().left
          - document.querySelector('.scroll-btn').clientWidth
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
      let maxPositionX = document.querySelector('.scroll-bar').clientWidth - 20
        - document.querySelector('.scroll-btn').clientWidth

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