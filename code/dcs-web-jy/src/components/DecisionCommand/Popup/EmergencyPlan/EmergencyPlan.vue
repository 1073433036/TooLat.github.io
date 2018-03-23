<template>
  <main id="EmergencyPlan" class="decision-popup" v-drag>
    <header>
      <span>应急预案</span>
      <a @click="closeFunc"></a>
    </header>
    <section class="content"
        v-loading="isLoading"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading">
      <div class="info">
        <span class="info-cn">突发事件</span>
        <select v-model="selectedType" @change="getDisasterTypeInfo">
          <option v-for="type of emtype" :key="type.id" :value="type.id">{{ type.name }}</option>
        </select>
      </div>
      
      <div class="info">
        <span class="info-cn">事件类型</span>
        <select v-model="selectedDisaster" @change="typeChanged">
          <option v-for="opt of disaster" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
        </select>
      </div>
      
      <div class="info">
        <span class="info-cn">响应等级</span>
        <select v-model="selectedLevel" v-if="!isUnFinishPlan" @change="getPlanOrgs">
          <option v-for="opt of level" :key="opt" :value="opt">{{ levelFormat[opt - 1] }}级</option>
        </select>
        <span v-else>{{ levelFormat[selectedLevel - 1] }}级</span>
      </div>

      <div class="info">
        <span class="info-cn">消息渠道</span>
        <div class="msg-type">
          <span :class="{'on': selectedMsgType.includes('短信')}" 
              @click="toggleMsgType('短信')">短信</span>
          <span :class="{'on': selectedMsgType.includes('传真')}" 
              @click="toggleMsgType('传真')">传真</span>
        </div>
      </div>

      <div class="info" v-show="selectedMsgType.includes('传真')">
        <span class="info-cn">传真选择</span>
        <div class="image-btn-wrapepr">
          <div class="image-name">{{ this.image && this.image.name }}</div>
          <div class="image-btn">浏览...</div>
        </div>
        <input type="file" name="image" accept="image/*" @change="uploadImage" style="color: #000;">
      </div>

      <div class="info">
        <span class="info-cn">工作备忘</span>
        <div class="duty-btn btn" @click="openDutyPopup" v-show="!isUnFinishPlan">添加备忘</div>
      </div>
      <ul class="duty scroll-bar"
          v-if="!selectedDuties.length || (selectedDuties.length === 1 && !selectedDuties[0])">
        <li>
          <div class="duty-wrap">无</div>
        </li>
      </ul>
      <ul class="duty scroll-bar" v-else>
        <li v-for="opt of selectedDuties" :key="opt">
          <div class="duty-wrap" :title="opt">{{ opt }}</div>
          <span @click="deleteDuty(opt)" title="删除该工作备忘" v-show="!isUnFinishPlan">×</span>
        </li>
      </ul>

      <div class="info"><span class="info-cn">成员单位</span></div>
      <ul class="org scroll-bar">
        <li v-show="!organizations.length">无</li>
        <li v-show="organizations.length" v-for="org of organizations" :key="org">{{ org }}</li>
      </ul>

      <div class="info btn-wrapper cf">
        <div class="btn start-btn" v-if="!isUnFinishPlan" @click="startPlan">启动</div> 
        <template v-else>
          <div class="btn end-btn" @click="finishPlan">结束</div>
          <div class="btn level-btn up-btn" @click="changePlanLevel('up')">升级</div>
          <div class="btn level-btn" @click="changePlanLevel('down')">降级</div>
        </template>
      </div>

      <div class="decision-popup duty-popup" v-if="isDutiesPopupOn" v-drag>
        <header>
          <span>工作备忘</span>
          <a @click="isDutiesPopupOn = false"></a>
        </header>
        <div class="content">
          <ul class="scroll-bar">
            <li v-for="(opt, index) in duties" :key="index">
              {{ opt.name }}
              <em @click="toggleDuty(opt.name)" :class="{'on': selectedDuties.includes(opt.name)}"></em>
            </li>
          </ul>
          <input type="text" placeholder="输入自定义工作备忘" v-model="personDuty">
          <div class="per-btn" @click="addPersonDuty">添加</div>
        </div>
      </div>

    </section>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { plansClient } from '@/util/ClientHelper'

  @Component
  export default class EmergencyPlan extends Vue {
    @Prop({ default: Function }) closeFunc
    @Getter('systemStore/userInfo_global') userInfo_global
    @Getter('decisionStore/dealPlanInfo_global') dealPlanInfo_global
    @Action('decisionStore/storeDealPlanInfo_global') storeDealPlanInfo_global
    @Action('decisionStore/doRefreshPlan_global') doRefreshPlan_global
    @Getter('decisionStore/refreshOnlinePlan_global') refreshOnlinePlan_global
    @Action('decisionStore/doRefreshOnlinePlan_global') doRefreshOnlinePlan_global

    isLoading: boolean = false
    unFinishPlan: any = {}
    organizations: string[] = []
    emtype: any[] = []
    selectedType: number | null = null
    disaster: any[] = []
    selectedDisaster: any = null
    level: number[] = [1, 2, 3, 4]
    selectedLevel: number = 1
    selectedMsgType: string[] = ['短信', '传真']
    image: any = null
    imageSize: number = 0
    duties: any[] = []
    isDutiesPopupOn: boolean = false
    selectedDuties: string[] = []
    personDuty: any = null
    levelFormat: string[] = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ']
    get isUnFinishPlan() {
      let el = this.disaster.find(e => e.id === this.selectedDisaster)
      if (!el) return false
      if (el.name in this.unFinishPlan)
        return true
      else
        return false
    }

    @Watch('isUnFinishPlan')
    onisUnFinishPlanChanged (val: boolean, oldVal: boolean) {
      if (val) {
        let el = this.disaster.find(e => e.id === this.selectedDisaster)
        this.selectedDuties = this.unFinishPlan[el.name].memo.split(';')
      }
    }

    async mounted() {
      this.isLoading = true
      await this.getUnFinishPlan()
      await this.getDuties()

      await this.getEmegencyTypeInfo()
      await this.getDisasterTypeInfo()

      // 从应急处置启动
      if (Object.keys(this.dealPlanInfo_global).length) {
        this.selectedType = this.dealPlanInfo_global.selectedType
        this.selectedDisaster = this.dealPlanInfo_global.selectedDisaster
        this.selectedLevel = this.dealPlanInfo_global.selectedLevel
        this.storeDealPlanInfo_global({})
        this.getPlanOrgs()
        this.getPlanDuties()
      }

      this.isLoading = false
    }

    // 获取正在进行的应急预案
    async getUnFinishPlan() {
      let param = { state: 1 }
      let data: PlansOnlineInfo[] | false = await plansClient.getPlansOnline(param)
      if (data) {
        let obj = {}
        for (let opt of data) {
          obj[opt.emergencytype] = opt
        }
        this.unFinishPlan = { ...obj }
      } else
        this.unFinishPlan = {}
    }

    // 获取所有工作备忘
    async getDuties() {
      let res: PlanMemo[] | false = await plansClient.getPlanmemo()
      this.duties = res ? res : []
    }

    // 获取突发事件
    async getEmegencyTypeInfo() {
      let emtype: MaxEmergencyTypeInfo[] | false = await plansClient.getEmergencyType()
      if (emtype) {
        this.emtype = emtype
        this.selectedType = this.emtype[0].id
      }
    }

    // 获取事件类型
    async getDisasterTypeInfo() {
      if (!this.selectedType) return
      let data: MidEmergencyTypeInfo[] | false = await plansClient.getdetailEmergencyType(this.selectedType)
      if (!data || !data.length) {
        this.disaster = []
        this.selectedDisaster = null
      } else {
        this.disaster = data
        this.selectedDisaster = this.disaster[0].id
        let selectedDisName = this.disaster[0].name
        if (selectedDisName in this.unFinishPlan) {
          this.selectedLevel = this.unFinishPlan[selectedDisName].responsegrade
        }
      }
      await this.getPlanOrgs()
      this.getPlanDuties()
    }

    typeChanged() {
      this.getPlanDuties()
      this.getPlanResponsegrade()
      this.getPlanOrgs()
    }

    // 获取当前预案响应等级
    getPlanResponsegrade() {
      let emergencytype = this.disaster.find(e => e.id === this.selectedDisaster).name
      this.selectedLevel = 
        emergencytype in this.unFinishPlan
        ? this.unFinishPlan[emergencytype].responsegrade
        : 1
    }

    // 获取当前预案工作备忘
    getPlanDuties() {
      let emergencytype = this.disaster.find(e => e.id === this.selectedDisaster).name
      if (emergencytype in this.unFinishPlan) {
        let arr = this.unFinishPlan[emergencytype].memo.split(';')
        this.selectedDuties = (arr.length === 1 && !arr[0]) ? [] : arr
      } else {
        this.selectedDuties = []
      }
    }

    // 获取当前预案关联成员单位
    async getPlanOrgs() {
      this.organizations = []
      let emergencytype = this.disaster.find(e => e.id === this.selectedDisaster).name
      let res: planmeasureInfo[] | false = await plansClient.getPlanmeasure(emergencytype)
      if (!res) return
      for (let el of res) {
        if (el.level == this.selectedLevel && el.department)
          this.organizations.push(el.department)
      }
    }


    // 消息渠道
    toggleMsgType(type) {
      let index = this.selectedMsgType.indexOf(type)
      if (index === -1) {
        this.selectedMsgType.push(type)
      } else  {
        if (this.selectedMsgType.length > 1)
          this.selectedMsgType.splice(index, 1)        
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
      if (index === -1)
        this.selectedDuties.push(duty)
      else 
        this.selectedDuties.splice(index, 1)
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
      if (this.selectedMsgType.includes('传真')) {
        if (!this.image) {
          Vue['prototype']['$message']({ type: 'warning', message: '请先选择传真图片' })
          return false
        }
        if (this.imageSize > 2 * 1024 * 1024) {
          Vue['prototype']['$message']({ type: 'warning', message: '图片大小不得超过2MB!' })
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
        Vue['prototype']['$message']({ type: 'error', message: '无该事件类型' })
        return
      }
      if (!this.isImageUpload()) return
      let newschannels =
        this.selectedMsgType.length === 2
        ? '11'
        : (this.selectedMsgType.includes('短信') ? '10' : '01')

      // 表单提交
      let param = new FormData()
      let emergencyname = this.emtype.find(e => e.id === this.selectedType).name
      param.append('emergencyname', emergencyname)
      let emergencytype = this.disaster.find(e => e.id === this.selectedDisaster).name
      param.append('emergencytype', emergencytype)
      param.append('responsegrade', this.selectedLevel + '')
      param.append('newschannels', newschannels)
      newschannels !== '10' && param.append('multipartFiles', this.image)
      param.append('memo', this.selectedDuties.join(';'))
      param.append('unit', this.organizations.join(';'))
      param.append('state', '1')
      // userid: this.userInfo_global.userid

      let res: null | false = await plansClient.startPlansOnline(param)
      if (res === null) {
        this.getUnFinishPlan()
        this.doRefreshPlan_global(true)
        Vue['prototype']['$message']({ type: 'success', message: '预案启动成功！' })
      } else {
        Vue['prototype']['$message']({ type: 'error', message: '预案启动失败！' })
      }
    }

    // 结束应急指挥流程
    async finishPlan() {
      Vue['prototype']['$confirm']('确认解除该预案？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (!this.isImageUpload()) return
        let newschannels =
          this.selectedMsgType.length === 2
          ? '11'
          : (this.selectedMsgType.includes('短信') ? '10' : '01')
        let emergencytype = this.disaster.find(e => e.id === this.selectedDisaster).name

        let param = new FormData()
        param.append('id', this.unFinishPlan[emergencytype].id + '')
        param.append('newschannels', newschannels)
        newschannels !== '10' && param.append('multipartFiles', this.image)
        param.append('state', '0')

        let res: null | false = await plansClient.updatePlansOnline(param)
        if (res === null) {
          this.selectedDuties = []
          this.getUnFinishPlan()
          this.doRefreshPlan_global(true)
          Vue['prototype']['$message']({ type: 'success', message: '预案已结束！' })
        } else {
          Vue['prototype']['$message']({ type: 'error', message: '预案结束失败！' })
        }
      }).catch(() => {})
    }

    // 改变预案等级
    async changePlanLevel(type) {
      Vue['prototype']['$confirm']('确定更改预案等级吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let emergencytype = this.disaster.find(e => e.id === this.selectedDisaster).name
        let info = this.unFinishPlan[emergencytype]
        let level = info.responsegrade
        if (type === 'up') {
          if (level === 1) {
            Vue['prototype']['$message']({ type: 'error', message: '已经是最高预案等级!' })
            return
          }
          --level
        } else if (type === 'down') {
          if (level === 4) {
            Vue['prototype']['$message']({ type: 'error', message: '已经是最低预案等级!' })
            return
          }
          ++level
        }

        if (!this.isImageUpload()) return
        let newschannels =
          this.selectedMsgType.length === 2
          ? '11'
          : (this.selectedMsgType.includes('短信') ? '10' : '01')
        let param = new FormData()
        param.append('id', this.unFinishPlan[emergencytype].id + '')
        param.append('newschannels', newschannels)
        newschannels !== '10' && param.append('multipartFiles', this.image)
        param.append('responsegrade', level + '')
        
        let res: null | false = await plansClient.updatePlansOnline(param)
        if (res === null) {
          this.selectedLevel = level
          this.getUnFinishPlan()
          this.doRefreshPlan_global(true)
          Vue['prototype']['$message']({ type: 'success', message: '预案等级修改成功!' })
        } else {
          Vue['prototype']['$message']({ type: 'error', message: '预案等级修改失败!' })
        }
      }).catch(() => {})
    }

    @Watch('refreshOnlinePlan_global')
    async onrefreshOnlinePlan_globalChanged(val: any, oldVal: any) {
      if (val) {
        await this.getUnFinishPlan()
        this.typeChanged()
        this.doRefreshOnlinePlan_global(false)
      }
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#EmergencyPlan {
  position: absolute;
  top: 0;
  left: 60px;
  width: 380px;
  .content {
    padding: 10px 20px;
    box-sizing: border-box;
    position: relative;
    color: #1c1c1c;
    font-size: 14px;
    line-height: 30px;
    .info {
      position: relative;
      margin-bottom: 7px;
      height: 30px;
      .info-cn {
        position: relative;
        padding: 0 10px 0 5px;
      }
      select {
        width: 200px;
        height: 30px;
        color: #000;
        font-size: 12px;
        background: #f5f5f5;
        text-indent: 5px;
        border: 1px solid #dfe6ec;
        border-radius: 2px;
      }
      .msg-type {
        position: absolute;
        top: 0;
        left: 80px;
        height: 30px;
        span {
          position: relative;
          display: inline-block;
          width: 65px;
          text-indent: 22px;
          cursor: pointer;
          &:before {
            position: absolute;
            content: '';
            top: 7px;
            left: 0;
            width: 16px;
            height: 16px;
            background: url(~Img/DecisionCommand/sidebar_chb.png) no-repeat center / 100%;
          }
          &:hover, &.on { color: $themeColor; }
          &.on:before { background: url(~Img/DecisionCommand/checkbox.png) no-repeat 100% 0 / 200% 100%; }
        }
      }
      .image-btn-wrapepr {
        position: absolute;
        top: 0;
        left: 80px;
        box-sizing: border-box;
        width: 230px;
        height: 30px;
        .image-name {
          padding: 0 10px;
          width: 160px;
          height: 30px;
          line-height: 30px;
          box-sizing: border-box;
          border: 1px solid #dfe6ec;
          border-right: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .image-btn {
          position: absolute;
          top: 0;
          right: 0;
          text-align: center;
          width: 70px;
          height: 30px;
          line-height: 30px;
          box-sizing: border-box;
          background: #f5f5f5;
          border: 1px solid #dfe6ec;
        }
      }
      input[type="file"] {
        position: absolute;
        top: 0;
        left: 80px;
        width: 230px;
        height: 30px;
        cursor: pointer;
        opacity: 0;
      }
      .btn {
        float: left;
        padding: 0 15px;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
      }
      .duty-btn {
        position: absolute;
        top: 3px;
        right: 10px;
        color: $themeColor;
        border: 1px solid $themeColor;
      }
      &.btn-wrapper {
        display: flex;
        justify-content: center;
        margin: 10px 0 0;
        height: 24px;
        .start-btn {
          color: #fff;
          background: $themeColor;
          border: 1px solid $themeColor;
          &:hover { background: rgba(17, 169, 245, 0.8); }
        }
        .end-btn {
          color: #fff;
          background: #f4434b;
          border: 1px solid #f4434b;
          &:hover { background: rgba(244, 67, 75, 0.8); }
        }
        .level-btn {
          background: #fff;
          border: 1px solid $themeColor;
        }
        .up-btn {
          margin: 0 10px 0 10px;
        }
      }
    }
    ul.duty {
      max-height: 80px;
      box-sizing: border-box;
      padding: 0 10px;
      border: 1px solid #eee;
      border-radius: 4px;
      overflow-y: auto;
      overflow-x: hidden;
      li {
        position: relative;
        .duty-wrap {
          width: 280px;
          height: 26px;
          line-height: 26px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #000;
        }
        span {
          position: absolute;
          top: 0;
          right: 0;
          display: inline-block;
          width: 26px;
          height: 26px;
          line-height: 26px;
          font-size: 20px;
          text-align: center;
          cursor: pointer;
          &:hover { color: $themeColor; }
        }
      }
    }
    ul.org {
      max-height: 90px;
      box-sizing: border-box;
      padding: 0 10px;
      border-radius: 4px;
      overflow-y: auto;
      overflow-x: hidden;
      border: 1px solid #eee; /*no*/
      li {
        float: left;
        color: #000;
        padding-right: 5px;
      }
    }
    .duty-popup {
      position: absolute;
      top: 30px;
      left: 45px;
      width: 250px;
      .content {
        padding: 10px;
      }
      ul {
        max-height: 120px;
        border: 1px solid #eee;
        overflow-y: auto;
        overflow-x: hidden;
        li {
          text-indent: 10px;
          position: relative;
          em {
            position: absolute;
            top: 5px;
            right: 5px;
            display: inline-block;
            width: 16px;
            height: 16px;
            cursor: pointer;
            background: url(~Img/DecisionCommand/home_rb_gray.png) no-repeat 0 0 / 100% 100%;
            &.on { background: url(~Img/DecisionCommand/home_rb_blue.png) no-repeat 0 0 / 100% 100%; }
          }
        }
      }
      input[type="text"] {
        margin: 10px 0;
        width: 100%;
        box-sizing: border-box;
        padding: 0 5px;
        line-height: 26px;
        border: 1px solid #eee;
        border-radius: 2px;
      }
      .per-btn {
        margin-left: 95px;
        width: 60px;
        line-height: 24px;
        text-align: center;
        border-radius: 4px;
        color: #fff;
        background: $themeColor;
        &:hover { background: rgba(17, 169, 245, 0.8); }
        cursor: pointer;
      }
    }
  }
}
</style>