export const regionBounds = state => state.bounds

export const boundLayers = state => state.boundLayers

export const is3DEarth = state => state.is3DEarth

export const isGrab = state => {
  return state.isGrab && state.isImgGrab;
}
