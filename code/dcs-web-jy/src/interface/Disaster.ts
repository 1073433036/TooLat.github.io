export default interface Disaster {
  disaster?: string
  disasterStatus:string  //happening正在发生 | ended已结束
  releaseUnit: string
  releaseTime: string
  reportMan: string
  secondDisaster?: string
  starttime?: string
  endtime?: string
  origin?: string
  files?: any
  economyLoss?: number
  remarks?: string
  phone?: string
  influenceDesc?: string
  weatherDesc?: string
  warningsignDesc?: string
  basicLoss?: string
  hydrologyLoss?: string
  agricultureLoss?: string
  forestryLoss?: string
  fisheryLoss?: string
  electricityLoss?: string
  communicationLoss?: string
  animalsLoss?: string
  trafficLoss?: string
  businessLoss?: string
  othersLoss?: string
  province?: string
  city?: string
  county?: string
  id?: string
  auditStatus?: string  //unpasscheck未通过审核 | unchecked未审核 | passcheck通过审核
  injuryPerson?: string
  sourceName?: string
  sourcePath?: string
}
