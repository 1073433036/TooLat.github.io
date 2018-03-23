<template>
    <main id="searchContainer">
      <section class="search-tab">
        <ul>
          <li v-for="opt in options"
              :class="{'tool-selected': opt.selected}"
              @click="toggleSearchTab(opt)">
            {{opt.text}}
            <em v-if="opt.selected"></em>
          </li>
        </ul>
      </section>
      <section class="search-drawtool" v-show="selectedOpt == 'drawtool'">
        <ul>
          <li v-for="opt in drawTool.options" :title="opt.text" @click="searchTool(opt.key)"></li>
        </ul>
        <div class="draw_poi">
          <div class="draw_poi_top">
            <span v-for="(item,index) in drawPois" @click="selPois(index)">{{item.poiTitle}} ({{item.length}})</span>
          </div>
          <div class="draw_poi_bottom">
            <span v-for="(item,index) in poiOne.poi" @click="flyToPoint(item)">
              {{item.name||item[0].name}}
            </span>
          </div>
        </div>
      </section>
      <section class="search-input-box" v-show="selectedOpt != 'drawtool'">
        <span></span>
        <input type="text" v-model="keyword" :placeHolder="tipText">
        <span v-show="keyword.length > 0" title="清除" @click="clearKeyword"></span>
      </section>
      <section class="search-result search-scroll" v-show="resultList.length">
        <ul>
          <li v-for="el in resultList" @click="flyToPoint(el)">
            <em></em>
            <span :title="el.name">{{el.name}}</span>
          </li>
        </ul>
      </section>
    </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import coordtransform from 'coordtransform'
import { Helper } from '../../util/Helper'
import GeoPoi from '../../util/GeoPoi'
import { MeteoMonitor } from '../../util/MeteoMonitor'

