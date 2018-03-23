import Vue from 'vue'
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import WithRender from './App.html?style=./App.scss'

import ProductEntry from './components/product-entry/ProductEntry'
import LoginPage from './components/login-page/LoginPage';
import HeaderTitle from './components/header-title/HeaderTitle';
import TopNav from './components/top-nav/TopNav';
import LeftnavAnalyze from './components/leftnav-analyze/LeftnavAnalyze';
import Zmap from './components/z-map/Zmap'

import ToolBar from './components/tool-bar/ToolBar'
import ManagecenterPopup from "./components/managecenter-popup/ManagecenterPopup"
import DemandWarning from './components/GlobalPopup/demand-warning/DemandWarning'

@WithRender
@Component({
  components: {
    LoginPage,
    HeaderTitle,
    ProductEntry,
    TopNav,
    LeftnavAnalyze,
    Zmap,
    ToolBar,
    DemandWarning,
    ManagecenterPopup,
  }
})

export default class App extends Vue {
  @Getter('systemStore/userInfo_global') userInfo_global

  leftNavView: any = null

  mounted() {
    
  }
    
}