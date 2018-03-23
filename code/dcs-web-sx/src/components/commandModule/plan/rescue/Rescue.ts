import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './Rescue.html?style=./Rescue.scss'

import { PoiClient } from '../../../../util/clientHelper'
import RescuePopup from './rescue-popup/RescuePopup'

@WithRender
@Component
export default class Rescue extends Vue {
  @Getter('systemStore/region_global') region_global

  info: any = null
  infoLength: number = 0
  allPageNum: number = 0
  currentPage: number = 0
  currentPageData: any = null
  selectedInfo: any = null
  selectedInfoKey: number = null
  types: string[] = ['事故灾难','社会安全','自然灾害','公共卫生','综合','医疗救援队']
  type: string = null
  thead: any = {
    teamname: '队伍名称',
    manager: '负责人',
    cellphone: '手机号码',
  }
  keyWord: string = null
  detailView: any = null

  initInfo(info) {
    if(!info || !info.length) {
      this.reducteInfo();
      return;
    }
    for(let item of info) {
      item.show = true;
      item = { ...item };
    }
    this.info = info;
    this.infoLength = info.length;
    this.currentPage = 0;
    this.getAllPageNum();
    this.toggleCurrentPageData();
  }
  reducteInfo() {
    this.info = null
    this.infoLength = 0
    this.allPageNum = 0
    this.currentPage = 0
    this.currentPageData = null
    this.selectedInfoKey = null
  }
  getAllPageNum() {
     this.allPageNum = Math.ceil( this.infoLength / 10 );
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
  selectInfo(info) {
    const key = info.id;
    if(this.selectedInfoKey === key) {
      this.detailView = null;
    } else {
      this.selectedInfoKey = key;
      this.selectedInfo = info;
      this.detailView = RescuePopup;
    }
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
  async toggleType() {
    if(this.keyWord) this.keyWord = null;
    const type = this.type;
    let info;
    if(type === 'all') 
      info = await PoiClient.getAllEntities('Rescueteam');
    else
      info = await PoiClient.findByType(this.region_global.countyId, 'Rescueteam', type);
    this.initInfo(info);
  }
  closeDetailPopup() {
    this.detailView = null;
    this.selectedInfo = null;
    this.selectedInfoKey = null;
  }

  mounted () {
    this.type = 'all';
    this.toggleType();
  }
}