import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './LoginPage.html?style=./LoginPage.scss'

import { userClient } from '../../util/clientHelper'

let layer = null

@WithRender
@Component
export default class LoginPage extends Vue {
  @Action('systemStore/changeUserInfo_global') changeUserInfo_global
  
  placeholderUser: string = '账号'
  placeholderPwd: string = '密码'
  username: string = null
  password: string = null
  displayMsg: boolean = false
  isLoginSuccessed: boolean = true

  async login() {
    let data = await userClient.login(this.username, this.password)
    if (data) {
      this.isLoginSuccessed = false
      this.changeUserInfo_global(data)
    } else {
      this.displayMsg = true
    }
  }
}