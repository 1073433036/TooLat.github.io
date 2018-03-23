import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import WithRender from './Emergency.html?style=./Emergency.scss';

import { GeographyClient } from '../../../../util/clientHelper'
import historyPlanPanel from './history-plan-panel/HistoryPlanPanel'

@WithRender
@Component
export default class Emergency extends Vue {
  @Getter('systemStore/loginUser_global') loginUser
  @Getter('systemStore/region_global') region
  @Getter('emergencyStore/addTempPopup_global') addTempPopup
  @Getter('emergencyStore/tempNames_global') tempNames
  @Getter('emergencyStore/selectedTempNameKey_global') selectedTempNameKey
  @Getter('emergencyStore/template_global') template
  @Getter('emergencyStore/types_global') types
  @Getter('emergencyStore/allLevels_global') allLevels
  @Getter('emergencyStore/levels_global') levels
  @Getter('emergencyStore/relateorgs_global') relateorgs
  @Getter('emergencyStore/influences_global') influences
  @Getter('emergencyStore/allDuties_global') allDuties
  @Getter('emergencyStore/duties_global') duties
  @Getter('emergencyStore/currentDuties_global') currentDuties

  @Action('emergencyStore/initTypes_global') initTypes_global
  @Action('emergencyStore/initLevels_global') initLevels
  @Action('emergencyStore/initTemplate_global') initTemplate
  @Action('emergencyStore/toggleDuty_global') toggleDuty
  @Action('emergencyStore/deleteDuty_global') deleteDuty
  @Action('emergencyStore/addNewDuty_global') addNewDuty
  @Action('emergencyStore/toggleTempDuty_global') toggleTempDuty
  @Action('emergencyStore/deleteTempDuty_global') deleteTempDuty
  @Action('emergencyStore/doRefreshPlan_global') doRefreshPlan
  @Action('emergencyStore/addNewTempName_global') addNewTempName
  @Action('emergencyStore/initAllDuties_global') initAllDuties
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  
  display: any = {
    namesPopup: false,
    orgPopup: false,
    influPopup: false,
    townPopup: false,
    dutyPopup: false,
    manageDutyPanel: false,
    tempDutyPopup: false,
    namePopup: false,                     //新预案模板名称窗口
  }
  newDuty: string = null                  //新工作备忘 textarea
  newLibDuty: string = null               //管理工作备忘库 新增工作备忘input text
  newName: string = null                  //新预案模板名称
  newTemplate: any = {                    //新预案模板
    name: null,
    level: null,
    measure: null,
    upMsg: null,
    downMsg: null,
    finishMsg: null,
    relateOrdIds: [],
    influenceIds: [],
    dutyIds: []
  }
  historyPlanView: any = null     
  allOrg: boolean = false       //选中所有政府部门
  allInflu: boolean = false     //选中所有单位类型
  levelFmt: any = {
    1: 'Ⅰ',
    2: 'Ⅱ',
    3: 'Ⅲ',
    4: 'Ⅳ'
  }
  towns: any = {}
  selectedTowns: string[] = []
  allTown: boolean = false

  //切换所有选择 部门单位\单位类型
  toggleAllSelect(name) {
    if(name === 'org') {
      this.template.relateOrdIds = [];
      if(!this.allOrg) {
        for(let i in this.relateorgs) {
          this.template.relateOrdIds.push(Number(i));
        }
      }
      this.allOrg = !this.allOrg;
    }
    else if(name === 'influ') {
      this.template.influenceIds = [];
      if(!this.allInflu) {
        for(let i in this.influences) {
          this.template.influenceIds.push(Number(i));
        }
      }
      this.allInflu = !this.allInflu;
    }
  }
  //切换所选 部门单位\单位类型
  toggleDetailSelect(name, key) {
    let data = this.template[name];
    if(data.includes(key)) {
      const index = data.indexOf(key);
      data.splice(index,1);
    }
    else data.push(key);
  }
  
  //在线预案 - 添加工作备忘
  toggleDutyPanel() {
    if(this.display.dutyPopup) {
      this.display.dutyPopup = false;
      this.newDuty = null;
    }
    else this.display.dutyPopup = true;
  }

