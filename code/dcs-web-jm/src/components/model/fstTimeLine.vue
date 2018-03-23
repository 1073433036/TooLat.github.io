<template>
  <section id="fst-time-line" v-if="fstTimeList.length > 1"
           :style="{bottom: posBottom}" :class="{'fst-time-line-animation': selectedModel === 'tide'}">
    <ul>
      <li v-for="el in fstTimeList" :class="{'seled-time': seledTime === el.seledTime }">
        <em></em>
        <span v-text="el.time" @click="updateSeledTime(el.seledTime)"></span>
        <a></a>
        <span v-text="el.date"></span>
      </li>
    </ul>
    <!--<div class="fst-time-btn" @click="playForecastTime"></div>-->
  </section>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'

  export default{
    data() {
      return {
        posBottom: '7px',
        timer: null,
        rainRanges: [
          [999, 50, 32, 16, 8],        //1、2、3、6小时雨量等级划分
          [999, 140, 70, 30, 15],      //12小时雨量等级划分
          [999, 250, 100, 50, 25],     //24小时雨量等级划分
          [999, 300, 150, 80, 50],     //48、72小时雨量等级划分
        ]
      }
    },
    computed: {
      ...mapGetters([
        'seledTime',
        'fstTimeList',
        'selectedModel',
        'currentRegion',
        'modelRanges',
        'modelNcInfo',
        'gridNcInfo',
        'dateForModel',
        'regionBounds',
        'typhTimeLineStatus_global'
      ]),
    },
    methods: {
      ...mapActions([
        'updateGeolModel',
        'updateModelSites',
        'storeModelData',
        'updateDisasterModel',
        'updateRainAndWindModel'
      ]),
      updateSeledTime(time) {
        if(this.timer)
          clearInterval(this.timer);
        this.storeModelData({ attr: 'seledTime', value: time });
      },
      playForecastTime() {
        if(this.timer) {
          clearInterval(this.timer);
          this.timer = null;
          return;
        }

        this.timer = setInterval(() => {
          //查找当前时次在预报时次数组中的位置，用来确认下一个播放时次的index
          let index = this.fstTimeList.findIndex(el => el.seledTime === this.seledTime);
          if(index === (this.fstTimeList.length - 1))
            index = 0;
          else
            index += 1;
          let timeEle = this.fstTimeList[index];
          this.storeModelData({ attr: 'seledTime', value: timeEle.seledTime });
        }, 1000);
      }
    },
    watch: {
      seledTime(st) {
        const model = this.selectedModel,
              $http = this.$http,
              regionObj = this.currentRegion;
        if(model === 'geology') {
          this.updateGeolModel({ $http, regionObj, ncInfo: this.modelNcInfo, seledTime: st, ranges: this.modelRanges });
          this.updateModelSites({ model: this.modelNcInfo.modelName, seledTime: st });
        }
        else if(model === 'torrent' || model === 'waterlogging') {
          this.updateDisasterModel({ $http, regionObj, datetime: this.dateForModel, model, bounds: this.regionBounds, seledTime: st });
        }
        else if(model === 'rain' || model === 'wind') {
          let seledVar, ncInfo, seledTime, ranges;

          if(model === 'rain') {
            if(st <= 6) {
              ranges = this.rainRanges[0];
            } else if(st === 12) {
              ranges = this.rainRanges[1];
            } else if(st === 24) {
              ranges = this.rainRanges[2];
            } else {
              ranges = this.rainRanges[3];
            }
            this.storeModelData({ attr: 'ranges', value: ranges });
          }
          if(st < 4 && model === 'rain') {
            ncInfo = this.gridNcInfo;
            seledVar = 'data';
            seledTime = st ? (7 + st) : 6;
          } else {
            ncInfo = model === 'wind' && !st ? this.gridNcInfo : this.modelNcInfo;
            seledVar = model === 'wind' ? 'maxwind' : 'rain';
            seledTime = st;
          }
          this.updateRainAndWindModel({ $http, regionObj, ncInfo, seledVar, seledTime, ranges: this.modelRanges, bounds: this.regionBounds });
        }
      },
      typhTimeLineStatus_global(nv, ov) {
        if(this.selectedModel !== 'tide') {
          this.posBottom = '7px';
          return;
        }
        if(ov === 'history' && nv === 'search') {
          this.posBottom = '7px';
        } else {
          this.posBottom = '143px';
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
section#fst-time-line {
  position: absolute;
  bottom: 7px;
  right: 10px;
  font-size: 0;
  background-color: rgba(70, 70, 70, .5);
  ul {
    display: inline-block;
    vertical-align: top;
    li {
      width: 80px;
      height: 46px;
      position: relative;
      display: inline-block;
      vertical-align: top;
      text-align: center;
      span {
        width: 100%;
        height: 26px;
        position: relative;
        display: inline-block;
        font-size: 12px;
        color: white;
        line-height: 24px;
        border-bottom: 1px solid rgba(255, 255, 255, .5);
        &:first-of-type {
          &:hover{
            color: #299dff;
            cursor: pointer;
          }
        }
        &:last-of-type {
          height: 19px;
          line-height: 19px;
          color: rgba(255, 255, 255, .8);
          border-bottom: none;
        }
      }
      a {
        width: 1px;
        height: 4px;
        position: absolute;
        display: inline-block;
        top: 22px;
        left: 50%;
        background-color: #ddd;
      }
    }
    li.seled-time {
      em {
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -4px;
        border-top: 4px solid #299dff;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
      }
      span:first-of-type {
        color: #299dff;
      }
    }
  }

  .fst-time-btn {
    width: 46px;
    height: 46px;
    position: relative;
    display: inline-block;
    border-left: 1px solid rgba(255,255,255,.5);
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, .1);
    }
  }
}
.fst-time-line-animation {
  transition: bottom .4s;
  -moz-transition: bottom .4s;
  -webkit-transition: bottom .4s;
  -o-transition: bottom .4s;
}
</style>
