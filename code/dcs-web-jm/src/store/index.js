import Vue from 'vue'
import Vuex from 'vuex'

import ZearthStore from './modules/ZearthStore'
import systemStore from './modules/systemStore'
import modelStore from './modules/modelStore'
import realTimeStore from './modules/realTimeStore'
import geographyStore from './modules/geographyStore'
import dateStore from './modules/dateStore'
import modelPoiStore from './modules/modelPoiStore'
import typhStore from './modules/typhStore'
import warningStore from './modules/warningStore'
import emergencyStore from './modules/emergencyStore'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        typhStore,
        ZearthStore,
        modelStore,
        realTimeStore,
        geographyStore,
        dateStore,
        modelPoiStore,
        systemStore,
        warningStore,
        emergencyStore
    },
})
