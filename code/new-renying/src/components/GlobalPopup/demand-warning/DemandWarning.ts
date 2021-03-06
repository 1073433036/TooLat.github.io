import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './DemandWarning.html?style=./DemandWarning.scss'

import * as moment from 'moment'
import axios from 'axios'
import jsonp from 'axios-jsonp'

@WithRender
@Component
export default class DemandWarning extends Vue {

  displayPopup: boolean = false
  panelNum: number = 0
  tempData = []
  forestData = []
  reservoirData = []
  dryData = []
  warnItem = []
  reqUrl: string[] = [
    'http://10.148.16.217:9020/productry/dao/ghjcData',
    'http://10.148.16.217:11160/renyin5/waterline/reservoir',
    'http://10.148.16.217:11160/renyin5/warn/tf',
    'http://10.148.16.217:11160/renyin5/warn/tf'
  ]
  typeArray: string[] = [
    '',
    '',
    'temp',
    'forest'
  ]

  created() {
    this.getTempAndForest()
    this.getReservoirData()
  }

  mouseOver(num: number) {
    this.displayPopup = true
    this.panelNum = num
    this.warnItem = []
    if (num == 1) {
      for (let item of this.dryData) {
        this.warnItem.push(`城市:${item.name} 等级:${this.getDryLevelText(item.dj)}`)
      }
    } else if (num === 2)
      for (let item of this.tempData) {
        this.warnItem.push(`城市:${item.city} 等级:${item.tempLev}`)
      }
    else if (num === 3)
      for (let item of this.forestData) {
        this.warnItem.push(`城市:${item.city} 等级:${item.tempLev}`)
      }
    else
      for (let item of this.reservoirData) {
        this.warnItem.push(`站点名:${item.stationname} 水位:${item.waterlev}`)
      }
  }

  async getReservoirData() {
    let date = moment('2017-08-13 01:03:00').format('YYYY-MM-DD HH:mm:00')
    let params = {
      time: date,
      addrType: 'province',
      name: '广东'
    }
    let res = await axios({
      adapter: jsonp,
      url: this.reqUrl[1],
      params
    })
    this.reservoirData = []
    if (res.data.stateCode != -99)
      for (let item of res.data.data) {
        if (item.waterlev < (item.alertLev * (3 / 4))) {
          this.reservoirData.push(item)
        }
      }
  }

  async getTempAndForest() {
    let date = moment('2017-08-13 01:03:00').format('YYYY-MM-DD HH:mm:00')
    let reqArr = []
    for (let i = 2; i < 4; i++) {
      reqArr.push(
        axios({
          url: this.reqUrl[i],
          params: {
            time: date,
            warnType: this.typeArray[i],
            addrType: 'province',
            name: '广东'
          },
          adapter: jsonp
        })
      )
    }

    let res = await Promise.all(reqArr)
    this.tempData = res[0].data.data
    this.forestData = res[1].data.data
    this.$forceUpdate()
  }

  async getDryData() {
    let params = {
      dateStart: moment().format('YYYY-MM-DD HH:mm:00')
    }
    let res = await axios({
      adapter: jsonp,
      params
    })

    this.dryData = []
    if (res.data.status) {
      for (let item of res.data.list) {
        if (item.dj >= 2) {
          this.dryData.push(item)
        }
      }
      this.dryData = res.data.list
    }
  }
  getDryLevelText(val) {
    switch (val) {
      case 1: return '轻旱'
      case 2: return '中旱'
      case 3: return '重旱'
      case 4: return '特旱'
      default: return '正常'
    }
  }
}



