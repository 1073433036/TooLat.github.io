// 测距
export class MeasureHelper {
  constructor(L, zmap, zmapLayer) {
    this.L = L
    this.zmap = zmap
    this.zmapLayer = zmapLayer
  }
  L: any
  zmap: any
  zmapLayer: 'satillite' | 'terrain' | 'business'
  points: any[] = []
  polylines: any[] = []
  distances: any[] = []
  divIcons: any[] = []
  movePolyline: any = null
  clickIndex: number = -1
  styles: any = {
    tianditu: { fontColor: '#f00', color: '#dd6c91', iconUrl: 'measure_circle.png' },
    satillite: { fontColor: '#fff', color: '#00bfdc', iconUrl: 'measure_circle_blue.png' },
    terrain: { fontColor: '#f00', color: '#dd6c91', iconUrl: 'measure_circle.png' },
    business: { fontColor: '#f00', color: '#dd6c91', iconUrl: 'measure_circle.png' }
  }

  toggleZmapLayer = layer => {
    this.zmapLayer = layer
    for (let el of this.points) {
      for (let item of el) {
        item.setIcon(this.L.icon({
          iconUrl: 'static/img/DecisionCommand/' + this.styles[this.zmapLayer].iconUrl, 
          iconSize: [10, 10],
          iconAnchor: [5, 5]
        }))
      }
    }
    for (let el of this.polylines) {
      for (let item of el) {
        item.setStyle({
          color: this.styles[this.zmapLayer].color
        })
      }
    }
    let distances: any = document.querySelectorAll('.distance-span')
    for (let i = 0; i < distances.length; i ++) {
      distances[i].style.color = this.styles[this.zmapLayer].fontColor
    }
    let divIcons: any = document.querySelectorAll('.distance-total-span')
    for (let i = 0; i < divIcons.length; i ++) {
      divIcons[i].style.color = this.styles[this.zmapLayer].fontColor
    }
  }

  startMeasure = () => {
    ++this.clickIndex
    this.points.push([])
    this.polylines.push([])
    this.distances.push([])
    this.divIcons.push([])
    this.zmap.on('mousemove', this.mouseMoveEvent)
    this.zmap.on('click', this.clickEvent)
    this.zmap.on('contextmenu', this.contextmenuEvent)
  }

  // 鼠标移动事件
  mouseMoveEvent = (e: any) => {
    let text = this.points[this.clickIndex].length ? '左键点击测量，右键点击结束测量' : '左键点击开始测量'
    let left = e.containerPoint.x + 10, top = e.containerPoint.y + 10
    if (!document.querySelector('#measureTip')) {
      let ele = document.createElement('div')
      ele.id = 'measureTip'
      ele.style.position = 'absolute'
      ele.style.top = top + 'px'
      ele.style.left = left + 'px'
      ele.style.padding = '0 10px'
      ele.style.minWidth = text.length * 12 + 'px'
      ele.style.background = '#fff'
      ele.style.lineHeight = '22px'
      ele.style.fontSize = '12px'
      ele.style.color = '#999'
      ele.style.borderRadius = '4px'
      ele.style.zIndex = '999'
      ele.innerHTML = text
      document.body.appendChild(ele)
    } else {
      let ele: HTMLElement = <HTMLElement>document.querySelector('#measureTip')
      ele.style.top = top + 'px'
      ele.style.left = left + 'px'
      ele.style.minWidth = text.length * 12 + 'px'
      ele.innerHTML = text
    }
    if (this.points[this.clickIndex].length) {
      if (this.movePolyline) this.zmap.removeLayer(this.movePolyline)
      let lastPoint = this.points[this.clickIndex][this.points[this.clickIndex].length - 1]
      let lat = e.latlng.lat, lng = e.latlng.lng
      let lastPointLatLng = lastPoint.getLatLng()
      this.movePolyline = this.L.polyline([[lastPointLatLng.lat, lastPointLatLng.lng], [lat, lng]], {
        color: this.styles[this.zmapLayer].color, 
        weight: 2, 
        dashArray: '4, 5', 
        dashOffset: '2',
      })
      this.movePolyline.addTo(this.zmap)
    }
  }

  // 左键点击事件
  clickEvent = (e: any) => {
    if (!this.points[this.clickIndex].length) {        // 第一个点
      this.addPoint(e)
    } else {
      let lastPoint = this.points[this.clickIndex][this.points[this.clickIndex].length - 1]
      let point = this.addPoint(e)
      this.addPolylineLabel(lastPoint, point)
    }
  }

