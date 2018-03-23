<template>
  <main id="RescueLib" v-drag>
    <header>
      <span>救援库</span>
      <i @click="storePopupStatus_global({ key: 'rescueLib', action: false })">×</i>
    </header>
    <div class="content" v-loading="loading" element-loading-text="数据加载中">
      <component :is="commonTableView" :info="info" :thead="thead" :detailExtended="detailExtended"></component>
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
  export default class RescueLib extends Vue {
    @Getter('systemStore/region_global') region_global
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    isComponentAlive: boolean = true
    info: any[] = []
    loading: boolean = true
    commonTableView: any = null
    thead: any = {
      teamname: { text: '队伍名称', type: 'left' },
      manager: { text: '负责人', type: 'center' },
      managercellphone: { text: '手机号码', type: 'center' },
    }
    detailExtended: any = {
      teamtype: '类型',
      people: '人数',
      teamname: '队伍名称',
      department: '部门',
      address: '地址',
      manager: '负责人',
      managerphone: '联系电话',
      managercellphone: '手机号码',
      teamcontact: '队伍联系人',
      contactphone: '队伍联系人电话',
      contactcellphone: '队伍联系人手机',
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
      let type = 5
      let res = await assistClient.findAssistplace(type, this.region_global.cityId)
      if (!this.isComponentAlive) return
      if (res) {
        for (let el of res) {
          let list = el.name.split('-')
          this.$set(el, 'teamname', list[list.length - 1])
        }
        this.info = res
      }
      else
        Vue['prototype']['$message']({ type: 'error', message: '救援库数据获取失败' })
    }
  }
</script>

<style lang='scss' scoped>
#RescueLib {
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
#RescueLib {
  .el-loading-spinner {
    top: 45%;
  }
}
</style>