  //预案库 - 管理工作备忘
  toggleManageDutyPanel() {
    this.display.manageDutyPanel = !this.display.manageDutyPanel;
  }
  async updateDuty(key) {
    const content = this.allDuties[key];
    let res: any = await fetch(`http://10.148.83.228:8086/plan/duty/update/user/post/,/post?id=${key}&name=${content}&random=${Math.random()}`);
    let msg: any = await res.json();
    this.dealDuty(msg);
  }
  async delDuty(key) {
    let res: any = await fetch(`http://10.148.83.228:8086/plan/duty/del/user/post/,/post?id=${key}&random=${Math.random()}`);
    let msg: any = await res.json();
    this.dealDuty(msg);
  }
  async addDuty() {
    const duty = this.newLibDuty;
    let res: any = await fetch(`http://10.148.83.228:8086/plan/duty/add/user/post/,/post?id=0&name=${duty}&random=${Math.random()}`);
    let msg: any = await res.json();
    this.dealDuty(msg);
  }
  dealDuty(msg) {
    if(msg.result === 'S_OK') this.initAllDuties();
    else this.toggleOprateTip_global({ tip: true, text: msg.description });
  }
  //预案库 - 添加工作备忘
  toggleTempDutyPopup() {
    this.display.tempDutyPopup = !this.display.tempDutyPopup;
  }

  //在线预案 - 启动预案
  async startPlan() {
    let duties = [];
    for(let i in this.currentDuties) {
      duties.push(this.currentDuties[i]);
    }
    const countyId = this.region.countyId,
      userId = this.loginUser.userId;
    let params = {
      countyId: this.region.countyId,
      templateId: this.template.id,
      meaName: this.template.measure,
      level: this.template.level,
      orgIds: this.template.relateOrdIds,
      inflenceIds: this.template.influenceIds,
      duties: duties,
      userId: userId
    }
    let encodedString = '';
    Object.keys(params).forEach((key, index) => {
      if (typeof params[key] != 'object') {
        encodedString += `&${key}=${params[key]}`;
      } else if(Array.isArray(params[key])) {
        params[key].forEach((el, arrIndex) => {
          encodedString += `&${key}[]=${el}`
        });
      }
    });
    //影响区域
    if(this.selectedTowns.length) {
      let regions = []
      let regParams = {
        id: 0,
        planId: 0,
        lon: 110.25,
        lat: 21.37,
        radius: -1,
        sourceman: '',
        sourcephone: '',
        description: ''
      }
      if(this.selectedTowns.length === Object.keys(this.towns).length) {
        regions.push(Object.assign({
          name: '遂溪县',
          countyId,
          townId: -1,
        }, regParams))
      } else {
        for(let opt of this.selectedTowns) {
          let town = this.towns[opt]
          regions.push(Object.assign({
            name: town.name,
            countyId: -1,
            townId: town.townId,
          }, regParams))
        }
      }
      regions.map((opt, index) => {
        for(let i in opt) {
          encodedString += `&regions[${index}][${i}]=${opt[i]}`
        }
      })
    }

    let res: any = await fetch(`http://10.148.83.228:8086/emergency/plan/start/user/post/,/`, {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodedString
    });
    let msg: any = await res.json();
    if(msg.result === 'S_OK') {
      this.doRefreshPlan(true);
      this.toggleOprateTip_global({ tip: true, text: '预案启动成功！' });
    } else {
      this.toggleOprateTip_global({ tip: true, text: msg.description });
    }
  }

  //预案库 - 新增预案模板
  addTemplateName() {
    const name = this.newName;
    if(!name) {
      this.toggleOprateTip_global({ tip: true, text: '预案名称不得为空！' });
      return;
    }
    for(let i in this.tempNames) {
      if(this.tempNames[i].text === name) {
        this.toggleOprateTip_global({ tip: true, text: '预案名称已存在！' });
        return;
      }
    }
    this.display.namePopup = false;
    let newTemplate = this.newTemplate;
    newTemplate.name = name;
    newTemplate.level = this.allLevels[0];
    newTemplate.measure = this.types[0];
    this.addNewTempName(newTemplate);
  }

