import { Helper } from './Helper'
import { SvgHelper } from './svgHelper'
import { getRankByLevel } from '../components/typhTimeline/typhUtil'
import moment from 'moment'

class TyphEntity {
  imgLayers: any = {}
  entities: any = {
    real: [],
    frse: [],
    other: []
  }
  rotateInterval: any = null
  rotateEntity: any = null
  camEvent: any = null
  eventHandler: any = {}
  windCircleEntity: any = null
  windCircleDatetime: any = null
}

export default class TyphHelper extends Helper {
  constructor() {
    super()
  }
  typhEntity = new TyphEntity()
  realPointData = null
  fstPointData = null
  selectedIndex: number = 0
  strokeWidth: number = 0

  drawTyph(data, camAutoMove = true, clickCallBack, mouseOverCallback) {
    return new Promise((resolve, reject) => {
      if (!data) reject('台风数据错误')
      const entities = this.entities
      const scene = this.scene
      const imgLayers: any = this.typhEntity.imgLayers

      let realPointData = data.real || []
      this.realPointData = realPointData
      this.fstPointData = data.forecast || []
      // 实况点最后一个点      
      const realLastPoint = [realPointData[realPointData.length - 1].lon, realPointData[realPointData.length - 1].lat]
      // 预报点排序
      let forseePointData = []
      if (data.forecast) {
        forseePointData = data.forecast.sort((a, b) => {
          return Number(a.leadtime) > Number(b.leadtime)
        })
      }

      if (camAutoMove) {
        this.flyTo(realLastPoint, 2000000)
      }

      let realDrawingData = this.computeDrawingPoint(realPointData)
      let forseeDrawingData = this.computeDrawingPoint(forseePointData)

      let realLineData = [],
        realLineColorData = [],
        frseLineData = [],
        frseLineColorData = []
      realDrawingData.forEach(el => {
        realLineData.push(...el.degrees)
        realLineColorData.push(el.color)
      })
      this.drawTyphPoints(realDrawingData, true)
      if (forseeDrawingData.length !== 0) {
        // 计算预报点两侧点
        let forseeRegionData = this.computeForseeRegionData(forseeDrawingData, realDrawingData)
        // 计算预报区域，用于绘制预报区域
        var forseeDrawingRegionData = this.computeForseeDrawingRegion(forseeRegionData, realDrawingData)
        this.drawTyphPoints(forseeDrawingData, false)
        // 由于预报点的特殊性，加上实际点的最后一个点
        frseLineData.push(...realLastPoint)
        frseLineColorData.push(' ')
        forseeDrawingData.forEach(el => {
          frseLineData.push(...el.degrees)
          frseLineColorData.push(el.color)
        })
      }

      this.typhEntity.rotateEntity = this.addBillboard(realLastPoint,
        this.getRotateEntityImgByLevel(realPointData[realPointData.length - 1]), 'center', 'center', [0, 0])
      // this.typhEntity.entities.real.push(rotateEntity)
      addingRotateEntity.call(this)

      this.typhEntity.entities.other.push(
        this.addLabel(data.tscname, realLastPoint, .6,
          realLineColorData[realLineColorData.length - 2], 'center', 'left', [15, 0])
      )

      // 绘制台风预报点文本
      this.drawForseeTextOfPoint(forseeDrawingData)

      let cameraHeight = this.viewer.camera.positionCartographic.height
      let strokeWidth = getStrokeWidthByCamHeight(cameraHeight)
      this.strokeWidth = strokeWidth

      let svgRealLineHelper = new SvgHelper(realLineData, 100, realLineColorData)
      let svgRealLine = svgRealLineHelper.getSvgLine(getLineStyleStr(strokeWidth))

      if (forseeDrawingData.length !== 0) {
        var svgRegionHelper = new SvgHelper(forseeDrawingRegionData, 200)
        var svgFrseLineHelper = new SvgHelper(frseLineData, 200, frseLineColorData)
        var svgRegion = svgRegionHelper.getSvgImg("fill: #ed3f3f; opacity: .3;")
        var svgRegionStroke = svgRegionHelper.getSvgImg(getStrokeString(strokeWidth * 1.8))
        var svgFrseLine = svgFrseLineHelper.getSvgLine(getLineStyleStr(strokeWidth, true))
        imgLayers.region = this.addImgLayer(svgRegion.svgImg, svgRegion.pathRule.rect)
        imgLayers.regionStroke = this.addImgLayer(svgRegionStroke.svgImg, svgRegionStroke.pathRule.rect)
        imgLayers.frseLine = this.addImgLayer(svgFrseLine.svgImg, svgFrseLine.pathRule.rect)
      }

      imgLayers.realLine = this.addImgLayer(svgRealLine.svgImg, svgRealLine.pathRule.rect)

      let camMoveEvent = () => {
        let heightDiff = Math.floor(this.viewer.camera.positionCartographic.height - cameraHeight)
        let isHeightChangeEnough = (heightDiff < 0 ? -heightDiff : heightDiff) >
          Math.floor(cameraHeight * .2)
        let _strokeWidth = getStrokeWidthByCamHeight(this.viewer.camera.positionCartographic.height)
        if (!isHeightChangeEnough || strokeWidth === _strokeWidth) return
        let _realLine = this.addImgLayer(svgRealLine.svgImg, svgRealLine.pathRule.rect)
        svgRealLine = svgRealLineHelper.getSvgLine(getLineStyleStr(_strokeWidth))

        if (forseeDrawingData.length !== 0) {
          svgRegionStroke = svgRegionHelper.getSvgImg(getStrokeString(_strokeWidth * 1.8))
          svgFrseLine = svgFrseLineHelper.getSvgLine(getLineStyleStr(_strokeWidth, true))
          var _regionStroke = this.addImgLayer(svgRegionStroke.svgImg, svgRegionStroke.pathRule.rect)
          var _frseLine = this.addImgLayer(svgFrseLine.svgImg, svgFrseLine.pathRule.rect)
        }

        setTimeout(() => {
          this.removeImgLayer(imgLayers.realLine)
          imgLayers.realLine = _realLine

          if (forseeDrawingData.length !== 0) {
            this.removeImgLayer(imgLayers.regionStroke)
            this.removeImgLayer(imgLayers.frseLine)
            imgLayers.regionStroke = _regionStroke
            imgLayers.frseLine = _frseLine
          }

          strokeWidth = _strokeWidth
          this.strokeWidth = _strokeWidth
          cameraHeight = this.viewer.camera.positionCartographic.height
        }, 300);

      }
      this.typhEntity.camEvent = camMoveEvent
      this.viewer.camera.moveEnd.addEventListener(camMoveEvent)

      let realMouseOver = this.getNewHandler()
      let realClick = this.getNewHandler()
      this.typhEntity.eventHandler.realClick = realClick
      this.typhEntity.eventHandler.realMouseOver = realMouseOver

      if (forseeDrawingData.length !== 0) {
        let frseMouseOver = this.getNewHandler()
        let frseClick = this.getNewHandler()
        this.typhEntity.eventHandler.frseClick = frseClick
        this.typhEntity.eventHandler.frseMouseOver = frseMouseOver
      }

      let entitiesForOverEvent
      if (forseeDrawingData.length !== 0) {
        entitiesForOverEvent = this.typhEntity.entities.real.concat(this.typhEntity.entities.frse)
      } else {
        entitiesForOverEvent = this.typhEntity.entities.real
      }
      let realEntitiesLength = this.typhEntity.entities.real.length

      this.setAction('mouseOver', realMouseOver, entitiesForOverEvent, (entities, index, pos, info) => {
        let dataTarget, indexTarget
        if (index < realEntitiesLength) {
          indexTarget = index
          dataTarget = realDrawingData
        } else {
          dataTarget = forseeDrawingData
          if (forseeDrawingData.length !== 0)
            indexTarget = Number(index) - Number(realEntitiesLength)
          else
            indexTarget = Number(index)
        }
        let lastDatetime = this.typhEntity.windCircleDatetime ? this.typhEntity.windCircleDatetime : false
        let datetime = dataTarget[indexTarget] ? dataTarget[indexTarget].datetime : null
        if (index === undefined && lastDatetime !== datetime) {
          if (this.typhEntity.windCircleEntity)
            this.removeImgLayer(this.typhEntity.windCircleEntity)
          this.typhEntity.windCircleDatetime = null
        }
        if (index !== undefined && lastDatetime !== datetime) {
          this.typhEntity.windCircleEntity = this.addingWindCircle(dataTarget[indexTarget])
          this.typhEntity.windCircleDatetime = dataTarget[indexTarget].datetime
        } else {
          lastDatetime = null
        }
        if (mouseOverCallback)
          mouseOverCallback(index !== undefined, pos, dataTarget[indexTarget])
      })
      /*this.setAction('mouseOver', frseMouseOver, this.typhEntity.entities.frse, (entities, index, pos, info) => {
        if(mouseOverCallback) {
          mouseOverCallback(index === undefined ? false : 'frse', pos, forseeDrawingData[index], info)
        }
      }, 'frse')*/

      this.setAction('click', realClick, entitiesForOverEvent, (entities, index, pos, info) => {
        let dataTarget, indexTarget
        if (index < realEntitiesLength) {
          indexTarget = index
          dataTarget = realDrawingData
        } else {
          dataTarget = forseeDrawingData
          if (forseeDrawingData.length !== 0)
            indexTarget = Number(index) - Number(realEntitiesLength)
          else
            indexTarget = Number(index)
        }
        this.typhEntity.rotateEntity.position =
          new window['Zearth'].Cartesian3.fromDegrees(...dataTarget[indexTarget].degrees)
        this.typhEntity.rotateEntity.billboard.image._value =
          this.getRotateEntityImgByLevel(dataTarget[indexTarget])
        if (clickCallBack && index) {
          clickCallBack(dataTarget[indexTarget], pos)
        }
      }, 'real', true)

      this.selectedIndex = this.realPointData.length
      resolve()

      function getStrokeString(strokeWidth) {
        return `fill: none;stroke-width:${strokeWidth * 3}px; stroke: red;stroke-dasharray:${strokeWidth * 10} ${strokeWidth * 3}`
      }
      function getStrokeWidthByCamHeight(height) {
        let strokeWidth = Math.floor(height / 800000)
        if (strokeWidth > 20)
          strokeWidth = 20
        if (strokeWidth < 0.5)
          strokeWidth = 0.5
        if (strokeWidth > 15)
          strokeWidth = strokeWidth * .6
        return strokeWidth
      }
      function getLineStyleStr(strokeWidth, isDashed = false) {
        if (isDashed)
          return `stroke-width: ${isDashed ? strokeWidth * 1.7 * 4 : strokeWidth * 1.7}px; stroke-dasharray: ${
            isDashed ? strokeWidth * 25 : strokeWidth * 5} ${isDashed ? strokeWidth * 7.5 : strokeWidth * 1.5}`
        else
          return `stroke-width: ${strokeWidth}`
      }
      function addingRotateEntity() {
        let circlePerSecond = 720,
          rotateInit = 0,
          rotateFactor = 1000 / circlePerSecond
        this.typhEntity.rotateInterval = setInterval(() => {
          rotateInit += 0.05
          if (rotateFactor >= 360) rotateInit = 0
          this.typhEntity.rotateEntity.billboard.rotation = rotateInit
        }, rotateFactor)
      }

    })

    function getDateFromString(string) {
      return new Date(string)
    }
    function getSidePoints(lon1, lat1, lon2, lat2, forseeHour) {
      var dltLon = lon2 - lon1;
      var dltLat = lat2 - lat1;
      var dltLon2 = dltLon * dltLon;
      var dltLat2 = dltLat * dltLat;
      var dis1 = Math.sqrt(dltLon2 + dltLat2);
      var dis2 = getFstR(forseeHour) / 100.0;
      return {
        left: {
          lat: (dltLon * dis1 * dis2 + lat2 * dltLon2 + dltLat2 * lat2) / (dltLon2 + dltLat2),
          lon: (dltLon2 * lon2 + dltLat2 * lon2 - dis1 * dis2 * dltLat) / (dltLon2 + dltLat2)
        },
        right: {
          lat: (-dltLon * dis1 * dis2 + lat2 * dltLon2 + dltLat2 * lat2) / (dltLon2 + dltLat2),
          lon: (dltLon2 * lon2 + dltLat2 * lon2 + dis1 * dis2 * dltLat) / (dltLon2 + dltLat2)
        }
      }
      function getFstR(value) {
        const tanDis = {
          6: 3 * 8,
          12: 6 * 8,
          18: 10 * 8,
          24: 14 * 8,
          36: 19 * 8,
          48: 24 * 8,
          60: 30 * 8,
          72: 32 * 8,
          84: 40 * 8,
          96: 42 * 8,
          108: 48 * 8,
          120: 50 * 8
        }
        return tanDis[value]
      }
    }
  }

