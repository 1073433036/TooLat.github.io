import axios from 'axios'
import qs from 'qs'
import jsonpAdapter from 'axios-jsonp'

let host = window.location.host
let flag = host === '113.108.192.98:8080' || host === '10.12.12.84:8080'

const baseUrl = flag ? ('http://' + host + '/sh/') : 'http://10.148.16.81:8080/sh/'
const publicUrl = flag ? ('http://' + host + '/projshare/') : 'http://10.148.83.228:2008/projshare/'
const dataunitUrl = flag ? ('http://' + host + '/dataunit/') : 'http://10.148.83.228:8922/dataunit/'
const ncUrl = flag ? ('http://' + host + '/nc/jsonp/') : 'http://10.148.83.228:9002/nc/jsonp/'
const typhUrl = flag ? ('http://' + host + '/typhoon/') : 'http://10.148.83.228:8921/typhoon/'
const stationUrl = flag ? ('http://' + host + '/station/') : 'http://10.148.83.228:8921/station/'
const timeout = 10000

const axiosHelper = async (url, t?) => {
  let res: any
  try { res = await axios({ url, timeout: t ? t : timeout }) }
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

const dataunitAxiosHelper = async url => {
  let res: any
  try { res = await axios({ url, timeout }) }
  catch (e) { return false }
  if (res.data) return res.data
  else return false
}

// 用户信息
export class userClient {
  static login (username: string, pwd: string) {
    let url =  `${baseUrl}user/login?name=${username}&pwd=${pwd}&cacheCtrl=${Date.now()}`
    return axiosHelper(url)
  }

  static logout (id: string) {
    let url = `${baseUrl}user/logout?id=${id}`
    return axiosHelper(url)
  }

  static getAllUsers () {
    let url = `${baseUrl}user/list/users?cacheCtrl=${Date.now()}`
    return axiosHelper(url)
  }

  static async addUser (user) {
    let url = `${baseUrl}user/add/user`
    return axiosPostHelper(url, user)
  }

  static updateUser (user) {
    let url = `${baseUrl}user/update/user`
    return axiosPostHelper(url, user)
  }

  static deleteUser (id: string) {
    let url = `${baseUrl}user/delete/user?id=${id}`
    return axiosHelper(url)
  }

  static ssoLogin (key) {
    let url = `${baseUrl}sso/get/login?key=${key}`
    return axiosHelper(url)
  }
}

// 用户功能模块权限
export class userModulesClient {
  static getUserModules () {
    let url = `${baseUrl}user/list/modules`
    return axiosHelper(url)
  }

  static saveUserModules (param) {
    let url = `${baseUrl}user/save/user/modules`
    return axiosPostHelper(url, param)
  }
}

// 用户阈值
export class userThresholdsClient {
  // 强降雨
  static getAllUsersThresholds () {
    let url = `${baseUrl}user/list/thresholds?cacheCtrl=${Date.now()}`
    return axiosHelper(url)
  }

  static getUserThreshold(userId) {
    let url = `${baseUrl}user/get/threshold?userId=${userId}&cacheCtrl=${Date.now()}`
    return axiosHelper(url)
  }

  static saveThreshold (param) {
    let url = `${baseUrl}user/save/threshold`
    return axiosPostHelper(url, param)
  }

  static deleteThreshold (id: number) {
    let url = `${baseUrl}user/delete/threshold?id=${id}`
    return axiosHelper(url)
  }

  // QPF
  static getAllQPFThresholds () {
    let url = `${baseUrl}qpfwarn/list/qpfWarn?cacheCtrl=${Date.now()}`
    return axiosHelper(url)
  }

  static getQPFThreshold(userId) {
    let url = `${baseUrl}qpfwarn/get/qpfWarn?userId=${userId}&cacheCtrl=${Date.now()}`
    return axiosHelper(url)
  }

  static saveQPFThreshold (param) {
    let url = `${baseUrl}qpfwarn/save/qpfWarn`
    return axiosPostHelper(url, param)
  }

  static deleteQPFThreshold (id: number) {
    let url = `${baseUrl}qpfwarn/delete/qpfWarn?id=${id}`
    return axiosHelper(url)
  }

  // 强回波
  static getAllCappiThresholds () {
    let url = `${baseUrl}echo/list/echoes?cacheCtrl=${Date.now()}`
    return axiosHelper(url)
  }

  static getCappiThresholds (userId) {
    let url = `${baseUrl}echo/get/echo?userId=${userId}&cacheCtrl=${Date.now()}`
    return axiosHelper(url)
  }

  static saveCappiThresholds (param) {
    let url = `${baseUrl}echo/save/echo`
    return axiosPostHelper(url, param)
  }

  static deleteCappiThresholds (id) {
    let url = `${baseUrl}echo/delete/echo?id=${id}`
    return axiosHelper(url)
  }

  // 大风
  static getAllWindThresholds () {
    let url = `${baseUrl}windWarn/list/windWarns?cacheCtrl=${Date.now()}`
    return axiosHelper(url)
  }

  static getWindThresholds (userId) {
    let url = `${baseUrl}windWarn/get/windWarn?userId=${userId}&cacheCtrl=${Date.now()}`
    return axiosHelper(url)
  }

  static saveWindThresholds (param) {
    let url = `${baseUrl}windWarn/save/windWarn`
    return axiosPostHelper(url, param)
  }

  static deleteWindThresholds (id) {
    let url = `${baseUrl}windWarn/delete/windWarn?id=${id}`
    return axiosHelper(url)
  }
}

// 地理信息
export class geoClient {
  static getProv () {
    let url = publicUrl + 'geo/get/prov'
    return axiosHelper(url)
  }

  static getAllCities () {
    let url = publicUrl + 'geo/get/cities'
    return axiosHelper(url)
  }

  static findCity (cityId: number) {
    // let url = `${publicUrl}geo/find/city/cityid?cityId=${cityId}`
    let url = `${publicUrl}geo/find/citytwo/cityid?cityId=${cityId}`
    return axiosHelper(url)
  }

  static getAllCounties(cityId: number) {
    let url = `${publicUrl}geo/find/counties/cityid?cityId=${cityId}`
    return axiosHelper(url)
  }

  static findCounty (countyId: number) {
    let url = `${publicUrl}geo/find/county/countyid?countyId=${countyId}`
    return axiosHelper(url)
  }
}

// 自动站信息
export class productClient {
  static findStationInfo (type: string, city: string) {
    let stationType
    if (type === 'a') stationType = 'A'
    else stationType = 'B'
    let url = stationUrl + `info/find?types=${stationType}&province=${encodeURIComponent('广东')}` + (city ? `&city=${encodeURIComponent(city)}` : '') + `&_=${Date.now()}`
    return dataunitAxiosHelper(url)
  }

  // static findStationInfo (type: string, city: string) {
  //   let url = `${publicUrl}station/get/stationinfo/${type}` + (city ? `?city=${encodeURIComponent(city)}&` : '?') + `cacheCtrl=${Date.now()}`
  //   return axiosHelper(url)
  // }

  static findStationData (type: string, datetime: string, city: string) {
    let stationType
    if (type === 'a') stationType = 'A'
    else stationType = 'B'
    let url = stationUrl + `real/find?types=${stationType}&datetime=${datetime}&province=${encodeURIComponent('广东')}` + (city ? `&city=${encodeURIComponent(city)}` : '') + `&_=${Date.now()}`
    return dataunitAxiosHelper(url)
  }

  // static findStationData (type: string, datetime: string, city: string) {
  //   let url = `${publicUrl}station/get/stationdata/${type}?datetime=${datetime}` + (city ? `&city=${encodeURIComponent(city)}` : '') + `&cacheCtrl=${Date.now()}`
  //   return axiosHelper(url)
  // }

  static findStationTableData(stationid: string, from: string, to: string) {
    let url = stationUrl + `real/find_TimeRange?station_id=${stationid}&starttime=${from}&endtime=${to}&_=${Date.now()}`
    return dataunitAxiosHelper(url)
  }

  // static findStationTableData(stationid: string, from: string, to: string) {
  //   let url = `${dataunitUrl}station/findStationData_TimeRange?station_ids[]=${stationid}&starttime=${from}&endtime=${to}&cacheCtrl=${Date.now()}`
  //   return dataunitAxiosHelper(url)
  // }
}

// swan
export class swanClient {
  static findTemporaryData (datetime: string, type, level, element, time) {
    let url = `${dataunitUrl}temporary/findTemporaryData_ClipGrid?datetime=${datetime}&type=${type}&level=${level}&element=${element}&time=${time}`
      + '&grid_skip_x=0&grid_skip_y=0&grid_limit_x=99&grid_limit_y=99&grid_every_x=10&grid_every_y=10'
    return dataunitAxiosHelper(url)
  }
}

// 水文
export class hydrologyClient {
  static getInfo(type: 'reservoirs' | 'rivers') {
    let url = `${publicUrl}hydrology/get/info/${type}?cacheCtrl=${Date.now()}`
    return axiosHelper(url, 15000)
  }

  static getHistory(type: 'reservoirs' | 'rivers', time: string) {
    let url = `${publicUrl}hydrology/get/history/${type}?datetime=${time}&cacheCtrl=${Date.now()}`
    return axiosHelper(url, 15000)
  }

  static getFluctuate(type: 'reservoirs' | 'rivers', startTime: string, endTime: string) {
    let url = `${publicUrl}hydrology/get/fluctuate/${type}?start=${startTime}&end=${endTime}&cacheCtrl=${Date.now()}`
    return axiosHelper(url, 15000)
  }
}

// 风廓线
export class windProfileClient {

  static getRatarStations() {
    let url = publicUrl +  "radar/get/info"
    return axiosHelper(url)
  }

  static async getRatarData(dateTime: string, ratarStationId: string, ratarType: string) {
    let url = publicUrl + `radar/get/data/mult?datetime=${dateTime}&interval=30&num=11&obtid=${ratarStationId}&proid=${ratarType}`
    console.log(url)
    return axiosHelper(url)
  }

  static get () {
    let url = `&cacheCtrl=${Date.now()}`
    return axiosHelper(url)
  }

  static getRadarByHeight(height: number, proid: string, time: string) {
    let url = baseUrl + `radar/get/level?height=${height}&proid=${proid}&datetime=${time}`
    console.log(url)
    return axiosHelper(url)
  }
}

// 台风
export class typhoonClient {
  static findTyphoonInfo (key?) {
    let suffix = ''
    if (key) {
      if (isNaN(key)) suffix = '?cname=' + key
      else if (key.length === 4) suffix = '?intlid=' + key
      else suffix = '?tsid=' + key
    }
    let url = `${typhUrl}info/find${suffix}`
    return dataunitAxiosHelper(url)
  }

  static getTyphoon(fcid: string, tsid: number) {
    let url = `${typhUrl}findForecastReal?tsid=${tsid}&fcid=${fcid}`
    return dataunitAxiosHelper(url)
  }

  static matchingTyph (tsid: number, angle, anglediff, speed, speeddiff, strength) {
    let url = `${typhUrl}matchTyphoon?tsid=${tsid}&w_windspeed=${strength}&w_speed=${speed}&w_direction=${angle}&w_speed_change=${speeddiff}&w_direction_change=${anglediff}&cacheCtrl=${Date.now()}`
    return dataunitAxiosHelper(url)
  }
}

//风险预警
export class riskWarningClient {

  static async getQPFMessageData(dateTime: string, timeType: number) {
    let url = baseUrl + `qpf/get/forerain?datetime=${dateTime}&hour=${timeType}`
    return axiosHelper(url, 7000)
  }


  //最新的地质图, 山洪图, 流域图, 获取边界
  static async getGeoLocationDisterData(dateTime: string, leadtime: number, urlChar: string) {
    let url = publicUrl + `hazard/get/${urlChar}?datetime=${dateTime}&leadtime=${leadtime}`
    return axiosHelper(url)
  }


  //获取对应时效的地质图, 山洪图, 流域图的地址
  static async getGeoDisterProductData(urlChar: string, dateTime: string, leadtime: number, left: number, right: number, top: number, bottom: number, width: number, height: number) {

    let url = publicUrl + `hazard/get/${urlChar}?datetime=${dateTime}&leadtime=${leadtime}&left=${left}&right=${right}&top=${top}&bottom=${bottom}&width=${width}&height=${height}`
    return url;
  }

  //获取隐患点数据(type: 9 ->拿灾害点, cityId: 先看用户 countyid不为0, 拿到数据后,筛选对应的值, 为0, 直接获取整个城市的值)
  static async getRiskPointsData(type: number, cityId: number) {
    let url = publicUrl + `assistplace/query/all/condition?type=${type}&cityId=${cityId}`;
    return axiosHelper(url);
  }

  static async imgUrlIsExit(url: string) {
    try {
      let res = await axios(url);
      let flag = res.status === 200 ? true : false
      return flag;
    }
    catch(e) {
      //throw 'failed';
      return false;
    }
  }
}

//预警分析
export class warningAnalysisClient{

  //获取预警信号
  static async  getWaningMessage(areaStr: string) {
    let url = baseUrl + 'effect/get/warning'
    return axiosHelper(url)
  }

  //获取 雨量 统计 列表 ( 拿最后一个数据)
  static async  getMeteoList() {
    let  url = ncUrl + "list/meteohist_nc"
    let res: any = await axios({ url: url, adapter: jsonpAdapter, timeout: timeout })
    if (res.status === 200) return res.data
    else return false
  }

  //获取 雨量统计 列表拿最后一个数据 拼接
  static async  getMeteoInfoData(fileName: string) {
    let  url = ncUrl + "ncinfo?&modelName=meteohist_nc&fileName=" + fileName
    let res: any = await axios({ url: url, adapter: jsonpAdapter, timeout: timeout })
    if (res.status === 200) return res.data
    else return false
  }

  //获取 雨量统计 根据Info 拿到对应时间段的 小时统计
  static async  getMeteoRainsData(modelName: string, filePath: string, fileName: string, level: number, seledTime: string) {
    let  url = ncUrl + `nc/data/area?&modelName=${modelName}&filepath=${filePath}&filename=${fileName}&seledLevel=${level}&seledTime=${seledTime}&seledVar=rain`
    let res: any = await axios({ url: url, adapter: jsonpAdapter, timeout: timeout })
    if (res.status === 200) return res.data
    else return false
  }

  /** 预警提醒模块 */

  //  强回波
  //获取用户的自定义阈值
  static async getstrongEchoCustomThreshold(userId: string) {
    let url: string = baseUrl + `echo/get/echo?userId=${userId}`
    return axiosHelper(url);
  }
  //获取地区相关的预警信息提醒
  static async getstrongEchoData(userId: string, dateTime: string) {
    let url: string = baseUrl + `warningAlert/get/echo?userid=${userId}&datetime=${dateTime}`
    return axiosHelper(url);
  }
  //QPF
  //获取用户的自定义阈值
  static async getstrongQPFThreshold(userId: string) {
    let url: string = baseUrl + `qpfwarn/get/qpfWarn?userId=${userId}`
    return axiosHelper(url);
  }
  //获取地区相关的预警信息提醒
  static async getQPFData(userId: string, dateTime: string) {
    let url: string = baseUrl + `warningAlert/get/qpf?userid=${userId}&datetime=${dateTime}`
    return axiosHelper(url);
  }

  // urlChar: echo -> 强回波; qpf-> QPF
  static async getWainingRemindData(urlChar: string, userId: string, dateTime: string) {
    let url: string = baseUrl + `warningAlert/get/${urlChar}?userid=${userId}&datetime=${dateTime}`
    let res: any
    try { res = await axios({ url, timeout }) }
    catch (e) { return false }
    if (res.data.result === 'S_OK') return res.data.tagObject
    else if (res.status === 200) return res.data.description
    else return false
    // return axiosHelper(url);
  }

}

//卫星云图
export class satilliteCloudClient {
  static async getsatilliteCloudPicturesWith(dateTime: string) {
    let res: any = await axios.post(publicUrl + `fileproduct/get/cloud/filenames?datetime=`+dateTime)
    if (res.status === 200) return res.data
    else return false
  }

  static async getImgMessageWith(imgScr: string) {
    let res: any = await axios(imgScr)
    if (res.status === 200) return res.data
    else return false
  }
}

//地质灾害
export class geoDisaterClient {

  static async getGeoDisterDataNewestTime() {
    let url = publicUrl + `fileproduct/get/geohazard/newfile/time`
    return axiosHelper(url)
  }

  static async getGeoDisterData(dateTime: string) {
    let url = publicUrl + `fileproduct/get/geohazard/file?datetime=${dateTime}`
    let res: any = await axios.post(url)
    if (res.status === 200 && res.data.result === 'S_OK') return res.data
    else return false
  }
}

//应急响应
export class emergResponseClient {
  static async getEmergResponseData(dateTime: string) {
    let urlStr = baseUrl + `effect/get/signalByTime?time=${dateTime}`
    console.log(urlStr)
    return axiosHelper(urlStr, 20000)
  }

  /*  //下面数据只拿  台风: V_TFLEV、暴雨: V_BYLEV、冰雹: V_BBLEV、雷雨大风: V_LYLEV
   {
     V_CITY: "韶关",                          //所属地市
     VF01015_CN: "乐昌",                      //站名(中文)
     DDATETIME: "2017-11-17 03:05:00.0",     //资料时间
     C_FYYYY: "2017",
     C_FMM: "11",
     C_FDD: "17",
     V_FHM: "305",
     V_TFLEV: "0",         //台风预警级别 (0 - 5)
     C_TFSTA: "NULL",      //台风预警状态 (ON/OFF/NULL)
     C_TFCLT: "9999",      //台风预警解除时间（年月日时分） (eg: 201711270647, 缺省用为9999)
     V_BYLEV: "0",         //暴雨预警级别
     C_BYSTA: "NULL",
     C_BYCLT: "9999",
     V_LYLEV: "0",         //雷雨大风预警级别
     C_LYSTA: "NULL",
     C_LYCLT: "9999",
     V_GWLEV: "0",         //高温预警级别
     C_GWSTA: "NULL",
     C_GWCLT: "9999",
     V_HLLEV: "3",         //寒冷预警级别
     C_HLSTA: "OFF",
     C_HLCLT: "201711270308",
     V_HMLEV: "0",        //灰霾预警级别
     C_HMSTA: "NULL",
     C_HMCLT: "9999",
     V_DWLEV: "0",        //大雾预警级别
     C_DWSTA: "NULL",
     C_DWCLT: "9999",
     V_JBLEV: "0",        //道路结冰预警级别
     C_JBSTA: "NULL",
     C_JBCLT: "9999",
     V_BBLEV: "0",        //冰雹预警级别
     C_BBSTA: "NULL",
     C_BBCLT: "9999",
     V_SLLEV: "0",        //森林火险预警级别
     C_SLSTA: "NULL",
     C_SLCLT: "9999",
     V01301: "57988",
     V05001: "25.15",
     V06001: "113.35"
   }
  * */

}
