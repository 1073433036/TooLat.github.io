import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './EmergencyMonitor.html?style=./EmergencyMonitor.scss'
import { EmergResponse } from '../../util/emergHelper';
import moment from 'moment'
import { SmsClient, UserClient } from '../../util/clientHelper'
import fetchJsonp from 'fetch-jsonp'
import { Helper } from '../../util/Helper'
import { suixiDef } from '../../config/suixi'

let areaCircle = [], boundLayer = null
let ws = null, webs = null

@WithRender
@Component
export default class EmergencyMonitor extends Vue {
  @Getter('systemStore/datetime_global') datetime_global
  @Getter('systemStore/region_global') region_global
  @Getter('systemStore/typhTimelineStatus_global') typhTimelineStatus_global
  @Getter('emergencyStore/emergencyPlan_global') emergencyPlan_global
  @Getter('emergencyStore/refreshPlan_global') refreshPlan
  @Action('emergencyStore/toggleEmergencyPlan_global') toggleEmergencyPlan_global
  @Action('emergencyStore/toggleWaterLevelTablePopup_global') toggleWaterLevelTablePopup_global
  @Action('systemStore/selectTyph_global') selectTyph_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Getter('systemStore/isShowCurrentTy_global') isShowCurrentTy_global
  @Action('systemStore/toggleShowCurrentTy_global') toggleShowCurrentTy_global
  @Action('systemStore/toggleTyphTimelineStatus_global') toggleTyphTimelineStatus_global
  @Action('systemStore/toggleClickedTy_global') toggleClickedTy_global
  @Action('systemStore/toggleisNeedMountedTy_global') toggleisNeedMountedTy_global

  haveTyphWaning: boolean = false
  isOptionPanelShow: boolean = false
  displayEmergencyDetailPopup: boolean = false
  displayExplainPopup: boolean = false
  accountApplyData: any[] = []
  explainPopupTop: number = 0
  explainPopupLeft: number = 0
  intervalHolder: any = 0
  rainColor: string = ''
  rainText: string = ''
  rainLevel: string = ''
  waterColor: string = ''
  waterText: string = ''
  waterLevel: string = ''
  tipText: string = ''
  isWarning: boolean = false
  isEmergencyWarning: boolean = false
  reqInterval: any = null
  top: string = '0px'
  isPhoneStreaming: boolean = false
  displayPhoneStreamingPopup: boolean = false
  phoneStreamingData: Array<any> = []
  havePhoneStreamingSource: boolean = false
  phoneStreamingColumn: string[] = ['请求者', '请求时间', '操作']
  firstGetStreamingData: boolean = true
  displayAccountApplyPopup: boolean = false
  haveEmergencyPlan: boolean = false
  planInterval: any = null
  messagePopup: boolean = false
  messageHistPopup: boolean = false
  haveNewMessage: boolean = false
  haveStreamAccountApply: boolean = false
  smsPersonPhone: any[] = []
  currentPhone: string = null
  smsHistoryRecord: any[] = []
  thead: any = {
    man: '姓名',
    department: '部门',
    phone: '号码',
  }
  smsPageIndex: number = 0
  steamInterval: any = null
  typhText: string = ''
  typhId = null
  typhColor: string = ''

  // 雷达预警
  cappiColor: '#d6dce5' | '#f4434b' = '#d6dce5'
  cappiInterval: any = null
  cappiArea: any[] = []
  isCappiPopupOn: boolean = false
  cappiAreaId: number = null
  cappiTime: string = ''

  async mounted() {
    await this.getEmergencyData()
    await this.getPhoneStreamData()
    await this.getStreamAccountApplyData()
    this.getEmergencyPlan()
    this.setWebSocket()

    if (this.isWarning)
      this.isOptionPanelShow = true
    this.reqInterval = setInterval(() => {
      this.getEmergencyData()
    }, 60000)
    this.steamInterval = setInterval(() => {
      if (webs)
        webs.send('keep me connected')
    }, 50000)

    this.planInterval = setInterval(this.getEmergencyPlan, 20000)
    this.getCappiEmergency()
    this.cappiInterval = setInterval(this.getCappiEmergency, 1*60*1000)
  }

