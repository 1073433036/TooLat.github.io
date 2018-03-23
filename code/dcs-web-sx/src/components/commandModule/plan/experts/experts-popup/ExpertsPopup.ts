import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ExpertsPopup.html?style=./ExpertsPopup.scss'

@WithRender
@Component
export default class ExpertsPopup extends Vue {
  @Prop() info
  @Prop() closeFunc

  ExpertsInfo: any = {
    unit: '工作单位',
    qualifications: '最后学历',
    degree: '最后学位',
    profession: '所学专业',
    title: '职称'
  }
}