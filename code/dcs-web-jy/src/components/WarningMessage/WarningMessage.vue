<template>
  <section id="warning-message">
    <h1 class="section-title">最新发布预警信息</h1>
    <a class="publish-info" title="发布预警信息" @click.stop="showPublishPopup(true)"></a>
    <a class="warning-list" title="预警信息列表" @click.stop="showPublishPopup(true)"></a>
    <div class="publish-message-wrapper" v-if="showData.length">
      <el-carousel style="position: relative; height: 100%;" height="100%" arrow="always">
        <el-carousel-item v-for="(item, index) in showData" :key="index">
          <div class="warning-message-wrapper">
            <div class="warning-message-content">{{getWarningDetail(item)}}</div>
            <div class="warning-message-people">
              <div class="warning-message-signer">签发人：{{item.signer}}</div>
              <div class="warning-message-forecaster">预报员：{{item.forecaster}}</div>
            </div>
            <div class="warning-message-btns">
              <div class="warning-message-change" @click.stop="showWarningChange(item)">变更</div>
              <div class="warning-message-relieve">解除</div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="warning-message-nodata" v-else>当前无预警信息</div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop } from 'vue-property-decorator'
  import { Getter } from 'vuex-class'
  import InfoPublishHttp from '../../util/InfoPublishHttp'
  import { WarningForm } from '../../interface/WarningPublish'

  @Component
  export default class WarningMessage extends Vue {
    @Prop()
    showPublishPopup: Function
    @Prop()
    showWarningChange:  Function
    @Getter('systemStore/region_global') regionGlobal

    unAuditedData: WarningForm[] = []
    auditedData: WarningForm[] = []
    showData: WarningForm[] = []
    selectedOption: string = 'audited'

    mounted(): void {
      this.getWarningMessage(this.selectedOption);
    }

    selectWarningType(type: string): void {
      if(this.selectedOption !== type) {
        this.selectedOption = type;
        this.showData = this.selectedOption === 'audited' ? this.auditedData : this.unAuditedData;
      }
    }
    changeWarningChange(item:any){
      console.log(item)
    }

    getWarningDetail(message: any): string {
      // if(!message.warningMessage) {
      //   let name = this.regionGlobal.countyId ? this.regionGlobal.countyName : this.regionGlobal.cityName;
      //   return `【${message.oneEventType}${message.oneEventLevel}预警】${message.warningMessage}`;
      // } else {
      //   return message.warningMessage;
      // }
      return `【${message.typeWarn}预警】${message.warningMessage}`;
    }

    async getWarningMessage(state: string): Promise<void> {
      let msgHttp = new InfoPublishHttp();
      let data: WarningForm[] = await msgHttp.getWaringFormsByStatus(state === 'audited' ? 2 : 1);
      console.log(data);
      if(state === 'unAudited')
        this.unAuditedData = data;
      else if(state === 'audited')
        this.auditedData = data;
      if(this.selectedOption === state)
        this.showData = data;
      if(this.showData.length === 1)
        this.showData = this.showData.concat(data);
    }
  }
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

#warning-message {
  width: 100%;
  height: 310px;
  position: relative;
  .publish-message-wrapper {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
  }

  .warning-list {
    width: 20px; /*no*/
    height: 20px;  /*no*/
    position: absolute;
    top: 10px; /*no*/
    right: 10px;
    background: url(~Img/warningMsg/list.png) center center no-repeat;
    cursor: pointer;
  }

  .publish-info {
    width: 16px; /*no*/
    height: 16px;  /*no*/
    position: absolute;
    top: 12px; /*no*/
    right: 44px;
    background: url(~Img/warningMsg/publish.png) center center no-repeat;
    cursor: pointer;
  }

  .warning-message-nodata {
    width: 100%;
    height: calc(100% - 90px);
    position: relative;
    text-align: center;
    line-height: 200px;
    font-size: 20px;
    color: orange;
    font-weight: bold;
  }
  .warning-message-wrapper {
    width: 100%;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    .warning-message-content {
      width: calc(100% - 60px);
      height: auto;
      position: relative;
      margin: 0 20px;
      padding: 10px;
      line-height: 20px;
    }
    .warning-message-people {
      height: 30px;
      position: relative;
      margin: 10px 30px;
      .warning-message-signer {
        height: 30px;
        position: relative;
        line-height: 30px;
        float: left;
      }
      .warning-message-forecaster {
        height: 30px;
        position: relative;
        float: right;
      }
    }
    .warning-message-btns {
      width: 100%;
      position: relative;
      font-size: 0;
      text-align: center;
      white-space: nowrap;
      padding-bottom: 10px;
      .warning-message-change,
      .warning-message-relieve {
        width: 80px;
        height: 30px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        margin: 0 10px;
        border-radius: 2px;
        line-height: 30px;
        color: white;
        background-color: $themeColor;
        font-size: 14px;
        cursor: pointer;
      }
      .warning-message-relieve {
        background-color: grey;
      }
    }
  }

}
</style>
<style lang="scss">
  .el-carousel__button {
    background-color: #595757 !important;
  }
</style>
