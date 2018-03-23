export class  ZmapHelper {
  static isPointInPolygon(point, polygon) {
    let px = point[1],
        py = point[0],
        flag = false;
    for (let i = 0, l = polygon.length, j = l - 1; i < l; j = i, i++) {
      let p1 = polygon[i],
          p2 = polygon[j];
      let sx = p1[1],
          sy = p1[0],
          tx = p2[1],
          ty = p2[0];
  
      if ((sx === px && sy === py) || (tx === px && ty === py)) return true;
  
      if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
        let x = sx + (py - sy) * (tx - sx) / (ty - sy);
  
        if (x === px) return true;
        if (x > px) flag = !flag;
      }
    }
    return flag
  }

  // 经纬度 转 度分秒
  static formatLatLng(num) {
    let angle = Math.floor(num)
    let decimal = num - angle
    if (decimal === 0) return angle + '°'
    let p = decimal * 60
    let point = Math.floor(p)
    let pointDec = p - point
    let sec = Math.floor(pointDec * 60 * 100) / 100
    return angle + '°' + point + '\'' + sec + '"'
  }
}