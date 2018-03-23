// 根据字符串返回对应的 小时
export const getSelectedHour = (hourStr: string) => {

  let resultHour: number = 1
  switch (hourStr)
  {
    case 'oneHour':
      resultHour = 1;
      break;
    case 'threeHour':
      resultHour = 3;
      break;
    case 'sixHour':
      resultHour = 6;
      break;
    case 'twelveHour':
      resultHour = 12;
      break;
    case 'tFourHour':
      resultHour = 24;
      break;
    case 'sSencondHour':
      resultHour = 72;
      break;
  }
  return resultHour
}

//将参数字典转成对应的字符串
export const getUrlStrWithParas = (paras: any) => {

  let url:string = ''
  for (let key in paras){
    url = url + key + '=' + paras[key] + '&'
  }
  url = url.substring(0, url.length-1)
  return url
}

//将字符串转成后台要求格式
export const getFormatTimeStr = (day: string, hour: number, min: number) => {

  let hour1 = hour >= 10 ?  hour : '0' + hour
  let minute1 = min >= 10 ?  min : '0' + min
  let date1: string = day + ' ' + hour1 + ':' + minute1 + ':00'
  return date1
}

//判断图片url是否有效
export const imgUrlIsEffective = (imgUrl: string) => {

}


//PUP界面相关
export const getPUPLayerUrls = (strArr: string[], station: string) =>{
  if (strArr.length === 0)
    return []
  let baseUrl:string = 'http://10.148.10.80:8111/grid/pup/'
  let urlArr = strArr.map(function (item, index, input) {
    let itemStrArr = item.split('_');
    let typeStr: string = getTypeStringWiht(itemStrArr[0]);
    let timeStr = itemStrArr[strArr.length-1];
    let sizeStr = itemStrArr[2];
    return baseUrl + typeStr + '/' + timeStr + ',' + sizeStr + ',' + station + '/png/color';
  })
  return urlArr
}

export const getTypeStringWiht=(ele: string) =>{
  let typeStr: string = ''
  switch(ele){
    case 'BREF19':
      typeStr = 'r19'
      break;
    case 'BREF20':
      typeStr = 'r20'
      break;
    case 'BVEL26':
      typeStr = 'v26'
      break;
    case 'BVEL27':
      typeStr = 'v27'
      break;
    case 'ETOPS':
      typeStr = 'etops41'
      break;
    case 'VIL':
      typeStr = 'vil57'
      break;
    case '1HPRE':
      typeStr = 'pup78'
      break;
    case '3HPRE':
      typeStr = 'pup79'
      break;
    case 'STRAIN':
      typeStr = 'pup80'
      break;
    case 'CAPPI':
      typeStr = 'cappi100'
      break;
  }
  return typeStr
}


