/**
 *
 *  预警分析 --> 预警提醒 --> QPF, 强回波提醒
 *
 * */


import {geoClient, warningAnalysisClient} from '../clientHelper'
export default class warningRemindToolUtil {

  constructor() {

  }

  /**
   * {
    cellphone: "13433334444",
    cityName: "广州",
    cityid: 22,
    countyId: 0,
    countyName: "全市",
    id: "1710171235214523222"

      sessionStorage.userId = res.user.id
      sessionStorage.username = res.user.name
      sessionStorage.password = Base64.encode(this.password)
      sessionStorage.cityid = res.user.cityid
      sessionStorage.cityName = res.user.cityName
      sessionStorage.countyId = res.user.countyId
      sessionStorage.countyName = res.user.countyName
  }
   */

  //获取地区相关的数据
  public async getWarningRemindData(urlChar: string, dateTime) {
    let ref = await warningAnalysisClient.getWainingRemindData(urlChar,sessionStorage.userId, dateTime)
    console.log(ref)
    if (ref) {
      if (typeof(ref) === "string") {
        if (urlChar === 'echo') {
          return this.getEchoMsg(ref)
        }else if (urlChar === 'qpf') {
          return this.getQPFMsg(ref)
        }else if (urlChar === 'winwarn'){
          return this.getWinwarnMsg(ref, [])
        }else {
          return this.getStrongRainfallMsg(ref);
        }
      }
      let userCity: string = ''
      let countys: string[] = []
      //判断用户属于: 省 , 市, 区
      if (Number(sessionStorage.countyId) === 0){ //市 或者区
        if (Number(sessionStorage.cityid) === 0) {
          userCity = sessionStorage.cityName + '省'
        }else {
          userCity = sessionStorage.cityName + '市'
          if (urlChar === 'winwarn') {
            let data = await this.getCityCountysData(); //大风拿所有区去匹配
            countys = data;
          }
        }
      }else {
        userCity = sessionStorage.countyName;  //区
      }

      if (urlChar === 'rainfall') {
        let maxLevel: number = 0;
        let maxKey: string = '';
        for (let key in ref) {
          let val = ref[key];
          let keyArr = key.split(',');
          let province = val.loc.province;
          let city = val.loc.city;
          let county = val.loc.county;
          if (userCity.indexOf('省') != -1 && sessionStorage.cityName === province) { //省
            if (Number(keyArr[1].replace('级',"")) > maxLevel) {
              maxLevel = Number(keyArr[1].replace('级',""))
              maxKey = key;
            }
          }else if (userCity.indexOf('市') != -1 && sessionStorage.cityName === city) { //市
            if (Number(keyArr[1].replace('级',"")) > maxLevel) {
              maxLevel = Number(keyArr[1].replace('级',""))
              maxKey = key;
            }
          }else { //区
            if (userCity === county) {
              this.getStrongRainfallMsg(key.split(','))
            }
          }
        }
        if (maxLevel === 0) return false;
        return this.getStrongRainfallMsg(maxKey.split(','))
      }
      else if(urlChar === 'winwarn'){
        let maxLevel: number = 0;
        let maxKey: string = '';
        for (let key in ref) {
          let keyArr: string[] = key.split(',');
          let lastEle: string = String(keyArr.pop());
          //用户是省  / 区直接去匹配
          if (countys.length === 0) {
            if(userCity.indexOf('省') != -1){
              if (Number(keyArr[0].replace('级',"")) > maxLevel) {
                maxLevel = Number(keyArr[0].replace('级',""))
                maxKey = key;
              }
            }else {
              if (lastEle === userCity) {
                return this.getWinwarnMsg(keyArr, ref[key])
              }
            }
          }else {
            //用户是市,拿最大值的区
            if (countys.indexOf(lastEle) != -1){
              if (Number(keyArr[0].replace('级',"")) > maxLevel) {
                maxLevel = Number(keyArr[0].replace('级',""))
                maxKey = key;
              }
            }
          }
        }
        if (maxLevel === 0) return false;
        return this.getWinwarnMsg(maxKey.split(','), ref[maxKey])
      } else{
        for (let key in ref) {
          let keyArr = key.split(',');
          let lastEle = keyArr.pop();
          //判断跟用户城市对比, 查找是否存在预警
          if (lastEle === userCity) {
            console.log("#####", lastEle, userCity)
            if (urlChar === 'echo') {
              return this.getEchoMsg(ref[key])
            }else if (urlChar === 'qpf') {
              return this.getQPFMsg(ref[key])
            }
          }
        }
      }
      return false;
    }else {
      if (urlChar === 'echo') {
        return this.getEchoMsg(false)
      }else if (urlChar === 'qpf') {
        return this.getQPFMsg(false)
      }else if (urlChar === 'winwarn') {
        return this.getWinwarnMsg(false, [])
      }else {
        this.getStrongRainfallMsg(false);
      }
    }
  }

