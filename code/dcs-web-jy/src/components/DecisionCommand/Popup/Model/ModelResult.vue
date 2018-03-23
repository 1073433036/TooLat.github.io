<template>
  <main id="ModelResult" class="decision-popup" v-drag>
    <header>
      <span>{{compTime}}-分析结果</span>
      <a @click="storePopupStatus_global({ key: 'modelResult', action: false })"></a>
    </header>
    <div class="content scroll-bar" v-loading="isModelAnalyzing" element-loading-text="分析中">
      <section class="model-no-effected" v-if="!hasEffectedTowns && !isModelAnalyzing">
        <span>{{noDataTip}}</span>
      </section>
      <section v-if="hasEffectedTowns && !isModelAnalyzing && el.text.length"
          v-for="(el, key) in levelData" :key="key">
        <div class="circle-icon">
          <span :style="{backgroundColor: el.color}"></span>
        </div>
        <div class="content-container">
          <header class="level-name">{{el.level}} {{el.name}}</header>
          <div class="towns-wrapper" v-html="el.text"></div>
        </div>
      </section>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  import { ModelAssess } from '@/util/modelAssess'
  import * as levelDataConfig from '@/config/modelResultConfig'

  @Component
  export default class ModelResult extends Vue {
    @Getter('decisionStore/region_global') currentRegion
    @Getter('modelStore/isModelAnalyzing') isModelAnalyzing
    @Getter('modelStore/selectedModel') selectedModel
    @Getter('modelStore/townsIdList') townsIdList
    @Getter('modelStore/affectedTownsList') affectedTownsList
    @Getter('modelStore/analysisType_global') analysisType_global
    @Getter('modelStore/seledTime') seledTime
    // @Getter('modelStore/dateTime') dateTime
    @Getter('modelStore/modelNcInfo') modelNcInfo
    @Getter('modelStore/gridNcInfo') gridNcInfo
    @Getter('modelStore/hasEffectedTowns') hasEffectedTowns
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('modelStore/storeModelData_global') storeModelData_global
    dateTime = new Date()
    affectedTownsIdList: any[] = []
    affectedTownsNameList: any[] = []
    levelData: any = [
      { name: 'I级', color: 'red', text: '' },
      { name: 'Ⅱ级', color: 'orange', text: '' },
      { name: 'III级', color: 'yellow', text: '' },
      { name: 'IV级', color: 'blue', text: '' },
    ]

    get compTime() {
      let dateStr
      if(this.selectedModel === 'rain') {
        if(this.gridNcInfo) {
          dateStr = moment(new Date(this.gridNcInfo.start)).format('MM月DD日HH时mm分')
        } else {
          let ms = this.dateTime.getTime()
          ms -= ms%360000
          dateStr = moment(new Date(ms)).format('MM月DD日HH时mm分')
        }
      } else {
        dateStr = moment(this.dateTime).format('MM月DD日HH时')
      }
      return `${dateStr}${this.seledTime ? (' 未来' + this.seledTime + '小时') : ''}`
    }
    get noDataTip() {
      if(!this.modelNcInfo && this.selectedModel !== 'thunder') {
        return this.gridNcInfo && this.seledTime < 4 ? '当前时次无大雨及以上级别降雨影响' : '当前时次暂无数据';
      } else {
        switch(this.selectedModel) {
          case 'tide':
            return '当前时次无风暴潮增水影响';
          case 'rain':
            return '当前时次无大雨及以上级别降雨影响';
          case 'wind':
            return '当前时次无8级及以上级别大风影响';
          case 'thunder':
            return '当前时次无雷电影响';
          case 'geology':
            return '当前时次全市无地质灾害风险'
        }
      }
    }

    @Watch('townsIdList')
    ontownsIdListChanged (val: any, oldVal: any) {
      if(Array.isArray(val) && val.length) {
        val.forEach((el, index, arr) => {
          arr[index] = [...new Set(el)]
        })
      }
      this.matchTownsName(val)
    }

    // 通过镇ID匹配镇名与所属区县
    async matchTownsName(townIdList) {
      let modelAssess = new ModelAssess(this.currentRegion)

      modelAssess.getCounty()
        .then(response => {
        let countyArray = response.data;
        let countyData: any = {};
        if(typeof countyArray === 'string' && /DE_ERR/.test(countyArray)) {
          countyData = null;
        } else {
          console.log('success to get county info');
          for(let ct of countyArray) {
            countyData[ct.countyId] = ct;
          }
        }
        this.storeModelData_global({ attr: 'countyData', value: countyData });

        if(countyData === null) {
          this.storeModelData_global({ attr: 'affectedTownsList', value: [] });
          return;
        }

        modelAssess.getTowns()
          .then(response => {
            let townArray = response.data;
            let townData: any = {};
            if(typeof townArray === 'string' && /DB_ERR/.test(townArray)) {
              townData = null;
            } else {
              console.log('success to get towns info');
              for(let t of townArray) {
                townData[t.townId] = t;
              }
            }
            this.storeModelData_global({ attr: 'townsData', value: townData });

            if(townData === null) {
              this.storeModelData_global({ attr: 'affectedTownsList', value: [] });
              return;
            }

            const allLevelList = modelAssess.matchTownsName(townData, countyData, townIdList);
            this.storeModelData_global({ attr: 'affectedTownsList', value: allLevelList });
          });
      });
    }

    @Watch('affectedTownsList')
    onaffectedTownsListChanged (val: any, oldVal: any) {
      setTimeout(() => {
        this.storeModelData_global({ attr: 'isAnalyzing', value: false });
        this.levelData = levelDataConfig[this.analysisType_global];

        for(let i = 0; i < val.length; i++) {
          let data = val[i];
          let townStr = '';
          if(Array.isArray(data)) {
            townStr = data.join('，');
          } else {
            for(let j in data) {
              townStr += `<b>${j}: </b>${data[j].join('，')}<br/>`;
            }
          }
          this.levelData[i].text = townStr;
        }
      }, 500);
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#ModelResult {
  position: absolute;
  top: 60px;
  left: 0;
  width: 520px;
  .content {
    min-height: 170px;
    max-height: 270px;
    overflow-y: auto;
  }
  section {
    padding: 10px 30px 10px 10px;
    position: relative;
    div.circle-icon {
      width: 8px;
      span {
        position: absolute;
        top: 14px;
        display: block;
        width: 8px;
        height: 8px;
        background: red;
        border: solid 1px #000;
        border-radius: 50%;
      }
    }
    div.content-container {
      width: 100%;
      margin-left: 18px;
      header.level-name {
        color: #0d4b80;
        font-size: 14px;
        margin-bottom: 8px;
      }
      div.towns-wrapper {
        margin-bottom: 2px;
        line-height: 20px;
      }
    }
  }

  .model-no-effected {
    padding: 0;
    span {
      width: 100%;
      height: 200px;
      position: relative;
      display: inline-block;
      line-height: 200px;
      color: red;
      font-size: 18px;
      text-align: center;
    }
  }
}
</style>
