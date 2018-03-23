import axios from 'axios'
import { Loading } from 'element-ui'
import * as httpUrlConf from '../config/HttpUrlConf'
import { HistoryTyphoonItem } from '../interface/TyphoonInfo'
import { TyphoonSelects } from '../interface/TyphoonSelectTypes'
import { ResponseLite } from '../interface/Response'
import { getTyphoonParams } from "./InfoManageFunction"
var qs = require('qs')
//防灾救灾
export const getGeographicInfo= async (type: string, city: string, countyId?: number): Promise<any> => {
  try {
    /* index                 0        1           2          3            4           5           6          7          8          9     */
    let types: string[] = ['all', 'chemical', 'economy', 'hospital', 'material', 'rescueteam', 'school', 'shelter', 'experts', 'geohazard'];
    let index = types.indexOf(type);
    if(index === -1)
      return [];
    let url =`${httpUrlConf.GENERAL_URL}/projshare/assistplace/query/all/condition?city=${city+'市'}&type=${index}${countyId ? '&countyId=' + countyId : ''}`
    let res: any = await axios({
      url,
      method:'get',
      timeout: 5000,
    });
    let data: ResponseLite<any> = res.data;
    if(data.result !== 'S_OK' || !data.tagObject.length)
      return [];
    return data.tagObject;
  }
  catch {
    console.error(`获取类型为${type}的基础点信息失败`);
    return [];
  }
}
export const addBasicInfo = async (type:string,params:any,cityid:number):Promise<any>=>{
  let types={
    chemical:1,
    economy :2,
    hospital :3,
    material :4,
    rescueteam :5,
    school :6,
    shelter :7,
    experts :8,
    geohazard:9,
  }
  let type_:any=types[type];
  let info:any =params
  info.cityid=cityid
  info=JSON.stringify([info])
  let url = `http://10.148.83.228:2008/projshare/assistplace/add/all/condition`
  try{
    let res = await axios({
      url,
      method:'post',
      timeout:5000,
      data:qs.stringify({type:type_,info}),
      headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    })
    if(res.data.result==="S_OK"){
      return true
    }else{
      return false
    }
  }catch (e){
    return false
  }
}
export const editBasicInfo = async (type:string,params:any):Promise<any>=>{
  let url = `http://10.148.83.228:2008/projshare/assistplace/${type}/modify/info`
  try{
    let res = await axios({
      url,
      method:'post',
      timeout:5000,
      data:qs.stringify(params),
      headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    })
    if(res.data.result==="S_OK"){
      return true
    }else{
      return false
    }
  }catch (e){
    return false
  }
}
export const deleteBasicInfo = async (type:string,params:any):Promise<any>=>{
  let url =`http://10.148.83.228:2008/projshare/assistplace/delete/all/condition`
  let types={
    chemical:1,
    economy :2,
    hospital :3,
    material :4,
    rescueteam :5,
    school :6,
    shelter :7,
    experts :8,
    geohazard:9,
  }
  try {
    let ids=JSON.stringify(params)
    console.log(ids)
    let res = await axios({
      url,
      method:'post',
      timeout:5000,
      data:qs.stringify({type:types[type],ids}),
      headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    })
    if(res.data.result==="S_OK"){
      return true
    }else{
      return false
    }
  }catch (e){
    return false
  }
}

//台风灾害库
export const getTyphoonInfo = async (selectTypes: TyphoonSelects, city: string): Promise<Array<HistoryTyphoonItem>> => {
  try {
    let str = getTyphoonParams(selectTypes);
    let url = `${httpUrlConf.BIGDATA_URL}/dataunit/typhoon/findTyphoonInfo_City?&citys[]=${city}${str}`;
    let res: any = await axios.get(url, { timeout: 5000 });
    if(res.statusText === 'OK'){
      return res.data ? res.data.sort((a,b)=>{ return b.tsid-a.tsid}) : [];
    }else {
      return  [];
    }
  }
  catch(e) {
    return []
  }
}

//水库接口
export const getReservoirInfo=async ():Promise<any>=>{
  let url = `${httpUrlConf.GENERAL_URL}/projshare/hydrology/get/info/reservoirs`
  try{
    let res = await axios({
      url,
      method: 'get',
      timeout:5000,
      headers: { 'Content-Type': 'application/json' }
    })
    if(res.data.result=="S_OK"){
      return res.data.tagObject
    }else {
      return []
    }
  }catch (e){
    return []
  }
}
export const getReservoirInfo_=async (params):Promise<any>=>{
  let url = `${httpUrlConf.GENERAL_URL}/projshare/hydrology/get/fluctuate/reservoirs?start=${params.start}&end=${params.end}`
  try{
    let res = await axios({method:'get', url, timeout:5000,})
    if(res.data.result=="S_OK"){
      return res.data.tagObject.map(v=>{
        v.Differ=Math.round(v.Differ*10000)/10000
        return v
      })
    }else {
      return []
    }
  }catch (e){
    return []
  }
}
//河流接口
export const getRiverInfo= async ():Promise<any>=>{
  let url = `${httpUrlConf.GENERAL_URL}/projshare/hydrology/get/info/rivers`

  try{
    let res = await axios({
      url,
      method: 'get',
      timeout:5000,
      headers: { 'Content-Type': 'application/json' }
    })
    if(res.data.result=="S_OK"){
      return res.data.tagObject
    }else {
      return []
    }
  }catch(e){
    return []
  }
}
export const getRiverInfo_=async (params):Promise<any>=>{
  let url = `${httpUrlConf.GENERAL_URL}/projshare/hydrology/get/fluctuate/rivers?start=${params.start}&end=${params.end}`
  try{
    let res = await axios({method:'get', url, timeout:5000,})
    if(res.data.result=="S_OK"){
      return res.data.tagObject.map(v=>{
        v.Differ=Math.round(v.Differ*10000)/10000
        return v
      })
    }else {
      return []
    }
  }catch (e){
    return []
  }
}

