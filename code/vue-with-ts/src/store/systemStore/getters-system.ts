import { Getter, GetterTree } from "vuex";
import { State } from './state-system'

export const name_global = (state: State) => state.name
// export function name_global(state: State) {
//   return state.name
// }

export default <GetterTree<State, any>>{
  name_global,
}