export default {
    data(){
        return {
          activeName: '1',
          poiOne:{},
          poi:[2,2,2,2,2,2],
            geoPoiHelper: null,
            options: [
              { key: 'poi', text: 'POI', selected: true, tip: '请输入POI名称' },
              { key: 'station', text: '监测站', selected: false, tip: '请输入站点编号或名称' },
              //{ key: 'point', text: '隐患点', selected: false, tip: '请输入隐患点名称或地址' },
              //{ key: 'case', text: '案例库', selected: false, tip: '请输入案例标题关键字' },
              { key: 'drawtool', text: '任意面', selected: false }
            ],
            drawTool: {
                selected: '',
                options: [
                    { key: 'circle', text: '圆形' },
                    { key: 'rect', text: '矩形' },
                    { key: 'polygon', text: '多边形' },
                    { key: 'cancel', text: '撤消' },
                    { key: 'delete', text: '删除' }
                ],
            },
            drawPois:[],//地图上绘画选出的poi点集合
            keyword: '',
            tipText: '请输入POI名称',
            resultList: [],
            poiNameArray: ['material', 'rescueteam'],
            poiCollection: {},
            poiLayer: {},
            materialTypes: [],
            rescueteamTypes: [],
            stations: []
        }
    },
    mounted() {
        //初始化poi查询字段数组
        for(let i in this.geoMenu) {
            let subMenu = this.geoMenu[i];
            if(!subMenu.enabled)
                continue;
            for(let n in subMenu.menu) {
                if(i === 'baseInfo') {
                    this.poiNameArray.push(n);
                } else if(i === 'material') {
                    this.materialTypes.push(n);
                } else {
                    this.rescueteamTypes.push(n);
                }
            }
        }
    },
    beforeDestroy() {
        this.clearAllData();
        if(this.drawHelper !== undefined) {
            this.drawHelper.stopDrawing();
            this.drawHelper = undefined;
        }

        if(Object.keys(this.poiLayer).length) {
            let helper = new Helper(viewer);
            helper.removeEntity([this.poiLayer.billboard, this.poiLayer.label]);
            helper = null;
        }
    },
    computed:{
        ...mapGetters([
            'geoMenu',
            'currentRegion',
        ]),
        //当前选择的查询类别
        selectedOpt() {
            let arr = this.options.filter(opt => opt.selected);
            return arr.length ? arr[0].key : '';
        },
    },
    methods:{
        ...mapActions([
            'addGeoPoiSet',
            'clearAllGeoPoi'
        ]),
        clearKeyword() {
            this.keyword = '';  //清除查询关键字
        },
        toggleSearchTab(opt) {
            if(opt.selected)
                return;
            this.options.forEach(item => {
                item.selected = item.key === opt.key;
            });
            this.tipText = opt.tip || '';
            if(opt.key === 'drawtool')
                this.keyword = '';
        },
        //点击查询数据列表的选项视角移到当前点
        flyToPoint(el) {
            if(el[0] != undefined) {
                el = el[0];
            }
            let helper = new Helper(viewer);

            if(Object.keys(this.poiLayer).length) {
                helper.removeEntity([this.poiLayer.billboard, this.poiLayer.label]);
            }

            let lon = el.lon || el.longitude;
            let lat = el.lat || el.latitude;
            this.poiLayer.billboard = helper.addBillboard([lon, lat], './static/img/search_point.png', 'bottom');
            this.poiLayer.label = helper.addLabel(el.name, [lon, lat], .5, 'red', 'top', 'center', [0, 0], true, 'label', 'both', 5);
            helper.flyTo([lon, lat]);

            helper = null;
        },
        getMatchedPoi(callback) {
            const regionData = this.currentRegion;
            const cityId = regionData.cityId,
                  countyId = regionData.countyId;
            let geoPoiHelper = new GeoPoi(this.$http);

            for(let name of this.poiNameArray) {
                if(this.poiCollection.hasOwnProperty(name)) {
                    callback(this.poiCollection[name], name);
                    continue;
                }

                if(name !== 'material') {
                    geoPoiHelper.getPois(name, cityId, countyId)
                      .then(data => {
                          let dataHolder = {};
                          for(let poi of data) {
                              if(name === 'rescueteam') {
                                  let poiId = poi['pointid'];
                                  if(poiId in dataHolder === false)
                                    dataHolder[poiId] = [];
                                  dataHolder[poiId].push(poi);
                              } else {
                                  dataHolder[poi.id] = poi;
                              }
                          }
                          this.poiCollection[name] = dataHolder;
                          callback(dataHolder, name);
                      });
                }
            }
        },
        getStation(callback) {
            const regionData = this.currentRegion;
            let meteoMonitor = new MeteoMonitor(this.$http);
            meteoMonitor.getStations(regionData.cityName)
              .then(data => {
                  this.stations = data;
                  callback();
              });
        },
        matchPOI(val) {
            this.getMatchedPoi((poiSet, key) => {
                for(let i in poiSet) {
                    let matchPoi, poi = poiSet[i];
                    if(key === 'material') {
                        let keys = Object.keys(poi);
                        let poiInfo = poi[keys[0]];
                        matchPoi = { name: poiInfo[0].name, lon: poiInfo[0].lon, lat: poiInfo[0].lat, detail: poi };
                    } else if(key === 'rescueteam') {
                        matchPoi = { name: poi[0].name, lon: poi[0].lon, lat: poi[0].lat, detail: poi };
                    } else {
                        matchPoi = { name: poi.name, lon: poi.lon, lat: poi.lat, detail: poi };
                    }
                    if(matchPoi.name && matchPoi.name.indexOf(val) >= 0) {
                        this.resultList.push(matchPoi);
                    }
                }
            });
        },
        matchStation(val) {
            const getMatch = () => {
                for(let item of this.stations) {
                    if(item.stationid.indexOf(val) >= 0 || item.name.indexOf(val) >= 0) {
                        this.resultList.push(item);
                    }
                }
            };
            this.stations.length ? getMatch() : this.getStation(getMatch);
        },
        searchTool(key) {
            let helper = new Helper(viewer);
            if(this.drawHelper !== undefined){
              this.drawHelper.stopDrawing();
            }
            if(key === 'cancel') {
                let rmEntity = this.drawEntityArray.pop();
                if(rmEntity) {
                    let keys = Object.keys(rmEntity);
                    helper.removeCollection(rmEntity[keys[0]]);
                }
                if(this.drawEntityArray.length) {
                    this.getMatchedByDraw();
                } else {
                    this.clearAllGeoPoi();
                    this.poiOne = [];
                    this.drawPois = [];

                    if(Object.keys(this.poiLayer).length) {
                       helper.removeEntity([this.poiLayer.billboard, this.poiLayer.label]);
                    }
                }
            } else if(key === 'delete') {
                this.clearAllData();
                this.poiOne = [];
                this.drawPois = [];

                if(Object.keys(this.poiLayer).length) {
                    helper.removeEntity([this.poiLayer.billboard, this.poiLayer.label]);
                }
            } else {
                this.drawHelper = helper.startDrawing(key, true, (entity) => {
                    if(!this.drawEntityArray)
                        this.drawEntityArray = [];
                    this.drawEntityArray.push({ [key]: entity });
                    this.getMatchedByDraw();
                    this.drawHelper = undefined;
                });
            }
        },
        getMatchedByDraw() {
            if(!this.drawEntityArray)
                return;
            let helper = new Helper(viewer);
            this.drawPois = [];
            this.getMatchedPoi((poiData, key) => {
                let matchPois = {};
                let numb = 0;
                for(let i in poiData) {
                    let poi = poiData[i];
                    let lon, lat;

                    if(key === 'material') {
                        const keys = Object.keys(poi);
                        let poiInfo = poi[keys[0]][0];
                        lon = poiInfo.lon;
                        lat = poiInfo.lat;
                    } else if(key === 'rescueteam') {
                        lon = poi[0].lon;
                        lat = poi[0].lat;
                    } else {
                        lon = poi.lon;
                        lat = poi.lat;
                    }
                    let tranCoor = coordtransform.wgs84togcj02(lon, lat);
                    if(this.isPoiInRange(tranCoor))
                        matchPois[i] = poi;
                }
                if(!Object.keys(matchPois).length)
                    return;
                if(key === 'material' || key === 'rescueteam') {
                    let poiSet = {};
                    if(key === 'material') {
                        for(let i in matchPois) {
                            let poi = matchPois[i];
                            let keys = Object.keys(poi);
                            const type = poi[keys[0]][0].type;
                            if(poiSet.hasOwnProperty(type) === false) {
                                poiSet[type] = {};
                            }
                            poiSet[type][i] = poi;
                        }
                    } else {
                        for(let i in matchPois) {
                            let teamType = matchPois[i][0].teamtype;
                            let type;
                            for(let t in this.geoMenu.rescueteam.menu) {
                                if(teamType === this.geoMenu.rescueteam.menu[t].text) {
                                    type = t;
                                    break;
                                }
                            }
                            if(!type)
                                continue;
                            if(poiSet.hasOwnProperty(type) === false) {
                                poiSet[type] = {};
                            }
                            poiSet[type][i] = matchPois[i];
                            numb += Object.keys(matchPois[i]).length;
                        }
                    }

                    for(let i in poiSet) {
                        this.addGeoPoiSet({
                            $http: this.$http,
                            type: key,
                            subType: i,
                            data: poiSet[i]
                        });
                    }
                } else {
                    numb = Object.keys(matchPois).length;
                    this.addGeoPoiSet({
                        $http: this.$http,
                        type: key,
                        subType: undefined,
                        data: matchPois
                    });
                }
                let poiName = '';
                switch (key) {
                    case 'loudspeaker':
                        poiName = '大喇叭'
                        break;
                    case 'school':
                        poiName = '学校'
                        break;
                    case 'shelter':
                        poiName = '避难所'
                        break;
                    case 'rescueteam':
                        poiName = '救援队'
                        break;
                    case 'hospital':
                        poiName = '医院'
                        break;
                    case 'reservoir':
                        poiName = '水库'
                        break;
                    case 'chemical':
                        poiName = '危化品'
                        break;
                    case 'economy':
                        poiName = '人口经济'
                        break;
                }
                if(poiName != '大喇叭'){
                    this.drawPois.push({
                        poiTitle: poiName,
                        poi: matchPois,
                        length: numb
                    });
                    this.poiOne = this.drawPois[0];
                }
            });
        },
        isPoiInRange(lnglat) {
            let isInRange = false;
            let helper = new Helper(viewer);
            for(let entity of this.drawEntityArray) {
                if(entity.hasOwnProperty('circle')) {
                    let center = entity.circle.getCenter(),
                        radius = entity.circle.getRadius();
                    const c = helper.getCoorFromCtn3(center);
                    const d = helper.getDistance(c, lnglat);
                    if(d < radius) {
                        isInRange = true;
                        break;
                    }
                }
                else if(entity.hasOwnProperty('rect')) {
                    let extent = entity.rect.getExtent(),
                        bound = {};
                    ['east', 'west', 'south', 'north'].forEach(attr => {
                        if(extent.hasOwnProperty(attr))
                            bound[attr] = helper.convertRadianToDegrees(extent[attr]);
                    });
                    if(lnglat[0] > bound.west && lnglat[0] < bound.east && lnglat[1] > bound.south && lnglat[1] < bound.north) {
                        isInRange = true;
                        break;
                    }
                }
                else if(entity.hasOwnProperty('polygon')) {
                    let positions = entity.polygon.getPositions();
                    let polyArray = [];
                    for(let p of positions) {
                        polyArray.push(helper.getCoorFromCtn3(p));
                    }
                    let point = helper.getCtn2FromCtn3(lnglat);
                    if(helper.isPointInPolygon(point, polyArray)) {
                        isInRange = true;
                        break;
                    }
                }
            }
            helper = null;
            return isInRange;
        },
        selPois(index){
          this.poiOne = this.drawPois[index];
        },
        clearAllData() {
            if(this.drawEntityArray && this.drawEntityArray.length) {
                let helper = new Helper(viewer);
                for(let entity of this.drawEntityArray) {
                    let keys = Object.keys(entity);
                    helper.removeCollection(entity[keys[0]]);
                }

              this.drawEntityArray=undefined;

              this.clearAllGeoPoi();
            }
        }
    },
    watch: {
        keyword(val) {
            this.resultList = [];
            if(Object.keys(this.poiLayer).length) {
                let helper = new Helper(viewer);
                helper.removeEntity([this.poiLayer.billboard, this.poiLayer.label]);
                helper = null;
            }

            val = val.trim();
            if(val == '')
                return;

            const selectedOpt = this.selectedOpt;
            if(selectedOpt === 'poi') {
                this.matchPOI(val);
            }
            else if(selectedOpt === 'station') {
                this.matchStation(val);
            }
        },
    }
}
</script>

