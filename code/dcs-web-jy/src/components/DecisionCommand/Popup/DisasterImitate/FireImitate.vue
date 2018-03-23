<template>
  <main id="FireImitate" v-loading="loading" element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading">
    <div class="info" style="height: 24px;">
      <div class="progress-wrapper">
        <svg width="74px" height="24px">
          <polygon :class="[{error: errorStep === 1, on: currentStep === 1}]"
              points="0,0 64,0 74,12 64,24 0,24" />
        </svg>
        <svg width="74px" height="24px">
          <polygon :class="[{error: errorStep === 2, on: currentStep === 2}]"
              points="0,0 64,0 74,12 64,24 0,24 10,12" />
        </svg>
        <svg width="74px" height="24px">
          <polygon :class="[{error: errorStep === 3, on: currentStep === 3}]"
              points="0,0 64,0 74,12 64,24 0,24 10,12" />
        </svg>
        <svg width="74px" height="24px">
          <polygon :class="[{error: errorStep === 4, on: currentStep === 4}]"
              points="0,0 74,0 74,24 0,24 10,12" />
        </svg>
      </div>
      <div class="progress-wrapper">
        <span :class="['step', {on: index + 1 === currentStep}]" v-for="(el, index) in steps"
            :key="index">{{ el }}</span>
      </div>
    </div>
    <div class="info point">
      <i></i>
      <span @click="locate">{{ location }}</span>
    </div>
    <div class="info">
      <div class="text">中心经度</div>
      <div class="val">
        <input type="text" v-model="lon" placeholder="请使用火险定位点定位经度">
      </div>
    </div>
    <div class="info">
      <div class="text">中心纬度</div>
      <div class="val">
        <input type="text" v-model="lat" placeholder="请使用火险定位点定位纬度">
      </div>
    </div>
    <div class="info">
      <div class="text">事件名称</div>
      <div class="val">
        <input type="text" v-model="eventName" placeholder="自定义事件名称" ref="name">
      </div>
    </div>
    <div class="info">
      <div class="text">燃烧速度</div>
      <div class="val">
        <input type="number" v-model="speed" placeholder="自动获取">
        (米/分钟)
      </div>
    </div>
    <div class="info">
      <div class="text">燃烧系数</div>
      <div class="val">
        <select v-model="factorSelected">
          <option v-for="el in factorList" :key="el.id" :value="el.id">{{ el.name }}</option>
        </select>
      </div>
    </div>
    <div class="btn-wrapper">
      <div class="primary-btn" @click="addPoint">提交</div>
      <span class="record" @click="isRecordPanelOn = !isRecordPanelOn">交互记录</span>
    </div>
    <div class="record-wrapper" v-if="isRecordPanelOn">
      <ul class="scroll-bar">
        <li v-for="(el, index) in recordList" :key="el.id"
            :class="{on: recordSelected === index}">
          <span @click="showPoiInfo(el, index)" :title="el.name">{{ el.name }}</span>
          <i title="删除" @click="delSimulatePoint(el.id, index)">×</i>
        </li>
      </ul>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { geoClient, disasterSimulateClient } from '@/util/ClientHelper'
  import { ModelAssess } from '@/util/modelAssess'

  let L: any = null,
      zmap: any = null
  let poiMarker: any = null,
      poiImgLayer: any = null,
      fireRange = [100, 90, 72, 50, 25, 0]

  @Component
  export default class FireImitate extends Vue {
    @Getter('decisionStore/region_global') region_global
    @Action('modelStore/storeModelData_global') storeModelData_global
    loading: boolean = false
    steps: string[] = ['等待提交', '上传提交', '模型计算', '结果反馈']
    currentStep: number = 1
    errorStep: number | null = null
    poiAdding: boolean = false
    location: string = '火险点定位'
    lon: string = ''
    lat: string = ''
    eventName: string = ''
    speed: number | null = null
    factorSelected: number | null = null
    factorList: any = []
    isRecordPanelOn: boolean = false
    recordList: any[] = []
    recordSelected: any = null
    
    async mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      // 获取植被类型
      let res = await disasterSimulateClient.getCombustible()
      if (res) {
        this.factorList = res
        this.factorSelected = res[0].id
      }
      // 获取交互记录
      let cityId = this.region_global.cityId
      let data = await disasterSimulateClient.getSimulatePoint({ type: 'fire', cityId })
      if (data) {
        for (let el of data) el.params = JSON.parse(el.params)
        this.recordList = data
      }
    }
    
    beforeDestroy() {
      this.clearMarker()
      this.clearImgLayer()
      this.clearMapEvent()
      L = null
      zmap = null
    }

    // 定位点定位
    locate() {
      this.currentStep = 1
      this.recordSelected = null
      this.clearMarker()
      this.clearImgLayer()
      this.lon = this.lat = ''
      this.poiAdding = true
      zmap.on('mousemove', this.mapMousemoveEvent)
      zmap.once('click', this.mapClickEvent)
    }

    clearMarker() {
      if (!poiMarker) return
      zmap.removeLayer(poiMarker)
      poiMarker = null
    }

    clearImgLayer() {
      if (!poiImgLayer) return
      zmap.removeLayer(poiImgLayer)
      poiImgLayer = null
    }

    clearMapEvent() {
      if (!this.poiAdding) return
      zmap.off('mousemove', this.mapMousemoveEvent)
      zmap.off('click', this.mapClickEvent)
      this.poiAdding = false
    }

    mapMousemoveEvent(e) {
      let lon = e.latlng.lng, lat = e.latlng.lat
      this.addPoiMarker (lon, lat)
    }

    addPoiMarker (lon, lat) {
      this.clearMarker()
      this.clearImgLayer()
      poiMarker = L.marker([lat, lon], {
         icon: L.icon({
            iconUrl: 'static/img/DecisionCommand/modelIcon/fire/green.png',
            iconSize: [25, 40],
            iconAnchor: [12.5, 40]
         })
      }).addTo(zmap)
    }

    async mapClickEvent(e) {
      this.clearMapEvent()
      let lat = e.latlng.lat, lon = e.latlng.lng
      let res = await geoClient.regeo(lon, lat)
      if (res) {
        let address = res.regeocode.formatted_address
        this.location = typeof address === 'string' ? address : '未知'
      }
      this.lat = lat.toFixed(3)
      this.lon = lon.toFixed(3)
    }

    @Watch('lon')
    onlonChanged (val: string, oldVal: string) {
      this.lonlatChanged()
    }
    @Watch('lat')
    onlatChanged (val: string, oldVal: string) {
      this.lonlatChanged()
    }
    lonlatChanged() {
      this.currentStep = 1
      this.recordSelected = null
      if (this.lon === '' || this.lat === '') {
        this.clearMarker()
        this.clearImgLayer()
        return
      }
      if (+this.lat > 50 || +this.lat < 0 || +this.lon > 180) {
        Vue['prototype']['$message']({ type: 'warning', message: '请输入正确的经纬度' })
        return
      }
      this.addPoiMarker (this.lon, this.lat)
      this.getSpeed()
    }

    // 获取燃烧速度
    async getSpeed() {
      let res = await disasterSimulateClient.getSpeed(this.lon, this.lat)
      this.speed = Math.floor(res.ks * 10) / 10
      if (!this.speed) this.speed = 1
    }

    // 提交
    async addPoint() {
      if (this.lon === '' || this.lat === '') {
        Vue['prototype']['$message']({ type: 'warning', message: '请使用火险定位点定位经纬度' })
        return
      }
      if (!this.eventName) {
        Vue['prototype']['$message']({ type: 'warning', message: '请定义事件名称' })
        setTimeout(() => {
          let el = <HTMLInputElement>this.$refs.name
          el.focus()
        }, 500)
        return
      }
      this.currentStep = 2

      this.loading = true
      let filename = await disasterSimulateClient.getFireSmlFile(this.lon, this.lat, this.factorSelected, this.speed)
      if (!filename || filename === 'null') {
        this.loading = false
        return
      }
      // 添加模拟点
      let param = {
        name: this.eventName,
        lon: this.lon,
        lat: this.lat,
        type: 'fire',
        params: JSON.stringify({
          Ks: this.factorSelected,
          R0: this.speed
        }),
        filename,
        cityid: this.region_global.cityId
      }
      let res = await disasterSimulateClient.addSimulatePoint(param)
      if (res === false) {
        Vue['prototype']['$message']({ type: 'error', message: '提交失败' })
        this.loading = false
        return
      }
      this.recordList.push(param)
      this.recordSelected = this.recordList.length - 1
      this.drawSmlImage()
    }

    // 获取火险poi图片
    async drawSmlImage() {
      this.currentStep = 3
      this.clearImgLayer()
      let record = this.recordList[this.recordSelected]
      let modelAssess: any = new ModelAssess(this.region_global)
      let ncInfo = await modelAssess.getNcInfo('fire_nc_poi', record.filename)
      let data = await modelAssess.getSimulateImg('fire', record, ncInfo)
      this.loading = false
      if (!data) {
        Vue['prototype']['$message']({ type: 'warning', message: '图片获取失败' })
        return 
      }
      let left = data.rect.left,
          right = data.rect.right,
          top = data.rect.top,
          bottom = data.rect.bottom
      poiImgLayer = L.imageOverlay(data.imgUrl, [[top, left], [bottom, right]]).addTo(zmap)
      zmap.flyToBounds([[top, left], [bottom, right]])

      this.storeModelData_global({ attr: 'isAnalyzing', value: true })
      this.storeModelData_global({ attr: 'analysisType', value: 'fire' })

      modelAssess.getEffectedTownsByRanges(fireRange, data.ncInfo)
        .then(towns => {
          this.currentStep = 4
          this.storeModelData_global({ attr: 'townsIdList', value: towns })
        })
        .catch(err => {
          this.currentStep = 4
          this.storeModelData_global({ attr: 'townsIdList', value: [] })
        })
      modelAssess = null
    }

    showPoiInfo(el, index) {
      if (this.recordSelected === index) return
      this.clearMapEvent()
      this.addPoiMarker(el.lon, el.lat)
      this.recordSelected = index
      this.loading = true
      this.drawSmlImage()
    }

    // 删除模拟点
    async delSimulatePoint(id, index) {
      let res = await disasterSimulateClient.delSimulatePoint(id)
      if (res !== false) {
        Vue['prototype']['$message']({ type: 'success', message: '删除成功' })
        this.recordList.splice(index, 1)
        if (index === this.recordSelected) {
          this.clearMarker()
          this.clearImgLayer()
          this.recordSelected = null
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
#FireImitate {
  
}
</style>