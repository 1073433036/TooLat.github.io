<template>
  <main id="RiskPointVue" :style="{ top: pos.y + 'px', left: pos.x + 'px' }" ref="panel">
    <header>
      <div class="name">{{ info.name}}</div>
      <div class="msg">{{ info.lon + ( info.lon > 0 ? '°E, ' : '°W, ' ) + info.lat + ( info.lat > 0 ? '°N': '°W' ) }}</div>
      <div class="msg" style="margin-bottom: 5px;">{{ info.reporttime ? info.reporttime : '---' }}</div>
    </header>

    <ul class="cf">
      <li class="cf" v-for="(opt, key) in elems" :key="key">
        <div class="tl">{{ opt.name }}</div>
        <div :class="['val', {'no-data': !info || !info[key] || info[key] === -999.9 || info[key] === -9999.9}]">
          {{ (info && info[key] && info[key] !== -999.9 && info[key] !== -9999.9) ? info[key] + ' ' + opt.unit : '---' }}
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
  export default class riskPointInfoView extends Vue {
    @Getter('systemStore/riskPointInfo_global') info: any
    @Getter('systemStore/popupStatus_global') popupStatus_global: any
    pos: any = { x: 0, y: 0 }

    elems: any = {
      category: { name: '灾害类型', unit: ''},
      stability: { name: '稳定性', unit: '' },
      harmfulness: { name: '危险性', unit: '' },
      harmperson: { name: '受灾人数', unit: '' },
      pecuniaryloss: { name: '潜在经济损失', unit: '万' },
      prevent: {name: '预防要求', unit: '' },
      manager: { name: '负责人', unit: '' },
      cellphone: { name: '联系号码', unit: '' },
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
  #RiskPointVue {
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    width: 350px;
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
    .tl {
      float: left;
      width: 45%;
    }
    .val {
       float: left;
       width: 55%;
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
