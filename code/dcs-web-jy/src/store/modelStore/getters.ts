import { Getter, GetterTree } from 'vuex'
import { State } from './state'
import moment from 'moment'

export const modelData = state => state.modelData

export const selectedModel = state => state.modelData.selectedModel

export const townsIdList = state => state.modelData.townsIdList

export const affectedTownsList = state => state.modelData.affectedTownsList

export const modelNcInfo = state => state.modelData.ncInfo

export const gridNcInfo = state => state.modelData.gridNcInfo

export const seledTime = state => state.modelData.seledTime

export const modelRanges = state => state.modelData.ranges

export const isModelAnalyzing = state => state.modelData.isAnalyzing

export const riverRoadTipData = state => state.modelData.riverRoadTipData

export const riverRoadData = state => state.modelData.riverRoadData

export const reservoirData = state => state.modelData.reservoirData.list

export const reservoirTableColumns = state => state.modelData.reservoirData.columns

export const reservoirNamesList = state => state.modelData.reservoirData.namesList

export const isShowStatRain = state => state.modelData.isShowStatRain

export const isShowWaterlogStat = state => state.modelData.isShowWaterlogStat

export const fstTimeList = state => {
  const modelData = state.modelData;
  const ncInfo = modelData.ncInfo;

  let timesArray: any = [];
  if(ncInfo !== null) {
    if(ncInfo.modelName === 'meteocast_nc') {
      modelData.selectedModel === 'rain' ? ncInfo.times.unshift(0, 1, 2) : ncInfo.times.unshift(0);
    }

    const times = ncInfo.times;
    let dtStr = moment(new Date(ncInfo.start)).format('MM-dd');
    times.forEach((t, i) => {
      let ms = modelData.selectedModel === 'rain' && i < 4 ? modelData.gridNcInfo.start : ncInfo.start;
      let dt = new Date(ms + t*3600000);
      let date = moment(dt).format('MM-dd');
      timesArray.push({
        seledTime: t,
        time: moment(dt).format(modelData.selectedModel === 'rain' ? 'HH:mm' : 'HH:00'),
        date: (!i || dtStr !== date) ? date : ''
      });

      dtStr = date;
    });
  }

  return timesArray;
}

export const hasEffectedTowns = state => {
  const townsIdList = state.modelData.townsIdList,
        affectedTownsList = state.modelData.affectedTownsList;
  let idFlag = false,
      townFlag = false;
  for(let tl of townsIdList) {
    if(tl.length !== 0) {
      idFlag = true;
      break;
    }
  }
  for(let towns of affectedTownsList) {
    if(Array.isArray(towns)) {
      if(towns.length) {
        townFlag = true;
        break;
      }
    } else {
      for(let i in towns) {
        if(towns[i].length) {
          townFlag = true;
          break;
        }
      }
    }
  }
  return idFlag || townFlag;
}

export const targetWarningData = state => state.modelData.targetWarningData

export const analysisType_global = state => state.modelData.analysisType

export default <GetterTree<State, any>> {
  modelData,
  selectedModel,
  townsIdList,
  affectedTownsList,
  modelNcInfo,
  gridNcInfo,
  seledTime,
  modelRanges,
  isModelAnalyzing,
  riverRoadTipData,
  riverRoadData,
  reservoirData,
  reservoirTableColumns,
  reservoirNamesList,
  isShowStatRain,
  isShowWaterlogStat,
  fstTimeList,
  hasEffectedTowns,
  targetWarningData,
  analysisType_global,
}
