<template>
  <div id="fireSimulate"
       class="cf"
       v-drag="{handle: '.draggable'}">
    <header class="draggable">
      <h1>火情模拟</h1>
      <span @click="toggleModelMenu('fire')">
        <svg width="8px" height="8px">
          <line x1="0" x2="8" y1="0" y2="8" />
          <line x2="0" x1="8" y1="0" y2="8" />
        </svg>
      </span>
    </header>
    <sml-progress :progressingStep="progressingStep"
                  :failedStep="failedStep" />
    <main class="sml-option">
      <section class="adding-poi-wraper cf">
        <span></span>
        <a @click.stop="addingFirePoint"
           v-text="address">火险点定位</a>
      </section>
      <section class="option-wraper">
        <ul class="cf">
          <li><a class="option-exp">中心经度</a>
            <input id="fireSimulateLon"
                   :readonly="progressingStep>0"
                   :class="{'error-box': !isDegreesComplete}"
                   @focus="clearErrorStyle('isDegreesComplete')"
                   type="text"
                   v-model="poiDegrees[0]"
                   placeholder="请使用火险定位点定位经度" />
          </li>
          <li><a class="option-exp">中心纬度</a>
            <input id="fireSimulateLat"
                   :readonly="progressingStep>0"
                   :class="{'error-box': !isDegreesComplete}"
                   @focus="clearErrorStyle('isDegreesComplete')"
                   type="text"
                   v-model="poiDegrees[1]"
                   placeholder="请使用火险定位点定位纬度" />
          </li>
        </ul>
        <ul class="cf">
          <li><a class="option-exp">事件名称</a>
            <input id="fireSimulateName"
                   :class="{'error-box': !isEventNameComplete}"
                   @focus="clearErrorStyle('isEventNameComplete')"
                   type="text"
                   v-model="poiName"
                   placeholder="自定义事件名称">
          </li>
          <li><a class="option-exp">燃烧速度</a>
            <input type="number"
                   v-model="poiSpeed"
                   placeholder="自动获取"><em>(米/分钟)</em>
          </li>
        </ul>
        <ul class="cf">
          <li><a class="option-exp">燃烧系数</a>
            <select v-model="poiFactor">
              <option :value="el.id"
                      v-for="el in poiFactorData">{{el.name}}</option>
            </select>
          </li>
          <li class="submit-btn-global"
              @click="submitFireSimulate">
            <span>提交</span>
          </li>
        </ul>
      </section>
      <section class="simulate-record-wraper"
               style="padding-right: 0">
        <a class="option-exp">交互记录</a>
        <ul class="simulate-list-container">
          <li @click="showPoiInfo(el, index)"
              v-for="(el,index) in simulateRecord"
              :class="{'simulate-record-selected': recordSelected == index}">
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
import smlProgress from './smlProgress'

let poiEntity,
    poiImgLayer,
    fireRange = [100, 90, 72, 50, 25, 0];
