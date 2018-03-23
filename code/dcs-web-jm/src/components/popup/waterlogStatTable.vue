<template>
    <div id="waterlog-stat-popup" class="poi-detail-popup"
         v-if="isShowWaterlogStat && selectedModel === 'waterlogging'"
         v-drag="{handle: '.poi-detail-title'}">
      <div class="poi-detail-title">
        内涝点雨水增量统计表格
        <span @click="toggleWaterlogStatTable">✕</span>
      </div>
      <div class="poi-detail-wrapper"
           v-loading="loading"
           element-loading-text="分析中">
        <div class="wtl-table-wrapper" v-if="poiListData.length && !loading">
          <el-table
            :data="poiListData"
            height="400"
            border>
            <el-table-column
              width="180"
              label="内涝点"
              label-class-name="wtl-table-th"
              align="center">
              <el-table-column
                prop="name"
                label="超警个数"
                width="180"
                label-class-name="wtl-table-th"
                align="center">
              </el-table-column>
            </el-table-column>
            <el-table-column
              v-for="(opt, key) in columns"
              :prop="key"
              :label="opt.text"
              :key="key"
              width="80"
              sortable
              label-class-name="wtl-table-th"
              align="center">
              <el-table-column
                :prop="key"
                :label="'≥' + opt.threshold + '(' + opt.count + '个)'"
                width="80"
                :labelClassName="opt.count ? 'wtl-table-th out-threshold' : 'wtl-table-th'"
                align="center">
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="wtl-export-table"
             v-if="poiListData.length && !loading"
             title="导出表格"
             @click="exportStatTable">
        </div>
        <div class="wtl-nodata" v-if="!poiListData.length && !loading">当前时次无数据</div>
      </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { export_json_to_excel } from '../../util/Export2Excel'

export default {
    data() {
        return {
            columns: {
                'p3': { index: 3, text: '过去3h', threshold: 20, count: 0 },
                'p2': { index: 4, text: '过去2h', threshold: 15, count: 0 },
                'p1': { index: 5, text: '过去1h', threshold: 8, count: 0 },
                'qpe': { index: 6, text: '实况', threshold: 8, count: 0 },
                'f1': { index: 8, text: '未来1h', threshold: 8, count: 0 },
                'f2': { index: 9, text: '未来2h', threshold: 15, count: 0 },
                'f3': { index: 10, text: '未来3h', threshold: 20, count: 0 }
            },
            timer: null,
            loading: false
        }
    },
    computed: {
        ...mapGetters([
            'poiFstData',
            'isShowWaterlogStat',
            'selectedModel',
            'dateForModel'
        ]),
        poiListData() {
            for(let i in this.columns) {
                this.columns[i].count = 0;
            }

            let list = [];
            for(let poi of this.poiFstData) {
                let fstData = poi.fstData;
                if(!fstData || !fstData.length)
                    continue;
                let data = { name: poi.name };
                for(let i in this.columns) {
                    let col = this.columns[i];
                    data[i] = fstData[col.index];
                    if(data[i] > col.threshold) {
                        col.count++;
                    }
                }
                list.push(data);
            }

            if(this.selectedModel !== 'waterlogging')
                return;

            this.loading = false;
            if(this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            return list;
        }
    },
    methods: {
        ...mapActions([
            'toggleWaterlogStatTable'
        ]),
        exportStatTable() {
          const tHeader = ['内涝点', '过去3小时', '过去2小时', '过去1小时', '实况', '未来1小时', '未来2小时', '未来3小时'];
          const filterVal = ['name', 'p3', 'p2', 'p1', 'qpe', 'f1', 'f2', 'f3'];
          const list = this.poiListData;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, `内涝点雨量统计信息${this.dateForModel}`);
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]));
        }
    },
    watch: {
        dateForModel() {
            if(this.selectedModel !== 'waterlogging')
                return;
            this.loading = true;
            if(this.timer) {
                clearTimeout(this.timer);
            }

            this.timer = setTimeout(() => {
                if(this.loading) {
                    this.loading = false;
                    this.timer = null;
                    this.poiListData = [];
                }
            }, 5000);
        }
    }
}
</script>
<style lang="scss" scoped>
#waterlog-stat-popup {
  width: 760px;
  right: 5px;
  .poi-detail-wrapper {
    width: 100%;
    height: 400px;

    .wtl-table-wrapper,
    .wtl-nodata {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .wtl-export-table {
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

    .wtl-nodata {
      color: red;
      font-size: 18px;
      text-align: center;
      line-height: 400px;
    }
  }
}

</style>
<style lang="scss">
.wtl-table-th {
  background-color: #EFF2F7 !important;
}

.out-threshold {
  color: red !important;
}
</style>
