<template>
  <main id="HydrologyTable" class="global-popup" v-drag>
    <header>
      <span>水文信息</span>
      <em @click="storePopupStatus_global({ key: 'HydrologyTable', action: false })"></em>
    </header>
    <div class="content">
      <div class="opts bt cf">
        <select v-model="hydrologyType" class="hydrology-type">
          <option value="rivers">水文站</option>
          <option value="reservoirs">水库</option>
        </select>
        <component :is="TimeSelectView" :timeChanged="timeChanged" :time="time" :type="'hour'"></component>
        <input type="text" v-model="searchKey" placeholder="请输入搜索内容">
      </div>
      <div class="table-wrapper">
        <figure v-loading="loading" element-loading-text="正在获取数据">
          <el-table
              :data="showRiverTableData"
              height="430"
              v-show="hydrologyType === 'rivers'"
              :row-class-name="tableRowClassName"
              :default-sort = "{prop: 'STANAME', order: 'descending'}"
              border>
            <el-table-column prop="STANAME" label="站名" sortable :formatter="formatterData"></el-table-column>
            <el-table-column prop="RIVER" label="河流" sortable width="135" :formatter="formatterData"></el-table-column>
            <el-table-column prop="WATERLEV" label="水位" sortable :formatter="formatterData"></el-table-column>
            <el-table-column prop="alertlevel" label="警戒水位" sortable :formatter="formatterData"></el-table-column>
            <el-table-column prop="fluctuate1" label="1小时水势" sortable :formatter="formatterData"></el-table-column>
            <el-table-column prop="fluctuate3" label="3小时水势" sortable :formatter="formatterData"></el-table-column>
            <el-table-column prop="fluctuate24" label="24小时水势" sortable :formatter="formatterData"></el-table-column>
          </el-table>
          <el-table 
              :data="showReservoirTableData" 
              height="430" 
              v-show="hydrologyType === 'reservoirs'"
              :row-class-name="tableRowClassName"
              :default-sort = "{prop: 'VF01015_CN', order: 'descending'}"
              border>
            <el-table-column prop="VF01015_CN" label="名称" sortable :formatter="formatterData"></el-table-column>
            <el-table-column prop="V_ADDRESS" label="地址" show-overflow-tooltip sortable width="135" :formatter="formatterData"></el-table-column>
            <el-table-column prop="RZ" label="水位" sortable :formatter="formatterData"></el-table-column>
            <el-table-column prop="alertlevel" label="警戒水位" sortable :formatter="formatterData"></el-table-column>
            <el-table-column prop="fluctuate1" label="1小时水势" sortable :formatter="formatterData"></el-table-column>
            <el-table-column prop="fluctuate3" label="3小时水势" sortable :formatter="formatterData"></el-table-column>
            <el-table-column prop="fluctuate24" label="24小时水势" sortable :formatter="formatterData"></el-table-column>
          </el-table>
        </figure>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  import { hydrologyClient } from '../../../util/clientHelper'
  import TimeSelect from '../../commonCompt/TimeSelect.vue'

  let realInfo: any = {}

  @Component
  export default class HydrologyTable extends Vue {
    @Getter('systemStore/hydrologyTableType_global') hydrologyTableType_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    TimeSelectView: any = null
    time: Date = new Date()
    hydrologyType: 'rivers' | 'reservoirs' = 'rivers'
    riverTableData: any[] = []
    showRiverTableData: any[] = []
    reservoirTableData: any[] = []
    showReservoirTableData: any[] = []
    searchKey: string = ''
    loading: boolean = true

    tableRowClassName({row, rowIndex}) {
      let key = 'WATERLEV' in row ? 'WATERLEV' : 'RZ'
      if (row[key] && row.alertlevel && row[key] >  row.alertlevel)
        return 'warning-row'
    }

    created () {
      realInfo = {}
      this.hydrologyType = this.hydrologyTableType_global
      // let time = moment().subtract(8, 'hours').format('YYYY/MM/DD HH:00:00')
      let time = moment().format('YYYY/MM/DD HH:00:00')      
      this.time = new Date(time)
      this.TimeSelectView = TimeSelect
      this.getInfo()
    }

    async getInfo() {
      this.loading = true
      let type = this.hydrologyType
      let time = moment(this.time).format('YYYY-MM-DD HH:00:00')
      let res = await hydrologyClient.getHistory(type, time)
      if (res) {
        let obj = {}
        for (let el of res) {
          let id = type === 'rivers' ? el.STACODE : el.V01301
          obj[id] = el
        }
        realInfo[type] = obj
        let pros: any[] = []
        pros.push(this.getAlarmLevel(type))        // 获取警戒水位
        pros.push(this.getFluctuate(type, 1))      // 获取1小时前水位差
        pros.push(this.getFluctuate(type, 3))
        pros.push(this.getFluctuate(type, 24))
        Promise.all(pros)
        .then(() => {
          this.fillTable(type)
          this.loading = false
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '数据获取失败'
        })
        this.loading = false
      }
    }

    async getAlarmLevel(type) {
      return new Promise(async (resolve, reject) => {
        let res = await hydrologyClient.getInfo(type)
        if (!res) resolve()
        for (let el of res) {
          if (!realInfo[type][el.id]) continue
          realInfo[type][el.id].alertlevel = el.alertlevel
        }
        resolve()
      })
    }

    async getFluctuate(type, hour) {
      return new Promise(async (resolve, reject) => {
        let startTime = moment(this.time).subtract(hour, 'hours').format('YYYY-MM-DD HH:00:00')
        let endTime = moment(this.time).format('YYYY-MM-DD HH:00:00')
        let res = await hydrologyClient.getFluctuate(type, startTime, endTime)
        if (!res) resolve()
        for (let el of res) {
          let id = type === 'rivers' ? el.STACODE : el.V01301
          if (!realInfo[type][id]) continue
          realInfo[type][id]['fluctuate' + hour] = Math.floor(el.Differ * 100) / 100
        }
        resolve()
      })
    }

    fillTable(type) {
      if (type === 'rivers') {
        this.riverTableData = []
        this.showRiverTableData = []
        for (let i in realInfo[type]) {
          let val = realInfo[type][i]
          this.riverTableData.push(val)
          this.showRiverTableData.push(val)
        }
      } else {
        this.reservoirTableData = []
        this.showReservoirTableData = []
        for (let i in realInfo[type]) {
          let val = realInfo[type][i]
          this.reservoirTableData.push(val)
          this.showReservoirTableData.push(val)
        }
      }
    }

    @Watch('searchKey')
    onsearchKeyChanged (val: string, oldVal: string) {
      let list = this.hydrologyType === 'rivers' ? this.riverTableData : this.reservoirTableData
      let showList: any[] = []
      for (let el of list) {
        for (let i in el) {
          let exp = new RegExp(val)
          if (exp.test(el[i])) {
            showList.push(el)
            break
          }
        }
      }
      if (this.hydrologyType === 'rivers') this.showRiverTableData = showList
      else this.showReservoirTableData = showList
    }

    timeChanged(time) {
      this.time = time
      this.getInfo()
    }

    @Watch('hydrologyType')
    onhydrologyTypeChanged (val: any, oldVal: any) {
      this.getInfo()
    }

    @Watch('hydrologyTableType_global')
    onhydrologyTableType_globalChanged (val: any, oldVal: any) {
      this.hydrologyType = val
    }

    formatterData(row, column, cellValue) {
      return (cellValue || cellValue === 0) ? cellValue : '---'
    }
  }
