export interface WaterloggingPoi {
  id?: number,
  cityid: number,
  countyid: number,
  townid: number,
  lon: number,
  lat: number,
  ddatetime: number | string,
  detail: string,
  manager: string,
  cellphone: string,
  address: string,
  name: string,
  threshold: string
}

export interface WaterloggingState {
  id: number,
  lon: number,
  lat: number,
  ddatetime: number | string,
  name: string,
  threshold: string,
  rain: string,
  status: string
}

export interface TorrentPoi {
  id?: number,
  cityid: number,
  countyid: number,
  townid: number,
  lon: number,
  lat: number,
  detail: string,
  ddatetime: string | number
}
export interface TorrentReservoirPoi {
  id: number,
  name: string,
  address: string,
  province: string,
  city: string,
  county: string,
  code: string,
  lat: number,
  lon: number,
  waterlevel: number,
  alertlevel: null,
  updatetime: string | number
}
export interface TorrentRiverPoi {
  id: number,
  code: string,
  staname: string,
  river: string,
  endflow: string,
  lat: number,
  lon:number,
  waterlevel: number,
  alertlevel: number,
  updatetime: string | number
}
export interface TorrentWarningState {
  id: number,
  lon: number,
  lat: number,
  name: string,
  type: string,
  ddatetime: string | number,
  waterlevel: number,
  alertlevel: number,
  cause: string,
  status: string,
  city: string,
  county: string
}

export interface GeolPoi {
  id?: number,
  name: string,
  cityid?:number,
  countyid?:  number,
  townid?: number,
  lon: number,
  lat: number,
  ddatetime: string | number,
  detail: string,
  manager: string,
  cellphone: number,
  address: string,
  type: string,
  scale: string,
  stability: string,
  risk: string,
  factor: string,
  people: number,
  gdp: number|string,
  measure: string,
  level: string
}

export interface GeolWarningState {
  id?: number,
  lon: number,
  lat: number,
  name: string,
  ddatetime: string | number,
  type: string,
  address: string,
  threshold: string,
  rain: string,
  level: string,
  cause: string,
  status: string
}
