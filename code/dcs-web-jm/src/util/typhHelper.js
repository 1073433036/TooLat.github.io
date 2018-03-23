import { Helper } from './Helper'
import { SvgHelper } from './svgHelper'
import { getRankByLevel } from '../components/model/typhTimeline/typhUtil'

export default class TyphHelper extends Helper {
  constructor(viewer) {
    super(viewer);
    this.typhEntity = {
      imgLayers: {},
      entities: {
        real: [],
        frse: [],
        realLines: [],
        fstLines: [],
        other: []
      },
      rotateInterval: null,
      rotateEntity: null,
      camEvent: null,
      eventHandler: {},
      windCircleEntity: [],
      windCircleDatetime: null,
      svgRegionHelper: null,
      svgFrseLineHelper: null
    };
    this._typhData = null;
    this._realDrawingData = null;
    this.realPointData = null;
    this.movingRoatetEntity = this.movingRoatetEntity;
  }

  drawTyph(data, camAutoMove = true, clickCallBack, mouseOverCallback) {
    return new Promise((resolve, reject) => {
      if (!data)
        reject('台风数据错误');
      this._typhData = data;
      this._clickCallBack = clickCallBack;
      this._mouseOverCallback = mouseOverCallback;
      const imgLayers = this.typhEntity.imgLayers;
      let realPointData = this.realPointData = data.real;
      // 实况点最后一个点
      const realLastPoint = [Number(realPointData[realPointData.length - 1].lon), Number(realPointData[realPointData.length - 1].lat)];
      // 预报点排序
      let forseePointData = data.hasOwnProperty('fst') && Array.isArray(data.fst) ? data.fst.sort((a, b) => Number(a.leadtime) - Number(b.leadtime)) : [];

      if (camAutoMove) {
        this.flyTo(realLastPoint, 2000000);
      }

      let realDrawingData = this._realDrawingData = this.computeDrawingPoint(realPointData);
      let forseeDrawingData = this.computeDrawingPoint(forseePointData);

      this.drawTyphPoints(realDrawingData, true);

      this.typhEntity.rotateEntity = this.addBillboard(realLastPoint,
        this.getRotateEntityImgByLevel(realPointData[realPointData.length - 1]), 'center', 'center', [0, 0]);

      addingRotateEntity.call(this);

      this.typhEntity.entities.other.push(
        this.addLabel(data.tscname, realLastPoint, .6, realDrawingData[realDrawingData.length - 1].color, 'center', 'left', [15, 0])
      );

      let cameraHeight = this.viewer.camera.positionCartographic.height;
      let strokeWidth = this.getStrokeWidthByCamHeight(cameraHeight);

      if(forseeDrawingData.length) {
        // 计算预报点两侧点
        let forseeRegionData = this.computeForseeRegionData(forseeDrawingData, realLastPoint);
        // 计算预报区域，用于绘制预报区域
        let forseeDrawingRegionData = this.computeForseeDrawingRegion(forseeRegionData, realLastPoint);

        this.drawTyphPoints([realDrawingData[realDrawingData.length - 1]].concat(forseeDrawingData), false);
        // 绘制台风预报点文本
        this.drawForseeTextOfPoint(forseeDrawingData);

        // this.typhEntity.entities.region = this.addPolygon(forseeDrawingRegionData, 'red.3', false);
        // this.typhEntity.entities.regionLine = this.addDashline(forseeDrawingRegionData, 2, 'red');
        this.svgRegionHelper = new SvgHelper(forseeDrawingRegionData, 200);
        let svgRegion = this.svgRegionHelper.getSvgImg("fill: #ed3f3f; opacity: .3;"),
            svgRegionStroke = this.svgRegionHelper.getSvgImg(this.getStrokeString(strokeWidth * 1.8));

        imgLayers.region = this.addImgLayer(svgRegion.svgImg, svgRegion.pathRule.rect);
        imgLayers.regionStroke = this.addImgLayer(svgRegionStroke.svgImg, svgRegionStroke.pathRule.rect);

        forseeDrawingRegionData = null;
        forseePointData = null;
      }


      let camMoveEvent = () => {
        if(!this.svgRegionHelper)
          return;
        let heightDiff = Math.floor(this.viewer.camera.positionCartographic.height - cameraHeight);
        let isHeightChangeEnough = (heightDiff < 0 ? -heightDiff : heightDiff) > Math.floor(cameraHeight * .2);
        let _strokeWidth = this.getStrokeWidthByCamHeight(this.viewer.camera.positionCartographic.height);
        if (!isHeightChangeEnough || strokeWidth === _strokeWidth)
          return;

        let _regionStroke;
        let svgRegionStroke = this.svgRegionHelper.getSvgImg(this.getStrokeString(_strokeWidth));
        _regionStroke = this.addImgLayer(svgRegionStroke.svgImg, svgRegionStroke.pathRule.rect);

        setTimeout(() => {
          this.removeImgLayer(imgLayers.regionStroke);
          if(!this.typhEntity.camEvent) {
            this.removeImgLayer(_regionStroke);
            return;
          }
          imgLayers.regionStroke = _regionStroke;
          strokeWidth = _strokeWidth;
          cameraHeight = this.viewer.camera.positionCartographic.height;
        }, 300);

      }
      this.typhEntity.camEvent = camMoveEvent;
      this.viewer.camera.moveEnd.addEventListener(camMoveEvent);

      this.addTyphEvents(forseeDrawingData);

      resolve();

      function addingRotateEntity() {
        let circlePerSecond = 720,
            rotateInit = 0,
            rotateFactor = 1000 / circlePerSecond;
        this.typhEntity.rotateInterval = setInterval(() => {
          rotateInit += 0.05;
          if (rotateFactor >= 360)
            rotateInit = 0;
          this.typhEntity.rotateEntity.billboard.rotation = rotateInit;
        }, rotateFactor);
      }
    })
  }

