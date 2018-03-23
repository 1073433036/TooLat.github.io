import * as types from '../mutation-types'

export const storeTerrain = ({ commit }, terrain) => {
    commit(types.STORE_TERRAIN, terrain);
}

export const toggleTerrain = ({ commit }, bool) => {
    commit(types.TOGGLE_TERRAIN, bool);
}

export const changeTileLayer = ({ commit }, tileLayerType) => {
	commit(types.CHANGE_TILELAYER, tileLayerType)
}

export const drawBound = ({ commit }, boundary) => {
	commit(types.DRAW_REGION_BOUND, boundary);
}

export const toggleEarthCursor = ({ commit }, { key, value }) => {
  commit(types.TOGGLE_EARTH_CURSOR, { key, value });
}
