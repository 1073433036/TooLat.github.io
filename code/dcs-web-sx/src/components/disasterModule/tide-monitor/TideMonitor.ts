import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { offset_rain, scale_rain, colors_rain } from "../../../config/rain3DConf";

import { Action, Getter } from 'vuex-class'
import WithRender from './TideMonitor.html?style=./TideMonitor.scss'
import fetchJsonp from 'fetch-jsonp'
import moment from 'moment'

import { presentTyphDataInterface } from "./tideInterface"
import TyphHelper from "../../../util/typhHelper";
import ModelAssess from '../../../util/modelAssess'

import FstTimeline from '../../globalPopup/fst-timeline/FstTimeline'
import TyphMatching from "./typh-matching/TyphMatching"
import ProgressPanel from "../../commonCompt/progress-panel/ProgressPanel";

let viewer: Zearth.Viewer = window['viewer']
let typhEntities: any = {},
  typhNcinfoObject = null,
  tideForseeTime = null,
  tideImgLayer = null,
  poiImgLayer = null,
  poiImgNc: any = {
    ncInfo: null,
    seledVar: null
  },
  colorData = [],
  poiEntity = [],
  threshold = [],
  eventHandler = null,
  weatherSceneHolder = null,
  windCircleLayer = null,
  uWindData = null,
  vWindData = null,
  pickingHandler = null,
  gridData = null,
  gridInfo = null

let rainRange = [999, 250, 100, 50, 25, 10, 2, 1, 0.5],
  windRange = [999, 40, 30, 20, 14, 8, 5, 3, 1];

@WithRender
@Component({
  components: {
    ProgressPanel
  }
})
export default class TideMonitor extends Vue {
  @Getter('systemStore/typhSelected_global') typhSelected_global
  @Getter('systemStore/disasterTypeSelected_global') disasterTypeSelected_global
  @Getter('systemStore/containedTyph_global') containedTyph_global
  @Getter('systemStore/typhMouseOverPopup_global') typhMouseOverPopup_global
  @Getter('systemStore/typhGrapesPopup_global') typhGrapesPopup_global
  @Getter('systemStore/typhClickPointIndex_global') typhClickPointIndex_global
  @Getter('systemStore/typhClickIndexManulChanged_global') typhClickIndexManulChanged_global
  @Getter('systemStore/region_global') region_global
  @Getter('systemStore/datetime_global') datetime_global
  // @Getter('modelStore/seledTime_global') seledTime_global
  // @Action('modelStore/addColorTable_global') addColorTable_global
  // @Action('modelStore/deleteColorTable_global') deleteColorTable_global
  // @Action('modelStore/storeModelData_global') storeModelData_global
  @Action('systemStore/selectDisasterType_global') selectDisasterType_global
  @Action('systemStore/toggleTyphMouseOverPopup_global') toggleTyphMouseOverPopup_global
  @Action('systemStore/storeTyphMouseOverData_global') storeTyphMouseOverData_global
  @Action('systemStore/storeTyphMouseOverPos_global') storeTyphMouseOverPos_global
  @Action('systemStore/storeTyphMouseOverName_global') storeTyphMouseOverName_global
  @Action('systemStore/toggleTyphTimelineStatus_global') toggleTyphTimelineStatus_global
  @Action('systemStore/selectTyph_global') selectTyph_global
  @Action('systemStore/deleteHistTyph_global') deleteHistTyph_global
  @Action('systemStore/toggleTyphGrapesPopup_global') toggleTyphGrapesPopup_global
  @Action('systemStore/changeTyphClickPointIndex_global') changeTyphClickPointIndex_global
  @Action('systemStore/toggleIsClickingLastPoint_global') toggleIsClickingLastPoint_global
  @Action('systemStore/storeTyphClickingPos_global') storeTyphClickingData_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Action('systemStore/storeTyphData_global') storeTyphData_global
  // @Action('systemStore/forceCloseModelResult_global') forceCloseModelResult_global
  @Action('systemStore/toggleTideTable_global') toggleTideTable_global
  @Getter('systemStore/typhTimelineStatus_global') typhTimelineStatus_global
  @Action('systemStore/storeWindPickingValue_global') storeWindPickingValue_global
  @Action('systemStore/storeGridPickingValue_global') storeGridPickingValue_global
  @Getter('systemStore/isNeedMountedTy_global') isNeedMountedTy_global

