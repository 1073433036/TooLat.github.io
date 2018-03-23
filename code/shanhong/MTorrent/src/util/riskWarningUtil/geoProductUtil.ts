/**
 *
 *  预警分析 --> 预警提醒 --> 地图颜色填充工具
 *
 * */


export default class geoProductUtil {

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
    BLUE: '#0000FF',        //BLUE
    YELLOW: '#FFFF00',     //YELLOW
    ORANGE: '#FFA500',       //ORANGE
    RED: '#FF0000'           //RED
  }
  callback: Function | null = null
  //根据等级 填充地图颜色
  public async drawBoundary(boundData, colorKey, cityName, callback) {
    this.callback = callback;
    let chineseColorL = this.getChineseColorLevelStr(colorKey);
    if (boundData[0] instanceof Array){
      for (let opt of boundData) {
        let latlngs: any[] = []
        for (let el of opt) {
          latlngs.push([el.y, el.x])
        }
        let polygon = this.L.polygon(latlngs, {stroke: false, fillColor: this.fillColor[colorKey], fillOpacity: 0.5})
        polygon.addTo(this.zmap)
        this.layerLightHeight(polygon, cityName, chineseColorL);
        this.polygons.push(polygon)
      }
    }else {
      let latlngs: any[] = []
      for (let opt of boundData) {
        latlngs.push([opt.y, opt.x])
      }
      let polygon = this.L.polygon(latlngs, {stroke: false, fillColor: this.fillColor[colorKey], fillOpacity: 0.5})
      this.layerLightHeight(polygon, cityName, chineseColorL);
      polygon.addTo(this.zmap)
      this.polygons.push(polygon)
    }
  }

  private layerLightHeight(polygon: any, cityName: string, colorLevel: string) {
    polygon.on('mouseover', e => {
      let obj = {cityName: cityName, colorLevel: colorLevel, isShow: true};
      this.callback && this.callback(obj);
      polygon.setStyle({fillOpacity: 0.8});
    })
    polygon.on('mouseout', e => {
      let obj = {cityName: cityName, colorLevel: colorLevel, isShow: false};
      this.callback && this.callback(obj);
      polygon.setStyle({fillOpacity: 0.5});
    })
  }

  private getChineseColorLevelStr(colorLeve: string){
    let colorL: string = "红色";
    if (colorLeve === "RED") {
      colorL = "红色";
    }else if (colorLeve === "BLUE"){
      colorL = "蓝色";
    }else if (colorLeve === "YELLOW"){
      colorL = "黄色";
    }else if (colorLeve === "ORANGE"){
      colorL = "橙色";
    }else {
      colorL = "其他颜色";
    }
    return colorL
  }

  //清除之前的 layer
  public clearLayer() {
    for (let pl of this.polygons){
      this.zmap.removeLayer(pl);
    }
    this.polygons.length = 0;
  }

}
