<template>

  <main id="emergResponse" class="global-panel" v-drag>

    <header>
      <el-date-picker
        v-model="date"
        type="date"
        size="small"
        :editable="false"
        :clearable="false"
        @change='selectDay'>
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
          <li v-for="i in 9" :key="i" @click="selectMinute(i*6)" :class="{'on': minute === i*6}">
            {{ 6*i >= 10 ? 6*i : '0' + 6*i }}
          </li>
        </ul>
      </div>
      <i :class="['update-btn', {on: isAutoUpdate}]" :title="isAutoUpdate ? '自动更新中' : '点击自动更新数据'"
         @click="isAutoUpdate = !isAutoUpdate"></i>
    </header>

    <div class="content">
      <waining-response :date="date" :hour="hour" :minute="minute" v-show="isShowTable" />
      <!--<ul class="list ns">-->
        <!--<li :class="{'on': isShowTable}">-->
          <!--<div class="title" @click="toggleTab"> 预警信号  </div>-->
          <!--<waining-response :date="date" :hour="hour" :minute="minute" v-show="isShowTable" />-->
        <!--</li>-->
      <!--</ul>-->
    </div>
  </main>
</template>



<script lang='ts'>

  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import moment from 'moment'
  import wainingResponse from './WainingResponse.vue'
  @Component({
    components: {
      wainingResponse
    }
  })
  export default class EmergResponse extends Vue {
    date:Date = new Date
    hour:number = 0
    minute:number = 0
    isHourListOn: boolean = false
    isMinuteListOn: boolean = false

    isShowTable: boolean = true

    intervalHolder: any = null
    isAutoUpdate: boolean = true

    mounted() {
      this.initTime()
      this.intervalHolder = setInterval(this.initTime, 1*60*1000)
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
      this.minute = new Date(time - time % (6*60*1000)).getMinutes()
//      this.hour = new Date().getHours()
//      let time = new Date().getTime()
//      this.minute = new Date(time - time % (6*60*1000)).getMinutes()
    }

    @Watch('isAutoUpdate')
    onisAutoUpdateChanged (val: boolean, oldVal: boolean) {
      if (val)
        this.intervalHolder = setInterval(this.initTime, 1*60*1000)
      else {
        clearInterval(this.intervalHolder)
        this.intervalHolder = null
      }
    }


    toggleTab() {
      this.isShowTable = !this.isShowTable;
    }


    selectDay(dateTime){

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
          minuteEle.scrollTop = 24 * this.minute / 6 - 24 * 4
        })
      }
    }
    selectHour(h) {
      if (h === this.hour) {
        return
      }
      this.hour = h
      this.isHourListOn = false
    }
    selectMinute(m) {
      if (m === this.minute) {
        return
      }
      this.minute = m
      this.isMinuteListOn = false
    }


  }
</script>



<style lang='scss' scoped>
  #emergResponse {
    top: 60px;
    left: 0;
    background-color: #ffffff;
    width: 330px;
  }
</style>

<style lang='scss'>
  #emergResponse .el-table::before {
    z-index: 0;
  }
</style>
