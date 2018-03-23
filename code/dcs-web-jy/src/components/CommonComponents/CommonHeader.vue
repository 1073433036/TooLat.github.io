<template>
  <main id="page-header">
    <div class="page-header-logo"></div>
    <div class="page-header-title ns" v-text="headerTitle"></div>
    <div class="user-info-wrapper">
      <div class="user-info" v-text="userInfoGlobal.account"></div>
      <div class="user-logout" @click.stop="userLogout">退出</div>
      <div class="back-home" @click.stop="backToHome">回到首页</div>
    </div>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import UserInfo from '../../interface/UserInfo'

  @Component
  export default class PageHeader extends Vue {
    @Prop()
    headerTitle
    @Getter('systemStore/userInfo_global') userInfoGlobal
    @Action('systemStore/userLogout_global') userLogoutGlobal

    userLogout(): void {
      this.userLogoutGlobal();
      this.$router.push({ path: '/main'});
      if(window.sessionStorage.getItem('userInfo'))
        window.sessionStorage.removeItem('userInfo');
    }

    backToHome(): void {
      this.$router.push({ path: '/main'});
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/theme.scss';
  $headerHeight: 50px;

  #page-header {
    width: 100%;
    height: $headerHeight;
    position: absolute;
    top: 0;
    left: 0;
    background-color: $themeColor;
    box-shadow: 0px 0px 10px -2px #353535;
    font-size: 0;
    clear: left;
    z-index: 9;
    .page-header-logo {
      width: $headerHeight;
      height: 100%;
      position: relative;
      display: inline-block;
      vertical-align: top;
      background-color: white;
      background-image: url('~Img/headerLogo/home_logo.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 25px 28px;
    }
    .page-header-title {
      height: 100%;
      position: relative;
      display: inline-block;
      vertical-align: top;
      padding: 0 15px;
      font-size: 20px;
      line-height: $headerHeight;
      color: white;
      letter-spacing: 3px;
    }
    .user-info-wrapper {
      height: 100%;
      position: relative;
      float: right;
      font-size: 0;
      .user-info {
        height: 100%;
        position: relative;
        display: inline-block;
        vertical-align: top;
        margin-right: 10px;
        padding-left: 38px;
        line-height: $headerHeight;
        font-size: 12px;
        color: white;
        &:before {
          content: '';
          width: 32px;
          height: 32px;
          position: absolute;
          top: 9px;
          left: 0;
          background: url(~Img/headerLogo/user_icon.png) 100% 100% no-repeat;
          background-size: 100% 100%;
        }
      }
      .user-manage {
        width: 24px;
        height: 24px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        margin: 9px 0;
        padding: 0 10px;
        border-left: 1px solid white; /*no*/
        background: url(~Img/headerLogo/management.png) 100% 100% no-repeat;
      }
      .user-logout {
        height: 20px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        margin: 15px 0;
        padding: 0 10px;
        border-left: 1px solid white; /*no*/
        line-height: 20px;
        color: white;
        font-size: 12px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
      .back-home {
        height: 100%;
        position: relative;
        display: inline-block;
        vertical-align: top;
        padding: 0 14px 0 44px;
        background-color: rgba(255, 255, 255, .2);
        font-size: 12px;
        line-height: 50px;
        color: white;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
        &::before {
          content: '';
          width: 20px;
          height: 20px;
          position: absolute;
          left: 14px;
          top: calc((100% - 24px) / 2);
          background: url(~Img/back_home.png) center center no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
</style>
