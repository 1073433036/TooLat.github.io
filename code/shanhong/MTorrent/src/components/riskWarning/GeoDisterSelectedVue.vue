<template>
  <main id="GeoDisterSelectedVue">
    <ul class="elements cf">
      <li @click="toggleElement(opt, index)" v-for="(opt, index) of elements" :key="opt.key">
        <em :class="opt.key"></em>
        <div :class="['el', {'on': opt.selected}]">{{ opt.name }}</div>
      </li>
    </ul>
    <div class="tip-div" :class="{show: isShowTipData}" :style="[{top: tipDivScrTop + 'px'}, {right: tipDivScrRight + 'px'}]">
      <p class="p-1">{{tipTypeStr}}</p>
      <p class="p-2">{{tipLocationStr}}</p>
      <p class="p-2">{{tipLevel}}</p>
      <p class="p">{{tipTimeEffeStr}}</p>
      <!--<p>{{tipDataMsg}}</p>-->
    </div>
  </main>
</template>


<script lang="ts">
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  import { riskWarningClient } from '../../util/clientHelper'
  import geoProductUtil from '../../util/riskWarningUtil/geoProductUtil'

  let L,zmap

  @Component
  export default class GeoDisterSelectedVue extends Vue {
    @Prop() date: Date
    @Prop() hour: number
    @Prop() minute: number
    @Prop() url: string
    @Action('systemStore/storeSwanMessageTip_global') storeSwanMessageTip_global
    @Action('systemStore/storeColorbar_global') storeColorbar_global
    elements: any[] = [
      { key: 'tfEffeTime', name: '24小时', selected: false, timeEffe: 24,  layer: null},
      { key: 'feEffeTime', name: '48小时', selected: false, timeEffe: 48,  layer: null},
      { key: 'stEffeTime', name: '72小时', selected: false, timeEffe: 72,  layer: null},
      { key: 'nsEffeTime', name: '96小时', selected: false, timeEffe: 96,  layer: null},
      { key: 'otzEffeTime', name: '120小时', selected: false, timeEffe: 120,  layer: null},
      { key: 'offEffeTime', name: '144小时', selected: false, timeEffe: 144,  layer: null},
      { key: 'oseEffeTime', name: '168小时', selected: false, timeEffe: 168,  layer: null},
      { key: 'ontEffeTime', name: '192小时', selected: false, timeEffe: 192,  layer: null},
      { key: 'tosEffeTime', name: '216小时', selected: false, timeEffe: 216,  layer: null},
      { key: 'tfzEffeTime', name: '240小时', selected: false, timeEffe: 240,  layer: null}
    ]
    bounds: any = null
    selecteHour: string = '00'
    oldKey: string = ''
    isShowTipData: boolean = false
    tipDivScrTop: number = 0
    tipDivScrRight: number = 0
    tipDataMsg: string = ""
    zmapUtil: any = null;
    selectedtimeEffe: number = 0;   //记录选择的时效
    tipTypeStr: string = ''         //类型
    tipLocationStr: string = ''        //位置
    tipLevel: string = ''         //等级
    tipTimeEffeStr: string = ''        //时效
    isBackLastTime: string = ''   //如果当前选择失败, 获取上一个
    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      this.zmapUtil = new geoProductUtil();
    }
    destroyed() {
      this.removeImageLayer()
    }



    toggleElement(opt, index) {
      //移除监听
      zmap.off('mousemove', this.linstenMapMove);
      if(this.elements[index].selected) {
        this.elements[index].selected = false;
        this.removeImageLayer();
        this.removeMsgTip(index);
        return;
      }
      this.elements.forEach((el, i) => {
        el.selected = i === index;
      });
      this.getGeoDisterProdData(opt.timeEffe, index)
    }

    async getGeoDisterProdData(effTime: number, index: number) {
      this.removeImageLayer();
      //判断 选择小时 < 12 主动跳到 00, >=12 都为 12
      if (this.hour < 12) {
        this.selecteHour = '00'
      }else {
        this.selecteHour = '12'
      }
      this.selectedtimeEffe = effTime;
      let dateTime: string = moment(this.date).format('YYYY-MM-DD') + ` ${this.selecteHour}:00:00`
      console.log(this.date);
//      dateTime = "2017-11-08 00:00:00"
      let ref: any = await riskWarningClient.getGeoLocationDisterData(dateTime, effTime, this.url);
      console.log(ref)
      if (!this.elements[index].selected) return
      if (ref) {
        this.showSelectedMsgTip(index, true)
        if(JSON.stringify(ref) === "{}") return;
        for (var key in ref){
          for (let item of ref[key]) {
            let locationStr = item.hasOwnProperty("name") ? item['name'] : item['county'];
            this.zmapUtil.drawBoundary(item['boundary'], key, locationStr, this.showTipView)
          }
        }
        zmap.on('mousemove', this.linstenMapMove)
      }else {
          this.showSelectedMsgTip(index, false)
      }
    }

    //{cityName: cityName, colorLevel: colorLevel, isShow: true};
    showTipView(msgObj) {
      console.log(msgObj)
      this.isShowTipData = msgObj.isShow;
      this.tipDataMsg = `位置: ${msgObj.cityName}, 等级: ${msgObj.colorLevel}, 时效: ${this.selectedtimeEffe}小时`
      this.tipTypeStr = this.getViewType();
      this.tipLocationStr = `位置: ${msgObj.cityName}`
      this.tipLevel = `等级: ${msgObj.colorLevel}`
      this.tipTimeEffeStr = `时效: ${this.selectedtimeEffe}小时`
    }

    linstenMapMove(pos) {
      this.tipDivScrTop = pos.containerPoint.y - 10;
      this.tipDivScrRight = document.body.clientWidth - (pos.containerPoint.x - 20);
    }


    removeImageLayer() {
      this.zmapUtil.clearLayer();
    }

    showSelectedMsgTip(index: number, hasData: boolean) {
      //先移除上个
      this.storeSwanMessageTip_global({ key: this.oldKey, type: 'remove' })
      let dateTime: string = moment(this.date).format('YYYY-MM-DD') + ` ${this.selecteHour}:00`
      let typeStr = this.getViewType();
      this.storeSwanMessageTip_global({ key: typeStr + this.elements[index].name, time: dateTime, hasData: hasData, type: 'add' });
      this.oldKey = typeStr + this.elements[index].name;
    }
    removeMsgTip(index: number) {
      let typeStr = this.getViewType();
      this.storeSwanMessageTip_global({ key: typeStr + this.elements[index].name, type: 'remove' })
    }

    getViewType(){
      let typeStr: string = ''
      if (this.url === 'geo') {
        typeStr = '地址灾害'
      }else if (this.url === 'flood') {
        typeStr = '山洪风险'
      }else {
        typeStr = '流域风险'
      }
      return typeStr;
    }

    @Watch('date')
    ondateChanged (val: Date, oldVal: Date) {
      this.changeLayer(1)
    }

    @Watch('hour')
    onHourChanged (val: number, oldVal: number) {
      this.changeLayer(2)
    }

    changeLayer(endMap) {
      for (let index = 0; index < this.elements.length; index++) {
        if (this.elements[index].selected) {
           this.getGeoDisterProdData(this.elements[index].timeEffe, index);
        }
      }
    }

  }

