import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './TyphMouseOver.html?style=./TyphMouseOver.scss'
import fetchJsonp from 'fetch-jsonp'
import * as moment from 'moment'

@WithRender
@Component
export default class TyphMouseOver extends Vue {
  // @Getter('systemStore/typhMouseOverName_global') typhMouseOverName_global
  @Getter('systemStore/typhMouseOverData_global') typhMouseOverData_global
  @Getter('systemStore/typhMouseOverPos_global') typhMouseOverPos_global

  get posY() {
    if (this.typhMouseOverPos_global.y < 345)
      return this.typhMouseOverPos_global.y + 20
    else
      return this.typhMouseOverPos_global.y - 345
  }

  get datetime() {
    if (this.typhMouseOverData_global.leadtime)
      return moment(this.typhMouseOverData_global.datetime).add(this.typhMouseOverData_global.leadtime, 'hours')
        .format('YYYY-MM-DD HH:mm:00')
    else 
      return this.typhMouseOverData_global.datetime
  }

  /* @Watch('typhMouseOverData_global')
  ontyphMouseOverData_globalChanged(val: any, oldVal: any): void {
    console.info(val)
  }
 */
  typhName: string = ''
  typhEnName: string = ''
  typhIntId: string = ''

}



