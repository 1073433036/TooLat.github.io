<template>
  <main id="MatchingTyphPanel" class="global-panel" v-drag>
    <header>
      台风匹配 （{{ tsForMatching.intlid }} {{ tsForMatching.tscname }}）
      <em class="close" @click="closePanel"></em>
    </header>
    <figure v-loading="isLoading" style="margin: 0;">
      <div class="content">
        <ul class="opt">
          <li v-for="(el, key) in matchingOptionData" :key="key">
            <span>{{ el.name }}</span>
            <input type="text" v-model="el.value">
          </li>
        </ul>
        <div class="matching-btn" @click="matchingTyph">开始匹配</div>
      </div>
    </figure>
    <transition name="fade">
      <div class="result" v-if="hasMatching"> 
        <div class="title">匹配结果</div>
        <ul class="ty-list scroll-bar">
          <template v-if="matchingTyphs.length" >
            <li v-for="el of matchingTyphs" 
                :key="el.tsid" 
                @click="toggleMatchingTyphSel(el)"
                :class="{'on': el.tsid === selectedMatchingTyph}">
              {{ el.intlid + ' ' + (el.cname ? el.cname : '未命名') }}
            </li>
          </template>
          <li class="no-typh" v-else>无相似台风</li>
        </ul>
      </div>
    </transition>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  import { typhoonClient } from '../../util/clientHelper'
  import { TyphoonHelper } from '../../util/TyphoonHelper'

  let L: any, zmap: any
  let typhoonLayer: any = null

  @Component
  export default class MatchingTyphPanel extends Vue {
    @Prop() tsForMatching
    @Prop() closePanel

    allTyphoon: any = {}
    matchingOptionData = {
      // lonrange: { name: '经度范围', value: 2 },
      // latrange: { name: '纬度范围', value: 2 },
      angle: { name: '角度比重', value: 30 },
      anglediff: { name: '角度变化比重', value: 30 },
      speed: { name: '移速比重', value: 30 },
      speeddiff: { name: '移速变化比重', value: 30 },
      strength: { name: '强度比重', value: 30 }
    }
    matchingTyphs: any[] = []
    selectedMatchingTyph: string | null = null
    hasMatching: boolean = false
    isLoading: boolean = false

    async mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      let res = await typhoonClient.findTyphoonInfo()
      if (res && Array.isArray(res)) {
        for (let el of res) {
          this.allTyphoon[el.tsid] = el
        }
      }
    }

    beforeDestroy() {
      this.removeTyph()
      L = null
      zmap = null
    }

    async matchingTyph() {
      this.isLoading = true
      let tsid = this.tsForMatching.tsid
      // let datetime = moment().format('YYYY-MM-DD HH:00:00')
      // let lonrange = this.matchingOptionData.lonrange.value
      // let latrange = this.matchingOptionData.latrange.value
      let angle = this.matchingOptionData.angle.value
      let anglediff = this.matchingOptionData.anglediff.value
      let speed = this.matchingOptionData.speed.value
      let speeddiff = this.matchingOptionData.speeddiff.value
      let strength = this.matchingOptionData.strength.value
      
      let res = await typhoonClient.matchingTyph(tsid, angle, anglediff, speed, speeddiff, strength)
      this.hasMatching = true
      this.isLoading = false
      if (res && Array.isArray(res)) {
        res.sort((a, b) => Number(b.intlid) - Number(a.intlid))
        this.matchingTyphs = res
      } else
        this.matchingTyphs = []
    }

    toggleMatchingTyphSel(el) {
      this.selectedMatchingTyph = this.selectedMatchingTyph === el.tsid ? null : el.tsid
    }

    @Watch('selectedMatchingTyph')
    onselectedMatchingTyphChanged (val: number, oldVal: number) {
      if (val)
        this.drawTyph(val)
      if (oldVal)
        this.removeTyph()
    }

    // 绘制台风
    async drawTyph(tsid) {
      let helper = new TyphoonHelper(zmap)
      let data = await this.getTyphData(tsid)
      if (!data) {
        Vue['prototype']['$message']({
          type: 'warning',
          message: '台风数据获取失败'
        })
        return
      }
      let layer: any = helper.drawTy(data)
      typhoonLayer = layer.tyLayerGroup
    }

    // 根据台风id获取台风数据
    async getTyphData(tsid) {
      let res = await typhoonClient.getTyphoon('BCGZ', tsid)
      if (!res || !res.real || !res.real.length) return false
      let el = this.allTyphoon[tsid]
      let json: any = {
        tsid,
        tscname: (el.info && el.info.cname) ? el.info.cname : null,
        tsename: (el.info && el.info.ename) ? el.info.ename : null,
        real: [],
        fst: []
      }
      res.real.sort((a, b) => a.datetime - b.datetime)
      for (let opt of res.real) {
        let real = this.formartTyphData(opt)
        json.real.push(real)
      }
      if (res.forecast && Array.isArray(res.forecast)) {
        res.forecast.sort((a, b) => a.leadtime - b.leadtime)
        for (let opt of res.forecast) {
          if (!opt.location.lon || !opt.location.lat) continue
          let fst = this.formartTyphData(opt)
          json.fst.push(fst)
        }
      }
      return json
    }

    formartTyphData(opt) {
      return {
        time: moment(opt.datetime).format('YYYY-MM-DD HH:mm:ss'),
        leadtime: opt.leadtime || null,
        level: opt.elements.tcrank,
        lon: opt.location.lon,
        lat: opt.location.lat,
        ps: opt.elements.pressure,
        ws: opt.elements.windspeed,
        rr06: opt.elements.rr06 || null,
        rr07: opt.elements.rr07 || null,
        rr08: opt.elements.rr08 || null,
        rr10: opt.elements.rr10 || null
      }
    }

    // 删除台风
    removeTyph() {
      if (!typhoonLayer) return
      zmap.removeLayer(typhoonLayer)
      typhoonLayer = null
    }

    @Watch('tsForMatching')
    ontsForMatchingChanged (val: any, oldVal: any) {
      this.hasMatching = false
      this.removeTyph()
    }
  }
