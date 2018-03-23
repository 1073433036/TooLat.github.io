/**
 *
 *  预警分析 --> 预警提醒 --> 地图颜色填充工具
 *
 * */


import { geoClient } from '../clientHelper'
export default class remindZmapUtil {

  constructor() {
    let global:any = <any>window
    this.L = global['L']
    this.zmap = global['zmap']
  }
  L:any = null
  zmap:any = null

//对应的回波值
  polygons:any[] = []
  fillColor:any = {
    1: '#ff0',
    2: '#ffa500',
    3: '#f00'
  }

  // 受到 实时数据 移除layer的正则影响 ,不能有 a / b
  mapLayerId: string = 'RemindLyerId'

  //根据等级 填充地图颜色
  public async drawBoundary(level, layerId) {
    this.clearLayer(layerId)
    if (!this.polygons.length) {
      if (Number(sessionStorage.countyId) != 0) {
        let data = await this.getBoundary()
        if (!data) return
        let bound = data.boundary
        for (let opt of bound) {
          let latlngs: any[] = []
          for (let el of opt)
            latlngs.push([el.y, el.x])
          let polygon = this.L.polygon(latlngs, { stroke: false, fillColor: this.fillColor[level] })
          polygon.id = this.mapLayerId
          polygon.addTo(this.zmap)
          this.polygons.push(polygon)
        }
      } else {
        let data = await this.getBoundary()
        if (!data) return
        let bound = JSON.parse(data.bound)
        for (let opt of bound) {
          let latlngs: any[] = []
          for (let el of opt)
            latlngs.push([el[1], el[0]])
          let polygon = this.L.polygon(latlngs, { stroke: false, fillColor: this.fillColor[level] })
          polygon.id = this.mapLayerId
          polygon.addTo(this.zmap)
          this.polygons.push(polygon)
        }
      }
    } else {
      for (let polygon of this.polygons) {
        polygon.setStyle({ fillColor: this.fillColor[level] })
        polygon.addTo(this.zmap)
      }
    }
  }
  // 获取用户边界
  private async getBoundary() {
    let data
    if (Number(sessionStorage.countyId) != 0)
      data = await geoClient.findCounty(Number(sessionStorage.countyId))
    else if (Number(sessionStorage.cityid) != 0)
      data = await geoClient.findCity(Number(sessionStorage.cityid))
    else
      data = await geoClient.getProv()
    if (data) return data
    else return false
  }
  //清除之前的 layer
  public clearLayer(layerId) {
    this.zmap.eachLayer(e => {
      if (e.id === this.mapLayerId)
        // console.log("清除layer");
        this.zmap.removeLayer(e)
    })
  }

}
