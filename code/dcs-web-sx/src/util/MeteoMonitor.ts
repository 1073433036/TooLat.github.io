import fetchJsonp from 'fetch-jsonp'
import moment from 'moment'

export class MeteoMonitor {
    _baseUrl: string = 'http://10.148.10.80:8111/'
    //_cloudUrl: string = 'http://10.148.10.211:8111/'
    _cloudUrl: string = 'http://119.29.102.103:8111/Satelite/renderCloud'
    _ncUrl: string = 'http://10.148.83.228:9002/'
    _urlStore: any = {
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
    }
    _imgBound: any = {
        width: 2000,
        height: 1000,
        swan: {
            left: 108.5,
            right: 118.99,
            top: 27,
            bottom: 18.2
        },
        // cloud: {
        //     left: -180,
        //     right: 180,
        //     top: 90,
        //     bottom: -90
        // },
        cloud: {
            left: 73.66,
            right: 135.05,
            top: 53.55,
            bottom: 3.86
        },
    }
    _params: any = {
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

    async getStations(city: string, county: string) {
        let url: string = this._baseUrl + this._urlStore.station + `1;2,广东,${city || ''},${county || ''}/JSONP/`;
        let res: any = await fetchJsonp(url);
        let data: any = await res.json();
        if(typeof data === 'string' && /DB_ERROR/.test(data)) return null;
        else return data;
    }

    //获取站点要素实况数据
    async getStationReal(city, county, datetime, elements=['wind','rain','temp','ps']) {
        let url = this._baseUrl + this._urlStore.stationreal
            + `1;2,${elements.join(';')},${datetime},广东,${city || ''},${county || ''}/JSONP/`;
        let res: any = await fetchJsonp(url);
        let data: any = await res.json();
        if(typeof data === 'string' && /DB_ERROR/.test(data)) return null;
        let realData = {};
        data.forEach( item => {
            realData[item.stationid] = item;
        });
        return realData;
    }

    getSwanProduct(name, datetime) {
        const imgBound = this._imgBound.swan;
        return new Promise((resolve, reject) => {
            const getImage = (t) => {
                if(t >= 4)
                    return;
                let imgUrl = name.includes('pd1') || name.includes('pe1') ? this._getLightningUrl(name, datetime)
                    : this._getSwanUrl(name, datetime);
                console.log(imgUrl);

                let img = new Image();

                img.onload = function() {
                    resolve(Object.assign({ imgUrl, datetime }, imgBound));
                }

                img.onerror = function() {
                    let ms = new Date(datetime.replace(/-/g, '/')).getTime();
                    datetime = moment(ms - 360000).format('YYYY-MM-DD HH:mm:00');
                    if(t === 3){
                        reject(datetime)
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

    getCappiProduct(datetime) {
        const imgBound = this._imgBound.swan;
        return new Promise((resolve, reject) => {
            const getImage = (t) => {
                if(t >= 4)
                    return;
                let imgUrl = `http://10.148.83.228:9002/nc/jsonp/bin/contour?binInfoArea.modelName=cappi&binInfoArea.datetime=${datetime}&binInfoArea.varname=cappi&binInfoArea.level=3&bounds.left=${imgBound.left}&bounds.right=${imgBound.right}&bounds.top=${imgBound.top}&bounds.bottom=${imgBound.bottom}&bounds.width=1050&bounds.height=880&shaderOn=true&contourOn=false&contourLabelOn=false&projName=equ&callback=cache`
                console.log(imgUrl);

                let img = new Image();

                img.onload = function() {
                    resolve(Object.assign({ imgUrl, datetime }, imgBound));
                }

                img.onerror = function() {
                    let ms = new Date(datetime.replace(/-/g, '/')).getTime();
                    datetime = moment(ms - 360000).format('YYYY-MM-DD HH:mm:00');
                    if(t === 3){
                        reject(datetime)
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


    getCloudImage(type, datetime) {
        const imgBound = this._imgBound.cloud;
        return new Promise((resolve, reject) => {
            const getImage = (t) => {
                if(t >= 4) return
                let imgUrl = this._cloudUrl + `?datetime=${datetime}&dataType=${type}&top=${imgBound.top}&bottom=${imgBound.bottom}&left=${imgBound.left}&right=${imgBound.right}&width=600&height=600`;
                console.log(imgUrl);

                let img = new Image();

                img.onload = function() {
                    resolve(Object.assign({ imgUrl, datetime }, imgBound));
                }

                img.onerror = function() {
                    let ms = new Date(datetime.replace(/-/g, '/')).getTime();
                    datetime = moment(ms - 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:00');
                    if(t === 3){
                        reject(datetime)
                        return;
                    }
                    t++;
                    getImage(t);
                }
                img.src = imgUrl;
            }
            getImage(1);
        });
    }

    /*
     getCloudImage(datetime) {
        const $http = this._$http;
        const imgBound = this._imgBound.cloud;
        let url = this._cloudUrl + this._urlStore.cloudfile + `cloud,static,FY2F,IR3,${datetime},${datetime}/JSONP/`;
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
    */

    //获取单模式多要素、多点、时间序列预报数据
    getModelFst(lonArr, latArr, starttime, endtime, model = 'giftzd', element = 'rain', level = '1000') {
        const urlStore = this._urlStore;
        const url = `${this._baseUrl}${urlStore.serialMultiPos}${model},`
          + `${element},${level},${lonArr.join(';')}${latArr.join(';')},${starttime},${endtime}/JSONP/`;

        return new Promise((resolve, reject) => {
            fetchJsonp(url).then(response => {
                let data = response.json();
                if(typeof data === 'string' && /DB_ERR/.test(data)) {
                    reject();
                } else {
                    resolve(data[0]);
                }
            });
        });
    }

    getAQIStation(city, county) {
        let url = this._baseUrl + this._urlStore.pmStations + `广东,${city || ''},${county || ''}/JSONP/`;
        return new Promise((resolve, reject) => {
            fetchJsonp(url).then((response) => {
                let data = response.json();
                if(typeof data === 'string' && /DB_ERROR/.test(data)){
                    reject();
                    return;
                }
                resolve(data);
            });
        });
    }

    getAQIData(datetime, city, county) {
        const aqiParams = this._params.aqi;
        let elements = [];
        for(let i in aqiParams){
            if(typeof aqiParams[i] !== 'object'){
                elements.push(i);
                continue;
            }
            elements = elements.concat(Object.keys(aqiParams[i]));
        }
        let dt: any = new Date(datetime).getTime() - 60*60*1000;
        dt = moment(dt).format('YYYY-MM-DD hh:00:00');
        let url = this._baseUrl + this._urlStore.pmdata + `${elements.join(';')},${dt},广东,${city || ''},${county || ''}/JSONP/`;
        return new Promise((resolve, reject) => {
            fetchJsonp(url).then(response => {
                let data: any = response.json();
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
            fetchJsonp(url).then(response => {
                let data = response.json();
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

    getShipImage(datetime) {
        let url = this._ncUrl + this._urlStore.ship;

        return new Promise((resolve, reject) => {
            fetchJsonp(url).then(response => {

            });
        });
    }

    _getSwanUrl(type, datetime) {
        const imgBound = this._imgBound;
        const swan = imgBound.swan;
        let strArr = type.split('_');
        let url = this._baseUrl + this._urlStore.swan
          + `${strArr[0]}/${datetime}${strArr.length>1 ? ',' + strArr[1] : ''}/HTML/png/${swan.left},${swan.right},${swan.top},${swan.bottom},${imgBound.width},${imgBound.height}/color/cache`;

        return url;
    }

    _getLightningUrl(type, datetime) {
        const imgBound = this._imgBound;
        const bound = imgBound.swan;

        let ms = new Date(datetime).getTime() -360000;
        let st = moment(ms).format('YYYY-MM-DD hh:mm:00');

        let url = this._baseUrl + this._urlStore.lightning
          + `${type.replace('_', '/')},${st},${datetime},${bound.left},${bound.right},${bound.top},${bound.bottom},${imgBound.width},${imgBound.height}/HTML/image/cache`;

        return url;
    }

    _getCloudUrl(filename) {
        const imgBound = this._imgBound;
        const bound = imgBound.cloud;
        let url = this._cloudUrl + this._urlStore.cloudImg
          + `${filename},cloud,static,FY2F,IR3/HTML/png/${bound.left},${bound.right},${bound.top},${bound.bottom},${imgBound.width},${imgBound.height}/color/cache`;

        return url;
    }
}
