<template>
  <main id="WaterMonitorDetail" v-drag :style="{ top: pos.y + 'px', left: pos.x + 'px' }" ref="panel">
    <header>
      <span>{{ waterName }}</span>
      <i class="close-icon" @click="storePopupStatus_global({ key: 'waterMonitorDetail', action: false })"></i>
    </header>
    <div class="content-wrapper">
      <div id="waterChart"></div>
      <div class="detail">
        <ul class="cf">
          <li class="cf" v-for="(text, id) in elements[info.waterType]" :key="id">
            <div class="name" :title="text">{{ text }} </div>
            <div class="val" :title="info[id]">
              {{ info[id] ? ((id === 'alertlevel' || id === 'waterlevel') ? info[id] + ' 米' : info[id]) : ' ---' }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  import { hydrologyClient } from '@/util/ClientHelper'
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/markline'

  let L: any = null,
      zmap: any = null,
      fluctuate: any = {}
  let chart: any

  @Component
  export default class WaterMonitorDetail extends Vue {
    @Getter('decisionStore/waterMonitorDetailInfo_global') info
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    pos: any = { x: 0, y: 0 }
    elements: any = {
      reservoirs: {
        // address: '地址',
        lat: '纬度',
        lon: '经度',
        code: '编号',
        alertlevel: '警戒水位',
        waterlevel: '当前水位',
        formatTime: '更新时间'
      },
      rivers: {
        lat: '纬度',
        lon: '经度',
        river: '河流',
        endflow: '出海口',
        alertlevel: '警戒水位',
        waterlevel: '当前水位',
        formatTime: '更新时间'
      }
    }
    get waterName() {
      return this.info.waterType === 'rivers' ? this.info.staname : this.info.address
    }
    get levelImg() {
      return 'static/img/DecisionCommand/WaterLevel/' + this.info.level + '.png'
    }
    get updateDateTime() {
      if (this.info.updatetime)
        return moment(this.info.updatetime).format('YYYY-MM-DD HH:mm')
      else
        return '---'
    }
    chartColor: any = {
      one: '#00A0E9',
      two: '#FCEE21',
      three: '#F7931E',
      four: '#ED1C24'
    }

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      this.$set(this.info, 'formatTime', moment(this.info.updatetime).format('MM-DD HH:mm'))
      this.computedPos()
      this.getAllFluctuate(this.info.waterType)
    }

    beforeDestroy() {
      L = null
      zmap = null
      fluctuate = {}
      chart = null
    }

    computedPos() {
      let x = this.info.pos.x,
          y = this.info.pos.y
      let el = <HTMLDivElement>this.$refs.panel
      let elWidth = el.clientWidth,
          elHeight = el.clientHeight
      this.pos.x = x - elWidth / 2
      this.pos.y = (y - 58 < elHeight) ? (y + 15) : (y - elHeight - 58)
    }

    async getAllFluctuate(type) {
      let datetime = this.info.updatetime
      if (fluctuate[datetime] && fluctuate[datetime][type]) {
        this.drawChart()
        return
      }
      if (!fluctuate[datetime])
        fluctuate[datetime] = {}
      fluctuate[datetime][type] = {}

      let promiseList: any = []
      for (let i = 0; i < 6; i++) {
        let time = moment(new Date(datetime - i*24*60*60*1000)).format('YYYY-MM-DD HH:mm:00')   // 间隔24小时
        let pro =  new Promise(async (resolve, reject) => {
          let res = await hydrologyClient.getHistory(type, time)
          if (res) {
            let id = type === 'reservoirs' ? 'V01301' : 'STACODE'
            let val = type === 'reservoirs' ? 'RZ' : 'WATERLEV'
            for (let opt of res) {
              if (!fluctuate[datetime][type][opt[id]])
                fluctuate[datetime][type][opt[id]] = {}
              fluctuate[datetime][type][opt[id]][time] = opt[val]
            }
          }
          resolve()
        })
        promiseList.push(pro)
      }
      Promise.all(promiseList).then(() => {
        this.drawChart()
      })
    }

    drawChart() {
      if (chart) {
        echarts.dispose(chart)
        chart = null
      }

      let type = this.info.waterType
      let item = fluctuate[this.info.updatetime][type][this.info.id]
      if (!item) return
      let list = Object.keys(item).sort((a, b) => {
        let aTime = new Date(a.replace(/-/g, '/')).getTime()
        let bTime = new Date(b.replace(/-/g, '/')).getTime()
        return aTime - bTime
      })

      let x: string[] = [], y: number[] = []
      for (let el of list) {
        y.push(item[el])
        let time = new Date(el.replace(/-/g, '/')).getTime()
        x.push(moment(time).format('DD日HH时'))
      }

      chart = echarts.init(document.getElementById('waterChart'))
      let option: any = {
        grid: { left: 15, right: 15, top: 30, bottom: 20 },
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: { backgroundColor: '#6a7985' }
          }
        },
        xAxis: {
          data: x,
          boundaryGap : false,
          axisLabel: {
            color: '#999',
            formatter: (value, index) => value.substring(0, 3)
          }
        },
        yAxis: {
          type: 'value',
          min: value => value.min - 0.05,
          boundaryGap: false,
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: { show: false }
        },
        series: [{
          name: '水位',
          type: 'line',
          showSymbol: false,
          itemStyle: { normal: { color: this.chartColor[this.info.level] } },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: this.chartColor[this.info.level] },
                { offset: 1, color: '#ffe' }
              ])
            }
          },
          data: y
        }]
      }

      if (this.info.alertlevel) {
        option.series[0].markLine = {
          data: [{
            label: { normal: {
              position: 'middle',
              formatter: '警戒水位: {c}米'
            } },
            lineStyle: { normal: { color: '#f00' } },
            yAxis: this.info.alertlevel
          }]
        }
      }
      chart.setOption(option)
    }

    @Watch('info')
    async oninfoChanged (val: any, oldVal: any) {
      if (val) {
        this.$set(val, 'formatTime', moment(val.updatetime).format('MM-DD HH:mm'))
        await this.getAllFluctuate(val.waterType)
        this.computedPos()
      }
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#WaterMonitorDetail {
  position: absolute;
  z-index: 1;
  width: 304px; /*no*/
  box-sizing: border-box;
  border-radius: 4px; /*no*/
  padding: 10px; /*no*/
  background-color: #fff;
  box-shadow: 0 0 10px #8d9db5; /*no*/
  header {
    height: 25px; /*no*/
    line-height: 25px; /*no*/
    text-align: center;
    cursor: move;
    span {
      height: 25px; /*no*/
      line-height: 25px; /*no*/
      color: #1c1c1c;
    }
    i.close-icon {
      background: url(~Img/DecisionCommand/close_black.png) no-repeat 100% 0 / 200% 100%;
      width: 11.5px; /*no*/
      height: 13px; /*no*/
      position: absolute;
      top: 16px; /*no*/
      cursor: pointer;
      right: 14px; /*no*/
    }
  }
}

#waterChart {
  width: 100%;
  height: 130px; /*no*/
}

.detail {
  width: 100%;
  border-radius: 3px; /*no*/
  margin-top: 5px; /*no*/
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  padding: 0 8px; /*no*/
  ul {
    // padding-top: 12px; /*no*/
    width: 100%;
    li {
      float: left;
      height: 20px; /*no*/
      line-height: 20px; /*no*/
      width: 50%;
      .name {
        float: left;
        width: 60px; /*no*/
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #989898;
      }
      .val {
        float: left;
        width: calc(100% - 60px); /*no*/
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #1c1c1c;
      }
    }
  }
}
</style>