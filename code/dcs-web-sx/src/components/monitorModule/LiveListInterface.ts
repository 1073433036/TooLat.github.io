export interface LiveList {
  id: string,
  userId: string,
  eventId: string,
  url: string,
  datetime: number,
  endtime: number,
  updatetime: number,
  lat: number
  lon: number
  state: 0 | 1
}