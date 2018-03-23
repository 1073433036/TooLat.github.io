<template>
    <div id="geo-site-popup" class="ns poi-detail-popup" v-if="geoPopup.show" v-drag="{handle: '.poi-detail-title'}">
        <div class="poi-detail-title" :title="geoPopup.title">
            {{geoPopup.title.substring(0, 36)}}
            <span @click="closeModelSitePopup('geoPopup')">✕</span>
        </div>
        <div class="poi-detail-wrapper" style="width: 700px">
            <div class="popup-detail-tab">
              <ul>
                <li v-for="(el, key) in tabList"
                    :class="{'popup-tab-selected': el.selected}"
                    @click="toggleDetailTab(key)">
                  {{el.text}}
                  <em v-show="el.selected"></em>
                </li>
              </ul>
            </div>
            <div class="geo-detail-box">
                <ul v-show="tabList.baseInfo.selected">
                    <li v-for="el in geoPopup.params" :title="el.value">{{ el.text + '：' + el.value }}</li>
                </ul>
                <div class="rain-chart" id="rain-past-chart" style="width: 680px; height: 300px;" v-show="tabList.rainPast.selected"></div>
                <div class="rain-chart" id="rain-fst-chart" style="width: 680px; height: 300px;" v-show="tabList.rainFst.selected"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default{
    data() {
        return {
            tabList: {
                baseInfo: { text: '基本信息', selected: true },
                rainPast: { text: '过去雨量', selected: false },
                rainFst: { text: '未来雨量', selected: false },
            }
        }
    },
    beforeDestroyed() {
        this.geoPopup.rainPastChart && this.geoPopup.rainPastChart.destroy();
        this.geoPopup.rainFstChart && this.geoPopup.rainFstChart.destroy();
    },
    computed: {
        ...mapGetters([
            'dateTime',
            'geoPopup',
            'geoPoiInfo',
            'currentRegion',
            'selectedModel'
        ])
    },
    methods: {
        ...mapActions([
            'getRainPast',
            'getRainFst',
            'closeModelSitePopup'
        ]),
        toggleDetailTab(key) {
            for(let i in this.tabList) {
                this.tabList[i].selected = i === key;
            }
        }
    },
    watch: {
        selectedModel(nv) {
            if(this.geoPopup.show) {
                this.closeModelSitePopup('geology');
            }
        },
        geoPoiInfo(poi) {
            if(!Object.keys(poi).length)
                return;

            this.$nextTick(() => {
                let params = {
                    $http: this.$http,
                    lng: poi.longitude,
                    lat: poi.latitude
                };
                this.getRainPast(Object.assign({
                    eleDom: document.querySelector("#rain-past-chart"),
                    datetime: this.dateTime,
                    regionObj: this.currentRegion
                }, params));

                this.getRainFst(Object.assign({
                    eleDom: document.querySelector("#rain-fst-chart"),
                    starttime: this.dateTime
                }, params));
            });
        }
    }
}
</script>
<style lang="scss" scoped>
$popupWidth: 700px;

#geo-site-popup {
  width: $popupWidth;
  top: 100px;
  left: 50%;
  margin-left: -$popupWidth/2;
  .poi-detail-wrapper {
    width: $popupWidth;
    position: relative;
    .geo-detail-box {
      width: $popupWidth;
      position: relative;
      ul {
        padding: 10px;
        li {
          width: 46%;
          height: 26px;
          position: relative;
          display: inline-block;
          padding: 0 2%;
          line-height: 26px;
          overflow: hidden;
        }
      }
      .rain-chart {
        position: relative;
        margin: 0px 10px;
      }
    }
  }
}
</style>
