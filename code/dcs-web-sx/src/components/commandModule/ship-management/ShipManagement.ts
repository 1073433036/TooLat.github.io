import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ShipManagement.html?style=./ShipManagement.scss'
import { FisherClient } from "../../../util/clientHelper";

import PublishText from "./publish-text/PublishText";
import ShipStats from './ship-stats/ShipStats'
import AisMonitor from './ais-monitor/AisMonitor'

@WithRender
@Component
export default class ShipManagement extends Vue {
  manageOptionSelected: string = ''
  popupView: any = null
  haveUnfinishPublish: boolean = false
  unfinishId: string = ''


  async created() {
    await this.getUnfinishedData()
    this.selectManageOption('AIS')
  }


  @Watch('manageOptionSelected')
  async onmanageOptionSelectedChanged(val: any, oldVal: any) {
    if (val === 'manage' && oldVal !== 'manage') {
      await this.getUnfinishedData()
      if (this.haveUnfinishPublish)
        this.popupView = ShipStats
      else
        this.popupView = PublishText
    } else if (val === 'AIS' && oldVal !== 'AIS') {
      this.popupView = AisMonitor
    } else {
      this.popupView = null
    }
  }

  async  getUnfinishedData() {
    let haveUnFinishCall = await FisherClient.getUnFinish()
    if (haveUnFinishCall) {
      this.haveUnfinishPublish = true
      this.unfinishId = haveUnFinishCall[0].id
    } else {
      this.haveUnfinishPublish = false
    }

  }

  selectManageOption(type: string) {
    if (this.manageOptionSelected === type)
      this.manageOptionSelected = ''
    else
      this.manageOptionSelected = type
  }

  closePopup() {
    this.popupView = null
    this.manageOptionSelected = null
  }

  async publishSuccess() {
    let publishId = await FisherClient.getUnFinish()
    if (publishId)
      this.unfinishId = publishId[0].id
    this.popupView = ShipStats
  }

  async finishPublishSuceess() {
    this.popupView = null
    this.manageOptionSelected = null
    let res = await FisherClient.getUnFinish()
    this.haveUnfinishPublish = false
    this.unfinishId = ''
  }


}



