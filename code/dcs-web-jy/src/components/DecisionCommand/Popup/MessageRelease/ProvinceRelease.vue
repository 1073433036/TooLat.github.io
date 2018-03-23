<template>
  <main id="ProvinceRelease">
    <div class="main-wrapper" @click="blurControl = Date.now()">
      <!-- <div class="info cf">
        <div class="text">统计分析</div>
        <div class="val">
          大喇叭-<span class="red">{{ speakerCount }}</span>个
          LED显示屏-<span class="red">{{ ledCount }}</span>个
        </div>
      </div> -->

      <div class="info">消息渠道</div>
      <div class="content">
        <ul class="cf list-chk-group">
          <li v-for="(name, index) in channelList" :key="index"
              :class="{on: channelSelected.charAt(index) === '1'}" @click="toggleChannelList(index)">
            <em></em>
            <span>{{ name }}</span>
          </li>
        </ul>
      </div>

      <div class="info cf" style="margin-top: 10px;">
        <div class="text">突发事件</div>
        <div class="val">
          <select v-model="selectedType" @change="getDisasterTypeInfo">
            <option v-for="type of emtype" :key="type.id" :value="type.id">{{ type.name }}</option>
          </select>
        </div>
      </div>

      <div class="info cf" style="margin-top: 2px;">
        <div class="text">事件类型</div>
        <div class="val">
          <select v-model="selectedDisaster">
            <option v-for="opt of disaster" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
          </select>
        </div>
      </div>

      <div class="info">灾害等级</div>
      <div style="padding: 0 10px;">
        <el-slider v-model="levelSelected" :step="1" :min="1" :max="5"
            :format-tooltip="formatTooltip"></el-slider>
      </div>
      <div class="info" style="margin-top: -8px;">
        <ul class="levels">
          <li v-for="(el, key) in disasterLevels" :key="key"
              @click="levelSelected = +key" :class="{on: levelSelected === +key}">
            {{ el }}级
          </li>
        </ul>
      </div>
      
      <div class="info">发布区域</div>
      <div class="select-wrapper cf">
        <div class="select-info">
          <div class="select-info-list">
            <span v-for="el in depsList.filter(opt => opt.selected)" :key="el.id">{{ el.name }}</span>
          </div>
          <!-- <ul>
            <li v-for="el in depsList.filter(opt => opt.selected)" :key="el.id">
              <span>{{ el.name }}</span><i @click="el.selected = false"></i>
            </li>
          </ul> -->
        </div>
        <div class="select-btn" @click.stop="selectPopup = true">＋</div>
      </div>

      <textarea v-model="message" placeholder="填写发布内容"></textarea>
      <div class="primary-btn release-btn" @click="release">发布</div>
    </div>

    <div class="select-popup" v-if="selectPopup">
      <ul class="list">
        <li v-for="el in depsList" :key="el.id" :class="{on: el.selected}"
            @click="el.selected = !el.selected">
          {{ el.name }}
        </li>
      </ul>
      <div class="btn-wrapper">
        <div class="primary-btn all" @click="selectAllOpts">全选</div>
        <div class="primary-btn select" @click="selectPopup = false">确定</div>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { geoClient, plansClient, releaseClient } from '@/util/ClientHelper'

  @Component
  export default class ProvinceRelease extends Vue {
    @Getter('decisionStore/region_global') region_global
    blurControl: boolean = false
    speakerCount: number = 0
    ledCount: number = 0
    channelList: string[] = ['短信', '预警短信', '电子显示屏', '大喇叭', '微博', '微信',
      '传真', '应急气象频道', '广东应急气象客户端', '电子邮件', '应急气象网']
    channelSelected: string ='11111111111'
    emtype: any[] = []
    selectedType: number | null = null
    disaster: any[] = []
    selectedDisaster: any = null
    levelSelected: number = 1
    disasterLevels: any = { 1: 'Ⅰ', 2: 'Ⅱ', 3: 'Ⅲ', 4: 'Ⅳ', 5: 'Ⅴ' }
    selectPopup: boolean = false
    depsList: any[] = []
    message: string = ''

    async mounted() {
      await this.getEmegencyTypeInfo()
      this.getDisasterTypeInfo()
      this.getAreas()
    }

    // 获取突发事件
    async getEmegencyTypeInfo() {
      let emtype: MaxEmergencyTypeInfo[] | false = await plansClient.getEmergencyType()
      if (!emtype) return
      this.emtype = emtype
      if (emtype.length)
        this.selectedType = this.emtype[0].id
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
      }
    }

    // 获取发布区域
    async getAreas() {
      let res = await geoClient.findCounties(this.region_global.cityId)
      if (!res) return
      let arr = []
      for (let el of res) {
        arr.push({ id: el.countyid, name: el.county, selected: false })
      }
      this.depsList = arr
    }

    toggleChannelList(index) {
      let flag = this.channelSelected.charAt(index)
      this.channelSelected = this.channelSelected.slice(0, index)
        + (flag === '1' ? '0' : '1') + this.channelSelected.slice(index + 1)
    }

    formatTooltip(val) {
      return this.disasterLevels[val]
    }

    @Watch('blurControl')
    onblurControlChanged (val: number, oldVal: number) {
      this.selectPopup = false
    }

    selectAllOpts() {
      let flag = true
      for (let el of this.depsList) {
        if (!el.selected) {
          flag = false
          break
        }
      }
      for (let el of this.depsList) {
        el.selected = !flag
      }
    }

    async release() {
      if (!this.message) {
        Vue['prototype']['$message']({ type: 'warning', message: '请填写发布内容' })
        return
      }

      let area: number[] = []
      for (let el of this.depsList) {
        if (el.selected) area.push(el.id)
      }

      let param = {
        channels: this.channelSelected,
        hazardType: this.emtype.find(e => e.id === this.selectedType).name,
        eventType: this.disaster.find(e => e.id === this.selectedDisaster).name,
        hazardClass: this.levelSelected,
        area: area.join(','),
        content: this.message,
        state: 1,
        failure: ''
      }
      let res: null | false = await releaseClient.provinceRelease(param)
      if (res === null)
        Vue['prototype']['$message']({ type: 'success', message: '发布成功' })
      else
        Vue['prototype']['$message']({ type: 'error', message: '发布失败' })
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#ProvinceRelease {
  position: relative;
  .info {
    height: 30px;
    line-height: 30px;
    .text {
      float: left;
      width: 23%;
    }
    .val {
      float: left;
      width: 77%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .red { color: #f00; }
      select {
        margin-top: 2px;
        box-sizing: border-box;
        padding-left: 10px;
        width: 200px;
        min-height: 26px;
        color: #222;
        font-size: 12px;
        background: #f5f5f5;
        border: 1px solid #ccc;
      }
    }
    ul.levels {
      position: relative;
      height: 30px;
      li {
        position: absolute;
        top: 0;
        cursor: pointer;
        white-space: nowrap;
        &:nth-child(1) {
          left: 0;
        }
        &:nth-child(2) {
          left: calc(25% - 7px);
        }
        &:nth-child(3) {
          left: calc(50% - 10px);
        }
        &:nth-child(4) {
          left: calc(75% - 14px);
        }
        &:nth-child(5) {
          left: calc(100% - 24px); /*no*/
        }
        &.on { color: $themeColor }
      }
    }
  }
  textarea {
    margin-top: 10px;
    box-sizing: border-box;
    padding: 10px 15px;
    width: 340px;
    height: 100px;
    color: #777;
    border-color: #d8dce5;
  }
  .release-btn {
    margin: 5px 130px;
  }
  .btn-wrapper {
    margin-top: 5px;
    position: relative;
    height: 22px;
    .primary-btn {
      position: absolute;
      top: 0;
      height: 22px;
      line-height: 22px;
      &.all {
        left: 65px;
      }
      &.select {
        left: 155px;
      }
    }
  }


  .select-wrapper {
    height: 30px;
    .select-info {
      position: relative;
      float: left;
      max-width: 310px;
      line-height: 30px;
      .select-info-list {
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          height: 30px;
          line-height: 30px;
          margin-right: 5px;
          color: #5a5e66;
        }
      }
      // ul {
      //   position: relative;
      //   overflow: hidden;
      //   text-overflow: ellipsis;
      //   white-space: nowrap;
      //   li {
      //     display: inline-block;
      //     height: 30px;
      //     line-height: 30px;
      //     span {
      //       float: left;
      //       color: #5a5e66;
      //     }
      //     i {
      //       margin: 6px 7px 0 3px;
      //       display: inline-block;
      //       width: 16px;
      //       height: 16px;
      //       border-radius: 50%;
      //       cursor: pointer;
      //       background: $themeColor url(~Img/DecisionCommand/close.png) no-repeat center / 8px 8px;
      //     }
      //   }
      // }
    }
    .select-btn {
      float: left;
      box-sizing: border-box;
      margin-top: 3px;
      width: 24px;
      height: 24px;
      font-size: 22px;
      line-height: 22px;
      text-align: center;
      color: #adadad;
      background: #f2f2f2;
      border: 1px solid #d2d2d2;
      cursor: pointer;
    }
  }
  .select-popup {
    z-index: 1;
    position: absolute;
    top: 30px;
    left: 0;
    padding: 10px 15px;
    width: 340px;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #8d9db5;
    box-shadow: 0 0 5px #8d9db5;
    ul.list {
      li {
        margin-left: 2px;
        display: inline-block;
        padding: 0 7px;
        height: 22px;
        line-height: 22px;
        background: #f5f5f5;
        border: 1px solid #fff;
        cursor: pointer;
        &.on {
          background: #dff3fc;
          border: 1px solid #00a0e9;
        }
      }
    }
    >.primary-btn {
      margin: 10px 115px 0;
    }
  }
}
</style>

<style lang='scss'>
@import '../../../../styles/theme.scss';
#ProvinceRelease {
  .el-slider__bar {
    background-color: $themeColor;
  }
  .el-slider__button {
    border-color: $themeColor;
  }
}
</style>