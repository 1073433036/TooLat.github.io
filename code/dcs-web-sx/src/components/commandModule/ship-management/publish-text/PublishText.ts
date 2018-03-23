import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './PublishText.html?style=./PublishText.scss'
import { FisherClient } from "../../../../util/clientHelper";

import SelectTown from "../../../commonCompt/select-town-or-department/SelectTownOrDepartment"


@WithRender
@Component({
  components: {
    SelectTown
  }
})
export default class PublishText extends Vue {
  @Prop({ default: Function })
  closeSelf: Function
  @Prop({default: Function})
  publishSuccess: Function 


  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  

  textContent: string = ''
  publshTargetSelected: Array<number> = []

  async created() {
    let res = await FisherClient.getTextTemplate()
    this.textContent = res[0].content 
    this.textContent += ' (回复操作: '
    this.textContent += res[0].finishTips + ';'
    this.textContent += res[0].unfinishTips + ')'
  }

  townSelectedChange(data) {
    this.publshTargetSelected = []
    for(let i in data) {
      this.publshTargetSelected.push(data[i])
    }
  }

  async publishContent() {
    if(this.publshTargetSelected.length == 0 ){
      this.toggleOprateTip_global({tip: true, text: '请选择镇'})
    }
    let res = await FisherClient.startPublish(this.publshTargetSelected, this.textContent)
    if(res) {
      this.toggleOprateTip_global({tip: true, text: '发布成功'})
      this.publishSuccess()
    }
    else {
      this.toggleOprateTip_global({tip: false, text: '已有正在进行的流程'})
    }
  } 

}



