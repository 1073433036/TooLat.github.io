export class ModelData {
  modelSelected = null
  isAnalysing = false
  ncInfo = null
  seledTime = 0
  ranges = {}
  townsIdList = []
  townsData = null
  countyData = null
  riverHandler = null
  analysisType = null
  affectedTownsList = []
  targetWarningData = {
    speakerNum: 0,
    LEDNum: 0
  }
  riverData = null  //河流流向数据
  riverRoadData = null
  riverRoadTipData = {
    style: {
      top: 0,
      left: 0
    },
    info: null
  }
}