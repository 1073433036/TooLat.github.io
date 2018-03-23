import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './PlanModel.html?style=./PlanModel.scss'

// import Emergency from './emergency/Emergency'
import OnlinePlan from './online-plan/OnlinePlan'
import LibPlan from './lib-plan/LibPlan'
import Experts from './experts/Experts'
import Rescue from './rescue/Rescue'

let view: any = {
  plan: OnlinePlan,
  template: LibPlan,
  expert: Experts,
  rescue: Rescue
}

@WithRender
@Component
export default class PlanPopup extends Vue {
  @Action('emergencyStore/togglePlanModel_global') togglePlanModel_global
  @Action('emergencyStore/initAllDuties_global') initAllDuties_global

  currentView: any = false
  tabOptionSelected: 'plan' | 'template' | 'expert' | 'rescue' = 'plan'
  
  selectTabOption(option) {
    this.tabOptionSelected = option;
    this.currentView = view[option];
  }

  mounted () {
    this.currentView = OnlinePlan;
  }

}