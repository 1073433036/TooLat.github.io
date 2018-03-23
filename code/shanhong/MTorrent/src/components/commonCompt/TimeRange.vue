<template>
  <main class="TimeRange">
    <el-date-picker v-model="startDate" size="small" :editable="false" :clearable="false" type="date"></el-date-picker>
    <span>日</span>
    <select v-model="startHour">
      <option :value="0">00</option>
      <option v-for="i in 23" :key="i" :value="i">{{ i >= 10 ? i : '0' + i }}</option>
    </select>
    <span>时</span>
    <template v-if="rangeType === 'minute'">
      <select v-model="startMinute">
        <option :value="0">00</option>
        <option v-for="i in (60/minuteInt-1)" :key="i" :value="i*minuteInt">{{ i*minuteInt >= 10 ? i*minuteInt : '0' + i*minuteInt }}</option>
      </select>
      <span>分</span>
    </template>
    <span style="margin: 0 15px;">---</span>
    <el-date-picker v-model="endDate" size="small" :editable="false" :clearable="false" type="date"></el-date-picker>
    <span>日</span>
    <select v-model="endHour">
      <option :value="0">00</option>
      <option v-for="i in 23" :key="i" :value="i">{{ i >= 10 ? i : '0' + i }}</option>
    </select>
    <span>时</span>
    <template v-if="rangeType === 'minute'">
      <select v-model="endMinute">
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
  export default class TimeRange extends Vue {
    @Prop({ default: Function }) timeChanged
    @Prop({ default: 'minute' }) rangeType: 'hour' | 'minute'
    @Prop({ default: 5 }) minuteInt: number
    @Prop({ default: moment() }) startTime
    @Prop({ default: moment() }) endTime
    @Prop({ default: 1 }) maxInterval: number
    @Prop({ default: 'minute' }) maxIntervalUnit: 'hour' | 'minute'
    hasInitTime: boolean = false
    startDate: Date = new Date()
    startHour: number = new Date().getHours()
		startMinute: number = 0
		endDate: Date = new Date()
    endHour: number = new Date().getHours()
    endMinute: number = 0

    mounted() {
      this.hasInitTime = false
      let startTime = new Date(this.startTime)
			this.startDate = startTime
			this.startHour = startTime.getHours()
			this.startMinute = startTime.getMinutes()
			let endTime = new Date(this.endTime)
			this.endDate = endTime
			this.endHour = endTime.getHours()
			this.endMinute = endTime.getMinutes()
      setTimeout(() => this.hasInitTime = true, 0)
    }

    getDate(type: 'start' | 'end') {
			let date, hour, minute
			if (type === 'start') {
				date = this.startDate
				hour = this.startHour
				minute = this.startMinute
			} else if (type === 'end') {
				date = this.endDate
				hour = this.endHour
				minute = this.endMinute
			}
			hour = hour >= 10 ?  hour : '0' + hour
			minute = minute >= 10 ?  minute : '0' + minute
			return moment(date).format('YYYY/MM/DD') + ' ' + hour + ':' + minute + ':00'
    }

    timeChangedFn() {
      if (!this.hasInitTime) return
      let startDateString = this.getDate('start'),
          endDateString = this.getDate('end')
      let startTime = new Date(startDateString).getTime(),
          endTime = new Date(endDateString).getTime()
      let maxMilliseconds =  this.maxIntervalUnit === 'hour' ? this.maxInterval*60*60*1000 : this.maxInterval*60*1000
      if (startTime > endTime) {
				Vue['prototype']['$message']({
					type: 'warning',
					message: '起始时间不得晚于终止时间'
				})
			} else if (startTime < endTime - maxMilliseconds) {
        let unitString = this.maxIntervalUnit === 'hour' ? '小时' : '分钟'
				Vue['prototype']['$message']({
					type: 'warning',
					message: `起始时间与终止时间的间隔不得大于${this.maxInterval}${unitString}`
				})
			} else {
				this.timeChanged(startTime, endTime)
			}
    }

    @Watch('startDate')
		onstartDateChanged (val: any, oldVal: any) {
      this.timeChangedFn()
		}
		@Watch('startHour')
		onstartHourChanged (val: number, oldVal: number) {
			this.timeChangedFn()
		}
		@Watch('startMinute')
		onstartMinuteChanged (val: number, oldVal: number) {
			this.timeChangedFn()
		}
		@Watch('endDate')
		onendDateChanged (val: any, oldVal: any) {
			this.timeChangedFn()
		}
		@Watch('endHour')
		onendHourChanged (val: number, oldVal: number) {
			this.timeChangedFn()
		}
		@Watch('endMinute')
		onendMinuteChanged (val: number, oldVal: number) {
			this.timeChangedFn()
		}
  }
</script>

<style lang='scss' scoped>
.TimeRange {
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
.TimeRange {
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
