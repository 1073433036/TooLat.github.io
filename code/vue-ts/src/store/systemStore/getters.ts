import { Getter, GetterTree } from 'vuex'
import { State } from './state'

export const message_global = (state: State): string => state.message

export default <GetterTree<State, any>> {
  message_global
}