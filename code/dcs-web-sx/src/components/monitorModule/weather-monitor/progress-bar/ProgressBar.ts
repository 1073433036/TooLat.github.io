import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ProgressBar.html?style=./ProgressBar.scss'
import Flatpickr from "flatpickr"
import { Helper } from "../../../../util/Helper"
import { ImageClient } from '../../../../util/clientHelper'
import ZH from 'flatpickr/dist/l10n/zh.js'
import moment from 'moment'
import fetchJsonp from "fetch-jsonp"

let viewer: Zearth.Viewer = null
let progressInterval: any = null
let pickingHandler = null
let us = null, vs = null, gridInfo = null

@WithRender
@Component
export default class ProgressBar extends Vue {
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Getter('systemStore/blurControl_global') blurControl_global
  @Getter('systemStore/progBarElement_global') elementSelected
  @Action('systemStore/toggleTrackingResult_global') toggleTrackingResult_global
  @Action('systemStore/changeTrackingResult_global') changeTrackingResult_global
  @Action('systemStore/changeTrackingTime_global') changeTrackingTime_global
  @Getter('systemStore/region_global') region_global
  @Action('systemStore/changeTrackingDatetime_global') changeTrackingDatetime_global  
  @Action('systemStore/storeOceanPickingValue_global') storeOceanPickingValue_global

  isComponentAlive: boolean = true
  isPlaying: boolean = false                //是否处于播放状态
  isProgressTransition: boolean = false     //播放中 用于css
  toggleTimeoutDelay: boolean = true        //播放 timeout延时
  progress: number = 8                      //播放条长度 (最大251)
  playingDateString: string = ''            //播放时 年月日
  playingHourString: string = ''            //播放时 时分
  playingHour: number = 0                   //当前leadtime 时间
  dateString: string = ''                   //日历年月日
  datePicker: any = 0                       //日历插件
  timeCategory: '时' | '分' = '时'
  //elementSelected: 'ocean' | 'tracking' = 'ocean'
  minPositionX: number = 0                  //滚动条 到窗口左侧 最小距离
  maxPositionX: number = 0                  //滚动条 到窗口左侧 最大距离
  xSubtract: number = 0                     //鼠标到滚动条外层轨道 的 x轴偏移量
  scrollBarWidth: number = 0                //滚动条内层轨道减外层轨道 宽度
  hourItemTotalWidth: number = 64 * 27      //leadtime时间条总长度
  actualPositionX: number = 10              //滚动条x偏移量
  forseeHourData: any = {
    ocean: 64,
    tracking: 6,
  }
  forseeHourNum: number = 64
  hourMultiplier: number = 1                //时间间隔乘数
  hourSelected: number = 0
  hourSelectedString: string = '起报时间: 08时'
  isHourSelectionShow: boolean = false
  leadTimeHolder: { ocean: any } = {
    ocean: {
      '08': 0,
      '20': 12
    },
  }
  leadTimeForRender: number[] = this.leadTimeHolder.ocean
  transformY: number = 0
  calendarStatus: boolean = false           //日历弹窗状态
  imgBound: any = {
    left: 105,
    right: 115,
    top: 22,
    bottom: 17
  }
  imageUrl: string = ''
  layer: any = null
  isLoadImage: boolean = false
  //雷暴追踪
  isTrackingHourShow: boolean = false
  isTrackingMinuteShow: boolean = false
  trackingHourSelected: number = 0
  trackingMinuteSelected: number = 0
  trackingHourSelectedString: string = '00'
  trackingMinuteSelectedString: string = '00'
  datetimeObj: Date = new Date()        //用于修改雷达拼图 闪电 数据时间

