import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './HistoryPlanPanel.html?style=./HistoryPlanPanel.scss'

import moment from 'moment'

@WithRender
@Component
export default class HistoryPlanPanel extends Vue {
  @Getter('emergencyStore/relateorgs_global') relateorgs
  @Getter('emergencyStore/influences_global') influences
  @Prop() closeFunc

  thead: any = {
    name: '名称',
    level: '等级',
    starttime: '时间',
    opera: '操作'
  }
  tbody: any = ['name','level','starttime']
  detailParams: any = {
    name: '预案名称',
    meaName: '预案类型',
    level: '预案等级',
    relateOrgIds: '部门单位',
    influenceIds: '单位类型'
  }

  historyPlans: any = {}
  detailPanel: any = {
    show: false,
    info: {}
  }

  async initHistoryPlan() {
    let res: any = await fetch(`http://10.148.83.228:8086/emergency/plan/get/period/user/post/,/post?from=2017-01-01%2010:00:00&to=${moment().format('YYYY-MM-DD HH:mm:ss')}`);
    let mes: any = await res.json();
    let data: any = mes.tagObject;
    if(!data || !data.length) return;
    let obj = {};
    for(let info of data) {
      info.starttime = moment(info.starttime).format('YYYY-MM-DD HH:mm:ss');
      if(info.relateOrgIds.length) {    //部门单位
        let msg = '';
        for(let org of info.relateOrgIds) {
          msg += this.relateorgs[org] + ' ';
        }
        info.relateOrgIds = msg;
      } else {
        info.relateOrgIds = '';
      }
      if(info.influenceIds.length) {    //单位类型
        let msg = '';
        for(let influ of info.influenceIds) {
          msg += this.influences[influ] + ' ';
        }
        info.influenceIds = msg;
      } else {
        info.influenceIds = '';
      }
      obj[info.id] = info;
    }
    this.historyPlans = { ...obj };
  }
  async openDetailPanel(plan) {
    this.detailPanel.show = true;
    //this.detailPanel.info = { ...plan };
    let obj = {
      datetime: undefined,
      username: undefined,
      summary: undefined
    }
    let res: any = await fetch(`http://10.148.83.228:8086/emergency/plan/summary/user/post/,/post?planId=${plan.id}`);
    let msg: any = await res.json();
    if(msg.result === 'S_OK') {
      const tagObject = msg.tagObject;
      obj.datetime = moment(tagObject.datetime).format('YYYY-MM-DD HH:mm');
      obj.username = tagObject.username,
      obj.summary = tagObject.summary === 'null' ? '无' : tagObject.summary;
    }
    this.detailPanel.info = Object.assign({}, plan, obj);
  }
  closeDetailPanel() {
    this.detailPanel.show = false;
  }

  created () {
    this.initHistoryPlan();
  }
}