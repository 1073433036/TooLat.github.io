import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './InfoPublish.html?style=./InfoPublish.scss'
import SelectPublishTarget from "../../commonCompt/select-town-or-department/SelectTownOrDepartment";
import fetchJsonp from "fetch-jsonp";
import { SmsClient, GeographyClient, larnClient } from "../../../util/clientHelper";

import SearchResult from './search-result/SearchResult'

@WithRender
@Component({
  components: {
    SelectPublishTarget
  }
})
export default class InfoPublish extends Vue {
  @Action('emergencyStore/toggleInfoPublish_global') toggleInfoPublish_global
  @Getter('systemStore/region_global') region_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global

  tabOptionSelected: 'responsible' | 'province' | 'textManage' = 'responsible'
  searchResultView: any = null
  townsData: Array<any> = null
  dutyTownSelected: string = null
  provinceTownSelected: any = {}
  msgDepartmentData: Array<string> = []
  msgDepartmentSelected: string = ''
  msgCategoryData: Array<string> = []
  msgCategorySelected: string = ''
  searchText: string = ''
  searchTextType: 'name' | 'tag' = 'name'
  searchPageIndex: number = 0
  SearchPageSize: number = 15
  speakerSelected: boolean = false
  ledSelected: boolean = false
  speakerCount: number = 0
  ledCount: number = 0
  getSpeakAndLedTimeout: any = null
  ledAndSpeakerData: any = null

  allTowns: any = {}
  orgsOfResponsible: any = {}
  townOfResponsible: any = {}
  depsOfResponsible: any = {}
  textOfPublish: string = null

  disasters: any = {}
  disastersLevels: any = {}
  disastersPubways: any = {}
  disasterTypeSelected: string = null
  subTypeSelected: string = null
  disasterLevelSelected: string = null
  disastersPubwaysSelected: string[] = []
  textOfProvince: string = null
  levelFormat: string[] = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ']



  async mounted() {
    let res = await fetchJsonp('http://10.148.10.80:8111/dict/geologyGD/s3/24,58,/JSONP/')
    let data = await res.json()
    this.townsData = [{
      name: '请选择行政地区',
      value: null,
      disabled: true
    }]
    data.forEach(el => {
      this.townsData.push({
        name: el.town,
        value: el.townId,
        disabled: false
      })
    })
    let towns = await GeographyClient.getTownsBound(this.region_global.countyId)
    if (towns) {
      let obj = {}
      for (let opt of towns) {
        obj[opt.townId] = opt
      }
      this.allTowns = { ...obj }
    }
  }


  @Watch('tabOptionSelected')
  ontabOptionSelectedChanged(val: any, oldVal: any): void {
    if (val === 'responsible') {
      this.orgsOfResponsible = {}
      this.townOfResponsible = {}
      this.depsOfResponsible = {}
    } else if (val == 'province') {
      if (!Object.keys(this.disasters).length)
        this.initDisaster()
      this.provinceTownSelected = {}
    }
    if (val !== 'textManage' || this.msgDepartmentData.length > 0) return
    SmsClient.getSmsDepartment()
      .then(data => {
        if (!data) return
        
        data.forEach(el => {
          if (typeof el === 'string') {
            this.msgDepartmentData.push(el)
          }
        })
      })
    SmsClient.getSmsCategory()
      .then(data => {
        if (!data) return
        data.forEach(el => {
          if (typeof el === 'string' && el.length > 0) {
            this.msgCategoryData.push(el)
          }
        })
      })
  }
  @Watch('proviceTownSelected')
  async onproviceTownSelectedChanged(val: any, oldVal: any) {
  }


  selectTabOption(option) {
    this.tabOptionSelected = option
  }

  searchTextPublishTarget() {
    this.searchResultView = SearchResult
  }

  closeSearchResultPanel() {
    this.searchResultView = null
  }

  // 靶向发布
  orgsSelectedChanged(data) {
    this.orgsOfResponsible = data
  }
  townSelectedChanged(data) {
    this.townOfResponsible = data
  }
  departmentTypeSelectedChanged(data) {
    this.depsOfResponsible = data
  }

  async publishMessage() {
    let orgRes = await this.sendMessageToOrgs()
    let regRes = await this.sendMessageToRegions()
    if (orgRes && regRes) this.toggleOprateTip_global({ tip: true, text: '发布成功！' })
    else this.toggleOprateTip_global({ tip: true, text: '发布失败！' })
  }

  async sendMessageToOrgs() {
    if (!Object.keys(this.orgsOfResponsible).length) return true
    let arr = []
    for (let i in this.orgsOfResponsible) {
      arr.push(Number(this.orgsOfResponsible[i]))
    }
    let params = {
      orgIds: arr,
      content: this.textOfPublish,
      category: '靶向发布',
      tag: '靶向发布',
    }
    let res = await SmsClient.sendMessageToOrgs(params)
    return res
  }

