<template>
  <main id="HistoryPlans">
    <h5>历史预案</h5>
    <section class="HistoryPlans_table">
      <el-table
        :data="currentData"
        style="width: 100%"
        border
        stripe
        header-cell-class-name="tableHeader"
        :height="tableHeight">
        <el-table-column
          v-for="(item,key) in tableType"
          v-if="item"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :width="item.width">
        </el-table-column>
        <el-table-column
          align="center"
          width="90"
          label="渠道来源">
          <template slot-scope="scope">
            <span>{{scope.row.newschannels==10?'短信':scope.row.newschannels==11?'短信，传真':'传真'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="90"
          label="预案状态">
          <template slot-scope="scope">
            <span :style="{'color':scope.row.state==1?'red':''}">{{scope.row.state==0?'已结束':'生效中'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="90"
          label="传真文件">
          <template slot-scope="scope">
            <span class="planTextLook"
               @click="clickDownload(scope.row.fax)">{{scope.row.fax?'下载':'无'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <CommonPagination :tableData="tableData" @getCurrentData="getCurrentData"/>
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import { getComputeTableHeight } from "../../../util/InfoManageFunction"
  import InfoManageTableType from '../../../config/InfoManageTableType'
  import contingencyPlanHttp from '../../../util/ContingencyPlanHttp'

  let ContingencyPlanHttp= new contingencyPlanHttp()
  @Component({
    components:{
      CommonPagination
    }
  })
  export default class HistoryPlans extends Vue{
    tableType:{ prop: string, label: string, width: string, align:string }[]=InfoManageTableType['HistoryPlan']
    currentData:any[]=[]
    tableHeight:number=300
    tableData:any[]=[]
    //点击下载
    clickDownload(item){
      if(!item){
        this.$message.error('无传真文件')
      }else {
        let json = JSON.parse(item)
        let a = document.createElement('a');
        a.download='';
        a.href=json[0].url;
        a.click()
      }
    }
    //获取当前页面信息
    getCurrentData(params:any){
      this.currentData=params
    }
    async mounted(){
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(470)
      })
      this.tableData = await ContingencyPlanHttp.getHistoryPlan()
      console.log(this.tableData)
    }
  }
</script>

<style lang="scss" scoped>
  #HistoryPlans{
    width: 100%;
    height: 100%;
    h5{
      height: 60px;
      line-height: 60px;
      padding: 0 40px;
      font-size: 16px;
    }
    .HistoryPlans_table{
      padding: 0 40px;
    }
  }
</style>
