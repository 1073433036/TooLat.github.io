<template>
    <main class="contingencyPlanTable">
      <div class="contingencyPlanTable_main">
        <el-table
          :data="currentData"
          style="width: 100%"
          border
          stripe
          header-cell-class-name="tableHeader"
          :height="tableHeight"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="20">
          </el-table-column>
          <el-table-column
            v-for="(item,key) in tableType"
            :key="key"
            :prop="item.prop"
            :label="item.label"
            align="center"
            :width="item.width">
          </el-table-column>
          <el-table-column
            align="center"
            width="90"
            label="传真文件">
            <template slot-scope="scope">
              <a class="planTextLook"
                 :download="scope.row.scan?true:false"
                 :href="scope.row.scan?scope.row.scan:'javascript:void(0)'"
                 @click="showInfo(scope.row)">{{scope.row.scan?'下载':'无'}}</a>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="60">
            <template slot-scope="scope">
              <el-button class="infoTab_btn tab_btn_2" @click="deleteInfo(scope.row)" type="text" size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <CommonPagination :tableData="tableData" @getCurrentData="getCurrentData"/>
    </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import { getComputeTableHeight } from "../../../util/InfoManageFunction"
  import InfoManageTableType from '../../../config/InfoManageTableType'
  @Component({
    components:{
      CommonPagination
    }
  })
  export default class ContingencyPlanTable extends Vue {
    tableType:{ prop: string, label: string, width: string, align:string }[]=InfoManageTableType['PlansEntry']
    currentData:any[]=[]
    tableHeight:number=300
    @Prop()
    tableData:any

    //勾选信息
    handleSelectionChange(val:any){
      this.$emit('handleSelectionChange',val)
    }
    //删除
    deleteInfo(val:any){
      this.$emit('deleteInfo',val)
    }
    //点击查看
    showInfo(val:any){
      this.$emit('showInfo',val)
    }

    //获取当前页面信息
    getCurrentData(params:any){
      this.currentData=params
    }
    mounted(){
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(470)
      })
    }
  }
</script>

<style lang="scss" scoped>
.contingencyPlanTable{
  .PlanMainTitle{
    height: 36px;
    line-height: 36px;
    font-size: 14px;/*no*/
    font-weight: bold;
    margin-bottom: 0px;
    padding: 0 40px;
  }
  .contingencyPlanTable_main{
    padding: 0 40px;
  }
}
</style>
<style>
  .planTextLook{
    color: #11A9F5;
    cursor: pointer;
  }
  .planTextLook:hover{
    text-decoration:underline;
  }
</style>
