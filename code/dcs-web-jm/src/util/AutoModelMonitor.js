import { Helper } from './Helper'
import { ModelAssess } from './modelAssess'
import TyphoonCordon from './TyphoonCordon'

export default class AutoModelMonitor extends ModelAssess {
  constructor($http, regionData) {
    super($http, regionData);
  }

  async typhoonMonitor(bounds) {
    //fcid(发布台): BABJ(北京) | BCGZ(广州) | GZRD(热带所) | PGTW(关岛) | RJTD(日本) | VHHH(香港) | ECMWF(欧洲)
    //let data = (await this._$http.jsonp('http://10.148.83.228:9020/JmDcs/typhoon/getMsgWithLevel?fcid=BCGZ')).data;
    let data = (await this._$http.get('http://10.148.83.228:8921/typhoon/info/find_Latest_ByMaxtime?limit=3&fcid=BCGZ')).data;
    if (!Array.isArray(data))
      return Promise.reject();

    let nowDate = new Date(),
        tpIdStr = '';
    nowDate.setHours(nowDate.getHours() - 12);
    for (let item of data) {
      if (!item.info || !item.info.ename || !item.info.cname || item.intlid === '')
        continue;
      let maxTyphDate = new Date(item.maxtime);
      maxTyphDate.setHours(maxTyphDate.getHours() + 8);
      if (nowDate > maxTyphDate)
        continue;
      tpIdStr += `tsid=${item.tsid}&`;
    }
    if(!tpIdStr.length)
      return [];

    //tyData: {'real': [], 'forecast': [], 'info': []}
    let tyData = (await this._$http.get(`http://10.148.83.228:8921/typhoon/findForecastReal?${tpIdStr}fcid=BCGZ`)).data;
    if(!tyData || !Object.keys(tyData).length)
      return Promise.reject();

    let typhCordon = new TyphoonCordon();
    let cordons = typhCordon.getBounds();
    let redLng = cordons.red.lng, redLat = cordons.red.lat,
        yellowLng = cordons.yellow.lng, yellowLat = cordons.yellow.lat;

    let matchIds = [];
    for(let point of tyData.real) {
      if(matchIds.includes(point.tsid))
        continue;
      let lon = point.location.lon, lat = point.location.lat;
      if((lon <= redLng && lat >= redLat) || (lon <= yellowLng && lat >= yellowLat))
        matchIds.push(point.tsid);
    }

    if(!matchIds.length && tyData.hasOwnProperty('forecast')) {
      for(let point of tyData.forecast) {
        if(matchIds.includes(point.tsid))
          continue;
        let lon = point.location.lon, lat = point.location.lat;
        if((lon <= redLng && lat >= redLat) || (lon <= yellowLng && lat >= yellowLat))
          matchIds.push(point.tsid);
      }
    }

    if(!matchIds.length)
      return [];

    let helper = new Helper(viewer);
    let msgArray = [];
    for(let tsid of matchIds) {
      let info = tyData.info.filter(el => el.tsid === tsid);
      let real = tyData.real.filter(el => el.tsid === tsid);
      real.sort((a, b) => b.datetime - a.datetime); //降序
      info = info[0];
      let lastRealPoint = real[0];
      let elements = lastRealPoint.elements;
      let year = new Date().getFullYear(),
          code = info.intlid.substring(2),
          time = new Date(lastRealPoint.datetime),
          ws = elements.windspeed ? parseInt(elements.windspeed) : '--',
          ps = elements.pressure ? parseInt(elements.pressure) : '--',
          level = info.tcrank || this._getTyMaxLevel(real);
      time.setHours(time.getHours() + 8);

      let lon = lastRealPoint.location.lon, lat = lastRealPoint.location.lat;
      let leftDistance = helper.getDistance([lon, lat], [bounds.left, bounds.bottom]),
          rightDistance = helper.getDistance([lon, lat], [bounds.right, bounds.bottom]);
      let distance = (Math.min(leftDistance, rightDistance) / 1000).toFixed(1);
      let tscname = info.info && info.info.cname ? info.info.cname : '',
          tsename = info.info && info.info.ename ? info.info.ename.toUpperCase() : '****';

      let warnTitle = `${year}年第${code}号${this._getRankByLevel(level || 'TD')}${tscname}(${tsename})`;
      let warnMsg = `${time.Format('MM月dd日HH时')}，风速${ws}米/秒，东经${lon}°，北纬${lat}°，`
        + `气压${ps}百帕，近中心最大风力${this.getWindLevel(ws)}级，距离江门市<a style="color:red;font-weight:bold;">${distance}公里</a>。`;
      msgArray.push({
        title: warnTitle,
        msg: warnMsg
      });
    }
    helper = null;

    return msgArray;
  }

  async forecastMonitor() {
    let windPromise = this.getNcInfo('meteocast_nc', `meteocast${new Date().Format('yyyyMMddHH0000')}.nc`);
    let rainNcInfo = await this.getLatestGridNcInfo().catch(err => { throw 'failed to get rain ncInfo' }),
        windNcInfo = await windPromise.catch(err => { throw 'failed to get wind ncInfo' });

    if(!windNcInfo && !rainNcInfo) {
      return Promise.reject();
    }

    let countyArray = (await this.getCounty()).data;
    let townArray = (await this.getTowns()).data;

    let countyData = {};
    for(let ct of countyArray.tagObject) {
      countyData[ct.countyid] = ct;
    }

    let townData = {};
    for(let tw of townArray.tagObject) {
      townData[tw['townid']] = tw;
    }

    let rainMsg, windMsg;
    if(rainNcInfo !== null) {
      let rain3hData = await this.getEffectedTownsByRanges([999, 250, 100, 50, 10], rainNcInfo, { seledVar: 'data', seledTime: 10 });
      rainMsg = this._getAffectedTownMsg(countyData, townData, rain3hData);
    }
    if(windNcInfo !== null) {
      let wind3hData = await this.getEffectedTownsByRanges([999, 40, 30, 20, 14], windNcInfo, { seledVar: 'maxwind', seledTime: 3 });
      windMsg = this._getAffectedTownMsg(countyData, townData, wind3hData);
    }

    return { rainMsg, windMsg };
  }

