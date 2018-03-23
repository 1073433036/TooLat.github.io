import fetchJsonp from 'fetch-jsonp'
import coordinateTransform from "./coordinateTransform";

export default class ModelAssess {
  constructor(regionData = null) {
    this._regionData = regionData
  }
  _regionData: any = null;
  _request = null;
  _urlStore = {
    roaUrl: 'http://10.148.10.80:8111/',                  //roa基础路径
    focusPoint: 'dict/focuspoint/s3/',                    //预警点
    disasterSite: 'dict/facilitiesGD/',                   //灾害关注点基础路径
    geoSite: 'dict/facilitiesGD/s10/',                    //地质灾害隐患点
    fireSite: 'dict/facilitiesGD/s11/',                   //火情隐患点
    waterlogSite: 'dict/facilitiesGD/s12/',               //内涝关注点
    county: 'dict/geologyGD/s2/',                         //获取县区信
    town: 'dict/geologyGD/s3/',                           //获取城镇信息

    baseUrl: 'http://10.148.83.228:9002/',                //NC基础路径
    listUrl: 'nc/jsonp/list/',                            //获取模式文件
    ncInfoUrl: 'nc/jsonp/ncinfo',                         //NCINFO
    imgUrl: 'nc/jsonp/nc/contour',                        //画图路径
    rangeUrl: 'nc/jsonp/nc/contour/range',                //区间画图
    townUrl: 'nc/jsonp/nc/eval/range',                    //区间影响镇
    jsonUrl: 'nc/jsonp/json/info',                        //JSON数据路径
    shapeImg: 'nc/jsonp/shape/render',                    //使用shape填色
    pointDataUrl: 'nc/jsonp/nc/data/point',               //单点指定要素数据
    pointAllvar: 'nc/jsonp/nc/data/point/allvar',         //单点所有要素数据
    pointMulti: 'nc/jsonp/nc/data/point/multi',           //多点单要素数据
    areaDataUrl: 'nc/jsonp/nc/data/area',				          //区域点数据
    typhoonNcUrl: 'nc/jsonp/txt/info',                    //台风对应的模式文件
    historyTyphEffectUrl: 'nc/jsonp/tp/contour',          //历史台风应i系
    fireSimulate: 'http://10.148.83.228:9020/dao/point',     //火险点对应模式文件
    pollutionSimulate: 'http://10.148.83.228:9020/dao/pollutionDiffusion',     //污染点对应模式文件
    riverOrRoadPoint: 'http://10.148.83.228:9020/data/p', //河流和道路单点值
  };
  _bound = {
    width: 2000,
    height: 1000,
    left: 109.66402,
    right: 117.28402,
    top: 25.52014,
    bottom: 20.24014
  };
  _modelName = {
    img: {
      "tide": "tide",
      "geology": "geology_nc",
      "geodisaster": "geodisaster",
      "fire": "fire_nc",
      "waterlogging": "waterlog_road",
      "rain": "grid_nc",
      "torrent": "torrent_poly"
    },
    poi: {
      "airpollution": "airpolution_nc_poi",
      "flood": "flood_nc_poi",
      "fire": "fire_nc_poi",
      "torrent": "torrent_json",
      "waterlogging": "waterlog_json",
      "reservoir": "reservoir_json",
      "flowConv": "RainTown"
    }
  };
  _filenamePrefix = {
    img: {
      "waterlogging": 'waterlog',
      "fire": 'gridHTZ',
      "geology": 'geology',
      "geodisaster": 'slide',
      "tide": 'tide',
      "rain": 'grid',
      "torrent": 'torrent'
    },
    poi: {
      "flood": "flood",
      "waterlogging": 'waterlog',
      "fire": 'fire',
      "geology": 'geology',
      "torrent": 'torrent',
      "reservoir": 'reservoir',
      "flowConv": "RainTown"
    }
  };
  _pointTypes = {
    "fire": "林火",
    "waterlogging": "内涝",
    "geology": "滑坡;崩塌;泥石流;地面塌陷",
    "flood": "洪水",
    "airpollution": "废气",
  };
  _levelRanges = {
    tide: {
      values: [[20, 60], [60, 100], [100, 140], [140, 180], [180, 230], [230, 300], [300, 400]],
      levels: ["I级", "Ⅱ级", "III级", "Ⅳ级", "V级", "VI级", "VII级"],
      colors: ["rgb(125,190,254)", "rgb(29,158,214)", "rgb(0,204,51)", "rgb(187,228,10)", "rgb(247,94,0)", "rgb(255,0,102)", "rgb(223,0,223)"]
    },
    airpollution: {
      values: [[0.00001, 0.00002], [0.00002, 0.00003], [0.00003, 0.00004], [0.00004, 1]],
      levels: ["轻微", "轻度", "中度", "重度"],
      colors: ["rgb(30,60,255)", "rgb(0,210,140)", "rgb(230,220,50)", "rgb(240,0,130)"]
    },
    fire: {
      values: [[0, 25], [25, 50], [50, 72], [72, 90], [90, 100]],
      //levels: ["低火险", "较低火险", "中等火险", "高火险", "极高火险"],
      levels: ["难燃", "较难然", "可燃", "易燃", "极易燃"],
      colors: ["rgb(95,248,0)", "rgb(201,247,0)", "rgb(253,176,0)", "rgb(249,71,0)", "rgb(246,19,0)"]
    },
    flood: {
      values: [[0, 3], [3, 6], [6, 9], [9, 10]],
      levels: ["I级", "II级", "III级", "IV级"],
      colors: ["rgb(255,169,159)", "rgb(250,120,98)", "rgb(236,66,43)", "rgb(220,0,0)"]
    },
    waterlogging: {
      values: [[0, 0.35], [0.35, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.85], [0.85, 1]],
      levels: ["无影响", "轻微", "较轻", "中等", "较严重", "严重"],
      colors: ["rgb(69,248,0)", "rgb(173,247,0)", "rgb(248,226,1)", "rgb(252,151,1)", "rgb(251,97,1)", "rgb(246,19,0)"]
    },
    geology: {
      values: [[20, 45], [45, 70], [70, 90], [90, 100]],
      levels: ["IV级", "III级", "II级", "I级"],
      colors: ["rgb(69,248,0)", "rgb(229,244,1)", "rgb(253,176,0)", "rgb(246,19,0)"]
    }
  };

