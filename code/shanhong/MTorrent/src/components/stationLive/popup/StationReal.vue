<template>
  <main id="StationRealPopup" :style="{ top: pos.y + 'px', left: pos.x + 'px' }" ref="panel">
    <header>
      <div class="name">{{
        info.info.cname === '揭东县'
        ? info.station_id
        : (info.info.cname + '（' + info.station_id + '）')
      }}</div>
      <div class="msg">{{ info.location.lon + ( info.location.lon > 0 ? '°E, ' : '°W, ' ) + info.location.lat + ( info.location.lat > 0 ? '°N': '°W' ) }}</div>
      <div class="msg" style="margin-bottom: 5px;">{{ info.datetime ? info.datetime : '---' }}</div>
    </header>
    <ul class="cf">
      <li class="cf" v-for="(opt, key) in elems" :key="key">
        <div class="tl">{{ opt.name }}</div>
        <div :class="['val', {'no-data': !info.elements || !info.elements[key] || info.elements[key] === -999.9 || info.elements[key] === -9999.9 || info.elements[key] === 9999 || info.elements[key] === -9999 || (key === 'dp' && info.elements[key] === 99) || (key === 'ps' && info.elements[key] === 333.29)}]">
          {{ (!info.elements || !(key in info.elements) || info.elements[key] === -999.9 || info.elements[key] === -9999.9 || info.elements[key] === 9999 || info.elements[key] === -9999 || (key === 'dp' && info.elements[key] === 99) || (key === 'ps' && info.elements[key] === 333.29)) ? '---' : info.elements[key] + ' ' + opt.unit }}
        </div>
      </li>
    </ul>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
    
  @Component
  export default class StationReal extends Vue {
    @Getter('systemStore/stationRealInfo_global') info: any
    pos: any = { x: 0, y: 0 }
    elems: any = {
      temp: { name: '气温', unit: '℃' },
      ps: { name: '气压', unit: 'hpa'},
      rfhour: { name: '降水', unit: 'mm' },
      dp: { name: '露点温度', unit: '℃' },
      wd2df: { name: '2分钟风', unit: 'm/s' },
      wd10df: { name: '10分钟风', unit: 'm/s' },
      wd10maxdf: {name: '最大风', unit: 'm/s' },
      rh: { name: '相对湿度', unit: '%' },
      rfday: { name: '日雨量', unit: 'mm' },
      tempdaymax: { name: '日最高温度', unit: '℃' },
      t24: { name: '24时变温', unit: '℃' },
      tempdaymin: { name: '日最低温度', unit: '℃' }
    }

    mounted() {
      let x = this.info.pos.x, y = this.info.pos.y
      let w = document.body.clientWidth,
          h = document.body.clientHeight
      let el = <HTMLDivElement>this.$refs.panel
      let elWidth = el.clientWidth,
          elHeight = el.clientHeight
      x = (w - x < elWidth) ? (x - elWidth - 10) : (x + 10)
      y = (h - y < elHeight) ? (y - elHeight - 10) : (y + 10)
      this.pos.x = x
      this.pos.y = y
    }
  }
</script>

<style lang='scss' scoped>
#StationRealPopup {
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  width: 300px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.35);
  header {
    margin-bottom: 5px;
    text-indent: 10px;
    line-height: 20px;
    border-bottom: 1px solid #b3b3b3;
    .name { color: #f3ac12; }
    .msg { color: #999; }
  }
  ul {
    li {
      float: left;
      width: 50%;
      line-height: 24px;
      text-indent: 5px;
      .tl,.val {
        float: left;
        width: 50%;
      }
      .tl { color: #b3b3b3; }
      .val {
        color: #545454;
        &.no-data { text-indent: 15px; }
      }
    }
  }
}
</style>
