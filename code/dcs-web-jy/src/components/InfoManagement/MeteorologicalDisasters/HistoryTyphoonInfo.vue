<template>
  <main id="typhoon">
    <CommonNavMenu @handleSelect="handleSelect" :NavMenuName="componentName"></CommonNavMenu>
    <div v-if="activeIndex=='typhoonInfo'">
      <div class="typhoon_radioSelects">
        <div class="typhoon_radioSelect" v-for="(items,keys) in selectTypes" :key="keys">
          <span class="typhoon_radioSelect_text">{{items.label}}</span>
          <el-checkbox class="radioSelect_all"
                       v-model="items.checkAll"
                       @change="handleCheckAllChange($event,items.type)">全选</el-checkbox>
          <el-checkbox-group v-model="items.activeSelect" @change="handleCheckedCitiesChange($event,items.type)">
            <el-checkbox v-for="item in items.selects" :label="item" :key="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="typhoon_searchExport">
        <button class="smallFeature_addBtn" @click.stop="searchTyphoon">查询</button>
        <button class="smallFeature_leadBtn" @click="createExcel">导出</button>
      </div>
      <section class="typhoon_table">
        <div class="typhoonTable">
          <el-table
            :data="currentPageTableData"
            :height="tableHeight"
            stripe
            border
            :default-sort = "{prop: 'tsid', order: 'descending'}"
            header-cell-class-name="tableHeader">
            <el-table-column
              v-for="(item,key) in tableType"
              :key="key"
              :prop="item.prop"
              :label="item.label"
              :align="item.align"
              :sortable="key===0"
              :width="item.width">
            </el-table-column>
          </el-table>
        </div>
      </section>
      <CommonPagination :tableData="tableData"
                        @getCurrentData="getCurrentData"/>
    </div>
    <div v-if="activeIndex==='typhoonReport'"></div>
  </main>
