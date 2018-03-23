import { AISData } from "../../interface/AIS";
import {
  CHANGE_REAL_POPUP,
} from '../mutation-types'

export class State {
  //站点弹窗数据
  // realPopup: any = {
  //   show: false,
  //   detail: true,
  //   name: '',
  //   elements: [
  //     {key: 'rain', value: '', unit: 'mm'},
  //     {key: 'temp', value: '', unit: '℃'},
  //     {key: 'ps', value: '', unit: 'hpa'},
  //     {key: 'wind', value: '', unit: 'm/s'}
  //   ],
  //   pos: {
  //     top: 0,
  //     left: 0
  //   }
  // }
  realPopup: any = {}

  //AIS 监控
  displayAISDetail: boolean = false
  AISDetailData: AISData = null
  AISDetailPosition: any = null
  boatModel: any = null
  isModelHightLighted: boolean = false
  isWaterLevelDetailOn: boolean = false
}