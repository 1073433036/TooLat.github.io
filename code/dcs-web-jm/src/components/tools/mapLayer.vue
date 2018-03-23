<template>
    <main id="map-layer">
        <ul>
            <li v-for="(opt, key) in mapLayerOpts"
                v-if="opt.show"
                @click="changeMapLayer(key, opt)">
                <span v-text="opt.text"></span>
            </li>
        </ul>
    </main>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            selected: 'business',
            mapLayerOpts: {
                business: {
                    text: '业务图',
                    url: 'http://10.148.16.56/zs/data/Gmap/DH/DH_Colour_All_MKT_NEW/wmts?layer=img&style=default&tilematrixset=default028mm&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}',
                    ext: 'png',
                    show: false
                },
                business_old: {
                    text: '业务图(原)',
                    url: 'http://10.148.83.229/google_bus2/googlemaps/roadmap',
                    ext: 'png',
                    show: true
                },
                terrain: {
                    text: '地形图',
                    url: 'http://10.148.83.229/google_terr2/googlemaps/terrain',
                    ext: 'jpg',
                    show: true
                },
                satellite: {
                    text: '卫星图',
                    url: 'http://10.148.83.229/google_sat/googlemaps/satellite',
                    ext: 'png',
                    show: true
                },
                morphTo2D: {
                    text: '2D地图',
                    show: false
                },
                morphTo3D: {
                    text: '3D地图',
                    show: true
                }
            },
        }
    },
    computed:{
        ...mapGetters([
            'boundLayers'
        ])
    },
    methods: {
        ...mapActions([
            'changeTileLayer',
            'toggleTerrain'
        ]),
        changeMapLayer(key, layer) {
            if(key === this.selected)
                return;

            if(key === 'morphTo3D') {
                this.mapLayerOpts.morphTo3D.show = false;
                this.mapLayerOpts.morphTo2D.show = true;
                viewer.scene.morphTo3D();
                this.toggleTerrain(true);
                setTimeout(() => {
                    viewer.flyTo(this.boundLayers.currentViewLayer, { duration: 1 });
                }, 2000);
            }
            else if(key === 'morphTo2D') {
                this.mapLayerOpts.morphTo3D.show = true;
                this.mapLayerOpts.morphTo2D.show = false;
                viewer.scene.morphTo2D();
                this.toggleTerrain(false);
                setTimeout(() => {
                    viewer.flyTo(this.boundLayers.currentViewLayer, { duration: 1 });
                }, 2000);
            }
            else {
                for(let i in this.mapLayerOpts) {
                    if(i.includes('morphTo'))
                        continue;
                    this.mapLayerOpts[i].show = i !== key;
                }
                this.changeTileLayer(layer);
            }
            this.selected = key;
        }
    }
}
</script>
<style lang="scss" scoped>
#map-layer {
  /*width: 236px;*/
  height: 30px;
  position: absolute;
  right: 30px;
  top: -1px;
  background: rgba(70, 70, 70, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  ul {
    height: 100%;
    display: inline-block;
    vertical-align: top;
    font-size: 0;
    white-space: nowrap;
    li {
      height: 100%;
      position: relative;
      display: inline-block;
      vertical-align: top;
      font-size: 0;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, .2);
      }
      &:last-of-type > span {
        border-right: none!important;
      }
      span {
        height: 14px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        margin: 7px 0px;
        padding: 0px 8px;
        font-size: 12px;
        line-height: 14px;
        border-right: 1px solid rgba(255, 255, 255, .34);
      }
    }
  }
}
</style>
