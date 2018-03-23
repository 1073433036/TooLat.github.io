export default interface DisasterWarning {
  cityid: number
  countyid: number
  townid: number
  datetime: string
  type: string
  level: number
  cityname: string
  countyname: string
  townname: string
  leadtime: number
}