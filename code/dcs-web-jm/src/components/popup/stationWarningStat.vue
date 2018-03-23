<template>
    <div id="station-warning-stat" v-if="stationWarningShow">
        <div class="stat-table-title">
            <span>{{dateTitle}} 预警站点列表（注：实况 | 阈值）</span>
            <span @click="toggleStationWarning">✕</span>
        </div>
        <div class="stat-table-wrapper"
             v-loading="loading"
             element-loading-text="加载中">
            <div class="table-title-wrapper">
                <ul>
                    <li v-for="el in columns" :style="{width: el.width+'px'}" v-text="el.text"></li>
                </ul>
            </div>
            <div class="table-list">
                <table v-if="warnStationList.length" width="100%" border="1" cellpadding="0" cellspacing="0">
                    <tr v-for="item in warnStationList">
                        <td v-for="el in columns"
                            :style="el.key === 'windMax_v' ? '' : {width: el.width+'px'}"
                            :class="{'warning-text': item[el.warnKey]}"
                            v-text="item[el.key]">
                        </td>
                    </tr>
                </table>
                <span v-else>无站点预警</span>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import { ModelAssess } from '../../util/modelAssess'

    export default {
        data() {
            return {
                columns: [
                  { key: 'stationID', text: '站点', warnKey: '', width: '60' },
                  { key: 'name', text: '名称', warnKey: '', width: '119' },
                  //{ key: 'rm30_v', text: '过去30min', warnKey: 'rm30_warn', width: '80' },
                  { key: 'rh01_v', text: '过去1h', warnKey: 'rh01_warn', width: '80' },
                  { key: 'rh03_v', text: '过去3h', warnKey: 'rh03_warn', width: '80' },
                  { key: 'rh06_v', text: '过去6h', warnKey: 'rh06_warn', width: '80' },
                  { key: 'rh12_v', text: '过去12h', warnKey: 'rh12_warn', width: '80' },
                  { key: 'rh24_v', text: '过去24h', warnKey: 'rh24_warn', width: '80' },
                  { key: 'rh48_v', text: '过去48h', warnKey: 'rh48_warn', width: '80' },
                  { key: 'rh72_v', text: '过去72h', warnKey: 'rh72_warn', width: '80' },
                  { key: 'wa01_v', text: '平均风力', warnKey: 'wa01_warn', width: '80' },
                  { key: 'wm01_v', text: '极大风力', warnKey: 'wm01_warn', width: 'auto' }
                ],
                attrs: {
                    //'rm30': 'rain_threshold_30min',
                    'rh01': 'rain_threshold_1h',
                    'rh03': 'rain_threshold_3h',
                    'rh06': 'rain_threshold_6h',
                    'rh12': 'rain_threshold_12h',
                    'rh24': 'rain_threshold_24h',
                    'rh48': 'rain_threshold_48h',
                    'rh72': 'rain_threshold_72h',
                    'wa01': 'wind_threshold_avg',
                    'wm01': 'wind_threshold_max'
                },
                warnSum: 0,
                warnStationList: [],
                timer: null,
                loading: false,
                dateTitle: ''
            }
        },
        computed: {
            ...mapGetters([
                'dateTime',
                'currentRegion',
                'stationWarningShow'
            ])
        },
        methods: {
            ...mapActions([
                'toggleStationWarning',
                'storeStationWarningSum'
            ]),
            getWarningList(dt, rg) {
                this.dateTitle = dt.Format('MM月dd日HH时mm分');
                let modelAssess = new ModelAssess(this.$http, rg);
                modelAssess.getPointJson('RainWind', `RainWind${dt.Format('yyyyMMddHHmm00')}.json`)
                  .then(data => {
                      let stationArr = [];
                      for(let st of data) {
                          let bool = false;
                          for(let i in this.attrs) {
                              let rth = this.attrs[i];  //阈值key
                              if(typeof st[i] !== 'number' || typeof st[rth] !== 'number')
                                  continue;
                              let v = st[i].toFixed(1),
                                  rthv = st[rth].toFixed(1);
                              v = v.indexOf('.0') >= 0 ? parseInt(v) : Number(v);
                              rthv = rthv.indexOf('.0') >= 0 ? parseInt(rthv) : Number(rthv);

                              st[`${i}_v`] = `${v} | ${rthv}`;
                              st[`${i}_warn`] = v > rthv;
                              if(v > rthv)
                                bool = true;
                          }
                          bool && stationArr.push(st);
                      }
                      this.warnStationList = stationArr;
                      this.storeStationWarningSum(stationArr.length);
                      this.loading = false;
                  })
                  .catch(err => {
                      this.warnStationList = [];
                      this.storeStationWarningSum(0);
                      this.loading = false;
                  });
            }
        },
        watch: {
            dateTime(dt) {
                this.loading = true;
                if(this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    this.getWarningList(dt, this.currentRegion);
                    this.timer = null;
                }, 500);
            },
            currentRegion(nv) {
                this.loading = true;
                this.getWarningList(this.dateTime, nv);
            }
        }
    }
</script>
<style lang="scss" scoped>
#station-warning-stat {
  width: 921px;
  position: absolute;
  right: 10px;
  bottom: 10px;
  box-shadow: 0px 0px 10px -2px #000;
  .stat-table-title {
    width: 100%;
    height: 30px;
    position: relative;
    color: white;
    line-height: 30px;
    text-indent: 10px;
    background-color: #263b5c;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    span {
      &:last-of-type {
        width: 30px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
        &:hover {
          background: #1c3252;
          border-top-right-radius: 2px;
        }
      }
    }
  }
  .stat-table-wrapper {
    width: 100%;
    position: relative;
    background-color: white;
    .table-title-wrapper {
      width: 100%;
      position: relative;
      font-size: 0;
      border-bottom: 1px solid #eee;
      background-color: #EFF2F7;
      ul {
        width: 100%;
        height: 30px;
        position: relative;
        display: inline-block;
        font-size: 0;
        li {
          height: 100%;
          position: relative;
          display: inline-block;
          vertical-align: top;
          font-size: 12px;
          line-height: 30px;
          text-align: center;
          font-weight: bold;
          border-right: 1px solid #eee;
          &:last-of-type {
            border-right: none;
          }
          &:first-of-type {
            border-left: 1px solid #eee;
          }
        }
      }
    }

    .table-list {
      width: 100%;
      max-height: 400px;
      position: relative;
      overflow-y: auto;
      table {
        width: 100%;
        border-collapse: collapse;
        border-color: rgba(0, 0, 0, 0);
        tr {
          height: 30px;
          font-size: 0;
          th, td {
            text-align: center;
            border-color: #eee;
            font-size: 12px;
          }
          th {
            background-color: #EFF2F7;
          }
        }
      }

      span {
        width: 100%;
        display: inline-block;
        line-height: 100px;
        color: red;
        text-align: center;
      }
    }
  }
}

.warning-text {
  color: red !important;
}
</style>
