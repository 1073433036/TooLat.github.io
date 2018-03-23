<template>
  <main id="MainTimeline">
    <transition name="timelineFade">
      <section class="timeline-typhofyear-wraper cf" key='typhofyear' mode="in-out" v-if="typhTimelineStatus_global === 'history'">
        <div v-for="(month, key) in typhOfCurYear" :key="key" :style="{width: itemWidth + '%'}">
          <div v-for="(el, index) in month" :key="index">
            <svg wdith="14px" height="90px" :style="{top: (el.itemNum-(Math.floor(el.itemNum/4))*4)*20 + 20 + 'px',left: 100/el.daysInMonth*el.startTime+'%'}">
              <path d="M 0,0 L 14,0 L 0, 13 Z" :fill="el.color"></path>
              <path d="M 0,13 L 0, 90" stroke="rgba(31,43,61,0.2)" fill="none" stroke-width="2px"></path>
            </svg>
            <span :style="{top: (el.itemNum-(Math.floor(el.itemNum/4))*4)*20 + 20 + 'px',left: 100/el.daysInMonth*el.startTime+'%'}"
              @click="showTyphDetail(el.tsId)" class="text-shadow" :title="el.levelName">
                {{el.id}}号{{el.name}}
            </span>
          </div>
        </div>
      </section>

      <section class="timeline-typhdetail-wraper cf" key="detail" mode="out-in" v-else-if="typhTimelineStatus_global === 'detail'">
        <!--<div class="typh-detail-container cf" :style="{width: itemWidth + '%'}" v-for="(item, key) in currentTyphData">-->
        <!--台风等级标识-->
        <div class="detail-name">{{detailTyphString}}</div>
        <svg version="1.1" width="25" height="90" v-if="el.level == 0" :style="{left: el.left + '%', top: (el.level)*10 + 20 +'px'}" v-for="(el, index) in typhDetailData" :key="index"
          xml:space="preserve">
          <g id="XMLID_24_">
            <g id="XMLID_25_">
              <path :fill="el.color" id="XMLID_112_" d="M15.7,86.8c0,1.8-1.4,3.2-3.2,3.2s-3.2-1.4-3.2-3.2s3.2-5.8,3.2-5.8S15.7,85,15.7,86.8z"
              />
            </g>
          </g>
          <g id="XMLID_22_">
            <rect id="XMLID_23_" :fill="el.color" x="12" y="20" width="1" height="65" />
          </g>
          <g id="XMLID_20_" v-tip="'超强台风'">
            <g id="XMLID_21_">
              <circle id="XMLID_85_" :fill="el.color" cx="12.6" cy="12" r="12" />
            </g>
          </g>
          <g id="XMLID_1_">
            <g id="XMLID_15_">
              <g id="XMLID_16_" v-tip="'超强台风'">
                <path id="XMLID_17_" class="st0" d="M9.8,17.7c-0.6-0.3-1.2-0.7-1.7-1.1l0,0c-1.1-0.9-1.8-2-2.1-3.3c-0.2-0.6-0.2-1.2-0.2-1.8
          c0-3.9,3.5-7.1,7.9-7.1c3.1,0,5.7,1.6,7,3.9c-1.2-1.2-3-1.9-4.9-1.9c0,0-0.1,0-0.1,0c0.6,0.3,1.2,0.7,1.7,1.1l0,0
          c1.1,0.9,1.8,2,2.1,3.3c0.2,0.6,0.2,1.2,0.2,1.8c0,3.9-3.5,7.1-7.9,7.1c-3.1,0-5.7-1.6-7-3.9c1.2,1.2,3,1.9,4.9,1.9
          C9.7,17.7,9.7,17.7,9.8,17.7L9.8,17.7L9.8,17.7L9.8,17.7z M12.7,14.7c1.6,0,2.8-1.3,2.8-2.8s-1.3-2.8-2.8-2.8
          c-1.6,0-2.8,1.3-2.8,2.8S11.2,14.7,12.7,14.7L12.7,14.7L12.7,14.7z" fill="white" />
              </g>
            </g>
          </g>
        </svg>
        <svg version="1.1" width="25"  height="80" v-if="el.level == 1" :style="{left: el.left + '%', top: (el.level)*10 + 20 +'px'}" v-for="(el, index) in typhDetailData" :key="index"
          xml:space="preserve">
          <g id="XMLID_26_">
            <g id="XMLID_27_">
              <path id="XMLID_28_" :fill="el.color" d="M15.7,77.3c0,1.8-1.4,3.2-3.2,3.2s-3.2-1.4-3.2-3.2s3.2-5.8,3.2-5.8S15.7,75.5,15.7,77.3z"
              />
            </g>
          </g>
          <g id="XMLID_24_">
            <rect id="XMLID_25_" :fill="el.color" x="12" y="12.5" width="1" height="63" />
          </g>
          <g id="XMLID_21_" v-tip="'强台风'">
            <g id="XMLID_22_">
              <circle id="XMLID_23_" :fill="el.color" cx="12.6" cy="12.4" r="12" />
            </g>
          </g>
          <g id="XMLID_15_">
            <g id="XMLID_16_">
              <g id="XMLID_17_" v-tip="'强台风'">
                <path id="XMLID_18_" fill="white" class="st0" d="M9.8,18c-0.6-0.3-1.2-0.7-1.7-1.1l0,0c-1.1-0.9-1.8-2-2.1-3.3c-0.2-0.6-0.2-1.2-0.2-1.8
          c0-3.9,3.5-7.1,7.9-7.1c3.1,0,5.7,1.6,7,3.9c-1.2-1.2-3-1.9-4.9-1.9c0,0-0.1,0-0.1,0c0.6,0.3,1.2,0.7,1.7,1.1l0,0
          c1.1,0.9,1.8,2,2.1,3.3c0.2,0.6,0.2,1.2,0.2,1.8c0,3.9-3.5,7.1-7.9,7.1c-3.1,0-5.7-1.6-7-3.9c1.2,1.2,3,1.9,4.9,1.9
          C9.7,18,9.7,18,9.8,18L9.8,18L9.8,18L9.8,18z M12.7,15.1c1.6,0,2.8-1.3,2.8-2.8s-1.3-2.8-2.8-2.8c-1.6,0-2.8,1.3-2.8,2.8
          S11.2,15.1,12.7,15.1L12.7,15.1L12.7,15.1z" />
              </g>
            </g>
          </g>
        </svg>
        <svg version="1.1" width="25" height="70" v-if="el.level == 2" :style="{left: el.left + '%', top: (el.level)*10 + 20 +'px'}" v-for="(el, index) in typhDetailData" :key="index"
          xml:space="preserve">
          <g id="XMLID_40_">
            <g id="XMLID_41_">
              <path id="XMLID_42_" :fill="el.color" d="M15.7,67.3c0,1.8-1.4,3.2-3.2,3.2s-3.2-1.4-3.2-3.2s3.2-5.8,3.2-5.8S15.7,65.5,15.7,67.3z"
              />
            </g>
          </g>
          <g id="XMLID_38_">
            <rect id="XMLID_39_" :fill="el.color" x="12" y="12.5" width="1" height="53" />
          </g>
          <g id="XMLID_35_" v-tip="'台风'">
            <g id="XMLID_36_">
              <circle id="XMLID_37_" :fill="el.color" cx="12.6" cy="12.4" r="12" />
            </g>
          </g>
          <g id="XMLID_29_">
            <g id="XMLID_30_">
              <g id="XMLID_31_" v-tip="'台风'" >
                <path id="XMLID_32_" class="st0" d="M9.8,18c-0.6-0.3-1.2-0.7-1.7-1.1l0,0c-1.1-0.9-1.8-2-2.1-3.3c-0.2-0.6-0.2-1.2-0.2-1.8
          c0-3.9,3.5-7.1,7.9-7.1c3.1,0,5.7,1.6,7,3.9c-1.2-1.2-3-1.9-4.9-1.9c0,0-0.1,0-0.1,0c0.6,0.3,1.2,0.7,1.7,1.1l0,0
          c1.1,0.9,1.8,2,2.1,3.3c0.2,0.6,0.2,1.2,0.2,1.8c0,3.9-3.5,7.1-7.9,7.1c-3.1,0-5.7-1.6-7-3.9c1.2,1.2,3,1.9,4.9,1.9
          C9.7,18,9.7,18,9.8,18L9.8,18L9.8,18L9.8,18z M12.7,15.1c1.6,0,2.8-1.3,2.8-2.8s-1.3-2.8-2.8-2.8c-1.6,0-2.8,1.3-2.8,2.8
          S11.2,15.1,12.7,15.1L12.7,15.1L12.7,15.1z" fill="white" />
              </g>
            </g>
          </g>
        </svg>
        <svg version="1.1" width="25" height="60" v-if="el.level == 3" :style="{left: el.left + '%', top: (el.level)*10 + 20 +'px'}" v-for="(el, index) in typhDetailData" :key="index"
          xml:space="preserve">
          <g id="XMLID_68_">
            <g id="XMLID_69_">
              <path id="XMLID_1_" :fill="el.color" j d="M12.5,60.5" />
            </g>
          </g>
          <g id="XMLID_54_">
            <g id="XMLID_55_">
              <path id="XMLID_56_" :fill="el.color" d="M15.7,57.3c0,1.8-1.4,3.2-3.2,3.2s-3.2-1.4-3.2-3.2s3.2-5.8,3.2-5.8S15.7,55.5,15.7,57.3z"
              />
            </g>
          </g>
          <g id="XMLID_52_">
            <rect id="XMLID_53_" :fill="el.color" x="12" y="2.5" width="1" height="53" />
          </g>
          <g id="XMLID_49_" v-tip="'强热带风暴'">
            <g id="XMLID_50_">
              <circle id="XMLID_51_" :fill="el.color" cx="12.6" cy="12.4" r="12" />
            </g>
          </g>
          <g id="XMLID_43_">
            <g id="XMLID_44_">
              <g id="XMLID_45_" v-tip="'热带低压'">
                <path id="XMLID_46_" class="st0" d="M9.8,18c-0.6-0.3-1.2-0.7-1.7-1.1l0,0c-1.1-0.9-1.8-2-2.1-3.3c-0.2-0.6-0.2-1.2-0.2-1.8
          c0-3.9,3.5-7.1,7.9-7.1c3.1,0,5.7,1.6,7,3.9c-1.2-1.2-3-1.9-4.9-1.9c0,0-0.1,0-0.1,0c0.6,0.3,1.2,0.7,1.7,1.1l0,0
          c1.1,0.9,1.8,2,2.1,3.3c0.2,0.6,0.2,1.2,0.2,1.8c0,3.9-3.5,7.1-7.9,7.1c-3.1,0-5.7-1.6-7-3.9c1.2,1.2,3,1.9,4.9,1.9
          C9.7,18,9.7,18,9.8,18L9.8,18L9.8,18L9.8,18z M12.7,15.1c1.6,0,2.8-1.3,2.8-2.8s-1.3-2.8-2.8-2.8c-1.6,0-2.8,1.3-2.8,2.8
          S11.2,15.1,12.7,15.1L12.7,15.1L12.7,15.1z" fill="white" />
              </g>
            </g>
          </g>
        </svg>
        <svg version="1.1" width="25" height="50" v-if="el.level == 4" :style="{left: el.left + '%', top: (el.level)*10 + 20 +'px'}" v-for="(el, index) in typhDetailData" :key="index"
          xml:space="preserve">
          <g id="XMLID_68_">
            <g id="XMLID_69_">
              <path id="XMLID_70_" :fill="el.color" d="M15.7,47.3c0,1.8-1.4,3.2-3.2,3.2s-3.2-1.4-3.2-3.2s3.2-5.8,3.2-5.8S15.7,45.5,15.7,47.3z"
              />
            </g>
          </g>
          <g id="XMLID_66_">
            <rect id="XMLID_67_" :fill="el.color" x="12" y="10.5" width="1" height="35" />
          </g>
          <g id="XMLID_63_" v-tip="'热带风暴'">
            <g id="XMLID_64_">
              <circle id="XMLID_65_" :fill="el.color" cx="12.6" cy="12.4" r="12" />
            </g>
          </g>
          <g id="XMLID_57_">
            <g id="XMLID_58_">
              <g id="XMLID_59_" v-tip="'热带风暴'">
                <path id="XMLID_60_" class="st0" d="M9.8,18c-0.6-0.3-1.2-0.7-1.7-1.1l0,0c-1.1-0.9-1.8-2-2.1-3.3c-0.2-0.6-0.2-1.2-0.2-1.8
          c0-3.9,3.5-7.1,7.9-7.1c3.1,0,5.7,1.6,7,3.9c-1.2-1.2-3-1.9-4.9-1.9c0,0-0.1,0-0.1,0c0.6,0.3,1.2,0.7,1.7,1.1l0,0
          c1.1,0.9,1.8,2,2.1,3.3c0.2,0.6,0.2,1.2,0.2,1.8c0,3.9-3.5,7.1-7.9,7.1c-3.1,0-5.7-1.6-7-3.9c1.2,1.2,3,1.9,4.9,1.9
          C9.7,18,9.7,18,9.8,18L9.8,18L9.8,18L9.8,18z M12.7,15.1c1.6,0,2.8-1.3,2.8-2.8s-1.3-2.8-2.8-2.8c-1.6,0-2.8,1.3-2.8,2.8
          S11.2,15.1,12.7,15.1L12.7,15.1L12.7,15.1z" fill="white" />
              </g>
            </g>
          </g>
        </svg>
        <svg version="1.1" width="25" height="40" v-if="el.level == 5" :style="{left: el.left + '%', top: (el.level)*10 + 20 +'px'}" v-for="(el, index) in typhDetailData" :key="index"
          xml:space="preserve">
          <g id="XMLID_82_">
            <g id="XMLID_83_">
              <path id="XMLID_84_" :fill="el.color" d="M15.7,37.3c0,1.8-1.4,3.2-3.2,3.2s-3.2-1.4-3.2-3.2s3.2-5.8,3.2-5.8S15.7,35.5,15.7,37.3z"
              />
            </g>
          </g>
          <g id="XMLID_80_">
            <rect id="XMLID_81_" :fill="el.color" x="12" y="0.5" width="1" height="35" />
          </g>
          <g id="XMLID_77_" v-tip="'热带低压'">
            <g id="XMLID_78_">
              <circle id="XMLID_79_" :fill="el.color" cx="12.6" cy="12.4" r="12" />
            </g>
          </g>
          <g id="XMLID_71_">
            <g id="XMLID_72_">
              <g id="XMLID_73_" v-tip="'热带低压'">
                <path id="XMLID_74_" class="st0" d="M9.8,18c-0.6-0.3-1.2-0.7-1.7-1.1l0,0c-1.1-0.9-1.8-2-2.1-3.3c-0.2-0.6-0.2-1.2-0.2-1.8
          c0-3.9,3.5-7.1,7.9-7.1c3.1,0,5.7,1.6,7,3.9c-1.2-1.2-3-1.9-4.9-1.9c0,0-0.1,0-0.1,0c0.6,0.3,1.2,0.7,1.7,1.1l0,0
          c1.1,0.9,1.8,2,2.1,3.3c0.2,0.6,0.2,1.2,0.2,1.8c0,3.9-3.5,7.1-7.9,7.1c-3.1,0-5.7-1.6-7-3.9c1.2,1.2,3,1.9,4.9,1.9
          C9.7,18,9.7,18,9.8,18L9.8,18L9.8,18L9.8,18z M12.7,15.1c1.6,0,2.8-1.3,2.8-2.8s-1.3-2.8-2.8-2.8c-1.6,0-2.8,1.3-2.8,2.8
          S11.2,15.1,12.7,15.1L12.7,15.1L12.7,15.1z" fill="white" />
              </g>
            </g>
          </g>
        </svg>
        <!--台风标识结束-->
        <!--<span v-for="el in typhDetailData" class="text-shadow" :style="{left: el.left + '%'}">
              {{el.name}}
            </span>-->
        <!--</div>-->
      </section>
    </transition>
    
    <transition name="timelineFade">
      <section class="timeline-datetime-wraper cf" key='typhofyear' mode="in-out" v-if="typhTimelineStatus_global === 'history'">
        <span :style="{width: itemWidth + '%'}" v-for="(key, index) in Object.keys(typhOfCurYear)" :key="index"><a>{{key}}月</a></span>
      </section>
      <section class="timeline-datetime-wraper detail-datetime cf" key="detail" mode="out-in" v-else-if="typhTimelineStatus_global === 'detail'">
        <span :style="{width: itemWidth + '%'}" v-for="(key, index) in Object.keys(currentTyphData)" :key="index"><a>{{key}}</a></span>
      </section>
    </transition>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { getAllHistoryTyph, getTyphDataById } from "./typhUtil"

  function computeItemWidth(data) {
    return 100 / Object.keys(data).length
  }

  @Component
  export default class MainTimeline extends Vue {
    @Prop() storeTyphYearData

    @Getter('decisionStore/disasterTypeSelected_global') disasterTypeSelected_global
    @Getter('decisionStore/typhTimelineStatus_global') typhTimelineStatus_global
    @Getter('decisionStore/typhCurrentYear_global') typhCurrentYear_global
    @Getter('decisionStore/typhSelected_global') typhSelected_global
    @Getter('decisionStore/containedTyph_global') containedTyph_global
    @Action('decisionStore/changeTyphCurrentYear_global') changeTyphCurrentYear_global
    @Action('decisionStore/toggleTyphTimelineStatus_global') toggleTyphTimelineStatus_global
    @Action('decisionStore/changeTyphCurrentName_global') changeTyphCurrentName_global
    @Action('decisionStore/storeTyphData_global') storeTyphData_global
    @Action('decisionStore/selectTyph_global') selectTyph_global


    maxYear: number = NaN
    minYear: number = NaN
    typhHistoryYear: Array<any> = []
    typhDetailData: Array<any> = []
    typhHistoryData: any = null
    typhOfCurYear: any = {}
    currentTyphData: any = {}
    startLine: any = null
    endLine: any = null
    itemNum: number = 0
    itemWidth: number = 0
    lineStartTime: any = null
    lineEndTime: any = null
    detailTyphString: string = ''


    async created() {
      getAllHistoryTyph((data) => {
        if (!data) return
        this.typhHistoryData = data

        for (let i in data) {
          this.typhHistoryYear.unshift(Number(i))
        }
        this.changeTyphCurrentYear_global(this.typhHistoryYear[0])
        this.typhOfCurYear = this.typhHistoryData[this.typhCurrentYear_global]
        this.itemWidth = computeItemWidth(this.typhOfCurYear)

        this.maxYear = this.typhHistoryYear[0]
        this.minYear = this.typhHistoryYear[this.typhHistoryYear.length - 1]
        this.storeTyphYearData(this.maxYear, this.minYear)
      })

      if (this.typhSelected_global) {
        getTyphDataById(this.typhSelected_global)
          .then(data => {
            this.setUpCurrentTyphDetail(data, this.typhSelected_global)
          })
        this.getDetailNameString()
      }
    }

    getDetailNameString() {
      for (let opt of this.containedTyph_global) {
        if (opt.tsId == this.typhSelected_global) {
          this.detailTyphString = opt.id + ' ' + opt.name
          break
        }
      }
    }


    @Watch('typhCurrentYear_global')
    ontyphCurrentYear_globalChanged(val: any, oldVal: any): void {
      this.itemWidth = computeItemWidth(this.typhHistoryData[val])
      this.typhOfCurYear = this.typhHistoryData[val]
    }

    @Watch('typhSelected_global')
    ontyphSelected_globalChanged(newId: any, oldId: any): void {
      if (newId !== null) {
        getTyphDataById(newId)
        .then(data => {
          this.setUpCurrentTyphDetail(data, newId)
          this.getDetailNameString()
        })
      }
      else {
        if (this.disasterTypeSelected_global === 'tide') {
          this.toggleTyphTimelineStatus_global('history')
        } else {
          this.toggleTyphTimelineStatus_global('search')
        }
      }
    }

    @Watch('typhTimelineStatus_global')
    ontyphTimelineStatus_globalChanged(val: any, oldVal: any): void {
      if (val === 'history')
        this.itemWidth = computeItemWidth(this.typhHistoryData[this.typhCurrentYear_global])
    }


    

    setUpCurrentTyphDetail(data, newId) {
      this.changeTyphCurrentName_global(data.typhName)
      this.currentTyphData = data.parsedData

      let monthCounter = 0,
        totalHourInThisTyph = 0
      for (let i in this.currentTyphData) {
        totalHourInThisTyph++
      }
      totalHourInThisTyph = totalHourInThisTyph * 24
      this.typhDetailData = []
      for (let i in this.currentTyphData) {
        for (let item of this.currentTyphData[i]) {
          this.typhDetailData.push({
            left: (((monthCounter * 24) + (item.startTime)) / totalHourInThisTyph * 100).toFixed(2),
            name: item.levelName,
            color: item.color,
            level: item.level
          })
        }
        monthCounter++
      }

      this.itemWidth = computeItemWidth(this.currentTyphData)
      this.startLine = data.startLine
      this.endLine = data.endLine
      this.lineStartTime = data.lineStartTime
      this.lineEndTime = data.lineEndTime

      this.toggleTyphTimelineStatus_global('detail')

      for (let item of this.containedTyph_global) {
        if (item.tsId === newId) return
      }

      this.storeTyphData_global({
        id: data.id,
        tsId: data.tsId,
        name: data.typhName,
        isCurrentTyph: false
      })
    }

    showTyphDetail(tsId) {
      if (tsId == this.typhSelected_global)
        this.toggleTyphTimelineStatus_global('detail')
      else
        this.selectTyph_global(tsId)
      // for (let item of this.containedTyph_global) {
      //   if (item.tsId === tsId) {
      //     this.selectTyph_global(tsId)
      //     return
      //   }
      // }

      // // if (this.containedTyph_global.length === 4) return
      // this.selectTyph_global(tsId)
    }
  }
