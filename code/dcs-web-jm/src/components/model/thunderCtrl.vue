<template>
  <div class="model-ctrl" id="thunder-ctrl">
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
      isGenerating: false,
      timer: null
    }
  },
  computed: {
    ...mapGetters([
      'currentRegion',
      'dateForModel',
      'dateTime',
      'selectedModel',
      'isModelAnalyzing',
      'regionBounds',
      'hasEffectedTowns'
    ])
  },
  mounted() {
    this.storeModelData({ attr: 'analysisType', value: 'thunder' });
    this.thunderModelAnalysis();
  },
  methods: {
    ...mapActions([
      'initThunderModel',
      'storeModelData',
      'showInfoTip_global'
    ]),
    thunderModelAnalysis() {
      let params = {
        $http: this.$http,
        regionObj: this.currentRegion,
        bounds: this.regionBounds
      };
      let datetime = this.dateTime;
      let minute = datetime.getMinutes();
      minute -= minute%6;
      minute = minute < 10 ? '0' + minute : minute;
      params.datetime = `${datetime.Format('yyyy-MM-dd HH')}:${minute}:00`;
      this.initThunderModel(params);
    },
    generateReport() {
      if(!this.hasEffectedTowns) {
        this.showInfoTip_global({ text: '当前无影响区域' });
        return;
      }
      if(this.isGenerating)
        return;
      this.isGenerating = true;

      let datetime = this.dateTime;
      let minute = datetime.getMinutes();
      minute -= minute%6;
      minute = minute < 10 ? '0' + minute : minute;
      datetime = `${datetime.Format('yyyy-MM-dd HH')}:${minute}:00`;

      const url = `http://10.148.83.228:9020/data/downEnTitan?cityId=${this.currentRegion.cityId}&date=${datetime}`;

      let aLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
      aLink.href = url;
      //自动触发点击事件
      let ev = document.createEvent('MouseEvents');
      ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      aLink.dispatchEvent(ev);
      this.isGenerating = false;
      this.showInfoTip_global({ type: 'success', text: '生成雷电报告成功' });
    }
  },
  watch: {
    dateTime() {
      if(this.selectedModel !== 'thunder')
        return;
      if(this.timer)
        clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.thunderModelAnalysis();
        this.timer = null;
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
