<template>
  <div id="effectedAreaPanel"
       class="scroll-style"
       v-loading="isModelAnalyzing"
       element-loading-text="分析中">
    <section class="model-no-effected"
             v-if="!hasEffectedTowns && !isModelAnalyzing"><span>{{noDataTip}}</span></section>
    <section v-if="hasEffectedTowns && !isModelAnalyzing && el.text.length"
             v-for="(el, key) in levelData">
      <div class="circle-icon">
        <span :style="{backgroundColor: el.color}"></span>
      </div>
      <div class="content-container">
        <header class="level-name"
                >{{el.level}} {{el.name}}</header>
        <div class="towns-wrapper"
             v-html="el.text"></div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as levelDataConfig from '../../config/modelResultConfig.js'

export default {
  data() {
    return {
      levelData: [
        { name: 'I级', color: 'red', text: '' },
        { name: 'Ⅱ级', color: 'orange', text: '' },
        { name: 'III级', color: 'yellow', text: '' },
        { name: 'IV级', color: 'blue', text: '' },
      ]
    }
  },
  computed: {
    ...mapGetters([
      'townsIdList',
      'currentRegion',
      'selectedModel',
      'modelNcInfo',
      'hasEffectedTowns',
      'isModelAnalyzing',
      'affectedTownsList',
      'analysisType_global'
    ]),
    noDataTip() {
      console.log(111);
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
  },
  methods: {
    ...mapActions([
      'matchTownsName',
      'storeModelData'
    ])
  },
  watch: {
    townsIdList(nv) {
      let len = 0;
      if(Array.isArray(nv) && nv.length) {
        nv.forEach((el, index, arr) => {
          arr[index] = [...new Set(el)];
          len += arr[index].length;
        })
      }
      this.matchTownsName({ $http: this.$http, regionObj: this.currentRegion, townIdList: len ? nv : [] });
    },
    affectedTownsList(nv) {
      setTimeout(() => {
        this.storeModelData({ attr: 'isAnalyzing', value: false });
        this.levelData = levelDataConfig[this.analysisType_global];

        for(let i = 0; i < nv.length; i++) {
          let data = nv[i];
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
}
</script>

<style scoped lang="scss">
#effectedAreaPanel {
  width: 100%;
  min-height: 200px;
  max-height: 393px;
  overflow-y: auto;
  font-size: 12px;
}

main {
  text-align: center;
  padding: 20px 0;
  font-size: 16px;
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
</style>
