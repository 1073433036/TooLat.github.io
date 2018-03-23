<template>

  <main id="satilliteCloud">

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

      <div class="file-div">
        <p class="file"> 文件名 </p>
        <div class="file-box scroll-bar" v-loading="loading" ref="fileNameBox">
          <p
            class="ns"
            v-for="(item, index) in imgScrShowArr"
            :key="index"
            @click.stop="clickSelectImage(index)"
            :title="item"
            :class="{'select': index === imgCurrentIndex}">{{item}}</p>
        </div>
      </div>

       <!--播放按钮-->
      <div class="play-div">

        <div class="last-step" @click="clickLastStep">

        </div>

        <div class="startOrStop" @click="clickToStartOrStop" :class="{selected: !imgIsStart}">

        </div>

        <div class="next-step" @click="clickNextStep">

        </div>

      </div>

    </div>

    <div class="right-div" v-loading="imgLoading" :style="{width: rightDivWidth+'px'}">
<!--  :onerror   @error-->
      <figure v-loading="loading" element-loading-text="正在获取数据">
        <img class="satellite-img" :src="imgCurrentStr" @load="imageLoaded" @error="imgLoadedError" :style="{width: imgWidth+'px', height: imgHeight+'px'}">
      </figure>
    </div>
  </main>

</template>




