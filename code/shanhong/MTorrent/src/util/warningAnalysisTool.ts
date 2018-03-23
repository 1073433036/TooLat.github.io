

//      if (typeof resultData === 'boolean'){
//        alert(resultData)
//      }
//
//      if (resultData instanceof Array) {
//        alert(resultData.count)
//      }

export const getMarskUrl = (ele: any) =>{
  let typeStr: string = ''
  if (Number(ele.V_TFLEV) > 0) {
    typeStr = 'A' + Number(ele.V_TFLEV)
  }else if (Number(ele.V_BYLEV) > 0){
    typeStr = 'B' + Number(ele.V_BYLEV)
  }else {
    typeStr = '其他'
  }

  return  `static/img/issue/${typeStr}.png`

  // switch (typeStr) {
  //   case 'A0':
  //     markUrl = 'static/img/issue/tf0.png'
  //     break;
  //   case 'A1':
  //     markUrl = 'static/img/issue/white.png'
  //     break;
  //   case 'A2':
  //     markUrl = 'static/img/issue/blue.png'
  //     break;
  //   case 'A3':
  //     markUrl = 'static/img/issue/yellow.png'
  //     break;
  //   case 'A4':
  //     markUrl = 'static/img/issue/orange.png'
  //     break;
  //   case 'A5':
  //     markUrl = 'static/img/issue/red.png'
  //     break;
  //
  //   case 'B0':
  //     markUrl = 'static/img/issue/rain0.png'
  //     break;
  //   case 'B3':
  //     markUrl = 'static/img/issue/rainyellow.png'
  //     break;
  //   case 'B4':
  //     markUrl = 'static/img/issue/rainorange.png'
  //     break;
  //   case 'B5':
  //     markUrl = 'static/img/issue/rainred.png'
  //     break;
  // }
  // return markUrl
}



export const getRiskResponseMarskUrl = (ele: any, type: string) =>{
  let typeStr: string = ''
  if (Number(ele.V_TFLEV) > 0 && type == '台风') {
    typeStr = 'A' + Number(ele.V_TFLEV)
  }else if (Number(ele.V_BYLEV) > 0 && type == '暴雨'){
    typeStr = 'B' + Number(ele.V_BYLEV)
  }else if (Number(ele.V_LYLEV) > 0 && type == '雷雨大风'){
    typeStr = 'G' + Number(ele.V_LYLEV)
  }else if (Number(ele.V_BBLEV) > 0 && type == '冰雹'){
    typeStr = 'I' + Number(ele.V_BBLEV)
  }

  return `static/img/issue/${typeStr}.png`

  // switch (typeStr) {
  //   case 'A0':  //台风
  //     markUrl = 'static/img/issue/tf0.png'
  //     break;
  //   case 'A1':
  //     markUrl = 'static/img/issue/white.png'
  //     break;
  //   case 'A2':
  //     markUrl = 'static/img/issue/blue.png'
  //     break;
  //   case 'A3':
  //     markUrl = 'static/img/issue/yellow.png'
  //     break;
  //   case 'A4':
  //     markUrl = 'static/img/issue/orange.png'
  //     break;
  //   case 'A5':
  //     markUrl = 'static/img/issue/red.png'
  //     break;
  //
  //   case 'B0': // 暴雨
  //     markUrl = 'static/img/issue/rain0.png'
  //     break;
  //   case 'B3':
  //     markUrl = 'static/img/issue/rainyellow.png'
  //     break;
  //   case 'B4':
  //     markUrl = 'static/img/issue/rainorange.png'
  //     break;
  //   case 'B5':
  //     markUrl = 'static/img/issue/rainred.png'
  //     break;
  //
  //   case 'G0':  // 雷雨大风
  //     markUrl = 'static/img/issue/thunderblue.png'
  //     break;
  //   case 'G2':
  //     markUrl = 'static/img/issue/thunderblue.png'
  //     break;
  //   case 'G3':
  //     markUrl = 'static/img/issue/thunderyellow.png'
  //     break;
  //   case 'G4':
  //     markUrl = 'static/img/issue/thunderorange.png'
  //     break;
  //   case 'G5':
  //     markUrl = 'static/img/issue/thunderred.png'
  //     break;
  //
  //   case 'I0':  // 冰雹
  //     markUrl = 'static/img/issue/thunderblue.png'
  //     break;
  //   case 'I4':
  //     markUrl = 'static/img/issue/hailorange.png'
  //     break;
  //   case 'I5':
  //     markUrl = 'static/img/issue/hailred.png'
  //     break;
  // }
  // return markUrl
}
