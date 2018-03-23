import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './SelectTownOrDepartment.html?style=./SelectTownOrDepartment.scss'
import fetchJsonp from 'fetch-jsonp'
import { FisherClient } from "../../../util/clientHelper";

@WithRender
@Component
export default class SelectTownOrDepartment extends Vue {
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global


  @Prop({ default: '选择镇' })
  title: string
  @Prop({ default: 'standarDepartment' })
  selectType: string
  @Prop({ default: 14 })
  textFontSize
  @Prop({ default: Function })
  selectionChange
  @Prop({ default: 20 })
  paddingWidth: number
  @Prop()
  selectData: Array<Object> | object
  @Prop({ default: null })
  limit: number

  textWidth: number = 0
  hoverSelectData: Array<string> = []
  parentWidth: number = 0
  isPopupDisplay: boolean = false
  popupData: Array<object> = []
  selectedString: object = {}
  selectedData: object = {}
  isEnterPopup: boolean = false
  closePopupTimeout: any = null
  selectActionText: string = '全选'

  mounted() {
    this.initData()
  }

  @Watch('selectData')
  onselectDataChanged (val: any, oldVal: any) {
    this.initData()
  }

  async initData() {
    this.parentWidth = this.$el.parentElement.clientWidth - this.paddingWidth * 2
    this.textWidth = this.parentWidth - 84
    if (this.selectData) {
      if (Array.isArray(this.selectData)) {
        this.popupData = this.selectData
      }
      this.selectedString = {}
      this.selectedData = {}
      for (let i in this.popupData) {
        if (this.popupData[i]['selected']) {
          this.selectedString[i] = this.popupData[i]['name']
          this.selectedData[i] = this.popupData[i]['id']
        }
      }
      this.selectionChange(this.popupData)
      this.selectActionText = '清空'
      return
    }
    let res: Response, data
    if (this.selectType === 'standarDepartment') {
      res = await fetch('http://10.148.83.228:8086/plan/deps/user/post/,/?cacheControl' + new Date().getTime())
      data = await res.json()
      if (data.result !== 'S_OK')
        return

      this.popupData = []
      data.tagObject.forEach(el => {
        this.popupData.push({
          name: el.name,
          id: el.id,
          selected: false
        })
      })
    } else if (this.selectType === 'fisherTown') {
      data = await FisherClient.getAllPublishTarget()

      if (!data) return

      this.popupData = []
      data.forEach(el => {
        this.popupData.push({
          name: el.town,
          id: el.id,
          selected: false
        })
      })
    } else if (this.selectType === 'town' || this.selectType === 'publishTown') {
      // let res = await fetch('http://10.148.83.228:8086/geography/findtowns/county/user/post/,/?countyId=58')
      let res = await fetchJsonp('http://10.148.10.80:8111/dict/geologyGD/s3/24,58,/JSONP/')
      data = await res.json()
      this.popupData = []
      data.forEach(el => {
        this.popupData.push({
          name: el.town,
          id: el.townId,
          selected: false
        })
      })
    } else if (this.selectType === 'orgs') {
      let res = await fetch('http://10.148.83.228:8086/plan/orgs/list/user/post/,/?cacheControl' + new Date().getTime())
      data = await res.json()
      this.popupData = []
      data.tagObject.forEach(el => {
        this.popupData.push({
          name: el.name,
          id: el.id,
          selected: false
        })
      })
    }

  }


  selectionAction() {
    if (this.selectActionText === '清空') {
      Object.keys(this.popupData).forEach(key => this.popupData[key].selected = false)
      this.selectActionText = '全选'
    } else if (this.selectActionText === '全选') {
      Object.keys(this.popupData).forEach(key => this.popupData[key].selected = true)
      this.selectActionText = '清空'
    }
    this.selectedString = {}
    this.selectedData = {}
    for (let i in this.popupData) {
      if (this.popupData[i]['selected']) {
        this.selectedString[i] = this.popupData[i]['name']
        this.selectedData[i] = this.popupData[i]['id']
      }
    }
    this.selectionChange(this.selectedData)
  }
  togglePopup(action: boolean) {
    this.isPopupDisplay = action
  }
  selectTarget(index: string) {
    this.popupData[index].selected = !this.popupData[index].selected
    if (this.popupData[index].selected) {
      this.selectedString[index] = this.popupData[index].name
      this.selectedData[index] = this.popupData[index].id
    }
    else {
      delete this.selectedString[index]
      delete this.selectedData[index]
    }
    this.selectionChange(this.selectedData)
  }
  startClosePopupTimeout() {
    this.closePopupTimeout = setTimeout(() => {
      this.isPopupDisplay = false
    }, 200);
  }
  clearClosePopupTimeout() {
    clearTimeout(this.closePopupTimeout)
  }
}