  //获取区县信息
  async getCounty() {
    const urlStore = this._urlStore;
    const url = `${urlStore.roaUrl}${urlStore.county}${this._regionData.cityId},/JSONP/`;
    let res = await fetchJsonp(url)
    return res.json();
  }

  //获取城镇信息
  async  getTowns() {
    const urlStore = this._urlStore;
    const url = `${urlStore.roaUrl}${urlStore.town}${this._regionData.cityId},,/JSONP/`;
    let res = await fetchJsonp(url)
    return res.json();
  }

  //获取模型灾害隐患点
  async getFocusPoint(type) {
    const regionData = this._regionData;
    const urlStore = this._urlStore;
    const pointTypes = this._pointTypes;

    let url = `${urlStore.roaUrl}${urlStore.focusPoint}${pointTypes[type]},广东,${regionData.cityName},${regionData.countyName || ''}/JSONP/`;
    let res = await fetchJsonp(url)
    let response: any = res.json()
    let data = response.data;
    if (typeof data === 'string' && /DB_ERR/.test(data)) {
      throw 'error'
    } else {
      return data
    }
  }

  async getGeoSites() {
    const regionData = this._regionData;
    const urlStore = this._urlStore;

    let url = `${urlStore.roaUrl}${urlStore.geoSite}${regionData.cityId},${regionData.countyId || ''},,,`
      + `崩塌;滑坡;滑坡&崩塌群;泥石流;地面塌陷;崩塌滑坡;地裂缝;地面沉降/JSONP/`;
    let res = await fetchJsonp(url)
    let response: any = res.json()

    let data = response.data;
    if (typeof data === 'string' && /DB_ERR/.test(data)) {
      return null
    } else {
      return data
    }
  }