  mounted() {
    viewer = window['viewer']
    let mainMenuY = document.querySelector('#mainMenu').getBoundingClientRect().top
    let windHeight = document.body.clientHeight
    this.transformY = windHeight - mainMenuY - document.querySelector('#progBar').clientHeight - 20
    
    this.dateString = moment().format('YYYY-MM-DD')
    if (this.elementSelected === 'ocean') {           //洋流
      this.forseeHourNum = this.forseeHourData[this.elementSelected]
      this.hourMultiplier = 1
      /*
      // 时间回退12小时
      let timeString = moment().format('YYYY/MM/DD 12:00:00')
      let time = new Date(timeString).getTime()
      let hourString
      if(time < new Date().getTime()) {
        this.hourSelected = 0
        hourString = '08'
      } else {
        this.dateString = moment().subtract(1, 'days').format('YYYY-MM-DD')
        this.hourSelected = 12
        hourString = '20'
        this.hourSelectedString = '起报时间: 20时'
      }
      */

      /*
      // 时间回退20小时
      let time = new Date().getTime()
      let moonTimeString = moment(time).format('YYYY/MM/DD 08:00:00')
      let moonTime = new Date(moonTimeString).getTime()
      let nightTimeString = moment(time).format('YYYY/MM/DD 20:00:00')
      let nightTime = new Date(nightTimeString).getTime()

      let hourString
      if(time < moonTime) {
        this.dateString = moment().subtract(1, 'days').format('YYYY-MM-DD')
        this.hourSelected = 0
        hourString = '12'
      } else if (time > moonTime && time < nightTime){
        this.dateString = moment().subtract(1, 'days').format('YYYY-MM-DD')
        this.hourSelected = 12
        hourString = '20'
        this.hourSelectedString = '起报时间: 20时'
      } else {
        this.hourSelected = 0
        hourString = '12'
      }
      */

      // 时间回退24小时
      let timeString = moment().format('YYYY/MM/DD 12:00:00')
      let time = new Date(timeString).getTime()
      let hourString
      if(time < new Date().getTime()) {   // 当前时间大于当天12点
        this.dateString = moment().subtract(1, 'days').format('YYYY-MM-DD')
        this.hourSelected = 12
        hourString = '20'
        this.hourSelectedString = '起报时间: 20时'
      } else {
        this.dateString = moment().subtract(1, 'days').format('YYYY-MM-DD')
        this.hourSelected = 0
        hourString = '12'
      }

      this.playingHour = 1

      // 定位到当前时间
      // let fTime: any = new Date(this.dateString + ' ' + hourString + ':00:00').getTime()
      // let nowTime: any = new Date().getTime()
      // let hour = Math.floor((nowTime - fTime) / 3600000)
      // this.playingHour = hour
      // this.actualPositionX = 10 + 3.76 * hour
    }
    else if (this.elementSelected === 'tracking') {     //雷暴追踪
      this.timeCategory = '分'
      this.forseeHourNum = this.forseeHourData[this.elementSelected] + 1    //多一个00分
      this.hourMultiplier = 10
      // let time = moment().subtract(60, 'minutes')
      let time: any = moment().subtract(1, 'hours')
      this.changeTrackingDatetime_global(new Date(time))
      this.dateString = time.format('YYYY-MM-DD')
      this.trackingHourSelected = Number(time.format('HH'))
      this.trackingHourSelectedString =time.format('HH')
      this.trackingMinuteSelected = Number(time.format('mm'))
      this.trackingMinuteSelectedString = time.format('mm')
      this.getTrackingData()
    }

    this.hourItemTotalWidth = this.forseeHourNum * 27
    this.scrollBarWidth = document.querySelector('.the-scroll-bar').clientWidth - 20 -
      document.querySelector('.the-scroll-btn').clientWidth
    this.minPositionX = document.querySelector('.the-start-box').getBoundingClientRect().left

    let _this = this
    this.datePicker = new Flatpickr(document.querySelector('#progbarDatePicker'), {
      locale: ZH.zh,
      defaultDate: this.dateString,
      onChange(date) {
        if (_this.isPlaying) {
          _this.togglePlaying()
        }
        _this.dateString = moment(date[0]).format('YYYY-MM-DD')
        _this.calendarStatus = false

        if (_this.elementSelected === 'ocean')
          _this.updateOceanImages()
        else if (_this.elementSelected === 'tracking') {
          _this.getTrackingData()

          _this.datetimeObj = new Date(_this.dateString + ' ' + _this.trackingHourSelectedString + ':' + _this.trackingMinuteSelectedString + ':00')
          _this.changeTrackingDatetime_global(_this.datetimeObj)
        }
      }
    })
  }

