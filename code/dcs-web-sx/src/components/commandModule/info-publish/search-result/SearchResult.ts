import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './SearchResult.html?style=./SearchResult.scss'
import { SmsClient } from "../../../../util/clientHelper";

import ManageTable from "../../../commonCompt/manage-table/ManageTable";

@WithRender
@Component({
  components: {
    ManageTable
  }
})
export default class SearchResult extends Vue {
  @Prop() closeFunc
  @Prop({ default: 'name' }) searchTextType
  @Prop() msgDepartmentSelected
  @Prop() msgCategorySelected
  @Prop() searchText


  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global


  displayOprateContainer: boolean = false
  tableHeader: Array<string> = ['姓名', '部门', '分类', '电话号码']
  tableData: Array<object> = []
  tableDataForRender: object[] = []
  intervalHolder: any = null
  tableDataSelectedIndex: Array<number> = []
  searchPageIndex: number = 0
  searchPageSize: number = 15
  displaySendText: boolean = false
  sendTextString: string = ''
  searchTimeout: any = null
  pageSize: number = 10
  pageCount: number = 0
  pageIndex: number = 1
  get isLastPage() {
    if (this.pageIndex * this.pageSize <= this.tableData.length)
      return false
    return true
  }

  created() {
    this.getHisSms()
  }

  @Watch('searchTextType')
  onsearchTextTypeChanged(val: any, oldVal: any): void {
    this.getHisSms()
  }

  @Watch('msgCategorySelected')
  onmsgCategorySelectedChanged(val: any, oldVal: any): void {
    this.getHisSms()
  }

  @Watch('msgDepartmentSelected')
  onmsgDepartmentSelectedChanged(val: any, oldVal: any): void {
    this.getHisSms()
  }

  @Watch('searchText')
  onsearchTextChanged(val: any, oldVal: any): void {
    if (this.searchTimeout)
      clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      this.getHisSms()
      this.searchTimeout = null
    }, 300);
  }

  getHisSms() {
    this.tableData = []
    SmsClient.seatchHistSms(this.searchTextType, this.msgDepartmentSelected, this.msgCategorySelected,
      this.searchText, this.searchPageIndex, this.searchPageSize)
      .then(data => {
        if (!data) return

        data.forEach(el => {
          this.tableData.push({
            department: el.department,
            category: el.category,
            phone: el.phone,
            data: {
              phone: el.phone,
              tag: el.tag,
              name: el.name,
              person: el.name,
              id: el.id,
              selected: false,
              rxtx: el.rxtx,
              datetime: el.datetime,
              content: el.content
            }
          })
        })
        this.getPageData()
      })

  }

  getPageData() {
    if (this.pageIndex * this.pageSize < this.tableData.length) {
      this.tableDataForRender = this.tableData.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
    } else {
      this.tableDataForRender = this.tableData.slice((this.pageIndex - 1) * this.pageSize)
    }
  }

  toggleIndex(action: string) {
    if (action === 'next' && !this.isLastPage) {
      this.pageIndex++
    }
    if (action === 'up' && this.pageIndex !== 1)
      this.pageIndex--

    this.getPageData()
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

  toggleOprateContainer($event: Element, action) {
    if (action) {
      this.displayOprateContainer = true

      let el = document.querySelector('#SearchResult > .oprate-option-wraper')
      console.info(el)
      el.parentNode.removeChild(el)
      document.body.appendChild(el)

    } else {
      this.displayOprateContainer = false
    }
  }
  toggleSendText() {
    if (this.tableDataSelectedIndex.length == 0) {
      this.toggleOprateTip_global({ tip: true, text: '请选择发送对象' })
      return
    }
    this.displaySendText = !this.displaySendText
  }
  async sendTextToPersen() {
    if (!this.sendTextString) {
      this.toggleOprateTip_global({ tip: true, text: '发送内容不得为空' })
      return
    }
    let phoneContacts = []
    for (let index of this.tableDataSelectedIndex) {
      let opt: any = this.tableDataForRender[index]
      phoneContacts.push({ phone: opt.phone, man: opt.data.name, department: opt.department })
    }
    let params = {
      phoneContacts,
      content: this.sendTextString,
      category: '群发消息',
      tag: 'l',
    }
    let res = await SmsClient.sendPhone(params)
    if (res === true) this.toggleOprateTip_global({ tip: true, text: '短信发送成功' })
    else this.toggleOprateTip_global({ tip: true, text: '短信发送失败' })
  }
}



