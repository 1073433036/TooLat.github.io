import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './TyphGrapes.html?style=./TyphGrapes.scss'
import fetchJsonp from 'fetch-jsonp'
import moment from 'moment'
import { Helper } from "../../../util/Helper";
import { typhEleData, typhHourData, heightData } from "../../../config/grapesConfig";
import ModelAssess from "../../../util/modelAssess";
import { SmsClient } from "../../../util/clientHelper"

let rect = {
  top: 27,
  bottom: 10,
  left: 100,
  right: 125
},
  grapesImgLayer = null,
  tideRanges = [400, 300, 230, 180, 140, 100, 60, 20],
  typhNcinfoObject = null,
  tideForseeTime = null,
  tideImgLayer = null,
  affectTypeData: object = null

@WithRender
@Component
export default class TyphGrapes extends Vue {
  @Getter('systemStore/isClickingLastTyphPoint_global') isClickingLastTyphPoint_global
  @Getter('systemStore/typhClickingPos_global') typhClickingData_global
  @Getter('systemStore/typhClickPointIndex_global') typhClickPointIndex_global
  @Getter('systemStore/typhSelected_global') typhSelected_global
  @Getter('systemStore/typhGrapesPopup_global') typhGrapesPopup_global
  @Getter('systemStore/region_global') region_global
  @Action('systemStore/toggleTyphGrapesPopup_global') toggleTyphGrapesPopup_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Action('systemStore/changeTyphClickPointIndex_global') changeTyphClickPointIndex_global
  @Action('modelStore/addColorTable_global') addColorTable_global
  @Action('modelStore/deleteColorTable_global') deleteColorTable_global
  @Action('systemStore/manulChangeTyphClickIndex_global') manulChangeTyphClickIndex_global
  @Action('modelStore/storeModelData_global') storeModelData_global


  typhPointCount: number = 0
  loadingText = ''
  loading = false
  isTideColorTableOn = false
  hourSelectedWatchTimeout = null
  combinedList = []
  combinedListSelected = null
  typhHourData
  typhNullHeightData = [
    { text: '0', value: '0' }
  ]
  typhHeightHolder = [
    { text: '请选择', value: 'null' },
    { text: '0', value: '0' }
  ]
  typhEleData = typhEleData
  datetimeData = []
  forseeDatetime = ''
  typhName = ''
  typhNum = ''
  typhEnName = ''
  hourSelected = 0
  elementSelected = 't2mm'
  heightSelected = 'null'
  datetimeSelected = {
    text: '',
    value: ''
  }
  presentColorTable = null
  heightFactor = null
  widthFactor = null
  windCircleTabOption = []
  windLevelSelected = null
  windLevelData: number = null
  windDetailData: any = {}
  windDetailType: any = {}
  windDetailInfo: any = {}    //受影响单位企业详细信息
  isPublishPopupOn: boolean = false
  content: string = null

  getWindCircleTabOption() {
    let data = []
    if (this.typhClickingData_global.pointData.rr06)
      data.push({
        name: '六级风圈',
        value: this.typhClickingData_global.pointData.rr06,
        level: 6
      })
    if (this.typhClickingData_global.pointData.rr07)
      data.push({
        name: '七级风圈',
        value: this.typhClickingData_global.pointData.rr07,
        level: 7
      })
    if (this.typhClickingData_global.pointData.rr08)
      data.push({
        name: '八级风圈',
        value: this.typhClickingData_global.pointData.rr08,
        level: 8
      })
    if (this.typhClickingData_global.pointData.rr10)
      data.push({
        name: '十级风圈',
        value: this.typhClickingData_global.pointData.rr10,
        level: 10
      })
    this.windCircleTabOption = data
    if (data.length > 0) {
      let befLevel = this.windLevelSelected
      this.windLevelData = this.windCircleTabOption[this.windCircleTabOption.length - 1].value
      this.windLevelSelected = this.windCircleTabOption[this.windCircleTabOption.length - 1].level
      if (befLevel == this.windLevelSelected)
      this.getAffectedDetail(this.windLevelData)
    } else {
      this.windLevelSelected = null
      this.windLevelData = null
    }
  }

  mounted() {
    this.getWindCircleTabOption()
    // if (this.windCircleTabOption.length > 0)
    // this.getAffectedDetail(this.windLevelData)

    // computTyphDatetimeData.call(this)
    //   .then(() => {
    //     let mmt = moment(this.datetimeSelected.value)
    //     mmt.add(this.hourSelected + 8, 'hours')
    //     this.forseeDatetime = mmt.format('YYYY-MM-DD HH') + '时'
    //     mmt = null
    //   })
  }

