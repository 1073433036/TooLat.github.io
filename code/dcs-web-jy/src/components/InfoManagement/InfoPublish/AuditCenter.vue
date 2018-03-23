<template>
  <main id="AuditCenter">
    <CommonNavMenu @handleSelect="handleSelect" :NavMenuName="componentName"></CommonNavMenu>
    审核中心
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop } from 'vue-property-decorator'
  import CommonNavMenu from '../../CommonComponents/CommonNavMenu.vue'
  @Component({
    components:{
      CommonNavMenu
    }
  })
  export default class AuditCenter extends Vue {
    componentName:string='auditCenter'
    //tab栏选项
    handleSelect(param:string){
      switch (param){
        case 'toAudit':

          break
        case 'audited':

          break
      }
    }

    mounted(){

    }
  }
</script>

<style lang="scss" scoped>
  #AuditCenter{
    width: 100%;
    height: 100%;
    background: white;
    box-shadow: 0px 0px 5px rgba(137, 137, 137, 0.25);
  }
</style>
