<template>
  <main id="decisionService">
    <div class="left-div">
      <p class="ns" v-for="(item, index) in leftTitles" :key="index" :class="{selected: index === currentSelectedItem}" @click="clickSelect(index)">{{item}}</p>
    </div>

    <div class="right-div" :style="{width: rightDivWidth+'px'}">
      <Iframe-vue :iframeStr="selectedIframeStr"></Iframe-vue>
    </div>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import DecisionImg from '../../interface/DecisionImg'
  import IframeVue from './serviceIframe.vue'
  import InfoVue from './meteorologicalInfo.vue'
  @Component({
    components: {
      IframeVue,
      InfoVue,
    }
  })
  export default class decisionService extends Vue {

    rightDivWidth:number = 800
    leftTitles: string[] = ['省台天气报告[急件]', '省重大气象信息快报', '省重大气象信息专报', '分县天气预报', '危险天气报告', '发布规定及防御指引']
    currentSelectedItem: number = 0

    iframeStrArr: string[] = [
      '/projshare/fileproduct/get/provems',
      '/file/kuaibao.html',
      '/file/zhuanbao.html',
      '/projshare/fileproduct/get/countyforecast',
      '/projshare/fileproduct/get/wxweather',
    ]
    selectedIframeStr: string = ''

    mounted(){
      let host = window.location.host
      let flag = host === '113.108.192.98:8080' || host === '10.12.12.84:8080'
      this.iframeStrArr.map((item, index) => {
        if (!flag)
          this.iframeStrArr[index] = 'http://10.148.83.228:2008' + this.iframeStrArr[index]
        else
          this.iframeStrArr[index] = 'http://' + host + this.iframeStrArr[index]
      })
      this.iframeStrArr.push('./static/issueRequire.html')


      this.rightDivWidth = document.body.clientWidth - 261 > 0 ? document.body.clientWidth - 261 : 0;
      this.selectedIframeStr = this.iframeStrArr[0]
      window.onresize = () => {
        this.rightDivWidth = document.body.clientWidth - 261 > 0 ? document.body.clientWidth - 261 : 0
      }
    }

    clickSelect(index) {
      if (index === this.currentSelectedItem)
        return
      this.currentSelectedItem = index
      this.selectedIframeStr = this.iframeStrArr[this.currentSelectedItem]
    }
  }
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';
  #decisionService{
    position: absolute;
    left: 0;
    top: 50px;
    height: calc(100% - 50px);
    background-color: #ffffff;
    font-size: 0;
  }
  .left-div {
    font-size: 14px;
    position: relative;
    display: inline-block;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 260px;
    border-right: 1px solid #ccc;
    background-color: #ffffff;
    vertical-align: top;
    p {
      margin: 10px 5px;
      height: 20px;
      line-height: 20px;
      color: $mainGrayColor;
      text-align: left;
      cursor: pointer;
      &:hover, &.selected{color: $mainOrangeColor; font-weight: 700}
    }
  }
  .right-div {
    position: relative;
    display: inline-block;
    top: 0px;
    left: 0px;
    height: 100%;
    vertical-align: top;
    background-color: #fff;
  }
</style>























