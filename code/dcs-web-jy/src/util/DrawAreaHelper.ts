export class DrawAreaHelper {
  constructor(L, zmap, zmapLayer, drawFinished, redrawCircle) {
    this.L = L
    this.zmap = zmap
    this.zmapLayer = zmapLayer
    this.drawFinished = drawFinished
    this.redrawCircle = redrawCircle
  }
  private L: any
  private zmap: any
  private zmapLayer: 'satillite' | 'terrain' | 'business'
  private center: number[] = []
  private radius: number = 0
  private endPoint: number[] = []
  private circle: any = null
  private circleStyles: any = {
    tianditu: { color: '#00bfdc', fillColor: '#333', fillOpacity: 0.3 },
    satillite: { color: '#00bfdc', fillColor: '#fff', fillOpacity: 0.2 },
    terrain: { color: '#00bfdc', fillColor: '#333', fillOpacity: 0.3 },
    business: { color: '#00bfdc', fillColor: '#333', fillOpacity: 0.3 }
  }
  private drawFinished: Function
  private redrawCircle: Function

  public toggleZmapLayer(layer) {
    this.zmapLayer = layer
    if (this.circle) {
      this.circle.setStyle({
        color: this.circleStyles[this.zmapLayer].color,
        fillColor: this.circleStyles[this.zmapLayer].fillColor,
        fillOpacity: this.circleStyles[this.zmapLayer].fillOpacity
      })
    }
  }

  public startDrawArea() {
    this.zmap.on('mousemove', this.mouseMoveEvent)
    this.zmap.on('click', this.clickEvent)
    this.zmap.on('contextmenu', this.contextmenuEvent)
  }

  private mouseMoveEvent = (e: any) => {
    let text = this.center.length ? '左键点击结束圈选' : '左键点击开始圈选区域'
    let left = e.containerPoint.x + 10, top = e.containerPoint.y + 10
    if (!document.querySelector('#areaTip')) {
      let ele = document.createElement('div')
      ele.id = 'areaTip'
      ele.style.position = 'absolute'
      ele.style.top = top + 'px'
      ele.style.left = left + 'px'
      ele.style.padding = '0 10px'
      ele.style.background = '#fff'
      ele.style.lineHeight = '22px'
      ele.style.fontSize = '12px'
      ele.style.color = '#999'
      ele.style.borderRadius = '4px'
      ele.style.zIndex = '999'
      ele.innerHTML = text
      document.body.appendChild(ele)
    } else {
      let ele: HTMLElement = <HTMLElement>document.querySelector('#areaTip')
      ele.style.top = top + 'px'
      ele.style.left = left + 'px'
      ele.innerHTML = text
    }

    if (!this.center.length) return
    let point = this.L.latLng([e.latlng.lat, e.latlng.lng])
    this.radius = this.L.latLng(this.center).distanceTo(point) - 1
    if (this.circle) this.zmap.removeLayer(this.circle)
    this.circle = this.L.circle(this.center, {
      radius: this.radius,
      color: this.circleStyles[this.zmapLayer].color,
      weight: 2,
      dashArray: [5, 10],
      fillColor: this.circleStyles[this.zmapLayer].fillColor,
      fillOpacity: this.circleStyles[this.zmapLayer].fillOpacity
    })
    this.circle.addTo(this.zmap)
  }

  private clickEvent = (e: any) => {
    if (this.endPoint.length) return
    if (!this.center.length)
      this.center = [e.latlng.lat, e.latlng.lng]
    else {
      this.endPoint = [e.latlng.lat, e.latlng.lng]
      this.zmap.off('mousemove', this.mouseMoveEvent)
      this.drawFinished(this.center, this.radius)

      let ele = document.querySelector('#areaTip')
      if (ele) ele.innerHTML = '右键点击重新圈选区域'
      setTimeout(() => {
        if (ele) document.body.removeChild(ele)
      }, 2000)
    }
  }

  private contextmenuEvent = (e: any) => {
    this.redrawCircle()
    this.center = []
    if (this.circle) this.zmap.removeLayer(this.circle)
    this.endPoint = []
    this.circle = null
    this.zmap.on('mousemove', this.mouseMoveEvent)
  }

  public removeArea = () => {
    this.zmap.off('click', this.clickEvent)
    this.zmap.off('contextmenu', this.contextmenuEvent)
    this.zmap.off('mousemove', this.mouseMoveEvent)
    let ele = document.querySelector('#areaTip')
    if (ele) document.body.removeChild(ele)
    if (this.circle) this.zmap.removeLayer(this.circle)
  }
}