import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './OnlinePlan.html?style=./OnlinePlan.scss'

import { prePlanClient } from '../../../../util/clientHelper'

@WithRender
@Component
export default class OnlinePlan extends Vue {
  @Getter('systemStore/loginUser_global') loginUser_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Action('emergencyStore/doRefreshPlan_global') doRefreshPlan_global
  @Getter('emergencyStore/refreshOnlinePlan_global') refreshOnlinePlan_global
  @Action('emergencyStore/doRefreshOnlinePlan_global') doRefreshOnlinePlan_global

  unFinishPlan: any = {}
  organizations: any[] = []
  emtype: any[] = []
  selectedType: string = null
  disaster: any[] = []
  selectedDisaster: string = null
  level: number[] = [1, 2, 3, 4]
  selectedLevel: number = 1
  selectedMsgType: number = 3
  image: any = null
  imageSize: number = 0
  duties: any[] = []
  isDutiesPopupOn: boolean = false
  selectedDuties: string[] = []
  personDuty: string = null
  levelFormat: string[] = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ']

  async mounted() {
    await this.getUnFinishPlan()
    this.getEmegencyTypeInfo()
    this.getDuties()
  }

  // 获取正在进行的应急预案
  async getUnFinishPlan() {
    let data = await prePlanClient.getUnFinishPlan()
    if (data) {
      let obj = {}
      for (let opt of data) {
        obj[opt.disasterId] = opt
      }
      this.unFinishPlan = { ...obj }
    } else
      this.unFinishPlan = {}
  }

  // 获取所有工作备忘
  async getDuties() {
    let data = await prePlanClient.getDuties()
    if (data)
      this.duties = data
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
    this.selectedDuties = []
    let data = await prePlanClient.getDisasterTypeInfo(this.selectedType)
    if (!data || !data.length) {
      this.disaster = []
      this.selectedDisaster = null
    } else {
      this.disaster = data
      this.selectedDisaster = this.disaster[0].id
      if (this.selectedDisaster in this.unFinishPlan) {
        this.selectedLevel = this.unFinishPlan[this.selectedDisaster].level
        this.getEmergencyDuty()
      }
    }
    this.getOrgs()
  }

  getDisasterInfo() {
    this.getEmergencyDuty()
    this.getOrgs()
  }

  // 获取关联成员单位
  async getOrgs() {
    let data = await prePlanClient.getOrgByDisasterId(this.selectedDisaster, this.selectedLevel)
    if (data) {
      this.organizations = data
    } else
      this.organizations = []
  } 

  // 获取事件工作备忘
  async getEmergencyDuty() {
    if (this.selectedDisaster in this.unFinishPlan === false) {
      this.selectedDuties = []
      return
    }
    this.selectedDuties = []
    let planId = this.unFinishPlan[this.selectedDisaster].id
    let data = await prePlanClient.getEmergencyDuty(planId)
    if (data) {
      for (let opt of data) {
        this.selectedDuties.push(opt.name)
      }
    }
  }

  // 消息渠道
  toggleMsgType(type) {
    if (type === 1) {
      if (this.selectedMsgType === 2) this.selectedMsgType = 3
      else if (this.selectedMsgType === 3) this.selectedMsgType = 2
    } else if (type === 2) {
      if (this.selectedMsgType === 1) this.selectedMsgType = 3
      else if (this.selectedMsgType === 3) this.selectedMsgType = 1
    }
  }

  // 上传传真
  uploadImage(e) {
    const file = e.target.files[0]
    if (!file) {
      this.image = null
      this.imageSize = 0
      return
    }
    this.imageSize = file.size
    this.image = file
  }

  // 工作备忘
  openDutyPopup() {
    this.personDuty = null
    this.isDutiesPopupOn = true
  }
  toggleDuty(duty) {
    let index = this.selectedDuties.indexOf(duty)
    if (index === -1) {
      this.selectedDuties.push(duty)
    } else {
      this.selectedDuties.splice(index, 1)
    }
  }
  deleteDuty(duty) {
    this.selectedDuties.splice(this.selectedDuties.indexOf(duty), 1)
  }
  addPersonDuty() {
    if (!this.personDuty) return
    if (this.selectedDuties.indexOf(this.personDuty) === -1)
       this.selectedDuties.push(this.personDuty)
    this.personDuty = null
  }

