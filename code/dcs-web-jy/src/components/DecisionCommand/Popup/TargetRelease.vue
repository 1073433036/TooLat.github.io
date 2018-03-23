<template>
  <main id="TargetRelease" class="decision-popup" v-drag v-if="isDrawFinished">
    <header>
      <span>数据统计</span>
      <a @click="isDrawFinished = false"></a>
    </header>
    <div class="content">
      <ul class="cf decision-chk-group">
        <li v-for="(el, key) in geoOpts" :key="key" :class="{on: el.isSelected}"
            @click="toggleOpt(key)">
          <em></em>
          <span>{{ el.name }} 数量：{{ el.count }}</span>
        </li>
      </ul>
      <div class="btn-wrapper cf">
        <div class="primary-btn clear" @click="toggleAllOpts">{{ allOptSelected ? '清空' : '全选' }}</div>
        <div class="primary-btn" @click="isPopupOn = !isPopupOn">靶向发布</div>
      </div>
    </div>

    <transition name="slide-fade">
      <div class="decision-popup release-popup" v-if="isPopupOn" v-drag>
        <header>
          <span>靶向发布</span>
          <a @click="isPopupOn = false"></a>
        </header>
        <div class="content">
          <textarea v-model="messageString" placeholder="请填写说明"></textarea>
          <div class="primary-btn release-btn" @click="release">发布</div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { geoConf } from '@/config/geographyConf'
  import { DrawAreaHelper } from '@/util/DrawAreaHelper'
  import { assistClient, releaseClient } from '@/util/ClientHelper'
  import Vacuate from '@/util/Vacuate'

  let L: any = null,
      zmap: any = null,
      vacuate: any = {},
      vacuateMarkers: any = {},
      markerSelected: any = null,
      geoOptsDetail: any = {}   // 各类型底下具体信息

  @Component
  export default class TargetRelease extends Vue {
    @Getter('decisionStore/region_global') region_global
    @Getter('decisionStore/zmapLayer_global') zmapLayer_global
    @Getter('decisionStore/popupStatus_global') popupStatus_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storedetailNameInfo_global') storedetailNameInfo_global
    @Action('decisionStore/storeGeoDetailInfo_global') storeGeoDetailInfo_global
    @Action('decisionStore/storeGeoDetailPoint_global') storeGeoDetailPoint_global
    @Action('decisionStore/storeGeoDetailType_global') storeGeoDetailType_global

    drawAreaHelper: any = null
    isDrawFinished: boolean = false
    geoOpts: any = {}
    isPopupOn: boolean = false
    messageString: string = ''
    get allOptSelected() {
      // let flag = false
      // for (let i in this.geoOpts) {
      //   if (this.geoOpts[i].isSelected) {
      //     flag = true
      //     break
      //   }
      // }
      // return flag
      let arr: boolean[] = []
      for (let i in this.geoOpts)
        arr.push(this.geoOpts[i].isSelected)
      return !arr.includes(false)
    }
    center: number[] = []
    radius: number = 0
    listener: any = {}

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      zmap.on('moveend', this.mapMoveendFunction)

      this.drawAreaHelper = new DrawAreaHelper(L, zmap, this.zmapLayer_global, this.drawFinished, this.redrawCircle)
      this.drawAreaHelper.startDrawArea()

      let obj = {}
      let geography: any = geoConf.elements.find(el => el.key === 'geography')
      geography = JSON.parse(JSON.stringify(geography))
      for (let el of geography.sub) {
        obj[geography.key + '_' + el.key] = Object.assign(el, { count: 0, isSelected: true })
        geoOptsDetail[geography.key + '_' + el.key] = []
      }
      obj['material'] = { name: '物资信息', count: 0, isSelected: true }
      obj['rescueteam'] = { name: '救援队伍', count: 0, isSelected: true }
      geoOptsDetail['material'] = []
      geoOptsDetail['rescueteam'] = []
      this.geoOpts = { ...obj }
    }

    beforeDestroy() {
      zmap.off('moveend', this.mapMoveendFunction)
      this.clearArea()
      this.removeAllPois()
      this.storePopupStatus_global({ key: 'geographyDetail', action: false })
      L = null
      zmap = null
    }

    mapMoveendFunction() {
      this.storePopupStatus_global({ key: 'detailName', action: false })
    }

    // 清除圈选圆形
    clearArea() {
      if (!this.drawAreaHelper) return
      this.drawAreaHelper.removeArea()
      this.drawAreaHelper = null
    }

    @Watch('zmapLayer_global')
    onzmapLayer_globalChanged (val: string, oldVal: string) {
      this.drawAreaHelper && this.drawAreaHelper.toggleZmapLayer(val)
    }

    // 圈选完成时执行
    async drawFinished(center, radius) {
      this.center = center
      this.radius = radius
      await this.addAllPois()
      this.isDrawFinished = true
    }

    // 重新圈选时执行
    redrawCircle() {
      this.removeAllPois()
      this.isDrawFinished = false
      this.isPopupOn = false
    }

    // 添加所有类型的基础信息点
    async addAllPois() {
      // 清空数据统计
      for (let i in this.geoOpts) {
        this.geoOpts[i].count = 0
        this.geoOpts[i].isSelected = true
      }

      for (let i in geoOptsDetail) {
        geoOptsDetail[i] = []
      }

      for (let el of geoConf.elements as any) {
        for (let opt of el.sub as any) {
          this.clearPois(el.key + '_' + opt.key)

          let type, category
          if ('type' in opt) type = opt.type
          else {
            type = el.type
            category = opt.name
          }

          let res
          if (opt.key === 'service')     // 气象服务站
            res = await assistClient.findServicePoi()
          else if (opt.key === 'building')      // 施工隐患点
            res = await assistClient.findBuildingPoi()
          else
            res = await assistClient.findAssistplace(type, this.region_global.cityId, category)
          if (!res) {
            Vue['prototype']['$message']({ type: 'error', message: '数据获取失败' })
            return
          }

          let msg: any[] = []       // 排除不在圈选范围内数据
          for (let item of res) {
            let distance = L.latLng(item.lat, item.lon).distanceTo(L.latLng(this.center[0], this.center[1]))
            if (distance <= this.radius) msg.push(item)
          }

          for (let item of msg) {
            if (opt.key === 'service') {
              let nameArr = item.station.split('(')
              item._name = nameArr[0]
            }
            else if (opt.key === 'building')
              item._name = item.name
            else {
              let nameArr = item.name.split('-')
              item._name = nameArr[nameArr.length - 1]
            }
            item._type = el.key
            item._subType = opt.key
            item.latlon = item.lon.toFixed(2) + (item.lon >= 0 ? '°E' : '°W') + ', ' + item.lat.toFixed(2) + (item.lat >= 0 ? '°N' : '°S')
          }

          //数据处理
          let data
          if (category) {     // 物资信息、救援队伍  
            if (type === 4) {     // 物资信息
              let dist = {}
              for (let item of msg) {
                let id = item.lon + '_' + item.lat
                if (!dist[id]) dist[id] = {}
                if (!dist[id][item.name]) dist[id][item.name] = { isSelected: false, sub: [] }
                dist[id][item.name].sub.push(item)
              }
              data = dist
            } else if (type === 5) {     // 救援队伍
              let dist = {}
              for (let item of msg) {
                let id = item.lon + '_' + item.lat
                if (!dist[id]) dist[id] = []
                dist[id].push(item)
              }
              data = dist
            }
          } else {           // 地理信息
            let dist = {}
            for (let el of msg) {
              dist[el.id] = el
            }
            data = dist
          }

          // 添加makrer
          let tmp: any[] = []
          let layerGroup: any = L.layerGroup()
          for (let i in data) {
            let item = data[i], point

            if (type === 4) {    // 物资信息
              let key = Object.keys(data[i])[0]
              point = data[i][key].sub[0]
            } else if (type === 5) {    // 救援队伍
              point = data[i][0]
            } else {
              point = data[i]
            }

            let marker = L.marker([point.lat, point.lon], {
              icon: L.icon({
                iconUrl: `static/img/DecisionCommand/geography/${'type' in opt ? opt.key : (el.key + '/' + opt.key)}.png`,
                iconSize: [22, 22],
                iconAnchor: [11, 11]
              })
            })
            marker.id = el.key + '_' + opt.key
            marker.on('mouseover', e => {
              let x = e.containerPoint.x,
                  y = e.containerPoint.y
              let dist = {
                name: point._name,
                pos: { x, y }
              }
              this.storedetailNameInfo_global(dist)
              this.storePopupStatus_global({ key: 'detailName', action: true })
            })
            marker.on('mouseout', e => {
              this.storePopupStatus_global({ key: 'detailName', action: false })
              this.storedetailNameInfo_global(null)
            })
            marker.on('click', e => {
              this.storePopupStatus_global({ key: 'detailName', action: false })
              this.storedetailNameInfo_global(null)

              this.storeGeoDetailType_global(type)
              this.storeGeoDetailInfo_global(item)
              this.storeGeoDetailPoint_global(point)
              
              this.storePopupStatus_global({ key: 'geographyDetail', action: true })
              this.toggleMarkerIcon(marker)
            })

            if (msg.length > 50) {
              tmp.push({marker, x: point.lat, y: point.lon})
            } else {
              layerGroup.addLayer(marker)
            }
          }

          let key = el.key + '_' + opt.key
          if (msg.length > 50) {
            vacuate[key] = new Vacuate(tmp, 'distance2')
            this.renderData(key)
          } else {
            vacuateMarkers[key] = layerGroup
            layerGroup.addTo(zmap)
          }

          // 数据统计
          if (el.key === 'material' || el.key === 'rescueteam') {
            this.geoOpts[el.key].count += msg.length
            if (!geoOptsDetail[el.key])
              geoOptsDetail[el.key] = []
            geoOptsDetail[el.key] = geoOptsDetail[el.key].concat(msg)
          } else {
            this.geoOpts[key].count = msg.length
            geoOptsDetail[key] = msg
          }
        }
      }
      console.log(geoOptsDetail)
    }

    // 切换图标选中
    toggleMarkerIcon(marker) {
      let iconUrl = marker.options.icon.options.iconUrl
      if (/_pre/.test(iconUrl)) return
      this.recoverMarker()

      iconUrl = iconUrl.slice(0, -4) + '_pre' + iconUrl.slice(-4)
      let image = new Image()
      image.onload = () => {
        marker.setIcon(
          L.icon({
            iconUrl,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          })
        )
        markerSelected = marker
      }
      image.src = iconUrl
    }

    // 更改原先选中图标 为 未选中状态
    recoverMarker () {
      if (!markerSelected) return
      let url = markerSelected.options.icon.options.iconUrl
      url = url.replace('_pre', '')
      markerSelected.setIcon(
        L.icon({
          iconUrl: url,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        })
      )
      markerSelected = null
    }

    @Watch('popupStatus_global.geographyDetail')
    ongeographyDetailChanged (val: any, oldVal: any) {
      if (!val)
        this.recoverMarker()
    }

    // 删除所有类型的基础信息点
    async removeAllPois() {
      for (let el of geoConf.elements as any) {
        for (let opt of el.sub as any) {
          this.clearPois(el.key + '_' + opt.key)
        }
      }
    }

    // 抽稀渲染
    renderData(key) {
      let cb = () => this.render2(key)
      this.listener[key] = cb
      zmap.on('moveend', cb)
      this.render2(key)
    }

    render2(key) {
      vacuateMarkers[key] && vacuateMarkers[key].eachLayer(e => {
        zmap.removeLayer(e)
      })
      delete vacuateMarkers[key]
      if (zmap.getZoom() <= 5) return
      let markers = vacuate[key].render(zmap, L)
      vacuateMarkers[key] = markers
      zmap.addLayer(markers)
    }

    // 清除地图上的图标
    removePois(key) {
      // 清除选中图标
      if (markerSelected && markerSelected.id === key)
        markerSelected = null

      if (vacuateMarkers[key]) {
        vacuateMarkers[key].eachLayer(e => {
          zmap.removeLayer(e)
        })
      }

      if (this.listener[key]) {
        zmap.off('moveend', this.listener[key])
        this.$delete(this.listener, key)
      }
    }

    // 清除地图上的图标 与 存储数据
    clearPois(key) {
      this.removePois(key)
      vacuateMarkers[key] && delete vacuateMarkers[key]
      vacuate[key] && delete vacuate[key]
    }

    // 切换数据统计面板 元素选择
    toggleOpt(key) {
      this.geoOpts[key].isSelected = !this.geoOpts[key].isSelected
      this.toggleOptData(key)
    }

    toggleOptData(key) {
      if (key === 'material' || key === 'rescueteam') {
        let el: any = geoConf.elements.find(i => i.key === key)
        for (let opt of el.sub) {
          let keyword = key + '_' + opt.key
          if (this.geoOpts[key].isSelected) {
            if (vacuate[keyword]) {
              this.renderData(keyword)
            } else {
              vacuateMarkers[keyword].eachLayer(e => {
                e.addTo(zmap)
              })
            }
          } else {
            this.removePois(keyword)
          }
        }
      } else {
        if (this.geoOpts[key].isSelected) {     // 添加数据
          if (vacuate[key]) {        // 抽稀
            this.renderData(key)
          } else {
            vacuateMarkers[key].eachLayer(e => {
              e.addTo(zmap)
            })
          }
        } else {
          this.removePois(key)
        }
      }
    }

    // 数据统计面板 全选/清空 按钮
    toggleAllOpts() {
      let flag = this.allOptSelected
      for (let key in this.geoOpts) {
        if (flag) {
          this.geoOpts[key].isSelected = false
          this.toggleOptData(key)
        } else {
          if (!this.geoOpts[key].isSelected) {
            this.geoOpts[key].isSelected = true
            this.toggleOptData(key)
          }
        }
      }
    }

    // 发布
    async release() {
      if (!this.messageString) {
        Vue['prototype']['$message']({ type: 'warning', message: '请填写说明' })
        return
      }
      let hasOptSelected = false
      for (let i in this.geoOpts) {
        if (this.geoOpts[i].isSelected) {
          hasOptSelected = true
          break
        }
      }
      if (!hasOptSelected) {
        Vue['prototype']['$message']({ type: 'warning', message: '发送对象不能为空' })
        return
      }
      
      let phones = []
      for (let i in geoOptsDetail) {
        for (let el of geoOptsDetail[i]) {
          if ('phone' in el) {
            phones.push(Number(el.phone))
            continue
          }
          if ('cellphone' in el) {
            phones.push(Number(el.cellphone))
            continue
          }
          if ('managercellphone' in el) {
            phones.push(Number(el.managercellphone))
            continue
          }
          if ('contactcellphone' in el)
            phones.push(Number(el.contactcellphone))
        }
      }
      let res: boolean = await releaseClient.sendMsgToDetail(this.messageString, phones)
      if (res)
        Vue['prototype']['$message']({ type: 'success', message: '发布成功' })
      else
        Vue['prototype']['$message']({ type: 'error', message: '发布失败' })
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#TargetRelease {
  position: absolute;
  top: 121px; /*no*/
  right: 90px;
  width: 400px;
  color: #575757;
  >.content {
    padding: 10px;
    .btn-wrapper {
      position: relative;
      margin-top: 10px;
      .primary-btn {
        float: left;
        &.clear {
          margin: 0 20px 0 90px;
        }
      }
    }
  }
  .release-popup {
    position: absolute;
    top: 0;
    left: -290px;
    width: 280px;
    >.content {
      padding: 10px;
      textarea {
        width: 100%;
        height: 80px;
        padding: 10px;
        box-sizing: border-box;
        border-color: #ccc;
      }
      .release-btn {
        margin: 5px 0 0 100px;
      }
    }
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
