<template>
  <main id="typh-poi-popup" v-drag="{handle: '.draggable'}">
    <header class="draggable">
      <h1>{{typhPoiData_global.poiType}}预报</h1>
      <span @click="toggleTyphPoiPopup_global(false)">
        <svg width="8" height="8">
          <path d="M 0,0 L 8,8 M 8,0 L 0,8" stroke="white" stroke-width="1px"></path>
        </svg>
      </span>
    </header>
    <section class="address-datetime-wraper cf">
      <aside class="cf">
        <el-date-picker
          class="real-date-time"
          v-model="realDatetime"
          type="datetime"
          format="yyyy-MM-dd HH:00:00"
          default-value="dateTime"
          :picker-options="pickerOptions"
          placeholder="选择日期时间">
        </el-date-picker>
      </aside>
      <div class="real-datetime">实况时间:</div>
      <div class="address-wraper">地址: {{address}}</div>
      <div class="address-wraper" v-if="stationName.length">最近站点: {{stationName}}</div>
    </section>
    <div class="typh-poi-chart-container" v-loading="isLoading" element-loading-text="正在加载数据"></div>
  </main>
</template>

<script>
import highChart from 'highcharts'
import { mapGetters, mapActions } from 'vuex'
import { ModelAssess } from '../../util/modelAssess'
import { MeteoMonitor } from '../../util/MeteoMonitor'
import toModelTime from '../../util/toModeltime'

