import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ColorTableIndicator.html?style=./ColorTableIndicator.scss'
import { typhEleData, elementUnit } from "../../../config/grapesConfig";
import fetchJsonp from "fetch-jsonp"

@WithRender
@Component
export default class ColorTableIndicator extends Vue {
  @Getter('modelStore/colorTableToAdd_global') colorTableToAdd_global
  @Getter('modelStore/colorTableToDelete_global') colorTableToDelete_global
  @Getter('systemStore/typhTimelineStatus_global') typhTimelineStatus_global
  @Action('systemStore/toggleIsColorIndicatorDisplay_global') toggleIsColorIndicatorDisplay_global


  elementUnit = elementUnit
  colorData = []
  hasPages = 0
  pageSize = 6
  pageIndex = 0
  colorTableIndex = null
  colorTableData = []
  displayColorBarCategory = true
  modelColors = {
    torrent: {
      text: '山洪面雨量',
      unit: 'mm',
      data: [
        { value: 0.1, color: 'blue' },
        { value: 2.6, color: 'yellow' },
        { value: 8, color: 'orange' },
        { value: 16, color: 'red' },
      ]
    },
    waterlogging: {
      text: '道路积水',
      unit: 'mm',
      data: [
        { value: 0, color: 'chartreuse' },
        { value: 5, color: 'yellow' },
        { value: 15, color: 'red' }
      ]
    }
  }


  @Watch('colorTableToAdd_global')
  oncolorTableToAdd_globalChanged(val: any, oldVal: any): void {
    const excludeArr: any = ['tide', 'geology', 'fire', 'airpollution'];
    if (excludeArr.includes(val))
      return
    parseColorData.call(this, val)
      .then(() => {
        console.info('toggle color indicator')
        if (this.colorTableData.length > 0) {
          this.toggleIsColorIndicatorDisplay_global(true)
        } else {
          this.toggleIsColorIndicatorDisplay_global(false)
        }
      })
    /*.catch(() => {
      console.warn('此元素没有色表！')
    })*/
  }

  @Watch('colorTableToDelete_global')
  oncolorTableToDelete_globalChanged(val: any, oldVal: any): void {
    const excludeArr: any = ['tide', 'geology', 'fire', 'airpollution'];
    if (excludeArr.includes(val))
      return;
    this.colorTableData.forEach((item, i, arr) => {
      if (item.enName == val) {
        arr.splice(i, 1);
        this.colorTableIndex--;
        return;
      }
    })
    console.info('toggle color indicator display')
    if (this.colorTableData.length > 0) {
      this.toggleIsColorIndicatorDisplay_global(true)
    } else {
      this.toggleIsColorIndicatorDisplay_global(false)
    }
  }


  changeColorTable(index) {
    this.colorData = this.colorTableData[index].data;
    this.colorTableIndex = index;
    this.hasPages = this.colorTableData[index].data.length;
    // this.displayColorBarCategory = false;
  }
  pageGoUp() {
    if (this.pageIndex === 0) return
    this.pageIndex--
  }
  pageGoDown() {
    if (this.pageIndex == (this.hasPages - 1)) return
    this.pageIndex++
  }
  toggleColorBarCategory() {
    this.displayColorBarCategory = !this.displayColorBarCategory
  }

}


async function parseColorData(colorTable) {
  this.colorData = new Array()
  let colorTableCnName = null

  if (colorTable === 'torrent' || colorTable === 'waterlogging') {
    this.colorData.push(this.modelColors[colorTable].data);
    colorTableCnName = this.modelColors[colorTable].text;
  } else {
    let res,
      requstUrl = null,
      data;
    if (colorTable === 'tide_wind' || colorTable === 'tide_rain' || colorTable === 'tide') {
      let colorName = colorTable
      requstUrl = `http://10.148.83.228:9002/nc/jsonp/colortable?colorTable=${colorName.replace('tide_', '')}`
      if (colorTable === 'tide')
        requstUrl = `http://10.148.83.228:9002/nc/jsonp/colortable?colorTable=tide`
    } else {
      let colorTableTemp = null
      switch (colorTable) {
        case 't2mm':
          colorTableTemp = 'temp'; break
        case 'shum':
          colorTableTemp = 'rh'; break
        case 'omeg':
          colorTableTemp = 'surt'; break
        case 'lspe':
          colorTableTemp = 'rain'; break
        case 'cpre':
          colorTableTemp = 'rain'; break
        case 'wind10':
          colorTableTemp = 'wind'; break
        default: colorTableTemp = colorTable
      }
      requstUrl = `http://10.148.10.80:8111/discrete/colortable/value/${colorTableTemp}/JSONP/`
    }
    try {
      res = await fetchJsonp(requstUrl)
      res = await res.json()
    }
    catch (err) {
      throw 'error'
    }

    if (colorTable === 'tide_wind' || colorTable === 'tide_rain' || colorTable === 'tide') {
      data = res
      let pageSize = this.pageSize,
        index = 0,
        increate
      switch (colorTable) {
        case 'tide_rain': increate = 1; break
        case 'tide_wind': increate = 15; break
        case 'tide': increate = 20; break
        default: increate = 10
      }
      for (let i = 0; i < data.length; i += increate) {
        let indexFix = Math.floor(index / pageSize)
        if (!this.colorData[indexFix])
          this.colorData.push([])
        this.colorData[indexFix].push({
          value: Number(data[i].value) < 1 ? data[i].value : Number(data[i].value).toFixed(0),
          color: data[i].fill
        })
        index++
      }
    } else {
      data = res[0].ColorTable
      let pageDivide = Math.floor(data.length / this.pageSize)
      let index = 0
      data.forEach(el => {
        let colorArr,
          pageSize = this.pageSize
        for (let i in el) {
          let indexFix = Math.floor(index / pageSize)
          colorArr = el[i].split(',')
          if (!this.colorData[indexFix])
            this.colorData.push([])
          this.colorData[indexFix].push({
            value: Number(i) < 1 ? (Number(i) < 0 ? Number(i).toFixed(0) : i.substr(0, 3)) : Number(i).toFixed(0),
            color: `rgba(${colorArr[0]},${colorArr[1]},${colorArr[2]},${1/*colorArr[3] / 255*/})`
          })
          index += 1
        }
      })
    }
    for (let item of typhEleData) {
      if (item.value === colorTable) {
        colorTableCnName = item.text
        break
      }
    }
  }

  this.colorTableData.push({ enName: colorTable, cnName: colorTableCnName, data: this.colorData });
  this.colorTableIndex = this.colorTableData.length - 1;
  this.hasPages = this.colorData.length;
}
