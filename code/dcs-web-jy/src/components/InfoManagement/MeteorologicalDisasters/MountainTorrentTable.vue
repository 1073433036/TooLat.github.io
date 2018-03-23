<template>
  <main class="mountainTorrentsTable" v-if="showMark">
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
        v-if="tableType=='mountainTorrentsState'"
        label="预警状态"
        align="center"
        width="110">
        <template slot-scope="scope">
          <span :style="{'color':scope.row.status=='预警中'?'red':'inherit'}">{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableType=='mountainTorrentsReport'"
        label="操作"
        align="center"
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
  export default class MountainTorrentsTable extends Vue {
    currentData:any[]=[]
    showMark:boolean=true
    tableHeight:number=0
    tableDateType:{ prop: string, label: string, width: string, align:string }[]=InfoManageTableType['reservoir']
    @Prop()
    tableType
    @Prop()
    tableData
    @Watch('tableType')
    changeTableType(val){
      //这里用来监听站点类型
      this.tableDateType=[]
      this.showMark=false
      this.tableDateType=InfoManageTableType[this.tableType]
      setTimeout(()=>{
        this.showMark=true
      },300)
    }
    //输出表格中被勾选的数据
    handleSelectionChange(val:any){
      this.$emit('handleSelectionChange',val)
    }
    //删除表格中对应的信息
    deleteRow(row:object) {
      this.$emit('deleteRow',row)
    }
    //编辑表格信息
    changeRow(row:object){
      this.$emit('changeRow',row)
    }
    //点击下载预警报告
    clickDownload(params:any){
      let a = document.createElement('a')
      a.href=`http://10.148.83.86:8080/JYTY/word/getWord?type=torrent&filename=${params.fileName}`
      console.log(a.href)
      a.download=params.filename
      a.click()
    }
    getCurrentData(params){
      this.currentData=params
    }
    mounted(){
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(460)
        setTimeout(()=>{
          this.showMark=true
        },300)
      })
    }
  }
</script>
<style lang="scss" scoped>
  .mountainTorrentsTable{
    border: 0px solid #e6ebf5;
    font-size: 12px;/*no*/
  }

</style>
