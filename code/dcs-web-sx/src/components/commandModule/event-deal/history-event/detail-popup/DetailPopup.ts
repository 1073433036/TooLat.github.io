import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './DetailPopup.html?style=./DetailPopup.scss'

import moment from 'moment'
import RegionModel from '../../region-model/RegionModel'
import { EventClient } from '../../../../../util/clientHelper'

@WithRender
@Component
export default class DetailPopup extends Vue {
  @Prop() event
  @Prop() closeFn
  moment: any = moment
  regions: any = {}
  regionModelView: any = null

  async getRegions(key) {       //根据事件id获取事件应急区域
    let res: any = await EventClient.getEmergencyRegions(key);
    if(res) this.regions = { ...res };
  }

  @Watch('event')
  async oneventChanged(val: any, oldVal: any) {
    this.regionModelView = null;
    await this.getRegions(val.id);
    this.regionModelView = RegionModel;
  }

  mounted() {
    this.regionModelView = RegionModel;
    this.getRegions(this.event.id);
  }
}