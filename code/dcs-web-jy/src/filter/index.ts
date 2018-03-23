export default {
  filterStationEles(key, info)  {
    if (!info
        || !(key in info)
        || Math.abs(info[key]) > 8888
        || (key === 'ps' && info[key] === 333.29)
        || (key === 'wd3smaxdf' && info[key] < 0)
        || (key === 'tempdaymax' && info[key] < -50)
        || (key === 'tempdaymin' && info[key] < -50)
        || (key === 'rfhour' && info[key] < 0)
        || (key === 'rfday' && info[key] < 0))
      return '无'
    let unit = {
      temp: '℃',
      ps: 'hpa',
      rh: '%',
      wd3smaxdf: 'm/s',
      wd3smaxdd: '°',
      tempdaymax: '℃',
      tempdaymin: '℃',
      rfhour: 'mm',
      rfday: 'mm',
    }
    return Math.round(info[key] * 10) / 10 + (unit[key] ? ' ' + unit[key] : '')
  }
}