export default class {
  static getVelLevel(vel:number) {
    let levels = [0.5,2.6,4.6,6.6,8.6,10.5,12.5,14.5,16.5,18.5,20.5,22.5,24.5,26.5,28.5,30.5,32.5,34.5,36.5,38.6];
    for (let i = 0; i < levels.length; i++){
      if (vel < levels[i]) return i;
    }
    return 20;
  }

  static getDirLevel(dir:number) {
    let windDir = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风'];
    let dirBound = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
    for (let i = 0; i < dirBound.length - 1; i++){
      if (dir > dirBound[i] && dir <= dirBound[i+1])
        return windDir[i+1];
    }
    return windDir[1];
  }
}