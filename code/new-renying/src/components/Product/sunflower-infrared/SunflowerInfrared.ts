import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './SunflowerInfrared.html?style=./SunflowerInfrared.scss'
import * as CONFIG from '../../../config/productId'
import moment from 'moment'

@WithRender
@Component
export default class SunflowerInfrared extends Vue {
  @Action('systemStore/toggleProductView_global') toggleProductView_global

  moment: any = moment
  productId: string = CONFIG.sunflower
  imgUrl: string = ''
  timeRange: any[] = [moment().subtract(24, 'hours'), moment().subtract(1, 'hours')]   //初始化两小时前到一小时前
  dateRange: any[] = [0, 0]
  firstDate: string = moment().subtract(4, 'days').format('YYYY/MM/DD 00:00:00')
  totalRangeNum: number = 0                     // 格子个数
  productSelected: string = 'inf_bw'            //产品类型
  unitSelected: number = 1           //
  productTime: Date = null           //当前选中格子时间
  timeIndexSelected: number = 1       //当前选中格子下标
  productOpt = {
    inf_bw: '红外灰度图',
    inf_col:'红外彩图',
    vap_bw: '水汽灰度图',
    vis_3ch: '可见光3通道彩图',
    vis_col: '可见光彩图',
    vis_bw: '可见光灰度图',
  }
  intervalHolder: any = null

  mounted() {
    let nextTime = Date.now() - Date.now() % (60*60*1000) - 60*60*1000
    let prevTime = nextTime - 24*60*60*1000
    this.timeRange = [new Date(prevTime), new Date(nextTime)]
    let tomorrow = moment().add(1, 'days').format('YYYY/MM/DD 00:00:00')  
    let hour = (new Date(tomorrow).getTime() - new Date(nextTime).getTime()) / (60*60*1000)
    this.dateRange = [96 - hour, 120 - hour]
    this.timeChanged()
  }

  changeUrl(product, time) {
    let url = `http://10.148.16.217:11160/renyin5/satelite/img/hm8?area=China&product=${product}&time=${time}`
    let img = new Image()
    img.onload = () => this.imgUrl = url
    img.onerror = () => this.imgUrl = 'static/img/nopic.png'
    img.src = url
  }

  @Watch('productSelected')
  onProductSelectedChange(val, oldVal){
    this.changeUrl(val, moment(this.productTime).format('YYYY-MM-DD HH:mm:00'))
  }

  // 更改时间范围
  timeChanged() {
    let prog = <HTMLDivElement>this.$refs.progress
    let inner = <HTMLDivElement>this.$refs.progressInner
    this.$nextTick(() => {
      prog.scrollTop = inner.offsetHeight
    })
    this.productTime = new Date(this.timeRange[1] - this.timeRange[1]%(10*60*1000))
    this.changeUrl(this.productSelected, moment(this.productTime).format('YYYY-MM-DD HH:mm:00'))
    this.totalRangeNum = (new Date(this.timeRange[1] - this.timeRange[1]%(10*60*1000)).getTime() - new Date(this.timeRange[0] - this.timeRange[0]%(10*60*1000)).getTime()) / (10*60*1000) + 1
    this.timeIndexSelected = this.totalRangeNum
  }

  toggleProTime(index) {
    this.timeIndexSelected = index
    let time = moment(new Date(this.timeRange[0] - this.timeRange[0]%(10*60*1000))).add((index - 1) * 10, 'minutes')
    this.productTime = new Date(time)
    this.changeUrl(this.productSelected, moment(this.productTime).format('YYYY-MM-DD HH:mm:00'))
  }
  

  goBack() {
    if (this.timeIndexSelected === 1) {
      this.timeIndexSelected = this.totalRangeNum + 1
      let prog = <HTMLDivElement>this.$refs.progress
      let inner = <HTMLDivElement>this.$refs.progressInner
      prog.scrollTop = inner.offsetHeight
    }
    this.timeIndexSelected--
    this.productTime = new Date(moment(this.productTime).subtract(10, 'minutes'))
    this.changeUrl(this.productSelected, moment(this.productTime).format('YYYY-MM-DD HH:mm:00'))
    if(this.intervalHolder) this.play()
  }
  
