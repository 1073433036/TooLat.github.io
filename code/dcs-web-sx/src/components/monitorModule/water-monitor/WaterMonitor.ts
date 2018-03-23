import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './WaterMonitor.html?style=./WaterMonitor.scss'
import { Helper } from "../../../util/Helper";
const entity = {
  reservior: [],
  river: []
}
let clickIndex: number = null
@WithRender
@Component
export default class WaterMonitor extends Vue {
  @Getter('monitorStore/isWaterLevelDetailOn_global') isWaterLevelDetailOn_global
  @Action('emergencyStore/storeWaterLevelData_global') storeWaterLevelData_global
  @Action('emergencyStore/storeWaterLevelPosition_global') storeWaterLevelPosition_global
  @Action('emergencyStore/toggleWaterLevelPopup_global') toggleWaterLevelPopup_global
  @Action('monitorStore/toggleWaterLevelDetail_global') toggleWaterLevelDetail_global
  @Action('systemStore/toggleWaterNamePopup_global') toggleWaterNamePopup_global
  @Action('systemStore/changeWaterLevelName_global') changeWaterLevelName_global
  @Prop({ default: false }) isVideoMonitorOn: boolean

  mouseoverEventHolder: any = null
  clickEvenHolder: any = null
  manageOptionSelected: string = null

  mounted() {
    this.selectManageOption('reservior')
  }


  selectManageOption(type: string) {
    if (this.manageOptionSelected === type)
      this.manageOptionSelected = null
    else
      this.manageOptionSelected = type
  }

  beforeDestroy() {
    let helper = new Helper()
    if (this.clickEvenHolder)
      helper.removeHandler(this.clickEvenHolder)
    if(this.mouseoverEventHolder)
      helper.removeHandler(this.mouseoverEventHolder)
    for (let i in entity) {
      helper.removeEntity(entity[i])
    }
    helper = null
    this.toggleWaterLevelDetail_global(false)
    this.toggleWaterLevelPopup_global(false)
    this.toggleWaterNamePopup_global(false)
  }

  @Watch('manageOptionSelected')
  onmanageOptionSelectedChanged(val: any, oldVal: any): void {
    if (val)
      this.addPoint(val)
    else {
      let helper = new Helper()
      helper.removeEntity(entity[oldVal])
      helper = null
    }
    // this.toggleWaterLevelPopup_global(false)
  }
  @Watch('isWaterLevelDetailOn_global')
  onisWaterLevelDetailOn_globalChanged(val: any, oldVal: any): void {
    if (val === false) {
      entity[this.manageOptionSelected][clickIndex].billboard._image._value =
        entity[this.manageOptionSelected][clickIndex].billboard._image._value.replace('_pre.png', '.png')
      clickIndex = null
    }
  }

  async addPoint(type: string) {
    let res = await fetch(`http://10.148.83.228:8086/hyd/${type}/user/post/,/?cacheCtrl=${Date.now()}`, {
      mode: 'cors',
      method: 'get',
      cache: 'no-cache'
    })
    let data = await res.json()

    if (data.result !== 'S_OK')
      return

    let helper = new Helper()
    for (let i in entity) {
      helper.removeEntity(entity[i])
    }
    entity.reservior = []
    entity.river = []
    data.tagObject.forEach(el => {
      let imgUrl = '../../../../static/img/waterLevel'
      if (el.name.match('水库')) {
        imgUrl += '/reservoir_'
      } else {
        imgUrl += '/river_'
      }
      if (el.iswarning) {
        imgUrl += 'four.png'
      } else {
        let warnPer = el.curwaterlevel / el.warnwaterlevel
        if (warnPer < 0.65)
          imgUrl += 'one.png'
        else if (warnPer < 0.8)
          imgUrl += 'two.png'
        else
          imgUrl += 'three.png'
      }

      entity[type].push(
        helper.addBillboard([el.gcjLon, el.gcjLat], imgUrl)
      )
    })

    if(this.mouseoverEventHolder)
      helper.removeHandler(this.mouseoverEventHolder)
    this.mouseoverEventHolder = helper.getNewHandler()
    helper.setAction('mouseOver', this.mouseoverEventHolder, entity[type], (pickedEntity, index, position) => {
      if (index) {
        const name = data.tagObject[index].name
        this.changeWaterLevelName_global({
          address: name,
          x: position.x,
          y: position.y,
        })
        this.toggleWaterNamePopup_global(true)
      } else {
        this.toggleWaterNamePopup_global(false)
      }
    })
    
    if (this.clickEvenHolder)
      helper.removeHandler(this.clickEvenHolder)
    this.clickEvenHolder = helper.getNewHandler()
    helper.setAction('click', this.clickEvenHolder, entity[type], (pickedEntity, index, position) => {
      this.toggleWaterNamePopup_global(false)
      if (clickIndex !== null) {
        if ( entity[type][clickIndex])
          entity[type][clickIndex].billboard._image._value =
            entity[type][clickIndex].billboard._image._value.replace('_pre.png', '.png')
      }
      clickIndex = index
      entity[type][clickIndex].billboard._image._value =
        entity[type][clickIndex].billboard._image._value.replace('.png', '_pre.png')
      this.toggleWaterLevelDetail_global(true)
      this.toggleWaterLevelPopup_global(true)
      this.storeWaterLevelData_global(data.tagObject[index])
      this.storeWaterLevelPosition_global(position)
    })
    helper = null
  }
}



