export class GridValue {
  constructor(ncInfo, values) {
      this._ncInfo = ncInfo;
      this._values = values;
  }

  getValue(lng, lat) {
      if(typeof lng !== 'number' || typeof lat !== 'number') {
          console.log('longitude or latitude is not Number.');
          return;
      }

      const ncInfo = this._ncInfo;
      const values = this._values;
      if(ncInfo === null || values === null) {
          console.log('ncInfo or grid values is null!');
          return;
      }

      let value = 0;
      let lonGap = ncInfo.lonGap,
          latGap = ncInfo.latGap;
      let latDiff = ncInfo.latDim * latGap,
          lonDiff = ncInfo.lonDim * lonGap;
      let leftLon = ncInfo.leftLon,
          topLat = ncInfo.topLat;
      let rightLon = leftLon + lonDiff,
          bottomLat = topLat - latDiff;

      if(lng > leftLon && lng < rightLon && lat > bottomLat && lat < topLat) {
          value = this._gridValue(lng, lat, leftLon, topLat, lonGap, latGap, values);
      }

      return value;
  }

  _gridValue(lon, lat, left, top, gapLon, gapLat, data) {
      let col = parseInt((lon - left)/gapLon, 10),
          row = parseInt((top - lat)/gapLat, 10);
      let lLon = left + col * gapLon,
          rLon = left + (col + 1) * gapLon,
          tLat = top - row * gapLat,
          bLat = top - (row + 1) * gapLat;

      if(!data[row][col] || !data[row][col+1] || !data[row+1][col] || !data[row+1][col+1])
          return false;

      let tv = this._linearInterp(lLon, data[row][col], rLon, data[row][col+1], lon),
          bv = this._linearInterp(lLon, data[row+1][col], rLon, data[row+1][col+1], lon);
      let v = this._linearInterp(tLat, tv, bLat, bv, lat);

      return v;
  }

  _linearInterp(x1, v1, x2, v2, x) {
      return v1 + (x - x1)/(x2 - x1)*(v2 - v1);
  }
}
