import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './StationRealPopup.html?style=./StationRealPopup.scss'

@WithRender
@Component
export default class StationRealPopup extends Vue {
  @Getter('monitorStore/realPopup_global') realPopup
}