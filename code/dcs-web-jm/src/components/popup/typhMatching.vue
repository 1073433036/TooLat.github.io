<template>
  <main id="typh-matching" v-drag="{handle: '.draggable'}">
    <header class="draggable">
      <h1>匹配台风列表</h1>
      <span @click="toggleTyphMatchingPopup_global(false)">
        <svg width="8" height="8">
          <path d="M 0,0 L 8,8 M 8,0 L 0,8" stroke="white" stroke-width="1px"></path>
        </svg>
      </span>
    </header>
    <main class="loading-wraper" v-loading="loading" element-loading-text="匹配历史台风中...">
      <section class="matching-result">
        <ul>
          <li v-for="el in typhData" @click.stop="showMatchedTyphoon(el.tsId)"
              :style="{backgroundColor: selectedMatchingTyph_global === String(el.tsId) ? '#DFE7F3': ''}">
            <a>{{el.desc}}</a>
          </li>
        </ul>
        <el-button class="generate-report"
                  style="margin: 10px 0px;"
                  @click.stop="showMatchingPopup">生成报告</el-button>
      </section>
    </main>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TyphHelper from '../../util/typhHelper'
import { getTyphDataById } from '../model/typhTimeline/typhUtil'

let typhEntities = {};

export default {
  data() {
    return {
      lon: 2,
      lat: 2,
      strenth: 30,
      angle: 30,
      angleDiff: 30,
      speed: 30,
      speedDiff: 30,

      typhData: null,
      loading: false,
    }
  },
  computed: {
    ...mapGetters([
      'dateTime',
      'currentRegion',
      'selectedModel',
      'selectedTyph_global',
      'isBefore03Typh_global',
      'typhMatchingPopup_global',
      'historyTyphIdArray_global',
      'selectedMatchingTyph_global'
    ])
  },
  mounted() {
    this.matchingTyph();
  },
  watch: {
    typhMatchingPopup_global(nv) {
      nv && this.matchingTyph();
    },
    selectedTyph_global(nv) {
      if(!nv)
        return;
      this.matchingTyph();
    }
  },
  destroyed() {
    for (let i in typhEntities) {
      let temp = typhEntities[i].typhEntity;
      typhEntities[i].removeTyphEntities(temp);
      delete typhEntities[i];
    }
    this.selectMatchingTyph_global(null);
  },
  methods: {
    ...mapActions([
      'showInfoTip_global',
      'selectMatchingTyph_global',
      'toggleTyphMatchingPopup_global',
      'toggleTyphReportPopup_global'
    ]),
    showMatchingPopup() {
      if(!this.selectedMatchingTyph_global) {
        this.showInfoTip_global({ text: '请选择台风！' });
        return;
      }
      this.toggleTyphReportPopup_global(true);
    },
    async matchingTyph() {
      if(!this.selectedTyph_global) {
        this.showInfoTip_global({ type: 'error', text: '请选择要匹配的台风' });
        return;
      }
      this.loading = true;
      const selectedTyphId = this.selectedTyph_global;
      /*let res = await this.$http.jsonp(`http://10.148.10.80:8111/discrete/typhoon/d10/${this.selectedTyph_global},${this.dateTime.Format('yyyy-MM-dd HH:mm:00')},${this.lon},${this.lat},${this.angle},${this.angleDiff},${this.speed},${this.speedDiff},${this.strenth}/JSONP/`);*/
      let res = await this.$http.get(`http://10.148.83.228:8921/typhoon/matchTyphoon?tsid=${this.selectedTyph_global}&w_windspeed=${this.strenth}&w_speed=${this.speed}&w_direction=${this.angle}&w_speed_change=${this.speedDiff}&w_direction_change=${this.angleDiff}`)
      if(selectedTyphId !== this.selectedTyph_global)
        return;
      if (!Array.isArray(res.data) || !res.data.length) {
        // insert error msg Here
        this.typhData = [];
        this.typhData.push({
          name: '无匹配结果',
          intId: null,
          tsId: null,
          cnName: null,
          desc: '无匹配结果'
        });
        this.loading = false;
        return;
      }

      /*let tsid = [],
          similarity = {};
      for (let item of res.data[0].string) {
        let itemSplited = item.split(',');
        let tid = itemSplited[0];
        tsid.push(tid);
        similarity[tid] = itemSplited[4];
      }

      let typhRes = await this.$http.jsonp(`http://10.148.10.80:8111/discrete/typhoon/d2/${tsid.join(';')},BCGZ/JSONP/`);
      if(!Array.isArray(typhRes.data) || selectedTyphId !== this.selectedTyph_global)
        return;

      let typhData = [];
      for(let tp of typhRes.data) {
        let sml = similarity[tp.tsid];
        const desc = `${tp.intlid} ${tp.tscname || ''}${tp.tsename ? '(' + tp.tsename + ')' : ''}${sml ? '(相似度' + sml + '%)' : ''}`;
        typhData.push({
          name: tp.tscname,
          enName: tp.tsename,
          intId: tp.intlid,
          tsId: tp.tsid,
          similarity: sml,
          desc
        });
      }*/
      let typhData = [];
      for(let tp of res.data) {
        const desc = `${tp.intlid} ${tp.cname || ''}${tp.ename ? '(' + tp.ename + ')' : ''}${'(相似度' + tp.weight*100 + '%)'}`;
        typhData.push({
          name: tp.cname,
          enName: tp.ename,
          intId: tp.intlid,
          tsId: tp.tsid,
          similarity: tp.weight*100,
          desc
        });
      }
      this.typhData = typhData;
      this.loading = false;
    },
    showMatchedTyphoon(tyid) {
      for (let i in typhEntities) {
        let temp = typhEntities[i].typhEntity;
        typhEntities[i].removeTyphEntities(temp);
        delete typhEntities[i];
        if (tyid === i)
          break;
      }
      if(this.selectedMatchingTyph_global === tyid) {
        this.selectMatchingTyph_global(null);
        return;
      }

      this.selectMatchingTyph_global(tyid);

      getTyphDataById(this.$http, tyid, this.isBefore03Typh_global)
        .then(data => {
          typhEntities[tyid] = new TyphHelper(viewer);
          typhEntities[tyid].drawTyph(data, true);
        });
    }
  }
}

