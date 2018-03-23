<template>
  <div class="model-ctrl" id="torrent-ctrl">
    <ul>
      <li>
        <span>显示全市水库名称</span>
        <el-switch v-model="isShowName"
                   on-text=""
                   off-text=""
                   off-color="#e4e8f1">
        </el-switch>
      </li>
      <li>
        <span>显示水库统计表格</span>
        <el-switch v-model="statRainShow"
                   on-text=""
                   off-text=""
                   off-color="#e4e8f1"
                   @change="toggleReservoirStatTable">
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
import { Helper } from '../../util/Helper'
import coordtransform from 'coordtransform'

let nameCollection = null;
export default {
  data() {
    return {
      isShowName: false,
      statRainShow: false,
      isGenerating: false
    }
  },
  mounted() {
    this.statRainShow = this.isShowStatRain;
  },
  beforeDestroy() {
    if(nameCollection) {
      let helper = new Helper(viewer);
      helper.removeCollection(nameCollection);
      helper = null;
    }
  },
  computed: {
    ...mapGetters([
      'isShowStatRain',
      'reservoirNamesList',
      'currentRegion',
      'dateTime',
      'reservoirData'
    ])
  },
  methods: {
    ...mapActions([
      'toggleReservoirStatTable',
      'showInfoTip_global'
    ]),
    generateReport() {
      if(!this.reservoirData.length) {
        this.showInfoTip_global({ text: '当前无影响区域' });
        return;
      }
      if(this.isGenerating)
        return;
      this.isGenerating = true;
      const url = `http://10.148.83.228:9020/data/downFlood?cityId=${this.currentRegion.cityId}&date=${this.dateTime.Format('yyyy-MM-dd HH:00:00')}`;

      let aLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
      aLink.href = url;
      //自动触发点击事件
      let ev = document.createEvent('MouseEvents');
      ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      aLink.dispatchEvent(ev);
      this.isGenerating = false;
      this.showInfoTip_global({ type: 'success', text: '生成山洪报告成功' });
    }
  },
  watch: {
    isShowStatRain(nv) {
      if(nv === this.statRainShow)
        return;
      this.statRainShow = nv;
    },
    isShowName(nv) {
      let helper = new Helper(viewer);
      if(nv) {
        if(!this.reservoirNamesList.length)
          return;
        let collection = helper.labelCollection();
        for(let p of this.reservoirNamesList) {
          let transCoor = coordtransform.wgs84togcj02(p.lon, p.lat);
          let label = helper.label(p.name, transCoor, .4, 'white', 'name_label', 'both', 5, 'black');
          collection.add(label);
        }
        helper.addCollection(collection);
        nameCollection = collection;
      } else {
        if(nameCollection) {
          helper.removeCollection(nameCollection);
          nameCollection = null;
        }
      }
      helper = null;
    }
  }
}
</script>
<style lang="scss" scoped>
#torrent-ctrl {
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
