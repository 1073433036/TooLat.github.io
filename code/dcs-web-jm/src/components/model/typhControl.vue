<template>
  <main id="typh-model-control-panel">
    <section class="typh-list-wraper">
      <ul class="current-typh-list-wraper">
        <li v-for="el in containedTyph_global"
            :style="{background: selectedTyph_global === el.tsId ? '#dfe7f3' : ''}"
            @click="selectTyph(el.tsId, false, true)"
            v-if="el.type === 'present'">
          {{el.id}} {{el.name}} (当前台风)
        </li>
        <li v-if="!hasPresentTyph"
            style="color: #EE7C86">当前没有台风</li>
      </ul>
      <ul class="history-typh-list-wraper">
        <li v-for="el in containedTyph_global"
            :style="{backgroundColor: selectedTyph_global === el.tsId ? '#dfe7f3' : ''}"
            @click.stop="selectTyph(el.tsId, false, false)"
            v-if="el.type !== 'present'">
          <span>{{el.id}} {{el.name}}</span>
          <svg width="8px"
               height="8px"
               @click.stop="deleteHistoryTyph_global(el.tsId)">
            <path d="M 0,0 L 8,8 M 8,0 L 0,8" />
          </svg>
        </li>
      </ul>
    </section>
    <section class="typh-btn">
      <ul class="cf">
         <li @click="toggleMatchingPopup">台风匹配</li>
      </ul>
    </section>
    <components :is="clickPopupView"
                :typhData="clickTyphData"
                :setTyphTerminal="setTyphTerminal"
                :movingTyphRotateEntity="movingTyphRotateEntity">
    </components>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TyphHelper from '../../util/typhHelper'
import toModelTime from '../../util/toModeltime'
import { getTyphDataById } from './typhTimeline/typhUtil'

import clickPopup from '../popup/typhClick'

let typhEntities = {},
    tideImgLayer = null;

