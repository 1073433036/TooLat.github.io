import axios from 'axios'
import jsonp from 'axios-jsonp'
import qs from 'qs'

const baseUrl = 'http://10.148.83.86:8080/JYTY/'      // 揭阳项目服务接口
const publicUrl = 'http://10.148.83.228:2008/projshare/'   // 项目公用服务接口
const dataunitUrl = 'http://10.148.83.228:8921/'  // 大数据服务接口
const ncBaseUrl = 'http://10.148.83.228:9002/',
      ncBaseUrl_9020 = 'http://10.148.83.228:9020/'   // NC
let timeout = 5000

const axiosHelper = async url => {
  let res: any
  try { res = await axios({ url, timeout }) }
  catch (e) { return false }
  if (res.data.result === 'S_OK') return res.data.tagObject
  else return false
}

const axiosPostHelper = async (url, param) => {
  let res: any
  try { res = await axios({
      url,
      method: 'post',
      data: JSON.stringify(param),
      timeout,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  catch (e) { return false }
  if (res.data.result === 'S_OK') return res.data.tagObject
  else return false
}

const axiosFormDataHelper = async (url, param) => {
  let res: any
  try { res = await axios({
      url,
      method: 'post',
      data: param,
      timeout
    })
  }
  catch (e) { return false }
  if (res.data.result === 'S_OK') return res.data.tagObject
  else return false
}

const axiosFormPostHelper = async (url, param) => {
  let res: any
  try { res = await axios({
      url,
      method: 'post',
      data: qs.stringify(param),
      timeout,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  }
  catch (e) { return false }
  if (res.data.result === 'S_OK') return res.data.tagObject
  else return false
}

const dataunitAxiosHelper = async url => {
  let res: any
  try { res = await axios({ url, timeout }) }
  catch (e) { return false }
  if (res.data) return res.data
  else return false
}

const axiosJsonpHelper = async url => {
  let res: any
  try { res = await axios({ url, timeout, adapter: jsonp }) }
  catch (e) { return false }
  if (res.data) return res.data
  else return false
}

const CacheCtrl = () => `_=${Date.now()}`
const transformOptionalParam = param => {
  let string = ''
  for (let i in param)
    string += '&' + i + '=' + param[i]
  return string
}

// 地理信息
export class geoClient {
  static findCity (cityId: number) {
    // let url = publicUrl + `geo/find/city/cityid?cityId=${cityId}`
    let url = publicUrl + `geo/find/citytwo/cityid?cityId=${cityId}`
    return axiosHelper(url)
  }

  static findCounties (cityId: number) {
    let url = publicUrl + `geo/find/counties/cityid?cityId=${cityId}`
    return axiosHelper(url)
  }

  static regeo (lon, lat) {
    let url = `http://restapi.amap.com/v3/geocode/regeo?key=67fbfcb22d9900a94cc95af73378c865`
      + `&location=${lon},${lat}&extensions=base&batch=false&roadlevel=1`
    return axiosJsonpHelper(url)
  }
}

// 灾情模拟
export class disasterSimulateClient {
  static getSimulatePoint (param) {
    let suffix = transformOptionalParam(param)
    let url = publicUrl + `simulate/get/all?${CacheCtrl()}${suffix}`
    return axiosHelper(url)
  }

  static addSimulatePoint (param) {
    let suffix = transformOptionalParam(param).slice(1)
    let url = publicUrl + `simulate/add?${suffix}`
    return axiosHelper(url)
  }

  static delSimulatePoint (id) {
    let url = publicUrl + `simulate/delete?id=${id}`
    return axiosHelper(url)
  }

  // 燃烧系数
  static getCombustible () {
    let url = ncBaseUrl_9020 + `data/getCombustible`
    return axiosJsonpHelper(url)
  }

  // 燃烧速度
  static getSpeed (lon, lat) {
    let url = ncBaseUrl_9020 + `dao/getR0Ks?lon=${lon}&lat=${lat}`
    return axiosJsonpHelper(url)
  }

  static getFireSmlFile (lon, lat, factor, speed) {
    let url = ncBaseUrl_9020 + `dao/point?lon=${lon}&lat=${lat}&Ks=${factor}&R0=${speed}`
    return axiosJsonpHelper(url)
  }

  // 污染扩散 - 风速风向
  static getWindInfo (lon, lat) {
    let url = ncBaseUrl_9020 + `data/p0?lon=${lon}&lat=${lat}`
    return axiosJsonpHelper(url)
  }
}

// 基础信息点
export class assistClient {
  /**
   * @param type
   * 0-all
   * 1-chemical-危化品点
   * 2-economy-人口经济
   * 3-hospital-医疗设施
   * 4-material-应急物资
   * 5-rescueteam-救援队
   * 6-school-学校设施
   * 7-shelter-避难所
   * 8-experts-专家库
   * 9-geohazard-灾害点
   */
  static findAssistplace (type: number, cityId: number, category?: string) {
    let categoryString = category ? `&category=${category}` : ''
    let url = publicUrl + `assistplace/query/all/condition?type=${type}&cityId=${cityId}${categoryString}`
    return axiosHelper(url)
  }

  static findServicePoi () {
    let url = baseUrl + `stationinfo/select`
    return axiosPostHelper(url, {})
  }

  static findBuildingPoi () {
    let url = baseUrl + `building/select`
    return axiosPostHelper(url, {})
  }
}

// 灾害分析
export class disasterClient {
  static getAnaylsisBySelectDate (param) {
    let url = baseUrl + 'disasteranalysis/selectDate/description'
    return axiosPostHelper(url, param)
  }

  static getAnalysisLatest (cityid: number, countyid?: number, townid?: number) {
    let url = baseUrl + `disasteranalysis/selectLatest?cityid=${cityid}&countyid=${countyid}&townid=${townid}`
    return axiosHelper(url)
  }

  static async downAnalysisFile (param) {
    let url = baseUrl + 'disasteranalysis/selectDate/downfile'
    return axiosPostHelper(url, param)
  }
}

// 站点实况
export class stationClient {
  static findStationInfo (type: string, city?: string, county?: string) {
    let citySuffix = city ? '&city=' + encodeURIComponent(city) : ''
    let countySuffix = county ? '&county=' + encodeURIComponent(county) : ''
    let url = dataunitUrl + `station/info/find?types=${type}${citySuffix}${countySuffix}&${CacheCtrl()}`
    return dataunitAxiosHelper(url)
  }

  static findStationData (datetime: string, type: string, city?: string, county?: string) {
    let citySuffix = city ? '&city=' + encodeURIComponent(city) : ''
    let countySuffix = county ? '&county=' + encodeURIComponent(county) : ''
    let url = dataunitUrl + `station/real/find?datetime=${datetime}&types=${type}&province=广东${citySuffix}${countySuffix}&${CacheCtrl()}`
    return dataunitAxiosHelper(url)
  }
}

// 水文
export class hydrologyClient {
  static getInfo (type: 'reservoirs' | 'rivers') {
    let url = publicUrl + `hydrology/get/info/${type}?${CacheCtrl()}`
    return axiosHelper(url)
  }

  static getHistory (type: 'reservoirs' | 'rivers', time: string) {
    let url = publicUrl + `hydrology/get/history/${type}?datetime=${time}&${CacheCtrl()}`
    return axiosHelper(url)
  }

  static getFluctuate (type: 'reservoirs' | 'rivers', startTime: string, endTime: string) {
    let url = publicUrl + `hydrology/get/fluctuate/${type}?startTime=${startTime}&endTime=${endTime}&${CacheCtrl()}`
    return axiosHelper(url)
  }
}

// 台风
export class typhoonClient {
  static findTyphoonInfo (key?) {
    let suffix = ''
    if (key) {
      if (isNaN(key)) suffix = '&cname=' + key
      else if (key.length === 4) suffix = '&intlid=' + key
      else suffix = '&tsid=' + key
    }
    let url = dataunitUrl + `typhoon/info/find?fcid=BCGZ${suffix}`
    return dataunitAxiosHelper(url)
  }

  static getTyphoon(tsid: number, fcid: string = 'BCGZ') {
    let url = dataunitUrl + `typhoon/findForecastReal?tsid=${tsid}&fcid=${fcid}`
    return dataunitAxiosHelper(url)
  }

  static matchingTyph (tsid: number, angle: number = 30, anglediff: number = 30, speed: number = 30, speeddiff: number = 30, strength: number = 30) {
    let url = dataunitUrl + `typhoon/matchTyphoon?tsid=${tsid}&w_windspeed=${strength}&w_speed=${speed}&w_direction=${angle}&w_speed_change=${speeddiff}&w_direction_change=${anglediff}&cacheCtrl=${Date.now()}`
    return dataunitAxiosHelper(url)
  }

  static findPointInCircle (lon, lat, radius) {
    let url = baseUrl + `findpoint/findPointInCircle?lon=${lon}&lat=${lat}&radius=${radius}`
    return axiosHelper(url)
  }
}

// 灾害监测
export class disasterMoniterClient {
  static selectByGeoId (type: 'torrent' | 'waterlog' | 'geol', cityid: number, countyid?: number, townid?: number) {
    let countyString = countyid ? '&countyid=' + countyid : ''
    let townString = townid ? '&townid=' + townid : ''
    let url = baseUrl + `${type}/selectByGeoId?cityid=${cityid}${countyString}${townString}`
    return axiosHelper(url)
  }

  static getNcFileInfo (cityId: number, time: string) {
    let url = ncBaseUrl + `nc/jsonp/ncinfo?modelName=meteohist_nc&fileName=meteohist${time}.nc&cityId=${cityId}`
    return axiosJsonpHelper(url)
  }

  static getPassRain (cityId: number, lon: number, lat: number, filepath: string, filename: string) {
    let url = ncBaseUrl + `nc/jsonp/nc/data/point?seledLon=${lon}&seledLat=${lat}&seledLevel=0&seledVar=rain&cityId=${cityId}&modelName=meteohist_nc&filepath=${filepath}&filename=${filename}`
    return axiosJsonpHelper(url)
  }

  static getForecastRain (lon: number, lat: number, starttime: string, endtime: string) {
    let url = `http://10.148.83.221:8086/di/grid.action?userId=gmcrzj_sx&pwd=zhanj_sx123&dataFormat=json&interfaceId=intGetDataTimeSerial&modelid=grapes9km&element=lspe&level=0&starttime=${starttime}&endtime=${endtime}&lon=${lon}&lat=${lat}`
    return dataunitAxiosHelper(url)
  }

  static getForestPoi () {
    let url = baseUrl + `forest/select`
    return axiosPostHelper(url, {})
  }
}

// Ais 船舶信息服务接口
export class shipClient {
  // 获取当前时间的船舶信息
  static getCurrentShip(latStart: number, latEnd: number, lonStart: number, lonEnd: number) {
    let url = publicUrl + `ais/get/ship/current?latStart=${latStart}&latEnd=${latEnd}&lonStart=${lonStart}&lonEnd=${lonEnd}&${CacheCtrl()}`
    return axiosHelper(url)
  }

  // 获取指定时间的船舶信息
  static getShip(time: string, latStart: number, latEnd: number, lonStart: number, lonEnd: number) {
    let url = publicUrl + `ais/get/ship?time=${time}&latStart=${latStart}&latEnd=${latEnd}&lonStart=${lonStart}&lonEnd=${lonEnd}&${CacheCtrl()}`
    return axiosHelper(url)
  }
}

// 天气推演  // 格点预报接口
export class weatherForecastClient {
  // 获取GrapesUV数据（北京时）
  static getWindField(date: string) {
    let url = publicUrl + `grid/grapes/uv/zh?datetime=${date}&${CacheCtrl()}`
    return axiosHelper(url)
  }

  // 获取qpf预报数据
  static getRainField(date: string, leadtime: number) {
    let url = publicUrl + `grid/qpf?startTime=${date}&leadTime=${leadtime}&${CacheCtrl()}`
    return axiosHelper(url)
  }

  // 获取最新qpf预报数据
  static getLastRainField (leadTime: number = 60) {
    let url = publicUrl + `grid/qpf/last?leadTime=${leadTime}&${CacheCtrl()}`
    return axiosHelper(url)
  }
}

// 视频
export class videoClient {
  static findVideoInfo () {

  }
}

// 直播
export class RtmpClient {
  static async getLiveRoomList() {
    let url = baseUrl + `zhibojianinfo/selectZhibojianInfo?${CacheCtrl()}`
    return axiosHelper(url)
  }
}

// 自动预警
export class warningClient {
  static async getTyphoonWarning(left: number, right: number, top: number, bottom: number) {
    let url = baseUrl + `typhoonwarning/get?left=${left}&right=${right}&top=${top}&bottom=${bottom}&${CacheCtrl()}`
    return axiosHelper(url)
  }

  static async getTorrentwarning() {
    let url = baseUrl + `torrentwarning/selectLatest?${CacheCtrl()}`
    return axiosHelper(url)
  }

  static async getGeolWarning() {
    let url = baseUrl + `geolwarning/selectLatest?${CacheCtrl()}`
    return axiosHelper(url)
  }

  static async getWaterlogWarning() {
    let url = baseUrl + `waterlogwarning/selectLatest?${CacheCtrl()}`
    return axiosHelper(url)
  }
}

// 预案
export class plansClient {
  static async getEmergencyType() {
    let url = baseUrl + `emergencyType/get/maxEmergencyTypeInfo?${CacheCtrl()}`
    return axiosHelper(url)
  }

  static async getdetailEmergencyType(id: number) {
    let url = baseUrl + `emergencyType/get/midEmergencyTypeInfo?id=${id}&${CacheCtrl()}`
    return axiosHelper(url)
  }

  static async getPlansOnline(param) {
    let url = baseUrl + `plansOnline/get`
    return axiosFormPostHelper(url, param)
  }

  static async startPlansOnline(param) {
    let url = baseUrl + `plansOnline/start`
    return axiosFormDataHelper(url, param)
  }

  static async updatePlansOnline(param) {
    let url = baseUrl + `plansOnline/update`
    return axiosFormDataHelper(url, param)
  }

  static async getPlanmemo() {
    let url = baseUrl + `planmemo/select`
    return axiosPostHelper(url, {})
  }

  static async getPlanmeasure(e_name) {
    let url = baseUrl + `planmeasure/select`
    return axiosFormPostHelper(url, { e_name })
  }
}

// 省突
export class releaseClient {
  // 部门信息管理 - 查询部门信息
  static async getDepartment() {
    let url = baseUrl + `department/select`
    return axiosHelper(url)
  }

  // 部门负责人信息 - 获取部门负责人信息
  static async getDepartmenthead() {
    let url = baseUrl + `departmenthead/select`
    return axiosPostHelper(url, {})
  }

  // 省突相关接口 - 靶向发布 - 新建靶向发布信息
  static async targetedRelease(param) {
    let url = baseUrl + `targeted/insert`
    return axiosPostHelper(url, param)
  }


  // 省突相关接口 - 省突发布 - 新建省突发布信息
  static async provinceRelease(param) {
    let url = baseUrl + `provEmergency/insert`
    return axiosPostHelper(url, param)
  }

  // 发送内容到手机号码
  static async sendMsgToDetail(msg, phones) {
    let phoneString = phones.join(',')
    let url = baseUrl + `channel/set/message?message=${msg}&numbers=${phoneString}`
    let res: any
    try { res = await axios({ url, timeout }) }
    catch (e) { return false }
    return true
  }
}

// 研判
export class yanpanClient {
  // web应急处置 - 事件研判 - 获取结果
  static async getResult(lon: number, lat: number) {
    let url = baseUrl + `yanpanservice/getResult?lon=${lon}&lat=${lat}&${CacheCtrl()}`
    return axiosHelper(url)
  }

  // APP灾情上报 - 获取灾情上报最新更新时间
  static async getDealTime() {
    let url = baseUrl + `disareportapp/selectLastest`
    return axiosPostHelper(url, {})
  }

  // web应急处置 - 启动
  static async startDeal(param) {
    let url = baseUrl + `yingjidealservice/start`
    return axiosFormPostHelper(url, param)
  }

  // web应急处置 - 获取
  static async getDeal(param) {
    let url = baseUrl + `yingjidealservice/get`
    return axiosFormPostHelper(url, param)
  }

  // web应急处置 - 结束
  static async finishDeal(param) {
    let url = baseUrl + `yingjidealservice/end`
    return axiosFormPostHelper(url, param)
  }
}
