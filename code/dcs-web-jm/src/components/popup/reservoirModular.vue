<template>
  <div id="reservoir" class="poi-detail-popup" v-if="poiDetail.show&&poiDetail.type=='reservoir'" v-drag="{handle: '.poi-detail-title'}">
    <div class="poi-detail-title" :title="poiDetail.title">
      {{poiDetail.title.substring(0, 24)}}
      <span @click="hidePoiDetailPopup">✕</span>
    </div>
    <div class="reservoir-wrapper">
      <div class="reservoir-group">
        <div class="reservoir-address">
          地址：{{poiDetail.details[0]['地址']}} &nbsp;  &nbsp; &nbsp; 水库编号：{{poiDetail.details[0]['水库编号']}}
        </div>
        <div class="reservoir-pic">
          <img :src="resImgUrl" alt="">
          <div class="reservoir-warn">
            库容（万方）：{{poiDetail.details[0]['库容(万方)']}} <br>
            警戒水位（米）：{{poiDetail.details[0]['汛限水位(米)']}} <br>
            当前水位（米）：{{waterLeve}} <br>
          </div>
        </div>
        <div id="container" style="width:600px;height:180px; padding-top:10px "></div>
        <div class="reservoir-bot">
          降雨量 &nbsp;<span class="reservoir-bot-3"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import Highcharts from 'highcharts';
  export default {
    data() {
      return{
        bg:true,
        stcd:'',
        resImgUrl:'',
        waterLeve:'',
      }
    },
    computed: {
      ...mapGetters([
        'poiDetail',
        'modelData',
        'dateForModel',
        'currentRegion',
        'reservoirRainfall'
      ]),
    },
    watch:{
      'poiDetail.details':{
        handler (val) {
          if(this.poiDetail.type !== 'reservoir')
              return;
          let stcd = this.stcd = val[0]['水库编号'];
          this.getReservoirImg(this.stcd);
          this.getReservoirData(this.stcd);
          let position = [{
              x: this.poiDetail.position[0],
              y: this.poiDetail.position[1]
          }];
          this.getReservoirRain({
            $http: this.$http,
            regionObj: this.currentRegion,
            position
          }).then(data => {
            if(stcd === this.stcd) {
              this.setChart(data[0]);
            }
          });
        }
      },
      /*reservoirRainfall(val){
        this.setChart(val[0]);
      }*/
    },
    methods:{
      ...mapActions([
        'showMaterialList',
        'hidePoiDetailPopup',
        'getReservoirRain'
      ]),
      setChart(val){
        var chart=new Highcharts.Chart('container',{
          chart: {
            style: {
              fontFamily: 'serif'
            }
          },
          title:{
            text:null,
          },
          subtitle: {
            text:'降雨量(mm)',
            x:-240,
            y:5,
            style:{
                color:'#475f88',
                fontSize:'12px',
                fontWeight:500,
            }
          },
          xAxis: [{
            categories: ['过去24h','过去12h','过去6h','过去3h','过去2h','过去1h','当前','未来1h','未来2h','未来3h'],
            crosshair: true,
            lineColor: '#818181',
            tickColor: '#818181',
            labels: {
              style: {
                color:'#545454',
                fontSize:'12px'
              }
            }
          }],
          yAxis: [{
            labels: {
              style: {
                color:'#545454',
                fontSize:'12px'
              }
            },
            tickAmount: 5,
            className: 'highcharts_0',
            title: {
              text:null,
              offset:0,
              y: 0,
              x:0,
              rotation: 0,
              floating:false,
              align: 'high',
              style: {
                color: Highcharts.getOptions().colors[1],
                verticalAlign:'top',
              }
            },
          }],
          legend: {
            enabled:false,
          },
          /*tooltip: {
            headerFormat: '<span>{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}mm</b></td></tr>',
            footerFormat: '</table>',
            valueDecimals: 1,
            useHTML: true,
            shared: true
          },*/
          series: [{
            name:'降雨量',
            type: 'spline',
            data: [val[0], val[1], val[2], val[3], val[4], val[5], val[6], val[8], val[9], val[10]],
            color:'#668be9',
          },
          ]
        });
      },
      getReservoirData(stcd){
        let url = `http://10.148.83.228:1995/JmDcs/water/selectByTmAndStcd?datetime=${new Date().Format('yyyy-MM-dd HH:00:00')}&stcd=${stcd}`;
        this.$http.jsonp(url).then(res => {
            if(res.data.data.reservoir == null) {
                this.waterLeve = '--';
            } else {
              this.waterLeve = res.data.data.reservoir.rz;
            }
        }, err => {
          this.waterLeve = '--';
        });
      },
      getReservoirImg(stcd) {
        this.resImgUrl = '';
        let time1 = new Date().getTime();
        let time2 = time1 - 86400000;
        time1 = new Date(time1).Format('yyyy-MM-dd HH:00:00');
        time2 = new Date(time2).Format('yyyy-MM-dd HH:00:00');
        let url = "http://10.148.83.228:1995/JmDcs/water/selectImageByTmAndStcd?endTime=" + time1 + "&startTime=" + time2 + "&staId=" + stcd;
        this.$http.jsonp(url).then(res => {
          if(!res.data.length) {
            this.resImgUrl = '/static/img/reservoir/wutu.png';
          } else {
            let len = res.data.length;
            let url = res.data[len - 1].vtdt.replace('/Images/','http://sk.digitwater.com/skjgimages/');
            this.resImgUrl = url;
          }
        }, err => {
          this.resImgUrl = '/static/img/reservoir/wutu.png';
        })
      }
    }
  }