<script lang="ts">

  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import { satilliteCloudClient } from '../../util/clientHelper'
  import moment from 'moment'
  import * as urlConfig from '../../util/urlTool'
  @Component
  export default class satilliteCloud extends Vue {
    date:Date = new Date
    rightDivWidth:number = 800
    clientH: number = 800

    imgWidth:number = 800
    imgHeight:number = 800
    imgHWScale: number = 0.7

    imgScrShowArr: string[] = []
    imgScrArr: string[] = []
    imgCurrentStr: string = ''
    imgCurrentIndex: number = 0
    imgIsStart: boolean = true
    loading: boolean = true
    imgLoading: boolean = true

    mounted(){
      this.rightDivWidth = document.body.clientWidth - 281 > 0 ? document.body.clientWidth - 281 : 0;
      this.clientH = document.body.clientHeight - 50 > 0 ? document.body.clientHeight - 50 : 0;
      this.doWithImgWH();
      window.onresize = () => {
        this.rightDivWidth = document.body.clientWidth - 281 > 0 ? document.body.clientWidth - 281 : 0;
        this.clientH = document.body.clientHeight - 50 > 0 ? document.body.clientHeight - 50 : 0;
        this.doWithImgWH();
      }
      this.getPituresData(moment(this.date).format('YYYY-MM-DD'));
    }
    beforeDestroy(){
      if (this.imgIsStart == false){
        clearInterval(this.timer);
        this.imgIsStart = true;
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

    selectedTime(date) {
      if (this.imgIsStart == false){
        clearInterval(this.timer);
        this.imgIsStart = true;
      }
      this.getPituresData(moment(this.date).format('YYYY-MM-DD'))
    }

    async getPituresData(dayTime: string) {
      this.loading = true
      this.imgLoading = true
      let dateTime: string = dayTime + ' ' + '23:00:00'
      let ref = await satilliteCloudClient.getsatilliteCloudPicturesWith(dateTime)
      if (ref && ref.result == 'S_OK') {
        this.imgScrShowArr = ref.tagObject === null ? [] : ref.tagObject;
        this.imgCurrentIndex = 0
        if (this.imgScrShowArr.length > 0){
          this.imgScrArr = ref.tagObject.map(function (item, index, input) {
            return  urlConfig.SARILLITE_CLOUD_IMG_URL + item
          })
          this.getImgBaseData()
        }else {
          this.imgScrShowArr[0] = '暂时没有相关数据'
          this.imgCurrentStr = this.imgScrArr[this.imgCurrentIndex]
        }

      }else {
        if (ref === false){
          this.showErrorMessage('访问失败')
        }else {
          this.showErrorMessage(ref.description)
        }
      }
      this.loading = false
      this.imgLoading = false
    }

    imageLoaded(){
      let newImg = document.createElement("img")
      newImg.src = this.imgCurrentStr
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

    async imgLoadedError(){
      let ref = await satilliteCloudClient.getImgMessageWith(this.imgScrArr[this.imgCurrentIndex])
      let message: string = ref.description;
      this.showErrorMessage(message);
    }

    clickLastStep(){
      this.imgCurrentIndex--;
      if (this.imgCurrentIndex<0){
        this.imgCurrentIndex = this.imgScrArr.length - 1;
      }
//      this.imgCurrentStr = this.imgScrArr[this.imgCurrentIndex];
      this.getImgBaseData()
    }
    timer: number = 0
    clickToStartOrStop() {
      if (this.imgIsStart) {
        this.timer=setInterval(() => {
          this.clickNextStep()
        }, 1500)
      }else  {
        clearInterval(this.timer)
      }
      this.imgIsStart = !this.imgIsStart;
    }
    clickNextStep() {
      this.imgCurrentIndex++;
      if (this.imgCurrentIndex>=this.imgScrArr.length){
        this.imgCurrentIndex = 0;
        this.fileNameBoxScrollTop(0);
      }
      if (this.imgCurrentIndex > 19){
        let currentPage: number = this.imgCurrentIndex/20;
        let num1: number = this.imgScrShowArr.length - 20 * Math.floor(currentPage);
        let num2: number = num1 > 20 ? 20 : num1
        this.fileNameBoxScrollTop(num2 * 20 + Math.floor(currentPage-1)*400);
      }
      this.getImgBaseData()
    }

    fileNameBoxScrollTop(size: number){
      let fileNameBox = <HTMLDivElement>this.$refs.fileNameBox;
      fileNameBox.scrollTop = size;
    }

    async clickSelectImage(index){
      if(index === this.imgCurrentIndex){
        return
      }
//      暂停
      clearInterval(this.timer);
      this.imgIsStart = true;
      this.imgCurrentIndex = index;
      this.getImgBaseData()
    }

    async getImgBaseData(){
      let urlType = this.imgScrArr[this.imgCurrentIndex].split(',')
      if (urlType[0] === 'data:image/gif;base64') {
        this.imgCurrentStr = this.imgScrArr[this.imgCurrentIndex];
      }else {
        let ref = await satilliteCloudClient.getImgMessageWith(this.imgScrArr[this.imgCurrentIndex]);
        this.imgCurrentStr = 'data:image/gif;base64,' + ref.tagObject;
//        this.imgCurrentStr = 'data:image/gif;base64,' + "iVBORw0KGgoAAAANSUhEUgAAA1IAAAIxCAYAAABHMYlHAAAHUElEQVR42u3BMQEAAADCoPVPbQZ/oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIDbAB6sAAEs8NQSAAAAAElFTkSuQmCC";
        this.imgScrArr[this.imgCurrentIndex] = this.imgCurrentStr
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

    showErrorMessage(message: string){
      Vue['prototype']['$message']({
        showClose: true,
        message: message,
        type: 'error'
      });
    }


  }



</script>



<style lang="scss">

  #satilliteCloud{
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
    .file-div {
      margin-top: 10px;

      .file{
        margin: 8px 10px;
        text-align: left;
        color: #999999;
      }

      .file-box {
        height: 400px;
        margin: 0 10px;
        overflow-y: auto;
        border: 1px solid #dcdcdc;
        p{
          margin: 5px 5px 0;
          height: 15px;
          line-height: 15px;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #999;
          cursor: pointer;
          &:hover, &.select {
            background-color: #f0daaa;
            font-weight:700;
          }
          &:last-child{margin-bottom: 5px}
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

    .play-div {
      margin-top: 10px;
      height: 50px;
      font-size: 0;
      .last-step {
        float: left;
        margin-left: 75px;
        width: 30px;
        height: 30px;
        background: url("../../assets/img/satilliteCloud/left.png") center no-repeat;
        cursor: pointer;
      }
      .startOrStop {
        float: left;
        margin-left: 10px;
        width: 30px;
        height: 30px;
        background: url("../../assets/img/satilliteCloud/play.png") center no-repeat;
        cursor: pointer;
        &.selected{
           background: url("../../assets/img/satilliteCloud/stop.png") center no-repeat;
         }
      }
      .next-step {
        float: left;
        margin-left: 10px;
        width: 30px;
        height: 30px;
        background: url("../../assets/img/satilliteCloud/right.png") center no-repeat;
        cursor: pointer;
      }
    }
  }

  .right-div {
    font-size: 10px;
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

  #satilliteCloud {
    .el-date-editor.el-input {
      margin-left: 0;
      width: 198px;
      z-index: 9999;
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
      z-index: 2000;
    }
  }






</style>





