  @Getter('systemStore/isMouseOverPoint_global') isMouseOverPoint_global
  @Action('systemStore/toggleMouseOverPoint_global') toggleMouseOverPoint_global

  elementSelectedString: string = '风'
  elementSelected: 'wind' | 'tide' | 'rain' = 'wind'
  isElementSelectionShow: boolean = false
  elementOption: any[] = [
    {
      name: '风',
      type: 'wind',
    }, {
      name: '雨',
      type: 'rain'
    }, {
      name: '风暴潮',
      type: 'tide'
    }
  ]
  isComponentLiving: boolean = false
  dontHavePresentTyph: boolean = true
  totalPointCount: any = 0
  isLastPoint: any = false
  blockWatch: any = false
  selectedAnalysisOption: any = null
  hasPresentTyph: any = true
  mouseOverPopupView: any = false
  overData: any = false
  overPos: any = false
  currentTyph: object[] = []
  clickPopupView: any = false
  clickPos: any = null
  clickIndex: any = null
  typhMatchingView: any = false
  isTyphMatchingPopupOn: boolean = false
  typhTsIdForMatching: string = ''
  playingTimeLineY: number = 0
  playingDateString = {
    date: '12321',
    hour: '12321'
  }
  tipDateString = {
    date: '12321',
    hour: '12321'
  }
  realPointCount: number = 0
  playing: boolean = false
  forceStopPlaying: number = 0

  getPlayTimeLinePositionY() {
    let selfTop = document.querySelector('#TideMonitor').getBoundingClientRect().top
    let windHeight = document.body.clientHeight
    return windHeight - selfTop - 30 - 66
  }

  created() {
    this.isComponentLiving = true
    viewer = window['viewer']
    deterWhetherHasPresentTyph()
      .then(data => {
        if (!this.isComponentLiving) return

        if (data === null) {
          this.dontHavePresentTyph = true
          return
        }
        this.currentTyph = []
        data.forEach(el => {
          this.currentTyph.push(el)
          this.storeTyphData_global({
            id: el.id,
            name: el.name,
            tsId: el.tsId,
            isCurrentTyph: true
          })
        })
        if (data[0] && this.isNeedMountedTy_global) {
          this.selectTyph_global(data[0].tsId)
          this.toggleTyphTimelineStatus_global('detail')
        }
      })
  }

  mounted() {
    this.playingTimeLineY = this.getPlayTimeLinePositionY()
  }

  destroyed() {
    this.isComponentAlive = false
    let typhHelper = new TyphHelper()
    if (tideImgLayer) {
      typhHelper.removeImgLayer(tideImgLayer)
      typhHelper = null
    }

    if (windCircleLayer) {
      let targetTyph: TyphHelper = typhEntities[this.typhSelected_global]
      targetTyph.removeImgLayer(windCircleLayer)
      windCircleLayer = null
    }

    for (let i in typhEntities) {
      typhHelper.removeTyphEntities(typhEntities[i].typhEntity)
    }

    for (let item of poiEntity) {
      typhHelper.removeEntity(item)
    }
    if (this.clickPopupView)
      this.clickPopupView = false

    if (poiImgLayer) typhHelper.removeImgLayer(poiImgLayer)

    this.toggleTyphTimelineStatus_global('search')
    setTimeout(() => {
      this.selectTyph_global(null)
    }, 0)

    this.storeWindPickingValue_global(null)
    this.storeGridPickingValue_global(null)
    if (pickingHandler)
      pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
    if (weatherSceneHolder)
      viewer['removeGridLayer'](weatherSceneHolder)
    viewer['weather']('none')

    typhHelper = null
    typhEntities = {}
    typhNcinfoObject = null
    tideForseeTime = null
    tideImgLayer = null

    if (this.typhMouseOverPopup_global) {
      this.toggleTyphMouseOverPopup_global(false)
    }
  }

