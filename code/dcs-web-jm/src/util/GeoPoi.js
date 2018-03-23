export default class GeoPoi {
  constructor($http) {
    this._$http = $http;
    this._poiCollections = {};
    this._baseUrl = 'http://10.148.10.80:8111/';
    this._urlStore = {
      'chemical': 'dict/facilitiesGD/s1/',
      'economy': 'dict/facilitiesGD/s2/',
      'hospital': 'dict/facilitiesGD/s3/',
      'loudspeaker': 'dict/facilitiesGD/s4/',
      'material': 'dict/facilitiesGD/s5/',
      'shelter': 'dict/facilitiesGD/s6/',
      'rescueteam': 'dict/facilitiesGD/s7/',
      'reservoir': 'dict/facilitiesGD/s8/',
      'school': 'dict/facilitiesGD/s9/',
      'geosite': 'dict/facilitiesGD/s10/',
    };
    this._params = {
      school: {
        //name: '学校名称',
        manager: '负责人',
        cellphone: '手机',
        phone: '电话',
        people: '总人数',
        address: '地址',
        reporttime: '填报时间'
      },
      hospital: {
        //name: '医院名称',
        level: '医院等级',
        manager: '负责人',
        cellphone: '手机',
        phone: '电话',
        doctor: '医生人数',
        nurse: '护士人数',
        beds: '床位数量',
        address: '地址',
        reporttime: '填报时间'
      },
      reservoir: {
        //name: '水库名称',
        code: '水库编号',
        address: '地址',
        //updatetime: '更新时间',
        floodctrl: '汛限水位(米)',
        waterlevel: '当前水位(米)',
        capacity: '库容(万方)',
        reporttime: '填报时间'
        /*raint: '今日降雨',
		 rainy: '昨日降雨',
		 windv: '风速',
		 temp: '温度'*/
      },
      chemical: {
        //name: '名称',
        address: '地址',
        type: '类型',
        manager: '负责人',
        cellphone: '联系电话',
        reporter: '填报人',
        reporterphone: '填报人联系电话',
        reporttime: '填报时间'
      },
      shelter: {
        //placename: '场所名称',
        address: '场所地址',
        people: '容纳人数(人)',
        area: '面积(㎡)',
        city: '所属市',
        manager: '负责人',
        managertitle: '负责人职务',
        managerphone: '负责人电话',
        contacts: '联系人',
        contactstitle: '联系人职务',
        contactsphone: '联系人电话',
        reporttime: '填报时间'
      },
      economy: {
        //townname: '镇名称',
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
        roadcourse: '公路历程(公里)',
        reporttime: '填报时间'
      },
      material: {
        //name: '单位名称',
        address: '单位地址',
        materialname: '物资名称',
        stock: '已有物资',
        model: '规格型号',
        amount: '数量',
        //unit: '单位',
        use: '用途',
        reserveaddress: '储备地址',
        contacts: '联系人',
        cellphone: '手机号码',
        telephone: '电话'
      },
      rescueteam: {
        //teamname: '队伍名称',
        departname: '单位名称',
        address: '单位地址',
        people: '人数',
        manager: '负责人',
        cellphone: '手机号码',
        phone: '联系电话',
        contact: '队伍联系人',
        teamcellphone: '队伍联系人手机',
        teamphone: '队伍联系人电话',
        reporttime: '填报时间'
      },
      loudspeaker: {
        termType: '设备类型',
        termId: '设备编号',
        status: '设备状态',
        address: '设备地址',
        operator: '维护人员',
        serviceTel: '联系电话'
      },
      ship: {
        name_en: "船名",
        callsign: "呼号",
        vesseltype: "船类型",
        length: "船长",
        width: "船宽",
        lat: "纬度",
        lon: "经度",
        dir: "航向",
        vel: "航速",
        dest: "目的地",
        datetime: "时间",
        eta: "ETA",
        mmsi: "MMSI",
        imo: "IMO",
        cog: "船首向",
        draught: "最大吃水",
        aisclass: "AIS类型",
        devicetype: "导航设备",
        state: "导航状态"
      },
      plane: {
        key: "航班号",
        departureTime: "起飞时间",
        arrivalTime: "到达时间",
        estimatedArrivalTime: "预计到达时间",
        altitude: "高度(米)",
        direction: "航向",
        groundspeed: "航速(kts)",
        timestamp: "更新时间"
      }
    }
  }

  async getPois(type, cityId, countyId = undefined, subType = undefined) {
    const url = `http://10.149.3.123:9020/jm/select?table=${type}&cityId=${cityId}`
      + `${countyId ? ('&countyId=' + countyId) : ''}${subType ? ('&type=' + subType) : ''}`;
    let poiData = await this._$http.jsonp(url);
    poiData = poiData.data;
    if(!poiData || !poiData.status || !poiData['listSql'].length)
      return Promise.reject();
    return poiData['listSql'];
  }

  getPoi({type, subType, cityId, countyId=undefined}) {
    if(type in this._urlStore === false) {
      console.log('no match type in geography');
      return Promise.reject();
    }
    const $http = this._$http;
    let poiCollections = this._poiCollections;
    let url = this._baseUrl + this._urlStore[type]
      + `${cityId || ''},${countyId || ''},,${subType ? ',' + subType : (type==='loudspeaker' ? ',大喇叭;电子显示屏' : '')}/JSONP/`;

    return new Promise((resolve, reject) => {
      $http.jsonp(url).then((response) => {
        let data = response.data;
        if(typeof data === 'string' && /DB_ERROR/.test(data)){
          resolve(null);
        } else {
          let id = `${type}${subType ? '_' + subType : ''}`;
          let poiCollection = poiCollections[id] = {};
          data.forEach((item) => {
            if(type === 'material'){
              let poiId = item.pointid,
                name = item.materialname;
              if(poiId in poiCollection === false)
                poiCollection[poiId] = {};
              if(name in poiCollection[poiId] === false)
                poiCollection[poiId][name] = [];
              poiCollection[poiId][name].push(item);
            }
            else if(type === 'rescueteam') {
              let poiId = item.pointid;
              if(poiId in poiCollection === false)
                poiCollection[poiId] = [];
              poiCollection[poiId].push(item);
            }
            else {
              poiCollection[item.id] = item;
            }
          });
          resolve(poiCollection);
        }
      });
    });
  }

  getAllMaterial(types, cityId, countyId=undefined) {
    return new Promise((resolve, reject) => {
      let url = `${this._baseUrl}${this._urlStore.material}${cityId || ''},${countyId || ''},,,${types}/JSONP/`;
      this._$http.jsonp(url).then(response => {
        let data = response.data;
        if(typeof data === 'string' && /DB_ERR/.test(data)) {
          resolve(null);
        } else {
          let poiCollection = this._poiCollections.material = {};
          data.forEach(item => {
            let poiId = item.pointid,
              name = item.materialname;
            if(poiId in poiCollection === false)
              poiCollection[poiId] = {};
            if(name in poiCollection[poiId] === false)
              poiCollection[poiId][name] = [];
            poiCollection[poiId][name].push(item);
          });
          resolve(poiCollection);
        }
      }).catch(err => {
        reject();
      });
    });
  }

  getAllRescueteam(types, cityId, countyId=undefined) {
    return new Promise((resolve, reject) => {
      let url = `${this._baseUrl}${this._urlStore.rescueteam}${cityId || ''},${countyId || ''},,,${types}/JSONP/`;
      this._$http.jsonp(url).then(response => {
        let data = response.data;
        if(typeof data === 'string' && /DB_ERR/.test(data)) {
          resolve(null);
        } else {
          let poiCollection = this._poiCollections.rescueteam = {};
          data.forEach(item => {
            let poiId = item.pointid;
            if(poiId in poiCollection === false)
              poiCollection[poiId] = [];
            poiCollection[poiId].push(item);
          });
          resolve(poiCollection);
        }
      }).catch(err => {
        reject();
      });
    });
  }

  getPoiDetail(type, poiId, poiCollections) {
    //const poiCollections = this._poiCollections;
    if(type in poiCollections === false || poiId in poiCollections[type] === false) {
      return;
    }

    const params = this._params;
    const poiCollection = poiCollections[type];
    let key = type.split('_')[0];
    let poiDetail = [],
      poiTitle = '',
      paramObj = params[key];

    if(key === 'material') {
      poiDetail = {};
      for(let i in poiCollection[poiId]) {
        poiDetail[i] = [];
        poiCollection[poiId][i].forEach(poi => {
          poiTitle = poi.name;
          let details = getParams(paramObj, poi);
          poiDetail[i].push(details);
        });
      }
    } else {
      if(key === 'rescueteam') {
        poiCollection[poiId].forEach(poi => {
          poiTitle = poi.name;
          let details = getParams(paramObj, poi);
          poiDetail.push(details);
        })
      } else {
        let poi = poiCollection[poiId];
        poiTitle = key === 'loudspeaker' ? `设备所在地：${'address' in poi ? poi.address : '未知'}` : poi.name;
        let details = getParams(paramObj, poi);
        poiDetail.push(details);
      }
    }

    return {
      title: poiTitle,
      details: poiDetail
    };

    function getParams(arg0, arg1) {
      let param = {};
      for(let i in arg0) {
        let attr = arg0[i];
        param[attr] = i in arg1 === true && arg1[i] ? arg1[i] : '';
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
