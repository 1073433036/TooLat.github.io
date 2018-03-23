import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './PublishPopup.html?style=./PublishPopup.scss'
import { prePlanClient } from '../../../../util/clientHelper'

@WithRender
@Component
export default class PublishPopup extends Vue {
  @Prop() closeFunc
  @Prop() planInfo
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global

  organizations: any[] = []
  orgIds: number[] = []
  content: string = null

  // 获取所有成员单位
  async getAllOrganizations() {
    let data = await prePlanClient.getAllOrganizations()
    if (data)
      this.organizations = data
  }

  toggleOrg(key) {
    let index = this.orgIds.indexOf(key)
    if (index === -1)
      this.orgIds.push(key)
    else
      this.orgIds.splice(index, 1)
  }

  async addPublish() {
    if (!this.content) {
      this.toggleOprateTip_global({ tip: true, text: '消息内容不得为空!' })
      return
    }
    let params = {
      planId: this.planInfo.id,
      orgIds: this.orgIds,
      content: this.content,
    }
    let res = await prePlanClient.addPublish(params)
    if (res)
      this.toggleOprateTip_global({ tip: true, text: '追加发布成功!' })
    else
      this.toggleOprateTip_global({ tip: true, text: res })
  }

  mounted () {
    this.getAllOrganizations()
  }
}