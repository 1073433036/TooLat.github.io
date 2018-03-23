import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './BusinessClass.html?style=./BusinessClass.scss'

@WithRender
@Component
export default class BusinessClass extends Vue {

}