export default {
  data() {
    return {
      totalPointCount: 0,
      selectedAnalysisOption: null,
      hasPresentTyph: true,

      clickPopupView: null,
      clickTyphData: null,

      hasPresentTyph: false,

      presentColorTable: null,

      analysisTimer: null
    }
  },
  components: {
    clickPopup
  },
  mounted() {
    deterWhetherHasPresetTyph.call(this)
      .then(data => {
        if (this.selectedModel !== 'tide')
          return;
        if (!data.length) {
          this.hasPresentTyph = false;
        } else {
          this.hasPresentTyph = true;
          data.forEach(el => {
            this.storeTyphData_global(el);
          })
          this.selectTyph(data[0].tsId, true);
          this.toggleCurrentTyphFlag_global(true);
        }
      });
  },
  computed: {
    ...mapGetters([
      'selectedModel',
      'seledTime',
      'dateTime',
      'dateForModel',
      'currentRegion',
      'currentTyphFlag_global',
      'containedTyph_global',
      'selectedTyph_global',
      'typhClickPointIndex_global',
      'typhClickPopupPos_global',
      'typhClickPopup_global',
      'typhMatchingPopup_global',
      'isBefore03Typh_global',
      'typhOverPopupData_global',
      'typhOverPopupShow_global'
    ])
  },
  methods: {
    ...mapActions([
      'showInfoTip_global',
      'clearModelData',
      'typhPoiPopup_global',
      'changeTyphClickPointIndex_global',
      'storeTyphClickFsttime_global',
      'changeTyphClickPopupPos_global',
      'toggleTyphMatchingPopup_global',
      'selectTyph_global',
      'deleteHistoryTyph_global',
      'storeTyphData_global',
      'toggleTyphTimelineStatus_global',
      'storeModelData',
      'toggleTyphClickPopup_global',
      'initialTyphData_global',
      'toggleCurrentTyphFlag_global',
      'storeColorTable_global',
      'toggleTyphOverPopup_global',
      'storeTyphOverPopupData_global',
      'storeTyphOverPopupPos_global',
      'storeTyphoonData_global'
    ]),
    movingTyphRotateEntity(type, datetimeString) {
      typhEntities[this.selectedTyph_global].movingRoatetEntity(type, this.typhClickPointIndex_global)
        .then(res => {
          if (res) {
            this.changeTyphClickPointIndex_global(this.typhClickPointIndex_global + (type === 'previous' ? -1 : 1));
          }
        });
    },
    setTyphTerminal(index) {
      const tyId = this.selectedTyph_global;
      if(!tyId || !typhEntities.hasOwnProperty(tyId))
        return;
      typhEntities[tyId].setTyphTerminal(index);
    },
    selectTyph(tsId, isInit = false, isCurrentTyph = false) {
      if (this.selectedTyph_global === tsId)
        return;

      if (isInit) {
        setTimeout(() => {
          this.toggleTyphTimelineStatus_global('deteil');
        }, 350);
        setTimeout(() => {
          this.selectTyph_global(tsId);
        }, 700);
      } else {
        this.toggleTyphTimelineStatus_global('deteil');
        this.selectTyph_global(tsId);
        this.toggleCurrentTyphFlag_global(isCurrentTyph);
      }
    },
    toggleMatchingPopup() {
      if(!this.selectedTyph_global || this.typhMatchingPopup_global) {
        !this.selectedTyph_global && this.showInfoTip_global({ type: 'error', text: '请选择要匹配的台风' });
        return;
      }
      this.toggleTyphMatchingPopup_global(true);
    },
    toggleClickPopup(index, pos, data, fstTime) {
      if (!this.clickPopupView) {
        this.clickPopupView = clickPopup;
      }
      this.clickTyphData = data;
      this.storeTyphClickFsttime_global(fstTime);
      this.toggleTyphClickPopup_global(true);
      if (this.typhClickPopupPos_global === null)
        this.changeTyphClickPopupPos_global(JSON.parse(JSON.stringify(pos)));
      this.changeTyphClickPointIndex_global(index);
    },
    toggleMouseOverPopup(type, pos, data) {
      let lastDatetime = this.typhOverPopupData_global ? this.typhOverPopupData_global.datetime : false,
          datetime = data ? data.datetime : null;
      if (type === true && lastDatetime !== datetime) {
        this.storeTyphOverPopupData_global(JSON.parse(JSON.stringify(data)));
        this.storeTyphOverPopupPos_global(JSON.parse(JSON.stringify(pos)));
        this.toggleTyphOverPopup_global(true);
      }

      if (type === false && this.typhOverPopupShow_global) {
        this.storeTyphOverPopupData_global(false);
        this.storeTyphOverPopupPos_global(false);
        this.toggleTyphOverPopup_global(false);
      }
    }
  },
  watch: {
    selectedTyph_global(newId, oldId) {
      this.toggleTyphOverPopup_global(false);
      if (tideImgLayer) {
        let helper = new TyphHelper(viewer);
        helper.removeImgLayer(tideImgLayer);
        helper = null;
      }
      for (let i in typhEntities) {
        let temp = typhEntities[i].typhEntity;
        typhEntities[i].removeTyphEntities(temp);
        delete typhEntities[i];
        if (newId === i)
          break;
      }
      if(!newId) {
        this.storeTyphoonData_global(null);
        return;
      }
      getTyphDataById(this.$http, newId, this.isBefore03Typh_global)
        .then(data => {
          if(!data || this.selectedModel !== 'tide')
            return;
          typhEntities[newId] = new TyphHelper(viewer);
          typhEntities[newId].drawTyph(data, true, this.toggleClickPopup, this.toggleMouseOverPopup);
          this.totalPointCount = data.real.length - 1;
          this.clickTyphData = data;
          this.changeTyphClickPointIndex_global(this.totalPointCount);
          this.storeTyphoonData_global(data);
        });
    },
    typhClickPopup_global(nv) {
      if (this.clickPopupView && !nv)
        this.clickPopupView = false;
    }
  },
  destroyed() {
    let typhHelper = new TyphHelper(viewer);
    if (tideImgLayer) {
      typhHelper.removeImgLayer(tideImgLayer);
      typhHelper = null;
    }

    if (this.presentColorTable)
      this.storeColorTable_global({ type: 'delete', data: { type: this.presentColorTable, flag: this.presentColorTable } });

    for (let i in typhEntities) {
      typhHelper.removeTyphEntities(typhEntities[i].typhEntity);
    }

    if (this.clickPopupView)
      this.clickPopupView = false;
    this.toggleTyphOverPopup_global(false);
    this.initialTyphData_global();

    typhHelper = null;
    typhEntities = {};
    tideImgLayer = null;
  }
}


