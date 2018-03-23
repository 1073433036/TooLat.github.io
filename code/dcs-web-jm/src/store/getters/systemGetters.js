export const systemTitle = state => state.title
export const regionConfig = state => state.regionConfig
export const regionData = state => state.regionData
export const currentRegion = state => state.currentRegion
export const loginPage = state => state.loginPage
export const loginUser = state => state.loginUser
export const userManagement = state => state.userManagement
export const infoTip_global = state => state.infoTip
export const isRoot = state => state.loginUser.sign === 'root'
export const colorTableData = state => state.colorTable
export const isColorDelete = state => state.colorTable.isColorDelete
export const colorTypeData = state => state.colorTable.colorTypeData
export const isColorAdd = state => state.colorTable.isColorAdd
export const deleteColorType = state => state.colorTable.deleteColorType
export const legendPopup_global = state => state.legendPopup
