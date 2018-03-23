export default {
  rain: {
    type: 'column',
    title: '未来3小时大雨及以上级别影响城镇',
    xAxis: ['大雨', '暴雨', '大暴雨', '特大暴雨'],
    series: [
      {
        name: '未来1h',
        color: '#7cb5ec'
      }, {
        name: '未来2h',
        color: '#f7a35c'
      }, {
        name: '未来3h',
        color: '#90ee7e'
      }
    ]
  },
  wind: {
    type: 'spline',
    title: '未来3小时8级及以上大风影响城镇',
    xAxis: ['8级', '9级', '10级', '11级', '12级', '13级', '14级及以上'],
    series: [
      {
        name: '未来1h',
        color: '#f45b5b'
      }, {
        name: '未来2h',
        color: '#8085e9'
      }, {
        name: '未来3h',
        color: '#55BF3B'
      }
    ]
  },
  geology: {
    type: 'areaspline',
    title: '未来3小时可能有地质灾害风险的城镇',
    xAxis: ['Ⅰ级', 'Ⅱ级', 'Ⅲ级', 'Ⅳ级'],
    series: [
      {
        name: '未来1h',
        color: '#7cb5ec'
      }, {
        name: '未来2h',
        color: '#f7a35c'
      }, {
        name: '未来3h',
        color: '#7798BF'
      }
    ]
  },
  storm: {
    type: 'column',
    title: '风暴潮影响城镇情况',
    xAxis: ['Ⅰ级', 'Ⅱ级', 'Ⅲ级', 'Ⅳ级'],
    series: [
      {
        name: '未来1h',
        color: '#FDD089'
      }, {
        name: '未来2h',
        color: '#FF7F79'
      }, {
        name: '未来3h',
        color: '#251535'
      }
    ]
  },
  thunder: {
    type: 'areaspline',
    title: '未来1小时受雷电影响城镇',
    xAxis: ['10分钟', '20分钟', '30分钟', '40分钟', '50分钟', '60分钟'],
    series: [
      {
        name: '影响城镇',
        color: '#7cb5ec'
      }
    ]
  }
}