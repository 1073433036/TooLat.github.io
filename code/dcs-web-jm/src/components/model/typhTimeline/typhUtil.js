export async function getAllHistoryTyph(http, callbackFunc) {
  //获取2003年以后的台风信息
  let after03Data = (await http.get('http://10.148.83.228:8921/typhoon/info/find')).data;
  //获取1949-2007年的台风信息
  let before07Data = [];
  let res = await http.jsonp('http://10.148.83.228:9020/JmDcs/discrete/typhoon228/d2').catch(e => {console.error('failed to get before of year 2007 typhoons')});
  if(res && Array.isArray(res.data))
    before07Data = res.data;

  let historyTyphData = {},
      dateConverted = null,
      eachYear = null,
      eachMonth = null,
      itemNum = 0,
      tsidArray = [];

  let lastItemData = null,
      lastDate = null;

  before07Data.sort((a, b) => Number(a.serialid) - Number(b.serialid));
  before07Data = before07Data.filter(el => {
    el.info = {};
    if(!el.tscname && el.tsename) {
      el.info.cname = el.tsename;
      el.tscname = el.tsename;
    }
    else
      el.info.cname = el.tscname;
    el.info.ename = el.tsename;
    el.intlid = el.tsid;
    let starttime = String(el.starttime),
        endtime = String(el.endtime);
    el.mintime = `${starttime.substring(0, 4)}-${starttime.substring(4, 6)}-${starttime.substring(6, 8)} `
      + `${starttime.substring(8, 10)}:00`;
    el.maxtime = `${endtime.substring(0, 4)}-${endtime.substring(4, 6)}-${endtime.substring(6, 8)} `
      + `${endtime.substring(8, 10)}:00`;
    el.level = getLevelByName(el.tslevel);
    el.info.tcrank = el.level;
    let flag;
    if(new Date(el.mintime).getFullYear() < 2003 && el.hasOwnProperty('tsename')) {
      flag = true;
      tsidArray.push(el.tsid);
    }
    //过滤未命名台风和2003-2007年的台风信息
    return flag;
  });

  after03Data.sort((a, b) => Number(a.tsid) - Number(b.tsid));
  after03Data = before07Data.concat(after03Data);

  after03Data.forEach((el, i) => {
    if (el.intlid === '' || !el.info || !el.mintime || !el.maxtime)
      return true;
    dateConverted = new Date(el.mintime);
    dateConverted.setHours(dateConverted.getHours() + 8);
    eachYear = dateConverted.getFullYear();
    if (!historyTyphData[eachYear]) {
      historyTyphData[eachYear] = {};
      itemNum = 0;
    }
    eachMonth = dateConverted.getMonth() + 1;
    if (!historyTyphData[eachYear][eachMonth])
      historyTyphData[eachYear][eachMonth] = [];
    let targetMonth = historyTyphData[eachYear][eachMonth];
    lastItemData = {
      id: String(el.intlid).slice(2, 4),
      tsId: el.tsid,
      name: el.info.cname ? el.info.cname.replace(/[ ]/g, "").trim() : '未命名',
      startTime: dateConverted.getDate(),
      daysInMonth: daysInMonth(eachMonth, eachYear),
      itemNum,
      color: getRankByLevel(el.info.tcrank, 'color')
    };

    targetMonth.push(lastItemData);
    targetMonth.sort((a, b) => {
      return a.id > b.id
    });
    itemNum++;

    if (typeof after03Data[i + 1] === 'undefined')
      return false;
    lastDate = new Date(after03Data[i + 1].mintime);
    if (lastDate.getFullYear() <= eachYear || !whetherExtraMonthNeeded(lastItemData))
      return true;

    addingExtraMonth();
  });

  if (whetherExtraMonthNeeded(lastItemData)) {
    addingExtraMonth();
  }

  //callbackFunc(historyTyphData, tsidArray);
  return {
    allTyphData: historyTyphData,
    before03TyphIds: tsidArray
  };
  //return historyTyphData;

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
  function whetherExtraMonthNeeded(data) {
    let sixPersentDay = data.daysInMonth * .7;
    if (data.startTime > sixPersentDay)
      return true;
    else
      return false;
  }
  function addingExtraMonth() {
    let lastDate = new Date(dateConverted);
    lastDate.setMonth(lastDate.getMonth() + 1);
    let monthString = lastDate.getMonth() === 0 ? `${lastDate.getFullYear()}-${lastDate.getMonth() + 1}`
      : lastDate.getMonth() + 1;
    historyTyphData[eachYear][monthString] = [];
  }
}

