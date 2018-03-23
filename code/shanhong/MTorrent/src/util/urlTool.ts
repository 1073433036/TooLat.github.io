
// let baseUrl = 'http://10.148.83.228:8922/'

// let serviceBaseUrl = 'http://10.148.83.45:8080/'

//风险预警
// export const RISK_WARNING_RAINFALL_URL = baseUrl + 'dataunit/model/renderModelData'

let host = window.location.host
let flag = host === '113.108.192.98:8080' || host === '10.12.12.84:8080'
//卫星云图
export const SARILLITE_CLOUD_IMG_URL = (flag ? ('http://' + host) : 'http://10.148.83.228:2008') + '/projshare/fileproduct/get/cloud/file?filename='

//决策服务
// export const PROVINCE_WEATHER_REPORT_URL = serviceBaseUrl + 'sh/forecast/get/provems'
// export const DANGER_WEATHER_REPORT_UR = serviceBaseUrl + 'sh/forecast/get/wxweather'
// export const COUNTY_WEATHER_REPORT_UR = serviceBaseUrl + 'sh/forecast/get/countyforecast'
