import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { offset_rain, scale_rain, colors_rain } from "../../../../config/rain3DConf";
import { Action, Getter } from 'vuex-class'
import WithRender from './TyphMatching.html?style=./TyphMatching.scss'
import fetchJsonp from 'fetch-jsonp'
import moment from 'moment'
import { Helper } from "../../../../util/Helper";
import TyphHelper from "../../../../util/typhHelper"

let weatherSceneHolder = null,
  gridData = null,
  gridInfo = null,
  pickingHandler = null
let rainData: Array<Array<{ lat, lon, value }>> = []

let similarTyphEntities: any = null

@WithRender
@Component
export default class TyphMatching extends Vue {
  @Getter('systemStore/datetime_global') datetime_global
  @Getter('systemStore/region_global') region_global
  @Getter('systemStore/typhSelected_global') typhSelected_global
  @Action('systemStore/selectTyph_global') selectTyph_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Action('systemStore/storeTyphData_global') storeTyphData_global
  @Action('systemStore/storeWindPickingValue_global') storeWindPickingValue_global
  @Action('systemStore/storeGridPickingValue_global') storeGridPickingValue_global
  @Action('systemStore/storeSimilarTyphData_global') storeSimilarTyphData_global

  @Getter('systemStore/typhMouseOverPopup_global') typhMouseOverPopup_global
  @Getter('systemStore/similarTyphData_global') similarTyphData_global
  @Action('systemStore/storeTyphMouseOverData_global') storeTyphMouseOverData_global
  @Action('systemStore/storeTyphMouseOverPos_global') storeTyphMouseOverPos_global
  @Action('systemStore/storeTyphMouseOverName_global') storeTyphMouseOverName_global
  @Action('systemStore/toggleTyphMouseOverPopup_global') toggleTyphMouseOverPopup_global
  @Getter('systemStore/typhGrapesPopup_global') typhGrapesPopup_global
  @Action('systemStore/toggleTyphGrapesPopup_global') toggleTyphGrapesPopup_global
  @Action('systemStore/storeTyphClickingPos_global') storeTyphClickingData_global

  @Getter('systemStore/isMouseOverPoint_global') isMouseOverPoint_global

  @Prop() toggleTyphMatching
  @Prop() isTyphMatchingPopupOn
  @Prop() typhTsIdForMatching

  viewer: Zearth.Viewer = window['viewer']
  matchingOptionData = {
    'intentionWeight': {
      name: '强度权重',
      value: 30
    },
    'lon': {
      name: '经度',
      value: 2
    },
    'lat': {
      name: '纬度',
      value: 2
    },
    'angleWeight': {
      name: '角度权重',
      value: 30
    },
    'angleChangeWeight': {
      name: '角度变化权重',
      value: 30
    },
    'moveSpeedWeight': {
      name: '移速权重',
      value: 30
    },
    'moveSpeedChangeWeight': {
      name: '移速变化权重',
      value: 30
    }
  }
  matchingResultData = {
    matchResult: {
      name: '匹配结果',
      value: null,
      type: 'typh',
      option: [
        {
          name: '请先执行匹配',
          value: 'null'
        }
      ]
    },
    affect: {
      name: '影响分析',
      type: 'affect',
      value: null,
      option: [
        { name: '请选择', value: 'null', colorTable: 'null' },
        { name: '累计降水量', value: 'rain20_20,sum', colorTable: 'rain' },
        { name: '最大日降水量', value: 'rain20_08,max', colorTable: 'rain' },
        { name: '最大风速（平均风）', value: 'windmax_vel,max', colorTable: 'wind' },
        { name: '极大风速（阵风）', value: 'windextrm_gel,max', colorTable: 'wind' },
      ]
    }
  }
  typhData = null
  selectedMatchingTyph = null
  loading = false
  selectedEffectElement: {
    name: null,
    value: null,
    fun: null
  }
  tsIdSelected: string = null
  intlIdSelected: string = null

  mounted() {
    this.matchingTyph()
  }

  // 相似台风
  beforeDestroy() {
    this.removeSimilayTyph()    
  }

  @Watch('similarTyphData_global')
  async onsimilarTyphData_globalChanged(val: any, oldVal: any) {
    this.removeSimilayTyph()
    let res: any = await fetch(`http://10.148.83.228:8921/typhoon/findForecastReal?tsid=${val.tsId}&fcid=BCGZ`)
    res = await res.json()
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

    similarTyphEntities = new TyphHelper()
    similarTyphEntities.drawTyph(res, true, this.toggleGrapesPopup, this.toggleMouseOverPopup)
  }

