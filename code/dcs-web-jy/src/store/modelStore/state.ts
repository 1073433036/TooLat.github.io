export class State {
  modelData: any = {
    selectedModel: null,
    isAnalyzing: false,
    ncInfo: null,
    gridNcInfo: null,
    seledTime: 0,
    ranges: [],
    townsIdList: [],
    townsData: null,
    countyData: null,
    riverHandler: null,
    analysisType: null,
    affectedTownsList: [],
    targetWarningData: {
      speakerNum: 0,
      LEDNum: 0,
    },
    riverData: null,  //河流流向数据
    riverRoadData: null,
    riverRoadTipData: {
      style: {
        top: 0,
        left: 0
      },
      info: null
    },
    roadNameLabels: {},
    reservoirData: {   //水库统计雨量信息
      list: [],
      namesList: [],
      columns: {
        'rain24': { text: 'P_24h', cname: '过去24h', threshold: 80, count: 0 },
        'rain12': { text: 'P_12h', cname: '过去12h', threshold: 50, count: 0 },
        'rain06': { text: 'P_6h', cname: '过去6h', threshold: 25, count: 0 },
        'rain03': { text: 'P_3h', cname: '过去3h', threshold: 15, count: 0 },
        'rain02': { text: 'P_2h', cname: '过去2h', threshold: 10, count: 0 },
        'rain01': { text: 'P_1h', cname: '过去1h', threshold: 8, count: 0 },
        'qpe': { text: '实况', cname: '实况', threshold: 8, count: 0 },
        't1': { text: 'F_1h', cname: '未来1h', threshold: 8, count: 0 },
        't2': { text: 'F_2h', cname: '未来2h', threshold: 10, count: 0 },
        't3': { text: 'F_3h', cname: '未来3h', threshold: 15, count: 0 }
      }
    },
    isShowStatRain: false,   //是否显示水库统计雨量表格
    isShowWaterlogStat: false, //是否显示内涝点雨量统计表格
  }
}