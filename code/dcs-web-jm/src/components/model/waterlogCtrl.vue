<template>
  <div class="model-ctrl" id="waterlog-ctrl">
    <ul>
      <li>
        <span>显示内涝点统计表格</span>
        <el-switch v-model="statTableShow"
                   on-text=""
                   off-text=""
                   off-color="#e4e8f1"
                   @change="toggleWaterlogStatTable">
        </el-switch>
      </li>
      <!--<li>
        <el-button :loading="isGenerating"
                   class="generate-report"
                   style="margin: 4px 0px 10px 0px;"
                   @click="generateReport">
          {{ isGenerating ? '生成中' : '生成报告' }}
        </el-button>
      </li>-->
    </ul>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      statTableShow: false,
      isGenerating: false
    }
  },
  mounted() {
    this.statTableShow = this.isShowWaterlogStat;
  },
  computed: {
    ...mapGetters([
      'isShowWaterlogStat',
      'currentRegion',
      'dateTime',
      'poiFstData'
    ])
  },
  methods: {
    ...mapActions([
      'toggleWaterlogStatTable',
      'showInfoTip_global'
    ]),
    generateReport() {
      if(!this.poiFstData.length) {
        this.showInfoTip_global({ text: '当前无影响区域' });
        return;
      }
      if(this.isGenerating)
        return;
      this.isGenerating = true;
      const url = `http://10.148.83.228:9020/data/downWaterlog?cityId=${this.currentRegion.cityId}&date=${this.dateTime.Format('yyyy-MM-dd HH:00:00')}`;
      let aLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
      aLink.href = url;
      //自动触发点击事件
      let ev = document.createEvent('MouseEvents');
      ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      aLink.dispatchEvent(ev);
      this.isGenerating = false;
      this.showInfoTip_global({ type: 'success', text: '生成内涝报告成功' });
    }
  },
  watch: {
    isShowWaterlogStat(nv) {
      if(nv === this.statTableShow)
        return;
      this.statTableShow = nv;
    }
  }
}
</script>
<style lang="scss" scoped>
#waterlog-ctrl {
  ul {
    width: 100%;
    position: relative;
    display: inline-block;
    font-size: 0;
    li {
      width: calc(100% - 30px);
      height: 40px;
      position: relative;
      display: inline-block;
      line-height: 40px;
      font-size: 12px;
      margin: 0px 10px 0px 20px;
      span {
        height: 100%;
        position: relative;
        display: inline-block;
      }
      .el-switch {
        position: absolute;
        right: 0;
        top: 10px;
      }
    }
  }
}
</style>
