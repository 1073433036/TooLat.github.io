<template>
    <div id="zearthContainer" :class="{'grab': isGrab, 'pointer': !isGrab}"></div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters([
            'regionConfig',
            'isGrab'
        ])
    },
    mounted () {
        //添加地图全局变量
        window.viewer = new Zearth.Viewer('zearthContainer', {
            animation: false,
            baseLayerPicker: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            orderIndependentTranslucency: false,
            selectionIndicator: false,
            infoBox: false,
            timeline: false,
            homeButton: false,
            fullscreenButton: false,
            geocoder: false,
            sceneMode: Zearth.SceneMode.SCENE2D,
            imageryProvider: Zearth.createOpenStreetMapImageryProvider({ //地图切片
                url: 'http://10.148.16.56/zs/data/Gmap/DH/DH_Colour_All_MKT_NEW/wmts?layer=img&style=default&tilematrixset=default028mm&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}',
                fileExtension: 'png',
                tileWidth: 256,
                tileHeight: 256,
                minimumLevel: 0,
                maximumLevel: 18,
                tilingScheme: new Zearth.WebMercatorTilingScheme()
            }),
        });

        /*viewer.dataSources.add(Zearth.GeoJsonDataSource.load('static/json/jm_town.json', {
            fill: Zearth.Color.TRANSPARENT,
            stroke: Zearth.Color.GRAY.withAlpha(.5),
            strokeWidth: 1
        }));*/

        let credit = document.querySelector('.zearth-viewer-bottom');
        credit.parentNode.removeChild(credit);

        //设置默认视图
        Zearth.Camera.DEFAULT_VIEW_RECTANGLE = Zearth.Rectangle.fromDegrees(109.31, 20, 110.55, 21.35);

        const noTerrain = viewer.terrainProvider;
        const hasTerrain = new Zearth.ZearthTerrainProvider({ //高程切片
            url: 'http://10.148.83.229/smlterrain'
        });
        this.storeTerrain({ hasTerrain, noTerrain });
        //默认添加高程切片
        //viewer.terrainProvider = hasTerrain;

        let scene = viewer.scene;
        scene.sunBloom = false;
        scene.globe.enableLighting = false;
        scene.fog.enabled = false;  //去掉雾层

        const handler = new Zearth.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(movement => {
           let pickedObj = scene.pick(movement.endPosition);
           if(Zearth.defined(pickedObj)) {
                this.toggleEarthCursor({ key: 'isGrab', value: false });
           } else {
               this.toggleEarthCursor({ key: 'isGrab', value: true });
           }
        }, Zearth.ScreenSpaceEventType.MOUSE_MOVE);

        //双击entity,会放大视图,entity居中显示,且鼠标左键失去移动功能,鼠标滚轮失去作用
        viewer.screenSpaceEventHandler.removeInputAction(Zearth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        let regionConfig = this.regionConfig;
        let isCountyLevel = regionConfig.countyId !== 0;
        let url = isCountyLevel ? `county/countyid?countyId=${regionConfig.countyId}` : `citytwo/cityid?cityId=${regionConfig.cityId}`;
        this.$http.get(`http://10.148.83.228:2008/projshare/geo/find/${url}`)
          .then(response => {
            let data = response.data;
            if(data.result !== 'S_OK')
              return;
            this.drawBound(isCountyLevel ? data.tagObject.boundary : data.tagObject.bound);
            this.storeRegionData({ type: isCountyLevel ? 'county' : 'city', data: data.tagObject });
          });
    },
    methods: {
        ...mapActions([
            'storeTerrain',
            'drawBound',
            'storeRegionData',
            'toggleEarthCursor'
        ])
    }
}
</script>

<style lang="sass" scoped>
#zearthContainer
  position: absolute
  height: 100%
  width: 100%
.grab
  cursor: -webkit-grab
  cursor: -moz-grab
  cursor: grab
.grabbing
  cursor: -webkit-grabbing
  cursor: -moz-grabbing
  cursor: grabbing
.pointer
  cursor: pointer
</style>
