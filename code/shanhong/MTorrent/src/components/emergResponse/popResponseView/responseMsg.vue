<template>
  <main id="ResponseVue" :style="{ top: pos.y + 'px', left: pos.x + 'px' }" ref="panel">
    <header>
      <div class="wariningType">{{info.data[0].riskType + '信号'}}</div>
    </header>

    <el-table
      :data="info.data"
      border
      style="width: 520px; text-align: center; margin: 2px">
      <el-table-column
        prop="V_CITY"
        label="市"
        width="60">
      </el-table-column>
      <el-table-column
        prop="VF01015_CN"
        label="县"
        width="60">
      </el-table-column>
      <el-table-column
        prop="C_TFSTA"
        label="是否生效"
        width="60">
      </el-table-column>
      <el-table-column
        prop="DDATETIME"
        label="预警时间"
        width="140">
      </el-table-column>
      <el-table-column
        prop="C_TFCLT"
        label="预警解除时间"
        width="140">
      </el-table-column>
      <el-table-column
        prop="riskLevel"
        label="预警信号"
        width="60">
        <template slot-scope="scope">
          <img class="img-class" :src="scope.row.marskUrl">
        </template>
      </el-table-column>
    </el-table>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class responseMsg extends Vue {
    @Getter('systemStore/riskTypeInfo_global') info: any

    pos: any = { x: 0, y: 0 }
    mounted() {
      let x = this.info.position[0], y = this.info.position[1]
      let w = document.body.clientWidth,
        h = document.body.clientHeight
      let el = <HTMLDivElement>this.$refs.panel
      let elWidth = el.clientWidth,
        elHeight = el.clientHeight
      x = (w - x < elWidth) ? (x - elWidth - 10) : (x + 10)
      y = (h - y < elHeight) ? (y - elHeight - 10) : (y + 10)
      this.pos.x = x <= 360 ? 340 : x;
      this.pos.y = y
    }
  }
</script>

<style lang='scss' scoped>
  #ResponseVue {
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0px;
    width: 524px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.35);
    header {
      margin-bottom: 5px;
      /*text-indent: 10px;*/
      text-align: center;
      line-height: 30px;
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      background: #f3ac12;
    }
    .img-class {
      display: inline-block;
      padding-top: 2px;
      width: 30px;
      height: 30px;
    }
  }
</style>

<style lang="scss">
  #ResponseVue {
    .el-table__body-wrapper {
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }
    .is-group th{
      font-size: 12px;
      color: #999999 !important;
      font-weight: 700;
      background: #fff;
      padding: 5px 0;
    }
    .el-table--border th {
      text-align: center;
      padding: 0;
    }
    .el-table--border td{
      /*border-right: 0;*/
      padding: 5px 0;
    }
    .levelClass{
      border-right: 1px solid #e6ebf5 !important;
      font-size: 12px;
      color: #545454;
    }
  }
</style>
