<template>
    <div id="reservoir-stat-popup" class="poi-detail-popup"
         v-if="isShowStatRain && selectedModel === 'torrent'"
         v-drag="{handle: '.poi-detail-title'}">
      <div class="poi-detail-title">
        水库雨水增量统计表格
        <span @click="toggleReservoirStatTable">✕</span>
      </div>
      <div class="poi-detail-wrapper"
           v-loading="loading"
           element-loading-text="分析中">
        <div class="rsv-table-wrapper" v-if="reservoirData.length && !loading">
          <el-table
            :data="reservoirData"
            height="400"
            border>
            <el-table-column
              width="120"
              label="水库名称"
              label-class-name="rsv-table-th"
              align="center">
              <el-table-column
                prop="name"
                label="超警个数"
                width="120"
                label-class-name="rsv-table-th"
                align="center">
              </el-table-column>
            </el-table-column>
            <el-table-column
              v-for="(opt, key) in reservoirTableColumns"
              :prop="key"
              :label="opt.cname"
              :key="opt.key"
              width="80"
              sortable
              label-class-name="rsv-table-th"
              align="center">
              <el-table-column
                :prop="key"
                :key="key"
                :label="'≥' + opt.threshold + '(' + opt.count + '个)'"
                :labelClassName="opt.count ? 'rsv-table-th out-threshold' : 'rsv-table-th'"
                align="center"
                width="80">
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="rsv-export-table"
             v-if="reservoirData.length && !loading"
             title="导出表格"
             @click="exportStatTable">
        </div>
        <div class="rsv-nodata" v-if="!reservoirData.length && !loading">当前时次无数据</div>
      </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { export_json_to_excel } from '../../util/Export2Excel'
export default {
    data() {
        return {
            timer: null,
            loading: false
        }
    },
    computed: {
        ...mapGetters([
            'reservoirData',
            'isShowStatRain',
            'selectedModel',
            'reservoirTableColumns'
        ])
    },
    methods: {
        ...mapActions([
            'toggleReservoirStatTable'
        ]),
        exportStatTable() {
            const tHeader = ['水库名称', '过去24小时', '过去12小时', '过去6小时', '过去3小时', '过去2小时', '过去1小时', '实况', '未来1小时', '未来2小时', '未来3小时'];
            const filterVal = ['name', 'rain24', 'rain12', 'rain06', 'rain03', 'rain02', 'rain01', 'qpe', 't1', 't2', 't3'];
            const list = this.reservoirData;
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, '水库雨量统计信息');
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]));
        }
    },
    watch: {
        reservoirData(nv) {
            this.loading = true;
            if(this.timer) {
                clearTimeout(this.timer);
            }

            this.timer = setTimeout(() => {
                this.loading = false;
                this.timer = null;
            }, 500);
        }
    }
}
</script>
<style lang="scss" scoped>
#reservoir-stat-popup {
  width: 940px;
  right: 5px;
  .poi-detail-wrapper {
    width: 100%;
    height: 400px;

    .rsv-table-wrapper,
    .rsv-nodata {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .rsv-export-table {
      width: 30px;
      height: 30px;
      position: absolute;
      right: 30px;
      bottom: 20px;
      background: url(../../assets/table_export.png) center center no-repeat;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, .1);
        border-radius: 30px;
      }
    }

    .rsv-nodata {
      color: red;
      font-size: 18px;
      text-align: center;
      line-height: 400px;
    }
  }
}

</style>
<style lang="scss">
.el-table td, .el-table th {
  height: 30px!important;
  font-size: 12px!important;
}

.el-table .cell, .el-table th>div {
  padding: 0px 5px;
}

.rsv-table-th {
  background-color: #EFF2F7 !important;
}

.out-threshold {
  color: red !important;
}
</style>
