<template>
  <main id="model-panel">
    <section class="model-selection-wraper cf">
      <ul>
        <li v-for="(el, key) in modelMenu"
            @click="toggleModelMenu(key)">
          <div :class="['model-icon-ctner', 'model-icon-'+el.class]"></div>
          <span :class="['model-text', {'model-selected-text': el.selected}]"
                v-text="el.text"></span>
          <em></em>
        </li>
      </ul>
    </section>
    <components :is="ctrlPanel"></components>
    <el-button v-if="isShowGenerateBtn"
               :loading="isGenerating"
               class="generate-report"
               style="margin: 10px 10px 10px 0px;"
               @click="generateReport">
      {{ isGenerating ? '生成中' : '生成报告' }}
    </el-button>
  </main>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import geologyCtrl from '../model/geology'
  import typhControl from '../model/typhControl'
  import torrentCtrl from '../model/torrentCtrl'
  import waterlogCtrl from '../model/waterlogCtrl'
  import thunderCtrl from '../model/thunderCtrl'
  import { Helper } from '../../util/Helper'
  import { ModelAssess } from '../../util/modelAssess'
  import TyphoonCordon from '../../util/TyphoonCordon'

  let typhLines = {};
  export default {
    data() {
      return {
        ctrlPanel: null,
        timer: null,
        isGenerating: false,
        rainRanges: [999, 50, 32, 16, 8],
        windRanges: [999, 41.4, 37, 32.6, 28.5, 24.5, 20.8, 17.2],
        geolRanges: [100, 90, 70, 45, 20]
      }
    },
    computed: {
      ...mapGetters([
        'modelMenu',
        'selectedModel',
        'currentRegion',
        'modelNcInfo',
        'gridNcInfo',
        'dateForModel',
        'regionBounds',
        'modelTime',
        'seledTime',
        'dateTime',
        'modelPoiList',
        'modelRanges',
        'hasEffectedTowns',
        'reservoirData',
        'poiFstData'
      ]),
      isShowGenerateBtn() {
        return this.selectedModel && !['tide', 'fire', 'airpollution'].includes(this.selectedModel);
      }
    },
    components: {
      geologyCtrl,
      typhControl,
      torrentCtrl,
      waterlogCtrl,
      thunderCtrl
    },
    mounted() {
    },
    methods: {
      ...mapActions([
        'storeModelData',
        'clearModelSites',
        'initDisasterSites',
        'toggleModelMenu',
        'updateModelSites',
        'initDisasterModel',
        'updateModelSiteFstData',
        'updateDisasterSites',
        'clearModelData',
        'addRiverDirectionArrow',
        'updateDisasterModel',
        'initRoadNameLabels',
        'initGeologySites',
        'getReservoirStatRain',
        'storeColorTable_global',
        'showInfoTip_global',
        'addRainOrWindPoi',
        'initRainAndWindModel',
        'updateRainAndWindPoi',
        'initThunderModel',
        'initGeolModel'
      ]),
      thunderModelAnalysis() {
        let params = {
          $http: this.$http,
          regionObj: this.currentRegion,
          bounds: this.regionBounds
        };
        let datetime = this.dateTime;
        let minute = datetime.getMinutes();
        minute -= minute%6;
        minute = minute < 10 ? '0' + minute : minute;
        params.datetime = `${datetime.Format('yyyy-MM-dd HH')}:${minute}:00`;
        this.initThunderModel(params);
      },
      generateReport() {
        if(this.isGenerating)
          return;
        const seledModel = this.selectedModel;
        let url,
            dateTime = this.modelTime || this.dateTime,
            params = { cityId: this.currentRegion.cityId };
        if(this.currentRegion.countyId)
          params.countyId = this.currentRegion.countyId;

        this.isGenerating = true;

        /*if(seledModel === 'geology') {
          Object.assign(params, {
            timeStamp: this.dateForModel,
            year: dateTime.getFullYear(),
            issue: dateTime.Format('yyyyMMddHH'),
            name: '郑伟杰'
          });
          url = `http://10.148.83.228:1995/JmDcs/word/create`;
        }
        else {

        }*/
        if(seledModel === 'thunder' || seledModel === 'rain') {
          if(this.modelTime) {
            dateTime = dateTime.Format('yyyy-MM-dd HH:mm:00');
          } else {
            if(this.gridNcInfo) {
              dateTime = new Date(this.gridNcInfo.start).Format('yyyy-MM-dd HH:mm:00');
            } else {
              let minute = dateTime.getMinutes();
              minute -= minute%6;
              minute = minute < 10 ? '0' + minute : minute;
              dateTime = `${dateTime.Format('yyyy-MM-dd HH')}:${minute}:00`;
            }
          }
        }
        else {
          dateTime = dateTime.Format('yyyy-MM-dd HH:00:00');
        }
        const prefixs = {
          rain: 'downMeteocast',
          wind: 'downWind',
          thunder: 'downEnTitan',
          torrent: 'downFlood',
          geology: 'downGeology',
          waterlogging: 'downWaterlog'
        };
        url = `http://10.148.83.228:9020/data/${prefixs[seledModel]}`;
        params.date = dateTime;
        params.flag = 0;

        this.$http.jsonp(url, { params })
          .then(response => {
            let data = response.data;
            if(data === true || data === 'true') {
              url = response.url.replace('flag=0', 'flag=1');
              this.downloadReport(url);
              this.showInfoTip_global({ text: '生成报告成功', type: 'success' });
            } else {
              this.showInfoTip_global({ text: '生成报告失败', type: 'error' });
            }
            this.isGenerating = false;
          }).catch(err => {
            this.isGenerating = false;
            this.showInfoTip_global({ text: '生成报告失败', type: 'error' });
          });
      },
      downloadReport(url) {
        let aLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        aLink.href = url;
        //自动触发点击事件
        let ev = document.createEvent('MouseEvents');
        ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        aLink.dispatchEvent(ev);
      },
      drawTyphoonCordon() {
        let typhCordon = new TyphoonCordon();
        let lines = typhCordon.getLines();
        console.log(lines);
        let helper = new Helper(viewer);
        this.removeTyphoonCordon();
        typhLines.red = helper.addDashline(lines.red, 1, 'red');
        typhLines.yellow = helper.addDashline(lines.yellow, 1, 'yellow');
        helper = null;
        typhCordon = null;
      },
      removeTyphoonCordon() {
        let helper = new Helper(viewer);
        if(typhLines.red)
          helper.removeEntity(typhLines.red);
        if(typhLines.yellow)
          helper.removeEntity(typhLines.yellow);
        helper = null;
      }
    },
    watch: {
      selectedModel(nv, ov) {
        this.clearModelSites();
        this.clearModelData();

        if(ov !== 'tide' || ov !== 'thunder') {
          let colorValue = ov === 'wind' || ov === 'rain' ? `tide_${ov}` : ov;
          this.storeColorTable_global({ type: 'delete', data: { type: colorValue, flag: colorValue } });
        }
        if(ov === 'tide')
          this.removeTyphoonCordon();

        const params = {
            $http: this.$http,
            regionObj: this.currentRegion,
            datetime: this.dateForModel,
            model: nv
        };

        if(nv === 'geology') {
          this.ctrlPanel = null;
          this.storeModelData({ attr: 'analysisType', value: 'geology' });
          this.storeModelData({ attr: 'ranges', value: this.geolRanges });
          this.initGeolModel(Object.assign({ ranges: this.geolRanges, bounds: this.regionBounds }, params));
          this.initGeologySites(params);
          this.storeColorTable_global({type: 'add', data:{type: 'geology', flag: 'geology', label: '发生概率'}});
        }
        else if(nv === 'tide') {
          this.ctrlPanel = typhControl;
          this.drawTyphoonCordon();
        }
        else if(nv === 'waterlogging' || nv === 'torrent') {
          this.storeColorTable_global({
            type: 'add',
            data: {
              type: nv,
              flag: nv,
              label: nv === 'torrent' ? '山洪面雨量' : '道路积水'
            }
          });
          this.initDisasterSites(params);
          this.initDisasterModel(Object.assign({ bounds: this.regionBounds },params));

          if(nv === 'torrent') {
            this.ctrlPanel = torrentCtrl;
            this.addRiverDirectionArrow(params);
            this.getReservoirStatRain(params);
          } else {
            //this.initRoadNameLabels();
            this.ctrlPanel = waterlogCtrl;
          }
        }
        else if(nv === 'thunder') {
          this.ctrlPanel = null;
          this.storeModelData({ attr: 'analysisType', value: 'thunder' });
          this.thunderModelAnalysis();
        }
        else if(nv === 'rain' || nv === 'wind') {
          this.ctrlPanel = null;
          let seledVar = nv === 'wind' ? 'tide_wind' : 'tide_rain';
          this.storeModelData({ attr: 'analysisType', value: seledVar });
          this.storeModelData({ attr: 'ranges', value: nv === 'wind' ? this.windRanges : this.rainRanges });
          this.storeColorTable_global({
            type: 'add',
            data: {
              type: seledVar,
              flag: seledVar,
              label: seledVar === 'tide_wind' ? '大风分析' : '暴雨分析'
            }
          });
          if(nv === 'rain') {
            let datetime = this.dateTime.getTime();
            datetime -= datetime%360000;
            params.datetime = new Date(datetime).Format('yyyyMMddHHmm00');
          }
          console.log(Object.assign({ ranges: this.modelRanges, bounds: this.regionBounds }, params))
          this.addRainOrWindPoi(Object.assign({}, params, {datetime: this.dateTime}));
          this.initRainAndWindModel(Object.assign({ ranges: this.modelRanges, bounds: this.regionBounds }, params));
        }
        else {
          this.ctrlPanel = null;
          this.storeColorTable_global({
            type: 'add',
            data: {
              type: nv,
              flag: nv,
              label: nv === 'fire' ? '火情模拟' : '污染模拟'
            }
          });
        }
      },
      modelNcInfo(ncInfo) {
        let model = this.selectedModel;
        const $http = this.$http,
              regionObj = this.currentRegion;
        if(model === 'waterlogging' || model === 'torrent') {
          this.updateDisasterSites({ $http, regionObj, datetime: this.dateTime, model });
        } else if(model === 'geology') {
          this.updateModelSiteFstData({ $http, regionObj, ncInfo, model });
        }
      },
      dateForModel(dt) {
        if(!['torrent', 'waterlogging', 'geology', 'wind'].includes(this.selectedModel))
            return;
        if(this.timer)
          clearTimeout(this.timer);

        this.timer = setTimeout(() => {
          const params = {
            $http: this.$http,
            regionObj: this.currentRegion,
            datetime: this.dateForModel
          };
          const seledModel = this.selectedModel;
          if(seledModel === 'torrent' || seledModel === 'waterlogging') {
            this.updateDisasterModel(Object.assign({
              model: seledModel,
              bounds: this.regionBounds,
              seledTime: this.seledTime
            }, params));
            this.getReservoirStatRain(params);
          }
          else if(seledModel === 'geology') {
            this.initGeolModel(Object.assign({ ranges: this.modelRanges, model: seledModel, bounds: this.regionBounds }, params));
          }
          else {
            this.updateRainAndWindPoi(Object.assign({type: seledModel, data: this.modelPoiList}, params));
            this.initRainAndWindModel(Object.assign({model: seledModel, ranges: this.modelRanges, bounds: this.regionBounds,}, params));
          }

          this.timer = null;
        }, 500);
      },
      dateTime() {
        if(!['thunder', 'rain'].includes(this.selectedModel))
          return;
        if(this.timer)
          clearTimeout(this.timer);

        this.timer = setTimeout(() => {
          if(this.selectedModel === 'thunder')
            this.thunderModelAnalysis();
          else {
            let datetime = this.dateTime.getTime();
            datetime -= datetime%360000;
            const params = {
              $http: this.$http,
              regionObj: this.currentRegion,
              datetime: new Date(datetime).Format('yyyyMMddHHmm00')
            };
            this.updateRainAndWindPoi(Object.assign({type: this.selectedModel, data: this.modelPoiList}, params));
            this.initRainAndWindModel(Object.assign({model: this.selectedModel, ranges: this.modelRanges, bounds: this.regionBounds,}, params));
          }
          this.timer = null;
        }, 500);
      }
  }
}
</script>
<style lang="scss" scoped>
.model-ctrl {
  width: 100%;
  position: relative;
  padding: 5px 0px;
}

