<template>
  <main id="HydrologyChart" class="global-popup" v-drag>
    <header>
      <span>{{ name }}</span>
      <em @click="storePopupStatus_global({ key: 'HydrologyChart', action: false })"></em>
    </header>
    <div class="content">
      <div class="opts cf">
        <div class="type-wrapper">
          <el-radio class="radio" v-model="chartTypeSelected" :label="key" v-for="(el, key) in chartType" :key="key">
            {{ el }}
          </el-radio>
        </div>
        <component :is="timeRangeView" :timeChanged='timeChanged' :rangeType="'hour'" :maxInterval="10"
            :maxIntervalUnit="'hour'" :startTime="startTime" :endTime="endTime"></component>
      </div>
      <figure v-loading="loading" element-loading-text="正在获取数据">
        <div class="table-wrapper" id="HydrologyChartWrapper"></div>
      </figure>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { hydrologyClient } from '../../../util/clientHelper'
  import TimeRange from '../../commonCompt/TimeRange.vue'
  import moment from 'moment'
	import echarts from 'echarts/lib/echarts'
	import 'echarts/lib/chart/line'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/title'

  let chartElement: any = null
  let stationInfo: any = {}

  @Component
  export default class HydrologyChart extends Vue {
    @Getter('systemStore/hydrologyChartInfo_global') hydrologyChartInfo_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    timeRangeView: any = null
    chartTypeSelected: string = 'line'
    chartType: any = { line: '折线图', bar: '柱状图' }
    hydrologyType: 'rivers' | 'reservoirs' = 'rivers'
    name: string = ''
    startTime: any = moment()
    endTime: any = moment()
    loading: boolean = false

    mounted () {
      this.initComp()
    }

    initComp() {
      let info = this.hydrologyChartInfo_global
      this.hydrologyType = 'river' in info ? 'rivers' : 'reservoirs'
      this.name = ('river' in info ? info.staname : info.name ) + '（' + info.code + '）'
      if (!info.updatetime) {
        Vue['prototype']['$message']({ type: 'warning', message: '数据获取失败' })
        return
      }
      let time = new Date(info.updatetime)
      this.endTime = moment(time)
      this.startTime = moment(time).subtract(10, 'hours')
      this.timeRangeView = TimeRange
      this.getInfo()
    }

    beforeDestroy() {
      stationInfo = {}
			chartElement = null
    }
    
    getInfo() {
      this.loading = true
      let startTime = new Date(this.startTime).getTime()
      let endTime = new Date(this.endTime).getTime()
      let num = (endTime - startTime) / (60*60*1000)
      let pros: any = []
      for (let i = 0; i <= num; i++) {
        let time = moment(this.startTime).add(i, 'hours').unix() * 1000
        pros.push(this.getData(time))
      }
      stationInfo = {}
      Promise.all(pros).then(() => {
        this.loading = false
        this.drawChart()
      })
    }

    async getData(time) {
      return new Promise(async (resolve, reject) => {
        let date = moment(time).format('YYYY-MM-DD HH:00:00')
        let res = await hydrologyClient.getHistory(this.hydrologyType, date)
        if (!res) resolve()
        for (let el of res) {
          let id = this.hydrologyType === 'rivers' ? 'STACODE' : 'V01301'
          let val = this.hydrologyType === 'rivers' ? 'WATERLEV' : 'RZ'
          if (el[id] === this.hydrologyChartInfo_global.id) {
            stationInfo[time] = el[val]
            break
          }
        }
        if (!stationInfo[time] && stationInfo[time] !== 0)
          stationInfo[time] = 0
        resolve()
      })
    }

    drawChart() {
      let timeArr: any[] = []
      let eleArr: any[] = []
      for (let i in stationInfo) {
        timeArr.push(Number(i))
        eleArr.push(null)
      }
      timeArr.sort((a, b) => a - b)
      for (let i in stationInfo) {
        let index = timeArr.indexOf(Number(i))
        eleArr[index] = stationInfo[i]
      }
      timeArr.map((el, index) => {
        let time = new Date(el)
        timeArr[index] = moment(time).format('YYYY-MM-DD HH:mm')
      })
      if (!chartElement)
        chartElement = echarts.init(document.getElementById('HydrologyChartWrapper'))
      chartElement.setOption({
        title: { text: '水位' },
        tooltip: { 
          trigger: 'axis',
          formatter: params => params[0].name + ' 水位 : ' + params[0].data + '米'
          // formatter: params => params.name + ' 水位 : ' + params.data + '米'
        },
				xAxis: {
          data: timeArr,
					axisTick: {
						interval: 0,
						alignWithLabel: true
					}
        },
				yAxis: {
					type: 'value',
					axisLabel: { formatter: `{value} m` }
				},
				series: [{
          name: '水位',
          type: this.chartTypeSelected,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#1fa6f5' },
                { offset: 0.5, color: '#54bcf9' },
                { offset: 1, color: '#9cd8fb' }
              ])
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#54bcf9' },
                { offset: 1, color: '#ffe' }
              ])
            }
          },
          data: eleArr,
        }],
			})
    }

    @Watch('chartTypeSelected')
		onchartTypeSelectedChanged (val: string, oldVal: string) {
			this.drawChart()
		}

    @Watch('hydrologyChartInfo_global')
    onhydrologyChartInfo_globalChanged (val: any, oldVal: any) {
      this.initComp()
    }

    timeChanged(startTime, endTime) {
      this.startTime = moment(startTime)
      this.endTime = moment(endTime)
      this.getInfo()
    }
  }
</script>

<style lang='scss' scoped>
#HydrologyChart {
  position: absolute;
  top: calc(50% - 254px);
  left: calc(50% - 415px);
  width: 900px;
  .content {
    .opts {
      height: 44px;
      color: #999;
      line-height: 44px;
      border-bottom: 1px solid #ccc;
      .type-wrapper {
        float: left;
        margin: 0 20px;
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
#HydrologyChart {
  figure {
    margin: 0;
    .el-loading-spinner {
      top: 40%;
    }
  }
}
</style>