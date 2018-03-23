<template>

  <main id="rainColorID">

    <div class="title-div">
      <span>{{typeTitleColor + ' [mm]'}}</span>
    </div>

    <div class="colors-div">

      <div class="color" v-for="(color, index) in colors">

        <span class="rain-num">
          {{colorNums[index]}}
        </span>
        <span class="rain-color" :style="{backgroundColor: color}">

        </span>

      </div>

    </div>



  </main>

</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter } from 'vuex-class'
  @Component
  export default class rainColorBar extends Vue {
    @Getter('systemStore/rainColorDatas_global') rainColorDatas_global: any
    colors: string[] = []//雨的颜色数组
    typeTitleColor: string = '' //类型的色标title
    colorNums: number[] = []

    mounted() {
      let datas = this.rainColorDatas_global;
      this.typeTitleColor = datas.title;
      this.colors = datas.colorsObj.colors;
      let startNum = datas.colorsObj.startVal;
      let stepNum = datas.colorsObj.stepVal;
      this.colorNums = [];
      for (let i = 0; i < this.colors.length; i++) {
        let ele = startNum + i * stepNum;
        if (i>0) ele = ele - startNum;
        this.colorNums.push(ele);
      }
    }
  }
</script>

<style lang='scss' scoped>

  #rainColorID {
    position: absolute;
    bottom: 7px;
    background-color: rgba(0,0,0,0.15);
    left: 125px;
    border-radius: 5px;
    height: 30px;
    z-index: 9999;

    .title-div {
      position: relative;
      float: left;
      margin-left: 10px;
      margin-right: 20px;
      height: 100%;
      span {
        display: inline-block;
        font-size: 13px;
        height: 30px;
        line-height: 30px;
        text-align: left;
      }
    }

    .colors-div {
      margin-right: 10px;
      float: left;
      .color {
        float: left;
        height: 30px;
        width: 30px;
        .rain-num {
          display: inline-block;
          position: relative;
          top: 4px;
          height: 13px;
          font-size: 12px;
          width: 30px;
          line-height: 13px;
          text-align: left;
        }
        .rain-color {
          position: relative;
          top: 1px;
          display: inline-block;
          height: 8px;
          width: 30px;
        }
      }
    }


  }




</style>