  thunderMonitor() {
    return new Promise((resolve, reject) => {
      let datetime = new Date();
      let minute = datetime.getMinutes();
      minute -= minute%6;
      datetime.setMinutes(minute);
      const getThunderJson = (t) => {
        const modelName = this.getModelName('entitan', true),
              fileName = this.getFilename('entitan', new Date(datetime).Format('yyyyMMddHHmm00'), true);
        this.getPointJson(modelName, fileName)
          .then(data => {
            let townsArray = [];
            for(let i in data) {
              townsArray = townsArray.concat(data[i]);
            }
            townsArray = [...new Set(townsArray)];
            if(townsArray.length)
              resolve(townsArray);
            else
              reject();
          })
          .catch(err => {
            if(t === 4) {
              reject();
              return;
            }
            t++;
            datetime = new Date(datetime).getTime() - 360000;
            getThunderJson(t);
          });
      }
      getThunderJson(0);
    });
  }

  async disasterMonitor() {
    try {
      let ncInfo = await this.getLatestGridNcInfo();
      let data = await Promise.all([this.getDisasterSites('waterlogging'), this.getDisasterSites('torrent')]);
      if(!Array.isArray(data[0])) {
        data[0] = [];
      }
      if(!Array.isArray(data[1])) {
        data[1] = [];
      }
      let poiData = data[0].concat(data[1]);
      let poiArray = [];
      for(let poi of poiData) {
        poiArray.push({
          x: Number(poi.lon),
          y: Number(poi.lat)
        });
      }

      let gridData = (await this.getMultiPointValue(ncInfo, poiArray)).data;
      if(!gridData || !gridData.length)
        return;

      let waterlogMsgs = '',
          torrentMsgs = '';
      gridData.forEach((rainArr, index) => {
        const rainSum = rainArr[8] + rainArr[9] + rainArr[10];
        if(rainSum > 16) {
          let poi = poiData[index];
          if(index < data[0].length)
            waterlogMsgs += `${poi.name}未来3小时累计雨量：${rainSum.toFixed(1)}mm</br>`;
          else
            torrentMsgs += `${poi.name}未来3小时累计雨量：${rainSum.toFixed(1)}mm</br>`;
        }
      });
      return { waterlogMsgs, torrentMsgs };
    }
    catch(err) {
      throw 'failed to get disaster poi warning infomation';
    }
  }

  async getLatestGridNcInfo() {
    try {
      let latestGridNcTime = await this.getLatestNcFile('grid_nc');
      if(latestGridNcTime) {
        let dateStr = `${latestGridNcTime.substring(0, 4)}/${latestGridNcTime.substring(4,6)}/${latestGridNcTime.substring(6, 8)} ${latestGridNcTime.substring(8, 10)}:${latestGridNcTime.substring(10, 12)}`;
        const ms = new Date(dateStr).getTime();
        //跟当前时间差是否在半小时以内
        if((ms - new Date().getTime()) <= 1800000) {
          let rainNcInfo = await this.getNcInfo('grid_nc', `grid${latestGridNcTime}.nc`);
          return rainNcInfo;
        }
      } else {
        return Promise.reject();
      }
    }
    catch(err) {
      throw 'failed to get grid_nc time';
    }
  }

  getWindLevel(ws) {
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

  _getAffectedTownMsg(countyData, townData, data) {
    let townIdArray = [];
    for(let idArr of data) {
      townIdArray = townIdArray.concat(idArr);
    }
    if(!townIdArray.length)
      return '';
    townIdArray = Array.from(new Set(townIdArray));

    let affectedData = {};
    for(let id of townIdArray) {
      let tw = townData[id] || '';
      if(!tw || tw.countyId in countyData === false || (!tw.town.includes('镇') && !tw.town.includes('街道')))
        continue;
      let countyName = countyData[tw.countyId].county;
      if(countyName in affectedData === false)
        affectedData[countyName] = [];
      affectedData[countyName].push(tw.town);
    }

    let msg = '';
    for(let i in affectedData) {
      msg += `<b>${i}</b>：${affectedData[i].join('，')}；</br>`;
    }

    return msg;
  }

  //获取台风最高等级, data为台风实况点数据
  _getTyMaxLevel(data) {
    if(!Array.isArray(data)) {
      console.error('typhoon realdata is not array');
      return;
    }
    const tyLevels = ['LOW', 'TD', 'TS', 'STS', 'TY', 'STY', 'SUPER', 'SUPER TY'];
    let tyIndex = 0;
    for(let poi of data) {
      let tyLevel = poi.elements.tcrank ? poi.elements.tcrank.trim() : 'TD';
      let index = tyLevels.indexOf(tyLevel);
      if(index > tyIndex)
        tyIndex = index;
    }
    return tyLevels[tyIndex];
  }

  _getRankByLevel(level) {
      let v = level.trim();
      switch (v) {
        case 'TD':
            return '热带低压';
        case 'TS':
            return '热带风暴';
        case 'STS':
            return '强热带风暴';
        case 'TY':
            return '台风';
        case 'STY':
            return '强台风';
        case 'SUPER':
            return '超强台风';
        default:
            return '热带低压';
      }
  }
}
