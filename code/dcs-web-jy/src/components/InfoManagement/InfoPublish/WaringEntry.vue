<template>
  <main id="WaringEntry">
    <header class="WaringEntry_header">
      <h6 class="WaringEntry_header_title">预警录入</h6>
      <div class="PlanBtn">
        <button class="infoManageBtn infoManageBtn_del" @click="">解除</button>
      </div>
      <div class="PlanBtn">
        <button class="infoManageBtn infoManageBtn_entry" size="small">降级</button>
      </div>
      <div class="PlanBtn">
        <button class="infoManageBtn infoManageBtn_entry" size="small">升级</button>
      </div>
      <div class="PlanBtn">
        <button class="infoManageBtn infoManageBtn_add" @click="addWaringEntry">新增</button>
      </div>
    </header>
    <section class="WaringEntry_main">
      <el-table
        :data="currentData"
        @selection-change="handleSelectionChange"
        :height="tableHeight"
        stripe
        border
        header-cell-class-name="tableHeader"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="20"></el-table-column>
        <el-table-column
          v-for="(item,key) in tableType"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :width="item.width">
        </el-table-column>
        <el-table-column
          width=""
          align="center"
          label="状态">
          <template slot-scope="scope">
            <!--<el-button class="infoTab_btn tab_btn_3" @click="deleteInfo(scope.row)" type="text" size="small"></el-button>-->
            <a v-if="scope.row.state==1" style="color: red">待审批</a>
            <a v-if="scope.row.state==2" style="color: blue">已审批</a>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <CommonPagination :tableData="tableData"
                      :paginationType="WaringEntryPage"
                      @WaringEntryPage="getCurrentData">
    </CommonPagination>
    <WaringEntryPopup v-if="WaringEntryFlag" :closeWaringEntryPopup="closeWaringEntryPopup"></WaringEntryPopup>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop } from 'vue-property-decorator'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import WaringEntryPopup from "../InfoManagePopup/WaringEntryPopup.vue"
  import { getComputeTableHeight } from "../../../util/InfoManageFunction"
  import infoPublishHttp from "../../../util/InfoPublishHttp"
  import InfoManageTableType from '../../../config/InfoManageTableType'
  let InfoPublishHttp = new infoPublishHttp()
  @Component({
    components:{
      CommonPagination,
      WaringEntryPopup
    }
  })
  export default class WaringEntry extends Vue {
    tableType:any=InfoManageTableType['waringEntry']
    WaringEntryPage:string='WaringEntryPage'
    tableData:any[]=[]
    currentData:any[]=[]
    tableHeight:number=300
    WaringEntryFlag:boolean=false
    //勾选信息
    handleSelectionChange(params:any){}

    //打开弹窗添加预警录入
    addWaringEntry():void {
      this.WaringEntryFlag=true
    }
    //关闭预警录入弹窗
    closeWaringEntryPopup():void{
      this.WaringEntryFlag=false
    }
    //当前页的数据
    getCurrentData(params:any){
      this.currentData=params
    }

    //获取预警突发信息
    async getWaringForms(){
      let res1 = await InfoPublishHttp.getWaringFormsByStatus(1)
      let res2 = await InfoPublishHttp.getWaringFormsByStatus(2)
      this.tableData=res1.concat(res2)
    }
    mounted(){
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(350)
      })
      this.getWaringForms()
    }
  }
</script>

<style lang="scss" scoped>
#WaringEntry{
  width: 100%;
  height: 100%;
  background: white;
  box-sizing: border-box;
  padding: 20px 40px;
  box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.25);
  .WaringEntry_header{
    height:30px;
    margin-bottom: 10px;
    .WaringEntry_header_title{
      line-height: 30px;
      font-size: 14px;/*no*/
      font-weight: bold;
      float: left;
    }
    .PlanBtn{
      float: right;
      height: 30px;
      box-sizing: border-box;
      margin-left: 20px;
    }

  }
  .WaringEntry_main{
    border: 1px solid #ebeef5;
  }
}
</style>