  destroyed() {
    clearInterval(progressInterval)
    progressInterval = null
    this.deleteLayermages()
    this.removeTrackingImage()
    this.isComponentAlive = false
  }

  // 时分点击事件
  toggleHourPanel() {
    this.isTrackingHourShow = !this.isTrackingHourShow
    this.isTrackingMinuteShow = false
    if (this.isTrackingHourShow)
      this.$nextTick(() => { document.querySelector('#hourSel').scrollTop = (this.trackingHourSelected - 1) * 22 })
  }
  toggleMinutePanel() {
    this.isTrackingMinuteShow = !this.isTrackingMinuteShow
    this.isTrackingHourShow = false
    if (this.isTrackingMinuteShow)
      this.$nextTick(() => { document.querySelector('#minSel').scrollTop = (this.trackingMinuteSelected - 1) * 22 })
  }

  //日历
  openCalendar() {
    if (this.calendarStatus)
      this.datePicker.close()
    else
      this.datePicker.open()
    this.calendarStatus = !this.calendarStatus
    this.isHourSelectionShow = false
    this.isTrackingHourShow = false
    this.isTrackingMinuteShow = false
  }

  //选择起报时间  //洋流
  selectHour(hour, string) {
    if (this.isPlaying) {
      this.togglePlaying()
    }
    this.hourSelected = hour
    this.hourSelectedString = '起报时间: ' + string + '时'
    this.isHourSelectionShow = false

    if(this.elementSelected === 'ocean')
      this.updateOceanImages()
  }

  //选择时间   //雷暴
  selectTrackingTime(type, time) {
    if (this.isPlaying)
      this.togglePlaying()
    if (type === 'hour') {
      this.trackingHourSelected = time
      this.trackingHourSelectedString = time >= 10 ? time + '' : '0' + time
      this.isTrackingHourShow = false
    } else if (type === 'min') {
      this.trackingMinuteSelected = time
      this.trackingMinuteSelectedString = time > 10 ? time + '' : '0' + time
      this.isTrackingMinuteShow = false
    }
    if (this.elementSelected === 'tracking') {
      this.getTrackingData()
      this.datetimeObj = new Date(this.dateString + ' ' + this.trackingHourSelectedString + ':' + this.trackingMinuteSelectedString + ':00')
      this.changeTrackingDatetime_global(this.datetimeObj)
    }
  }
  
  //播放暂停
  togglePlaying() {
    this.isPlaying = !this.isPlaying
  }

  //更改leadtime
  changeRangeByHour(hour: number) {
    if (this.isPlaying) return
    let startHour = document.querySelector('.the-time-wrapper').scrollLeft / 27 + 1
    if(this.elementSelected === 'tracking')
      this.progress = (hour + 1 - startHour) * 27 + 8
    else
      this.progress = (hour - startHour) * 27 + 8
    this.playingHour = hour
  }

  //点击播放条 更改leadtime
  changeRangeByClick(e: MouseEvent) {
    if (this.isPlaying) return
    let clickPositionX = e.clientX - document.querySelector('.the-color-bar').getBoundingClientRect().left
    let computedNumber = (clickPositionX - 8) % 27
    if (computedNumber > 13.5)
      this.progress = clickPositionX - computedNumber + 27
    else
      this.progress = clickPositionX - computedNumber
    if(this.elementSelected === 'tracking')
      this.playingHour = (this.progress - 8) / 27
    else
      this.playingHour = (this.progress - 8) / 27 + 1
  }

  //点击滚动条
  startScroll(e: MouseEvent) {
    if (this.isPlaying) return
    e.preventDefault()
    this.maxPositionX = document.querySelector('.the-end-box').getBoundingClientRect().left
      - document.querySelector('.the-scroll-btn').clientWidth
    this.xSubtract = e.clientX - document.querySelector('.the-scroll-btn').getBoundingClientRect().left
    document.body.addEventListener('mousemove', this.scrollMove)
  }

