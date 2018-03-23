import { Store, ActionTree, ActionContext } from "vuex";
import { State } from './state';
import * as types from '../mutation-types'

//开启关闭窗口
export function togglePlanModel_global(store: ActionContext<State, any>, status) {
  store.commit(types.TOGGLE_PLAN_MODEL, status);
}

export function toggleInfoPublish_global(store: ActionContext<State, any>, action) {
  store.commit('toggleInfoPublish', action)
}

export function toggleEventDeal_global(store: ActionContext<State, any>, action) {
  store.commit('toggleEventDeal', action)
}

export function toggleEmergencyPlan_global (store: ActionContext<State, any>) {
  store.commit('toggleEmergencyPlan')
}

/* 在线预案 */
//初始化 获取所有预案名称
export async function initTempNames_global(store: ActionContext<State, any>, status: boolean) {
  let res = await fetch(`http://10.148.83.228:8086/plan/template/names/user/post/,/post?random=${Math.random()}`);
  let msg: any = await res.json();

  let data: Array<string> = [];
  try {
    data = msg.tagObject;
  }
  catch (err) {
    console.error('模板名称获取失败');
    return;
  }
  store.commit(types.INIT_TEMP_NAMES, { data, status });
  //initRelateorgs_global(store);
  if (data && data.length)
    initLevels_global(store, { name: data[0], newTemp: false });
}

//获取所有部门单位
export async function initRelateorgs_global(store: ActionContext<State, any>) {
  let res = await fetch(`http://10.148.83.228:8086/plan/orgs/list/user/post/,/`);
  let msg: any = await res.json();

  let data: Array<any> = [];
  try {
    data = msg.tagObject;
  }
  catch (err) {
    console.error('部门单位获取失败');
  }
  store.commit(types.INIT_RELATEORGS, data);
}

//获取所有单位类型
export async function initDeps_global(store: ActionContext<State, any>) {
  let res: any = await fetch(`http://10.148.83.228:8086/plan/deps/user/post/,/`);
  let msg: any = await res.json();
  if (msg.result !== 'S_OK') return;
  let data: Array<any> = msg.tagObject;
  store.commit(types.INIT_DEPS, data);
}

//获取所有预案类型
export async function initTypes_global(store: ActionContext<State, any>) {
  let res: any = await fetch(`http://10.148.83.228:8086/plan/mea/name/list/user/post/,/`);
  let msg: any = await res.json();
  if (msg.result !== 'S_OK') return;
  let data: Array<any> = msg.tagObject;
  store.commit(types.INIT_TYPES, data);
}

//获取当前模板预案等级
export async function initLevels_global(store: ActionContext<State, any>, { name, newTemp }) {
  if (newTemp) {
    store.commit(types.TOGGLE_NEW_TEMPLATE, { name });
    return;
  }
  let res = await fetch(`http://10.148.83.228:8086/plan/template/get/levels/user/post/,/post?name=${name}&random=${Math.random()}`);
  let msg: any = await res.json();

  let data: Array<any> = [];
  try {
    data = msg.tagObject;
  }
  catch (err) {
    console.error('预案等级获取失败');
  }
  data.sort();
  store.commit(types.INIT_LEVELS, data);
  initTemplate_global(store, { name, level: data[0] });
}

//获取所有工作备忘    //预案库使用
export async function initAllDuties_global(store: ActionContext<State, any>) {
  let res = await fetch(`http://10.148.83.228:8086/plan/duty/list/user/post/,/post?random=${Math.random()}`);
  let msg: any = await res.json();

  let data: Array<any> = [];
  try {
    data = msg.tagObject;
  }
  catch (err) {
    console.error('所有工作备忘获取失败');
  }
  store.commit(types.INIT_ADD_DUITES, data);
}

