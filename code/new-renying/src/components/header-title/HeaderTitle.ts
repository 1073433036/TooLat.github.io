import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './HeaderTitle.html?style=./HeaderTitle.scss'

@WithRender
@Component
export default class HeaderTitle extends Vue {
  @Getter('systemStore/userInfo_global') userInfo_global

  // @Watch('userInfo_global')
  // isuserInfo_globalChanged(val, oldVal) {
  //   console.log(val)
  // }
}