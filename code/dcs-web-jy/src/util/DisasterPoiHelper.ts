import axios from 'axios'
import moment from 'moment'
import qs from 'qs'
import {
  WaterloggingPoi,
  WaterloggingState,
  TorrentPoi,
  TorrentWarningState,
  GeolPoi,
  GeolWarningState
} from '../interface/DisasterPoi'
import { ResponseLite } from '../interface/Response'

export default class DisasterPoiHelper {
  constructor() {

  }
  private baseUrl: string = 'http://10.148.83.86:8080'
  /*
    * 灾害隐患点信息
    * 内涝点-waterlog
    * 山洪点-torrent
    * 地质灾害点-geol
  */
  public async getDisasterInfo(type: string): Promise<Array<WaterloggingPoi | TorrentPoi | GeolPoi>> {
    try {
      let url = `${this.baseUrl}/JYTY/${type}/selectAll`;
      let res: any = await axios.get(url, { timeout: 5000, headers: { 'Content-Type': 'application/json' } });
      let data: ResponseLite<WaterloggingPoi | TorrentPoi | GeolPoi> = res.data;

      if(data.result !== 'S_OK' || !data.tagObject.length)
        return [];

      data.tagObject.forEach((val: WaterloggingPoi | TorrentPoi | GeolPoi): void => {
        val.ddatetime = val.ddatetime ? moment(val.ddatetime).format('YYYY-MM-DD HH:mm') : '--';
      });
      return data.tagObject;
    }
    catch {
      console.error('灾害点接口请求失败');
      return [];
    }
  }

  public async addDisasterPoi(type: string, params: WaterloggingPoi | TorrentPoi | GeolPoi): Promise<boolean> {
    try {
      let url = `${this.baseUrl}/JYTY/${type}/inserts`;
      let res: any = await axios({
        method: 'post',
        url,
        data: JSON.stringify({ [`${type}s`]: [params] }),
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });
      let data: ResponseLite<WaterloggingPoi | TorrentPoi | GeolPoi> = res.data;
      return data.result === 'S_OK';
    }
    catch {
      console.error(`failed to add ${type} poi`);
      return false;
    }
  }

  public async deleteDisasterPoi(type: string, ids: number[]): Promise<boolean> {
    try {
      let url=`${this.baseUrl}/JYTY/${type}/deletes`;
      let res: any = await axios({
        url,
        method: 'post',
        data: JSON.stringify({ Ids: ids }),
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });
      let data: ResponseLite<WaterloggingPoi | TorrentPoi | GeolPoi> = res.data;
      return data.result === 'S_OK';
    }
    catch {
      console.error(`failed to delete ${type} poi`);
      return false;
    }
  }

  public async modifyDisasterPoi(type: string, params: WaterloggingPoi | TorrentPoi | GeolPoi): Promise<boolean> {
    try {
      let url= `${this.baseUrl}/JYTY/${type}/update`;
      let res: any = await axios({
        url,
        method: 'post',
        timeout: 5000,
        data: qs.stringify(params, { encode: false }),
        headers: { 'Content-Type':'application/x-www-form-urlencoded'}
      });
      let data: ResponseLite<WaterloggingPoi | TorrentPoi | GeolPoi> = res.data;
      return data.result === 'S_OK';
    }
    catch {
      console.error(`failed to modify ${type} poi`);
      return false;
    }
  }

  //获取最新自动预警
  public async getNewDisasterWarning(type: string): Promise<Array<WaterloggingState | TorrentWarningState | GeolWarningState>> {
    try {
      let url = `${this.baseUrl}/JYTY/${type}warning/selectLatest`;
      let res: any = await axios({
        url,
        method: 'post',
        data: {},
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });
      let data: ResponseLite<WaterloggingState | TorrentWarningState | GeolWarningState> = res.data;
      if(data.result !== 'S_OK' || !data.tagObject.length)
        return [];

      data.tagObject.forEach((item: WaterloggingState | TorrentWarningState | GeolWarningState): void => {
        item.ddatetime = item.ddatetime ? moment(item.ddatetime).format('YYYY-MM-DD HH:mm') : '--';
      });
      return data.tagObject;
    }
    catch {
      console.error(`faild to get ${type} disaster warning infos`);
      return [];
    }
  }

  public async getAllDisasterWarning(type: string): Promise<Array<WaterloggingState | TorrentWarningState | GeolWarningState>> {
    try {
      let url = `${this.baseUrl}/JYTY/${type}warning/selectAll`;
      let res: any = await axios.get(url, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });
      let data: ResponseLite<WaterloggingState | TorrentWarningState | GeolWarningState> = res.data;
      if(data.result !== 'S_OK' || !data.tagObject.length)
        return [];

      data.tagObject.forEach((item: WaterloggingState | TorrentWarningState | GeolWarningState): void => {
        item.ddatetime = item.ddatetime ? moment(item.ddatetime).format('YYYY-MM-DD HH:mm') : '--';
      });
      return data.tagObject;
    }
    catch {
      console.error(`faild to get ${type} disaster warning infos`);
      return [];
    }
  }

  public async getDisasterWarningByTime(type: string, starttime: string, endtime: string, geolTypes?: string[], geolLevels?: any,
    torrentParams?: { types?: string[], citys?: string[], countys?: string[] }): Promise<Array<WaterloggingState | TorrentWarningState | GeolWarningState>> {
    try {
      let url: string = `${this.baseUrl}/JYTY/${type}warning/selectDate`;
      let params: any = {
        "sddatetime":  moment(starttime).format('YYYY-MM-DD HH:mm:00'),
        "eddatetime": moment(endtime).format('YYYY-MM-DD HH:mm:00')
      }
      if(Array.isArray(geolTypes) && geolTypes.length)
        params['types'] = geolTypes;
      if(Array.isArray(geolTypes) && geolLevels.length)
        params['levels'] = geolLevels;
      if(torrentParams)
        params = { ...params, ...torrentParams };

      let res: any = await axios.post(url, params, {headers: { 'Content-Type': 'application/json' }});
      let data: ResponseLite<WaterloggingState | TorrentWarningState | GeolWarningState> = res.data;
      if(data.result !== 'S_OK' || !data.tagObject.length)
        return [];
      data.tagObject.forEach((item: WaterloggingState | TorrentWarningState | GeolWarningState): void => {
        item.ddatetime = item.ddatetime ? moment(item.ddatetime).format('YYYY-MM-DD HH:mm') : '--';
      });
      return data.tagObject;
    }
    catch {
      console.error(`failed to get ${type} disaster warning infos by datetime range`);
      return [];
    }
  }
  //获取相应类型的所有预警报告
  public async getAllWaringReport(type: string): Promise<any>{
    try {
      let url = `${this.baseUrl}/JYTY/word/getWordList?type=${type}`;
      let res: any = await axios.get(url, { timeout: 5000, headers: { 'Content-Type': 'application/json' } });
      let data: any = res.data;
      if(data.result !== 'S_OK' || !data.tagObject.length)
        return [];
      return data.tagObject;
    }
    catch {
      console.error('预警报告接口请求失败');
      return [];
    }
  }
}
