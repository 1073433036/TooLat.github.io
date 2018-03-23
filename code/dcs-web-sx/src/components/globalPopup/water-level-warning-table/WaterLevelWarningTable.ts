import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './WaterLevelWarningTable.html?style=./WaterLevelWarningTable.scss'

import WaterInfoPopup from './WaterInfoPopup/WaterInfoPopup'

@WithRender
@Component
export default class WaterLevelWarningTable extends Vue {
  @Action('emergencyStore/toggleWaterLevelTablePopup_global') toggleWaterLevelTablePopup_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global

  warningData: any[] = []
  warningDataFormat: any = {}
  warningDataForRender: object[] = []
  pageSize: number = 10
  pageSizes: number[] = [10, 15, 20, 25, 30]
  isPageSizePopupOn: boolean = false
  pageCount: number = 0
  pageIndex: number = 1
  selectedKey: any[] = []
  isSelectAll: boolean = false
  isInfoPopupOn: boolean = false
  infoView: any = null

  created() {
    this.getWarningData()
  }

  toggleIndex(action: string) {
    if (action === 'prev' && this.pageIndex > 1) {
      this.pageIndex--
      this.getPageData()
    }
    if (action === 'next' && this.pageIndex < this.pageCount) {
      this.pageIndex++
      this.getPageData()
    }
  }

  togglePageSize(num: number) {
    if (num === this.pageSize) {
      this.isPageSizePopupOn = false
      return
    }
    this.pageSize = num
    this.pageIndex = 1
    this.pageCount = Math.ceil(this.warningData.length / this.pageSize)
    this.getPageData()
    this.isPageSizePopupOn = false
  }

  async getWarningData() {
    let res = await fetch(`http://10.148.83.228:8086/hyd/reservior/user/post/,/?cacheCtrl=${Date.now()}`, {
      mode: 'cors',
      method: 'get',
      cache: 'no-cache'
    })
    let reservoirData = await res.json()
    res = await fetch(`http://10.148.83.228:8086/hyd/river/user/post/,/?cacheCtrl=${Date.now()}`, {
      mode: 'cors',
      method: 'get',
      cache: 'no-cache'
    })
    let riverData = await res.json()
    this.warningData = []
    for (let item of reservoirData.tagObject) {
      if (item.iswarning)
        this.warningData.push(item)
    }
    for (let item of riverData.tagObject) {
      if (item.iswarning)
        this.warningData.push(item)
    }
    let obj = {}
    for (let opt of this.warningData) {
      obj[opt.id] = opt
    }
    this.warningDataFormat = { ...obj }
    this.pageCount = Math.ceil(this.warningData.length / this.pageSize)
    this.getPageData()
  }

  getPageData() {
    this.warningDataForRender = this.warningData.slice().splice(this.pageSize * (this.pageIndex - 1), this.pageSize)
  }

  selectOpt(key) {
    if (key === 'all') {
      this.isSelectAll = !this.isSelectAll
      this.selectedKey = []
      if (this.isSelectAll) {
        for (let opt of this.warningData) {
          this.selectedKey.push(opt.id)
        }
      }
    } else {
      let index = this.selectedKey.indexOf(key)
      if (index === -1)
        this.selectedKey.push(key)
      else
        this.selectedKey.splice(index, 1)
    }
  }

  sendInfo() {
    if(!this.selectedKey.length) {
      this.toggleOprateTip_global({ tip: true, text: '请先选择水库' })
      return
    }
    this.isInfoPopupOn = true
  }

  closeInfoPopup() {
    this.isInfoPopupOn = false
  }

  @Watch('isInfoPopupOn')
  onisInfoPopupOnChanged(val: any, oldVal: any): void {
    this.infoView = val ? WaterInfoPopup : null
  }
}



