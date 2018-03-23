import { Mutation, MutationTree } from "vuex";
import { State } from "./state";

export function TOGGLE_PLAN_MODEL (state: State, status) {
  state.planModel = status;
}

export function toggleInfoPublish (state: State, action) {
  state.isInfoPublishOn = action 
}

export function toggleEventDeal(state: State, action) {
  state.isEventDealOn = action
}

export function toggleEmergencyPlan(state: State) {
  state.isEmergencyPlanOn = !state.isEmergencyPlanOn
}


export function INIT_TEMP_NAMES (state: State, { data, status }) {
  state.tempNames = {};
  if(!data || !data.length) return;
  data.map((name, index) => {
    state.tempNames[index] = { text: name, new: false };  //new判断是否为新增模板
  });
  state.tempNames = { ...state.tempNames };
  state.addTempPopup = status;     //status: false:启动预案  true:预案库
}

export function INIT_RELATEORGS (state: State, data) {
  if(!data || !data.length) {
    state.relateorgs = {};
    return;
  }

  let obj = {};
  for(let i in data) {
    const id = data[i].id;
    obj[id] = data[i].name;
  }
  state.relateorgs = { ...obj };
}

export function INIT_DEPS (state: State, data) {
  let obj = {};
  for(let i in data) {
    const id = data[i].id;
    obj[id] = data[i].name;
  }
  state.influences = { ...obj };
}

export function INIT_TYPES (state: State, data) {
  state.types = data;
}

export function INIT_ADD_DUITES (state: State, data) {
  if(!data || !data.length) {
    state.allDuties = {};
    return;
  }
  let obj = {};
  for(let duty of data) {
    obj[duty.id] = duty.name;
  }
  state.allDuties = { ...obj };
}

export function INIT_LEVELS (state: State, data) {
  if(!data || !data.length) {
    state.levels = null;
    return;
  }
  state.levels = { ...data };
}

export function INIT_TEMPLATE (state: State, data) {
  state.template = { ...data };
  const tempNames = state.tempNames;
  for(let i in tempNames) {
    if(data.name === tempNames[i].text) {
      state.selectedTempNameKey = i;
      break;
    }
  }
}

export function INIT_DUTIES (state: State, data) {
  if(!data || !data.length) {     //未找到时返回null
    state.duties = {};
    state.currentDuties = {};
    return;
  }
  let obj = {};
  for(let duty of data) {
    obj[duty.id] = duty.name;
  }
  state.duties = { ...obj };
  state.currentDuties = { ...obj };
}

export function TOGGLE_DUTY (state: State, key) {
  if(state.currentDuties[key]) delete state.currentDuties[key];
  else state.currentDuties[key] = state.duties[key];
  state.currentDuties = { ...state.currentDuties };
}
export function DELETE_DUTY (state: State, key) {
  delete state.currentDuties[key];
  state.currentDuties = { ...state.currentDuties };
}
export function ADD_NEW_DUTY (state: State, newDuty) {
  if(!newDuty) return;
  state.currentDuties[Math.random()] = newDuty;
  state.currentDuties = { ...state.currentDuties };
}

export function TOGGLE_TEMP_DUTY (state: State, key) {
  if(state.duties[key]) delete state.duties[key];
  else state.duties[key] = state.allDuties[key];
  state.duties = { ...state.duties };
}
export function DELETE_TEMP_DUTY (state: State, key) {
  delete state.duties[key];
  state.duties = { ...state.duties };
}

export function DO_REFRESH_PLAN (state: State, action) {
  state.refreshPlan = action;
}

export function doRefreshOnlinePlan (state: State, action) {
  state.refreshOnlinePlan = action;
}

export function INIT_NEW_TEMPLATE (state: State, newTempInfo) {
  let tempNames = state.tempNames;
  const keyArr = Object.keys(tempNames),
    index = Number(keyArr[keyArr.length - 1]) + 1;
  tempNames[index] = { text: newTempInfo.name, new: true };
  state.selectedTempNameKey = String(index);
  state.tempNames = { ...tempNames };

  state.template = { ...newTempInfo };
  state.levels = state.duties = {};
}

export function TOGGLE_NEW_TEMPLATE (state: State, { name, level = 1 }) {
  state.template = {
    name: name,
    level: level,
    measure: state.types[0],
    upMsg: null,
    downMsg: null,
    finishMsg: null,
    relateOrdIds: [],
    dutyIds: [],
    influenceIds: []
  };
  const tempNames = state.tempNames;
  for(let i in tempNames) {
    if(name === tempNames[i].text) {
      state.selectedTempNameKey = i;
      break;
    }
  }
  state.levels = state.duties = {};
}

export function toggleWaterLevelPopup (state: State, action: boolean) {
  state.isWaterLevelPanelDisplay = action
}

export function storeWaterLevelData (state: State, data: object) {
  state.waterLevelData = data
}

export function storeWaterLevelPosition (state: State, data) {
  state.waterLevelPosition = data 
}

export function toggleWaterLevelTablePopup (state: State, action: boolean) {
  state.waterLevelTablePopup = action 
}

export default <MutationTree<State>> {
  TOGGLE_PLAN_MODEL,
  toggleEventDeal,
  toggleEmergencyPlan,

  INIT_TEMP_NAMES,
  INIT_RELATEORGS,
  INIT_DEPS,
  INIT_TYPES,
  INIT_ADD_DUITES,
  INIT_LEVELS,
  INIT_TEMPLATE,
  INIT_DUTIES,
  TOGGLE_DUTY,
  DELETE_DUTY,
  ADD_NEW_DUTY,
  TOGGLE_TEMP_DUTY,
  DELETE_TEMP_DUTY,
  DO_REFRESH_PLAN,
  doRefreshOnlinePlan,

  INIT_NEW_TEMPLATE,
  TOGGLE_NEW_TEMPLATE,

  toggleInfoPublish,
  storeWaterLevelData,
  storeWaterLevelPosition,
  toggleWaterLevelPopup,
  toggleWaterLevelTablePopup
}