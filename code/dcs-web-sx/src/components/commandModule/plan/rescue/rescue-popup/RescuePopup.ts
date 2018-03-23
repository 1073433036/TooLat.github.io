import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './RescuePopup.html?style=./RescuePopup.scss'

@WithRender
@Component
export default class RescuePopup extends Vue {
  @Prop() info
  @Prop() closeFunc

  attr: any = {
    teamname: '队伍名称',
    name: '单位名称',
    address: '单位地址',
    people: '人数',
    manager: '负责人',
    cellphone: '手机号码',
    phone: '联系电话',
    team_contact: '队伍联系人',
    team_cellphone: '队伍联系人手机',
    team_phone: '队伍联系人电话'
  }
}