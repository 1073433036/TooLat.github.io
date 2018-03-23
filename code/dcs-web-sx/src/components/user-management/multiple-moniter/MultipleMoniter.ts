import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './MultipleMoniter.html?style=./MultipleMoniter.scss'

import moment from 'moment'
import { planImportClient, ExpertClient, MearsureClient, OrgMenClient, OrganizationClient, DisasterTypeClient, prePlanClient } from '../../../util/clientHelper'

@WithRender
@Component
export default class MultipleMoniter extends Vue {
  @Getter('emergencyStore/types_global') types_global
  @Action('emergencyStore/initTypes_global') initTypes_global

  opts: any = {
    experts: {
      text: '专家库',
      params: {
        emergencyman: '专家名',
        address: '常驻地址',
        orgid: '部门',
        phone: '电话',
        cellphone: '手机',
      }
    },
    organization: {
      text: '部门信息',
      params: {
        name: '名称',
        fax: '传真号'
      }
    },
    orgmen: {
      text: '部门负责人',
      params: {
        name: '姓名',
        orgid: '部门',
        position: '职位',
        phone: '电话',
        cellphone: '手机',
      }
    },
    disaster: {
      text: '事件类型',
      params: {
        name: '名称',
        starttip: '启动提示',
        downtip: '降级提示',
        uptip: '升级提示',
        finishtip: '结束提示',
        description: '描述',
      }
    },
    measure: {
      text: '预案内容',
      params: {
        orgid: '部门',
        level: '等级',
        detail: '单位预案',
        measure: '短信',
      }
    },
    duty: {
      text: '工作备忘',
      params: {
        name: '内容'
      }
    },
    historyPlan: {
      text: '历史预案',
      params: {
        name: '名称',
        level: '等级',
        starttime: '启动时间',
      }
    }
  }
  selectedOpt: string = 'experts'

  tabs: any = {}        // 二级下拉框
  tabSelected: string = null
  subTabs: any = {}     // 三级下拉框
  subTabsSelected: string = null

  // 预案内容
  levels: number[] = [1,2,3,4]
  newImage: any = null         // 上传传真图片
  editorImage: any = null        // 修改传真图片
  faxSelected: string = null   // 查看传真

  numOfPage: number = 10				//每页多少个数据
  pageSizes: number[] = [10, 20, 30, 40, 50]
  isPageSizePopupOn: boolean = false
  currentData: any = null

  display:any = {
    listPopup: false,
    namePopup: false,
    itemPopup: false,
    newPopup: false,
    editorPopup: false,
    faxPopup: false,
    filePopup: false,
  }
  searchKey: string = null
  allSelected: boolean = false
  modifyInfo: any = null

  info: any = []        //所有数据
  showInfo: any = []    //展示的数据  用于搜索功能
  dealInfo: any = []    //10个1组的数据
  currentPage: number = 1
  allPageNum: number = 0
  infoLength: number = 0

  relateorgs: any = {}

