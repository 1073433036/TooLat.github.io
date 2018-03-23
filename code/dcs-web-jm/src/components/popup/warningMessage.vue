<template>
    <div id="warning-msg" v-if="warnMsgs.length || infoMsgs.length" :style="{'bottom': bottomPos}">
        <div class="warning-msg-box info-msg-box" v-if="infoMsgs.length">
            <ul>
                <li v-for="(el, index) in infoMsgs" :class="{'msg-selected': index === infoSelectedIndex }">
                    <a>{{ el.title }}</a>
                    <em @click="expandDetails(index, 'info')"></em>
                    <em @click="deleteMsg(index, 'info')" title="隐藏提示信息"></em>
                    <span v-html="el.msg"></span>
                </li>
            </ul>
        </div>
        <div class="warning-msg-box" v-if="warnMsgs.length">
           <ul>
              <li v-for="(el, index) in warnMsgs" :class="{'msg-selected': index === warnSelectedIndex }">
                  <a :title="el.title">{{ el.shortTitle }}</a>
                  <em @click="expandDetails(index, 'warn')"></em>
                  <em @click="deleteMsg(index, 'warn')" title="隐藏预警信息"></em>
                  <span v-html="el.msg"></span>
              </li>
           </ul>
        </div>
    </div>
</template>
<script>
    import AutoModelMonitor from '../../util/AutoModelMonitor'

    export default {
        props: ['currentRegion', 'toggleModelMenu', 'selectedModel', 'regionBounds'],
        data() {
            return {
                bottomPos: '10px',
                warnSelectedIndex: null,
                infoSelectedIndex: null,
                warnMsgs: [],
                infoMsgs: []
            }
        },
        mounted() {
            /*this.infoMsgs.push({
                title: '平台版本已升级为v1.1.4',
                msg: '更新内容：</br>'
                    + '1. 新增极大风过去72小时实况分析；</br>'
                    + '2. 新增图例功能；</br>'
                    + '3. 修复色标bug；</br>'
                    + '4. 模型分析结果面板标题添加时间标识。</br>'
            });*/

            setTimeout(() => {
                this.autoMonitor();
            }, 2000);

            setInterval(() => {
                this.clearMsgs();
                this.autoMonitor();
                setTimeout(this.clearMsgs, 60000);
            }, 600000);

        },
        methods: {
            expandDetails(index, type) {
                if(type === 'info')
                    this.infoSelectedIndex = this.infoSelectedIndex === index ? null : index;
                else
                    this.warnSelectedIndex = this.warnSelectedIndex === index ? null : index;
            },
            deleteMsg(index, type) {
                if(type === 'info')
                    this.infoMsgs.splice(index, 1);
                else
                    this.warnMsgs.splice(index, 1);
            },
            clearMsgs() {
              this.warnSelectedIndex = null;
              this.infoSelectedIndex = null;
              this.warnMsgs = [];
              this.infoMsgs = [];
            },
            autoMonitor() {
                let autoModelMonitor = new AutoModelMonitor(this.$http, this.currentRegion);
                //未来3小时暴雨、大风影响区域预报
                autoModelMonitor.forecastMonitor()
                  .then(data => {
                      if(typeof data.rainMsg === 'string' && data.rainMsg.length) {
                          this.showNoticeMsg('未来3小时将会有大雨以上级别降雨', data.rainMsg);
                      }
                      if(typeof data.windMsg === 'string' && data.windMsg.length) {
                          this.showNoticeMsg('未来3小时以下区域将有7级以上大风', data.windMsg);
                      }
                  });
                //台风监控
                autoModelMonitor.typhoonMonitor(this.regionBounds)
                  .then(data => {
                      if(!Array.isArray(data)) {
                          return;
                      }
                      if(data.length) {
                          if(this.selectedModel === null)
                              this.toggleModelMenu('tide');

                          for(let obj of data) {
                              this.showNoticeMsg(obj.title, obj.msg, 'warning', 'tide');
                          }
                      }
                  });
                //雷电监控
                autoModelMonitor.thunderMonitor()
                  .then(data => {
                      if(!data.length)
                          return;
                      this.showNoticeMsg('未来1小时以下区域将会有雷电影响', data.join('，'));
                  });
                //内涝、山洪点监控
                autoModelMonitor.disasterMonitor()
                  .then(data => {
                    if(!data || !Object.keys(data).length)
                        return;
                    data.waterlogMsgs.length && this.showNoticeMsg('未来3小时以下区域可能出现内涝灾害', data.waterlogMsgs);
                    data.torrentMsgs.length && this.showNoticeMsg('未来3小时以下区域可能出现山洪灾害', data.torrentMsgs);
                  });
                autoModelMonitor = null;
            },
            showNoticeMsg(title, msg, type = 'warning', ele = '') {
                let shortTitle = title;
                if(title.length > 15)
                    shortTitle = title.substring(0, 14) + '...';
                if(ele === 'tide')
                    this.warnMsgs.unshift({ title, shortTitle, msg, type });
                else
                    this.warnMsgs.push({ title, shortTitle, msg, type });
            }
        }
    }
