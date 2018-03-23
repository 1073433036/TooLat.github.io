export const warningTimes = state => state.warningTimes

export const warningEles = state => state.elements

export const warningTownsData = state => state.warningTownsData

export const isWarningAnalysis = state => state.isWarningAnalysis

export const statTableShow = state => state.statTableShow

export const stationWarningShow = state => state.stationWarningShow

export const stationWarningSum = state => state.stationWarningSum

export const hasWarningTimes = state => {
  let sum = 0;
  for(let tm of state.elements.rain.times) {
    tm.isWarning && sum++;
  }
  return sum;
}

export const hasFlowConvection = state => {
  let bool = false;
  for(let i in state.elements) {
    if(i === 'rain') {
      for(let tm of state.elements[i].times) {
        if(tm.isWarning) {
          bool = true;
          break;
        }
      }
    } else {
      if(state.elements[i].isWarning) {
        bool = true;
        break;
      }
    }
  }

  return bool;
}
