<template>
  <div class="model-ctrl" id="geol-ctrl">
    <!--<ul>
      <li v-for="el in menu"
          :class="{'single-selected': el.selected}"
          @click="toggleGeoModel(el)">
        <em></em>
        <span v-text="el.name"></span>
      </li>
    </ul>-->
    <!--<ul>
      <li @click="toggleGeoFilePopup(true)" title="点击下载地质灾害风险报告">生成报告</li>
      &lt;!&ndash;<li @click="modelAnalyse">模型分析</li>&ndash;&gt;
    </ul>-->
    <el-button :loading="isGenerating"
               class="generate-report"
               style="margin: 10px 10px 10px 0px;"
               @click="generateReport">
      {{ isGenerating ? '生成中' : '生成报告' }}
    </el-button>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      selectedModelType: 'geology',
      isGenerating: false,
      menu: {
        geology: {
          selected: true,
          name: '临界降雨量判据法',
          modelName: 'geology_nc',
          element: 'geology',
          prefix: 'geology',
          ranges: [100, 90, 70, 45, 20]
        },
        geodisaster: {
          selected: false,
          name: '气象地质耦合法',
          modelName: 'geodisaster',
          element: 'warn',
          prefix: 'slide',
          ranges: {
            red: [3,4],
            orange: [2,3],
            yellow: [1,2],
            blue: [0.5,1]
          }
        }
      },
      timer: null
    }
  },
  computed: {
    ...mapGetters([
      'currentRegion',
      'dateForModel',
      'dateTime',
      'selectedModel',
      'modelRanges',
      'modelPoiList',
      'isModelAnalyzing'
    ])
  },
  mounted() {
    this.storeModelData({ attr: 'ranges', value: [100, 90, 70, 45, 20] });
    this.modelAnalyse();
  },
  methods: {
    ...mapActions([
      'toggleGeoFilePopup',
      'initGeolModel',
      'initGeologySites',
      'updateModelSites',
      'storeModelData',
      'showInfoTip_global'
    ]),
    toggleGeoModel(el) {
      for(let i in this.menu) {
        let opt = this.menu[i];
        opt.selected = !opt.selected;
        if(opt.selected) {
          this.storeModelData({ attr: 'ranges', value: opt.ranges });
          this.selectedModelType = i;
        }
      }
    },
    modelAnalyse() {
      let selectModel;
      for(let i in this.menu) {
        if(this.menu[i].selected)
          selectModel = this.menu[i];
      }
      const params = {
        model: selectModel.modelName === 'geology_nc' ? 'geology' : selectModel.modelName,
        datetime: this.dateForModel,
        $http: this.$http,
        regionObj: this.currentRegion,
        ranges: this.modelRanges
      };

      this.storeModelData({ attr: 'analysisType', value: 'geology' });
      this.initGeolModel(params);
    },
    generateReport() {
      if(this.isGenerating)
        return;

      this.isGenerating = true;

      const params = {
        cityId: this.currentRegion.cityId,
        timeStamp: this.dateForModel,
        year: this.dateTime.getFullYear(),
        issue: this.dateTime.Format('yyyyMMddHH'),
        name: '郑伟杰'
      };

      const url = `http://10.148.83.228:1995/JmDcs/word/create`;
      this.$http.jsonp(url, { params }).then(response => {
        let data = response.data;
        if(data === true || data === 'true') {
          this.showInfoTip_global({ text: '生成报告成功', type: 'success' });
          let aLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
          aLink.href = `http://10.148.83.228:1995/JmDcs/word/getWord?cityId=${this.currentRegion.cityId}`;
          aLink.download = `地质灾害风险等级报告${params.year}年第${params.issue}期`;
          //自动触发点击事件
          let ev = document.createEvent('MouseEvents');
          ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          aLink.dispatchEvent(ev);
        } else {
          this.showInfoTip_global({ text: '生成报告失败', type: 'error' });
        }
        this.isGenerating = false;
      }).catch(err => {
        this.isGenerating = false;
        this.showInfoTip_global({ text: '生成报告失败', type: 'error' });
      });
    }
  },
  watch: {
    selectedModelType() {
      if(this.timer)
        clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.modelAnalyse();
      }, 500);
    },
    dateForModel() {
      if(this.timer)
        clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.modelAnalyse();
      }, 500);
    }
  }
}
</script>
<style lang="scss" scoped>
$mainColor: #299dff;

#geol-ctrl {
  ul {
    li {
      width: 50%;
      height: 30px;
      position: relative;
      display: inline-block;
      line-height: 30px;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        color: $mainColor;
      }
      em {
        width: 12px;
        height: 12px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        margin: 9px 2px 9px 12px;
        background: url(../../assets/mainMenu/modelIcon.png) -116px -75px no-repeat;
      }
    }
    li.single-selected {
      color: $mainColor;
      em {
        background-position: -98px -75px!important;
      }
    }
    &:nth-child(2) {
      text-align: right;
      margin: 10px 0px 5px 0px;
      font-size: 0;
      li {
        width: 80px;
        height: 30px;
        position: relative;
        display: inline-block;
        margin-right: 10px;
        line-height: 30px;
        font-size: 12px;
        text-align: center;
        color: $mainColor;
        border: 1px solid $mainColor;
        border-radius: 4px;
        &:hover {
          background-color: $mainColor;
          color: white;
        }
      }
    }
  }
}
</style>
