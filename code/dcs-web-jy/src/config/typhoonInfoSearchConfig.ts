//台风登陆地点配置
export const landings = [
  {
    label: '揭阳',
    value: ['揭阳']
  },
  {
    label: '湛江到海南',
    value: ['湛江', '海南']
  },
  {
    label: '江门到茂名',
    value: ['江门', '阳江', '茂名']
  },
  {
    label: '珠海到深圳',
    value: ['珠海', '深圳']
  },
  {
    label: '惠州到汕尾',
    value: ['惠州', '汕尾']
  },
  {
    label: '汕头到潮州',
    value: ['汕头', '潮州']
  }
]
//台风登陆点距离站点距离
export const distances = [
  {
    label: '100公里内',
    value: [0, 100]
  },
  {
    label: '100-200公里内',
    value: [100, 200]
  },
  {
    label: '200-300公里内',
    value: [200, 300]
  },
  {
    label: '500公里及以上',
    value: [500, 4000]
  }
]
//台风登陆等级
export const levels = [
  {
    label: '热带风暴',
    value: ['TS']
  },
  {
    label: '强热带风暴',
    value: ['STS']
  },
  {
    label:'台风',
    value: ['TY']
  },
  {
    label:'强台风',
    value: ['STY']
  },
  {
    label:'超强台风',
    value: ['SUPER']
  }
]
//台风登陆月份
export const months = [
  {
    label: '1-3月份',
    value: [1, 2, 3]
  },
  {
    label: '4-6月份',
    value: [4, 5, 6]
  },
  {
    label: '7-8月份',
    value: [7,8]
  },
  {
    label: '9-10月份',
    value: [9,10]
  },
  {
    label: '11-12月份',
    value: [11, 12]
  }
]
//站点最大风力配置
export const windRanges = [
  {
    label: '12级及以上',
    value: [32.6, 150]
  },
  {
    label: '10-11级',
    value: [24.5, 32.6]
  },
  {
    label: '8-9级',
    value: [17.2, 24.5]
  },
  {
    label: '7级或以下',
    value: [0, 17.2]
  }
]
//站点最大雨量配置
export const rainRanges = [
  {
    label: '特大暴雨(≥250)',
    value: [250, 1000]
  },
  {
    label: '大暴雨(100-250)',
    value: [100, 250]
  },
  {
    label: '暴雨(50-100)',
    value: [51, 100]
  },
  {
    label: '大雨及以下(≤50)',
    value: [0, 50]
  }
]
