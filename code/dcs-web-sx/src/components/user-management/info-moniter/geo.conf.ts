export class _geo {
	menu: any = {
		baseInfo:  {
			text: '地理信息',
			menu: {
				School: { text: '学校信息' },
				Hospital: { text: '医院信息' },
				Reservoir: { text: '水库信息' },
				River: { text: '河流信息' },
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
	//各个类型所对应属性
	conf: any = {
		School: {
	      name: '学校名称',
	      address: '地址',
	  		lon: '经度',
	  		lat: '纬度',
	      manager: '负责人',
	      cellphone: '手机',
	      //phone: '电话',
	      //people: '总人数',
	  },
	  Hospital: {
	      name: '医院名称',
	      //level: '医院等级',
	      address: '地址',
	  		lon: '经度',
	  		lat: '纬度',
        helpman: '负责人',
        cellphone: '手机',
        phone: '电话',
        doctor: '医生人数',
        nurse: '护士人数',
      	beds: '床位数量',
				ambulance: '救护车数量'
	  },
	  Reservoir: {
	  		name: '水库名称',
	      code: '水库编号',
	      address: '地址',
	  		lon: '经度',
	  		lat: '纬度',
	      //floodctrl: '当前水位(米)',
	      warnwaterlevel: '警戒水位(米)',
	      //capacity: '库容(万方)',
        manager: '负责人',
        cellphone: '联系电话'
		},
		River: {
				id: '河流ID',
				name: '河流名称',
				location: '河流位置',
				manager: '负责人',
	      cellphone: '手机',
				gcjLon: '经度',
				gcjLat: '纬度',
				warnwaterlevel: '警戒水位',
		},
	  Chemical: {
	  		name: '名称',
	      address: '地址',
	  		lon: '经度',
	  		lat: '纬度',
	      type: '类型',
	      manager: '负责人',
	      cellphone: '联系电话',
	      reporter: '填报人',
	      reporterphone: '填报人联系电话'
	  },
	  Openspace: {
	  		name: '场所名称',
	      address: '场所地址',
	  		lon: '经度',
	  		lat: '纬度',
	      people: '容纳人数(人)',
	      area: '面积(㎡)',
	      city: '所属市',
	      manager: '负责人',
	      //managertitle: '负责人职务',
	      managercellphone: '负责人手机',
	      managertelephone: '负责人电话',
	      contacts: '联系人',
	      //contactstitle: '联系人职务',
	      contactstelephone: '联系人手机',
	      contactscellphone: '联系人电话',
	  },
	  Economy: {
	  		townname: '镇名称',
	  		lon: '经度',
	  		lat: '纬度',
	      people: '人口总数(人)',
	      area: '土地面积(公顷)',
	      gdp: 'GDP(万元)',
	      resident: '户籍人口(人)',
	      floating: '流动人口(人)',
	      agriculture: '农业产值(万元)',
	      plough: '耕地面积(公顷)',
	      irrigationarea: '有效灌溉面积(公顷)',
	      aquaculture: '水产养殖面积(公顷)',
	      fruit: '经济林果种植面积(公顷)',
	      industrial: '工业用电(千瓦/小时)',
	      roadcourse: '公路历程(公里)'
	  },
		Led: {
				type: '类型',
				deviceType: '设备类型',
				code: '设备编号',
				address: '设备地址',
				lon: '经度',
				lat: '纬度',
		},
		Electricity: {
			name: '名称',
			address: '地址',
			manager: '负责人',
			phone: '电话',
			cellphone: '手机',
			lon: '经度',
			lat: '纬度',
		},
		RiskPoint: {
			type: '类型',
			address: '地址',
			terrain: '地型高程',
			grade: '灾害体规模',
			people: '威胁人员(人)',
			property: '潜在经济损失(万元)',
			manager: '负责人',
			phone: '电话',
			cellphone: '手机',
			lon: '经度',
			lat: '纬度',
		},
	  Material: {
	  		name: '物品名称',
	      address: '单位地址',
	  		lon: '经度',
	  		lat: '纬度',
	      //materialname: '物资名称',
	      //stock: '已有物资',
	      //model: '规格型号',
	      amount: '数量',
	      unit: '单位',
	      //use: '用途',
	      reserveaddress: '储备地址',
	      contacts: '联系人',
	      cellphone: '手机号码',
	      telephone: '电话'
	  },
	  Rescueteam: {
	  		teamname: '队伍名称',
	      name: '单位名称',
	      address: '单位地址',
	  		lon: '经度',
	  		lat: '纬度',
	      people: '人数',
	      manager: '负责人',
	      cellphone: '手机号码',
	      phone: '联系电话',
	      team_contact: '队伍联系人',
	      team_cellphone: '队伍联系人手机',
	      team_phone: '队伍联系人电话'
	  },
	  Loudspeaker: {
	      type: '类型',
	      deviceType: '设备类型',
	      code: '设备编号',
	      status: '设备状态',
	      address: '设备地址',
	  		lon: '经度',
	  		lat: '纬度',
	      contact: '联系人员',
	      phone: '联系电话'
		},
		Monitorvideo: {
				town: '镇',
				deviceId: '设备编号',
				address: '设备地址',
				state: '使用状态',
				ip: 'IP地址',
				lon: '经度',
				lat: '纬度',
				manager: '负责人',
				phone: '电话',
		},
	}
	//存储数据
	info: any = {
		School: {},
		Hospital: {},
		Reservoir: {},
		River: {},
		Chemical: {},
		Openspace: {},
		Economy: {},
		Loudspeaker: {},
		Led: {},
		Monitorvideo: {},
		Electricity: {},
		RiskPoint: {},
		Material: {
			natural: {},
			public: {},
			disaster: {}
		},
		Rescueteam: {
			disaster: {},
			security: {},
			natural: {},
			public: {},
			multiple: {},
			medical: {}
		}
	}
}