</script>

<style lang='scss' scoped>
#MatchingTyphPanel{
  position: absolute;
  top: 0;
  left: 290px;
  width: 195px;
  header {
    position: relative;
    color: #fff;
    line-height: 30px;
    text-indent: 10px;
    em.close {
      position: absolute;
      top: 0;
      right: 0;
      display: inline-block;
      width: 30px;
      height: 30px;
      color: #fff;
      background: url(~Img/typhoon/close.png) no-repeat center;
      cursor: pointer;
    }
  }
  .content {
    padding: 10px;
    ul.opt {
      li {
        position: relative;
        margin-bottom: 5px;
        height: 22px;
        line-height: 22px;
        span {
          position: absolute;
          display: inline-block;
          width: 75px;
          color: #999;
        }
        input[type="text"] {
          position: absolute;
          top: 0;
          left: 95px;
          padding: 0 10px;
          width: 58px;
          height: 20px;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          outline-color: #f0daaa;
        }
      }
    }
    .matching-btn {
      margin: 20px 0 0 0;
      text-align: center;
      line-height: 24px;
      border-radius: 12px;
      color: #808080;
      border: 1px solid #999;
      cursor: pointer;
      &:hover {
        color: #f3ac12;
        border: 1px solid #f3ac12;
      }
    }
  }
  .result {
    margin-top: 1px;
    padding: 10px;
    background: #fff;
    .title {
      position: relative;
      margin-bottom: 10px;
      color: #999;
      line-height: 12px;
      text-indent: 10px;
      font-weight: bold;
    }
    ul.ty-list {
      overflow: auto;
      max-height: 110px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      li {
        position: relative;
        cursor: pointer;
        line-height: 22px;
        color: #545454;
        text-indent: 10px;
        &:hover { text-decoration: underline; }
        &.on { background: #e8e8e8; }
        &.no-typh { color: #d23e3e; }
      }
    }
  }
  .scroll-bar {
    &::-webkit-scrollbar { width: 8px; }
    &::-webkit-scrollbar-thumb {
      background: #f0daaa;
      border-radius: 4px;
    }
  }
  .fade-enter-active { transition: all .3s ease; }
  .fade-enter {
    transform: translateY(-2px);
    opacity: 0;
  }
}
</style>