  async sendMessageToRegions() {
    if (!Object.keys(this.townOfResponsible).length && !Object.keys(this.depsOfResponsible).length) return true
    let regArr = [], mapArr = []
    if (Object.keys(this.townOfResponsible).length === Object.keys(this.allTowns).length) {
      let region = {
        id: 0,
        name: '遂溪县',
        planId: null,
        countyId: this.region_global.countyId,
        townId: -1,
        lon: 110.25,
        lat: 21.37,
        radius: -1,
        sourceman: null,
        sourcephone: null,
        description: null
      }
      regArr.push(region)
    } else {
      for (let i in this.townOfResponsible) {
        let key = this.townOfResponsible[i]
        let region = {
          id: 0,
          name: this.allTowns[key].name,
          planId: null,
          countyId: -1,
          townId: key,
          lon: 110.25,
          lat: 21.37,
          radius: -1,
          sourceman: null,
          sourcephone: null,
          description: null
        }
        regArr.push(region)
      }
    }
    for (let i in this.depsOfResponsible) {
      mapArr.push(Number(this.depsOfResponsible[i]))
    }
    let params = {
      countyId: this.region_global.countyId,
      regions: regArr,
      mapIds: mapArr,
      content: this.textOfPublish,
      category: '靶向发布',
      tag: '靶向发布',
    }
    let res = await SmsClient.sendMessageToRegions(params)
    return res
  }

  // 省突发布
  async initDisaster() {
    let data: any = await larnClient.getLarnParams()
    if (!data) return
    let obj = {}
    for (let opt of data.disasters) {
      let arr = []
      if (opt.subs) {
        for (let item of opt.subs) {
          if (item.enabled) arr.push({ val: item.val, show: item.show })
        }
      }
      obj[opt.val] = {
        show: opt.show,
        subs: arr
      }
    }
    this.disasters = { ...obj }

    let levelObj = {}
    for (let opt of data.levels) {
      if (opt.enabled)
        levelObj[opt.val] = opt.color 
    }
    this.disastersLevels = { ...levelObj }
    this.disasterLevelSelected = Object.keys(levelObj)[0]

    let pubwayObj = {}
    for (let opt of data.pubways) {
      if (opt.enabled) {
        pubwayObj[opt.val] = opt.show
        this.disastersPubwaysSelected.push(opt.val)
      }
    }
    this.disastersPubways = { ...pubwayObj }
  }

  toggleDisasterType() {
    let item = this.disasters[this.disasterTypeSelected].subs[0]
    this.subTypeSelected = item ? item.val : null
  }

  togglePubways(key) {
    let index = this.disastersPubwaysSelected.indexOf(key)
    if (index === -1)
      this.disastersPubwaysSelected.push(key)
    else
      this.disastersPubwaysSelected.splice(index, 1)
  }

  async provinceTownSelectionChange(data) {
    this.provinceTownSelected = data
    if (this.getSpeakAndLedTimeout) {
      clearTimeout(this.getSpeakAndLedTimeout)
      this.getSpeakAndLedTimeout = false
    }
    this.getSpeakAndLedTimeout = setTimeout(() => {
      this.getSpeakAndLedNumber(data)
    }, 500)
  }

  async getSpeakAndLedNumber(townsData) {
    let res
    if (!this.ledAndSpeakerData) {
      res = await fetch('http://10.148.83.228:8086/poi/entity/facilities/user/post/,/', {          
        mode: 'cors'
      })
      let resData: any = await res.json()
      this.ledAndSpeakerData = resData.tagObject
    }
    let data = this.ledAndSpeakerData
    this.ledCount = 0
    this.speakerCount = 0
    for (let item in townsData) {
      for (let ledItem of data.Led) {
        if (townsData[item] == ledItem.townId)
          this.ledCount++
      }
      for (let speakerItem of data.LoudSpeaker) {
        if (townsData[item] == speakerItem.townId)
          this.speakerCount++
      }
    }
  }

  async publishProvince() {
    let influence = []
    for (let i in this.provinceTownSelected) {
      let townId = Number(this.provinceTownSelected[i])
      // let districtCode = this.allTowns[townId].districtCode
      // influence.push(districtCode)
      influence.push(townId)
    }
    let msgs = []
    for (let opt of this.disastersPubwaysSelected) {
      msgs.push({
        channel: opt,
        msg: this.textOfProvince
      })
    }
    let params = {
      disaGroup: this.disasterTypeSelected,
      disaItem: this.subTypeSelected,
      disaLevel: Number(this.disasterLevelSelected),
      sourceId: 0,
      influenceArea: 100,
      msgs,
      cityId: 25,
      influence,
    }
    let data = await larnClient.publish(params)
    if (data) this.toggleOprateTip_global({ tip: true, text: '发布成功！' })
    else this.toggleOprateTip_global({ tip: true, text: '发布失败！' })
  }
  
}