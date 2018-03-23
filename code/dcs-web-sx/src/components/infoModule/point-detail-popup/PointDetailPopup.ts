import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './PointDetailPopup.html?style=./PointDetailPopup.scss'

@WithRender
@Component
export default class PointDetailPopup extends Vue {
  @Getter('basicInfoStore/poiDetail_global') poiDetail
  @Action('basicInfoStore/showMaterialList_global') showMaterialList
  @Action('basicInfoStore/hidePoiDetailPopup_global') hidePoiDetailPopup_global
  @Action('basicInfoStore/clearSelectedPri_global') clearSelectedPri_global

  closePopup() {
    this.hidePoiDetailPopup_global();
    this.clearSelectedPri_global();
  }
}