<template>
  <div>
    <station-real-popup></station-real-popup>
    <aqi-detail-popup></aqi-detail-popup>
    <poi-detail-popup></poi-detail-popup>
    <reservoir></reservoir>
    <ship-detail-popup></ship-detail-popup>
    <transition name="slide-fade">
      <components :is="fireSmlView"></components>
    </transition>
    <transition name="slide-fade">
      <components :is="pltSmlView"></components>
    </transition>
    <river-road-tip></river-road-tip>
    <river-road-chart></river-road-chart>
    <transition name="slide-fade">
      <model-result key="modelResult"></model-result>
    </transition>
    <torrent-poi key="torrentPoi"></torrent-poi>
    <waterlog-popup key="waterlogPopup"></waterlog-popup>
    <transition name="slide-fade">
      <reservoir-stat-rain key="reservoirStatRain"></reservoir-stat-rain>
    </transition>
    <transition name="slide-fade">
      <waterlog-stat-table></waterlog-stat-table>
    </transition>
    <transition name="slide-fade">
      <legend-popup v-if="legendPopup_global" :toggleLegendPopup="toggleLegendPopup_global"></legend-popup>
    </transition>
    <transition name="slide-fade">
      <station-warning-stat></station-warning-stat>
    </transition>
    <components :is="rainAndWindPoiView"></components>
    <geo-site-popup></geo-site-popup>
    <flow-convection-result></flow-convection-result>
    <transition name="fade">
      <keep-alive>
        <components :is="mouseOverPopupView"
                    :overData="typhOverPopupData_global"
                    :pos="typhOverPopupPos_global"
                    :tyId="String(selectedTyph_global)"
                    :isBefore03="isBefore03Typh_global"
                    :getTyphDataById="getTyphDataById">
        </components>
      </keep-alive>
    </transition>
    <typhoon-matching v-if="typhMatchingPopup_global"></typhoon-matching>
    <typhoon-report v-if="typhReportPopup_global"
                    :typhoonId="selectedMatchingTyph_global"
                    :isBefore2003="isBefore03Typh_global"
                    :currentRegion="currentRegion"
                    :toggleTyphReportPopup="toggleTyphReportPopup_global">
    </typhoon-report>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import geoSitePopup from './popup/geoSitePopup'
import modelResult from './popup/modelResult'
import stationRealPopup from './popup/stationRealPopup'
import aqiDetailPopup from './popup/aqiDetailPopup'
import waterlogPopup from './popup/waterlogPopup'
import poiDetailPopup from './popup/poiDetailPopup'
import fireSml from './popup/fireSimulate'
import pltSml from './popup/pollutionSimulate'
import riverRoadTip from './popup/riverOrRoadTip'
import riverRoadChart from './popup/riverRoadChart'
import torrentPoi from './popup/torrentPoi'
import typhPoi from './popup/typhPoi'
import reservoirStatRain from './popup/reservoirStatRain'
import waterlogStatTable from './popup/waterlogStatTable'
import stationWarningStat from './popup/stationWarningStat'
import flowConvectionResult from './popup/flowConvectionResult'
import reservoir from  './popup/reservoirModular'
import shipDetailPopup from './popup/shipDetailPopup'
import rainAndWindPopup from './popup/rainAndWindPoi'
import typhoonReport from './popup/typhoonReport'
import typhoonMatching from './popup/typhMatching'
import legendPopup from './popup/legendPopup'
import typhOverPopup from './popup/typhMouseOver'

import { getTyphDataById } from './model/typhTimeline/typhUtil'

