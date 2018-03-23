<template>
    <div id="flow-convection-result"
        class="poi-detail-popup"
        style="width: 700px;"
        v-if="statTableShow"
        v-drag="{handle: '.poi-detail-title'}">
        <div class="poi-detail-title">
            {{ '站点实况分析结果 - ' + tableTitle }}
            <span @click="toggleWarningStatTable(false)">✕</span>
        </div>
        <div class="poi-detail-wrapper"
            v-loading="isWarningAnalysis"
            element-loading-text="分析中">
            <el-table :data="warningTownsData"
                    max-height="390"
                    :emptyText="emptyText"
                    border>
                <el-table-column
                    prop="townName"
                    label="影响区域"
                    width="140"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="station"
                    label="超警站点"
                    width=""
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="value"
                    :label="theader + unit"
                    width="140"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="threshold"
                    :label="'站点阈值' + unit"
                    width="140"
                    align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        data() {
            return {
                unit: '',
                theader: '站点累计',
            }
        },
        computed: {
            ...mapGetters([
                'warningTownsData',
                'warningEles',
                'warningTimes',
                'isWarningAnalysis',
                'statTableShow'
            ]),
            tableTitle() {
                let title = '';
                for(let i in this.warningEles) {
                    let el = this.warningEles[i];
                    if(!el.selected)
                        continue;
                    let seledTime = this.warningTimes.filter(v => v.selected);
                    if(i === 'rain') {
                        title = `过去${seledTime[0].text}h雨量影响区域统计表`;
                        this.unit = '(mm)';
                        this.theader = '站点累计';
                    } else {
                        title = `过去${seledTime[0].text}h影响区域统计表`;
                        this.unit = '(m/s)';
                        this.theader = '站点实况';
                    }
                    break;
                }
                return title;
            },
            emptyText() {
                let selectedEle;
                for(let i in this.warningEles) {
                    if(this.warningEles[i].selected) {
                        selectedEle = i;
                    }
                }
                return selectedEle === 'rain' ? '无明显降水影响区域' : '无大风影响区域';
            }
        },
        methods: {
            ...mapActions([
                'toggleAnalysisStatus',
                'toggleWarningStatTable'
            ])
        }
    }
</script>
