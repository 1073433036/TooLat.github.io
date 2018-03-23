import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './AerialModel.html?style=./AerialModel.scss'

import { Helper } from '../../util/Helper'
import { GeographyClient } from '../../util/clientHelper'

let areaCircle = []
let areaPolyline = null

@WithRender
@Component
export default class AerialModel extends Vue {
  @Getter('systemStore/region_global') region_global

  display: any = {
    townPopup: false,
    modelPopup: false,
    waterPopup: false,
  }
  towns: any[] = []
  selectedTownText: string = '选择镇'
  selectedTownKey: number = null
  drowTown: any[] = []
  models: any = {
    气象局: {
      x: 110.24854,
      y: 21.401661,
      z: 1.500024664,
      h: 72.171369,
      height: 300,
      url: 'http://10.148.83.229/3dtile/sx/qixiangju/Production_1.json',
      posArr: [110.248158, 21.4024571, 110.247803, 21.4012333, 110.248822, 21.4008629, 110.249221, 21.4019476, 110.2490526, 21.40216769, 110.248158, 21.4024571]
    },
    县政府: {
      x: 110.250379,
      y: 21.3783463,
      z: 16.00004227,
      h: 49.4084369,
      height: 300,
      url: 'http://10.148.83.229/3dtile/sx/xianzhenfu/Production_2.json',
      posArr: [110.250277, 21.3797749, 110.24956, 21.3772171, 110.2506031, 21.376996581, 110.250664, 21.3773091, 110.25081, 21.377385255, 110.251204, 21.37920477, 110.2509376, 21.37942976, 110.250488, 21.37971634, 110.250277, 21.3797749]
    },
    国投公司: {
      x: 110.2801295,
      y: 21.40809989,
      z: -6.499445625,
      h: 90.7088601,
      height: 2500,
      url: 'http://10.148.83.229/3dtile/sx/jiujingcang/Production_1.json'
    },
    河滨路: {
      x: 110.2447436,
      y: 21.3674065,
      z: 16.00051728,
      h: 54.7469371,
      height: 200,
      url: 'http://10.148.83.229/3dtile/sx/hebinlu/Production_1.json'
    },
    草潭码头: {
      x: 109.7687519,
      y: 21.26709094,
      z: 15.00016883,
      h: 77.6664404,
      height: 200,
      url: 'http://10.148.83.229/3dtile/sx/caotan/Production_1.json'
    },
    官田水库: {
      x: 110.153538,
      y: 21.1825345,
      z: 22.00010251,
      h: 126.2942213,
      height: 1500,
      url: 'http://10.148.83.229/3dtile/sx/guantian/Production_1.json'
    },
    孔圣山仁济门: {
      x: 110.2354452,
      y: 21.36271838,
      z: 11.00001137,
      h: 79.6137596,
      height: 200,
      url: 'http://10.148.83.229/3dtile/sx/kongque_renji/Production_1.json'
    },
    孔圣山孔子庙: {
      x: 110.2320595,
      y: 21.36625323,
      z: 11.00001794,
      h: 56.6454366,
      height: 200,
      url: 'http://10.148.83.229/3dtile/sx/kongque_kongzi/Production_1.json'
    },
    孔圣山崇阳门: {
      x: 110.2318331,
      y: 21.36698581,
      z: 2.006607221,
      h: 73.9941053,
      height: 200,
      url: 'http://10.148.83.229/3dtile/sx/kongque_chongyang/Production_1.json'
    },
  }
  // models: any = {
  //   气象局: {
  //     x: 110.244307,
  //     y: 21.404432,
  //     z: 1.500024664,
  //     h: 72.171369,
  //     height: 200,
  //     url: 'http://10.148.83.229/3dtile/sx/qixiangju/Production_1.json',
  //     posArr: [110.248158, 21.4024571, 110.247803, 21.4012333, 110.248822, 21.4008629, 110.249221, 21.4019476, 110.2490526, 21.40216769, 110.248158, 21.4024571]
  //   },
  //   县政府: {
  //     x: 110.245931,
  //     y: 21.380838,
  //     z: 16.00004227,
  //     h: 49.4084369,
  //     height: 200,
  //     url: 'http://10.148.83.229/3dtile/sx/xianzhenfu/Production_2.json',
  //     posArr: [110.250277, 21.3797749, 110.24956, 21.3772171, 110.2506031, 21.376996581, 110.250664, 21.3773091, 110.25081, 21.377385255, 110.251204, 21.37920477, 110.2509376, 21.37942976, 110.250488, 21.37971634, 110.250277, 21.3797749]
  //   },
  //   国投公司: {
  //     x: 110.2740862,
  //     y: 21.4136443,
  //     z: -6.499445625,
  //     h: 90.7088601,
  //     height: 200,
  //     url: 'http://10.148.83.229/3dtile/sx/jiujingcang/Production_1.json'
  //   },
  //   河滨路: {
  //     x: 110.2447436,
  //     y: 21.3674065,
  //     z: 16.00051728,
  //     h: 54.7469371,
  //     height: 200,
  //     url: 'http://10.148.83.229/3dtile/sx/hebinlu/Production_1.json'
  //   },
  //   草潭码头: {
  //     x: 109.7687519,
  //     y: 21.26709094,
  //     z: 15.00016883,
  //     h: 77.6664404,
  //     height: 200,
  //     url: 'http://10.148.83.229/3dtile/sx/caotan/Production_1.json'
  //   },
  //   官田水库: {
  //     x: 110.1505967,
  //     y: 21.179135,
  //     z: 22.00010251,
  //     h: 126.2942213,
  //     height: 500,
  //     url: 'http://10.148.83.229/3dtile/sx/guantian/Production_1.json'
  //   },
  //   孔圣山仁济门: {
  //     x: 110.2354452,
  //     y: 21.36271838,
  //     z: 11.00001137,
  //     h: 79.6137596,
  //     height: 200,
  //     url: 'http://10.148.83.229/3dtile/sx/kongque_renji/Production_1.json'
  //   },
  //   孔圣山孔子庙: {
  //     x: 110.2320595,
  //     y: 21.36625323,
  //     z: 11.00001794,
  //     h: 56.6454366,
  //     height: 200,
  //     url: 'http://10.148.83.229/3dtile/sx/kongque_kongzi/Production_1.json'
  //   },
  //   孔圣山崇阳门: {
  //     x: 110.2318331,
  //     y: 21.36698581,
  //     z: 2.006607221,
  //     h: 73.9941053,
  //     height: 200,
  //     url: 'http://10.148.83.229/3dtile/sx/kongque_chongyang/Production_1.json'
  //   },
  // }
  selectedModel: string = '航拍模型'
  waterFlood: any = {
    草潭码头: [[109.771, 21.271], [109.773, 21.264], [109.765, 21.263], [109.764, 21.27]],
    官田水库: [[110.145, 21.18], [110.148, 21.184], [110.155, 21.177], [110.153, 21.174]],
  }
  waterFloodText: string = '水淹模拟'
  selectedWaterType: number = null
  waterLayer: any = null