  addingWindCircle(data) {
    console.log(data)
    let windData: any = {}

    if (data.rr06)
      windData.rr06 = data.rr06
    if (data.rr07)
      windData.rr07 = data.rr07
    if (data.rr08)
      windData.rr08 = data.rr08
    if (data.rr10)
      windData.rr10 = data.rr10
    let windCircleSvg: any = new SvgHelper(data.degrees || [data.lon, data.lat], 100)
    windCircleSvg = windCircleSvg.getWindCircleImg(windData, this.strokeWidth)
    if (this.typhEntity.windCircleEntity)
      this.removeImgLayer(this.typhEntity.windCircleEntity)
    return this.addImgLayer(windCircleSvg.imgs, windCircleSvg.rect)
  }
  async drawForseeTyph(data, realDatetime) {
    const forseePointData = data
  }

  drawForseeTextOfPoint(data) {
    data.forEach(el => {
      this.typhEntity.entities.other.push(
        this.addLabel(el.forseeHour + 'h', el.degrees, .6, el.color, 'center', 'left', [10, 0])
      )
    })
  }

  drawTyphPoints(drawingData, isRealPoints = false) {
    let svgHelper = new SvgHelper(null),
      targetConainer = isRealPoints ? 'real' : 'frse',
      entities = this.typhEntity.entities[targetConainer],
      length = drawingData.length

    // if (isRealPoints) length--

    for (let i = 0; i < length; i++) {
      try {
        entities.push(this.viewer.entities.add({
          position: new window['Zearth'].Cartesian3.fromDegrees(...drawingData[i].degrees),
          billboard: {
            image: svgHelper.getSvgPoint(`fill: ${drawingData[i].color};  stroke: #263B5C`),
            scale: 1,
            eyeOffset: new window['Zearth'].Cartesian3(0, 0, 1)
          }
        }))
      }
      catch (e) {
        location.reload()
      }
    }

    drawingData.forEach((el, index) => {
      if (!el.degrees) return

      /*if (el.line)
        el.lineEty = this.addPolyline(el.line, 2, el.color)*/
    })
  }

