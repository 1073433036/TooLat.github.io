
import {getMarskUrl} from './warningAnalysisTool'
let L = window['L']
export class WarningMessageHelper {

  constructor(map) {
    this.zmap = map;
  }
  zmap

  addMarkToZmap= (data, layerId) => {
    // let layerMarkGroup = L.layerGroup();
    let layerMarkGroup = L.layerGroup().addTo(this.zmap);
    layerMarkGroup.id = layerId;
    const zmap = this.zmap;
    data.forEach((item, index) => {

      let markUrl = '';
      if (item.marskUrl) {
        markUrl = item.marskUrl
      }else {
        markUrl = getMarskUrl(item);
      }
      let htmlStr = getMarkPopHtmlStr(item);
      let typeStr: string = item.riskType
      if (Number(item.V_TFLEV) > 0 && typeStr == '台风') {
        let markIconA = L.icon({
          iconUrl: markUrl,
          iconSize: [42, 36],
        })
        let tempMark = L.marker([item.V05001, item.V06001], {icon: markIconA});
        layerMarkGroup.addLayer(tempMark);
        tempMark.bindPopup(htmlStr, {closeButton: false});
      }else if (Number(item.V_BYLEV) > 0 && typeStr == '暴雨') {
        let markIconB = L.icon({
          iconUrl: markUrl,
          iconSize: [42, 35],
          iconAnchor: [21, -10]
        })
        let tempMark = L.marker([item.V05001, item.V06001], {icon: markIconB});
        layerMarkGroup.addLayer(tempMark);
        tempMark.bindPopup(htmlStr, {closeButton: false});
      }else if (Number(item.V_LYLEV) > 0 && typeStr == '雷雨大风') {
        let markIconG = L.icon({
          iconUrl: markUrl,
          iconSize: [42, 35],
          iconAnchor: [51, -10]
        })
        let tempMark = L.marker([item.V05001, item.V06001], {icon: markIconG});
        layerMarkGroup.addLayer(tempMark);
        tempMark.bindPopup(htmlStr, {closeButton: false});
      }else {
        let markIconI = L.icon({
          iconUrl: markUrl,
          iconSize: [42, 35],
          iconAnchor: [21, -35]
        })
        let tempMark = L.marker([item.V05001, item.V06001], {icon: markIconI});
        layerMarkGroup.addLayer(tempMark);
        tempMark.bindPopup(htmlStr, {closeButton: false});
      }
    })

    function getMarkPopHtmlStr(dataObj: any) {

      let typeStr: string = dataObj.riskType
      let level: string = '';
      if (Number(dataObj.V_TFLEV) > 0 && typeStr == '台风') {
        level = dataObj.V_TFLEV + '级'
      }else if (Number(dataObj.V_BYLEV) > 0 && typeStr == '暴雨'){
        level = dataObj.V_BYLEV + '级'
      }else if (Number(dataObj.V_LYLEV) > 0 && typeStr == '雷雨大风') {
        level = dataObj.V_LYLEV + '级'
      }else if (Number(dataObj.V_BBLEV) > 0 && typeStr == '冰雹') {
        level = dataObj.V_BBLEV + '级'
      }else {
        typeStr = '其他'
        level = "未知"
      }
      // 2017-10-11 09:45:00
      let dayArr = dataObj.DDATETIME.split("-");
      let timeArr = dayArr[2].split(" ");
      let timeStr = dayArr[1] + '月' + timeArr[0] + '日' + timeArr[1].split(":")[0] + '时'

      let htmlStr = `<section class="wm-bindPopup">
                        <ul>
                          <li><span>预警信息详情</span></li> 
                          <li> <span>地点</span> <span>${dataObj.VF01015_CN}</span></li>
                          <li> <span>时间</span> <span>${timeStr}</span> </li>
                          <li> <span>类型</span>  <span>${typeStr}</span></li>
                          <li> <span> 等级</span> <span>${level}</span></li>
                        </ul>
                    </section>`
      return htmlStr
    }


    return layerMarkGroup;
  }












}













