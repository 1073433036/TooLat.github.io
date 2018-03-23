import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './LibPlan.html?style=./LibPlan.scss'
import { prePlanClient } from '../../../../util/clientHelper'

@WithRender
@Component
export default class LibPlan extends Vue {
  @Getter('systemStore/loginUser_global') loginUser_global  
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global

  organizations: any = {}
  emtype: any[] = []
  selectedType: string = null
  disaster: any = {}
  selectedDisaster: string = null
  level: number[] = [1, 2, 3, 4]
  selectedLevel: number = 1
  isPlanPopupOn: boolean = false
  selectedOrg: number = null
  selectedOrgMea: any = {}
  fax: string = null
  tabOptionSelected: 'plan' | 'message' | 'fax' = 'message'
  tips: any = {
    starttip: '启动',
    uptip: '升级',
    downtip: '降级',
    finishtip: '结束',
  }
  tipSelected: string = 'starttip'
  levelFormat: string[] = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ']

  mounted() {
    this.getEmegencyTypeInfo()
  }

  // 获取突发事件
  async getEmegencyTypeInfo() {
    let emtype = await prePlanClient.getEmegencyTypeInfo()
    if (emtype)
      this.emtype = emtype
    this.selectedType = this.emtype[0].id
    this.getDisasterTypeInfo()
  }

  // 获取事件类型
  async getDisasterTypeInfo() {
    let data = await prePlanClient.getDisasterTypeInfo(this.selectedType)
    if (!data || !data.length) {
      this.disaster = {}
      this.selectedDisaster = null
    } else {
      let obj = {}
      for (let opt of data) {
        obj[opt.id] = opt
      }
      this.disaster = { ...obj }
      this.selectedDisaster = data[0].id
      this.getInfo()
    }
  }

  getInfo() {
    this.getOrgs()
    this.changePlanMea()
  }

  // 获取关联部门
  async getOrgs() {
    let data = await prePlanClient.getOrgByDisasterId(this.selectedDisaster, this.selectedLevel)
    if (data) {
      let obj = {}
      for (let opt of data) {
        obj[opt.id] = opt
      }
      this.organizations = { ...obj }
    } else
      this.organizations = {}
  } 

  // 切换事件类型, 切换响应等级    (对应预案发生改变)
  async changePlanMea() {
    if (!this.selectedOrg) return
    await this.getPlanMeasure(this.selectedOrg)
    this.getPlanFax()
  }

  // 查看各部门预案内容
  async togglePlanMeasure(org) {
    if (this.selectedOrg === org.id) return
    this.selectedOrg = org.id
    await this.getPlanMeasure(org.id)
    await this.getPlanFax()
    this.isPlanPopupOn = true
  }
  // 查看单位预案、短信
  async getPlanMeasure(orgId) {
    let data = await prePlanClient.getPlanMeasure(this.selectedDisaster, orgId, this.selectedLevel)
    if (data) {
      this.selectedOrgMea = { ...data }
    } else {
      this.selectedOrgMea = {}
      this.toggleOprateTip_global({ tip: true, text: '预案内容获取失败！' })
    }
  }
  // 查看传真
  async getPlanFax() {
    if (!this.selectedOrgMea.id) {
      this.fax = null
      return
    }
    let data = await prePlanClient.getPlanFax(this.selectedOrgMea.id)
    if (data !== false) {
      this.fax = 'data:image/png;base64,' + data
    } else {
      this.fax = null
      // this.toggleOprateTip_global({ tip: true, text: '传真获取失败！' })
    }
  }

  closePlanPopup() {
    this.isPlanPopupOn = false
    this.selectedOrg = null
    this.selectedOrgMea = {}
  }
}