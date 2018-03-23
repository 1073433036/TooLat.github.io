<template>

  <main id="pupProduct" class="global-panel" v-drag>

    <header>
      <el-date-picker
        v-model="date"
        type="date"
        size="small"
        :editable="false"
        :clearable="false"
        @change='selectDay'>

      </el-date-picker>

      <div class="hour-min hour" @mouseenter="toggleSelectList('hour')" @mouseleave="isHourListOn = false">
        <span>{{ hour >= 10 ? hour : '0' + hour }}</span>
        <ul class="list scroll-bar" v-show="isHourListOn" ref="hourList">
          <li @click="selectHour(0)" :class="{'on': hour === 0}">00</li>
          <li v-for="i in 23" :key="i" @click="selectHour(i)" :class="{'on': hour === i}">
            {{ i >= 10 ? i : '0' + i }}
          </li>
        </ul>
      </div>

      <div class="hour-min minute" @mouseenter="toggleSelectList('minute')" @mouseleave="isMinuteListOn = false">
        <span>{{ minute >= 10 ? minute : '0' + minute }}</span>
        <ul class="list scroll-bar" v-show="isMinuteListOn" ref="minuteList">
          <li @click="selectMinute(0)" :class="{'on': minute === 0}">00</li>
          <li v-for="i in 9" :key="i" @click="selectMinute(i*6)" :class="{'on': minute === i*6}">
            {{ 6*i >= 10 ? 6*i : '0' + 6*i }}
          </li>
        </ul>
      </div>

      <div class="hour-min city" @mouseenter="toggleSelectList('city')" @mouseleave="isCityListOn = false">
        <span>{{ cityTempArr[currentSelectCityIndex].city}}</span>
        <ul class="list scroll-bar" v-show="isCityListOn">
          <li v-for="(item, index) in cityTempArr" :key="index" @click="selectCity(item, index)" :class="{'on': index === currentSelectCityIndex}">
            {{ item.city }}
          </li>
        </ul>
      </div>

    </header>

    <div class="pupProduct-content">

      <div class="radar-div" :class="{selected: isRadarOn}">
        <div class="title-div" :style="{lineHeight: radarLineheight + 'px'}"
           @mouseenter="showSelectBox('ratar')"
           @mouseleave="hiddenRatarSelectBox('ratar')">
          {{ratarCurrMessage}}
          <div class="ratarData-div" v-show="isRadarOn">
            <p v-for="(item ,index) in radarDataArr" @click="selectedRatarProduct(item, index)" :class="{select: item ===ratarCurrMessage}">{{item}}</p>
          </div>
        </div>
      </div>
      <div class="level-div" :class="{selected: isLevelOn}">
        <div class="title-div" :style="{lineHeight: levelLineheight + 'px'}"
             @mouseenter="showSelectBox('level')"
             @mouseleave="hiddenRatarSelectBox('level')">
          {{levelCurrMessage}}
          <div class="ratarData-div leveList-div" v-show="isLevelOn">
            <p v-for="item in levelDataArr" @click="selectedLevelProduct(item)" :class="{select: item ===levelCurrMessage}">{{item}}</p>
          </div>
        </div>
      </div>

      <div class="productGroup-div">
        <p class="title-p">产品组合列表</p>
        <div class="pro-list-div scroll-bar">
          <p v-for="(item, index) in groupProductArr" @mouseenter="showDetailDic(item)" @mouseleave="isShowDetailMessage = false" :class="{selected: isSelected && index === currentSelectedIndex}" @click.stop="clickGroudProduct(index)">{{item}}</p>
        </div>
      </div>

    </div>
    <footer class="bt-div">
      <button class="clear-bt" @click="clickFooterBt('clear')" :class="{'on': isCleatBtOn}">清空</button>
      <button class="delete-bt" @click="clickFooterBt('delete')" :class="{'on': isDeleteBtOn}">删除</button>
      <button class="superposition-bt" @click="clickFooterBt('superposition')" :class="{'on': isSuperpBtOn}">叠加</button>
    </footer>

    <div class="detail-div" :class="{show: isShowDetailMessage}" :style="[{top: detailDivScrTop + 'px'}, {left: detailDivScrLeft + 'px'}]">
      <p>{{detailMessage}}</p>
    </div>

  </main>



</template>



