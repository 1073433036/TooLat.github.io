<template>
  <main id="typh-click-popup"
        :style="{top: typhClickPopupPos_global.y - heightFactor + 'px', left: typhClickPopupPos_global.x - widthFactor + 'px'}"
        v-drag="{handle: '.draggable'}">
    <header class="draggable">台风（{{typhData.tscname}}）-模式分析
      <span @click="toggleTyphClickPopup_global(false)">
        <svg width="8px" height="8px">
          <line x1="0" x2="8" y1="0" y2="8" />
          <line x2="0" x1="8" y1="0" y2="8" />
        </svg>
      </span>
    </header>
    <main class="loading-modal"
          v-loading="loading"
          :element-loading-text="loadingText">
      <section class="typh-name">
        <div class="typh-time-wrapper">
          <span>台风实况时间：</span>
          <select v-model="selectedTyphTime">
            <option v-for="(el, index) in typhData.real">{{ new Date(new Date(el.time).getTime() + 8*3600000).Format('yyyy-MM-dd HH:00') }}</option>
          </select>
        </div>
      </section>
      <section class="option-container cf">
        <ul>
          <li>
            <a>元素</a>
            <select @change="optionChange"
                    v-model="elementSelected">
              <option v-for="(el,index) in typhEleData"
                      :value="el.value">{{el.text}}</option>
            </select>
          </li>
          <li>
            <a>高度</a>
            <select @change="optionChange"
                    v-model="heightSelected">
              <option v-for="(el,index) in typhHeightHolder"
                      :value="el.value">{{el.text}}</option>
            </select>
          </li>
        </ul>
      </section>
    </main>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { typhHourData, heightData, typhEleData } from '../../config/grapesConfig.js'
import { Helper } from '../../util/Helper'
import { ModelAssess } from '../../util/modelAssess'

let grapesImgLayer = null,
    tideRanges = [400, 300, 230, 180, 140, 100, 60, 20],
    typhNcinfoObject = null,
    tideForseeTime = null,
    tideImgLayer = null;

