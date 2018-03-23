<template>
  <main class="waterloggingTable" v-if="showMark">
    <el-table
      :data="currentData"
      :border="true"
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
        v-if="tableType=='warningState'"
        label="阈值信息"
        align="center"
        width="80">
        <template slot-scope="scope">
          <a href="javascript:void(0);" @click="showYuZhiInfo(scope.row)" >查看</a>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableType=='warningState'"
        label="小时雨量"
        align="center"
        width="80">
        <template slot-scope="scope">
          <a href="javascript:void(0);" @click="showRainInfo(scope.row)" >查看</a>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableType=='warningReport'"
        label="操作"
        align="center"
        width="80">
        <template slot-scope="scope">
          <el-button title="下载"
                     class="infoTab_btn tab_btn_4"
                     @click="clickDownload(scope.row)" type="text" size="small"></el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableType=='waterloggingPoint'"
        label="阈值信息"
        align="center"
        width="80">
        <template slot-scope="scope">
          <a @click="changeThreshold(scope.row)" style="color: #11A9F5;cursor: pointer">修改</a>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableType=='waterloggingPoint'"
        label="操作"
        align="center"
        width="110">
        <template slot-scope="scope">
          <el-button class="infoTab_btn tab_btn_1" @click="changeRow(scope.row)" type="text" size="small"></el-button>
          <el-button class="infoTab_btn tab_btn_2" @click="deleteRow(scope.row)" type="text" size="small"></el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableType=='warningState'"
        label="预警状态"
        align="center"
        width="110">
        <template slot-scope="scope">
          <span :style="{'color':scope.row.status=='预警中'?'red':'inherit'}">{{scope.row.status}}</span>
        </template>
      </el-table-column>
    </el-table>
    <CommonPagination :tableData="tableData" @getCurrentData="getCurrentData"/>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop, Watch } from 'vue-property-decorator'
  import InfoManageTableType from '../../../config/InfoManageTableType'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import { getComputeTableHeight } from "../../../util/InfoManageFunction"

  @Component({
    components: {
      CommonPagination,
    },
  })
  export default class WaterloggingTable extends Vue {
    currentData:any[]=[]
    showMark: boolean = true
    tableHeight: number = 0
    tableDateType: { prop: string, label: string, width: string, align:string }[] = InfoManageTableType['waterloggingPoint']
    @Prop()
    tableType
    @Prop()
    tableData
    @Watch('tableType')
    changeTableType(val) {
      this.tableDateType = []
      this.showMark = false
      this.tableDateType = InfoManageTableType[this.tableType]
      setTimeout(() => {
        this.showMark = true
      },300)
    }
    handleSelectionChange(val: any) {
      this.$emit('handleSelectionChange', val)
    }
    deleteRow(row: object) {
      this.$emit('deleteRow',row)
    }
    changeRow(row: object){
      this.$emit('changeRow',row)
    }
    //查看阈值信息
    showYuZhiInfo(par){
      this.$emit('showYuZhiInfo',par)
    }
    //点击查看雨量信息
    showRainInfo(par:object){
      this.$emit('showRainInfo',par)
    }
    //点击内涝点的阈值修改
    changeThreshold(par:object){
      this.$emit('changeThreshold',par)

    }
    //点击下载预警报告
    clickDownload(params:any){
      let a = document.createElement('a')
      a.href=`http://10.148.83.86:8080/JYTY/word/getWord?type=waterlog&filename=${params.fileName}`
      a.download=params.filename
      a.click()
    }
    getCurrentData(params){
      this.currentData=params
    }
    mounted(){
      this.$nextTick(()=>{
        this.tableHeight = getComputeTableHeight(470)
        setTimeout(() => {
          this.showMark = true
        },300)
      })
    }
  }
</script>
<style lang="scss" scoped>
  .waterloggingTable{
    border: 0px solid #e6ebf5;
    font-size: 12px;/*no*/
    .el-table__header-wrapper{
      border: 1px solid #e6ebf5;
    }
  }
</style>

