import * as types from '../mutation-types'

export const updateDate = ({ commit }, datetime) => {
  commit(types.UPDATE_DATE, new Date(`${datetime.date} ${datetime.hour}:${datetime.minute}`));
}
