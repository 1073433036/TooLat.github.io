import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ThunderMonitor.html?style=./ThunderMonitor.scss'
import moment from 'moment'
import { Helper } from "../../../util/Helper";
import fetchJsonp from "fetch-jsonp";
import { MeteoMonitor } from '../../../util/MeteoMonitor'

let imageLayer = {
  // tracking: null,
  radar: null,
  lightning: null,
}

let datetimeChangeDaley: any = null

@WithRender
@Component
export default class ThunderMonitor extends Vue {
  @Action('systemStore/changeWeatherEleTime_global') changeWeatherEleTime_global
  @Getter('systemStore/trackingDatetime_global') trackingDatetime_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Action('systemStore/toggleProgBar_global') toggleProgBar_global
  @Action('systemStore/changeProgBarElement_global') changeProgBarElement_global
  @Action('systemStore/toggleTrackingResult_global') toggleTrackingResult_global

  isComponentAlive: boolean = true
  left: number = 108.5
  right: number = 118.99
  top: number = 27
  bottom: number = 18.2
  tracking: boolean = false
  radar: boolean = false
  lightning: boolean = false

  mounted() {
    this.tracking = true
  }
  destroyed() {
    this.isComponentAlive = false
    let helper = new Helper()
    for (let i in imageLayer) {
      if (imageLayer[i])
        helper.removeImgLayer(imageLayer[i])
    }
    helper = null
    if (this.radar) {
      this.removeColorBar()
      this.changeWeatherEleTime_global({ type: '雷达拼图' })
    }
    if (this.lightning) {
      this.changeWeatherEleTime_global({ type: '闪电' })
    }
    if(this.tracking) {
      this.changeProgBarElement_global(null)
      this.toggleProgBar_global(false)
      this.toggleTrackingResult_global(false)
    }
  }

  @Watch('trackingDatetime_global')
  async ontrackingDatetime_globalChanged(val: any, oldVal: any) {
    if (datetimeChangeDaley)
      clearTimeout(datetimeChangeDaley)
    datetimeChangeDaley = setTimeout(async () => {
      datetimeChangeDaley = null
      let helper = new Helper()
      // if (this.tracking) {
      //   if (imageLayer.tracking) {
      //     helper.removeImgLayer(imageLayer.tracking)
      //   }
      //   imageLayer.tracking = await this.addThunderImgLayer('tracking')
      // }
      if (this.radar) {
        // if (imageLayer.radar) {
        //   helper.removeImgLayer(imageLayer.radar)
        // }
        // imageLayer.radar = await this.addThunderImgLayer('radar')
        this.addCappiImgLayer()
      }
      if (this.lightning) this.addLightningLayer()
    }, 400)
  }
  @Watch('tracking')
  async ontrackingChanged(val: any, oldVal: any) {
    let ele = val ? 'tracking' : null
    this.changeProgBarElement_global(ele)
    this.toggleProgBar_global(val)
  }
  @Watch('radar')
  async onradarChanged(val: any, oldVal: any) {
    if (val) {
      // imageLayer.radar = await this.addThunderImgLayer('radar')
      this.addCappiImgLayer()
      this.addColorBar()
    }
    else {
      this.removeLayer('radar')
      this.removeColorBar()
      this.changeWeatherEleTime_global({ type: '雷达拼图' })
    }
      
  }
  @Watch('lightning')
  async onthunderChanged(val: any, oldVal: any) {
    if(val)
      this.addLightningLayer()
    else {
      this.removeLayer('lightning')
      this.changeWeatherEleTime_global({ type: '闪电' })
    }
  }


  selectOption(type: 'tracking' | 'radar' | 'lightning') {
    if (type == 'tracking') {
      this.tracking = !this.tracking
      if(!this.tracking) this.toggleTrackingResult_global(false)
    }
    if (type === 'radar')
      this.radar = !this.radar
    if (type === 'lightning')
      this.lightning = !this.lightning
  }
  removeLayer(type: string) {
    let helper = new Helper()
    if (imageLayer[type]) {
      helper.removeImgLayer(imageLayer[type])
    }
    helper = null
    imageLayer[type] = null
  }

  // 雷达拼图
  async addCappiImgLayer() {
    let _meteo = new MeteoMonitor;
    let helper = new Helper()
    let time: any = new Date(this.trackingDatetime_global);
    let minute = time.getMinutes();
    time = time.getTime() - minute % 6 * 60000;
    time = moment(time).format('YYYY-MM-DD HH:mm:00');
    _meteo.getCappiProduct(time)
      .then((layer: any) => {
        if (imageLayer.radar)
          helper.removeImgLayer(imageLayer.radar)
        if (this.radar && this.isComponentAlive) {
          imageLayer.radar = helper.addImgLayer(layer.imgUrl, layer)
          this.changeWeatherEleTime_global({ type: '雷达拼图', time: layer.datetime, value: true })
        }
        else
          this.changeWeatherEleTime_global({ type: '雷达拼图' })
      })
      .catch(e => {
        let helper = new Helper()
        if (this.radar && imageLayer.radar)
          helper.removeImgLayer(imageLayer.radar)
        if (this.radar && this.isComponentAlive)
          this.changeWeatherEleTime_global({ type: '雷达拼图', time: e, value: false })
        else
          this.changeWeatherEleTime_global({ type: '雷达拼图' })
      })
    _meteo = null
  }

