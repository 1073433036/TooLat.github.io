<template>
  <main id="main-viewer">
    <header id="main-header">
      <div class="main-title">
        <img src="../assets/imgs/mainViewer/main_logo.png" />
        <p v-text="systemTitleGlobal"></p>
      </div>
    </header>
    <section id="main-content">
      <div class="left-wrapper login-wrapper" v-if="!isLoginedGlobal" key="user-login">
        <div class="login-blank-space"></div>
        <div class="login-title--cn">用户登录</div>
        <div class="login-title--en">Log In</div>
        <div class="login-input-field">
          <div class="login-user">
            <span>用户名</span>
            <input type="text" v-model="username"/>
          </div>
          <div class="login-password">
            <span>密码</span>
            <input type="password" v-model="password" @keyup.enter="userLogin" @focus="autoFill" onpaste="return false" />
          </div>
        </div>
        <div :class="['login-remember-pw', 'ns', {'rem-pw': isRemPassword}]" @click.stop="rememberPassword">记住密码</div>
        <!-- <div class="login-forget-pw">忘记密码?</div> -->
        <div class="login-btn" @click.stop="userLogin">登  录</div>
        <div class="login-error" v-if="loginError.length" v-text="loginError"></div>
      </div>
      <div class="left-wrapper menu-wrapper" v-else key="user-login">
        <router-link class="menu-item" to="/WarningMessage">综合预警信息系统</router-link>
        <router-link class="menu-item" to="/DecisionCommand">综合决策指挥系统</router-link>
        <router-link class="menu-item" to="/InfoManagement">综合信息管理系统</router-link>
        <a class="menu-item" href="http://10.148.83.221:8090/meteoStation" target="_blank">综合气象自动站系统</a>
        <span class="split-line-v"></span>
        <span class="split-line-h"></span>
      </div>
      <div class="menu-image"></div>
      <!-- <div class="user-bar" v-if="isLoginedGlobal"></div> -->
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import UserInfo from '../interface/UserInfo'
  import UserInfoHttp from '../util/UsersInfoHttp'

  @Component
  export default class MainViewer extends Vue {
    @Getter('systemStore/systemTitle_global') systemTitleGlobal
    @Getter('systemStore/userInfo_global') userInfoGlobal
    @Getter('systemStore/isLogined_global') isLoginedGlobal
    @Action('systemStore/storeUserInfo_global') storeUserInfoGlobal

    username: string = ''
    password: string= ''
    loginError: string = ''
    isRemPassword: boolean = false

    mounted(): void {
      if(!this.isLoginedGlobal && window.sessionStorage['userInfo']) {
        let userInfo: UserInfo = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}');
        this.storeUserInfoGlobal(userInfo);
      }
    }

    autoFill(): void {
      if(this.username.length > 0 && window.localStorage.getItem(this.username)) {
        this.password = window.localStorage.getItem(this.username) || '';
        if(this.password.length)
          this.isRemPassword = true;
      }
    }

    rememberPassword(): void {
      this.isRemPassword = !this.isRemPassword;
    }

    async userLogin(): Promise<void> {
      let username: string = this.username.trim(),
          password: string = this.password.trim();
      if(username === '' || password === '') {
        this.loginError = '错误：请输入用户名或密码';
        return;
      }

      let userHttp = new UserInfoHttp();
      let userInfo: any = await userHttp.userLogin(username, password);
      if(Array.isArray(userInfo)) {
        this.loginError = '错误：请确认用户名或密码是否正确';
      } else {
        this.storeUserInfoGlobal(userInfo);
        window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        if(this.isRemPassword)
          window.localStorage.setItem(username, password);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../styles/theme.scss';

  #main-viewer {
    width: 100%;
    height: 100%;
    position: relative;
    background: url(~Img/mainViewer/main_bg.png) center / cover;
    #main-header {
      width: 100%;
      height: 120px;
      position: relative;
      .main-title {
        float: left; /* 自适应内容宽度 */
        position: relative;
        left: 50%;
        top: 30px;
        display: block;
        img {
          width: 51px; /*no*/
          height: 55px; /*no*/
          position: relative;
          display: block;
          left: -25px; /*no*/
          margin-bottom: 5px; /*no*/
        }
        p {
          position: relative;
          display: block;
          left: -50%;
          line-height: 24px;
          font-size: 26px;
          color:white;
          letter-spacing: 4px;
          text-align: center;
        }
      }
    }

    #main-content {
      width: calc(100% - 100px);
      height: calc(100% - 200px);
      position: relative;
      top: 20px;
      margin: 10px 50px 0 50px;
      background-color: white;
      text-align: left;
      font-size: 0;
      clear: left;

      .left-wrapper {
        width: calc(50% - 100px);
        height: calc(100% - 100px);
        position: relative;
        display: inline-block;
        vertical-align: top;
        padding: 50px;
      }

      .login-wrapper {
        >div {
          width: calc(100% - 100px);
          position: relative;
          margin-left: 100px;
        }
        .login-blank-space {
          height: calc((100% - 402px) / 2);
        }
        .login-title--cn {
          font-size: 24px;
          line-height: 30px;
          color: #1c1c1c;
          letter-spacing: 4px;
        }
        .login-title--en {
          font-size: 20px;
          line-height: 40px;
          color: #989898;
          &:before {
            content: '';
            width: 60px;
            height: 2px; /*no*/
            position: absolute;
            bottom: 0;
            left: -2px;
            background-color: $themeColor;
          }
        }
        .login-input-field {
          margin-top: 20px;
          .login-user,
          .login-password {
            width: 400px;
            position: relative;
            margin-bottom: 15px;
            >span {
              width: 100%;
              height: 30px;
              position: relative;
              display: block;
              font-size: 14px;
              color: #575757;
            }
            >input {
              width: calc(100% - 20px);
              height: 40px;
              position: relative;
              display: block;
              border: 1px solid #ddd; /*no*/
              padding: 0 10px;
              box-sizing: border-box;
              -webkit-box-sizing: border-box;
              -moz-box-sizing: border-box;
            }
          }
        }

        .login-remember-pw {
          // width: 100px;
          height: 30px; /*no*/
          display: block;
          float: left;
          line-height: 30px; /*no*/
          font-size: 12px; /*no*/
          color: #575757;
          text-indent: 20px; /*no*/
          box-sizing: border-box;
          cursor: pointer;
          &:before {
            content: '';
            width: 14px; /*no*/
            height: 14px; /*no*/
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: -7px; /*no*/
            background: url(~Img/mainViewer/rem_pw.png) no-repeat;
          }
        }
        .rem-pw:before {
          background-position-x: -14px; /*no*/
        }
        .login-forget-pw {
          width: 200px;
          height: 30px; /*no*/
          display: inline-block;
          vertical-align: top;
          line-height: 30px; /*no*/
          color: #989898;
          font-size: 12px; /*no*/
          text-align: right;
          text-decoration: underline;
          cursor: pointer;
          &:hover {
            color: $themeColor;
          }
        }
        .login-btn {
          width: 120px;
          height: 40px;
          margin-top: 70px;
          font-size: 14px; /*no*/
          color: white;
          line-height: 40px;
          background-color: $themeColor;
          text-align: center;
          box-sizing: border-box;
          cursor: pointer;
          &:hover {
            background-color: themeColorWithAlpha(.8);
          }
        }
        .login-error {
          width: 300px;
          height: 40px;
          float: left;
          left: 140px;
          top: -40px;
          font-size: 12px; /*no*/
          color: red;
          line-height: 40px;
        }
      }

      .menu-wrapper {
        font-size: 0;
        .menu-item {
          width: 50%;
          height: 50%;
          position: relative;
          align-items: center;
          display: inline-flex;
          font-size: 24px;
          justify-content: center;
          color: $themeColor;
        }
        .split-line-v {
          width: 1px; /*no*/
          height: calc(100% - 100px);
          position: absolute;
          left: 50%;
          top: 50px;
          background: -webkit-linear-gradient(themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0)); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0)); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0)); /* Firefox 3.6 - 15 */
          background: linear-gradient(themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0)); /* 标准的语法 */
        }
        .split-line-h {
          width: calc(100% - 100px);
          height: 1px; /*no*/
          position: absolute;
          top: 50%;
          left: 50px;
          background: -webkit-linear-gradient(90deg, themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0)); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(90deg, themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0)); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(90deg, themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0)); /* Firefox 3.6 - 15 */
          background: linear-gradient(90deg, themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0), themeColorWithAlpha(1), themeColorWithAlpha(0)); /* 标准的语法 */
        }
      }
      .menu-image {
        width: 50%;
        height: 100%;
        position: relative;
        display: inline-block;
        vertical-align: top;
        background: url(~Img/mainViewer/main_img.png) center / cover;
      }
      .user-bar {
        width: 70px;
        height: 40px;
        position: absolute;
        top: 20px;
        left: 0;
        background: url(~Img/mainViewer/main_user.png) center no-repeat;
        cursor: pointer;
      }
    }
  }
</style>