  @Watch('windLevelSelected')
  onwindLevelSelectedChanged(val: any, oldVal: any): void {
    this.getAffectedDetail(this.windLevelData)
  }

  selectWindLevel(level, data) {
    console.info(level, data)
    this.windLevelData = data
    this.windLevelSelected = level
  }

  async getAffectedDetail(radius) {
    if (!radius) {
      this.windDetailData = {}
      return
    }
    let affectTypeUrl = 'http://10.148.83.228:8086/evaluate/get/typeinfo/user/post/,/'
    let detailUrl = `http://10.148.83.228:8086/evaluate/cal/user/post/,/post?cityId=24&countyId=58&centreX=${this.typhClickingData_global.pointData.degrees[0]}&centreY=${this.typhClickingData_global.pointData.degrees[1]}&radius=${Number(radius) }`
    let dataHolder = {}

    if (affectTypeData === null) {
      let res = await fetch(affectTypeUrl)
      let data = (await res.json()).tagObject
      affectTypeData = data
      this.windDetailType = data
      for (let i in affectTypeData) {
        if (Number(i) < 5) {
          delete affectTypeData[i]
        }
      }
    }

    for (let i in affectTypeData) {
      detailUrl += '&types[]=' + i
      dataHolder[i] = {
        name: affectTypeData[i].description + ' ' + '数量:',
        number: 0
      }
    }

    let msg = await fetch(detailUrl + `&cache=${Date.now()}`)
    let res: any = await msg.json()
    let data = res.tagObject
    this.windDetailInfo = data
    for (let key in data) {
      if (Number(key) < 100) dataHolder[key].number = data[key].length
      else {
        let unit = {
          100: '公顷',
          101: '人',
          102: '万元',
          103: '万元',
          104: '千瓦时',
          105: '公顷',
          106: '公顷',
          107: '公顷'
        }
        if (data[key] > 10000) {
          let val
          if (key === '102' || key === '103') {
            val = (data[key] / 10000).toFixed(2) + '亿元'
          } else {
            val = (data[key] / 10000).toFixed(2) + '万' + unit[key]
          }
          dataHolder[key].number = val
        } else {
          dataHolder[key].number = data[key] + unit[key]
        }
      }
    }

    this.windDetailData = {}
    this.windDetailData = dataHolder
  }

  togglePublishPopup() {
    if (!this.isPublishPopupOn) {
      let isAffected = false
      for (let i in this.windDetailData) {
        if (this.windDetailData[i].number !== 0) {
          isAffected = true
          break
        }
      }
      if (!isAffected) {
        this.toggleOprateTip_global({ tip: true, text: '无单位企业受该风圈影响！' })
        return
      }
    }
    this.isPublishPopupOn = !this.isPublishPopupOn
  }