</script>

<style lang='scss' scoped>
#MainTimeline {
  height: 122px; /*no*/
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

section.timeline-typhofyear-wraper {
    position: absolute;
    height: 109px; /*no*/
    top: 0;
    width: 100%;
    overflow: hidden;
    transform: translateY(-1px); /*no*/
    >div {
        float: left;
        box-sizing: border-box;
        height: 100%;
        background-color: #f8f8f8;
        position: relative;
        padding-bottom: 1px; /*no*/
        svg {
            position: absolute;
            transform: translate(-12px, 2px); /*no*/
        }
        span {
            font-size: 12px; /*no*/
            color: white; // width: 70px;
            height: 14px; /*no*/
            white-space: nowrap;
            z-index: 5;
            line-height: 14px; /*no*/
            position: absolute;
            display: block;
            text-align: left;
            cursor: pointer;
            color: #666;
            font-weight: bold;
            &:hover {
                z-index: 6;
            }
        }
    }
}

section.timeline-datetime-wraper {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    height: 14px; /*no*/
    width: 100%;
    span {
        float: left;
        display: block;
        text-align: center;
        font-size: 12px; /*no*/
        color: #989898;
        line-height: 14px; /*no*/
        height: 14px; /*no*/
        box-sizing: border-box;
        a {
            display: block;
            width: 100%;
            height: 100%;
            background-color: #fff;
        }
        &:nth-child(2n + 1) {
          a {
            background: #e2ecf6;
          }
        }
        &:nth-child(2n) {
          a {
            background: #f2f6f9;
          }
        }
    }
}