<style scoped lang="scss">
#searchContainer {
  position: absolute;
  top: 93px;
  background-color: rgba(70, 70, 70, .34);
  right: 10px;
  overflow: hidden;
  .search-tab {
    width: 400px;
    height: 30px;
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, .2);
    ul {
      display: inline-block;
      font-size: 0;
      li {
        width: 60px;
        height: 14px;
        position: relative;
        display: inline-block;
        margin: 8px 0px;
        font-size: 12px;
        color: white;
        line-height: 14px;
        text-align: center;
        border-right: 1px solid rgba(255, 255, 255, .2);
        cursor: pointer;
        &:last-child {
          border-right: none;
        }
        &:hover {
          color: #299dff;
        }
        em {
          width: 0;
          height: 0;
          position: absolute;
          left: 50%;
          bottom: -6px;
          margin-left: -1.5px;
          border-right: 3px solid transparent;
          border-bottom: 3px solid #299dff;
          border-left: 3px solid transparent;
        }
      }
      .tool-selected {
        color: #299dff;
        font-weight: bold;
      }
    }
  }
  .search-input-box {
    width: 100%;
    position: relative;
    input {
      width: 360px;
      height: 30px;
      position: relative;
      margin: 10px 19px;
      text-indent: 28px;
      color: #545454;
      border: none;
      border-radius: 20px;
      padding: 0;
      outline: none;
    }
    span {
      &:first-child {
        width: 28px;
        height: 24px;
        position: absolute;
        left: 20px;
        top: 10px;
        margin: 3px 0px;
        background: url(../../assets/toolbar/search_icons.png) -37px -59px no-repeat;
        z-index: 1;
      }
      &:nth-child(3) {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 10px;
        right: 30px;
        margin: 5px 0px;
        background: url(../../assets/toolbar/search_icons.png) -41px 0px no-repeat;
        cursor: pointer;
      }
    }
  }
  .search-drawtool {
    width: 100%;
    height: auto;
    position: relative;
    ul {
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      li {
        width: 20px;
        height: 20px;
        position: relative;
        display: inline-block;
        margin: 9px 8px;
        background: url(../../assets/toolbar/search_icons.png) no-repeat;
        cursor: pointer;
        @for $i from 0 through 4 {
          &:nth-child(#{$i + 1}) {
            background-position: 0px ($i * (-20px));
            @if $i == 0 {
              margin-left: 20px;
            }
            &:hover {
              background-position: -20px ($i * (-20px)) !important;
            }
          }
        }
      }
    }
  }
  .search-result {
    width: 100%;
    min-height: 40px;
    max-height: 360px;
    position: relative;
    margin: -10px 0px 10px 0px;
    overflow-y: auto;
    ul {
      li {
        height: 26px;
        position: relative;
        line-height: 26px;
        font-size: 0;
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 0, 0, .1);
        }
        em {
          width: 20px;
          height: 100%;
          position: relative;
          display: inline-block;
          margin-left: 26px;
          background: url(../../assets/toolbar/search_icons.png) -41px -17px no-repeat;
        }
        span {
          width: 300px;
          height: 100%;
          position: relative;
          display: inline-block;
          vertical-align: top;
          font-size: 12px;
          color: white;
          overflow: hidden;
        }
      }
    }
  }
}

