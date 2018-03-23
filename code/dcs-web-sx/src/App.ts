import Vue from 'vue'
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import WithRender from './App.html?style=./App.scss'

import ZEarth from "./components/z-earth/ZEarth"
import UserLogin from './components/user-login/UserLogin'
import MainMenu from "./components/main-menu/MainMenu"
import GlobalDatetime from './components/global-datetime/GlobalDatetime'
import TyphTimeline from './components/typhTimeline/typh-timeline-entry/TyphTimelineEntry'
import PopupEntry from './components/globalPopup/popup-entry/PopupEntry'
import EmergencyMonitor from './components/emergency-monitor/EmergencyMonitor'
import ToolBox from './components/tool-box/ToolBox'
import AerialModel from './components/aerial-model/AerialModel'
import { UserClient } from './util/clientHelper'

let userId, userPwd;

@WithRender
@Component({
  components: {
    ZEarth,
    MainMenu,
    GlobalDatetime,
    PopupEntry,
    EmergencyMonitor,
    ToolBox,
    AerialModel,
  }
})
export default class App extends Vue {
  @Getter('systemStore/loginUser_global') loginUser_global
  @Getter('systemStore/systemTitle_global') systemTitle_global
  @Getter('systemStore/disasterTypeSelected_global') disasterTypeSelected_global
  @Getter('systemStore/typhTimelineStatus_global') typhTimelineStatus_global
  @Action('emergencyStore/initRelateorgs_global') initRelateorgs 
  @Action('emergencyStore/initDeps_global') initInfluences   

  typhTimelineView: any = null
  userLoginView: any = null


  @Watch('disasterTypeSelected_global')
  ondisasterTypeSelected_globalChanged(val: any, oldVal: any): void {
    console.info(val)
    if (val === 'tide') {
      this.typhTimelineView = TyphTimeline
    } else {
      if (oldVal === 'tide') {
        let entry: any = document.querySelector('#TyphTimelineEntry')
        entry.style.transition = 'transform .3s ease-in-out'
        if (this.typhTimelineStatus_global === 'search')
          entry.style.transform = 'translateY(50px)'
        else
          entry.style.transform = 'translateY(173px)'
        setTimeout(() => {
          this.typhTimelineView = null
        }, 400)
      }
    }
  }

  @Action('systemStore/storeUserLogin_global') storeUserLogin_global
  async login() {
    let res = await fetch(`http://10.148.83.228:8086/user/login/nickname/user/post/,/?nickName=${sessionStorage.account}&password=${sessionStorage.password}`);    
    let msg = await res.json();
    if(msg.result !== 'S_OK') return false; 
    let data = msg.tagObject;
    this.storeUserLogin_global(Object.assign({ password: sessionStorage.password }, data));
    return true;
  }
  @Watch('loginUser_global')
  onloginUser_globalChanged(val: any, oldVal: any): void {
    userId = val.userId
    userPwd = val.password
  }

  async created () {
    if(sessionStorage.account) {
      let res = await this.login();
      if(!res) {
        this.userLoginView = UserLogin
      } else {
        this.userLoginView = null
      }
    }
    else
      this.userLoginView = UserLogin

    this.initRelateorgs();
    this.initInfluences();    
  }
}

const logoutFn = () => {
  UserClient.logout(userId, userPwd)
}
window.onunload = logoutFn
window.onbeforeunload = logoutFn