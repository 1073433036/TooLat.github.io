import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './VideoPopup.html?style=./VideoPopup.scss'
import { videoClient } from '../../../../util/clientHelper'

@WithRender
@Component
export default class VideoPopup extends Vue {
  @Getter('systemStore/getVideoInfo_global') getVideoInfo_global
  @Action('systemStore/toggleVideoMonitorPopup_global') closeSelf
  @Action('systemStore/toggleScreenVideo_global') toggleScreenVideo_global
  @Action('systemStore/changeScreenVideoUrl_global') changeScreenVideoUrl_global

  playerId: string = ''
  url: string = ''
  imageUrl: string = ''

  initVxgPlayer() {
    if (!this.url) {
      this.url = `rtsp://admin:123456ab@10.152.189.243:554/h264/ch${this.getVideoInfo_global.deviceId}/main/av_stream`
      this.createVxgPlayer() 
    } else {
      this.url = `rtsp://admin:123456ab@10.152.189.243:554/h264/ch${this.getVideoInfo_global.deviceId}/main/av_stream`
      window['vxgplayer'](this.playerId).src(this.url)
      window['vxgplayer'](this.playerId).play()
    }
  }

  createVxgPlayer() {
    let vxgplayer = window['vxgplayer']
    let playerId = 'vxg_media_player' + Math.random()
    this.playerId = playerId
    let div = document.createElement('div')
    div.setAttribute("id", playerId)
    div.setAttribute("class", "vxgplayer")
    document.querySelector('#VideoPopup .cont').appendChild(div)
    vxgplayer(playerId, {
      url: '',
      width: 360,
      height: 244,
      nmf_path: 'media_player.nmf',
      nmf_src: 'static/vxg/pnacl/Release/media_player.nmf',
      latency: 300000,
      aspect_ratio_mode: 1,
      autohide: 3,
      controls: true,
      connection_timeout: 5000,
      connection_udp: 0,
      custom_digital_zoom: false
    }).ready(() => {
      vxgplayer(playerId).src(this.url)
      vxgplayer(playerId).play()
    })
  }

  @Watch('getVideoInfo_global')
  ongetVideoInfo_globalChanged(val: any, oldVal: any) {
    if (val.type === 'left')
      this.initVideoUrl()
    else
      this.initVxgPlayer()
  }

  async initVideoUrl() {
    let info = this.getVideoInfo_global
    let data = await videoClient.getVideoUrl(info.videotype, info.deviceId)
    if (data) 
      this.imageUrl = 'http://' + data + '?' + new Date().getTime()
    else
      this.imageUrl = null
  }

  toggleScreen() {
    this.changeScreenVideoUrl_global(this.imageUrl)
    this.toggleScreenVideo_global(true)
  }

  rightClick() {
    window.event.returnValue = false
    return false
  }

  mounted() {
    if (this.getVideoInfo_global.type === 'left')
      this.initVideoUrl()
    else
      this.initVxgPlayer()
  }
}