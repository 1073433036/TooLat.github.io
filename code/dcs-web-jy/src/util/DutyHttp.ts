import axios from 'axios'
let qs = require('qs')
export default class DutyHttp {
  constructor(){}
  private urlRoot = `http://10.148.83.86:8080`

  async getDutyAllInfos(params: any): Promise<any> {
    try {
      let url: string = this.urlRoot + `/JYTY/dutyschedule/select`;
      let res: any = await axios.post(url, qs.stringify(params));
      if(res.data.result === 'S_OK') {
        return res.data.tagObject;
      } else {
        return [];
      }
    }
    catch {
      console.error('failed to get duty info');
      return [];
    }
  }

  async addDutyInfos(params:{dutySchedules:any[]}):Promise<boolean>{
    let url = this.urlRoot+`/JYTY/dutyschedule/inserts`
    try {
      let res = await axios({
        url,
        method:'post',
        timeout:5000,
        data:params,
        headers:{ 'Content-Type': 'application/json'}
      })
      if(res.data.result==='S_OK'){
        return true
      }else {
        return false
      }
    }catch (e){
      return false
    }
  }

  async deleDutyInfos(params:{ids: number[]}):Promise<boolean>{
    let url = this.urlRoot+`/JYTY/dutyschedule/delete`
    try {
      let res = await axios({
        url,
        method:'post',
        timeout:5000,
        data:params,
        headers:{ 'Content-Type': 'application/json' }
      })
      if(res.data.result==='S_OK'){
        return true
      }else {
        return false
      }
    }catch (e){
      return false
    }
  }

  async additionFile(params:FormData):Promise<boolean>{
    let url = this.urlRoot+`/JYTY/dutyschedule/insertsexcel`
    try {
      let res = await axios.post(url,params)
      if(res.data.result==='S_OK'){
        return true
      }else {
        return false
      }
    }catch (e){
      return false
    }
  }
}
