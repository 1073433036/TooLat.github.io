import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './GlobalDatetime.html?style=./GlobalDatetime.scss'
import Flatpickr from "flatpickr";
import ZH from 'flatpickr/dist/l10n/zh.js'
import moment from 'moment'



@WithRender
@Component
export default class GlobalDatetime extends Vue {
  @Getter('systemStore/datetime_global') datetime_global
  @Getter('systemStore/blurControl_global') blurControl_global
  @Getter('systemStore/typhTimelineStatus_global') typhTimelineStatus_global
  @Action('systemStore/changeDatetime_global') changeDatetime_global


  datetPicker: any = null
  isdatetPickerOn: boolean = false
  isHourPickerOn: boolean = false
  isMinutePickerOn: boolean = false
  datetimeObj: Date = new Date()
  yearStr: string = ''
  monthStr: string = ''
  hourStr: string = ''
  dayStr: string = ''
  minuteStr: string = ''

  get hoursStr() {
    let arr = []
    for(let i = 0; i < 24; i++) {
      let text = i < 10 ? '0' + i : '' + i
      arr.push(text)
    }
    return arr
  }

  get minutesStr() {
    let arr = []
    for(let i = 0; i < 60; i++) {
      let text = i < 10 ? '0' + i : '' + i
      arr.push(text)
    }
    return arr
  }


  mounted() {
    this.setDatetimeString()

    const changeDateObj = this.changeDateObj
    this.datetPicker = new Flatpickr(document.querySelector('#datePicker'), {
      locale: ZH.zh,
      enableTime: true,
      onChange(date) {
        changeDateObj(date)
      }
    })

    let interval = setInterval(() => { this.datetimeObj = new Date() } , 5*60*1000)
  }


  @Watch('blurControl_global')
  onblurControl_globalChanged(val: any, oldVal: any): void {
    this.datetPicker.close()
    this.isdatetPickerOn = false
    this.isHourPickerOn = false
    this.isMinutePickerOn = false
  }

  @Watch('datetimeObj')
  ondatetimeObjChanged(val: Date, oldVal: Date): void {
    this.setDatetimeString()
    this.changeDatetime_global(this.datetimeObj)
  }

  openCalendar() {
    if(this.isdatetPickerOn)
      this.datetPicker.close()
    else
      this.datetPicker.open()
    this.isdatetPickerOn = !this.isdatetPickerOn
    this.isHourPickerOn = false
    this.isMinutePickerOn = false
  }

  changeDateObj(date) {
    let tempDate = new Date(date)
    this.datetimeObj = new Date(`${moment(tempDate).format('YYYY-MM-DD HH:mm')}`)
  }

  setDatetimeString() {
    let mmt = moment(this.datetimeObj)
    this.yearStr = mmt.format('YYYY')
    this.dayStr = mmt.format('DD')
    this.monthStr = mmt.format('M')
    this.minuteStr = mmt.format('mm')
    this.hourStr = mmt.format('HH')
  }

  changeDatetime(action, target) {
    let mmt = moment(this.datetimeObj)
    if (action === 'next')
      this.datetimeObj = new Date(mmt.add(1, target).format('YYYY-MM-DD HH:mm'))
    if (action === 'pre')
      this.datetimeObj = new Date(mmt.subtract(1, target).format('YYYY-MM-DD HH:mm'))
  }

  displayHourPopup() {
    this.isHourPickerOn = !this.isHourPickerOn
    this.isMinutePickerOn = false
    this.isdatetPickerOn = false
    this.$nextTick(() => { document.querySelector('#GlobalDatetime .hour-wrapper').scrollTop = (Number(this.hourStr) - 1) * 16 })
  }

  displayMinPopup() {
    this.isMinutePickerOn = !this.isMinutePickerOn
    this.isHourPickerOn = false
    this.isdatetPickerOn = false
    this.$nextTick(() => { document.querySelector('#GlobalDatetime .min-wrapper').scrollTop = (Number(this.minuteStr) - 1) * 16 })
  }

  pickHour(hour) {
    let time = new Date(`${this.yearStr}-${this.monthStr}-${this.dayStr} ${hour}:${this.minuteStr}:00`)
    this.datetimeObj = time
    this.isHourPickerOn = false
  }

  pickMin(min) {
    let time = new Date(`${this.yearStr}-${this.monthStr}-${this.dayStr} ${this.hourStr}:${min}:00`)
    this.datetimeObj = time
    this.isMinutePickerOn = false
  }
}