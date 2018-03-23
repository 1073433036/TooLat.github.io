<template>
  <main id="PollutionImitate" v-loading="loading" element-loading-text="数据加载中"
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
    <!-- <div class="info">
      <div class="text">中心经度</div>
      <div class="val">
        <input type="text" v-model="lon" placeholder="请使用污染定位点定位经度">
      </div>
    </div>
    <div class="info">
      <div class="text">中心纬度</div>
      <div class="val">
        <input type="text" v-model="lat" placeholder="请使用污染定位点定位纬度">
      </div>
    </div> -->
    <div class="info">
      <div class="text">污染源</div>
      <div class="val">
        <select v-model="pollutionSourceSelected">
          <option value="null">请选择</option>
          <option v-for="(el, key) in pollutionSource" :key="key"
              v-if="el.text != ''" :value="key">{{ el.text }}</option>
        </select>
      </div>
    </div>
    <div class="info">
      <div class="text">污染物</div>
      <div class="val">
        <select v-model="pollutantSelected">
          <option value="null">请选择</option>
          <option v-for="(el, key) in pollutant" :key="key" :value="key">{{ el }}</option>
        </select>
      </div>
    </div>
    <div class="info">
      <div class="text">爆炸时间</div>
      <div class="val">
        <el-date-picker type="datetime" class="explosion-time"
            format="yyyy-MM-dd HH:mm" v-model="explosionTime" placeholder="点击选择时间"></el-date-picker>
      </div>
    </div>
    <div class="info">
      <div class="text">泄露速率</div>
      <div class="val">
        <input type="number" v-model="leakSpeed" placeholder="单位为千克每小时" ref="leakSpeed">
        (kg/h)
      </div>
    </div>
    <div class="info">
      <div class="text">泄露时长</div>
      <div class="val">
        <input type="number" v-model="leakTime" placeholder="单位为小时" ref="leakTime">
        (h)
      </div>
    </div>
    <div class="info">
      <div class="text">污染源高度</div>
      <div class="val">
        <input type="number" v-model="pollutionSourceHeight" placeholder="单位为米" ref="height">
        (m)
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
  import moment from 'moment'
  import { geoClient, disasterSimulateClient } from '@/util/ClientHelper'
  import { ModelAssess } from '@/util/modelAssess'
  import { pollutionSource } from '@/config/pollution'

  let L: any = null,
      zmap: any = null
  let poiMarker: any = null,
      poiImgLayer: any = null,
      pollutionRange = [1, 0.00003, 0.00002, 0.00001, 0]

  @Component
  export default class PollutionImitate extends Vue {
    @Getter('decisionStore/region_global') region_global
    @Action('modelStore/storeModelData_global') storeModelData_global
    loading: boolean = false
    steps: string[] = ['等待提交', '上传提交', '模型计算', '结果反馈']
    currentStep: number = 1
    errorStep: number | null = null
    poiAdding: boolean = false
    location: string = '污染点定位'
    lon: string = ''
    lat: string = ''
    windSpeed: number = 0
    windDirection: number = 0
    pollutionSource: any = pollutionSource
    pollutionSourceSelected: string = 'null'
    get pollutant() {
      let dist = this.pollutionSource[this.pollutionSourceSelected]
      return dist ? dist.elements : {}
    }
    pollutantSelected: string = 'null'
    explosionTime = ''
    leakSpeed: number = 1
    leakTime: number | null = null
    pollutionSourceHeight: number | null = null
    isRecordPanelOn: boolean = false
    recordList: any[] = []
    recordSelected: any = null
    
    async mounted() {
      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      // 获取交互记录
      let cityId = this.region_global.cityId
      let data = await disasterSimulateClient.getSimulatePoint({ type: 'pollution', cityId })
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
           iconUrl: 'static/img/DecisionCommand/modelIcon/airpollution/green.png',
          iconSize: [25, 40],
          iconAnchor: [12.5, 40]
         })
      }).addTo(zmap)
    }

    async mapClickEvent(e) {
      this.clearMapEvent()
      let lat = e.latlng.lat, lon = e.latlng.lng
      this.lat = lat.toFixed(3)
      this.lon = lon.toFixed(3)

      let res = await geoClient.regeo(lon, lat)
      if (res) {
        let address = res.regeocode.formatted_address
        this.location = typeof address === 'string' ? address.replace('广东省', '') : '未知'
      }

      let msg = await disasterSimulateClient.getWindInfo(lon, lat)
      if (msg) {
        this.windSpeed = Math.floor(msg.vel * 10) / 10
        this.windDirection = Math.floor(msg.dir * 10) / 10
      }
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
    }

    @Watch('pollutionSourceSelected')
    onPollutionSourceSelectedChanged (val: string, oldVal: string) {
      this.pollutantSelected = 'null'
    }

    // 提交
    async addPoint() {
      if (this.lon === '' || this.lat === '') {
        Vue['prototype']['$message']({ type: 'warning', message: '请使用污染定位点定位经纬度' })
        return
      }
      if (this.pollutionSourceSelected === 'null' || this.pollutantSelected === 'null') {
        Vue['prototype']['$message']({ type: 'warning', message: '请选择污染源污染物' })
        return
      }
      if (!this.explosionTime) {
        Vue['prototype']['$message']({ type: 'warning', message: '请选择爆炸时间' })
        return
      }
      if (!this.leakSpeed) {
        Vue['prototype']['$message']({ type: 'warning', message: '请定义泄露速率' })
        setTimeout(() => {
          let el = <HTMLInputElement>this.$refs.leakSpeed
          el.focus()
        }, 500)
        return
      }
      if (!this.leakTime) {
        Vue['prototype']['$message']({ type: 'warning', message: '请定义泄露时长' })
        setTimeout(() => {
          let el = <HTMLInputElement>this.$refs.leakTime
          el.focus()
        }, 500)
        return
      }
      if (!this.pollutionSourceHeight) {
        Vue['prototype']['$message']({ type: 'warning', message: '请定义污染源高度' })
        setTimeout(() => {
          let el = <HTMLInputElement>this.$refs.height
          el.focus()
        }, 500)
        return
      }
      this.currentStep = 2

      let name = `${this.location}_${pollutionSource[this.pollutionSourceSelected].text}_${pollutionSource[this.pollutionSourceSelected].elements[this.pollutantSelected]}`
      let simulateRecordHolder = {
        name,
        combinedName: '',
        imgLayer: null,
        data: {
          lon: this.lon,
          lat: this.lat,
          pollutionSource: this.pollutionSourceSelected,
          dem: 'null',
          pollutant: this.pollutantSelected,
          explosionTime: moment(this.explosionTime).format('yyyy-MM-dd HH:mm:ss'),
          diffuse: 'plume',
          pollutionSourceHeight: this.pollutionSourceHeight,
          windType: 'null',
          leakTime: this.leakTime,
          windSpeed: this.windSpeed,
          leakSpeed: this.leakSpeed,
          windDirection: Number(this.windDirection).toFixed(0)
        }
      }

      this.loading = true
      let modelAssess = new ModelAssess(this.region_global)
      let filename = await modelAssess.getPollutionSmlFile(simulateRecordHolder.data)
      if (!filename || filename === 'null') {
        this.loading = false
        return
      }
      // 添加模拟点
      let param = {
        name,
        lon: this.lon,
        lat: this.lat,
        type: 'pollution',
        params: JSON.stringify(simulateRecordHolder),
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

    // 获取污染poi图片
    async drawSmlImage() {
      this.currentStep = 3
      this.clearImgLayer()
      let record = this.recordList[this.recordSelected]
      let modelAssess: any = new ModelAssess(this.region_global)
      let ncInfo = await modelAssess.getNcInfo('airpolution_nc_poi', record.filename)
      let data = await modelAssess.getSimulateImg('pollution', record, ncInfo)
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
      this.storeModelData_global({ attr: 'analysisType', value: 'pollution' })

      modelAssess.getEffectedTownsByRanges(pollutionRange, data.ncInfo)
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

<style lang='scss'>
#PollutionImitate {
  .el-input__prefix, .el-input__suffix {
    display: none;
  }
}
</style>