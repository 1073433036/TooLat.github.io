import axios from 'axios'
import { ResponseLite } from '../interface/Response'
import { SignItem, SignalGuide } from '../interface/SignItem'

interface SignToParse {
  "DDATETIME": string,
  "V01301": string,
  "V06001": string,
  "V05001": string,
  "INFLAG": string,
  "V01035": string,
  "HOTSPOT": string,
  "V_PRCODE": string,
  "V_CITY": string,
  "VF01015_CN": string,
  "C_FYYYY": string,
  "C_FMM": string,
  "C_FDD": string,
  "V_FHM": string,
  "V_TFLEV": string,
  "C_TFSTA": string,
  "V_BYLEV": string,
  "C_BYSTA": string,
  "V_LYLEV": string,
  "C_LYSTA": string,
  "V_GWLEV": string,
  "C_GWSTA": string,
  "V_HLLEV": string,
  "C_HLSTA": string,
  "V_HMLEV": string,
  "C_HMSTA": string,
  "V_DWLEV": string,
  "C_DWSTA": string,
  "V_JBLEV": string,
  "C_JBSTA": string,
  "V_BBLEV": string,
  "C_BBSTA": string,
  "V_SLLEV": string,
  "C_SLSTA": string
}

export default class WarningSign {
  constructor() {}

  private signNames: SignToParse = {
    "DDATETIME": '发布时间',
    "V01301": '区站号',
    "V06001": '经度',
    "V05001": '纬度',
    "INFLAG": '入库状态',
    "V01035": '编报中心',
    "HOTSPOT": '热点数据',
    "V_PRCODE": '所属省份',
    "V_CITY": '所属地市',
    "VF01015_CN": '站名（中文）',
    "C_FYYYY": '预警发布年',
    "C_FMM": '预警发布月',
    "C_FDD": '预警发布日',
    "V_FHM": '预警发布时间（时分）',
    "V_TFLEV": '台风预警级别',
    "C_TFSTA": '台风预警状态',
    "V_BYLEV": '暴雨预警级别',
    "C_BYSTA": '暴雨预警状态',
    "V_LYLEV": '雷雨大风预警级别',
    "C_LYSTA": '雷雨大风预警状态',
    "V_GWLEV": '高温预警级别',
    "C_GWSTA": '高温预警状态',
    "V_HLLEV": '寒冷预警级别',
    "C_HLSTA": '寒冷预警状态',
    "V_HMLEV": '灰霾预警级别',
    "C_HMSTA": '灰霾预警状态',
    "V_DWLEV": '大雾预警级别',
    "C_DWSTA": '大雾预警状态',
    "V_JBLEV": '道路结冰预警级别',
    "C_JBSTA": '道路结冰预警状态',
    "V_BBLEV": '冰雹预警级别',
    "C_BBSTA": '冰雹预警状态',
    "V_SLLEV": '森林火险预警级别',
    "C_SLSTA": '森林火险预警状态'
  }
  
  private getSignName(attr: string): string {
    return this.signNames[attr];
  }

  private getLevelColor(index: number): string {
    let colors: string[] = ['transparent', 'red', 'orange', 'yellow', 'blue', 'grey'];
    return colors[index];
  }

  private getWarningLevel(index: number): string {
    let levels: string[] = ['无预警', '红色', '橙色', '黄色', '蓝色', '白色'];
    return levels[index];
  }

  public async getWarningSigns(city?: string): Promise<Array<SignItem>> {
    try {
      let signRes: any = await axios.get('http://10.148.83.228:2008/projshare/warning/get/warn/current');
      let data: ResponseLite<SignToParse> = signRes.data;
      if(data.result !== 'S_OK' || !data.tagObject)
        return [];
      
      let signData: Array<SignToParse> = data.tagObject;
      let parsedData: Array<SignItem> = [];

      for(let sign of signData) {
        if(typeof(city) !== undefined && sign['V_CITY'] !== city)
          continue;

        for(let i in sign) {
          if(/V_.+LEV/.test(i) === false)
            continue;

          let attrName = i.replace('LEV', 'STA').replace('V_', 'C_'); //替换属性名
          if(!Number(sign[i]) || sign[attrName] !== 'ON')
            continue;

          let params: SignItem = {
            releaseTime: sign['DDATETIME'].replace('.0', '').slice(0, 16),
            releaseArea: sign['VF01015_CN'],
            warningType: this.getSignName(i).replace('预警级别', ''),
            level: Number(sign[i]),
            color: this.getLevelColor(Number(sign[i])),
            status: sign[attrName] === 'ON',
            lon: Number(sign['V06001']),
            lat: Number(sign['V05001'])
          };
          parsedData.push(params);
        }
      }
      parsedData.sort((a: SignItem, b: SignItem): number => {
        return new Date(a['releaseTime']).getTime() - new Date(b['releaseTime']).getTime();
      });

      return parsedData;
    }
    catch(e) {
      throw 'failed to get warning signs';
    }
  }

  public async getSignalGuide(type: string, levelCode?: number): Promise<Array<SignalGuide>> {
    try {
      let params: string = `type=${type}`;
      if(typeof levelCode === 'number')
        params += `&level=${this.getWarningLevel(levelCode || 1)}`;
      let res: any = await axios.post(`http://10.148.83.86:8080/JYTY/warningsignalstandard/select?${params}`);
      let data: ResponseLite<SignalGuide> = res.data;
      if(data.result !== 'S_OK' || !data.tagObject)
        return [];
      return data.tagObject;
    }
    catch {
      console.error('failed to get signal guide');
      return [];
    }
  }
}