</script>


<style lang='scss' scoped>
  #GeoDisterSelectedVue{
    position: relative;
    padding-bottom: 5px;
    border-bottom: 1px solid #e6e6e6;
    ul.elements li em {
      &.tfEffeTime { background: rgb(252, 48, 47); }
      &.feEffeTime { background: rgb(48, 48, 47); }
      &.stEffeTime { background: rgb(1, 128, 1); }
      &.nsEffeTime { background: rgb(128, 48, 0); }
      &.otzEffeTime { background: rgb(190, 92, 100); }
      &.offEffeTime { background: rgb(170, 58, 175); }
      &.oseEffeTime { background: rgb(33, 33, 251); }
      &.ontEffeTime { background: rgb(103, 151, 204); }
      &.tosEffeTime { background: rgb(11, 101, 101); }
      &.tfzEffeTime { background: rgb(0, 0, 0); }
    }
    .tip-div {
      background-color: #4c4f4f;
      border-radius: 4px;
      position: fixed;
      display: none;
      &.show {
        display: block;
      }
      p {
        color: white;
        padding: 5px;
        text-align: left;
        white-space: nowrap;
      }
      .p-1 {
        padding: 0;
        padding-top: 5px;
        text-align: center;
      }
      .p-2 {
        padding: 0;
        padding-left: 5px;
        padding-top: 5px;
        text-align: left;
      }
    }
  }
</style>
