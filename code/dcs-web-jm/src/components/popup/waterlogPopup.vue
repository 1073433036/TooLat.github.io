<template>
  <div id="waterlog-detail-popup" class="poi-detail-popup"
       v-if="waterlogPopup.show"
       v-drag="{handle: '.poi-detail-title'}">
    <div class="poi-detail-title" :title="waterlogPopup.title">
      {{waterlogPopup.title.substring(0, 24)}}
      <span @click="closeModelSitePopup('waterlogPopup')">✕</span>
    </div>
    <div class="poi-detail-wrapper">
      <div class="popup-detail-tab">
        <ul>
          <li :class="{'popup-tab-selected': isBaseInfo}" @click="toggleDetailTab">基本信息<em v-show="isBaseInfo"></em></li>
          <li :class="{'popup-tab-selected': !isBaseInfo}" @click="toggleDetailTab">雨量信息<em v-show="!isBaseInfo"></em></li>
        </ul>
      </div>
      <div class="waterlog-popup-wrapper" v-show="isBaseInfo">
        <ul>
          <li v-for="el in waterlogPopup.params" :title="el.value"><span>{{el.text}}：</span>{{el.value}}</li>
        </ul>
        <div class="waterlog-threshold-setting">
          <span>雨量阈值(mm)：</span>
          <ul>
            <li v-for="el in waterlogPopup.threshold">
              <span v-text="el.text"></span>
              <input type="text" readonly="readonly" :value="el.value"/>
            </li>
          </ul>
        </div>
      </div>
      <div class="waterlog-popup-wrapper" id="waterlog-rain-chart" style="width: 520px; height: 300px;" v-show="!isBaseInfo"></div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default{
    data(){
        return{
            isBaseInfo: true
        }
    },
    computed: {
        ...mapGetters([
            'waterlogPopup',
            'waterlogPoiInfo'
        ])
    },
    beforeDestroyed() {
        if(this.waterlogPopup.rainChart) {
            this.waterlogPopup.rainChart.destroy();
        }
    },
    methods: {
        ...mapActions([
            'closeModelSitePopup',
            'renderWaterlogRainChart'
        ]),

        toggleDetailTab() {
            this.isBaseInfo = !this.isBaseInfo;
        }
    },
    watch: {
        waterlogPoiInfo(poi) {
            if(!Object.keys(poi).length)
                return;
            this.$nextTick(() => {
                if(!Array.isArray(poi.fstData)) {
                    return;
                }

                const rainTimes = this.waterlogPopup.rainTimes;
                let fstData = poi.fstData.filter((v, index) => { return rainTimes.includes(index); });
                this.renderWaterlogRainChart({ eleDom: document.querySelector('#waterlog-rain-chart'), data: fstData });
            });
        }
    }
}
</script>
<style lang="sass" scoped>
$popupWidth: 540px

#waterlog-rain-chart
  margin: 0px 10px

#waterlog-detail-popup
  width: $popupWidth
  top: 100px
  left: 50%
  margin-left: -$popupWidth/2
  .poi-detail-wrapper
    width: 100%
    position: relative
    .waterlog-popup-wrapper
      width: 100%
      position: relative
      padding: 5px 0px 10px 0px
      >ul
        li
          width: ($popupWidth/2 - 15)
          height: 24px
          position: relative
          display: inline-block
          padding-left: 15px
          line-height: 24px
          overflow: hidden
          &:first-child, &:nth-child(4), &:nth-child(5)
            width: $popupWidth - 15
          span
            height: 100%
            position: relative
            display: inline-block
      .waterlog-threshold-setting
        >span
          height: 24px
          position: relative
          display: inline-block
          padding-left: 15px
          line-height: 24px
          vertical-align: top
        >ul
          width: $popupWidth - 112
          display: inline-block
          vertical-align: top
          li
            width: ($popupWidth - 112)/2
            height: 24px
            position: relative
            display: inline-block
            line-height: 24px
            padding-bottom: 5px
            span
              height: 100%
              position: relative
              display: inline-block
            input
              width: 80px
              height: 22px
              position: relative
              display: inline-block
              padding: 0px
              border: 1px solid #ddd
              border-radius: 2px
              text-indent: 4px
</style>
