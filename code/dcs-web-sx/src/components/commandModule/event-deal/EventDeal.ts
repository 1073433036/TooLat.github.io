import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './EventDeal.html?style=./EventDeal.scss'

import UnfinishedEvent from './unfinished-event/UnfinishedEvent'
import NewEvent from './new-event/NewEvent'
import HistoryEvent from './history-event/HistoryEvent'

@WithRender
@Component
export default class EventDeal extends Vue {
  @Action('emergencyStore/toggleEventDeal_global') toggleEventDeal_global

  tabOptionSelected: 'unfinishedEvent' | 'newEvent' | 'finishedEvent' = null
  tabOptView: any = {
    unfinishedEvent: UnfinishedEvent,
    newEvent: NewEvent,
    finishedEvent: HistoryEvent,
  }
  currentView: any = null
  
  selectTabOption(key) {
    if(this.tabOptionSelected === key) return;
    this.tabOptionSelected = key;
    this.currentView = this.tabOptView[key];
  }

  mounted() {
    this.tabOptionSelected = 'unfinishedEvent';     //初始化为当前事件
    this.currentView = UnfinishedEvent;
  }
}