export async function getTyphDataById(http, tsId, isBefore03) {
  let tyPromise = isBefore03 ? http.jsonp(`http://10.148.83.228:9020/JmDcs/discrete/typhoon228/d1?tsid=${tsId}`)
    : http.get(`http://10.148.83.228:8921/typhoon/info/find?tsid=${tsId}&fcid=BCGZ`);
  let data = (await tyPromise).data;
  if(isBefore03) {
    let transData = {
      tsid: data[0].tsid,
      intlid: data[0].tsid,
      tscname: data[0].tscname || data[0].tsename,
      tsename: data[0].tsename,
      real: [],
      fst: [],
      tan: []
    };

    for(let el of data) {
      el.time = `${el.time.substring(0, 4)}-${el.time.substring(4, 6)}-${el.time.substring(6, 8)}`
        + ` ${el.time.substring(8, 10)}:00:00`;
      el.level = getLevelByName(el.level);
      transData.real.push(el);
    }
    data = transData;
  }
  else {
    data = data[0];
    data = {
      tscname: data.info.cname,
      tsename: data.info.ename,
      real: [],
      fst: [],
      tan: [],
      ...data
    };
    let tyData = await Promise.all([
      http.get(`http://10.148.83.228:8921/typhoon/real/find?tsid=${tsId}&fcid=BCGZ`),    //获取台风的实况路径
      http.get(`http://10.148.83.228:8921/typhoon/forecast/find?tsid=${tsId}&fcid=BCGZ`)  //获取台风的所有预报路径
    ]);

    let realPathData = tyData[0].data, allFstData = tyData[1].data;
    if(Array.isArray(realPathData) && realPathData.length) {
      realPathData.sort((a, b) => a.datetime - b.datetime);
      data.real = realPathData.map(el => {
        return {
          time: new Date(el.datetime).Format('yyyy-MM-dd HH:00:00'),
          level: el.elements.tcrank,
          ps: el.elements.pressure,
          ws: el.elements.windspeed,
          lon: el.location.lon,
          lat: el.location.lat,
          degrees: [el.location.lon, el.location.lat],
          ...el
        };
      });
    }

    if(Array.isArray(allFstData) && allFstData.length) {
      let fstData = {};
      for(let item of allFstData) {
        if(!Number(item.location.lon) || !Number(item.location.lat))
          continue;
        let worldTime = new Date(item.datetime).Format('yyyy-MM-dd HH:00:00');  //台风时间为世界时
        if(worldTime in fstData === false)
          fstData[worldTime] = [];
        item.lon = item.location.lon;
        item.lat = item.location.lat;
        item.level = item.elements.tcrank;
        item.ps = item.elements.pressure;
        item.ws = item.elements.windspeed;
        fstData[worldTime].push(item);
      }
      for(let i in fstData) {
        fstData[i].sort((a, b) => Number(a.leadtime) - Number(b.leadtime));
      }

      for(let point of data.real) {
        if(point.time in fstData) {
          point.fst = fstData[point.time];
        }
      }
    }
  }

  return data;
}

export async function getTyphLineData(data/*http, tsId, isBefore03*/) {
  //let data = await getTyphDataById(http, tsId, isBefore03);
  let typhPoints = data.real,
      day = null,
      date = null,
      hour = null,
      month = null,
      parsedData = {},
      levelFlag = null,
      lastMonthData = null,
      dateStringHolder = null;


  for (let item of typhPoints) {
    date = new Date(item.time);
    date.setHours(date.getHours() + 8);
    month = date.getMonth() + 1;
    day = date.getDate();

    let level = item.level.trim();

    dateStringHolder = `${month}-${day}`;

    if (!parsedData[dateStringHolder])
      parsedData[dateStringHolder] = [];

    if (parsedData[dateStringHolder].length >= 1 || levelFlag === level)
      continue;
    levelFlag = level;

    parsedData[dateStringHolder].push({
      levelName: getRankByLevel(level, 'name'),
      level: getRankByLevel(level, 'level'),
      startTime: date.getHours(),
      color: getRankByLevel(level, 'color')
    });
  }

  if (whetherExtraMonthNeeded()) {
    date.setDate(date.getDate() + 1);
    parsedData[`${date.getMonth() + 1}-${date.getDate()}`] = [];
  }

  let timeForStartLine = new Date(typhPoints[0].time),
    timeForEndLine = new Date(typhPoints[typhPoints.length - 1].time);
  timeForStartLine.setHours(timeForStartLine.getHours() + 8);
  timeForEndLine.setHours(timeForEndLine.getHours() + 8);

  return {
    typhName: data.tscname,
    id: data.intlid,
    tsId: data.tsid,
    parsedData,
    startLine: `${timeForStartLine.getMonth() + 1}-${timeForStartLine.getDate()}`,
    endLine: `${timeForEndLine.getMonth() + 1}-${timeForEndLine.getDate()}`,
    lineStartTime: timeForStartLine.getHours(),
    lineEndTime: timeForEndLine.getHours()
  }

  function whetherExtraMonthNeeded() {
    let lastPoint = typhPoints[typhPoints.length - 1],
        date = new Date(lastPoint.time);
    date.setHours(date.getHours() + 8);
    return date.getHours() > 12;
  }
}

export async function searchTyph($http, searchText) {
  let paramStr = (/^[a-zA-Z]$/.test(searchText) ? 'ename=' : 'cname=') + searchText;
  let data = (await $http.get(`http://10.148.83.228:8921/typhoon/info/find?${paramStr}`)).data;

  return data;
}


export function getRankByLevel(level, type) {
  const levelSet = {
    'TD': { name: '热带低压', level: 5, color: '#43d03c' },
    'TS': { name: '热带风暴', level: 4, color: '#2d90f0' },
    'STS': { name: '强热带风暴', level: 3, color: '#e0cf34' },
    'TY': { name: '台风', level: 2, color: '#e68741' },
    'STY': { name: '强台风', level: 1, color: '#ac31b3' },
    'SUPER': { name: '超强台风', level: 0, color: '#ce4445' },
    'SUPER TY': { name: '超强台风', level: 0, color: '#ce4445' }
  };
  if(!level)
    return levelSet['TD'][type];
  let v = level.trim();

  return levelSet.hasOwnProperty(v) ? levelSet[v][type] : '';
}

function getLevelByName(name) {
  let level;
  switch (name) {
    case '热带风暴':
      level = 'TS';
      break;
    case '强热带风暴':
      level = 'STS';
      break;
    case '台风':
      level = 'TY';
      break;
    case '强台风':
      level = 'STY';
      break;
    case '超强台风':
      level = 'SUPER';
      break;
    default:
      level = 'TD';
  }
  return level;
}
