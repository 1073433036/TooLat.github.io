<template>
  <div id="login-container">
    <div class="title">广东山洪地质灾害气象预警系统</div>
    <h1>用户登录</h1>
    <div class="wrapper">
      <h2>用户名</h2>
      <input type="text" class="fir" v-model="username" placeholder="用户名" @keyup.13="login" ref="username">
      <h2>密码</h2>
      <input type="password" v-model="password" placeholder="密码" @keyup.13="login" ref="pwd" onpaste="return false">
      <div class="wrong-tip" v-show="isWrong">{{ wrongTipString }}</div>
      <div class="btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import Module from '../interface/Module'
  import modulesConf from '../config/modulesConf'
  import { userClient } from '../util/clientHelper'
  import { Base64 } from 'js-base64'

  @Component
  export default class Login extends Vue {
    @Action('systemStore/storeModuleList_global') storeModuleList_global: any
    @Action('systemStore/storeUserInfo_global') storeUserInfo_global: any
    @Action('systemStore/storeAdministrator_global') storeAdministrator_global: any

    username: string = ''
    password: string = ''
    wrongTipString: string = ''
    isWrong: boolean = false

    async login() {
      this.isWrong = false
      if (!this.username || !this.password) {
        this.wrongTipString = '用户名密码不得为空'
        this.isWrong = true
        if (!this.username) {
          let el = <HTMLInputElement>this.$refs.username
          el.focus()
        } else {
          if (!this.password) {
            let el = <HTMLInputElement>this.$refs.pwd
            el.focus()
          }
        }
        return
      }
      let res = await userClient.login(this.username, this.password)
      if (!res) {
        this.wrongTipString = '用户名密码错误'
        this.isWrong = true
        return
      }
      sessionStorage.userId = res.user.id
      sessionStorage.username = res.user.name
      sessionStorage.password = Base64.encode(this.password)
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
      this.$router.replace({ name: 'MainViewer' })
    }

    @Watch('username')
    onUsernameChanged(val, oldVal) {
      this.isWrong = false
    }

    @Watch('password')
    onPasswordeChanged(val, oldVal) {
      this.isWrong = false
    }
  }
</script>

<style lang="scss" scoped>
#login-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(~Img/login_bg.png) repeat;
  user-select: none;
  .title {
    position: absolute;
    top: 20px;
    left: 20px;
    color: #999;
    font-size: 16px;
    line-height: 14px;
    text-shadow: 0 1px 4px rgba(0,0,0,.2);
  }
  h1 {
    position: absolute;
    top: 20%;
    left: 0;
    width: 100%;
    color: #d49e4d;
    font-size: 24px;
    line-height: 22px;
    text-align: center;
    text-shadow: 0 1px 4px rgba(0,0,0,.2);
  }
  .wrapper {
    position: absolute;
    top: 28%;
    left: 50%;
    margin-left: -200px;
    padding: 20px 30px;
    width: 340px;
    height: 230px;
    background: rgb(247, 247, 247);
    border-radius: 5px;
    box-shadow: 0 0 15px rgba(0, 0, 0, .35);
    h2 {
      color: #4f5d80;
      margin-bottom: 11px;
    }
    input {
      margin-bottom: 20px;
      width: 308px;
      height: 36px;
      padding: 0 15px;
      background: rgb(247, 247, 247);
      border: 1px solid #cad2db;
      border-radius: 3px;
      font-size: 14px;
      color: #545454;
      transition: all .2s;
      &::-webkit-input-placeholder { color: #999; }
      &:-moz-placeholder { color: #999; }
      &::-moz-placeholder { color: #999; }
      &:-ms-input-placeholder { color: #999; }
      &:focus{
        transition:border linear .2s,
                  box-shadow linear .2s;
        outline: none;
        border-color: rgba(173,173,173, .75);
        box-shadow:0 0 8px rgba(173,173,173,.5);
        border:1px solid #d49e4d;}
    }
    .btn {
      margin: 25px 0 0 108px;
      cursor: pointer;
      width: 122px;
      height: 32px;
      line-height: 32px;
      padding: 0;
      background: #d49e4d;
      border-radius: 3px;
      border: 1px solid #e2a478;
      box-shadow:
        0 15px 30px 0 rgba(255,255,255,.25) inset,
        0 2px 7px 0 rgba(0,0,0,.2);
      font-size: 14px;
      letter-spacing: 10px;
      text-indent: 5px;
      color: #fff;
      text-align: center;
      text-shadow: 0 1px 2px rgba(0,0,0,.1);
      transition: all .2s;
      &:hover { background: #d8a457; }
      &:hover {
        box-shadow:
          0 15px 30px 0 rgba(255,255,255,.15) inset,
          0 2px 7px 0 rgba(0,0,0,.2);
      }
      &:active {
        box-shadow:        
          0 5px 8px 0 rgba(0,0,0,.1) inset,
          0 1px 4px 0 rgba(0,0,0,.1);
        border: 1px solid #d49e4d;
      }
    }
    .wrong-tip {
      position: absolute;
      top: 185px;
      left: 0;
      width: 100%;
      color: #ec8080;
      text-align: center;
    }
  }
}
</style>