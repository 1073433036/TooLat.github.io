import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './InfoMoniter.html?style=./InfoMoniter.scss'

import { _geo } from './geo.conf'
import { videoClient, planImportClient, hydRologyClient } from '../../../util/clientHelper'

@WithRender
@Component
export default class InfoMoniter extends Vue {
	@Getter('systemStore/region_global') region_global

	geo: any = null
  menu = null
  selcetItem: any = {}     //当前所选一级目录信息
  selectOpt: any = {}      //当前所选二级目录信息
  geoParams: any = {}      //基本信息 路径、配置、信息
  selectGeo: any = {}      //当前geo信息
  dealSelectGeo = []  //处理后geo信息
  selectGeoLen: number = 0    //数据信息总长度
  currentPage: number = 0     //当前表格页数
  allPage: number = 0         //表格总页数
	excludeTh: string[] = ['lon','lat','town']
  exclude: string[] = ['lon','lat','town','select','show']     //表格td排除内容
  allSelect: boolean = false     //全选
  display: any = {
      itemList: false,
      optList: false,
      popup: false,
      modifyPopup: false,
			alertPopup: false,
  }
  alertPopupText = null
  modifyKey = null   //点击编辑时 所选数据key
  modify: any = {}         //编辑时 所选数据
  townObj: any = {}      //镇id 名      //新增数据时使用
	message: string = null
	town: string = null
	videoStates: any = {
		'使用中': true,
		'停用': false,
	}

	numOfPage: number = 10				//每页多少个数据
	pageSizes: number[] = [10, 20, 30, 40, 50]
	isPageSizePopupOn: boolean = false

  baseUrl = 'http://10.148.83.228:8086'
  comUrl = 'user/post/,/post'