  computeDrawingPoint(data) {
    let drawingData = [],
      dataLength = data.length

    for (let i = 0; i < dataLength; i++) {
      let target = data[i],
        datetime = new Date(data[i].datetime),
        level

      if (Number(target.location.lon) <= 0 || Number(target.location.lat) <= 0)
        continue

      if (target.elements.tcrank)
        level = target.elements.tcrank.trim()
      else
        level = 'LOW'

      datetime.setHours(datetime.getHours() + 8)
      drawingData.push({
        degrees: [target.location.lon, target.location.lat],
        color: this.getColorByLevel(level),
        rr06: target.elements.rr06 ? target.elements.rr06 : null,
        rr07: target.elements.rr07 ? target.elements.rr07 : null,
        rr08: target.elements.rr08 ? target.elements.rr08 : null,
        rr10: target.elements.rr10 ? target.elements.rr10 : null,
        forseeHour: target.leadtime ? target.leadtime : null,
        level: getRankByLevel(level, 'name'),
        levelRaw: target.elements.tcrank,
        datetime: moment(datetime).format('YYYY-MM-DD HH:00:00'),
        leadtime: target.leadtime ? target.leadtime : null,
        ps: data[i].elements.pressure,
        ws: data[i].elements.windspeed
      })
    }

    return drawingData
  }

