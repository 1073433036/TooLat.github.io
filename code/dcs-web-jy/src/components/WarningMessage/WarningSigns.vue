<template>
  <section id="warning-signs">
    <h1 class="section-title">最新预警信号</h1>
    <div class="warning-signs-wrapper" v-loading="isLoading">
      <ul class="warning-signal-list">
        <li v-for="(item, index) in signalsData" :key="item.key"
            :class="{'selected-signal': item.key === selectedSignal}">
          <img :src="getSignalImage(item.key, item.level)"
              @click.stop="selectSignal(item, index)" />
        </li>
      </ul>
      <div class="warning-signal-areas" v-if="signalAreas.length">
        <!-- <el-tabs v-model="selectedCounty" @tab-click="selectCounty">
          <el-tab-pane 
            v-for="(item, index) in signalAreas"
            :label="item.county" 
            :name="item.county" 
            :key="index">
            <span slot="label" class="warning-signal-area">
              <em :style="{'backgroundColor': item.color}"></em>{{item.county}}
            </span>
          </el-tab-pane>
        </el-tabs> -->
        <div v-for="item in signalAreas" :key="item.county" 
            :class="['warning-signal-area', {'selected-county': item.county === selectedCounty}]" 
            @click.stop="selectCounty(item)">
            <em :style="{'backgroundColor': item.color}"></em>{{item.county}}
        </div>
      </div>
      <div class="warning-signal-time" v-if="signalTime.length">发布时间：{{signalTime}}</div>
      <pre :class="['warning-signal-guide', {'signal-guide-max': !signalAreas.length}]" 
          v-html="'防御指引：</br>' + signalGuide"></pre>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop } from 'vue-property-decorator'
  import { SignItem, SignalGuide } from '../../interface/SignItem'
  import WarningSign from '../../util/WarningSign'

  interface Signal {
    county: string,
    type: string,
    level: number,
    color: string,
    publishTime: string
  }
  interface SignalData {
    type: string,
    key: string,
    level: number,
    data: Signal[]
  }
  @Component
  export default class WarningSigns extends Vue {
    @Prop()
    city: string

    selectedCounty: string = ''
    //存放所有预警信号的防御指引
    signalGuideGroup: any = {}
    //预警发布时间
    signalTime: string = ''
    //当前选中的预警信号
    selectedSignal: string = 'TF'
    //防御指引
    signalGuide: string = ''
    //分区预警信号信息
    signalAreas: Signal[] = []
    signalsData: Array<SignalData> = [
      { type: '台风', key: 'TF', level: 0, data: [] },
      { type: '暴雨', key: 'BY', level: 0, data: [] },
      { type: '高温', key: 'GW', level: 0, data: [] },
      { type: '寒冷', key: 'HL', level: 0, data: [] },
      { type: '大雾', key: 'DW', level: 0, data: [] },
      { type: '灰霾天气', key: 'HM', level: 0, data: [] },
      { type: '雷雨大风', key: 'LYDF', level: 0, data: [] },
      { type: '道路结冰', key: 'DLJB', level: 0, data: [] },
      { type: '冰雹', key: 'BB', level: 0, data: [] },
      { type: '森林火险', key: 'SLHX', level: 0, data: [] },
    ]

    signsData: Array<SignItem> = []
    isLoading: boolean = false
    timer: any = null

    mounted(): void {
      this.updateWarningSigns();
      this.timer = setInterval(this.updateWarningSigns, 300000);
    }

    destroyed (): void {
      this.timer && clearInterval(this.timer);
    }

    getSignalImage(type: string, level: number): string {
      return `http://10.148.83.228:2008/warningSignals/${type}_${level}.png`;
    }

    getSignalLevel(county: string): string {
      let data: Signal[] = this.signalAreas.filter(el => el.county === county);
      return data.length ? data[0].color : 'grey';
    }

    selectCounty(item: Signal): void {
      console.log(item);
      if(this.selectedCounty === item.county)
        return;
      this.selectedCounty = item.county;
      this.signalTime = item.publishTime;
      let signalKey: string = this.selectedSignal + String(item.level);
      if(signalKey in this.signalGuideGroup) {
        this.signalGuide = this.signalGuideGroup[signalKey];
      } else {
        for(let i in this.signalGuideGroup) {
          if(i.indexOf(this.selectedSignal) !== -1) {
            this.signalGuide = this.signalGuideGroup[i];
            break;
          }
        }
      }
    }

    async selectSignal(signal: SignalData, index: number): Promise<void> {
      if(this.selectedSignal === signal.key)
        return;
      
      this.selectedSignal = signal.key;
      this.signalAreas = signal.data;
      this.selectedCounty = signal.data.length ? signal.data[0].county : '';
      this.signalTime = signal.data.length ? signal.data[0].publishTime : '';

      let signalKey: string = signal.key + signal.level;
      if(Object.keys(this.signalGuideGroup).length) {
        if(signal.level && signalKey in this.signalGuideGroup) {
          this.signalGuide = this.signalGuideGroup[signalKey];
          return;
        }
        if(signal.level === 0) {
          let flag = false;
          for(let i in this.signalGuideGroup) {
            if(i.indexOf(signal.key) !== -1) {
              flag = true;
              this.signalGuide = this.signalGuideGroup[i];
              break;
            }
          }
          if(flag)
            return;
        }
      }
      let guide: string = await this.getSignalGuides(signal.type, signal.key, signal.level);
      if(signal.key === this.selectedSignal)
        this.signalGuide = guide;
    }

    async updateWarningSigns(): Promise<void> {
      try {
        this.isLoading = true;
        let warningSign: WarningSign = new WarningSign();
        let data: Array<SignItem> = await warningSign.getWarningSigns(this.city);
        for(let signal of this.signalsData) {
          let signals: Signal[] = [],
              level: number = 0;
          for(let item of data) {
            if(item.warningType !== signal.type)
              continue;
            if(item.level > level)
              level = item.level;
            signals.push({
              county: item.releaseArea,
              type: item.warningType,
              level: item.level,
              color: item.color,
              publishTime: item.releaseTime
            });
          }
          if(signals.length > 1) 
            signals.sort((a, b) => b.level - a.level);

          signal.data = signals;
          signal.level = level;
        }
        let warningSignals = this.signalsData.filter(el => el.level > 0);
        let levelCode: number = 0;
        if(warningSignals.length) {
          this.selectedSignal = warningSignals[0].key;
          this.signalAreas = warningSignals[0].data;
          this.selectedCounty = this.signalAreas[0].county;
          this.signalTime = this.signalAreas[0].publishTime;
          levelCode = this.signalAreas[0].level;
        } else {
          this.selectedSignal = this.signalsData[0].key;
          this.signalAreas = this.signalsData[0].data;
          this.selectedCounty = '';
          this.signalTime = '';
        }

        let key: string = this.selectedSignal + levelCode;
        if(key in this.signalGuideGroup === false) {
          let type: string = warningSignals.length ? warningSignals[0].type : this.signalsData[0].type;
          let guide: string = await this.getSignalGuides(type, this.selectedSignal, levelCode);
          this.signalGuide = guide;
        } else {
          this.signalGuide = this.signalGuideGroup[key];
        }

        this.isLoading = false;
      }
      catch(e) {
        this.signalTime = '';
        this.signalGuide = '';
        this.isLoading = false;
      }
    }

    async getSignalGuides(type: string, key: string, level: number): Promise<string> {
      let warningSign: WarningSign = new WarningSign();
      let signalGuide: Array<SignalGuide> = await warningSign.getSignalGuide(type);
      if(signalGuide.length) {
        for(let item of signalGuide) {
          let levels: string[] = ['无预警', '红色', '橙色', '黄色', '蓝色', '白色'];
          this.signalGuideGroup[key + levels.indexOf(item.level)] = item.guide;
        }
        if(!level) {
          return signalGuide[0].guide;
        }
        let signKey = key + level;
        if(signKey in this.signalGuideGroup)
          return this.signalGuideGroup[signKey];
      }
      return '';
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/theme.scss';
  $contHeight: 400px;

  #warning-signs {
    width: 100%;
    height: $contHeight;
    position: relative;
    .warning-signs-wrapper {
      width: calc(100% - 20px);
      height: calc(100% - 60px);
      position: relative;
      background-color: white;
      padding: 0 10px 10px;
      .warning-signal-list {
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
        >li {
          width: calc(20% - 10px);
          position: relative;
          display: inline-block;
          vertical-align: top;
          padding: 5px;
          cursor: pointer;
          &.selected-signal {
            background-color: #a2a2a2;
            border-radius: 2px;
          }
          >img {
            width: 100%;
          }
        }
      }
      .warning-signal-areas {
        width: 100%;
        position: relative;
        display: block;
        font-size: 0;
        margin: 5px 0;
        // span.warning-signal-area {
        //   position: relative;
        //   display: block;
        //   padding: 0 10px;
        //   text-indent: 5px;
        //   em {
        //     width: 10px;
        //     height: 10px;
        //     position: absolute;
        //     left: 0;
        //     top: 50%;
        //     margin-top: -5px;
        //     display: inline-block;
        //   }
        // }
        
        .warning-signal-area {
          height: 28px;
          position: relative;
          display: inline-block;
          vertical-align: top;
          padding: 0 8px 0 10px;
          margin-right: 10px;
          line-height: 28px;
          font-size: 12px;
          text-align: left;
          text-indent: 10px;
          cursor: pointer;
          em {
            width: 10px;
            height: 10px;
            position: absolute;
            left: 5px;
            top: 8px;
            display: inline-block;
          }
        }
        .selected-county {
          border-bottom: 3px solid $themeColor;
        }
      }
      .warning-signal-time {
        width: calc(100% - 20px);
        height: 20px;
        position: relative;
        padding: 0 10px;
        margin-top: 5px;
        line-height: 20px;
        font-size: 14px;
      }
      .warning-signal-guide {
        width: calc(100% - 20px);
        max-height: 140px;
        position: relative;
        display: inline-block;
        padding: 0 10px;
        font-size: 14px;
        white-space: pre-wrap;
        line-height: 20px; /*no*/
        font-family: "Microsoft YaHei";
        overflow-y: auto;
        @include scrollStyle;
      }
      .signal-guide-max {
        max-height: 200px;
        margin-top: 5px;
      }
    }
  }
</style>
<style lang="scss">
  .warning-signal-areas .el-tabs__item {
    padding: 0 10px !important;
  }
</style>

