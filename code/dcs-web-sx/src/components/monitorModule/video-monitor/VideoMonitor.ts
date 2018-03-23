import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './VideoMonitor.html?style=./VideoMonitor.scss'
import { videoClient } from '../../../util/clientHelper'
import { Helper } from '../../../util/Helper'

let billboardCollection = null

@WithRender
@Component
export default class VideoMonitor extends Vue {
  @Getter('systemStore/isVideoMonitorPopupOn_global') isVideoMonitorPopupOn_global
  @Action('systemStore/toggleVideoMonitorPopup_global') toggleVideoMonitorPopup_global
  @Action('systemStore/toggleVideoAddressPopup_global') toggleVideoAddressPopup_global
  @Action('systemStore/changeVideoInfo_global') changeVideoInfo_global
  @Action('systemStore/changeVideoAddress_global') changeVideoAddress_global

  optionSelected: any = {
    traffic: false,
    reservoir: false,
    person: false,
  }

  displayVideo: boolean = false
  videoInfo: any = {}
  mouseoverHandler: any = null
  leftClickHandler: any = null
  rightClickHandler: any = null
  clickPrimitive: any = null
  clickVideoId: string = null

  selectOption(key) {
    this.optionSelected[key] = !this.optionSelected[key]

    if(key === 'traffic') {
      this.displayVideo = !this.displayVideo
      if(this.displayVideo)
        this.showVideo()
      else
        this.hideVideo()
    }
  }

  async showVideo() {
    let data: any = await videoClient.getAllVideo()
    if(!data) return
    let helper = new Helper()
    billboardCollection = helper.billboardCollection()
    let imgUrl = 'static/img/video.png'
    let infoObj = {}
    for(let video of data) {
      if (!video.state) continue
      let billboard = helper.billboard([video.lon, video.lat], imgUrl, `video_${video.id}`)
      billboardCollection.add(billboard)
      infoObj[video.id] = video
    }
    this.videoInfo = { ...infoObj }
    helper.addCollection(billboardCollection)

    this.mouseoverHandler = helper.getNewHandler()
    helper.setAction('mouseOver', this.mouseoverHandler, null, (entity, index, movement, info) => {
      let pickedObj = window['viewer'].scene.pick(movement.endPosition)
      if(window['Zearth'].defined(pickedObj) && typeof pickedObj.id === 'string' && pickedObj.id.indexOf('video') === 0) {
        let id = pickedObj.id.split('_')[1]
        if(id === this.clickVideoId) {
          this.toggleVideoAddressPopup_global(false)
          return
        }
        let obj = {
          address: this.videoInfo[id].address,
          x: movement.endPosition.x,
          y: movement.endPosition.y,
        }
        this.changeVideoAddress_global(obj)
        this.toggleVideoAddressPopup_global(true)
      } else {
        this.toggleVideoAddressPopup_global(false)
      }
    })

    this.leftClickHandler = helper.getNewHandler()
    helper.setAction('leftClick', this.leftClickHandler, null, (entity, index, movement, info) => {
      this.clickEvent(entity, index, movement, info, 'left')
    })

    this.rightClickHandler = helper.getNewHandler()
    helper.setAction('rightClick', this.rightClickHandler, null, (entity, index, movement, info) => {
      this.clickEvent(entity, index, movement, info, 'right')
    })

    helper = null
  }

  clickEvent(entity, index, movement, info, type) {
    let pickedObj = window['viewer'].scene.pick(movement.position);
    if(window['Zearth'].defined(pickedObj) && typeof pickedObj.id === 'string' && pickedObj.id.indexOf('video') === 0) {
      let p = pickedObj.primitive;
      if(p && p.image) {
        if(this.clickPrimitive && this.clickPrimitive.image) {
          this.clickPrimitive.image = this.clickPrimitive.image.replace('_pre.png', '.png')
        }
        this.clickPrimitive = p
        this.clickPrimitive.image = p.image.replace('.png', '_pre.png')
      }
      
      let id = pickedObj.id.split('_')[1]
      this.clickVideoId = id
      let info = this.videoInfo[id]
      let top = movement.position.y > 295 ? movement.position.y - 295 : 0
      let left = movement.position.x > 190 ? movement.position.x - 190 : 0
      this.changeVideoInfo_global(Object.assign({
        type,
        x: left,
        y: top,
      }, info))
      this.toggleVideoAddressPopup_global(false)
      this.toggleVideoMonitorPopup_global(true)
    }
  }

  removeCollection() {
    let helper = new Helper()
    helper.removeCollection(billboardCollection)
    helper = null
    this.videoInfo = {}
    billboardCollection = null
  }

  removeEvent() {
    let helper = new Helper()
    if(this.mouseoverHandler) {
      helper.removeAction(this.mouseoverHandler, 'mouseOver')
      this.mouseoverHandler = null      
    }
    if(this.leftClickHandler) {
      helper.removeAction(this.leftClickHandler, 'leftClick')
      this.leftClickHandler = null
    }
    if(this.rightClickHandler) {
      helper.removeAction(this.rightClickHandler, 'rightClick')
      this.rightClickHandler = null
    }
    helper = null
  }

  hideVideo() {
    this.removeCollection()
    this.removeEvent()
    this.toggleVideoMonitorPopup_global(false)
    this.toggleVideoAddressPopup_global(false)
  }

  @Watch('isVideoMonitorPopupOn_global')
  onisVideoMonitorPopupOn_globalChanged(val: any, oldVal: any): void {
    if(!val && this.clickPrimitive && this.clickPrimitive.image) {
      this.clickPrimitive.image = this.clickPrimitive.image.replace('_pre.png', '.png')
      this.clickPrimitive = null
    }
  }

  mounted() {
    this.selectOption('traffic')
  }

  beforeDestroy() {
    this.hideVideo()
  }
}