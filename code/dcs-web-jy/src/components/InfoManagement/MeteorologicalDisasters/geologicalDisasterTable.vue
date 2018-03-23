<template>
  <main class="geologicalDisasterTable" v-if="showMark">
    <el-table
      :data="currentData"
      border
      stripe
      :height="tableHeight"
      header-cell-class-name="tableHeader"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="25">
      </el-table-column>
      <el-table-column
        v-for="(item,key) in tableDateType"
        :key="key"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width">
      </el-table-column>
      <el-table-column
        v-if="tableType=='geologicalDisasterState'"
        label="阈值信息"
        align="center"
        width="80">
        <template slot-scope="scope">
          <a href="javascript:void(0);" @click="showYuZhiInfo(scope.row)">查看</a>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableType=='geologicalDisasterState'"
        label="小时雨量"
        align="center"
        width="80">
        <template slot-scope="scope">
          <a href="javascript:void(0);" @click="showRainInfo(scope.row)">查看</a>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableType=='geologicalDisasterState'"
        label="预警状态"
        align="center"
        width="110">
        <template slot-scope="scope">
          <span :style="{'color':scope.row.status=='预警中'?'red':'inherit'}">{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableType=='geologicalDisasterPoint'"
        label="阈值信息"
        align="center"
        width="80">
        <template slot-scope="scope">
          <a @click="changeThreshold(scope.row)" style="color: #11A9F5;cursor: pointer">修改</a>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableType=='geologicalDisasterPoint'"
        align="center"
        label="操作"
        width="110">
        <template slot-scope="scope">
          <el-button class="infoTab_btn tab_btn_1" @click="changeRow(scope.row)" type="text" size="small"></el-button>
          <el-button class="infoTab_btn tab_btn_2" @click="deleteRow(scope.row)" type="text" size="small"></el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableType=='geologicalDisasterReport'"
        align="center"
        label="下载"
        width="60">
        <template slot-scope="scope">
          <el-button title="下载" class="infoTab_btn tab_btn_4" @click="clickDownload(scope.row)" type="text" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <CommonPagination :tableData="tableData" @getCurrentData="getCurrentData"/>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import InfoManageTableType from '../../../config/InfoManageTableType'
  import { getComputeTableHeight } from "../../../util/InfoManageFunction"
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  @Component({
    components: {
      CommonPagination,
    },
  })
  export default class GeologicalDisasterTable extends Vue {
    currentData:any=[]
    tableHeight:number=0
    showMark:boolean=true
    tableDateType:{ prop: string, label: string, width: string, align:string}[]=InfoManageTableType['geologicalDisasterPoint']
    @Prop()
    tableType
    @Prop()
    tableData
    @Watch('tableType')
    changeTableType(val){
      this.tableDateType=[]
      this.showMark=false
      this.tableDateType=InfoManageTableType[this.tableType]
      setTimeout(()=>{
        this.showMark=true
      },300)
    }

    handleSelectionChange(val:any){
      this.$emit('handleSelectionChange',val)
    }
    deleteRow(row:object) {
      this.$emit('deleteRow',row)
    }
    changeRow(row:object){
      this.$emit('changeRow',row)
    }
    //点击查看雨量信息
    showRainInfo(par:object){
      this.$emit('showRainInfo',par)
    }
    //点击查看阈值信息
    showYuZhiInfo(par:object){
      this.$emit('showYuZhiInfo',par)
    }
    //点击内涝点的阈值修改
    changeThreshold(par:object){
      this.$emit('changeThreshold',par)

    }
    getCurrentData(params){
      this.currentData=params
    }
    //点击下载预警报告
    clickDownload(params:any){
      let a = document.createElement('a')
      a.style.display='none'
      a.href=`http://10.148.83.86:8080/JYTY/word/getWord?type=geol&filename=${params.fileName}`
      a.download=params.fileName
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    mounted(){
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(470)
        setTimeout(()=>{
          this.showMark=true
        },300)
      })
    }
  }
</script>
<style lang="scss" scoped>
  .geologicalDisasterTable{
    border: 0px solid #e6ebf5;
    font-size: 12px;/*no*/
  }
</style>
