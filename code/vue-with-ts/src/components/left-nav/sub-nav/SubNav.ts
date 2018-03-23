import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './SubNav.html?style=./SubNav.scss'

@WithRender
@Component
export default class SubNav extends Vue {
  @Getter('systemStore/name_global') name_global
  @Action('systemStore/changeName_global') changeName_global

  changeName() {
    this.changeName_global('AAAAAAAAA')
  }
}