import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ShipStats.html?style=./ShipStats.scss'
import moment from 'moment'

import ManageTable from '../../../commonCompt/manage-table/ManageTable'
import { SmsClient, FisherClient } from "../../../../util/clientHelper";

@WithRender
@Component({
  components: {
    ManageTable
  }
})
export default class ShipStats extends Vue {
  @Prop({ default: Function })
  closeSelf: Function
  @Prop({ default: Number })
  unfinishId: string
  @Prop({ default: Function })
  finishPublishSuceess: Function


  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global


  tableHeader: Array<string> = ['镇', '状态', '响应时间']
  tableData: Array<object> = []
  intervalHolder: any = null
  tableDataSelectedIndex: Array<number> = []
  sendTextString: string = ''
  displaySendText: boolean = false


  async created() {
    this.getTownStateData()
    this.intervalHolder = setInterval(() => {
      this.getTownStateData()
    }, 10000)
  }
  destroyed() {
    clearInterval(this.intervalHolder)
  }


  toggleSendText() {
    if(this.tableDataSelectedIndex.length == 0) {
      this.toggleOprateTip_global({tip: true, text: '请选择镇'})
      return
    }
    this.displaySendText = !this.displaySendText
  }

  async sendTextToPersen() {
    console.info('sending text')
    let phoneList = []
    this.tableDataSelectedIndex.forEach((el, index) => {
      phoneList.push(this.tableData[index]['data']['phone'])
    })
    let res = await SmsClient.sendTextToPeople(phoneList, this.sendTextString, '渔船管理')
    this.displaySendText = false

    if (res)
      this.toggleOprateTip_global({ tip: true, text: '发送成功' })
    else
      this.toggleOprateTip_global({ tip: true, text: '发送失败' })
  }

  async finishPublish() {
    let isFinishSuccess = await FisherClient.finishPublish(this.unfinishId)
    if (isFinishSuccess === null) {
      this.toggleOprateTip_global({ tip: true, text: '结束流程成功' })
      this.finishPublishSuceess()
    }
    else
      this.toggleOprateTip_global({ tip: true, text: '结束流程失败' })
  }

  selectTableRow(index: number | string) {
    if (index === 'all') {
      this.tableData.forEach(el => {
        el['data']['selected'] = true
      })
    } else {
      this.tableData[index]['data']['selected'] = !this.tableData[index]['data']['selected']
    }

    this.tableDataSelectedIndex = []
    this.tableData.forEach((el, index) => {
      if (el['data']['selected'])
        this.tableDataSelectedIndex.push(index)
    })
  }

  async getTownStateData() {
    let townStateData = await FisherClient.getFisherTownState(this.unfinishId)
    if (!townStateData) return
    this.tableData = []
    townStateData.forEach(el => {
      this.tableData.push({
        state: el.state === 1 ? `已响应` : `未响应`,
        responseTime: el.responetime === null ? '' : moment(el.responetime).format('YYYY-MM-DD HH:mm'),
        data: {
          name: el.town,
          phone: el.phone,
          selected: false,
          person: el.man
        },
      })
    })
  }
}



