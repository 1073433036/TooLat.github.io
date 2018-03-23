import * as actions from '../actions/ZearthAct.js'
import * as getters from '../getters/ZearthGetters.js'

import {
    STORE_TERRAIN,
    CHANGE_TILELAYER,
    DRAW_REGION_BOUND,
    TOGGLE_TERRAIN,
    TOGGLE_EARTH_CURSOR
} from '../mutation-types'

import { Helper } from '../../util/Helper'

const state = {
    terrain: {},
    // bounds: {  //台山边界
    //   left: 112.29764,
    //   right: 113.04488,
    //   top: 22.445173,
    //   bottom: 21.567259,
    //   width: 1000,
    //   height: 1000
    // },
    bounds: {
      left: 111.99835968017578,
      right: 113.2580337524414,
      top: 22.85578155517578,
      bottom: 21.445781707763672,
      width: 1000,
      height: 1000
    },

    boundLayers: {},

    is3DEarth: false,

    isGrab: true, //地图鼠标指针样式标识
    isImgGrab: true,
}

const mutations = {
    [STORE_TERRAIN](state, terrainInfo) {
        state.terrain = terrainInfo;
    },

    [TOGGLE_TERRAIN](state, bool) {
        viewer.terrainProvider = bool ? state.terrain.hasTerrain : state.terrain.noTerrain;
    },

    [CHANGE_TILELAYER](state, tileLayer) {
        let helper = new Helper(viewer);
        helper.changeTileLayer(tileLayer);
        helper = null;
        setTimeout(() => {
            console.log(viewer.scene.mode);
            state.is3DEarth = viewer.scene.mode === 3;
        }, 4000);
    },

    [DRAW_REGION_BOUND](state, boundary) {
        let helper = new Helper(viewer);

        if (state.boundLayers.layers && state.boundLayers.layers.length) {
            for(let layer of state.boundLayers.layers) {
              helper.removeEntity(layer);
            }
            delete state.boundLayers.layers;
            delete state.boundLayers.currentViewLayer;
        }

        let boundLayers = [];
        let len = 0,
            currentView = null;
        if(Array.isArray(boundary)) {
          for(let bound of boundary) {
            let lnglats = [];
            for(let point of bound) {
              lnglats.push(point.x, point.y);
            }
            let layer = helper.addPolyline(lnglats, 2, 'red.5');
            boundLayers.push(layer);
            if(lnglats.length > len) {
              len = lnglats.length;
              currentView = layer;
            }
          }
        } else {
          let bounds = JSON.parse(boundary);
          for(let bound of bounds) {
            let lnglats = [];
            for(let point of bound) {
              lnglats.push(point[0], point[1]);
            }
            let layer = helper.addPolyline(lnglats, 2, 'red.5');
            boundLayers.push(layer);
            if(lnglats.length > len) {
              len = lnglats.length;
              currentView = layer;
            }
          }
        }

        state.boundLayers.layers = boundLayers;
        state.boundLayers.currentViewLayer = currentView;
        viewer.flyTo(currentView, { duration: 1 });

        helper = null;
    },

    [TOGGLE_EARTH_CURSOR](state, { key, value }) {
        state[key] = value;
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