  //强降雨
  private getStrongRainfallMsg(msgObj) {
    if (typeof(msgObj) === "string") {
      return [`强降雨预警提醒`, msgObj];
    }
    if (msgObj) {
      if (msgObj.length < 3) return [`强降雨预警提醒`, `数据异常`]
      return [`强降雨${msgObj[1]}预警提醒`, `分区范围内${msgObj[0]}内降雨累积量为${msgObj[2]}mm`, `${msgObj[1].replace('级',"")}`];
    }else {
      return [`强降雨预警提醒`, `数据请求失败`];
    }
  }


  private async getCityCountysData() {
    let ref = await geoClient.getAllCounties(Number(sessionStorage.cityid))
    let countys: string[] = [];
    if (ref) {
      countys = ref.map(function (val,index,arr) {
        return val.county;
      })
    }
    console.log(countys)
    return countys
  }


  //强回波
  //将需要提示的信息返回到组件, 提示
  private getEchoMsg(msgObj) {

    if (typeof(msgObj) === "string") {
      return [`强回波预警提醒`, msgObj];
    }

    if (msgObj) {
      let level: string = '';
      for (let objKey in msgObj) {
        level = objKey;
      }
      // 3-10-100 -> 1: 等级 10: 强度 100: 面积
      let objArr = level.split('-');
      if (objArr.length != 3) return [`强回波预警提醒`, `数据异常`]
      return [`强回波${objArr[0]}级预警提醒`, `分区范围内出现强度大于${objArr[1]}dbz且面积大于${objArr[2]}平方公里的回波`, `${objArr[0]}`];
    }else {
      return [`强回波预警提醒`, `数据请求失败`];
    }
  }

  //QPF
  //将需要提示的信息返回到组件, 提示
  private async getQPFMsg(msgObj) {
    if (typeof(msgObj) === "string") {
      return [`QPF预警提醒`, msgObj];
    }
    if (msgObj) {
      return [`QPF${msgObj.level}级预警提醒`, `分区范围${msgObj.hour}小时内出现QPF值为${msgObj.qpf.toFixed(1)}mm`, `${msgObj.level}`];
    }else {
      return [`QPF预警提醒`, `数据请求失败`];
    }
  }

  //大风提醒
  private  async getWinwarnMsg(msgObj, objVal) {
    if (typeof(msgObj) === "string") {
      return [`大风提醒预警提醒`, msgObj];
    }
    if (msgObj) {
      //拿最大的平均风值
      let maxWindValue: number = 0;
      for (let ele of objVal) {
        maxWindValue = maxWindValue > ele.windpower ? maxWindValue : ele.windpower;
      }
      return [`大风提醒${msgObj[0]}预警提醒`, `分区站点个数为${msgObj[1]}个,平均风达到${maxWindValue.toFixed(2)}m/s`, `${msgObj[0].replace('级',"")}`];
    }else {
      return [`大风提醒预警提醒`, `数据请求失败`];
    }
  }

}
