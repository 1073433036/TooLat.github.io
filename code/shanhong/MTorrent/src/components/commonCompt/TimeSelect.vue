<template>
  <main class="TimeSelect">
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
    @Prop({ default: moment() }) time
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
.TimeSelect {
  position: relative;
  float: left;
  color: #999;
  &.bt {
    padding-left: 20px;
    border-bottom: 1px solid #ccc;
  }
  select {
    margin: 0 2px 0 10px;
    width: 55px;
    height: 24px;
    padding-left: 6px;
    border: 1px solid #dcdcdc;
    border-radius: 2px;
  }
}
</style>

<style lang='scss'>
.TimeSelect {
  .el-date-editor.el-input {
    margin-left: 0;
    width: 94px;
  }
  .el-input__inner {
    color: #000;
    border: 1px solid #dcdcdc;
    background: #fff;
  }
  .el-input--small .el-input__inner {
    height: 24px;
  }
  .el-input__inner {
    border-radius: 4px;
  }
	.el-radio__input.is-checked .el-radio__inner {
		border-color: #f3ac12;
    background: #f3ac12;
	}
}
</style>
