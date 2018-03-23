import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './Measure.html?style=./Measure.scss'
import { Helper } from '../../../util/Helper'

let drawEntityArray: any[] = []

@WithRender
@Component
export default class Measure extends Vue {
  @Prop() closeFunc

  drawTool: any[] = [
    { key: 'circle', text: '圆形' },
    { key: 'rect', text: '矩形' },
    { key: 'polygon', text: '多边形' },
    { key: 'cancel', text: '撤消' },
    { key: 'delete', text: '删除' }
  ]
  drawHelper: any = undefined

  measureTool(key) {
    let helper = new Helper()
    if (key === 'cancel') {
      if(!drawEntityArray.length) return
      let rmEntity = drawEntityArray.pop()
      helper.removeEntity(rmEntity.text)
      helper.removeCollection(rmEntity.entity)
    } else if (key === 'delete') {
      this.clearAllEntity()
    } else {
      if (this.drawHelper)
        this.drawHelper.stopDrawing()

      this.drawHelper = helper.startDrawing(key, true, (entity) => {
        let text = null
        if (key === 'circle') {
          let center = entity.getCenter()
            center = helper.getCoorFromCtn3(center)
          let r = entity.getRadius()
          let area = (3.141592653 * r * r).toFixed(2)
          text = helper.addTLabel('面积：' + comdify(area) + '平方米', center, 0.5)
        } else if (key === 'rect') {
          let extent = entity.getExtent(),
            bound: any = {};
          ['east', 'west', 'south', 'north'].forEach(attr => {
            if(extent.hasOwnProperty(attr))
              bound[attr] = helper.convertRadianToDegrees(extent[attr]);
          })
          let center = [(bound.east + bound.west) / 2, (bound.north + bound.south) / 2]
          let pos = [
            { lon: bound.west, lat: bound.north }, 
            { lon: bound.west, lat: bound.south }, 
            { lon: bound.east, lat: bound.south }, 
            { lon: bound.east, lat: bound.north }
          ]
          let area = Zearth.computeArea(pos).toFixed(2)
          text = helper.addTLabel('面积：' + comdify(area) + '平方米', center, 0.5)
        } else if (key === 'polygon') {
          let positions = entity.getPositions()
          let pos = []
          let cLon = 0, cLat = 0
          for(let point of positions) {
            let p = helper.getCoorFromCtn3(point)
            pos.push({ lon: p[0], lat: p[1] })
            cLon += p[0]
            cLat += p[1]
          }
          let pLength = positions.length
          cLon = cLon / pLength
          cLat = cLat /pLength
          let area = Zearth.computeArea(pos).toFixed(2)
          text = helper.addTLabel('面积：' + comdify(area) + '平方米', [cLon, cLat], 0.5)
        }
        drawEntityArray.push({ entity, text })
        this.drawHelper = undefined
      })
    }
  }

  clearAllEntity() {
    if (!drawEntityArray.length) return
    let helper = new Helper()
    for (let opt of drawEntityArray) {
      helper.removeEntity(opt.text)
      helper.removeCollection(opt.entity)
    }
    drawEntityArray = []
    helper = null
  }

  beforeDestroy() {
    this.clearAllEntity()
  }
}

const comdify = num => {
  return num.replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) {
    return s1.replace(/\d{1,3}(?=(\d{3})+$)/g, "$&,") + s2
  })
}