import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './RegionModel.html?style=./RegionModel.scss'

import { Helper } from '../../../../util/Helper'
import GeoPoi from '../../../../util/GeoPoi'
import { GeographyClient } from '../../../../util/clientHelper'

@WithRender
@Component
export default class RegionModel extends Vue {
  @Prop() regions
  @Prop() deleteRegions
  @Action('basicInfoStore/addGeoPoiSet_global') addGeoPoiSet_global
  @Action('basicInfoStore/clearAllGeoPoi_global') clearAllGeoPoi_global
  @Action('basicInfoStore/matchGeoPoi_global') matchGeoPoi_global
  
  drawKey: number = null      //绘制区域关键字
  area: any[] = []            //绘制区域
  areaText: any = null        //绘制区域文字
  poiRegion: any = {
    1: '1KM内附近物资',
    5: '5KM内附近物资',
    10: '10KM内附近物资',
  }
  poiRegionKey: string = null
  poiNameArray: string[] = ['School','Hospital','Reservoir','Chemical','Loudspeaker','Openspace','Led', 'Electricity', 'RiskPoint','Material','Rescueteam']
  materialPurpose: any = {
    自然灾害: 'natural',
    公共卫生: 'public',
    事故灾难: 'disaster',
  }
  rescueteamPurpose: any = {
    事故灾难: 'disaster',
    社会安全: 'security',
    自然灾害: 'natural',
    公共卫生: 'public',
    综合: 'multiple',
    医疗救援队: 'medical',
  }
  poiCollection: any = {}         //所有数据点集合
  matchPoiCollection: any = {}    //匹配数据点集合


  togglePoiRegion(region, key) {      //附近应急物资面板
    if(region.radius === -1) {        //县 镇
      if(this.poiRegionKey === region.id + '') {
        this.clearAllData();    //删除匹配点
        this.clearRegion();
        this.poiRegionKey = null;
        return;
      }
      this.poiRegionKey = region.id + '';
      if(this.drawKey !== region.id) this.drawArea(region);
      this.getMatchedPoi('polygon', region);
    } else {                          //圈选
      if(this.poiRegionKey === region.id + '_' + key) {
        this.clearAllData();    //删除匹配点
        this.clearRegion();
        this.poiRegionKey = null;
        return;
      }
      this.poiRegionKey = region.id + '_' + key;
      let radius = region.radius + Number(key);
      region.addRadius = radius;
      this.drawArea(region, radius);
      this.getMatchedPoi('circle', region);
    }
  }

  async getPoi(callback) {         //返回所有数据 函数回调
    let geoPoiHelper = new GeoPoi();
    for(let name of this.poiNameArray) {
      if(this.poiCollection.hasOwnProperty(name)) {
        callback(this.poiCollection[name], name);
        continue;
      }

      let res;
      if(name === 'Material')
        res = await geoPoiHelper.getAllMaterial();
      else if(name === 'Rescueteam')
        res = await geoPoiHelper.getAllRescueteam();
      else
        res = await geoPoiHelper.getPoi({type: name, subType: undefined });
      
      this.poiCollection[name] = res;
      callback(res, name);
    }
  }

