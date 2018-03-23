export const emergencyMenu = state => state.list

export const hasWarning = state => {
  let list = state.list;
  let bool = false;
  for(let i in list) {
    for(let l in list[i].levels) {
      if(list[i].levels[l].status) {
        bool = true;
        break;
      }
    }
    if(bool)
      break;
  }
  return bool;
}