  addTyphEvents(forseeDrawingData) {
    for(let i in this.typhEntity.eventHandler) {
      let eventHandler = this.typhEntity.eventHandler[i];
      this.removeAction(eventHandler, i);
    }

    let mouseOverHandler = this.getNewHandler();
    let clickHandler = this.getNewHandler();
    this.typhEntity.eventHandler.click = clickHandler;
    this.typhEntity.eventHandler.mouseOver = mouseOverHandler;
    let entitiesForEvent = this.typhEntity.entities.real.concat(this.typhEntity.entities.frse),
        realEntitiesLength = this.typhEntity.entities.real.length;

    const realDrawingData = this._realDrawingData;

    this.setAction('mouseOver', mouseOverHandler, entitiesForEvent, (entities, index, pos, info) => {
      let typhEntity = this.typhEntity;
      let dataTarget;
      if(typeof index !== 'number') {
        dataTarget = null;
        if (typhEntity.windCircleEntity)
          this.removeImgLayer(typhEntity.windCircleEntity);
        typhEntity.windCircleDatetime = null;
      } else {
        dataTarget = index < realEntitiesLength ? realDrawingData[index] : forseeDrawingData[index - realEntitiesLength];
        let lastDatetime = typhEntity.windCircleDatetime ? typhEntity.windCircleDatetime : null;
        let datetime = dataTarget ? dataTarget.datetime : null;
        if(lastDatetime !== datetime) {
          addingWindCircle.call(this, dataTarget);
          typhEntity.windCircleDatetime = dataTarget.datetime;
        }
      }

      if (this._mouseOverCallback)
        this._mouseOverCallback(index !== undefined, pos, dataTarget);
    })

    if(this._clickCallBack) {
      this.setAction('click', clickHandler, entitiesForEvent, (entities, index, pos, info) => {
        let clickFstTime;
        if(index) {
          if(index < realEntitiesLength) {
            this.setTyphTerminal(index);
          } else {
            clickFstTime = forseeDrawingData[index - realEntitiesLength].datetime;
          }
        }
        if (this._clickCallBack && (index || index === 0)) {
          this._clickCallBack(index, pos, this._typhData, clickFstTime);
        }
      }, 'real', true);
    }

    function addingWindCircle(data) {
      if(!data)
        return;
      let windData = {};

      if (data.rr06)
        windData.rr06 = data.rr06;
      if (data.rr07)
        windData.rr07 = data.rr07;
      if (data.rr08)
        windData.rr08 = data.rr08;
      if (data.rr10)
        windData.rr10 = data.rr10;

      let windCircleSvg = new SvgHelper(data.degrees, 100);
      let cameraHeight = this.viewer.camera.positionCartographic.height;
      let strokeWidth = this.getStrokeWidthByCamHeight(cameraHeight);
      windCircleSvg = windCircleSvg.getWindCircleImg(windData, strokeWidth);
      if (this.typhEntity.windCircleEntity)
        this.removeImgLayer(this.typhEntity.windCircleEntity);
      this.typhEntity.windCircleEntity = this.addImgLayer(windCircleSvg.imgs, windCircleSvg.rect);
    }
  }

