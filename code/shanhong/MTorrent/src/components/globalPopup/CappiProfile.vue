<template>
  <main id="CappiProfile" class="global-popup" v-drag>
    <header>
      <span>雷达剖面</span>
      <em @click="storePopupStatus_global({ key: 'CappiProfile', action: false })"></em>
    </header>
    <div class="content">
      <div class="opt">
        日期：
        <el-date-picker
          v-model="date"
          size="small"
          :editable="false"
          :clearable="false"
          type="date">
        </el-date-picker>
        日
        <select v-model="hour">
          <option :value="0">00</option>
          <option v-for="i in 23" :key="i" :value="i">{{ i >= 10 ? i : '0' + i }}</option>
        </select>
        时
        <select v-model="minute">
          <option :value="0">00</option>
          <option v-for="i in 9" :key="i" :value="i*6">{{ i*6 >= 10 ? i*6 : '0' + i*6 }}</option>
        </select>
        分
      </div>
      <figure v-loading="loading" element-loading-text="正在加载图片">
        <img v-show="isGetImage" :src="imageUrl">
        <div v-show="!isGetImage" class="img-tip">暂无图片</div>
      </figure>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import moment from 'moment'

  @Component
  export default class CappiProfile extends Vue {
    @Getter('systemStore/cappiProfile_global') cappiProfile_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any

    date: Date = new Date()
    hour: number = new Date().getHours()
    minute: number = 0
    imageUrl: string = ''
    isGetImage: boolean = true
    loading: boolean = false

    created() {
      let date = Date.now() - Date.now() % (6*60*1000) - (18*60*1000)
      this.date = new Date(date)
      this.hour = new Date(date).getHours()
      this.minute = new Date(date).getMinutes()
      this.getImageUrl()
    }

    getImageUrl() {
      let hour = this.hour >= 10 ?  this.hour : '0' + this.hour
      let minute = this.minute >= 10 ?  this.minute : '0' + this.minute
      let date = moment(this.date).format('YYYY-MM-DD') + ' ' + hour + ':' + minute + ':00'
      let SLat = this.cappiProfile_global.SLat,
          SLon = this.cappiProfile_global.SLon,
          ELat = this.cappiProfile_global.ELat,
          ELon = this.cappiProfile_global.ELon
      this.imageUrl = `/nc/jsonp/bin/contour/cut?modelName=cappi&datetime=${date}&varname=cappi&lon1=${SLon}&lat1=${SLat}&lon2=${ELon}&lat2=${ELat}&width=740&height=420&type=0&callback=cache`
      
      let host = window.location.host
      let flag = host === '113.108.192.98:8080' || host === '10.12.12.84:8080'
      if (!flag)
        this.imageUrl = 'http://10.148.83.228:9002' + this.imageUrl
      else
        this.imageUrl = 'http://' + host + this.imageUrl
      
      this.loading = true
      let image = new Image()
      image.onload = () => {
        this.isGetImage = true
        this.loading = false
      }
      image.onerror = () => {
        this.isGetImage = false
        this.loading = false
      }
      image.src = this.imageUrl
    }

    @Watch('date')
    onDateChanged(val: any, oldVal: any) {
      this.getImageUrl()
    }

    @Watch('hour')
    onHourChanged(val: any, oldVal: any) {
      this.getImageUrl()
    }

    @Watch('minute')
    onMinuteChanged(val: any, oldVal: any) {
      this.getImageUrl()
    }
  }
</script>

<style lang='scss' scoped>
#CappiProfile {
  position: absolute;
  top: calc(50% - 254px);
  left: calc(50% - 390px);
  width: 780px;
  .content {
    .opt {
      width: calc(100% - 10px);
      height: 44px;
      color: #999;
      line-height: 44px;
      padding-left: 10px;
      border-bottom: 1px solid #ccc;
      select {
        margin: 0 10px;
        width: 60px;
        height: 24px;
        padding-left: 6px;
        border: 1px solid #dcdcdc;
        border-radius: 2px;
      }
    }
    figure {
      margin: 0;
      img,.img-tip {
        padding: 20px;
        width: 740px;
        height: 420px;
      }
      .img-tip {
        line-height: 400px;
        font-size: 38px;
        font-weight: bold;
        text-align: center;
        letter-spacing: 5px;
        color: #4c4f4f;
      }
    }
  }
}
</style>

<style lang='scss'>
#CappiProfile {
  .el-date-editor.el-input {
    margin-left: 0;
    width: 134px;
  }
  .el-input__inner {
    color: #000;
    border: 1px solid #dcdcdc;
    background: #fff;
  }
  .el-input--small .el-input__inner {
    height: 24px;
  }
  .el-input__inner {
    border-radius: 4px;
  }
}
</style>