  endScroll() {
    document.body.removeEventListener('mousemove', this.scrollMove)
    if (this.elementSelected === 'ocean') {
      let startHour = this.computeLeadTimeRange().startHour
      this.playingHour = startHour + (this.progress - 8) / 27
    }
  }

  //滚动条滑动事件
  scrollMove(e: MouseEvent) {
    e.preventDefault()
    document.body.addEventListener('mouseup', this.endScroll)
    let xOffset: number = e.clientX - this.xSubtract    //滚动条最左端到屏幕左侧的距离
    if (xOffset < this.minPositionX + 10) {
      this.actualPositionX = 10
      return
    }
    if (xOffset > this.maxPositionX) {
      this.actualPositionX = this.maxPositionX - this.minPositionX
      return
    }
    this.actualPositionX = xOffset - this.minPositionX
  }
  
  //计算leadtime范围
  computeLeadTimeRange() {
    let startHour
    if(this.elementSelected === 'tracking')
      startHour = document.querySelector('.the-time-wrapper').scrollLeft / 27
    else
      startHour = document.querySelector('.the-time-wrapper').scrollLeft / 27 + 1
    let endHour = startHour + (this.forseeHourNum > 10 ? 9 : this.forseeHourNum - 1)
    return {
      startHour, 
      endHour
    }
  }
  
  //计算播放时 时间弹窗时间
  computeDateTimeString() {
    let date
    if(this.elementSelected === 'ocean') {
      date = moment(`${this.dateString} ${this.hourSelected === 0 ? '08' : '20'}:00:00`)
      date.add(this.playingHour * this.hourMultiplier, 'hours')
    } else if(this.elementSelected === 'tracking') {
      date = moment(`${this.dateString} ${this.trackingHourSelectedString}:${this.trackingMinuteSelectedString}:00`)
      date.add(this.playingHour * this.hourMultiplier, 'minutes')
    }
    this.playingDateString = date.format('YYYY-MM-DD')
    this.playingHourString = date.format('HH:mm')
  }

  //洋流
  /*
  getOceanData() {
    let time = moment(`${this.dateString} ${this.hourSelected === 0 ? '00' : '12'}:00:00`).format('YYYY-MM-DD HH:00:00')
    let imgUrl = ImageClient.getOceanUrl(time, this.playingHour)
    this.imageUrl = imgUrl
    console.log(imgUrl)
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve()
      img.onerror = () => reject()
      img.src = imgUrl;
    })
  }
  addOceanImages() {
    let helper = new Helper()
    if(this.layer) {
      let l = this.layer
      setTimeout(() => {
        helper.removeImgLayer(l)        //延迟删除上一图层
      }, 100);
    }
    if (!this.isComponentAlive) return
    let imgUrl = this.imageUrl
    let layer = Object.assign({ imgUrl }, this.imgBound)
    this.layer = helper.addImgLayer(imgUrl, layer)
  }
  deleteLayermages() {
    if(!this.layer) return
    let helper = new Helper()
    helper.removeImgLayer(this.layer)
    this.layer = null
    helper = null
  }
  updateOceanImages() {
    this.isLoadImage = false
    this.getOceanData()
    .then(() => {
      this.isLoadImage = true
      this.addOceanImages()
    })
    .catch(() => {
      this.isLoadImage = true
      this.deleteLayermages()
      this.toggleOprateTip_global({ tip: true, text: '获取海流数据失败' })
    })
  }
  */
  deleteLayermages() {
    viewer['weather']('none')
    if (pickingHandler) {
      pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
      pickingHandler = null
    }
    this.storeOceanPickingValue_global(null)
  }
  async updateOceanImages() {
    this.isLoadImage = false
    let time = moment(`${this.dateString} ${this.hourSelected === 0 ? '00' : '12'}:00:00`).format('YYYY-MM-DD HH:00:00')
    let url = `http://10.148.83.228:8086/wind/uvdata/user/post/,/post?start=${time}&leadtime=${this.playingHour}`
    let res = await fetch(url)
    let data: any = await res.json()
    if (!this.isComponentAlive) {
      viewer['weather']('none')
      this.storeOceanPickingValue_global(null)
      return
    }
    if (data.result === 'S_OK') {
      let infos = data.tagObject.gridinfo
      infos.xgap = infos.xgrap
      infos.ygap = infos.ygrap
      us = data.tagObject.uwnd
      vs = data.tagObject.vwnd
      gridInfo = infos
      viewer.weather("wind", 'wave', us, vs, infos)
      window['_ws'].blur = false
      this.addGridPickingValueEvent()
    } else {
      viewer['weather']('none')
      this.toggleOprateTip_global({ tip: true, text: '获取海流数据失败' })
      this.storeOceanPickingValue_global(null)
    }
    this.isLoadImage = true
  }
  addGridPickingValueEvent() {
    let helper = new Helper()
    let viewer = window['viewer'], Zearth = window['Zearth']
    if (pickingHandler) {
      pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
      pickingHandler = null
    }
    pickingHandler = new Zearth.ScreenSpaceEventHandler()
    pickingHandler.setInputAction(movement => {
      let lonlat = viewer.lonlat(movement.endPosition)
      if (!lonlat) {
        this.storeOceanPickingValue_global(null)
        return
      }
      let WeatherScence = window['WeatherScence']
      let lon = lonlat.longitude, lat = lonlat.latitude
      let u = WeatherScence.interpModel(us, gridInfo, lon, lat)
      let v = WeatherScence.interpModel(vs, gridInfo, lon, lat)
      if (u>-99 && v>-99) {
        let dir = WeatherScence.getDir(u, v).toFixed(1)
        let val = WeatherScence.getVel(u, v).toFixed(2)
        this.storeOceanPickingValue_global({
          x: movement.endPosition.x,
          y: movement.endPosition.y,
          dir,
          val
        })
      } else {
        this.storeOceanPickingValue_global(null)
      }
    }, Zearth.ScreenSpaceEventType.MOUSE_MOVE)
  }


