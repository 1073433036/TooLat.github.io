<template>
  <div :id="chartBoxId" style="width: 100%; height: 100%; position: relative;" v-loading="loading"></div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Highcharts from 'highcharts'
  import HighchartsNoData from 'highcharts/modules/no-data-to-display'
  import { Component, Prop, Watch } from 'vue-property-decorator'
  import DisasterWarning from '../../interface/DisasterWarning'
  import disastersChartConf from '../../config/disastersChartConf'

  HighchartsNoData(Highcharts);
  Highcharts.setOptions({
    lang: {
      noData: '暂无影响区域'
    }
  });

  interface ChartOptions {
    type: string
    title: string
    xAxis: string[]
    series: [{
      name: string,
      color: string
    }]
  }

  @Component
  export default class DisasterChart extends Vue {
    @Prop()
    chartData
    @Prop()
    chartType

    loading: boolean = false

    //图表容器id
    get chartBoxId(): string {
      return this.chartType + '-chart';
    }

    @Watch('chartData')
    getChartData(): void {
      console.log(this.chartType);
      this.loading = true;
      let options: ChartOptions = { ...disastersChartConf[this.chartType] };
      for(let i = 0; i < options.series.length; i++) {
        let data: number[] = [];
        if(this.chartData.length) {
          //数据顺序为特大暴雨、大暴雨、暴雨、大雨, 需颠倒数组元素顺序
          if(['rain', 'wind'].includes(this.chartType)) {
            this.chartData[i].reverse();
          }
          for(let k = 0; k < options.xAxis.length; k++) {
            data[k] = this.chartData[i][k].length || 0;
          }
        }

        options.series[i]['data'] = data;
      }
      this.drawChart(options);
      setTimeout(() => { this.loading = false; }, 300);
    }

    mounted(): void {
      this.getChartData();
    }

    drawChart(options: ChartOptions): void {
      Highcharts.chart(this.chartBoxId, {
        chart: {
          type: options.type
        },
        credits: {
          enabled: false
        },
        title: {
          text: options.title,
          style: {
            fontSize: '14px'
          }
        },
        noData: {
          style: {
            fontWeight: 'bold',
            fontSize: '16px',
            color: '#303030'
          }
        },
        xAxis: {
          categories: options.xAxis
        },
        yAxis: {
          title: {
            text: '影响城镇个数'
          },
          min: 0
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} 个</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: false
            }
          }
        },
        series: options.series
      });
    }
  }
</script>

<style lang="scss" scoped>

</style>
