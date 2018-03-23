import axios from 'axios'
var qs = require('qs')
import mailInfos from '../interface/mailInfos'
export default class mailListHttp{
  constructor(){}
  private urlRoot = `http://10.148.83.86:8080`
  //获取所有通讯录信息
  async getAllMailInfo():Promise<mailInfos[]|any>{
    let url = this.urlRoot+`/JYTY/contact/get/all`
    let res = await axios.get(url)
    if(res.data.result=='S_OK'){
      return res.data.tagObject
    }else {
      return []
    }
  }

  //添加信息
  async addMailInfo(params:{ name: string, phone: string, department: string, role: string}):Promise<boolean>{
    let url = this.urlRoot+'/JYTY/contact/add/info'
    let res = await axios.post(url,qs.stringify(params))
    if(res.data.result=='S_OK'){
      return true
    }else {
      return false
    }
  }

  //编辑信息
  async editMailInfo(params:any):Promise<boolean>{
    let url = this.urlRoot+'/JYTY/contact/modify/info'
    let res = await axios.post(url,qs.stringify(params))
    if(res.data.result=='S_OK'){
      return true
    }else {
      return false
    }
  }
  //删除信息
  async deleMailInfo(param):Promise<boolean>{
    let url = this.urlRoot+`/JYTY/contact/delete/infos?ids=${param}`
    let res = await axios.get(url)
    if(res.data.result=='S_OK'){
      return true
    }else {
      return false
    }
  }
}
