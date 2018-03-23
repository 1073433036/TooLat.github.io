import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './EleTimeTip.html?style=./EleTimeTip.scss'

@WithRender
@Component
export default class EleTimeTip extends Vue {
  @Getter('systemStore/weatherElementTime_global') weatherElementTime_global
}