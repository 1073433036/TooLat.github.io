import qs from 'qs'
import * as typhoonSearchConf from "../config/TyphoonInfoSearchConfig"
import {export_json_to_excel} from './Export2Excel.js'
import { TyphoonSelects, SelectTypes, SelectedParams } from '../interface/TyphoonSelectTypes'

//计算分页
export const getComputePage = (currentPage: number, pageSize: number, tableData: Array<any>): Array<any> => {
  let currentPageTableData: Array<any> = [];
  if(currentPage > 1) {
    tableData.forEach((v, i) => {
      if(i > ((currentPage - 1) * pageSize - 1) && i <= (currentPage * pageSize - 1)) {
        currentPageTableData.push(v);
      }
    });
  } else {
    tableData.forEach((v, i) => {
      if(i <= (currentPage * pageSize - 1)) {
        currentPageTableData.push(v);
      }
    });
  }
  return currentPageTableData;
}
//筛选台风请求参数
export const getTyphoonParams = (selectsType: TyphoonSelects): string => {
  let params: {
    months: any[],
    distances: any[],
    rainRanges: any[],
    windRanges: any[],
    landings: any[],
    levels: any[]
  } = {
    months: [],
    distances: [],
    rainRanges: [],
    windRanges: [],
    landings: [],
    levels: []
  };
  let paramsStr:{
    months:string,
    distances: string,
    rainRanges: string,
    windRanges: string,
    landings: string,
    levels: string
  }={
    months:'',
    distances: '',
    rainRanges: '',
    windRanges: '',
    landings: '',
    levels: ''
  };
  let str:string=''
  for(let key in selectsType) {
    for(let val of selectsType[key].activeSelect) {
      typhoonSearchConf[key].forEach((item: any): void => {
        if(val === item.label) {
          switch(key){
            case 'landings':
              params['landings'] = params['landings'].concat(item.value);
              break
            case 'distances':
             params['distances'].push(item.value);
              break
            case 'levels':
              params['levels'] = params['levels'].concat(item.value);
              break
            case 'months':
              params['months'] = params['months'].concat(item.value);
              break
            case 'windRanges':
              params['windRanges'].push(item.value);
              break
            case 'rainRanges':
              params['rainRanges'].push(item.value);
              break
          }
        }
      });
    }
  }
  for(let key in params){
    switch(key){
      case 'landings':
        paramsStr[key] =qs.stringify({'landings':params[key]}, { encode: false });
        break
      case 'distances':
        paramsStr[key] =qs.stringify({'distances':params[key]}, { encode: false });
        break
      case 'levels':
        paramsStr[key] =qs.stringify({'levels':params[key]}, { encode: false });
        break
      case 'months':
        paramsStr[key] =qs.stringify({'months':params[key]}, { encode: false });
        break
      case 'windRanges':
        paramsStr[key] =qs.stringify({'windRanges':params[key]}, { encode: false });
        break
      case 'rainRanges':
        paramsStr[key] =qs.stringify({'rainRanges':params[key]}, { encode: false });
        break
    }
    paramsStr[key] = paramsStr[key].replace(/\[[\d]+\]\=/g, '[]=');
  }
  for(let key in paramsStr){
    if(paramsStr[key]){
      str+=`&${paramsStr[key]}`
    }
  }
  return str;

}
//计算表格的高度
export const getComputeTableHeight = (height: number): number => {
  let clientHeight: number = document.documentElement.clientHeight;
  let clientWidth: number = document.documentElement.clientWidth;
  let htmlFontSize: any = document.documentElement.style.fontSize;
  htmlFontSize = new String(htmlFontSize);
  htmlFontSize = parseInt(htmlFontSize);
  if(clientWidth <= 1300) {
    return (clientHeight/htmlFontSize - height/(clientWidth/4)) * htmlFontSize;
  } else {
    return (clientHeight/htmlFontSize - height/(clientWidth/6)) * htmlFontSize;
  }
}
//导出当前表格数据到excel文件
export const createExcel=(tableData,TableType,title)=>{
  let th:any=[],tb_key:any=[],tb:any=[]
  TableType.forEach(v=>{
    th.push(v.label)
    tb_key.push(v.prop)
  })
  for(let i = 0 ; i<tableData.length ;i++){
    let v = tableData[i]
    let arr_:any=[]
    tb_key.forEach(k=>{
      arr_.push(v[k])
    })
    tb.push(arr_)
  }
  export_json_to_excel(th,tb,title)
}
