<template>
  <main id="TyphoonInfoPanel" class="global-panel" v-drag>
    <header>主控制面板</header>
    <figure v-loading="loading" element-loading-text="正在获取台风数据">
      <div class="content">

        <div class="title">台风列表</div>
        <ul class="ty-list selected">
          <template v-if="presentTyphs.length">
            <li :class="['currentTy', {'on': el.tsid === typhSelected}]" 
                v-for="el of presentTyphs" 
                :title=" el.tsid === typhSelected ? '隐藏该台风' : '显示该台风'"
                @click="toggleTyphSelected(el)"
                :key="el.tsid">
              {{ el.intlid + ' ' + ((el.info && el.info.cname) ? el.info.cname : '未命名') }}
              <em class="similar-btn" title="相似台风" @click.stop="querySimilarTyph(el)"></em>
            </li>
          </template>
          <li v-else class="no-typh">当前没有台风</li>
          <template v-if="selectedTyphs.length">
            <li :class="['selectedTy', {'on': el.tsid === typhSelected}]" 
                v-for="(el, index) of selectedTyphs" 
                :title=" el.tsid === typhSelected ? '隐藏该台风' : '显示该台风'"
                @click="toggleTyphSelected(el)"
                :key="el.tsid">
              {{ el.intlid + ' ' + ((el.info && el.info.cname) ? el.info.cname : '未命名') }}
              <em class="similar-btn" title="匹配相似台风" @click.stop="querySimilarTyph(el)"></em>          
              <em class="close-btn" title="移除该台风" @click.stop="removeTyphSelected(el, index)"></em>
            </li>
          </template>
        </ul>

        <div class="title">
          历史台风选择
          <div class="year-select" @mouseenter="isYearPanelShow = true" @mouseleave="isYearPanelShow = false">
            <span>{{ yearSelected }}</span>
            <ul v-show="isYearPanelShow && yearsArr.length">
              <li v-for="year of yearsArr" :key="year" @click="toggleYear(year)" :class="{on: year === yearSelected}">
                {{ year }}
              </li>
            </ul>
          </div>
        </div>
        <ul class="ty-list history scroll-bar" v-if="historyTyphs.length">
          <li v-for="el of historyTyphs" :key="el.tsid" @click="toggleTyhpSelected(el)">
            {{ el.intlid + ' ' + ((el.info && el.info.cname) ? el.info.cname : '未命名') }}
          </li>
        </ul>

        <div class="search">
          <input type="text" v-model="searchTyphText" placeholder="台风搜索">
        </div>
        <div class="search-wrapper" v-if="searchTyphs.length">
          <ul class="ty-list history scroll-bar">
            <li v-for="el of searchTyphs" :key="el.tsid" @click="toggleTyhpSelected(el)">
              {{ el.intlid + ' ' + ((el.info && el.info.cname) ? el.info.cname : '未命名') }}
            </li>
          </ul>
        </div>

      </div>
    </figure>
    <transition name="slide-fade">
      <component :is="matchTyphView" :tsForMatching="tsForMatching"
          :closePanel="closeMatchingPanel"></component>
    </transition>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'
  import { typhoonClient } from '../../util/clientHelper'
  import { TyphoonHelper } from '../../util/TyphoonHelper'
  import MatchingTyphPanel from './MatchingTyphPanel.vue'

  let L: any, zmap: any
  let allTyphoon: any[] = []
  let typhoonLayer: any = {}

  @Component
  export default class TyphoonInfoPanel extends Vue {
    loading: boolean = true
    presentTyphs: any[] = []
    selectedTyphs: any[] = []
    typhSelected: number | null = null
    isYearPanelShow: boolean = false
    yearSelected: number = new Date().getFullYear()
    yearsArr: number[] = []
    historyTyphs: any[] = []
    searchTyphText: string = ''
    searchTyphs: any[] = []
    searchTimeout: any = null
    tsForMatching: any = null
    matchTyphView: any = null
    // fcids: any =  {
    //   BABJ: { name: '北京', selected: false },
    //   BCGZ: { name: '广州', selected: false },
    //   PGTW: { name: '关岛', selected: false },
    //   RJTD: { name: '日本', selected: false },
    //   VHHH: { name: '香港', selected: false },
    //   ECMWF: { name: '欧洲', selected: false },
    //   GZRD: { name: '热带所', selected: false },
    // }

    mounted() {
      this.initTyphoon()
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
    }

    // 获取当前台风
    async initTyphoon() {
      let res = await typhoonClient.findTyphoonInfo()
      this.loading = false
      if (!res || !Array.isArray(res)) {
        Vue['prototype']['$message']({
          type: 'warning',
          message: '台风数据获取失败'
        })
        return
      }
      allTyphoon = []
      for (let el of res) {
        let flag = Date.now() - 12*60*60*1000 < el.maxtime
        if ((el.info && el.info.cname) || flag)
          allTyphoon.push(el)
      }

      // 当前台风、历史年份
      let eachTyphDate: any = null
      for (let el of allTyphoon) {
        eachTyphDate = el.maxtime
        if (!eachTyphDate) continue
        if (Date.now() - 12*60*60*1000 < eachTyphDate) {
          this.presentTyphs.push(el)
          continue
        }

        let year = new Date(eachTyphDate).getFullYear()
        if (!this.yearsArr.includes(year))
          this.yearsArr.push(year)
      }
      if (this.presentTyphs.length)
        this.typhSelected = this.presentTyphs[0].tsid
      this.yearsArr.sort((a, b) => b - a)
      this.yearSelected = this.yearsArr[0]
      this.getHistoryTyph(this.yearSelected)
    }

    // 历史台风年份选择
    toggleYear(year) {
      this.yearSelected = year
      this.isYearPanelShow = false
      this.getHistoryTyph(year)
    }

    // 根据年份获取历史台风
    getHistoryTyph(year) {
      this.historyTyphs = []
      let historyTyphs: any[] = []
      let startTime = new Date('' + year).getTime()
      let endTime = new Date('' + (Number(year) + 1)).getTime()
      for (let el of allTyphoon) {
        let maxtime = el.maxtime
        if (!maxtime) continue
        if (maxtime >= startTime && maxtime < endTime) {
          let isPresentTyph: boolean = false
          for (let opt of this.presentTyphs) {
            if (opt.tsid === el.tsid) {
              isPresentTyph = true
              break
            }
          }
          if (!isPresentTyph) historyTyphs.push(el)    // 排除当前台风
        }
      }
      historyTyphs.sort((a, b) => Number(a.intlid) - Number(b.intlid))
      this.historyTyphs = historyTyphs
    }

    // 查询相似台风
    querySimilarTyph(el) {
      if (this.tsForMatching && this.tsForMatching.tsid === el.tsid) {
        this.tsForMatching = null
        this.matchTyphView = null
      } else {
        this.tsForMatching = el
        this.matchTyphView = MatchingTyphPanel
      }
    }

    // 显示、隐藏 台风列表 台风
    toggleTyphSelected(el) {
      this.typhSelected = el.tsid === this.typhSelected ? null : el.tsid
    }

    // 移除 台风列表 台风
    removeTyphSelected(el, index) {
      if (el.tsid === this.typhSelected) this.typhSelected = null
      this.selectedTyphs.splice(index, 1)
    }

    // 历史台风、搜索台风 -- 选择台风
    toggleTyhpSelected(el) {
      for (let i = 0; i < this.selectedTyphs.length; i++) {
        let opt = this.selectedTyphs[i]
        if (opt.tsid === el.tsid) {
          this.typhSelected = el.tsid
          return
        }
      }
      if (this.selectedTyphs.length === 4)
        this.selectedTyphs.splice(0, 1)
      this.selectedTyphs.push(el)
      this.typhSelected = el.tsid
    }

    // 台风列表选中台风       // 绘制 val台风 删除 oldVal台风
    @Watch('typhSelected')
    ontyphSelectedChanged (val: number, oldVal: number) {
      if (val)
        this.drawTyph(val)
      if (oldVal)
        this.removeTyph(oldVal)
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
      typhoonLayer[tsid] = layer.tyLayerGroup
    }

    // 根据台风id获取台风数据
    async getTyphData(tsid) {
      let res = await typhoonClient.getTyphoon('BCGZ', tsid)
      if (!res || !res.real || !res.real.length) return false
      let json: any = {}
      for (let el of allTyphoon) {
        if (el.tsid == tsid) {
          json = {
            tsid,
            tscname: (el.info && el.info.cname) ? el.info.cname : null,
            tsename: (el.info && el.info.ename) ? el.info.ename : null,
            real: [],
            fst: []
          }
          break
        }
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
    removeTyph(tsid) {
      if (!typhoonLayer[tsid]) return
      zmap.removeLayer(typhoonLayer[tsid])
      delete typhoonLayer[tsid]
    }

    // 台风搜索
    @Watch('searchTyphText')
    onsearchTyphTextChanged (val: string, oldVal: string) {
      if (this.searchTimeout) clearTimeout(this.searchTimeout)
      if (!val) {
        this.searchTyphs = []
        return
      }
      this.searchTimeout = setTimeout(async () => {
        this.searchTimeout = null
        let res = await typhoonClient.findTyphoonInfo(val)
        if (!res || (Array.isArray(res) && !res.length))
          this.searchTyphs = []
        else
          this.searchTyphs = res
      }, 500)
    }

    // 关闭台风匹配面板
    closeMatchingPanel() {
      this.matchTyphView = null
    }
  }
</script>

<style lang='scss' scoped>
#TyphoonInfoPanel {
  top: 60px;
  left: 0;
  width: 280px;
  header {
    color: #fff;
    line-height: 30px;
    text-indent: 15px;
  }
  figure {
    margin: 0;
  }
  .content {
    padding: 0 10px;
    user-select: none;
    .title {
      position: relative;
      color: #999;
      line-height: 30px;
      text-indent: 10px;
      font-weight: bold;
      .year-select {
        z-index: 10;
        position: absolute;
        top: 0;
        right: 0;
        line-height: 20px;
        text-indent: 5px;
        span {
          position: relative;
          margin-top: 5px;
          display: inline-block;
          width: 50px;
          height: 20px;
          color: #f3ac12;
          cursor: pointer;
          &::after {
            position: absolute;
            content: '';
            top: 7px;
            right: 0;
            border-top: 6px solid #f3ac12;
            border-right: 4px solid transparent;
            border-left: 4px solid transparent;
          }
        }
        ul {
          transform: translateX(5px);
          width: 48px;
          max-height: 100px;
          text-align: center;
          text-indent: 0;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          overflow: auto;
          &::-webkit-scrollbar { width: 4px; }
          &::-webkit-scrollbar-track-piece { background: #fff; }
          &::-webkit-scrollbar-thumb {
            background: #f0daaa;
            border-radius: 2px;
          }
          li {
            cursor: pointer;
            background: #fff;
            &.on { color: #d23e3e; }
          }
        }
      }
    }
    ul.ty-list {
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
      }
    }
    ul.selected {
      margin-bottom: 10px;
      li {
        .similar-btn {
          display: inline-block;
          position: absolute;
          top: 0;
          width: 22px;
          height: 22px;
          background: url(~Img/typhoon/match.png) no-repeat center;
        }
        &.currentTy {
          color: #d23e3e;
          .similar-btn { right: 0; }
        }
        &.no-typh {
          color: #d23e3e;
          &:hover { text-decoration: none; }
        }
        &.selectedTy {
          .similar-btn { right: 22px; }
          .close-btn {
            display: inline-block;
            position: absolute;
            top: 0;
            right: 0;
            width: 22px;
            height: 22px;
            background: url(~Img/typhoon/delete.png) no-repeat center;
          }
        }
      }
    }
    ul.history {
      overflow: auto;
      max-height: 110px;
      li {
        cursor: pointer;
      }
    }
    .search {
      position: relative;
      padding: 20px 0 10px;
      input[type="text"] {
        padding: 0 30px 0 15px;
        width: 213px;
        height: 24px;
        line-height: 24px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        outline-color: #f0daaa;
      }
      &::after {
        position: absolute;
        top: 27px;
        right: 7px;
        content: '';
        width: 12px;
        height: 12px;
        background: url(~Img/typhoon/search.png); 
        cursor: pointer;
      }
    }
    .search-wrapper { padding-bottom: 10px; }
  }
  .scroll-bar {
    &::-webkit-scrollbar { width: 8px; }
    &::-webkit-scrollbar-thumb {
      background: #f0daaa;
      border-radius: 4px;
    }
  }
  .slide-fade-enter-active { transition: all .3s ease; }
  .slide-fade-leave-active { transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0); }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(-5px);
    opacity: 0;
  }
}
</style>

<style lang='scss'>
#TyphoonInfoPanel {
  figure {
    .el-loading-spinner {
      top: 40%;
    }
  }
}
</style>