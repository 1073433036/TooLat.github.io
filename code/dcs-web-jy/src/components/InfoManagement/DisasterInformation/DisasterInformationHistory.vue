<template>
  <main id="DisasterInformationHistory">
    <nav class="disHis_search">
      <span class="marginRight10">时间范围</span>
      <el-date-picker
        v-model="searchCondition.startTime"
        class="width150 marginBottom"
        type="date"
        placeholder="起始时间">
      </el-date-picker>
      <span class="paddingLR15 marginBottom">~</span>
      <el-date-picker
        v-model="searchCondition.endTime"
        class="width150"
        type="date"
        placeholder="中止时间">
      </el-date-picker>
      <span class="marginLeft30 marginRight10 marginBottom">灾情类型</span>
      <el-select v-model="searchCondition.disaster"
                 class="width150"
                 clearable
                 placeholder="请选择">
        <el-option
          v-for="(item,index) in disasterType"
          :key="index"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <br>
      <span class="marginRight10">死亡人数</span>
      <el-input v-model="searchCondition.startInjury" class="width150" placeholder=""></el-input>
      <span class="paddingLR15">~</span>
      <el-input v-model="searchCondition.endInjury" class="width150" placeholder=""></el-input>
      <span class="marginLeft30 marginRight10">经济损失</span>
      <el-input v-model="searchCondition.startEconomy" class="width150" placeholder=""></el-input>
      <span class="paddingLR15">~</span>
      <el-input v-model="searchCondition.endEconomy" class="width150" placeholder=""></el-input>
      <el-button type="primary" class="width100 marginLeft30" @click="getHistoryDis">查询</el-button>
    </nav>
    <!--<h6 class="disHis_text">历史灾情</h6>-->
    <el-table
      :data="currentData"
      border
      stripe
      header-row-class-name="table_header_title"
      :height="tableMaxHeight"
      style="width: 100%">
      <el-table-column
        v-for="(item,key) in tableType"
        :key="key"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :min-width="item.width">
      </el-table-column>
      <el-table-column
        label="操作"
        width="60"
        align="center"
        class-name="caozuo">
        <template slot-scope="scope">
          <el-button class="infoTab_btn tab_btn_2" @click="deleteDisaster(scope.row)" type="text" size="small">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <CommonPagination :tableData="disInfoData" @getCurrentData="getCurrentData"/>
  </main>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import DisasterService from '../../../util/DisasterService'
  import Disaster from '../../../interface/Disaster'
  import InfoManageTableType from '../../../config/InfoManageTableType'
  import {getComputeTableHeight} from '../../../util/InfoManageFunction'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import { Loading } from 'element-ui';
  import moment from 'moment'
  let DisasterHttp = new DisasterService()
  @Component({
    components:{
      CommonPagination
    }
  })
  export default class DisasterInformationHistory extends Vue {
    tableType:{ prop:string, label:string, width:string, align:string}[]=InfoManageTableType['disasterHistory']
    tableMaxHeight:number=0
    disasterType:string[]= []//灾情类型
    searchCondition:{
      startTime?:string,
      endTime?:string,
      startInjury?:string,
      endInjury?:string,
      startEconomy?:string,
      endEconomy?:string,
      disaster?:string
    }={}//查询条件
    disInfoData:{
      id:string,
      disaster: string,
      remarks:string,
      starttime:string,
      economyLoss:string,
      injuryPerson:string,
      releaseUnit:string,
      reportMan: string
    }[]= []
    currentData:{
      id:string,
      disaster: string,
      remarks:string,
      starttime:string,
      economyLoss:string,
      injuryPerson:string,
      releaseUnit:string,
      reportMan: string
    }[]=[]
    //获取历史灾情
    getHistoryDis():void{
      let data:{
        id:string,
        disaster: string,
        remarks:string,
        starttime:string,
        economyLoss:string,
        injuryPerson:string,
        releaseUnit:string,
        reportMan: string
      }[]=[]
      let params:any={}
      for(let item in this.searchCondition){
        if(this.searchCondition[item]){
          if(this.searchCondition.startTime){
            this.searchCondition.startTime=moment(this.searchCondition['startTime']).format('YYYY-MM-DD HH:mm:00')
          }
          if(this.searchCondition.endTime){
            this.searchCondition.endTime=moment(this.searchCondition['endTime']).format('YYYY-MM-DD HH:mm:00')
          }
          params[item]=this.searchCondition[item]
        }
      }
     DisasterHttp.getDisastersInfo(params)
       .then(res=>{
        if(res['result']=='S_OK'){
          res['tagObject'].forEach(v=>{
            data.push({
              id:v.id,
              disaster: v.disaster,//灾害
              remarks:v.remarks,//备注
              starttime: v.starttime,//开始时间
              economyLoss:v.economyLoss,//经济损失
              injuryPerson:v.injuryPerson,//受伤人数
              releaseUnit:v.releaseUnit,//上报单位
              reportMan: v.reportMan//上报人
            })
          })
          this.disInfoData=data
        }
      }).catch(err=>{
       this.disInfoData=[]
      })
    }
    //删除灾情
    async deleteDisaster(params:{ id: string, disasterType: string, disasterContent: string,
      disasterTime: string, economyLoss: string, disasterLevel: string, reportPeople: string }): Promise<void> {
      let data: boolean = await DisasterHttp.deleteDisasterInfoById(params.id);
      if(data) {
        this.getHistoryDis()
        this.$message({
          duration: 1500,
          showClose: true,
          type: 'success',
          message: '删除成功'
        });
      } else {
        this.$message({
          duration: 1500,
          showClose: true,
          type: 'error',
          message: '删除失败'
        });
      }
    }
    //获取当前页面的表格数据
    getCurrentData($event:any[]){
      this.currentData=$event
    }
    //获取灾情类别
    async getDisasterType(){
    let res = await DisasterHttp.getDisasterType()
      this.disasterType=res
    }
    mounted(){
      this.$nextTick(()=>{
        this.tableMaxHeight=getComputeTableHeight(590)
      })
      this.getHistoryDis()
      this.getDisasterType()
    }

  }
</script>
<style lang="scss" scoped>
  #DisasterInformationHistory{
    position: relative;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    background-clip: content-box;
    height: 100%;
    padding:0px 40px;
    overflow: hidden;
    .disHis_search{
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .disHis_text{
      font-size: 18px;
      color: #677888;
      line-height: 60px;
    }
  }
  .width150{
    width: 150px;
  }
  .width100{
    width: 80px;
    padding: 0;
    line-height: 30px;
  }
  .marginLeft30{
    margin-left: 30px;
  }
  .marginRight10{
    margin-right: 10px;
  }
  .paddingLR15{
    padding: 0 5px;
  }
  .marginBottom{
    margin-bottom: 15px;
  }

</style>
<style>
  .table_header_title th div{
    text-align: center!important;
  }
</style>
