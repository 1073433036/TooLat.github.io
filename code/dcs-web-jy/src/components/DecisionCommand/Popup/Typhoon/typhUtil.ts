import axios from 'axios'
import jsonp from 'axios-jsonp'
export async function getAllHistoryTyph(callbackFunc) {
  let res: any = await axios('http://10.148.83.228:8921/typhoon/info/find')
  let data = res.data
  if (!Array.isArray(data) || !data.length) {
    callbackFunc(false)
    return
  }

  let historyTyphData: any = {},
    dateConverted: any = null,
    eachYear: any = null,
    eachMonth: any = null,
    itemNum: any = 0

  data.sort((a, b) => Number(a.tsid) - Number(b.tsid));
  let lastItemData: any = null,
    lastDate: any = null

  for (let i in data) {
    let el = data[i]
    let isCurrentTyph = Date.now() - 12*60*60*1000 < el.maxtime
    if ((!el.info || !el.info.cname) && !isCurrentTyph) continue    // 排除不存在中文名称 且 不是当前台风的数据
    if (!el.mintime) continue
    dateConverted = new Date(el.mintime)
    eachYear = dateConverted.getFullYear()
    if (!historyTyphData[eachYear]) {
      historyTyphData[eachYear] = {}
      itemNum = 0
    }
    eachMonth = dateConverted.getMonth() + 1
    if (!historyTyphData[eachYear][eachMonth])
      historyTyphData[eachYear][eachMonth] = []
    let targetMonth = historyTyphData[eachYear][eachMonth]

    lastItemData = {
      id: String(el.intlid).slice(2, 4),
      tsId: el.tsid,
      name: (el.info && el.info.cname) ? el.info.cname.replace(/[ ]/g, "").trim() : '未命名',
      startTime: dateConverted.getDate(),
      daysInMonth: daysInMonth(eachMonth, eachYear),
      itemNum,
      color: (el.info && el.info.tcrank) ? getRankByLevel(el.info.tcrank, 'color') : '#43d03c',
      levelName: (el.info && el.info.tcrank) ? getRankByLevel(el.info.tcrank, 'name') : '热带低压'
    }

    targetMonth.push(lastItemData)
    targetMonth.sort((a, b) => {
      return a.id > b.id
    })
    itemNum++

    if (typeof data[Number(i) + 1] === 'undefined') break
    lastDate = new Date(data[Number(i) + 1].mintime)
    if (lastDate.getFullYear() <= eachYear || !whetherExtraMonthNeeded(lastItemData))
      continue

    addingExtraMonth()
  }

  if (whetherExtraMonthNeeded(lastItemData)) {
    addingExtraMonth()
  }

  callbackFunc(historyTyphData)
  return historyTyphData

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
  function whetherExtraMonthNeeded(data) {
    let sixPersentDay = data.daysInMonth * .7
    if (data.startTime > sixPersentDay)
      return true
    else
      return false
  }
  function addingExtraMonth() {
    let lastDate = new Date(dateConverted)
    lastDate.setMonth(lastDate.getMonth() + 1)
    let monthString = lastDate.getMonth() === 0 ? `${lastDate.getFullYear()}-${lastDate.getMonth() + 1}`
      : lastDate.getMonth() + 1
    historyTyphData[eachYear][monthString] = []
  }
}


