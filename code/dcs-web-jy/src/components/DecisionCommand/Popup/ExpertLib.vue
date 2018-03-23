<template>
  <main id="ExpertLib" v-drag>
    <header>
      <span>专家库</span>
      <i @click="storePopupStatus_global({ key: 'expertLib', action: false })">×</i>
    </header>
    <div class="content" v-loading="loading" element-loading-text="数据加载中">
      <component :is="commonTableView" :info="info" :thead="thead"></component>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { assistClient } from '@/util/ClientHelper'
  import CommonTable from '../CommonCompts/CommonTable.vue'

  @Component
  export default class ExpertLib extends Vue {
    @Getter('systemStore/region_global') region_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    isComponentAlive: boolean = true
    info: any[] = []
    loading: boolean = true
    commonTableView: any = null
    thead: any = {
      name: { text: '专家名', type: 'center' },
      specialty: { text: '专业领域', type: 'center' },
      phone: { text: '电话', type: 'center' },
      cellphone: { text: '手机', type: 'center' }
    }

    async mounted() {
      await this.findExpertsInfo()
      this.loading = false
      this.commonTableView = CommonTable
    }

    beforeDestroy() {
      this.isComponentAlive = false
    }
  
    async findExpertsInfo() {
      let type = 8
      let res = await assistClient.findAssistplace(type, this.region_global.cityId)
      if (!this.isComponentAlive) return
      if (res)
        this.info = res
      else
        Vue['prototype']['$message']({ type: 'error', message: '专家库数据获取失败' })
    }
  }
</script>

<style lang='scss' scoped>
#ExpertLib {
  z-index: 1;
  position: absolute;
  top: 116px; /*no*/
  right: 80px; /*no*/
  width: 376px; /*no*/
  background: #fff;
  box-shadow: 0 0 10px #8d9db5; /*no*/
  header {
    height: 30px; /*no*/
    line-height: 30px; /*no*/
    text-indent: 10px; /*no*/
    font-weight: bold;
    cursor: move;
    color: #1c1c1c;
    i {
      position: absolute;
      top: 0; /*no*/
      right: 10px; /*no*/
      display: inline-block;
      width: 30px; /*no*/
      height: 30px; /*no*/
      font-size: 26px; /*no*/
      line-height: 30px; /*no*/
      text-align: center;
      text-indent: 0;
      color: #9c9fa7;
      cursor: pointer;
      &:hover { color: #1c1c1c; }
    }
  }
  .content {
    padding: 0 10px; /*no*/
    min-height: 300px; /*no*/
  }
}
</style>

<style lang='scss'>
#ExpertLib {
  .el-loading-spinner {
    top: 45%;
  }
}
</style>