  async publish() {
    if (!this.content) {
      this.toggleOprateTip_global({ tip: true, text: '发布内容不得为空！' })
      return
    }

    let phoneContacts = []
    for (let i in this.windDetailInfo) {
      let item = this.windDetailInfo[i]
      for (let opt of item) {
        let phone = opt.cellphone || opt.phone || opt.managercellphone;
        let man = opt.manager || opt.contact || opt.contacts || opt.helpman;
        phoneContacts.push({ phone, man, department: this.windDetailType[i].description })
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

  @Watch('typhClickingData_global')
  ontyphClickingData_globalChanged(val: any, oldVal: any): void {
    this.getWindCircleTabOption()
  }

  @Watch('datetimeSelected')
  ondatetimeSelectedChanged(val: any, oldVal: any): void {
    if (val.text.length > 0 && this.heightSelected !== 'null') {
      let datetimeString = null
      if (this.isClickingLastTyphPoint_global) {
        if (this.forseeDatetime.length === 0) return
        datetimeString = this.forseeDatetime.replace('时', ':00:00')
      } else {
        datetimeString = this.datetimeSelected.text.replace('时', ':00:00')
      }
      this.addGrapesImgLayer(datetimeString)
    }
  }

  @Watch('typhSelected_global')
  ontyphSelected_globalChanged(val: any, oldVal: any): void {
    this.toggleTyphGrapesPopup_global(false)
  }

  @Watch('hourSelected')
  onhourSelectedChanged(val: any, oldVal: any): void {
    this.forseeDatetime = moment(this.datetimeSelected.value).add(8 + this.hourSelected, 'hours').format('YYYY-MM-DD HH时')
    if (this.heightSelected === 'null') return

    if (this.hourSelectedWatchTimeout) {
      clearTimeout(this.hourSelectedWatchTimeout)
    }
    this.hourSelectedWatchTimeout = setTimeout(() => {
      let datetimeString = null
      if (this.isClickingLastTyphPoint_global) {
        if (this.hourSelected === 0) return
        datetimeString = this.forseeDatetime.replace('时', ':00:00')
      } else {
        datetimeString = this.datetimeSelected.text.replace('时', ':00:00')
      }
      this.addGrapesImgLayer(datetimeString)
      this.hourSelectedWatchTimeout = null
    }, 200)
  }

  @Watch('elementSelected')
  onelementSelectedChanged(val: any, oldVal: any): void {
    if (val === 'null') return
    let hasMultipleFlag = false

    for (let item of typhEleData) {
      if (item.value === val && item.hasMultipleHeight)
        hasMultipleFlag = true
    }
    if (hasMultipleFlag) {
      this.typhHeightHolder = heightData
      this.heightSelected = '1000'
    } else {
      this.typhHeightHolder = this.typhNullHeightData
      this.heightSelected = '0'
    }
  }

  @Watch('typhClickPointIndex_global')
  ontyphClickPointIndex_globalChanged(val: any, oldVal: any): void {
    this.datetimeSelected = this.datetimeData[val + 1]
    this.forseeDatetime = moment(this.datetimeSelected.value).add(this.hourSelected + 8, 'hours').format('YYYY-MM-DD HH时')
  }


  optionChange() {
    if (this.heightSelected === null) return
    setTimeout(() => {
      let datetimeString = null
      if (this.isClickingLastTyphPoint_global) {
        if (this.forseeDatetime.length === 0) return
        datetimeString = this.forseeDatetime.replace('时', ':00:00')
      } else {
        datetimeString = this.datetimeSelected.text.replace('时', ':00:00')
      }
      this.addGrapesImgLayer(datetimeString)
    }, 0)
  }

  async  addGrapesImgLayer(datetime) {
    this.addColorTable_global(this.elementSelected)
    if (this.presentColorTable && this.presentColorTable !== this.elementSelected) {
      let presentColorTable = this.presentColorTable
      this.deleteColorTable_global(presentColorTable)
    }
    setTimeout(() => {
      this.presentColorTable = this.elementSelected
    }, 0)

    this.loading = true
    this.loadingText = '正在加载图层'
    let params = {
      element: this.elementSelected,
      level: this.heightSelected,
      datetime: moment(datetime).subtract(8, 'hours').format('YYYY-MM-DD HH:mm:00')
    }

    let url = new URL('http://10.148.83.228:9020/data/getGrapes9kmPic')
    Object.keys(params).forEach(el => url.searchParams.append(el, params[el]))
    try {
      let res = await fetchJsonp(url.toString())
      let data = await res.json()
      this.loading = false
      if (!this.typhGrapesPopup_global) return

      if (data) {
        if (data.length <= 6) {
          this.toggleOprateTip_global({ tip: true, text: '当前时间没有grapes模式数据' })
          return
        }

        fetchJsonp(data.replace('JSON', 'JSONP').replace(/"/g, '').replace('/,,,,,/', `/${rect.left},${rect.right},${rect.top},${rect.bottom},2000,2000/`))
      } else {
        this.loading = false
        this.toggleOprateTip_global({ tip: true, text: '当前时间没有grapes模式数据' })
      }
    }
    catch (error) {
      this.loading = false
      this.toggleOprateTip_global({ tip: true, text: '当前时间没有grapes模式数据' })
    }
    window['png'] = (res) => {
      let helper = new Helper()
      this.loading = false
      if (grapesImgLayer)
        helper.removeImgLayer(grapesImgLayer)

      if (res.match('DB_ERROR')) {
        helper = null
        window['png'] = null
        return
      }
      let data = JSON.parse(res)
      for (let i in data[0]) {
        data = data[0][i]
      }
      grapesImgLayer = helper.addImgLayer('data:image/png;base64,' + data, rect)
      helper = null
      window['png'] = null
    }
  }

  // increat() {
  //   if (this.hourSelected === 72)
  //     return
  //   this.hourSelected++
  // }

  // decreat() {
  //   if (this.hourSelected === 1)
  //     return
  //   this.hourSelected--
  // }

  toggleTyphPoint(type) {
    if (type === 'next' && this.typhClickPointIndex_global !== this.typhPointCount) {
      this.manulChangeTyphClickIndex_global()
      this.changeTyphClickPointIndex_global(this.typhClickPointIndex_global + 1)
    }
    if (type === 'pre' && this.typhClickPointIndex_global != 0) {
      this.manulChangeTyphClickIndex_global()
      this.changeTyphClickPointIndex_global(this.typhClickPointIndex_global - 1)
    }
  }

  modelAnalysis() {
    this.storeModelData_global({ attr: 'isAnalysing', value: true })
    this.storeModelData_global({ attr: 'analysisType', value: 'tide' })
    this.loading = true
    this.loadingText = '正在加载风暴潮图层'
    if (tideImgLayer) {
      let helper = new Helper()
      helper.removeImgLayer(tideImgLayer)
      helper = null
    }
    tideAnalysis.call(this)
      .then(effectedTown => {
        this.loading = false
        if (!this.typhGrapesPopup_global) {
          this.storeModelData_global({ attr: 'townsIdList', value: [] })
          return
        }

        this.addColorTable_global('tide')
        this.storeModelData_global({ attr: 'townsIdList', value: effectedTown })
      })
      .catch(err => {
        this.loading = false
        this.storeModelData_global({ attr: 'townsIdList', value: [] })
      })

  }
}


async function computTyphDatetimeData() {
  let res = await fetch(`http://10.148.83.228:8921/typhoon/info/find?tsid=${this.typhSelected_global}`)
  let data = await res.json()

  this.typhName = (data[0].info && data[0].info.cname) ? data[0].info.cname : ''
  this.typhEnName = (data[0].info && data[0].info.ename) ? data[0].info.ename : ''
  this.typhNum = data[0].intlid
  let datetimeHolder = [
    { text: '请选择', value: 'null' }
  ]

  this.typhPointCount = 0
  data[0].real = []
  // data[0].real.forEach(el => {
  //   this.typhPointCount++
  //   let mmt = moment(el.time)
  //   let value = mmt.format('YYYY-MM-DD HH:00:00')
  //   mmt.add(8, 'hours')
  //   datetimeHolder.push({
  //     text: mmt.format('YYYY-MM-DD HH') + '时',
  //     value
  //   })
  // })

  this.datetimeData = datetimeHolder
  this.datetimeSelected = datetimeHolder[this.typhClickPointIndex_global + 1]
}

async function tideAnalysis() {
  let modelAccess = new ModelAssess(this.region_global)
  let data = await modelAccess.getTyphoonNc()

  if (!this.typhGrapesPopup_global) {
    this.storeModelData_global({ attr: 'townsIdList', value: [] })
    return
  }

  let fileName = analysisTideFile.call(this, data, this.typhSelected_global, new Date(this.datetimeSelected.value))
  console.info(fileName)
  if (!fileName) {
    this.toggleOprateTip_global({ tip: true, text: '当前台风点没有风暴潮模型文件' })
    throw 'has no file!'
  }

  let ncInfo = await modelAccess.getNcInfo('tide', fileName)
  console.info('ncInfo', ncInfo)
  if (!this.typhGrapesPopup_global) {
    this.storeModelData_global({ attr: 'townsIdList', value: [] })
    return
  }

  tideForseeTime = ncInfo.times
  typhNcinfoObject = ncInfo

  let imgData = await modelAccess.getModelImage(typhNcinfoObject, {})
  console.info(imgData)
  if (!this.typhGrapesPopup_global) {
    this.storeModelData_global({ attr: 'townsIdList', value: [] })
    return
  }

  let helper = new Helper()
  if (tideImgLayer) helper.removeImgLayer(tideImgLayer)
  tideImgLayer = helper.addImgLayer(imgData.imgSrc, {
    top: imgData.top,
    bottom: imgData.bottom,
    right: imgData.right,
    left: imgData.left
  })
  helper = null

  let effectedTown = await modelAccess.getTownsByRanges(tideRanges, ncInfo, {})

  return effectedTown
}

function analysisTideFile(fileString, tsId, dateTime) {
  let splitArray = fileString./*replace(/"/g, '').*/split(/\n/),
    hasFileName = false,
    fileNameArray = [],
    fileName = `tide${moment(this.datetimeSelected.value).format('YYYYMMDDHH0000')}.nc`

  splitArray.forEach(el => {
    let buffer = el.split(',')
    fileNameArray.push({
      id: buffer[0],
      file: buffer[2]
    })
  })
  for (let i in fileNameArray) {
    if (fileNameArray[i].id === tsId && fileNameArray[i].file === fileName) {
      hasFileName = true
      break
    }
  }
  fileNameArray = null

  if (hasFileName)
    return fileName
  else
    return false
}