  // 雷达预警
  async getCappiEmergency() {
    let res = await fetchJsonp(`http://10.148.83.228:9002/nc/jsonp/list/cappialarm?countyId=58&cacheCtrl=${Date.now()}`)
    let msg: any = await res.json()
    if (!msg || !msg.length) {
      this.cappiColor = '#d6dce5'
      this.cappiArea = []
      this.isCappiPopupOn = false
      return
    }
    let fileName = msg[msg.length - 1]
    let str = fileName.split('.')[0]
    let time: any = str.slice(0,4) + '/' + str.slice(4,6) + '/' + str.slice(6,8) + ' ' + str.slice(8,10) + ':' + str.slice(10, 12) + ':' + str.slice(12, 14)
    time = new Date(time).getTime()
    let date = Date.now()
    if (date > time + 30*60*1000) {
      this.cappiColor = '#d6dce5'
      this.cappiArea = []
      this.isCappiPopupOn = false
      return
    }
    this.cappiTime = moment(time).format('YYYY-MM-DD HH:mm')
    res = await fetchJsonp(`http://10.148.83.228:9002/nc/jsonp/json/info?modelName=cappialarm&countyId=${this.region_global.countyId}&fileName=${fileName}`)
    msg = await res.json()
    if (!msg || !msg.length) {
      this.cappiColor = '#d6dce5'
      this.cappiArea = []
      this.isCappiPopupOn = false
    } else {
      this.cappiColor = '#f4434b'
      this.cappiArea = msg  
    }
  }
  @Watch('datetime_global')
  async ondatetime_globalChanged (val: any, oldVal: any) {
    let date: any = new Date(val).getTime()
    date = date - date % (6*60*1000)
    let res = await fetchJsonp(`http://10.148.83.228:9002/nc/jsonp/list/cappialarm?countyId=58&cacheCtrl=${Date.now()}`)
    let msg: any = await res.json()
    if (!msg || !msg.length) {
      this.cappiColor = '#d6dce5'
      this.cappiArea = []
      this.isCappiPopupOn = false
      return
    }
    this.getFilename(msg, date)
    .then(async time => {
      this.cappiTime = moment(time).format('YYYY-MM-DD HH:mm')
      let fileName = moment(time).format('YYYYMMDDHHmm00') + '.json'
      res = await fetchJsonp(`http://10.148.83.228:9002/nc/jsonp/json/info?modelName=cappialarm&countyId=${this.region_global.countyId}&fileName=${fileName}`)
      msg = await res.json()
      if (!msg || !msg.length) {
        this.cappiColor = '#d6dce5'
        this.cappiArea = []
        this.isCappiPopupOn = false
      } else {
        this.cappiColor = '#f4434b'
        this.cappiArea = msg  
      }
    })
    .catch(() => {
      this.cappiColor = '#d6dce5'
      this.cappiArea = []
      this.isCappiPopupOn = false
    })
  }
  getFilename(msg, date) {
    return new Promise((resolve, reject) => {
      const fn = (msg, date, i) => {
        let time = date - i*6*60*1000
        let exp = new RegExp(moment(time).format('YYYYMMDDHHmm00'))
        for (let el of msg) {
          if (exp.test(el)) resolve(time)
        }
        if (i <= 3) {
          i++
          fn(msg, date, i)
        } else {
          reject('')
        }
      }
      fn(msg, date, 0)
    })
  }
  openCappiPopup() {
    if (this.cappiArea.length)
      this.isCappiPopupOn = true
  }
  goCappiArea(el) {
    this.cappiAreaId = this.cappiAreaId === el.id ? null : el.id
  }
  @Watch('cappiAreaId')
  oncappiAreaIdChanged (val: number, oldVal: number) {
    if (val === 0) {                    // 遂溪国投公司防御区
      let helper = new Helper()
      for(let i = 2995; i < 3000; i += 0.1) {
        areaCircle.push(helper.addCircleOutlineGeometry([110.2801295, 21.40809989], i, new Zearth.ColorGeometryInstanceAttribute(1, 0.67, 0.0, 1)))        
      }
      for(let i = 1995; i < 2000; i += 0.1) {
        areaCircle.push(helper.addCircleOutlineGeometry([110.2801295, 21.40809989], i, new Zearth.ColorGeometryInstanceAttribute(1, 0.0, 0.0, 1)))       
      }
      let boundingSphere = new Zearth.BoundingSphere(Zearth.Cartesian3.fromDegrees(110.2801295, 21.40809989, -6.499445625), 2500)
      window['viewer'].camera.flyToBoundingSphere(boundingSphere)
    } else if (val === 2000) {          // 遂溪县防御区
      let bounds = suixiDef.geometries[0].coordinates[0]
      let boundArray = []
      for (let el of bounds) {
        boundArray.push(el[0])
        boundArray.push(el[1])
      }
      let helper = new Helper()
      boundLayer = helper.addPolyline(boundArray, 2, '#f00', true, 'polyline', 'sxDef')
      window['viewer'].flyTo(boundLayer, { duration: 1 })
    }
    if (oldVal === 0)
      this.removeAreaCircle()
    else if (oldVal === 2000)
      this.removeBoundLayer()
  }
  removeAreaCircle() {
    if (!areaCircle.length) return
    areaCircle.map(item => {
      window['viewer'].scene.primitives.remove(item)
    })
    areaCircle = []
  }
  removeBoundLayer() {
    if (!boundLayer) return
    window['viewer'].entities.remove(boundLayer)
    boundLayer = null
  }
  @Watch('isCappiPopupOn')
  onisCappiPopupOnChanged (val: boolean, oldVal: boolean) {
    if (!val) this.cappiAreaId = null
  }

