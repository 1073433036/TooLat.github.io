import axios from 'axios'
const qs = require('qs')
export default class contingencyPlanHttp {
  private rootUrl='http://10.148.83.86:8080'
  //获取部门信息
  async getDepartmentTypes():Promise<any>{
    let url = this.rootUrl+`/JYTY/department/select`
    try {
      let res = await axios.post(url)
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

  //根据类型获取预案
  async getAllMoreContPlan(params:{e_name?:string}){
    let url = this.rootUrl+`/JYTY/planmeasure/select`
    try {
      let res = await axios.post(url,qs.stringify(params))
      if(res.data.result==='S_OK'){
        return res.data.tagObject
      }else{
        return []
      }
    }catch (e){
      console.log('应急预案接口请求失败')
      return []
    }
  }

  //批量增加应急预案
  async addMoreContPlan(params:any):Promise<any>{
    let url = this.rootUrl+`/JYTY/planmeasure/adds`
    try {
      let res = await axios({
        url,
        method:'post',
        headers:{ 'Content-Type': 'application/json'},
        data:params
      })
      if(res.data.result==='S_OK'){
        return res.data.tagObject
      }else{
        return []
      }
    }catch (e){
      console.log('批量增加应急预案接口请求失败')
      return []
    }

  }

  //更新应急预案信息
  async updateContPlan(params:any):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/planmeasure/modify`
    try {
      let fd = new FormData()
      for(let key in params){
        fd.append(key,params[key])
      }
      let res = await axios.post(url,fd)
      if(res.data.result==='S_OK'){
        return true
      }else{
        return false
      }
    }catch (e){
      console.log('更新应急预案接口请求失败')
      return false
    }
  }

  //删除应急预案信息
  async deleContPlan(params:any){
    let url = this.rootUrl+`/JYTY/planmeasure/delete`
    try {
      let res = await axios.post(url,params,{
        timeout:5000,
        headers:{ 'Content-Type': 'application/json'},
      })
      if(res.data.result==='S_OK'){
        return true
      }else{
        return false
      }
    }catch(e){
      return false
    }
  }

  //获取专家库信息
  async getZjkInfo(params:{keyword?:string}):Promise<any>{
    let url = this.rootUrl+`/JYTY/planexpert/select`
    try{
      let res = await axios.post(url,qs.stringify(params),{
        timeout:5000,
        headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      })
      if(res.data.result=='S_OK'){
        return res.data.tagObject
      }else {
        return []
      }
    }catch (e){
      return []
    }
  }

  //删除专家库信息
  async deleteZjkInfo(params:{ids:any}):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/planexpert/delete`
    try {
      let res = await axios.post(url,params,{
        timeout:5000,
        headers:{ 'Content-Type': 'application/json'},
      })
      if(res.data.result==='S_OK'){
        return true
      }else{
        return false
      }
    }catch(e){
      return false
    }
  }

  //添加专家库信息
  async addZjkInfo(params:{ planExperts: any[]}):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/planexpert/inserts`
    try {
      let res = await axios.post(url,params,{
        timeout:5000,
        headers:{ 'Content-Type': 'application/json'},
      })
      if(res.data.result==='S_OK'){
        return true
      }else{
        return false
      }
    }catch(e){
      return false
    }
  }
  //更新专家库信息
  async upDateZjkInfo(params:{name:string, address:string, department:string, phone:string, cellphone:string, id:number}):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/planexpert/modify`
    try {
      let res = await axios.post(url,qs.stringify(params),{
        timeout:5000,
        headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      })
      if(res.data.result==='S_OK'){
        return true
      }else{
        return false
      }
    }catch(e){
      return false
    }
  }

  //获取工作备忘内容
  async getWorkConten(params:{keyword?:string}):Promise<any>{
    let url = this.rootUrl+`/JYTY/planmemo/select`
    try {
      let res = await axios.post(url,qs.stringify(params),{
        timeout:5000,
        headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      })
      if(res.data.result==='S_OK'){
        return res.data.tagObject
      }else{
        return []
      }
    }catch(e){
      return []
    }
  }

  //删除工作备忘
  async deleteWorkConten(params:{ ids: any[] }):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/planmemo/delete`
    try {
      let res = await axios.post(url,params,{
        timeout:5000,
        headers:{ 'Content-Type': 'application/json'},
      })
      if(res.data.result==='S_OK'){
        return res.data.tagObject
      }else{
        return false
      }
    }catch(e){
      return false
    }
  }

  //添加工作备忘
  async addWorkConten(params:{planMemos: any[] }):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/planmemo/inserts`
    try {
      let res = await axios.post(url,params,{
        timeout:5000,
        headers:{ 'Content-Type': 'application/json'},
      })
      if(res.data.result==='S_OK'){
        return true
      }else{
        return false
      }
    }catch(e){
      return false
    }
  }
  //更新工作备忘
  async upDateWorkConten(params:{id:number,name: string }):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/planmemo/modify`
    try {
      let res = await axios.post(url,qs.stringify(params),{
        timeout:5000,
        headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      })
      if(res.data.result==='S_OK'){
        return res.data.tagObject
      }else{
        return false
      }
    }catch(e){
      return false
    }
  }

  //获取预案提示信息
  async getAlertInfo(params:{keyword?:string,e_name?:string}):Promise<any>{
    let url = this.rootUrl+`/JYTY/plantip/select`
    try{
      let res  = await axios.post(url,qs.stringify(params),{
        timeout:5000,
        headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      })
      if(res.data.result==='S_OK'){
        return res.data.tagObject
      }else{
        return []
      }
    }catch (e){
      return []
    }
  }

  //添加预案提示信息
  async addAlertInfo(params:{ planTips: {
      id?:number
      e_name: string,
      starttip: string,
      downtip: string,
      uptip: string,
      finishtip: string,
      description: string
    }[]}):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/plantip/inserts`
    try{
      let res  = await axios.post(url,params,{
        timeout:5000,
        headers:{ 'Content-Type': 'application/json'},
      })
      if(res.data.result==='S_OK'){
        return true
      }else{
        return false
      }
    }catch (e){
      return false
    }
  }

  //删除预案提示信息
  async deleteAlertInfo(params:{ ids: number[] }):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/plantip/delete`
    try{
      let res  = await axios.post(url,params,{
        timeout:5000,
        headers:{ 'Content-Type': 'application/json'},
      })
      if(res.data.result==='S_OK'){
        return true
      }else{
        return false
      }
    }catch (e){
      return false
    }
  }

  //更新预案提示信息
  async upDateAlertInfo(params:{
      id?:number
      e_name: string,
      starttip: string,
      downtip: string,
      uptip: string,
      finishtip: string,
      description: string
    }):Promise<boolean>{
    let url = this.rootUrl+`/JYTY/plantip/modify`
    try{
      let res  = await axios.post(url,qs.stringify(params),{
        timeout:5000,
        headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      })
      if(res.data.result==='S_OK'){
        return true
      }else{
        return false
      }
    }catch (e){
      return false
    }
  }

  //获取历史预案数据
  async getHistoryPlan(){
    let url = this.rootUrl+`/JYTY/plansOnline/get`
    try {
      let res  = await axios.post(url,qs.stringify({state:''}))
      return res.data.result=='S_OK'?res.data.tagObject:[]
    }catch (e){
      return []
    }
  }
}