section.timeline-typhdetail-wraper {
    box-sizing: border-box;
    position: relative;
    height: 109px; /*no*/
    top: 0;
    width: 100%;
    transform: translateY(-1px); /*no*/
    background-color: #fff;
    .detail-name {
        position: absolute;
        top: 5px; /*no*/
        left: 5px; /*no*/
        color: #5a5e66;
    }
    ul {
        position: absolute;
        left: 0px; /*no*/
        width: 10px; /*no*/
        height: 100%;
        li {
            width: 100%;
            height: 18px; /*no*/
        }
    }
    svg {
        position: absolute;
    }
    span {
        position: absolute;
        font-size: 12px; /*no*/
        color: #000;
        width: 62px; /*no*/
        height: 18px; /*no*/
        top: 0;
        line-height: 18px; /*no*/
        text-align: center;
        z-index: 5;
    }
}

.typh-year-control-wraper {
    position: absolute;
    bottom: 14px; /*no*/
    color: #000;
    height: 22px; /*no*/
    display: block;
    line-height: 22px; /*no*/
    z-index: 10;
    li {
        background-repeat: no-repeat;
        background-position: center;
        float: left;
        height: 22px; /*no*/
        line-height: 22px; /*no*/
        &:not(:nth-child(2)) {
            width: 15px; /*no*/
            background-image: url(~Img/DecisionCommand/date_left.png);
            cursor: pointer;
            &:hover {
                background-image: url(~Img/DecisionCommand/date_left_pre.png);
            }
        }
        &:nth-child(2) {
            white-space: nowrap;
            padding: 0 5px; /*no*/
        }
        &:nth-child(3) {
            transform: rotateZ(180deg);
        }
    }
}

.timelineFade-enter-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.timelineFade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.timelineFade-enter,
.timelineFade-leave-active {
    transform: translateX(10px); /*no*/
    opacity: 0;
}
</style>