  @Watch('typhSelected_global')
  async ontyphSelected_globalChanged(val: any, oldVal: any) {
    if (tideImgLayer) {
      let helper = new TyphHelper()
      helper.removeImgLayer(tideImgLayer)
      helper = null
    }
    for (let i in typhEntities) {
      let temp = typhEntities[i].typhEntity
 
      typhEntities[i].removeTyphEntities(temp)
      delete typhEntities[i]
      if (val === i) return
    }
    // if (oldId === null) return
    let res: any = await fetch(`http://10.148.83.228:8921/typhoon/findForecastReal?tsid=${val}&fcid=BCGZ`)
    res = await res.json()
    if (this.disasterTypeSelected_global !== 'tide')
      return

    if (res.real) {
      for (let el of res.real) {
        el.lon = el.location.lon
        el.lat = el.location.lat
      }
      res.real.sort((a, b) => a.datetime - b.datetime)
    }
    if (res.forecast) {
      let fstArr = []
      for (let el of res.forecast) {
        if (el.location.lon && el.location.lat) {
          el.lon = el.location.lon
          el.lat = el.location.lat
          fstArr.push(el)
        }
      }
      fstArr.sort((a, b) => a.leadtime - b.leadtime)
      res.forecast = fstArr
    }
    typhEntities[val] = new TyphHelper()
    typhEntities[val].drawTyph(res, true, this.toggleGrapesPopup, this.toggleMouseOverPopup)
    this.totalPointCount = 0
    this.realPointCount = res.real.length - 1
    this.totalPointCount = res.real.length
    this.totalPointCount += res.forecast ? res.forecast.length : 0
  }

  @Watch('typhClickIndexManulChanged_global')
  ontyphClickIndexManulChanged_globalChanged(val: any, oldVal: any): void {
    typhEntities[this.typhSelected_global].movingRoatetEntity(this.typhClickPointIndex_global > this.clickIndex ? 'next' : 'previous',
      this.typhClickPointIndex_global)
      .then(() => {
        this.clickIndex = this.typhClickPointIndex_global
        this.toggleIsClickingLastPoint_global(this.typhClickPointIndex_global === this.totalPointCount)
      })
  }

  selectTyph(tsId, isInit = false, isCurrentTyph = false) {
    if (this.playing) return
    this.toggleTyphTimelineStatus_global('detail');
    if (this.typhSelected_global === tsId)
      return;

    this.selectTyph_global(tsId);
  }

  toggleMouseOverPopup(type, pos, data) {
    if (type && !this.isMouseOverPoint_global)
      this.toggleMouseOverPoint_global(true)
    else if (!type && this.isMouseOverPoint_global)
      this.toggleMouseOverPoint_global(false)
    let lastDatetime = this.overData ? this.overData.datetime : false,
      datetime = data ? data.datetime : null
    if (type === true /* && lastDatetime !== datetime */) {
      this.overData = JSON.parse(JSON.stringify(data))
      this.overPos = JSON.parse(JSON.stringify(pos))

      this.storeTyphMouseOverData_global(this.overData)
      this.storeTyphMouseOverPos_global(this.overPos)
      // this.storeTyphMouseOverName_global({ tsid, tscname })

      if (!this.typhMouseOverPopup_global)
        this.toggleTyphMouseOverPopup_global(true)
    }

    if (type === false && this.typhMouseOverPopup_global) {
      this.toggleTyphMouseOverPopup_global(false)
    }
  }

