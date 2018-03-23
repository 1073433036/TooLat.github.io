<template>
  <main id="station-warning">
    <section class="station-warning-options">
      <ul>
        <li v-for="(item, key) in warningEles" @click.stop="toggleWarningElement(key)">
          <em :class="{'ele-selected': item.selected}"></em>
          <span>
            {{ item.text }}
            <!--<a v-if="key === 'rain' && hasWarningTimes > 0">{{ '(' + hasWarningTimes + ')' }}</a>-->
          </span>
        </li>
      </ul>
    </section>
    <!--<section class="station-sub-options" v-show="selectedWarningEle.type === 'rain'">-->
      <!--<ul>-->
        <!--<li @click.stop="toggleStationType('meteo')">-->
          <!--<em :class="{'ele-selected': selectedSource === 'meteo'}"></em>-->
          <!--<span>气象站</span>-->
        <!--</li>-->
        <!--<li @click.stop="toggleStationType('meteoWater')">-->
          <!--<em :class="{'ele-selected': selectedSource !== 'meteo'}"></em>-->
          <!--<span>气象+水文站</span>-->
        <!--</li>-->
      <!--</ul>-->
    <!--</section>-->
    <section class="station-warning-timeline" v-if="timeLineShow">
      <ul>
        <li v-for="(item, index) in warningTimes" @click.stop="selectTime(index)">
          <em :style="{'backgroundColor': item.selected ? '#299dff' : (item.isWarning ? '#eb6671' : '#dae3ef') }"></em>
          <span v-text="item.text + 'h'" :style="{'color': item.selected ? '#299dff' : (item.isWarning ? '#eb4e4e' : '#dae3ef') }"></span>
        </li>
      </ul>
      <span class="slide-triangle" v-if="slideShow" :style="{'left': slidePos}"></span>
    </section>
    <el-button class="warning-analyse clear-result" @click.stop="clearResult">清除结果</el-button>
    <el-button :loading="isGenerating"
               class="generate-report"
               style="margin-right:10px;"
               @click.stop="generateReport">
      {{ isGenerating ? '生成中' : '生成报告' }}
    </el-button>
  </main>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      slidePos: '0px',
      prevColorTable: null,
      timer: null,
      eleChangeTimer: null,
      isGenerating: false,
      selectedSource: 'meteo'
    }
  },
  mounted() {
    this.warningTimes.forEach((el, index) => {
      if(el.selected) {
        this.slidePos = index ? `${index * 37 + 14}px` : '14px';
        return;
      }
    });

    this.updateWarningData();
  },
  destroyed() {
    this.clearResult();
  },
  computed: {
    ...mapGetters([
      'dateTime',
      'regionBounds',
      'currentRegion',
      'warningEles',
      'warningTimes',
      'hasWarningTimes',
      'isWarningAnalysis'
    ]),
    timeLineShow() {
      let bool = false;
      for(let i in this.warningEles) {
        if(this.warningEles[i].selected) {
          bool = true;
          break;
        }
      }
      return bool;
    },
    slideShow() {
      let bool = false;
      for(let t of this.warningTimes) {
        if(t.selected) {
          bool = true;
          break;
        }
      }
      return bool;
    },
    selectedWarningEle() {
      let selectedEle = {};
      for(let i in this.warningEles) {
        if(this.warningEles[i].selected)
          selectedEle.type = this.warningEles[i].key;
      }
      for(let tm of this.warningTimes) {
        if(tm.selected)
          selectedEle.hour = parseInt(tm.text);
      }
      return selectedEle;
    }
  },
  methods: {
    ...mapActions([
      'toggleWarningElement',
      'toggleWarningTime',
      'updateWarningStatus',
      'addWarningImage',
      'toggleAnalysisStatus',
      'toggleWarningStatTable',
      'clearWarningResult',
      'storeColorTable_global',
      'showInfoTip_global'
    ]),
    toggleStationType(type) {
      if(this.selectedSource === type)
        return;
      this.selectedSource = type;
    },
    selectTime(index) {
      this.toggleWarningTime(index);
      this.slidePos = index ? `${index * 37 + 14}px` : '14px';
    },
    clearResult() {
      if(this.prevColorTable) {
        this.storeColorTable_global({type: 'delete', data:{type: this.prevColorTable}});
        this.prevColorTable = null;
      }
      this.clearWarningResult();
    },
    warningAnalyse() {
      if(this.isWarningAnalysis)
        return;

      let selectedEle = null;
      for(let i in this.warningEles) {
        if(this.warningEles[i].selected)
          selectedEle = this.warningEles[i].key;
      }
      const selectedTimeIndex = this.warningTimes.findIndex(el => el.selected);
      if(selectedTimeIndex === -1) {
        this.showInfoTip_global({ text: '请选择分析时次' });
        return;
      }
      let selectedTime = this.warningTimes[selectedTimeIndex].text;
      selectedTime = Number(selectedTime.replace('h', ''));
      if(selectedEle === 'rain') {
        if(this.selectedSource === 'meteo') {
          selectedEle = this.warningEles.rain.times[selectedTimeIndex];
        } else {
          selectedEle = this.selectedSource;
          selectedTime = selectedTimeIndex > 0 ? (selectedTimeIndex + 1) : selectedTimeIndex;
        }
      } else {
        selectedEle = this.warningEles.windMax.times[selectedTimeIndex];
      }

      if(!selectedEle || selectedEle === 'rain')
        return;

      this.toggleAnalysisStatus(true);
      this.toggleWarningStatTable(selectedEle !== 'wind');

      if(selectedEle.includes('WM')) {
        if(this.prevColorTable !== 'tide_wind') {
          this.prevColorTable === 'tide_rain' && this.storeColorTable_global({type: 'delete', data:{type: 'tide_rain'}});
          this.storeColorTable_global({type: 'add', data:{type: 'tide_wind', flag: 'tide_wind', label: '大风分析'}});
          this.prevColorTable = 'tide_wind';
        }
      } else {
        if(this.prevColorTable !== 'tide_rain') {
          this.prevColorTable === 'tide_wind' && this.storeColorTable_global({type: 'delete', data:{type: 'tide_wind'}});
          this.storeColorTable_global({type: 'add', data:{type: 'tide_rain', flag: 'tide_rain', label: '暴雨分析'}});
          this.prevColorTable = 'tide_rain';
        }
      }

      this.addWarningImage({
        $http: this.$http,
        regionObj: this.currentRegion,
        datetime: this.dateTime,
        type: selectedEle,
        bounds: this.regionBounds,
        seledTime: selectedTime
      }).then(data => {
        this.toggleAnalysisStatus(false);
      }).catch(err => {
        this.toggleAnalysisStatus(false);
      });
    },
    generateReport() {
      let selectedEle = this.selectedWarningEle;
      if(this.isGenerating || !Object.keys(selectedEle).length || !selectedEle.hour || selectedEle.hour < 6)
        return;
      this.isGenerating = true;

      const url = `http://10.148.83.228:9020/data/${selectedEle.type === 'rain' ? 'downWeatherRain' : 'downWeatherWind'}?`
        + `cityId=${this.currentRegion.cityId}&hour=${selectedEle.hour}&date=${this.dateTime.Format('yyyy-MM-dd HH:mm:00')}`;

      this.$http.jsonp(url + '&flag=0')
        .then(response => {
          if(response.data) {
            let aLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
            aLink.href = url + '&flag=1';
            //自动触发点击事件
            let ev = document.createEvent('MouseEvents');
            ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            aLink.dispatchEvent(ev);
            this.isGenerating = false;
            this.showInfoTip_global({ type: 'success', text: '生成报告成功' });
          } else {
            this.isGenerating = false;
            this.showInfoTip_global({ type: 'error', text: '生成报告失败' });
          }
        }).catch(err => {
          this.isGenerating = false;
          this.showInfoTip_global({ type: 'error', text: '生成报告失败' });
        });
    },
    updateWarningData() {
      let datetime = this.dateTime.Format('yyyyMMddHHmm00');
      let flag;
      this.updateWarningStatus({
        $http: this.$http,
        regionObj: this.currentRegion,
        datetime
      }).then(data => {
        if(datetime !== this.dateTime.Format('yyyyMMddHHmm00') || !Object.keys(this.selectedWarningEle).length)
          return;
        flag = true;
        this.warningAnalyse();
      }).catch(err => {
        if(!flag)
          this.clearWarningResult();
      });
    },
    startTimer() {
      if(this.eleChangeTimer)
        clearTimeout(this.eleChangeTimer);
      this.eleChangeTimer = setTimeout(() => {
        this.warningAnalyse();
        this.eleChangeTimer = null;
      }, 500);
    }
  },
  watch: {
    /*selectedSource() {
      this.startTimer();
    },*/
    dateTime(dt) {
      if(this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.updateWarningData();
        this.timer = null;
      }, 500);
    },
    warningTimes: {
      handler() {
        this.startTimer();
      },
      deep: true
    },
    warningEles: {
      handler() {
        this.startTimer();
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
#station-warning {
  width: 100%;
  position: relative;
  .station-warning-options {
    position: relative;
    margin: 20px 10px;
    ul {
      width: 100%;
      display: inline-block;
      font-size: 0;
      li {
        width: calc(100% / 2);
        height: 20px;
        display: inline-block;
        line-height: 20px;
        font-size: 12px;
        color: #545454;
        cursor: pointer;
        &:hover {
          color: #299dff;
        }
        em {
          width: 12px;
          height: 12px;
          position: relative;
          display: inline-block;
          vertical-align: top;
          margin: 4px 2px 4px 0px;
          background: url(../../assets/mainMenu/modelIcon.png) -116px -75px no-repeat;
        }
        span {
          height: 100%;
          position: relative;
          display: inline-block;
          a {
            color: #eb6671;
            text-decoration: none;
          }
        }
      }
    }
  }

  .station-sub-options {
    width: 50%;
    position: relative;
    top: -14px;
    margin-left: 15px;
    &:before {
      content: '';
      width: 1px;
      height: 40px;
      position: absolute;
      top: -10px;
      background-color: rgb(187, 202, 223);
    }
    ul {
      width: 100%;
      position: relative;
      li {
        height: 20px;
        position: relative;
        display: inline-block;
        padding-left: 10px;
        line-height: 20px;
        cursor: pointer;
        &:hover {
          color: #299dff;
        }
        &:before {
          content: '';
          width: 10px;
          height: 1px;
          position: absolute;
          top: 10px;
          left: 0px;
          background-color: rgb(187, 202, 223);
        }
        em {
          width: 12px;
          height: 12px;
          position: relative;
          display: inline-block;
          vertical-align: top;
          margin: 4px 2px 4px 0px;
          background: url(../../assets/mainMenu/modelIcon.png) -116px -75px no-repeat;
        }
        span {
          height: 100%;
          position: relative;
          display: inline-block;
        }
      }
    }
  }

  .station-warning-timeline {
    position: relative;
    margin: 0px 10px;
    padding-top: 5px;
    padding-bottom: 40px;
    font-size: 0;
    ul {
      width: 100%;
      height: 7px;
      display: inline-block;
      font-size: 0;
      background-color: #edf1f7;
      border-radius: 8px;
      li {
        height: 100%;
        position: relative;
        display: inline-block;
        vertical-align: top;
        margin: 0px 17px;
        text-align: center;
        cursor: pointer;
        &:hover {
          color: #299dff!important;
        }
        em {
          width: 3px;
          height: 3px;
          position: relative;
          display: inline-block;
          margin: 2px 0px;
          border-radius: 4px;
        }
        span {
          width: 100%;
          position: absolute;
          display: inline-block;
          top: 10px;
          left: -10px;
          font-size: 12px;
        }
        &:nth-of-type(2),
        &:nth-of-type(3) {
          span {
            left: -6px;
          }
        }
      }
    }
    .slide-triangle {
      width: 0;
      height: 0;
      position: absolute;
      top: 0px;
      border-width: 4px 4px 0;
      border-style: solid;
      border-color: #299dff transparent transparent;
      transition: left .2s ease-out;
    }
  }

  .warning-analyse {
    padding: 9px 16px;
    margin: 0px 10px 10px 0px;
    color: #299dff;
    border-color: #299dff;
    font-size: 12px;
    float: right;
    &:hover {
      background-color: #299dff;
      color: white;
    }
  }

  .clear-result {
    color: #8492A6;
    border-color: #8492A6;
    &:hover {
      background-color: #8492A6;
      color: white;
      border-color: #8492A6;
    }
  }
}
em.ele-selected {
  background-position: -98px -75px!important;
}
</style>
