import axios from 'axios'
const qs = require('qs')
export default class departmentInfoHttp{
  constructor(){}
  private rootUrl='http://10.148.83.86:8080'
  //获取部门信息
  async getDepartmentTypes(params:{department?: string}):Promise<any>{
    let url = this.rootUrl+`/JYTY/department/select`
    try {
      let res = await axios.post(url,qs.stringify(params))
      if(res.data.result==='S_OK'){
        return res.data.tagObject
      }else{
        return []
      }
    }catch (e){
      console.log('部门信息接口请求失败')
      return []
    }

  }

  //添加部门
  async addDerpartment(params:any):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/department/inserts`
    try{
      let res = await axios.post(url,params,{
        headers:{'Content-Type':'application/json'}
      })
      if(res.data.result==='S_OK'){
        return true
      }else{
        return false
      }
    }catch (e){
      return true
    }
  }

  //修改部门
  async editDepartment(params:{ did: number, department: string, scan: string,office:string}):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/department/modify`
    try{
      let res = await axios.post(url,qs.stringify(params),{
        timeout:5000,
        headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      })
      if(res){return true}else{return false}
    }catch (e){
      return false
    }
  }

  //删除部门
  async deleteDerpartment(params:{dids: number[]}):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/department/delete`
    try{
      let res = await axios.post(url,params,{
        timeout:500,
        headers:{'Content-Type':'application/json'}
      })
      if(res.data.result==='S_OK'){
        return true
      }else{
        return false
      }
    }catch (e){
      return true
    }
  }

  //获取部门的所有负责人或成员
  async getDerPartmentNumber(params:{keyword?:string}):Promise<any>{
    let url = this.rootUrl+`/JYTY/departmenthead/select`
    try {
      let res = await axios.post(url,qs.stringify(params))
      if(res.data.result=='S_OK'){
        return res.data.tagObject
      }else {
        return []
      }
    }catch (e){
      return []
    }
  }

  //添加部门负责人
  async addDerpartmentManage(params:any):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/departmenthead/inserts`
    try {
      let res = await axios.post(url,params,{
        headers:{ 'Content-Type': 'application/json' }
      })
      if(res.data.result=="S_OK"){
        return true
      }else {
        return false
      }
    }catch (e){
      return false
    }
  }

  //更新部门负责人
  async updataDerpartmentManage(params:any):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/departmenthead/modify`
    try {
      let res = await axios.post(url,qs.stringify(params),{
        headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      })
      if(res.data.result=="S_OK"){
        return true
      }else {
        return false
      }
    }catch (e){
      return false
    }
  }

  //删除部门负责人
  async deleteDerpartManage(params:{ids:number[]}){
    let url = this.rootUrl+`/JYTY/departmenthead/delete`
    try{
      let res = await axios.post(url,params,{
        timeout:5000,
        headers:{ 'Content-Type': 'application/json' }
      })
      if(res.data.result=="S_OK"){
        return true
      }else {
        return false
      }
    }catch (e){
      return false
    }
  }

  async searchDerpartManage(par:string=''){
    let url = this.rootUrl+`/JYTY/departmenthead/select`
    try {
      let res = await axios.post(url,qs.stringify({keyword:par}))
      if(res.data.result=="S_OK"){
        return res.data.tagObject
      }else {
        return []
      }
    }catch (e){
      return []
    }
  }
}