let Chart = null;
export default {
  data() {
    return {
      realDatetime: '',
      stationName: '',
      isLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    }
  },
  mounted() {
    this.realDatetime = this.dateTime.Format('yyyy-MM-dd HH:00');
  },
  computed: {
    ...mapGetters([
      'dateTime',
      'typhPoiData_global',
      'currentRegion'
    ]),
    address() {
      let typhPoiData = this.typhPoiData_global;
      let poiIndex = typhPoiData.poiIndex;
      if (typhPoiData.poiData.poi[poiIndex]) {
        let chartTarget = document.querySelector('.typh-poi-chart-container');
        if (chartTarget) {
          this.isLoading = true;
          let isInDateRange = this.isInDateRange();
          if(isInDateRange === 'equle') {
            this.drawChart();
            this.isLoading = false;
          } else if(isInDateRange === true) {
            this.getPoiData()
              .then(data => {
                this.drawChart(data.fstData, data.realData);
                this.isLoading = false;
              })
              .catch(err => {
                this.drawChart();
                this.isLoading = false;
              });
          }
        }
        return typhPoiData.poiData.poi[poiIndex].name;
      }
      else {
        return '';
      }
    }
  },
  watch: {
    realDatetime(dt, prevDate) {
      this.isLoading = true;
      let isInDateRange = this.isInDateRange(prevDate);
      if(!isInDateRange)
        return;

      if(isInDateRange === 'equle') {
        this.drawChart();
        this.isLoading = false;
      }
      else {
        this.getPoiData()
          .then(data => {
            this.drawChart(data.fstData, data.realData);
            this.isLoading = false;
          })
          .catch(err => {
            this.drawChart();
            this.isLoading = false;
          });
      }
    }
  },
  methods: {
    ...mapActions([
      'toggleTyphPoiPopup_global',
      'showInfoTip_global'
    ]),
    isInDateRange(prevDate) {
      let dateForCompare = new Date(this.dateTime.Format('yyyy-MM-dd HH:00:00')),
          pastDate = new Date(this.realDatetime);

      if (pastDate.toLocaleDateString() === dateForCompare.toLocaleDateString())
        return 'equle';

      dateForCompare.setDate(dateForCompare.getDate() - 3);
      if (!(dateForCompare < pastDate)) {
        this.realDatetime = prevDate;
        this.showInfoTip_global({ text: '实况时间最多只能倒退72小时' });
        return false;
      } else if (pastDate > new Date()) {
        this.realDatetime = prevDate;
        this.showInfoTip_global({ text: '实况时间不能超过最新时间' });
        return false;
      }

      return true;
    },
    async getPoiData() {
      try {
        let fstData = await this.getForecastData();
        let realData = await this.getRealTimeData();
        return { fstData, realData };
      }
      catch(err) {
        throw '获取关注点数据失败';
      }
    },
    async getRealTimeData() {
      let typhPoiData = this.typhPoiData_global;
      let seletctedPoi = typhPoiData.poiData.poi[typhPoiData.poiIndex];
      let lat = seletctedPoi.lat,
          lon = seletctedPoi.lon;

      let starttime, endtime;
      if(this.dateTime > new Date(this.realDatetime)) {
        starttime = new Date(this.realDatetime);
        endtime = this.dateTime;
      } else {
        starttime = this.dateTime;
        endtime = new Date(this.realDatetime);
      }

      try {
        let data = (await this.$http.jsonp(`http://10.148.83.228:9020/data/getNearestStation?&lon=${lon}&lat=${lat}&endTime=${endtime.Format('yyyy-MM-dd HH:00:00')}&startTime=${starttime.Format('yyyy-MM-dd HH:00:00')}&type=${typhPoiData.poiType === '降雨' ? 'rain' : 'wind'}`)).data;
        data = JSON.parse(JSON.parse(data));
        if(!data || !data.id)
          return;
        this.stationName = `${data.id}-${data.name}`;
        let res = await this.$http.get(`http://10.148.83.228:8921/station/real/find_TimeRange?station_id=${data.id}&element=${typhPoiData.poiType === '降雨' ? 'rfhour' : 'wd2df'}&starttime=${starttime.Format('yyyy-MM-dd HH:00:00')}&endtime=${endtime.Format('yyyy-MM-dd HH:00:00')}`);
        return res.data;
      }
      catch(err) {
        throw '获取最近站点实况数据失败';
      }
    },

    async getForecastData() {
      let typhPoiData = this.typhPoiData_global;
      let seletctedPoi = typhPoiData.poiData.poi[typhPoiData.poiIndex];
      let lat = seletctedPoi.lat,
          lon = seletctedPoi.lon;

      const dFmt = `yyyy-MM-dd HH:00:00`;
      let endtime = new Date(this.realDatetime).getTime() + 72*60*60*1000;  //未来72小时
      let starttime = new Date(this.realDatetime).Format(dFmt);
      endtime = new Date(endtime).Format(dFmt);
      let modelTime = toModelTime(starttime, endtime);

      let element, eleHeight;
      if(typhPoiData.poiType === '降雨') {
        element = 'lspe';
        eleHeight = 0;
      } else {
        element = 'wind';
        eleHeight = 1000;
      }

      let meteoMonitor = new MeteoMonitor(this.$http);
      let data = (await meteoMonitor.getModelSingleFst(lon, lat, modelTime.starttime, modelTime.endtime, 'grapes9km', element, eleHeight)).data;
      if(typeof data === 'string' && /DB_ERROR/.test(data))
        return;

      let key = typhPoiData.poiType === '降雨' ? 'lspe' : 'wind_vel';
      let fstData = data[0][key];
      let diff = new Date(starttime).getTime() - (new Date(modelTime.starttime).getTime() + 8*60*60*1000);
      let sIndex = diff/3600000;
      let eIndex = sIndex + 72;

      fstData.shift();
      fstData = fstData.slice(sIndex, eIndex);
      fstData.forEach((value, index, arr) => {
        if(value <= 0 || [999998, 9999, 99999, 999999, -999, -999.9, -9999].includes(Number(value)))
          arr[index] = 0;
        else
          arr[index] = Number(value.toFixed(1));
      });

      return fstData;
    },

    drawChart(data, realData) {
      console.log(realData);
      let typhPoiData = this.typhPoiData_global;
      const poiType = typhPoiData.poiType,
            poiIndex = typhPoiData.poiIndex;
      if (!poiType)
        return;

      let seriesData = [];
      let fstSeriesData = [],
          realSeriesData = [],
          thresholds = typhPoiData.threshold[poiIndex],
          fstData = data || typhPoiData.poiData.grid[poiIndex];

      if(poiType !== '降雨') {
        let thresholdArr = [];
        for(let i = 0; i < 72; i++) {
          thresholdArr.push(Number(thresholds));
        }
        thresholds = thresholdArr;
      }

      seriesData.push({
        name: `${poiType}阈值`,
        type: 'spline',
        data: thresholds,
        color: 'rgba(234, 107, 107, 1)',
        marker: {
          enabled: false
        },
        dashStyle: 'shortdot'
      });

      fstData.forEach((val, index) => {
        fstSeriesData.push({
          y: Number(val.toFixed(1)),
          color: val <= thresholds[index] ? 'rgba(137, 201, 151, 1)' : 'rgba(234, 107, 107, 1)'
        });
      });

      seriesData.push({
        name: `${poiType}预报`,
        type: 'column',
        data: fstSeriesData,
        color: 'rgba(137, 201, 151, 1)'
      });

      if(realData) {
        let key = poiType === '降雨' ? 'rfhour' : 'wd2df';
        realData.forEach((el, index) => {
          let val = Number(el.elements[key]);
          realSeriesData.push({
            y: val <= 0 ? 0 : Number(val.toFixed(1)),
            color: 'rgb(57, 171, 216)'
          });
        });
        seriesData.push({
          name: `${poiType}实况`,
          type: 'column',
          data: realSeriesData,
          color: 'rgb(57, 171, 216)'
        });
      }

      let xAixs = [],
          starttime = new Date(this.realDatetime).getTime();
      for(let i = 0; i < 72; i++) {
        let dt = starttime + i*60*60*1000;
        xAixs.push(new Date(dt).Format('MM-dd HH:00'));
      }

      highChart.chart(document.querySelector('.typh-poi-chart-container'),{
        chart: {
          style: {
            fontFamily: 'Microsoft YaHei'
          }
        },
        title: {
          text: `未来72小时${poiType}(${poiType === '风速' ? 'm/s' : 'mm'})`,
          style: {
            fontSize: "14px"
          }
        },
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: xAixs,
          tickInterval: 10
        },
        yAxis: {
          min: 0,
          title: {
            text: `${poiType}(${poiType === '风速' ? 'm/s' : 'mm'})`
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          `<td style="padding:0"><b>{point.y} ${poiType === '风速' ? 'm/s' : 'mm'}</b></td></tr>`,
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column:{
            borderWidth: 0,
            pointPadding: 0.1
          }
        },
        series: seriesData
      })
    }
  }
}

