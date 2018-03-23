import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './MainTimeline.html?style=./MainTimeline.scss'
import { getAllHistoryTyph, getTyphDataById } from "../typhUtil"
import fetchJsonp from 'fetch-jsonp'

@WithRender
@Component
export default class MainTimeline extends Vue {
  @Prop() storeTyphYearData

  @Getter('systemStore/typhCurrentYear_global') typhCurrentYear_global
  @Getter('systemStore/disasterTypeSelected_global') disasterTypeSelected_global
  @Getter('systemStore/typhTimelineStatus_global') typhTimelineStatus_global
  @Getter('systemStore/typhSelected_global') typhSelected_global
  @Getter('systemStore/containedTyph_global') containedTyph_global
  @Action('systemStore/changeTyphCurrentYear_global') changeTyphCurrentYear_global
  @Action('systemStore/toggleTyphTimelineStatus_global') toggleTyphTimelineStatus_global
  @Action('systemStore/changeTyphCurrentName_global') changeTyphCurrentName_global
  @Action('systemStore/storeTyphData_global') storeTyphData_global
  @Action('systemStore/selectTyph_global') selectTyph_global


  maxYear: number = NaN
  minYear: number = NaN
  typhHistoryYear: Array<any> = []
  typhDetailData: Array<any> = []
  typhHistoryData: any = null
  typhOfCurYear: any = null
  currentTyphData: any = null
  startLine: any = null
  endLine: any = null
  containerWidth: number = 0
  itemNum: number = 0
  itemWidth: number = 0
  lineStartTime: any = null
  lineEndTime: any = null
  detailTyphString: string = null


  async created() {
    this.containerWidth = document.body.clientWidth
    getAllHistoryTyph((data) => {
      this.typhHistoryData = data
      this.typhOfCurYear = this.typhHistoryData[this.typhCurrentYear_global]
      let itemNum = 0
      for (let i in this.typhOfCurYear) {
        itemNum++
      }
      this.itemWidth = 100 / itemNum

      for (let i in data) {
        this.typhHistoryYear.push(Number(i))
      }
      this.typhHistoryYear.reverse()
      this.changeTyphCurrentYear_global(this.typhHistoryYear[0])
      this.maxYear = this.typhHistoryYear[0]
      this.minYear = this.typhHistoryYear[this.typhHistoryYear.length - 1]
      this.storeTyphYearData(this.maxYear, this.minYear)
    })
    if (this.typhSelected_global)
      getTyphDataById(this.typhSelected_global)
        .then(data => {
          this.itemWidth = computeItemWidth(this.currentTyphData)
          this.setUpCurrentTyphDetail(data, this.typhSelected_global)
        })
    this.getDetailNameString()
  }

  getDetailNameString() {
    for (let opt of this.containedTyph_global) {
      if (opt.tsId == this.typhSelected_global) {
        this.detailTyphString = opt.id + ' ' + opt.name
        break
      }
    }
  }


  @Watch('typhCurrentYear_global')
  ontyphCurrentYear_globalChanged(val: any, oldVal: any): void {
    this.itemWidth = computeItemWidth(this.typhHistoryData[val])
    this.typhOfCurYear = this.typhHistoryData[val]
  }

  @Watch('typhSelected_global')
  ontyphSelected_globalChanged(newId: any, oldId: any): void {
    if (newId !== null) {
      getTyphDataById(newId)
      .then(data => {
        this.setUpCurrentTyphDetail(data, newId)
        this.getDetailNameString()
      })
    }
    else {
      if (this.disasterTypeSelected_global === 'tide') {
        this.toggleTyphTimelineStatus_global('history')
      } else {
        this.toggleTyphTimelineStatus_global('search')
      }
    }

  }

  @Watch('typhTimelineStatus_global')
  ontyphTimelineStatus_globalChanged(val: any, oldVal: any): void {
    if (val === 'history')
      this.itemWidth = computeItemWidth(this.typhHistoryData[this.typhCurrentYear_global])
  }


  

  setUpCurrentTyphDetail(data, newId) {
    this.changeTyphCurrentName_global(data.typhName)
    this.currentTyphData = data.parsedData

    let monthCounter = 0,
      totalHourInThisTyph = 0
    for (let i in this.currentTyphData) {
      totalHourInThisTyph++
    }
    totalHourInThisTyph = totalHourInThisTyph * 24
    this.typhDetailData = []
    for (let i in this.currentTyphData) {
      for (let item of this.currentTyphData[i]) {
        this.typhDetailData.push({
          left: (((monthCounter * 24) + (item.startTime)) / totalHourInThisTyph * 100).toFixed(2),
          name: item.levelName,
          color: item.color,
          level: item.level
        })
      }
      monthCounter++
    }

    this.itemWidth = computeItemWidth(this.currentTyphData)
    this.startLine = data.startLine
    this.endLine = data.endLine
    this.lineStartTime = data.lineStartTime
    this.lineEndTime = data.lineEndTime

    this.toggleTyphTimelineStatus_global('detail')

    for (let item of this.containedTyph_global) {
      if (item.tsId === newId) return
    }

    this.storeTyphData_global({
      id: data.id,
      tsId: data.tsId,
      name: data.typhName,
      isCurrentTyph: false
    })
  }

  showTyphDetail(tsId) {
    if (tsId == this.typhSelected_global)
      this.toggleTyphTimelineStatus_global('detail')
    else
      this.selectTyph_global(tsId)
    // for (let item of this.containedTyph_global) {
    //   if (item.tsId === tsId) {
    //     this.selectTyph_global(tsId)
    //     return
    //   }
    // }

    // // if (this.containedTyph_global.length === 4) return
    // this.selectTyph_global(tsId)
  }
}



function computeItemWidth(data) {
  let itemNum = 0
  for (let i in data) {
    itemNum++
  }
  return 100 / itemNum
}