  //雷暴追踪
  trackingBoundary = {
    left: 109.5,
    right: 110.8,
    top: 21.8,
    bottom: 20.2,
  }
  trackingData: any = []
  trackingColor: any = {
    0: '#caca67',
    1: '#00aefd',
    2: '#9b02ff',
    3: '#00bfdc',
    4: '#ffa500',
    5: '#ff0',
    6: '#0f0',
  }
  trackingPolyline: any[] = []
  trackingPolygon: any[] = []
  async getTrackingData() {
    let time: any = `${this.dateString} ${this.trackingHourSelectedString}:${this.trackingMinuteSelectedString}:00`
    let left = this.trackingBoundary.left
    let right = this.trackingBoundary.right
    let top = this.trackingBoundary.top
    let bottom = this.trackingBoundary.bottom
    // let url = `http://10.148.83.228:9020/data/titanLightningPolygons?width=2000&height=2000&top=${top}&bottom=${bottom}&left=${left}&right=${right}&date=${time}`
    // let res: any = null
    // try {
    //   res = await fetchJsonp(url, { timeout: 1500 })
    // }
    // catch(err) {
    //   this.removeTrackingImage()
    //   this.toggleTrackingResult_global(false)
    //   this.toggleOprateTip_global({ tip: true, text: '当前时间没有雷暴数据' })
    //   return
    // }
    // let msg: any = await res.json()
    let res
    try {
      time = new Date(time).getTime()
      time = time - time % (6*60*1000)
      time = moment(time).format('YYYY-MM-DD HH:mm:00')
      res = await fetchJsonp(`http://10.148.83.228:9002/nc/jsonp/storm/data?modelName=titan&datetime=${time}`)
    }
    catch(err) {
      this.removeTrackingImage()
      this.toggleTrackingResult_global(false)
      this.toggleOprateTip_global({ tip: true, text: '当前时间没有雷暴数据' })
      return
    }
    let data = await res.json()
    console.log(data)
    // !!!

    if (!data) {
      this.removeTrackingImage()
      this.toggleTrackingResult_global(false)
      this.toggleOprateTip_global({ tip: true, text: '当前时间没有雷暴数据' })
      return
    }
    this.trackingData = data
    if (!this.isComponentAlive) return
    this.addTrackingImage()
    this.getEffectArea(time)
  }
  //查询影响区域
  async getEffectArea(time) {
    let timeStr: any = new Date(time).getTime()
    timeStr -= timeStr%(6*60*1000)
    timeStr = moment(timeStr).format('YYYY-MM-DD HH:mm:00')
    // let url = `http://10.148.83.228:9020/app/lightingCounty?&countyId=${this.region_global.countyId}&datetime=${timeStr}`
    let url = `http://10.148.83.228:9002/nc/jsonp/storm/eval?modelName=titan&datetime=${timeStr}&cityId=24&countyId=58`    
    let res : any
    try {
      res = await fetchJsonp(url)
    }
    catch(err) {
      this.toggleTrackingResult_global(false)
      return
    }
    let data : any = await res.json()

    if(!data)
      this.toggleTrackingResult_global(false)
    else {
      if (!this.isComponentAlive) return
      this.changeTrackingResult_global(data)
      this.toggleTrackingResult_global(true)
    }
  }
  //绘制雷暴
  async addTrackingImage() {
    this.removeTrackingImage()
    if (!this.trackingData) {
      this.toggleTrackingResult_global(false)
      this.toggleOprateTip_global({ tip: true, text: '当前时间没有雷暴数据' })
      return
    }
    let pos = this.playingHour
    // let helper = new Helper()
    // for (let item of this.trackingData) {
    //   let p = item[`position${pos}0`]
    //   let boundArray = []
    //   for (let opt of p) {
    //     boundArray.push(opt[0])
    //     boundArray.push(opt[1])
    //   }
    //   let polyline = helper.addPolyline(boundArray, 2, this.trackingColor['' + pos], true, 'polyline')
    //   this.trackingPolyline.push(polyline)
    //   let c = new Zearth.ColorGeometryInstanceAttribute(1.0, 1.0, 1.0, .1)
    //   let polygon = helper.addPolygonGeometry(boundArray, 'tracking', c)
    //   this.trackingPolygon.push(polygon)
    // }
    let helper = new Helper()
    let data
    if (pos === 0) {
      let len = this.trackingData.tracks.length
      data = this.trackingData.tracks[len - 1].storm
    } else {
      data = this.trackingData.forecasts[pos - 1].storm
    }
    for (let el of data) {
      let boundArray = []
      for (let opt of el.lonlat) {
        boundArray.push(opt.lon)
        boundArray.push(opt.lat)
      }
      let polyline = helper.addPolyline(boundArray, 2, this.trackingColor['' + pos], true, 'polyline')
      this.trackingPolyline.push(polyline)
      let c = new Zearth.ColorGeometryInstanceAttribute(1.0, 1.0, 1.0, .1)
      let polygon = helper.addPolygonGeometry(boundArray, 'tracking', c)
      this.trackingPolygon.push(polygon)
    }
    // !!!

    this.changeTrackingTime_global('' + pos)
    helper = null
  }
  //清除雷暴
  removeTrackingImage() {
    if (this.trackingPolyline.length) {
      for (let p of this.trackingPolyline) {
        window['viewer'].entities.remove(p)
      }
      this.trackingPolyline = []
    }
    if (this.trackingPolygon.length) {
      for (let p of this.trackingPolygon)
        window['viewer'].scene.primitives.remove(p)
      this.trackingPolygon = []
    }
  }

