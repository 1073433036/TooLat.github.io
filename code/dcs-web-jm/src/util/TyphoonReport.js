import { ModelAssess } from './modelAssess'

export default class TyphoonReport extends ModelAssess {
    constructor($http, regionData) {
        super($http, regionData);
        this._baseUrl = 'http://10.148.83.228:9002/';
        this._eleConfig = {
            fieldNames: ['rain08_08', 'rain20_20', 'rain20_08', 'rain08_20', 'windmax_vel', 'windextrm_vel'],
            fun: ['min', 'max', 'avg', 'sum']
        };
        this._tpStarttime = '';
        this._tpEndtime = '';
    }

    //tsId: 台风id; isBefore03: 是否2003年前的台风
    async typhoonPathAnalysis(tsId, isBefore03) {
        let typhoonRes = isBefore03 ? this._$http.jsonp(`http://10.148.83.228:9020/JmDcs/discrete/typhoon228/d1?tsid=${tsId}`)
            : this._$http.get(`http://10.148.83.228:8921/typhoon/findForecastReal?tsid=${tsId}&fcid=BCGZ`);
        let data = (await typhoonRes).data;
        if(!data)
            return;
        let realData;
        if(isBefore03) {
            let transData = {
                tsid: data[0].tsid,
                intlid: data[0].tsid,
                tscname: data[0].tscname || data[0].tsename,
                tsename: data[0].tsename,
                real: [],
                fst: [],
                tan: []
            };

            for(let el of data) {
                el.time = `${el.time.substring(0, 4)}-${el.time.substring(4, 6)}-${el.time.substring(6, 8)}`
                    + ` ${el.time.substring(8, 10)}:00:00`;
                el.level = this._getLevelByName(el.level);
                transData.real.push(el);
            }
            data = transData;
            realData = transData.real;
        } else {
            //data = data[0];
            realData = data.real;
            data = {
              tsid: data.info[0].tsid,
              intlid: data.info[0].tsid,
              tscname: data.info[0].info.cname || data.info[0].info.ename,
              tsename: data.info[0].info.ename,
              ...data
            }
        }
        data.real.sort((a, b) => {
          return a.time ? (new Date(a.time).getTime() - new Date(b.time).getTime()) : (a.datetime - b.datetime);
        })
        this._tpStarttime = data.real[0].time || new Date(data.real[0].datetime).Format('yyyy-MM-dd HH:00:00');
        this._tpEndtime = data.real[data.real.length - 1].time || new Date(data.real[data.real.length - 1].datetime).Format('yyyy-MM-dd HH:00:00');
        console.log(data.real);
        const tyLevels = ['LOW', 'TD', 'TS', 'STS', 'TY', 'STY', 'SUPER', 'SUPER TY'];
        let pathDescs = [];
        let preLevel, maxLevelIndex, tyTitle;
        realData.forEach((el, index, arr) => {
            let elements = el.elements;
            let time = new Date(el.datetime || el.time);
            time.setHours(time.getHours() + 8);  //台风时间为世界时，转为北京时
            let tyLevel = elements.tcrank.trim(),
                timeText = time.Format('MM月dd日HH时'),
                preIndex = tyLevels.indexOf(preLevel || 'LOW'),
                curIndex = tyLevels.indexOf(tyLevel);
            const ps = elements.pressure ? parseInt(elements.pressure) : '--',
                  ws = elements.windspeed ? parseInt(elements.windspeed) : '--';
            //第一个点代表台风生成
            if(!index) {
                maxLevelIndex = curIndex;
                preLevel = tyLevel;
                const year = time.getFullYear(),
                      code = el.intlid.substring(2);
                pathDescs.push({
                    date: timeText,
                    msg: `${year}年${code === '**' ? '' : ('第' + code + '号')}tyLevel生成，气压${ps}百帕，近中心最大风力${this._getWindLevel(ws)}级`
                });
                tyTitle = `${year}年${code === '**' ? '' : ('第' + code + '号')}tyLevel${data.tsename ? ('“' + data.tscname + '(' + data.tsename + ')”') : ''}`;
                return true;
            }
            //最后一个点代表台风消亡
            if(index === (arr.length - 1)) {
                pathDescs.push({
                    date: timeText,
                    msg: `台风于东经${el.location.lon}°，北纬${el.location.lat}°位置消亡。`
                });
                return;
            }
            if(preIndex === curIndex)
                return true;
            preLevel = tyLevel;
            const isStrengthen = preIndex < curIndex;
            if(isStrengthen)
                maxLevelIndex = curIndex;
            pathDescs.push({
                date: timeText,
                msg: `${isStrengthen ? '加强' : '减弱'}为${this._getNameByLevel(tyLevel)}， 风速${ws || '--'}米/秒，`
                    + `气压${ps}百帕，近中心最大风力${this._getWindLevel(ws)}级`
            });
        });

        if(pathDescs.length) {
            const maxLevel = this._getNameByLevel(tyLevels[maxLevelIndex]);
            pathDescs[0].msg = pathDescs[0].msg.replace('tyLevel', maxLevel);
            tyTitle = tyTitle.replace('tyLevel', maxLevel);
        }

        return { tyTitle, pathDescs };
    }

