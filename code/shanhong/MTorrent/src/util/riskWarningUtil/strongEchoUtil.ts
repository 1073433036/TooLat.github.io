/**
 *
 *  预警分析 --> 预警提醒 --> 强回波提醒
 *
 * */

import {geoClient, warningAnalysisClient} from '../clientHelper'
export default class strongEchoUtil {

  constructor(dateTime: string) {
    this.dateTime = dateTime;
  }
  dateTime: string = ''

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
  public async getstrongEchoData() {
    let ref = await warningAnalysisClient.getstrongEchoData(sessionStorage.userId, this.dateTime)
    if (ref) {
      for (let key in ref) {
        let keyArr = key.split(',');
        let lastEle = keyArr.pop();
        let userCity: string = ''
        //判断用户属于: 省 , 市, 区
        if (Number(sessionStorage.countyId) === 0){ //市 或者区
          if (Number(sessionStorage.cityid) === 0) {
            userCity = sessionStorage.cityName + '省'
          }else {
            userCity = sessionStorage.cityName + '市'
          }
        }else {
          userCity = sessionStorage.countyName;  //区
        }
        //判断跟用户城市对比, 查找是否存在预警
        if (lastEle === userCity) {
          console.log("#####", lastEle, userCity)
          return this.getEchoMsg(ref[key])
        }
      }
      return [];
    }else {
      return this.getEchoMsg(false);
    }
  }

  //将需要提示的信息返回到组件, 提示
  private getEchoMsg(msgObj) {
    if (msgObj) {
      let level: string = '';
      for (let objKey in msgObj) {
        level = objKey;
      }
      let objArr = level.split('-');
      if (objArr.length != 3) return [`强回波预警提醒`, `数据异常`]
      return [`强回波${objArr[0]}预警提醒`, `分区范围内出现强度大于${objArr[1]}dbz且面积大于${objArr[2]}平方公里的回波`, `${objArr[0]}`];
    }else {
      return [`强回波预警提醒`, `数据请求失败`];
}
}

// 获取强回波预警阈值
// public async getstrongEchoCustomThreshold() {
//   let ref = await warningAnalysisClient.getstrongEchoCustomThreshold(this.userInfo.id)
//   if (ref) {
//     let level: string = '';
//     for (let objKey in this.echoData) {
//       level = objKey;
//     }
//     for (let i = 0; i < ref.length; i++) {
//       if (level == ref[i].level) {
//         return ref[i];
//       }
//     }
//   }
//   return false;
// }

}
