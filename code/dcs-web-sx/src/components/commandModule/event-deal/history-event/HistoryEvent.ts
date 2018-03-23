import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './HistoryEvent.html?style=./HistoryEvent.scss'

import { EventClient } from '../../../../util/clientHelper'
import moment from 'moment'
import DetailPopup from './detail-popup/DetailPopup'

@WithRender
@Component
export default class HistoryEvent extends Vue {
  moment: any = moment
  thead: any  = {
    name: '事件名称',
    userName: '应急人',
    starttime: '时间',
  }
  keyWord: string = null
  info: any = []
  infoLength: number = 0
  allPageNum: number = 0
  currentPage: number = 0
  currentPageData: any = null
  event: any = {}
  detailView: any = null
  
  async getFinishEvent() {
    let msg = await EventClient.getFinishEvent();
    if(!msg || !msg.length) {
      this.info = [];
      return;
    }
    for(let info of msg) {
      info.show = true;
      info = { ...info };
    }
    this.info = msg;
    this.infoLength = msg.length;
    this.getAllPageNum();
    this.toggleCurrentPageData();
  }
  getAllPageNum() {
     this.allPageNum = Math.ceil( this.infoLength / 10 );
  }
  search() {
    const info = this.info;
    if(this.keyWord) {
      const keyRegExp = new RegExp(this.keyWord);
      let dataLen: number = 0;
      for(let item of info) {
        let show: boolean = false;
        for(let i in item) {
          if(keyRegExp.test(item[i])) {
            show = true;
            dataLen++;
            break;
          } 
        }
        item.show = show;
      }
      this.infoLength = dataLen;
    } else {
      for(let i in info) {
        info[i].show = true;
      }
      this.infoLength = Object.keys(this.info).length;
    }
    this.currentPage = 0;
    this.getAllPageNum();
    this.toggleCurrentPageData();
  }
  togglePage(status) {
    if(status) {
      if(this.currentPage + 1 < this.allPageNum) {
        this.currentPage ++;
        this.toggleCurrentPageData();
      }
    } else { 
      if(this.currentPage > 0) {
        this.currentPage --;
        this.toggleCurrentPageData();
      }
    }
  }
  toggleCurrentPageData() {
    const num = this.currentPage;
    this.currentPageData = this.info.slice().splice(10*num, 10);
  }

  watchDetail(event) {
    if(this.event.id === event.id) {
      this.event = {};
      this.detailView = null;
    } else {
      this.event = { ...event };
      this.detailView = DetailPopup;
    }
  }
  closeDetailPopup() {
    this.detailView = null;
  }

  mounted() {
    this.getFinishEvent();
  }
}