  getColorByLevel(level, isFill = true) {
    switch (level) {
      case 'TD':
        return isFill ? '#AAEA72' : '#263B5C'
      case 'TS':
        return isFill ? '#a6bfff' : '#263B5C'
      case 'STS':
        return isFill ? '#edef5a' : '#263B5C'
      case 'TY':
        return isFill ? '#e7ae6c' : '#263B5C'
      case 'STY':
        return isFill ? '#f77bff' : '#263B5C'
      case 'SUPER':
        return isFill ? '#ed3f3f' : '#263B5C'
      default:
        return isFill ? '#AAEA72' : '#263B5C'
    }
  }

  getWindCircleLevel(level, isStroke = false) {
    switch (level) {
      case 'rr06':
        if (isStroke)
          return [146, 234, 240, 1]
        else
          return [146, 234, 240, .2]
      case 'rr07':
        if (isStroke)
          return [170, 174, 167, 1]
        else
          return [170, 174, 167, .2]
      case 'rr08':
        if (isStroke)
          return [81, 130, 255, 1]
        else
          return [81, 130, 255, .2]
      case 'rr10':
        if (isStroke)
          return [231, 174, 108, 1]
        else
          return [231, 174, 108, .2]
    }
  }

  computeForseeRegionData(forseeData, realDrawingData) {
    let forseeRegionData = {
      left: [],
      right: [],
    },
      sidePointsHolder = []
    forseeData.forEach((el, index, arr) => {
      if (index === 0) {
        sidePointsHolder.push(
          getSidePoints(realDrawingData[realDrawingData.length - 1].degrees[0], realDrawingData[realDrawingData.length - 1].degrees[1], el.degrees[0], el.degrees[1], el.forseeHour)
        )
      } else {
        sidePointsHolder.push(
          getSidePoints(arr[index - 1].degrees[0], arr[index - 1].degrees[1], el.degrees[0], el.degrees[1], el.forseeHour)
        )
      }
    })

    /*sidePointsHolder.forEach((el, index, arr) => {
        forseeRegionData.left.push([el.left.lon, el.left.lat])
        forseeRegionData.right.push([el.right.lon, el.right.lat])
    })*/

    return sidePointsHolder



    function getSidePoints(lon1 = 0, lat1 = 0, lon2 = 0, lat2 = 0, forseeHour = 0) {
      var dltLon = lon2 - lon1;
      var dltLat = lat2 - lat1;
      var dltLon2 = dltLon * dltLon;
      var dltLat2 = dltLat * dltLat;
      var dis1 = Math.sqrt(dltLon2 + dltLat2);
      var dis2 = getFstR(forseeHour) / 100.0;
      return {
        left: {
          lat: (dltLon * dis1 * dis2 + lat2 * dltLon2 + dltLat2 * lat2) / (dltLon2 + dltLat2),
          lon: (dltLon2 * lon2 + dltLat2 * lon2 - dis1 * dis2 * dltLat) / (dltLon2 + dltLat2)
        },
        right: {
          lat: (-dltLon * dis1 * dis2 + lat2 * dltLon2 + dltLat2 * lat2) / (dltLon2 + dltLat2),
          lon: (dltLon2 * lon2 + dltLat2 * lon2 + dis1 * dis2 * dltLat) / (dltLon2 + dltLat2)
        }
      }
      function getFstR(value) {
        const tanDis = {
          6: 3 * 8,
          12: 6 * 8,
          18: 10 * 8,
          24: 14 * 8,
          36: 19 * 8,
          48: 24 * 8,
          60: 30 * 8,
          72: 32 * 8,
          84: 40 * 8,
          96: 42 * 8,
          108: 48 * 8,
          120: 50 * 8
        }
        return tanDis[value]
      }
    }
  }

