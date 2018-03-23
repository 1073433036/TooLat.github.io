import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './PhoneLive.html?style=./PhoneLive.scss'
import { RtmpClient } from "../../../util/clientHelper";
import { Helper } from "../../../util/Helper";
import coordinateTransform from "../../../util/coordinateTransform";
import { LiveList } from "../LiveListInterface";

import LivePanel from '../live-panel/LivePanel'

let liveEntity: any[] = []

@WithRender
@Component({
  components: {
    LivePanel
  }
})
export default class PhoneLive extends Vue {
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Getter('systemStore/isPhoneMonitorOn_global') isPhoneMonitorOn_global


  liveList: Array<LiveList> = []
  requestInterval: any = null
  eventHandler: any = null
  dataForLive: LiveList = null
  livePanelView: any = null


  // @Watch('isPhoneMonitorOn_global')
  // onisPhoneMonitorOn_globalChanged(val: any, oldVal: any): void {
  mounted() {
    this.getLiveList()
      .then(() => {
        if (this.liveList.length === 0)
          this.toggleOprateTip_global({ tip: true, text: '当前没有直播' })
      })
    this.requestInterval = setInterval(() => {
      this.getLiveList()
    }, 10000)
  }

  destroyed() {
    clearInterval(this.requestInterval)
    this.$nextTick(() => {
      let helper = new Helper()
      console.info(liveEntity)
      for (let i in liveEntity) {
        helper.removeEntity(liveEntity[i])
      }
      liveEntity = []
      helper.removeHandler(this.eventHandler)
      helper = null
    })
    // }
  }
  // }


  closeLivePanel() {
    this.livePanelView = null
  }

  async getLiveList() {
    let data = await RtmpClient.getPhonePublishList()
    this.liveList = []
    if (data)
      this.liveList = data
    let helper = new Helper()

    for (let i in liveEntity) {
      helper.removeEntity(liveEntity[i])
    }
    liveEntity = []

    this.liveList.forEach((el, index) => {
      console.info('live', el)
      if (el.state != 1) return
      liveEntity.push(helper.addBillboard([el.lon, el.lat], '../../../../../static/img/phone_live.png', 'bottom'))
    })
    helper.removeHandler(this.eventHandler)
    this.eventHandler = helper.getNewHandler()

    helper.setAction('click', this.eventHandler, liveEntity, (entity, index) => {
      this.dataForLive = this.liveList[index]
      this.livePanelView = LivePanel
    })
  }


}





