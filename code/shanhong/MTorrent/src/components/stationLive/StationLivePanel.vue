<template>
  <main id="StationLivePanel" class="global-panel" v-drag>
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
        <li :class="{'on': tabOpt.real}">
          <div class="title" @click="toggleTab('real')">数据实况</div>
          <station-real :date="date" :hour="hour" :minute="minute" v-show="tabOpt.real" />
          <water-real :date="date" :hour="hour" :minute="minute" v-show="tabOpt.real" />
        </li>
        <li :class="{'on': tabOpt.swan}">
          <div class="title" @click="toggleTab('swan')">短临产品</div>
          <swan-product :date="date" :hour="hour" :minute="minute" v-show="tabOpt.swan" />
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
  import StationReal from './StationReal.vue'
  import WaterReal from './WaterReal.vue'
  import SwanProduct from './SwanProduct.vue'

  @Component({
    components: {
      StationReal,
      WaterReal,
      SwanProduct
    }
  })
  export default class StationLivePanel extends Vue {
    isAutoUpdate: boolean = true
    date: Date = new Date
    hour: number = 0
    minute: number = 0
    isHourListOn: boolean = false
    isMinuteListOn: boolean = false
    tabOpt: any = {
      real: true,
      swan: true,
    }
    intervalHolder: any = null

    created() {
      this.initTime()
      this.intervalHolder = setInterval(this.initTime, 5*60*1000)
    }

    destroyed () {
      if (!this.intervalHolder) return
      clearInterval(this.intervalHolder)
      this.intervalHolder = null
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

    initTime() {
      let time = Date.now() - 20*60*1000 
      this.date = new Date(moment(time).format('YYYY/MM/DD 00:00:00'))
      this.hour = new Date(time).getHours()
      this.minute = new Date(time - time % (5*60*1000)).getMinutes()
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

    toggleTab(key: 'real' | 'swan') {
      this.tabOpt[key] = !this.tabOpt[key]
    }
  }
</script>

<style lang='scss' scoped>
#StationLivePanel {
  top: 60px;
  left: 0;
  width: 280px;
  .content {
    user-select: none;
    ul {
      li {
        border-left: 3px solid transparent;
        &:last-child { border-bottom: none; }
        &.on {
          border-left: 3px solid orange;
          border-bottom: 1px solid #ccc;
        }
      }
    }
  }
}
</style>
