<template>
  <main id="DisasterAnalysis" class="decision-popup" v-drag>
    <header>
      <span>灾害分析</span>
      <a @click="closeFunc"></a>
    </header>
    <div class="content">
      <div class="time">
        <span class="black">选择时间</span>
        <el-date-picker v-model="date" size="small" :editable="false" format="yyyy-MM-dd HH:mm"
            :clearable="false" type="datetime"></el-date-picker>
      </div>
      <div class="opts cf">
        <div class="text black">灾害天气</div>
        <ul class="dis-opts-wrapper cf decision-chk-group">
          <li v-for="(name, key) in weatherList" :key="key"
              :class="['col3', {on: weatherSelected === key}]" @click="toggleWeatherList(key)">
            <em></em>
            <span>{{ name }}</span>
          </li>
        </ul>
      </div>

      <div class="btn-wrapper cf">
        <div class="primary-btn plain" @click="analyse">一键分析</div>
        <div class="primary-btn" @click="createReport">生成报告</div>
      </div>

      <div v-show="hasAnalysis">
        <div class="time-line-wrapper">
          <div class="time-line-header">
            <span>时间轴</span>
            <span>{{ dateTime }}</span>
          </div>
          <div class="time-line">
            <ul class="cf">
              <li v-for="i in 9" :key="i"></li>
            </ul>
          </div>
          <div class="out-line">
            <div class="in-line" :style="{width: `calc(100% / 9 * ${timeIndex})`}"></div>
            <ul class="out-line-point">
              <li v-for="i in 10" :key="i" @click="toggleTimeLine(i - 1)"
                  :title="getTimeLine(i - 1)"
                  :style="{left: `calc(100% / 9 * ${i - 1})`}"></li>
            </ul>
            <em :style="{left: `calc(100% / 9 * ${timeIndex})`}"></em>
          </div>
        </div>
      
        <div class="black report">分析报告</div>
        <figure v-loading="loading" element-loading-text="正在获取分析数据">
          <div class="result scroll-bar">
            <template v-if="Object.keys(analysisResult)">
              <div class="level-wrapper"
                  v-for="(el, level) in analysisResult" :key="level">
                <div class="header">
                  <em :style="{background: levelTable[level].color}"></em>
                  <span class="black">{{ levelTable[level].roma }}级</span>
                </div>
                <ul class="area">
                  <li v-for="(opt, county) in el" :key="county">
                    {{ county + '： ' + opt.join('，') }}
                  </li>
                </ul>
              </div>
            </template>
            <div v-if="!Object.keys(analysisResult).length"
                class="eff-tip">当前时次无影响区域</div>
          </div>
        </figure>
      </div>

    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop, Model } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  import { disasterClient } from '@/util/ClientHelper'
  import { ModelAssess } from '@/util/modelAssess'

  @Component
  export default class DisasterAnalysis extends Vue {
    @Prop({ default: Function }) closeFunc
    @Getter('decisionStore/region_global') region_global
    @Action('decisionStore/storeColorTable_global') storeColorTable_global

    date: Date = new Date()
    weatherList: any = {
      // typhoon: '台风',
      rain: '暴雨',
      wind: '大风',
      thunder: '雷电',
      waterlog: '城市内涝',
      torrent: '流域洪涝',
      geology: '地质灾害',
    }
    weatherSelected: string = 'rain'

    hasAnalysis: boolean = false
    loading: boolean = false
    analysisTime: Date = new Date()
    analysisResult: any = {}
    levelTable: any = {
      1: { roma: 'Ⅰ', color: '#4bb4f0b3' },
      2: { roma: 'Ⅱ', color: '#37d23cb3' },
      3: { roma: 'Ⅲ', color: '#ffe878b3' },
      4: { roma: 'Ⅳ', color: '#ff6000b3' },
      5: { roma: 'Ⅴ', color: '#ff3200b3' },
      6: { roma: 'Ⅵ', color: '#ff0000b3' },
      7: { roma: 'Ⅶ', color: '#a5000ab3' },
    }
    timeIndex: number = 0
    get dateTime() {
      let date = new Date(this.analysisTime).getTime() + this.timeIndex*10*60*1000
      return moment(date).format('HH:mm')
    }
    ranges = {
      rain: [999, 50, 32, 16, 8],
      wind: [999, 41.4, 37, 32.6, 28.5, 24.5, 20.8, 17.2],
      geology: [100, 90, 70, 45, 20]
    }
    imageLayer?: any

    mounted() {
      this.analyse()
    }

    toggleWeatherList(key) {
      this.weatherSelected = key === this.weatherSelected ? '' : key
    }

    // @Watch('date')
    // onDateChanged (val: Date, oldVal: Date) {
    //   this.hasAnalysis = false      
    // }

    @Watch('weatherSelected')
    onWeatherSelectedChanged (val: string, oldVal: string) {
      this.hasAnalysis = false
      if (oldVal === 'rain' || oldVal === 'wind') {
        this.storeColorTable_global({ type: 'delete', 
          data: {
            type: 'tide_' + oldVal,
            flag: 'tide_' + oldVal
          }
        })
      }
    }

    // 一键分析
    async analyse() {
      if (!this.weatherSelected) {
        this.$message({ type: 'warning', message: '请选择灾害类型' });
        return;
      }
      this.getModelImage();
      if (!this.hasAnalysis) this.hasAnalysis = true
      // let res = await disasterClient.getAnalysisLatest(this.region_global.cityId)     // 获取最新灾害分析数据
      let datetime = moment(this.date).format('YYYY-MM-DD HH:mm:00')
      this.timeIndex = 0
      this.analysisTime = this.date
      this.getAnalysisResult(datetime)
    }

    // 获取分析结果
    async getAnalysisResult(datetime: string) {
      this.loading = true
      let param = {
        datetime,
        // datetime: '2018-02-27 16:12:00',
        cityid: this.region_global.cityId,
        type: [this.weatherSelected]
      }
      let res: any = await disasterClient.getAnaylsisBySelectDate(param)
      this.loading = false
      if (!res) {
        this.analysisResult = []
        return
      }

      let dist = {}
      for (let el of res[this.weatherSelected]) {
        if (!dist[el.level]) dist[el.level] = {}
        if (!dist[el.level][el.countyname]) dist[el.level][el.countyname] = []
        dist[el.level][el.countyname].push(el.townname)
      }
      this.analysisResult = dist
    }

    // 获取模型图片
    async getModelImage() {
      this.clearImageLayer()
      let model = this.weatherSelected
      if (model === 'rain' || model === 'wind') {
        let seledVar = model === 'wind' ? 'tide_wind' : 'tide_rain'
        this.storeColorTable_global({ type: 'add', 
          data: {
            type: seledVar,
            flag: seledVar,
            label: seledVar === 'tide_wind' ? '大风分析' : '暴雨分析'
          }
        })
        // if (model === 'rain') {
          let datetime: number | string = new Date(this.date).getTime()
          datetime -= datetime%360000
          datetime = moment(new Date(datetime)).format('YYYYMMDDHHmm00')
        // }
        this.initRainAndWindModel({ model, datetime })
      }
      else if (model === 'thunder') {
        let datetime: number | string = new Date(this.date).getTime()
        datetime -= datetime%360000
        datetime = moment(new Date(datetime)).format('YYYY-MM-DD HH:mm:00')
        this.addTitanImage(datetime);
      }
    }

    //初始化大风、暴雨模型数据
    async initRainAndWindModel({ model, datetime }) {
      let data: any = {
        gridNcInfo: null,
        ncInfo: null,
        imgLayerData: null
      }

      let modelAssess = new ModelAssess(this.region_global)
      let modelName, fileName, seledVar, seledTime
      if(model === 'rain') {
        modelName = 'grid_nc'
        fileName = `grid${datetime}.nc`
        seledVar = 'data'
        seledTime = 6
        try {
          let ncInfo = await modelAssess.getNcInfo(modelName, fileName)
          data.gridNcInfo = ncInfo
        }
        catch(err) {
          let dt: string | number = `${datetime.substring(0, 4)}/${datetime.substring(4,6)}/${datetime.substring(6, 8)} `
            + `${datetime.substring(8, 10)}:${datetime.substring(10, 12)}`
          dt = new Date(dt).getTime() -  12*60000
          fileName = `grid${moment(new Date(dt)).format('YYYYMMDDHHmm00')}.nc`
        }
      } else {
        modelName = 'meteohist_nc'
        fileName = `meteohist${datetime}.nc`
        seledVar = 'maxwind'
        seledTime = 1
      }

      let bounds = {
        left: 115.06118774414064,
        right: 117.16918945312501,
        top: 23.87453613830371,
        bottom: 22.74072309119474,
        width: 1000,
        height: 1000
      }
      try {
        if(!data.gridNcInfo) {
          data.gridNcInfo = await modelAssess.getNcInfo(modelName, fileName);
          if(this.weatherSelected !== model)
            return false;
        }
        data.ncInfo = await modelAssess.getNcInfo('meteocast_nc', `meteocast${datetime.substring(0, 10)}0000.nc`);
        if(this.weatherSelected !== model)
          return false;
        //gird_nc的时次为[过去24小时, 过去12小时, 过去6小时, 过去3小时, 过去2小时, 过去1小时, 当前, 未来30分钟, 未来1小时, 未来2小时, 未来3小时],
        //所以seledTime: 6等于当前时次的数据
        data.imgLayerData = await modelAssess.getModelImage(data.gridNcInfo, { seledVar, seledTime, bounds, contourLabel: model === 'rain' });
        if(this.weatherSelected !== model)
          return;
      }
      catch (err) {}
      this.addImageLayer(data.imgLayerData)

      // range: this.ranges[this.weatherSelected]
    }

    async addTitanImage(datetime: string): Promise<void> {
      let modelAssess = new ModelAssess();
      let imgData = await modelAssess.getEnTitanImage(datetime);
      if (this.weatherSelected !== 'thunder')
        return;
      if (!imgData) {
        this.clearImageLayer();
      }
      else {
        this.addImageLayer(imgData);
      } 
    }

    addImageLayer(el) {
      this.clearImageLayer()
      if (!el) {
        return;
      }
      let url = el.imgSrc;
      let img = new Image();
      img.onload = () => {
        this.imageLayer = window['L'].imageOverlay(url, [[el.top, el.left], [el.bottom, el.right]])
          .addTo(window['zmap']);
      }
      img.src = url;
    }

    clearImageLayer() {
      if (!this.imageLayer) return
      window['zmap'].removeLayer(this.imageLayer)
      this.imageLayer = null
    }

    // 生成报告
    async createReport() {
      if (!this.weatherSelected) {
        Vue['prototype']['$message']({ type: 'warning', message: '请选择灾害类型' })
        return
      }

      let time = new Date(this.analysisTime).getTime() + this.timeIndex*10*60*1000
      let datetime = moment(new Date(time)).format('YYYY-MM-DD HH:mm:00')
      let param = {
        datetime,
        cityid: this.region_global.cityId,
        type: [this.weatherSelected],
        fileModel: {
          place: '',      // 所属气象局
          name: '',       // 签署人姓名
          tel: '',        // 电话号码
          createtime: ''  //创建时间
        }
      }
      let res: false | string = await disasterClient.downAnalysisFile(param)
      if (!res) Vue['prototype']['$message']({ type: 'warning', message: '无内容' })
      else window.open(res)
    }

    getTimeLine(i) {
      let time = new Date(this.analysisTime).getTime() + i*10*60*1000
      return moment(new Date(time)).format('HH:mm')
    }

    toggleTimeLine(i) {
      this.timeIndex = i
      let time = new Date(this.analysisTime).getTime() + i*10*60*1000
      let datetime = moment(new Date(time)).format('YYYY-MM-DD HH:mm:00')
      this.getAnalysisResult(datetime)
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#DisasterAnalysis {
  position: absolute;
  top: 0;
  left: 60px;
  width: 380px;
  color: #575757;
  .black {
    margin-right: 10px;
    color: #1c1c1c;
    font-weight: bold;
  }
  .content {
    padding: 10px 20px 20px;
    .time {
      height: 26px;
      line-height: 26px;
    }
    .opts {
      position: relative;
      margin-top: 5px;
      .text {
        float: left;
        margin-top: 5px;
      }
      .dis-opts-wrapper {
        float: left;
        width: 260px;
      }
    }
    .btn-wrapper {
      margin: 10px 0 2px;
      .primary-btn {
        float: left;
        border: 1px solid $themeColor;
        &.plain {
          margin: 0 20px 0 80px;
        }
      }
    }

    .time-line-wrapper {
      .time-line-header {
        line-height: 30px;
        span {
          color: #1c1c1c;
          font-weight: bold;
          &:nth-child(2) {
            float: right;
          }
        }
      }
      .time-line {
        >ul {
          height: 5px;
          >li {
            float: left;
            width: calc(100% / 9);
            height: 100%;
            box-sizing: border-box;
            border-left: 1px solid #999; /*no*/
            cursor: pointer;
            &:last-child {
              border-right: 1px solid #999; /*no*/
            }
          }
        }
      }
      .out-line {
        margin-bottom: 5px;
        position: relative;
        height: 8px;
        background: rgb(205, 207, 215);
        .in-line {
          width: 0;
          height: 100%;
          background: $themeColor;
        }
        ul.out-line-point {
          li {
            position: absolute;
            top: 0;
            left: 0;
            width: 10px;
            height: 13px;
            transform: translate(-50%, -5px);
            cursor: pointer;
          }
        }
        >em {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%, -3px);
          display: inline-block;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: $themeColor;
          cursor: pointer;
        }
      }
    }

    .report {
      line-height: 30px;
    }
    .result {
      padding: 15px;
      height: 230px;
      overflow-y: auto;
      overflow-x: hidden;
      border: 1px solid #d2d4db;
      .level-wrapper {
        margin-top: 5px;
        &:first-child { margin-top: 0; }
        .header {
          em {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            border: 1px solid #999;
            background: yellow;
          }
          span {

          }
        }
        .area {
          li {

          }
        }
      }
      .eff-tip {
        text-align: center;
      }
    }
  }
}

</style>


<style lang='scss'>
#DisasterAnalysis {
  .el-date-editor.el-input {
    width: 180px;
    .el-input__inner {
      padding: 0;
      text-align: center;
    }
  }
  .el-input__prefix, .el-input__suffix {
    display: none;
  }
  .el-input--small .el-input__inner {
    height: 24px;
  }
  .el-input--small .el-input__icon {
    line-height: 24px;
  }
  figure {
    margin: 0;
    .el-loading-spinner {
      top: 40%;
    }
  }
}
</style>