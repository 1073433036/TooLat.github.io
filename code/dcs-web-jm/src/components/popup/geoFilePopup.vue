<template>
    <div id="geo-file-popup" class="poi-detail-popup" v-if="geoFilePopup.show">
        <div class="poi-detail-title">
            地质灾害风险等级报告
            <span @click="toggleGeoFilePopup(false)">✕</span>
        </div>
        <div class="poi-detail-wrapper">
            <input type="text" placeholder="期号" :value="geoFilePopup.issue" @input="updateFileMsg('issue', $event)" />
            <input type="text" placeholder="签发人" :value="geoFilePopup.issuer" @input="updateFileMsg('issuer', $event)" />
            <span v-show="tipShow">{{ tipText }}</span>
            <span @click="downloadGeoFile">下载</span>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default{
    data() {
        return {
            tipShow: false,
            tipText: '',
            issuers: []
        }
    },
    beforeDestroy() {
        if(this.tipShow)
            this.tipShow = false;
    },
    computed: {
        ...mapGetters([
            'geoFilePopup',
            'currentRegion',
            'dateForModel',
            'dateTime',
            'selectedModel'
        ])
    },
    methods: {
        ...mapActions([
            'toggleGeoFilePopup',
            'updateGeoFileMsg'
        ]),
        updateFileMsg(key, event) {
            if(this.tipShow) {
                this.tipShow = false;
                this.tipText = '';
            }
            this.updateGeoFileMsg({ key, value: event.target.value });
        },
        downloadGeoFile() {
            if(this.tipText === '生成中...')
                return;
            let fileParams = this.geoFilePopup;
            if(fileParams.issue === '' || fileParams.issuer === '') {
                this.tipShow = true;
                this.tipText = '期号或签发人不能为空！';
                return;
            }

            this.tipText = '生成中...';

            const params = {
                cityId: this.currentRegion.cityId,
                timeStamp: this.dateForModel,
                year: this.dateTime.getFullYear(),
                issue: fileParams.issue,
                name: fileParams.issuer
            };

            const url = `http://10.148.83.228:1995/JmDcs/word/create`;
            this.$http.jsonp(url, { params }).then(response => {
                let data = response.data;
                if(data === true || data === 'true') {
                    this.tipShow = true;
                    this.tipText = '生成成功！';
                    let aLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
                    aLink.href = `http://10.148.83.228:1995/JmDcs/word/getWord?cityId=${this.currentRegion.cityId}`;
                    aLink.download = `地质灾害风险等级报告${this.dateTime.getFullYear()}年第${fileParams.issue}期`;
                    //自动触发点击事件
                    let ev = document.createEvent('MouseEvents');
                    ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    aLink.dispatchEvent(ev);
                    setTimeout(() => { this.toggleGeoFilePopup(false) }, 2000);
                } else {
                    this.tipShow = true;
                    this.tipText = '生成失败!';
                }
            }).catch(err => {
                this.tipShow = true;
                this.tipText = '生成失败!';
            });
        }
    },
    watch: {
        selectedModel(newVal) {
            if(newVal !== 'geology' && this.geoFilePopup.show) {
                this.toggleGeoFilePopup();
            }
        }
    }
}
</script>
<style lang="scss" scoped>
$popupWidth: 220px;

#geo-file-popup {
  width: $popupWidth;
  top: 100px;
  right: 50%;
  margin-right: -($popupWidth/2);
  .poi-detail-wrapper {
    padding: 5px 0px 10px 0px;
    position: relative;
    input {
      width: 198px;
      height: 28px;
      position: relative;
      display: inline-block;
      margin: 5px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-indent: 10px;
      outline: none;
    }
    span {
      &:nth-child(3) {
        height: 26px;
        position: absolute;
        display: inline-block;
        vertical-align: top;
        margin-top: 5px;
        margin-left: 12px;
        line-height: 26px;
        color: red;
      }
      &:nth-child(4) {
        width: 48px;
        height: 24px;
        position: relative;
        display: inline-block;
        margin-top: 5px;
        margin-left: 160px;
        line-height: 24px;
        text-align: center;
        color: #299dff;
        border: 1px solid #299dff;
        border-radius: 2px;
        cursor: pointer;
        &:hover {
          background: #299dff;
          color: white;
        }
      }
    }
  }
}
</style>
