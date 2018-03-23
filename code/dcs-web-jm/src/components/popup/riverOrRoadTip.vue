<template>
    <div id="river-road-popup"
         v-if="tipShow"
         :style="riverRoadTipData.style">
        <span v-text="tipText"></span>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'

    export default{
        computed: {
            ...mapGetters([
                'seledTime',
                'riverRoadTipData',
                'selectedModel'
            ]),
            tipShow() {
                return this.riverRoadTipData.info && (this.selectedModel === 'torrent' || this.selectedModel === 'waterlogging');
            },
            tipText() {
                let data = this.riverRoadTipData.info;
                if(data) {
                    const attr = 't' + this.seledTime;
                    let waterLevel = Number(data[attr].toFixed(1));
                    let prefix = this.seledTime ? `未来${this.seledTime}小时` : '当前';
                    let dec = waterLevel ? `雨水增量约${waterLevel}mm` : '无雨水增量';

                    return `${data.name}${prefix}${dec}`;
                }
                return '';
            }
        }
    }
</script>
<style lang="scss" scoped>
#river-road-popup {
  //height: 24px;
  position: absolute;
  padding: 0px 8px;
  line-height: 24px;
  color: white;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  pointer-events: none;
}
</style>
