import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './VideoPointAddress.html?style=./VideoPointAddress.scss'

@WithRender
@Component
export default class VideoPointAddress extends Vue {
  @Getter('systemStore/getVideoAddress_global') getVideoAddress_global

  rightClick() {
    window.event.returnValue = false
    return false
  }
}