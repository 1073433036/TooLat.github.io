<template>
  <div id="model-result-popup"
       class="poi-detail-popup"
       style="width: 520px; right: 5px;"
       v-if="resultShow"
       v-drag="{handle: '.poi-detail-title'}">
    <div class="poi-detail-title">
      {{compTime}}-分析结果
      <span @click="closeModelResultPopup">✕</span>
    </div>
    <div class="poi-detail-wrapper">
      <div class="popup-detail-tab">
        <ul>
          <li :class="{'popup-tab-selected': isResultView}"
              @click="toggleDetailTab">影响区域<em v-show="isResultView"></em></li>
          <li :class="{'popup-tab-selected': !isResultView}"
              @click="toggleDetailTab">靶向发布<em v-show="!isResultView"></em></li>
        </ul>
      </div>
      <effected-area v-show="isResultView"></effected-area>
      <targeted-release v-show="!isResultView"
                        :affectedTownsNameList="affectedTownsNameList"
                        :affectedTownsIdList="affectedTownsIdList"
                        :regionData="currentRegion">
      </targeted-release>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import effectedArea from '../modelCtrl/effectedArea'
import targetedRelease from '../modelCtrl/targetedRelease'

export default {
  data() {
    return {
      resultShow: false,
      isResultView: true,
      affectedTownsIdList: [],
      affectedTownsNameList: []
    }
  },
  components: {
    effectedArea,
    targetedRelease
  },
  computed: {
    ...mapGetters([
      'isModelAnalyzing',
      'selectedModel',
      'townsIdList',
      'affectedTownsList',
      'currentRegion',
      'analysisType_global',
      'seledTime',
      'dateTime',
      'gridNcInfo'
    ]),
    compTime() {
      let dateStr;
      if(this.selectedModel === 'rain') {
        if(this.gridNcInfo) {
          dateStr = new Date(this.gridNcInfo.start).Format('MM月dd日HH时mm分');
        } else {
          let ms = this.dateTime.getTime();
          ms -= ms%360000;
          dateStr = new Date(ms).Format('MM月dd日HH时mm分');
        }
      } else {
        dateStr = this.dateTime.Format('MM月dd日HH时');
      }
      return `${dateStr}${this.seledTime ? (' 未来' + this.seledTime + '小时') : ''}`;
    }
  },
  methods: {
    toggleDetailTab() {
      this.isResultView = !this.isResultView;
    },
    closeModelResultPopup() {
      this.resultShow = false;
    }
  },
  watch: {
    selectedModel() {
      if (this.resultShow || this.selectedModel === null)
        this.resultShow = false;
    },
    isModelAnalyzing(bool) {
      if (bool) {
        this.resultShow = true;
      }
    },
    affectedTownsList(nv) {
      const analysisType = this.analysisType_global;
      if(analysisType === 'geology' || analysisType === 'pollution' || analysisType === 'thunder') {
        if(analysisType !== 'thunder') {
          this.affectedTownsIdList = this.townsIdList;
          this.affectedTownsNameList = nv;
        }
        return;
      }
      let indexArray;
      switch(analysisType) {
        case 'tide':
          indexArray = [[0], [1], [2, 3], [4, 5, 6]];
          break;
        case 'tide_rain':
        case 'tide_wind':
          indexArray = [[0], [1], [2], [3, 4]];
          break;
        case 'fire':
          indexArray = [[0], [1], [2], [3, 4, 5]];
          break;
      }

      let townsIdArray = [],
          townsNameArray = [];
      indexArray.forEach((arr) => {
        let mergeIdArray = [],
            mergeNameData = {};
        for(let index of arr) {
          mergeIdArray = mergeIdArray.concat(this.townsIdList[index]);
          for(let i in nv[index]) {
            if(i in mergeNameData) {
              mergeNameData[i] = mergeNameData[i].concat(nv[index][i]);
            } else {
              mergeNameData[i] = nv[index][i];
            }
          }
        }
        if(mergeIdArray.length)
          mergeIdArray = Array.from(new Set(mergeIdArray));  //数组去重

        townsIdArray.push(mergeIdArray);
        townsNameArray.push(mergeNameData);
      });

      this.affectedTownsIdList = townsIdArray;
      this.affectedTownsNameList = townsNameArray;
    }
  }
}
</script>
