import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './UserLogin.html?style=./UserLogin.scss'
import { UserClient } from '../../util/clientHelper'

@WithRender
@Component
export default class UserLogin extends Vue {
  @Getter('systemStore/loginPage_global')  loginPage
  @Action('systemStore/storeUserLogin_global') storeUserLogin
  @Action('systemStore/toggleLoginPage_global') toggleUserPage

  account: string = null
  password: string = null
  remPw: boolean = false
  loginTip: boolean = false

  async login() {
    let res = await fetch(`http://10.148.83.228:8086/user/login/nickname/user/post/,/?nickName=${this.account}&password=${this.password}`);
    let msg = await res.json();
    if(msg.result !== 'S_OK') {
      this.loginTip = true;
      return;
    }
    let data = msg.tagObject;
    this.loginSucess(data);
  }
  loginSucess(data) {
    if(this.loginTip) this.loginTip = false;
    this.storeUserLogin(Object.assign({ password: this.password }, data));
    this.toggleUserPage(false);
    sessionStorage.account = data.name;
    sessionStorage.password = this.password;
    sessionStorage.userId = data.userId;
    if(this.remPw) {
      localStorage.account = data.name;
      localStorage.password = this.password;
      localStorage.userId = data.userId;
    } 
    else {
      if(!localStorage.account) return;
      localStorage.removeItem('account');
      localStorage.removeItem('password');
    }
  }

  mounted() {
    if(localStorage.account) {
      this.account = localStorage.account;
      this.password = localStorage.password;
      this.remPw = true;
    }
  }
}