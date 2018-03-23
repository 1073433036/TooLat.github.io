export class SvgHelper {
  constructor(pathData, pxFactor = 200, lineColorData = []) {
    this.pathData = pathData
    this.pathRule = null
    this.lineColorData = lineColorData

    this.svgHeader = 'data:image/svg+xml,'
    this.svgSuffix = "</svg>"

    this.svgPathStart = '<path d="M '
    this.svgLineStart = '<line '

    this.svgLineHolder = []
    this.pxFactor = pxFactor
  }

  getSvgImg(styleString, isClose = true) {
    if (this.pathRule === null)
      this.analysisPathRule()
    if (this.svgPathStart.length <= 11)
      this.genSvgPath()
    return {
      pathRule: this.pathRule,
      svgImg: this.svgHeader + this.getSvgPrefix() + this.svgPathStart + this.getSvgPathEnd(styleString, isClose)
      + this.svgSuffix
    }
  }

  getSvgPoint(styleString) {
    let prefix = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15" height="15" xml:space="preserve" shape-rendering="geometricPrecision">'
    let pointString = `<circle cx="7.5" cy="7.5" r="6.5" stroke-width="0.5" style="${styleString}" />`
    return this.svgHeader + prefix + pointString + this.svgSuffix
  }

  getSvgLine(styleString) {
    if (this.pathRule === null)
      this.analysisPathRule()
    if (this.svgLineHolder.length === 0)
      this.genSvgLine()
    return {
      pathRule: this.pathRule,
      svgImg: this.svgHeader + this.getSvgPrefix() + this.getSvgLineStr(styleString) + this.svgSuffix
    }
  }

  /*getSvgLine(styleString) {
    let prefix = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15" height="15" xml:space="preserve" shape-rendering = "geometricPrecision">'
    let  = `<circle cx="7.5" cy="7.5" r="6.5" stroke-width="1.5" style="${styleString}" />`
    return this.svgHeader + prefix + pointString + this.svgSuffix
  }*/

  changePathData(data) {
    this.pathData = data
    this.pathRule = null
    this.svgPathStart = '<path d="M '
  }

  analysisPathRule() {
    let arr = this.pathData.slice(0).sort((a, b) => a - b),
      length = arr.length,
      latDiff = arr[length / 2 - 1] - arr[0],
      lonDiff = arr[length - 1] - arr[length / 2]

    /*latDiff = latDiff === 0 ? latDiff : 0.1
    lonDiff = lonDiff === 0 ? lonDiff : 0.1*/

    this.pathRule = {
      rect: {
        top: Number(arr[length / 2 - 1]) + latDiff * 0.05,
        bottom: Number(arr[0]) - latDiff * 0.05,
        left: Number(arr[length / 2]) - lonDiff * 0.05,
        right: Number(arr[length - 1]) + lonDiff * 0.05
      },
      latDiff,
      lonDiff
    }
  }

  getSvgPathEnd(styleString, isClose = true) {
    return ` ${isClose ? 'Z' : ''}" style="${styleString}"  />`
  }

  getSvgPrefix() {
    let width = (this.pathRule.lonDiff * 1.1 * this.pxFactor).toFixed(0),
      height = (this.pathRule.latDiff * 1.1 * this.pxFactor).toFixed(0)

    width = width === 0 ? .1 : width
    height = height === 0 ? .1 : height

    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="${width}" height="${height}" xml:space="preserve" shape-rendering="geometricPrecision">
   `
  }

  genSvgPath() {
    let pathData = [],
      pathRule = this.pathRule,
      svgPathStart = this.svgPathStart,
      pxFactor = this.pxFactor

    this.pathData.forEach((el, index) => {
      if (index % 2 === 0 || index === 0) {
        pathData.push(el - pathRule.rect.left)
      } else {
        pathData.push(el - pathRule.rect.bottom)
      }
    })

    let lonIncreat = pathRule.lonDiff * 0.05,
      latIncreat = pathRule.latDiff * 0.05
    svgPathStart += ((pathData[0]) * pxFactor).toFixed(4) + ','
    svgPathStart += ((pathRule.latDiff * 1.1 - pathData[1]) * pxFactor).toFixed(4) + ' '
    let pathLength = pathData.length
    for (let i = 2; i < pathLength; i += 2) {
      svgPathStart += 'L '
      svgPathStart += ((pathData[i]) * pxFactor).toFixed(4) + ','
      svgPathStart += ((pathRule.latDiff * 1.1 - pathData[i + 1]) * pxFactor).toFixed(4) + ' '
    }

    this.svgPathStart = svgPathStart
  }

  getSvgLineStr(styleSring) {
    let svgLineStrHolder = ''
    this.svgLineHolder.forEach(el => {
      svgLineStrHolder += `${el}${styleSring}" />`
    })
    return svgLineStrHolder
  }

  genSvgLine() {
    let pathData = [],
      pathRule = this.pathRule,
      pxFactor = this.pxFactor,
      svgLineTempHolder = this.svgLineStart,
      svgLineHolder = []

    this.pathData.forEach((el, index) => {
      if (index % 2 === 0 || index === 0) {
        pathData.push(el - pathRule.rect.left)
      } else {
        pathData.push(el - pathRule.rect.bottom)
      }
    })

    let lonIncreat = pathRule.lonDiff * 0.05,
      latIncreat = pathRule.latDiff * 0.05
    /*svgLineTempHolder += `x${coorFlag}="${(pathData[0]) * pxFactor}" `
    svgLineTempHolder += `y${coorFlag}="${(pathRule.latDiff * 1.1 - pathData[1]) * pxFactor}" `*/
    let pathLength = pathData.length
    for (let i = 2; i < pathLength; i += 2) {
      svgLineTempHolder += `x2="${(pathData[i]) * pxFactor}" `
      svgLineTempHolder += `y2="${(pathRule.latDiff * 1.1 - pathData[i + 1]) * pxFactor}" `
      svgLineTempHolder += `x1="${(pathData[i - 2]) * pxFactor}" `
      svgLineTempHolder += `y1="${(pathRule.latDiff * 1.1 - pathData[i - 1]) * pxFactor}" `
      svgLineTempHolder += `style="stroke: ${this.lineColorData[i / 2]}; `
      svgLineHolder.push(svgLineTempHolder)
      svgLineTempHolder = this.svgLineStart
    }

    this.svgLineHolder = svgLineHolder
  }

  getWindCircleImg(windCircleData = {}, strokeWidth) {
    let lon = this.pathData[0],
      lat = this.pathData[1],
      factor = 0,
      bigestRadius = 0
    
    let topFactor = Zearth.Cartesian3.distance(Zearth.Cartesian3.fromDegrees(lon, lat), Zearth.Cartesian3.fromDegrees(lon, Number(lat) + 1)).toFixed(0) / 1000 
    let bottomFactor = Zearth.Cartesian3.distance(Zearth.Cartesian3.fromDegrees(lon, lat), Zearth.Cartesian3.fromDegrees(lon, Number(lat) - 1)).toFixed(0) / 1000
    let leftFactor = Zearth.Cartesian3.distance(Zearth.Cartesian3.fromDegrees(lon, lat), Zearth.Cartesian3.fromDegrees(Number(lon) - 1, lat)).toFixed(0) / 1000
    let rightFactor = Zearth.Cartesian3.distance(Zearth.Cartesian3.fromDegrees(lon, lat), Zearth.Cartesian3.fromDegrees(Number(lon) + 1, lat)).toFixed(0) / 1000 
    for (let i in windCircleData) {
      bigestRadius = bigestRadius >= Number(windCircleData[i]) ? bigestRadius : windCircleData[i]
    }
    factor = bigestRadius / 111

    let rect = {
      top: Number(lat) + bigestRadius / topFactor  + 0.05,
      bottom: Number(lat) - bigestRadius / bottomFactor - 0.05,
      left: Number(lon) - bigestRadius / leftFactor - 0.05,
      right: Number(lon) + bigestRadius / rightFactor + 0.05
    }

    let circlePrefix = `<circle cx="${factor * this.pxFactor + strokeWidth / 2}" cy="${factor * this.pxFactor + strokeWidth / 2}" `
    let svgPrefix = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="${factor * 2 * this.pxFactor + strokeWidth * 2}" height="${factor * 2 * this.pxFactor + strokeWidth * 2}" xml:space="preserve" shape-rendering="geometricPrecision">`
    let dataHolder = ''
    analysisWindCircleData.call(this)
    return {
      rect,
      imgs: dataHolder
    }

    function analysisWindCircleData() {
      let sortedData = [],
        defString = '<defs>'

      for (let i in windCircleData) {
        sortedData.push({
          value: Number(windCircleData[i]),
          key: i
        })

      }
      let dataLength = sortedData.length
      sortedData.sort((a, b) => {
        return a.value < b.value
      })

      sortedData.forEach((el, index, arr) => {
        if (index === dataLength - 1)
          return
        defString += `<mask id="${index}" maskUnits="userSpaceOnUse">${circlePrefix} r="${el.value / 111 * this.pxFactor}" fill="black" stroke-width="${strokeWidth}" stroke="black" />${circlePrefix} r="${arr[index + 1].value / 111 * this.pxFactor}" fill="black" stroke="black" stroke-width="${strokeWidth}" /></mask>`
      })
      sortedData.forEach((el, index) => {
        let maskId = ''
        if (index < dataLength - 1)
          maskId = `mask="url(#${index + 1})"`
        dataHolder +=
          `<g >${circlePrefix} r="${(el.value / 111) * this.pxFactor}" style="fill: rgba(${getColor(el.key)},.2); stroke: rgba(${getColor(el.key)},1); stroke-width: ${strokeWidth}" /></g>`
      })
      defString += "</defs>"
      dataHolder = this.svgHeader + svgPrefix + defString + dataHolder + '</svg>'
    }
    function getColor(key) {
      switch (key) {
        case 'rr06': return '146, 234, 240'
        case 'rr07': return '170, 234, 114'
        case 'rr08': return '81, 130, 255'
        case 'rr10': return '231, 174, 180'
      }
    }
  }
}