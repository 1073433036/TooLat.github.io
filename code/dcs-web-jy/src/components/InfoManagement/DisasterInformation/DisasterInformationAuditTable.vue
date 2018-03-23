<template>
  <main id="DisasterInformationAuditTable">
    <header class="Audit_title">灾情列表</header>
    <section class="Audit_main">
      <el-table
        :data="currentData"
        border
        stripe
        header-row-class-name="table_header_title"
        :height="tableMaxHeight"
        style="width: 100%">
        <el-table-column
          v-for="(item,key) in tableTypes"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          :min-width="item.width">
        </el-table-column>
        <el-table-column
          label="灾情状态"
          align="center"
          width="80">
          <template slot-scope="scope">
            <span>{{scope.row.disasterStatus=='happening'?'正在发生':'已经结束'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="详细"
          align="center"
          width="80">
          <template slot-scope="scope">
            <span class="table_detail"@click="clickDetail(scope.row)">查看</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          v-if="tableType=='notAudit'"
          align="center"
          width="160">
          <template slot-scope="scope">
            <button class="auditBtn auditBtn_ok" @click="ClickAudit(scope.row,true)" size="mini">通过</button>
            <button class="auditBtn auditBtn_nok" @click="ClickAudit(scope.row,false)"  size="mini">不通过</button>
          </template>
        </el-table-column>
        <el-table-column
          label="审核状态"
          v-if="tableType!=='notAudit'"
          align="center"
          width="80">
          <template slot-scope="scope">
            <span>{{scope.row.auditStatus=='passcheck'?'通过':'不通过'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <CommonPagination :tableData="AuditDatas" @getCurrentData="getCurrentData"/>
  </main>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import {getComputeTableHeight} from '../../../util/InfoManageFunction'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import DisasterService from '../../../util/DisasterService'
  import Disaster from '../../../interface/Disaster'
  import InfoManageTableType from '../../../config/InfoManageTableType'
  @Component({
    components:{
      CommonPagination
    }
  })
  export default class AuditTable extends Vue {
    tableTypes:{ prop:string, label:string, width:string, align:string}[]=InfoManageTableType['disasterAudit']
    tableMaxHeight:number=300
    disInfoData:Disaster[]= []
    currentData:any[]=[]
    @Prop()
    tableType
    @Prop()
    AuditDatas
    @Prop()
    tableShow
    @Prop()
    ClickAudit

    @Watch('tableType')
    changetableType(val){

    }

    @Watch('AuditDatas')
    changeAuditDatas(val){

    }


    //点击查看灾情详细内容
    clickDetail(par:Disaster){
      this.$emit('infoDetail',{detail:par,type:this.tableType})
    }
    //获取当前页面的表格数据
    getCurrentData($event:any[]){
      this.currentData=$event
    }
    mounted(){
      this.$nextTick(()=>{
        this.tableMaxHeight=getComputeTableHeight(460)
      })
    }
  }
</script>
<style lang="scss" scoped>
  #DisasterInformationAuditTable{
    position: relative;
    width: 100%;
    box-sizing: border-box;
    background-clip: content-box;
    height: 100%;
    padding: 0px 40px 0px 20px;
    overflow: hidden;
    .Audit_title{
      height: 60px;
      line-height: 60px;
      font-size: 16px;
    }
    .Audit_main{
      position: relative;
      overflow: hidden;
    }
  }
  .table_detail{
    color: #11a9f5;
    padding: 10px;
    cursor: pointer;
    text-align: center;
  }
  .table_detail:hover{
    text-decoration:underline
  }
</style>
<style>
  .table_header_title div{
    text-align: center !important;
  }
  .disasterContent{
    width:300px !important;
  }
</style>
