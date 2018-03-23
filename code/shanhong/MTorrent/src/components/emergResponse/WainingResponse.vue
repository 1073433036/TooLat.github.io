<template>

  <main id="wariningResponse">

    <!--//:span-method="objectSpanMethod"-->
    <el-table
      :data="tableData"
      max-height="350"
      border
      :span-method="objectSpanMethod"
      style="width: 310px; text-align: center; margin: 10px 10px">
      <el-table-column
        prop="areaLevel"
        label="级别"
        width="50"
        class-name="levelClass">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="地区"
        width="60">
      </el-table-column>
      <el-table-column label="预报台识别结果">
        <el-table-column
          prop="maxSignal"
          label="最高信号"
          width="79">
        </el-table-column>
        <el-table-column
          label="信号明细"
          prop="signalArr"
          width="120">
          <template slot-scope="scope">
            <div
              class="num-div"
              v-on:mouseenter="mouseMoveOn(value)"
              v-on:mouseleave="mouseMoveLeave"
              v-for="(value, key) in scope.row.signalArr">
              {{ value.length > 0 ? key + 'x' + value.length : '' }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </main>

</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import { emergResponseClient } from '../../util/clientHelper'
  import {getRiskResponseMarskUrl} from '../../util/warningAnalysisTool'
  import { WarningMessageHelper } from '../../util/WarningMessageHelper'
  import moment from 'moment'
  let L,zmap
  @Component
  export default class WainingResponse extends Vue {
    @Prop() date: string
    @Prop() hour: string
    @Prop() minute: string
    @Action('systemStore/storeRiskTypeInfo_global') storeRiskTypeInfo_global: any
    @Action('systemStore/storePopupStatus_global') storePopupStatus_global: any
    @Getter('systemStore/riskTypeInfo_global') info: any
    //珠三角地级市
    zsjArea: string[] = ['广州', '深圳', '佛山', '东莞', '惠州', '中山', '珠海', '江门', '肇庆']
    //全省地级市
    provinceCity: string[] = ['广州', '深圳', '佛山', '东莞', '惠州', '中山', '珠海', '江门', '肇庆', '韶关', '汕头', '湛江', '茂名', '梅州', '汕尾', '河源', '阳江', '清远', '潮州', '揭阳', '云浮']


    //地级城市数据
    cityDataArr: any[] = [];
    countyDataArr: any[] = [];

    tableData: any[] =[];

    isCountyColum: boolean = false
    posX: number = 0;
    posY: number = 0;
    mapLayers: any = null;

    tableData1: any = [
      {
        areaLevel: '城市',
        cityName: '广州',
        maxSignal: '红',
        signalArr: {
          '台风': [
            {name: 'tai', age: 'fen'},
            {name: 'da', age: 'yu'},
          ],
          '暴雨': [
            {name: '1', age: '2'},
            {name: '3', age: '4'},
            {name: '5', age: '6'}
          ]
        }
      },
      {
        areaLevel: '县城',
        cityName: '南沙',
        maxSignal: '红',
        signalArr: {
          '台风': [
            {name: 'tai', age: 'fen'},
            {name: 'da', age: 'yu'},
          ],
          '暴雨': [
            {name: '1', age: '2'},
            {name: '3', age: '4'},
            {name: '5', age: '6'}
          ]
        }
      },
    ]
//    tableData0: any = [
//      {
//        level: 'II',
//        area: '广州市',
//        standard: 'II',
//        signals: ['11', '22', '44']
//      }, {
//        level: 'II',
//        area: '广州市广州市',
//        standard: 'II',
//        signals: ['11', '22']
//      }, {
//        level: 'II',
//        area: '广州市',
//        standard: 'II',
//        signals: ['11', '22', '55']
//      }, {
//        level: 'II',
//        area: '广州市',
//        standard: 'II',
//        signals: ['11', '22']
//      }, {
//        date: 'II',
//        area: '广州市',
//        standard: 'II',
//        signals: ['11', '22']
//      }, {
//        level: 'II',
//        area: '广州市',
//        standard: 'II',
//        signals: ['11', '22']
//      }, {
//        level: 'II',
//        area: '广州市',
//        standard: 'II',
//        signals: ['11', '22', '33']
//      }
//    ]

    mounted() {

      let global: any = <any>window
      L = global['L']
      zmap = global['zmap']
      this.getData();
      document.onmousemove = this.getMousePos;
    }

    getMousePos(event) {
      var e = event || window.event;
      this.posY = e.clientY - 150;
      this.posX = e.clientX + 40;
    }

    mouseMoveOn(val) {
      let obj = {};
      this.$set(obj, 'position', [this.posX, this.posY])
      this.$set(obj, 'data', val)
      this.storeRiskTypeInfo_global(obj)
      this.storePopupStatus_global({ key: 'RiskType', action: true })
    }

    mouseMoveLeave() {
      this.storeRiskTypeInfo_global(null)
      this.storePopupStatus_global({ key: 'RiskType', action: false })
    }

//     08-24-13-18
    async getData() {
      this.tableData = [];
      this.isCountyColum = false;
      this.mouseMoveLeave();
      this.clearMapLayer();
      let datetime = moment(this.date).add(this.hour, 'hours').add(this.minute, 'minutes').format('YYYY-MM-DD HH:mm:00')
      let ref = await emergResponseClient.getEmergResponseData(datetime)
      if (ref) {
        this.doWithDataForTable(ref);
      }else {
        Vue['prototype']['$message']({
          type: 'warning',
          message: '预警数据获取失败'
        })
      }
    }

    doWithDataForTable(ref) {
      if (ref.ROWCOUNT == 0) {
        console.log("后台返回结果数组个数为: ", ref.ROWCOUNT)
        return
      }
      let refArr: any[] = [];
      let datas = ref.DATA;
      for (let i = 0; i < datas.length; i++) {
        let ele = datas[i];
        let areaLevel = ''
        if (ele.V_CITY === ele.VF01015_CN) {
          areaLevel = '市级'
        }else {
          areaLevel = '县级'
        }
        ele.DDATETIME = ele.DDATETIME.slice(0,16);
        if (ele.C_TFSTA == 'ON') {
          ele.C_TFSTA = '是';
        }else if (ele.C_TFSTA == 'OFF'){
          ele.C_TFSTA = '否';
        }else {
          ele.C_TFSTA = '缺省'
        }
        if (ele.C_TFCLT == '9999') {
          ele.C_TFCLT = '缺省'
        }else {
          //201711270647
          let year = ele.C_TFCLT.slice(0,4);
          let month = ele.C_TFCLT.slice(4,6);
          let day = ele.C_TFCLT.slice(6,8);
          let hour = ele.C_TFCLT.slice(8,10);
          let mint = ele.C_TFCLT.slice(10,12);
          let endtime = `${year}-${month}-${day} ${hour}:${mint}`
          ele.C_TFCLT = endtime;
        }


        if (Number(ele.V_TFLEV) > 0) {
          this.$set(ele, 'riskType', '台风')
          let level: string = ''
          if (Number(ele.V_TFLEV) === 1) {
            level = '白色'
          }else if (Number(ele.V_TFLEV) === 2) {
            level = '蓝色'
          }
          else if (Number(ele.V_TFLEV) === 3) {
            level = '黄色'
          }
          else if (Number(ele.V_TFLEV) === 4) {
            level = '橙色'
          }else {
            level = '红色'
          }
          let url = getRiskResponseMarskUrl(ele, '台风');
          this.$set(ele, 'marskUrl', url)
          this.$set(ele, 'riskLevel', level)
          this.$set(ele, 'areaLevel', areaLevel)
          refArr.push(ele)
        }

        if (Number(ele.V_BYLEV) > 0) {
          this.$set(ele, 'riskType', '暴雨')
          let level: string = ''
          if (Number(ele.V_BYLEV) === 3) {
            level = '黄色'
          }else if (Number(ele.V_BYLEV) === 4) {
            level = '橙色'
          }else if (Number(ele.V_BYLEV) === 5){
            level = '红色'
          }else {
            level = '黄色'
          }
          let url = getRiskResponseMarskUrl(ele, '暴雨');
          this.$set(ele, 'marskUrl', url)
          this.$set(ele, 'riskLevel', level)
          this.$set(ele, 'areaLevel', areaLevel)
          refArr.push(ele)
        }
        if (Number(ele.V_LYLEV) > 0) {
          this.$set(ele, 'riskType', '雷雨大风')
          let level: string = ''
          if (Number(ele.V_LYLEV) === 2) {
            level = '蓝色'
          }else if (Number(ele.V_LYLEV) === 3) {
            level = '黄色'
          }else if (Number(ele.V_LYLEV) === 4) {
            level = '橙色'
          }else if (Number(ele.V_LYLEV) === 5){
            level = '红色'
          }else {
            level = '蓝色'
          }
          let url = getRiskResponseMarskUrl(ele, '雷雨大风');
          this.$set(ele, 'marskUrl', url)
          this.$set(ele, 'riskLevel', level)
          this.$set(ele, 'areaLevel', areaLevel)
          refArr.push(ele)
        }

        if (Number(ele.V_BBLEV) > 0) {
          this.$set(ele, 'riskType', '冰雹')
          let level: string = ''
          if (Number(ele.V_BBLEV) === 5) {
            level = '红色'
          }else {
            level = '橙色'
          }
          let url = getRiskResponseMarskUrl(ele, '冰雹');
          this.$set(ele, 'marskUrl', url)
          this.$set(ele, 'riskLevel', level)
          this.$set(ele, 'areaLevel', areaLevel)
          refArr.push(ele)
        }
      }
      if (refArr.length == 0) {
        console.log("后台返回结果筛选数据个数为: ", refArr.length)
//        Vue['prototype']['$message']({
//          type: 'warning',
//          message: '请求成功'
//        })
        return
      }
      console.log("后台返回结果筛选数据个数为: ", refArr.length)

      this.clearMapLayer();
      let helper = new WarningMessageHelper(zmap)
      let layers = helper.addMarkToZmap(refArr, 'responseId')

      let cityArr = this.deepClone(refArr);
      let countyArr = this.deepClone(refArr);

      this.doWithPrefecturalCityData(cityArr);
      this.doWithCountyCityData(countyArr);
    }

    clearMapLayer() {
      zmap.eachLayer(e => {
        if (e.id === 'responseId')
          zmap.removeLayer(e)
      })
    }

    //地级城市筛选数据
    doWithPrefecturalCityData(refArr) {
      let cityDataArr: any[] = [];
      let hashCitys: string[] = [];
      let jRefArr = this.deepClone(refArr);
      for (let i = 0; i < refArr.length; i++) {
        let iEle = refArr[i];
        if (hashCitys.indexOf(iEle.V_CITY) != -1) continue;
        this.$set(iEle, 'signalArr', {"台风": [], "暴雨": [], "雷雨大风": [], "冰雹": []})
        for (let j = 0; j < jRefArr.length; j++) {
          let jEle = jRefArr[j];
          if (iEle.V_CITY === jEle.V_CITY) {
            if (hashCitys.indexOf(iEle.V_CITY) === -1) {
              hashCitys.push(iEle.V_CITY);
            }
//            iEle.areaLevel = '市级';
//            iEle.maxSignal = this.getTheHightRespondeLevel(iEle.riskLevel, iEle.maxSignal);
//            iEle['cityName'] = iEle.V_CITY;
            this.$set(iEle, 'areaLevel', '市级')
            let maxSignal = this.getTheHightRespondeLevel(jEle.riskLevel, iEle.maxSignal);
            this.$set(iEle, 'maxSignal', maxSignal)
            this.$set(iEle, 'cityName', iEle.V_CITY)
            if (jEle.riskType === '台风') {
              iEle.signalArr['台风'].push(jEle);
            }else if(jEle.riskType === '暴雨'){
              iEle.signalArr['暴雨'].push(jEle);
            }else if(jEle.riskType === '雷雨大风'){
              iEle.signalArr['雷雨大风'].push(jEle);
            }else {
              iEle.signalArr['冰雹'].push(jEle);
            }
          }
        }
        cityDataArr.push(iEle);
      }
      this.cityDataArr = cityDataArr;
    }

    //县级城市筛选数据
    doWithCountyCityData(refArr) {
      let countyDataArr: any[] = [];
      let hashCountys: string[] = [];
      let jRefArr = this.deepClone(refArr);
      for (let i = 0; i < refArr.length; i++) {
        let iEle = refArr[i];
        if (hashCountys.indexOf(iEle.VF01015_CN) != -1) continue;
        this.$set(iEle, 'signalArr', {"台风": [], "暴雨": [], "雷雨大风": [], "冰雹": []})
        for (let j = 0; j < jRefArr.length; j++) {
          let jEle = jRefArr[j];
          if (iEle.VF01015_CN === jEle.VF01015_CN) {
            if (hashCountys.indexOf(iEle.VF01015_CN) === -1) {
              hashCountys.push(iEle.VF01015_CN);
            }
            this.$set(iEle, 'areaLevel', '县级')
            let maxSignal = this.getTheHightRespondeLevel(jEle.riskLevel, iEle.maxSignal);
            this.$set(iEle, 'maxSignal', maxSignal)
            this.$set(iEle, 'cityName', iEle.VF01015_CN)
            if (jEle.riskType === '台风') {
              iEle.signalArr['台风'].push(jEle);
            }else if(jEle.riskType === '暴雨'){
              iEle.signalArr['暴雨'].push(jEle);
            }else if(jEle.riskType === '雷雨大风'){
              iEle.signalArr['雷雨大风'].push(jEle);
            }else {
              iEle.signalArr['冰雹'].push(jEle);
            }
          }
        }
        countyDataArr.push(iEle);
      }
      this.countyDataArr = countyDataArr;
      let tableCityData = this.cityDataArr.concat(countyDataArr)
      this.isCountyColum = this.cityDataArr.length === 0 ? true : false;
      this.tableData = tableCityData;
    }

    isFirst: boolean = false;

// 当前行row、当前列column、当前行号rowIndex、当前列号columnIndex
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === this.tableData.length - 1){
//          this.isFirst = true;
//          this.isCountyColum = this.cityDataArr.length === 0 ? true : false
        }
        if (rowIndex % this.cityDataArr.length === 0) {
//          if (rowIndex != 0) {
//            this.isCountyColum = true;
//          }
//          console.log('city: ', rowIndex)
          return {
            rowspan: this.cityDataArr.length,
            colspan: 1
          };
        }else if (rowIndex % this.countyDataArr.length === 0 && this.isCountyColum) {
//          console.log('county: ', rowIndex)
          return {
            rowspan: this.countyDataArr.length,
            colspan: 1
          };
        }else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }

