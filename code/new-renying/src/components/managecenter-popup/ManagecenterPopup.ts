import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ManagecenterPopup.html?style=./ManagecenterPopup.scss'
import ProductsClass from './products-class/ProductsClass'
import BusinessClass from './business-class/BusinessClass'
import AddClass from './add-class/AddClass'

@WithRender
@Component
export default class ManagecenterPopup extends Vue {
  classSelected: string = 'product';
  currentView: any = ProductsClass
  addClassView: any = null;

  toggleClass(key){
    if (key === this.classSelected) return
    this.classSelected = key
    this.currentView = key  === 'product' ? ProductsClass : BusinessClass
  }

  toggleClassPopup(){
    this.addClassView = this.addClassView ? null : AddClass;
  }
  
}