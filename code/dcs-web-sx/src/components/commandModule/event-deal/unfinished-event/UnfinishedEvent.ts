import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './UnfinishedEvent.html?style=./UnfinishedEvent.scss'

import moment from 'moment'
import { EventClient } from '../../../../util/clientHelper'
import RegionPanel from '../region-panel/RegionPanel'
import RegionModel from '../region-model/RegionModel'

@WithRender
@Component
export default class UnfinishedEvent extends Vue {
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global

  moment: any = moment
  display: any = {
    listPopup: false,
  }
  unfinishedEvent: any = {}
  eventKey: string = null
  regions: any = {}
  regionView: any = null
  regionModelView: any = null

  async getUnfinishEvent() {      //获取未完成事件
    this.unfinishedEvent = {};
    let data = await EventClient.getUnfinishEvent();
    if(!data || !data.length) {
      this.unfinishedEvent = {};
      return;
    }
    for(let item of data) {
      this.unfinishedEvent[item.id] = item;
    }
    this.unfinishedEvent = { ...this.unfinishedEvent };
    this.eventKey = Object.keys(this.unfinishedEvent)[0];     //初始化第一个数据
    this.getRegions(this.eventKey);
  }
  async getRegions(key) {       //根据事件id获取事件应急区域
    let res: any = await EventClient.getEmergencyRegions(key);
    if(res) this.regions = { ...res };
  }
  async addRegions(region) {      //增加区域
    region.eventId = this.eventKey;
    let res = await EventClient.addEmergencyRegion(this.eventKey, region);
    if(res) this.getRegions(this.eventKey);
  }
  async deleteRegions(key) {    //删除应急区域
    let res: any = await EventClient.deleteEmergencyRegions(key);
    if(res) this.getRegions(this.eventKey);
  }
  async stopEventDeal() {       //结束事件
    if(!confirm('确定结束当前事件?')) return;
    let res: any = await EventClient.stopEventDeal(this.eventKey);
    if(res) {
      this.toggleOprateTip_global({ tip: true, text: '结束事件成功' });
      this.regionModelView = null;      //触发RegionModel的beforeDestroy
      await this.getUnfinishEvent();
      this.regionModelView = RegionModel;
    } 
    else this.toggleOprateTip_global({ tip: true, text: '结束事件失败' });
  }
  toggleEvent(key) {          //切换事件
    //this.regionModelView = null;
    this.eventKey = key;
    this.getRegions(key);
    this.display.listPopup = false;
    //this.regionModelView = RegionModel;
  }
  toggleRegionPanel() {       //添加应急区域面板
    this.regionView = this.regionView ? null : RegionPanel;
  }

  mounted() {
    this.getUnfinishEvent();   
    this.regionModelView = RegionModel;
  }
}