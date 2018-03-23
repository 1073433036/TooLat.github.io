import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './RegionPanel.html?style=./RegionPanel.scss'

import { Helper } from '../../../../util/Helper'
import { GeographyClient, EventClient } from '../../../../util/clientHelper'

@WithRender
@Component
export default class RegionPanel extends Vue {
  @Prop() togglePanel
  @Prop() addRegions
  @Getter('systemStore/region_global') region
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global

  navs: string[] = ['绘制标注', '行政地区']
  nav: '绘制标注' | '行政地区' = '绘制标注'

  circleInfo: any = {
    lon: null,
    lat: null,
    radius: null,
  }
  isAddCircle: boolean = false   //判断是否绘制过圆
  circle: boolean = false        //true  圆未绘制完成  false 绘制完成
  drawHelper: any = null
  areaName: string = null       //自定义全选区域name

  drawarea: any[] = []
  areaText: any = null

  area: any = 'all'     //当前行政区
  towns: any = {}

  drawCircle() {
    if(this.circle) {
      this.clearDrawHelper();
    } else {
      this.circle = true;
      let helper = new Helper();
      if(this.isAddCircle)  this.clearRegion();
      this.drawHelper = helper.startDrawing('circle', true, circle => {
        this.drawarea.push(circle);
        let center = circle.getCenter();
        center = helper.getCoorFromCtn3(center);
        const lon = center[0].toFixed(4), 
          lat = center[1].toFixed(4);
        this.circleInfo.lon = lon;
        this.circleInfo.lat = lat;
        let radius = circle.getRadius();
        radius = (radius / 1000).toFixed(2);
        this.circleInfo.radius = radius;
        this.isAddCircle = true;
        this.circle = false;
        this.areaText = helper.addLabel(lon + ' , ' + lat, [lon, lat], 0.7);
        helper = null;
      });
    }
  }
  clearDrawHelper() {
    if(this.circle) {
      this.circle = false;
      this.drawHelper.stopDrawing();
      this.drawHelper = null;
    }
  }

  clearRegion() {
    this.circleInfo.lon = this.circleInfo.lat = this.circleInfo.radius = null;
    this.isAddCircle = false;
    let helper = new Helper;
    for(let area of this.drawarea)
      helper.removeCollection(area);
    helper.removeEntity(this.areaText);
    this.drawarea = [];
    this.areaText = null;
    helper = null;
  }
  async initTowns() {
    const countyId = this.region.countyId;
    let data: any = await GeographyClient.getTownsBound(countyId);
    if(!data) return;
    let obj = {};
    for(let info of data) {
      obj[info.townId] = info.name;
    }
    this.towns = { ...obj };
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
      this.drawarea.push(helper.addPolygonGeometry(pos));
    }
    let center = JSON.parse(tagObject.center);
    this.areaText = helper.addLabel(tagObject.name, [center.x, center.y], 0.7);
    helper = null;
  }
  toggleArea() {
    this.clearRegion();
    if(this.area === 'all') this.drawRegion(this.region.countyId, undefined);
    else this.drawRegion(undefined, Number(this.area));
  }
  async toggleNav() {
    if(this.nav === '绘制标注') {
      this.clearRegion();
    } else {
      if(!Object.keys(this.towns).length) await this.initTowns();
      this.toggleArea();
      this.clearDrawHelper();
    }
  }
  async addRegion() {
    let name, countyId = -1, townId = -1, lon = 110.25,lat = 21.37,radius = -1;  
    if(this.nav === '绘制标注') {
      if(!this.isAddCircle) {
        this.toggleOprateTip_global({ tip: true, text: '请绘制应急区域' });
        return;
      }
      if(!this.areaName) {
        this.toggleOprateTip_global({ tip: true, text: '请输入区域描述' });
        return;
      }
      name = this.areaName;
      lon = this.circleInfo.lon;
      lat = this.circleInfo.lat;
      radius = this.circleInfo.radius;
    } else {
      if(this.area === 'all') {
        name = '遂溪县';
        countyId = this.region.countyId;
      } else {
        name = this.towns[this.area];
        townId = this.area;
      }
    }
    let region = {
      id: 0,
      name,
      eventId: null,
      countyId,
      townId,
      lon,
      lat,
      radius,
    };
    this.addRegions(region);
  }

  mounted() {
    
  }

  beforeDestroy() {
    this.clearDrawHelper();
    this.clearRegion();
  }
}