  //预案在线
  async getEmergencyPlan() {
    let res = await fetch(`http://10.148.83.228:8086/emergency/plan/get/unfinish/user/post/,/post?random=${Math.random()}`);
    let msg: any = await res.json();
    let data: Array<any> = msg.tagObject;
    if (!data) return;
    this.haveEmergencyPlan = data.length ? true : false;
    this.computedWhetherHaveAWarningType();
  }
  toggleEmergencyPlan() {
    if (this.haveEmergencyPlan) this.toggleEmergencyPlan_global();
    if (this.emergencyPlan_global) {
      if (this.displayEmergencyDetailPopup) this.displayEmergencyDetailPopup = false;
      if (this.messagePopup) this.messagePopup = false;
      if (this.displayPhoneStreamingPopup) this.displayPhoneStreamingPopup = false;
    }
  }
  @Watch('refreshPlan')
  async planStatusChanged(val) {
    if (val) {
      await this.getEmergencyPlan()
      if (this.haveEmergencyPlan && !this.emergencyPlan_global) {
        this.toggleEmergencyPlan_global()
      }
    }
  }

  //短信
  toggleMessagePopup() {
    this.messagePopup = !this.messagePopup;
    if (this.messagePopup) {
      if (this.emergencyPlan_global) this.toggleEmergencyPlan_global();
      if (this.displayEmergencyDetailPopup) this.displayEmergencyDetailPopup = false;
      if (this.displayPhoneStreamingPopup) this.displayPhoneStreamingPopup = false;
    } else {
      this.haveNewMessage = false;
      this.computedWhetherHaveAWarningType();
      this.smsPersonPhone = [];
    }
  }
  closeMessageHistPopup() {
    this.messageHistPopup = false;
    this.currentPhone = null;
  }
  watchMsgDetail(phone) {
    this.messageHistPopup = true;
    this.currentPhone = phone;
    this.smsPageIndex = 0;
    this.getSmsRecord(phone);
  }
  async getSmsRecord(phone) {
    const
      pageIndex = this.smsPageIndex,
      pageSize = 10;
    let res = await SmsClient.getPersonHistText(phone, pageIndex, pageSize);
    if (res.length) {
      this.smsHistoryRecord = res;
      return true;
    } else
      return false;
  }
  togglePage(action) {
    if (!action) {
      if (this.smsPageIndex === 0) {
        this.toggleOprateTip_global({ tip: true, text: '已经是第一页了' })
        return;
      }
      this.smsPageIndex--
      this.getSmsRecord(this.currentPhone);
    } else {
      this.smsPageIndex++
      this.getSmsRecord(this.currentPhone)
        .then(result => {
          if (!result) {
            this.toggleOprateTip_global({ tip: true, text: '已经是最后一页了' })
            this.smsPageIndex--
          }
        });
    }
  }