  // progressEvent() {
  //   let startHour = this.computeLeadTimeRange().startHour
  //   let n = this.forseeHourNum > 10 ? 9 : this.forseeHourNum - 1
  //   if(startHour + n === this.playingHour) {
  //     this.isProgressTransition = false
  //     this.playingHour = startHour
  //     setTimeout(() => {
  //       this.isProgressTransition = true
  //     }, 2000)
  //   } else {
  //     this.playingHour++
  //   }
  //   this.progress = (this.playingHour - startHour) * 27 + 8
  //   if (startHour + n === this.playingHour) {
  //     setTimeout(() => {
  //       this.isPlaying = false 
  //     }, 2000)
  //   }
  // }

  progressEvent() {
    let hourNum = this.elementSelected === 'ocean' ? this.forseeHourNum : this.forseeHourNum - 1
    if (hourNum === this.playingHour) {
      this.playingHour = this.elementSelected === 'ocean' ? 1 : 0
      this.isProgressTransition = false
      this.$nextTick(() => {
        this.progress = 8
        this.actualPositionX = 10
        setTimeout(() => {
          this.isProgressTransition = true
        }, 0)
      })
      return
    }
    let startHour = this.computeLeadTimeRange().startHour
    if(startHour + 9 === this.playingHour) {    // 到达当前滚动条的最后一个点
      this.isProgressTransition = false

      if (this.maxPositionX === 0)
        this.maxPositionX = document.querySelector('.the-end-box').getBoundingClientRect().left 
          - document.querySelector('.the-scroll-btn').clientWidth

      if (this.playingHour + 10 > this.forseeHourNum) {
        this.actualPositionX = this.maxPositionX - this.minPositionX
      } else {
        this.actualPositionX = this.playingHour * 27 / (this.hourItemTotalWidth - 270)
          * (this.maxPositionX - this.minPositionX - 10) + 10
      }

      this.$nextTick(() => {
        startHour = this.computeLeadTimeRange().startHour
        this.progress = (this.playingHour - startHour) * 27 + 8
        setTimeout(() => {
          this.isProgressTransition = true
        }, 2000)
      })

    }

    this.playingHour++
    this.progress = (this.playingHour - startHour) * 27 + 8

    if (hourNum === this.playingHour) {
      setTimeout(() => {
        this.isPlaying = false
      }, 2000)
    }
  }