  removeSimilayTyph() {
    if (similarTyphEntities) {
      let entity = similarTyphEntities.typhEntity
      similarTyphEntities.removeTyphEntities(entity)
      similarTyphEntities = null
    }
    if (this.typhMouseOverPopup_global)
      this.toggleTyphMouseOverPopup_global(false)
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

  overData: any = false
  overPos: any = false
  toggleMouseOverPopup(type, pos, data) {
    let lastDatetime = this.overData ? this.overData.datetime : false,
      datetime = data ? data.datetime : null
    if (type === true /* && lastDatetime !== datetime */) {
      this.overData = JSON.parse(JSON.stringify(data))
      this.overPos = JSON.parse(JSON.stringify(pos))

      this.storeTyphMouseOverData_global(this.overData)
      this.storeTyphMouseOverPos_global(this.overPos)

      if (!this.typhMouseOverPopup_global)
        this.toggleTyphMouseOverPopup_global(true)
    }

    if (type === false && this.typhMouseOverPopup_global && !this.isMouseOverPoint_global) {
      this.toggleTyphMouseOverPopup_global(false)
    }
  }




  @Watch('typhTsIdForMatching')
  ontyphSelected_globalChanged(val: any, oldVal: any): void {
    this.matchingTyph()
    if (weatherSceneHolder) {
      this.viewer['removeGridLayer'](weatherSceneHolder)
      weatherSceneHolder = null
    }
    this.matchingResultData.affect.value = null
  }

  destroyed() {
    if (weatherSceneHolder) {
      this.viewer['removeGridLayer'](weatherSceneHolder)
      weatherSceneHolder = null
    }
    this.storeGridPickingValue_global(null)
    if (pickingHandler) {
      pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
      pickingHandler = null
    }
    // window['viewer']['weather']('none')
  }

  async matchingTyph() {
    this.loading = true
    let typhData = []
    let res = await fetch(`http://10.148.83.228:8921/typhoon/matchTyphoon?tsid=${this.typhTsIdForMatching}&w_windspeed=30&w_speed=30&w_direction=30&w_speed_change=30&w_direction_change=30`)
      res = await res.json()
    if (!Array.isArray(res)) {
      this.toggleOprateTip_global({ tip: true, text: '匹配结果为空' })
      this.loading = false
      typhData.push({
        name: '无匹配结果',
        intId: null,
        value: null,
        cnName: null
      })
      this.matchingResultData.matchResult.value = null
      this.typhData = typhData
      this.matchingResultData.matchResult.option = typhData
      this.tsIdSelected = null
      this.intlIdSelected = null
      return
    } else {
      typhData.push({
        name: '请选择台风',
        intId: null,
        value: null,
        cnName: null
      })
      this.matchingResultData.matchResult.value = null
    }
    this.loading = false
    for (let item of res) {
      typhData.push({
        value: {
          intId: item.intlid,
          name: item.cname,
          tsId: item.tsid,
          enName: item.ename
        }
      })
    }

    this.typhData = typhData
    this.matchingResultData.matchResult.option = typhData
  }

  async effectOptionChange(type: 'affect' | 'typh', val) {
    console.log(val)
    if (type === 'typh') {
      if (!val) return
      // this.selectTyph_global(val.tsId)
      this.storeSimilarTyphData_global({
        id: val.intId,
        name: val.name,
        tsId: val.tsId,
        isCurrentTyph: false
      })
      this.tsIdSelected = val.tsId
      this.intlIdSelected = val.intId
    }
    else if (type === 'affect' && val != null) {
      if (this.tsIdSelected === null) {
        this.toggleOprateTip_global({ tip: true, text: '请选择相似台风' })
        this.matchingResultData.affect.value = null
        this.loading = false
        return
      }
      let param = val.split(',')
      this.loading = true

      // 大数据tsid 转成江门tsid 获取数据
      let dcsRes = await fetchJsonp(`http://10.148.83.228:9020/JmDcs/typhoon/getMsgWithLevel?_=${Date.now()}`)
      let dcsData = await dcsRes.json()
      if (!Array.isArray(dcsData)) return
      let dcsTsid = dcsData.find(e => e.intlid == this.intlIdSelected).tsid

      let url = `http://10.148.83.228:9002/nc/jsonp/tp/data?tsid=${dcsTsid}&fieldName=${param[0]}&fun=${param[1]}`
      let res = await fetchJsonp(url)
      let data = await res.json()
      this.loading = false
      gridData = data.data
      if (!gridData) {
        this.toggleOprateTip_global({ tip: true, text: '无相关数据' })
        if (weatherSceneHolder)
          this.viewer['removeGridLayer'](weatherSceneHolder)
        if (pickingHandler) {
          pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
          pickingHandler = null
        }
        weatherSceneHolder = null
        return
      }
      gridInfo = data.mdlInfo
      gridInfo.xgap = gridInfo.xinterval
      gridInfo.ygap = gridInfo.yinterval

      if (weatherSceneHolder === null) {
        let scale = val === 'rain20_20,sum' ? 300 : 500
        weatherSceneHolder = this.viewer['addGridLayer'](gridData, gridInfo, "surface",
          colors_rain, scale, 1000, window['Zearth'].Bounds.GuangDong);
      } else {
        weatherSceneHolder.evoluteData(gridData)
      }
      if (val.indexOf('rain') === 0)
        this.addGridPickingValueEvent('rain')
      else if (val.indexOf('wind') === 0)
        this.addGridPickingValueEvent('wind')
    }
  }

  addGridPickingValueEvent(type) {
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
        this.storeGridPickingValue_global(null)
        return
      }
      // let val = window['WeatherScence'].interpModel(gridData, gridInfo, lonlat.longitude, lonlat.latitude)
      let val = weatherSceneHolder.interp(lonlat.longitude, lonlat.latitude)
      if (val === null || val < 0) {
        this.storeGridPickingValue_global(null)
      } else {
        this.storeGridPickingValue_global({
          x: movement.endPosition.x,
          y: movement.endPosition.y,
          valText: val.toFixed(1) + ( type === 'rain' ? '(mm)' : '(m/s)'),
          titleText: type === 'rain' ? '降雨量' : '风速'
        })
      }
    }, Zearth.ScreenSpaceEventType.MOUSE_MOVE)
  }
}