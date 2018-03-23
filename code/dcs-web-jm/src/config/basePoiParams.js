export default {
  school: {
    name: {
      label: '学校名称',
      width: '',
      rules: { type: 'string', value: '', required: true, trigger: 'blur', message: '请输入学校名称' }
    },
    countyName: {
      label: '所属区/县',
      width: 80,
      rules: { value: '', required: true, trigger: 'change', message: '请选择所在区/县', options: [] }
    },
    lon: {
      label: '经度',
      width: '100',
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入学校经度' }
    },
    lat: {
      label: '纬度',
      width: '100',
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入学校纬度' }
    },
    type: {
      label: '学校类型',
      width: '',
      rules: { value: '小学', required: true, trigger: 'change', message: '请选择学校类型',
        options: [
          { name: '幼儿园', key: '幼儿园' },
          { name: '小学', key: '小学' },
          { name: '初中', key: '初中' },
          { name: '高中', key: '高中' },
          { name: '综合大学', key: '综合大学' },
          { name: '职业技术学院', key: '职业技术学院' },
          { name: '培训机构', key: '培训机构' },
          { name: '其他', key: '其他' }
        ]
      }
    },
    phone: {
      label: '联系电话',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入学校联系电话' }
    },
    address: {
      label: '地址',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入学校地址' }
    },
    people: {
      label: '总人数(人)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入总人数(人)' }
    },
    manager: {
      label: '联系人',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入联系人' }
    },
    cellphone: {
      label: '联系人手机',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入联系人手机' }
    },
    reporttime: {
      label: '填报时间',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入填报时间' }
    }
  },

  hospital: {
    name: {
      label: '医院名称',
      width: '',
      rules: { type: 'string', value: '', required: true, trigger: 'blur', message: '请输入医院名称' }
    },
    countyName: {
      label: '所属区/县',
      width: 80,
      rules: { value: '', required: true, trigger: 'change', message: '请选择所在区/县', options: [] }
    },
    address: {
      label: '地址',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入地址' }
    },
    lon: {
      label: '经度',
      width: 60,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入医院经度' }
    },
    lat: {
      label: '纬度',
      width: 60,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入医院纬度' }
    },
    code: {
      label: '地区编码',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入地区编码' }
    },
    type: {
      label: '医院类型',
      width: 80,
      rules: { value: '三甲医院', required: true, trigger: 'change', message: '请选择医院类型',
        options: [
          { name: '三甲医院', key: '三甲医院' },
          { name: '二甲医院', key: '二甲医院' },
          { name: '普通医院', key: '普通医院' },
          { name: '社区医院', key: '社区医院' },
          { name: '专科医院', key: '专科医院' },
          { name: '诊所', key: '诊所' },
          { name: '采供血站', key: '采供血站' },
          { name: '疾病预防', key: '疾病预防' },
          { name: '妇幼保健', key: '妇幼保健' },
          { name: '精神卫生', key: '精神卫生' },
          { name: '宠物医院', key: '宠物医院' },
          { name: '其他', key: '其他' },
        ]
      }
    },
    doctor: {
      label: '医生人数(人)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入医生人数' }
    },
    nurse: {
      label: '护士人数(人)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入护士人数' }
    },
    beds: {
      label: '床位数量(床)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入床位数量' }
    },
    ambulance: {
      label: '救护车(辆)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入救护车' }
    },
    helpman: {
      label: '负责人',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入负责人' }
    },
    cellphone: {
      label: '负责人手机',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入负责人手机' }
    },
    phone: {
      label: '联系电话',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入联系电话' }
    },
    fax: {
      label: '传真',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入传真' }
    },
    reporttime: {
      label: '填报时间',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入填报时间' }
    }
  },

  chemical: {
    name: {
      label: '危化品企业名称',
      width: '',
      rules: { type: 'string', value: '', required: true, trigger: 'blur', message: '请输入危化品企业名称' }
    },
    countyName: {
      label: '所属区/县',
      width: 80,
      rules: { value: '', required: true, trigger: 'change', message: '请选择所在区/县', options: [] }
    },
    address: {
      label: '地址',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入地址' }
    },
    type: {
      label: '类型',
      width: 80,
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入类型' }
    },
    lon: {
      label: '经度',
      width: 60,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入经度' }
    },
    lat: {
      label: '纬度',
      width: 60,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入纬度' }
    },
    manager: {
      label: '负责人',
      width: 60,
      rules: { type: 'string', value: '', required: false, trigger: 'change', message: '请输入负责人' }
    },
    cellphone: {
      label: '联系电话',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'change', message: '请输入联系电话' }
    },
    reporter: {
      label: '填报人',
      width: 60,
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入填报人' }
    },
    reporterphone: {
      label: '填报人电话',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入填报人电话' }
    },
    reporttime: {
      label: '填报时间',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入填报时间' }
    }
  },

  shelter: {
    name: {
      label: '避难点',
      width: 120,
      rules: { type: 'string', value: '', required: true, trigger: 'blur', message: '请输入避难点名称' }
    },
    countyName: {
      label: '所属区/县',
      width: 80,
      rules: { value: '', required: true, trigger: 'change', message: '请选择隐患点区/县', options: [] }
    },
    address: {
      label: '地址',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入避难点地址' }
    },
    lon: {
      label: '经度',
      width: 80,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入隐患点经度' }
    },
    lat: {
      label: '纬度',
      width: 80,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入隐患点纬度' }
    },
    code: {
      label: '地区编码',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入地区编码' }
    },
    people: {
      label: '容纳人数(人)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入避难点容纳人数' }
    },
    area: {
      label: '占地面积(m2)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入避难点占地面积' }
    },
    manager: {
      label: '负责人',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入负责人' }
    },
    managercellphone: {
      label: '负责人手机',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入负责人手机' }
    },
    managertelephone: {
      label: '负责人电话',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入负责人电话' }
    },
    contacts: {
      label: '联系人',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入隐患点所在村委会' }
    },
    contactscellphone: {
      label: '联系人手机',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入联系人手机' }
    },
    contactstelephone: {
      label: '联系人电话',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入联系人电话' }
    },
    reporttime: {
      label: '填报时间',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入填报时间' }
    }
  },

  economy: {
    name: {
      label: '城镇名称',
      width: '',
      rules: { type: 'string', value: '', required: true, trigger: 'blur', message: '请输入城镇名称' }
    },
    countyName: {
      label: '所属区/县',
      width: 80,
      rules: { value: '', required: true, trigger: 'change', message: '请选择隐患点区/县', options: [] }
    },
    lon: {
      label: '经度',
      width: 80,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入隐患点经度' }
    },
    lat: {
      label: '纬度',
      width: 80,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入隐患点纬度' }
    },
    people: {
      label: '总人口数',
      width: 80,
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入总人口数' }
    },
    resident: {
      label: '户籍人口(人)',
      width: 80,
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入户籍人口(人)' }
    },
    floating: {
      label: '流动人口(人)',
      width: 80,
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入流动人口(人)' }
    },
    gdp: {
      label: 'GDP(万元)',
      width: 80,
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入GDP(万元)' }
    },
    area: {
      label: '土地面积(公顷)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入土地面积(公顷)' }
    },
    plough: {
      label: '耕地面积(公顷)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入耕地面积(公顷)' }
    },
    agriculture: {
      label: '农业产值(万元)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入农业产值(万元)' }
    },
    industrial: {
      label: '工业用电(千瓦/小时)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入工业用电(千瓦/小时)' }
    },
    irrigationarea: {
      label: '有效灌溉面积(公顷)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入有效灌溉面积(公顷)' }
    },
    aquaculture: {
      label: '水产养殖面积(公顷)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入水产养殖面积(公顷)' }
    },
    fruit: {
      label: '林果种植面积(公顷)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入林果种植面积(公顷)' }
    },
    roadcourse: {
      label: '公路历程(公里)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入公路历程(公里)' }
    },
    reporttime: {
      label: '填报时间',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入填报时间' }
    }
  },

  reservoir: {
    name: {
      label: '水库名称',
      width: '',
      rules: { type: 'string', value: '', required: true, trigger: 'blur', message: '请输入水库名称' }
    },
    lon: {
      label: '经度',
      width: 80,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入水库经度' }
    },
    lat: {
      label: '纬度',
      width: 80,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入水库纬度' }
    },
    code: {
      label: '水库编号',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入水库编号' }
    },
    address: {
      label: '地址',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入水库地址' }
    },
    floodctrl: {
      label: '汛限水位(米)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入水库汛限水位' }
    },
    capacity: {
      label: '水库库容(万方)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入水库库容' }
    },
    manager: {
      label: '负责人',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入负责人' }
    },
    cellphone: {
      label: '负责人电话',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入负责人电话' }
    },
    reporttime: {
      label: '填报时间',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入填报时间' }
    }
  },

  rescueteam: {
    name: {
      label: '救援队名称',
      width: '',
      rules: { type: 'string', value: '', required: true, trigger: 'blur', message: '请输入救援队名称' }
    },
    countyName: {
      label: '所属区/县',
      width: 80,
      rules: { value: '', required: true, trigger: 'change', message: '请选择救援队所属区/县', options: []}
    },
    lon: {
      label: '经度',
      width: 80,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入救援队经度' }
    },
    lat: {
      label: '纬度',
      width: 80,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入救援队纬度' }
    },
    teamtype: {
      label: '队伍类型',
      width: 80,
      rules: { value: '', required: false, trigger: 'blur', message: '请输入类型', options: [
        { name: '交通运输', key: '交通运输' },
        { name: '公安消防', key: '公安消防' },
        { name: '乡镇救援', key: '乡镇救援' },
        { name: '海上救援', key: '海上救援' },
        { name: '电力救援', key: '电力救援' },
        { name: '通讯救援', key: '通讯救援' },
        { name: '医疗救援', key: '医疗救援' },
      ]}
    },
    departname: {
      label: '单位名称',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入单位名称' }
    },
    address: {
      label: '单位地址',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入单位地址' }
    },
    people: {
      label: '人数(人)',
      width: 60,
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入人数' }
    },
    manager: {
      label: '负责人',
      width: 60,
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入负责人' }
    },
    cellphone: {
      label: '负责人手机',
      width: 80,
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入负责人手机' }
    },
    phone: {
      label: '负责人联系电话',
      width: 80,
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入负责人联系电话' }
    },
    team_contact: {
      label: '队伍联系人',
      width: 80,
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入队伍联系人' }
    },
    team_cellphone: {
      label: '队伍联系人手机',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入队伍联系人手机' }
    },
    team_phone: {
      label: '队伍联系人电话',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入队伍联系人电话' }
    },
    reporttime: {
      label: '填报时间',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入填报时间' }
    }
  },

  station: {
    stationid: {
      label: '站号',
      width: '',
      rules: { type: 'string', value: '', required: false, disabled: true, trigger: 'blur' }
    },
    name: {
      label: '站名',
      width: '',
      rules: { type: 'string', value: '', required: false, disabled: true, trigger: 'blur' }
    },
    county: {
      label: '所属区/县',
      width: '',
      rules: { type: 'string', value: '', required: false, disabled: true, trigger: 'blur' }
    },
    wind_threshold_avg: {
      label: '平均风阈值(m/s)',
      width: '',
      rules: { type: 'number', value: 17.2, required: false, trigger: 'blur', message: '请输入平均风阈值' }
    },
    wind_threshold_max: {
      label: '最大风阈值(m/s)',
      width: '',
      rules: { type: 'number', value: 17.2, required: false, trigger: 'blur', message: '请输入最大风阈值' }
    },
    expand: {
      label: '雨量阈值(mm)',
      threshold: {
        rain_threshold_30min: {
          label: '过去30分钟',
          rules: { type: 'number', value: 8, required: true, trigger: 'blur', message: '请输入过去30分钟雨量阈值' }
        },
        rain_threshold_1h: {
          label: '过去1小时',
          rules: { type: 'number', value: 8, required: true, trigger: 'blur', message: '请输入过去1小时雨量阈值' }
        },
        rain_threshold_3h: {
          label: '过去3小时',
          rules: { type: 'number', value: 19, required: true, trigger: 'blur', message: '请输入过去3小时雨量阈值' }
        },
        rain_threshold_6h: {
          label: '过去6小时',
          rules: { type: 'number', value: 23.5, required: true, trigger: 'blur', message: '请输入过去6小时雨量阈值' }
        },
        rain_threshold_12h: {
          label: '过去12小时',
          rules: { type: 'number', value: 32.5, required: true, trigger: 'blur', message: '请输入过去12小时雨量阈值' }
        },
        rain_threshold_24h: {
          label: '过去24小时',
          rules: { type: 'number', value: 50, required: true, trigger: 'blur', message: '请输入过去24小时雨量阈值' }
        },
        rain_threshold_48h: {
          label: '过去48小时',
          rules: { type: 'number', value: 100, required: true, trigger: 'blur', message: '请输入过去48小时雨量阈值' }
        },
        rain_threshold_72h: {
          label: '过去72小时',
          rules: { type: 'number', value: 150, required: true, trigger: 'blur', message: '请输入过去72小时雨量阈值' }
        },
      }
    }
  }
}
