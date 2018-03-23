import { Getter, GetterTree } from 'vuex'
import { State } from './state'
import moment from 'moment'

export function modelData_global(state: State): any {
  return state.modeldata
}

export function modelSelected_global(state: State) {
  return state.modeldata.modelSelected
}

export function townsIdList_global(state: State): Array<any> {
  return state.modeldata.townsIdList
}

export function affectedTowsList_global(state: State): Array<any> {
  return state.modeldata.affectedTownsList
}

export function modelNcInfo_global(state: State): any {
  return state.modeldata.ncInfo
}

export function seledTime_global(state: State): any {
  return state.modeldata.seledTime
}

export function modelRanges_global(state: State): any {
  return state.modeldata.ranges
}

export function isModelAnalysing_global(state: State): any {
  return state.modeldata.isAnalysing
}

export function fstTimeList_global(state: State) {
  const ncInfo = state.modeldata.ncInfo;

  let timesArray = [];
  if (ncInfo !== null) {
    const ms = ncInfo.start;
    const times = ncInfo.modelName === 'meteohist_nc' ? [1, 5, 23, 47, 71] : ncInfo.times;
    let dtStr = moment(ms).format('YYYY-MM-DDj');
    times.forEach((t, i) => {
      let dt = moment(ms + t * 3600000);
      let date = dt.format('YY-MM-DD');
      timesArray.push({
        seledTime: t,
        time: dt.format('HH:00'),
        date
      });
      dtStr = date;
    });
  }

  return timesArray;
}

/*export function hasEffectedTowns(state: State) {
  const townsIdList = state.modeldata.townsIdList;
  let bool = false;
  for (let tl of townsIdList) {
    if (tl.length !== 0) {
      bool = true;
      break;
    }
  }
  return bool;
}*/

export function colorTableToAdd_global (state: State): any {
  return state.colorToAdd
}

export function colorTableToDelete_global (state: State): any {
  return state.colorToDelete
}

export default <GetterTree<State, any>>{
  modelSelected_global,
  townsIdList_global,
  modelData_global,
  affectedTowsList_global,
  modelNcInfo_global,
  seledTime_global,
  modelRanges_global,
  isModelAnalysing_global,
  fstTimeList_global,
  colorTableToAdd_global,
  colorTableToDelete_global
}