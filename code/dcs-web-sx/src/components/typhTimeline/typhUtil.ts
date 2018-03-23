import fetchJsonp from 'fetch-jsonp'
export async function getAllHistoryTyph(callbackFunc) {
  let data: any = await fetch(`http://10.148.83.228:8921/typhoon/info/find`)
  data = await data.json()

  let historyTyphData = {},
    dateConverted = null,
    eachYear = null,
    eachMonth = null,
    itemNum = 0

  data.reverse()
  data.sort((a, b) => Number(a.tsid) - Number(b.tsid));
  let lastItemData = null,
    lastDate = null

  for (let i in data) {
    let el = data[i]
    let isCurrentTyph = Date.now() - 12*60*60*1000 < el.maxtime
    if ((!el.info || !el.info.cname) && !isCurrentTyph) continue
    if (!el.mintime) continue
    dateConverted = new Date(el.mintime)
    dateConverted.setHours(dateConverted.getHours() + 8)
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
  let resOfAllTyph = await fetch('http://10.148.83.228:8921/typhoon/info/find')
  let dataOfAllTyph: any = await resOfAllTyph.json()
  let dataOfDetail = dataOfAllTyph.find(opt => opt.tsid === tsId)
  let res = await fetch(`http://10.148.83.228:8921/typhoon/findForecastReal?tsid=${tsId}&fcid=BCGZ`)
  let data: any = await res.json()
  if (data.real) {
    for (let el of data.real) {
      el.lon = el.location.lon
      el.lat = el.location.lat
    }
    data.real.sort((a, b) => a.datetime - b.datetime)
  }
  if (data.forecast) {
    let fstArr = []
    for (let el of data.forecast) {
      if (el.location.lon && el.location.lat) {
        el.lon = el.location.lon
        el.lat = el.location.lat
        fstArr.push(el)
      }
    }
    fstArr.sort((a, b) => a.leadtime - b.leadtime)
    data.forecast = fstArr
  }
  let typhPoints = data.real,
    day = null,
    date = null,
    hour = null,
    month = null,
    parsedData = {},
    levelFlag = null,
    lastMonthData = null,
    dateStringHolder = null


  for (let item of typhPoints) {
    date = new Date(item.datetime)
    date.setHours(date.getHours() + 8)
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
  dateOfLastTyphPoint.setHours(dateOfLastTyphPoint.getHours() + 8)
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
  timeForStartLine.setHours(timeForStartLine.getHours() + 8)
  timeForEndLine.setHours(timeForEndLine.getHours() + 8)

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
    date.setHours(date.getHours() + 8)
    if (date.getHours() > 12)
      return true
    else
      return false
  }
}


export function searchTyph(searchText, callbackFunc) {
  let searchUrl = {
    num: `http://10.148.83.228:1995/JmDcs/typhoon/getTsidByInterId?interId=${searchText}&callback=`,
    cns: `http://10.148.83.228:1995/JmDcs/typhoon/getTsidByName?name=${searchText}&callback=`
  },
    url = null

  if (!isNaN(searchText))
    url = searchUrl.num
  else
    url = searchUrl.cns
  window['searchTyph'] = data => {
    callbackFunc(data)
    window['searchTyph'] = null
    document.body.removeChild(script)
  }

  let script = document.createElement('script')
  script.src = decodeURI(url)
  document.body.appendChild(script)
}


export function getRankByLevel(level, returnType) {
  var v = level ? level.trim() : level;
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