  toggleGrapesPopup(pointData, pos) {
    if (!this.typhGrapesPopup_global) {
      this.toggleTyphGrapesPopup_global(true)
      // this.clickPos = JSON.parse(JSON.stringify(pos))
    }
    this.storeTyphClickingData_global({
      pos: JSON.parse(JSON.stringify(pos)),
      pointData
    })
  }

  // 台风搜索
  toggleTyphMatching(val: boolean, tsId: string) {
    if (val) {
      this.typhMatchingView = TyphMatching
      this.isTyphMatchingPopupOn = true
      this.typhTsIdForMatching = tsId
    } else {
      this.typhMatchingView = null
      this.isTyphMatchingPopupOn = false
    }
  }


  
  /***** 台风推演 ****/
  isComponentAlive: boolean = true
  playingStatus: string = null
  isLoadData: boolean = false         // 用于判断数据添加是否完成
  toggleLoadData() {                  // 用于播放回调
    this.isLoadData = false
  }
  onPlaying(val) {                    // 播放状态改变
    this.playingStatus = val
  }

  selectElement(type, name) {
    if (this.playing) return
    this.elementSelected = type
    this.elementSelectedString = name
    this.isElementSelectionShow = false
  }

  async onPlayingStart(val) {
    console.log(val)
    let targetTyph: TyphHelper = typhEntities[this.typhSelected_global]
    targetTyph.movingRotateEntity(val)

    let pointData = targetTyph.getPointData(val)
    let dateObj = this.getDateString(pointData)

    this.playingDateString = {
      date: dateObj.format('YYYY-MM-DD'),
      hour: dateObj.format('HH:mm')
    }
    this.playing = true
    await this.drawElement(this.elementSelected, pointData)

    if (this.elementSelected === 'wind')
      this.addWindPickingValueEvent()
    else
      this.addGridPickingValueEvent()
  }

  onPlayingChange(val) {
    let targetTyph: TyphHelper = typhEntities[this.typhSelected_global]
    targetTyph.movingRotateEntity(val)

    let pointData = targetTyph.getPointData(val)
    let dateObj = this.getDateString(pointData)

    this.playingDateString = {
      date: dateObj.format('YYYY-MM-DD'),
      hour: dateObj.format('HH:mm')
    }
    if (windCircleLayer)
      targetTyph.removeImgLayer(windCircleLayer)
    windCircleLayer = targetTyph.addingWindCircle(pointData)
    this.drawElement(this.elementSelected, pointData)
  }
  
  onPlayingStop(val) {
    let targetTyph: TyphHelper = typhEntities[this.typhSelected_global]
    targetTyph.removeImgLayer(windCircleLayer)
    windCircleLayer = null
    this.playing = false
    if (this.elementSelected === 'wind')
      viewer['weather']('none')
    else
      viewer['removeGridLayer'](weatherSceneHolder)

    this.storeWindPickingValue_global(null)
    this.storeGridPickingValue_global(null)
    if (pickingHandler)
      pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)

