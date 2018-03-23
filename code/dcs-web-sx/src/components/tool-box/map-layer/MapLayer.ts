import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './MapLayer.html?style=./MapLayer.scss'
import { GeographyClient } from '../../../util/clientHelper'
import { Helper } from "../../../util/Helper"

@WithRender
@Component
export default class MapLayer extends Vue {
  @Prop() closeFunc
  @Getter('systemStore/region_global') region_global

  selected: string = 'satellite'
  mapLayerOpts: any = {
    business: {
      text: '业务图',
      // url: 'http://10.148.83.229/google_bus2/googlemaps/roadmap',
      url: 'http://119.29.102.103:8097/vt/lyrs=m&x={x}&y={y}&z={z}',
      ext: 'png',
      show: true
    },
    terrain: {
      text: '地形图',
      // url: 'http://10.148.83.229/google_terr2/googlemaps/terrain',
      url: 'http://119.29.102.103:8097/vt/lyrs=p&x={x}&y={y}&z={z}',
      ext: 'jpg',
      show: true
    },
    satellite: {
      text: '卫星图',
      // url: 'http://10.148.83.229/google_sat/googlemaps/satellite',
      url: 'http://119.29.102.103:8097/vt/lyrs=y&x={x}&y={y}&z={z}',
      ext: 'png',
      show: true
    },
    morphTo2D: {
      text: '2D地图',
      show: true
    },
    morphTo3D: {
      text: '3D地图',
      show: false
    }
  }

  async changeMapLayer(key, layer) {
    if(key === this.selected) return;
    let viewer = window["viewer"]

    if(key === 'morphTo2D' || key === 'morphTo3D') {
      if(key === 'morphTo2D') {
        viewer.scene.morphTo2D();
        this.mapLayerOpts.morphTo3D.show = true;
      } else {
        viewer.scene.morphTo3D();
        this.mapLayerOpts.morphTo2D.show = true;
      }
      layer.show = false;
      setTimeout(() => {
        let boundLayer = viewer.entities.getById('sxboundary');
        viewer.flyTo(boundLayer, {duration: 1});
      }, 2000);
    } else {
      this.selected = key;
      const layers = viewer.imageryLayers;
      // let imgPvd = window["Zearth"].createOpenStreetMapImageryProvider({
      //     url : layer.url,
      //     fileExtension: layer.ext,
      //     tileWidth: 256,
      //     tileHeight: 256,
      //     minimumLevel: 0,
      //     maximumLevel: 18,
      //     tilingScheme: new window["Zearth"].WebMercatorTilingScheme()
      // });
      let imgPvd = new window["Zearth"].UrlTemplateImageryProvider({
        url : layer.url,
        tilingScheme : new window["Zearth"].WebMercatorTilingScheme(),
        tileWidth: 256,
        tileHeight: 256,
        minimumLevel: 0,
        maximumLevel : 18
      })
      layers.addImageryProvider(imgPvd);
      setTimeout(() => layers.remove(layers.get(0)), 1000);       //延迟删除上一个图层    

      // let bounds = await GeographyClient.getCountyBound(this.region_global.countyId)
      // if (!bounds) return
      // viewer.entities.removeById('sxboundary')
      // let boundArray = []
      // for (let bound of bounds.boundary[0]) {
      //   boundArray.push(bound.x)
      //   boundArray.push(bound.y)
      // }
      // let helper = new Helper()
      // let color = key === 'satellite' ? 'violet.5' : '#f00'
      // let boundLayer = helper.addPolyline(boundArray, 2, color, true, 'polyline', 'sxboundary')
      // helper = null
    }
  }
}