//初始化模板数据
export async function initTemplate_global(store: ActionContext<State, any>, { name, level }) {
  let res = await fetch(`http://10.148.83.228:8086/plan/template/get/user/post/,/post?name=${name}&level=${level}&random=${Math.random()}`);
  let msg: any = await res.json();

  let data;
  try {
    data = msg.tagObject;
  }
  catch (err) {
    console.error('预案信息获取失败');
  }
  if (!data) store.commit(types.TOGGLE_NEW_TEMPLATE, { name, level });       //无数据或切换预案库到新添加模板时
  else {
    store.commit(types.INIT_TEMPLATE, data);
    initDuties_global(store, data.id);
  }
}

//初始化模板工作备忘目录
export async function initDuties_global(store: ActionContext<State, any>, planId) {
  let res = await fetch(`http://10.148.83.228:8086/plan/planduty/get/user/post/,/post?planId=${planId}&random=${Math.random()}`);
  let msg: any = await res.json();

  let data: Array<any> = [];
  try {
    data = msg.tagObject;
  }
  catch (err) {
    console.error('工作备忘获取失败');
  }
  store.commit(types.INIT_DUTIES, data);
}

//切换预案工作备忘选择
export function toggleDuty_global(store: ActionContext<State, any>, key) {
  store.commit(types.TOGGLE_DUTY, key);
}
//删除预案所选工作备忘
export function deleteDuty_global(store: ActionContext<State, any>, key) {
  store.commit(types.DELETE_DUTY, key);
}
//添加预案工作备忘
export function addNewDuty_global(store: ActionContext<State, any>, newDuty) {
  store.commit(types.ADD_NEW_DUTY, newDuty);
}

//切换模板工作备忘选择
export function toggleTempDuty_global(store: ActionContext<State, any>, key) {
  store.commit(types.TOGGLE_TEMP_DUTY, key);
}
//删除模板所选工作备忘
export function deleteTempDuty_global(store: ActionContext<State, any>, key) {
  store.commit(types.DELETE_TEMP_DUTY, key);
}

//是否刷新当前预案
export function doRefreshPlan_global(store: ActionContext<State, any>, action) {
  store.commit(types.DO_REFRESH_PLAN, action);
}

export function doRefreshOnlinePlan_global(store: ActionContext<State, any>, action) {
  store.commit('doRefreshOnlinePlan', action);
}

/* 预案库 */
//新增预案模板
export function addNewTempName_global(store: ActionContext<State, any>, newTempInfo) {
  store.commit(types.INIT_NEW_TEMPLATE, newTempInfo);
}

export function storeWaterLevelData_global(store: ActionContext<State, any>, data) {
  store.commit('storeWaterLevelData', data)
}

export function storeWaterLevelPosition_global (store: ActionContext<State, any>, data) {
  store.commit('storeWaterLevelPosition', data)
}

export function toggleWaterLevelPopup_global (store: ActionContext<State, any>, action) {
  store.commit('toggleWaterLevelPopup', action)
}

export function toggleWaterLevelTablePopup_global (store: ActionContext<State, any>, action) {
  store.commit('toggleWaterLevelTablePopup', action)
}
/* 预案总结 */
/*export function toggleSummaryPopup_global (store: ActionContext<State, any>, { status, info }) {
  store.commit(types.TOOGLE_SUMMARY_POPUP, { status, info });
}*/

export default <ActionTree<State, any>>{
  togglePlanModel_global,
  toggleEventDeal_global,
  toggleEmergencyPlan_global,

  initTempNames_global,
  initRelateorgs_global,
  initDeps_global,
  initTypes_global,
  initAllDuties_global,
  initLevels_global,
  initTemplate_global,
  //initDuties_global,
  toggleDuty_global,
  deleteDuty_global,
  addNewDuty_global,
  toggleTempDuty_global,
  deleteTempDuty_global,

  doRefreshPlan_global,
  doRefreshOnlinePlan_global,

  addNewTempName_global,
  toggleInfoPublish_global,
  storeWaterLevelData_global,
  storeWaterLevelPosition_global,
  toggleWaterLevelPopup_global,
  toggleWaterLevelTablePopup_global
}