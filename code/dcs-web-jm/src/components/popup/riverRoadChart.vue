<template>
  <div id="river-road-popup" class="poi-detail-popup" v-if="show" v-drag="{handle: '.poi-detail-title'}">
      <div class="poi-detail-title">
        {{riverRoadData ? riverRoadData.name + '雨量信息' : ''}}
        <span @click="closePopup">✕</span>
      </div>
      <div id="river-road-chart" style="width: 520px; height: 300px;"></div>
  </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        data() {
            return {
                show: false
            }
        },
        computed: {
            ...mapGetters([
                'riverRoadData'
            ])
        },
        methods: {
            ...mapActions([
                'renderRiverRoadChart'
            ]),
            closePopup() {
                this.show = false;
            }
        },
        watch: {
            riverRoadData(nv) {
                if(nv === null) {
                    this.show = false;
                    return;
                }
                this.show = true;
                const attrs = ['rain24', 'rain12', 'rain06', 'rain03', 'rain02', 'rain01', 'qpe', 'qpf60', 'qpf120', 'qpf180'];
                let data = [];
                attrs.forEach(el => {
                    if(nv.hasOwnProperty(el)) {
                        let v = Number(nv[el].toFixed(1));
                        data.push(v || 0);
                    }
                });
                this.$nextTick(() => {
                    this.renderRiverRoadChart({ eleDom: document.querySelector("#river-road-chart"), data });
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
#river-road-popup {
  width: 540px;
  right: 50%;
  top: 50%;
  margin: -150px -260px 0px 0px;
  #river-road-chart {
    position: relative;
    padding: 20px 10px 5px 10px;
  }
}
</style>