export default {
  data() {
    return {
      loadingText: '',
      loading: false,
      typhHourData,
      typhNullHeightData: [
        { text: '0', value: '0' }
      ],
      typhHeightHolder: [
        { text: '请选择', value: 'null' },
        { text: '0', value: '0' }
      ],
      typhEleData,
      selectedTyphTime: null,

      elementSelected: 't2mm',
      heightSelected: 'null',
      presentColorTable: null,

      heightFactor: null,
      widthFactor: null
    }
  },
  props: ['typhData', 'movingTyphRotateEntity', 'setTyphTerminal'],
  computed: {
    ...mapGetters([
      'currentRegion',
      'typhClickPopup_global',
      'typhClickPopupPos_global',
      'typhClickPointIndex_global',
      'typhClickFstTime_global',
      'isBefore03Typh_global'
    ])
  },
  watch: {
    selectedTyphTime(nv) {
      if(this.heightSelected !== 'null') {
        let datetimeString = nv + ':00';
        this.addGrapesImgLayer(datetimeString);
      }
      let worldTime = new Date(nv).getTime() - 8*3600000;
      worldTime = new Date(worldTime).Format('yyyy-MM-dd HH:00:00');
      let index = this.typhData.real.findIndex(el => {
        return el.time === worldTime;
      });
      this.storeTyphClickFsttime_global(null);
      this.setTyphTerminal(index);
      this.modelAnalysis();
    },
    elementSelected(nv) {
      if (nv === 'null')
        return;
      let hasMultipleFlag = false;

      for (let item of typhEleData) {
        if (item.value === nv && item.hasMultipleHeight)
          hasMultipleFlag = true;
      }
      if (hasMultipleFlag) {
        this.typhHeightHolder = heightData;
        this.heightSelected = '1000';
      } else {
        this.typhHeightHolder = this.typhNullHeightData;
        this.heightSelected = '0';
      }
    },
    typhClickPointIndex_global(nv) {
      if(nv < this.typhData.real.length) {
        let typhTime = this.typhData.real[nv].time;
        typhTime = new Date(new Date(typhTime).getTime() + 8*3600000).Format('yyyy-MM-dd HH:00');
        if(typhTime === this.selectedTyphTime) {
          this.modelAnalysis();
        } else {
          this.selectedTyphTime = typhTime;
        }
      } else {
        this.modelAnalysis();
      }
    }
  },
  mounted() {
    this.heightFactor = this.typhClickPopupPos_global.y <= 300 ? 50 : 260;
    this.widthFactor = (document.body.clientWidth - this.typhClickPopupPos_global.x) >= 280 ? 0 : 350;
    let typhTime = this.typhData.real[this.typhClickPointIndex_global].time;
    this.selectedTyphTime = new Date(new Date(typhTime).getTime() + 8*3600000).Format('yyyy-MM-dd HH:00');
  },
  destroyed() {
    let helper = new Helper(viewer);
    grapesImgLayer && helper.removeImgLayer(grapesImgLayer);
    tideImgLayer && helper.removeImgLayer(tideImgLayer);
    helper = null;

    if (this.presentColorTable)
      this.storeColorTable_global({ type: 'delete', data: this.getColorTableData(this.presentColorTable) });
    setTimeout(() => {
      this.storeColorTable_global({ type: 'delete', data: { type: 'tide', flag: 'tide' }});
    }, 0);
  },
  methods: {
    ...mapActions([
      'storeModelData',
      'showInfoTip_global',
      'toggleTyphClickPopup_global',
      'changeTyphClickPointIndex_global',
      'storeTyphClickFsttime_global',
      'storeColorTable_global'
    ]),
    modelAnalysis() {
      this.storeModelData({ attr: 'isAnalyzing', value: true });
      this.storeModelData({ attr: 'analysisType', value: 'tide' });
      this.loading = true;
      this.loadingText = '正在加载风暴潮图层';
      if (tideImgLayer) {
        let helper = new Helper(viewer);
        helper.removeImgLayer(tideImgLayer);
        helper = null;
      }
      tideAnalysis.call(this)
        .then(effectedTown => {
          this.loading = false;
          if(!this.typhClickPopup_global) {
            this.storeModelData({attr: 'townsIdList', value: []});
            return;
          }

          this.storeColorTable_global({ type: 'add', data: { type: 'tide', flag: 'tide', label: '风暴潮'} });
          this.storeModelData({ attr: 'townsIdList', value: effectedTown });
        })
        .catch(err => {
          this.loading = false;
          this.storeModelData({ attr: 'townsIdList', value: [] });
        });
    },
    optionChange() {
      if (this.heightSelected === null)
        return;

      setTimeout(() => {
        let datetimeString = this.selectedTyphTime + ':00';
        this.addGrapesImgLayer(datetimeString);
      }, 0);
    },
    getColorTableData(type) {
      let colorFlag;
      switch (type) {
        case 't2mm':
          colorFlag = 'temp';
          break;
        case 'shum':
          colorFlag = 'rh';
          break;
        case 'omeg':
          colorFlag = 'surt';
          break;
        case 'lspe':
          colorFlag = 'rain';
          break;
        case 'cpre':
          colorFlag = 'rain';
          break;
        case 'wind10':
          colorFlag = 'wind';
          break;
        default:
          colorFlag = type;
      }

      let filterEle = this.typhEleData.filter(el => el.value === type);

      return {
        type,
        flag: colorFlag,
        label: filterEle.length ? filterEle[0].text : ''
      };
    },
    addGrapesImgLayer(datetime) {
      if(this.presentColorTable !== this.elementSelected) {
        if(this.presentColorTable)
          this.storeColorTable_global({ type: 'delete', data: this.getColorTableData(this.presentColorTable) });
        this.storeColorTable_global({ type: 'add', data: this.getColorTableData(this.elementSelected) });
      }

      this.presentColorTable = this.elementSelected;

      if(this.heightSelected === 'null') {
        let helper = new Helper(viewer);
        if (grapesImgLayer)
          helper.removeImgLayer(grapesImgLayer);
        helper = null;
        return;
      }

      this.loading = true;
      this.loadingText = '正在加载图层';
      let params = {
        element: this.elementSelected,
        level: this.heightSelected,
        datetime
      };

      this.$http.jsonp('http://10.148.83.228:9020/data/getGrapes9kmPic', { params })
        .then(res => {
          this.loading = false;
          if(!this.typhClickPopup_global)
            return;

          if (res.data && res.data.length > 6) {
            this.$http.jsonp(res.data.replace('JSON', 'JSONP').replace(/"/g, ''));
          } else {
            let helper = new Helper(viewer);
            if (grapesImgLayer)
              helper.removeImgLayer(grapesImgLayer);
            helper = null;
            this.showInfoTip_global({ text: '当前时间没有grapes模式数据' });
          }
        })
        .catch(err => {
          this.loading = false;
          let helper = new Helper(viewer);
          if (grapesImgLayer)
            helper.removeImgLayer(grapesImgLayer);
          helper = null;
          this.showInfoTip_global({ text: '当前时间没有grapes模式数据' });
        });

      window.png = (res) => {
        let helper = new Helper(viewer);
        this.loading = false;
        if (grapesImgLayer)
          helper.removeImgLayer(grapesImgLayer);

        if (res.match('DB_ERROR')) {
          helper = null;
          window.png = null;
          return;
        }
        let data = JSON.parse(res);
        for (let i in data[0]) {
          data = data[0][i];
        }
        grapesImgLayer = helper.addImgLayer('data:image/png;base64,' + data, {
          top: 27,
          bottom: 10,
          left: 100,
          right: 125
        });
        helper = null;
        window.png = null;
      }
    }
  }
}

async function tideAnalysis() {
  try {
    let modelAccess = new ModelAssess(this.$http, this.currentRegion);
    let tideTime = new Date(this.selectedTyphTime).getTime() - 8*60*60*1000;
    let ncInfo = await modelAccess.getNcInfo('tide', `tide${new Date(tideTime).Format('yyyyMMddHH0000')}.nc`);

    let seledTime = 0;
    if(this.typhClickFstTime_global)
      seledTime = (new Date(this.typhClickFstTime_global).getTime() - new Date(this.selectedTyphTime).getTime())/3600000;
    console.log(seledTime);
    //let seledTime = (datetime.getTime() - ncInfo.start)/3600000;
    let leftLon = ncInfo.leftLon,
        topLat = ncInfo.topLat;
    let rightLon = leftLon + (ncInfo.lonDim-1)*ncInfo.lonGap,
        bottomLat = topLat - (ncInfo.latDim-1)*ncInfo.latGap;
    let ncInfoAreaOption = {
      area: {
        seledVar: ncInfo.vars[0].name,
        seledTime,
        seledLevel: ncInfo.levels[0],
      },
      bounds: {
        top: topLat,
        bottom: bottomLat,
        right: rightLon,
        left: leftLon,
        width: 2000,
        height: 2000
      }
    };

    let imgData = await modelAccess.getModelImage(ncInfo, ncInfoAreaOption);

    let helper = new Helper(viewer);
    tideImgLayer && helper.removeImgLayer(tideImgLayer);
    tideImgLayer = helper.addImgLayer(imgData.imgSrc, imgData);
    helper = null;

    let effectedTown = await modelAccess.getEffectedTownsByRanges(tideRanges, ncInfo, ncInfoAreaOption.area);
    modelAccess = null;

    return effectedTown;
  }
  catch(err) {
    throw 'failed to get tide info';
    this.showInfoTip_global({ text: '选中时次暂无风暴潮数据' });
  }
}

</script>

<style lang="scss" scoped>
.btn {
  box-sizing: border-box;
  padding: 10px;
  li {
    float: right;
    font-size: 12px;
    height: 30px;
    width: 80px;
    box-sizing: border-box;
    border: solid 1px #4cafff;
    line-height: 28px;
    color: #299dff;
    cursor: pointer;
    text-align: center;
    border-radius: 3px;
    &:hover {
      background-color: #299dff;
      color: white;
    }
    &:active {
      background-color: #268ee7;
    }
    &:nth-child(2),
    &:nth-child(3) {
      margin-right: 10px;
    }
  }
}

#typh-click-popup {
  box-shadow: 0px 0px 2px rgba(0, 0, 0, .5);
  position: absolute;
  width: 280px;
  overflow: hidden;
  border-radius: 4px;
  header {
    background-color: #263b5c;
    height: 30px;
    color: white;
    font-size: 12px;
    line-height: 30px;
    padding-left: 10px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    cursor: move;
    span {
      width: 30px;
      height: 30px;
      float: right;
      display: block;
      cursor: pointer;
      &:hover {
        background-color: #1c3252;
      }
    }
    svg {
      margin-left: 11px;
      cursor: pointer;
      line {
        stroke: white;
        stroke-width: 1px;
      }
    }
  }
}

section {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: #fff;
}

section.typh-name {
  color: #299dff;
  font-size: 12px;
  border-bottom: solid 1px #d7d7d7;
  position: relative;
  padding: 0px 10px;
  a {
    text-decoration: none;
  }
  div.typh-time-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 0;
    span {
      display: inline-block;
      height: 100%;
      line-height: 30px;
      font-size: 12px;
    }
    select {
      width: 140px;
      height: 22px;
      display: inline-block;
      border: none;
      outline: none;
    }
  }
  div.path-moving-action {
    width: 20px;
    height: 20px;
    border-radius: 3px;
    border: solid 1px #4cafff;
    position: absolute;
    top: 7px;
    cursor: pointer;
    &:hover {
      background-color: #299dff;
      path {
        fill: white;
      }
    }
    &:active {
      background-color: #268ee7;
    }
    &:first-of-type {
      right: 40px;
    }
    &:last-of-type {
      right: 10px;
    }
    path {
      fill: #299dff;
    }
  }
}

