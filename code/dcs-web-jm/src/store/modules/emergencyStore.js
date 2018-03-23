import * as actions from '../actions/emergencyAct'
import * as getters from '../getters/emergencyGetters'

import {
  RESET_EMERG_RES_STATUS
} from '../mutation-types'

const state = {
  list: {
    typhoon: {
      name: '台风',
      levels: {
        red: { status: false, selected: false, basis: '', norm: '未来24小时内将有强台风以上级别的热带气旋登陆或严重影响本市。' },
        orange: { status: false, selected: false, basis: '', norm: '未来24小时内将有台风以上级别的热带气旋登陆或严重影响本市。' },
        yellow: { status: false, selected: false, basis: '', norm: '未来48小时内将有热带风暴以上级别的热带气旋登陆或严重影响本市。' },
        blue: { status: false, selected: false, basis: '', norm: '未来72小时内将有热带风暴以上级别的热带气旋登陆或严重影响本市。' }
      }
    },
    rain: {
      name: '暴雨',
      levels: {
        red: { status: false, selected: false, basis: '', norm: '过去24小时全市三分之一以上市（区）出现特大暴雨，或三分之二以上市（区）出现大暴雨，并造成严重影响，且预计未来24小时上述地区仍将出现暴雨以上降水。' },
        orange: { status: false, selected: false, basis: '', norm: '过去24小时全市1个以上市（区）出现特大暴雨，或二分之一以上市（区）出现大暴雨，并造成严重影响，且预计未来24小时上述地区仍将出现暴雨以上降水；或者预计未来24小时全市有三分之二以上市（区）将出现大暴雨降水。' },
        yellow: { status: false, selected: false, basis: '', norm: '过去24小时全市三分之一以上市（区）出现大暴雨天气，且预计未来24小时上述地区仍将出现暴雨天气；或者预计未来24小时全市有二分之一以上市（区）将出现大暴雨降水。' },
        blue: { status: false, selected: false, basis: '', norm: '未来24小时全市有三分之一以上市（区）将出现大暴雨降水。' }
      }
    },
    temp: {
      name: '高温',
      levels: {
        red: { status: false, selected: false, basis: '', norm: '全市三分之二以上市（区）已经连续2天出现37℃以上高温天气，且1个市（区）出现39℃以上高温，预计上述地区37℃以上高温天气仍将持续。' },
        orange: { status: false, selected: false, basis: '', norm: '全市三分之二以上市（区）已经连续2天出现37℃以上高温天气，预计上述地区37℃以上高温天气仍将持续。' },
        yellow: { status: false, selected: false, basis: '', norm: '全市全部市（区）已经连续2天出现35℃以上高温，且三分之一以上市（区）出现37℃以上高温，预计全市35℃以上的高温天气将持续2天以上。' },
        blue: { status: false, selected: false, basis: '', norm: '全市全部市（区）已经连续2天出现35℃以上高温，预计全市35℃以上的高温天气将持续2天以上。' }
      }
    },
    cold: {
      name: '寒冷',
      levels: {
        red: { status: false, selected: false, basis: '', norm: '全市三分之二以上市（区）最低气温已降至3℃或以下，且1个市（区）出现0℃以下低温，预计上述地区3℃以下低温天气仍将持续。' },
        orange: { status: false, selected: false, basis: '', norm: '全市全部市（区）最低气温已降至5℃或以下，且1个市（区）出现3℃以下低温，预计上述地区5℃以下低温天气将持续2天以上。' },
        yellow: { status: false, selected: false, basis: '', norm: '全市三分之二以上市（区）最低气温已降至5℃或以下，预计上述地区5℃以下低温天气将持续2天以上。' },
        blue: { status: false, selected: false, basis: '', norm: '全市三分之二以上市（区）已连续3天日平均气温降至10℃或以下，预计上述地区日平均气温低于10℃的天气将持续3天以上。' }
      }
    },
  }
}

const mutations = {
  [RESET_EMERG_RES_STATUS](state, { type, data }) {
    let levels = state.list[type];
    for(let i in levels) {
      if(data.hasOwnProperty(i)) {
        levels[i].status = data[i].hasEmerg;
        levels[i].basis = data[i].emergMsg;
      }
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