  async initTown() {
    let countyId = this.region_global.countyId;
    let towns = await GeographyClient.getTownsBound(countyId);
    if(towns) this.towns = towns;
  }
  clearTown() {
    let helper = new Helper()
    this.selectedTownKey = null;
    this.selectedTownText = '选择镇';
    helper.removeEntity(this.drowTown)
    this.drowTown = []
    helper = null
  }
  toggleTown(opt) {
    let helper = new Helper()
    if(this.selectedTownKey === opt.townId) {
      this.clearTown()
    } else {
      this.selectedTownKey = opt.townId;
      this.selectedTownText = opt.name;
      if(this.drowTown.length) {
        helper.removeEntity(this.drowTown)
        this.drowTown = []
      }
      for(let boundary of opt.boundary) {
        let pos = [];
        for(let info of boundary) {
          pos.push(info.x);
          pos.push(info.y);
        }
        this.drowTown.push(helper.addPolyline(pos, 2, '#0b98ea', true, 'polyline'))
      }
      let points = JSON.parse(opt.center);
      points = [points.x, points.y];
      window['viewer'].camera.flyTo({
        destination: Zearth.Rectangle.fromDegrees(109.571, 20.97, 110.546, 21.523)
      })
    }
    helper = null
    this.display.townPopup = false;
  }

