import * as types from '../mutation-types'

export const storeRegionData = ({ commit }, data) => {
    commit(types.STORE_REGION_DATA, data);
}

export const gotoLoginPage = ({ commit }, action) => {
    commit(types.GOTO_LOGIN_PAGE, action)
}

export const storeLoginUser = ({ commit }, user) => {
    commit(types.STORE_LOGIN_USER, user)
}

export const gotoUserManagement = ({ commit }, action) => {
    commit(types.GOTO_USER_MANAGEMENT, action)
}

export const showInfoTip_global = ({ commit }, data) => {
    commit(types.SHOW_INFO_TIP, data);
}

export const storeColorTable_global = ({ commit }, data) => {
    commit(types.STORE_COLOR_TABLE, data);  //data: { type, data }
}

export const toggleLegendPopup_global = ({ commit }, bool) => {
    commit(types.TOGGLE_LEGEND_POPUP, bool);
}
