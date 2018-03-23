import Vue from 'vue'
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import WithRender from './LeftNav.html?style=./LeftNav.scss'

import SubNav from './sub-nav/SubNav'

@WithRender
@Component({})
export default class LeftNav extends Vue {
    subView: any = null

    toggleSubView() {
      this.subView = this.subView ? null : SubNav
    }
}