  async getDisasterSites(disaType) {
    const regionData = this._regionData;
    const urlStore = this._urlStore;

    const typeCode = {
      'geology': 's10',
      'fire': 's11',
      'waterlogging': 's12',
      'torrent': 's14'
    };

    const url = `${urlStore.roaUrl}${urlStore.disasterSite}${typeCode[disaType]}/${regionData.cityId},${regionData.countyId || ''},,`
      + `${disaType === 'geology' ? ',崩塌;滑坡;滑坡&崩塌群;泥石流;地面塌陷;崩塌滑坡;地裂缝;地面沉降' : ''}/JSONP/`;
    let res = await fetchJsonp(url)
    let response: any = res.json()

    let data = response.data;
    if (typeof data === 'string' && /DB_ERR/.test(data)) {
      throw 'error'
    } else {
      return data
    }
  }

  //获取nc模式参数名称
  getModelName(model, isPoi) {
    const modelConfig = isPoi ? this._modelName.poi : this._modelName.img;
    return modelConfig[model];
  }

  //获取nc文件名
  getFilename(model, datetime, isPoi) {
    const prefixConfig = isPoi ? this._filenamePrefix.poi : this._filenamePrefix.img;
    return `${prefixConfig[model]}${datetime}${isPoi ? '.json' : '.nc'}`;
  }

  //获取模型NC
  async getNcInfo(modelName, fileName) {
    const urlStore = this._urlStore;

    let url: URL = new URL(urlStore.baseUrl + urlStore.ncInfoUrl);
    let params = this._areaComp({ modelName, fileName });

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    let res = await fetchJsonp(url.toString())
    let response: any = res.json()

    let ncInfo = response;
    if (ncInfo == 'null') {
      throw 'error'
    } else {
      return ncInfo
    }
  }


  //获取模型JSON评估结果
  async  getPointJson(modelName, fileName) {
    const urlStore = this._urlStore;

    let url: URL = new URL(urlStore.baseUrl + urlStore.jsonUrl);
    let params = this._areaComp({ modelName, fileName });

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    let res = await fetchJsonp(url.toString())
    let response: any = res.json()

    let data = response.data;
    if (data instanceof Array === false || !data.length) {
      throw 'error'
    } else {
      return data
    }
  }

  //获取面格点值
  async getAreaValues(ncInfo, options) {
    const urlStore = this._urlStore;

    let ncInfoArea = this._areaComp(options || {
      seledVar: Array.isArray(ncInfo.vars) ? ncInfo.vars[0].name : '',
      seledTime: Array.isArray(ncInfo.times) ? ncInfo.times[0] : null,
      seledLevel: Array.isArray(ncInfo.levels) ? ncInfo.levels[0] : null,
    });
    const params = this._urlTraner(Object.assign(ncInfoArea, ncInfo));
    let url = `${urlStore.baseUrl}${urlStore.areaDataUrl}?${params}`;
    let res = await fetchJsonp(url)
    let response: any = res.json()
    let data = response.data;
    if (data instanceof Array === false || !data.length) {
      throw 'error'
    } else {
      return data
    }
  }

  //获取台风文件名
  async getTyphoonNc(modelName = 'tideinfo', fileName = 'info') {
    const urlStore = this._urlStore;

    let url: URL = new URL(urlStore.baseUrl + urlStore.typhoonNcUrl);
    let params = this._areaComp({ modelName, fileName });

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    let res = await fetchJsonp(url.toString())
    let response: any = res.json()

    if (!response || response == '') {
      throw 'error'
    } else {
      return response
    }
  }

  //获取随机火险点Nc
  /*  getFirePointNc(params) {
      const $http = this._$http;
      const urlStore = this._urlStore;
  
      return new Promise((resolve, reject) => {
        let mergeParams = this._areaComp(params);
        let url = urlStore.firePoint + '?' + this._urlTraner(mergeParams);
  
        $http.jsonp(url).then(response => {
          let data = response.data;
          if (data === null || !data.length) {
            reject();
          } else {
            resolve(data);
          }
        });
      });
    }
  */
  //获取随机爆炸污染点Nc
  /* async getPollutionPointNc(modelName, params) {
     const urlStore = this._urlStore;
 
       let mergeParams = this._areaComp(params);
       let url = `${urlStore.pollutionPoint}${modelName}?${this._urlTraner(mergeParams)}`;
       let res = await fetchJsonp(url)
       let response: any = await res.json()
         let data = response.data;
         if (data === null || !data.length) {
           throw 'error'
         } else {
           return data
         }
   }*/

