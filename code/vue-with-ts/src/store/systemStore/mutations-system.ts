import { Mutation, MutationTree } from "vuex";
import { State } from "./state-system";

export function changeName(state: State, name: string) {
  state.name = name
}

export default <MutationTree<State>>{
  changeName,
}