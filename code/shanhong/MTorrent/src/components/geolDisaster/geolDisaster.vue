<template>

  <main id="geolDisaster">

    <div class="left-div">

      <div class="date-div">
        <span>日期:</span>
        <el-date-picker
          v-model="date"
          type="date"
          size="small"
          align="left"
          :editable="false"
          :clearable="false"
          @change='selectedTime'>
        </el-date-picker>
      </div>

      <div class="disasterImg-div">
        <p class="selectedImg-p">广东省地质灾害气象风险预警产品</p>
      </div>
      <div class="disasterMessage-div" v-loading="leftLoading">
        <p v-for="item in disterDescriptArr">
          {{item}}
        </p>
        <!--<p>{{disterDescript}}</p>-->
      </div>
    </div>

    <div class="right-div" v-loading="imgLoading" element-loading-text="正在获取数据" :style="{width: rightDivWidth+'px'}">

      <img class="satellite-img" :src="imgUrl" alt="地址灾害图" @load="imageLoaded" :style="{width: imgWidth+'px', height: imgHeight+'px'}">
    </div>
  </main>




</template>



<script lang="ts">

  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import DecisionImg from '../../interface/DecisionImg'
  import { geoDisaterClient } from '../../util/clientHelper'
  import moment from 'moment'

  @Component
  export default class geolDisaster extends Vue {
    date:Date = new Date
    disasterMessageArr: Array<DecisionImg> = [

    ]
    leftLoading: boolean = true;
    imgLoading: boolean = true;

    rightDivWidth:number = 800
    clientH: number = 800
    imgWidth:number = 800
    imgHeight:number = 800
    imgHWScale: number = 0.7


    //新改:
    disterDescript: string = '    2017年10月31日预警信息：预计未来24小时，各地市气象风险预警信息如下：    因强降雨直接诱发地质灾害的风险小。'
    imgUrl: string = ''
    disterDescriptArr: string[] = []


    mounted(){
      this.rightDivWidth = document.body.clientWidth - 261 > 0 ? document.body.clientWidth - 261 : 0;
      this.clientH = document.body.clientHeight - 50 > 0 ? document.body.clientHeight - 50 : 0;
      this.doWithImgWH()
      window.onresize = () => {
        this.rightDivWidth = document.body.clientWidth - 261 > 0 ? document.body.clientWidth - 261 : 0
        this.clientH = document.body.clientHeight - 50 > 0 ? document.body.clientHeight - 50 : 0;
        this.doWithImgWH()
      }

    //  this.getGeoDisterData(moment(this.date).format('YYYY-MM-DD'))
      this.getTheNewestTime();
    }

    //获取最新有数据的时间
    async getTheNewestTime() {
      let ref = await geoDisaterClient.getGeoDisterDataNewestTime();
      if (ref) {
        this.getGeoDisterData(moment(ref).format('YYYY-MM-DD'))
        this.date = new Date(ref)
      }
    }


    doWithImgWH() {

      if (this.clientH > this.rightDivWidth) {
        this.imgWidth = this.rightDivWidth - 40;
        this.imgHeight = this.imgWidth * this.imgHWScale;
      }else {

        this.imgHeight = this.clientH - 40;
        this.imgWidth = this.imgHeight/this.imgHWScale;

        if (this.imgWidth > this.rightDivWidth){
          this.imgWidth = this.rightDivWidth - 40;
          this.imgHeight = this.imgWidth * this.imgHWScale;
        }

      }
    }

    async getGeoDisterData(dayTime: string) {
      this.leftLoading = true;
      this.imgLoading = true;
      let dateTime: string = dayTime + ' 00:00:00'
      this.disterDescriptArr = []
      let rfData = await geoDisaterClient.getGeoDisterData(dateTime);
      if (rfData) {
        console.log(rfData);
        this.disterDescript = rfData.description
        this.disterDescriptArr = rfData.description ? rfData.description.split("：") : ['暂无描述内容']
        this.imgUrl = 'data:image/gif;base64,' + rfData.tagObject
      }else {
        this.disterDescriptArr.push('暂时没有当天的相关数据')
        this.imgUrl = 'static/img/wushuju.png'
      }
      this.leftLoading = false;
      this.imgLoading = false;
    }


    selectedTime(date) {
      this.getGeoDisterData(moment(this.date).format('YYYY-MM-DD'));
    }

    imageLoaded(){
      let newImg = document.createElement("img")
      newImg.src = this.imgUrl
      document.body.appendChild(newImg);

      newImg.onload = ()=> {
        let w1: number = this.getWH(newImg, 'width');
        let h1: number = this.getWH(newImg, 'height');
        this.imgHWScale = h1/w1;
        document.body.removeChild(newImg);
        this.doWithImgWH();
      }
      newImg.onerror= () => {
        document.body.removeChild(newImg);
        this.doWithImgWH();
      }
    }

    getWH(el, name) {
      var val = name === "width" ? el.offsetWidth : el.offsetHeight,
        which = name === "width" ? ['Left', 'Right'] : ['Top', 'Bottom'];
      if(val === 0) {
        return 0;
      }
      for(var i = 0, a; a = which[i++];) {
        val -= parseFloat( this.getStyle(el, "border" + a + "Width") ) || 0;
        val -= parseFloat( this.getStyle(el, "padding" + a) ) || 0;
      }
      return val;
    }
    getStyle(el,name) {
      if(window.getComputedStyle) {
        return window.getComputedStyle(el, '')[name];
      }else{
        return el.currentStyle[name];
      }
    }

  }



