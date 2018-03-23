<template>
  <div id="login-container">
    <div class="title">广东山洪地质灾害气象预警系统</div>
    <div class="wrapper">
      <h1>用户登录</h1>
      <input type="text" class="fir" v-model="username" placeholder="用户名" @keyup.13="login" ref="username">
      <input type="password" v-model="password" placeholder="密码" @keyup.13="login" ref="pwd" onpaste="return false">
      <div class="btn" @click="login">登录</div>
      <div class="wrong-tip" v-show="isWrong">{{ wrongTipString }}</div>
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
  background: url(~Img/background.jpg) no-repeat center / 100% 100%;
  user-select: none;
  .title {
    position: absolute;
    top: 20px;
    left: 20px;
    color: #fff;
    font-size: 14px;
    line-height: 14px;
    text-shadow: 0 1px 4px rgba(0,0,0,.2);
  }
  .wrapper {
    position: absolute;
    top: 20%;
    left: 50%;
    margin-left: -190px;
    width: 380px;
    h1 {
      color: #fff;
      font-size: 18px;
      line-height: 18px;
      text-align: center;
      text-shadow: 0 1px 4px rgba(0,0,0,.2);
    }
    input {
      margin-top: 20px;
      width: 348px;
      height: 48px;
      padding: 0 15px;
      background: #fff;
      border: 1px solid rgba(255,255,255,.15);
      border-radius: 3px;
      font-size: 14px;
      color: #545454;
      transition: all .2s;
      &.fir { margin-top: 40px; }
      &::-webkit-input-placeholder { color: #999; }
      &:-moz-placeholder { color: #999; }
      &::-moz-placeholder { color: #999; }
      &:-ms-input-placeholder { color: #999; }
      &:focus { outline: none; }
    }
    .btn {
      cursor: pointer;
      width: 378px;
      height: 48px;
      line-height: 46px;
      margin-top: 40px;
      padding: 0;
      background: #d49e4d;
      border-radius: 3px;
      border: 1px solid #e2a478;
      // box-shadow:
        // 0 15px 30px 0 rgba(255,255,255,.25) inset,
        // 0 2px 7px 0 rgba(0,0,0,.2);
      font-size: 14px;
      letter-spacing: 10px;
      text-indent: 5px;
      color: #fff;
      text-align: center;
      text-shadow: 0 1px 2px rgba(0,0,0,.1);
      transition: all .2s;
      &:hover { background: #d8a457; }
      &:hover {
        // box-shadow:
        //   0 15px 30px 0 rgba(255,255,255,.15) inset,
        //   0 2px 7px 0 rgba(0,0,0,.2);
      }
      &:active {
        // box-shadow:        
        //   0 5px 8px 0 rgba(0,0,0,.1) inset,
        //   0 1px 4px 0 rgba(0,0,0,.1);
        border: 1px solid #d49e4d;
      }
    }
    .wrong-tip {
      margin-top: 10px;
      color: #ffb6b6;
      text-align: center;
    }
  }
}
</style>