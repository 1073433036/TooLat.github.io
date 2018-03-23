// import fetchJsonp from 'fetch-jsonp'
import moment from 'moment'
import axios from 'axios'
import jsonpAdapter from 'axios-jsonp'

let baseUrl = 'http://10.148.16.216:11160/renyin5/'

export class userClient {
  static async login(username: string, pwd: string) {       //登录
    // let res = await fetchJsonp(baseUrl + `webuser/login?username=${username}&password=${pwd}`)
    // let msg: any = await res.json()
    // if (msg.stateCode == 0) {
    //   // return true
    //   return msg.data
    // } else {
    //   return false
    // }
    let msg: any = await axios({
      url: baseUrl + `webuser/login?username=${username}&password=${pwd}`,
      adapter: jsonpAdapter,
    })
    if (msg.status === 200 && msg.data.stateCode === 0)  return msg.data.data
    else  return false
  }

  static async register(userid: string,username: string,password: string,power: string,provinceid: string,cityid: string,countyid: string,provincename: string,cityname: string,countyname: string) {        //注册
    // let res = await fetchJsonp(baseUrl + `webuser/regist?userid=${userid}&username=${username}&password=${password}&power=${power}&provinceid==${provinceid}&cityid==${cityid}&countyid==${countyid}&provincename==${provincename}&cityname=${cityname}&countyname==${countyname}&callback=`)
    // let data: any = await res.json()
   }
}

export class combinationClient {
  static async getMenu() {
    // let res = await fetchJsonp(baseUrl + `combination/select`)
    // let msg: any = await res.json()
    // if (msg.stateCode == 0)
    //   return msg.data
    // else
    //   return false
    let res: any = await axios({ 
      url: baseUrl + `combination/select`, 
      adapter: jsonpAdapter,
    })
    if (res.status === 200 && res.data.stateCode === 0) return res.data.data
    else return false
  }
}

//工具栏 
export class toolbarClient {
  static async getAirports() {      //机场
    // let res = await fetchJsonp(baseUrl + `conn/airports`)
    // let msg: any = await res.json()
    // return msg
    let res: any = await axios({ 
      url: baseUrl + `conn/airports`, 
      adapter: jsonpAdapter,
    })
    if (res.status === 200) return res.data
    else return false
  }

  static async getAirspace() {  //飞行区域
    // let res = await fetchJsonp(baseUrl + `conn/ryareas`)
    // let msg: any = await res.json()
    // return msg
    let res: any = await axios({ 
      url: baseUrl + `conn/ryareas`, 
      adapter: jsonpAdapter,
    })
    if (res.status === 200) return res.data
    else return false
  }

  static async getShotpoint() {  //炮点
    // let res = await fetchJsonp(baseUrl + `conn/shotpoints`)
    // let msg:any = await res.json()
    // return msg
    let res: any = await axios({ 
      url: baseUrl + `conn/shotpoints`, 
      adapter: jsonpAdapter,
    })
    if (res.status === 200) return res.data
    else return false
  }

  static async getRadios() {   //电台
    // let res = await fetchJsonp(baseUrl + `conn/radios`)
    // let msg:any = await res.json()
    // return msg
    let res: any = await axios({ 
      url: baseUrl + `conn/radios`, 
      adapter: jsonpAdapter,
    })
    if (res.status === 200) return res.data
    else return false
  }
}


// 实况产品
export class productsClient {
  static async getProdTime() {
    let res: any = await axios(`http://10.148.83.228:8922/dataunit/station/findLatestStationDataHeader?province[]=广东`)
    if (res.status === 200) return res.data
    else return false
  }

  static async getStation(type) {
    let res: any = await axios(`http://10.148.83.228:8922/dataunit/station/findStationInfo?types=${type}&province[]=广东`)
    if (res.status === 200) return res.data
    else return false
  }

  static async getProducts(type, datetime) {
    let res: any = await axios(`http://10.148.83.228:8922/dataunit/station/findStationData?types[]=${type}&datetime=${datetime}&elements[]=temp&elements[]=ps&elements[]=hourrf&elements[]=dp&elements[]=wd2df&elements[]=wd2dd&elements[]=rh&province[]=广东`)
    if (res.status === 200) return res.data
    else return false
  }
}