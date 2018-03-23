import axios from 'axios'
import moment from 'moment'
import { ModelAssess } from './modelAssess'
import TyphoonCordon from './TyphoonCordon'

interface TyphoonWarning {
  title: string,
  msg: string
}

export default class TyphoonMonitor extends ModelAssess {
  constructor() {
    super();
  }

  public async typhoonMonitor(bounds: { left: number, right: number, bottom: number, top: number }): Promise<TyphoonWarning[]> {
    //fcid(发布台): BABJ(北京) | BCGZ(广州) | GZRD(热带所) | PGTW(关岛) | RJTD(日本) | VHHH(香港) | ECMWF(欧洲)
    let data = (await axios.get('http://10.148.83.228:8921/typhoon/info/find_Latest_ByMaxtime?limit=3&fcid=BCGZ')).data;
    if (!Array.isArray(data))
      return [];

    let nowDate = new Date(),
        tpIdStr = 'tsid=117&';
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
    let tyData = (await axios.get(`http://10.148.83.228:8921/typhoon/findForecastReal?${tpIdStr}fcid=BCGZ`)).data;
    if(!tyData || !Object.keys(tyData).length)
      return [];

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

    let msgArray: TyphoonWarning[] = [];
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
      let leftDistance = this.getPointDistance(lat, lon, bounds.bottom, bounds.left),
          rightDistance = this.getPointDistance(lat, lon, bounds.bottom, bounds.right);
      let distance = (Math.min(leftDistance, rightDistance) / 1000).toFixed(1);
      let tscname = info.info && info.info.cname ? info.info.cname : '',
          tsename = info.info && info.info.ename ? info.info.ename.toUpperCase() : '****';

      let warnTitle = `${year}年第${code}号${this._getRankByLevel(level || 'TD')}${tscname}(${tsename})`;
      let warnMsg = `${moment(time).format('MM月DD日HH时')}，风速${ws}m/s，位置(${lon}°/${lat}°)，`
        + `气压${ps}pha，近中心最大风力${this.getWindLevel(ws)}级，距离揭阳市${distance}公里。`;
      msgArray.push({
        title: warnTitle,
        msg: warnMsg
      });
    }

    return msgArray;
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

  //获取台风最高等级, data为台风实况点数据
  private _getTyMaxLevel(data: any): string {
    if(!Array.isArray(data)) {
      console.error('typhoon realdata is not array');
      return;
    }
    const tyLevels: string[] = ['LOW', 'TD', 'TS', 'STS', 'TY', 'STY', 'SUPER', 'SUPER TY'];
    let tyIndex = 0;
    for(let poi of data) {
      let tyLevel = poi.elements.tcrank ? poi.elements.tcrank.trim() : 'TD';
      let index = tyLevels.indexOf(tyLevel);
      if(index > tyIndex)
        tyIndex = index;
    }
    return tyLevels[tyIndex];
  }

  private _getRankByLevel(level): string {
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

  private getPointDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const EARTH_RADIUS = 6378137.0;    //单位M
    const PI = Math.PI;
    
    function getRad(d: number): number {
        return d*PI/180.0;
    }

    let f = getRad((lat1 + lat2)/2);
    let g = getRad((lat1 - lat2)/2);
    let l = getRad((lng1 - lng2)/2);
    
    let sg = Math.sin(g);
    let sl = Math.sin(l);
    let sf = Math.sin(f);
    
    let s, c, w, r, d, h1, h2;
    let a = EARTH_RADIUS;
    let fl = 1/298.257;
    
    sg = sg*sg;
    sl = sl*sl;
    sf = sf*sf;
    
    s = sg*(1-sl) + (1-sf)*sl;
    c = (1-sg)*(1-sl) + sf*sl;
    
    w = Math.atan(Math.sqrt(s/c));
    r = Math.sqrt(s*c)/w;
    d = 2*w*a;
    h1 = (3*r -1)/2/c;
    h2 = (3*r +1)/2/s;
    
    return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
  }
}