// const historyTyphEffectOption_wind = [
//   { name: '最大风最大值', value: 'windmax_vel', fun: 'max', colorTable: 'wind' },
//   { name: '极值风最大值', value: 'windextrm_vel', fun: 'max', colorTable: 'wind' }
// ];
// const historyTyphEffectOption_rain = [
//   { name: '累计08时到08时雨量', value: 'rain08_08', fun: 'sum', colorTable: 'rain' },
//   { name: '最大08时到08时雨量', value: 'rain08_08', fun: 'max', colorTable: 'rain' },
//   { name: '累计20时到20时雨量', value: 'rain20_20', fun: 'sum', colorTable: 'rain' },
//   { name: '最大20时到20时雨量', value: 'rain20_20', fun: 'max', colorTable: 'rain' },
//   { name: '累计20时到08时雨量', value: 'rain20_08', fun: 'sum', colorTable: 'rain' },
//   { name: '最大20时到08时雨量', value: 'rain20_08', fun: 'max', colorTable: 'rain' },
//   { name: '累计08时到20时雨量', value: 'rain08_20', fun: 'sum', colorTable: 'rain' },
//   { name: '最大08时到20时雨量', value: 'rain08_20', fun: 'max', colorTable: 'rain' }
// ];
</script>

<style lang="scss" scoped>
#typh-matching {
  position: absolute !important;
  left: 340px;
  top: 60px;
  width: 280px;
  background-color: white;
  border-radius: 6px;
  header {
    cursor: move;
    border-radius: 4px 4px 0 0;
    position: relative;
    height: 30px;
    background-color: #263B5C;
    h1 {
      font-size: 12px;
      color: white;
      line-height: 30px;
      padding-left: 10px;
      margin: 0;
      letter-spacing: 1px;
    }
    span {
      cursor: pointer;
      border-top-right-radius: 4px;
      width: 30px;
      height: 30px;
      display: block;
      position: absolute;
      right: 0px;
      top: 0px;
      &:hover {
        background-color: #1c3252;
      }
      svg {
        padding: 11px;
      }
    }
  }
}

section.matching-result {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: #fff;
  border-radius: 0 0 4px 4px;
  ul {
    border: solid 1px #d7d7d7;
    border-radius: 3px;
    overflow: hidden;
    overflow-y: scroll;
    min-height: 100px;
    li {
      width: 100%;
      height: 22px;
      line-height: 22px;
      color: #474747;
      font-size: 12px;
      box-sizing: border-box;
      padding-left: 10px;
      &:hover {
        background-color: #DFE7F3;
        cursor: pointer;
      }
    }
  }
}
</style>
