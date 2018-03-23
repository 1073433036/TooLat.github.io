import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import SystemStore from './systemStore'
import DecisionStore from './decisionStore'
import ModelStore from './modelStore'
import InfoManageStore from './infoManageStore'

export default new Vuex.Store({
  modules: {
    systemStore: new SystemStore(),
    decisionStore: new DecisionStore(),
    modelStore:new ModelStore(),
    infoManageStore:new InfoManageStore()
  }
});