  // 右键点击事件
  contextmenuEvent = (e: any) => {
    if (!this.points[this.clickIndex].length) return
    this.zmap.off('click', this.clickEvent)
    this.zmap.off('mousemove', this.mouseMoveEvent)
    let ele = document.querySelector('#measureTip')
    if (ele) document.body.removeChild(ele)
      
    let lastPoint = this.points[this.clickIndex][this.points[this.clickIndex].length - 1]
    let lastPointLatLng = lastPoint.getLatLng()

    // 距离总计
    if (this.points[this.clickIndex].length > 2) {
      const opts = this.L.divIcon({
        className: 'lastDivIcon',
        html: `
          <div style="position:absolute;padding:6px">
            <span class="distance-total-span" style="display: inline-block; white-space: nowrap; color: ${this.styles[this.zmapLayer].fontColor};">
              总计：${eval(this.distances[this.clickIndex].join('+')).toFixed(2)}公里
            </span>
          </div>
        `
      });
      let divIcon = this.L.marker([lastPointLatLng.lat, lastPointLatLng.lng], { icon: opts })
      divIcon.id = 'lastDivIcon'
      divIcon.addTo(this.zmap)
    }

    if (this.movePolyline) {
      this.zmap.removeLayer(this.movePolyline)
      this.movePolyline = null
    }

    this.zmap.off('contextmenu', this.contextmenuEvent)

    setTimeout(() => {
      this.startMeasure()
    }, 0)
  }

  // 添加点
  addPoint = (e: any) => {
    let marker = this.L.marker([e.latlng.lat, e.latlng.lng], {
      icon: this.L.icon({
        iconUrl: 'static/img/DecisionCommand/' + this.styles[this.zmapLayer].iconUrl, 
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      })
    })
    this.points[this.clickIndex].push(marker)
    marker.id = 'measurePoint'
    marker.addTo(this.zmap)
    return marker
  }

  // 添加连线 距离div
  addPolylineLabel = (lastPoint: any, point: any) => {
    // polyline
    let lastPointLatLng = lastPoint.getLatLng(),
        pointLatLng = point.getLatLng()
    let polyline = this.L.polyline([[lastPointLatLng.lat, lastPointLatLng.lng], [pointLatLng.lat, pointLatLng.lng]], {
      color: this.styles[this.zmapLayer].color, 
      weight: 2, 
      dashArray: '4, 5', 
      dashOffset: '2',
    })
    polyline.id = 'measurePolyline'
    polyline.addTo(this.zmap)
    this.polylines[this.clickIndex].push(polyline)
    // label
    let centerPoint = [(lastPointLatLng.lat + pointLatLng.lat) / 2, (lastPointLatLng.lng + pointLatLng.lng) / 2]
    let distance = this.L.latLng(lastPointLatLng.lat, lastPointLatLng.lng).distanceTo([pointLatLng.lat, pointLatLng.lng])
    distance = (distance / 1000).toFixed(2)
    this.distances[this.clickIndex].push(distance)
    const opts = this.L.divIcon({
      className: 'divIcon',
      html: `
        <div style="position:absolute;padding:6px">
          <span class="distance-span" style="display: inline-block; white-space: nowrap; color: ${this.styles[this.zmapLayer].fontColor};">
            ${distance}公里
          </span>
        </div>
      `
    });
    let divIcon = this.L.marker(centerPoint, { icon: opts })
    divIcon.id = 'measureDivIcon'
    divIcon.addTo(this.zmap)
    this.divIcons[this.clickIndex].push(divIcon)
  }

  removeMeasure = () => {
    this.clickIndex = -1
    this.zmap.off('click', this.clickEvent)
    this.zmap.off('contextmenu', this.contextmenuEvent)
    this.zmap.off('mousemove', this.mouseMoveEvent)
    let ele = document.querySelector('#measureTip')
    if (ele) document.body.removeChild(ele)
    if (this.movePolyline) {
      this.zmap.removeLayer(this.movePolyline)
      this.movePolyline = null
    }
    if (!this.points.length) return
    this.zmap.eachLayer((e: any) => {
      if (e.id === 'measurePoint' || e.id === 'measurePolyline' || e.id === 'measureDivIcon' || e.id === 'lastDivIcon')
      this.zmap.removeLayer(e)
    })
    this.points = []
    this.polylines = []
    this.distances = []
    this.divIcons = []
  }
}