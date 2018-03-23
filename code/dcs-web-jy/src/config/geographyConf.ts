export const geoConf = {
  elements: [
    { key: 'geography', name: '地理信息', sub: [
      { key: 'chemical', name: '危化品点', type: 1 },
      { key: 'economy', name: '人口经济', type: 2 },
      { key: 'hospital', name: '医疗设施', type: 3 },
      { key: 'school', name: '学校设施', type: 6 },
      { key: 'shelter', name: '避难所', type: 7 },
      // { key: 'experts', name: '应急专家', type: 8 },
      // { key: 'geohazard', name: '灾害点', type: 9 },
      { key: 'service', name: '气象服务站', type: 999 },
      { key: 'building', name: '施工隐患点', type: 999 }
    ] },
    { key: 'material', name: '物资信息', type: 4, sub: [
      { key: 'civilAdmin', name: '民政' },
      { key: 'waterConservancy', name: '水利' },
      { key: 'threeAnti', name: '三防' },
      { key: 'publicsecurity', name: '公安' },
      { key: 'land', name: '国土' },
      { key: 'forestry', name: '林业' },
      { key: 'evnProtection', name: '环保' },
      { key: 'marine', name: '海事' },
      { key: 'safety', name: '安监' },
      { key: 'electric', name: '电力' },
      { key: 'communication', name: '通讯' }
    ] },
    { key: 'rescueteam', name: '救援队伍', type: 5, sub: [
      { key: 'traffic', name: '交通运输' },
      { key: 'fire', name: '公安消防' },
      { key: 'town', name: '乡镇抢险' },
      { key: 'marine', name: '海上救援' },
      { key: 'electric', name: '电力抢险' },
      { key: 'communication', name: '通讯抢险' },
      { key: 'hospital', name: '医疗救援' }
    ] }
  ],
  elementsConf: {
    1: '危化品点', 3: '医疗设施', 5: '救援队伍', 6: '学校设施', 7: '避难所', 9: '灾害点'
  },
  geoKeys: {
    1: 'chemical',
    3: 'hospital',
    民政: 'civilAdmin',
    水利: 'waterConservancy',
    三防: 'threeAnti',
    公安: 'publicsecurity',
    国土: 'land',
    林业: 'forestry',
    环保: 'evnProtection',
    海事: 'marine',
    安监: 'safety',
    电力: 'electric',
    通讯: 'communication',
    交通运输: 'traffic',
    公安消防: 'fire',
    乡镇抢险: 'town',
    海上救援: 'marine',
    电力抢险: 'electric',
    通讯抢险: 'communication',
    医疗救援: 'hospital',
    6: 'school',
    7: 'shelter',
    8: 'chemical',  // !!!
    9: 'chemical',  // !!!
  },
  params: {
    service: {
      latlon: '经纬度',
      station: '名称',
      name: '联系人',
      phone: '联系电话',
      cellphone: '手机号码',
      area: '地区',
      number: '站号'
    },
    building: {
      latlon: '经纬度',
      name: '项目工程名称',
      address: '地址',
      completion: '完工时间', 
      cost: '工程造价', 
      type: '建筑类型', 
      area: '建筑面积', 
      // d_style: '建筑类型', 
      city: '所属市', 
      county: '所属县', 
      town: '所属镇', 
      responsible: '安全责任人', 
      unit: '工作单位', 
      position: '职务', 
      cellphone: '责任人手机号', 
      ddatetime: '记录时间'
    },
    school: {
      latlon: '经纬度',
      manager: '负责人',
      cellphone: '手机',
      phone: '电话',
      people: '总人数',
      address: '地址'
    },
    hospital: {
      latlon: '经纬度',
      // level: '医院等级',
      manager: '负责人',
      phone: '电话',
      cellphone: '手机',
      doctor: '医生人数',
      nurse: '护士人数',
      beds: '床位数量',
      ambulance: '救护车',
      address: '地址'
    },
    chemical: {
      latlon: '经纬度',
      address: '地址',
      type: '类型',
      manager: '负责人',
      cellphone: '联系电话',
      reporter: '填报人',
      reporterphone: '填报人联系电话'
    },
    shelter: {
      latlon: '经纬度',
      address: '场所地址',
      people: '容纳人数(人)',
      area: '面积(㎡)',
      manager: '负责人',
      managercellphone: '负责人手机',
      managerphone: '负责人电话',
      contact: '联系人',
      contactcellphone: '联系人手机',
      contactphone: '联系人电话'
    },
    economy: {
      latlon: '经纬度',
      people: '人口总数(人)',
      area: '土地面积(公顷)',
      gdp: 'GDP(万元)',
      resident: '户籍人口(人)',
      // floating: '流动人口(人)',
      agriculture: '农业产值(万元)',
      plough: '耕地面积(公顷)',
      irrigationarea: '有效灌溉面积(公顷)',
      aquaculture: '水产养殖面积(公顷)',
      fruit: '经济林果种植面积(公顷)',
      industrial: '工业用电(千瓦/小时)',
      roadcourse: '公路历程(公里)'
    },
    material: {
      latlon: '经纬度',
      // department: '单位名称',
      address: '单位地址',
      materialname: '物资名称',
      stock: '已有物资',
      model: '规格型号',
      amount: '数量',
      unit: '单位',
      contacts: '联系人',
      contactcellphone: '手机号码',
      contactphone: '电话'
    },
    rescueteam: {
      latlon: '经纬度',
      // department: '单位名称',
      address: '单位地址',
      people: '人数',
      manager: '负责人',
      managercellphone: '负责人手机',
      managerphone: '负责人电话',
      teamcontact: '队伍联系人',
      contactcellphone: '队伍联系人手机',
      contactphone: '队伍联系人电话'
    },
    experts: {
      latlon: '经纬度',
    },
    geohazard: {
      latlon: '经纬度',
      category: '类型',
      manager: '负责人',
      cellphone: '手机号码',
      stability: '稳定性',
    }
  }
}