export interface SignItem {
  releaseTime: string,
  releaseArea: string,
  warningType: string,
  level: number,
  color: string,
  status: boolean,
  lon: number,
  lat: number,
  department?: string
}

export interface SignalGuide {
  id: number,
  type: string,
  level: string,
  meaning: string,
  guide: string
}