    //历史台风过程站点风雨统计
    async typhoonStationAnalysis(ele, fun, city, county = undefined) {
        //let poiData = (await this._$http.jsonp(`http://10.148.10.80:8111/discrete/stationreal/s2/${county ? '1;2' : '1'},广东,${city},${county || ''}/JSONP/`)).data;
        let poiData = (await this._$http.get(`http://10.148.83.228:8922/dataunit/station/findStationInfo?types[]=A${county ? ('&types[]=B') : ''}&provinces[]=广东&cities[]=${city}${county ? ('&counties[]='+county) : ''}`)).data;
        if(!Array.isArray(poiData)) {
            console.log('failed to get station infomation');
            return;
        }
        let poiArray = poiData.map((el ,index) => {
            return {
                id: index,
                lon: Number(el.loc.lon),
                lat: Number(el.loc.lat)
            }
        });
        const options = {
            starttime: this._tpStarttime,
            endtime: this._tpEndtime,
            fieldName: ele,
            fun,
            pois: poiArray
        };
        const url = `${this._baseUrl}nc/jsonp/hisreal/point?${this._urlTraner(options)}`;
        let tyPointData = (await this._$http.jsonp(url)).data;
        if(!tyPointData || tyPointData === 'null') {
            console.log('failed to get typhoon points values');
            return;
        }

        const isWind = ele.indexOf('wind') >= 0;
        for(let poi of tyPointData) {
            let poiInfo = poiData[poi.id];
            poi.name = poiInfo.info.cname + '(' + poiInfo.id + ')';
            poi.val = poi.val ? Number(poi.val.toFixed(1)) : 0;
            if(isWind)
                poi.level = this._getWindLevel(poi.val) + '级';
        }

        tyPointData.sort((a, b) => { return b.val - a.val;});

        return tyPointData;
    }

    //历史台风过程影响区域分析
    async typhoonAffectedTowns(ele, fun, rangeArray) {
        let ranges = [];
        for(let i = 1; i < rangeArray.length; i++) {
            ranges.push({
                min: rangeArray[i],
                max: rangeArray[i - 1]
            });
        }
        const options = this._areaComp({
            starttime: this._tpStarttime,
            endtime: this._tpEndtime,
            fieldName: ele,
            fun,
            ranges
        });
        const url = `${this._baseUrl}nc/jsonp/hisreal/eval?${this._urlTraner(options)}`;
        let townsIdArray = (await this._$http.jsonp(url)).data;

        let ctData = (await this.getCounty()).data;
        let twData = (await this.getTowns()).data;
        if(ctData.result !== 'S_OK' || twData.result !== 'S_OK') {
            console.log('failed to get county data or town data');
            return;
        }
        let countyData = {};
        for(let ct of ctData.tagObject) {
            countyData[ct.countyId] = ct;
        }

        let townData = {};
        for(let tw of twData.tagObject) {
            townData[tw.townId] = tw;
        }

        let affectedTownsData = this.matchTownsName(townData, countyData, townsIdArray);

        return affectedTownsData;
    }

    _getWindLevel(ws) {
        if(typeof ws !== 'number')
            return '--';
        let windLevels = [0, 0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.6, 37.0, 41.4, 46.1, 50.9, 56.0, 61.2, 999];
        let level;
        windLevels.forEach((val, index) => {
            if(index === (windLevels.length - 1))
                return;
            if(ws >= windLevels[index] && ws < windLevels[index+1])
                level = index;
        });
        return level;
    }

    _getNameByLevel(level) {
        let name;
        switch (level.trim()) {
            case 'TS':
                name = '热带风暴';
                break;
            case 'STS':
                name = '强热带风暴';
                break;
            case 'TY':
                name = '台风';
                break;
            case 'STY':
                name = '强台风';
                break;
            case 'SUPER':
                name = '超强台风';
                break;
            default:
                name = '热带低压';
        }
        return name;
    }

    _getLevelByName(name) {
        let level;
        switch (name) {
            case '热带风暴':
                level = 'TS';
                break;
            case '强热带风暴':
                level = 'STS';
                break;
            case '台风':
                level = 'TY';
                break;
            case '强台风':
                level = 'STY';
                break;
            case '超强台风':
                level = 'SUPER';
                break;
            default:
                level = 'TD';
        }
        return level;
    }
}
