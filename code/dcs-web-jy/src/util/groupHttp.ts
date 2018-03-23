import axios from 'axios'
let qs = require('qs')
export default class groupHttp {
  constructor(){}
  private urlRoot = `http://10.148.83.86:8080`

  //获取所有群组信息
  async getAllGroup():Promise<any[]>{
    let url = this.urlRoot+`/JYTY/group/get/groupAll`
    let res = await axios.get(url)
    if(res.data.result==='S_OK'){
      return res.data.tagObject
    }else{
      return []
    }
  }

  //修改群组信息
  async editGroupInfo(params:{id: number|string,groupname: string,updatetime: number|string,number:string|number}):Promise<boolean>{
    let url = this.urlRoot+`/JYTY/group/update/group`
    let res = await axios({
      url,
      method:'post',
      data:params,
      headers:{ 'Content-Type': 'application/json'}
    })
    if(res.data.result=='S_OK'){
      return true
    }else {
      return false
    }
  }

  //根据id获取群信息
  async getGroupInfoById(id:number|string):Promise<any[]>{
    try{
      let url = `${this.urlRoot}/JYTY/group/get/groupUsers?id=${id}`
      let res= await axios.get(url,{
        timeout:5000,
      })
      if(res.data.result==='S_OK'){
        return res.data.tagObject?res.data.tagObject:[]
      }else {
        return []
      }
    }catch (e){
      return []
    }
  }

  //添加群组
  async addGroup(param: string):Promise<boolean>{
    let params:{ id: number, groupname: string, updatetime:number }={
      id: 0,
      groupname: param,
      updatetime: 1511768252000
    }
    let url = this.urlRoot+`/JYTY/group/add/group`
    let res:any = await axios({
      url,
      method:'post',
      data:params,
      headers:{ 'Content-Type': 'application/json'}
    })
    if(res.data.result==='S_OK'){
      return true
    }else {
      return false
    }
  }

  //删除群组
  async deleGroup(id:number|string):Promise<boolean>{
    let url = this.urlRoot+`/JYTY/group/delect/group?id=${id}`
    let res:any=await axios.get(url)
    if(res.data.result==='S_OK'){
      return true
    }else {
      return false
    }
  }

  //群组添加用户
  async addGroupUser(params:{ contactsId: number, groupGatherId: number}[]):Promise<string>{
    let url = this.urlRoot+`/JYTY/group/add/users`
    let res:any = await axios({
      url,
      method:'post',
      data:params,
      headers:{ 'Content-Type': 'application/json'}
    })
    console.log(res.data)
    if(res.data.result==='S_OK'){
      return '群组成员添加成功'
    }else if(res.data.result==='S_EXCEPTION') {
      return '该成员已存在'
    }else{
      return '群组成员添加失败'
    }
  }

  //群组删除用户
  async deletGroupUser(params:{ contactsId: number, groupGatherId: number}[]):Promise<boolean>{
    let url = this.urlRoot+`/JYTY/group/delete/users`
    let res:any = await axios({
      url,
      method:'post',
      data:params,
      headers:{ 'Content-Type': 'application/json'}
    })
    if(res.data.result==='S_OK'){
      return true
    }else {
      return false
    }
  }

  //获取接收所有短信人群数据
  async getAllSmsMember(){
    try{
      let url = this.urlRoot+`/JYTY/warnuser/get`
      let res = await axios.get(url)
      if(res.data.result==='S_OK'){
        return res.data.tagObject
      }else {
        return []
      }
    }catch (e){
      return []
    }
  }

  //添加短信接收人员
  async addSmsMember(params:{ phone: number, name: string, units:string, position: string }):Promise<boolean>{
    try{
      let url = this.urlRoot+`/JYTY/warnuser/insert`
      let res = await axios.post(url,params)
      if(res.data.result=='S_OK'){
        return true
      }else {
        return false
      }
    }catch (e){
      return false
    }
  }

  //删除短信接收人员
  async deleteSmsMember(id:number){
    try{
      let url = this.urlRoot+`/JYTY/warnuser/delete?id=${id}`
      let res  =  await axios.get(url)
      if(res.data.result=='S_OK'){
        return true
      }else {
        return false
      }
    }catch (e){
      return false
    }
  }

}
