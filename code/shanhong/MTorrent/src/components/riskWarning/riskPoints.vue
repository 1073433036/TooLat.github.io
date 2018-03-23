<template>

  <main id="riskPoint-div">

    <ul class="elements cf">
      <li @click="clickSelected(opt)" v-for="(opt, index) of elements" :key="opt.key">
        <em :class="opt.key"></em>
        <div :class="['el', {'on': opt.selected}]">{{opt.name}}</div>
      </li>
    </ul>

    <!--<div class="risk-left" @click.stop="clickSelected()">-->
      <!--<span class="box" :class="{selected: isSelected}"></span>-->
      <!--<span class="title-name" :class="{selected: isSelected}">灾害点</span>-->
    <!--</div>-->
  </main>

</template>


<script lang="ts">

  let L,zmap
  import Vue from 'vue'
  import { Component, Watch, Prop} from 'vue-property-decorator'
  import { riskWarningClient } from '../../util/clientHelper'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'

  @Component
  export default class riskPoints extends Vue {
    @Getter('systemStore/userInfo_global') userInfo_global: any
    @Action('systemStore/storeRiskPointInfo_global') storeRiskPointInfo_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    @Action('systemStore/storeSwanMessageTip_global') storeSwanMessageTip_global
//    isSelected: boolean = false
    @Prop() isOn: boolean
    riskLayerMarkGroup: any = null;

    elements: any[] = [
      { key: 'riskPoint', name: '灾害点', selected: false},
      ]

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
    }

    async clickSelected(opt: any) {
//      this.isSelected = !this.isSelected;
      opt.selected = !opt.selected;
      if (opt.selected) {
        this.getRiskPointsData();
      }else {
        this.storeSwanMessageTip_global({ key: this.elements[0].name, type: 'remove' })
        this.removeMapLayer();
      }
    }

    async getRiskPointsData() {
      let ref = await riskWarningClient.getRiskPointsData(9, this.userInfo_global.user.cityid)
      let requreTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      if (ref) {
        this.storeSwanMessageTip_global({ key: this.elements[0].name, time: requreTime, hasData: true, type: 'add' })
        let screenData = this.doWithRiskData(ref);
        this.mapMarksWithData(screenData);
      }else {
        this.storeSwanMessageTip_global({ key: this.elements[0].name, time: requreTime, hasData: false, type: 'add' })
      }
    }

    //筛选数据(根据用户登录信息==> countyid不为0, 拿到数据后,筛选对应的值, 为0, 直接获取整个城市的值, countyid = 0 和 cityId = 0 => 整个广东省)
    doWithRiskData(refData: any) {
      let riskPointsData: any = [];
      let countyid = this.userInfo_global.user.countyId;
      if (countyid === 0){
        riskPointsData = refData;
        return riskPointsData;
      }
      for (let i = 0; i < refData.length; i++){
        let item = refData[i];
        if (countyid === item.countyid) {
          riskPointsData.push(item);
        }
      }
      return riskPointsData;
    }

    //地图标记
    mapMarksWithData(refData: any) {
      let layerMarkGroup = L.layerGroup().addTo(zmap);
      for (let i = 0; i < refData.length; i++){
        let item = refData[i];
        let markIcon = L.icon({
          iconUrl: 'static/img/disaster.png',
          iconSize: [25, 25],
        })
        let tempMark = L.marker([item.lat, item.lon], {icon: markIcon});
        layerMarkGroup.addLayer(tempMark);

        tempMark.on('mouseover', e => {
          let x = e.containerPoint.x,
            y = e.containerPoint.y
          item.pos = { x, y }
          if (item.reporttime)
            item.reporttime = moment(item.reporttime).format('YYYY-MM-DD HH:mm:ss')
          this.storeRiskPointInfo_global(item)
          this.storePopupStatus_global({ key: 'RiskPoint', action: true })
        })
        tempMark.on('mouseout', e => {
          this.storeRiskPointInfo_global(null)
          this.storePopupStatus_global({ key: 'RiskPoint', action: false })
        })
      }
      this.riskLayerMarkGroup = layerMarkGroup;
    }

    removeMapLayer() {
      if (this.riskLayerMarkGroup.layer === null) return
      zmap.removeLayer(this.riskLayerMarkGroup)
    }

    @Watch('isOn')
    didIsOnChange(val: number, oldVal: number){
      this.elements[0].selected = val;
      if (val){
        this.getRiskPointsData();
      }else {
        this.storeSwanMessageTip_global({ key: this.elements[0].name, type: 'remove' })
        this.removeMapLayer();
      }
    }

  }

</script>


<style lang='scss' scoped>

  #riskPoint-div {
    /*font-size: 0px;*/
    /*height: 40px;*/
    position: relative;
    padding-bottom: 5px;
  ul.elements li em {
      &.riskPoint { background: rgb(252, 48, 47); }
    }

    /*.risk-left{*/
      /*font-size: 12px;*/
      /*display: inline-block;*/
      /*margin: 5px 0 0 46px;*/
      /*vertical-align: top;*/
      /*width: 70px;*/
      /*height: 30px;*/
      /*!*background-color: red;*!*/
      /*cursor: pointer;*/
      /*text-align: center;*/
      /*.box {*/
        /*display: inline-block;*/
        /*width: 16px;*/
        /*height: 16px;*/
        /*border-radius: 15px;*/
        /*border: 1px solid #999;*/
        /*vertical-align: top;*/
        /*margin-top: 7px;*/
        /*&.selected {*/
          /*background: url("../../assets/img/stationlive/choose.png") center no-repeat;*/
        /*}*/
      /*}*/
      /*.title-name {*/
        /*display: inline-block;*/
        /*margin-top: 5px;*/
        /*margin-left: 5px;*/
        /*height: 20px;*/
        /*font-size: 12px;*/
        /*line-height: 20px;*/
        /*text-align: left;*/
        /*color: #999999;*/
        /*vertical-align: top;*/
        /*&:hover, &.selected {*/
          /*color: #f3ac12;*/
          /*font-weight: 700;*/
        /*}*/
      /*}*/
    /*}*/

}


</style>
