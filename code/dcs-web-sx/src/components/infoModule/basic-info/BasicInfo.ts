import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './BasicInfo.html?style=./BasicInfo.scss'

@WithRender
@Component
export default class BasicInfo extends Vue {
  @Getter('systemStore/region_global') region
  @Action('basicInfoStore/toggleBasicInfoPopup_global') toggleBasicInfoPopup
	@Action('basicInfoStore/addGeoCollection_global') addGeoCollection
	@Action('basicInfoStore/removeGeoCollection_global') removeGeoCollection
  
  tabOptionSelected: 'department' | 'basicData' = 'basicData'
  departmentMenu: string[] = ['医院','学校','码头','海洋','农业','林业','地震','环保']
	basicDataMenu: any = {
    BaseInfo: {
			text: '地理信息',
			menu: {
				School: { text: '学校信息' },
				Hospital: { text: '医院信息' },
				Reservoir: { text: '水库信息' },
				Chemical: { text: '危化品企业' },
				Openspace: { text: '避难场所' },
				Economy: { text: '人口经济' },
        Loudspeaker: { text: '省突喇叭' },
				Led: { text: '电子显示屏' },
				Monitorvideo: { text: '视频设备' },
				Electricity: { text: '电力设施' },
				RiskPoint: { text: '地质隐患点' },
			}
		},
    Material: {
			text: '物资信息',
			menu: {
				natural: { text: '自然灾害' },
				public: { text: '公共卫生' },
				disaster: { text: '事故灾难' }
			}
		},
		Rescueteam: {
			text: '救援队伍',
			menu: {
				disaster: { text: '事故灾难' },
				security: { text: '社会安全' },
				natural: { text: '自然灾害' },
				public: { text: '公共卫生' },
				multiple: { text: '综合' },
				medical: { text: '医疗救援队' }
			}
		}
  }

	initMenu() {
		let basicDataMenu = this.basicDataMenu;
		for(let i in basicDataMenu) {
			let subMenu = basicDataMenu[i].menu;
			for(let m in subMenu) {
				subMenu[m].selected = false;
				subMenu[m] = { ...subMenu[m] };
			}
		}
	}
  selectTabOption(option) {
    this.tabOptionSelected = option;
  }
  toggleGeography(item, type, subType) {
    const region = this.region;
    item.selected = !item.selected;
		let subTypeEn;
    if(type === 'BaseInfo') {
      type = subType;
      subType = undefined;
    } else {
			subTypeEn = subType;
			subType = this.basicDataMenu[type].menu[subType].text;
		}
    if(item.selected)
      this.addGeoCollection({
				type, 
				subType, 
				subTypeEn,
				cityId: region.cityId, 
				countyId: region.countyId 
			});
    else 
      this.removeGeoCollection({ type, subType });
  }
	removeAllGeo() {
		let basicDataMenu = this.basicDataMenu;
		for(let i in basicDataMenu) {
			let subMenu = basicDataMenu[i].menu;
			for(let subType in subMenu) {
				if(subMenu[subType].selected) {
					subMenu[subType].selected = false;
					let type;
					if(i === 'BaseInfo') {
						type = subType;
						subType = undefined;
					} else {
						type = i;
						subType = basicDataMenu[i].menu[subType].text;
					}
					this.removeGeoCollection({ type, subType });
				}
			}
		}
	}

	mounted () {
		this.initMenu();
	}

	// destroyed () {
	// 	this.removeAllGeo();
	// }
}