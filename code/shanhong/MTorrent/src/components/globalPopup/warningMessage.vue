<template>
  <main id="warningMsg" class="global-popup" v-drag>

    <header>
      <span>预警信息列表</span>
      <em @click="storePopupStatus_global({ key: 'warningMsgTable', action: false })">  </em>
    </header>

    <div class="tableContent">
      <el-table
        :data="swanWarningMsgDatas_global"
        max-height="205"
        border
        style="width: 100%">
        <el-table-column
          prop="V_CITY"
          label="城市"
          width="80"
          height="30">
        </el-table-column>
        <el-table-column
          prop="DDATETIME"
          label="时间"
          width="180"
          height="30">
        </el-table-column>
        <el-table-column
          prop="riskType"
          label="预警类别"
          width="120"
          height="30">
        </el-table-column>
        <el-table-column
          prop="riskLevel"
          label="等级"
          height="30">
        </el-table-column>
      </el-table>
    </div>
  </main>

</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  @Component
  export default class warningMessage extends Vue{
    @Getter('systemStore/swanWarningMsgDatas_global') swanWarningMsgDatas_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    warningDatas: any = [
      {cityName: '广州', dateTime: '2017-10-19 18:57:09', warningType: '台风', level: '2级'},
      {cityName: '广州', dateTime: '2017-10-19 18:57:09', warningType: '台风', level: '5级'},
      {cityName: '广州', dateTime: '2017-10-19 18:57:09', warningType: '台风', level: '3级'},
      {cityName: '广州', dateTime: '2017-10-19 18:57:09', warningType: '台风', level: '4级'},
      {cityName: '广州', dateTime: '2017-10-19 18:57:09', warningType: '台风', level: '4级'},
      {cityName: '广州', dateTime: '2017-10-19 18:57:09', warningType: '台风', level: '4级'},
    ]

    mounted() {

    }


  }
</script>

<style lang='scss' scoped>
  #warningMsg {
    position: absolute;
    top: calc(50% - 269px);
    left: calc(50% - 390px);
    top: 70px;
    left: 300px;
    overflow: hidden;
    background-color: #ffffff;
    width: 481px;
    /*header {*/
      /*font-size: 0px;*/
      /*background-color: #404040;*/
      /*height: 30px;*/
      /*p {*/
        /*height: 30px;*/
        /*padding-left: 10px;*/
        /*color: #ffffff;*/
        /*font-size: 15px;*/
        /*line-height: 30px;*/
        /*text-align: left;*/
      /*}*/
      /*span {*/
        /*display: inline-block;*/
        /*position: absolute;*/
        /*top: 10px;*/
        /*right: 10px;*/
        /*width: 15px;*/
        /*height: 20px;*/
      /*}*/
    /*}*/

    .tableContent {
      margin: 10px;
    }

  }
</style>

<style lang='scss'>
  #warningMsg {
    .el-table {
      border-radius: 5px;
      z-index: 999;
      border: 1px solid #d9d9d9;
    }
    .el-table::after {
      width: 0px;
    }
    .el-table::before {
      height: 0px;
    }
    .el-table__header {
      background-color: #e8e8e8;
    }
    .is-leaf{
      font-size: 12px;
      color: #cc9999;
      font-weight: 700;
    }
    .el-table--border td, .el-table--border th {
      border-right: 0px solid #e6e6e6;
    }
    .el-table td, .el-table th.is-leaf {
      border-bottom: 1px solid #e6e6e6;
    }
    .el-table__row {
      font-size: 12px;
      color: #545454;
    }
  .el-table__body-wrapper {
    overflow-x: hidden;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb {
     background: #f0daaa;
     border-radius: 4px;
   }
  }

  }
</style>

