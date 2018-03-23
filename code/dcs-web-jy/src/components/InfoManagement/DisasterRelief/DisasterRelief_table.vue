<template>
  <div id="disasterRelief_table" v-if="GeographicInfoType">
    <el-table
      :data="currentData"
      :height="tableHeight"
      border
      header-cell-class-name="tableHeader"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="20">
      </el-table-column>
      <el-table-column
        v-for="(item,key) in GeographicInfoType"
        :key="key"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :min-width="item.width">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="110">
        <template slot-scope="scope">
          <el-button class="infoTab_btn tab_btn_1" @click="editInfo(scope.row)" type="text" size="small"></el-button>
          <el-button class="infoTab_btn tab_btn_2" @click="deleteInfo(scope.row)" type="text" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <CommonPagination :tableData="tableData" @getCurrentData="getCurrentData"/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import { getComputeTableHeight } from "../../../util/InfoManageFunction"
  @Component({
    components: {
      CommonPagination,
    }
  })
  export default class DisasterReliefTable extends Vue {
    tableHeight:number=300
    currentData:any[]=[]
    @Prop()
    tableData
    @Prop()
    GeographicInfoType

    editInfo(row:object) {
      this.$emit('editInfo',row)
    }
    deleteInfo(row:object){
      this.$emit('deleteInfo',row)
    }
    handleSelectionChange(val:any[]){
      this.$emit('handleSelectionChange',val)
    }
    getCurrentData(params){
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
#disasterRelief_table{
   font-size: 14px;
}
</style>