	toggleList(type) {
			this.display[type] = !this.display[type];
	}
	//一级目录
	toggleItem(key) {
			this.selcetItem = Object.assign({key: key}, this.menu[key]);
			this.initOpt();
			this.toggleList('itemList');
	}
	//二级目录
	initOpt() {
			const subMenu = this.selcetItem.menu,
					firstSubKey = Object.keys(subMenu)[0];
			let parentKey = this.selcetItem.key;
			if(parentKey === 'baseInfo') parentKey = firstSubKey;   //地理信息时 key parentKey设置相同
			this.selectOpt = Object.assign({key: firstSubKey, parentKey: parentKey}, subMenu[firstSubKey]);
			this.initGeoData(firstSubKey, parentKey, subMenu[firstSubKey].text);
	}
	toggleOpt(key, parentKey) {
			if(parentKey === 'baseInfo') parentKey = key;
			const opt = this.selcetItem.menu[key];
			this.selectOpt = Object.assign({key: key, parentKey: parentKey}, opt);
			this.initGeoData(key, parentKey, opt.text);
			this.display.optList = false
	}
	//初始化基本信息的数据
	initGeoData(type, parentType, text) {   //先判断this.geoParams.info是否已经获取过数据
			let geoParams = this.geoParams;
			if(parentType === 'Material' || parentType === 'Rescueteam') {     //物资信息、救援队伍
					const objkey = Object.keys(geoParams.info[parentType][type]);
					if(objkey.length) {
							this.selectGeo = geoParams.info[parentType][type];
							this.dealSelGeo();
					} else {
							this.initGeoDataFn(type, parentType, text);
					}
			} else {       //地理信息
					type = '';
					const objkey = Object.keys(geoParams.info[parentType]);
					if(objkey.length) {
							this.selectGeo = geoParams.info[parentType];
							this.dealSelGeo();
					} else {
							this.initGeoDataFn(type, parentType, text);
					}
			}
	}
	//重新获取geo信息  用于各类操作之后
	reInitGeoData(page) {       
			const selectOpt = this.selectOpt,
					type = selectOpt.key,
					parentType = selectOpt.parentKey,
					text = selectOpt.text;
			this.initGeoDataFn(type, parentType, text, page);
	}
	//加载geo信息函数
	async initGeoDataFn(type, parentType, text, page=undefined) {     
			let geoParams = this.geoParams;
			let url;
			if(parentType === 'Material') {     //物资信息
					const countyId = this.region_global.countyId;
					url = `${this.baseUrl}/poi/entity/use/${this.comUrl}?countyId=${countyId}&use=${text}&poiName=${parentType}&random=${Math.random()}`;
			} else if(parentType === 'Rescueteam') {        //救援队伍
					const countyId = this.region_global.countyId;
					url = `${this.baseUrl}/poi/entity/type/${this.comUrl}?countyId=${countyId}&type=${text}&poiName=${parentType}&random=${Math.random()}`;
			} else if (parentType === 'Monitorvideo') {			//视频设备
					url = `${this.baseUrl}/video/get/all/${this.comUrl}?random=${Math.random()}`
			} else if (parentType === 'River') {						//河流信息
					url = `${this.baseUrl}/hyd/river/${this.comUrl}/?random=${Math.random()}`
			} else {    //基础信息
					url = `${this.baseUrl}/poi/entity/all/${this.comUrl}?poiName=${parentType}&random=${Math.random()}`;
			}
			console.log(url);

			let res: any = await fetch(url);
			let data: any = await res.json();
			let tagObject = data.tagObject;

			if(data.result !== 'S_OK') {
				Vue['prototype']['$message']({
					type: 'error',
					message: '获取信息失败！'
				})
			}
			if(data.result !== 'S_OK' || (data.result === 'S_OK' && (tagObject === null || !Object.keys(tagObject).length))) {
					this.selectGeo = {}; 
					this.dealSelGeo(page);
					return;
			}
			let pos;
			if(parentType === 'Material' || parentType === 'Rescueteam')
					pos = geoParams.info[parentType][type];
			else pos = geoParams.info[parentType]; 

			for(let i of tagObject) {
					let obj: any = {};
					const id = i.id;
					for(let j in geoParams.conf[parentType]) {  //只获取this.geoParams.conf配置的信息
							obj[j] = i[j];
					}
					obj.select = false;     //select用于判断该数据是否选中
					obj.show = true;        //show用于判断是否展示  主要用于搜索不匹配时隐藏
					pos[id] = obj;
			}
			this.selectGeo = pos;       //存储当前基本信息数据
			console.log(this.selectGeo);
			this.dealSelGeo(page);
	}
	//处理已选基础信息数据  for table
	dealSelGeo(page=undefined) {
			this.currentPage = page ? page : 0;
			const selectGeo = this.selectGeo;
			let showSelectGeo = {};      //排除selectGeo中show为false的数据
			for(let i in selectGeo) {
					if(selectGeo[i].show)
							showSelectGeo[i] = selectGeo[i];
			}
			const objkey = Object.keys(showSelectGeo);
			this.selectGeoLen = objkey.length;
			this.allPage = Math.ceil(this.selectGeoLen / this.numOfPage);

			this.dealSelectGeo = [];
			//按每10个数据为一组格式化数据
			for(let i = 0; i < this.allPage; i++) {
					let obj = {};
					for(let j = 0; j < this.numOfPage; j++) {
							const key = objkey[this.numOfPage*i+j];
							if(key) obj[key] = selectGeo[key];
					}
					this.dealSelectGeo.push(obj);
			}
			//console.log(this.dealSelectGeo);
	}
	//全选 单选
	toggleAllSel() {
			this.allSelect = !this.allSelect;
			const selectGeo = this.selectGeo;
			for(let i in selectGeo) {
					selectGeo[i].select = this.allSelect;       //this.dealSelectGeo中该项的select亦已更改
			}
	}
	toggleDetailSel(key) {
			this.selectGeo[key].select = !this.selectGeo[key].select;
	}
	//删除按钮 删除所有选中
	deleteAllSelect() {
			let selectArr = [];
			const selectGeo = this.selectGeo;
			for(let i in selectGeo) {
					if(selectGeo[i].select) {
							selectArr.push(i);
					}
			}
			if(!selectArr.length) {
					Vue['prototype']['$message']({
						type: 'error',
						message: '请先选择需要删除的信息!'
					})
					return;
			}
			Vue['prototype']['$confirm'](' 确定删所有选中的信息吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				const poiName = this.selectOpt.parentKey;
				for(let key of selectArr) {
					this.delUserMsg(key, poiName);
				}
			}).catch(() => {  })
	}
	async delUserMsg(key, poiName) {
			let url = ''
			if (poiName === 'Monitorvideo') {
				url = `${this.baseUrl}/video/del/${this.comUrl}?id=${key}`
			} else if (poiName === 'River') {
				url = `${this.baseUrl}/hyd/river/del/${this.comUrl}?id=${key}`
			} else {
				url = `${this.baseUrl}/poi/entity/del/${this.comUrl}?poiName=${poiName}&id=${key}`
			}
			let res: any = await fetch(url);
			let data: any = await res.json();
			if(data.result === 'S_OK') {
				const page = this.currentPage;
				delete this.selectGeo[key];
				this.dealSelGeo();
				this.currentPage = page;
				//const page = this.currentPage;
				//this.reInitGeoData(page);
				Vue['prototype']['$message']({
					type: 'success',
					message: data.description
				})
			} else {
				Vue['prototype']['$message']({
					type: 'error',
					message: data.description
				})
			}
	}
	//更改当前页数
	changePageNaum(type) {
			if(type === 0 && this.currentPage !== 0) this.currentPage--; 
			if(type === 1 && this.currentPage < this.allPage - 1) this.currentPage++;
	}
	//新增窗口
	toggleInfoPopup(bool) {
			this.display.popup = bool;
	}
	async submitInfo() {      //新增数据
			const geoParams = this.geoParams,
					selectOpt = this.selectOpt,
					key = selectOpt.parentKey,
					conf = geoParams.conf[key],
					page = this.currentPage;
			
			if (key === 'Monitorvideo') {			//新增 视频设备 数据
				this.addVideoDev()
				return
			} else if(key === 'River') {
				this.addRiverInfo()
				return
			}

			let obj: any = {};
			for(let i in conf) {
				if (i === 'townname') continue		//人口经济
				const ele: HTMLInputElement = <HTMLInputElement>document.querySelector('#new'+i);
				const val = ele.value;
				obj[i] = val;
			}
			if ('townname' in conf) {
				obj.townname = this.townObj[this.town]
			}
			const currentRegion = this.region_global;
			obj.cityId = currentRegion.cityId;
			obj.countyId = currentRegion.countyId;
			obj.townId = this.town;
			if(key === 'Material') obj.purpose = selectOpt.text;         //物资信息
			if(key === 'Rescueteam') {                                   //救援队伍
					obj.teamtype = selectOpt.text;    
					obj.villageId = 0;    
					obj.pointid = 0;        
			}
			let suffix = ``;
			for(let i in obj) {
				suffix += `&obj[${i}]=${obj[i]}`
			}
			let url = `${this.baseUrl}/poi/entity/add/${this.comUrl}?poiName=${key}` + suffix;
			console.log(url);
			let res: any = await fetch(url);
			let msg: any = await res.json();
			if(msg.result === 'S_OK') {
				Vue['prototype']['$message']({
					type: 'success',
					message: '添加成功！'
				})
				this.reInitGeoData(page);
				this.toggleInfoPopup(false);
				for(let i in conf) {
						if (i !== 'townname') continue
						const ele = <HTMLInputElement>document.getElementById('new' + i);
						ele.value = '';
				}
			} else {
				Vue['prototype']['$message']({
					type: 'error',
					message: msg.description
				})
			}
	}
	// 新增 河流信息
	async addRiverInfo() {
		let conf = this.geoParams.conf.River
		let params = {
			curwaterlevel: 0,
			distance: 0,
			iswarning: 0,
			updateTime: 0,
			msgSendTime: 0,
		}
		for (let i in conf) {
			const ele: HTMLInputElement = <HTMLInputElement>document.querySelector('#new'+i);
			const val = ele.value;
			params[i] = val;
		}
		let data = await hydRologyClient.addRiverInfo(params)
		if(data === true) {
			this.reInitGeoData(this.currentPage);
			this.toggleInfoPopup(false);
			for(let i in conf) {
				const ele = <HTMLInputElement>document.getElementById('new' + i);
				ele.value = '';
			}
			Vue['prototype']['$message']({
				type: 'success',
				message: '添加成功！'
			})
		} else {
			Vue['prototype']['$message']({
				type: 'error',
				message: data
			})
		}
	}
	//新增 视频设备 数据
	async addVideoDev() {	
		const currentRegion = this.region_global
		let conf = this.geoParams.conf.Monitorvideo
		let dev: any = {
			id: 0,
			deviceId: 0,
			videotype: 0,
			province: 1,
			city: currentRegion.cityId,
			county: currentRegion.countyId,
			town: this.town,
		}
		for (let i in conf) {
			if(i === 'town') continue
			const ele: HTMLInputElement = <HTMLInputElement>document.querySelector('#new'+i);
			const val = ele.value;
			dev[i] = val;
		}
		let data = await videoClient.addVideoDev(dev)
		if(data === true) {
			this.reInitGeoData(this.currentPage);
			this.toggleInfoPopup(false);
			for(let i in conf) {
				if(i === 'town') continue
				const ele = <HTMLInputElement>document.getElementById('new' + i);
				ele.value = '';
			}
			Vue['prototype']['$message']({
				type: 'success',
				message: '添加成功！'
			})
		} else {
			Vue['prototype']['$message']({
				type: 'error',
				message: data
			})
		}
	}
	//修改窗口
	toggleModifyPopup(bool,key=undefined) {
			this.display.modifyPopup = bool;
			this.modifyKey = key;
	}
	addModifyMsg(info) {
			this.modify = {};
			delete info.select;
			delete info.show;
			for(let i in info) {
					this.modify[i] = info[i];
			}
	} 
	async submitModifyInfo() {        //修改数据
			const key = this.selectOpt.parentKey,
					page = this.currentPage,
					modify = this.modify;

			if (key === 'Monitorvideo') {
				this.modifyVideo()
				return
			} else if(key === 'River') {
				this.modifyRiver()
				return
			}

			let obj: any = {};
			for(let i in modify) {
					const ele: HTMLInputElement = <HTMLInputElement>document.getElementById('mod' + i);
					const val = ele.value;
					obj[i] = val;
			}
			obj.id = this.modifyKey;

			let suffix = ``;
			for(let i in obj) {
				suffix += `&obj[${i}]=${obj[i]}`
			}
			let url = `${this.baseUrl}/poi/entity/update/${this.comUrl}?poiName=${key}` + suffix;
			console.log(url);
			let res: any = await fetch(url);
			let msg: any = await res.json();
			if(msg.result === 'S_OK') {
				this.reInitGeoData(page);
				this.toggleModifyPopup(false);
				Vue['prototype']['$message']({
				type: 'success',
				message: msg.description
				})
			} else {
				Vue['prototype']['$message']({
					type: 'error',
					message: msg.description
				})
			}
	}
	// 修改河流信息
	async modifyRiver() {
		let obj: any = {
			id: this.modifyKey,
			curwaterlevel: 0,
			distance: 0,
			iswarning: 0,
			updateTime: 0,
			msgSendTime: 0,
		};
		for(let i in this.modify) {
			const ele: HTMLInputElement = <HTMLInputElement>document.getElementById('mod' + i);
			const val = ele.value;
			obj[i] = val;
		}
		let data = await hydRologyClient.updateRiverInfo(obj)
		if(data === true) {
			this.reInitGeoData(this.currentPage);
			this.toggleModifyPopup(false);
			Vue['prototype']['$message']({
				type: 'success',
				message: '修改成功！'
			})
		} else {
			Vue['prototype']['$message']({
				type: 'error',
				message: data
			})
		}
	}
	//修改视频设备
	async modifyVideo() {
		const currentRegion = this.region_global
		let obj: any = {};
		for(let i in this.modify) {
			const ele: HTMLInputElement = <HTMLInputElement>document.getElementById('mod' + i);
			const val = ele.value;
			obj[i] = val;
		}
		obj.id = this.modifyKey
		obj.videotype = 0
		obj.province = 1
		obj.city = currentRegion.cityId
		obj.county = currentRegion.countyId
		console.log(obj)
		let data = await videoClient.updateVideoDev(obj)
		if(data === true) {
			this.reInitGeoData(this.currentPage);
			this.toggleModifyPopup(false);
			Vue['prototype']['$message']({
				type: 'success',
				message: '修改成功！'
			})
		} else {
			Vue['prototype']['$message']({
				type: 'error',
				message: data
			})
		}
	}
	//具体信息删除按钮
	deleteUserMsg(key) {
			Vue['prototype']['$confirm'](' 确定删除此行信息吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				const poiName = this.selectOpt.parentKey;
				this.delUserMsg(key, poiName);
			}).catch(() => {  })
	}
	//搜索
	search() {
			const message = this.message;
			if(message) {
					const msgRegExp = new RegExp(message);
					let selectGeo = this.selectGeo;
					for(let i in selectGeo) {
							let bool = false;
							for(let info in selectGeo[i]) {
									if(info !== 'show' && info !== 'select' && msgRegExp.test(selectGeo[i][info])) {
											bool = true;
											break;
									}
							}
							selectGeo[i].show = bool;
					}
					this.currentPage = 0;
			} else {
					for(let i in this.selectGeo) {
							this.selectGeo[i].show = true;
					}
			}
			this.dealSelGeo();
	}
	//警告弹窗
	// toggleAlertPopup(bool,text) {
	// 		this.display.alertPopup = bool;
	// 		if(text) this.alertPopupText = text;
	// }
	//导出表格
	exportTable() {
		// $("#infoTable").table2excel({
		// 		exclude: ".noExl",
		// 		name: "Worksheet Name",
		// 		filename: this.selectOpt.key
		// });
	}

	togglePageSize(num: number) {
		this.isPageSizePopupOn = false
		if (this.numOfPage === num) return
		this.numOfPage = num
		this.dealSelGeo()
	}

	// 导入功能
	isFilePopupOn: boolean = false
	@Watch('isFilePopupOn')
	onisFilePopupOnChanged(val: any, oldVal: any): void {
		if(val) this.excelFile = null
	}
	excelFile: any = null
	fileChanged(e) {
		const file = e.target.files[0]
		this.excelFile = file ? file : null
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
		params.append('poiName', this.selectOpt.key)
		params.append('file', this.excelFile)
		let res = await planImportClient.importPoi(params)
		if (res) {
			this.isFilePopupOn = false
			Vue['prototype']['$message']({
				type: 'success',
				message: '导入成功！'
			})
			this.toggleOpt(this.selectOpt.key, this.selcetItem.key)
		} else {
			Vue['prototype']['$message']({
				type: 'error',
				message: '导入失败！'
			})
		}
	}

  async mounted() {
      const countyId = this.region_global.countyId,
          countyUrl = `${this.baseUrl}/geography/findtowns/county/${this.comUrl}?countyId=${countyId}`;

			let res: any = await fetch(countyUrl);
			let data: any = await res.json();
			if(data.result === 'S_OK') {
					const tagObject = data.tagObject;
					for(let i in tagObject) {
							const info = tagObject[i];
							this.townObj[info.townId] = info.name;
					}
					const townObj = this.townObj,
							fKey = Object.keys(townObj)[0];
					this.town = fKey;
			}
      
			this.geo = new _geo();
      this.geoParams = Object.assign({}, this.geo);
      this.menu = this.geo.menu;
      const menu = this.menu;
      const firstKey = Object.keys(menu)[0];
      this.selcetItem = Object.assign({key: firstKey}, menu[firstKey]);
      this.initOpt();
  }
}