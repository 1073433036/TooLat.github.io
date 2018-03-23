import { Getter, GetterTree } from 'vuex'
import { State } from './state'
export const infoPopupStatus = (state: State) => {
  return state.infoPopupStatus;
}
export default <GetterTree<State, any>> {
  infoPopupStatus
}
