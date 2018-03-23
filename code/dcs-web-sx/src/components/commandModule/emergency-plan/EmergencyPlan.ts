import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './EmergencyPlan.html?style=./EmergencyPlan.scss'

import moment from 'moment'
moment.locale('zh-cn')
import PublishPopup from './publish-popup/PublishPopup'
import { prePlanClient } from '../../../util/clientHelper'
import { GeographyClient } from '../../../util/clientHelper'

@WithRender
@Component
export default class EmergencyPlan extends Vue {
  @Getter('systemStore/loginUser_global') loginUser_global
  @Getter('systemStore/region_global') region_global
  @Getter('emergencyStore/refreshPlan_global') refreshPlan   //判断是否刷新当前预案状态

  @Action('emergencyStore/doRefreshPlan_global') doRefreshPlan     //更改刷新预案状态
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Action('emergencyStore/toggleEmergencyPlan_global') toggleEmergencyPlan_global
  @Action('emergencyStore/doRefreshOnlinePlan_global') doRefreshOnlinePlan_global

  moment = moment
  isNamePopupOn: boolean = false
  unfinishPlan: any = {}
  unfinishPlanKey: string = null
  planDuties: any = {}
  currentPlanDutyKey: string = '-1'
  selectedMsgType: number = 3
  image: any = null
  imageSize: number = 0
  interval: any = null
  publishView: any = null
  levelFormat: string[] = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ']

  // 获取未完成预案
  async initUnfinishedPlan(key = undefined) {
    this.unfinishPlan = {}
    let data = await prePlanClient.getUnFinishPlan()
    if (!data || !data.length) {
      this.toggleEmergencyPlan_global()
      return
    }

    let obj = {};
    let newDisasterId,newTime = 0;  //最新预案
    for(let info of data) {
      obj[info.disasterId] = info;
      if(info.starttime > newTime) {
        newDisasterId = info.disasterId
        newTime = info.starttime
      }
    }

    this.unfinishPlan = { ...obj }
    const disasterId = (key && key in obj) ? key : newDisasterId
    this.unfinishPlanKey = disasterId
    const planId = obj[disasterId].id
    this.getPlanDuties(planId)
  }

  // 获取预案工作备忘
  async getPlanDuties(planId) {
    let data = await prePlanClient.getEmergencyDuty(planId)
    if(!data || !data.length) {
      this.planDuties = {};
      this.currentPlanDutyKey = '-1';
    } else {
      this.planDuties = { ...data };
      this.currentPlanDutyKey = '0';
    }
  }

  // 切换未完成预案
  toggleUnfinishPlan(key) {
    this.unfinishPlanKey = key;
    this.getPlanDuties(this.unfinishPlan[key].id);
    this.isNamePopupOn = false;
    this.publishView = null
  }
  
  // 切换工作备忘
  toggleCurrPlanDuty(status) {
    let currentPlanDutyKey = Number(this.currentPlanDutyKey);
    if(!status) {   //prev
      if(currentPlanDutyKey <= 0) return;
      currentPlanDutyKey--;
    } else {        //next
      let allPlanDutiesNum = Object.keys(this.planDuties).length;
      if(currentPlanDutyKey === allPlanDutiesNum - 1) return;
      currentPlanDutyKey++;
    }
    this.currentPlanDutyKey = String(currentPlanDutyKey);
  }

  // 完成工作备忘
  async finishDuty() {
    let planDuties = this.planDuties,
      currentPlanDutyKey = this.currentPlanDutyKey,
      dutyInfo = planDuties[currentPlanDutyKey];
    if(!Object.keys(planDuties).length) return;    //不存在工作备忘
    if(dutyInfo.status === 'Finish') return;       //工作备忘已完成

    let res = await prePlanClient.finishEmergencyDuty(dutyInfo.id, dutyInfo.planId, dutyInfo.name, 'Finish')
    if (res) planDuties[currentPlanDutyKey].status = 'Finish'
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

  // 升降级
  async changeLevel(num) {
    if (!this.isImageUpload()) return
    Vue['prototype']['$confirm']('确定更改预案等级吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      let plan = this.unfinishPlan[this.unfinishPlanKey]
      const planId = plan.id,
        level = plan.level + num
      if(level < 1) {
        this.toggleOprateTip_global({ tip: true, text: '已经是最高预案等级!' })
        return
      }
      if(level > 4) {
        this.toggleOprateTip_global({ tip: true, text: '已经是最低预案等级!' })
        return
      }
  
      let params = new FormData()
      params.append('level', level)
      params.append('planId', planId)
      params.append('userId', this.loginUser_global.userId)
      let img = this.image ? this.image : new File(['.'],'1.text')
      params.append('img', img)
      let res = await prePlanClient.changePlanLevel(params)
      if (res) {
        await this.initUnfinishedPlan(this.unfinishPlanKey)
        this.doRefreshOnlinePlan_global(true)
        this.toggleOprateTip_global({ tip: true, text: '预案等级修改成功!' })
      } else {
        this.toggleOprateTip_global({ tip: true, text: '预案等级修改失败!'  })
      }
    }).catch(() => {  })
  }

  //追加发布
  togglePublishPopup() {
    this.publishView = this.publishView ? null : PublishPopup
  }

  //解除预案
  async releasePlan() {
    if (!this.isImageUpload()) return
    Vue['prototype']['$confirm']('确认解除该预案？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      if (this.publishView) this.publishView = null
      let params = new FormData()
      params.append('planId', this.unfinishPlan[this.unfinishPlanKey].id)
      params.append('userId', this.loginUser_global.userId)
      let img = this.image ? this.image : new File(['.'],'1.text')
      params.append('img', img)
      let res = await prePlanClient.finishPlan(params)
      if (res === true) {
        this.initUnfinishedPlan()
        this.doRefreshOnlinePlan_global(true)
        this.toggleOprateTip_global({ tip: true, text: '预案已结束！' })
      } else {
        this.toggleOprateTip_global({ tip: true, text: res })
      }
    }).catch(() => {  })
  }

  @Watch('refreshPlan')
  planStatusChanged(val) {
    if(val) {
      this.initUnfinishedPlan()
      this.doRefreshPlan(false)
    }
  }

  created () {
    this.initUnfinishedPlan();
    this.interval = setInterval(() => {
      this.initUnfinishedPlan(this.unfinishPlanKey);
    }, 20000);  
  }

  beforeDestroy() {
    clearInterval(this.interval)
  }
}