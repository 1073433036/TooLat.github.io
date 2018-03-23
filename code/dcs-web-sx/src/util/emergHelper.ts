export class EmergResponse {
  constructor(regionConfig) {
    this.regionConfig = regionConfig;
  }
  rainThreshold: number[] = [50, 100, 250]
  urlStore = {
    baseUrl: 'http://10.148.83.228:8086/selection/',
    rainPast: 'last_rain_bigger/user/post/,/post',           //检测过去n天内，雨量是否超过x个单位
    rainFuture: 'forecast_rain_bigger/user/post/,/post',       //检测未来n天内，雨量是否超过x个单位
  }
  countyName = {
  }
  regionConfig = {
    cityId: 0,
    countyId: 0,
    cityName: '',
    countyName: ''
  }

  async typhMonitor() {
    let url = 'http://10.148.83.228:8086/evaluate/get/typhoon/warning/user/post/,/'
    let res = await fetch(url + '&cache=' + Date.now())
    let data = await res.json()

    let isDataEmpty = false
    Object.keys(data.tagObject).forEach(key => {
      isDataEmpty = true
      return
    })

    if (isDataEmpty)
      return data.tagObject
    else
      return false
  }

  async rainMonitor() {
    let pastReq: any[] = []
    let futureReq: any[] = []

    for (let item of this.rainThreshold) {
      pastReq.push(fetch(this.urlStore.baseUrl + this.urlStore.rainPast + '?n=1&x=' + item + `&cacheCtrl=${Date.now()}`, {
        mode: 'cors',
        method: 'get'
      }))
      futureReq.push(fetch(this.urlStore.baseUrl + this.urlStore.rainFuture + '?n=1&x=' + item + `&cacheCtrl=${Date.now()}`, {
        mode: 'cors',
        method: 'get'
      }))
    }

    let pastData = await Promise.all(pastReq)
    let futureData = await Promise.all(futureReq)
    pastReq = []
    futureReq = []
    for (let item of pastData) {
      pastReq.push(item.json())
    }
    for (let item of futureData) {
      futureReq.push(item.json())
    }
    pastData = await Promise.all(pastReq)
    futureData = await Promise.all(futureReq)

    // 判断是否达到一级报警
    if (this.deterIsLevelOne(pastData, futureData))
      return {
        level: 'I',
        text: `过去24小时全县三分之一以上镇出现特大暴雨，或三分之二以上镇出现大暴雨，
并造成严重影响;且预计未来24小时上述地区仍将出现暴雨以上降水。`
      }

    // 判断是否达到二级报警
    if (this.deterIsLevelTwo(pastData, futureData))
      return {
        level: 'II',
        text: `过去24小时全县1个以上镇出现特大暴雨，或二分之一以上镇出现大暴雨，
并造成严重影响，且预计未来24小时上述地区仍将出现暴雨以上降水；
或者预计未来24小时全县有三分之二以上镇将出现大暴雨降水`
      }

    // 判断是否达到三级报警
    if (this.deterIsLevelThree(pastData, futureData))
      return {
        level: 'III',
        text: `去24小时全县三分之一以上镇出现大暴雨天气，且预计未来24小时上述地区仍将出现暴雨天气；
或者预计未来24小时全县有二分之一以上镇将出现大暴雨降水`
      }

    // 判断是否达到四级报警
    if (this.deterIsLevelFour(pastData, futureData))
      return {
        level: 'IV',
        text: '预计未来24小时全县有三分之一以上镇将出现大暴雨降水'
      }

    return {
      level: '',
      text: '当前没有暴雨报警'
    }
  }

  async waterLevel() {
    let res = await fetch(`http://10.148.83.228:8086/hyd/reservior/user/post/,/?cacheCtrl=${Date.now()}`, {
      mode: 'cors',
    })
    let reservoir = await res.json()
    res = await fetch(`http://10.148.83.228:8086/hyd/river/user/post/,/?cacheCtrl=${Date.now()}`)
    let river = await res.json()

    let count = 0
    for (let item of reservoir.tagObject) {
      if (item.iswarning)
        count++
    }
    for (let item of river.tagObject) {
      if (item.iswarning)
        count++
    }

    return {
      level: count,
      text: `共有${count}个水位报警点超出阈值`
    }
  }

  private deterIsLevelFour(pastData: object[], futureData: object[]): boolean {
    let pastFlag = false,
      futureFlag = false,
      pastBCount = 0,
      futureBCount = 0,
      pastMCount = 0,
      futureMCount = 0,
      pastLCount = 0,
      futureLCount = 0,
      pastBLength = 0,
      futureBLength = 0,
      pastMLength = 0,
      futureMLength = 0,
      pastLLength = 0,
      futureLLength = 0

    if (futureData[1]) {
      Object.keys(futureData[1]).forEach(key => {
        futureMLength++
        if (futureData[1][key])
          futureMCount++
      })
    }
    if (futureMCount / futureMLength >= 1 / 3)
      futureFlag = true

    return futureFlag
  }
  private deterIsLevelThree(pastData: object[], futureData: object[]): boolean {
    let pastFlag = false,
      futureFlag = false,
      pastBCount = 0,
      futureBCount = 0,
      pastMCount = 0,
      futureMCount = 0,
      pastLCount = 0,
      futureLCount = 0,
      pastBLength = 0,
      futureBLength = 0,
      pastMLength = 0,
      futureMLength = 0,
      pastLLength = 0,
      futureLLength = 0

    if (pastData[1])
      Object.keys(pastData[1]).forEach(key => {
        pastMLength++
        if (pastData[1][key]) {
          pastMCount++
        }
      })
    if (futureData[1])
      Object.keys(futureData[1]).forEach(key => {
        futureMLength++
        if (futureData[1][key])
          futureMCount++
      })
    if (futureData[2])
      Object.keys(futureData[2]).forEach(key => {
        futureLLength++
        if (futureData[2][key])
          futureLCount++
      })
    if ((pastBCount / pastBLength >= 1 / 3) && futureLCount >= pastMCount)
      pastFlag = true
    if (futureMCount / futureMLength >= 0.5)
      futureFlag = true

    return pastFlag && futureFlag
  }
  private deterIsLevelTwo(pastData: object[], futureData: object[]): boolean {
    let pastFlag = false,
      futureFlag = false,
      pastBCount = 0,
      futureBCount = 0,
      pastMCount = 0,
      futureMCount = 0,
      pastLCount = 0,
      futureLCount = 0,
      pastBLength = 0,
      futureBLength = 0,
      pastMLength = 0,
      futureMLength = 0,
      pastLLength = 0,
      futureLLength = 0

    if (pastData[0])
      Object.keys(pastData[0]).forEach(key => {
        if (pastData[0][key]) {
          pastBCount++
        }
      })
    if (pastData[1])
      Object.keys(pastData[1]).forEach(key => {
        pastMLength++
        if (pastData[1][key])
          pastMCount++
      })
    if (futureData[1])
      Object.keys(futureData[1]).forEach(key => {
        futureMLength++
        if (futureData[1][key])
          futureMCount++
      })
    if (futureData[2])
      Object.keys(futureData[2]).forEach(key => {
        futureLLength++
        if (futureData[2][key])
          futureLCount++
      })
    if ((pastBCount / pastBLength >= 1 / 3) || (pastMCount / pastMLength >= 2 / 3))
      pastFlag = true
    if ((pastBCount || (pastMCount / pastMLength >= 0.5)) &&
      (futureLCount >= pastMCount || (futureMCount / futureMLength >= 2 / 3)))
      futureFlag = true

    return pastFlag && futureFlag
  }

  private deterIsLevelOne(pastData: object[], futureData: object[]): boolean {
    let pastFlag = false,
      futureFlag = false,
      pastBCount = 0,
      futureBCount = 0,
      pastMCount = 0,
      futureMCount = 0,
      pastLCount = 0,
      futureLCount = 0,
      pastBLength = 0,
      futureBLength = 0,
      pastMLength = 0,
      futureMLength = 0,
      pastLLength = 0,
      futureLLength = 0

    if (pastData[0]) 
      Object.keys(pastData[0]).forEach(key => {
        pastBLength++
        if (pastData[0][key])
          pastBCount++
      })
    if (pastData[1])
      Object.keys(pastData[1]).forEach(key => {
        pastMLength++
        if (pastData[1][key])
          pastMCount++
      })
    if (futureData[2])
      Object.keys(futureData[2]).forEach(key => {
        if (futureData[2][key])
          futureLCount++
      })
    if ((pastBCount / pastBLength >= 1 / 3) || (pastMCount / pastMLength >= 2 / 3))
      pastFlag = true
    if (futureLCount >= pastBCount)
      futureFlag = true

    return pastFlag && futureFlag
  }

}