  setWebSocket() {
    // webs = new WebSocket("ws://10.152.189.241:8086/websocket");
    webs = new WebSocket("ws://10.148.83.228:8086/websocket");
    webs.onopen = () => {
      console.log('opened')
    }
    webs.onmessage = async e => {
      let res = JSON.parse(e.data);
      console.info(res)
      // if(res.liverequest.state === 'requesting') {
      //   this.getPhoneStreamData()
      //   this.computedWhetherHaveAWarningType()
      // }
      if ('NewSMS' in res) {
        this.smsPersonPhone.push(res.NewSMS[0]);
        this.haveNewMessage = true;
      }
      if ('typhoon_warning' in res) {
        let data = res.typhoon_warning
        let typhoonNumber = Object.keys(data).length
        if (typhoonNumber) {
          let tsId = Object.keys(data)[typhoonNumber - 1]
          this.typhText = tsId + ' ' + data[tsId].tscname
          this.typhId = tsId
          this.typhColor = this.getColor('I')
          this.haveTyphWaning = true
          this.computedWhetherHaveAWarningType()
          if (!this.isShowCurrentTy_global) {
            this.toggleisNeedMountedTy_global(false)
            this.toggleShowCurrentTy_global(true)
            setTimeout(() => {
              this.toggleTyphTimelineStatus_global('detail')
              this.selectTyph_global(tsId)
            }, 1000)
            setTimeout(() => {
              this.toggleisNeedMountedTy_global(true)
            }, 1500)
          }
        }
      }
      await this.getStreamAccountApplyData()
      await this.getPhoneStreamData()
      this.computedWhetherHaveAWarningType()
    }
    webs.onclose = () => {
      console.log('Closed')
      webs = null
      this.setWebSocket()
    }
		webs.onerror = (err) => {
			console.log("Error: " + err)
      webs = null
      this.setWebSocket()
		}
  }

  showTy() {
    if (!this.typhId) return
    this.toggleClickedTy_global()
    setTimeout(() => {
      this.toggleTyphTimelineStatus_global('detail')
      this.selectTyph_global(this.typhId)
    }, 1000)
  }

  @Watch('typhTimelineStatus_global')
  ontyphTimelineStatus_globalChanged(val: any, oldVal: any): void {
    if (val !== 'search')
      this.top = '-111px'
    else
      this.top = '0px'
  }

  togglePhoneStreamingPopup() {
    this.displayPhoneStreamingPopup = !this.displayPhoneStreamingPopup
    this.toggleWaterLevelTablePopup_global(false)
    if (this.displayPhoneStreamingPopup) {
      if (this.emergencyPlan_global) this.toggleEmergencyPlan_global();
      if (this.displayEmergencyDetailPopup) this.displayEmergencyDetailPopup = false;
      if (this.messagePopup) this.messagePopup = false;
    }
  }

  toggleWaterLevelTablePopup() {
    if (Number(this.waterLevel) <= 0)
      return
    this.toggleWaterLevelTablePopup_global(true)
    this.displayEmergencyDetailPopup = false
  }

  async phoneStreamingOperate(data, type) {
    let res = await fetch(`http://10.148.83.228:8086/live/respone/user/post/,/post?requestId=${data.data.requestId}&userId=${sessionStorage.userId}&pass=${type}&release=true`, {
      cache: 'no-cache'
    })
    let resData = await res.json()
    if (resData.result === 'S_OK') {
      this.toggleOprateTip_global({ tip: true, text: '审核成功' })
      this.getPhoneStreamData()
    } else {
      this.toggleOprateTip_global({ tip: true, text: '审核失败 ' + resData.description })
      this.getPhoneStreamData()
    }
  }

  async getStreamAccountApplyData() {
    let res = await fetch('http://10.148.83.228:8086/user/get/reginfo/user/post/,/?cache=' + Date.now(), {
      cache: 'no-cache'
    })

    let data = await res.json()
    this.accountApplyData = []
    if (data.tagObject !== null) {
      this.haveStreamAccountApply = true
      this.accountApplyData = data.tagObject
    } else {
      this.haveStreamAccountApply = false
    }
    return
  }

  computedWhetherHaveAWarningType() {
    if (this.isEmergencyWarning || this.havePhoneStreamingSource || this.haveEmergencyPlan || this.haveNewMessage || this.haveTyphWaning) {
      this.isWarning = true
    } else {
      this.isWarning = false
    }
  }

  async getPhoneStreamData() {
    let res = await fetch('http://10.148.83.228:8086/live/currequest/user/post/,/?cache=' + new Date().getTime(), {
      mode: 'cors',
      cache: 'no-cache'
    })
    let data = await res.json()
    this.phoneStreamingData = []
    if (data.result === 'S_OK' && data.tagObject.length > 0) {
      this.havePhoneStreamingSource = true
      for (let item of data.tagObject) {
        this.phoneStreamingData.push({
          name: item.reqUserName,
          state: item.state === 'requesting' ? '请求中' : '请求成功',
          requestTime: moment(item.reqTime).format('HH:mm'),
          data: {
            requestId: item.id
          },
        })
      }
    } else {
      this.havePhoneStreamingSource = false
    }
    this.computedWhetherHaveAWarningType()
  }