</script>
<style lang="scss" scoped>
#warning-msg {
  width: 300px;
  position: absolute;
  right: 10px;
  bottom: -400px;
  transition: bottom 1s;
  -moz-transition: bottom 1s;
  -webkit-transition: bottom 1s;
  -o-transition: bottom 1s;
  .info-msg-box {
    ul>li:first-of-type:before {
      content: 'i' !important;
      background-color: #299dff !important;
    }
  }
  .warning-msg-box {
    width: 100%;
    position: relative;
    margin-bottom: 10px;
    font-size: 0;
    background-color: rgba(255, 255, 255, .9);
    box-shadow: 2px 2px 10px -4px #000;
    border-radius: 2px;
    &:last-of-type {
      margin-bottom: 0 !important;
    }
    ul {
      width: 100%;
      position: relative;
      display: inline-block;
      font-size: 0;
      li {
        width: calc(100% - 48px);
        position: relative;
        display: inline-block;
        padding-left: 48px;
        font-size: 12px;
        border-bottom: 1px solid rgba(0, 0, 0, .2);
        overflow: hidden;
        &:first-of-type:before {
          content: '!';
          width: 30px;
          height: 30px;
          background-color: rgb(247, 188, 15);
          border-radius: 16px;
          color: white;
          position: absolute;
          text-align: center;
          line-height: 30px;
          font-size: 20px;
          font-weight: bold;
          left: 10px;
          top: 10px;
        }
        &:last-of-type {
          border-bottom: none;
        }
        &.msg-selected {
          span {
            display: block !important;
          }
          em {
            transform: rotate(180deg) !important;
          }
        }
        &:hover {
          em:first-of-type {
            right: 30px;
          }
          em:nth-of-type(2) {
            right: 5px;
          }
        }
        a {
          width: calc(100% - 48px);
          display: inline-block;
          line-height: 50px;
          font-size: 14px;
          color: red;
          text-decoration: none;
          cursor: pointer;
        }
        em {
          width: 17px;
          height: 16px;
          position: absolute;
          top: 17px;
          right: 10px;
          transform: rotate(0deg);
          transition: right .6s;
          -moz-transition: right .6s;
          -webkit-transition: right .6s;
          -o-transition: right .6s;
          background: url(../../assets/expand.png) center center no-repeat;
          cursor: pointer;
          &:nth-of-type(2) {
            right: -17px;
            background: url(../../assets/close.png) center 4px no-repeat;
          }
          &:hover {
            border-radius: 10px;
            background-color: rgba(0, 0, 0, .1);
          }
        }
        span {
          width: calc(100% - 18px);
          max-height: 300px;
          position: relative;
          display: inline-block;
          padding: 0px 0 10px 0px;
          display: none;
          color: #1d1d1d;
          line-height: 18px;
          overflow-x: hidden;
          overflow-y: auto;
          &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
            background-color: rgba(245, 245, 245, .1);
          }
          &::-webkit-scrollbar {
            width: 6px;
            background-color: rgba(245, 245, 245, .1);
          }
          &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, .2);
          }
        }
      }
    }
  }
}
</style>