  removeTyphEntities(typhEntities) {
    clearInterval(typhEntities.rotateInterval)
    this.removeEntity(typhEntities.rotateEntity)
    for (let i in typhEntities.imgLayers) {
      this.removeImgLayer(typhEntities.imgLayers[i])
    }
    this.removeImgLayer(typhEntities.windCircleEntity)
    this.viewer.camera.moveEnd.removeEventListener(typhEntities.camEvent)
    for (let i in typhEntities.entities) {
      typhEntities.entities[i].forEach(el => this.removeEntity(el))
    }
    for (let i in typhEntities.eventHandler) {
      typhEntities.eventHandler[i].destroy()
    }
  }

  computeForseeDrawingRegion(forseeRegionData, realDrawingData) {
    let curvePointsHolder = [...realDrawingData[realDrawingData.length - 1].degrees],
      forseeRegionPointHolder = []
    for (let i in forseeRegionData) {
      curvePointsHolder.push(forseeRegionData[i].left.lon, forseeRegionData[i].left.lat);
    }

    forseeRegionPointHolder.push(...this.getCurvedPoints(curvePointsHolder, .5, 10, false))

    // 鍒ゆ柇鏈€鍚庝竴涓鎶ョ偣宸︾偣鐨勭含搴︽槸鍚﹀ぇ浜庡彸鐐圭殑绾害
    let isLeftBigger = false;
    if (forseeRegionData[forseeRegionData.length - 1].left.lat >
      forseeRegionData[forseeRegionData.length - 1].right.lat) {
      isLeftBigger = true;
    }

    // 璁＄畻鍦嗗姬鐐?
    const semiCirclePoints = [...this.getSemiPoints(forseeRegionData[forseeRegionData.length - 1].right,
      forseeRegionData[forseeRegionData.length - 1].left, 45, isLeftBigger)]

    if (isLeftBigger == true) {
      for (let i = 0; i < semiCirclePoints.length; i += 2) {
        forseeRegionPointHolder.push(semiCirclePoints[i], semiCirclePoints[i + 1])
      }
    } else {
      for (let i = semiCirclePoints.length - 1; i > 0; i -= 2) {
        forseeRegionPointHolder.push(semiCirclePoints[i - 1], semiCirclePoints[i])
      }
    }

    forseeRegionData.reverse();
    curvePointsHolder = [];
    for (let i in forseeRegionData) {
      curvePointsHolder.push(forseeRegionData[i].right.lon, forseeRegionData[i].right.lat);
    }
    forseeRegionData.reverse();
    forseeRegionPointHolder.push(...this.getCurvedPoints(curvePointsHolder, .5, 10, false));

    return forseeRegionPointHolder
  }

