import { Getter, GetterTree } from 'vuex'
import { State } from './state'
import UserInfo from '../../interface/UserInfo'
import Region from '../../interface/Region'
import Bound from '../../interface/Bound'

export const region_global = (state: State): Region => {
  return {
    cityId: state.cityId,
    cityName: state.cityName,
    countyId: state.countyId,
    countyName: state.countyName
  };
}

export const regionName_global = (state: State): string => {
  return state.countyId ? state.countyName : (state.cityName + '市');
}

export const systemTitle_global = (state: State): string => state.title

export const userInfo_global = (state: State): UserInfo => state.userInfo

export const isLogined_global = (state: State): boolean => {
  return Object.keys(state.userInfo).length > 0;
}

export const bounds_global = (state: State): Bound => state.bounds

export default <GetterTree<State, any>> {
  region_global,
  regionName_global,
  systemTitle_global,
  userInfo_global,
  isLogined_global,
  bounds_global
}
