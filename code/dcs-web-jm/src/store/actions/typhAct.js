import * as types from '../mutation-types'

export const toggleTyphTimelineStatus_global = ({ commit }, action) => commit(types.TOGGLE_TYPH_TIMELINE_STATUS, action)

export const changeTyphCurrentYear_global = ({ commit }, year) => commit(types.CHANGE_TYPH_CURRENT_YEAR, year)

export const changeTyphCurrentName_global = ({ commit }, name) => commit(types.CHANGE_TYPH_CURRENT_NAME, name)

export const storeTyphData_global = ({ commit }, data) => commit(types.STORE_TYPH_DATA, data)

export const storePresentTyphData_global = ({ commit }, data) => commit(types.STORE_PRESENT_TYPH_DATA, data)

export const selectTyph_global = ({ commit }, id) => commit(types.SELECT_TYPH, id)

export const deleteHistoryTyph_global = ({ commit }, id) => commit(types.DELETE_HISTORY_TYPH, id)

export const toggleTyphClickPopup_global = ({ commit }, action) => commit(types.TOGGLE_CLICK_POPUP, action)

export const initialTyphData_global = ({ commit }) => commit(types.INITIAL_TYPH_DATA)

export const toggleCurrentTyphFlag_global = ({ commit }, action) => commit(types.TOGGLE_CURRENT_TYPH_FLAG, action)

export const toggleTyphMatchingPopup_global = ({ commit }, action) => commit(types.TOGGLE_TYPH_MATCHING_POPUP, action)

export const changeTyphClickPointIndex_global = ({ commit }, index) => commit(types.CHANGE_TYPH_CLICK_POINT_INDEX, index)

export const changeTyphClickPopupPos_global = ({ commit }, pos) => commit(types.CHANGE_TYPH_CLICK_POPUP_POS, pos)

export const storeTyphClickFsttime_global = ({ commit }, fstTime) => commit(types.STORE_TYPH_CLICK_FST_TIME, fstTime)

export const storeBefore03TyphIds_global = ({ commit }, arr) => commit(types.STORE_BEFOFE03_TYPH_IDS, arr)

export const selectMatchingTyph_global = ({ commit }, id) => commit(types.SELECT_MATCHING_TYPH, id)

export const toggleTyphReportPopup_global = ({ commit }, action) => commit(types.TOGGLE_TYPH_REPORT_POPUP, action)

export const toggleTyphOverPopup_global = ({ commit }, bool) => commit(types.TOGGLE_TYPH_OVER_POPUP, bool)

export const storeTyphOverPopupData_global = ({ commit }, data) => commit(types.STORE_TYPH_OVER_POPUP_DATA, data)

export const storeTyphOverPopupPos_global = ({ commit }, pos) => commit(types.STORE_TYPH_OVER_POPUP_POS, pos)

export const storeTyphoonData_global = ({ commit }, data) => commit(types.STORE_TYPHOON_DATA, data)
