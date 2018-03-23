import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './LivePanel.html?style=./LivePanel.scss'
import { RtmpStreamer } from "./rtmp-streamer.min";
import { LiveList } from "../LiveListInterface";
import { RtmpClient, UserClient, prePlanClient } from "../../../util/clientHelper";
import fetchJsonp from 'fetch-jsonp'
let player,
  streamer
@WithRender
@Component
export default class LivePanel extends Vue {
  @Prop() closeSelf
  @Prop() liveData: LiveList


  player: RtmpStreamer = null
  streamer: RtmpStreamer = null
  displayPublishBtn: boolean = true
  isPublished: boolean = false
  address: string = ''
  liver: string = ''
  isHidingPublishWindow: boolean = true
  prePlan: string = ''

  async mounted() {
    let _this = this
    window['setSWFIsReady'] = function () {
      if (!_this.liveData.state) return
      player = document.getElementById('rtmp-player')
      player.play('rtmp://119.29.102.103:9096/oflaDemo', _this.liveData.url)
      let addressPromise = fetchJsonp(`http://restapi.amap.com/v3/geocode/regeo?key=67fbfcb22d9900a94cc95af73378c865&location=${_this.liveData.lon},${_this.liveData.lat}&extensions=base&batch=false&roadlevel=1`);
      addressPromise
        .then(res => {
          return res.json()
        })
        .then(data => {
          _this.address = ''
          _this.address += data.regeocode.addressComponent.township
          _this.address += data.regeocode.addressComponent.streetNumber.street
        })
    }
    let res = await fetch('http://10.148.83.228:8086/event/deal/find/user/post/,/?id=' + this.liveData.eventId, {
      mode: 'cors',
      cache: 'no-cache'
    })
    let data = await res.json()
    if (data.tagObject)
      this.prePlan = data.tagObject.name
    let req = await UserClient.getUserById(this.liveData.userId)
    if (typeof req === 'string') {
      this.liver = req
    }
  }

  hidePublishWindow() {
    this.isHidingPublishWindow = false
  }

  beforDestroyed() {
    RtmpClient.stopPublish(this.liveData.userId)
  }

  publishStream() {
    if (!this.isPublished) {
      this.isPublished = true
      streamer = new RtmpStreamer(document.getElementById('rtmp-streamer'))
      let publishId = new Date().getTime()
      streamer.publish('rtmp://119.29.102.103:9096/oflaDemo', publishId)
      RtmpClient.publishLive(this.liveData.userId, publishId.toString())
    } else {
      this.isHidingPublishWindow = !this.isHidingPublishWindow
      if (this.isHidingPublishWindow) {
        streamer = new RtmpStreamer(document.getElementById('rtmp-streamer'))
        let publishId = new Date().getTime()
        streamer.publish('rtmp://119.29.102.103:9096/oflaDemo', publishId)
        RtmpClient.publishLive(this.liveData.userId, publishId.toString())
      } 
    }
  }
}