import axios from 'axios'
import moment from 'moment'
import {
  WarningTemplate,
  WarningForm,
  SmsGroup,
  WarningDetail,
  DefenseGuide
} from '../interface/WarningPublish'
import {assistClient} from "./ClientHelper";

export default class InfoPublishHttp {
  constructor(){}
  private rootUrl = `http://10.148.83.86:8080`;

  async getRespon(url: string): Promise<any[]> {
    try {
      let res = await axios.get(url);
      let data = res.data;
      if(data.result == "S_OK" && data.tagObject) {
        if(data.tagObject.length && data.tagObject[0].hasOwnProperty('time')) {
          data.tagObject.sort((a,b)=>{
            return b.time-a.time
          })
          data.tagObject.forEach(el => {
            el.time = moment(el.time).format('YYYY-MM-DD HH:mm:00');
          })
        }
        return data.tagObject;
      } else {
        return [];
      }
    }
    catch {
      return [];
    }
  }

  //根据预警状态获取突发预警信息, 状态量: 0是失效, 1是待审核, 2是发布
  async getWaringFormsByStatus(state: number): Promise<any[]> {
    return this.getRespon(`${this.rootUrl}/JYTY/warnform/get/state?state=${state}`);
  }

  //添加突发预警信息
  async addWaringFormInfo(params: WarningForm): Promise<boolean> {
    try {
      let res = await axios.post(`${this.rootUrl}/JYTY/warnform/add/warnform`, params, {
        timeout: 5000,
        headers: {'Content-Type': 'application/json'}
      })
      return res.data.result == "S_OK" ? true : false;
    }
    catch {
      return false;
    }
  }

  //模糊搜索获取预警信息
  async getWaringFormBySearch(params: string): Promise<any[]> {
    return this.getRespon(`${this.rootUrl}/JYTY/warnform/get/search?typeWarn=${params}`);
  }

  //根据预警类型、等级、开始时间、结束时间、发布渠道检索预警信息
  async getMsgByCondition(params?: {typeWarn?: string, starttime?: string, endtime?: string, channel?: string}): Promise<any[]> {
    console.log(params)
      return this.getRespon(`${this.rootUrl}/JYTY/warnform/get/condition?typeWarn=${params.typeWarn?params.typeWarn:''}&starttime=${params.starttime?params.starttime:''}&endtime=${params.endtime?params.endtime:''}&channel=${params.channel?params.channel:''}`);
  }

  //跟新模板管理的模板信息
  async updataTemplate(params: WarningTemplate): Promise<boolean>{
    try {
      let res = await axios.post(`${this.rootUrl}/JYTY/warntemplate/update/template`, params);
      return res.data.result === 'S_OK';
    }
    catch {
      console.error('更新模板信息失败');
      return false;
    }
  }

  //根据预警类型获取预警级别
  async getWarningLevel(type: string): Promise<any[]>{
    return this.getRespon(`${this.rootUrl}/JYTY/nature/get/publishdetails?name=${type}`);
  }

  async getWaringFormByType(type: string, level: string): Promise<any[]> {
    return this.getRespon(`${this.rootUrl}/JYTY/warnform/get/type?type=${type}&level=${level}`);
  }

  //根据时间段获取预警信息
  async getWaringFormByTime(starttime: string, endtime: string): Promise<any[]> {
    return this.getRespon(`${this.rootUrl}/JYTY/warnform/get/time?starttime=${starttime}&endtime=${endtime}`);
  }

  //根据渠道获取预警信息
  async getWaringFormByChannel(channel: string): Promise<any[]> {
    return this.getRespon(`${this.rootUrl}/JYTY/warnform/get/channel?channel=${channel}`);
  }

  //获取所有预警信息模板
  async getWarningTemplates(): Promise<WarningTemplate[]> {
    return this.getRespon(`${this.rootUrl}/JYTY/warntemplate/get/templates`);
  }

  //获取预警信息短信群组信息
  async getWarningSmsGroups(): Promise<SmsGroup[]> {
    return this.getRespon(`${this.rootUrl}/JYTY/group/get/groupAll`);
  }

  //根据群组id获取群组用户信息
  async getSmsGroupUsers(groupId: number): Promise<any[]> {
    return this.getRespon(`${this.rootUrl}/JYTY/group/get/groupUsers?id=${groupId}`);
  }

  //获取预警类型发布模板内容
  async getTemplateDetails(): Promise<WarningDetail[]> {
    return this.getRespon(`${this.rootUrl}/JYTY/nature/get/publishtype`);
  }

  //获取预警信号对应等级防御指引信息
  async getWarningGuide(type: string, level: string): Promise<DefenseGuide[]> {
    try {
      let res: any = await axios.post(`${this.rootUrl}/JYTY/nature/get/publishMessage?type=${type}&colour=${level}`);
      if(res.data.result === 'S_OK' && res.data.tagObject) {
        return [res.data.tagObject];
      } else {
        return [];
      }
    }
    catch {
      console.error('failed to get warning defense guides');
      return [];
    }
  }

  //获取监控渠道数据
  async getMonitoringData(): Promise<any> {
    try {
      let res: any = await axios.get(`${this.rootUrl}/JYTY/channel/get`)
      if (res.data.result === 'S_OK' && res.data.tagObject) {
        return res.data.tagObject;
      } else {
        return false;
      }
    }
    catch {
      return false;
    }
  }

  //获取所有预警类型信息
  async getAllDefenseGuide(): Promise<DefenseGuide[]> {
    return this.getRespon(`${this.rootUrl}/JYTY/nature/get/defense`);
  }
}
