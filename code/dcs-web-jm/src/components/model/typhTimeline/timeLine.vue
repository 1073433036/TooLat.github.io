<template>
  <main id="typh-timeline">
    <transition name="timelineFade">
      <section class="timeline-typhofyear-wraper cf" key='typhofyear' mode="in-out"
        v-if="typhTimeLineStatus_global === 'history'">
        <div v-for="month in typhOfCurYear"
          :style="{width: itemWidth + '%'}">
          <span v-for="(el,index) in month" style="transform: translateY(8px)"
            :style="{top: (el.itemNum-(Math.floor(el.itemNum/4))*4)*7 + (el.itemNum-(Math.floor(el.itemNum/4))*4)*18 + 'px',
              left: 100/el.daysInMonth*el.startTime+'%',
              backgroundColor: el.color}"
            @click="showTyphDetail(el.tsId)">
            {{el.id}}号{{el.name}}
          </span>
        </div>
      </section>
      <section class="timeline-typhdetail-wraper cf" key="detail" mode="out-in"
        v-if="typhTimeLineStatus_global === 'deteil'">
        <ul class="typh-level-indicator">
          <li style="background-color: #ce4445" title="超强台风"></li>
          <li style="background-color: #ac31b3" title="强台风"></li>
          <li style="background-color: #e68741" title="台风"></li>
          <li style="background-color: #e0cf34" title="强热带风暴"></li>
          <li style="background-color: #2d90f0" title="热带风暴"></li>
          <li style="background-color: #43d03c" title="热带气压"></li>
        </ul>
        <div class="typh-detail-container cf" :style="{width: itemWidth + '%'}"
          v-for="(item, key) in currentTyphData">
          <svg class="typh-start-indicator" width="1px" height="108px"
            v-if="key === startLine"
            :style="{left: 100/24*lineStartTime+'%'}">
            <line x1="0" y1="0" x2="0" y2="108px" style="stroke: #32d67b;stroke-width:1px;stroke-dasharray:8 2"/>
          </svg>
          <span v-for="el in item"
            :style="{top: el.level*18+'px', backgroundColor: el.color,
              left: 100/24*el.startTime+'%'}">
            {{el.levelName}}
          </span>
          <svg class="typh-start-indicator" width="1px" height="108px" style="transform: translateX(62px)"
            v-if="key === endLine"
            :style="{left: 100/24*lineEndTime+'%'}">
            <line x1="0" y1="0" x2="0" y2="108px" style="stroke: #eb6671;stroke-width:1px;stroke-dasharray:8 2"/>
          </svg>
        </div>
      </section>
    </transition>
    <transition name="timelineFade">
      <section class="timeline-datetime-wraper cf" key='typhofyear' mode="in-out"
        v-if="typhTimeLineStatus_global === 'history'">
        <span :style="{width: itemWidth + '%'}"
          v-for="(el, key) in typhOfCurYear">
          {{key}}月</span>
      </section>
      <section class="timeline-datetime-wraper detail-datetime cf" style="padding-left: 10px"
        key="detail" mode="out-in"
        v-else-if="typhTimeLineStatus_global === 'deteil'">
        <span :style="{width: itemWidth + '%'}"
          v-for="(el, key) in currentTyphData">{{key}}</span>
      </section>
    </transition>
  </main>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import {getAllHistoryTyph, getTyphLineData} from './typhUtil'