  getCurvedPoints(points, tension, numOfSeg, close) {
    if (typeof points === "undefined" || points.length < 2) return new Float32Array(0);

    // options or defaults
    tension = typeof tension === "number" ? tension : 0.5;
    numOfSeg = typeof numOfSeg === "number" ? numOfSeg : 25;

    var pts,															// for cloning point array
      i = 1,
      l = points.length,
      rPos = 0,
      rLen = (l - 2) * numOfSeg + 2 + (close ? 2 * numOfSeg : 0),
      res = new Float32Array(rLen),
      cache = new Float32Array((numOfSeg + 2) << 2),
      cachePtr = 4;

    pts = points.slice(0);

    if (close) {
      pts.unshift(points[l - 1]);										// insert end point as first point
      pts.unshift(points[l - 2]);
      pts.push(points[0], points[1]); 								// first point as last point
    }
    else {
      pts.unshift(points[1]);											// copy 1. point and insert at beginning
      pts.unshift(points[0]);
      pts.push(points[l - 2], points[l - 1]);							// duplicate end-points
    }

    // cache inner-loop calculations as they are based on t alone
    cache[0] = 1;														// 1,0,0,0

    for (; i < numOfSeg; i++) {

      var st = i / numOfSeg,
        st2 = st * st,
        st3 = st2 * st,
        st23 = st3 * 2,
        st32 = st2 * 3;

      cache[cachePtr++] = st23 - st32 + 1;							// c1
      cache[cachePtr++] = st32 - st23;								// c2
      cache[cachePtr++] = st3 - 2 * st2 + st;							// c3
      cache[cachePtr++] = st3 - st2;									// c4
    }

    cache[++cachePtr] = 1;												// 0,1,0,0

    // calc. points
    parse(pts, cache, l, tension);

    if (close) {
      //l = points.length;
      pts = [];
      pts.push(points[l - 4], points[l - 3],
        points[l - 2], points[l - 1], 							// second last and last
        points[0], points[1],
        points[2], points[3]); 								// first and second
      parse(pts, cache, 4, tension);
    }

    function parse(pts, cache, l, tension) {

      for (var i = 2, t; i < l; i += 2) {

        var pt1 = pts[i],
          pt2 = pts[i + 1],
          pt3 = pts[i + 2],
          pt4 = pts[i + 3],

          t1x = (pt3 - pts[i - 2]) * tension,
          t1y = (pt4 - pts[i - 1]) * tension,
          t2x = (pts[i + 4] - pt1) * tension,
          t2y = (pts[i + 5] - pt2) * tension,
          c = 0, c1, c2, c3, c4;

        for (t = 0; t < numOfSeg; t++) {

          c1 = cache[c++];
          c2 = cache[c++];
          c3 = cache[c++];
          c4 = cache[c++];

          res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
          res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
        }
      }
    }

    // add last point
    l = close ? 0 : points.length - 2;
    res[rPos++] = points[l++];
    res[rPos] = points[l];

    return res
  }