</script>
<style scope lang="scss">
  .highcharts-credits{
    display:none!important;
  }
  #reservoir{
    width:600px;
  }

  .reservoir-title{
    height:30px;
    background-color: #273B5C;
    color: white;
    line-height: 30px;
    padding-left:10px;
  }
  .reservoir-title > span{
    width: 30px;
    height:30px;
    text-align: center;
    font-size:20px;
    cursor: pointer;
    float: right;
    margin-right: 10px;
  }
  .reservoir-wrapper{
    overflow: hidden;
  }
  .reservoir-address{
    height:24px;
    line-height:24px;
    color: #229AF9;
    border-bottom: 1px solid #F0F0F0;
    padding:0px 10px;
  }
  .reservoir-pic{
    padding:10px;
    height:240px;
    border-bottom: 1px solid #F0F0F0;
    position: relative;

  }
  .reservoir-pic > img{
    width:100%;
    height:100%;
    border: 0px solid transparent;
  }
  .reservoir-pic > .reservoir-warn{
    width:200px;
    height:71px;
    position: absolute;
    top:20px;
    right:20px;
    font-size: 12px;
    background-color: rgba(70, 70, 70, 0.51);
    color: #FFF;
    line-height: 23px;
    padding-left: 8px;
  }
  #container{
    height:180px;
    padding:0px 10px;
  }

  /* Link the series colors to axis colors */
  .highcharts_0 {
    fill: #818181;
    stroke: #818181;
  }
  .highcharts-axis.highcharts_0 .highcharts-axis-line {
    stroke: #818181;
  }
  .highcharts-axis.highcharts_0 text {
    fill: #818181;
  }
  .highcharts-yaxis .highcharts-axis-line {
    stroke-width: 2px;
  }

  .reservoir-bot{
    padding:0px 10px;
    height:24px;
    background-color: #DEE4F0;
    line-height:24px;
  }
  .reservoir-bot-1{
    background-color: #009CFD;
    width: 10px;
    height:10px;
    display: inline-block;
  }
  .reservoir-bot-2{
    width: 15px;
    height: 1px;
    border: 1px solid #ffa210;
    display: inline-block;
    line-height: 10px;
    box-sizing: border-box;
    vertical-align: middle;
  }
  .reservoir-bot-3{
    background-image: url("../../../static/img/reservoir/reservoir_level .png");
    background-position: center;
    background-size: contain;
    width: 15px;
    height:7px;
    display: inline-block;
  }
  .reservoir-bot-4{
    width: 13px;
    height: 1px;
    border: 1px solid red;
    display: inline-block;
    line-height: 10px;
    box-sizing: border-box;
    vertical-align: middle;
  }
</style>