  /* -----   Emergency   ------ */
  // 判断传真是否上传
  isImageUpload() {
    if (this.selectedMsgType === 2 || this.selectedMsgType === 3) {
      if (!this.image) {
        this.toggleOprateTip_global({ tip: true, text: '请先选择传真图片!' })
        return false
      }
      if (this.imageSize > 2 * 1024 * 1024) {
        this.toggleOprateTip_global({ tip: true, text: '图片大小不得超过2MB!' })
        return false
      }
      return true
    } else {
      return true
    }
  }

  // 启动预案在线
  async startPlan() {
    if (!this.selectedDisaster) {
      this.toggleOprateTip_global({ tip: true, text: '无该事件类型!' })
      return
    }
    if (!this.isImageUpload()) return

    let params = new FormData()
    params.append('disasterId', this.selectedDisaster)
    params.append('level', this.selectedLevel + '')
    params.append('userId', this.loginUser_global.userId)
    params.append('msgType', this.selectedMsgType + '')
    let img = this.image ? this.image : new File(['.'],'1.text')
    params.append('img', img)

    let res = await prePlanClient.startPlan(params)
    if (res) {
      this.getUnFinishPlan()
      this.addEmergencyDuty(res.id)
      this.doRefreshPlan_global(true)
      this.toggleOprateTip_global({ tip: true, text: '预案启动成功！' })
    } else {
      this.toggleOprateTip_global({ tip: true, text: '预案启动失败！' })
    }
  }
  async addEmergencyDuty(planId) {
    let params = {
      planId,
      duties: this.selectedDuties,
    }
    let data = await prePlanClient.addEmergencyDuty(params)
    this.selectedDuties = []
  }

  // 结束应急指挥流程
  async finishPlan() {
    if (!this.isImageUpload()) return
    Vue['prototype']['$confirm']('确认解除该预案？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      let params = new FormData()
      params.append('planId', this.unFinishPlan[this.selectedDisaster].id)
      params.append('userId', this.loginUser_global.userId)
      let img = this.image ? this.image : new File(['.'],'1.text')
      params.append('img', img)
      let res = await prePlanClient.finishPlan(params)
      if (res === true) {
        this.selectedDuties = []
        this.getUnFinishPlan()
        this.doRefreshPlan_global(true)
        this.toggleOprateTip_global({ tip: true, text: '预案已结束！' })
      } else {
        this.toggleOprateTip_global({ tip: true, text: res })
      }
    }).catch(() => {  })
  }

  // 改变预案等级
  async changePlanLevel(type) {
    if (!this.isImageUpload()) return
    Vue['prototype']['$confirm']('确定更改预案等级吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      let info = this.unFinishPlan[this.selectedDisaster]
      let level = info.level
      if (type === 'up') {
        if (level === 1) {
          this.toggleOprateTip_global({ tip: true, text: '已经是最高预案等级!' })
          return
        }
        --level
      } else if (type === 'down') {
        if (level === 4) {
          this.toggleOprateTip_global({ tip: true, text: '已经是最低预案等级!' })
          return
        }
        ++level
      }
      let params = new FormData()
      params.append('level', level)
      params.append('planId', info.id)
      params.append('userId', this.loginUser_global.userId)
      let img = this.image ? this.image : new File(['.'],'1.text')
      params.append('img', img)
      let res = await prePlanClient.changePlanLevel(params)
      if (res) {
        this.selectedDuties = []
        this.selectedLevel = res.level
        await this.getUnFinishPlan()
        this.getEmergencyDuty()
        this.doRefreshPlan_global(true)
        this.toggleOprateTip_global({ tip: true, text: '预案等级修改成功!' })
      } else {
        this.toggleOprateTip_global({ tip: true, text: '预案等级修改失败!'  })
      }
    }).catch(() => {  })
  }

  @Watch('refreshOnlinePlan_global')
  async onrefreshOnlinePlan_globalChanged(val: any, oldVal: any) {
    if (val) {
      await this.getUnFinishPlan()
      this.selectedLevel = this.unFinishPlan[this.selectedDisaster] ? this.unFinishPlan[this.selectedDisaster].level : 1
      this.getEmergencyDuty()
      this.doRefreshOnlinePlan_global(false)
    }
  }
}