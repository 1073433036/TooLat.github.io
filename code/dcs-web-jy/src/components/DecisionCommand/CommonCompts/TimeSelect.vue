<template>
  <main class="TimeSelect">
    <span>选择时间</span>
    <el-date-picker v-model="date" size="small" :editable="false" :clearable="false" type="date"></el-date-picker>
    <span>日</span>
    <select v-model="hour">
      <option :value="0">00</option>
      <option v-for="i in 23" :key="i" :value="i">{{ i >= 10 ? i : '0' + i }}</option>
    </select>
    <span>时</span>
    <template v-if="type === 'minute'">
      <select v-model="minute">
        <option :value="0">00</option>
        <option v-for="i in (60/minuteInt-1)" :key="i" :value="i*minuteInt">{{ i*minuteInt >= 10 ? i*minuteInt : '0' + i*minuteInt }}</option>
      </select>
      <span>分</span>
    </template>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'

  @Component
  export default class TimeSelect extends Vue {
    @Prop({ default: Function }) timeChanged
    @Prop({ default: 'minute' }) type: 'hour' | 'minute'
    @Prop({ default: 5 }) minuteInt: number
    @Prop({ default: () => new Date() }) time
    hasInitTime: boolean = false
    date: Date = new Date()
    hour: number = new Date().getHours()
    minute: number = 0
    
    mounted() {
      this.hasInitTime = false
      this.date = this.time
			this.hour = this.time.getHours()
      this.minute = this.type === 'hour' ? 0 : this.time.getMinutes()
      setTimeout(() => this.hasInitTime = true, 0)
    }

    timeChangedFn() {
      if (!this.hasInitTime) return
      let hour = this.hour >= 10 ?  this.hour : '0' + this.hour
      let minute = this.minute >= 10 ?  this.minute : '0' + this.minute
      let date = moment(this.date).format('YYYY/MM/DD') + ' ' + hour + ':' + minute + ':00'
      let time = new Date(date)
      this.timeChanged(time)
    }

    @Watch('date')
    ondateChanged (val: Date, oldVal: Date) {
      this.timeChangedFn()
    }
    @Watch('hour')
    onhourChanged (val: number, oldVal: number) {
      this.timeChangedFn()
    }
    @Watch('minute')
    onminuteChanged (val: number, oldVal: number) {
      this.timeChangedFn()
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
.TimeSelect {
  height: 40px;
  line-height: 40px;
  span {
    color: #1c1c1c;
    font-weight: bold;
  }
  select {
    border: 1px solid #d8dce5;
  }
}
</style>

<style lang='scss'>
.TimeSelect {
  .el-date-editor.el-input {
    width: 120px;
    .el-input__inner {
      padding: 0;
      text-align: center;
    }
    .el-input__prefix {
      // display: none;
    }
  }
  .el-popper[x-placement^=bottom] {
    margin-top: 0;
  }
}
</style>