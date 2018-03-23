<template>
  <main id="WindWarning">

  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { geoClient, userThresholdsClient, productClient } from '../../util/clientHelper'
  import moment from 'moment'

  let stationInfo = {},
      polygons: any[] = [],
      notify: any = null,
      closePopupInfo: any = {     // 手动关闭弹窗数据
        level: 0,
        time: null
      },
      L: any = null,
      zmap: any = null
  const fillColor = {
    1: '#ff0',
    2: '#ffa500',
    3: '#f00'
  }

  @Component
  export default class WindWarning extends Vue {
    @Getter('systemStore/resetThresholdp_global') resetThresholdp_global: any
    thresholds: any[] = []
    intervalHolder: any = null

    async mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      await this.getThresholds()
      await this.getStationInfo()
      this.getStationData()
      this.intervalHolder = setInterval(this.getStationData, 5*60*1000)
    }

    beforeDestroy() {
      clearInterval(this.intervalHolder)
      this.intervalHolder = null
      stationInfo = {}
      polygons = []
      if (notify) {
        notify.close()
        notify = null
      }
      L = null
      zmap = null
    }

    // 获取阈值
    async getThresholds() {
      let userid = sessionStorage.userId
      let res = await userThresholdsClient.getWindThresholds(userid)
      // res = [
      //   { id: 1, level: 1, station_number: 20, average_wind: 1, strong_win: null },
      //   { id: 2, level: 2, station_number: 10, average_wind: null, strong_win: 1 },
      //   { id: 3, level: 3, station_number: 10, average_wind: 1, strong_win: 0.9 },
      // ]
      if (res) {
        res.sort((a, b) => a.level < b.level)
        this.thresholds = res
      }
    }

    // 获取当前分区 区域站信息
    async getStationInfo() {
      let city = sessionStorage.cityid != 0 ? sessionStorage.cityName : ''
      let res = await productClient.findStationInfo('b', city)
      if (res) {
        for (let item of res) {
          if (sessionStorage.countyId != 0) {     // 获取指定区县站点
            let reg = new RegExp(item.location.county)
            if (reg.test(sessionStorage.countyName))
              stationInfo[item.station_id] = item
          } else {
            stationInfo[item.station_id] = item
          }
        }
      }
    }

    // 获取区域站站点数据
    async getStationData() {
      for (let i in stationInfo) {
        stationInfo[i].datetime = null
        stationInfo[i].elems = null
      }
      let time: any = Date.now() - Date.now()%(5*60*1000) - 10*60*1000
      let datetime = moment(time).format('YYYY-MM-DD HH:mm:00')
      let city = sessionStorage.cityid != 0 ? sessionStorage.cityName : ''
      let res = await productClient.findStationData('b', datetime, city)
      if (!res || !res.length) return
      for (let opt of res) {
        let id = opt.id
        if (stationInfo[id]) {
          stationInfo[id].datetime = opt.datetime
          stationInfo[id].elems = opt.elems
        }
      }
      console.log(stationInfo)
      this.judgeWarning(time)
    }

    // 判定是否存在预警
    judgeWarning(datetime) {
      if (!this.thresholds.length) return
      for (let el of this.thresholds) {
        let stationNumber = 0
        for (let i in stationInfo) {
          let elems = stationInfo[i].elems
          if (!elems) continue
          let flag = false
          if (el.average_wind && el.strong_win) {
            if (elems.wd2df > el.average_wind && elems.wd10maxdf > el.strong_win) flag = true
          } else if (el.average_wind) {
            if (elems.wd2df > el.average_wind) flag = true
          } else if (el.strong_win) {
            if (elems.wd10maxdf > el.strong_win) flag = true
          }
          if (flag) stationNumber++
        }
        if (stationNumber > el.station_number) {
          if (closePopupInfo.level >= el.level  && closePopupInfo.time + 2*60*60*1000 > datetime) break     // 手动关闭 2小时内 预警等级不提升 不重复报警
          if (notify) {
            notify.close()
            notify = null
          }
          let time = moment(datetime).format('YYYY年MM月DD日 HH时mm分')
          let string = time + ': ' + el.station_number + '个站点'
          if (el.average_wind && el.strong_win) string += '平均风超过' + el.average_wind + 'm/s且最大风超过' + el.strong_win + 'm/s'
          else if (el.average_wind) string += '平均风超过' + el.average_wind + 'm/s'
          else if (el.strong_win) string += '最大风超过' + el.strong_win + 'm/s'
          notify = Vue['prototype']['$notify']({
            title: '大风' + el.level + '级预警',
            message: string,
            type: 'warning',
            duration: 0,
            offset: 110,
            onClose: () => {
              closePopupInfo.time = Date.now()
              closePopupInfo.level = el.level
              this.clearLayer()
            }
          })
          this.drawBoundary(el.level)
          break
        }
      }
    }

    async drawBoundary(level) {
      this.clearLayer()
      if (!polygons.length) {
        if (sessionStorage.countyId != 0) {
          let data = await this.getBoundary()
          if (!data) return
          let bound = data.boundary
          for (let opt of bound) {
            let latlngs: any[] = []
            for (let el of opt)
              latlngs.push([el.y, el.x])
            let polygon = L.polygon(latlngs, { stroke: false, fillColor: fillColor[level] })
            polygon.id = 'alarmlayer'
            polygon.addTo(zmap)
            polygons.push(polygon)
          }
        } else {
          let data = await this.getBoundary()
          if (!data) return
          let bound = JSON.parse(data.bound)
          for (let opt of bound) {
            let latlngs: any[] = []
            for (let el of opt)
              latlngs.push([el[1], el[0]])
            let polygon = L.polygon(latlngs, { stroke: false, fillColor: fillColor[level] })
            polygon.id = 'alarmlayer'
            polygon.addTo(zmap)
            polygons.push(polygon)
          }
        }
      } else {
        for (let polygon of polygons) {
          polygon.setStyle({ fillColor: fillColor[level] })
          polygon.addTo(zmap)
        }
      }
    }

    async getBoundary() {
      let data
      if (sessionStorage.countyId != 0)
        data = await geoClient.findCounty(sessionStorage.countyId)
      else if (sessionStorage.cityid != 0)
        data = await geoClient.findCity(sessionStorage.cityid)
      else
        data = await geoClient.getProv()
      if (data) return data
      else return false
    }

    clearLayer() {
      zmap.eachLayer(e => {
        if (e.id === 'alarmlayer')
          zmap.removeLayer(e)
      })
    }

    @Watch('resetThresholdp_global.WindWarning')
    onWindWarningChanged (val: boolean, oldVal: boolean) {
      this.getThresholds()
    }
  }
</script>

<style lang='scss' scoped>
#WindWarning {

}
</style>
