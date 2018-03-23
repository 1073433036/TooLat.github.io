<template>
  <main id="InfoPublish">
    <div class="InfoPublish_left">
      <div class="waringInfoList">
        <header class="waringInfoList_title">
          当前生效预警信息
        </header>
        <p class="waringInfoList_p">
          【预警发布单】预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单
        </p>
        <div class="waringInfoList_tag">
          <ul>
            <li>来源：分区</li>
            <li>发布单位：分区</li>
            <li>类别：分区</li>
            <li>级别：分区</li>
          </ul>
        </div>
      </div>
      <div class="waringInfoList">
        <header class="waringInfoList_title">
          最新预警信息
        </header>
        <p class="waringInfoList_p">
          【预警发布单】预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单预警发布单
        </p>
        <div class="waringInfoList_tag">
          <ul>
            <li>来源：分区</li>
            <li>发布单位：分区</li>
            <li>类别：分区</li>
            <li>级别：分区</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="InfoPublish_right">
      <div id="echartColumn"></div>
      <div id="echartPie" style="width: 100%;"></div>
    </div>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Highcharts from  'highcharts'
  import { Component,Prop } from 'vue-property-decorator'
  let echartColumn,echartPie:any
  @Component({
    components:{

    }
  })
  export default class InfoPublish extends Vue {
    //创建图表
    createrEchart(echartOption:any):any{
      return Highcharts['chart'](echartOption.ElementId, {
        chart: {
          type: echartOption.echartType
        },
        credits:{
          enabled:false
        },
        title: {
          text: echartOption.title
        },
        subtitle: {
          text: ''
        },
        yAxis: echartOption.yAxis,
        xAxis: {
          categories: []
        },
        legend: {
          layout: 'vertical',
          align: 'center',
          verticalAlign: 'top',
          enabled:false
        },
        series: [
          {
            name: '雨量(mm)',
            data:echartOption.data
          }
        ],
      })
    }
    mounted(){
      let echartColumnOption={
        echartType:'column',
        ElementId:'echartColumn',
        title:'预警信息统计',
        yAxis:{
          min: 0,
          title: {
            text: '次数'
          }
        },
        data:[2,4,5,8,10,6]
      }
      let echartPieOption={
        echartType:'pie',
        ElementId:'echartPie',
        title:'',
        yAxis:{
          min: 0,
          title: {
            text: ''
          }
        },
        data:[
          ['Firefox',   45.0],
          ['IE',       26.8],
          {
            name: 'Chrome',
            y: 12.8,
            sliced: true,
            selected: true
          },
          ['Safari',    8.5],
          ['Opera',     6.2],
          ['其他',   0.7]
        ]
      }
      echartColumn=this.createrEchart(echartColumnOption)
      echartPie=this.createrEchart(echartPieOption)
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/theme.scss';
#InfoPublish{
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  .InfoPublish_left{
    float: left;
    width: 970px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    box-shadow: 0px 0px 5px rgba(137, 137, 137, 0.25);
    background: white;
    box-sizing: border-box;
    padding: 20px;
    @include scrollStyle;
    .waringInfoList{
      float: left;
      width: 100%;
      border-bottom: 1px dashed #e5e5e5;/*no*/
      margin-bottom: 40px;
      .waringInfoList_title{
        height: 16px;/*no*/
        line-height: 16px;/*no*/
        font-size: 14px;/*no*/
        border-left: 4px solid #11A9F5;/*no*/
        text-indent: 10px;/*no*/
      }
      .waringInfoList_p{
        font-size: 14px;
        line-height: 20px;/*no*/
        color: #1c1c1c;
        margin-top: 15px;
      }
      .waringInfoList_tag{
        color: #989898;
        font-size: 12px;
        margin: 10px 0px;/*no*/
        overflow: hidden;
        ul li{
          float: left;
          margin-right: 30px;
        }
      }
    }
  }
  .InfoPublish_right{
    float: left;
    width: calc(100% - 980px) ;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    margin-left: 10px;
    box-shadow: 0px 0px 5px rgba(137, 137, 137, 0.25);
    background: white;
    padding: 0px 40px;
    box-sizing: border-box;
    @include scrollStyle;
    #echartColumn,#echartPie{
      margin-top: 45px;
    }
  }
}
</style>
