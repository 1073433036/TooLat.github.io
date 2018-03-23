<template>
  <main id="StationLiveDetail" :style="{ top: pos.y + 'px', left: pos.x + 'px' }" ref="panel">
    <ul class="els">
      <li class="cf">
        <div class="name">站点名称</div>
        <div class="val">{{ info.info.cname }}</div>
      </li>
      <li class="cf">
        <div class="name">站号</div>
        <div class="val">{{ info.station_id }}</div>
      </li>
      <li class="cf" v-for="el of elements" :key="el.key">
        <div class="name">{{ el.name }}</div>
        <div class="val">{{ el.key | filterStationEles(info.elements) }}</div>
      </li>
      <li class="cf">
        <div class="name">数据时间</div>
        <div class="val">{{ info.time }}</div>
      </li>
    </ul>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class StationLiveDetail extends Vue {
    @Getter('decisionStore/stationLiveDetailInfo_global') info
    pos: any = { x: 0, y: 0 }
    elements: any[] = [
      { key: 'temp', name: '气温' },
      { key: 'ps', name: '气压' },
      { key: 'rh', name: '湿度' },
      { key: 'wd3smaxdf', name: '极大风速' },
      { key: 'wd3smaxdd', name: '极大风向' },
      { key: 'tempdaymax',  name: '日最高温' },
      { key: 'tempdaymin',  name: '日最低温' },
      { key: 'rfhour', name: '小时雨量' },
      { key: 'rfday', name: '日雨量' },
    ]

    mounted() {
      this.computedPos()
    }

    computedPos() {
      let x = this.info.pos.x,
          y = this.info.pos.y
      let el = <HTMLDivElement>this.$refs.panel
      let elWidth = el.clientWidth,
          elHeight = el.clientHeight
      this.pos.x = x - elWidth / 2
      // this.pos.y = (y - 65 < elHeight) ? (y - 20) : (y - elHeight - 65)
      let doc: any = window['document'].documentElement
      let f = doc.style.fontSize.slice(0, -2)
      let r = f / 192
      this.pos.y = (y - 65*r < elHeight) ? (y - 20*r) : (y - elHeight - 65*r)
    }

    @Watch('info')
    oninfoChanged (val: any, oldVal: any) {
      if (val) this.computedPos()
    }
  }
</script>

<style lang='scss' scoped>
#StationLiveDetail {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  width: 180px;
  background: #fff;
  box-shadow: 0 0 10px #8d9db5;
  ul.els {
    li {
      line-height: 22px;
      .name, .val {
        float: left;
        width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .name {
        color: #575757;
      }
      .val {
        color: #989898;
      }
    }
  }
}
</style>