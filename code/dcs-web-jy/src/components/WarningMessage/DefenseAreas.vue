<template>
  <section id="defense-areas">
    <!-- <h1 class="section-title">重点防御区信息</h1>
    <a class="more-info">更多</a> -->
    <div class="defense-areas-wrapper">
      <div class="map-wrapper"><Zmap /></div>
      <div class="defense-area-info" v-if="isPoiClicked" v-loading="loading">
        <div class="defense-poi-info">
          <ul>
            <li v-for="(item, index) in poiInfo" :key="index" :title="item.value">{{item.text + '：' + item.value}}</li>
          </ul>
        </div>
        <div id="defense-poi-chart"></div>
        <span @click="closePoiPopup">✕</span>
      </div>
      <div class="defense-poi-stat">
        <ul>
          <li v-for="(item, key) in poiStat" :key="key" :class="[key + '-stat']">{{item.text + '：'}}<a>{{item.sum}}个</a></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  // import L from 'leaflet'
  import moment from 'moment'
  import Highcharts from 'highcharts'
  import HighchartsNoData from 'highcharts/modules/no-data-to-display'
  import { Component, Prop } from 'vue-property-decorator'
  import Zmap from '../MapComponents/Zmap.vue'
  import DisasterPoiHelper from '../../util/DisasterPoiHelper'
  import { ModelAssess } from '../../util/modelAssess'
  import Region from '../../interface/Region'
  import { WaterloggingState, TorrentWarningState, GeolWarningState } from '../../interface/DisasterPoi'

  HighchartsNoData(Highcharts);
  Highcharts.setOptions({
    lang: {
      noData: '暂无雨量数据'
    }
  });

  let zmap: any = null,
      poiGroup: any = {},
      poiChart: any = null;
  let L;

  @Component({
    components: {
      Zmap
    }
  })
  export default class DefenseAreas extends Vue {
    @Prop()
    regionData

    isPoiClicked: boolean = false
    loading: boolean = false
    selectedPoiType: string = ''
    poiStat: any = {
      geol: { text: '地质灾害预警点', sum: 0 },
      waterlog: { text: '城市内涝预警点', sum: 0 },
      torrent: { text: '流域洪涝预警点', sum: 0 },
    }
    selectedPoi: WaterloggingState | TorrentWarningState | GeolWarningState = { id:0, lon: 0, lat: 0, ddatetime: 0, name: '', threshold: '', rain: '', status: ''}
    rainData: number[] = [];

    get poiInfo() {
      let poiType = this.selectedPoiType;
      let info = [], params = {};
      switch(poiType) {
        case 'geol':
          params = {
            name: '名称',
            address: '地址',
            type: '类型',
            level: '等级',
            manager: '联系人',
            phone: '联系电话',
            ddatetime: '数据时间'
          };
          break;
        case 'torrent':
          params = {
            name: '名称',
            type: '类型',
            waterlevel: '当前水位',
            alertlevel: '警戒水位',
            ddatetime: '数据时间'
          };
          break;
        case 'waterlog':
          params = {
            name: '名称',
            address: '地址',
            manager: '负责人',
            phone: '联系电话',
            ddatetime: '数据时间'
          };
          break;
      }
      for(let i in params) {
        info.push({
          value: this.selectedPoi[i] || '--',
          text: params[i]
        })
      }
      return info;
    }

    mounted(): void {
      L = window['L'];
      let global: any = <any>window;
      zmap = global['zmap'];
      for(let i in this.poiStat) {
        this.getDisasterPoi(i);
      }
    }

    destroyed(): void {
      let global: any = <any>window;
      delete global['zmap'];
      zmap = null;
    }

    closePoiPopup(): void {
      this.isPoiClicked = false;
    }

    async getDisasterPoi(type: string): Promise<void> {
      // let starttime = moment(Date.now() - 3600000).format('YYYY-MM-DD HH:00:00'),
      //     endtime = moment(Date.now()).format('YYYY-MM-DD HH:00:00');
      let starttime = '2018-03-05 11:00:00',
          endtime = '2018-03-05 11:10:00';
      let torrentParams: any = null;
      if(type === 'torrent') {
        torrentParams = { citys: [this.regionData.cityName] };
        if(this.regionData.countyName)
          torrentParams.countys = [this.regionData.countyName];
      }
      let disaPoiHelper = new DisasterPoiHelper();
      let data = await disaPoiHelper.getDisasterWarningByTime(type, starttime, endtime, [], [], torrentParams);
      
      this.clearDisasterPoi(type);
      this.poiStat[type].sum = data.length;
      if(data.length) {
        this.addDisasterPoi(type, data);
      }
    }

    addDisasterPoi(type: string, data: Array<WaterloggingState | TorrentWarningState | GeolWarningState>): void {
      let layerGroup: any = L.layerGroup();
      for(let poi of data) {
        let marker = L.marker([poi.lat, poi.lon], {
          icon: L.divIcon({
            className: "warning-twinkle-wrapper",
            html: `<div class="warning-poi warning-poi-${type}"></div>`
          })
        }).on('click', e => {
          this.showPoiDetail(poi, type);
        });
        marker.id = `poi_${type}`;
        layerGroup.addLayer(marker);
      }
      console.log(type, layerGroup);
      poiGroup[type] = layerGroup.addTo(zmap);
    }

    clearDisasterPoi(type?: string): void {
      if(type in poiGroup) {
        zmap.removeLayer(poiGroup[type]);
        delete poiGroup[type];
      }
    }

    async showPoiDetail(poi: WaterloggingState | TorrentWarningState | GeolWarningState, type: string): Promise<void> {
      if(!this.isPoiClicked)
        this.isPoiClicked = true;
      this.loading = true;
      this.selectedPoi = poi;
      this.selectedPoiType = type;
      let ms: number = Date.now();
      ms -= (ms%360000 + 1800000);
      let filename: string = `grid${moment(ms).format('YYYYMMDDHHmm')}00.nc`;
      let modelAssess: ModelAssess = new ModelAssess({
        type: this.regionData.countyId ? 'county' : 'city',
        ...this.regionData
      });
      let ncInfo: any = await modelAssess.getNcInfo('grid_nc', filename)
        .catch(e => console.log('failed to get grid ncInfo'));
      if(poi.id !== this.selectedPoi.id || !ncInfo) {  
        this.drawRainChart([]);
        setTimeout(() => {this.loading = false}, 300);
        return;
      }
      let data: any = await modelAssess.getPointValue(ncInfo, poi.lon, poi.lat);
      setTimeout(() => {this.loading = false}, 300);
      if(poi.id !== this.selectedPoi.id) 
        return;
      this.drawRainChart(data);
    }

    drawRainChart(data: number[]): void {
      if(data.length) {
        data = data.map(el => [-999, 9999.9, 9999, 999].includes(el) ? 0 : el);
        data.splice(7, 1);
      } else {
        data = [];
      }
      console.log(data);
      Highcharts.chart("defense-poi-chart", {
        chart: {
          type: "column"
        },
        credits: {
          enabled: false
        },
        title: {
          text: '降雨量',
          style: {
            fontSize: '12px'
          }
        },
        noData: {
          style: {
            fontWeight: 'bold',
            fontSize: '12px',
            color: '#303030'
          }
        },
        xAxis: {
          categories: ['过去24h','过去12h','过去6h','过去3h','过去2h','过去1h','当前','未来1h','未来2h','未来3h']
        },
        yAxis: {
          title: {
            text: '降雨量',
            style: {
              fontSize: '12px'
            }
          },
          min: 0
        },
        legend: {
          enabled:false,
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
        series: [{
          name: '降雨量',
          data,
          color:'#668be9'
        }]
      });
    }
  }
</script>

<style lang="scss" scoped>
  #defense-areas {
    width: 100%;
    height: 500px;
    position: relative;

    .defense-areas-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      font-size: 0;
      background-color: white;
      .map-wrapper {
        width: 100%;//calc(100% - 400px);
        height: 100%;
        position: relative;
        display: inline-block;
        vertical-align: top;
      }
      .defense-area-info {
        width: 500px;
        //height: calc(100% - 20px);
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: white;
        box-shadow: 0px 0px 10px -4px black;
        >span {
          width: 28px;
          height: 100%;
          position: absolute;
          display: inline-block;
          top: 0;
          right: 0;
          font-size: 10px;
          text-align: center;
          line-height: 28px;
          cursor: pointer;
          &:hover {
            font-weight: bold;
          }
        }
        .defense-poi-info {
          width: calc(100% - 10px);
          //height: calc(50% - 11px);
          position: relative;
          margin: 5px;
          border-bottom: 1px solid #ddd; /*no*/
          >ul {
            width: calc(100% -  20px);
            //height: calc(100% - 20px);
            position: relative;
            padding: 20px 10px 10px;
            display: block;
            font-size: 0;
            >li {
              width: calc(50% - 10px);
              height: 30px;
              position: relative;
              display: inline-block;
              vertical-align: top;
              padding-right: 10px;
              line-height: 30px;
              font-size: 12px;
              overflow: hidden;
            }
          }
        }
        #defense-poi-chart {
          width: 100%;
          height: 300px;
          position: relative;
        }
      }
      .defense-poi-stat {
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: rgba(255, 255, 255, .9);
        padding: 10px 15px;
        border-radius: 2px;
        >ul {
          position: relative;
          >li {
            height: 40px;
            position: relative;
            display: block;
            padding-left: 40px;
            line-height: 40px;
            font-size: 14px;
            >a {
              color: red;
              font-weight: bold;
              margin-left: 5px;
            }
            &::before {
              content: '';
              width: 26px;
              height: 26px;
              position: absolute;
              top: 7px;
              left: 0;
            }
          }
          li.geol-stat::before {
            background: url(~Img/warningMsg/geol.png) center center no-repeat;
            background-size: 100% 100%;
          }
          li.waterlog-stat::before {
            background: url(~Img/warningMsg/waterlog.png) center center no-repeat;
            background-size: 100% 100%;
          }
          li.torrent-stat::before {
            background: url(~Img/warningMsg/torrent.png) center center no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
.warning-twinkle-wrapper {
  background-color: none !important;
  border: none !important;
}

.warning-poi {
  &:before {
    content: '';
    position: absolute;
    width: 30px; /*no*/
    height: 30px; /*no*/
    -webkit-animation: mapping 1s linear infinite;
    -moz-animation: mapping 1s linear infinite;
    animation: mapping 1s linear infinite;
    z-index: 2;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 24px; /*no*/
    height: 6px; /*no*/
    border-radius: 100%;
    top: 26px; /*no*/
    left: 3px; /*no*/
    background-color: rgba(0, 0, 0, 0.2);
  }
}

.warning-poi-geol:before {
  background: url(~Img/warningMsg/geol_m.png) center center no-repeat;
}

.warning-poi-waterlog:before {
  background: url(~Img/warningMsg/waterlog_m.png) center center no-repeat;
}

.warning-poi-torrent:before {
  background: url(~Img/warningMsg/torrent_m.png) center center no-repeat;
}

@-webkit-keyframes mapping {
    0% {top: 0;}
    50%{top: -5px;}
    100% {top:0; }
}
@-moz-keyframes mapping {
    0% {top: 0;}
    50%{top: -5px;}
    100% {top:0; }
}
@keyframes mapping {
    0% {top: 0;}
    50%{top: -5px;}
    100% {top:0; }
}

@-webkit-keyframes warning-twinkle-multiple {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes warning-twinkle-multiple {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}

.warning-twinkle {
  position: relative;
}

.warning-twinkle:after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background: #ff2323;
  top: 11px;
  right: 9px;
  z-index: 10;
}

.warning-twinkle>div:nth-child(2) {
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}

.warning-twinkle>div:nth-child(3) {
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}

.warning-twinkle>div {
  background-color: red;
  border-radius: 100%;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  position: absolute;
  top: 6px;
  right: 4px;
  opacity: 0;
  margin: 0;
  width: 18px;
  height: 18px;
  -webkit-animation: warning-twinkle-multiple 0.8s 0s linear infinite;
  animation: warning-twinkle-multiple 0.8s 0s linear infinite;
}
</style>
>
