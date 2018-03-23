import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './SummaryPopup.html?style=./SummaryPopup.scss'

@WithRender
@Component
export default class SummaryPopup extends Vue {
  @Prop() closeFunc
  @Prop() planInfo
  @Getter('systemStore/loginUser_global') userInfo
  @Action('emergencyStore/doRefreshPlan_global') doRefreshPlan

  content: string = null

  async finishPlan() {
    const planId = this.planInfo.id,
      userId  = this.userInfo.userId;
    let res = await fetch(`http://10.148.83.228:8086/emergency/plan/finish/user/post/,/post?planId=${planId}&userId=${userId}&content=${this.content}`);    
    let msg = await res.json();
    alert(msg.description);
    if(msg.result === 'S_OK') {
      this.doRefreshPlan(true);
      this.closeFunc();
    }
  }

}