</script>

<style lang="scss">
#typh-poi-popup {
  width: 700px;
  position: absolute;
  left: 340px;
  top: 50px;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0px 0px 10px -2px #000;
  overflow: hidden !important;
  header {
    cursor: move;
    height: 30px;
    position: relative;
    background-color: #263b5c;
    border-radius: 4px 4px 0 0;
    h1 {
      line-height: 30px;
      color: white;
      font-weight: normal;
      font-size: 12px;
      padding-left: 10px;
      margin: 0;
    }
    >span {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-top-right-radius: 4px;
      &:hover {
        background-color: #1c3252;
      }
      >svg {
        padding: 11px;
      }
    }
  }
}

div.indicator {
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  border-bottom: solid 1px #d7d7d7;
}

div.typh-poi-chart-container {
  width: calc(100% - 20px);
  height: 300px;
  position: relative;
  padding: 10px;
  border-radius: 0 0 4px 4px;
}

.address-datetime-wraper {
  width: calc(100% - 20px);
  position: relative;
  margin: 0px 10px;
  border-bottom: solid 1px #d7d7d7;
  font-size: 12px;
  div.real-datetime {
    float: right;
    line-height: 44px;
  }
  div.address-wraper {
    float: left;
    line-height: 44px;
    padding-left: 10px;
  }
  aside {
    float: right;
    .datetime-wraper {
      border: none;
    }
  }
}
.real-date-time {
  margin: 10px 0px 10px 5px !important;
  input {
    height: 24px !important;
  }
}
</style>
