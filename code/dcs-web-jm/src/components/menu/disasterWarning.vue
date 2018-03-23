<template>
    <main id="disaster-warning">
      <section id="warning-table">
        <ul>
          <li></li>
          <li v-for="el in levelText" v-text="el"></li>
        </ul>
        <ul v-for="(el, key) in emergencyMenu">
          <li>
            <span v-text="el.name"></span>
          </li>
          <li v-for="(lv, k) in el.levels">
            <span :class="{'warning-selected': lv.selected}" @click="selectWarning(el, lv, k)">
              <em :style="{ 'backgroundColor': lv.status ? '#ea6b6b' : '#89c997' }"></em>
            </span>
          </li>
        </ul>
      </section>
      <section class="warning-legend">
        <ul>
          <li><em></em><span>应急状态</span></li>
          <li><em></em><span>无应急响应</span></li>
        </ul>
      </section>
      <section class="warning-basis" v-show="basisText.length">
        <ul>
          <li><a>{{ warningLevel }}</a>{{ basisText }}</li>
          <li><a>判别条件：</a>{{ normText }}</li>
        </ul>
      </section>
    </main>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { EmergResponse } from '../../util/emergHelper'

export default {
    data() {
        return {
            warningLevel: '',
            basisText: '',
            normText: '',
            levelText: {
                red: 'Ⅰ级',
                orange: 'Ⅱ级',
                yellow: 'Ⅲ级',
                blue: 'Ⅳ级'
            }
        }
    },
    computed: {
        ...mapGetters([
            'emergencyMenu',
            'currentRegion'
        ])
    },
    methods: {
        ...mapActions([
            'resetEmergResStatus'
        ]),
        selectWarning(el, lv, key) {
            if(lv.selected) {
                lv.selected = false;
                this.warningLevel = '';
                this.basisText = '';
                this.normText = '';
            } else {
                for(let i in this.emergencyMenu) {
                    for(let l in this.emergencyMenu[i].levels) {
                        this.emergencyMenu[i].levels[l].selected = false;
                    }
                }
                lv.selected = true;
                let level = this.levelText[key];
                this.warningLevel = `${el.name}${level}：`;
                this.basisText = lv.basis || '当前无应急响应';
                this.normText = lv.norm;
            }
        },
        emergMonitor() {
            const defaultData = {
                red: { hasEmerg: false, emergMsg: '' },
                orange: { hasEmerg: false, emergMsg: '' },
                yellow: { hasEmerg: false, emergMsg: '' },
                blue: { hasEmerg: false, emergMsg: '' }
            }
            let emergRes = new EmergResponse(this.$http, this.currentRegion);
            emergRes.typhoonMonitor()
              .then(data => {
                  this.resetEmergResStatus({ type: 'typhoon', data });
              })
              .catch(err => {
                  this.resetEmergResStatus({ type: 'typhoon', data: defaultData });
              });
            emergRes.rainMonitor()
              .then(data => {
                  this.resetEmergResStatus({ type: 'rain', data });
              })
              .catch(err => {
                  this.resetEmergResStatus({ type: 'rain', data: defaultData });
              });
            emergRes.maxTempMonitor()
              .then(data => {
                  this.resetEmergResStatus({ type: 'temp', data });
              })
              .catch(err => {
                  this.resetEmergResStatus({ type: 'temp', data: defaultData });
              });
            emergRes.minTempMonitor()
              .then(data => {
                  this.resetEmergResStatus({ type: 'cold', data });
              })
              .catch(err => {
                  this.resetEmergResStatus({ type: 'cold', data: defaultData });
              });
        }
    },
    watch: {
        'currentRegion': {
            handler(nv) {
                this.emergMonitor();
                setInterval(() => {
                    this.emergMonitor();
                }, 360000);   //6分钟监控一次
            },
            deep: true
        }
    }
}
</script>
<style lang="scss" scoped>
#disaster-warning {
  section#warning-table {
    position: relative;
    margin: 15px 9px 5px 9px;
    border: 1px solid #d6e1ee;
    font-size: 0;
    ul {
      height: 24px;
      position: relative;
      color: #475f88;
      &:first-of-type {
        height: 30px;
        border-bottom: 1px solid #d6e1ee;
        li {
          width: 52px;
          line-height: 30px!important;
          font-size: 12px;
          font-weight: bold;
          border-right: none;
          &:first-of-type {
            width: 51px;
            border-right: 1px solid #d6e1ee;
          }
        }
      }
      li {
        width: 51px;
        height: 100%;
        position: relative;
        display: inline-block;
        vertical-align: top;
        font-size: 0;
        line-height: 24px;
        text-align: center;
        border-right: 1px solid #d6e1ee;
        &:first-of-type {
          width: 51px;
          font-weight: bold;
          span {
            width: 100%;
            height: 100%;
            margin: 0;
            font-size: 12px;
            border: none;
            cursor: default;
          }
        }
        &:last-of-type {
          border-right: none;
        }
        span {
          width: 16px;
          height: 16px;
          display: inline-block;
          vertical-align: top;
          margin: 3.5px 16px;
          border: 1px solid white;
          cursor: pointer;
          &:hover {
            border-color: #ea6b6b;
          }
          em {
            width: 6px;
            height: 6px;
            display: inline-block;
            vertical-align: top;
            margin: 5px;
            border-radius: 8px;
          }
        }
        span.warning-selected {
          border-color: #ea6b6b!important;
        }
      }
    }
  }

  section.warning-legend {
    position: relative;
    margin: 0px 9px 5px 9px;
    ul {
      font-size: 0;
      li {
        width: 50%;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
        line-height: 24px;
        text-align: center;
        &:first-of-type {
          em {
            background-color: #ea6b6b;
          }
        }
        &:last-of-type {
          em {
            background-color: #89c997;
          }
        }
        em {
          width: 8px;
          height: 8px;
          display: inline-block;
          vertical-align: top;
          margin: 8px 5px;
          border-radius: 8px;
        }
      }
    }
  }

  section.warning-basis {
    position: relative;
    margin: 0px 10px 10px;
    padding-top: 8px;
    border-top: 1px solid #d7d7d7;
    ul {
      li {
        color: #545454;
        line-height: 20px;
        padding-bottom: 5px;
        &:last-of-type {
          padding-bottom: 0;
        }
        a {
          color: #299dff;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
