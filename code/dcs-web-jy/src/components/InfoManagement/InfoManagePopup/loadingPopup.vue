<template>
  <main id="loadingPopup" v-if="slideFlag">
    <div class="loadingPopup" >
      <div class="loadingPopup_progress">
        <em class="slidePio" :class="{'current':slideFlag}"></em>
      </div>
      <div class="loadingPopup_text">
        <span class="createReport">生成报告.....</span>
        <span class="closeReport" @click="closeReport">取消</span>
      </div>
    </div>
  </main>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'

  @Component
  export default class LoadingPopup extends Vue {
    slideFlag:boolean=true
    closeReport(){
      this.slideFlag=false
    }
    mounted(){

    }
  }
</script>

<style lang="scss" scoped>
#loadingPopup{
  width: 300px;
  height:72px;
  background: #ffffff;
  z-index: 15;
  margin-left: -150px;
  margin-top: -36px;
  top:50%;
  left:50%;
  position: fixed;
  .loadingPopup{
    width: 300px;
    height:72px;
    background: #ffffff;
    position: relative;
    box-shadow: 0px 0px 10px rgba(149, 149, 149, 0.4);
    border-radius: 4px;
    overflow: hidden;
  }
  .loadingPopup_progress{
    width:260px;
    height: 10px;
    margin-left: 20px;
    margin-top: 20px;
    background-color: #c7ebfd;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    .slidePio{
      position: absolute;
      width: 60px;
      height: 10px;
      left:0px;
      top: 0;
      border-radius: 10px;
      background-color: #11a9f5;
      transform: translateX(-60px);
    }
    .current{
      animation: slide 1s infinite ease-in-out;
    }
    @keyframes slide {
      0%{
        transform: translateX(-60px);
      }
      100%{
        transform: translateX(260px);
      }
    }
  }
  .loadingPopup_text{
    height: 37px;
    padding: 0px 20px;
    line-height: 37px;
    font-size: 14px;
    span{
      height: 37px;
    }
    .createReport{
      float: left;
    }
    .closeReport{
      float: right;
      color: #eb414f;
      cursor: pointer;
    }
  }
}
</style>
