<template>
  <div id="typh-mouse-over-panel"
    :style="{top: pos.y - 265 - 20 +'px', left: pos.x + 'px',}">
    <svg width="1px" height="265px" class="shadow">
      <line x1="0" x2="0" y1="0" y2="265" :style="{stroke: overData.color}" stroke-wdith="1px" />
    </svg>
    <section class="typh-basic-info-wraper">
      <header :style="{color: overData.color}">{{typhIntId}} {{typhName}} ( {{typhEnName}} )</header>
      <ul>
        <li class="cf">
          <a class="info-title">时间</a>
          <span class="info-content">{{overData.datetime}}</span>
        </li>
        <li class="cf">
          <a class="info-title">经纬度</a>
          <span class="info-content">{{overData.degrees[0]}}° E, {{overData.degrees[1]}}° N</span>
        </li>
        <li class="cf"><a class="info-title">强度</a><span class="info-content">{{overData.level}}</span></li>
        <li class="cf"><a class="info-title">气压</a><span class="info-content">{{overData.ps}} hPa</span></li>
        <li class="cf"><a class="info-title">最大风速</a><span class="info-content">{{Number(overData.ws).toFixed(0)}} 米/秒</span></li>
      </ul>
       <svg width="210px" height="1px" class="shadow">
        <line x1="0" x2="260" y1="0" y2="0" stroke-width="1px" :style="{stroke: overData.color}" />
      </svg>
    </section>
    <section class="typh-wind-circle-wraper">
      <ul>
        <li><a class="info-title">6级风圈</a>
          <span class="info-content">{{overData.rr06 ? Number(overData.rr06).toFixed(0) +'公里' : '--'}}</span>
        </li>
        <li><a class="info-title">7级风圈</a>
          <span class="info-content">{{overData.rr07 ? Number(overData.rr07).toFixed(0) +'公里' : '--'}}</span>
        </li>
        <li><a class="info-title">8级风圈</a>
          <span class="info-content">{{overData.rr08 ? Number(overData.rr08).toFixed(0) +'公里': '--'}}</span>
        </li>
        <li><a class="info-title">10级风圈</a>
          <span class="info-content">{{overData.rr10 ? Number(overData.rr10).toFixed(0) +'公里': '--'}}</span>
        </li>
      </ul>
    </section>
    <svg width="230px" height="1px" class="shadow">
      <line x1="0" x2="280" y1="0" y2="0" :style="{stroke: overData.color}" stroke-wdith="1px" />
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typhName: '',
      typhEnName: '',
      typhIntId: ''
    }
  },
  props: {
    pos: Object,
    tyId: String,
    overData: Object,
    getTyphDataById: Function,
    isBefore03: Boolean
  },
  mounted() {
    this.getTyphData();
  },
  watch:{
    tyId(nv) {
      this.getTyphData();
    }
  },
  methods: {
    getTyphData() {
      this.getTyphDataById(this.$http, this.tyId, this.isBefore03)
        .then(data => {
          this.typhName = data.tscname;
          this.typhEnName = data.tsename;
          this.typhIntId = data.intlid;
        });
    }
  }
 }
</script>

<style lang="scss" scoped>
#typh-mouse-over-panel{
  position: absolute;
  width: 230px;
  font-size: 12px;
  background-color: rgba(70, 70, 70, .1);
  // box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, .2);
}
.shadow{
  float: left;
  filter: drop-shadow(1px 1px 1px rgba(0,0,0,.8));
}
section{
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, .8);
  svg{
    position: absolute;
    bottom: 0px;
  }
  header{
    text-shadow: 1px 1px 1px rgba(0, 0, 0, .4);
    margin: 0;
    padding: 0;
    margin-bottom: 15px;
    height: 12px;
    line-height: 12px;
    padding-left: 24px;
  }
  li{
    height: 22px;
  }
}
.info-title{
  color: white;
  line-height: 22px;
  transform: translateY(-2px);
  height: 22px;
  display: block;
  float: left;
  width: 52px;
  text-align: right;
  margin-right: 10px;
}
.info-content{
  font-weight: bold;
  line-height: 22px;
  color: white;
  display: block;
  float: left;
  transform: translateY(-2px);
  height: 22px;
}


</style>