//        if (!this.isCountyColum) {
//          if (rowIndex % this.cityDataArr.length === 0) {
//            if (rowIndex != 0) {
//               this.isCountyColum = true;
//            }
//            return {
//              rowspan: this.cityDataArr.length,
//              colspan: 1
//            };
//          } else {
//            return {
//              rowspan: 0,
//              colspan: 0
//            };
//          }
//        } else {
//          if (rowIndex % this.countyDataArr.length === 0) {
//            console.log('county: ', rowIndex)
//            return {
//              rowspan: this.countyDataArr.length,
//              colspan: 1
//            };
//          } else {
//            return {
//              rowspan: 0,
//              colspan: 0
//            };
//          }
//        }
      }
    }

    //获取最大的预警颜色等级 (白色、蓝色、黄色、橙色和红色)
    getTheHightRespondeLevel(currLevel: string, oldMaxLevel: string) {
      let levelArr: string[] = ['白色', '蓝色', '黄色', '橙色', '红色'];
      let currentIndex = levelArr.indexOf(currLevel);
      let oldIndex = levelArr.indexOf(oldMaxLevel);
//      console.log(`新的: ${currentIndex}: ${currLevel}, 之前的${oldIndex}: ${oldMaxLevel} === 结果为: ${currentIndex > oldIndex ? levelArr[currentIndex] : levelArr[oldIndex]}`);
      return currentIndex > oldIndex ? levelArr[currentIndex] : levelArr[oldIndex];
    }

    //深拷贝
    deepClone(data){
      var type = this.getType(data);
      var obj;
      if(type === 'array'){
        obj = [];
      } else if(type === 'object'){
        obj = {};
      } else {
        //不再具有下一层次
        return data;
      }
      if(type === 'array'){
        for(var i = 0, len = data.length; i < len; i++){
          obj.push(this.deepClone(data[i]));
        }
      } else if(type === 'object'){
        for(var key in data){
          obj[key] = this.deepClone(data[key]);
        }
      }
      return obj;
    }

    getType(obj){
      //tostring会返回对应不同的标签的构造函数
      var toString = Object.prototype.toString;
      var map = {
        '[object Boolean]'  : 'boolean',
        '[object Number]'   : 'number',
        '[object String]'   : 'string',
        '[object Function]' : 'function',
        '[object Array]'    : 'array',
        '[object Date]'     : 'date',
        '[object RegExp]'   : 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]'     : 'null',
        '[object Object]'   : 'object'
      };
      if(obj instanceof Element) {
        return 'element';
      }
      return map[toString.call(obj)];
    }


    datetimeChanged() {
      this.getData()
    }

    @Watch('date')
    onDateChanged (val: any, oldVal: any) {
      this.datetimeChanged()
    }
    @Watch('hour')
    onHourChanged (val: any, oldVal: any) {
      this.datetimeChanged()
    }
    @Watch('minute')
    onMinuteChanged (val: any, oldVal: any) {
      this.datetimeChanged()
    }



    /**
     * 处理返回的结果数据(数据只拿  台风: V_TFLEV、暴雨: V_BYLEV、冰雹: V_BBLEV、雷雨大风: V_LYLEV)
     * 台风: 白色、蓝色、黄色、橙色和红色;
     * 暴雨: 黄色、橙色、红色;
     * 雷雨大风: 蓝色、黄色、橙色、红色
     * 冰雹: 橙色、红色
     * */
    doWithResultData(ref) {
      if (ref.ROWCOUNT == 0) {
        console.log("后台返回结果数组个数为: ", ref.ROWCOUNT)
        return
      }
      let refArr: any[] = [];
      let datas = ref.DATA;
      for (let i = 0; i < datas.lenght; i++) {
        let ele = datas[i];
        if (Number(ele.V_TFLEV) > 0) {
          ele.DDATETIME = ele.DDATETIME.split('.')[0]
          ele["riskType"] = "台风"
          let level: string = ''
          if (Number(ele.V_TFLEV) === 1) {
            level = '白色'
          }else if (Number(ele.V_TFLEV) === 2) {
            level = '蓝色'
          }
          else if (Number(ele.V_TFLEV) === 3) {
            level = '黄色'
          }
          else if (Number(ele.V_TFLEV) === 4) {
            level = '橙色'
          }else {
            level = '红色'
          }
          ele["riskLevel"] = level
          refArr.push(ele)
        }

        if (Number(ele.V_BYLEV) > 0) {
          ele.DDATETIME = ele.DDATETIME.split('.')[0]
          ele["riskType"] = "暴雨"
          let level: string = ''
          if (Number(ele.V_BYLEV) === 1) {
            level = '黄色'
          }else if (Number(ele.V_BYLEV) === 2) {
            level = '橙色'
          }else {
            level = '红色'
          }
          ele["riskLevel"] = level
          refArr.push(ele)
        }

        if (Number(ele.V_LYLEV) > 0) {
          ele.DDATETIME = ele.DDATETIME.split('.')[0]
          ele["riskType"] = "雷雨大风"
          let level: string = ''
          if (Number(ele.V_LYLEV) === 1) {
            level = '蓝色'
          }else if (Number(ele.V_LYLEV) === 2) {
            level = '黄色'
          }else if (Number(ele.V_LYLEV) === 3) {
            level = '橙色'
          }else {
            level = '红色'
          }
          ele["riskLevel"] = level
          refArr.push(ele)
        }

        if (Number(ele.V_BBLEV) > 0) {
          ele.DDATETIME = ele.DDATETIME.split('.')[0]
          ele["riskType"] = "冰雹"
          let level: string = ''
          if (Number(ele.V_BBLEV) === 1) {
            level = '橙色'
          }else {
            level = '红色'
          }
          ele["riskLevel"] = level
          refArr.push(ele)
        }
      }
    }
    //省级带班标准
    getCalssStandard(refArr) {
      if (refArr.length === 0) {
        console.log("筛选数组个数为: ", refArr.length)
        return
      }

      let zsjOneLevel: number = 0
      let provinceLeve: number = 0

      let gzTwoLevel: number = 0
      let zsjTwoLevel: number = 0
      let provinceTwoLevel: number = 0

      let gzThreeLevel: number = 0
      let pronvincThreeLevel: number = 0

      for (let j = 0; j < refArr.length; j++) {
        let ele = refArr[j];
        if ( this.zsjArea.indexOf(ele.VF01015_CN) != -1 && ele["riskLevel"] === '红色') {
          zsjOneLevel++;
        }
        if ( this.provinceCity.indexOf(ele.VF01015_CN) != -1 && ele["riskLevel"] === '红色') {
          provinceLeve++;
        }

        if (ele.V_CITY === '广州' && ele["riskLevel"] === '红色') {
          gzTwoLevel++;
        }
        if (this.zsjArea.indexOf(ele.VF01015_CN) != -1 && (ele["riskLevel"] === '橙色' || ele["riskLevel"] === '红色')) {
          zsjTwoLevel++;
        }
        if (this.provinceCity.indexOf(ele.VF01015_CN) != -1 && (ele["riskLevel"] === '橙色' || ele["riskLevel"] === '红色')) {
          provinceTwoLevel++;
        }

        if (ele.V_CITY === '广州' && ele["riskType"] === "暴雨" && ele["riskLevel"] === '橙色') {
          gzThreeLevel++;
        }
        if (this.provinceCity.indexOf(ele.VF01015_CN) != -1 && ((ele["riskType"] === "台风" && Number(ele.V_TFLEV) > 1) || (ele["riskType"] === "暴雨" && Number(ele.V_BYLEV) >= 1) || (ele["riskType"] === "雷雨大风" && Number(ele.V_LYLEV) > 1))) {
          pronvincThreeLevel++;
        }
      }

      if (zsjOneLevel > 3 || provinceLeve > 5) {
        console.log('一级')
      }

      if (gzTwoLevel > 2 || zsjTwoLevel > 5 || provinceTwoLevel > 8) {
        console.log('二级')
      }

      if (gzThreeLevel > 2 || pronvincThreeLevel > 12) {
        console.log('三级')
      }

      console.log('2222222')
    }

  }
</script>



<style lang="scss" scoped>
  #wariningResponse {
    width: 100%;
    font-size: 0;
    .num-div{
      cursor: pointer;
      text-decoration: underline;
      &:hover{
         color: #f3ac12;
       }
    }
  }
</style>


<style lang="scss">
  #wariningResponse {
    .el-table__body-wrapper {
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }
    .is-group th{
      font-size: 12px;
      color: #999999 !important;
      font-weight: 700;
      background: #fff;
      padding: 5px 0;
    }

    .el-table--border th {
      text-align: center;
    }
    .el-table--border td{
       border-right: 0;
       padding: 5px 0;
    }
    .levelClass{
      border-right: 1px solid #e6ebf5 !important;
      font-size: 12px;
      color: #545454;
    }
    .standardClass{
      font-weight: 700;
      font-size: 12px;
      color: red;
    }

    .el-table__body-wrapper {
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }

  }
</style>
