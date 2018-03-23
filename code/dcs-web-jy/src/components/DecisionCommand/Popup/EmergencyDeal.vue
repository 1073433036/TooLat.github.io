<template>
  <main id="EmergencyDeal" class="decision-popup" v-drag
      v-loading="isLoading" element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading">
    <header>
      <span>应急处置</span>
      <a @click="closeFunc"></a>
    </header>

    <section class="content" v-if="!isEventStart">
      <div class="info">
        <span class="info-cn" style="float: left;">事件位置</span>
        <span class="pos choose" @click="selectPos" :style="!isPointPicked && 'color: #999;'"
            :title="isPointPicked && pointAddress">
          {{ isPointPicked ? pointAddress : '点击此处选择事件位置' }}
        </span>
      </div>
      <div class="info">
        <span class="info-cn">突发事件</span>
        <select v-model="selectedType" @change="getDisasterTypeInfo">
          <option v-for="type of emtype" :key="type.id" :value="type.id">{{ type.name }}</option>
        </select>
      </div>  
      <div class="info">
        <span class="info-cn">事件类型</span>
        <select v-model="selectedDisaster">
          <option v-for="opt of disaster" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
        </select>
      </div>
      <div class="info">
        <span class="info-cn">事件等级</span>
        <select v-model="eventLevel">
          <option :value="1">Ⅰ级</option>
          <option :value="2">Ⅱ级</option>
          <option :value="3">Ⅲ级</option>
          <option :value="4">Ⅳ级</option>
        </select>
      </div>
      <div class="info">
        <span class="info-cn">事件名称</span>
        <input type="text" v-model="eventName" placeholder="必填">
      </div>
      <div class="info event-desc">
        <span class="info-cn">事件描述</span>
        <textarea v-model="eventDesc" placeholder="选填"></textarea>
      </div>
      <div class="primary-btn" @click="startEvent">启动</div>
    </section>

    <section class="content" v-else>
      <div class="r-info cf">
        <span class="info-cn">事件名称</span>
        <span class="text">{{ eventName }}</span>
      </div>
      <div class="r-info cf">
        <span class="info-cn">事件位置</span>
        <span class="text">{{ pointAddress }}</span>
      </div>
      <div class="r-info cf">
        <span class="info-cn">事件时间</span>
        <span class="text">{{ eventTime }}</span>
      </div>
      <div class="r-info cf">
        <span class="info-cn">事件描述</span>
        <span class="text">{{ eventDesc ? eventDesc : '无' }}</span>
      </div>
      <div class="r-info cf">
        <span class="info-cn">天气情况</span>
        <span class="text">{{ eventWeather }}</span>
      </div>
      <div class="r-info cf">
        <span class="info-cn">推荐预案</span>
        <span class="text">
          <span :class="['plan-text', {lg: true}]"
              :title="disaster.find(el => el.id === selectedDisaster).name + ' ' + fLevels[eventLevel] + ' 级应急预案'">
            {{ disaster.find(el => el.id === selectedDisaster).name }} {{ fLevels[eventLevel] }} 级应急预案
          </span>
          <div class="plan-btn-wrapper cf">
            <div class="icon" @click="jumpToPlan"></div>
            <!-- <span class="choose plan-btn" @click="startPlan" v-if="true">启动</span>
            <template v-else>
              <span class="choose plan-btn" @click="changePlanLevel('up')">升级</span>
              <span class="choose plan-btn" @click="changePlanLevel('down')">降级</span>
              <span class="choose plan-btn" @click="finishPlan" style="color: #f4434b;">结束</span>
            </template> -->
          </div>
        </span>
      </div>
      <div class="r-info cf">
        <span class="info-cn">成员单位</span>
        <span class="text">{{ enentDepartment ? enentDepartment : '无' }}</span>
      </div>
      <div class="r-info cf" style="border-bottom: none;">
        <span class="info-cn">应急资源</span>
        <span class="text">
          <table>
            <tbody>
              <tr>
                <td>危化品点</td><td>{{ eventResource.chemical }}</td>
                <td>医疗设施</td><td>{{ eventResource.hospital }}</td>
              </tr>
              <tr>
                <td>应急物资</td><td>{{ eventResource.material }}</td>
                <td>救援队伍</td><td>{{ eventResource.rescueteam }}</td>
              </tr>
              <tr>
                <td>学校设施</td><td>{{ eventResource.school }}</td>
                <td>避难所</td><td>{{ eventResource.shelter }}</td>
              </tr>
              <tr>
                <td>应急专家</td><td>{{ eventResource.experts }}</td>
                <td>灾害点</td><td>{{ eventResource.geohazard }}</td>
              </tr>
              <tr>
                <td>视频信号</td><td>{{ eventResource.video }}</td>
              </tr>
            </tbody>
          </table>
        </span>
      </div>
      <div class="choose finish-btn" @click="finishEvent">结束</div>
    </section>

  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { geoClient, plansClient, typhoonClient, yanpanClient } from '@/util/ClientHelper'
  import moment from 'moment'
  import { geoConf } from '@/config/geographyConf'

  let markerSelected: any = null,
      geoOptsDetail: any = {}   // 各类型底下具体信息
  const geoKeys = geoConf.geoKeys

  @Component
  export default class EmergencyDeal extends Vue {
    @Prop({ default: Function }) closeFunc
    @Getter('systemStore/userInfo_global') userInfoGlobal
    @Action('decisionStore/storeDealPlanInfo_global') storeDealPlanInfo_global

    @Getter('decisionStore/popupStatus_global') popupStatus_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    @Action('decisionStore/storedetailNameInfo_global') storedetailNameInfo_global
    @Action('decisionStore/storeGeoDetailInfo_global') storeGeoDetailInfo_global
    @Action('decisionStore/storeGeoDetailPoint_global') storeGeoDetailPoint_global
    @Action('decisionStore/storeGeoDetailType_global') storeGeoDetailType_global

    isComponentAlive: boolean = true
    isLoading: boolean = false
    isEventStart: boolean = false
    fLevels = { 1: 'Ⅰ', 2: 'Ⅱ', 3: 'Ⅲ', 4: 'Ⅳ' }

    isPointPicked: boolean = false
    pointAddress: string = ''
    point: any = null
    center: number[] = []
    circle: any = null
    emtype: any[] = []
    selectedType: number | null = null
    disaster: any[] = []
    selectedDisaster: any = null
    eventId: number | null = null
    eventLevel: number = 1
    eventName: string = ''
    eventDesc: string = ''
    eventTime: string = ''
    eventWeather: string = ''
    enentDepartment: string = ''
    eventResource: any = {}

    async mounted() {
      this.isLoading = true
      await this.getEmegencyTypeInfo()
      await this.getDisasterTypeInfo()
      await this.getEvent()
      this.isLoading = false
    }

    beforeDestroy() {
      this.isComponentAlive = false
      window['zmap'] && window['zmap'].off('mousemove', this.zmapMousemoveEvent)
      window['zmap'] && window['zmap'].off('click', this.zmapClickEvent)
      this.clearPoint()
      this.clearCircle()
      this.removeResource()
    }

    // 获取应急事件
    async getEvent() {
      let updatetime = await yanpanClient.getDealTime()
      let param = {
        mintime: '',
        maxtime: '',
        d_styles: '',
        states: '',
        index: 0,
        size: 1,
        updatetime,
        userId: ''
      }
      let res = await yanpanClient.getDeal(param)
      if (!this.isComponentAlive) return
      if (res && res.length) {
        let el = res[0]
        this.pointAddress = el.address
        this.center = [el.lat, el.lon]
        this.eventId = el.liandongid
        this.eventName = el.name
        this.eventDesc = el.remarks
        this.eventTime = el.starttime
        this.eventWeather = el.influence_desc
        this.eventLevel = el.info.event_level
        this.selectedType = this.emtype.find(i => i.name === el.info.event).id
        await this.getDisasterTypeInfo()
        this.selectedDisaster = this.disaster.find(i => i.name === el.info.event_type).id
        let radius = 10
        this.getDepartment()
        this.getResource(radius)
        this.addCircle(radius)
        this.addMarker(el.lat, el.lon)

        this.isEventStart = true
      }
    }

    // 获取事件位置
    selectPos() {
      Vue['prototype']['$message']({ message: '左键点击地图选择事件位置' })
      window['zmap'].on('mousemove', this.zmapMousemoveEvent)
      window['zmap'].on('click', this.zmapClickEvent)
    }

    zmapMousemoveEvent(e: any) {
      this.addMarker(e.latlng.lat, e.latlng.lng)
    }

    addMarker(lat, lon) {
      let zmap = window['zmap'], L = window['L']
      this.clearPoint()
      this.point = L.marker([lat, lon], {
        icon: L.icon({
          className: 'ponit',
          iconUrl: 'static/img/DecisionCommand/location_point.png',
          iconSize: [22, 29],
          iconAnchor: [11, 29],
        })
      })
      this.point.addTo(zmap)
    }

    async zmapClickEvent(e: any) {
      this.isPointPicked = true
      window['zmap'].off('mousemove', this.zmapMousemoveEvent)
      window['zmap'].off('click', this.zmapClickEvent)
      let lng = e.latlng.lng,
          lat = e.latlng.lat
      this.getPointAddress(lng, lat)
      this.center = [lat, lng]
    }

    async getPointAddress(lon, lat) {
      let res = await geoClient.regeo(lon, lat)
      if (res)
        this.pointAddress =
          typeof res.regeocode.formatted_address === 'string'
          ? res.regeocode.formatted_address
          : '未知'
      else
        this.pointAddress = '未知'
    }

    clearPoint() {
      if (!this.point) return
      window['zmap'].removeLayer(this.point)
      this.point = null
    }

    // 获取突发事件
    async getEmegencyTypeInfo() {
      let emtype: MaxEmergencyTypeInfo[] | false = await plansClient.getEmergencyType()
      if (emtype)
        this.emtype = emtype
      this.selectedType = this.emtype[0].id
    }

    // 获取事件类型
    async getDisasterTypeInfo() {
      if (!this.selectedType) return
      let data: MidEmergencyTypeInfo[] | false = await plansClient.getdetailEmergencyType(this.selectedType)
      if (!data || !data.length) {
        this.disaster = []
        this.selectedDisaster = null
      } else {
        this.disaster = data
        this.selectedDisaster = this.disaster[0].id
        let selectedDisName = this.disaster[0].name
      }
    }

    // 启动应急事件
    async startEvent() {
      if (!this.isPointPicked) {
        Vue['prototype']['$message']({ type: 'warning', message: '请选择事件位置' })
        return
      }
      if(!this.eventName) {
        Vue['prototype']['$message']({ type: 'warning', message: '请输入事件名称' })
        return
      }
      this.eventTime = moment().format('YYYY-MM-DD HH:mm:ss')
      let res: any = await yanpanClient.getResult(this.center[1], this.center[0])
      let d_style = '',
          level = ''
      if (res) {
        let key =  Object.keys(res)[0]
        this.eventWeather = res[key].content
        d_style = res[key].d_style
        level = res[key].level
      }

      let param = {
        name: this.eventName,
        remarks: this.eventDesc,
        starttime: this.eventTime,
        endtime: '',
        d_style,
        second_d: '',
        influence_desc: this.eventWeather,
        province: '',
        city: '',
        county: '',
        userId: this.userInfoGlobal.userid,
        lon: this.center[1],
        lat: this.center[0],
        address: this.pointAddress,
        level,
        event: this.emtype.find(el => el.id === this.selectedType).name,
        event_type: this.disaster.find(el => el.id === this.selectedDisaster).name,
        event_level: this.eventLevel
      }
      let msg: number | false = await yanpanClient.startDeal(param)
      if (msg)
        this.getEvent()
      else
        Vue['prototype']['$message']({ type: 'error', message: '启动应急处置失败' })
    }

    // 获取应急预案成员单位
    async getDepartment() {
      this.enentDepartment = ''
      let e_name = this.disaster.find(el => el.id === this.selectedDisaster).name
      let res: planmeasureInfo[] | false = await plansClient.getPlanmeasure(e_name)
      if (!res) return
      let departmentArr: string[] = []
      for (let el of res) {
        if (el.level == this.eventLevel && el.department)
          departmentArr.push(el.department)
      }
      this.enentDepartment = departmentArr.join('、')
    }

    // 获取应急资源
    async getResource(radius: number) {
      this.eventResource = {}
      let res: any = await typhoonClient.findPointInCircle(this.center[1], this.center[0], radius)
      if (!res) {
        geoOptsDetail = {}
        return
      }
      this.eventResource = {
        chemical: res[1].length,
        hospital: res[3].length,
        material: res[4].length,
        rescueteam: res[5].length,
        school: res[6].length,
        shelter: res[7].length,
        experts: res[8].length,
        geohazard: res[9].length,
        video: 0    // fix here
      }
      geoOptsDetail = res
      this.addResource(res)
    }

    // 添加应急资源
    addResource(res) {
      for (let type in res) {
        if (type == '2' || !res[type].length) continue       // 排除人口经济
        // 数据处理
        let data
        if (type === '4') {
          let dist = {}
          for (let item of res[type]) {
            let nameArr = item.name.split('-')
            item._name = nameArr[nameArr.length - 1]
            item._type = 'material'
            item._subType = geoKeys[item.name.split('-')[1]]
            item.latlon = item.lon.toFixed(2) + (item.lon >= 0 ? '°E' : '°W') + ', ' + item.lat.toFixed(2) + (item.lat >= 0 ? '°N' : '°S')
            let id = item.lon + '_' + item.lat
            if (!dist[id]) dist[id] = {}
            if (!dist[id][item.name]) dist[id][item.name] = { isSelected: false, sub: [] }
            dist[id][item.name].sub.push(item)
          }
          data = dist
        } else if (type === '5') {
          let dist = {}
          for (let item of res[type]) {
            let nameArr = item.name.split('-')
            item._name = nameArr[nameArr.length - 1]
            item._type = 'rescueteam'
            item._subType = geoKeys[item.teamtype]
            item.latlon = item.lon.toFixed(2) + (item.lon >= 0 ? '°E' : '°W') + ', ' + item.lat.toFixed(2) + (item.lat >= 0 ? '°N' : '°S')
            let id = item.lon + '_' + item.lat
            if (!dist[id]) dist[id] = []
            dist[id].push(item)
          }
          data = dist
        } else {
          let dist = {}
          for (let item of res[type]) {
            let nameArr = item.name.split('-')
            item._name = nameArr[nameArr.length - 1]
            item._type = 'geography'
            item._subType = geoKeys[type]
            item.latlon = item.lon.toFixed(2) + (item.lon >= 0 ? '°E' : '°W') + ', ' + item.lat.toFixed(2) + (item.lat >= 0 ? '°N' : '°S')
            dist[item.id] = item
          }
          data = dist
        }

        // 添加makrer
        let layerGroup: any = window['L'].layerGroup()
        for (let i in data) {
          let item = data[i], point

          if (type === '4') {    // 物资信息
            let key = Object.keys(data[i])[0]
            point = data[i][key].sub[0]
          } else if (type === '5') {    // 救援队伍
            point = data[i][0]
          } else {
            point = data[i]
          }

          let iconUrlStr = ''
          if (type === '4') {
            iconUrlStr = 'material/' + geoKeys[point.name.split('-')[1]]
          } else if (type === '5') {
            iconUrlStr = 'rescueteam/' + geoKeys[point.teamtype]
          } else {
            iconUrlStr = geoKeys[type]
          }
          let marker = window['L'].marker([point.lat, point.lon], {
            icon: window['L'].icon({
              iconUrl: `static/img/DecisionCommand/geography/${iconUrlStr}.png`,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            })
          })
          marker.id = 'resourceMarker'
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

            this.storeGeoDetailType_global(Number(type))
            this.storeGeoDetailInfo_global(item)
            this.storeGeoDetailPoint_global(point)
            
            this.storePopupStatus_global({ key: 'geographyDetail', action: true })
            this.toggleMarkerIcon(marker)
          })

          layerGroup.addLayer(marker)
        }
        layerGroup.addTo(window['zmap'])

      }
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
          window['L'].icon({
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
        window['L'].icon({
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

    // 删除应急资源
    removeResource() {
      if (!Object.keys(geoOptsDetail).length) return
      geoOptsDetail = {}
      window['zmap'].eachLayer(e => {
        if (e.id === 'resourceMarker')
          window['zmap'].removeLayer(e)
      })
    }

    addCircle(radius: number) {
      this.clearCircle()
      this.circle = window['L'].circle(this.center, {
        radius: radius*1000,
        color: '#f00',
        weight: 2,
        dashArray: [5, 10],
        fillColor: '#000',
        fillOpacity: 0.2
      }).addTo(window['zmap'])
      window['zmap'].setView(this.center, 12)
    }

    clearCircle() {
      if (!this.circle) return
      window['zmap'].removeLayer(this.circle)
      this.circle = null
    }

    // 跳转至预案模块
    jumpToPlan() {
      this.storeDealPlanInfo_global({
        selectedType: this.selectedType,
        selectedDisaster: this.selectedDisaster,
        selectedLevel: this.eventLevel
      })
    }

    // 结束应急事件 
    async finishEvent() {
      Vue['prototype']['$confirm']('确定结束该事件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let param = {
          liandongid: this.eventId,
          state: 2
        }
        let res: null | false = await yanpanClient.finishDeal(param)
        if (res === null) {
          this.clearPoint()
          this.clearCircle()
          this.removeResource()
          this.isPointPicked = false
          this.pointAddress = ''
          this.center = []
          this.eventId = null
          this.eventName = ''
          this.eventDesc = ''
          this.eventTime = ''
          this.eventWeather = ''
          this.enentDepartment = ''
          this.eventResource = {}
          this.isEventStart = false
          Vue['prototype']['$message']({ type: 'success', message: '结束应急处置成功' })
        } else
          Vue['prototype']['$message']({ type: 'error', message: '结束应急处置失败' })
      }).catch(() => {  })
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#EmergencyDeal {
  position: absolute;
  top: 0;
  left: 60px;
  width: 380px;
  .content {
    padding: 10px 20px;
    .choose {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    .info {
      position: relative;
      margin-bottom: 7px;
      height: 30px;
      span.info-cn {
        position: relative;
        display: inline-block;
        padding: 0 10px 0 5px;
        line-height: 30px;
        font-weight: bold;
      }
      span.pos {
        display: inline-block;
        line-height: 30px;
        width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      select {
        width: 200px;
        height: 30px;
        color: #000;
        font-size: 12px;
        background: #f5f5f5;
        text-indent: 5px;
        border: 1px solid #dfe6ec;
        border-radius: 2px;
      }
      input[type="text"] {
        width: 200px;
        height: 30px;
        padding: 0 10px;
        box-sizing: border-box;
        border: 1px solid #ccc;
      }
      &.event-desc {
        height: 60px;
        .info-cn {
          float: left;
          margin: 5px 3px 0 0;
        }
        textarea {
          width: 200px;
          height: 60px;
          padding: 5px 10px;
          box-sizing: border-box;
          border: 1px solid #ccc;
        }
      }
    }
    .primary-btn {
      margin: 10px 0 0 130px;
    }

    .r-info {
      position: relative;
      margin-bottom: 7px;
      border-bottom: 1px dashed #999; /*no*/
      span.info-cn {
        float: left;
        position: relative;
        display: inline-block;
        width: 48px; /*no*/
        line-height: 30px;
        font-weight: bold;
      }
      .text {
        float: left;
        display: inline-block;
        margin-left: 10px; /*no*/
        width: calc(100% - 58px); /*no*/
        box-sizing: border-box;
        padding: 5px;
        .plan-text {
          display: inline-block;
          width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          &.lg {
            width: 220px;
          }
        }
        .plan-btn-wrapper {
          float: right;
          .icon {
            margin-top: 1px;
            width: 8px;
            height: 14px;
            background: url(~Img/DecisionCommand/toolbar_arrow.png) no-repeat center / 100% 100%;
            cursor: pointer;
          }
          .plan-btn {
            float: left;
            display: inline-block;
            padding: 0 5px;
            color: $themeColor;
          }
        }
        >table {
          width: 100%;
          text-align: center;
          border: 1px solid #ddd; /*no*/
          tr {
            &:not(:last-child) {
              border-bottom: 1px solid #ddd; /*no*/
            }
            td {
              min-width: 24px;
              height: 30px;
              line-height: 30px;
              &:nth-child(2n+1) {
                background: #eee;
              }
              &:nth-child(2) {
                border-right: 1px solid #ddd; /*no*/
              }
            }
          }
        }
      }
    }
    .finish-btn {
      margin-left: 50%;
      transform: translateX(-50%);
      width: 30px; /*no*/
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: $themeColor;
    }
  }
}
</style>