section.option-container {
  background-color: #fff;
  padding-top: 0px;
  a {
    color: #546A90;
    font-weight: bold;
    font-size: 12px;
    display: block
  }
  select {
    width: 120px;
    height: 24px;
    line-height: 24px;
    margin-top: 10px;
    border-radius: 4px;
    border-color: #d7d7d7;
  }
  li {
    float: left;
    margin-top: 14px;
    &:nth-child(even) {
      margin-left: 20px;
    }
  }
}

section.combined-box {
  div {
    font-size: 12px;
    color: #546A90;
    font-weight: bold;
  }
  ul {
    border: solid 1px #d7d7d7;
    border-radius: 4px;
    min-height: 96px;
    max-height: 130px;
    margin-top: 10px;
    overflow-y: scroll;
    li {
      height: 24px;
      cursor: pointer;
      span {
        float: right;
        width: 24px;
        height: 24px;
        box-sizing: border-box;
        padding-left: 8px;
        &:hover {
          background-color: #D5E1F3;
        }
        svg {
          transform: translateY(2px);
        }
        line {
          stroke: #E88F90;
        }
      }
      &:hover {
        background-color: #DFE7F3;
      }
      a {
        float: left;
        width: 200px;
        display: block;
        white-space: nowrap;
        overflow-x: hidden;
        line-height: 24px;
        font-size: 12px;
        box-sizing: border-box;
        padding: 0 10px;
      }
    }
  }
}

