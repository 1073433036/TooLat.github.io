<template>
  <main id="HydrologyReal" :style="{ top: pos.y + 'px', left: pos.x + 'px' }" ref="panel">
    <header>
      <div class="name">
        <template v-if="info.stationType === 'rivers'">
          {{ info.staname + '（' + info.code + '）' }}
        </template>
        <template v-else-if="info.stationType === 'reservoirs'">
          {{ info.name + '（' + info.code + '）' }}
        </template>
      </div>
      <div class="msg">
        {{ info.lon + ( info.lon > 0 ? '°E, ' : '°W, ' ) + info.lat + ( info.lat > 0 ? '°N': '°W' ) }}
      </div>
    </header>
    <ul>
      <li v-for="(opt, key) in elems[info.stationType]" :key="key">
        <div class="tl">{{ opt }}</div>
        <div :class="['val', {'no-data': false}]">
          {{ info[key] ? info[key] : '---' }}
          <span v-if="(key === 'alertlevel' || key === 'waterlevel' || key === 'fluctuate') && info[key]"> 米</span>
        </div>
      </li>
    </ul>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'

  @Component
  export default class HydrologyReal extends Vue {
    @Getter('systemStore/hydrologyRealInfo_global') hydrologyRealInfo_global: any
    pos: any = { x: 0, y: 0 }
    elems: any = {
      rivers: {
        alertlevel: '警戒水位',
        waterlevel: '当前水位',
        fluctuate: '水势',
        updatetime: '更新时间',
        river: '河流'
      },
      reservoirs: {
        alertlevel: '警戒水位',
        waterlevel: '当前水位',
        fluctuate: '水势',
        updatetime: '更新时间',
        address: '地址'
      }
    }

    get info(): any {
      let info = this.hydrologyRealInfo_global
      if (info.updatetime)
        info.updatetime = moment(info.updatetime).format('YYYY-MM-DD HH:mm:00')
      return info
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
#HydrologyReal {
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  width: 200px;
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
      width: 100%;
      line-height: 24px;
      text-indent: 5px;
      .tl,.val {
        float: left;
        width: 50%;
      }
      .tl {
        width: 35%;
        color: #b3b3b3;
      }
      .val {
        width: 65%;
        text-indent: 0;
        color: #545454;
        &.no-data { text-indent: 15px; }
      }
    }
  }
}
</style>