import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './AisMonitor.html?style=./AisMonitor.scss'
import { Helper } from "../../../../util/Helper";
import { AISData } from "../../../../interface/AIS";
import moment from 'moment'
import SelectTownOrDepartment from "../../../commonCompt/select-town-or-department/SelectTownOrDepartment";

let entityHolder: object = {},
  clickHandler: any = null,
  pickedModel: any = null

@WithRender
@Component
export default class AisMonitor extends Vue {
  @Getter('systemStore/datetime_global') datetime_global
  @Getter('monitorStore/isBoatModelHightLighted_global') isBoatModelHightLighted_global
  @Action('monitorStore/toggleAISDetailPanel_global') toggleAISDetailPanel_global
  @Action('monitorStore/storeAISDetailData_global') storeAISDetailData_global
  @Action('monitorStore/toggleModelHightLight_global') toggleModelHightLight_global

  @Prop() closeSelf

  shipData: any = null
  selectData: Array<any> = []
  selectView: any = null
  shipTypeSelected: object = {}


  created() {
    // this.getShipData(`http://10.148.83.228:8086/ais/curshipinfo/user/post/,/post?latStart=19&latEnd=22&lonStart=107&lonEnd=111&cacheCtrl=${Date.now()}`)
    this.getShipData(`http://10.148.83.228:2008/projshare/ais/get/ship/current?latStart=19&latEnd=22&lonStart=107&lonEnd=111&cacheCtrl=${Date.now()}`)
  }

  @Watch('datetime_global')
  ondatetime_globalChanged (val: any, oldVal: any) {
    // let time = moment(val).format('YYYYMMDDHHmm00')
    // this.getShipData(`http://10.148.83.228:8086/ais/shipinfo/user/post/,/post?latStart=19&latEnd=22&lonStart=107&lonEnd=111&endTime=${time}&cacheCtrl=${Date.now()}`)
    let time = moment(val).format('YYYY-MM-DD HH:mm:00')
    this.getShipData(`http://10.148.83.228:2008/projshare/ais/get/ship?latStart=19&latEnd=22&lonStart=107&lonEnd=111&time=${time}&cacheCtrl=${Date.now()}`)
  }

  async getShipData(url) {
    let res = await fetch(url)
    let data = await res.json()
    this.shipData = data.tagObject
    this.selectData = []
    for (let i in this.shipData) {
      this.selectData.push({
        name: i + `(${this.shipData[i].length})`,
        id: i,
        selected: true
      })
    }
    let tempSelectedShip = {},
      counter = 0
    console.info(this.shipData)
    for (let i in this.shipData) {
      tempSelectedShip[counter] = i
      counter++
    }
    console.info(tempSelectedShip)
    this.shipTypeSelected = tempSelectedShip
    this.drawSelectedShip()
    this.selectView = SelectTownOrDepartment
  }

  destroyed() {
    for (let i in entityHolder)
      window['viewer'].scene.primitives.remove(entityHolder[i])
    entityHolder = {}
  }

  @Watch('isBoatModelHightLighted_global')
  onisBoatModelHightLighted_globalChanged(val: any, oldVal: any): void {
    if (val === false && oldVal === true) {
      pickedModel.primitive.silhouetteSize = 0
      pickedModel = null
    }
  }

  selectionChange(data) {
    this.shipTypeSelected = data
  }

  drawSelectedShip() {
    for (let i in this.shipTypeSelected) {
      let isHaveThisType = false,
        collection: any = null
      for (let j in entityHolder) {
        if (j == this.shipTypeSelected[i]) {
          isHaveThisType = true
          break
        }
      }
      console.info(isHaveThisType)
      if (!isHaveThisType) {
        collection = drawShips(this.shipData[this.shipTypeSelected[i]], this.shipTypeSelected[i])
        entityHolder[this.shipTypeSelected[i]] = collection
      }
    }
    console.info(entityHolder)
    for (let i in entityHolder) {
      let isDeletePrimitiveNeeded = true
      for (let k in this.shipTypeSelected) {
        if (i == this.shipTypeSelected[k]) {
          isDeletePrimitiveNeeded = false
          break
        }
      }
      if (isDeletePrimitiveNeeded) {
        window['viewer'].scene.primitives.remove(entityHolder[i])
        delete entityHolder[i]
      }
    }

    let helper = new Helper()
    helper.removeHandler(clickHandler)
    clickHandler = helper.getNewHandler()
    helper.pickModel('click', clickHandler, (position, idObj, pick) => {
      if (pickedModel !== null)
        pickedModel.primitive.silhouetteSize = 0
      pickedModel = pick
      pickedModel.primitive.silhouetteSize = 2
      this.toggleModelHightLight_global(true)
      if (idObj) {
        this.toggleAISDetailPanel_global({ action: true, position: JSON.parse(JSON.stringify(position)) })
        this.storeAISDetailData_global(idObj)
      }
    })
  }
}

function drawShips(data: Array<AISData>, type: string) {
  let helper = new Helper()
  let collection = helper.getPrimitiveCollection()
  data.forEach(el => {
    let url = ''
    // if (el.SOG > 0)
    url = 'http://10.148.83.229/model/boat.gltf'
    // else
    //   url = 'http://10.148.83.229/model/boat_line.gltf'
    helper.addModel(url, [el.V06001, el.V05001], el.COG / 10, 100, getShipColor(type), collection, el)
  })
  window['viewer'].scene.primitives.add(collection)
  return collection
  function getShipColor(type: string) {
    let color = {
      '货船': '#00bf97',
      '未定义': '#a09e9c',
      '油船': '#ad652f',
      '客船': '#2ab4ff',
      '拖轮': '#8b00ff',
      '高速船': '#ffde55',
      '执法船': '#f44d31',
      '货船(x)': '#0f9172',
      '油船(x)': '#89491d',

      '渔船': '#2a6dff',
      '搜救船': '#f9f91c',
      '引航船': '#e90054',
      '其他船': '#ff8455',
      '疏浚或水下作业船': '#15ffdb',
      '拖带船': '#6dff17',
      '游艇': '#0021bf',
      '地效翼船': '#ffa67f',
      '港口供应船': '#15ff79',
      '帆船': '#be2ad8',
      '未定义(x)': '#777574',
      '客船(x)': '#10799e',
    }
    return color[type]
  }

}


