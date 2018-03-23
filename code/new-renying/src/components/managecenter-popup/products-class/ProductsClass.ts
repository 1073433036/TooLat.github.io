import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ProductsClass.html?style=./ProductsClass.scss'

@WithRender
@Component
export default class ProductsClass extends Vue {

}