<script lang='ts'>



  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import {getFormatTimeStr} from '../../util/riskWarningTool'
  import moment from 'moment'
  @Component({
    components: {

    }
  })
  export default class PupProduct extends Vue {

    date:Date = new Date
    hour:number = 0
    minute:number = 0
    isHourListOn: boolean = false
    isMinuteListOn: boolean = false

    cityTempArr: any[] = [
      {city: '广州', stationVal: '113.36'},
      {city: '阳江', stationVal: '111.98'},
      {city: '韶关', stationVal: '113.57'},
      {city: '汕头', stationVal: '116.74'},
      {city: '梅州', stationVal: '115.99'},
      {city: '深圳', stationVal: '114'},
      {city: '湛江', stationVal: '110.53'},
      {city: '河源', stationVal: '114.61'},
      {city: '汕尾', stationVal: '115.36'},
      {city: '肇庆', stationVal: '112.56'}
    ]
    isCityListOn: boolean = false
    currentSelectCityIndex: number = 0

    isSuperpBtOn: boolean = false
    isDeleteBtOn: boolean = false
    isCleatBtOn: boolean = false

    groupProductArr: string[] = []
    isShowDetailMessage = false
    detailDivScrTop: number = 170
    detailDivScrLeft: number = 100
    detailMessage: string = "BREF19_基于"

    ratarCurrMessage: string = '雷达产品'
    ratarCurrentSelectedIndex: number =0
    isRadarOn: boolean = false
    radarLineheight: number = 38
    radarDataArr: string[] = [
      '基本反射因子[19]',
      '基本反射因子[20]',
      '基本速度[26]',
      '基本速度[27]',
      '回波顶高[41]',
      '液态水含量[57]',
      '1小时累积降水[78]',
      '3小时累积降水[79]',
      '风暴总累积降水[80]',
      'CAPPI反射率[110]'
    ]
    radarDataStrArr: string[] = [
      'BREF19_基本反射因子[19]',
      'BREF20_基本反射因子[20]',
      'BVEL26_基本速度[26]',
      'BVEL27_基本速度[27]',
      'ETOPS_回波顶高[41]',
      'VIL_液态水含量[57]',
      '1HPRE_1小时累积降水[78]',
      '3HPRE_3小时累积降水[79]',
      'STRAIN_风暴总累积降水[80]',
      'CAPPI_CAPPI反射率[110]'
    ]
    levelCurrMessage: string = '层次'
    isLevelOn: boolean = false
    levelLineheight: number = 38
    levelDataArr: number[] = [0.5, 1.5, 2.4]
    currentSelectedIndex: number = 0
    isSelected: boolean = false

    mounted() {

      let dict = {
        name1: 'li',
        name2: 'da',
        3: 'cheng'
      }
      console.log(dict.name1);
      console.log(dict['name2']);
      console.log(dict[3]);
      delete dict[3];
      for (let key in dict){
        console.log(key);
      }


      this.hour = new Date().getHours();
      let time = new Date().getTime();
      this.minute = new Date(time - time % (6*60*1000)).getMinutes();

      document.onmousemove = this.getMousePos;
    }
    getMousePos(event) {
      if (this.isShowDetailMessage===false) {return}
      var e = event || window.event;
      this.detailDivScrTop = e.clientY - 60;
      this.detailDivScrLeft = e.clientX + 20;
    }

    //雷达 和 层次相关
    showSelectBox(key) {
      if (key === 'ratar') {
        this.isRadarOn = true;
        this.radarLineheight = 26;
      }else  if (key === 'level') {
        this.isLevelOn = true;
        this.levelLineheight = 26;
      }
    }
    hiddenRatarSelectBox(key){
      if (key === 'ratar') {
        this.isRadarOn = false;
        this.radarLineheight = 38;
      }else  if (key === 'level') {
        this.isLevelOn = false;
        this.levelLineheight = 38;
      }
    }
    selectedRatarProduct(product, index){
      this.ratarCurrMessage = product;
      this.ratarCurrentSelectedIndex = index
      this.hiddenRatarSelectBox('ratar');
      this.addProductIntoBox();
    }
    selectedLevelProduct(product){
      this.levelCurrMessage = product;
      this.hiddenRatarSelectBox('level');
      this.addProductIntoBox();
    }

    addProductIntoBox() {
      if (this.ratarCurrMessage === '雷达产品' || this.levelCurrMessage === '层次')
        return
      let timeStr: string = getFormatTimeStr(moment(this.date).format('YYYY-MM-DD'), this.hour, this.minute);
      let newProduct = this.radarDataStrArr[this.ratarCurrentSelectedIndex] + '_' + this.levelCurrMessage + '_' + timeStr
      if (this.groupProductArr.indexOf(newProduct) > 1)
        return
      else if (this.groupProductArr.indexOf(newProduct) === -1)
        if (this.isSuperpBtOn){
          this.groupProductArr.push(newProduct)
        }else {
          this.groupProductArr = [];
          this.groupProductArr.push(newProduct);
        }
    }

    //产品列表
    showDetailDic(item){
      this.isShowDetailMessage = true;
      this.detailMessage = item;
    }
    clickGroudProduct(index){
      this.currentSelectedIndex = index;
      this.isSelected = true
    }


    //底部三个按钮事件
    clickFooterBt(key) {
      if (key === 'superposition') {
        this.isSuperpBtOn = !this.isSuperpBtOn;
        this.addProductIntoBox();
      }else  if (key === 'delete'){
        if (this.groupProductArr.length === 0 || !this.isSelected)
          return
        this.isDeleteBtOn = !this.isDeleteBtOn;
        this.isSelected = false;
        this.groupProductArr.splice(this.currentSelectedIndex, 1);
        this.$nextTick(() => {
          this.isDeleteBtOn = false
        })
      }else if (key === 'clear'){
        if (this.groupProductArr.length === 0)
          return
        this.isCleatBtOn = !this.isCleatBtOn;
        this.groupProductArr = [];
        this.$nextTick(() => {
          this.isCleatBtOn = false
        })
      }
    }



    // 时 分
    toggleSelectList(key) {
      if (key === 'hour') {
        this.isHourListOn = true;
        this.$nextTick(() => {
          let hourEle = <HTMLDivElement>this.$refs.hourList;
          hourEle.scrollTop = 24 * this.hour - 24 * 4;
        })
      } else if (key === 'minute') {
        this.isMinuteListOn = true;
        this.$nextTick(() => {
          let minuteEle = <HTMLDivElement>this.$refs.minuteList;
          minuteEle.scrollTop = 24 * this.minute / 6 - 24 * 4;
        })
      }else if (key === 'city'){
        this.isCityListOn = true
      }
    }

//     选择 时间 城市
    selectDay(dateTime){
      this.changeGroupProductTime();
    }
    selectHour(h) {
      this.hour = h;
      this.isHourListOn = false;
      this.changeGroupProductTime();
    }
    selectMinute(m) {
      this.minute = m;
      this.isMinuteListOn = false;
      this.changeGroupProductTime();
    }

    selectCity(item, index){
      this.currentSelectCityIndex = index;
      this.isCityListOn = false
    }

    changeGroupProductTime() {
      if (this.groupProductArr.length === 0)
        return
      let weakThis = this;
      this.groupProductArr = this.groupProductArr.map(function (item, index, input) {
        let itemStrArr = item.split('_');
        let timeStr: string = getFormatTimeStr(moment(weakThis.date).format('YYYY-MM-DD'), weakThis.hour, weakThis.minute);
        itemStrArr[itemStrArr.length-1] = timeStr;
        console.log(itemStrArr)
        return itemStrArr.join('_')
      })
    }

  }




