import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './RegionPopup.html?style=./RegionPopup.scss'

import { Helper } from '../../../../util/Helper'
import { GeographyClient } from '../../../../util/clientHelper'

@WithRender
@Component
export default class RegionPopup extends Vue {
  @Prop() planId: string
  @Prop() closeFunc
  @Getter('systemStore/region_global') region
  @Action('emergencyStore/doRefreshPlan_global') doRefreshPlan
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global

  nav : string = '绘制标注'
  navs: any = ['绘制标注','行政地区']
  drawWay: any = {
    circle: false       //用于判定绘制是否完成
  }
  areaName: string = null
  area: any[] = []      //绘制区域
  areaText: any = null  //绘制区域文字
  lon: number = null
  lat: number = null
  radius: number = null     
  showCircleInfo: boolean = false   //是否添加过圆
  towns: any = {}
  townId: any = 'all'
  description: string = null
  sourceman: string = null
  sourcephone: string = null
  drawHelper: any = null

  async toggleNav(key) {
    if(key === '绘制标注')
      this.clearTown();
    else if(key === '行政地区') {
      if(this.showCircleInfo) this.clearCircle();
      if(Object.keys(this.towns).length) {
        this.drawTown();
        return;
      }
      await this.initTowns();
      this.drawTown();
    }
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
  async drawTown() {    //绘制镇
    let helper = new Helper;
    this.clearTown();
    let tagObject: any;
    if(this.townId === 'all') tagObject = await GeographyClient.getCountyBound(this.region.countyId);
    else tagObject = await GeographyClient.getTownBound(this.townId);
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
  clearTown() {     //删除镇
    if(!this.area.length) return;
    let helper = new Helper;
    for(let area of this.area)
      helper.removeCollection(area);
    helper.removeEntity(this.areaText);
    this.area = [];
    this.areaText = null;
    helper = null;
  }
  drawRegion() {      //手动绘制
    if(this.drawWay.circle) {
      this.drawWay.circle = false;
      this.drawHelper.stopDrawing();
      this.drawHelper = null;
    } else {
      this.drawWay.circle = true;
      let helper = new Helper;
      if(this.showCircleInfo) this.clearCircle();
      this.drawHelper = helper.startDrawing('circle', true, circle => {
        this.area.push(circle);
        let center = circle.getCenter();
        center = helper.getCoorFromCtn3(center);
        const lon = center[0].toFixed(2), 
          lat = center[1].toFixed(2);
        this.lon = lon;
        this.lat = lat;
        let radius = circle.getRadius();
        radius = (radius / 1000).toFixed(2);
        this.radius = radius;
        this.showCircleInfo = true;
        this.drawWay.circle = false;
        this.areaText = helper.addLabel(this.lon + ' , ' + this.lat, [this.lon, this.lat], 0.7);
        helper = null;
      });
    }
  }
  clearCircle() {
    this.lon = this.lat = this.radius = null;
    this.showCircleInfo = false;
    let helper = new Helper;
    for(let area of this.area)
      helper.removeCollection(area);
    helper.removeEntity(this.areaText);
    helper = null;
    this.area = [];
    this.areaText = null;
  }
  async addRegion() {
    let name,countyId = -1,townId = -1,lon = 110.25,lat = 21.37,radius = -1;       //小于0代表不启用
    if(this.nav === '绘制标注') {
      if(!this.showCircleInfo) {
        alert('请先绘制灾难地点范围！');
        return;
      }
      if(!this.areaName) {
        alert('请输入绘制区域描述');
        return;
      }
      name = this.areaName;
      lon = this.lon;
      lat = this.lat;
      radius = this.radius;
    } else if (this.nav === '行政地区') {
      if(this.townId === 'all') {
        name = '遂溪县';
        countyId = this.region.countyId;
      } else {
        name = this.towns[this.townId];
        townId = this.townId;
      }
    }
    let region: any = {
      id: 0,
      name,
      planId: this.planId,
      countyId,
      townId,
      lon,
      lat,
      radius,
      sourceman: this.sourceman,
      sourcephone: this.sourcephone,
      description: this.description
    };
    let text: string = ''; 
    for(let i in region) {
      text += `&region[${i}]=${region[i]}`;
    }
    region = text;
    let res = await fetch(`http://10.148.83.228:8086/emergency/plan/region/add/user/post/,/post?planId=${this.planId}&countyId=${this.region.countyId}${region}`);    
    let msg = await res.json();
    console.log(msg);
    if(msg.result === 'S_OK') {
      this.doRefreshPlan(true);
      if(this.showCircleInfo) {
        this.clearCircle()
        this.showCircleInfo = false
        this.areaName = null
      }
      this.description = null
      this.sourceman = null
      this.sourcephone = null
    } else {
      alert(msg.description);
    }
  }

  destroyed () {
    if(this.drawHelper) {
      this.drawHelper.stopDrawing();
      this.drawHelper = null;
    }
    if(this.showCircleInfo) this.clearCircle();
    this.clearTown();
  }
}