section.control-btn-container {
  a {
    float: right;
    display: block;
    margin-left: 10px;
    height: 30px;
    width: 80px;
    box-sizing: border-box;
    border: solid 1px #4cafff;
    border-radius: 3px;
    color: #4cafff;
    text-align: center;
    line-height: 29px;
    cursor: pointer;
    border-radius: 3px;
    &:hover {
      background-color: #4cafff;
      color: white;
    }
  }
  border-radius: 0 0px 4px 4px;
}

section.times-wraper {
  border: none;
  border-radius: 0 0 3px 3px;
  a {
    color: #546A90;
    font-size: 12px;
    font-weight: bold;
  }
  .slider-control {
    float: right;
    height: 24px;
    input {
      box-sizing: border-box;
      width: 35px;
      border-radius: 3px 0 0 3px;
      height: 24px;
      line-height: 18px;
      border: solid 1px #dcdcdc;
      font-size: 12px;
      float: left;
      padding-left: 6px;
      &:focus {
        outline: none;
      }
    }
    svg {
      line-height: 24px;
      border: solid 1px #dcdcdc;
      border-left: none;
      float: left;
      cursor: pointer;
      &:last-of-type {
        border-radius: 0 3px 3px 0;
      }
      &:hover {
        path {
          stroke: #4cafff;
        }
      }
      path {
        stroke-width: 1.5px;
        stroke: #dcdcdc;
      }
    }
  }
}

.diable-moving-action {
  border-color: lightgrey !important;
  cursor: not-allowed !important;
  &:hover {
    background-color: white !important;
    path {
      fill: lightgray !important;
    }
  }
  path {
    fill: lightgray !important;
  }
}

* {
  user-select: none !important
}

</style>
<style lang="scss">
.el-message {
  top: 60px !important;
}
</style>
