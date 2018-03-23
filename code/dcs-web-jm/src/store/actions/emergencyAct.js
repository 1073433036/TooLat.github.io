import * as types from '../mutation-types'

export const resetEmergResStatus = ({ commit }, { type, data }) => {
  commit(types.RESET_EMERG_RES_STATUS, { type, data });
}
