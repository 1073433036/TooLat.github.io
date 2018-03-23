<template>
  <main id="WarningAnalysis" class="global-panel" v-drag>
    <header>
      <el-date-picker
        v-model="date"
        size="small"
        :editable="false"
        :clearable="false"
        type="date">
      </el-date-picker>

      <div class="hour-min hour" @mouseenter="toggleSelectList('hour')" @mouseleave="isHourListOn = false">
        <span>{{ hour >= 10 ? hour : '0' + hour }}</span>
        <ul class="list scroll-bar" v-show="isHourListOn" ref="hourList">
          <li @click="selectHour(0)" :class="{'on': hour === 0}">00</li>
          <li v-for="i in 23" :key="i" @click="selectHour(i)" :class="{'on': hour === i}">
            {{ i >= 10 ? i : '0' + i }}
          </li>
        </ul>
      </div>

      <div class="hour-min minute" @mouseenter="toggleSelectList('minute')" @mouseleave="isMinuteListOn = false">
        <span>{{ minute >= 10 ? minute : '0' + minute }}</span>
        <ul class="list scroll-bar" v-show="isMinuteListOn" ref="minuteList">
          <li @click="selectMinute(0)" :class="{'on': minute === 0}">00</li>
          <li v-for="i in 11" :key="i" @click="selectMinute(i*5)" :class="{'on': minute === i*5}">
            {{ 5*i >= 10 ? 5*i : '0' + 5*i }}
          </li>
        </ul>
      </div>
      <i :class="['update-btn', {on: isAutoUpdate}]" :title="isAutoUpdate ? '自动更新中' : '点击自动更新数据'"
         @click="isAutoUpdate = !isAutoUpdate"></i>
    </header>

    <div class="content">
      <ul class="list">
        <li :class="{'on': tabOpt.realData}">
          <div class="title" @click="toggleTab('realData')">实时数据</div>
          <template v-if="tabOpt.realData">
            <warning-real-time-vue :date="date" :hour="hour" :minute="minute" />
          </template>
        </li>
        <li :class="{'on': tabOpt.countData}">
          <div class="title" @click="toggleTab('countData')">统计数据</div>
          <waining-count-data-vue v-show="tabOpt.countData" :date="date" :hour="hour" :minute="minute" />
        </li>
        <li :class="{'on': tabOpt.swanProduct}">
          <div class="title" @click="toggleTab('swanProduct')">短临产品</div>
          <waining-swan-product-vue v-show="tabOpt.swanProduct" :date="date" :hour="hour" :minute="minute" />
        </li>
        <li :class="{'on': tabOpt.warningRemind}">
          <div class="title" @click="toggleTab('warningRemind')">
            预警提醒
            <em :class="['threshold', {on: popupStatus_global.thresholdSetting}]" title="阈值设置"
                @click.stop="storePopupStatus_global({ key: 'thresholdSetting', action: !popupStatus_global.thresholdSetting })"></em>
          </div>
          <waining-wain-remind-vue v-show="tabOpt.warningRemind" :date="date" :hour="hour" :minute="minute" />
        </li>
      </ul>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  import WarningRealTimeVue from './WarningRealTimeVue.vue'
  import WainingCountDataVue from './WainingCountDataVue.vue'
  import WainingSwanProductVue from './WainingSwanProductVue.vue'
  import WainingWainRemindVue from './WainingWainRemindVue.vue'

  @Component({
    components: {
      WarningRealTimeVue,
      WainingCountDataVue,
      WainingSwanProductVue,
      WainingWainRemindVue,
    }
  })
  export default class warningAnalysisPanel extends Vue {
    @Getter('systemStore/popupStatus_global') popupStatus_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    date: Date = new Date
    hour: number = 0
    minute: number = 0
    isHourListOn: boolean = false
    isMinuteListOn: boolean = false
    tabOpt: any = {
      realData: true,
      countData: true,
      swanProduct: true,
      warningRemind: true
//=======
//      countData: false,
//      swanProduct: false,
//      warningRemind: true,
//      stationSelected: false,
//>>>>>>> Stashed changes
    }
    intervalHolder: any = null
    isAutoUpdate: boolean = true

    created() {
      this.initTime()
      this.intervalHolder = setInterval(this.initTime, 5*60*1000)
    }

    destroyed () {
      if (!this.intervalHolder) return
      clearInterval(this.intervalHolder)
      this.intervalHolder = null
    }

    initTime() {
      let time = Date.now() - 15*60*1000
      this.date = new Date(moment(time).format('YYYY/MM/DD 00:00:00'))
      this.hour = new Date(time).getHours()
      this.minute = new Date(time - time % (5*60*1000)).getMinutes()
    }

    @Watch('isAutoUpdate')
    onisAutoUpdateChanged (val: boolean, oldVal: boolean) {
      if (val)
        this.intervalHolder = setInterval(this.initTime, 5*60*1000)
      else {
        clearInterval(this.intervalHolder)
        this.intervalHolder = null
      }
    }

    // 时 分
    toggleSelectList(key) {
      if (key === 'hour') {
        this.isHourListOn = true
        this.$nextTick(() => {
          let hourEle = <HTMLDivElement>this.$refs.hourList
          hourEle.scrollTop = 24 * this.hour - 24 * 4
        })
      } else if (key === 'minute') {
        this.isMinuteListOn = true
        this.$nextTick(() => {
          let minuteEle = <HTMLDivElement>this.$refs.minuteList
          minuteEle.scrollTop = 24 * this.minute / 5 - 24 * 4
        })
      }
    }
    selectHour(h) {
      this.hour = h
      this.isHourListOn = false
    }
    selectMinute(m) {
      this.minute = m
      this.isMinuteListOn = false
    }

    toggleTab(key) {
      this.tabOpt[key] = !this.tabOpt[key]
    }
  }
</script>

<style lang='scss' scoped>
  #WarningAnalysis {
    top: 60px;
    left: 0;
    background-color: #ffffff;
    width: 280px;
    .content {
      user-select: none;
      ul {
        li {
          margin-top: 1.5px;
          border-left: 3px solid transparent;
          &:last-child { border-bottom: none; }
          &.on {
            border-left: 3px solid orange;
            border-bottom: 1px solid #ccc;
            &:last-child { border-bottom: none; }
            .title {
              .threshold {
                top: 8px;
              }
            }
          }
          .title {
            .threshold {
              position: absolute;
              top: 18px;
              left: 80px;
              display: inline-block;
              width: 14px;
              height: 14px;
              background: url(~Img/toolbar/threshold.png) no-repeat center / 100%;
              cursor: pointer;
              &:hover, &.on { background: url(~Img/toolbar/threshold_cover.png) no-repeat center / 100%; }
            }
          }
        }
      }
    }
  }
</style>
