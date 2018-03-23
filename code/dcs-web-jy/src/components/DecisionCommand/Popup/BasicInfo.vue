<template>
  <main id="BasicInfo" class="decision-popup" v-drag>
    <header>
      <span>基础信息</span>
      <a @click="closeFunc"></a>
    </header>
    <div class="content">
      <ul class="opts">
        <li :class="['opt', {on: el.selected}]" v-for="el in assistConf" :key="el.key">
          <div class="header" @click="toggleNav(el)">
            <span class="name">{{ el.name }}</span>
            <span class="clear" @click.stop="toggleSubSelected(el)">
              {{ el.subSelected ? '清空' : '全选' }}
            </span>
            <div class="icon"></div>
          </div>
          <div class="wrapper" v-if="el.selected">
            <ul class="cf decision-chk-group">
              <li v-for="opt of el.sub" :key="opt.key"
                  :class="{col3: el.key === 'material', on: opt.selected}"
                  @click="toggleInfo(el, opt)">
                <em></em>
                <span>{{ opt.name }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { assistClient } from '@/util/ClientHelper'
  import { geoConf } from '@/config/geographyConf'
  import Vacuate from '@/util/Vacuate'

  let L: any = null,
      zmap: any = null,
      vacuate: any = {},
      vacuateMarkers: any = {},
      markerSelected: any = null

  @Component
  export default class BasicInfo extends Vue {
    @Prop({ default: Function }) closeFunc
    @Getter('decisionStore/region_global') region_global
    @Getter('decisionStore/popupStatus_global') popupStatus_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storedetailNameInfo_global') storedetailNameInfo_global
    @Action('decisionStore/storeGeoDetailInfo_global') storeGeoDetailInfo_global
    @Action('decisionStore/storeGeoDetailPoint_global') storeGeoDetailPoint_global
    @Action('decisionStore/storeGeoDetailType_global') storeGeoDetailType_global
    isCompomentAlive: boolean = true
    assistConf: any[] = []
    listener: any = {}

    mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      zmap.on('moveend', this.mapMoveendFunction)
      
      let dist = JSON.parse(JSON.stringify(geoConf.elements))
      for (let el of dist) {
        this.$set(el, 'selected', false)      // 判断子选项是否展开
        this.$set(el, 'subSelected', false)   // 判断是否有子选项选中
        for (let opt of el.sub) {
          this.$set(opt, 'selected', false)
        }
      }
      dist[0].selected = true
      this.assistConf = dist
      this.toggleInfo(this.assistConf[0], this.assistConf[0].sub[0])
    }

    beforeDestroy() {
      zmap.off('moveend', this.mapMoveendFunction)
      for (let el of this.assistConf) {
        for (let opt of el.sub) {
          if (opt.selected)
            this.removeOpts(el.key + '_' + opt.key)
        }
      }
      this.storeGeoDetailInfo_global({})
      this.storeGeoDetailPoint_global({})
      this.storePopupStatus_global({ key: 'geographyDetail', action: false })
      L = null
      zmap = null
      this.isCompomentAlive = false
    }

    mapMoveendFunction() {
      this.storePopupStatus_global({ key: 'detailName', action: false })
    }

    toggleNav(el) {
      el.selected = !el.selected
    }

    // 全选 清空
    toggleSubSelected(el) {
      el.subSelected = !el.subSelected
      if (el.subSelected) {
        for (let opt of el.sub) {
          if (opt.selected) continue
          this.toggleInfo(el, opt)
        }
        el.selected = true
      } else {
        for (let opt of el.sub) {
          if (!opt.selected) continue
          opt.selected = false
          this.removeOpts(el.key + '_' + opt.key)
        }
      }
    }

    // 判断 全选 清空
    changeSubSelected(el) {
      let arr: boolean[] = []
      for (let opt of el.sub)
        arr.push(opt.selected)
      el.subSelected = !arr.includes(false)
    }

    async toggleInfo(el, opt) {
      opt.selected = !opt.selected
      this.changeSubSelected(el)
      this.removeOpts(el.key + '_' + opt.key)
      if (!opt.selected) return

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
      if (!this.isCompomentAlive) return
      if (!res) {
        Vue['prototype']['$message']({ type: 'error', message: '数据获取失败' })
        return
      }

      for (let item of res) {
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
          for (let item of res) {
            let id = item.lon + '_' + item.lat
            if (!dist[id]) dist[id] = {}
            if (!dist[id][item.name]) dist[id][item.name] = { isSelected: false, sub: [] }
            dist[id][item.name].sub.push(item)
          }
          data = dist
        } else if (type === 5) {     // 救援队伍
          let dist = {}
          for (let item of res) {
            let id = item.lon + '_' + item.lat
            if (!dist[id]) dist[id] = []
            dist[id].push(item)
          }
          data = dist
        }
      } else {           // 地理信息
        let dist = {}
        for (let el of res) {
          dist[el.id] = el
        }
        data = dist
      }
      console.log(data)

      // 添加makrer
      let tmp: any[] = []
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
          // let x = e.containerPoint.x,
          //     y = e.containerPoint.y
          // el.pos = { x, y }
          this.storeGeoDetailType_global(type)
          this.storeGeoDetailInfo_global(item)
          this.storeGeoDetailPoint_global(point)
          this.storePopupStatus_global({ key: 'geographyDetail', action: true })
          this.toggleMarkerIcon(marker)
        })

        if (res.length > 50) {
          tmp.push({marker, x: point.lat, y: point.lon})
        } else {
          marker.addTo(zmap)
        }
      }
      res.length > 50 && this.renderData(tmp, 'distance2', el.key + '_' + opt.key)
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

    renderData(tmp, type: 'distance2' | 'manhattan', key) {
      vacuate[key] = new Vacuate(tmp, type)
      let cb = () => { this.render2(key) }
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

      // 防止重新渲染之后 地图出现多个选中图标
      if (markerSelected) {
        markers.eachLayer(e => {
          let url = e.options.icon.options.iconUrl
          if (/_pre/.test(url) && markerSelected.id !== e.id) {
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
        })
      }

      vacuateMarkers[key] = markers
      zmap.addLayer(markers)
    }

    removeOpts(key) {
      if (vacuateMarkers[key]) {
        vacuateMarkers[key].eachLayer(e => {
          zmap.removeLayer(e)
        })
        delete vacuateMarkers[key]

        vacuate[key] && delete vacuate[key]

        if (this.listener[key]) {
          zmap.off('moveend', this.listener[key])
          this.$delete(this.listener, key)
        }
      } else {
        zmap.eachLayer(e => {
          if (e.id === key)
            zmap.removeLayer(e)
        })
      }

      // 清除选中图标
      if (markerSelected && markerSelected.id === key)
        markerSelected = null
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#BasicInfo {
  position: absolute;
  top: 0;
  left: 60px;
  width: 280px;
  .content {
    padding: 10px 10px 10px 20px;
    ul.opts {
      li.opt {
        position: relative;
        padding: 10px 0;
        &::after {
          position: absolute;
          top: 10px;
          left: 0;
          width: 2px;
          height: 20px;
          content: '';
        }
        &:nth-child(1)::after { background: #33bf9f; }
        &:nth-child(2)::after { background: #3594d2; }
        &:nth-child(3)::after { background: #9244bb; }
        &:nth-child(4)::after { background: #f19149; }
        .header {
          position: relative;
          width: 100%;
          height: 20px;
          cursor: pointer;
          span.name {
            position: absolute;
            top: 0;
            left: 20px;
            display: inline-block;
            line-height: 20px;
          }
          span.clear {
            position: absolute;
            top: 0;
            right: 50px;
            display: inline-block;
            line-height: 20px;
            cursor: pointer;
            &:hover {
              color: $themeColor;
              text-decoration: underline;
            }
          }
          .icon {
            position: absolute;
            top: 4px;
            left: 212px;
            width: 8px;
            height: 12px;
            transform: rotate(90deg);
            background: url(~Img/DecisionCommand/extend.png) no-repeat 0 0 / 400% 100%;
          }
        }
        .wrapper {
          margin-top: 10px;
          padding: 0 20px;
        }
        &.on {
          background: #f5f5f5;
          &::after {
            top: 0;
            height: 100%;
          }
          .header {
            .icon {
              background: url(~Img/DecisionCommand/extend.png) no-repeat 33.3% 0 / 400% 100%;
              transform: rotate(-90deg);
            }
          }
        }
      }
    }
  }
}
</style>