async function deterWhetherHasPresetTyph() {
  let data = (await this.$http.get('http://10.148.83.228:8921/typhoon/info/find_Latest_ByMaxtime?limit=3&fcid=BCGZ')).data;
  if (!Array.isArray(data) || !data.length)
    return [];

  let eachTyphDate = null,
      nowDate = new Date(),
      presentTyphContainer = [];
  nowDate.setHours(nowDate.getHours() - 12);
  for (let item of data) {
    if (!item.info || !item.info.ename || !item.info.cname || item.intlid === '')
      continue;
    eachTyphDate = new Date(item.maxtime);
    eachTyphDate.setHours(eachTyphDate.getHours() + 8);
    if (nowDate > eachTyphDate)
      break;
    presentTyphContainer.push({
      tsId: item.tsid,
      id: item.intlid,
      name: item.info.cname,
      type: 'present'
    });
  }
  return presentTyphContainer;
}

</script>

<style lang="scss" scoped>
.typh-list-wraper {
  padding: 4px 0;
  font-size: 12px;
  border-bottom: solid 1px #d7d7d7;
  li {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    line-height: 24px;
    cursor: pointer;
    &:hover {
      background-color: #dfe7f3;
    }
  }
  ul.current-typh-list-wraper {
    li {
      color: #299dff;
    }
  }
  ul.history-typh-list-wraper {
    li {
      position: relative;
      svg {
        position: absolute;
        right: 10px;
        top: 10px;
        margin-left: auto;
        cursor: pointer;
        path {
          stroke: lightcoral;
          stroke-width: 1.5px;
        }
      }
    }
  }
}

.typh-analysis-option {
  box-sizing: border-box;
  padding: 10px;
  font-size: 0;
  div {
    width: 50%;
    height: 18px;
    position: relative;
    display: inline-block;
    vertical-align: top;
    line-height: 18px;
    cursor: pointer;
    &:hover {
      a {
        color: #299dff;
      }
    }
    a {
      font-size: 12px;
      display: inline-block;
      margin-left: 10px;
    }
    svg {
      transform: translateY(2px);
      line-height: 12px;
    }
  }
}

.typh-btn {
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
  li.download-btn {
    width: 24px;
    border: none;
    line-height: 12px;
    height: 12px;
    padding-top: 10px;
    text-decoration: underline;
    &:hover {
      background-color: white;
      color: #268ee7;
    }
  }
}

.selected-analysis-option {
  fill: #4cafff !important;
}

.selected-analysis-text {
  color: #299dff !important;
  font-weight: bold;
}
</style>
<style lang="scss">
.option-tip-wraper {
  position: absolute;
  z-index: 10 !important;
  transform: translate(68px, -3px) !important;
  a {
    transform: translateY(-3px);
    width: 134px !important;
    min-height: 26px !important;
    display: block !important;
    background-color: #dfe7f3;
    border-radius: 3px !important;
    line-height: 26px !important;
    text-align: center;
    color: #2c3e50 !important;
  }
  svg {
    transform: translateX(10px);
    path {
      fill: #dfe7f3;
    }
  }
}
</style>