  goNext() {
    if (this.timeIndexSelected === this.totalRangeNum) {
      this.timeIndexSelected = 0;
      let prog = <HTMLDivElement>this.$refs.progress
      prog.scrollTop = 0
    }
    this.timeIndexSelected++
    this.productTime = new Date(moment(this.productTime).add(10, 'minutes'))
    this.changeUrl(this.productSelected, moment(this.productTime).format('YYYY-MM-DD HH:mm:00'))
    if(this.intervalHolder) this.play()
  }

  @Watch('unitSelected')
  onunitSelectedchanged(val, oldVal) {
    if (this.intervalHolder) {
      this.play()
      setTimeout(this.play, 0)
    }
  }

  play() {
    if (!this.intervalHolder) {
      this.intervalHolder = setInterval(() => {
        let prog = <HTMLDivElement>this.$refs.progress
        if(this.timeIndexSelected === this.totalRangeNum) {
          prog.scrollTop = 0
          this.timeIndexSelected= 1
          this.productTime = new Date(this.timeRange[0] - this.timeRange[0]%(10*60*1000))
        } else {
<<<<<<< HEAD
          let remainder = this.timeIndexSelected / 34
=======
          let remainder = this.timeIndexSelected / 30
>>>>>>> 1a54b112ec892171861ecd06da6f314dee46cd7a
          if (remainder % 1 === 0) {
            let inner = <HTMLDivElement>this.$refs.progressInner
            prog.scrollTop = inner.offsetHeight
            let innerHeight = prog.scrollTop
<<<<<<< HEAD
            prog.scrollTop = innerHeight / (this.totalRangeNum - 34) * 34*remainder
=======
            prog.scrollTop = innerHeight / (this.totalRangeNum - 31) * 30 * remainder
>>>>>>> 1a54b112ec892171861ecd06da6f314dee46cd7a
          }
          this.timeIndexSelected++
          this.productTime = new Date(moment(this.productTime).add(10, 'minutes'))
        }
        this.changeUrl(this.productSelected, moment(this.productTime).format('YYYY-MM-DD HH:mm:00'))
      }, 1000/this.unitSelected)
    } else {
      clearInterval(this.intervalHolder)
      this.intervalHolder = null
    }
  }

  formatTooltip(key) {
    let time = moment(this.firstDate).add(key, 'hours').format('YYYY-MM-DD HH时')
    return time
  }

  dateChanged() {
    let prevDate = moment(this.firstDate).add(this.dateRange[0], 'hours')
    let nextDate = moment(this.firstDate).add(this.dateRange[1], 'hours')
    this.timeRange = [prevDate, nextDate]
    this.timeChanged()
  }
 
  goPrevDate() {
    let prevDate = moment(this.timeRange[0]).subtract(1, 'days')
    let nextDate = moment(this.timeRange[1]).subtract(1, 'days')
    this.timeRange = [prevDate, nextDate]
    this.timeChanged()
    this.firstDate = moment(this.firstDate).subtract(1, 'days').format('YYYY/MM/DD 00:00:00')
  }

  goNextDate() {
    let tomorrow = moment().add(1, 'days').format('YYYY/MM/DD 00:00:00')
    let nextDate = moment(this.timeRange[1]).add(1, 'days')
    if (new Date(nextDate).getTime() > new Date(tomorrow).getTime()) {
      Vue.prototype['$message']({
        type: 'warning',
        message: '时间不能超过当前天'
      })
    } else {
      let prevDate = moment(this.timeRange[0]).add(1, 'days')
      this.timeRange = [prevDate, nextDate]
      this.timeChanged()
      this.firstDate = moment(this.firstDate).add(1, 'days').format('YYYY/MM/DD 00:00:00')
    }
  }
}