  intervalWhenImageLoad() {
    return setInterval(() => {
      if(this.isLoadImage) {
        this.progressEvent()
      } else {
        clearInterval(progressInterval)
        let imageInterval = setInterval(() => {
          if(this.isLoadImage) {
            clearInterval(imageInterval)
            this.progressEvent()
            progressInterval = this.intervalWhenImageLoad()
          }
        }, 100)
      }
    }, 3000)
  }

  @Watch('isPlaying')
  async onisPlayingChange(val: any, oldVal: any) {
    if (val) {
      if(this.elementSelected === 'ocean') {      // 需要判断图片是否加载完成
        this.isProgressTransition = true
        this.$nextTick(() => {
          this.isLoadImage = false
          this.progressEvent()
  
          progressInterval = this.intervalWhenImageLoad()
        })
      } else {
        this.isProgressTransition = true
        this.$nextTick(() => {
          this.progressEvent()

          progressInterval = setInterval(() => {
            this.progressEvent()
          }, 3000)
        })
      }
    } else {
      clearInterval(progressInterval)
      progressInterval = null
      this.isProgressTransition = false
    }
  }

  @Watch('playingHour')
  async onplayingHourChanged(val: any, oldVal: any) {
    if (this.isPlaying)
      this.computeDateTimeString()
    if (this.elementSelected === 'ocean') {
      this.updateOceanImages()
    } else if (this.elementSelected === 'tracking') {
      this.addTrackingImage()
    }
  }
  
  @Watch('blurControl_global')
  onblurControl_globalChanged(val: any, oldVal: any): void {
    if(this.calendarStatus) {
      this.datePicker.close()
      this.calendarStatus = false
    }
    this.isHourSelectionShow = false
    this.isTrackingHourShow = false
    this.isTrackingMinuteShow = false
  }

  @Watch('actualPositionX')
  onactualPositionXChanged(val: any, oldVal: any): void {
    let leftPercentage = (val - 10) / this.scrollBarWidth
    let scrollWidth = this.hourItemTotalWidth - 270
    document.querySelector('.the-time-wrapper').scrollLeft = jugePercentage()
    function jugePercentage() {
      if (leftPercentage === 0) {
        return 0
      } else if (leftPercentage >= 1) {
        return scrollWidth
      }
      let preNumber: number = scrollWidth * leftPercentage,
        computedNumber: number = preNumber % 27
      if (computedNumber > 13.5) {
        return preNumber - computedNumber + 27
      } else {
        return preNumber - computedNumber
      }
    }
  }
}