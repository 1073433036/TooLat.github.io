export class MeteoMonitor {
    constructor($http) {
        this._$http = $http;
        this._baseUrl = 'http://10.148.10.80:8111/';
        this._cloudUrl = 'http://10.148.10.211:8111/';
        this._ncUrl = 'http://10.148.83.228:9002/';
        this._jmUrl = 'http://10.148.83.228:9020/';
        this._dataUnitUrl = 'http://10.148.83.228:8921/';
        this._urlStore = {
            'station': 'discrete/stationreal/s2/',
            'stationreal': 'discrete/stationreal/d6/',           //站点实况数据
            'stationrealSingleTs': 'discrete/stationreal/d2/',   //单站点实况时间序列
            'stationrealMultiTs': 'discrete/stationreal/d72/',   //多站点实况时间序列
            'cloudfile': 'busi/satellite/file/',                 //卫星云图文件
            'cloudImg': 'busi/satellite/data/',                  //卫星云图图片
            'swan': 'grid/swan/',                                //雷达产品
            'lightning': 'discrete/lightning/',                  //闪电产品
            'pmStations': 'discrete/pmdata1/s2/',                //空气质量监测点
            'pmdata': 'discrete/pmdata1/d6/',                    //空气质量数据
            'ship': 'bus/jsonp/ship/img/info',                   //船舶图片
            'airport': 'bus/jsonp/airplane/airports',            //机场列表
            'airplane': 'bus/jsonp/airplane/img/info',           //飞机航线
            'serialMultiPos': 'grid/modeldata/SerialMultiPos/',  //单模式多要素、多点、时间序列
            'serialPos': 'grid/modeldata/SerialPos/',            //模式单点雨量时间序列
            'waterStaByTm': 'JmDcs/water/selectByTm',                 //根据时间查询
            'shipInfo': 'http://10.148.83.228:2008/projshare/ais/get/ship/current', //船舶信息
        };
        this._imgBound = {
            width: 2000,
            height: 1000,
            swan: {
                left: 108.5,
                right: 118.99,
                top: 27,
                bottom: 18.2
            },
            cloud: {
                left: 108.5,
                right: 118.99,
                top: 27,
                bottom: 18.2
            },
        };
        this._params = {
            aqi: {
                poll: '首要污染物',
                AQI: '空气质量指数',
                QUALITY: '指数类别',
                '一氧化碳': {
                    CO: '一小时平均',
                    CO_24H: '24小时滑动平均'
                },
                '二氧化硫': {
                    SO2: '一小时平均',
                    SO2_24H: '24小时滑动平均'
                },
                '臭氧': {
                  O3: '一小时平均',
                  O3_8H: '8小时滑动平均',
                  O3_24H: '24小时滑动平均'
                },
                '二氧化氮': {
                    NO2: '一小时平均',
                    NO2_24H: '24小时滑动平均'
                },
                '颗粒物': {
                    PM25: '(粒径≤2.5μm)1小时平均',
                    PM25_24H: '(粒径≤2.5μm)24小时滑动平均',
                    PM10: '(粒径≤10μm)1小时平均',
                    PM10_24H: '(粒径≤10μm)24小时滑动平均'
                }
            }
        }
    }

    getStations(city, county) {
        let $http = this._$http,
            urlStore = this._urlStore;
        let url = this._baseUrl + urlStore.station + `1;2,广东,${city || ''},${county || ''}/JSONP/`;

        return new Promise((resolve, reject) => {
            $http.jsonp(url).then(response => {
                let data = response.data;
                if(typeof data === 'string' && /DB_ERROR/.test(data)){
                    reject({});
                } else {
                    resolve(data);
                }
            });
        });
    }

    //获取站点要素实况数据
    getStationReal(datetime, city, elements=['wind','rain','temp','ps'], county) {
        const $http = this._$http;
        let url = this._baseUrl + this._urlStore.stationreal
          + `1;2,${elements.join(';')},${datetime},广东,${city || ''},${county || ''}/JSONP/`;

        return new Promise((resolve, reject) => {
            $http.jsonp(url).then((response) => {
                let data = response.data;
                if(typeof data === 'string' && /DB_ERROR/.test(data)){
                    reject();
                } else {
                    let realData = {};
                    data.forEach((item) => {
                      realData[item.stationid] = item;
                    });
                    resolve(realData);
                }
            });
        });
    }

    getStationsByDataunit(city, county) {
        let url = this._dataUnitUrl + 'station/info/find?types=A&types=B&province=广东'
            + (city ? `&city=${city}` : '') + (county ? `&county=${county}` : '');
        return new Promise((resolve, reject) => {
            this._$http.get(url).then(response => {
                let data = response.data;
                if(Array.isArray(data) === false || !data.length)
                    reject({});
                else
                    resolve(data);
            });
        });
    }

    getStationRealByDataunit(datetime, city, elements=['wd2df','wd2dd','rfhour','temp','ps'], county) {
      let url = this._dataUnitUrl + `station/real/find?datetime=${datetime}&province=广东`
        + (city ? `&city=${city}` : '') + (county ? `&$county=${county}` : '');
      let eles = elements.map(el => `&element=${el}`);
      url += eles.join('');
      return new Promise((resolve, reject) => {
          this._$http.get(url).then(response => {
            let data = response.data;
            if(Array.isArray(data) === false || !data.length)
              reject();
            else {
              let realData = {};
              for(let item of data) {
                realData[item.station_id] = item;
              }
              resolve(realData);
            }
          });
      });
    }

    getSwanProduct(name, datetime) {
        const imgBound = this._imgBound.swan;
        return new Promise((resolve, reject) => {
            const getImage = (t) => {
                if(t >= 4)
                    return;
                let imgUrl = name.includes('pd1') || name.includes('pe1') ? this._getLightningUrl(name, datetime)
                  : this._getSwanUrl(name, datetime);

                let img = new Image();

                img.onload = function() {
                    console.log('ss');
                    resolve(Object.assign({imgUrl}, imgBound));
                }

                img.onerror = function() {
                    let ms = new Date(datetime.replace(/-/g, '/')).getTime();
                    datetime = new Date(ms - 360000).Format('yyyy-MM-dd HH:mm:00');
                    if(t === 3){
                        reject('failed to get image');
                        return;
                    }
                    t++;
                    getImage(t);
                }
                img.src = imgUrl;
            }
            getImage(0);
        });
    }

    async getNewSwanProduct(element, datatime, level = 3, time = 0) {
        let baseUrl = 'http://10.148.83.228:8922';
        try {
            let endtime = new Date(datatime).getTime();
            let starttime = new Date(endtime - 3600000).Format('yyyy-MM-dd HH:mm:00');
            const url = `${baseUrl}/dataunit/temporary/findTemporaryDataHeader_TimeRange?starttime=${starttime}&endtime=${new Date(endtime).Format('yyyy-MM-dd HH:mm:00')}&type=swan&element=${element}&level=${level}&time=${time}`;
            let radarRes = await this._$http.get(url);
            if(!Array.isArray(radarRes.data))
                return Promise.reject();

            radarRes.data.sort((a, b) => b.datetime - a.datetime);
            let datetime = new Date(radarRes.data[0].datetime).Format('yyyy-MM-dd HH:mm');
            const bounds = {
                top: 27,
                bottom: 19.2,
                left: 108.5,
                right: 117
            };
            return {
                imgUrl: `${baseUrl}/dataunit/temporary/renderTemporaryData?datetime=${datetime}:00&type=swan&element=${element}&time=${time}&level=${level}&top=${bounds.top}&bottom=${bounds.bottom}&left=${bounds.left}&right=${bounds.right}&width=1000&height=1000`,
                datetime,
                ...bounds
            };
        }
        catch(e) {
            throw 'failed to get new swan product';
        }
    }

    getCloudImage(datetime) {
        const $http = this._$http;
        const imgBound = this._imgBound.cloud;
        let url = this._baseUrl + this._urlStore.cloudfile + `cloud,static,FY2F,IR1,${datetime},${datetime}/JSONP/`;
        return new Promise((resolve, reject) => {
            $http.jsonp(url).then((response) => {
                let data = response.data;
                if(typeof data === 'string' && /DB_ERROR/.test(data)){
                    reject('failed to get cloud filename');
                } else {
                    let imgUrl = this._getCloudUrl(data[0].filename);
                    let img = new Image();
                    img.onload = () => {
                        resolve(Object.assign({imgUrl}, imgBound));
                    }
                    img.orerror = () => {
                        reject('failed to get cloud filename');
                    }
                    img.src = imgUrl;
                }
            });
        });
    }

    //获取单模式多要素、多点、时间序列预报数据
    getModelFst(lonArr, latArr, starttime, endtime, model = 'giftzd', element = 'rain', level = '1000') {
        const $http = this._$http;
        const urlStore = this._urlStore;
        const url = `${this._baseUrl}${urlStore.serialMultiPos}${model},`
          + `${element},${level},${lonArr.join(';')}${latArr.join(';')},${starttime},${endtime}/JSONP/`;

        return new Promise((resolve, reject) => {
            $http.jsonp(url).then(response => {
                let data = response.data;
                if(typeof data === 'string' && /DB_ERR/.test(data)) {
                    reject();
                } else {
                    resolve(data[0]);
                }
            });
        });
    }

    //获取单点单要素模式预报
    getModelSingleFst(lng, lat, starttime, endtime, model='giftzd', element='rain', height='1000') {
        const url = `${this._baseUrl}${this._urlStore.serialPos}${model},${element},${height},${lng},${lat},${starttime},${endtime}/JSONP/`;
        return this._$http.jsonp(url);
    }

    getAQIStation(city, county) {
        const $http = this._$http;
        let url = this._baseUrl + this._urlStore.pmStations + `广东,${city || ''},${county || ''}/JSONP/`;
        return new Promise((resolve, reject) => {
            $http.jsonp(url).then((response) => {
                let data = response.data;
                if(typeof data === 'string' && /DB_ERROR/.test(data)){
                    reject();
                    return;
                }
                resolve(data);
            });
        });
    }

    getAQIData(datetime, city, county) {
        const $http = this._$http;
        const aqiParams = this._params.aqi;
        let elements = [];
        for(let i in aqiParams){
            if(typeof aqiParams[i] !== 'object'){
                elements.push(i);
                continue;
            }
            elements = elements.concat(Object.keys(aqiParams[i]));
        }
        let dt = new Date(datetime).getTime() - 60*60*1000;
        dt = new Date(dt).Format('yyyy-MM-dd HH:00:00');
        let url = this._baseUrl + this._urlStore.pmdata + `${elements.join(';')},${dt},广东,${city || ''},${county || ''}/JSONP/`;
        return new Promise((resolve, reject) => {
            $http.jsonp(url).then(response => {
                let data = response.data;
                if(typeof data === 'string' && /DB_ERROR/.test(data)){
                    reject();
                    return;
                }
                let aqiData = {};
                data.forEach((item) => {
                    let params = aqiData[item.stationid] = {};
                    for(let i in aqiParams) {
                        if(typeof aqiParams[i] === 'object') {
                            params[i] = {};
                            for(let j in aqiParams[i]) {
                                let key = aqiParams[i][j];
                                params[i][key] = item[j];
                            }
                        } else {
                            params[aqiParams[i]] = item[i];
                        }
                    }
                });
                resolve(aqiData);
            })
        });
    }

    getAirPorts() {
        return new Promise((resolve, reject) => {
            let url = this._ncUrl + this._urlStore.airport
            this._$http.jsonp(url).then(response => {
                if(typeof data !== 'object' || Object.keys(data).length === 0){
                    reject();
                    return;
                }
                resolve(data);
            });
        });
    }

    getAirplaneImage() {

    }

    getShipInfo(bounds) {
        return new Promise((resolve, reject) => {
            this._$http.get(`${this._urlStore.shipInfo}?latStart=${bounds.bottom}&latEnd=${bounds.top}&lonStart=${bounds.left}&lonEnd=${bounds.right}`)
              .then(response => {
                  resolve(response.data);
              })
              .catch(err => {
                  reject();
              });
        });
    }

    getWaterStationReal(datetime, cityId, countyId = undefined) {
        const url = `${this._jmUrl}${this._urlStore.waterStaByTm}?datetime=${datetime}&cityId=${cityId}${countyId ? ('&countyId=' + countyId) : ''}`;
        return this._$http.jsonp(url);
    }

    _getSwanUrl(type, datetime) {
        const imgBound = this._imgBound;
        const swan = imgBound.swan;
        let strArr = type.split('_');
        let url = this._baseUrl + this._urlStore.swan
          + `${strArr[0]}/${datetime}${strArr.length>1 ? (',' + strArr[1]) : ''}/HTML/png/${swan.left},${swan.right},${swan.top},${swan.bottom},${imgBound.width},${imgBound.height}/color/cache`;

        return url;
    }

    _getLightningUrl(type, datetime) {
        const imgBound = this._imgBound;
        const bound = imgBound.swan;

        let ms = new Date(datetime).getTime() -360000;
        let st = new Date(ms).Format('yyyy-MM-dd HH:mm:00');

        let url = this._baseUrl + this._urlStore.lightning
          + `${type.replace('_', '/')},${st},${datetime},${bound.left},${bound.right},${bound.top},${bound.bottom},${4000},${2000}/HTML/image/cache`;

        return url;
    }

    _getCloudUrl(filename) {
        const imgBound = this._imgBound;
        const bound = imgBound.cloud;
        let url = this._baseUrl + this._urlStore.cloudImg
          + `${filename},cloud,static,FY2F,IR1/HTML/png/${bound.left},${bound.right},${bound.top},${bound.bottom},${imgBound.width},${imgBound.height}/color/cache`;

        return url;
    }
}
