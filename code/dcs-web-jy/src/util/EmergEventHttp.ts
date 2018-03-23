import axios from 'axios'
import { EmergEvent, EventDynamic, EventMember } from '../interface/EmergEvent'

export default class EmergEventHttp {
  constructor() {}
  private _rootUrl: string = 'http://10.148.83.86:8080'

  //获取当前正在发生的应急事件
  public async getEmergEvents(): Promise<EmergEvent[]> {
    try {
      let res: any = await axios.get(`${this._rootUrl}/JYTY/liandonginfo/selectAll`);
      let data = res.data;
      return data.result === 'S_OK' && Array.isArray(data.tagObject) ? data.tagObject : [];
    }
    catch {
      console.error('failed to get emergency events');
      return [];
    }
  }

  public async getEventDynamics(eventId: number): Promise<EventDynamic[]> {
    try {
      let res: any = await axios.post(`${this._rootUrl}/JYTY/liandongfeedbackinfo/select?liandongId=${eventId}`);
      return res.data.result === 'S_OK' && Array.isArray(res.data.tagObject) ? res.data.tagObject : [];
    }
    catch {
      console.error('failed to get event dynamics');
      return [];
    }
  }

  public async getEventMembers(eventId: number): Promise<EventMember[]> {
    try {
      let res: any = await axios.post(`${this._rootUrl}/JYTY/liandongpeopleinfo/selectByLiandongId?liandongId=${eventId}`);
      return res.data.result === 'S_OK' && Array.isArray(res.data.tagObject) ? res.data.tagObject : [];
    }
    catch {
      console.error('failed to get event members');
      return [];
    }
  }
}