  //预案库 - 保存预案模板
  async saveTemplate() {
    const template = this.template;
    let id = template.id ? template.id : '0';
    let params = {
      id: id,
      name: template.name,
      level: template.level,
      measure: template.measure,
      upMsg: template.upMsg,
      downMsg: template.downMsg,
      finishMsg: template.finishMsg,
      relateOrdIds: template.relateOrdIds,
      influenceIds: template.influenceIds,
      dutyIds: Object.keys(this.duties),
      relateorgs: '1',
      duties: '1',
      influences: '1',
    };
    let encodedString = '';
    Object.keys(params).forEach((key, index) => {
      if (typeof params[key] != 'object') {
        encodedString += `&${key}=${params[key]}`;
      } else if(Array.isArray(params[key])) {
        params[key].forEach((el, arrIndex) => {
          encodedString += `&${key}[]=${el}`
        });
      }
    });
    this.hasTempLate()
    .then(async () => {     //更新已存在预案模板
      let res: any = await fetch(`http://10.148.83.228:8086/plan/template/update/user/post/,/`, {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedString
      });
      let msg: any = await res.json();
      this.toggleOprateTip_global({ tip: true, text: msg.description });
      this.dealTemplateDuties();    //工作备忘
    })
    .catch(async () => {          //保存新增预案模板
      let res: any = await fetch(`http://10.148.83.228:8086/plan/template/add/user/post/,/`, {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedString
      });
      let msg: any = await res.json();
      this.toggleOprateTip_global({ tip: true, text: msg.description });
      let currentDutyIds: number[] = []; 
      for(let i in this.duties) {
        currentDutyIds.push(Number(i));
      }
      if(currentDutyIds.length)
        this.dealPlanDuty('add', currentDutyIds);     //增加工作备忘
    });
  }
  async dealTemplateDuties() {
    let currentDutyIds: number[] = [];      //当前工作备忘
    for(let i in this.duties) {
      currentDutyIds.push(Number(i));
    }
    const dutyIds: number[] = this.template.dutyIds;        //原先模板工作备忘
    let addArr: number[] = [];
    for(let currentDuty of currentDutyIds) {
      let newEle: boolean = true;
      for(let duty of dutyIds) {
        if(currentDuty === duty) {
          newEle = false;
          break;
        }
      }
      if(newEle) addArr.push(currentDuty);
    }
    if(addArr.length) this.dealPlanDuty('add', addArr);
    let delArr: number[] = [];
    for(let duty of dutyIds) {
      let newEle: boolean = true;
      for(let currentDuty of currentDutyIds) {
        if(currentDuty === duty) {
          newEle = false;
          break;
        }
      }
      if(newEle) delArr.push(duty);
    }
    if(delArr.length) this.dealPlanDuty('del', delArr);
  }
  async dealPlanDuty(type, arr) {
    /*
    const planId = this.template.id;
    let encodedString = '';
    arr.forEach(el => {
      encodedString += `&dutyIds[]=${el}`;
    });
    console.log(encodedString);   //!!!!   参数错误
    let res: any = await fetch(`http://10.148.83.228:8086/plan/planduty/${type}/user/post/,/post?planId=${planId}&${encodedString}`);
    let msg: any = await res.json();
    console.log(msg);
    */
  }

  //预案库 - 删除预案模板
  async deleteTemplate() {
    const template = this.template;
    if(!confirm(`确认删除预案名称为${template.name}，预案等级为${template.level}级的模板？`)) return;
    this.hasTempLate()
    .then(async () => {       //删除已存在模板
      let res: any = await fetch(`http://10.148.83.228:8086/plan/template/del/id/user/post/,/post?id=${template.id}`);
      let msg: any = await res.json();
      this.toggleOprateTip_global({ tip: true, text: msg.description });
     })
    .catch(() => {            //删除新增模板
      this.toggleOprateTip_global({ tip: true, text: '该预案模板不存在，删除失败！' });
    });
  }

  //预案库 - 判断当前预案是否存在 或是新增预案
  async hasTempLate() {
    const template = this.template;
    let res = await fetch(`http://10.148.83.228:8086/plan/template/get/user/post/,/post?name=${template.name}&level=${template.level}&random=${Math.random()}`);
    let msg = await res.json();
    return new Promise((resolve, reject) => {
      if(msg.result === 'S_OK') resolve();
      else if(msg.result === 'S_FAILED') reject();
    });
  }

  //在线预案 - 历史预案
  toggleHistoryPlanPanel() {
    if(this.historyPlanView) this.historyPlanView = null;
    else this.historyPlanView = historyPlanPanel;
  }

  //行政区域
  async initTowns() {
    let data = await GeographyClient.getTownsBound(this.region.countyId)
    if(data) {
      let obj = {}
      for(let opt of data)
        obj[opt.townId] = opt
      this.towns = { ...obj }
    }
  }
  toggleTowns(key) {
    let index = this.selectedTowns.indexOf(key)
    if(index !== -1)
      this.selectedTowns.splice(index,1);
    else 
      this.selectedTowns.push(key);
  }
  toggleAllTowns() {
    if(this.allTown)
      this.selectedTowns = []
    else
      this.selectedTowns = Object.keys(this.towns)
    this.allTown = !this.allTown
  }

  mounted() {
    this.initTypes_global();
    this.initTowns()
  }
  
}