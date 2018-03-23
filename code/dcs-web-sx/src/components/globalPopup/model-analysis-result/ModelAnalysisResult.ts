import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ModelAnalysisResult.html?style=./ModelAnalysisResult.scss'
import fetchJsonp from 'fetch-jsonp'
import { ModelData } from "../../../interface/ModelData"
import * as levelDataConfig from "../../../config/modelResultConfig"
import ModelAssess from '../../../util/modelAssess'

@WithRender
@Component
export default class ModelAnalysisResult extends Vue {
  // @Getter('modelStore/isModelAnalysing_global') isModelAnalysing_global
  @Getter('modelStore/modelData_global') modelData_global: ModelData
  @Getter('modelStore/townsIdList_global') townsIdList_global
  @Getter('systemStore/region_global') region_global
  @Action('modelStore/storeModelData_global') storeModelData_global


  LedAndSpeakerData: any = null
  tabOptionSelected: 'result' | 'publish' = 'result'
  loadingText: string = '模型分析中'
  affectedTownList: Array<any> = []
  levelData: object = {}
  isTownListEmpty: boolean = true
  townListForPublish: Array<any> = []
  disasterTypeSelected: string = null
  disasters = {
    '水旱灾害': [
      '洪水', '内涝', '水库重大险情', '堤防重大险情', '凌汛灾害', '山洪灾害事件',
      '农业干旱', '城镇缺水', '生态干旱', '农村人畜饮水困难', '其他水旱灾害'
    ],
    '气象灾害': [
      '台风事件', '龙卷风事件', '暴雨事件', '暴雪事件', '寒潮事件', '大风事件',
      '沙尘暴事件', '低温冻害事件', '高温事件', '热浪事件', '干热风', '下击暴流事件',
      '雪崩事件', '雷电事件', '冰雹事件', '霜冻事件', '大雾事件', '低空气切变事件',
      '其他气象灾害事件'
    ],
    '地震灾害': [
      '人工地震事件', '天然地震事件', '其它地震灾害'
    ],
    '地质灾害': [
      '滑坡事件', '泥石流事件', '山体崩塌事件', '地面塌陷事件', '地裂缝事件',
      '地面沉降事件', '火山喷发事件', '其它地址灾害事件'
    ],
    '海洋灾害事件': [
      '海啸事件', '风暴潮事件', '海冰事件', '巨浪事件', '赤潮事件',
      '其他海洋灾害事件'
    ],
    '生物灾害事件': [
      '农业病害事件', '农业虫害事件', '农业草害事件', '农业鼠害事件', '森林病害事件',
      '森林虫害事件', '森林鼠害事件', '农业转基因生物安全突发事件', '林业转基因生物安全突发事件',
      '林业有害植物事件', '外来有害动植物威胁农业生产事件', '外来有害动植物威胁林业生产事件',
      '其它生物灾害'
    ],
    '森林草原灾害': ['无'],
    '其他自然灾害事件': ['无']
  }
  ledSelected: boolean = false
  speakerSelected: boolean = false
  speakerCount: number = 0
  ledCount: number = 0
  getSpeakAndLedTimeout: any = null

  @Prop()
  closeModelResultPanel

  @Watch('townsIdList_global')
  async ontownsIdList_globalChanged(val: Array<number>, oldVal: Array<number>) {
    this.storeModelData_global({ attr: 'isAnalysing', value: false })
    await this.computAffectedTowns(val)
    this.getSpeakAndLedNumber()
  }
  @Watch('townListForPublish')
  ontownListForPublishChanged(val: any, oldVal: any): void {
    if (this.getSpeakAndLedTimeout) {
      clearTimeout(this.getSpeakAndLedTimeout)
      this.getSpeakAndLedTimeout = false
    }
    this.getSpeakAndLedTimeout = setTimeout(() => {
      this.getSpeakAndLedNumber()
    }, 500)
  }

  deleteTownForPublish(index: number) {
    this.townListForPublish.splice(index, 1)
    this.townListForPublish = this.townListForPublish.concat([])
  }

  async computeTownListForPublish() {
    this.townListForPublish = []
    this.townsIdList_global.forEach((el, index) => {
      el.forEach((subEl, subIndex) => {
        let haveThisTown = false
        for (let item of this.townListForPublish) {
          if (item.id == subEl) {
            haveThisTown = true
            break
          }
        }
        if (!haveThisTown) {
          this.townListForPublish.push({
            name: this.affectedTownList[index]['遂溪县'][subIndex],
            id: subEl
          })
        }
      })
    })
  }

  selectTabOption(target: 'result' | 'publish') {
    this.tabOptionSelected = target
  }

  async computAffectedTowns(townIdList) {
    let modelAssess = new ModelAssess(this.region_global)
    if (this.modelData_global.countyData === null || this.modelData_global.townsData === null) {
      modelAssess.getCounty()
        .then(response => {
          let countyArray = response;
          let countyData = {};
          if (typeof countyArray === 'string' && /DE_ERR/.test(countyArray)) {
            countyData = null;
          } else {
            for (let ct of countyArray) {
              countyData[ct.countyId] = ct;
            }
          }

          if (countyData === null) {
            return;
          }

          modelAssess.getTowns()
            .then(response => {
              let townArray = response;
              let townData = {};
              if (typeof townArray === 'string' && /DB_ERR/.test(townArray)) {
                townData = null;
              } else {
                for (let t of townArray) {
                  townData[t.townId] = t;
                }
              }

              if (townData === null) {
                return;
              }
              const allLevelList = modelAssess.matchTownsName(townData, countyData, townIdList)
              this.affectedTownList = allLevelList
              this.levelData = levelDataConfig[this.modelData_global.analysisType]
              allLevelList.forEach((el, index) => {
                let townStr = '';
                for (let i in el) {
                  this.isTownListEmpty = false
                  // townStr += `<b>${i}: </b>${el[i].join('，')}<br/>`;
                  townStr += `${el[i].join('，')}<br/>`;
                }
                this.levelData[index].text = townStr;
              })
              this.computeTownListForPublish()
            })
        });
    }
    else {
      const allLevelList = modelAssess.matchTownsName(this.modelData_global.townsData, this.modelData_global.countyData, townIdList);
    }
  }

  async getSpeakAndLedNumber() {
    let res
    if (!this.LedAndSpeakerData) {
      res = await fetch('http://10.148.83.228:8086/poi/entity/facilities/user/post/,/', {
        mode: 'cors'
      })
      let resData: any = await res.json()
      this.LedAndSpeakerData = resData.tagObject
    }
    this.ledCount = 0
    this.speakerCount = 0
    let data = this.LedAndSpeakerData
    for (let item of this.townListForPublish) {
      for (let ledItem of data.Led) {
        if (item.id == ledItem.townId)
          this.ledCount++
      }
      for (let speakerItem of data.LoudSpeaker) {
        if (item.id == speakerItem.townId)
          this.speakerCount++
      }
    }
  }

}


interface LedAndSpeaker {
  LoudSpeaker: Array<DeviceObject>
  Led: Array<DeviceObject>
}

interface DeviceObject {
  id: number
  address: string
  townId: number
}


