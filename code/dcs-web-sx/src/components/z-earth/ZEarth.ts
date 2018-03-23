import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import WithRender from './ZEarth.html?style=./ZEarth.scss'

import fetchJsonp from "fetch-jsonp"
import { Helper } from "../../util/Helper"
import { GeographyClient } from '../../util/clientHelper'
import coordinateTransform from "../../util/coordinateTransform";

let boundLayer: any = null

@WithRender
@Component
export default class ZEarth extends Vue {
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Getter('systemStore/region_global') region_global
  @Action('systemStore/activeBlurControl_global') activeBlurControl_global
  @Getter('systemStore/typhSelected_global') typhSelected_global

  async mounted() {
    const Zearth: any = window['Zearth']
    window['viewer'] = new Zearth.Viewer('zearthContainer', {
      animation: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      selectionIndicator: false,
      infoBox: false,
      fullscreenButton: false,
      // imageryProvider: Zearth.createOpenStreetMapImageryProvider({ //地图切片
      //   url: 'http://10.148.83.229/google_sat/googlemaps/satellite',
      //   fileExtension: 'png',
      //   tileWidth: 256,
      //   tileHeight: 256,
      //   minimumLevel: 0,
      //   maximumLevel: 18,
      //   tilingScheme: new Zearth.WebMercatorTilingScheme()
      // }),
      imageryProvider: new Zearth.UrlTemplateImageryProvider({
        url : 'http://119.29.102.103:8097/vt/lyrs=y&x={x}&y={y}&z={z}',
        tilingScheme : new Zearth.WebMercatorTilingScheme(),
        tileWidth: 256,
        tileHeight: 256,
        minimumLevel: 0,
        maximumLevel : 18
      })
    });
    // window['viewer'].scene.globe.showWaterEffect = false

    const viewer: Zearth.Viewer = window['viewer']

    let credit = document.querySelector('.zearth-viewer-bottom');
    credit.parentNode.removeChild(credit);

    //设置默认视图
    Zearth.Camera.DEFAULT_VIEW_RECTANGLE = Zearth.Rectangle.fromDegrees(109.31, 20, 110.55, 21.35);

    const noTerrain = viewer.terrainProvider;
    const hasTerrain = new Zearth.ZearthTerrainProvider({ //高程切片
      url: 'http://10.148.83.229/smlterrain'
    });
    // this.storeTerrain({ hasTerrain, noTerrain });
    //默认添加高程切片
    viewer.terrainProvider = hasTerrain;

    let scene = viewer.scene;
    scene.sunBloom = false
    scene.globe.enableLighting = false;

    getRegionBound.call(this)

    viewer['zearthWidget'].screenSpaceEventHandler.removeInputAction(Zearth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    //navigation
    let helper = new Helper;
    let bounds = {
      left: 109.571,
      right: 110.546,
      top: 21.523,
      bottom: 20.97,
      width: 2000,
      height: 2000
    };
    helper.addNavigationBar(bounds);
    helper = null;

    this.initNineLine()
  }

  // 九段线
  async initNineLine() {
    let res = await fetch('http://10.148.83.228:2008/projshare/geo/get/nine/lines')
    let data = await res.json()
    if (data.result !== 'S_OK') return
    let lines = data.tagObject
    let helper = new Helper()
    for (let el of lines) {
      let boundArray = []
      for (let opt of el.polyLine) {
        boundArray.push(opt.x)
        boundArray.push(opt.y)
      }
      helper.addPolyline(boundArray, 2, '#c86a7a', true, 'polyline')
    }
    helper = null
  }

  async drawWindField(viewer: Zearth.Viewer) {
    let res = await fetch('http://10.148.83.228:8086/forecast/uvdata/user/post/,/post?start=2017-06-20%2000:00:00&leadtime=1')
    let data = await res.json()
    let u = data.tagObject.u10m
    let v = data.tagObject.v10m
    let info = { left: 109.5, right: 110.76, top: 21.71, bottom: 20, xgap: 0.09, ygap: 0.09, xdim: 20, ydim: 20 }

    let temp = viewer['weather']('wind', 'line', u, v, info, null)
    viewer['getWeatherScence']().blur = true
  }

  async drawRainParticle(viewer: Zearth.Viewer) {
    let res = await fetch('http://10.148.83.228:8086/forecast/animation/qpf/user/post/,/post?start=2017-06-20 04:00:00&from=6&to=60&element=qpfhour', {
      mode: 'cors',
      method: 'GET',
      cache: 'no-cache'
    })
    let data = await res.json()
    let entities: any = viewer.entities
    let canvas = document.createElement('canvas')
    canvas.width = 10
    canvas.height = 100
    document.body.appendChild(canvas)
    let ctx = canvas.getContext('2d')
    let img = document.createElement('img')
    img.style.display = 'none'
    img.src = '../../../static/img/colorTable/4.png'
    document.body.appendChild(img)
    img.onload = () => {
      ctx.drawImage(img, 1, 1)
      for (let item of data.tagObject) {
        if (item.value === 0) continue
        let colorValue = item.value >= 100 ? 99 : item.value
        let colorBytes = ctx.getImageData(1, colorValue, 1, 1)
        let helper = new Helper()
        entities.add({
          name: name,
          position: Zearth.Cartesian3.fromDegrees(item.lon, item.lat),
          ellipse: {
            extrudedHeight: item.value * 100,
            semiMajorAxis: 200,
            semiMinorAxis: 200,
            material: Zearth.Color.fromBytes(colorBytes.data[0], colorBytes.data[1], colorBytes.data[2], 255)
            // granularity: Zearth.Math.PI_OVER_TWO
          }
        })
      }
    }
  }

  async drawRadarParticle(viewer) {
    let color = {
      "30": [8, 29, 88],
      "35": [38, 52, 148],
      "40": [34, 94, 168],
      "42.5": [29, 145, 192],
      "45": [65, 182, 196],
      "47.5": [127, 205, 187],
      "50": [199, 233, 180],
      "52.5": [237, 248, 177],
      "55": [255, 255, 217]
    }
    let point = viewer.scene.primitives.add(new Zearth.PointPrimitiveCollection())
    let pixelSize = 5
    let requestArray = []
    let jsonArray = []
    for (let i = 1; i <= 21; i++) {
      requestArray.push(fetch(`../../../static/radarData/${i}.json`))
    }
    let responseArray: Response[] = await Promise.all(requestArray)
    for (let item of responseArray) {
      jsonArray.push(item.json())
    }
    let dataArray = await Promise.all(jsonArray)
    let colorTemp = []
    for (let firstItem of dataArray) {
      for (let item of firstItem) {
        if (item.value < 30) continue
        if (item.value > 55)
          colorTemp = color['55']
        else if (item.value > 52.5)
          colorTemp = color['52.5']
        else if (item.value > 50)
          colorTemp = color['50']
        else if (item.value > 47.5)
          colorTemp = color['47.5']
        else if (item.value > 45)
          colorTemp = color['45']
        else if (item.value > 42.5)
          colorTemp = color['42.5']
        else if (item.value > 40)
          colorTemp = color['40']
        else if (item.value > 35)
          colorTemp = color['35']
        else {
          colorTemp = color['30']
        }
        point.add({
          translucentByDistance: new Zearth.NearFarScalar(1.5e3, 1, 1.5e7, 0),
          position: Zearth.Cartesian3.fromDegrees(item.lon, item.lat, item.hight),
          color: Zearth.Color.fromBytes(colorTemp[0], colorTemp[1], colorTemp[2], 255),
          pixelSize
        })
      }
    }
  }
}

async function getRegionBound(this: ZEarth) {
  let bounds = await GeographyClient.getCountyBound(this.region_global.countyId);
  if (!bounds) return;

  let boundArray = [];
  for (let bound of bounds.boundary[0]) {
    boundArray.push(bound.x);
    boundArray.push(bound.y);
  }

  let helper = new Helper;
  boundLayer = helper.addPolyline(boundArray, 2, '#f00', true, 'polyline', 'sxboundary')

  window['viewer'].flyTo(boundLayer, { duration: 1 })

  helper = null
}

let obj = {
  "id": "rain",
  "position": {
    "cartographicDegrees": [0, 0, 0]
  },
  "ellipse": {
    "semiMajorAxis": 200,
    "semiMinorAxis": 200,
    "extrudedHeight": {
      "epoch": "start time",
      "number": [
        "time", 0
      ]
    },
    "material": {
      "solidColor": {
        "color": {
          "epoch": "start time",
          "rgba": [
            'time', 0, 0, 0,
          ]
        }
      }
    }
  }
}