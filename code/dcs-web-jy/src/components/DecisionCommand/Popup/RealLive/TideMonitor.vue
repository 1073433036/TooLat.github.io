<template>
  <main id="TideMonitor">
    <ul class="current-typh cf">
      <li class="text">
        <span>当前台风 :</span>
      </li>

      <template v-if="hasGetCurrentTyp">
        <li v-if="!currentTyph.length" class="no-typh">
          <span>当前没有台风</span>
        </li>
        <li v-for="el in currentTyph" :key="el.id"
            :class="['current-typh', {on: typhSelected_global == el.tsId}]">
          <span class="ty" @click="selectTyph(el.tsId)">{{el.id}} {{el.name}}</span>
          <i class="match-btn" @click="matchTyphoon(el)" title="匹配相似台风"></i>
        </li>
      </template>

      <li v-for="el in containedTyph_global" :key="el.id"
          :class="['select-typh', {on: typhSelected_global == el.tsId}]"
          v-if="!el.isCurrentTyph">
        <span class="ty" @click="selectTyph(el.tsId)">{{el.id}} {{el.name}}</span>
        <i @click="deleteHistTyph(el.tsId)">&times;</i>
        <i class="match-btn" @click="matchTyphoon(el)" title="匹配相似台风"></i>
      </li>
    </ul>

    <div class="m-ty" v-if="isMatchTyph">
      相似台风 ({{ typhForMatching.id }} {{ typhForMatching.name }})：
    </div>
    <ul class="matching-typh scroll-bar cf" v-if="isMatchTyph">
      <li v-if="!matchTyph.length">
        <span>无相似台风</span>
      </li>
      <li v-for="el of matchTyph" :key="el.intlid" :class="{on: el.tsid === matchTyphSelected}" v-else>
        <span @click="selectMatchTyph(el.tsid)">{{el.intlid}} {{el.cname || '未命名'}}</span>
      </li>
    </ul>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { typhoonClient } from '@/util/ClientHelper'
  import { TyphoonHelper } from '@/util/TyphoonHelper'
  import { lines } from '@/config/TyphoonArea'
  import moment from 'moment'

  let typhoonLayer: any = null,
      matchTyphoonLayer: any = null
  let lineArr: any[] = []

  @Component
  export default class TideMonitor extends Vue {
    @Getter('decisionStore/typhSelected_global') typhSelected_global
    @Getter('decisionStore/containedTyph_global') containedTyph_global
    @Action('decisionStore/toggleTyphTimelineStatus_global') toggleTyphTimelineStatus_global
    @Action('decisionStore/storeTyphData_global') storeTyphData_global
    @Action('decisionStore/selectTyph_global') selectTyph_global
    @Action('decisionStore/deleteHistTyph_global') deleteHistTyph_global

    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storeTyphPointEffect_global') storeTyphPointEffect_global

    isComponentAlive: boolean = true
    allTyphoon: any = {}
    hasGetCurrentTyp: boolean = false
    currentTyph: object[] = []
    isMatchTyph: boolean = false
    typhForMatching: any = {}
    matchTyph: TyphoonMatch[] = []
    matchTyphSelected: number | null = null

    playing: boolean = false

    created() {
      this.addAlarmLine()
      this.getPresentTyph()
    }

    beforeDestroy() {
      this.removeAlarmLine()
      this.removeTyph()
      this.removeMatchTyph()
      this.storePopupStatus_global({ key: 'typhPointEffect', action: false })
      let containedTyph = JSON.parse(JSON.stringify(this.containedTyph_global))
      for (let el of containedTyph) {
        this.deleteHistTyph_global(el.tsId)
      }
      this.isComponentAlive = false
    }

    // 警戒区
    addAlarmLine() {
      let L = window['L']
      let zmap = window['zmap']
      for (let opt of lines) {
        let line = L.polyline(opt.path, {
          color: opt.color,
          dashArray: [3, 6],
          opacity: 0.6,
          weight: 2 
        }).addTo(zmap)
        lineArr.push(line)
      }
    }

    removeAlarmLine() {
      for (let line of lineArr) {
        window['zmap'].removeLayer(line)
      }
      lineArr = []
    }

    // 获取当前台风
    async getPresentTyph() {
      let res: TyphoonInfo[] | false = await typhoonClient.findTyphoonInfo()
      if (!this.isComponentAlive) return
      this.hasGetCurrentTyp = true
      if (!res) return

      let nowDate: Date = new Date()
      nowDate.setHours(nowDate.getHours() - 12)

      this.currentTyph = []
      let currentTyph: TyphoonInfo[] = []

      for (let el of res) {
        this.allTyphoon[el.tsid] = el
        if (!el.maxtime || (new Date(nowDate).getTime() > new Date(el.maxtime).getTime())) continue
        let info = {
          id: el.intlid ? el.intlid : null,
          name: (el.info && el.info.cname) ?  el.info.cname : '未命名',
          tsId: el.tsid,
          isCurrentTyph: true
        }
        this.currentTyph.push(info)
        this.storeTyphData_global(info)
        currentTyph.push(el)
      }

      if (currentTyph.length) {
        currentTyph.sort((a, b) => b.maxtime - a.maxtime)
        this.selectTyph(currentTyph[0].tsid)
      }
    }

    selectTyph(tsId) {
      if (this.playing) return
      this.toggleTyphTimelineStatus_global('detail')
      if (this.typhSelected_global !== tsId)
        this.selectTyph_global(tsId)
    }

    @Watch('typhSelected_global')
    async ontyphSelected_globalChanged (val: any, oldVal: any) {
      if (oldVal) this.removeTyph()
      if (!val) return
      let json = await this.getTyphData(val)
      let helper: any = new TyphoonHelper(window['zmap'], this.pointClickCallbackFunc)
      let layer: any = helper.drawTy(json)
      typhoonLayer = layer.tyLayerGroup
      helper = null
    }

    // 获取台风具体数据
    async getTyphData(tsid) {
      let res: { real: TyphRealDetail[], forecast: TyphFstDetail[] } | false = await typhoonClient.getTyphoon(tsid)
      if (!res) {
        Vue['prototype']['$message']({ type: 'error', message: '台风数据获取失败' })
        return
      }

      let el = this.allTyphoon[tsid]
      let json: any = {
        tsid: tsid,
        tscname: (el.info && el.info.cname) ? el.info.cname : null,
        tsename: (el.info && el.info.ename) ? el.info.ename : null,
        real: [],
        fst: []
      }

      if (res.real && Array.isArray(res.real)) {
        res.real.sort((a, b) => a.datetime - b.datetime)
        for (let opt of res.real) {
          let real = formartTyphData(opt)
          json.real.push(real)
        }
      }
      if (res.forecast && Array.isArray(res.forecast)) {
        res.forecast.sort((a, b) => a.leadtime - b.leadtime)
        for (let opt of res.forecast) {
          if (!opt.location.lon || !opt.location.lat) continue
          let fst = formartTyphData(opt)
          json.fst.push(fst)
        }
      }

      return json
    }

    // 台风详情点点击事件
    async pointClickCallbackFunc (point) {
      let lon = point.lon, lat = point.lat
      let json = JSON.parse(JSON.stringify(point))
      this.storePopupStatus_global({ key: 'typhPointEffect', action: true })
      this.storeTyphPointEffect_global(json)
    }

    removeTyph() {
      if (!typhoonLayer) return
      window['zmap'].removeLayer(typhoonLayer)
      typhoonLayer = null
    }

    deleteHistTyph(tsId) {
      this.deleteHistTyph_global(tsId)
      if (this.typhForMatching.tsId && this.typhForMatching.tsId == tsId) {
        this.isMatchTyph = false
        this.typhForMatching = {}
        this.matchTyph = []
        this.removeMatchTyph()
      }
    }

    // --- 相似台风 ---
    async matchTyphoon(el) {
      this.typhForMatching = el
      let res: TyphoonMatch[] | false = await typhoonClient.matchingTyph(el.tsId)
      this.isMatchTyph = true
      if (res) {
        this.matchTyph = res
      } else {
        Vue['prototype']['$message']({ type: 'error', message: '相似台风获取失败' })
        this.matchTyph = []
      }
    }

    async selectMatchTyph(tsid) {
      if (this.matchTyphSelected === tsid) {
        this.removeMatchTyph()
        this.matchTyphSelected = null
        return
      }

      if (this.matchTyphSelected) this.removeMatchTyph()
      this.matchTyphSelected = tsid
      let json = await this.getTyphData(tsid)
      let helper: any = new TyphoonHelper(window['zmap'], this.pointClickCallbackFunc)
      let layer: any = helper.drawTy(json)
      matchTyphoonLayer = layer.tyLayerGroup
      helper = null
    }

    removeMatchTyph() {
      if (!matchTyphoonLayer) return
      window['zmap'].removeLayer(matchTyphoonLayer)
      matchTyphoonLayer = null
      this.matchTyphSelected = null
    }

  }

  function formartTyphData(opt) {
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
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#TideMonitor {
  margin: 10px 0;
  padding: 0 10px;
  background: #f5f5f5;
  ul.current-typh {
    li {
      height: 30px;
      line-height: 30px;
      span {
        display: inline-block;
        width: 100%;
        color: #5a5e66;
        &.ty {
          width: calc(100% - 60px);
          &:hover {
            text-decoration: underline;
          }
        }
      }
      i {
        display: block;
        width: 30px;
        height: 30px;
        float: right;
        font-size: 26px;
        line-height: 30px;
        text-align: center;
        color: #9c9fa7;
        cursor: pointer;
        &:hover {
          color: #666;
        }
        &.match-btn {
          background: url(~Img/DecisionCommand/match.png) no-repeat center / 40% 40%;
        }
      }
      &.text {
        span {
          color: #000;
        }
      }
      &.no-typh {
        span {
          color: #f4435b;
        }
      }
      &.current-typh, &.select-typh {
        cursor: pointer;
      }
      &.on span{
        color: $themeColor;
      }
    }
  }

  .m-ty {
    height: 30px;
    line-height: 30px;
  }
  ul.matching-typh {
    overflow: auto;
    max-height: 90px;
    li {
      height: 30px;
      line-height: 30px;
      span {
        display: inline-block;
        width: 100%;
        color: #5a5e66;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
      &.on span{
        color: $themeColor;
      }
    }
  }
}
</style>

<style lang="scss">
@import '../../../../styles/theme.scss';
.typhoon_icon{
  border: none;
  background: none;
  top: -9px; /*no*/
  left: -9px; /*no*/
}
.rotate_ani { animation: rotate_ani 1s infinite linear; }
.positive_rotate_ani { animation: positive_rotate_ani 1s infinite linear; }
@keyframes rotate_ani{
  0% { transform: rotate(0deg); }
  50% { transform: rotate(-180deg); }
  100% { transform: rotate(-360deg); }
}
@keyframes positive_rotate_ani{
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}
.leaflet-popup-content { margin: 10px; /*no*/ }
.leaflet-popup-content-wrapper { border-radius: 4px; /*no*/ }
.leaflet-popup-tip {
  width: 12px; /*no*/
  height: 12px; /*no*/
}
.typhoon-popup {
  ul {
    li {
      &:first-child {
        margin-bottom: 6px; /*no*/
        span {
          color: $themeColor !important;
          font-weight: bold;
        }
      }
      span {
        display: inline-block;
        line-height: 20px; /*no*/
        &:first-child {
          width: 70px; /*no*/
          color: #b3b3b3;
        }
        &:last-child {
          width: 90px; /*no*/
          color: #545454;
        }
      }
    }
  }
}

// .wm-bindPopup {
//   ul {
//     li {
//       &:first-child {
//         margin-bottom: 6px; /*no*/
//         span {
//           color: #f3ac12 !important;
//           font-weight: bold;
//         }
//       }
//       span {
//         display: inline-block;
//         line-height: 18px; /*no*/
//         &:first-child {
//           width: 50px; /*no*/
//           color: #b3b3b3;
//         }
//         &:last-child {
//           width: 100px; /*no*/
//           color: #545454;
//         }
//       }
//     }
//   }
// }
</style>
