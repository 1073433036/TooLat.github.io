import axios from 'axios'
import { ResponseLite } from '../interface/Response'
import DisasterWarning from '../interface/DisasterWarning'

interface PostBody {
  datetime: string
  type: string[]
  cityid?: number
  countyid?: number
  townid?: number
}

export default class DisasterAnalysis {
  constructor(prefixUrl?: string) {
    this.prefixUrl = prefixUrl || '';
  }

  private prefixUrl: string
  
  public async getDisasterByDatetime(datetime: string, cityid: number, countyid?: number,
    type: string[] = ['rain', 'wind', 'geology', 'storm', 'thunder']): Promise<DisasterWarning[]> {
    try {
      let params: PostBody = { datetime, type, cityid };
      if(countyid)
        params.countyid = countyid;
      let res: any = await axios.post(`${this.prefixUrl}/JYTY/disasteranalysis/selectDate`, params);
      let data: ResponseLite<DisasterWarning> = res.data;
      if(data.result !== 'S_OK' || !data.tagObject)
        return [];
      return data.tagObject;
    }
    catch {
      throw 'failed to get disaster warning info by datetime';
    }
  }

  // type: 'rain' | 'rain1' | 'wind' | 'geology' | 'storm' | 'torrent' | 'waterlog'
  public async getDisasterImage(type: string, size: number): Promise<string[]> {
    try {
      let res: any = await axios.post(`${this.prefixUrl}/JYTY/dpictureservice/getfile?type=${type}&size=${size}`);
      let data: any = res.data;
      if(data.result === 'S_OK' && data.tagObject) {
        let images: string[] = [];
        for(let i in data.tagObject) {
          images = images.concat(data.tagObject[i]);
        }
        return images;
      } else {
        return [];
      }
    }
    catch {
      console.error(`failed to get disaster ${type} image`);
      return [];
    }
  }
}