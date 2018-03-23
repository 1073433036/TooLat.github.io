/**
 *
 *  预警分析 --> 预警提醒 --> QPF提醒
 *
 * */

import {warningAnalysisClient} from '../clientHelper'
export default class remindQpfUtil {

  constructor(dateTime: string, userInfo: any) {
    this.dateTime = dateTime;
    this.userInfo = userInfo;
  }
  dateTime: string = ''

  userInfo: any = null
  echoData: any = null

  //获取地区相关的数据
  public async getQPFData() {
    let ref = await warningAnalysisClient.getQPFData(this.userInfo.id, this.dateTime)
    if (ref) {
      for (let key in ref) {
        let keyArr = key.split(',');
        let lastEle = keyArr.pop();
        let userCity: string = ''
        //判断用户属于: 省 , 市, 区
        if (this.userInfo.countyId === 0){ //市 或者区
          if (this.userInfo.cityid === 0) {
            userCity = this.userInfo.cityName + '省'
          }else {
            userCity = this.userInfo.cityName + '市'
          }
        }else {
          userCity = this.userInfo.countyName;  //区
        }
        //判断跟用户城市对比, 查找是否存在预警
        if (lastEle === userCity) {
          this.echoData = ref[key];
          return this.getQPFMsg(ref[key])
          // break;
        }
        return false;
      }
    }else {
      return this.getQPFMsg(false)
    }
  }

  //将需要提示的信息返回到组件, 提示
  private async getQPFMsg(msgObj) {
    // let msgObj = await this.getstrongQPFThreshold();
    if (msgObj) {
      return [`QPF${msgObj.level}预警提醒`, `分区范围内出现QPF值为${msgObj.qpf}`];
    }else {
      return [`QPF预警提醒`, `数据请求失败`];
    }
  }

  // 获取强回波预警阈值
  // public async getstrongQPFThreshold() {
  //   let ref = await warningAnalysisClient.getstrongQPFThreshold(this.userInfo.id)
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
