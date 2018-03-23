<template>
  <section id="disasters-info">
    <h1 class="section-title">最新灾情信息</h1>
    <!-- <a class="more-info">更多</a> -->
    <div class="status-legend">
      <!-- <el-badge :value="unAuditedData.length" is-dot class="item">
        <el-tag size="small">未审核</el-tag>
      </el-badge>
      <el-badge :value="happeningData.length" is-dot class="item">
        <el-tag size="small">发生中</el-tag>
      </el-badge> -->
      <div v-if="hasAuditPower">未审核</div>
      <div>正在发生</div>
    </div>
    <div class="disaster-info-wrapper" v-loading="isLoading">
      <div class="disaster-info-table" v-if="disasterList.length" key="disaster-info">
        <ul v-for="(item, index) in disasterList" :key="index" @click.stop="showDisasterInfo(true, item)">
          <li :style="{'backgroundColor': getStatusColor(item.auditStatus || '')}"></li>
          <li>{{ item.name || item.title }}</li>
          <li>{{ item.starttime || item.ddatetime }}</li>
        </ul>
      </div>
      <div class="disaster-info-nodata ns" v-else key="disaster-info">当前无灾情</div>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import moment from 'moment'
  import { Component, Prop } from 'vue-property-decorator'
  import { Getter } from 'vuex-class'
  import { PRIVATE_URL } from '../../config/HttpUrlConf'
  import UserInfo from '../../interface/userInfo'
  import Disaster from '../../interface/Disaster'
  import { EmergEvent } from '../../interface/EmergEvent'
  import DisasterService from '../../util/DisasterService'
  import EmergEventHttp from '../../util/EmergEventHttp'

  @Component
  export default class DisasterInfo extends Vue {
    @Prop()
    showDisasterInfo: Function
    @Getter('systemStore/userInfo_global') userInfoGlobal: UserInfo

    unAuditedData: Disaster[] = []
    happeningData: EmergEvent[] = []
    disasterList: Array<Disaster | EmergEvent> = []
    isLoading: boolean = false
    timer: any = null

    get hasAuditPower(): boolean {
      console.log(this.userInfoGlobal);
      return this.userInfoGlobal.roles.d_r_audit || false;
    }

    mounted(): void {
      this.getDisasterInfo();
      this.timer = setInterval(this.getDisasterInfo, 600000); //10分钟
    }

    destroyed(): void {
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }

    getStatusColor(status): string {
      return status === 'unchecked' ? 'orange' : 'red';
      // let disaService = new DisasterService();
      // let color: string = disaService.getStatusColor(status);
      // return color;
    }

    async getDisasterInfo(): Promise<void> {
      this.isLoading = true;
      let emergEvent = new EmergEventHttp();
      let promises: any[] = [emergEvent.getEmergEvents()];
      if (this.hasAuditPower) {
        let disaService = new DisasterService();
        promises.push(disaService.getTaoDisastersInfo({ auditStatus: 'unchecked' }));
      }
      
      let data: any = await Promise.all(promises);
      if(data[0].length) {
        data[0].forEach(el => {
          el.ddatetime = moment(el.ddatetime).format('YYYY-MM-DD HH:mm');
          el.info = el.info && el.info.length ? JSON.parse(el.info) : {};
        });
      }
      
      this.happeningData = data[0];
      if(data.length > 1) {
        this.unAuditedData = data[1];
        this.disasterList = data[1].concat(data[0]);
      } else {
        this.unAuditedData = [];
        this.disasterList = data[0];
      }
      
      this.isLoading = false;
      emergEvent = null;
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/theme.scss';
  $contHeight: 150px;

  #disasters-info {
    width: 100%;
    height: $contHeight;
    position: relative;
    .status-legend {
      position: absolute;
      top: 0;
      right: 0;
      >div {
        position: relative;
        line-height: 50px;
        font-size: 12px;
        color: #595757;
        padding: 0 10px;
        display: inline-block;
        vertical-align: top;
        &::before {
          content: '';
          width: 8px;
          height: 8px;
          position: absolute;
          left: 0px;
          top: 21px;
          border-radius: 10px;
          background-color: orange;
        }
        &:last-of-type::before {
          background-color: red;
        }
      }
    }
    .disaster-info-wrapper {
      width: 100%;
      height: calc(100% - 60px);
      position: relative;
      background-color: white;
      max-height: calc(100% - 60px);
      overflow-y: auto;
      @include scrollStyle;
      .disaster-info-table {
        width: 100%;
        height: 100%;
        position: relative;
        >ul {
          width: calc(100% - 30px);
          height: 30px;
          line-height: 30px;
          position: relative;
          display: block;
          padding: 0 10px 0 20px;
          font-size: 0;
          cursor: pointer;
          &:hover {
            >li {
              color: $themeColor;
            }
          }
          >li {
            display: inline-block;
            vertical-align: top;
            &:first-of-type {
              width: 8px;
              height: 8px;
              position: relative;
              top: 10px;
              border-radius: 8px;  
            }
            &:nth-of-type(2) {
              width: 50%;
              height: 100%;
              position: relative;
              overflow: hidden;
              font-size: 12px;
              margin-left: 10px;
            }
            &:last-of-type {
              width: calc(50% - 28px);
              height: 100%;
              position: relative;
              font-size: 12px;
              overflow: hidden;
              margin-left: 10px;
              text-align: right;
            }
          }
        }
      }

      .disaster-info-nodata {
        width: 100%;
        height: 100%;
        position: relative;
        font-size: 24px;
        line-height: $contHeight - 80px;
        text-align: center;
        font-weight: bold;
        color: darkorange;
      }
    }
  }
</style>