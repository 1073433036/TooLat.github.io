import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './OceanMonitor.html?style=./OceanMonitor.scss'

import Flatpickr from 'flatpickr'
import moment from 'moment'
import { Helper } from '../../../util/Helper'
import { ImageClient } from '../../../util/clientHelper'

@WithRender
@Component
export default class OceanMonitor extends Vue {
  @Action('systemStore/toggleOceanMonitor_global') toggleOceanMonitor_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global

  datetPicker: any = null
  startDate: string = null
  startTimes: any = {
    '8': 0,
    '20': 12,
  }
  startTime: number = 0
  leadtime: number = 1
  layer: any = null
  imgBound: any = {
    left: 105,
    right: 115,
    top: 22,
    bottom: 17
  }

  get leadtimes() {
    let arr = [];
    for(let i = 1; i <= 64; i++) {
      arr.push(i);
    }
    return arr;
  }

  openCalendar() {
    this.datetPicker.open();
  }
  monitor() {
    let time = this.startDate + (this.startTime ? ' 12:00:00' : ' 00:00:00');
    const imgUrl = ImageClient.getOceanUrl(time, this.leadtime);
    console.log(imgUrl);
    this.getImage(imgUrl);
  }
  getImage(imgUrl) {
    let img = new Image();
    img.onload = () => {
      this.removeLayer();
      const layer = Object.assign({imgUrl}, this.imgBound);
      this.addLayer(layer);
      this.toggleOprateTip_global({ tip: true, text: '海流数据获取成功' });
    }
    img.onerror = () => {
      this.toggleOprateTip_global({ tip: true, text: '获取海流数据失败' });
    }
    img.src = imgUrl;
  }
  addLayer(layer) {
    let helper = new Helper;
    this.layer = helper.addImgLayer(layer.imgUrl, layer);
    helper = null;
  }
  removeLayer() {
    if(!this.layer) return;
    let helper = new Helper;
    helper.removeImgLayer(this.layer);
    this.layer = null;
    helper = null;
  }

  mounted () {
    let time = new Date().getTime() - 24*60*60*1000;
    this.startDate = moment(time).format('YYYY-MM-DD');
    this.datetPicker = new Flatpickr(document.querySelector('#oceanPicker'), {
      enableTime: false,
    });
  }

  beforeDestroy () {
    this.removeLayer();
  }
}