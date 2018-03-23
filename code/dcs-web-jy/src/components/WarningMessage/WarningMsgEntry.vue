<template>
  <div id="warning-msg-wrapper">
    <CommonHeader :headerTitle="pageTitle" />
    <div class="warning-msg-content">
      <div class="warning-msg-module left-warning-msg">
        <WarningMessage :showPublishPopup="togglePublishPopup" :showWarningChange="showWarningChange"/>
        <WarningSigns :city="regionGlobal.cityName" />
      </div>
      <div class="warning-msg-module middle-warning-msg">
        <DisasterJudge />
      </div>
      <div class="warning-msg-module right-warning-msg">
        <DutyInfo />
        <EmergResponse />
        <DisasterInfo :showDisasterInfo="toggleDisasterPopup"/>
      </div>
      <div class="warning-msg-module"><DefenseAreas :regionData="regionGlobal"/></div>
    </div>
    <!-- <div class="operate-wrapper">
      <a class="operate-btn" id="back-top" @click.stop="backToTop"><span>回到<br/>顶部</span></a>
      <a class="operate-btn" id="msg-setting"><span>短信<br/>设置</span></a>
      <router-link :to="{ name: 'MainViewer' }" class="operate-btn" id="back-home"><span>返回<br/>首页</span></router-link>
    </div> -->
    <WarningPublish v-if="isPublish" :closePublishPopup="togglePublishPopup"/>
    <WarningChange v-if="isWarningChange" :warningData="warningData" :closePopup="closeWarningChangePopup"/>
    <transition name="fade">
      <components :is="disasterInfoPopup" :disaster="disasterInfo" :closePopup="toggleDisasterPopup"></components>
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import axios from 'axios'
  import { Component } from 'vue-property-decorator'
  import { Getter } from 'vuex-class'
  import Region from '../../interface/Region'
  import Disaster from '../../interface/Disaster'
  import { EmergEvent } from '../../interface/EmergEvent'
  import CommonHeader from '../CommonComponents/CommonHeader.vue'
  import WarningSigns from './WarningSigns.vue'
  import DisasterInfo from './DisasterInfo.vue'
  import DefenseAreas from './DefenseAreas.vue'
  import DisasterWarning from './DisasterWarning.vue'
  import EmergResponse from './EmergResponse.vue'
  import WarningMessage from './WarningMessage.vue'
  import DutyInfo from './DutyInfo.vue'
  import TyphoonWarning from './TyphoonWarning.vue'
  import DisasterJudge from './DisasterJudge.vue'
  import WarningPublish from './Popup/WarningPublish.vue'
  import DisasterAuditing from './Popup/DisasterAuditing.vue'
  import EmergEventPopup from './Popup/EmergEvent.vue'
  import WarningChange from './Popup/WarningChange.vue'
  import { WarningTemplate, WarningForm, WarningDetail, DefenseGuide, Signal } from '../../interface/WarningPublish'

  @Component({
    components: {
      CommonHeader,
      WarningSigns,
      DisasterInfo,
      DefenseAreas,
      DisasterWarning,
      EmergResponse,
      WarningMessage,
      DutyInfo,
      TyphoonWarning,
      DisasterJudge,
      WarningPublish,
      WarningChange
    }
  })
  export default class WarningMsgEntry extends Vue {
    @Getter('systemStore/region_global') regionGlobal
    @Getter('systemStore/regionName_global') regionNameGlobal

    hasTyphoon: boolean = false
    isPublish: boolean = false
    isWarningChange:boolean=false
    disasterInfo: Disaster | EmergEvent | {} = {}
    disasterInfoPopup: any = false
    warningData:WarningForm|null=null

    get pageTitle(): string {
      return `${this.regionNameGlobal}综合预警信息系统`;
    }

    mounted(): void {

    }

    scrollUp(ev): void {
      let element: any = document.getElementById("back-top");
      element['style']['display'] = ev.target.scrollTop > 200 ? "block" : "none";
    }

    backToTop(): void {
      let ele: any = document.querySelector('.warning-msg-content');
      let timer: any = setInterval((): void => {
        if(ele.scrollTop <= 10) {
          ele['scrollTop'] = 0;
          clearInterval(timer);
        }
        else
          ele['scrollTop'] -= 10;
      }, 1);
    }

    showTyphoonWarning(bool: boolean): void {
      this.hasTyphoon = bool;
    }

    showWarningChange(item:WarningForm){
      this.warningData=item
      this.isWarningChange=true
    }
    togglePublishPopup(bool: boolean): void {
      this.isPublish = bool;
    }
    closeWarningChangePopup(bool:boolean){
      this.isWarningChange=bool
    }

    toggleDisasterPopup(bool: boolean, disaster?: Disaster | EmergEvent): void {
      // this.isShowDisasterInfo = bool;
      if(disaster) {
        this.disasterInfo = disaster;
        this.disasterInfoPopup = disaster.hasOwnProperty('liandongid') ? EmergEventPopup : DisasterAuditing;
      } else {
        this.disasterInfoPopup = false;
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/theme.scss';

  #warning-msg-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #eff4f8;
    z-index: 1;
    .warning-msg-content {
      width: calc(100% - 120px);
      height: calc(100% - 110px);
      position: relative;
      padding: 60px 60px 50px 60px;
      font-size: 0;
      overflow-y: auto;
      @include scrollStyle;

      .warning-msg-module {
        width: 100%;
        position: relative;
        display: inline-block;
        vertical-align: top;
        margin-top: 20px;
        >section {
          margin-bottom: 10px;
          background-color: white;
          box-shadow: #595757 0px 0px 15px -6px;
        }
        .has-typhoon {
          height: 660px !important;
        }
      }

      .left-warning-msg {
        width: calc(25% - 10px);
        margin-right: 10px;
      }

      .middle-warning-msg {
        width: calc(50% - 10px);
        margin-right: 10px;
      }

      .right-warning-msg {
        width: 25%;
      }
    }

    .operate-wrapper {
      width: 50px;
      position: fixed;
      bottom: 10px;
      right: 20px;
      font-size: 0;
      a.operate-btn {
        width: 100%;
        height: 50px;
        position: relative;
        display: block;
        background-color: white;
        margin-bottom: 10px;
        text-decoration: none;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          box-shadow: 0px 0px 10px -3px #595757;
          >span {
            display: block;
          }
        }

        >span {
          width: calc(100% - 10px);
          height: calc(100% - 10px);
          position: relative;
          display: none;
          background-color: darkgrey;
          font-size: 12px;
          padding: 5px;
          text-align: center;
          line-height: 22px;
          color: white;
          letter-spacing: 2px;
        }
      }
      a#back-top {
        display: none;
        background-image: url(~Img/warningMsg/back_top.png);
        background-repeat: no-repeat;
        background-position: center center;
      }
      a#msg-setting {
        background-image: url(~Img/warningMsg/setting.png);
        background-repeat: no-repeat;
        background-position: center center;
      }
      a#back-home {
        background-image: url(~Img/back_home.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-color: $themeColor;
      }
    }
  }
</style>

<style lang="scss">
  @import '../../styles/theme.scss';

  .section-title {
    width: 100%;
    height: 50px;
    position: relative;
    display: block;
    color: rgb(103, 120, 136);
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
    text-indent: 20px;
    &:before {
      content: '';
      width: 20px;
      height: 3px;
      position: absolute;
      top: 36px;
      left: 20px;
      background-color: $themeColor;
    }
  }

  .more-info {
    height: 50px;
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    padding-right: 10px;
    font-size: 14px;
    color: $themeColor;
    line-height: 50px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>


