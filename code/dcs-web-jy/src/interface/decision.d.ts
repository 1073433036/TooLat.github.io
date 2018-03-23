interface RiverInfo {
  id: number
  code: string
  staname: string
  river: string
  endflow: string
  lat: number
  lon: number
  waterlevel: number
  alertlevel: number
  updatetime: number
}

interface ReservoirInfo {
  id: number
  name: string
  address: string
  province: string
  city: string
  county: string
  code: string
  lat: number
  lon: number
  waterlevel: number
  alertlevel: number
  updatetime: number
}

interface TyphoonWarning {
  tsid: string
  tscname: string
  tsename: string
  intlid: string
  landon: string
  origin: string
  meanings: string
  remark: string
  crttime: string
}

interface Torrentwarning {
  id: number
  lon: number
  lat: number
  name: string
  type: string
  ddatetime: number
  waterlevel: number
  alertlevel: number
  cause: string
  status: string
  city: string
  county: string
}

interface GeolWarning {
  id: number
  lon: number
  lat: number
  name: string
  ddatetime: number
  type: string
  address: string
  threshold: string
  rain: string
  level: string
  cause: string
  status: string
}

interface WaterlogWarning {
  id: number
  lon: number
  lat: number
  ddatetime: number
  name: string
  threshold: string
  rain: string
  status: string
}

interface DisasterAlsInfo {
  cityid: number
  countyid: number
  townid: number
  datetime: string
  type: string
  level: number
  leadtime: number
  cityname: string
  countyname: string
  townname: string
}

interface PlansOnlineInfo {
  id: number
  emergencyname: string
  emergencytype: string
  responsegrade: number
  newschannels: number
  memo: string
  unit: string
  state: number
  fax: string
}

interface MaxEmergencyTypeInfo {
  id: number
  code: string
  name: string
}

interface MidEmergencyTypeInfo {
  id: number
  code: string
  name: string
  relationId: number
}

interface PlanMemo {
  id: number
  name: string
}

interface TyphoonInfo {
  fcid: string
  intlid: string
  tsid: number
  info: {
    cname: string
    ename: string
    tcrank: string
  }
  maxtime: number
  mintime: number
}

interface TyphRealDetail {
  datetime: number
  fcid: string
  intlid: string
  tsid: number
  location: {
    lon: number
    lat: number
  }
  elements: {
    pressure?: number
    rr06?: number
    rr07?: number
    rr08?: number
    rr10?: number
    windspeed?: number
    speed?: number
    gust?: number
    direction?: number
    tcrank?: string
  }
}

interface TyphFstDetail extends TyphRealDetail{
  leadtime: number
}

interface TyphoonMatch {
  tsid: number
  intlid: string
  ename: string
  cname: string
  weight: number
}

interface ShipInfo {
  货船?: ShipDetail
  未定义?: ShipDetail
  油船?: ShipDetail
  客船?: ShipDetail
  拖轮?: ShipDetail
  高速船?: ShipDetail
  执法船?: ShipDetail
  '货船(x)'?: ShipDetail
  '油船(x)'?: ShipDetail
  渔船?: ShipDetail
  搜救船?: ShipDetail
  引航船?: ShipDetail
  其他船?: ShipDetail
  疏浚或水下作业船?: ShipDetail
  拖带船?: ShipDetail
  游艇?: ShipDetail
  地效翼船?: ShipDetail
  港口供应船?: ShipDetail
  帆船?: ShipDetail
  '未定义(x)'?: ShipDetail
  '客船(x)'?: ShipDetail
}

interface ShipDetail {
  DDATETIME: string
  MMSI: string          // 船舶唯一标识
  I_DD: string
  NAME_EN: string       // 英文名称
  CALLSIGN: string      // 观察船呼号
  V05001: number        // 纬度
  V06001: number        // 经度
  COURSE: string        // 航线
  SOG: number           // 对地航速
  STATE: string         // 状态
  LENGTH: string        // 船身长度
  WIDTH: string         // 船身宽度
  IMO: string           // 船舶名称代码
  DRAUGHT: string       // 吃水受限
  COG: number           // 对地航向
  VESSELTYPE: string    // 船舶类型
  AISCLASS: string      // 船舶设备
  DEST: string          // 目的地
  ETA: string           // 预计到达时间
  DEVICETYPE: string    // 设备类型
  CRTTIME: string
}

interface contactDetail {
  id: number
  name: string
  department: string
  title: string
  phone: string
  cellphone: string
}

interface departmentDetail {
  did: number
  department: string
  scan: string | null
  office: string | null
}

interface departmentheadDetail {
  id: number, 
  name: string, 
  department: string, 
  position: string, 
  phone: null | string, 
  cellphone: null | string
}

interface planmeasureInfo {
  id: number
  e_name: string
  department: null | string
  level: number
  detail: string
  measure: string
  scan: string
}