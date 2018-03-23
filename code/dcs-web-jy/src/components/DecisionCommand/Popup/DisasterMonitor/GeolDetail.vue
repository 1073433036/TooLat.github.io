<template>
  <main id="GeolDetail" class="decision-popup" v-drag>
    <header>
      <span>地质灾害风险隐患点（{{ info.name }}）</span>
      <a @click="closePopup"></a>
    </header>
    <div class="content">
      <div class="tab-wrapper">
        <ul>
          <li v-for="(el, key) in tabs" :key="key"
              :class="{on: tabsSelected === key}"
              @click="tabsSelected = key">
            {{ el }}
          </li>
        </ul>
      </div>

      <div class="cont-wrapper">
        <ul class="cont" v-if="tabsSelected === 'basic'">
          <li v-for="el in paramOpts" :key="el.key" :title="info[el.key]">
            {{ el.text + '：' + (info[el.key] ? info[el.key] : '---') }}
          </li>
        </ul>
        <component :is="rainChartView" :info="info" :tabsSelected="tabsSelected"></component>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import RainChart from '../../CommonCompts/RainChart.vue'

  @Component
  export default class GeolDetail extends Vue {
    @Getter('decisionStore/disasterDetailInfo_global') info
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storeDisasterDetailInfo_global') storeDisasterDetailInfo_global

    tabs: any = {
      basic: '基本信息',
      pass: '过去雨量',
      forecast: '未来雨量'
    }
    tabsSelected: 'basic' | 'pass' | 'forecast' = 'basic'
    paramOpts: any[] = [
      // { key: 'ddatetime', text: '时间' },
      { key: 'latlon', text: '经纬度' },
      { key: 'detail', text: '详情' },
      { key: 'manager', text: '责任人' },
      { key: 'cellphone', text: '责任人电话' },
      { key: 'address', text: '地址' },
      { key: 'type', text: '灾害类型' },
      { key: 'scale', text: '灾害规模(m³)' },
      { key: 'stability', text: '稳定性' },
      { key: 'risk', text: '危险性' },
      { key: 'factor', text: '诱发因素' },
      { key: 'people', text: '威胁人员(人)' },
      { key: 'gdp', text: '潜在损失(万元)' },
      { key: 'measure', text: '防治对策' },
      { key: 'level', text: '灾害等级' }
    ]
    rainChartView: any = null

    closePopup() {
      this.storePopupStatus_global({ key: 'geolDetail', action: false })
      this.storeDisasterDetailInfo_global({})
    }

    @Watch('tabsSelected')
    ontabsSelectedChanged (val: any, oldVal: any) {
      this.rainChartView = val === 'basic' ? null : RainChart
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#GeolDetail {
  position: absolute;
  top: 100px;
  left: calc(50% - 350px);
  width: 700px;
  color: #575757;
  .content {
    .tab-wrapper {
      >ul {
        box-sizing: border-box;
        padding-left: 20px;
        >li {
          position: relative;
          display: inline-block;
          box-sizing: border-box;
          height: 30px;
          line-height: 30px;
          cursor: pointer;
          &:not(:nth-child(1)) {
            margin-left: 15px;
            &::after {
              position: absolute;
              top: 10px;
              left: -7px;
              content: '';
              width: 0px;
              height: 10px;
              border-left: 1px dashed #ccc; /*no*/
            }
          }
          &:hover {
            text-decoration: underline;
          }
          &.on {
            color: $themeColor;
          }
        }
      }
    }
    .cont-wrapper {
      padding: 10px;
      border-top: 1px dashed #ccc;
      ul.cont {
        li {
          display: inline-block;
          width: 50%;
          padding: 0 10px;
          box-sizing: border-box;
          height: 26px;
          line-height: 26px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      #table-wrapper {
        height: 300px;
      }
    }
  }
}
</style>