<template>
  <div id="pollutionSimulate" v-drag="{handle: '.draggable'}">
    <header class="draggable">
      <h1>污染模拟</h1>
      <span @click="toggleModelMenu('airpollution')">
        <svg width="8px" height="8px">
          <line x1="0" x2="8" y1="0" y2="8" />
          <line x2="0" x1="8" y1="0" y2="8" />
        </svg>
      </span>
    </header>
    <sml-progress :progressingStep="progressingStep" :failedStep="failedStep" />
    <main class="sml-option">
      <section class="adding-poi-wraper cf">
        <span></span>
        <a @click="addingPollutionPoint" v-text="address"></a>
      </section>
      <section class="option-wraper">
        <ul class="cf">
          <li><a class="option-exp">污染源</a>
            <select name=""
                    id="pollutionSource"
                    :class="{'error-box': !isPollutionSourceComplete}"
                    v-model="pollutionSourceSelected"
                    @click="clearErrorBox('isPollutionSourceComplete')">
              <option value="null">请选择</option>
              <option :value="key"
                      v-for="(el, key) in pollutionSource"
                      v-if="el.text != ''">{{el.text}}</option>
            </select>
          </li>
          <li>
            <a class="option-exp">污染物</a>
            <select name=""
                    id="pollutant"
                    v-model="pollutantSelected"
                    :class="{'error-box': !isPollutantComplete}"
                    @click="clearErrorBox('isPollutantComplete')">
              <option value="null">请先选择污染源</option>
              <option v-for="(el, key) in pollutant" :value="key">{{el}}</option>
            </select>
          </li>
        </ul>
        <ul class="cf">
          <li class="date-picker"><a class="option-exp">爆炸时间</a>
            <el-date-picker type="datetime"
                            class="explosion-time"
                            format="yyyy-MM-dd HH:mm"
                            v-model="explosionTime"
                            placeholder="点击选择时间">
            </el-date-picker>
          </li>
          <li><a class="option-exp">泄露速率</a>
            <input type="number"
                   :class="{'error-box': !isLeakSpeedComplete}"
                   min="0"
                   @click="clearErrorBox('isLeakSpeedComplete')"
                   v-model="leakSpeed">
            <em>(kg/h)</em>
          </li>
        </ul>
        <ul class="cf">
          <li><a class="option-exp">泄露时长</a>
            <input type="number"
                   :class="{'error-box': !isLeakTimeComplete}"
                   min="0"
                   @click="clearErrorBox('isLeakTimeComplete')"
                   v-model="leakTime"
                   placeholder="单位为小时">
            <em>(h)</em>
          </li>
          <li><a class="option-exp">污染源高度</a>
            <input type="number"
                   :class="{'error-box': !isPollutionSourceHeightComplete}"
                   min="0"
                   @click="clearErrorBox('isPollutionSourceHeightComplete')"
                   v-model="pollutionSourceHeight"
                   placeholder="单位为米">
            <em>(m)</em>
          </li>
        </ul>
        <ul class="cf">
          <li class="submit-btn-global"
              style="float:right;"
              @click="submitPollutionSimulate">提交
          </li>
        </ul>
      </section>
      <section class="simulate-record-wraper"
               style="padding-right: 10px">
        <a class="option-exp">交互记录</a>
        <ul class="simulate-list-container">
          <li v-for="(el, index) in simulateRecord"
              :class="{'simulate-record-selected': recordSelected == index}"
              @click.stop="showPoiInfo(el, index)">
            <a>{{el.name}}</a>
            <span @click.stop="deleteRecord(el, index)">
              <svg width="8px" height="8px">
                <path d="M 0,0 L 8,8 M 8,0 L 0,8" />
              </svg>
            </span>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Helper } from '../../util/Helper'
import { ModelAssess } from '../../util/modelAssess'
import { pollutionSource } from '../../config/pollution'

import smlProgress from './smlProgress'

let poiEntity,
    pollutionRange = [1, 0.00003, 0.00002, 0.00001, 0];