  //根据区间范围获取模型评估影响的城镇
  async getEvalTowns(ranges, ncInfo, options) {
    const urlStore = this._urlStore;

    let ncInfoArea = Object.assign(options || {
      seledVar: ncInfo.vars[0].name,
      seledTime: ncInfo.times[0],
      seledLevel: ncInfo.levels[0]
    }, ncInfo);
    let params = this._areaComp({ ncInfoArea });

    let rankComped = this._rangeComp(ranges);
    params = Object.assign(rankComped, params);

    const url = urlStore.baseUrl + urlStore.townUrl + '?' + this._urlTraner(params);
    let res = await fetchJsonp(url + '&cache=' + new Date().getTime())

    let data: any = await res.json()
    if (data instanceof Array === false || !data.length) {
      return []
    } else {
      return data
    }
  }

  //获取所有区间的影响区域
  async getTownsByRanges(ranges, ncInfo, options) {
    let promiseArray = [];
    for (let i = 1; i < ranges.length; i++) {
      promiseArray.push(this.getEvalTowns([ranges[i - 1], ranges[i]], ncInfo, options));
    }
    try {
      let data = await Promise.all(promiseArray)
      console.info('townsListdata', data)
      //if (succCallback) succCallback(data)
      return data
    }
    catch (err) {
      //if (errCallback) errCallback(err)
      throw 'getting effected towns data failed!'
    }
  }

