import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './Experts.html?style=./Experts.scss'

//import ExpertsPopup from './experts-popup/ExpertsPopup'
import { ExpertClient } from "../../../../util/clientHelper";

@WithRender
@Component
export default class Experts extends Vue {

  thead: any  = {
    emergencyman: '专家名',
    address: '常驻地址',
    phone: '电话',
    cellphone: '手机'
  }
  keyWord: string = null
  //type: string = null
  info: any = null
  infoLength: number = 0
  allPageNum: number = 0
  currentPage: number = 0
  currentPageData: any = null
  //detailView: any = null
  //selectedInfo: any = null
  //selectedInfoKey: string = null

  async initExperts() {
    let msg = await ExpertClient.getExperts();
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
  // toggleType() {
  //   console.log(this.type);
  // }
  // showDetailInfo({opt, optKey}) {
  //   this.selectedInfo = { ...opt };
  //   this.selectedInfoKey = optKey;
  //   this.detailView = ExpertsPopup;
  // }
  // closeDetailPopup() {
  //   this.detailView = null;
  // }

  mounted () {
    this.initExperts();
  }
}