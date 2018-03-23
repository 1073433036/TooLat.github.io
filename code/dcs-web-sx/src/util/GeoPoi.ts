import fetchJsonp from 'fetch-jsonp'

export default class GeoPoi {
    _poiCollections: any = {}
    _ele: any = ['School','Hospital','Reservoir','Chemical','Loudspeaker','Openspace','Economy','Led','Electricity','RiskPoint','Material','Rescueteam', 'Monitorvideo']
    _params = {
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
		  deviceId: '设备编号',
          address: '设备地址',
          state: '使用状态',
          ip: 'IP地址',
          lon: '经度',
          lat: '纬度',
          manager: '负责人',
          phone: '电话',
      }
    }


    async getPoi({type, subType, cityId=undefined, countyId=undefined}) {
        if(!this._ele.includes(type)) {
            console.log('no match type in geography');
            return false;
        }
        let poiCollections = this._poiCollections;
        let url;
        if(type === 'Material') {
            url = `http://10.148.83.228:8086/poi/entity/use/user/post/,/post?countyId=${countyId}&use=${subType}&poiName=${type}&random=${Math.random()}`;
        } else if(type === 'Rescueteam') {
            url = `http://10.148.83.228:8086/poi/entity/type/user/post/,/post?countyId=${countyId}&type=${subType}&poiName=${type}&random=${Math.random()}`;
        } else if (type === 'Monitorvideo') {
            url = `http://10.148.83.228:8086/video/get/all/user/post/,/post?random=${Math.random()}`
        } else {
            url = `http://10.148.83.228:8086/poi/entity/all/user/post/,/post?poiName=${type}&random=${Math.random()}`;
        }
        console.log(url);
 
        let res: any = await fetch(url);
        let mes: any = await res.json();
        let tagObject: any = mes.tagObject;
        if(mes.result !== 'S_OK' || !tagObject || !Object.keys(tagObject).length) return false;
        let id = `${type}${subType ? '_' + subType : ''}`;
        let poiCollection = poiCollections[id] = {};
        tagObject.forEach((item) => {
            if(type === 'Material'){
                let poiId = item.pointid,
                    name = item.name;
                if(poiId in poiCollection === false)
                    poiCollection[poiId] = {};
                if(name in poiCollection[poiId] === false)
                    poiCollection[poiId][name] = [];
                poiCollection[poiId][name].push(item);
            }
            else if(type === 'Rescueteam') {
                let poiId = item.pointid;
                if(poiId in poiCollection === false)
                    poiCollection[poiId] = [];
                poiCollection[poiId].push(item);
            }
            else {
                poiCollection[item.id] = item;
            }
        });
        let data: any = poiCollection;
        return data;
    }
    
    async getAllMaterial() {
        let url = `http://10.148.83.228:8086/poi/entity/all/user/post/,/post?poiName=Material&random=${Math.random()}`;
        let res: any = await fetch(url);
        let msg: any = await res.json();
        let data: any = msg.tagObject;
        if(msg.result !== 'S_OK' || !data || !Object.keys(data).length) return false;
        let poiCollection = this._poiCollections.material = {};
        data.forEach(item => {
            let poiId = item.pointid,
                name = item.name;
            if(poiId in poiCollection === false)
                poiCollection[poiId] = {};
            if(name in poiCollection[poiId] === false)
                poiCollection[poiId][name] = [];
            poiCollection[poiId][name].push(item);
        });
        return poiCollection;
    }

    async getAllRescueteam() {
        let url = `http://10.148.83.228:8086/poi/entity/all/user/post/,/post?poiName=Rescueteam&random=${Math.random()}`;
        let res: any = await fetch(url);
        let msg: any = await res.json();
        let data: any = msg.tagObject;
        if(msg.result !== 'S_OK' || !data || !Object.keys(data).length) return false;
        let poiCollection = this._poiCollections.rescueteam = {};
        data.forEach(item => {
            let poiId = item.pointid;
            if(poiId in poiCollection === false)
                poiCollection[poiId] = [];
            poiCollection[poiId].push(item);
        });
        return poiCollection;
    }

    getPoiDetail(type, poiId, poiCollections) {
        if(type in poiCollections === false || poiId in poiCollections[type] === false)
            return;

        const params = this._params;
        const poiCollection = poiCollections[type];
        let key = type.split('_')[0];
        let poiDetail: any = [],
            poiTitle = '',
            paramObj = params[key];

        if(key === 'Material') {
            poiDetail = {};
            for(let i in poiCollection[poiId]) {
                poiDetail[i] = [];
                poiCollection[poiId][i].forEach(poi => {
                    poiTitle = poi.departname;
                    let details = getParams(paramObj, poi);
                    poiDetail[i].push(details);
                });
            }
        } else if(key === 'Rescueteam') {
            poiCollection[poiId].forEach(poi => {
                poiTitle = poi.name;
                let details = getParams(paramObj, poi);
                poiDetail.push(details);
            })
        } else {
            let poi = poiCollection[poiId];
            if(key === 'Loudspeaker' || key === 'Led' || key === 'Monitorvideo')
                poiTitle = `设备所在地：${'address' in poi ? poi.address : '未知'}`;
            else if(key === 'RiskPoint')
                poiTitle = poi.address;
            else
                poiTitle = poi.name;
            if(key === 'land')  poiTitle = poi.address;
            let details = getParams(paramObj, poi);
            if('使用状态' in details) {
                details['使用状态'] = details['使用状态'] ? '使用中' : '停用' 
            }
            poiDetail.push(details);
        }

        return {
            title: poiTitle,
            details: poiDetail
        };

        function getParams(arg0, arg1) {
            let param = {};
            for(let i in arg0) {
                let attr = arg0[i];
                param[attr] = i in arg1 ? arg1[i] : '';
            }
            return param;
        }
    }

    removeCollection(type) {
        const collections = this._poiCollections;
        if(type in collections === true){
            delete collections[type];
        }
    }
}