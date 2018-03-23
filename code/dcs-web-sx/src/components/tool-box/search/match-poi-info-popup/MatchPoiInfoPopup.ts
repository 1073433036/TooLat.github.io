import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './MatchPoiInfoPopup.html?style=./MatchPoiInfoPopup.scss'

//import GeoPoi from '../../../../util/GeoPoi'
import { SmsClient } from "../../../../util/clientHelper"

@WithRender
@Component
export default class MatchPoiInfoPopup extends Vue {
  @Getter('basicInfoStore/matchPoiCollection_global') matchPoiCollection_global
  //@Action('basicInfoStore/matchGeoPoi_global') matchGeoPoi_global
  @Action('basicInfoStore/toggleGeoPopup_global') toggleGeoPopup_global
  @Action('basicInfoStore/addGeoPoiSet_global') addGeoPoiSet_global
  @Action('basicInfoStore/removeGeoCollection_global') removeGeoCollection_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global

  poi: any = {
    School: { text: '学校', selected: true, phonename: 'cellphone', manname: 'manager' },
    Hospital: { text: '医院', selected: true, phonename: 'cellphone', manname: 'helpman' },
    Reservoir: { text: '水库', selected: true, phonename: 'cellphone', manname: 'manager' },
    Chemical: { text: '危化品企业', selected: true, phonename: 'cellphone', manname: 'manager' },
    Loudspeaker: { text: '省突喇叭', selected: true, phonename: 'phone', manname: 'contact' },
    Openspace: { text: '避难场所', selected: true, phonename: 'managercellphone', manname: 'manager' },
    Led: { text: '电子显示屏', selected: true },
    Electricity: { text: '电力设施', selected: true, phonename: 'cellphone', manname: 'manager' },
    RiskPoint: { text: '地质隐患点', selected: true, phonename: 'cellphone', manname: 'contacts' },
    Material: { text: '救援物资', selected: true, phonename: 'cellphone', manname: 'contacts' },
    Rescueteam: { text: '救援队伍', selected: true, phonename: 'cellphone', manname: 'manager' },
  }
  materialPurpose: any = {
    自然灾害: 'natural',
    公共卫生: 'public',
    事故灾难: 'disaster',
  }
  rescueteamPurpose: any = {
    事故灾难: 'disaster',
    社会安全: 'security',
    自然灾害: 'natural',
    公共卫生: 'public',
    综合: 'multiple',
    医疗救援队: 'medical',
  }
  allSelected: boolean = true
  isPublishPopupOn: boolean = false
  content: string = null

  toggleAllSelected() {
    if(this.allSelected) {
      for(let i in this.poi) {
        if(this.poi[i].selected) {
          this.poi[i].selected = false
          this.removePoi(i)
        }
      }
    } else {
      for(let i in this.poi) {
        if(!this.poi[i].selected) {
          this.poi[i].selected = true
          this.addPoi(i)
        }
      }
    }
    this.allSelected = !this.allSelected
  }
  togglePoi(key) {
    if(this.poi[key].selected) this.removePoi(key);
    else this.addPoi(key);
    this.poi[key].selected = !this.poi[key].selected;
  }
  addPoi(key) {
    let matchPois = this.matchPoiCollection_global[key];
    if(key === 'Material' || key === 'Rescueteam') {
      let poiSet = {};
      if(key === 'Material') {
        for(let i in matchPois) {
          let poi = matchPois[i];
          let keys = Object.keys(poi);
          const type = poi[keys[0]][0].purpose;
          if(poiSet.hasOwnProperty(type) === false) {
            poiSet[type] = {};
          }
          poiSet[type][i] = poi;
        }
      } else {
        for(let i in matchPois) {
          const type = matchPois[i][0].teamtype;
          if(poiSet.hasOwnProperty(type) === false) {
            poiSet[type] = {};
          }
          poiSet[type][i] = matchPois[i];
        }
      }

      for(let i in poiSet) {
        this.addGeoPoiSet_global({
          type: key,
          subType: i,
          subTypeEn: ( key === 'Material' ? this.materialPurpose[i] : this.rescueteamPurpose[i] ),
          data: poiSet[i]
        });
      }
    } else {
      this.addGeoPoiSet_global({
        type: key,
        subType: undefined,
        data: matchPois
      });
    }
  }
  removePoi(key) {
    if(key === 'Material' || key === 'Rescueteam') {
      let obj = key === 'Material' ? this.materialPurpose : this.rescueteamPurpose;
      for(let i in obj) {
        this.removeGeoCollection_global({ type: key, subType: i, subTypeEn: obj[i] });
      }
    } else {
      this.removeGeoCollection_global({ type: key });
    }
  }

  @Watch('matchPoiCollection_global')
  onmatchPoiCollection_globalChanged(val: any, oldVal: any): void {
    for(let key in val) {
      if(!this.poi[key].selected) this.removePoi(key);
    }
  }

  async publish() {
    if (!this.content) {
      this.toggleOprateTip_global({ tip: true, text: '发布内容不得为空！' })
      return
    }

    let phoneContacts = []
    for (let key in this.matchPoiCollection_global) {
      let item = this.poi[key]
      if (!item.selected || key === 'Led') continue
      let info = this.matchPoiCollection_global[key]
      for (let i in info) {
        let opt = info[i]
        if (key === 'Rescueteam') {
          for (let val of opt) {
            if (val[item.phonename])
              phoneContacts.push({ phone: val[item.phonename], man: val[item.manname], department: item.text })
          }
        } else if (key === 'Material') {
          for (let y in opt) {
            for (let val of opt[y]) {
              if (val[item.phonename])
                phoneContacts.push({ phone: val[item.phonename], man: val[item.manname], department: item.text })
            }
          }
        } else {
          if (opt[item.phonename])
            phoneContacts.push({ phone: opt[item.phonename], man: opt[item.manname], department: item.text })
        }
      }
    }

    if (!phoneContacts.length) return

    let params = {
      phoneContacts,
      content: this.content,
      category: '靶向发布',
      tag: '靶向发布',
    }
    let res = await SmsClient.sendPhone(params)
    if (res === true) this.toggleOprateTip_global({ tip: true, text: '短信发送成功！' })
    else this.toggleOprateTip_global({ tip: true, text: res })
  }

}