  async addThunderImgLayer(type) {
    let helper = new Helper()
    let res: any = null,
      data: any = null
    try {
      res = await fetchJsonp(await this.getImgUrl(type), {
        jsonpCallbackFunction: 'png'
      })
    }
    catch (err) {
      let helper = new Helper()
      if (this.radar)
        helper.removeImgLayer(imageLayer.radar)
      // if (this.tracking)
      //   helper.removeImgLayer(imageLayer.tracking)
      this.toggleOprateTip_global({ tip: true, text: '当前时间没有数据' })
      throw 'database error'
    }
    data = await res.json()
    let binaryData: string = ''
    if (type === 'tracking')
      binaryData = data
    else if (type === 'radar') {
      data = JSON.parse(data)
      binaryData = 'data:image/png;base64,' + data[0].cappi
    }

    if (type === 'radar' && (!this.radar || !this.isComponentAlive)) return
    let imageLayerTemp = helper.addImgLayer(binaryData, {
      top: this.top,
      bottom: this.bottom,
      right: this.right,
      left: this.left
    })
    this.addColorBar()
    helper = null
    return imageLayerTemp
  }
  async getImgUrl(type) {
    if (type === 'radar') {
      let momentIsd = moment(this.trackingDatetime_global)
      let startTime = momentIsd.format('YYYY-MM-DD HH:mm:00')
      let endTime = momentIsd.subtract(1, 'days').format('YYYY-MM-DD HH:mm:00')
      let availableRes = await fetchJsonp(`http://10.148.10.80:8111/grid/swanquery/cappi/${endTime},${startTime},3/JSONP/`)
      let availableData: [{ datetime: string }] = await availableRes.json()
      let pngDateTimeString = ''
      let nowDate = new Date(startTime)
      if (nowDate > new Date(availableData[0].datetime))
        pngDateTimeString = availableData[0].datetime
      else {
        availableData.forEach((el, index) => {
          if (nowDate < new Date(el.datetime)) {
            pngDateTimeString = el.datetime
            return
          }
        })
      }

      return `http://10.148.10.80:8111/grid/swan/cappi/${pngDateTimeString},3/JSONP/png/${this.left},${this.right},${this.top},${this.bottom},2000,2000/color?cache=${new Date().getTime()}`
    }
  }
  addLightningLayer() {
    let time:any = new Date(this.trackingDatetime_global).getTime()
    time -= time % (6*60*1000) 
    let startdatetime = moment(time).subtract(6, 'minutes').format('YYYY-MM-DD HH:mm:00')
    let enddatetime = moment(time).format('YYYY-MM-DD HH:mm:00')
    let url = `http://10.148.10.80:8111/discrete/lightning/pe1/1;0,${startdatetime},${enddatetime},${this.left},${this.right},${this.top},${this.bottom},2000,1000/JSONP/image/cache`
    console.log(url)
    let image = new Image()
    image.onload = () => {
      setTimeout(() => {
        this.removeLayer('lightning')
      }, 100)
      let helper = new Helper
      if (!this.lightning || !this.isComponentAlive) {
        this.changeWeatherEleTime_global({ type: '闪电' })
        return
      }
      imageLayer.lightning = helper.addImgLayer(url, {
        top: this.top,
        bottom: this.bottom,
        right: this.right,
        left: this.left
      })
      this.changeWeatherEleTime_global({ type: '闪电', time: enddatetime, value: true })
      helper = null
    }
    image.onerror = () => {
      this.removeLayer('lightning')
      if (this.radar && this.isComponentAlive)
        this.changeWeatherEleTime_global({ type: '闪电', time: enddatetime, value: false })
      else
        this.changeWeatherEleTime_global({ type: '闪电' })
    }
    image.src = url
  }

  addColorBar() {
    let barEl;
    if(!document.getElementById('colorBar')) {
      barEl = document.createElement('div');
      barEl.id = 'colorBar';
      barEl.style.position = 'absolute';
      barEl.style.top = 'calc(42% - 150px)';
      barEl.style.left = '20px';
      barEl.style.width = '45px';
      barEl.style.height = '310px';
      barEl.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      barEl.style.backgroundPosition = 'center';
      barEl.style.backgroundRepeat = 'no-repeat';
    } else {
      barEl = document.getElementById('colorBar');
    }
    barEl.style.backgroundImage = 'url(http://10.148.10.80:8111/discrete/colortable/pic/radar,35,300,2,1/JSONP/cache)';
    document.body.appendChild(barEl);
  }
  removeColorBar() {
    let barEl = document.getElementById('colorBar');
    if(barEl) document.body.removeChild(barEl);
  }

}