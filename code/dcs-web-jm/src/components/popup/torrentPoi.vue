<template>
  <div id="torrent-detail-popup" class="poi-detail-popup"
       v-if="torrentPopup.show"
       v-drag="{handle: '.poi-detail-title'}">
    <div class="poi-detail-title" :title="torrentPopup.title">
      {{torrentPopup.title.substring(0, 24)}}
      <span @click="closeModelSitePopup('torrentPopup')">✕</span>
    </div>
    <div class="poi-detail-wrapper">
      <ul>
        <li v-for="el in torrentPopup.params" :title="el.value"><span>{{el.text}}：</span>{{el.value}}</li>
      </ul>
      <div class="torrent-popup-wrapper" id="torrent-rain-chart" style="width: 520px; height: 300px;"></div>
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
            'torrentPopup',
            'torrentPoiInfo'
        ])
    },
    methods: {
        ...mapActions([
            'closeModelSitePopup',
            'renderTorrentRainChart'
        ]),

        toggleDetailTab() {
            this.isBaseInfo = !this.isBaseInfo;
        }
    },
    watch: {
        torrentPoiInfo(poi) {
            if(!Object.keys(poi).length)
                return;

            this.$nextTick(() => {
                if(!Array.isArray(poi.fstData)) {
                    return;
                }
                if(poi.fstData.length > 10) {
                    poi.fstData.splice(7, 1);
                }
                let thArray = [];
                for(let th of poi.threshold) {
                    let keys = Object.keys(th);
                    thArray.push(th[keys[0]]);
                }
                let rainData = [];
                poi.fstData.forEach((r, i) => {
                    rainData.push({
                        y: r,
                        color: r > thArray[i] ? '#ea6b6b' : '#7cb5ec'
                    });
                });
                this.renderTorrentRainChart({
                    eleDom: document.querySelector('#torrent-rain-chart'),
                    data: { rain: rainData, threshold: thArray }
                });
            });
        }
    }
}
</script>
<style lang="sass" scoped>
$popupWidth: 540px

#torrent-rain-chart
  margin: 0px 10px

#torrent-detail-popup
  width: $popupWidth
  top: 100px
  left: 50%
  margin-left: -$popupWidth/2
  .poi-detail-wrapper
    width: 100%
    position: relative
    ul
      padding: 5px 0px
      border-bottom: 1px solid #ddd
      li
        width: ($popupWidth/2 - 15)
        height: 24px
        position: relative
        display: inline-block
        padding-left: 15px
        line-height: 24px
        overflow: hidden
        span
          height: 100%
          position: relative
          display: inline-block

</style>