export async function getTyphDataById(tsId) {
  let resOfAllTyph = await axios('http://10.148.83.228:8921/typhoon/info/find')
  let dataOfAllTyph: any = resOfAllTyph.data
  let dataOfDetail = dataOfAllTyph.find(opt => opt.tsid === tsId)

  let res = await axios(`http://10.148.83.228:8921/typhoon/findForecastReal?tsid=${tsId}&fcid=BCGZ`)
  let data: any = res.data
  if (data.real) {
    for (let el of data.real) {
      el.lon = el.location.lon
      el.lat = el.location.lat
    }
    data.real.sort((a, b) => a.datetime - b.datetime)
  }
  if (data.forecast) {
    for (let el of data.forecast) {
      el.lon = el.location.lon
      el.lat = el.location.lat
    }
    data.forecast.sort((a, b) => a.leadtime - b.leadtime)
  }

  let typhPoints: any = data.real,
    day: any = null,
    date: any = null,
    hour: any = null,
    month: any = null,
    parsedData: any = {},
    levelFlag: any = null,
    lastMonthData: any = null,
    dateStringHolder: any = null


  for (let item of typhPoints) {
    date = new Date(item.datetime)
    month = date.getMonth() + 1
    day = date.getDate()

    let level = item.elements.tcrank ? item.elements.tcrank.trim() : 'LOW'

    dateStringHolder = `${month}-${day}`

    if (!parsedData[dateStringHolder])
      parsedData[dateStringHolder] = []

    if (parsedData[dateStringHolder].length >= 1 || levelFlag === level)
      continue
    levelFlag = level

    parsedData[dateStringHolder].push({
      levelName: getRankByLevel(level, 'name'),
      level: getRankByLevel(level, 'level'),
      startTime: date.getHours(),
      color: getRankByLevel(level, 'color')
    })
  }

  let lastTyphPoint = typhPoints[typhPoints.length - 1],
    dateOfLastTyphPoint = new Date(lastTyphPoint.datetime),
    lastTyphPointLevel = lastTyphPoint.elements.tcrank ? lastTyphPoint.elements.tcrank.trim() : 'LOW'
  parsedData[dateStringHolder].push({
    levelName: getRankByLevel(lastTyphPointLevel, 'name'),
    level: getRankByLevel(lastTyphPointLevel, 'level'),
    startTime: dateOfLastTyphPoint.getHours(),
    color: getRankByLevel(lastTyphPointLevel, 'color')
  })

  if (whetherExtraMonthNeeded()) {
    date.setDate(date.getDate() + 1)
    parsedData[`${date.getMonth() + 1}-${date.getDate()}`] = []
  }

  let timeForStartLine = new Date(typhPoints[0].datetime),
    timeForEndLine = new Date(typhPoints[typhPoints.length - 1].datetime)

  return {
    typhName: (dataOfDetail && dataOfDetail.info && dataOfDetail.info.cname) ? dataOfDetail.info.cname : '未命名',
    id: (dataOfDetail && dataOfDetail.intlid) ? dataOfDetail.intlid : '',
    tsId,
    parsedData,
    startLine: `${timeForStartLine.getMonth() + 1}-${timeForStartLine.getDate()}`,
    endLine: `${timeForEndLine.getMonth() + 1}-${timeForEndLine.getDate()}`,
    lineStartTime: timeForStartLine.getHours(),
    lineEndTime: timeForEndLine.getHours()
  }

  function whetherExtraMonthNeeded() {
    let lastPoint = typhPoints[typhPoints.length - 1],
      date = new Date(lastPoint.datetime)
    if (date.getHours() > 12)
      return true
    else
      return false
  }
}

export async function searchTyph(searchText) {
  let url = 'http://10.148.83.228:8921/typhoon/info/find?' + (isNaN(Number(searchText)) ? 'cname=' : 'intlid=') + searchText
  let res = await axios(url)
  return res.data
}


export function getRankByLevel(level, returnType) {
  let v = level ? level.trim() : level
  switch (v) {
    case 'TD':
      if (returnType === 'name')
        return '热带低压';
      else if (returnType === 'level')
        return 5
      else if (returnType === 'color')
        return '#43d03c'
    case 'TS':
      if (returnType === 'name')
        return '热带风暴';
      else if (returnType === 'level')
        return 4
      else if (returnType === 'color')
        return '#2d90f0'
    case 'STS':
      if (returnType === 'name')
        return '强热带风暴';
      else if (returnType === 'level')
        return 3
      else if (returnType === 'color')
        return '#e0cf34'
    case 'TY':
      if (returnType === 'name')
        return '台风';
      else if (returnType === 'level')
        return 2
      else if (returnType === 'color')
        return '#e68741'
    case 'STY':
      if (returnType === 'name')
        return '强台风';
      else if (returnType === 'level')
        return 1
      else if (returnType === 'color')
        return '#ac31b3'
    case 'SUPER':
      if (returnType === 'name')
        return '超强台风';
      else if (returnType === 'level')
        return 0
      else if (returnType === 'color')
        return '#ce4445'
    case 'SUPER TY':
      if (returnType === 'name')
        return '超强台风';
      else if (returnType === 'level')
        return 0
      else if (returnType === 'color')
        return '#ce4445'
    default:
      if (returnType === 'name')
        return '热带低压';
      else if (returnType === 'level')
        return 5
      else if (returnType === 'color')
        return '#43d03c'
  }
}