export default {
  data() {
    return {
      fireSmlView: false,
      pltSmlView: false,
      rainAndWindPoiView: false,
      mouseOverPopupView: false
    }
  },
  computed: {
    ...mapGetters([
      'selectedModel',
      'currentRegion',
      'rainAndWindPopup',
      'legendPopup_global',
      'selectedTyph_global',
      'typhReportPopup_global',
      'typhMatchingPopup_global',
      'isBefore03Typh_global',
      'selectedMatchingTyph_global',
      'typhOverPopupShow_global',
      'typhOverPopupData_global',
      'typhOverPopupPos_global'
    ]),
  },
  methods: {
    ...mapActions([
      'toggleTyphReportPopup_global',
      'toggleLegendPopup_global'
    ]),
    getTyphDataById
  },
  watch: {
    'rainAndWindPopup.show': {
      handler(nv) {
        this.rainAndWindPoiView = nv ? rainAndWindPopup : null;
      }
    },
    typhOverPopupShow_global(nv) {
      this.mouseOverPopupView = nv ? typhOverPopup : false;
    },
    selectedModel(nv, ov) {
      if (nv === 'fire')
        this.fireSmlView = fireSml
      if (nv !== 'fire' && ov === 'fire')
        this.fireSmlView = false
      if (nv === 'airpollution')
        this.pltSmlView = pltSml
      if (nv !== 'airpollution' && ov === 'airpollution')
        this.pltSmlView = false
    }
  },
  components: {
    modelResult,
    typhPoi,
    geoSitePopup,
    stationRealPopup,
    aqiDetailPopup,
    waterlogPopup,
    poiDetailPopup,
    riverRoadTip,
    riverRoadChart,
    torrentPoi,
    reservoirStatRain,
    waterlogStatTable,
    stationWarningStat,
    flowConvectionResult,
    reservoir,
    shipDetailPopup,
    rainAndWindPopup,
    typhoonReport,
    typhoonMatching,
    legendPopup,
    typhOverPopup
  }
}
</script>
<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateX(525px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease-in;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
<style lang="scss">
main.sml-option {
  .option-wraper {
    border-bottom: solid 1px #d7d7d7;
    li {
      margin-top: 20px;
      position: relative;
      >input {
        color: #545454;
        height: 24px;
        border: solid 1px #d7d7d7;
        border-radius: 3px;
        box-sizing: border-box;
        padding-left: 6px;
        font-size: 12px;
      }
      input::-webkit-input-placeholder {
        color: #97a8be
      }
      em {
        position: absolute;
        top: 24px;
        left: 0;
        font-style: normal;
      }
    }
    ul:last-of-type {
      margin-bottom: 10px;
    }
  }
  .simulate-record-wraper {
    padding: 0 10px 0 0;
    width: 100%;
    box-sizing: border-box;
    >a {
      display: block;
      padding: 20px 0 12px 0;
    }
    ul {
      margin-bottom: 10px;
      width: 290px;
      border: solid 1px #d7d7d7;
      max-height: 156px;
      min-height: 100px;
      overflow-y: auto;
      border-radius: 3px;
      li {
        cursor: pointer;
        width: 100%;
        height: 26px;
        &:hover {
          background-color: #dfe7f3;
        }
        a {
          cursor: pointer;
          color: #545454;
          line-height: 26px;
          padding-left: 10px;
          width: calc(100% - 36px);
          display: inline-block;
          height: 26px;
          text-decoration: none;
          overflow: hidden;
        }
        span {
          cursor: pointer;
          float: right;
          width: 26px;
          height: 26px;
          &:hover {
            background-color: #b5c7e3;
          }
          svg {
            margin: 9px;
          }
          path {
            stroke: #f19292;
            stroke-width: 1.5px;
          }
        }
      }
    }
  }
  a.option-exp {
    font-size: 12px;
    color: #475f88;
    margin-right: 10px;
    line-height: 24px;
    font-weight: bold;
  }
}



section.adding-poi-wraper {
  padding: 10px 10px 10px 0px;
  border-bottom: solid 1px #eeeeee;
  span {
    width: 10px;
    height: 13px;
    float: left;
    margin-right: 6px;
    background-image: url('../assets/setPoint.png')
  }

  a {
    float: left;
    height: 15px;
    line-height: 15px;
    font-size: 12px;
    color: #c5c5c5;
    cursor: pointer;
    &:hover {
      color: #545454;
    }
    &:last-of-type {
      //margin-left: 20px;
      text-align: left;
    }
  }
}

.poi-detail-popup {
  position: absolute;
  top: 30px;
  right: 0;
  background-color: white;
  border-radius: 4px 4px 2px 2px;
  box-shadow: 0px 0px 10px -2px #000;
  .poi-detail-title {
    width: 100%;
    height: 28px;
    position: relative;
    background-color: #263b5c;
    color: white;
    font-size: 1.2rem;
    line-height: 28px;
    text-indent: 1rem;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    cursor: move;
    span {
      width: 28px;
      height: 100%;
      position: absolute;
      display: inline-block;
      right: 0;
      font-size: 10px;
      text-align: center;
      text-indent: 0;
      line-height: 28px;
      cursor: pointer;
      &:hover {
        background: #1c3252;
        border-top-right-radius: 2px;
      }
    }
  }
}

.poi-detail-wrapper {
  position: relative;
  .popup-detail-tab {
    width: 100%;
    height: 30px;
    position: relative;
    border-bottom: 1px solid #f0f0f0;
    ul {
      display: inline-block;
      li {
        height: 14px;
        position: relative;
        display: inline-block;
        margin: 8px 0px;
        padding: 0px 10px;
        font-size: 12px;
        line-height: 14px;
        text-align: center;
        border-right: 1px solid #f0f0f0;
        cursor: pointer;
        &:last-child {
          border-right: none;
        }
        &:hover {
          color: #299dff;
        }
        em {
          width: 0;
          height: 0;
          position: absolute;
          left: 50%;
          bottom: -6px;
          margin-left: -1.5px;
          border-right: 3px solid transparent;
          border-bottom: 3px solid #299dff;
          border-left: 3px solid transparent;
        }
      }
      .popup-tab-selected {
        color: #299dff;
        font-weight: bold;
      }
    }
  }
}

.simulate-record-selected {
  background-color: #dfe7f3 !important;
}
</style>
