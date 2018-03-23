import axios from 'axios'
import jsonp from 'axios-jsonp'

export class ModelAssess {
  constructor(regionData = null) {
    this._regionData = regionData;
    this._urlStore = {
      roaUrl: 'http://10.148.10.80:8111/',                  //roa基础路径
      focusPoint: 'dict/focuspoint/s3/',                    //预警点
      disasterSite: 'dict/facilitiesGD/',                   //灾害关注点基础路径
      geoSite: 'dict/facilitiesGD/s10/',                    //地质灾害隐患点
      fireSite: 'dict/facilitiesGD/s11/',                   //火情隐患点
      waterlogSite: 'dict/facilitiesGD/s12/',               //内涝关注点
      county: 'dict/geologyGD/s2/',                         //获取县区信息
      town: 'dict/geologyGD/s3/',                           //获取城镇信息

      baseUrl: 'http://10.148.83.228:9002/',                //NC基础路径
      baseUrl_9020: 'http://10.148.83.228:9020/',
      listUrl: 'nc/jsonp/list/',                            //获取模式文件
      latestNc: 'data/productTime',                         //获取最新nc的时间 返回示例{ status: true, time: '20170823170000' }
      ncInfoUrl: 'nc/jsonp/ncinfo',                         //NCINFO
      imgUrl: 'nc/jsonp/nc/contour',                        //画图路径
      rangeUrl: 'nc/jsonp/nc/contour/range',                //区间画图
      townUrl: 'nc/jsonp/nc/eval/range',                    //区间影响镇
      jsonUrl: 'nc/jsonp/json/info',                        //JSON数据路径
      shapeImg: 'nc/jsonp/shape/render',                    //使用shape填色
      pointDataUrl: 'nc/jsonp/nc/data/point',               //单点指定要素数据
      pointAllvar: 'nc/jsonp/nc/data/point/allvar',         //单点所有要素数据
      pointMulti: 'nc/jsonp/nc/data/point/multi',           //多点单要素数据
      modelExtreme: 'nc/jsonp/nc/data/extreme',             //获取模式场极值
      areaDataUrl: 'nc/jsonp/nc/data/area',				          //区域点数据
      typhoonNcUrl: 'nc/jsonp/txt/info',                    //台风对应的模式文件
      historyTyphEffectUrl: 'nc/jsonp/tp/contour',          //历史台风应i系
      fireSimulate: 'http://10.148.83.228:9020/dao/point',     //火险点对应模式文件
      pollutionSimulate: 'http://10.148.83.228:9020/dao/pollutionDiffusion',     //污染点对应模式文件
      riverOrRoadPoint: 'http://10.148.83.228:9020/data/p', //河流和道路单点值
      enTitanImg: 'http://10.148.83.228:9020/data/titan',      //雷电监控图片接口
    };
    this._bound = {
      width: 2000,
      height: 1000,
      left: 109.66402,
      right: 117.28402,
      top: 25.52014,
      bottom: 20.24014
    };
    this._modelName = {
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
        "flowConv": "RainTown",
        "entitan": "en_titan"
      }
    };
    this._filenamePrefix = {
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
        "flowConv": "RainTown",
        "entitan": "entitan"
      }
    };
    this._pointTypes = {
      "fire": "林火",
      "waterlogging": "内涝",
      "geology": "滑坡;崩塌;泥石流;地面塌陷",
      "flood": "洪水",
      "airpollution": "废气",
    };
    this._levelRanges = {
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
    this._ranges = {
      rain: [999, 250, 100, 50, 25, 10],
      wind: [999, 40, 30, 20, 14, 8],
      tide: [400, 300, 230, 180, 140, 100, 60, 20],
      geology: [100, 90, 70, 45, 20],
      fire: [100, 90, 72, 50, 25, 0],
      airpollution: [1, 0.00003, 0.00002, 0.00001, 0]
    }
  }
  _regionData
  _urlStore
  _bound
  _modelName
  _filenamePrefix
  _pointTypes
  _levelRanges
  _ranges


  //获取区县信息
  getCounty() {
    const urlStore = this._urlStore;
    const url = `${urlStore.roaUrl}${urlStore.county}${this._regionData.cityId},/JSONP/`;
    return axios({ url, adapter: jsonp });
  }

  //获取城镇信息
  getTowns() {
    const urlStore = this._urlStore;
    const url = `${urlStore.roaUrl}${urlStore.town}${this._regionData.cityId},,/JSONP/`;
    return axios({ url, adapter: jsonp });
  }

  //获取模型灾害隐患点
  getFocusPoint(type) {
    const regionData = this._regionData;
    const urlStore = this._urlStore;
    const pointTypes = this._pointTypes;

    return new Promise((resolve, reject) => {
      let url = `${urlStore.roaUrl}${urlStore.focusPoint}${pointTypes[type]},广东,${regionData.cityName},${regionData.countyName || ''}/JSONP/`;
      axios({ url, adapter: jsonp }).then(response => {
        let data = response.data;
        if (typeof data === 'string' && /DB_ERR/.test(data)) {
          reject();
        } else {
          resolve(data);
        }
      });
    });
  }

  getGeoSites() {
    const regionData = this._regionData;
    const urlStore = this._urlStore;

    let url = `${urlStore.roaUrl}${urlStore.geoSite}${regionData.cityId},${regionData.countyId || ''},,,`
      + `崩塌;滑坡;滑坡&崩塌群;泥石流;地面塌陷;崩塌滑坡;地裂缝;地面沉降/JSONP/`;

    return new Promise((resolve, reject) => {
      axios({ url, adapter: jsonp }).then(response => {
        let data = response.data;
        if (typeof data === 'string' && /DB_ERR/.test(data)) {
          // resolve(null);
          resolve();
        } else {
          resolve(data);
        }
      })
    });
  }

  getDisasterSites(disaType) {
    const regionData = this._regionData;
    const urlStore = this._urlStore;

    const typeCode = {
      'geology': 's10',
      'fire': 's11',
      'waterlogging': 's12',
      'tide': 's13',
      'torrent': 's14'
    };

    const url = `${urlStore.roaUrl}${urlStore.disasterSite}${typeCode[disaType]}/${regionData.cityId},${regionData.countyId || ''},,`
      + `${disaType === 'geology' ? ',崩塌;滑坡;滑坡&崩塌群;泥石流;地面塌陷;崩塌滑坡;地裂缝;地面沉降' : ''}/JSONP/`;

    return new Promise((resolve, reject) => {
      axios({ url, adapter: jsonp }).then(response => {
        let data = response.data;
        if (typeof data === 'string' && /DB_ERR/.test(data)) {
          reject();
        } else {
          resolve(data);
        }
      }).catch(err => {
        reject();
      })
    });
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

  //获取最新nc的时间
  async getLatestNcFile(ncType) {
    try {
      const url = `${this._urlStore.baseUrl_9020}${this._urlStore.latestNc}?modelName=${ncType}`;
      let data = (await axios({ url, adapter: jsonp })).data;
      if(data && data.status && data.time) {
        return data.time;
      } else {
        return '';
      }
    }
    catch(err) {
      throw 'failed to get latest nc file';
    }
  }

  //获取模型NC
  getNcInfo(modelName, fileName) {
    const urlStore = this._urlStore;

    let url = urlStore.baseUrl + urlStore.ncInfoUrl;
    let params = this._areaComp({ modelName, fileName });

    return new Promise((resolve, reject) => {
      axios({ url, adapter: jsonp, params }).then(response => {
        let ncInfo = response.data;
        if (!ncInfo || ncInfo == 'null') {
          reject();
        } else {
          resolve(ncInfo);
        }
      })
      .catch(e => {
        reject()
      })
    });
  }

  //获取模型JSON评估结果
  getPointJson(modelName, fileName) {
    const urlStore = this._urlStore;

    return new Promise((resolve, reject) => {
      let url = urlStore.baseUrl + urlStore.jsonUrl;

      axios({ url, adapter: jsonp, params: this._areaComp({ modelName, fileName }) })
        .then(response => {
          let data = response.data;
          if (!data) {
            reject();
          } else {
            resolve(data);
          }
        })
        .catch(err => {
          reject();
        });
    });
  }

  //获取面格点值
  getAreaValues(ncInfo, options) {
    const urlStore = this._urlStore;

    return new Promise((resolve, reject) => {
      let ncInfoArea = this._areaComp(options || {
        seledVar: Array.isArray(ncInfo.vars) ? ncInfo.vars[0].name : '',
        seledTime: Array.isArray(ncInfo.times) ? ncInfo.times[0] : null,
        seledLevel: Array.isArray(ncInfo.levels) ? ncInfo.levels[0] : null,
      });
      const params = this._urlTraner(Object.assign(ncInfoArea, {
        modelName: ncInfo.modelName,
        filepath: ncInfo.filepath,
        filename: ncInfo.filename
      }));
      let url = `${urlStore.baseUrl}${urlStore.areaDataUrl}?${params}`;

      axios({ url, adapter: jsonp }).then(response => {
        let data = response.data;
        if (data instanceof Array === false || !data.length) {
          reject();
        } else {
          resolve(data);
        }
      });
    });
  }

  //获取模型格点场极值
  getModelExtreme(ncInfo, options) {
    if(!ncInfo) {
      console.info('failed to get model extreme, ncInfo is null');
      return;
    }
    let ncInfoArea = Object.assign({
      seledVar: ncInfo.vars[0].name,
      seledTime: ncInfo.times[0],
      seledLevel: ncInfo.levels[0],
      modelName: ncInfo.modelName,
      filepath: ncInfo.filepath,
      filename: ncInfo.filename
    }, options);
    ncInfoArea = this._areaComp(ncInfoArea);
    const url = this._urlStore.baseUrl + this._urlStore.modelExtreme;
    return axios({ url, adapter: jsonp, params: ncInfoArea })
  }

  //获取台风文件名
  getTyphoonNc(modelName = 'tideinfo', fileName = 'info') {
    const urlStore = this._urlStore;

    return new Promise((resolve, reject) => {
      let url = urlStore.baseUrl + urlStore.typhoonNcUrl;
      const params = this._areaComp({ modelName, fileName });

      axios({ url, adapter: jsonp, params }).then(response => {
        let data = response.data;
        if (!data || data == '') {
          reject();
        } else {
          resolve(data);
        }
      });
    });
  }

  //获取随机火险点Nc
  async getFireSmlFile(params) {
    return new Promise((resolve, reject) => {
      axios({ url: this._urlStore.fireSimulate, adapter: jsonp, params })
        .then(response => {
          let data = response.data;
          if (!data || data === 'null') {
            reject();
          } else {
            resolve(data.replace(/"/g, ''));
          }
        })
        .catch(err => {
          reject();
        });
    });
  }

  //获取随机爆炸污染点Nc
  async getPollutionSmlFile(params) {
    return new Promise((resolve, reject) => {
      axios({ url: this._urlStore.pollutionSimulate, adapter: jsonp, params })
        .then(response => {
          let data = response.data;
          if (!data || data === 'null') {
            reject();
          } else {
            resolve(data.replace(/"/g, ''));
          }
        })
        .catch(err => {
          reject();
        });
    });
  }

  //根据区间范围获取模型评估影响的城镇
  getEvalTowns(ranges, ncInfo, options) {
    const urlStore = this._urlStore;

    return new Promise((resolve, reject) => {
      let ncInfoArea = Object.assign(options || {
            seledVar: ncInfo.vars[0].name,
            seledTime: ncInfo.times[0],
            seledLevel: ncInfo.levels[0]
          }, ncInfo);
      let params = this._areaComp({ ncInfoArea });

      let rankComped = this._rangeComp(ranges);
      params = Object.assign(rankComped, params);

      axios({ url: `${urlStore.baseUrl}${urlStore.townUrl}?${this._urlTraner(params)}`, adapter: jsonp })
        .then(response => {
          let data = response.data;
          if (data instanceof Array === false || !data.length) {
            resolve([]);
          } else {
            resolve(data);
          }
        })
        .catch(err => {
          resolve([]);
        });
    });
  }

  //获取所有区间的影响区域
  async getTownsByRanges(ranges, ncInfo, options) {
    let promiseArray: any[] = [];
    for (let i = 1; i < ranges.length; i++) {
      promiseArray.push(this.getEvalTowns([ranges[i - 1], ranges[i]], ncInfo, options));
    }
    try {
      let data = await Promise.all(promiseArray);
      return data;
    }
    catch (err) {
      throw 'getting effected towns data failed!';
    }
  }

  async getEffectedTownsByRanges(rangeArray, ncInfo, options={}) {
    let ranges: any[] = [];
    for(let i = 1; i < rangeArray.length; i++) {
      ranges.push({
        min: rangeArray[i],
        max: rangeArray[i - 1]
      });
    }
    let ncInfoArea: any = Object.assign({
      seledVar: ncInfo.vars[0].name,
      seledTime: ncInfo.times[0],
      seledLevel: ncInfo.levels[0],
      modelName: ncInfo.modelName,
      filepath: ncInfo.filepath,
      filename: ncInfo.filename
    }, options);
    let baseUrl;
    if(ncInfo.modelName === 'geology_nc') {
      ncInfoArea.ranges = ranges;
      baseUrl = this._urlStore.baseUrl_9020;
    } else {
      ncInfoArea = { ncInfoArea: Object.assign({}, ncInfoArea), ranges };
      baseUrl = this._urlStore.baseUrl;
    }
    let params = this._areaComp(ncInfoArea);
    try {
      let res = await axios({ url: `${baseUrl}${this._urlStore.townUrl}?${this._urlTraner(params)}`, adapter: jsonp })
      return res.data;
    }
    catch(e) {
      throw 'getting effected towns data failed!';
    }
  }

  // 获取火险poi图片
  async getSimulateImg(type, params, ncInfo) {
    const urlStore = this._urlStore;
    let rect: any = {},
        seledVar = type === 'fire' ? 'fire' : 'con';

    if (!ncInfo) {
      let ncFileUrl = '',
          ncName = '';
      switch (type) {
        case 'fire':
          ncFileUrl = urlStore.fireSimulate;
          ncName = this._modelName.poi.fire;
          break;
        case 'pollution':
          ncFileUrl = urlStore.pollutionSimulate;
          ncName = this._modelName.poi.airpollution;
          break
        default:
          return false
      }

      let fileUrl= await axios({ url: ncFileUrl, adapter: jsonp, params })
      ncInfo = await this.getNcInfo(ncName, fileUrl.data.replace(/"/g, ''));
    }

    const _params = this._urlTraner(ncInfo, 'ncInfoArea.'),
          width = 2000,
          height = 2000,
          top = ncInfo.topLat,
          left = ncInfo.leftLon,
          bottom = ncInfo.topLat - ncInfo.latGap * ncInfo.latDim,
          right = ncInfo.leftLon + ncInfo.lonGap * ncInfo.lonDim;

    rect.top = top;
    rect.left = left;
    rect.right = right;
    rect.bottom = bottom;

    let contourUrl = `${urlStore.baseUrl}${urlStore.imgUrl}?ncInfoArea.seledVar=${seledVar}&ncInfoArea.seledTime=0&ncInfoArea.seledLevel=${ncInfo.levels}&${_params}&shaderOn=true&contourOn=false&contourLabelOn=false&bounds.width=${width}&bounds.height=${height}&bounds.top=${top}&bounds.bottom=${bottom}&bounds.left=${left}&bounds.right=${right}&projName=equ&cityId=${this._regionData.cityId}`
    let imgUrlStr = await axios({ url: contourUrl, adapter: jsonp })
    if(!imgUrlStr.data || imgUrlStr.data === 'null')
      return;

    let imgUrl = `${urlStore.baseUrl}${imgUrlStr.data.replace(/"/g, '')}`;
    return { imgUrl, rect, ncInfo };
  }

  //获取任意经纬度模型评估值
  getPointValue(ncInfo, lng, lat) {
    let options = this._areaComp({
      seledLon: lng,
      seledLat: lat,
      seledLevel: ncInfo.levels[0],
      seledVar: ncInfo.vars[0].name
    });
    const urlStore = this._urlStore;
    const url = `${urlStore.baseUrl}${urlStore.pointDataUrl}?${this._urlTraner(Object.assign(options, ncInfo))}`;

    return axios({ url, adapter: jsonp });
  }

  //获取多点模型评估值, pointArr格式:[{x: 112.23, y: 23.22},...]
  getMultiPointValue(ncInfo, pointArr, seledVar = false, seledTime = -1) {
    if(!ncInfo || !Array.isArray(pointArr) || !pointArr.length) {
      console.error('Failed to get points array values');
      return;
    }
    let options = this._areaComp({
      seledLevel: ncInfo.levels[0],
      seledVar: seledVar ? seledVar : ncInfo.vars[0].name,
      seledTime,
      points: pointArr,
      modelName: ncInfo.modelName,
      filepath: ncInfo.filepath,
      filename: ncInfo.filename
    });

    const urlStore = this._urlStore;
    const url = `http://10.148.83.228:9020/${urlStore.pointMulti}?${this._urlTraner(options)}`;

    return axios({ url, adapter: jsonp });
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
  getModelImage(ncInfo, options: any = {}) {
    const bounds = options.bounds || this._bound;
    let ncInfoArea = Object.assign({
      modelName: ncInfo.modelName,
      filepath: ncInfo.filepath,
      filename: ncInfo.filename
    }, options.area || {
      seledVar: options.seledVar || ncInfo.vars[0].name,
      seledTime: options.seledTime || ncInfo.times[0],
      seledLevel: options.seledLevel || ncInfo.levels[0],
    });
    let params = this._areaComp({
      ncInfoArea,
      bounds,
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

    return new Promise((resolve, reject) => {
      axios({ url, adapter: jsonp }).then(response => {
        let imgUrl = response.data;
        if (typeof imgUrl !== 'string') {
          reject();
        } else {
          let imgSrc = `${urlStore.baseUrl}${imgUrl.replace(/\"/g, '')}`;
          let img = new Image();
          img.onload = () => {
            resolve(Object.assign({ imgSrc }, bounds));
          };
          img.onerror = () => {
            reject();
          }
          img.src = imgSrc;
        }
      });
    });
  }

  //通过shape填色, prefix: torrent20170320190000, bounds: { width, height, left, right, top, bottom }
  getShapeImage(modelName, prefix, bounds, seledTime = 0) {
    const urlStore = this._urlStore;
    const fileName = `${prefix}.shp`;
    const params = Object.assign(this._areaComp({ modelName, fileName, seledTime }), bounds);
    const url = `${urlStore.baseUrl}${urlStore.shapeImg}?${this._urlTraner(params)}`;

    return new Promise((resolve, reject) => {
      axios({ url, adapter: jsonp }).then(response => {
        let data = response.data;
        if (typeof data !== 'string') {
          reject();
        } else {
          let imgSrc = `${urlStore.baseUrl}${data.replace(/\"/g, '')}`;
          let img = new Image();
          img.onload = () => {
            resolve(imgSrc);
          };
          img.onerror = () => {
            reject();
          }
          img.src = imgSrc;
        }
      });
    });
  }

  //获取雷电跟踪图片
  async getEnTitanImage(datetime) {
    try {
      const url = `${this._urlStore.enTitanImg}?${this._urlTraner(Object.assign({date: datetime}, this._bound, {width: 4000, height: 4000}))}`;
      let res = await axios({ url, adapter: jsonp });
      if (!res.data || res.data === 'null')
        return false;
      return {
        imgSrc: res.data.replace(/"/g, ''),
        ...this._bound
      }
    }
    catch {
      console.error('failed to get entitan image');
      return false;
    }
  }

  //获取流域或道路单点值
  getRiverOrRoadPoint(lon, lat, fileName, beforeCallback) {
    let urlStore = this._urlStore;
    const url = `${urlStore.riverOrRoadPoint}?lon=${lon}&lat=${lat}&fileName=${fileName}&cityId=${this._regionData.cityId}`;

    // return this._$http.jsonp(url, { before(request) { beforeCallback && beforeCallback(request) } });
  }

  //获取河流路径点
  getRiverPolyline() {
    let urlStore = this._urlStore;
    const url = `${urlStore.baseUrl}${urlStore.jsonUrl}?fileName=torrent.json&modelName=torrent_json&cityId=${this._regionData.cityId}`;

    return axios({ url, adapter: jsonp });
  }

  //根据镇id数组匹配镇名
  matchTownsName(townData, countyData, townsIdArray) {
    let allLevelList: any[] = [];
    for (let idArr of townsIdArray) {
      let townsNameData = {};
      for (let id of idArr) {
        const tw = townData[id];
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
        area = { cityId: regionData.cityId, countyId: regionData.countyId };
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
    let params = this._urlTraner({
      tsid,
      bounds: this._bound,
      fun,
      fieldName,
      colorTable: fieldName.match('wind') ? 'wind' : 'rain',
      shaderOn: true,
      contourOn: false,
      projName: 'equ',
      contourLabelOn: false,
      cityId: this._regionData.cityId
    })

    let rect = {
      top: this._bound.top,
      bottom: this._bound.bottom,
      left: this._bound.left,
      right: this._bound.right
    }

    let res = await axios({ url: this._urlStore.baseUrl + this._urlStore.historyTyphEffectUrl + '?' + params, adapter: jsonp })
    return {
      rect,
      imgUrl: `http://10.148.83.228:9002/${res.data.replace(/"/g, '')}`
    }
  }
}