  async getMatchedPoi(type, region) {
    this.clearAllData();
    let helper = new Helper();
    let polyArray = [];
    if(type === 'polygon') {
      if(region.countyId === -1) {
        let tagObject = await GeographyClient.getTownBound(region.townId); 
        for(let boundary of tagObject.boundary) {
          let arr = []
          boundary.map(item => {
            arr.push([item.x, item.y]);
          });
          polyArray.push(arr)
        }
      }
    }
    this.getPoi((poiData, key) => {
      if(!poiData) return;
      let matchPois = {};       //范围内的点

      for(let i in poiData) {
        let poi = poiData[i];
        let lon, lat;

        if(key === 'Material') {
            const keys = Object.keys(poi);
            let poiInfo = poi[keys[0]][0];
            lon = poiInfo.gcjLon || poiInfo.lon;
            lat = poiInfo.gcjLat || poiInfo.lat;
        } else if(key === 'Rescueteam') {
            lon = poi[0].gcjLon || poi[0].lon;
            lat = poi[0].gcjLat || poi[0].lat;
        } else {
            lon = poi.gcjLon || poi.lon;
            lat = poi.gcjLat || poi.lat;
        }

        if(type === 'circle') {
          let center = [region.lon, region.lat],
            radius = region.addRadius * 1000,
            d = helper.getDistance(center, [lon, lat]);
          if(d < radius) matchPois[i] = poi;
        } else if (type === 'polygon') {
          if(region.countyId !== -1) matchPois[i] = poi;
          else {
            let point = helper.getCtn2FromCtn3([lon, lat]);
            for (let poly of polyArray) {
              if(helper.isPointInPolygon(point, poly)) {
                matchPois[i] = poi;
                break
              }
            }
          }
        }
      }
        
      if(!Object.keys(matchPois).length) return;
      this.matchPoiCollection[key] = matchPois;
      this.matchPoiCollection = { ...this.matchPoiCollection };

      if(key === 'Material' || key === 'Rescueteam') {
        let poiSet = {};
        if(key === 'Material') {
          for(let i in matchPois) {
            let poi = matchPois[i];
            let keys = Object.keys(poi);
            const type = poi[keys[0]][0].purpose;
            if(poiSet.hasOwnProperty(type) === false) {
              poiSet[type] = {};
            }
            poiSet[type][i] = poi;
          }
        } else {
          for(let i in matchPois) {
            const type = matchPois[i][0].teamtype;
            if(poiSet.hasOwnProperty(type) === false) {
              poiSet[type] = {};
            }
            poiSet[type][i] = matchPois[i];
          }
        }

        for(let i in poiSet) {
          this.addGeoPoiSet_global({
            type: key,
            subType: i,
            subTypeEn: ( key === 'Material' ? this.materialPurpose[i] : this.rescueteamPurpose[i] ),
            data: poiSet[i]
          });
        }
      } else {
        this.addGeoPoiSet_global({
          type: key,
          subType: undefined,
          data: matchPois
        });
      }
    });
  }
  clearAllData() {   
    if(Object.keys(this.matchPoiCollection).length) {
      this.poiRegionKey = null;
      this.matchPoiCollection = {};
      this.clearAllGeoPoi_global();       //清除数据点
    }
  }

  @Watch('matchPoiCollection')
  onmatchPoiCollectionChanged(val: any, oldVal: any): void {
    this.matchGeoPoi_global(val);
  }


  drawArea(region, radius=undefined) {   //绘制图形
    this.clearAllData();
    if(this.drawKey !== null)
      this.clearRegion();
    if(!radius && this.drawKey === region.id) return;
    this.drawKey = region.id;
    if(region.countyId === -1) {
      if(region.townId === -1) {    //圆
        this.drawCircle(region, radius);
      } else {    //镇
        this.drawRegion(undefined, region.townId);
      }
    } else {      //全县
      this.drawRegion(region.countyId, undefined);
    }
  }
  drawCircle(region, r) {        //绘制圆
    const lon = region.lon,
      lat = region.lat,
      radius = r ? r * 1000 : region.radius * 1000;
    const pos = [lon, lat];
    let helper = new Helper;
    this.area.push(helper.addCircleGeometry(pos, radius));
    this.areaText = helper.addLabel(region.name, [region.lon, region.lat], 0.5);
    helper = null;
  }
  async drawRegion(countyId, townId) {    //绘制区域
    let helper = new Helper;
    let tagObject: any;
    if(countyId) tagObject = await GeographyClient.getCountyBound(countyId);    //遂溪县
    else tagObject = await GeographyClient.getTownBound(townId);                //镇
    if(!tagObject) return;
    for(let boundary of tagObject.boundary) {
      let pos = [];
      for(let info of boundary) {
        pos.push(info.x);
        pos.push(info.y);
      }
      this.area.push(helper.addPolygonGeometry(pos));
    }
    let center = JSON.parse(tagObject.center);
    this.areaText = helper.addLabel(tagObject.name, [center.x, center.y], 0.7);
    helper = null;
  }
  clearRegion() {       //清除绘制图形
    if(this.drawKey === null) return;
    this.drawKey = null;
    let helper = new Helper;
    for(let area of this.area)
      helper.removeCollection(area);
    helper.removeEntity(this.areaText);
    this.area = [];
    this.areaText = null;
    helper = null;
  }
  deleteDrawRegion(key) {
    if(!confirm('确定删除该应急地点吗？')) return;
    if(key === this.drawKey) this.clearRegion();
    this.clearAllData();
    this.deleteRegions(key);
  }
  
  beforeDestroy() {
    this.clearRegion();
    this.clearAllData();
  }
}