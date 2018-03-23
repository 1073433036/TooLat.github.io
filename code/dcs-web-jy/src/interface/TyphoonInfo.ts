export interface HistoryTyphoonItem {
  fcid: string,
  tsid: number,
  intlid: string,
  mintime: number,
  maxtime: number,
  info: ItemInfo,
  landfall: Landfall
}

interface ItemInfo {
  level?: string,
  cname?: string,
  ename?: string,
  min_distance?: number,
  max_rain?: number,
  max_wind?: number
}

interface Landfall {
  city?: string,
  level?: string,
  datetime?: string,
  lon?: number,
  lat?: number
}