</script>



<style lang='scss' scoped>
  #pupProduct {
    top: 60px;
    left: 0;
    width: 280px;
    background-color: #ffffff;
  }
  .city {
    left: 210px;
    width: 60px !important;
    ul.list {
      width: 60px !important;
     }
  }

  .pupProduct-content {
    font-size: 12px;
    height: 240px;
    background-color: #ffffff;

    .radar-div, .level-div {
      margin: 10px 9px 0 9px;
      height: 38px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      &.selected {
         border: 1px solid #f3ac12;
      }
      .title-div {
        height: 100%;
        text-align: left;
        line-height: 38px;
        padding-left: 5px;
        color: #808080;
        cursor: pointer;
        .ratarData-div {
          background-color: #4c4f4f;
          border-radius: 4px;
          position: absolute;
          left: 9px;
          top: 78px;
          z-index: 9999;
          overflow: auto;
          width: 261px;
          p {
            color: white;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-left: 5px;
            margin-top: 5px;
            text-align: left;
            height: 20px;
            line-height: 20px;
            cursor: pointer;
            &:hover, &.select{background-color: #626464};
            &:last-child { margin-bottom: 5px};
          }
        }
        .leveList-div{
          top: 128px;
        }
      }
    }
    .productGroup-div {
      margin: 10px 9px 0 9px;
      .title-p {
        height: 30px;
        padding-left: 5px;
        color: #808080;
        line-height: 30px;
        text-align: left;
      }
      .pro-list-div {
        height: 100px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        position: relative;
        overflow: auto;
        p {
          margin-top: 1px;
          height: 24px;
          color: #545454;
          padding-left: 5px;
          text-align: left;
          line-height: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          &:hover, &.selected{background-color: #e8e8e8}
        }
        &.scroll-bar {
        &::-webkit-scrollbar { width: 4px; }
        &::-webkit-scrollbar-thumb {
           background: #f0daaa;
           border-radius: 4px;
         }
        }
      }
    }
  }

  .bt-div {
    margin-top: 10px;
    height: 36px;
    .superposition-bt, .delete-bt, .clear-bt{
      float: right;
      margin-right: 10px;
      height: 24px;
      width: 58px;
      border-radius: 13px;
      background-color: #ffffff;
      cursor: pointer;
      outline:none;
      border: 1px solid #808080;
      color: #808080;
      &:hover, &.on {
                  border: 1px solid #f3ac12;
                  color: #f3ac12;
                }
    }
  }
  .detail-div {
    background-color: #4c4f4f;
    border-radius: 4px;
    position: absolute;
    min-width: 250px;
    display: none;
    &.show {
     display: block;
    }
    p {
      color: white;
      padding: 5px 5px 10px;
      text-align: left;
    }
  }

</style>
