  setTyphTerminal(index) {
    //判断当前位置是否已经处在台风最新实况点上
    let realPointsOfShow = this.typhEntity.entities.real.filter(el => el.show);
    if(realPointsOfShow.length === (index + 1))
      return;
    //删除台风预报点、线、文字
    ['other', 'frse', 'fstLines'].forEach(key => {
      this.typhEntity.entities[key].forEach(el => this.removeEntity(el));
      this.typhEntity.entities[key] = [];
    });
    //删除台风预报区域
    for(let i in this.typhEntity.imgLayers) {
      this.removeImgLayer(this.typhEntity.imgLayers[i]);
    }
    this.svgRegionHelper = null;

    let realLastPoint = this.realPointData[index];
    let lastDegrees = [Number(realLastPoint.lon), Number(realLastPoint.lat)];
    //修改台风旋转图标位置到选中实况点上
    this.typhEntity.rotateEntity.position = new Zearth.Cartesian3.fromDegrees(...lastDegrees);
    this.typhEntity.rotateEntity.billboard.image._value = this.getRotateEntityImgByLevel(realLastPoint);
    //根据选中的index显示或隐藏实况点与线
    this.typhEntity.entities.real.forEach((el, i) => {
      el.show = i <= index;
    });
    this.typhEntity.entities.realLines.forEach((el, i) => {
      el.show = i < index;
    });

    if(!Array.isArray((realLastPoint.fst)) || !realLastPoint.fst.length) {
      this.addTyphEvents([]);
      return;
    }

    const realDrawingData = this._realDrawingData;
    let forseeDrawingData = this.computeDrawingPoint(realLastPoint.fst);

    this.typhEntity.entities.other.push(
      this.addLabel(this._typhData.tscname, lastDegrees, .6, this.getColorByLevel(realLastPoint.level), 'center', 'left', [15, 0])
    );

    // 计算预报点两侧点
    let forseeRegionData = this.computeForseeRegionData(forseeDrawingData, lastDegrees);
    // 计算预报区域，用于绘制预报区域
    let forseeDrawingRegionData = this.computeForseeDrawingRegion(forseeRegionData, lastDegrees);

    let cameraHeight = this.viewer.camera.positionCartographic.height;
    let strokeWidth = this.getStrokeWidthByCamHeight(cameraHeight);
    let svgRegionHelper = this.svgRegionHelper = new SvgHelper(forseeDrawingRegionData, 200);
    let svgRegion = svgRegionHelper.getSvgImg("fill: #ed3f3f; opacity: .3;");
    let svgRegionStroke = svgRegionHelper.getSvgImg(this.getStrokeString(strokeWidth * 1.8));

    let imgLayers = this.typhEntity.imgLayers;
    imgLayers.region = this.addImgLayer(svgRegion.svgImg, svgRegion.pathRule.rect);
    imgLayers.regionStroke = this.addImgLayer(svgRegionStroke.svgImg, svgRegionStroke.pathRule.rect);
    this.drawTyphPoints([realDrawingData[index]].concat(forseeDrawingData));
    // 绘制台风预报点文本
    this.drawForseeTextOfPoint(forseeDrawingData);
    this.addTyphEvents(forseeDrawingData);

    forseeDrawingRegionData = null;
  }

