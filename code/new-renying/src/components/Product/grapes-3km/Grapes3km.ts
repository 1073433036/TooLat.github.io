import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './Grapes3km.html?style=./Grapes3km.scss'
import * as CONFIG from '../../../config/productId'
import * as moment from 'moment'
import axios from 'axios'
import jsonp from 'axios-jsonp'
import { Message } from 'element-ui'
import { getVelLevel } from '../../../util/windHelper'

import WindRadarDrawer from '../../../util/windRadarUtil'

let markerCollection = [],
  L = window['L']

@WithRender
@Component
export default class Grapes3km extends Vue {
  @Action('systemStore/toggleProductView_global') toggleProductView_global

  date: any = Date.now()
  productId = CONFIG.grapes3km
  regionData = [
    { value: 'guangdong', name: '广东' },
    { value: 'southchina', name: '华南' }
  ]
  regionSelected: String = 'guangdong'
  elementData = [
    { value: 'mslp', name: '海平面气压' },
    { value: 'temp2m', name: '2米温度' },
    { value: 'rh2m_wind10m', name: '2米相对湿度' },
    { value: 'rain12min', name: '12分钟累计降雨' },
    { value: 'wind10m', name: '10米风' },
    { value: 'rain1h', name: '1小时累积将于' },
    { value: 'cref', name: '组合雷达反射率' },
  ]
  unstableElementData = [
    { value: 'kiki', name: 'k指数' },
    { value: 'sweat', name: 'SWAET-威胁指数' },
    { value: 'tti', name: 'TT指数' },
    { value: 'epi', name: 'EPI对流不稳定指数' },
  ]
  hightSkyElementData = [
    { value: 'wind925hght925', name: '925hPa风+高度' },
    { value: 'wind850hght500', name: '850hPa风+500hPa高度' },
    { value: 'wind700hght700', name: '700hPa形式' },
    { value: 'wind500hght500temp500', name: '500hPa形式' },
    { value: 'wind200stream200hght200', name: '200hPa形式' },
    { value: 'temp850-500', name: '850-500温度' },
    { value: 'temp700-500', name: '700-500温度' },
  ]
  waterElementData = [
    { value: 'rhum500', name: '500hPa相对湿度+风' },
    { value: 'rhum850', name: '850hPa相对湿度+风' },
    { value: 'rhum925', name: '925hPa相对湿度+风' },
    { value: 'vflux850', name: '850水汽通量' },
    { value: 'vflux925', name: '925水汽通量' },
  ]
  elementSelected = 'mslp'
  hourData: string[] = []
  minuteData: string[] = []
  hourSelected: string = ''
  minuteSelected: string = ''
  imgUrl = ''
  reqUrl = 'http://10.148.16.217:11160/renyin5/satelite/img/grapes3km'
  forecastHour = '00'
  forecastHourData = []

  created() {
    this.computeHouAndMinute()
  }

  async draw() {
    let params = {
      product: this.elementSelected,
      time: moment(`${moment(this.date).format('YYYY-MM-DD')} ${this.hourSelected}:${this.minuteSelected}:00`)
        .subtract(8, 'hours').format('YYYY-MM-DD HH:mm:00'),
      forecast: Number(this.forecastHour),
      area: this.regionSelected
    }
    this.imgUrl = this.reqUrl + '?'
    for (let key in params) {
      this.imgUrl += '&' + key + '=' + params[key]
    }
    console.info(this.imgUrl)
  }

  @Watch('date')
  dateChanged(val: any, oldVal: any): void {
    this.computeHouAndMinute()
  }
  @Watch('hourSelected')
  hourSelectedChanged(val: any, oldVal: any): void {
    this.computeHouAndMinute()
  }

  computeHouAndMinute() {
    this.minuteData = []
    this.hourData = []
    if (this.forecastHourData.length === 0)
      for (let i = 0; i <= 24; i++) {
        if (i === 0) {
          this.forecastHourData.push('00')
        } else if (i < 10) {
          this.forecastHourData.push('0' + i)
        } else {
          this.forecastHourData.push(String(i))
        }
      }
    for (let i = 0; i < 60; i += 12) {
      if (i === 0) {
        this.minuteData.push('00')
      } else if (i < 10) {
        this.minuteData.push('0' + i)
      } else {
        this.minuteData.push(String(i))
      }
    }

    let maxHour = 0,
      selectedDate = new Date(this.date).getDate(),
      nowDate = new Date().getDate()
    if (selectedDate < nowDate)
      maxHour = 24
    else if (selectedDate === nowDate)
      maxHour = new Date().getHours()
    else
      maxHour = 0
    for (let i = 0; i < maxHour; i++) {
      if (i === 0) {
        this.hourData.push('00')
      } else if (i < 10) {
        this.hourData.push('0' + i)
      } else {
        this.hourData.push(String(i))
      }
    }
    if (this.hourSelected.length === 0)
      this.hourSelected = this.hourData[this.hourData.length - 1]

    this.minuteSelected = this.minuteData[this.minuteData.length - 1]
  }
}