export default {
  data() {
    return {
      poiFactorData: null,
      address: '火险点定位',
      simulateRecord: [],
      recordSelected: null,

      progressingStep: 0,

      manuleAdding: false,
      poiDegrees: [],
      poiSpeed: null,
      poiFactor: null,
      poiName: '',

      isDegreesComplete: true,
      isEventNameComplete: true,

      poiDegreesTimeout: null,

      progressingStep: 0,
      failedStep: null
    }
  },
  components: {
    smlProgress
  },
  computed: {
    ...mapGetters([
      'currentRegion',
      'selectedModel'
    ])
  },
  watch: {
    poiDegrees(nv, ov) {
      if (this.manuleAdding)
        return;
      // 延迟处理
      if(this.poiDegreesTimeout)
        clearTimeout(this.poiDegreesTimeout);

      this.poiDegreesTimeout = setTimeout(() => {
        if (nv.length == 2) {
          let lon = nv[0],
              lat = nv[1];
          // 判断正确的经纬度
          if (lat > 50 || lat < 0 || lon > 180) {
            this.showInfoTip_global({ text: '请输入正确的经纬度' });
            if (lon > 180)
              document.querySelector('#fireSimulateLon').classList = 'error-box';
            if (lat > 50 || lat < 0)
              document.querySelector('#fireSimulateLat').classList = 'error-box';
            this.poiDegress = ov;
            return;
          } else {
            let helper = new Helper(viewer);
            // 经纬度正确，判断当前是否已经添加entity
            if (poiEntity) {
              poiEntity.position = new Zearth.Cartesian3.fromDegrees(...nv);
            } else {
              poiEntity = helper.addBillboard(nv, `./static/img/modelIcon/fire/green.png`, 'bottom', 'center');
            }
            this.getSpeedAndFactor();
            helper.flyTo(nv, 80000);
            helper = null;
          }
        }
      }, 600);
    }
  },
  mounted() {
    //获取交互记录列表
    this.getFireSimulateList();
    //获取植被类型
    this.$http.jsonp('http://10.148.83.228:9020/data/getCombustible')
      .then(res => {
        this.poiFactorData = res.data;
        this.poiFactor = res.data[0].id;
      });
  },
  methods: {
    ...mapActions([
      'showInfoTip_global',
      'toggleModelMenu',
      'storeModelData'
    ]),
    //获取交互记录列表
    async getFireSimulateList() {
      if(this.simulateRecord.length)
        this.simulateRecord = [];
      try {
        let res = await this.$http.get(`http://10.148.83.228:2008/projshare/simulate/get/all?type=fire&cityId=${this.currentRegion.cityId}${this.currentRegion.countyId ? ('&countyId=' + this.currentRegion.countyId) : ''}`);
        let data = res.data;
        if(data.result !== 'S_OK' || Array.isArray(data.tagObject) === false)
          return;
        data.tagObject.sort((a, b) => a.id - b.id);
        data.tagObject.forEach(el => {
          el.params = JSON.parse(el.params);
          this.simulateRecord.push(el);
        });
      } catch(e) {
        throw 'failed to get fire simulate list';
      }
    },
    addingFirePoint() {
      if(this.manuleAdding)
        return;
      let helper = new Helper(viewer);
      this.manuleAdding = true;

      if(poiEntity) {
        helper.removeEntity(poiEntity);
        poiEntity = null;
      }

      if(poiImgLayer) {
        helper.removeImgLayer(poiImgLayer);
        poiImgLayer = null;
      }

      this.uploadControl(0);
      this.poiDegrees = [];
      this.poiSeepd = null;
      this.poiFactor = this.poiFactorData[0].id;
      this.poiName = '';
      this.recordSelected = null;

      const eventHandler = helper.getNewHandler();

      poiEntity = helper.addBillboard([110, 20], `./static/img/modelIcon/fire/green.png`, 'bottom', 'center');

      helper.setAction('mouseOver', eventHandler, null, (entity, index, movement) => {
        let pickedPos = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
        let pos = new Zearth.Cartesian3(pickedPos.x, pickedPos.y, pickedPos.z);
        poiEntity.position = pos;
      });

      // 添加左键点击事件 左键点击增加定位点
      helper.setAction('leftClick', eventHandler, null, (entity, index, movement) => {
        helper.removeAction(eventHandler, 'mouseOver');
        let pickedPos = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
        poiEntity.position = new Zearth.Cartesian3(pickedPos.x, pickedPos.y, pickedPos.z);

        let buffer = helper.getCoorFromCtn3(pickedPos);
        this.poiDegrees = [
          Number(buffer[0]).toFixed(3),
          Number(buffer[1]).toFixed(3)
        ];
        //获取燃烧速度
        this.getSpeedAndFactor();
        //获取定位点地址
        this.$http.jsonp(`http://restapi.amap.com/v3/geocode/regeo?key=67fbfcb22d9900a94cc95af73378c865&location=${buffer[0]},${buffer[1]}`)
          .then(res => {
            this.address = res.data.info === 'OK' ? res.data.regeocode.formatted_address.replace('广东省', '') : '获取位置失败';
          });

        helper.removeAction(eventHandler, 'leftClick');
        setTimeout(() => {this.manuleAdding = false}, 500);
      })

    },
    getSpeedAndFactor() {
      this.$http.jsonp(`http://10.148.83.228:9020/dao/getR0Ks?lon=${this.poiDegrees[0]}&lat=${this.poiDegrees[1]}`)
        .then(res => {
          this.poiSpeed = Number(res.data.ks).toFixed(1);
          if(!this.poiSpeed)
            this.poiSpeed = 1;
        });
    },
    submitFireSimulate() {
      if (this.poiDegrees.length !== 2) {
        this.isDegreesComplete = false;
        this.showInfoTip_global({ text: '请使用火险定位点定位经纬度' });
        return;
      }
      if (this.poiName.length === 0) {
        this.isEventNameComplete = false;
        this.showInfoTip_global({ text: '请输入事件名称' });
        return;
      }

      this.uploadControl(1);
      this.modelComputing();
    },
    async modelComputing() {
      let modelAssess = new ModelAssess(this.$http, this.currentRegion);

      let params = {
        lon: this.poiDegrees[0],
        lat: this.poiDegrees[1],
        Ks: this.poiFactor,
        R0: this.poiSpeed
      };

      setTimeout(() => this.uploadControl(2), 500);

      let ncFilename = await modelAssess.getFireSmlFile(params);
      let uploadStatus = await this.uploadSimulateData(ncFilename);
      if(!uploadStatus)
        return;

      this.recordSelected = this.simulateRecord.length;
      let recordSelected = this.recordSelected;
      this.getFireSimulateList();

      this.drawSmlImage(recordSelected, params, ncFilename);
    },
    async uploadSimulateData(filename) {
      let data = {
        name: this.poiName,
        lon: this.poiDegrees[0],
        lat: this.poiDegrees[1],
        params: JSON.stringify({
          Ks: this.poiFactor,
          R0: this.poiSpeed
        }),
        type: 'fire',
        filename,
        cityid: this.currentRegion.cityId
      };

      if(this.currentRegion.countyId)
        data.countyid = this.currentRegion.countyId;

      try {
        let uploadState = await this.$http.get('http://10.148.83.228:2008/projshare/simulate/add', { params: data });
        if(!uploadState.data)
          this.failedStep = 1;
        return uploadState.data;
      }
      catch (err) {
        this.failedStep = 1;
        throw '上传失败';
      }
    },
    uploadControl(step = 0) {
      this.progressingStep = step;
    },
    deleteRecord(el, index) {
      if (el.id) {
        this.$http.get(`http://10.148.83.228:2008/projshare/simulate/delete?id=${el.id}`)
          .then(res => {
            this.simulateRecord.splice(index, 1);
            if(this.recordSelected === index) {
              let helper = new Helper(viewer);
              poiEntity && helper.removeEntity(poiEntity);
              poiImgLayer && helper.removeImgLayer(poiImgLayer);
              helper = null;
              this.recordSelected = null;
            } else {
              typeof this.recordSelected === 'number' && this.recordSelected--;
            }
            this.showInfoTip_global({ type: 'success', text: '删除成功' });
          })
          .catch(err => {
            this.showInfoTip_global({ type: 'error', text: '删除失败' });
          });
      }
    },
    clearErrorStyle(target) {
      this[target] = true;
    },
    showPoiInfo(el, index) {
      let helper = new Helper(viewer);
      poiEntity && helper.removeEntity(poiEntity);
      poiImgLayer && helper.removeImgLayer(poiImgLayer);
      poiImgLayer = null;

      if(this.recordSelected === index) {
        this.storeModelData({ attr: 'townsIdList', value: [] });
        this.recordSelected = null;
        helper = null;
        return;
      }
      this.recordSelected = index;
      this.uploadControl(2);
      this.failedStep = false;

      poiEntity = helper.addBillboard([el.lon, el.lat], `./static/img/modelIcon/fire/green.png`, 'bottom', 'center');

      let recordSelected = this.recordSelected;
      let params = Object.assign({
        lon: el.lon,
        lat: el.lat
      }, el.params);
      this.drawSmlImage(recordSelected, params, el.filename);
      helper = null;
    },
    async drawSmlImage(index, params, filename) {
      let modelAssess = new ModelAssess(this.$http, this.currentRegion);

      let ncInfo = await modelAssess.getNcInfo('fire_nc_poi', filename);
      let data = await modelAssess.getSimulateImg('fire', params, ncInfo);

      if (index != this.recordSelected || this.selectedModel !== 'fire')
        return;
      let helper = new Helper(viewer);
      poiImgLayer = helper.addImgLayer(data.imgUrl, data.rect);
      helper.flyTo([params.lon, params.lat], 8000);
      helper = null;

      this.uploadControl(3);

      this.storeModelData({ attr: 'isAnalyzing', value: true });
      this.storeModelData({ attr: 'analysisType', value: 'fire' });

      modelAssess.getEffectedTownsByRanges(fireRange, data.ncInfo)
        .then(towns => {
          this.storeModelData({ attr: 'townsIdList', value: towns });
          this.uploadControl(4);
        })
        .catch(err => {
          this.storeModelData({ attr: 'townsIdList', value: [] });
          this.failedStep = 3;
        });
      modelAssess = null;
    }
  },
  destroyed() {
    let helper = new Helper(viewer);
    poiEntity && helper.removeEntity(poiEntity);
    poiImgLayer && helper.removeImgLayer(poiImgLayer);
    helper = null;
  }
}


</script>

<style lang="scss" scoped>
#fireSimulate {
  position: absolute;
  //z-index: 99;
  top: 30px;
  right: 10px;
  width: 420px;
  background: white;
  border-radius: 6px 6px 4px 4px;
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
  width: 300px;
  background-color: #fff;
  float: left;
  input {
    width: 230px;
  }
  select {
    width: 230px;
    box-sizing: border-box;
    height: 24px;
    border: solid 1px #dcdcdc;
    line-height: 24px;
    font-size: 10px;
    padding-left: 2px;
    border-radius: 3px;
  }
}
</style>