</script>

<style lang='scss' scoped>
#HydrologyTable {
  position: absolute;
  top: calc(50% - 254px);
  left: calc(50% - 415px);
  width: 900px;
  .content {
		.opts {
			height: 44px;
			color: #999;
			line-height: 44px;
			&.bt {
				border-bottom: 1px solid #ccc;
			}
			select {
        margin: 0 2px 0 10px;
        width: 75px;
        height: 24px;
        padding-left: 6px;
        border: 1px solid #dcdcdc;
        border-radius: 2px;
				&.hydrology-type {
          float: left;
        	margin: 10px 20px;
					width: 100px;
				}
      }
      input[type="text"] {
        float: right;
        margin: 10px 20px 0 0;
        padding: 0 10px;
        width: 118px;
        height: 22px;
        border-radius: 4px;
        border: 1px solid #dcdcdc;
        outline-color: #f3ac12;
      }
		}
		.table-wrapper {
			width: 860px;
			height: 430px;
			padding: 20px;
    }
  }
}
</style>

<style lang='scss'>
#HydrologyTable {
  .el-table .cell {
    white-space: nowrap;
  }
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table__body-wrapper {
    overflow-x: hidden !important;
    overflow-y: auto !important;
  }
  figure {
    margin: 0;
    .el-loading-spinner {
      top: 40%;
    }
  }
}
</style>