.search-scroll::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .2);
  border-radius: 10px;
  background-color: rgba(245, 245, 245, 0);
}

.search-scroll::-webkit-scrollbar
{
  width: 10px;
  background-color: rgba(245, 245, 245, 0);
}

.search-scroll::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  //-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: rgba(255, 255, 255, .5);
}
.poiList{
  overflow:auto;
  max-height: 200px;
}
::-webkit-scrollbar {/*隐藏滚轮*/
  display: none;
}
.poiList span{
   float: left;
  margin-right: 20px;
  cursor: pointer;
}
.poiList span:hover{
  color: #299dff;
}
.poiList span:active{
  color: #299dff;
}
.poiList span:visited{
  color: #299dff;
}

.draw_poi{
  width: 100%;
  color: #fff;
}
.draw_poi_top{
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.draw_poi_top span{
  float: left;
  height:30px;
  width: 25%;
  line-height: 30px;
  padding-left: 15px;
  font-size: 12px;
  cursor: pointer;
}
.draw_poi_top span:hover,.draw_poi_top span:visited,.draw_poi_top span:active{
  color: #299dff;
}

.draw_poi_bottom{
  transition: all 0.3s;
  overflow: auto;
  max-height:220px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.draw_poi_bottom span{
  display: block;
  width: 90%;
  margin-left: 15px;
  height: 25px;
  overflow: hidden;
  line-height: 25px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255,0.3);
}
.draw_poi_bottom span:hover,.draw_poi_bottom span:visited,.draw_poi_bottom span:active{
  color: #299dff;
}
</style>
<style scoped>

</style>
