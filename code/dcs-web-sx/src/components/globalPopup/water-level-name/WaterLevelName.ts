import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './WaterLevelName.html?style=./WaterLevelName.scss'

@WithRender
@Component
export default class WaterLevelName extends Vue {
  @Getter('systemStore/getWaterLevelName_global') getWaterLevelName_global
}