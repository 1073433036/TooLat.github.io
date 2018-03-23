import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './WaterInfoPopup.html?style=./WaterInfoPopup.scss'

import { SmsClient } from '../../../../util/clientHelper'

@WithRender
@Component
export default class WaterInfoPopup extends Vue {
  @Prop() closeFn
  @Prop() warningDataFormat
  @Prop() selectedKey
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global

  info: string = ''

  async send() {
    let phoneContacts = []
    for (let key of this.selectedKey) {
      let opt = this.warningDataFormat['' + key]
      if (!opt.cellphone) continue
      phoneContacts.push({ phone: opt.cellphone, man: opt.manager, department: '水文' })
    }
    let params = {
      phoneContacts,
      content: this.info,
      category: '水位报警',
      tag: 'l',
    }
    console.log(params)
    // let res = await SmsClient.sendPhone(params)
    // if (res === true) this.toggleOprateTip_global({ tip: true, text: '短信发送成功' })
    // else this.toggleOprateTip_global({ tip: true, text: '短信发送失败' })
  }
}