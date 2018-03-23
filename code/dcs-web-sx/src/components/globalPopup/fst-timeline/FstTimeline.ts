import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './FstTimeline.html?style=./FstTimeline.scss'

@WithRender
@Component
export default class fstTimeline extends Vue {
  @Getter('modelStore/fstTimeList_global') fstTimeList_global
  @Getter('modelStore/seledTime_global') seledTime_global
  @Getter('systemStore/typhTimelineStatus_global') typhTimelineStatus_global
  @Action('modelStore/selectSeledTime_global') selectSeledTime_global

  @Prop({ default: false }) isRainFstTime: boolean
  @Prop({ default: 1 }) rainSeledTimeSelected: number
  @Prop({ default: [] }) rainFstTimeData: number[]
  @Prop({ default: Function }) onRainSeledTimeChange: Function

  get dateString() {
    for (let item of this.listItemForRender) {
      if (item.seledTime === (this.isRainFstTime ? this.rainSeledTimeSelected : this.seledTime_global)) {
        return item.date
      }
    }
  }
  get timeString() {
    for (let item of this.listItemForRender) {
      if (item.seledTime === (this.isRainFstTime ? this.rainSeledTimeSelected : this.seledTime_global)) {
        return item.time
      }
    }
  }
  displaySeledTimeForMouseOver: boolean = false
  dateStringForMouseOver: string = ''
  timeStringForMouseOver: string = ''
  mouseOverIndex: number = 0
  seledTimeSelectedIndex: number = 0
  closeIndicatorDelay: any = null
  listItemForRender: any[] = []

  mounted() {
    if (this.isRainFstTime) {
      this.listItemForRender = this.rainFstTimeData
    } else {
      this.listItemForRender = this.fstTimeList_global
    }
  }

  @Watch('isRainFstTime')
  onisRainFstTimeChanged(val: any, oldVal: any): void {
    if (val)
      this.listItemForRender = this.rainFstTimeData
  }

  @Watch('fstTimeList_global')
  onfstTimeList_globalChanged(val: any, oldVal: any): void {
    if (this.isRainFstTime) return
    this.listItemForRender = this.fstTimeList_global
  }

  indicateOtherTime(index) {
    if (index === this.seledTimeSelectedIndex) return

    clearTimeout(this.closeIndicatorDelay)
    this.dateStringForMouseOver = this.listItemForRender[index].date
    this.mouseOverIndex = index
    this.timeStringForMouseOver = this.listItemForRender[index].time
    this.displaySeledTimeForMouseOver = true
  }

  selectSeledTime(index) {
    this.seledTimeSelectedIndex = index
    if (this.isRainFstTime)
      this.onRainSeledTimeChange(this.listItemForRender[index].seledTime)
    else
      this.selectSeledTime_global(this.listItemForRender[index].seledTime)
  }

  closeIndicator() {
    this.closeIndicatorDelay = setTimeout(() => {
      this.displaySeledTimeForMouseOver = false
    })
  }
}



