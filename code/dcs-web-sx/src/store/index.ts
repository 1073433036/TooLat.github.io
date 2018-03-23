import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex)

import SystemStore from './systemStore'
import ModelStore from './modelStore'
import EmergencyStore from './emergencyStore'
import BasicInfoStore from './basicInfoStore'
import MonitorStore from './monitorStore'

export default new Vuex.Store({
  modules: {
    systemStore: new SystemStore(),
    emergencyStore: new EmergencyStore(),
    modelStore: new ModelStore(),
    basicInfoStore: new BasicInfoStore(),
    monitorStore: new MonitorStore(),
  }
})