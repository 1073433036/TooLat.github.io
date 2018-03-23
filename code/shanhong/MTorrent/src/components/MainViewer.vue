<template>
  <div id="main-container">
    <header class="nav">
      <ul class="nav cf">
        <li v-for="opt of moduleList_global"
            :key="opt.key"
            :class="{on: opt.key === selectedModule}"
            @click="toggleModule(opt.key)">{{ opt.name }}</li>
      </ul>
      <div class="user" @mouseenter="isUserPopupOn = true" @mouseleave="isUserPopupOn = false">
        <div class="name">{{ userInfo_global.user ? userInfo_global.user.name : '' }}</div>
        <ul class="popup" v-show="isUserPopupOn">
          <li v-if="isAdministrator_global" @click="userManagement">用户管理</li>
          <li @click="logout">退出登录</li>
        </ul>
      </div>
    </header>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Action, Getter } from 'vuex-class'
  import Module from '../interface/Module'
  import Zmap from './Zmap.vue'
  import { userClient } from '../util/clientHelper'
  import { Base64 } from 'js-base64'
  import modulesConf from '../config/modulesConf'

  @Component
  export default class MainViewer extends Vue {
    @Getter('systemStore/userInfo_global') userInfo_global: any
    @Getter('systemStore/moduleList_global') moduleList_global: Array<Module>
    @Getter('systemStore/isAdministrator_global') isAdministrator_global: any
    @Action('systemStore/storeUserInfo_global') storeUserInfo_global
    @Action('systemStore/storeModuleList_global') storeModuleList_global
    @Action('systemStore/storeAdministrator_global') storeAdministrator_global: any

    selectedModule: string = ''
    isUserPopupOn: boolean = false

    toggleModule(key: string) {
      if(key !== this.selectedModule)
        this.$router.push({ name: key })
    }

    @Watch('$route')
    onRouteChanged (val: any, oldVal: any) {
      this.selectedModule = val.name
    }

    mounted() {
      let routeName: any = this.$route.name
      if (routeName === 'MainViewer') {       // 从登陆界面访问
        if (!this.moduleList_global.length) return
        let key = this.moduleList_global[0].key
        this.selectedModule = key
        this.$router.replace({ name: key })
      } else {                                // 未经过登录页面 重新访问登录接口
        this.selectedModule = routeName
        this.initModules()
      }
    }

    async initModules() {
      let pwd = Base64.decode(sessionStorage.password)
      let res = await userClient.login(sessionStorage.username, pwd)
      if (res) {
        sessionStorage.cityid = res.user.cityid
        sessionStorage.cityName = res.user.cityName
        sessionStorage.countyId = res.user.countyId
        sessionStorage.countyName = res.user.countyName
        this.storeUserInfo_global(res)
        
        let list: any[] = []
        if (res.authority) {
          let isAdministrator = false
          for (let el of res.authority) {
            if (el.description === 'user') {
              isAdministrator = true
              continue
            }
            list.push(el.description)
          }
          this.storeAdministrator_global(isAdministrator)
        }
        // let list = ["station", "warning", "typhoon", "cloud", "geol", "decision"]     // old
        
        let modules: Array<Module> = list.map((el: string): Module => (<any>modulesConf)[el])
        this.storeModuleList_global(modules)
      } else {
        this.$router.replace({ name: 'Login' })
      }
    }

    logout() {
      sessionStorage.removeItem("userId")
      sessionStorage.removeItem("username")
      sessionStorage.removeItem("password")
      sessionStorage.removeItem("cityid")
      sessionStorage.removeItem("cityName")
      sessionStorage.removeItem("countyId")
      sessionStorage.removeItem("countyName")
      this.storeUserInfo_global({})
      this.storeModuleList_global([])
      this.$router.replace({ name: 'Login' })
    }

    userManagement() {
      this.isUserPopupOn = false
      this.$router.push({ name: 'userManagement' })
    }
  }
  //关闭页面 注销登录
  // const userLogout = () => userClient.logout(sessionStorage.userId)
  // window.onunload = userLogout
  // window.onbeforeunload = userLogout
</script>

<style lang="scss" scoped>
  #main-container {
    position: relative;
    width: 100%;
    min-width: 1000px;
    height: 100%;
    header.nav {
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 47px;
      color: #fff;
      font-size: 16px;
      text-align: center;
      user-select: none;
      background: #404040;
      border-bottom: 3px solid #f3ac12;
      ul.nav {
        position: absolute;
        top: 0;
        left: 0;
        height: 47px;
        line-height: 47px;
        li {
          position: relative;
          float: left;
          width: 100px;
          cursor: pointer;
          &::after {
            position: absolute;
            top: 9px;
            right: 0;
            content: '';
            width: 0;
            height: 28px;
            border-right: 1px solid #474747;
          }
          &:last-child::after { border-right: none; }
          &:hover,&.on { color: #f3ac12; }
          &.on { background: rgba(255, 255, 255, .1); font-weight: bold; }
        }
      }
      .user {
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        .name {
          width: 100px;
          height: 47px;
          line-height: 47px;
          text-decoration: underline;
          border-bottom: 3px solid #f3ac12;
        }
        ul.popup {
          position: absolute;
          top: 50px;
          left: 0;
          background: #555858;
          li {
            width: 100px;
            line-height: 40px;
            text-align: center;
            &:hover { background: #626464; }
          }
        }
      }
    }
  }
</style>