  initModel() {
    let viewer = window['viewer']
    let options = {
      dynamicScreenSpaceError : false,
      skipLevelOfDetail : false,
      cullWithChildrenBounds: false
    }
    for(let item in this.models) {
      viewer.scene.primitives.add(new Zearth.Zearth3DTileset(Object.assign({
        url : this.models[item].url
      }, options)));
    }
  }

  
  flyToModel(key) {
    this.removeCircle()
    this.removePolyline()
    if(this.selectedModel === key) {
      this.selectedModel = '航拍模型'
    } else {
      this.selectedModel = key
      let opt = this.models[key]
      //let boundingSphere = new Zearth.BoundingSphere(Zearth.Cartesian3.fromDegrees(opt.x, opt.y, opt.z), opt.h)
      let boundingSphere = new Zearth.BoundingSphere(Zearth.Cartesian3.fromDegrees(opt.x, opt.y, opt.z), opt.height)
      window['viewer'].camera.flyToBoundingSphere(boundingSphere)

      let helper = new Helper()
      if (key === '国投公司') {
        for(let i = 2995; i < 3000; i += 0.1) {
          areaCircle.push(helper.addCircleOutlineGeometry([opt.x, opt.y], i, new Zearth.ColorGeometryInstanceAttribute(1, 0.67, 0.0, 1)))        
        }
        for(let i = 1995; i < 2000; i += 0.1) {
          areaCircle.push(helper.addCircleOutlineGeometry([opt.x, opt.y], i, new Zearth.ColorGeometryInstanceAttribute(1, 0.0, 0.0, 1)))       
        }
      } else if (key === '气象局' || key === '县政府') {
        areaPolyline = helper.addPolyline(this.models[key].posArr, 2, '#f00')
      } else if (key === '官田水库') {
        for(let i = 1295; i < 1300; i += 0.1) {
          areaCircle.push(helper.addCircleOutlineGeometry([opt.x, opt.y], i, new Zearth.ColorGeometryInstanceAttribute(1, 0.0, 0.0, 1)))       
        }
      }
      helper = null

    }
    this.display.modelPopup = false
  }
  removeCircle() {
    if (!areaCircle.length) return
    areaCircle.map(item => {
      window['viewer'].scene.primitives.remove(item)
    })
    areaCircle = []
  }
  removePolyline() {
    if (!areaPolyline) return
    window['viewer'].entities.remove(areaPolyline)
    areaPolyline = null
  }

  clearModel() {
    this.removeCircle()
    this.removePolyline()
    this.selectedModel = '航拍模型'
  }

  toggleWaterType(key) {
    if(!this.selectedWaterType) {
      this.selectedWaterType = key
      let points = this.waterFlood[this.selectedModel]
      this.waterLayer = window['viewer'].addWaterFlood(points, 1, key)
    } else {
      if(this.selectedWaterType === key) {
        this.removeWaterFlood()
      } else {
        this.selectedWaterType = key
        this.waterLayer.setWaterType(key)
      }
    }
    this.display.waterPopup = false;
  }
  removeWaterFlood() {
    if(!this.waterLayer) return
    window['viewer'].removeWaterFlood(this.waterLayer)
    this.waterLayer = null
    this.selectedWaterType = null
  }

  @Watch('selectedModel')
  onselectedModelChanged(val: any, oldVal: any): void {
    this.removeWaterFlood()
  }

  mounted() {
    this.initTown();
    // this.initModel();
    
    // 获取经纬度
    // let viewer = window['viewer'], Zearth = window['Zearth']
    // let scene = viewer.scene
    // let ellipsoid = scene.globe.ellipsoid
    // let handler = new Zearth.ScreenSpaceEventHandler(viewer.scene.canvas)
    // handler.setInputAction(function(movement) {
    //   console.log(viewer.lonlat(movement.position))
    // }, Zearth.ScreenSpaceEventType.LEFT_CLICK)
  }
}