  getSemiPoints(left, right, num, isLeftBigger) {
    var points = [];
    var c = {
      lon: (left.lon + right.lon) / 2,
      lat: (left.lat + right.lat) / 2
    };
    var r = Math.sqrt((left.lon - right.lon) * (left.lon - right.lon) + (left.lat - right.lat) * (left.lat - right.lat)) / 2;
    var start = Math.atan((left.lon - c.lon) / (left.lat - c.lat));
    var dis = Math.PI;
    var step = dis / num;

    if (!isLeftBigger) {
      for (var i = 1; i < num; i++) {
        var angle = start - i * step;
        points.push(
          c.lon + r * Math.sin(angle),
          c.lat + r * Math.cos(angle)
        )
      }
    }

    if (isLeftBigger) {
      for (var i = 1; i < num; i++) {
        var angle = start + i * step;
        points.push(
          c.lon + r * Math.sin(angle),
          c.lat + r * Math.cos(angle)
        )
      }
    }

    return points
  }

  movingRotateEntity(index) {
    if (index > this.realPointData.length + this.fstPointData.length)
      return false

    let indexComputed = 0, //区分实况点和预报点index
      dataHolder = null
    if (index > this.realPointData.length) {
      indexComputed = index - this.realPointData.length
      dataHolder = this.fstPointData
    } else {
      indexComputed = index
      dataHolder = this.realPointData
    }

    indexComputed--

    this.typhEntity.rotateEntity.position = new window['Zearth'].Cartesian3.
      fromDegrees(dataHolder[indexComputed].lon, dataHolder[indexComputed].lat)
    this.typhEntity.rotateEntity.billboard.image._value =
      this.getRotateEntityImgByLevel(dataHolder[indexComputed])

    return true
  }

  getPointData(index) {
    if (index > this.realPointData.length + this.fstPointData.length)
      return false

    let indexComputed = 0, //区分实况点和预报点index
      dataHolder = null
    if (index > this.realPointData.length) {
      indexComputed = index - this.realPointData.length
      dataHolder = this.fstPointData
    } else {
      indexComputed = index
      dataHolder = this.realPointData
    }

    indexComputed--

    return dataHolder[indexComputed]
  }

  getRotateEntityImgByLevel(data) {
    let level
    if (data.levelRaw)
      level = data.levelRaw !=='LOW' ? data.levelRaw.trim() : 'TD'
    else
      level = (data.elements && data.elements.tcrank) ? data.elements.tcrank.trim() : 'TD'
    return `./static/img/typhoon/${level}.svg`
  }

}