export default {
  data() {
    return {
      errorDisplay: false,
      calendarView: false,

      progressingStep: 0,
      optionTipDisplay: false,
      recordSelected: null,
      address: '污染点定位',

      simulateRecord: [],
      addingPoi: false,

      pollutionSource,
      pollutantSelected: 'null',
      isPollutantComplete: true,
      pollutionSourceSelected: 'null',
      isPollutionSourceComplete: true,

      demType: null,
      demTypeSelected: 'null',
      isDemTypeComplete: true,

      windType: null,
      windTypeSelected: 'null',
      isWindTypeComplete: true,

      diffuseType: null,
      diffuseTypeSelected: 'plume',
      isDiffuseTypeComplete: true,

      explosionTime: '',
      isExplosionTimeComplete: true,

      pollutionSourceHeight: '',
      isPollutionSourceHeightComplete: true,

      leakTime: '',
      isLeakTimeComplete: true,

      leakSpeed: 1,
      isLeakSpeedComplete: true,

      poiDegrees: [],

      poiDegreesTimeout: null,

      progressingStep: 0,
      failedStep: null

    }
  },
  mounted() {
    this.getPollutionList();
  },
  computed: {
    ...mapGetters([
      'currentRegion',
      'selectedModel'
    ]),
    pollutant() {
      if (this.pollutionSource[this.pollutionSourceSelected]) {
        return this.pollutionSource[this.pollutionSourceSelected].elements
      } else {
        return {}
      }
    },
  },
  watch: {
    pollutionSourceSelected(nv) {
      if (nv == 'null' || nv == null) {
        this.pollutantSelected = null
      }
    },
    calendarStatus(nv) {
      console.info(nv)
      if (nv === 'pollutionExplosionTime') {
        this.calendarView = calendar
      } else {
        this.calendarView = null
      }
    }
  },
  components: {
    smlProgress
  },
  methods: {
    ...mapActions([
      'showInfoTip_global',
      'toggleModelMenu',
      'storeModelData'
    ]),
    async getPollutionList() {
      if(this.simulateRecord.length)
        this.simulateRecord = [];
      try {
        let res = await this.$http.get(`http://10.148.83.228:2008/projshare/simulate/get/all?type=pollution&cityId=${this.currentRegion.cityId}${this.currentRegion.countyId ? ('&countyId=' + this.currentRegion.countyId) : ''}`);
        let data = res.data;
        if(data.result !== 'S_OK' || Array.isArray(data.tagObject) === false)
          return;
        data.tagObject.sort((a, b) => a.id - b.id);
        data.tagObject.forEach(el => {
          this.simulateRecord.push(el);
        });
      } catch(e) {
        throw 'failed to get pollution simulate list';
      }
    },
    deleteRecord(el, index) {
      if (el.id) {
        this.$http.get(`http://10.148.83.228:2008/projshare/simulate/delete?id=${el.id}`)
          .then(res => {
            if(this.recordSelected === index) {
              let helper = new Helper(viewer);
              poiEntity && helper.removeEntity(poiEntity);
              for (let el of this.simulateRecord) {
                el.imgLayer && helper.removeImgLayer(el.imgLayer);
              }
              helper = null;
              this.recordSelected = null;
            } else {
              typeof this.recordSelected === 'number' && this.recordSelected--;
            }
            this.simulateRecord.splice(index, 1);
            this.showInfoTip_global({ type: 'success', text: '删除成功' });
          })
          .catch(err => {
            this.showInfoTip_global({ type: 'error', text: '删除失败' });
          });
      }
    },
    addingPollutionPoint() {
      if (this.addingPoi)
        return;
      let helper = new Helper(viewer);
      this.manuleAdding = true;

      if (poiEntity) {
        helper.removeEntity(poiEntity);
        poiEntity = null;
        this.resetAllOption();
        this.uploadControl(0);
      }

      const eventHandler = helper.getNewHandler();

      poiEntity = helper.addBillboard([110, 20], `./static/img/modelIcon/airpollution/green.png`, 'bottom', 'center');

      helper.setAction('mouseOver', eventHandler, null, (entity, index, movement) => {
        let pickedPos = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
        let pos = new Zearth.Cartesian3(pickedPos.x, pickedPos.y, pickedPos.z);
        poiEntity.position = pos;
      });

      // 添加左键点击事件 左键点击增加定位点
      helper.setAction('leftClick', eventHandler, null, (entity, index, movement) => {
        helper.removeAction(eventHandler, 'mouseOver');

        let pickedPos = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
        let buffer = helper.getCoorFromCtn3(pickedPos);
        poiEntity.position = new Zearth.Cartesian3(pickedPos.x, pickedPos.y, pickedPos.z);

        this.poiDegrees = [
          Number(buffer[0]).toFixed(4),
          Number(buffer[1]).toFixed(4)
        ];

        this.$http.jsonp(`http://restapi.amap.com/v3/geocode/regeo?key=67fbfcb22d9900a94cc95af73378c865&location=${buffer[0]},${buffer[1]}`)
          .then(res => {
            this.address = res.data.info === 'OK' ? res.data.regeocode.formatted_address.replace('广东省', '') : '获取位置失败';
          });

        this.$http.jsonp(`http://10.148.83.228:9020/data/p0?lon=${this.poiDegrees[0]}&lat=${this.poiDegrees[1]}`)
          .then(res => {
            this.windSpeed = res.data.vel.toFixed(1);
            this.windDirection = res.data.dir.toFixed(1);
          });

        helper.removeAction(eventHandler, 'leftClick');
        setTimeout(() => this.manuleAdding = false, 500);
      })

    },
    async submitPollutionSimulate() {
      if (!this.optionValidating()) {
        this.showInfoTip_global({ text: '请填满选项' });
        return;
      }

      this.uploadControl(1);

      let simulateRecordHolder = {
        combinedName: '',
        imgLayer: null,
        data: {
          lon: this.poiDegrees[0],
          lat: this.poiDegrees[1],
          pollutionSource: this.pollutionSourceSelected,
          dem: this.demTypeSelected,
          pollutant: this.pollutantSelected,
          explosionTime: this.explosionTime.Format('yyyy-MM-dd HH:mm:ss'),
          diffuse: this.diffuseTypeSelected,
          pollutionSourceHeight: this.pollutionSourceHeight,
          windType: this.windTypeSelected,
          leakTime: this.leakTime,
          windSpeed: this.windSpeed,
          leakSpeed: this.leakSpeed,
          windDirection: Number(this.windDirection).toFixed(0)
        }
      };

      simulateRecordHolder.name = `${this.address}_${pollutionSource[this.pollutionSourceSelected].text}_${pollutionSource[this.pollutionSourceSelected].elements[this.pollutantSelected]}`;

      setTimeout(() => {this.uploadControl(2)}, 500);

      let ncFilename;
      try {
        ncFilename = await this.uploadPollutionRecord(simulateRecordHolder);
        if (ncFilename) {
          this.uploadControl(3);
        }
        else {
          this.failedStep = 2;
          return;
        }
      }
      catch (err) {
        this.failedStep = 2;
        return;
      }

      this.recordSelected = this.simulateRecord.length;
      let recordSelected = this.recordSelected;
      this.getPollutionList();

      let modelAssess = new ModelAssess(this.$http, this.currentRegion);
      let ncInfo = null;
      try {
        ncInfo = await modelAssess.getNcInfo('airpolution_nc_poi', ncFilename);
      }
      catch(err) {
        this.failedStep = 3;
        return;
      }

      modelAssess.getSimulateImg('pollution', simulateRecordHolder.data, ncInfo)
        .then(data => {
          if (recordSelected !== this.recordSelected || this.selectedModel !== 'airpollution')
            return;
          let helper = new Helper(viewer);
          let imgLayer = helper.addImgLayer(data.imgUrl, data.rect);
          let simulate = this.simulateRecord[this.simulateRecord.length - 1];
          simulate.imgLayer = imgLayer;

          helper.flyTo([simulate.data.lon, simulate.data.lat], 800000);
          helper = null;

          this.storeModelData({ attr: 'isAnalyzing', value: true });
          this.storeModelData({ attr: 'analysisType', value: 'pollution' });
          modelAssess.getEffectedTownsByRanges(pollutionRange, data.ncInfo)
            .then(towns => {
              this.storeModelData({ attr: 'townsIdList', value: towns });
              this.uploadControl(4);
            })
            .catch(err => {
              this.storeModelData({ attr: 'townsIdList', value: [] });
              this.failedStep = 3;
            });
        })
    },
    optionValidating() {
      let optionValidating = [];

      if (!poiEntity || this.poiDegrees.length !== 2) {
        return false;
      }

      if (this.pollutionSourceSelected == null || this.pollutionSourceSelected == 'null') {
        this.isPollutionSourceComplete = false;
      } else {
        optionValidating.push('source');
      }

      if (this.pollutantSelected == null || this.pollutantSelected == 'null' || this.pollutantSelected == 'unselected') {
        this.isPollutantComplete = false;
      } else {
        optionValidating.push('pollutant');
      }

      if (this.explosionTime.length !== 0)
        optionValidating.push('explosionTime');
      else
        this.isExplosionTimeComplete = false;

      if (this.pollutionSourceHeight == '') {
        this.isPollutionSourceHeightComplete = false;
      } else {
        optionValidating.push('height');
      }

      if (this.leakTime == '') {
        this.isLeakTimeComplete = false;
      } else {
        optionValidating.push('leakTime');
      }

      if (this.leakSpeed == '') {
        this.isLeakSpeedComplete = false;
      } else {
        optionValidating.push('leakSpeed');
      }

      return optionValidating.length === 6;
    },
    clearErrorBox(target) {
      this[target] = true;
    },
    async uploadPollutionRecord(params) {
      let modelAssess = new ModelAssess(this.$http, this.currentRegion);
      let ncFileName = await modelAssess.getPollutionSmlFile(params.data);
      let data = {
        name: params.name,
        lon: this.poiDegrees[0],
        lat: this.poiDegrees[1],
        params: JSON.stringify(params),
        type: 'pollution',
        filename: ncFileName,
        cityid: this.currentRegion.cityId
      };
      if(this.currentRegion.countyId)
        data.countyid = this.currentRegion.countyId;
      let uploadResult = await this.$http.get('http://10.148.83.228:2008/projshare/simulate/add', { params: data });

      if(uploadResult.data)
        return data.filename;
      else
        return uploadResult.data;
    },
    uploadControl(step = 0) {
      this.progressingStep = step;
    },
    showPoiInfo(el, index) {
      let helper = new Helper(viewer);
      if (poiEntity)
        helper.removeEntity(poiEntity);

      for (let item of this.simulateRecord) {
        if (item.imgLayer) {
          helper.removeImgLayer(item.imgLayer);
          item.imgLayer = null;
        }
      }
      if(this.recordSelected === index) {
        this.storeModelData({ attr: 'townsIdList', value: [] });
        this.recordSelected = null;
        helper = null;
        return;
      }
      this.recordSelected = index;

      let modelAssess = new ModelAssess(this.$http, this.currentRegion);

      poiEntity = helper.addBillboard([el.lon, el.lat],
        `./static/img/modelIcon/airpollution/green.png`, 'bottom', 'center');
      helper.flyTo([el.lon, el.lat], 80000);
      this.uploadControl(3);

      let recordSelected = this.recordSelected;
      modelAssess.getNcInfo('airpolution_nc_poi', el.filename)
        .then(data => {
          if (recordSelected != this.recordSelected || this.selectedModel !== 'airpollution')
            return Promise.reject();
          return modelAssess.getSimulateImg('pollution', JSON.parse(el.params), data);
        })
        .then(data => {
          if (recordSelected != this.recordSelected || this.selectedModel !== 'airpollution')
            return;
          el.imgLayer = helper.addImgLayer(data.imgUrl, data.rect);
          helper = null;
          this.storeModelData({ attr: 'isAnalyzing', value: true });
          this.storeModelData({ attr: 'analysisType', value: 'pollution' });
          modelAssess.getEffectedTownsByRanges(pollutionRange, data.ncInfo)
            .then(towns => {
              this.storeModelData({ attr: 'townsIdList', value: towns });
              this.uploadControl(4);
            })
            .catch(err => {
              this.storeModelData({ attr: 'townsIdList', value: [] });
              this.failedStep = 3;
            });
        })
        .catch(err => {

        });
    },
    resetAllOption() {
      this.recordSelected = null
      this.addingPoi = false
      this.pollutantSelected = null
      this.pollutionSourceSelected = null
      this.demTypeSelected = null
      this.windTypeSelected = null
      this.diffuseTypeSelected = null
      this.explosionTime = ''
      this.pollutionSourceHeight = ''
      this.leakTime = ''
      this.windSpeed = ''
      this.leakSpeed = 1
      this.windDirection = ''
      this.poiDegrees = []
    }

  },
  destroyed() {
    let helper = new Helper(viewer)
    if (poiEntity)
      helper.removeEntity(poiEntity)
    for (let el of this.simulateRecord) {
      if (el.imgLayer)
        helper.removeImgLayer(el.imgLayer)
    }
    helper = null
  }
}
</script>

