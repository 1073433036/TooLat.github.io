import qs from 'qs'
import axios from 'axios'
import Disaster from '../interface/Disaster'

export default class DisasterService {
  constructor() {

  }

  private _prefixUrl: string = 'http://10.148.83.86:8080' //请求路径根地址

  //获取灾情状态对应的颜色
  public getStatusColor(status: string): string {
    let color: string = 'black';
    switch(status) {
      case 'notAudited':
        color = 'grey';
        break;
      case 'unaudited':
        color = 'orange';
        break;
      case 'happening':
        color = 'red';
        break;
      case 'ended':
        color = 'darkgrey';
        break;
    }
    return color;
  }

  //获取指定时间范围的灾情信息
  public async getDisasterByTimeRange(starttime: string, endtime: string): Promise<Disaster[]> {
    try {
      let res: any = await axios.post(`${this._prefixUrl}/JYTY/disareport/get/timerange`, { starttime, endtime });
      let data: Disaster[] = res.data;
      return data;
    }
    catch(e) {
      throw 'failed to get disaster infos by time range';
    }
  }

  //获取指定类型的灾情信息
  public async getDisasterByType(type: string): Promise<Disaster[]> {
    try {
      let res: any = await axios.post(`${this._prefixUrl}/JYTY/disareport/get/disaster`, { disaster: type });
      let data: Disaster[] = res.data;
      return data;
    }
    catch(e) {
      throw 'failed to get disaster infos by disaster type';
    }
  }

  //获取所有灾情信息
  public async getAllDisasters(): Promise<Disaster[]> {
    try {
      let res: any = await axios.post(`${this._prefixUrl}/JYTY/disareport/get/all`);
      let data: Disaster[] = res.data;
      return data;
    }
    catch(e) {
      throw 'failed to get all disaster infos';
    }
  }

  //获取指定状态的灾情信息
  public async getDisasterByStatus(status: 'notAudited' | 'unaudited' | 'happening' | 'ended'): Promise<Disaster[]> {
    try {
      let res: any = await axios.post(`${this._prefixUrl}/JYTY/disareport/get/disastatus?disasterStatus=${status}`);
      let data: Disaster[] = res.data;
      return data;
    }
    catch(e) {
      throw 'failed to get disaster infos by disaster status';
    }
  }

  //灾情上报
  public async reportDisaster(disaster: FormData): Promise<boolean> {
    try {
      let res: any = await axios.post(`${this._prefixUrl}/JYTY/disareport/add/info`, disaster);
      console.log(qs.stringify(disaster))
      // let res: any = await axios.post(`http://10.148.83.79:8080/JYTY/disareport/add/info`,disaster);
      let result: boolean = res.data;
      return result;
    }
    catch(e) {
      throw 'failed to report disaster info';
    }
  }

  //获取指定范围的灾情信息
  public async getDisastersInfo(params: {
    startTime?: string,
    endTime?: string,
    startInjury?: string,
    endInjury?: string,
    startEconomy?: string,
    endEconomy?: string,
    disaster?: string
  }): Promise<any> {
    try {
      let res: any = await axios.post(`${this._prefixUrl}/JYTY/disareport/get/all/range`, qs.stringify(params));
      let data: Disaster[] = res.data;
      return data;
    }
    catch(e) {
      throw 'failed to get all disaster infos';
    }
  }
  //获取指定条件的灾情信息
  public async getTaoDisastersInfo(params:{ disaster?: string, disasterStatus?: string, auditStatus?: string}): Promise<Disaster[]> {
    try {
      let paramsStr: string = '';
      for(let i in params) {
        paramsStr += `&${i}=${params[i]}`;
      }
      if(paramsStr.length)
        paramsStr = `?${paramsStr}`;
      let res: any = await axios.post(`${this._prefixUrl}/JYTY/disareport/get/all/type${paramsStr}`);
      let data = res.data;
      if(data.result === 'S_OK') {
        return data['tagObject'];
      } else {
        return []
      }
    }
    catch(e) {
      console.error('failed to get all disaster infos');
      return [];
    }
  }
  //更新指定ID的灾情信息
  public async upInfoDisasterById(params: Disaster): Promise<boolean> {
    try {
      let res: any = await axios.post(`${this._prefixUrl}/JYTY/disareport/modify/info`, qs.stringify(params));
      // let data: Disaster[] = res.data;
      return res.data.result === 'S_OK';
    }
    catch(e) {
      console.error('failed to get all disaster infos');
      return false;
    }
  }

  //删除指定id的灾情信息
  public async deleteDisasterInfoById(id: string): Promise<boolean>{
    try {
      let res: any = await axios.post(`${this._prefixUrl}/JYTY/disareport/delete/info`,qs.stringify({id}));
      // let data: Disaster[] = res.data;
      return res.data.result === 'S_OK';
    }
    catch(e) {
      console.error('failed to get all disaster infos');
      return false;
    }
  }

  //获取灾害类型
  public async getDisasterType(): Promise<any> {
    try {
      let res = await axios.get(`${this._prefixUrl}/JYTY/disasterstyle/list`)
      if (res.data.result=="S_OK") {
        return res.data.tagObject
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  }
}

