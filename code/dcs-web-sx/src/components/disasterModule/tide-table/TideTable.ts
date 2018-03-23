import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './TideTable.html?style=./TideTable.scss'
import moment from 'moment'
import Flatpickr from "flatpickr"
// import 'flatpickr/dist/themes/material_blue.css'
import ZH from 'flatpickr/dist/l10n/zh.js'

@WithRender
@Component
export default class TideTable extends Vue {
  @Action('systemStore/toggleTideTable_global') toggleTideTable_global
  
  datetPicker: any = null
  option: '湛江' | '下泊' = '湛江'
  date: string = ''

  selectOption(key) {
    if(this.option !== key)
      this.option = key
  }

  openCalendar() {
    this.datetPicker.open()
  }

  changeDate(type) {
    if(type === 'prev')
      this.date = moment(this.date).subtract('days', 1).format('YYYY-MM-DD')
    else if(type === 'next')
      this.date = moment(this.date).add('days', 1).format('YYYY-MM-DD')
  }

  mounted() {
    this.date = moment().format('YYYY-MM-DD')
    let _this = this
    this.datetPicker = new Flatpickr(document.querySelector('#tideDate'), {
      locale: ZH.zh,
      onChange(date) {
        _this.date = moment(new Date(date)).format('YYYY-MM-DD')
      }
    })
  }
}