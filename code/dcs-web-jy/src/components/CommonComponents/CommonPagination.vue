<template>
  <div class="page-wrapper" >
    <el-pagination
      class="page-main"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="infoAllNumber">
    </el-pagination>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { getComputePage } from "../../util/InfoManageFunction"

  @Component
  export default class paginationComponent extends Vue {
    pageSizes: number[] = [10, 20, 30, 40]
    pageSize: number = 10
    currentPage: number = 1
    infoAllNumber: number = 0
    currentPageTableData: any = []
    @Prop()
    tableData

    @Watch('tableData')
    changetableData(val): void {
      this.tableData.length>40? this.pageSizes[4]=this.tableData.length : this.pageSizes=[10, 20, 30, 40]
      this.currentPageTableData = getComputePage(this.currentPage, this.pageSize, this.tableData);
      this.infoAllNumber = this.tableData.length;

    }
    @Watch('currentPageTableData')
    changecurrentPageTableData(){
      this.$emit('getCurrentData',this.currentPageTableData)
    }
    //分页每页条数改变
    handleSizeChange(val: number): void {
      this.pageSize = val;
      this.currentPageTableData = getComputePage(this.currentPage, this.pageSize, this.tableData);
    }
    //分页当前页面改变
    handleCurrentChange(val: number): void {
      this.tableData.length>40? this.pageSizes[4]=this.tableData.length : this.pageSizes=[10, 20, 30, 40];
      this.currentPage = val;
      this.currentPageTableData = getComputePage(this.currentPage, this.pageSize, this.tableData);
    }
    mounted(){
      this.tableData.length>40? this.pageSizes[4]=this.tableData.length : this.pageSizes=[10, 20, 30, 40]
      this.currentPageTableData = getComputePage(this.currentPage, this.pageSize, this.tableData);
      this.infoAllNumber = this.tableData.length;
    }
  }
</script>

<style lang="scss" scoped>
  .page-wrapper{
    overflow: hidden;
    padding-right: 50px;
    padding-top: 30px;
    .page-main{
      float: right;
    }
  }
</style>
