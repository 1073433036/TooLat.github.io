<template>

  <div id="hour-div">

    <div class="back-line ns">
      <span
        v-for="(val, key) in hourSeleArr"
        @click="clickSelectHour(key, val)"
        :key="key"
      >
        <a :class="{'select': val}"></a>
      </span>

    </div>

    <div class="hour-title ns">

      <span
        v-for="(val, key) in hourSeleArr"
        :class="{'select': val}"
        @click="clickSelectHour(key, val)"
        :key="key"
      > {{hoursArr[key]}} </span>

    </div>

  </div>

</template>


<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop} from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class RiskHourSelected extends Vue {
    @Prop() hourClick: any
    @Getter('systemStore/zmapViewer_global') zmapViewer_global

    // 初始化时 默认选中1h数据
    @Watch('zmapViewer_global')
    onzmapViewer_globalChanged (val: any, oldVal: any) {
      this.clickSelectHour('oneHour', '1h')
    }

    hoursArr = {oneHour: '1h', threeHour: '3h', sixHour: '6h', twelveHour: '12h', tFourHour: '24h', sSencondHour: '72h'}
    hourSeleArr:any = {
      oneHour: false,
      threeHour: false,
      sixHour: false,
      twelveHour: false,
      tFourHour: false,
      sSencondHour: false
    }

    clickSelectHour(key, val) {
      for (let time in this.hoursArr) {
        if (key === time) {
          this.hourSeleArr[key] = !this.hourSeleArr[key];
        } else {
          this.hourSeleArr[time] = false
        }
      }
      this.hourClick(key, this.hourSeleArr[key], this.hourSeleArr);
    }
  }
</script>


<style lang='scss' scoped>
  #hour-div {
    /*height: 60px;*/
    margin-top: 10px;
  }

  .back-line {
    font-size: 0;
    position: relative;
    margin-left: 10px;
    width: 260px;
    height: 7px;
    border-radius: 3.5px;
    background-color: #e7e8e9;
    span {
      display: inline-block;
      position: relative;
      top: 0px;
      cursor: pointer;
      width: 7px;
      height: 7px;
      vertical-align: top;
      margin-left: 37px;

      &:first-of-type {
         margin-left: 20px;
       }
       a {
         display: inline-block;
         position: relative;
         top: 2px;
         left: 2px;
         width: 3px;
         height: 3px;
         border-radius: 1.5px;
         background-color: #808080;
         vertical-align: top;
          &.select {
             top: 0px;
             left: 0px;
             height: 7px;
             width: 7px;
             border-radius: 3.5px;
             background-color: #f3ac12;
           }
       }

    }

  }



  .hour-title {
    position: relative;
    /*top: 34px;*/
    margin-top: 7px;
    margin-left: 8px;
    width: 260px;
    padding-bottom: 10px;
    height: 10px;
    font-size: 0;
    span {
      font-size: 12px;
      display: inline-block;
      position: relative;
      top: 0px;
      cursor: pointer;
      width: 7px;
      height: 10px;
      line-height: 10px;
      text-align: center;
      vertical-align: top;
      color: #545454;
      margin-left: 37px;
      &:first-of-type {
         margin-left: 20px;
      }
      &.select {
          color: #f3ac12;
       }
    }

  }

</style>
