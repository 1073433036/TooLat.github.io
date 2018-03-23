<template>
  <main id="DisasterInformation">
    <CommonNavMenu @handleSelect="handleSelect" :NavMenuName="componentName"></CommonNavMenu>
    <section class="DisasterInformation_main">
      <componented :is="components"></componented>
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import DisasterInformationReport from './DisasterInformationReport.vue'
  import DisasterInformationAudit from './DisasterInformationAudit.vue'
  import DisasterInformationHistory from './DisasterInformationHistory.vue'
  import CommonNavMenu from '../../CommonComponents/CommonNavMenu.vue'

  @Component({
    components:{
      DisasterInformationHistory,
      DisasterInformationReport,
      DisasterInformationAudit,
      CommonNavMenu,
    }
  })
  export default class DisasterInformation extends Vue {
    componentName:string='disasterInformation'
    activeIndex:string='zaiqinReport'
    components:any=DisasterInformationReport
    //tab栏类型
    handleSelect(tabType:string):void{
      this.activeIndex=tabType
      switch (tabType){
        case 'zaiqinReport':
          this.components=DisasterInformationReport
          break
        case 'zaiqinAudit':
          this.components=DisasterInformationAudit
          break
        case 'zaiqinHistory':
          this.components=DisasterInformationHistory
          break
      }
    }
    mounted(){

    }

  }
</script>

<style lang="scss" scoped>
  #DisasterInformation {
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    height: 100%;
    position: relative;
    overflow: hidden;
    box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.25);
    .DisasterInformation_main{
      height: calc(100% - 62px);
    }
  }
</style>