  togglePopup(key) {
    this.display[key] = !this.display[key];
  }
  initData() {
    this.searchKey = null;
    this.allSelected = false;
    this.info = [];
    this.showInfo = [];
    this.dealInfo = [];
    this.currentPage = 1;
    this.allPageNum = 0;
    this.infoLength = 0;
  }
  async initEmtype() {
    if (Object.keys(this.tabs).length) return
    let data = await DisasterTypeClient.getEmegencyTypeInfo()
    if (!data || !data.length) {
      this.tabs = {}
      this.tabSelected = null
      return
    }
    let obj = {}
    for (let opt of data) {
      obj[opt.id] = opt
    }
    this.tabs = { ...obj }
    this.tabSelected = data[0].id
  }
  async initDisasterType() {
    let data = await DisasterTypeClient.getDisasterTypeInfo(this.tabSelected)
    if (!data || !data.length) {
      this.subTabs = {}
      this.subTabsSelected = null
      return
    }
    let obj = {}
    for (let opt of data) {
      obj[opt.id] = opt
    }
    this.subTabs = { ...obj }
    this.subTabsSelected = data[0].id
  }
  async toggleOpt(key) {
    this.display.listPopup = false
    this.selectedOpt = key;
    this.initData();
    if(key === 'experts') {
      this.initExpertsLib();
    }
    else if(key === 'organization') {
      this.initOrganization()
    }
    else if(key === 'orgmen') {
      this.initOrgMen();
    }
    else if (key === 'disaster') {
      await this.initEmtype()
      this.initDisaster()
    }
    else if (key === 'measure') {
      await this.initEmtype()
      await this.initDisasterType()
      this.initMeasure()
    }
    else if (key === 'duty') {
      this.initDuty()
    }
    else if (key === 'historyPlan') {
      let data = await prePlanClient.getPlans()
      if (!data) {
        Vue['prototype']['$message']({
          type: 'error',
          message: '信息获取失败！'
        })
      }
      let arr = []
      for (let opt of data) {
        let obj = {
          name: opt.tag ? opt.tag.split('-')[1] : '',
          level: opt.level,
          starttime: moment(opt.starttime).format('YYYY-MM-DD HH:mm')
        }
        arr.push(obj)
      }
      this.currentData = arr
      this.initInfoFn(arr)
    }
  }
  async toggleTab(key) {    //切换二级目录
    this.display.namePopup = false
    this.tabSelected = key
    this.initData()
    if (this.selectedOpt === 'disaster') {
      this.initDisaster()
    } else if (this.selectedOpt === 'measure') {
      await this.initDisasterType()
      this.initMeasure()
    }
  }
  toggleSubTab(key) {   //切换三级目录
    this.display.itemPopup = false
    this.subTabsSelected = key
    this.initData()
    this.initMeasure()
  }
  async initExpertsLib() {
    let data = await ExpertClient.getExperts();
    if (!data) {
      Vue['prototype']['$message']({
        type: 'error',
        message: '信息获取失败！'
      })
    }
    this.currentData = data
    this.initInfoFn(data);
  }
  async initOrganization() {
    let data = await OrganizationClient.getAllOrganizations()
    if (!data) {
      Vue['prototype']['$message']({
        type: 'error',
        message: '信息获取失败！'
      })
    }
    this.currentData = data
    this.initInfoFn(data)
  }
  async initOrgMen() {
    let data = await OrgMenClient.getOrgMen()
    if (!data) {
      Vue['prototype']['$message']({
        type: 'error',
        message: '信息获取失败！'
      })
    }
    this.currentData = data
    this.initInfoFn(data);
  }
  async initDisaster() {
    let data = await DisasterTypeClient.getDisasterTypeInfo(this.tabSelected)
    if (!data) {
      Vue['prototype']['$message']({
        type: 'error',
        message: '信息获取失败！'
      })
    }
    this.currentData = data
    this.initInfoFn(data)
  }
  async initMeasure() {
    if (!this.subTabsSelected) return
    let data = await MearsureClient.getMeaByDisasterId(this.subTabsSelected)
    if (!data) {
      Vue['prototype']['$message']({
        type: 'error',
        message: '信息获取失败！'
      })
    }
    this.currentData = data
    this.initInfoFn(data)
  }
  async initDuty() {
    let data = await prePlanClient.getDuties()
    if (!data) {
      Vue['prototype']['$message']({
        type: 'error',
        message: '信息获取失败！'
      })
    }
    this.currentData = data
    this.initInfoFn(data)
  }
  initInfoFn(data) {   //统一处理数据
    if(!data || !data.length) {
      this.initData();
      return;
    }
    for(let item of data) {
      Vue.set(item, 'selected', false)
    }
    this.info = data;
    console.log(this.info)
    this.showInfo = data;
    this.calcPages();
    this.operaInfo();
  }
  calcPages() {
    this.infoLength = this.showInfo.length;
    this.allPageNum = Math.ceil(this.infoLength / this.numOfPage);
    if(this.allPageNum < this.currentPage) this.currentPage = this.allPageNum;
  }
  operaInfo() {
    const num = this.currentPage;
    // this.dealInfo = this.showInfo.slice().splice((num - 1)*this.numOfPage, this.numOfPage); 
    this.dealInfo = this.showInfo.slice((num - 1)*this.numOfPage, (num - 1)*this.numOfPage + this.numOfPage)
    console.log(this.dealInfo);
  }
  delSelectedInfo() {
    Vue['prototype']['$confirm'](' 确定删除所有选中信息吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      for(let info of this.showInfo) {
        if(info.selected)
          console.log(info)
          // this.deleteInfo(info);
      }
    }).catch(() => {  })
  }
  toggleAllSelected() {
    const bool = !this.allSelected;
    this.allSelected = bool;
    for(let info of this.showInfo) {
      info.selected = bool;
    }
  }
  toggleSelected(info) {
    info.selected = !info.selected;
  }
  editorInfo(info) {
    this.display.editorPopup = true;
    this.modifyInfo = info;
    if (this.selectedOpt === 'measure') {
      this.editorImage = null
      // this.getFax(info.id)
    }
  }
  delTheInfo(info) {
    Vue['prototype']['$confirm']('确定删除此行信息吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			this.deleteInfo(info)
		}).catch(() => {  })
  }
  async deleteInfo(info) {
    if(this.selectedOpt === 'experts') {
      let res = await ExpertClient.delExpert(info.id);
      if(res) {
        this.initExpertsLib();
        Vue['prototype']['$message']({
          type: 'success',
          message: '删除成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '删除失败!'
        })
      }
    }
    else if(this.selectedOpt === 'organization') {
      let res = await OrganizationClient.delOrganizations(info.id);
      if(res) {
        this.initOrganization();
        this.initAllOrganizations()
        Vue['prototype']['$message']({
          type: 'success',
          message: '删除成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '删除失败!'
        })
      }
    }
    else if(this.selectedOpt === 'orgmen') {
      let res = await OrgMenClient.delOrgMen(info.id);
      if(res) {
        this.initOrgMen();
        Vue['prototype']['$message']({
          type: 'success',
          message: '删除成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '删除失败!'
        })
      }
    }
    else if(this.selectedOpt === 'disaster') {
      let res = await DisasterTypeClient.delDisasterTypeInfo(info.id);
      if(res) {
        this.initDisaster();
        Vue['prototype']['$message']({
          type: 'success',
          message: '删除成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '删除失败!'
        })
      }
    }
    else if(this.selectedOpt === 'measure') {
      let res = await MearsureClient.delMearsure(info.id);
      if(res) {
        this.initMeasure();
        Vue['prototype']['$message']({
          type: 'success',
          message: '删除成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '删除失败!'
        })
      }
    }
    else if(this.selectedOpt === 'duty') {
      let res = await prePlanClient.delDuty(info.id);
      if(res) {
        this.initDuty();
        Vue['prototype']['$message']({
          type: 'success',
          message: '删除成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '删除失败!'
        })
      }
    }
  }
  changePageNaum(prev) {
    if(prev && this.currentPage > 1) {
      this.currentPage --;
      this.operaInfo();
    } else if(!prev && this.currentPage < this.allPageNum) {
      this.currentPage ++;
      this.operaInfo();
    }
  }
  async submitNewInfo() {
    let obj: any = {};
    for(let i in this.opts[this.selectedOpt].params) {
      const ele: HTMLInputElement = <HTMLInputElement>document.querySelector(`#new_${this.selectedOpt}_${i}`);
      obj[i] = ele.value;
    }
    if(this.selectedOpt === 'experts') {
      let params = {
        id: 0,
        code: '440823',
        mantype: '',
        other: '',
      }
      params = Object.assign(params, obj);
      let res = await ExpertClient.addExpert(params);
      if(res) {
        this.initExpertsLib();
        this.display.newPopup = false;
        Vue['prototype']['$message']({
          type: 'success',
          message: '添加成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '添加失败!'
        })
      }
    }
    else if(this.selectedOpt === 'organization') {
      let params = Object.assign({ id: 0 }, obj);
      let res = await OrganizationClient.addOrganizations(params);
      if(res) {
        this.initOrganization();
        this.initAllOrganizations()
        this.display.newPopup = false;
        Vue['prototype']['$message']({
          type: 'success',
          message: '添加成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '添加失败!'
        })
      }
    }
    else if(this.selectedOpt === 'orgmen') {
      let params = {
        id: 0,
        orgname: this.relateorgs[obj.orgid],
      }
      params = Object.assign(params, obj);
      let res = await OrgMenClient.addOrgMen(params);
      if(res) {
        this.initOrgMen();
        this.display.newPopup = false;
        Vue['prototype']['$message']({
          type: 'success',
          message: '添加成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '添加失败!'
        })
      }
    }
    else if(this.selectedOpt === 'disaster') {
      let params = {
        id: 0,
        emegencyId: this.tabSelected
      }
      params = Object.assign(params, obj);
      let res = await DisasterTypeClient.addDisasterTypeInfo(params);
      if(res) {
        this.initDisaster();
        this.display.newPopup = false;
        Vue['prototype']['$message']({
          type: 'success',
          message: '添加成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '添加失败!'
        })
      }
    }
    else if(this.selectedOpt === 'measure') {
      let params = new FormData()
      console.log(obj)
      for (let i in obj) {
        params.append(i, obj[i])
      }
      params.append('emtypeId', this.tabSelected)
      params.append('disasterId', this.subTabsSelected)
      params.append('img', this.newImage)
      // params.append('detail', detail)

      let res = await MearsureClient.addMearsure(params);
      if(res) {
        this.initMeasure();
        this.display.newPopup = false;
        Vue['prototype']['$message']({
          type: 'success',
          message: '添加成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '添加失败!'
        })
      }
    }
    else if(this.selectedOpt === 'duty') {
      let params = Object.assign({ id: 0 }, obj);
      let res = await prePlanClient.addDuty(params);
      if(res) {
        this.initDuty();
        this.display.newPopup = false;
        Vue['prototype']['$message']({
          type: 'success',
          message: '添加成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '添加失败!'
        })
      }
    }
  }
  async submitModifyInfo() {
    let obj: any = {};
    for(let i in this.opts[this.selectedOpt].params) {
      const ele: HTMLInputElement = <HTMLInputElement>document.querySelector(`#modify_${this.selectedOpt}_${i}`);
      obj[i] = ele.value;
    }
    if(this.selectedOpt === 'experts') {
      let params = {
        id: this.modifyInfo.id,
        code: '440823',
        mantype: '',
        other: '',
      }
      params = Object.assign(params, obj);
      let res = await ExpertClient.updateExpert(params);
      if(res) {
        this.initExpertsLib();
        this.display.editorPopup = false;
        Vue['prototype']['$message']({
          type: 'success',
          message: '修改成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '修改失败!'
        })
      }
    }
    else if(this.selectedOpt === 'organization') {
      let params = Object.assign({ id: this.modifyInfo.id }, obj);
      let res = await OrganizationClient.updateOrganizations(params);
      if(res) {
        this.initOrganization();
        this.initAllOrganizations()
        this.display.editorPopup = false;
        Vue['prototype']['$message']({
          type: 'success',
          message: '修改成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '修改失败!'
        })
      }
    }
    else if(this.selectedOpt === 'orgmen') {
      let params = {
        id: this.modifyInfo.id,
        orgname: this.relateorgs[obj.orgid],
      }
      params = Object.assign(params, obj);
      let res = await OrgMenClient.updateOrgMen(params);
      if(res) {
        this.initOrgMen();
        this.display.editorPopup = false;
        Vue['prototype']['$message']({
          type: 'success',
          message: '修改成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '修改失败!'
        })
      }
    }
    else if (this.selectedOpt === 'disaster') {
      let params = {
        id: this.modifyInfo.id,
        emegencyId: this.tabSelected
      }
      params = Object.assign(params, obj);
      let res = await DisasterTypeClient.updateDisasterTypeInfo(params);
      if(res) {
        this.initDisaster();
        this.display.editorPopup = false;
        Vue['prototype']['$message']({
          type: 'success',
          message: '修改成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '修改失败!'
        })
      }
    }
    else if (this.selectedOpt === 'measure') {
      let params: any = {
        id: this.modifyInfo.id,
        emtypeId: this.tabSelected,
        disasterId: this.subTabsSelected,
      }
      params = Object.assign(params, obj)
      let res: any
      if (this.editorImage) {
        let formD = new FormData()
        for (let i in params) {
          formD.append(i, params[i])
        }
        formD.append('img', this.editorImage)

        res = await MearsureClient.updateMearsure(formD)
      } else {
        res = await MearsureClient.updateMearsureNofax(params)
      }
      if(res) {
        this.initMeasure();
        this.display.editorPopup = false;
        Vue['prototype']['$message']({
          type: 'success',
          message: '修改成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '修改失败!'
        })
      }
    }
    else if(this.selectedOpt === 'duty') {
      let params = Object.assign({ id: this.modifyInfo.id }, obj);
      let res = await prePlanClient.updateDuty(params);
      if(res) {
        this.initDuty();
        this.display.editorPopup = false;
        Vue['prototype']['$message']({
          type: 'success',
          message: '修改成功!'
        })
      } else {
        Vue['prototype']['$message']({
          type: 'error',
          message: '修改失败!'
        })
      }
    }
  }
  search() {
    const text = this.searchKey;
    if(text) {
      const msgRegExp = new RegExp(text);
      this.showInfo = [];
      for(let info of this.info) {
        let bool = false;
        for(let key in info) {
          if(key in this.opts[this.selectedOpt].params && msgRegExp.test(info[key])) {
            bool = true;
            break;
          }
        }
        if(bool)
          this.showInfo.push(info);
      }
      this.currentPage = 1;
      this.calcPages();
      this.operaInfo();
    } else {
      this.showInfo = this.info;
      this.currentPage = 1;
      this.calcPages();
      this.operaInfo();
    }
  }

  uploadImage(e) {
    const file = e.target.files[0]
    this.newImage = file ? file : null
  }
  uploadEditorImage(e) {
    const file = e.target.files[0]
    this.editorImage = file ? file : null
  }
  async toggleFax(key) {
    await this.getFax(key)
    this.display.faxPopup = true
  }
  async getFax(key) {
    let res = await prePlanClient.getPlanFax(key)
    this.faxSelected = res ? 'data:image/png;base64,' + res : null
  }

  togglePageSize(num: number) {
		this.isPageSizePopupOn = false
		if (this.numOfPage === num) return
		this.numOfPage = num
		this.initInfoFn(this.currentData)
  }
  
  // 导入
  excelFile: any = null
  fileChanged(e) {
    const file = e.target.files[0]
		this.excelFile = file ? file : null
  }
  toggleFilePopup() {
    this.display.filePopup = true
    this.excelFile = null
  }
  async importExcel() {
		if (!this.excelFile) {
			Vue['prototype']['$message']({
				type: 'error',
				message: '文件不得为空！'
			})
			return
		}
		let params = new FormData()
    params.append('file', this.excelFile)
    let res: any = null
    if (this.selectedOpt === 'experts') {
      res = await planImportClient.importExpert(params)
    } else if (this.selectedOpt === 'orgmen') {
      res = await planImportClient.importOrgmen(params)
    } else if (this.selectedOpt === 'measure') {
      res = await planImportClient.importMea(params)
    }
		if (res) {
			this.display.filePopup = false
			Vue['prototype']['$message']({
				type: 'success',
				message: '导入成功！'
      })
      if (this.selectedOpt === 'experts') {
        this.initExpertsLib()
      } else if (this.selectedOpt === 'orgmen') {
        this.initOrgMen()
      } else if (this.selectedOpt === 'measure') {
        this.initMeasure()
      }
		} else {
			Vue['prototype']['$message']({
				type: 'error',
				message: '导入失败！'
			})
		}
	}
  
  async mounted () {
    await this.initAllOrganizations()
    this.initExpertsLib();
  }

  async initAllOrganizations() {
    let res = await OrganizationClient.getAllOrganizations()
    if (res) {
      let obj = {}
      for (let el of res)
        obj[el.id] = el.name
      this.relateorgs = { ...obj }
    } 
  }
}