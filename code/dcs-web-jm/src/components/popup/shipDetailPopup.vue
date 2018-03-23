<template>
    <div id="ship-detail-popup"
         class="poi-detail-popup"
         v-if="popupShow"
         v-drag="{handle: '.poi-detail-title'}">
        <div class="poi-detail-title">
            {{shipDetails.NAME_EN}}
            <span @click="clearShipDetail">✕</span>
        </div>
        <div class="poi-detail-wrapper">
            <ul>
                <li v-for="el in shipData">{{el.name}}：{{el.value}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            attrs: {
                MMSI: { name: '船舶唯一标识', value: '' },
                IMO: { name: '船舶名称代码', value: '' },
                LENGTH: { name: '船身长度', value: '' },
                WIDTH: { name: '船身宽度', value: '' },
                DRAUGHT: { name: '吃水受限', value: '' },
                VESSELTYPE: { name: '船舶类型', value: '' },
                DEST: { name: '目的地', value: '' },
                DDATETIME: { name: '时间', value: '' },
                ETA: { name: 'ETA', value: '' },
                COURSE: { name: '航线', value: '' },
                SOG: { name: '对地航速', value: '' },
                STATE: { name: '状态', value: '' },
                COG: { name: '对地航向', value: '' },
                AISCLASS: { name: '船舶设备', value: '' },
                DEVICETYPE: { name: '设备类型', value: '' },
                CALLSIGH: { name: '观察船呼号', value: '' }
            }
        }
    },
    computed: {
        ...mapGetters([
            'shipDetails'
        ]),
        popupShow() {
            return Object.keys(this.shipDetails).length;
        },
        shipData() {
            let attrs = Object.assign({}, this.attrs);
            if(this.popupShow) {
                for(let i in attrs) {
                    let value = this.shipDetails[i] || '';
                    if(i === 'DDATETIME') {
                        value = value.includes('.0') ? value.replace('.0', '') : value;
                    }
                    attrs[i].value = value;
                }
            }
            return attrs;
        }
    },
    methods: {
        ...mapActions([
            'clearShipDetail'
        ])
    },
}
</script>
<style lang="scss" scoped>
#ship-detail-popup {
  width: 400px;
  .poi-detail-wrapper {
    ul {
      display: inline-block;
      font-size: 0;
      margin: 5px 0px;
      li {
        width: 160px;
        height: 30px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        padding: 0px 20px;
        font-size: 12px;
        line-height: 30px;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}
</style>
