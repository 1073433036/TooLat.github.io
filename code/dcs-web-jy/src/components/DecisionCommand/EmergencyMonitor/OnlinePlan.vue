<template>
  <main id="OnlinePlan" class="scroll-bar">

    <div class="plan-wrapper" v-if="unFinishPlanIdSelected">
      <div class="plan-title">
        <span @mouseenter="isListPopupOn = true" @mouseleave="isListPopupOn = false">
          {{ unFinishPlan[unFinishPlanIdSelected].emergencytype }} 
          {{ levelFormat[unFinishPlan[unFinishPlanIdSelected].responsegrade - 1] }}级
          <ul class="plan-list" v-if="isListPopupOn && Object.keys(unFinishPlan).length > 1">
            <li v-for="el in unFinishPlan" :key="el.id"
                @click="unFinishPlanIdSelected = el.id; isListPopupOn = false"
                v-if="unFinishPlanIdSelected != el.id">
              {{ el.emergencytype + ' ' + levelFormat[el.responsegrade - 1] + '级' }}
            </li>
          </ul>
        </span>
      </div>

      <div class="info">
        <span class="info-cn">突发事件</span>
        <span class="info-max" :title="unFinishPlan[unFinishPlanIdSelected].emergencyname">
          {{ unFinishPlan[unFinishPlanIdSelected].emergencyname }}
        </span>
      </div>
      
      <div class="info">
        <span class="info-cn">事件类型</span>
        <span class="info-max" :title="unFinishPlan[unFinishPlanIdSelected].emergencytype">
          {{ unFinishPlan[unFinishPlanIdSelected].emergencytype }}
        </span>
      </div>
      
      <div class="info">
        <span class="info-cn">响应等级</span>
        <span>{{ levelFormat[unFinishPlan[unFinishPlanIdSelected].responsegrade - 1] }}级</span>
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

      <template v-if="selectedMsgType.includes('传真')">
        <div class="info">
          <span class="info-cn">传真选择</span>
        </div>
        <div class="info">
          <div class="image-btn-wrapepr">
            <div class="image-name">{{ this.image && this.image.name }}</div>
            <div class="image-btn">浏览...</div>
          </div>
          <input type="file" name="image" accept="image/*" @change="uploadImage" style="color: #000;">
        </div>
      </template>

      <div class="info">
        <span class="info-cn">工作备忘</span>
      </div>
      <ul class="duty scroll-bar">
        <li v-if="!selectedDuties.length"><div class="duty-wrap">无</div></li>
        <li v-for="opt of selectedDuties" :key="opt" v-else>
          <div class="duty-wrap" :title="opt">{{ opt }}</div>
        </li>
      </ul>

      <div class="info">
        <span class="info-cn">成员单位</span>
      </div>
      <ul class="org scroll-bar">
        <li v-if="!organizations.length">无</li>
        <li v-for="org of organizations" :key="org" v-else>{{ org }}</li>
      </ul>

      <div class="info btn-wrapper cf">
        <div class="btn end-btn" @click="finishPlan">结束</div>
        <div class="btn level-btn up-btn" @click="changePlanLevel('up')">升级</div>
        <div class="btn level-btn" @click="changePlanLevel('down')">降级</div>
      </div>
    </div>

    <div class="no-plan" v-else>
      无应急预案
    </div>
      
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { plansClient } from '@/util/ClientHelper'

  @Component
  export default class OnlinePlan extends Vue {
    @Getter('decisionStore/refreshPlan_global') refreshPlan_global
    @Action('decisionStore/doRefreshPlan_global') doRefreshPlan_global
    @Action('decisionStore/doRefreshOnlinePlan_global') doRefreshOnlinePlan_global
    @Action('decisionStore/storeEmergencyMonitor_global') storeEmergencyMonitor_global

    isListPopupOn: boolean = false
    unFinishPlan: any = {}
    unFinishPlanIdSelected: number | null = null
    selectedMsgType: string[] = ['短信', '传真']
    image: any = null
    imageSize: number = 0
    get selectedDuties() {
      if (this.unFinishPlan[this.unFinishPlanIdSelected].memo)
        return this.unFinishPlan[this.unFinishPlanIdSelected].memo.split(';')
      else
        return []
    }
    get organizations() {
      if (this.unFinishPlan[this.unFinishPlanIdSelected].unit)
        return this.unFinishPlan[this.unFinishPlanIdSelected].unit.split(';')
      else
        return []
    }
    levelFormat: string[] = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ']

    created() {
      this.getUnFinishPlan()
    }

    // 获取正在进行的应急预案
    async getUnFinishPlan() {
      let param = { state: 1 }
      let data: PlansOnlineInfo[] | null | false = await plansClient.getPlansOnline(param)
      if (data) {
        this.storeEmergencyMonitor_global({ key: 'onlinePlan', action: true })
        let obj: any = {}
        for (let opt of data) {
          if (!this.unFinishPlanIdSelected)
            this.unFinishPlanIdSelected = opt.id
          obj[opt.id] = opt
        }
        this.unFinishPlan = { ...obj }
      } else {
        this.unFinishPlan = {}
        this.unFinishPlanIdSelected = null
        this.storeEmergencyMonitor_global({ key: 'onlinePlan', action: false })
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

        let param = new FormData()
        param.append('id', this.unFinishPlanIdSelected + '')
        param.append('newschannels', newschannels)
        newschannels !== '10' && param.append('multipartFiles', this.image)
        param.append('state', '0')

        let res: null | false = await plansClient.updatePlansOnline(param)
        if (res === null) {
          this.unFinishPlanIdSelected = null
          this.getUnFinishPlan()
          this.doRefreshOnlinePlan_global(true)
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
        let level = this.unFinishPlan[this.unFinishPlanIdSelected].responsegrade
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
        param.append('id', this.unFinishPlanIdSelected + '')
        param.append('newschannels', newschannels)
        newschannels !== '10' && param.append('multipartFiles', this.image)
        param.append('responsegrade', level + '')
        
        let res: null | false = await plansClient.updatePlansOnline(param)
        if (res === null) {
          this.getUnFinishPlan()
          this.doRefreshOnlinePlan_global(true)
          Vue['prototype']['$message']({ type: 'success', message: '预案等级修改成功!' })
        } else {
          Vue['prototype']['$message']({ type: 'error', message: '预案等级修改失败!' })
        }
      }).catch(() => {})
    }

    @Watch('refreshPlan_global')
    onrefreshPlan_globalChanged (val: boolean, oldVal: boolean) {
      if (val) {
        this.getUnFinishPlan()
        this.doRefreshPlan_global(false)
      }
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#OnlinePlan {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  position: relative;
  color: #1c1c1c;
  font-size: 14px;
  line-height: 30px;
  .no-plan {
    text-indent: 30px;
    line-height: 5px;
  }
  .plan-title {
    position: relative;
    height: 30px;
    line-height: 30px;
    z-index: 1;
    >span {
      position: absolute;
      left: 22%;
      display: inline-block;
      max-width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: $themeColor;
      cursor: pointer;
      ul.plan-list {
        position: relative;
        border: 1px solid #bbb; /*no*/
        li {
          padding: 0 10px;
          color: #999;
          background: #fff;
          height: 24px;
          line-height: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:hover {
            color: $themeColor;
          }
        }
      }
    }
  }
  .info {
    position: relative;
    margin-bottom: 7px;
    height: 30px;
    .info-cn {
      float: left;
      position: relative;
      padding: 0 10px 0 5px;
    }
    .info-max {
      float: left;
      max-width: 190px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    select {
      width: 190px;
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
      left: 15px;
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
      left: 20px;
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
    width: calc(100% - 30px);
    margin-left: 15px;
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
    width: calc(100% - 30px);
    margin-left: 15px;
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
}
</style>