  drawForseeTextOfPoint(data) {
    data.forEach(el => {
      this.typhEntity.entities.other.push(
        this.addLabel(el.forseeHour + 'h', el.degrees, .6, el.color, 'center', 'left', [10, 0])
      )
    })
  }

  drawTyphPoints(drawingData, isRealPoints = false) {
    let entities = this.typhEntity.entities[isRealPoints ? 'real' : 'frse'],
        lineEntities = this.typhEntity.entities[isRealPoints ? 'realLines' : 'fstLines'],
        length = drawingData.length;

    for (let i = 1; i < length; i++) {
      let prevPoint = drawingData[i - 1];
      let points = prevPoint.degrees.concat(drawingData[i].degrees);
      let lineEntity = isRealPoints ? this.addPolyline(points, 2, prevPoint.color)
        : this.addDashline(points, 2, prevPoint.color);
      lineEntities.push(lineEntity);
    }
    for (let i = 0; i < length; i++) {
      if(!isRealPoints && i === 0)
        continue;
      entities.push(this.addPoint(drawingData[i].degrees, 12, drawingData[i].color, 1, '#585858'));
    }
  }

  computeDrawingPoint(data) {
    let drawingData = [],
        dataLength = data.length;

    for (let i = 0; i < dataLength; i++) {
      let target = data[i],
          datetime = new Date(data[i].time || data[i].datetime),
          level;

      if(Number(target.lon) <= 0 || Number(target.lat) <= 0)
        continue;

      if (target.level)
        level = target.level.trim();
      else
        level = 'TD';

      datetime.setHours(datetime.getHours() + 8 + (target.leadtime ? Number(target.leadtime) : 0));
      drawingData.push({
        degrees: [Number(target.lon), Number(target.lat)],
        color: this.getColorByLevel(level),
        rr06: target.rr06 ? target.rr06 : null,
        rr07: target.rr07 ? target.rr07 : null,
        rr08: target.rr08 ? target.rr08 : null,
        rr10: target.rr10 ? target.rr10 : null,
        forseeHour: target.leadtime ? target.leadtime : null,
        level: getRankByLevel(level, 'name'),
        datetime: datetime.Format('yyyy-MM-dd HH:00:00'),
        ps: data[i].ps,
        ws: data[i].ws
      })
    }

    return drawingData;
  }

  getColorByLevel(level, isFill = true) {
    if(isFill) {
      switch (level) {
        case 'TD':
          return '#43d03c';
        case 'TS':
          return '#2d90f0';
        case 'STS':
          return '#e0cf34';
        case 'TY':
          return '#e68741';
        case 'STY':
          return '#ac31b3';
        case 'SUPER':
          return '#ce4445';
        default:
          return '#43d03c';
      }
    } else {
      return '#263B5C';
    }
  }

  getWindCircleLevel(level, isStroke = false) {
    let strokeAlpha = isStroke ? 1 : 0.2;
    switch (level) {
      case 'rr06':
        return [146, 234, 240, strokeAlpha];
      case 'rr07':
        return [170, 174, 167, strokeAlpha];
      case 'rr08':
        return [81, 130, 255, strokeAlpha];
      case 'rr10':
        return [231, 174, 108, strokeAlpha];
    }
  }

