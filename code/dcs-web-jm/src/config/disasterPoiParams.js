export default {
  tide: {
    name: {
      label: '地址',
      width: '',
      rules: { type: 'string', value: '', required: true, trigger: 'blur', message: '请输入隐患点地址' }
    },
    lon: {
      label: '经度',
      width: '',
      rules: { type: 'number', value: '', required: true, trigger: 'blur',  }
    },
    lat: {
      label: '纬度',
      width: '',
      rules: { type: 'number', value: '', required: true, trigger: 'blur', }
    },
    windThreshold: {
      label: '大风阈值(m/s)',
      width: '',
      rules: { type: 'number', value: 17.2, required: true, trigger: 'blur', message: '请输入大风阈值' }
    },
    expand: {
      label: '雨量阈值(mm)',
      threshold: {
        r1: {
          label: '未来1小时',
          rules: { type: 'number', value: 10, required: true, trigger: 'blur', message: '请输入未来1小时雨量阈值' }
        },
        r2: {
          label: '未来2小时',
          rules: { type: 'number', value: 15, required: true, trigger: 'blur', message: '请输入未来2小时雨量阈值' }
        },
        r3: {
          label: '未来3小时',
          rules: { type: 'number', value: 20, required: true, trigger: 'blur', message: '请输入未来3小时雨量阈值' }
        },
        r6: {
          label: '未来6小时',
          rules: { type: 'number', value: 25, required: true, trigger: 'blur', message: '请输入未来6小时雨量阈值' }
        },
        r12: {
          label: '未来12小时',
          rules: { type: 'number', value: 30, required: true, trigger: 'blur', message: '请输入未来12小时雨量阈值' }
        },
        r24: {
          label: '未来24小时',
          rules: { type: 'number', value: 50, required: true, trigger: 'blur', message: '请输入未来24小时雨量阈值' }
        },
        r48: {
          label: '未来48小时',
          rules: { type: 'number', value: 50, required: true, trigger: 'blur', message: '请输入未来48小时雨量阈值' }
        },
        r72: {
          label: '未来72小时',
          rules: { type: 'number', value: 100, required: true, trigger: 'blur', message: '请输入未来72小时雨量阈值' }
        }
      }
    }
  },
  waterlog: {
    name: {
      label: '内涝点',
      width: 120,
      rules: { type: 'string', value: '', required: true, trigger: 'blur', message: '请输入隐患点名称' }
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
    manager: {
      label: '负责人',
      width: 80,
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入负责人' }
    },
    cause: {
      label: '内涝成因',
      width: '',
      rules: { type: 'string', value: '', required: false, rigger: 'blur', message: '请输入内涝成因' }
    },
    detail: {
      label: '内涝详情',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入内涝详情' }
    },
    phoneNum: {
      label: '联系电话',
      width: 100,
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入联系电话' }
    },
    address: {
      label: '地址',
      width: 200,
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入地址' }
    },
    expand: {
      label: '雨量阈值(mm)',
      threshold: {
        blue: {
          label: '蓝色预警',
          rules: { type: 'number', value: 5, required: true, trigger: 'blur', message: '请输入蓝色预警雨量阈值' }
        },
        yellow: {
          label: '黄色预警',
          rules: { type: 'number', value: 20, required: true, trigger: 'blur', message: '请输入黄色预警雨量阈值' }
        },
        orange: {
          label: '橙色预警',
          rules: { type: 'number', value: 55, required: true, trigger: 'blur', message: '请输入橙色预警雨量阈值' }
        },
        red: {
          label: '红色预警',
          rules: { type: 'number', value: 100, required: true, trigger: 'blur', message: '请输入红色预警雨量阈值' }
        }
      }
    }
  },
  geol: {
    name: {
      label: '名称',
      width: 160,
      rules: { type: 'string', value: '', required: true, trigger: 'blur', message: '请输入隐患点名称' }
    },
    countyName: {
      label: '所属区/县',
      width: 80,
      rules: { value: '', required: true, trigger: 'change', message: '请选择隐患点区/县', options: [] }
    },
    longitude: {
      label: '经度',
      width: 60,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入隐患点经度' }
    },
    latitude: {
      label: '纬度',
      width: 60,
      rules: { type: 'number', value: '', required: true, trigger: 'blur', message: '请输入隐患点纬度' }
    },
    type: {
      label: '类型',
      width: 60,
      rules: { value: '', required: true, trigger: 'change', message: '请选择灾害类型',
        options: [
          { name: '崩塌', key: '崩塌' },
          { name: '滑坡', key: '滑坡' },
          { name: '滑坡&崩塌群', key:'滑坡&崩塌群' },
          { name: '泥石流', key: '泥石流' },
          { name: '地面塌陷', key: '地面塌陷' },
          { name: '崩塌滑坡', key: '崩塌滑坡' },
          { name: '地裂缝', key: '地裂缝' },
          { name: '地面沉降', key: '地面沉降' }
        ]
      }
    },
    risk: {
      label: '危险程度',
      width: 60,
      rules: { value: '', required: false, trigger: 'change', message: '请选择危险程度',
        options: [
          { name: '小', key: '小' },
          { name: '中', key: '中' },
          { name: '大', key: '大' },
          { name: '特大', key: '特大' }
        ]
      }
    },
    stability: {
      label: '稳定性',
      width: 60,
      rules: { value: '', required: false, trigger: 'change', message: '请选择稳定性',
        options: [
          { name: '差', key: '差' },
          { name: '较差', key: '较差' },
          { name: '不稳定', key: '不稳定' },
          { name: '基本稳定', key: '基本稳定' },
          { name: '中', key: '中' },
          { name: '好', key: '好' }
        ]
      }
    },
    level: {
      label: '灾害体规模',
      width: '',
      rules: { value: '', required: false, trigger: 'change', message: '请选择规模',
        options: [
          { name: '小型', key: '小型' },
          { name: '中型', key: '中型' },
          { name: '大型', key: '大型' },
          { name: '特大型', key: '特大型' }
        ]
      }
    },
    responsible: {
      label: '责任人',
      width: 60,
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入责任人' }
    },
    telephone: {
      label: '电话',
      width: 100,
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入电话' }
    },
    gdp: {
      label: '潜在损失(万元)',
      width: 100,
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入潜在损失' }
    },
    people: {
      label: '威胁人员(人)',
      width: 100,
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入威胁人数' }
    },
    address: {
      label: '地址',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入地址' }
    },
    scale: {
      label: '灾害规模(平方米)',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入灾害规模' }
    },
    measure: {
      label: '预防/防治对策',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入预防/防治对策' }
    },
    factor: {
      label: '诱发因素',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入诱发因素' }
    },
    expand: {
      label: '雨量阈值(mm)',
      threshold: {
        r1: {
          label: '未来1小时',
          rules: { type: 'number', value: 8, required: true, trigger: 'blur', message: '请输入未来1小时雨量阈值' }
        },
        r2: {
          label: '未来2小时',
          rules: { type: 'number', value: 16, required: true, trigger: 'blur', message: '请输入未来2小时雨量阈值' }
        },
        r3: {
          label: '未来3小时',
          rules: { type: 'number', value: 25, required: true, trigger: 'blur', message: '请输入未来3小时雨量阈值' }
        },
        r6: {
          label: '未来6小时',
          rules: { type: 'number', value: 50, required: true, trigger: 'blur', message: '请输入未来6小时雨量阈值' }
        },
        r12: {
          label: '未来12小时',
          rules: { type: 'number', value: 100, required: true, trigger: 'blur', message: '请输入未来12小时雨量阈值' }
        },
        r24: {
          label: '未来24小时',
          rules: { type: 'number', value: 200, required: true, trigger: 'blur', message: '请输入未来24小时雨量阈值' }
        },
        r48: {
          label: '未来48小时',
          rules: { type: 'number', value: 200, required: true, trigger: 'blur', message: '请输入未来48小时雨量阈值' }
        },
        /*factor: {
          label: '权重因子',
          rules: { type: 'number', value: 1, required: true, trigger: 'blur', message: '请输入权重因子' }
        }*/
      }
    }
  },
  torrent: {
    name: {
      label: '名称',
      width: 120,
      rules: { type: 'string', value: '', required: true, trigger: 'blur', message: '请输入隐患点名称' }
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
    code: {
      label: '行政代码',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入行政代码' }
    },
    river: {
      label: '山洪沟名称',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入隐患点所属河流' }
    },
    town: {
      label: '所在乡镇街道',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入隐患点所在城镇' }
    },
    village: {
      label: '所在村委员会',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入隐患点所在村委会' }
    },
    height: {
      label: '海拔高度(米)',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入隐患点位势高度' }
    },
    drainage: {
      label: '流域面积',
      width: '',
      rules: { type: 'number', value: 0, required: false, trigger: 'blur', message: '请输入隐患点流域面积' }
    },
    storagetime: {
      label: '入库时间',
      width: '',
      rules: { type: 'string', value: '', required: false, trigger: 'blur', message: '请输入入库时间' }
    },
    expand: {
      label: '雨量阈值(mm)',
      threshold: {
        p24: {
          label: '过去24小时',
          rules: { type: 'number', value: 200, required: true, trigger: 'blur', message: '请输入过去24小时雨量阈值' }
        },
        p12: {
          label: '过去12小时',
          rules: { type: 'number', value: 100, required: true, trigger: 'blur', message: '请输入过去12小时雨量阈值' }
        },
        p6: {
          label: '过去6小时',
          rules: { type: 'number', value: 50, required: true, trigger: 'blur', message: '请输入过去6小时雨量阈值' }
        },
        p3: {
          label: '过去3小时',
          rules: { type: 'number', value: 25, required: true, trigger: 'blur', message: '请输入过去3小时雨量阈值' }
        },
        p2: {
          label: '过去2小时',
          rules: { type: 'number', value: 16, required: true, trigger: 'blur', message: '请输入过去2小时雨量阈值' }
        },
        p1: {
          label: '过去1小时',
          rules: { type: 'number', value: 8, required: true, trigger: 'blur', message: '请输入过去1小时雨量阈值' }
        },
        p0: {
          label: '当前时次',
          rules: { type: 'number', value: 8, required: true, trigger: 'blur', message: '请输入当前时次雨量阈值' }
        },
        r1: {
          label: '未来1小时',
          rules: { type: 'number', value: 8, required: true, trigger: 'blur', message: '请输入未来1小时雨量阈值' }
        },
        r2: {
          label: '未来2小时',
          rules: { type: 'number', value: 16, required: true, trigger: 'blur', message: '请输入未来2小时雨量阈值' }
        },
        r3: {
          label: '未来3小时',
          rules: { type: 'number', value: 25, required: true, trigger: 'blur', message: '请输入未来3小时雨量阈值' }
        }
      }
    }
  }
}