<style lang="scss" scoped>
#pollutionSimulate {
  width: 430px;
  position: absolute;
  top: 30px;
  right: 10px;
  background-color: white; // width: 0px;
  border-radius: 6px 4px;
  font-size: 12px;
  header {
    cursor: move;
    border-radius: 4px 4px 0 0;
    position: relative;
    height: 30px;
    background-color: #263B5C;
    h1 {
      font-size: 12px;
      color: white;
      line-height: 30px;
      padding-left: 10px;
      margin: 0;
      letter-spacing: 1px;
    }
    span {
      cursor: pointer;
      border-top-right-radius: 4px;
      width: 30px;
      height: 30px;
      display: block;
      position: absolute;
      right: 0px;
      top: 0px;
      &:hover {
        background-color: #1c3252;
      }
      svg {
        padding: 11px;
        line {
          stroke: white;
        }
      }
    }
  }
}

main.sml-option {
  height: 530px; // width: 400px !important;
  float: left;
  section.option-wraper {
    margin-right: 10px;
    li {
      display: block; // float: left;
      a {
        width: 60px !important;
      }
      >input {
        width: 220px;
      }
      select {
        width: 220px !important;
        height: 24px;
        box-sizing: border-box;
        border-color: #d7d7d7;
        color: #545454;
        border-radius: 3px;
        padding-left: 3px;
        font-size: 12px;
      }
    }
    a {
      width: 48px;
      display: inline-block;
    }
  }
  .simulate-list-container {
    min-height: 100px;
    max-height: 100px;
    li {
      margin: 0 !important;
    }
  }
}

.explosion-time {
  width: 184px !important;
  border: solid 1px #d7d7d7 !important;
  font-size: 12px;
  color: gray;
  border-radius: 3px;
  height: 20px !important;
  padding: 1px 0px 2px 6px !important;
  cursor: pointer;
  line-height: 24px !important;
  input {
    background-color: violet !important;
  }
  input::-webkit-input-placeholder {
    color: white !important;
  }
}
</style>
<style lang="scss">
.date-picker .el-date-editor {
  width: auto!important;
  border: none!important;
  height: 22px!important;
  padding: 0!important;
  input.el-input__inner {
    // height: 22px!important;
    // border: none!important;
    // padding: 0!important;
    border: solid 1px #dcdcdc !important;
    box-sizing: border-box !important;
    padding: 0 0 0 10px !important;
    height: 24px !important;
    width: 220px !important;
    line-height: 24px !important;
    color: #545454;
  }
  .el-input__icon+.el-input__inner {
    // padding: 0!important;
  }
  .el-input__icon {
    display: none!important;
  }
}
</style>
