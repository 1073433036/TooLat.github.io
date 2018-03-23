import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ManageTable.html?style=./ManageTable.scss'

import { SmsClient } from "../../../util/clientHelper";

@WithRender
@Component
export default class ManageTable extends Vue {
  @Prop({ default: Function })
  selectionChange: Function
  @Prop({ default: 20 })
  paddingWidth: number
  @Prop({ default: Array })
  tableData: Array<Object>
  @Prop({ default: Array })
  tableHeader: Array<string>
  @Prop({ default: Function })
  selectTableRow: Function
  @Prop({ default: String })
  textCategory: string


  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global


  eleWidth: number = 0
  displayOprateContainer: boolean = false
  tableDataClickedIndex: number = null
  displayHistText: boolean = false
  displaySendText: boolean = false
  histTextPageSize: number = 10
  histTextPageIndex: number = 0
  histTextData: Array<object> = []
  histTextOrder: 'asc' | 'esc' = 'esc'
  sendTextString: string = ''
  isTheLastHistPage: boolean = false
  filterType: 'both' | 'send' | 'receive' = 'both'
  tableHeaderForRender: Array<string> = []


  mounted() {
    this.eleWidth = this.$el.parentElement.clientWidth
    this.tableHeaderForRender = this.tableHeader.concat([])
    this.tableHeaderForRender.splice(0, 1)
  }
  beforeDestroy() {
    let el: any = this.$el.querySelector('.oprate-option-wraper')
    if (!el) {
      el = document.querySelector('body > .oprate-option-wraper')
      document.body.removeChild(el)
      el.parentNode.appendChild(el)
    }
    this.displayOprateContainer = false
  }


  @Watch('displayHistText')
  async ondisplayHistTextChanged(val: any, oldVal: any) {
    if (!val) return
    this.getPersonHistText()
    this.histTextPageIndex = 0
  }

  @Watch('histTextOrder')
  onhistTextOrderChanged(val: any, oldVal: any): void {
    this.histTextData.reverse()
  }


  changeHistTextPage(type: 'pre' | 'next') {
    if (type === "pre" && this.histTextPageIndex !== 0) {
      this.histTextPageIndex--
      this.getPersonHistText()
      this.isTheLastHistPage = false
    } else if (type === 'next') {
      this.histTextPageIndex++
      this.getPersonHistText()
        .then(result => {
          if (!result) {
            this.toggleOprateTip_global({ tip: true, text: '已经是最后一页了' })
            this.isTheLastHistPage = true
            this.histTextPageIndex--
          }
        })
    }
  }
  changeFilterType(target: 'receive' | 'both' | 'send') {
    this.filterType = target
  }

  toggleHistText() {
    this.displayHistText = !this.displayHistText
  }

  toggleHistTextOrder(action) {
    if (this.histTextOrder === 'esc')
      this.histTextOrder = 'asc'
    else
      this.histTextOrder = 'esc'
  }

  toggleSendText() {
    this.displaySendText = !this.displaySendText
  }
  async getPersonHistText() {
    let histText = await SmsClient.getPersonHistText(this.tableData[this.tableDataClickedIndex]['data']['phone'],
      this.histTextPageIndex, this.histTextPageSize)

    if (histText.length === 0) return false

    this.histTextData = []
    histText.forEach(el => {
      this.histTextData.push({
        text: el.content,
        datetime: el.datetime.substr(0, 16),
        type: el.rxtx
      })
    })

    if (this.histTextOrder === 'asc')
      this.histTextData.reverse()

    return true
  }
  async sendTextToPersen() {
    console.info('sending text')
    let phoneId = [this.tableData[this.tableDataClickedIndex]['data']['phone']]
    let res = await SmsClient.sendTextToPeople(phoneId, this.sendTextString, this.textCategory)
    this.displaySendText = false

    if (res)
      this.toggleOprateTip_global({ tip: true, text: '发送成功' })
    else
      this.toggleOprateTip_global({ tip: true, text: '发送失败' })
  }

  toggleOprateContainer($event: MouseEvent, index: number) {
    if (!this.displayOprateContainer || this.tableDataClickedIndex !== index && index) {
      this.displayOprateContainer = true
      this.tableDataClickedIndex = index

      let el: any = this.$el.querySelector('.oprate-option-wraper')
      if (!el)
        el = document.querySelector('body > .oprate-option-wraper')
      el.style.top = $event.clientY + 20 + 'px'
      el.style.left = $event.clientX - 45 + 'px'
      el.parentNode.removeChild(el)
      document.body.appendChild(el)
    } else {
      this.displayOprateContainer = false
      let el = document.querySelector('body > .oprate-option-wraper')
      document.body.removeChild(el)
      this.$el.appendChild(el)
    }
  }


}



