<template>
  <main id="usersInfoManage">
    <CommonNavMenu  @handleSelect="handleSelect" :NavMenuName="componentName"></CommonNavMenu>
    <section class="usersInfoManage_main">
      <componented :is="component"></componented>
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import userManage from './UserManege.vue'
  import DutyManage from './DutyManage.vue'
  import groupManage from './GroupManage.vue'
  import CommonNavMenu from '../../CommonComponents/CommonNavMenu.vue'
  @Component({
    components:{
      groupManage,
      userManage,
      DutyManage,
      CommonNavMenu,
    }
  })
  export default class UsersInfoManage extends Vue {
    activeIndex:string='users'
    componentName:string='userInfoManage'
    component:any = userManage
    //tab栏选择
    handleSelect(tabType:string):void{
      this.activeIndex=tabType
      switch (tabType){
        case 'users':
          this.component=userManage
          break
        case 'group':
          this.component=groupManage
          break
        case 'duty':
          this.component=DutyManage
          break
        default :
          this.component=null
      }
    }
  }

</script>

<style lang="scss" scoped>
  #usersInfoManage{
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    height: 100%;
    position: relative;
    overflow: hidden;
    box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.25);
    .usersInfoManage_main{
      height: calc(100% - 62px);
    }
  }
</style>
