<template>
  <div id="userLoginPage">
    <main class="option-container">
      <h2 v-text="systemTitle"></h2>
      <input type="text"
             placeholder="用户名"
             v-model="account">
      <input type="password"
             placeholder="密码"
             v-model="pw"
             @focus="getPwByAccount"
             @keyup.enter="login">
      <div class="rem-pw-wraper"><span :class="{'rem-pw': isRemPw}"
              @click="isRemPw = !isRemPw"></span><a @click="isRemPw = !isRemPw">记住密码</a></div><a class="login-btn"
         @click="login" @keyup.13="login">登录</a>
      <div class="return-to-system"><span></span><a @click="exit">返回系统</a></div>
      <div class="msg"
           :style="{color: loginStatus === 'success' ? 'white' : '#975555'}"
           v-if="loginStatus !== null">{{loginText}}</div>
    </main>
    <div class="shadow-wraper"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { tipBarDisplay } from '../util/Helper'

export default {
  data() {
    return {
      loginText: '',
      account: '',
      pw: '',
      isRemPw: false,

      loginStatus: null,
    }
  },
  computed: {
    ...mapGetters([
      'systemTitle'
    ])
  },
  methods: {
    ...mapActions([
      'gotoLoginPage',
      'storeLoginUser'
    ]),
    exit() {
      this.gotoLoginPage(false)
    },
    login() {
      let params = {
        account: this.account,
        password: this.pw
      }
      this.$http.jsonp('http://10.149.3.123:9020/jm/user/login', { params })
        .then(res => {
          if (!res.data.account) {
            this.loginText = '登录失败，用户名或密码错误'
            this.loginStatus = 'fail'
            return
          }
          this.storeLoginUser({
            account: res.data.account,
            password: res.data.password,
            sign: res.data.sign
          })
          this.loginText = '登录成功'
          this.loginStatus = 'success'
          if (this.isRemPw)
            localStorage.setItem(this.account, this.pw)
          setTimeout(() => {
            this.gotoLoginPage(false)
          }, 500);
        })
        .catch(err => {
          this.loginText = '登录失败'
          this.loginStatus = 'fail'
        })
    },
    getPwByAccount() {
      if (localStorage[this.account])
        this.pw = localStorage[this.account]
    }
  }
}

</script>

<style lang="scss" scoped>
#userLoginPage {
  background-color: #fff;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  font-size: 12px;
  background: url('../assets/loginBackground.jpg') center / cover;
  background-clip: border-box;
  main {
    border-radius: 8px;
    position: absolute;
    right: calc(35% - 250px);
    top: calc(50% - 175px);
    background: rgba(255, 255, 255, .1);
    width: 500px;
    height: 350px;
    h2 {
      color: white;
      padding-top: 66px;
      font-weight: normal;
      letter-spacing: 3px;
      line-height: 24px;
      font-size: 24px;
      letter-space: 4px;
      width: 100%;
      text-align: center;
      margin: 0;
    }
    >input {
      display: block;
      width: 360px;
      margin: 0 auto;
      background-color: transparent;
      font-size: 12px;
      outline: none;
      border: none;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid rgba(255, 255, 255, .15);
      padding-left: 10px;

      &::-webkit-input-placeholder {
        color: #4d5b6b;
      }

      &:first-of-type {
        color: white;
        margin-top: 76px;
      }
      &:last-of-type {
        color: white;
        margin-top: 24px;
      }
    }
    div.rem-pw-wraper {
      display: inline-block;
      margin: 28px 0px 0px 65px;
      span {
        width: 9px;
        height: 9px;
        display: inline-block;
        box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, .5);
        cursor: pointer;
      }
      a {
        font-size: 10px !important;
        color: rgba(255, 255, 255, .5);
        cursor: pointer;
        margin-left: 6px;
      }
    }
    a.login-btn {
      display: inline-block;
      color: white;
      font-size: 12px;
      width: 80px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: #4cafff;
      border-radius: 3px;
      position: absolute;
      right: 0;
      margin: 20px 65px 0 0;
      cursor: pointer;
    }
  }
}

.rem-pw {
  background: url('../assets/remember.png') no-repeat center;
}

div.shadow-wraper {
  width: 500px;
  height: 150px;
  position: absolute;
  top: calc(50% + 177px);
  background: url('../assets/login_shadow.png') no-repeat;
  right: calc(35% - 250px);
}

.msg {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  color: white;
}

.return-to-system{
  opacity: 0.5;
  position: absolute;
  right: 75px;
  bottom: 25px;
  span{
    display: inline-block;
    width: 12px;
    height: 10px;
    margin-right: 7px;
    background-image: url(../assets/colorBar/fold.png);
  }
  a{
    color: white;
    cursor: pointer;
  }
}
</style>