.tri-option {
  fill: #545454;
}

.model-icon-ctner {
  width: 40px;
  height: 40px;
  float: left;
  /*background: url('../../assets/mainMenu/modelIcon.png') no-repeat;*/
  background: url('/static/img/modelIcon2.png') no-repeat;
}

.model-selection-wraper {
  width: 100%;
  box-sizing: border-box;
  border-bottom: solid 1px #d7d7d7;
  padding: 0 0 5px 0;
  li {
    float: left;
    width: calc(100%/2 - 5px);
    height: 40px;
    line-height: 40px;
    padding-left: 5px;
    cursor: pointer;
    &:hover {
      span {
        color: #299dff;
      }
    }
    span {
      font-size: 12px;
      color: #545454;
      display: inline-block;
    }
  }

  .model-selected-text {
    color: #299dff !important;
    font-weight: bold;
    &:after{
      visibility: visible;
    }
  }
}
.model-selection-wraper ul li:nth-of-type(odd) em{
  float: right;
  height: 20px;
  width: 1px;
  background-color: #f0f0f0;
  margin-top: 10px;
}
.model-selection-wraper ul li:last-of-type em {
  width: 0;
}

div.model-icon-rain {
  background-position: -0px -160px;
}
div.model-icon-wind {
  background-position: -40px -120px;
}
div.model-icon-thunder {
  background-position: 0px -120px;
}
div.model-icon-torrent {
  background-position: -40px 0px;
}
div.model-icon-waterlogging {
  background-position: 0px -40px;
}
div.model-icon-geology {
  background-position: -40px -40px;
}
div.model-icon-fire {
  background-position: 0px -80px;
}
div.model-icon-airpollution {
  background-position: -40px -80px;
}
.model-selection-wraper ul li span:after{
  content: '';
  display: inline-block;
  width: 0;
  height: 0;
  border-width: 6px 6px 6px 0;
  border-style: solid;
  border-color: transparent #2A9CFD transparent transparent;/*透明 透明 透明 灰*/
  margin-left: 10px;
  margin-bottom: 2px;
  vertical-align: middle;
  visibility: hidden;
}
</style>
<style lang="scss">
  .generate-report {
    padding: 9px 16px !important;
    margin: 10px 10px 10px 0px;
    color: #299dff !important;
    border-color: #299dff !important;
    font-size: 12px !important;
    float: right;
    &:hover {
      background-color: #299dff !important;
      color: white !important;
    }
  }
</style>