  computeForseeRegionData(forseeData, realLastPoint) {
    let sidePointsHolder = [];
    forseeData.forEach((el, index, arr) => {
      if (index === 0) {
        sidePointsHolder.push(getSidePoints(...realLastPoint, ...el.degrees, el.forseeHour));
      } else {
        sidePointsHolder.push(getSidePoints(...arr[index - 1].degrees, ...el.degrees, el.forseeHour));
      }
    })

    return sidePointsHolder;

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

  removeTyphEntities(typhEntities) {
    clearInterval(typhEntities.rotateInterval);
    this.removeEntity(typhEntities.rotateEntity);
    for (let i in typhEntities.imgLayers) {
      this.removeImgLayer(typhEntities.imgLayers[i]);
    }
    this.viewer.camera.moveEnd.removeEventListener(typhEntities.camEvent);
    typhEntities.camEvent = null;
    for (let i in typhEntities.entities) {
      typhEntities.entities[i].length && typhEntities.entities[i].forEach(el => this.removeEntity(el));
    }

    if(typhEntities.windCircleEntity)
      this.removeImgLayer(typhEntities.windCircleEntity);

    for (let i in typhEntities.eventHandler) {
      typhEntities.eventHandler[i].destroy();
    }
  }

  computeForseeDrawingRegion(forseeRegionData, realLastPoint) {
    let curvePointsHolder = [...realLastPoint],
        forseeRegionPointHolder = [];
    for (let i in forseeRegionData) {
      curvePointsHolder.push(forseeRegionData[i].left.lon, forseeRegionData[i].left.lat);
    }

    forseeRegionPointHolder.push(...this.getCurvedPoints(curvePointsHolder, .5, 10, false));

    let isLeftBigger = false;
    if (forseeRegionData[forseeRegionData.length - 1].left.lat >
      forseeRegionData[forseeRegionData.length - 1].right.lat) {
      isLeftBigger = true;
    }

    const semiCirclePoints = [...this.getSemiPoints(forseeRegionData[forseeRegionData.length - 1].right,
          forseeRegionData[forseeRegionData.length - 1].left, 45, isLeftBigger)];

    if (isLeftBigger == true) {
      for (let i = 0; i < semiCirclePoints.length; i += 2) {
        forseeRegionPointHolder.push(semiCirclePoints[i], semiCirclePoints[i + 1]);
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

    return forseeRegionPointHolder;
  }

  getCurvedPoints(points, tension, numOfSeg, close) {
    if (typeof points === "undefined" || points.length < 2) return new Float32Array(0);

    // options or defaults
    tension = typeof tension === "number" ? tension : 0.5;
    numOfSeg = typeof numOfSeg === "number" ? numOfSeg : 25;

    let pts,															// for cloning point array
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

      for (let i = 2, t; i < l; i += 2) {

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

  async movingRoatetEntity(type, index) {
    let indexForNow = index,
        totalPointCount = this.realPointData.length;

    if (type === 'previous') {
      if (indexForNow === 0) {
        return false;
      }
      indexForNow--;
    } else if (type === 'next') {
      if (indexForNow === totalPointCount - 1) {
        return false;
      }
      indexForNow++;
    }

    let realPoint = this.realPointData[indexForNow];
    this.typhEntity.rotateEntity.position = new Zearth.Cartesian3.fromDegrees(realPoint.lon, realPoint.lat);
    this.typhEntity.rotateEntity.billboard.image._value = this.getRotateEntityImgByLevel(realPoint);

    return true;
  }

  getRotateEntityImgByLevel(data) {
    let level = data.level && data.level !== 'LOW' ? data.level.trim() : 'TD';
    return `./static/img/typhoon/${level}.svg`
  }

  getStrokeString(strokeWidth) {
    return `fill: none;stroke-width:${strokeWidth * 3}px; stroke: red;stroke-dasharray:${strokeWidth * 10} ${strokeWidth * 3}`;
  }

  getStrokeWidthByCamHeight(height) {
    let strokeWidth = Math.floor(height / 900000);
    if (strokeWidth > 20)
      strokeWidth = 20;
    if (strokeWidth < 0.5)
      strokeWidth = 0.5;
    if (strokeWidth > 15)
      strokeWidth = strokeWidth * .6;
    return strokeWidth;
  }

  getLineStyleStr(strokeWidth, isDashed = false) {
    if (isDashed)
      return `stroke-width: ${isDashed ? strokeWidth * 1.7 * 4 : strokeWidth * 1.7}px; stroke-dasharray: ${
        isDashed ? strokeWidth * 25 : strokeWidth * 5} ${isDashed ? strokeWidth * 7.5 : strokeWidth * 1.5}`;
    else
      return `stroke-width: ${strokeWidth}`;
  }
}