  async streamAccountApplyOperate(id, type) {
    let res = await fetch(`http://10.148.83.228:8086/user/checkreg/user/post/,/post?userId=${id}&pass=true&release=${type}`)
    let data = await res.json()
    if (data.result === 'S_OK') {
      this.toggleOprateTip_global({ tip: true, text: '审核成功' })
      this.getStreamAccountApplyData()
    } else {
      this.toggleOprateTip_global({ tip: true, text: '审核失败' })
      this.getStreamAccountApplyData()
    }
  }

  firstGetInfo: boolean = false
  getEmergencyData() {
    let emer = new EmergResponse(this.region_global)
    emer.rainMonitor()
      .then(data => {
        this.rainColor = this.getColor(data.level)
        this.rainText = data.text
        this.rainLevel = data.level
        if (data.level.length > 0)
          this.isEmergencyWarning = true
        emer.waterLevel()
          .then(data => {
            let level = ''
            if (data.level > 0) {
              this.waterColor = this.getColor('I')
            } else {
              this.waterColor = this.getColor('')
            }
            this.waterText = data.text
            this.waterLevel = data.level.toString()
            if (data.level > 0)
              this.isEmergencyWarning = true
            if (this.firstGetInfo) {
              this.computedWhetherHaveAWarningType()
            } else {
              emer.typhMonitor()
              .then(data => {
                console.log(data)
                this.firstGetInfo = true
                if (data) {
                  let tyIdArr = Object.keys(data)
                  tyIdArr.sort((a, b) => Number(b) - Number(a))
                  for (let tsId of tyIdArr) {
                    let item = data[tsId]
                    // if (!item.tsename || !item.tscname || item.intlid === '****') continue

                    this.typhText = tsId + ' ' + (data[tsId].tscname ? data[tsId].tscname : '未命名')
                    this.typhId = tsId
                    this.typhColor = this.getColor('I')
                    this.haveTyphWaning = true
                    if (!this.isShowCurrentTy_global) {
                      this.toggleisNeedMountedTy_global(false)
                      this.toggleShowCurrentTy_global(true)
                      setTimeout(() => {
                        this.toggleTyphTimelineStatus_global('detail')
                        this.selectTyph_global(tsId)
                      }, 1000)
                      setTimeout(() => {
                        this.toggleisNeedMountedTy_global(true)
                      }, 1500)
                    }
                    // return
                  }
                  // this.typhText = '当前没有台风告警'
                  // this.haveTyphWaning = false
                  // this.typhColor = this.getColor('')
                } else {
                  this.typhText = '当前没有台风告警'
                  this.haveTyphWaning = false
                  this.typhColor = this.getColor('')
                }
                this.computedWhetherHaveAWarningType()
              })
            }
            
          })
      })
  }
  toggleEmergencyDetailPopup() {
    this.displayEmergencyDetailPopup = !this.displayEmergencyDetailPopup
    if (this.displayEmergencyDetailPopup) {
      if (this.emergencyPlan_global) this.toggleEmergencyPlan_global();
      if (this.messagePopup) this.messagePopup = false;
      if (this.displayPhoneStreamingPopup) this.displayPhoneStreamingPopup = false;
    }
  }
  toggleExplainPopup(event: MouseEvent, action: boolean, target: string) {
    if (action) {
      this.displayExplainPopup = true
      let ele: any = this.$el.querySelector('#explainPopup')
      ele.parentNode.removeChild(ele)
      document.body.appendChild(ele)
      ele.style.left = event.clientX - 100 + 'px'
      ele.style.top = event.clientY + 20 + 'px'
      if (target === 'rain')
        this.tipText = this.rainText
      else if (target === 'waterLevel')
        this.tipText = this.waterText
    } else if (this.displayExplainPopup === true && action === false) {
      this.displayExplainPopup = false
      let ele = document.querySelector('body > #explainPopup')
      if (!ele) return
      document.body.removeChild(ele)
      this.$el.appendChild(ele)
    }
  }
  toggleOptionPanel() {
    this.isOptionPanelShow = !this.isOptionPanelShow
  }
  getColor(level) {
    switch (level) {
      default:
        return '#d6dce5'
      case 'IV':
        return '#0000ff'
      case 'III':
        return '#ffff00'
      case 'II':
        return '#ffa500'
      case 'I':
        return '#f4434b'
    }
  }
}