</script>



<style lang="scss">

  #geolDisaster{
    height: 100%;
    background-color: #ffffff;
    font-size: 0;
  }
  .left-div {
    font-size: 12px;
    position: relative;
    display: inline-block;
    top: 50px;
    left: 0px;
    height: 100%;
    width: 260px;
    border-right: 1px solid #ccc;
    background-color: #ffffff;
    vertical-align: top;
  .date-div {
    padding-top: 10px;
    span {
      display: inline-block;
      height: 24px;
      line-height: 24px;
      vertical-align: top;
      margin-left: 10px;
      color: #999;
    }
  }

    .disasterImg-div {
      font-size: 12px;
      margin-top: 10px;
    .selectedImg-p {
      display: inline-block;
      margin-left: 10px;
      padding-right: 18px;
      max-width: 180px;
      /*width: 180px;*/
      overflow: hidden;
      color: #f3ac12;
      text-overflow: ellipsis;
      white-space: nowrap;
      /*background: url("../../assets/img/toolbar/next.png") right no-repeat;*/
    }
  }

  .disasterMessage-div {
    margin: 10px 10px 0;
    border: 1px solid #dedede;
    border-radius: 4px;
    overflow: auto;
    height: 280px;
  p {
    text-indent: 24px;
    margin: 5px;
    color: #999;
  }

  }
  }

  .right-div {
    font-size: 12px;
    position: relative;
    display: inline-block;
    top: 50px;
    left: 0px;
    height: 100%;
    vertical-align: top;
    background-color: #fff;
  .satellite-img {
    display: block;
    margin: 20px auto;
  }
  }

  #geolDisaster {
    .el-date-editor.el-input {
      margin-left: 0;
      width: 198px;
    }
    .el-input__inner {
      color: #1f1f1f;
      border: 1px solid #dcdcdc;
      background: #fff;
    }
    .el-input--small .el-input__inner {
      height: 22px;
      margin-left: 10px;
    &:hover {
      border: 1px solid #f3ac12;
    }
    }
    .el-input__inner {
      border-radius: 4px;
      text-indent: 5px;
      text-align: left !important;
    }
    .el-loading-mask {
      z-index: 1000;
    }
  }




</style>