  // 获取火险poi图片
  async getSimulateImg(type, params, ncInfo) {
    const urlStore = this._urlStore;
    let rect: any = {},
      ncFileUrl = '',
      ncName = '',
      seledVar = ''

    switch (type) {
      case 'fire':
        ncFileUrl = urlStore.fireSimulate;
        ncName = this._modelName.poi.fire;
        seledVar = 'fire';
        break;
      case 'pollution':
        ncFileUrl = urlStore.pollutionSimulate;
        ncName = this._modelName.poi.airpollution;
        seledVar = 'con';
        break
      default:
        return false
    }

    if (!ncInfo) {
      let url: URL = new URL(ncFileUrl);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
      let res = await fetchJsonp(url.toString())
      let fileUrl = await res.json()
      var ncInfo = await this.getNcInfo(ncName, fileUrl.data.replace(/"/g, ''))
    }

    const _params = this._urlTraner(ncInfo, 'ncInfoArea.'),
      width = ncInfo.lonDim * 10,
      height = ncInfo.latDim * 10,
      top = ncInfo.topLat,
      left = ncInfo.leftLon,
      bottom = ncInfo.topLat - ncInfo.latGap * ncInfo.latDim,
      right = ncInfo.leftLon + ncInfo.lonGap * ncInfo.lonDim

    rect.top = top
    rect.left = left
    rect.right = right
    rect.bottom = bottom

    let contourUrl = `http://10.148.83.228:9002/nc/jsonp/nc/contour?ncInfoArea.seledVar=${seledVar}&ncInfoArea.seledTime=0&ncInfoArea.seledLevel=${ncInfo.levels}&${_params}&shaderOn=true&contourOn=false&contourLabelOn=false&bounds.width=${width}&bounds.height=${height}&bounds.top=${top}&bounds.bottom=${bottom}&bounds.left=${left}&bounds.right=${right}&projName=equ&cityId=${this._regionData.cityId}`

    let imgUrlStr: any = await fetchJsonp(contourUrl)
    imgUrlStr = imgUrlStr.json()
    let imgUrl = `http://10.148.83.228:9002/${imgUrlStr.data.replace(/"/g, '')}`

    return { imgUrl, rect, ncInfo }
  }

  //获取任意经纬度模型评估值
  async getPointValue(ncInfo, lng, lat) {
    let options = this._areaComp({
      seledLon: lng,
      seledLat: lat,
      seledLevel: ncInfo.levels[0],
      seledVar: ncInfo.vars[0].name
    });
    const urlStore = this._urlStore;
    const url = `${urlStore.baseUrl}${urlStore.pointDataUrl}?${this._urlTraner(Object.assign(options, ncInfo))}`;
    let res = await fetchJsonp(url)
    return res.json()
  }

  //获取多点模型评估值, pointArr格式:[{x: 112.23, y: 23.22},...]
  async getMultiPointValue(ncInfo, pointArr, seledVar = false) {
    if (!ncInfo || !Array.isArray(pointArr) || !pointArr.length) {
      console.error('Failed to get points array values');
      return;
    }
    let options = this._areaComp({
      seledLevel: ncInfo.levels[0],
      seledVar: seledVar ? seledVar : ncInfo.vars[0].name,
      points: pointArr
    });

    const urlStore = this._urlStore;
    const url = `${urlStore.baseUrl}${urlStore.pointMulti}?${this._urlTraner(Object.assign(options, ncInfo))}`;
    let res = await fetchJsonp(url)
    return res.json()
  }

  //获取模型评估图片
  /*
   * options:{
   *	 area:{
   *		seledVar变量名,
   *		seledTime预报时次,
   *		seledLevel层次
   *	 },
   *	 shader:,
   *	 contour:是否画等值线,
   *	 contourLabel:等值线层
   *	 ranges: 区间画图 - 可选参数
   * }
   */
  async getModelImage(ncInfo, options: any = {}): Promise<any> {
    const bounds = this._bound;
    let ncInfoArea = Object.assign(options.area || {
      seledVar: options.seledVar || ncInfo.vars[0].name,
      seledTime: options.seledTime || ncInfo.times[0],
      seledLevel: options.seledLevel || ncInfo.levels[0],
    }, ncInfo);
    let params = this._areaComp({
      ncInfoArea,
      bounds: options.bounds || bounds,
      shaderOn: true,
      contourOn: false,
      contourLabelOn: options.contourLabel || false,
      projName: "equ"
    });
    if (options.ranges && Object.keys(options.ranges).length) {
      params.ranges = options.ranges;
    }

    const urlStore = this._urlStore;
    let url = `${urlStore.baseUrl}${options.ranges ? urlStore.rangeUrl : urlStore.imgUrl}?${this._urlTraner(params)}`;
    let res = await fetchJsonp(url)
    let response: any = await res.json()
    let imgUrl = response;
    if (typeof imgUrl !== 'string') {
      throw 'error'
    } else {
      let imgSrc = `${urlStore.baseUrl}${imgUrl.replace(/\"/g, '')}`;
      let boundToConveted = options.bounds || bounds
      let leftTop = coordinateTransform.wgsTogcj(boundToConveted.left, boundToConveted.top)
      let rightBottom = coordinateTransform.wgsTogcj(boundToConveted.right, boundToConveted.bottom)
      let [left, top] = leftTop
      let [right, bottom] = rightBottom
      return Object.assign({ imgSrc }, {top, left, right, bottom});
    }
  }

  //通过shape填色, prefix: torrent20170320190000, bounds: { width, height, left, right, top, bottom }
  async getShapeImage(modelName, prefix, bounds, seledTime = 0) {
    const urlStore = this._urlStore;
    const fileName = `${prefix}.shp`;
    const params = Object.assign({ modelName, fileName, seledTime, cityId: this._regionData.cityId }, bounds);
    const url = `${urlStore.baseUrl}${urlStore.shapeImg}?${this._urlTraner(params)}`;

    let res = await fetchJsonp(url)
    let response: any = res.json()
    let data = response.data;
    if (typeof data !== 'string') {
      throw 'error'
    } else {
      let imgSrc = `${urlStore.baseUrl}${data.replace(/\"/g, '')}`;
      let img = new Image();
      img.onload = () => {
        return imgSrc
      };
      img.onerror = () => {
        throw 'error'
      }
      img.src = imgSrc;
    }
  }

  //获取流域或道路单点值
  /*  getRiverOrRoadPoint(lon, lat, fileName, beforeCallback) {
      let urlStore = this._urlStore;
      const url = `${urlStore.riverOrRoadPoint}?lon=${lon}&lat=${lat}&fileName=${fileName}&cityId=${this._regionData.cityId}`;
  
      return this._$http.jsonp(url, { before(request) { beforeCallback && beforeCallback(request) } });
    }*/

  //获取河流路径点
  async getRiverPolyline() {
    let urlStore = this._urlStore;
    const url = `${urlStore.baseUrl}${urlStore.jsonUrl}?fileName=torrent.json&modelName=torrent_json&cityId=${this._regionData.cityId}`;
    let res = await fetchJsonp(url)
    return res.json()
  }

  //根据镇id数组匹配镇名
  matchTownsName(townData, countyData, townsIdArray) {
    console.info('match')
    // console.info(townData, countyData, townsIdArray)
    console.info(townsIdArray)
    let allLevelList = [];
    for (let idArr of townsIdArray) {
      let townsNameData = {};
      if(!idArr[0]) continue
      for (let id of idArr[0]){
        const tw = townData[id];
        console.info(tw)
        if (tw === undefined || tw.countyId in countyData === false
          || tw.town.includes('飞地') || tw.town.includes('争议地')) {
          continue;
        }
        const ct = countyData[tw.countyId];
        if (ct.county in townsNameData === false) {
          townsNameData[ct.county] = [];
        }
        townsNameData[ct.county].push(tw.town);
      }
      allLevelList.push(townsNameData);
    }
    return allLevelList;
  }

  //匹配模型等级范围
  matchRanges(model) {
    return this._levelRanges[model];
  }

  _areaComp(obj) {
    const regionData = this._regionData;
    const regionType = regionData.type;
    let area;

    switch (regionType) {
      case 'province':
        area = {};
        break;
      case 'county':
        area = { countyId: regionData.countyId };
        break;
      default:
        area = { cityId: regionData.cityId };
    }

    return Object.assign(obj || {}, area);
  }

  _rangeComp(data) {
    if (!Array.isArray(data) || data.length <= 1) return {}
    let obj = {}

    for (let i = 1; i < data.length; i++) {
      let objTemp = {}

      objTemp[`ranges[${i - 1}].min`] = data[i]
      objTemp[`ranges[${i - 1}].max`] = data[i - 1]
      obj = Object.assign(objTemp, obj)
    }
    return obj
  }

  _urlTraner(obj, levelPrefix = '') {
    function tranBeanUrl(bean, levelPrefix = "") {
      let url = '';
      for (let attr in bean) {
        let val = bean[attr];
        if (val instanceof Date) { // how to deal time? ignore here,not the best way
          url += "&" + levelPrefix + attr + ".time=" + val.getTime();
        }
        else if (val instanceof Array) {
          let size = val.length;
          let prefix = levelPrefix + attr + "[";
          for (let i = 0; i < size; i++) {
            if (val[i] instanceof Object) {
              url += tranBeanUrl(val[i], prefix + i + "].");
            } else {
              url += "&" + prefix + i + "]=" + val[i];
            }
          }
        }
        else if (val instanceof Object) {
          url += tranBeanUrl(val, levelPrefix + attr + ".");
        }
        else if (/^[0-9]{13}$/.test(val)) { // also is time
          url += "&" + levelPrefix + attr + ".time=" + val;
        }
        else {
          if (val != null)
            url += "&" + levelPrefix + attr + "=" + val;
        }
      }
      return url;
    }

    return tranBeanUrl(obj, levelPrefix).substr(1);
  }

  // 获取历史台风影响图片
  async getHistoryTyphEffectImg(tsid, fieldName = '', fun = '') {
    let params: any = {
      tsid,
      bounds: this._bound,
      fun,
      fieldName,
      colorTable: fieldName.match('wind') ? 'wind' : 'rain',
      shaderOn: true,
      contourOn: false,
      projName: 'equ',
      contourLabelOn: false,
      countyId: '',
      cityId: ''
    }
    if(this._regionData.type === 'county') {
      params.countyId = this._regionData.countyId
      delete params.cityId
    }
    else {
      params.cityId = this._regionData.cityId
      delete params.countyId
    }
    params = this._urlTraner(params)

    let rect = {
      top: this._bound.top,
      bottom: this._bound.bottom,
      left: this._bound.left,
      right: this._bound.right
    }

    let res = await fetchJsonp(this._urlStore.baseUrl + this._urlStore.historyTyphEffectUrl + '?' + params)
    let response = await res.json()
    return {
      rect,
      imgUrl: `http://10.148.83.228:9002/${response.replace(/"/g, '')}`
    }
  }
}
