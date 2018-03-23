import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './PointNamePopup.html?style=./PointNamePopup.scss'

@WithRender
@Component
export default class PointNamePopup extends Vue {
  @Getter('basicInfoStore/pointTitle_global') pointTitle_global
}