    weatherSceneHolder = null
  }

  onForseeHourOver(val) {
    let targetTyph: TyphHelper = typhEntities[this.typhSelected_global]
    let pointData = targetTyph.getPointData(val)
    let dateObj = this.getDateString(pointData)
    this.tipDateString = {
      date: dateObj.format('YYYY-MM-DD'),
      hour: dateObj.format('HH:mm')
    }
  }

  getDateString(pointData) {
    let dateObj
    if (pointData.leadtime) {
      dateObj = moment(pointData.datetime).add(8 + Number(pointData.leadtime), 'hours')
    } else {
      dateObj = moment(pointData.datetime).add(8, 'hours')
    }
    return dateObj
  }

  async drawElement(type: 'wind' | 'rain' | 'tide', pointData) {
    if (type === 'wind' || type === 'rain') {
      let datetimeString: string = '',
        url: string = ''
      if (pointData.leadtime)
        datetimeString = moment(pointData.datetime).add(8 + Number(pointData.leadtime), 'hours')
          .format('YYYY-MM-DD HH:00:00')
      else
        datetimeString = moment(pointData.datetime).add(8, 'hours').format('YYYY-MM-DD HH:00:00')

      if (type === 'wind')
        // url = `http://10.148.83.228:8086/forecast/grapes/uvwind/user/post/,/post?datetime=${datetimeString}`
        url = `http://10.148.83.228:2008/projshare/grid/grapes/uv/zh?datetime=${datetimeString}`
      else
        url = `http://10.148.83.228:8086/forecast/grapes/data/user/post/,/post?datetime=${datetimeString}&element=lspe&level=0&region[left]=105&region[right]=118&region[bottom]=13&region[top]=24`

      let res = await fetch(url)
      let data = await res.json()

      if (data.result !== 'S_OK') this.toggleOprateTip_global({ tip: true, text: '数据出错' })
      if (!this.isComponentAlive || this.playingStatus === 'stop' || data.result !== 'S_OK') {
        this.isLoadData = true
        if (pickingHandler) {
          pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
          pickingHandler = null
        }
        if (weatherSceneHolder) {
          viewer['removeGridLayer'](weatherSceneHolder)
          weatherSceneHolder = null
        }
        viewer['weather']('none')
        gridData = null
        return
      }

      if (type == 'wind') {
        gridInfo = data.tagObject.gridinfo
        // gridInfo.xgap = gridInfo.xgrap
        // gridInfo.ygap = gridInfo.ygrap
        uWindData = data.tagObject.u10m
        vWindData = data.tagObject.v10m

        if (weatherSceneHolder === null) {
          viewer['weather']('wind', 'line', uWindData, vWindData, gridInfo, null)
          weatherSceneHolder = true
          viewer['getWeatherScence']().blur = true
        } else {
          viewer['getWeatherScence']().evoluteData(uWindData, vWindData)
        }
      } else {
        gridInfo = data.tagObject.gridinfo
        gridInfo.xgap = gridInfo.xgrap
        gridInfo.ygap = gridInfo.ygrap
        gridData = data.tagObject.data

        if (weatherSceneHolder === null) {
          weatherSceneHolder = viewer['addGridLayer'](data.tagObject.data,
            gridInfo, "surface", colors_rain, scale_rain, offset_rain)
        } else {
          weatherSceneHolder.evoluteData(data.tagObject.data)
        }
      }
      this.isLoadData = true
    } else {
      if (pointData.leadtime) {
        this.forceStopPlaying = Date.now()
        this.isLoadData = true
        return
      }

      // let res = await fetch(`http://10.148.83.228:8086/wind/wave/height/user/post/,/post?datetime=${pointData.time}`)
      // let data = await res.json()
      // !!!!!!

      
      let tideFileUrl = 'http://10.148.83.228:9002/nc/jsonp/list/tide'
      let res = await fetchJsonp(tideFileUrl)
      let data = await res.json()
      let analysisResult = analysisTide(data, pointData.datetime)

      if (!analysisResult) this.toggleOprateTip_global({ tip: true, text: '当前台风点没有风暴潮数据' })
      if (!this.isComponentAlive || this.playingStatus === 'stop' || !analysisResult) {
        if (pickingHandler) {
          pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
          pickingHandler = null
        }
        if (weatherSceneHolder) {
          viewer['removeGridLayer'](weatherSceneHolder)
          weatherSceneHolder = null
        }
        viewer['weather']('none')
        gridData = null
        this.isLoadData = true
        return
      }

      let tideNcUrl = `http://10.148.83.228:9002/nc/jsonp/ncinfo?&modelName=tide&fileName=${analysisResult}`
      res = await fetchJsonp(tideNcUrl)
      let ncResult = await res.json()

      let tideDataUrl = `http://10.148.83.228:9002/nc/jsonp/nc/data/area?&modelName=tide&filepath=/home/program/model/tide/&filename=${analysisResult}&seledLevel=${ncResult.levels[0]}&seledTime=${ncResult.times[1]}&seledVar=tide`
      res = await fetchJsonp(tideDataUrl)
      let tideData = await res.json()
      gridData = tideData
      gridInfo = {
        top: ncResult.topLat,
        left: ncResult.leftLon,
        bottom: ncResult.topLat - ((ncResult.latDim - 1) * ncResult.latGap),
        right: ncResult.leftLon - ((ncResult.lonDim - 1) * ncResult.lonGap),
        xgap: ncResult.lonGap,
        ygap: ncResult.latGap,
        xdim: ncResult.lonDim,
        ydim: ncResult.latDim
      }

      if (weatherSceneHolder === null) {
        weatherSceneHolder = viewer['addGridLayer'](tideData, gridInfo, "surface", colors_rain, scale_rain, offset_rain)
      } else {
        weatherSceneHolder.evoluteData(tideData)
      }
      this.isLoadData = true
      
    }

    function analysisTide(file: string[], datetime) {
      for (let item of file) {
        if (item === 'tide' + moment(datetime).add(8, 'hours').format('YYYYMMDDHH0000') + '.nc') {
          return item
        }
      }
      return false
    }
  }

  addWindPickingValueEvent() {
    let helper = new TyphHelper()
    pickingHandler = new Zearth.ScreenSpaceEventHandler()
    pickingHandler.setInputAction(movement => {
      let pos = helper.getDegByWinPos(movement.endPosition)
      let u = window['WeatherScence'].interpModel(uWindData,
        gridInfo, ...pos)
      let v = window['WeatherScence'].interpModel(vWindData,
        gridInfo, ...pos)
      let val = window['WeatherScence'].getVel(u, v)
      if (val > 300) {
        this.storeWindPickingValue_global(null)
        return
      }
      let dir = window['WeatherScence'].getDir(u, v)
      this.storeWindPickingValue_global({
        x: movement.endPosition.x,
        y: movement.endPosition.y, dir, val
      })
    }, Zearth.ScreenSpaceEventType.MOUSE_MOVE)
  }

  addGridPickingValueEvent() {
    this.storeGridPickingValue_global(null)
    let helper = new TyphHelper()
    pickingHandler = new Zearth.ScreenSpaceEventHandler()
    pickingHandler.setInputAction(movement => {
      let pos = helper.getDegByWinPos(movement.endPosition)
      let grid
      try {
        grid = window['WeatherScence'].interpModel(gridData, gridInfo, ...pos)
      }
      catch (err) {
        this.storeGridPickingValue_global(null)
        return
      }
      if (grid < 0) {
        this.storeGridPickingValue_global(null)
        return
      }

      this.storeGridPickingValue_global({
        x: movement.endPosition.x,
        y: movement.endPosition.y,
        valText: grid.toFixed(1) + (this.elementSelected === 'rain' ? '(mm)' : '(cm)'),
        titleText: this.elementSelected === 'rain' ? '降雨量' : '增水量'
      })
    }, Zearth.ScreenSpaceEventType.MOUSE_MOVE)
  }

}




async function deterWhetherHasPresentTyph(): Promise<Array<presentTyphDataInterface> | null> {
  let res = await fetch('http://10.148.83.228:8921/typhoon/info/find')
  res = await res.json()

  if (!Array.isArray(res)) return null

  let eachTyphDate: Date = null,
    nowDate: Date = new Date(),
    presentTyphContainer = []
  nowDate.setHours(nowDate.getHours() - 12)

  for (let item of res) {
    eachTyphDate = new Date(item.maxtime)
    eachTyphDate.setHours(eachTyphDate.getHours() + 8)
    if (new Date(nowDate).getTime() > new Date(eachTyphDate).getTime()) continue
    presentTyphContainer.push({
      tsId: item.tsid,
      id: item.intlid ? item.intlid : null,
      name: (item.info && item.info.cname) ?  item.info.cname : '未命名',
      type: 'present'
    })
  }

  console.log(presentTyphContainer)
  return presentTyphContainer
}