import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './NewEvent.html?style=./NewEvent.scss'

import moment from 'moment'
import { EventClient } from '../../../../util/clientHelper'
import RegionPanel from '../region-panel/RegionPanel'
import RegionModel from '../region-model/RegionModel'

@WithRender
@Component({
  components: {
    RegionModel,
  }
})
export default class NewEvent extends Vue {
  @Prop() selectTabOption
  @Getter('systemStore/loginUser_global') loginUser_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global

  moment: any = moment
  regionView: any = null
  name: string = null
  description: string = null
  regions: any = {}

  addRegions(region) {
    let index = Object.keys(this.regions).length;
    region.id = index;
    this.$set(this.regions, index, region);
  }
  deleteRegions(index) {
    let key = index + '';
    delete this.regions[key];
    this.regions = { ...this.regions };
  }
  async startEventDeal() {
    if(!this.name || !this.description) {
      this.toggleOprateTip_global({ tip: true, text: '事件名称和事件描述不得为空' });
      return;
    }
    let userId = this.loginUser_global.userId;
    let data = await EventClient.startEventDeal(this.name, this.description, userId);
    if(data) {
      this.addEmergencyRegion(data.id)
      .then(() => {
        this.toggleOprateTip_global({ tip: true, text: '事件启动成功' });
        this.selectTabOption('unfinishedEvent');
      });
    }
    else this.toggleOprateTip_global({ tip: true, text: '事件启动失败' });
  }
  addEmergencyRegion(eventId) {
    let promiseArr = [];
    for(let i in this.regions) {
      let region = this.regions[i];
      region.id = 0;        //重新置0
      region.eventId = eventId;
      promiseArr.push(new Promise(async (resolve, reject) => {
        let res = await EventClient.addEmergencyRegion(eventId, region);
        if(res) resolve();
        else reject();
      }));
    }
    return Promise.all(promiseArr);
  }
  toggleRegionPanel() {       //添加应急区域面板
    this.regionView = this.regionView ? null : RegionPanel;
  }
}