</template>
<script lang="ts">
  import Vue from 'vue'
  import moment from 'moment'
  import { Getter } from 'vuex-class'
  import Region from '../../../interface/Region'
  import { Component, Watch } from 'vue-property-decorator'
  import { getTyphoonInfo } from "../../../util/InfoManageHttp"
  import { HistoryTyphoonItem } from '../../../interface/TyphoonInfo'
  import CommonNavMenu from '../../CommonComponents/CommonNavMenu.vue'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import * as typhoonSearchConf from '../../../config/TyphoonInfoSearchConfig'
  import { TyphoonSelects, SelectTypes } from '../../../interface/TyphoonSelectTypes'
  import { getComputePage, getTyphoonParams, getComputeTableHeight, createExcel } from "../../../util/InfoManageFunction"
  import InfoManageTableType from '../../../config/InfoManageTableType'
  @Component({
    components: {
      CommonPagination,
      CommonNavMenu
    }
  })
  export default class HistoryTyphoonInfo extends Vue {
    @Getter('systemStore/region_global') regionGlobal
    tableType:{ prop: string, label: string, width: string, align:string }[]=InfoManageTableType['typhoonInfo']
    componentName:string='typhoon'
    typhoon: string = 'typhoon'
    activeIndex: string = 'typhoonInfo'
    tableHeight: number = 0
    selectTypes: TyphoonSelects = {
      landings: {
        type: 'landings',
        label: '登陆地点',
        checkAll: false,
        activeSelect: ['揭阳'],
        selects: this.getSelectOptions('landings')
      },
      distances: {
        type: 'distances',
        label: '距站点(G2971)距离',
        checkAll: false,
        activeSelect: [],
        selects: this.getSelectOptions('distances')
      },
      levels: {
        type: 'levels',
        label: '台风最大等级',
        checkAll: false,
        activeSelect: [],
        selects: this.getSelectOptions('levels')
      },
      months: {
        type: 'months',
        label: '登陆月份',
        checkAll: false,
        activeSelect: [],
        selects: this.getSelectOptions('months')
      },
      windRanges: {
        type: 'windRanges',
        label: '自动站最大风力',
        checkAll: false,
        activeSelect: [],
        selects: this.getSelectOptions('windRanges')
      },
      rainRanges: {
        label: '自动站最大日雨量(mm)',
        type: 'rainRanges',
        checkAll: false,
        activeSelect: [],
        selects: this.getSelectOptions('rainRanges')
      }
    }
    tableData: Array<TyphoonItem> = []
    currentPageTableData: Array<TyphoonItem> = []

    async mounted(): Promise<void> {
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(800)
      })
      this.searchTyphoon();
    }

    //获取勾选的台风筛选条件
    getSelectOptions(type: string): string[] {
      if(type in typhoonSearchConf === false)
        return [];
      let options = typhoonSearchConf[type].map((v: { label: string, value: Array<string | number> }): string => v.label);
      return options;
    }

    //搜索匹配台风
    async searchTyphoon(): Promise<void> {
      this.tableData = [];
      let data: Array<HistoryTyphoonItem> = await getTyphoonInfo(this.selectTypes, this.regionGlobal.cityName);
      if(data.length) {
        this.tableData = data.map((ty: HistoryTyphoonItem): TyphoonItem => {
          let info:any = ty.info, landfall:any = ty.landfall;
          return {
            id: ty.tsid,
            tsid: ty.intlid,
            name: info.cname,
            level: info.level,
            landings: landfall.city,
            landingsLevel: landfall.level,
            distance: parseInt(String(info.min_distance)),
            landingsMonth: landfall.datetime === '不登陆' ? '不登陆' : ((new Date(landfall.datetime).getMonth() + 1) + '月') ,
            maxWind: Number(info.max_wind.toFixed(1)),
            maxRain: Number(info.max_rain.toFixed(1))
          };
        })
      }
    }

    getCurrentData($event: Array<any>): void {
      this.currentPageTableData = $event;
    }

    //tab栏类型选择
    handleSelect(val: string): void {
      console.log(val)
      this.activeIndex = val;
    }

    //部分全选
    handleCheckAllChange(val: boolean, type: string): void {
      this.selectTypes[type].activeSelect = val ? this.selectTypes[type].selects : [];
    }

    //单个勾选
    handleCheckedCitiesChange(value: Array<any>, type: string): void {
      let checkedCount: number = value.length;
      this.selectTypes[type].checkAll = checkedCount === this.selectTypes[type].selects.length;
    }

    //清除所有勾选
    clearSelect(): void {
      for (let item in this.selectTypes) {
        this.selectTypes[item].checkAll = false;
        this.selectTypes[item].activeSelect = [];
      }
    }

    //导出当前表格数据到excel文件
    createExcel(){
      let title=moment(new Date()).format('YYYY-MM-DD HH:mm')+'台风'
      createExcel(this.tableData,InfoManageTableType['typhoonInfo'],title)
    }
  }

  interface TyphoonItem {
    id: number,
    tsid: string,
    name: string,
    level: string,
    landings: string,
    landingsLevel: string,
    distance: number,
    landingsMonth: string,
    maxWind: number,
    maxRain: number
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/theme.scss';
  #typhoon {
    width: 100%;
    overflow: hidden;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    background-color: white;
    background-clip: content-box;
    min-height: 100%;
    box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.25);
    @include scrollStyle;
    .typhoon_radioSelects {
      margin-top: 15px;
      padding-left: 40px;
      font-size: 12px;
      overflow: hidden;
      .typhoon_radioSelect {
        line-height: 35px;
        color: #393939;
        overflow: hidden;
        height: 35px;
        .typhoon_radioSelect_text {
          width: 170px;
          float: left;
          height: 35px;
          font-size: 14px;
          margin-right: 20px;
          .radioSelect_all {
            float: left;
          }
        }
      }
    }
    //删除导入按钮样式
    .typhoon_searchExport {
      height:30px;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 40px;
      button {
        width: 100px;
        height: 30px;
        border: none;
        outline: none;
        float: left;
        margin-right: 20px;
        cursor: pointer;
        line-height: 29px;
        font-size: 14px;
      }
      .smallFeature_addBtn {
        margin-left: 600px;
        background-color: #11a9f5;
        color: #fff;
        &:hover {
          background-color: rgb(16, 152, 221);
        }
        &:active {
          background-color: #11a9f5;
        }
      }
      .smallFeature_leadBtn {
        background-color:white;
        box-sizing: border-box;
        border: 1px solid #11a9f5;
        color: #11a9f5;
        &:hover {
          border: 1px solid #303030;
          color: #303030;
        }
        &:active {
          border: 1px solid #11a9f5;
          color:#11a9f5;
        }
      }
      .smallFeature_deleBtn{
        background-color: #eb414f;
        color: #fff;
        &:hover {
          background-color: #d93c48;
          color: #fff;
        }
        &:active {
          background-color:  #eb414f;
          color: #fff;
        }
      }
    }
    .typhoon_table {
      padding: 0 40px;
      width: 100%;
      box-sizing: border-box;
      font-size: 12px;
      .typhoonTable {
        border: 0px solid #e6ebf5;
        font-size: 12px;/*no*/
      }
    }
    .typhoon_page {
      padding-right: 50px;
      padding-top: 30px;
      .typhoon_page_main {
        float: right;
      }
    }
  }
</style>
<style>
  .radioSelect_all{
    float: left;
    margin-right: 30px;
  }
  #typhoon .el-checkbox-group .el-checkbox{
    width: 160px;
  }
  #typhoon .el-checkbox + .el-checkbox{
    margin-left: 10px;
  }
</style>
