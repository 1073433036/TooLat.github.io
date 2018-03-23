<template>
  <main id="RainChart" v-loading="isLoading" element-loading-text="雨量数据加载中"
      element-loading-spinner="el-icon-loading">
    <div id="table-wrapper" v-show="hasData"></div>
    <div class="no-data" v-show="!hasData">暂无数据</div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { disasterMoniterClient } from '@/util/ClientHelper'
  import toModeltime from '@/util/toModeltime'
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/toolbox'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/legend'
  import moment from 'moment'

  let chart: any = null

  @Component
  export default class RainChart extends Vue {
    @Prop() info
    @Prop() tabsSelected
    @Getter('decisionStore/region_global') region_global
    isLoading: boolean = false
    isComponentAlive: boolean = true
    hasData: boolean = false

    mounted() {
      this.initComp()
    }

    beforeDestroy() {
      this.disposeChart()
      this.isComponentAlive = false
    }

    initComp() {
      if (this.tabsSelected === 'pass')
        this.getPassRain()
      else if (this.tabsSelected === 'forecast')
        this.getForecastRain()
    }

    @Watch('info')
    oninfoChanged (val: any, oldVal: any) {
      this.initComp()
    }

    @Watch('tabsSelected')
    ontabsSelectedChanged (val: any, oldVal: any) {
      if (val === 'pass')
        this.getPassRain()
      else if (val === 'forecast')
        this.getForecastRain()
    }

    async getPassRain() {
      this.isLoading = true
      this.disposeChart()

      let cityId = this.region_global.cityId,
          time = moment(Date.now() - 60*60*1000).format('YYYY/MM/DD HH:00:00'),   //取前1小时数据
          timeString = moment(new Date(time)).format('YYYYMMDDHH0000')
      let res: { filepath: string, filename: string } | false = await disasterMoniterClient.getNcFileInfo(cityId, timeString)
      if (!this.isComponentAlive) return
      if (!res) {
        Vue['prototype']['$message']({ type: 'error', message: '雨量数据获取失败' })
        this.hasData = false
        this.isLoading = false
        return
      }

      let filepath = res.filepath,
          filename = res.filename
      let data: number[] | false = await disasterMoniterClient.getPassRain(cityId, this.info.lon, this.info.lat, filepath, filename)
      if (!this.isComponentAlive) return
      this.isLoading = false
      if (!data) {
        Vue['prototype']['$message']({ type: 'error', message: '雨量数据获取失败' })
        this.hasData = false
        return
      }
      // 过滤 异常数据
      data.map((item, index, self) => {
        if (index === 0) {
          if (item <= 0) self[index] = 0
        } else {
          if (item < self[index - 1])
            self[index] = self[index - 1]
        }
      })

      // 逐小雨量
      let hourRainAxis: number[] = []
      data.map((item, index, self) => {
        if (index === 0) hourRainAxis.push(item)
        else {
          let v = item - self[index - 1]
          hourRainAxis.push(v >= 0 ? v : 0)
        }
      })

      let timeAxis: string[] = []
      for (let i = 0; i < 72; i++) {
        let t = new Date(time).getTime() - i*60*60*1000
        timeAxis.unshift(moment(t).format('MM-DD HH:00'))
      }
      this.drawChart('pass', timeAxis, hourRainAxis, data)
    }

    // 未来雨量
    async getForecastRain() {
      this.isLoading = true
      this.disposeChart()

      let starttime: any = new Date().getTime(),
          endtime: Date | string = new Date(starttime + 71*60*60*1000)
      let time = toModeltime(starttime, endtime)
      starttime = time.starttime
      endtime = time.endtime
      let res: { ROWCOUNT: string, RET: string, MSG: string, DATA: number[] } | false =
        await disasterMoniterClient.getForecastRain(this.info.lon, this.info.lat, starttime, endtime)
      if (!this.isComponentAlive) return
      this.isLoading = false
      if (!res || res.RET != '0') {
        Vue['prototype']['$message']({ type: 'error', message: '雨量数据获取失败' })
        this.hasData = false
        return
      }
      // 累计雨量
      let data: number[] = res.DATA.length ===72 ? res.DATA : res.DATA.slice(1, 73)

      // 逐小时雨量
      let hourRainAxis: number[] = []
      data.map((item, index, self) => {
        if (index === 0) hourRainAxis.push(item)
        else {
          let v = item - self[index - 1]
          hourRainAxis.push(v >= 0 ? v : 0)
        }
      })

      let timeAxis: string[] = []
      for (let i = 0; i < 72; i++) {
        let t = new Date(starttime.replace(/-/g, '/')).getTime() + i*60*60*1000
        timeAxis.push(moment(t).format('MM-DD HH:00'))
      }
      this.drawChart('forecast', timeAxis, hourRainAxis, data)
    }

    // 绘制图表
    drawChart(type, timeAxis, hourRainAxis, totalRainAxis) {
      this.hasData = true
      this.$nextTick(() => {
        let chart = echarts.init(document.getElementById('table-wrapper'))
        let option = {
          grid: { left: 50, right: 30, top: 30, bottom: 50 },
          title: {
            text: type === 'pass' ? '过去雨量' : '未来雨量',
            textStyle: { color: '#666', fontSize: 14 }
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              let string = params[0].axisValue + '</br>'
              for (let el of params) {
                string += `
                  <span style="color: ${el.color}; display: inline-block; min-width: 65px">${el.seriesName}:</span>
                  <span style="color: #666; font-weight: bold"> ${Math.round(el.data*10)/10} mm</span>
                  </br>
                `
              }
              return string
            },
            backgroundColor: 'rgb(248, 248, 248)',
            borderColor: '#ccc',
            borderWidth: 1,
            padding: [5, 10],
            textStyle: { fontSize: 12, color: '#666' }
          },
          toolbox: {
            right: 20,
            feature: {
              dataZoom: { yAxisIndex: 'none' },
              restore: {},
              saveAsImage: {}
            }
          },
          legend: { data:['累计雨量', '逐小时雨量'] },
          xAxis: {
            data: timeAxis,
            axisTick: {
              // interval: 0,
              alignWithLabel: true
            }
          },
          yAxis: {
            name: '降雨量(mm)',
            nameLocation: 'center',
            nameGap: 38,
            type: 'value',
          },
          series: [{
              name: '累计雨量',
              type: 'line',
              smooth: true,
              symbol: 'none',
              itemStyle: { normal: { color: '#90ed7d' } },
              areaStyle: { normal: { color: '#90ed7d' } },
              data: totalRainAxis
            },
            {
              name: '逐小时雨量',
              type: 'bar',
              itemStyle: { normal: { color: '#7cb5ec' } },
              data: hourRainAxis
          }]
        }
        chart.setOption(option)
      })
    }

    // 销毁实例
    disposeChart() {
      if (!chart) return
      echarts.dispose(chart)
      chart = null
    }
  }
</script>

<style lang='scss' scoped>
#RainChart {
  height: 300px;
  #table-wrapper {
    height: 100%;
  }
  .no-data {
    text-align: center;
    font-size: 20px;
    line-height: 200px;
  }
}
</style>