export default{
  props: {
    allTyphData: Object
  },
  data() {
    return {
      typhHistoryData: null,
      typhOfCurYear: null,
      currentTyphData: null,

      startLine: null,
      endLine: null,

      containerWidth: 0,
      itemNum: 0,
      itemWidth: 0,
    }
  },
  mounted() {
    /*this.containerWidth = document.querySelector('.timeline-datetime-wraper').clientWidth
    getAllHistoryTyph(this.$http, (data) => {
      this.typhHistoryData = data;
      this.typhOfCurYear = this.typhHistoryData[this.typhCurrentYear_global];
      let itemNum = 0;
      for(let i in this.typhOfCurYear) {
        itemNum++;
      }
      this.itemWidth = 100/itemNum;
    })*/
    this.containerWidth = document.querySelector('.timeline-datetime-wraper').clientWidth;
    this.typhHistoryData = this.allTyphData;
    this.typhOfCurYear = this.typhHistoryData[this.typhCurrentYear_global];
    let itemNum = 0;
    for(let i in this.typhOfCurYear) {
      itemNum++;
    }
    this.itemWidth = 100/itemNum;
  },
  computed: {
    ...mapGetters([
      'typhCurrentYear_global',
      'typhTimeLineStatus_global',
      'containedTyph_global',
      'selectedTyph_global',
      'isBefore03Typh_global',
      'selectedTyphoonData_global'
    ])
  },
  watch: {
    typhCurrentYear_global(nv) {
      if(!nv || !this.typhHistoryData || !this.typhHistoryData[nv])
        return;
      this.itemWidth = computeItemWidth(this.typhHistoryData[nv]);
      this.typhOfCurYear = this.typhHistoryData[nv];
    },
    typhTimeLineStatus_global(nv) {
      if(nv === 'history') {
        this.itemWidth = computeItemWidth(this.typhHistoryData[this.typhCurrentYear_global]);
      }
    },
    selectedTyphoonData_global: {
      handler(nv) {
        if(nv) {
          getTyphLineData(nv).then(data => {
            this.changeTyphCurrentName_global(data.typhName);
            this.currentTyphData = data.parsedData;
            this.itemWidth = computeItemWidth(this.currentTyphData);
            this.startLine = data.startLine;
            this.endLine = data.endLine;
            this.lineStartTime = data.lineStartTime;
            this.lineEndTime = data.lineEndTime;

            this.toggleTyphTimelineStatus_global('deteil');

            for(let item of this.containedTyph_global) {
              if(item.tsId === this.selectedTyph_global)
                return;
            }
            this.storeTyphData_global({
              id: data.id,
              tsId: data.tsId,
              name: data.typhName
            });
          });
        } else {
          this.toggleTyphTimelineStatus_global('history');
        }
      },
      deep: true
    },
    /*selectedTyph_global(newId) {
      if(newId !== null)
        getTyphLineData(this.$http, newId, this.isBefore03Typh_global)
          .then(data => {
            this.changeTyphCurrentName_global(data.typhName);
            this.currentTyphData = data.parsedData;
            this.itemWidth = computeItemWidth(this.currentTyphData);
            this.startLine = data.startLine;
            this.endLine = data.endLine;
            this.lineStartTime = data.lineStartTime;
            this.lineEndTime = data.lineEndTime;

            this.toggleTyphTimelineStatus_global('deteil');

            for(let item of this.containedTyph_global) {
              if(item.tsId === newId)
                return;
            }

            this.storeTyphData_global({
              id: data.id,
              tsId: data.tsId,
              name: data.typhName
            });
          })
      else
        this.toggleTyphTimelineStatus_global('history');
    }*/
  },
  methods: {
    ...mapActions([
      'toggleTyphTimelineStatus_global',
      'changeTyphCurrentName_global',
      'storeTyphData_global',
      'selectTyph_global',
      'toggleCurrentTyphFlag_global',
      'showInfoTip_global'
    ]),
    showTyphDetail(tsId) {
      for(let item of this.containedTyph_global) {
        if(item.tsId === tsId) {
          this.selectTyph_global(tsId);
          return;
        }
      }

      if(this.containedTyph_global.length === 4) {
        this.showInfoTip_global({ text: '最多只能选择4个台风！' });
        return;
      }
      this.selectTyph_global(tsId);
      this.toggleCurrentTyphFlag_global(false);
    }
  }
}

function computeItemWidth(data) {
  let itemNum = 0;
  for(let i in data) {
    itemNum++;
  }
  return  100/itemNum;
}

</script>
<style lang="scss">
#typh-timeline{
  height: 136px;
  width: 100%;
  box-sizing: border-box;
  border-right: solid 40px transparent;
  position: relative;
}
section.timeline-typhofyear-wraper{
  position: absolute;
  background-color: rgba(70, 70, 70, .5);
  height: 108px;
  top: 0;
  margin-bottom: 7px;
  width: 100%;
  border-top: solid 1px rgba(0, 0, 0, .25);
  div{
    float: left;
    box-sizing: border-box;
    height: 100%;
    position: relative;
    border-left: solid 1px rgba(255, 255, 255, .1);
    &:last-of-type{
      border-right: solid 1px rgba(255, 255, 255, .1);
    }
    span{
      font-size: 12px;
      color: white;
      // width: 70px;
      padding: 0 10px;
      height: 18px;
      white-space: nowrap;
      z-index: 999;
      line-height: 18px;
      position: absolute;
      display: block;
      text-align: left;
      background-color: lightsalmon;
      cursor: pointer;
      &:hover{
        box-shadow: 1px 1px 3px #444;
        z-index: 1000;
      }
    }
  }
}
section.timeline-datetime-wraper{
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  background-color: rgba(70, 70, 70, .5);
  height: 20px;
  width: 100%;
  span{
    float: left;
    display: block;
    text-align: center;
    font-size: 12px;
    color: white;
    line-height: 20px;
    height: 21px;
    box-sizing: border-box;
    border-left: solid 1px rgba(255, 255, 255, .3);
    &:last-of-type{
      border-right: solid 1px rgba(255, 255, 255, .3);
    }
  }
}
section.timeline-typhdetail-wraper{
  box-sizing: border-box;
  position: absolute;
  background-color: rgba(70, 70, 70, .5);
  height: 108px;
  top: 0;
  margin-bottom: 7px;
  width: 100%;
  border-top: solid 1px rgba(0, 0, 0, .25);
  padding-left: 10px;
  ul{
    position: absolute;
    left: 0px;
    width: 10px;
    height: 100%;
    li{
      width: 100%;
      height: 18px;
    }
  }
  svg{
    position: absolute;
  }
}
div.typh-detail-container{
  height: 100%;
  float: left;
  position: relative;
  box-sizing: border-box;
  border-left: solid 1px rgba(255, 255, 255, .1);
    &:last-of-type{
      border-right: solid 1px rgba(255, 255, 255, .1);
    }
  span{
    position: absolute;
    font-size: 12px;
    color: white;
    width: 62px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    z-index: 999;
  }
}

.timelineFade-enter-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.timelineFade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.timelineFade-enter, .timelineFade-leave-active {
  transform: translateX(10px);
  opacity: 0;
}
</style>
