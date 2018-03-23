export default {
  school:{
    className:'width600',
    ruleForm: {
      name:'',
      countyid:'',
      lon:'',
      lat:'',
      people:'',
      manager:'',
      cellphone:'',
      address:'',
    },
    config:{
      name:{
        type:'input',
        label:'学校名称'
      },
      countyid:{
        type:'select',
        label:'区县',
        options: [
          {
            value: 120,
            label: '榕城区'
          }, {
            value: 121,
            label: '揭东县'
          }, {
            value: 122,
            label: '揭西县'
          }, {
            value: 123,
            label: '惠来县'
          }, {
            value: 124,
            label: '普宁县'
          }
        ]
      },
      lon:{
        type:'input',
        label:'经度',
        valueType:'number'
      },
      lat:{
        type:'input',
        label:'纬度',
        valueType:'number'
      },
      people:{
        type:'input',
        label:'学校人数',
        valueType:'number',
      },
      manager:{
        type:'input',
        label:'负责人'
      },
      phone:{
        type:'input',
        label:'电话号码'
      },
      cellphone:{
        type:'input',
        label:'联系电话',
        valueType:'number'
      },
      address:{
        type:'input',
        label:'地址'
      },
    },
    rules: {
      name:[{ required: true, message: '请输入学校名称', trigger: 'blur' }],
      countyid:[{ required: true, message: '请选择区县', trigger: 'blur' }],
      lon:[{ required: false, message: '', trigger: 'blur' },],
      lat:[{ required: false, message: '', trigger: 'blur' },],
      manager: [{ required: false, message: '负责人必填', trigger: 'blur' }],
      cellphone: [{ required: false, message: '负责人联系电话必填', trigger: 'blur' },],
      address:[{ required: false, message: '', trigger: 'blur' }],
    }
  },
  hospital:{
    className:'width600',
    ruleForm: {
      name:'',
      countyid:'',
      lon:'',
      lat:'',
      ambulance:'',
      beds:'',
      doctor:'',
      nurse:'',
      manager:'',
      cellphone:'',
      phone:'',
      fax:'',
      address:'',
    },
    config:{
      name:{
        type:'input',
        label:'医院名称'
      },
      countyid:{
        type:'select',
        label:'区县',
        options: [
          {
            value: 120,
            label: '榕城区'
          }, {
            value: 121,
            label: '揭东县'
          }, {
            value: 122,
            label: '揭西县'
          }, {
            value: 123,
            label: '惠来县'
          }, {
            value: 124,
            label: '普宁县'
          }
        ]
      },
      lon:{
        type:'input',
        label:'经度',
        valueType:'number'
      },
      lat:{
        type:'input',
        label:'纬度',
        valueType:'number'
      },
      ambulance:{
        type:'input',
        label:'救护车数量',
        valueType:'number'
      },
      beds:{
        type:'input',
        label:'床位',
        valueType:'number'
      },
      doctor:{
        type:'input',
        label:'医生人数',
        valueType:'number'
      },
      nurse:{
        type:'input',
        label:'护士人数',
        valueType:'number'
      },
      manager:{
        type:'input',
        label:'负责人'
      },
      phone:{
        type:'input',
        label:'电话号码'
      },
      cellphone:{
        type:'input',
        label:'联系电话',
        valueType:'number'
      },
      fax:{
        type:'input',
        label:'传真号',
        valueType:'number'
      },
      address:{
        type:'input',
        label:'地址'
      },
    },
    rules: {
      name:[{ required: true, message: '请输入医院名称', trigger: 'blur' }],
      countyid:[{ required: true, message: '请选择区县', trigger: 'blur' }],
      lon:[{ required: false, message: '', trigger: 'blur' },],
      lat:[{ required: false, message: '', trigger: 'blur' },],
      manager: [{ required: false, message: '负责人必填', trigger: 'blur' }],
      cellphone: [{ required: false, message: '负责人联系电话必填', trigger: 'blur' },],
      address:[{ required: false, message: '', trigger: 'blur' }],
    }
  },
  chemical:{
    className:'width600',
    ruleForm: {
      name:'',
      countyid:'',
      lon:'',
      lat:'',
      type:'',
      manager:'',
      cellphone:'',
      reporter:'',
      reporterphone:'',
      address:'',
    },
    config:{
      name:{
        type:'input',
        label:'危化品企业'
      },
      countyid:{
        type:'select',
        label:'区县',
        options: [
          {
            value: 120,
            label: '榕城区'
          }, {
            value: 121,
            label: '揭东县'
          }, {
            value: 122,
            label: '揭西县'
          }, {
            value: 123,
            label: '惠来县'
          }, {
            value: 124,
            label: '普宁县'
          }
        ]
      },
      lon:{
        type:'input',
        label:'经度',
        valueType:'number'
      },
      lat:{
        type:'input',
        label:'纬度',
        valueType:'number'
      },
      type:{
        type:'select',
        label:'类型',
        options: [
          {
            value: '化学工业品企业',
            label: '化学工业品企业'
          }, {
            value: '加油站',
            label: '加油站'
          }, {
            value: '加气站',
            label: '加气站'
          }, {
            value: '民爆场所',
            label: '民爆场所'
          }, {
            value: '油库',
            label: '油库'
          },{
            value: '弹药库',
            label: '弹药库'
          },{
            value: '储油库',
            label: '储油库'
          },
        ]
      },
      manager:{
        type:'input',
        label:'负责人'
      },
      cellphone:{
        type:'input',
        label:'负责人电话',
        valueType:'number'
      },
      reporter:{
        type:'input',
        label:'填报人'
      },
      reporterphone:{
        type:'input',
        label:'填报人电话',
        valueType:'number'
      },
      address:{
        type:'input',
        label:'地址'
      },
    },
    rules: {
      name:[{ required: true, message: '请输入企业名称', trigger: 'blur' }],
      countyid:[{ required: true, message: '请选择区县', trigger: 'blur' }],
      lon:[{ required: false, message: '', trigger: 'blur' },],
      lat:[{ required: false, message: '', trigger: 'blur' },],
      manager: [{ required: false, message: '负责人必填', trigger: 'blur' }],
      cellphone: [{ required: false, message: '负责人联系电话必填', trigger: 'blur' },],
      address:[{ required: false, message: '', trigger: 'blur' }],
      reporterphone:[{ required: false, message: '', trigger: 'blur' },],
    }
  },
  shelter:{
    className:'width600',
    ruleForm: {
      name:'',
      countyid:'',
      lon:'',
      lat:'',
      manager:'',
      managercellphone:'',
      contact:'',
      contactcellphone:'',
      area:'',
      people:'',
      address:'',
    },
    config:{
      name:{
        type:'input',
        label:'避难所'
      },
      countyid:{
        type:'select',
        label:'区县',
        options: [
          {
            value: 120,
            label: '榕城区'
          }, {
            value: 121,
            label: '揭东县'
          }, {
            value: 122,
            label: '揭西县'
          }, {
            value: 123,
            label: '惠来县'
          }, {
            value: 124,
            label: '普宁县'
          }
        ]
      },
      lon:{
        type:'input',
        label:'经度',
        valueType:'number'
      },
      lat:{
        type:'input',
        label:'纬度',
        valueType:'number'
      },
      manager:{
        type:'input',
        label:'负责人'
      },
      managercellphone:{
        type:'input',
        label:'负责人电话',
        valueType:'number'
      },
      contact:{
        type:'input',
        label:'联系人'
      },
      contactcellphone:{
        type:'input',
        label:'联系人电话',
        valueType:'number'
      },
      area:{
        type:'input',
        label:'占地面积',
        valueType:'number'
      },
      people:{
        type:'input',
        label:'容纳人数',
        valueType:'number'
      },
      address:{
        type:'input',
        label:'地址'
      },
    },
    rules: {
      name:[{ required: true, message: '请输入企业名称', trigger: 'blur' }],
      countyid:[{ required: true, message: '请选择区县', trigger: 'blur' }],
      lon:[{ required: false, message: '', trigger: 'blur' },],
      lat:[{ required: false, message: '', trigger: 'blur' },],
      manager: [{ required: false, message: '负责人必填', trigger: 'blur' }],
      managercellphone: [{ required: false, message: '负责人联系电话必填', trigger: 'blur' }],
      address:[{ required: false, message: '', trigger: 'blur' }],
      contactcellphone:[{ required: false, message: '', trigger: 'blur' },],
      area:[{ required: false, message: '', trigger: 'blur' },],
      people:[{ required: false, message: '', trigger: 'blur' },],
    }
  },
  economy:{
    className:'width600',
    ruleForm: {
      name:'',
      countyid:'',
      lon:'',
      lat:'',
      people:'',
      gdp:'',
      area:'',
      plough:'',
      agriculture:'',
      aquaculture:'',
      industrial:'',
      irrigationarea:'',
      fruit:'',
    },
    config:{
      name:{
        type:'input',
        label:'地名'
      },
      countyid:{
        type:'select',
        label:'区县',
        options: [
          {
            value: 120,
            label: '榕城区'
          }, {
            value: 121,
            label: '揭东县'
          }, {
            value: 122,
            label: '揭西县'
          }, {
            value: 123,
            label: '惠来县'
          }, {
            value: 124,
            label: '普宁县'
          }
        ]
      },
      lon:{
        type:'input',
        label:'经度',
        valueType:'number'
      },
      lat:{
        type:'input',
        label:'纬度',
        valueType:'number'
      },
      people:{
        type:'input',
        label:'总人口',
        valueType:'number'
      },
      gdp:{
        type:'input',
        label:'gdp指数',
        valueType:'number'
      },
      area:{
        type:'input',
        label:'占地面积',
        valueType:'number'
      },
      plough:{
        type:'input',
        label:'耕地面积',
        valueType:'number'
      },
      agriculture:{
        type:'input',
        label:'农业产值',
        valueType:'number'
      },
      aquaculture:{
        type:'input',
        label:'水产养殖',
        valueType:'number'
      },
      industrial:{
        type:'input',
        label:'工业用电',
        valueType:'number'
      },
      irrigationarea:{
        type:'input',
        label:'灌溉面积',
        valueType:'number'
      },
      fruit:{
        type:'input',
        label:'林果种植面积',
        valueType:'number'
      }
    },
    rules: {
      name:[{ required: true, message: '请输入企业名称', trigger: 'blur' }],
      countyid:[{ required: true, message: '请选择区县', trigger: 'blur' }],
      lon:[{ required: false, message: '', trigger: 'blur' },],
      lat:[{ required: false, message: '', trigger: 'blur' },],
      people:[{ required: false, message: '', trigger: 'blur' },],
      gdp:[{ required: false, message: '', trigger: 'blur' },],
      area:[{ required: false, message: '', trigger: 'blur' },],
      plough:[{ required: false, message: '', trigger: 'blur' },],
      agriculture:[{ required: false, message: '', trigger: 'blur' },],
      aquaculture:[{ required: false, message: '', trigger: 'blur' },],
      industrial:[{ required: false, message: '', trigger: 'blur' },],
      irrigationarea:[{ required: false, message: '', trigger: 'blur' },],
      fruit:[{ required: false, message: '', trigger: 'blur' },],
    }
  },
  rescueteam:{
    className:'width600',
    ruleForm: {
      name:'',
      countyid:'',
      lon:'',
      lat:'',
      department:'',
      teamtype:'',
      manager:'',
      managercellphone:'',
      managerphone:'',
      teamcontact:'',
      contactcellphone:'',
      contactphone:'',
      people:'',
      address:'',
    },
    config:{
      name:{
        type:'input',
        label:'队伍名称'
      },
      countyid:{
        type:'select',
        label:'区县',
        options: [
          {
            value: 120,
            label: '榕城区'
          }, {
            value: 121,
            label: '揭东县'
          }, {
            value: 122,
            label: '揭西县'
          }, {
            value: 123,
            label: '惠来县'
          }, {
            value: 124,
            label: '普宁县'
          }
        ]
      },
      lon:{
        type:'input',
        label:'经度',
        valueType:'number'
      },
      lat:{
        type:'input',
        label:'纬度',
        valueType:'number'
      },
      department:{
        type:'input',
        label:'所属部门'
      },
      teamtype:{
        type:'select',
        label:'队伍类型',
        options: [
          {
            value: '电力抢险',
            label: '电力抢险'
          }, {
            value: '公安消防',
            label: '公安消防'
          },
        ]
      },
      people:{
        type:'input',
        label:'队伍人数',
        valueType:'number'
      },
      manager:{
        type:'input',
        label:'负责人'
      },
      managercellphone:{
        type:'input',
        label:'负责人手机号',
        valueType:'number'
      },
      managerphone:{
        type:'input',
        label:'负责人电话'
      },
      teamcontact:{
        type:'input',
        label:'联系人'
      },
      contactcellphone:{
        type:'input',
        label:'联系人手机号'
      },
      contactphone:{
        type:'input',
        label:'联系人电话'
      },
      address:{
        type:'input',
        label:'地址'
      }

    },
    rules: {
      name:[{ required: true, message: '请输入企业名称', trigger: 'blur' }],
      countyid:[{ required: true, message: '请选择区县', trigger: 'blur' }],
      lon:[{ required: false, message: '', trigger: 'blur' },],
      lat:[{ required: false, message: '', trigger: 'blur' },],
      contactcellphone:[{ required: false, message: '', trigger: 'blur' },],
    }
  },

  material:{
    className:'width600',
    ruleForm: {
      name:'',
      countyid:'',
      lon:'',
      lat:'',
      department:'',
      departmentphone:'',
      contact:'',
      contactcellphone:'',
      unit:'',
      purpose:'',
      address:'',
    },
    config:{
      name:{
        type:'input',
        label:'物资存放点'
      },
      countyid:{
        type:'select',
        label:'区县',
        options: [
          {
            value: 120,
            label: '榕城区'
          }, {
            value: 121,
            label: '揭东县'
          }, {
            value: 122,
            label: '揭西县'
          }, {
            value: 123,
            label: '惠来县'
          }, {
            value: 124,
            label: '普宁县'
          }
        ]
      },
      lon:{
        type:'input',
        label:'经度',
        valueType:'number'
      },
      lat:{
        type:'input',
        label:'纬度',
        valueType:'number'
      },
      department:{
        type:'input',
        label:'所属部门'
      },
      departmentphone:{
        type:'input',
        label:'部门电话',
        valueType:'number'
      },
      contact:{
        type:'input',
        label:'联系人'
      },
      contactcellphone:{
        type:'input',
        label:'联系人电话',
        valueType:'number'
      },
      unit:{
        type:'input',
        label:'物资数量(套)',
        valueType:'number'
      },
      purpose:{
        type:'input',
        label:'用途'
      },
      address:{
        type:'input',
        label:'地址'
      },
    },
    rules: {
      name:[{ required: true, message: '请输入企业名称', trigger: 'blur' }],
      countyid:[{ required: true, message: '请选择区县', trigger: 'blur' }],
      lon:[{ required: false, message: '', trigger: 'blur' },],
      lat:[{ required: false, message: '', trigger: 'blur' },],
      department:[{ required: false, message: '', trigger: 'blur' }],
      departmentphone:[{ required: false, message: '', trigger: 'blur' },],
      address:[{ required: false, message: '', trigger: 'blur' }],
      contact:'',
      contactcellphone:[{ required: false, message: '', trigger: 'blur' },],
      unit:[{ required: false, message: '', trigger: 'blur' },],
    }
  }
}
