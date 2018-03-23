<template>
    <div id="typhoon-report-popup" v-drag="{handle: '.typhoon-report-title'}">
        <div class="typhoon-report-title">
            历史台风报告
            <span @click="toggleTyphReportPopup(false)">✕</span>
        </div>
        <div class="typhoon-report-wrapper"
            v-loading="isAnalysing"
            element-loading-text="分析中">
            <div class="typhoon-report-section" v-show="!isAnalysing">{{reportTitle}}</div>
            <div class="typhoon-report-section" v-show="!isAnalysing">
                <span class="report-section-title">一、台风实况</span>
                <div class="report-section-content">
                    <ul>
                        <li v-for="el in pathArray">
                            <a>{{el.date}}</a>
                            <span>{{el.msg}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="typhoon-report-section" v-show="!isAnalysing">
                <span class="report-section-title">二、风雨影响实况</span>
                <div class="report-section-content">
                    <div v-if="rainEffects.length === 0" style="margin-top: 0; color: red;">台风过程中无暴雨及以上级别降雨！</div>
                    <ul class="report-rain-effects" v-else>
                        <li v-for="el in rainEffects">
                            <a>{{el.key}}</a>
                            <span v-html="el.msgs"></span>
                        </li>
                    </ul>
                    <div v-if="stationRainStat.length">1、台风过程站点累计雨量：</div>
                    <ul class="report-station-stat" v-if="stationRainStat.length">
                        <li>
                            <span>站点</span>
                            <span>雨量(mm)</span>
                        </li>
                        <li v-for="el in stationRainStat">
                            <span>{{el.name}}</span>
                            <span>{{el.val}}</span>
                        </li>
                    </ul>
                    <div v-if="stationWindStat.length">2、台风过程站点极值风最大值：</div>
                    <ul class="report-station-stat" v-if="stationWindStat.length">
                        <li>
                            <span>站点</span>
                            <span>极大风速(m/s)</span>
                        </li>
                        <li v-for="el in stationWindStat">
                            <span>{{el.name}}</span>
                            <span>{{el.val + '(' + el.level + ')'}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="typhoon-report-section" v-show="!isAnalysing">
                <el-button class="generate-report"
                           style="margin: 10px 0px;"
                           @click="">下载报告</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import TyphoonReport from '../../util/TyphoonReport'

    export default {
        props: {
            typhoonId: String,
            isBefore2003: Boolean,
            currentRegion: Object,
            toggleTyphReportPopup: Function
        },
        data() {
            return {
                isAnalysing: false,
                reportTitle: '',
                pathArray: [],
                rainEffectedTowns: [],
                windEffectedTowns: [],
                stationRainStat: [],
                stationWindStat: []
            }
        },
        computed: {
            rainEffects() {
                this.rainEffectedTowns.reverse();
                const rainLevels = ['暴雨(24h雨量50~100mm)', '大暴雨(24h雨量100~250mm)', '特大暴雨(24h雨量250mm以上)'];
                let transData = [];
                this.rainEffectedTowns.forEach((el, index) => {
                    if(!Object.keys(el).length)
                        return true;
                    const key = rainLevels[index];
                    let msgs = '';
                    for(let i in el) {
                        msgs += `<b>${i}</b>：${el[i].join('，')}</br>`;
                    }
                    transData.push({ key, msgs });
                });
                return transData;
            }
        },
        methods: {
            async analysisReport(tsid) {
                if(this.isAnaylysing || !tsid)
                    return;
                this.isAnalysing = true;
                const curRegion = this.currentRegion;
                let typhoonReport = new TyphoonReport(this.$http, curRegion);

                let tyPathData = await typhoonReport.typhoonPathAnalysis(tsid, this.isBefore2003);

                let townPromise = typhoonReport.typhoonAffectedTowns('rain08_08', 'max', [999, 250, 100, 50]),
                    rainPromise = typhoonReport.typhoonStationAnalysis('rain08_08', 'sum', curRegion.cityName, curRegion.countyName),
                    windPromise = typhoonReport.typhoonStationAnalysis('windextrm_vel', 'max', curRegion.cityName, curRegion.countyName);

                try {
                  let data = await Promise.all([townPromise, rainPromise, windPromise])
                  if(this.typhoonId !== tsid)
                      return;
                  this.reportTitle = tyPathData.tyTitle || '';
                  this.pathArray = tyPathData.pathDescs || [];
                  this.rainEffectedTowns = data[0] || [];
                  this.stationRainStat = data[1] || [];
                  this.stationWindStat = data[2] || [];
                  this.isAnalysing = false;
                }
                catch(err) {
                  this.reportTitle = '';
                  this.pathArray = [];
                  this.rainEffectedTowns = [];
                  this.stationRainStat = [];
                  this.stationWindStat = [];
                  this.isAnalysing = false;
                };
            }
        },
        watch: {
            typhoonId(tsid) {
                this.analysisReport(tsid);
            }
        },
        mounted() {
            this.analysisReport(this.typhoonId);
        }
    }
</script>
<style lang="scss" scoped>
#typhoon-report-popup {
    width: 600px;
    position: absolute;
    left: 50%;
    top: 50px;
    margin-left: -300px;
    overflow: hidden;
    background-color: white;
    border-radius: 4px 4px 2px 2px;
    box-shadow: 0px 0px 10px -2px #000;
    .typhoon-report-title {
        width: 100%;
        height: 28px;
        position: relative;
        background-color: #263b5c;
        color: white;
        font-size: 1.2rem;
        line-height: 28px;
        text-indent: 1rem;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        cursor: move;
        span {
            width: 28px;
            height: 100%;
            position: absolute;
            display: inline-block;
            right: 0;
            font-size: 10px;
            text-align: center;
            text-indent: 0;
            line-height: 28px;
            cursor: pointer;
            &:hover {
                background: #1c3252;
                border-top-right-radius: 2px;
            }
        }
    }
    .typhoon-report-wrapper {
        width: calc(100% - 40px);
        max-height: 500px;
        min-height: 100px;
        position: relative;
        padding: 10px 20px;
        overflow-y: auto;
        .typhoon-report-section {
            width: 100%;
            position: relative;
            &:first-of-type {
                line-height: 30px;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                color: #299dff;
            }
            >span {
                width: 100%;
                display: block;
                font-size: 14px;
                font-weight: bold;
                color: #2c3e50;
                line-height: 30px;
            }
            .report-section-content {
                width: 100%;
                position: relative;
                div {
                    width: calc(100% - 10px);
                    position: relative;
                    padding-left: 10px;
                    margin-top: 20px;
                    line-height: 30px;
                    font-size: 12px;
                    font-weight: bold;
                }
                ul {
                    li {
                        margin-left: 10px;
                        font-size: 0;
                        border-left: 4px solid #f1f1f1;
                        a {
                            //height: 40px;
                            display: inline-block;
                            position: relative;
                            margin-right: 10px;
                            padding-left: 10px;
                            color: #299dff;
                            font-weight: bold;
                            line-height: 40px;
                            font-size: 12px;
                            &::before {
                                content: '';
                                width: 10px;
                                height: 10px;
                                position: absolute;
                                border: 2px solid #299dff;
                                border-radius: 10px;
                                background-color: white;
                                top: 13px;
                                left: -9px;
                            }
                        }
                        span {
                            width: calc(100% - 10px);
                            line-height: 18px;
                            padding-left: 10px;
                            display: inline-block;
                            vertical-align: top;
                            font-size: 12px;
                        }
                    }
                }
                .report-station-stat {
                    margin: 0px 0px 20px 10px;
                    border-left: 1px solid #ddd;
                    border-top: 1px solid #ddd;
                    li {
                        border-left: none !important;
                        margin-left: 0 !important;
                        font-size: 0 !important;
                        &:first-of-type {
                            span {
                                background-color: rgb(223, 231, 242);
                            }
                        }
                        span {
                            width: calc(50% - 1px);
                            height: 30px;
                            position: relative;
                            display: inline-block;
                            vertical-align: top;
                            padding-left: 0px;
                            font-size: 12px;
                            line-height: 30px;
                            text-align: center;
                            border-bottom: 1px solid #ddd;
                            border-right: 1px solid #ddd;
                        }
                    }
                }
            }
        }
    }
}
</style>
