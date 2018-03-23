<template>
  <div id="app">
    <zearth />
    <main-menu-entry />
    <stationExtremumStat />
    <tools-entry />
    <color-bar :colorAddFlag="isColorAdd" :colorDeleteFlag="isColorDelete"
               :colorTypeData="colorTypeData" :deleteColorType="deleteColorType"></color-bar>
    <transition name="slide-fade">
      <fst-time-line></fst-time-line>
    </transition>
    <div id="system-title" class="ns">{{systemTitle}}</div>
    <components :is="userLoginView"></components>
    <components :is="userManagementView"></components>
    <transition name="timelineSlideUp">
      <components :is="typhTimeLineView"></components>
    </transition>
    <popup-entry />
    <warning-message :currentRegion="currentRegion"
                     :selectedModel="selectedModel"
                     :regionBounds="regionBounds"
                     :toggleModelMenu="toggleModelMenu"></warning-message>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { Message } from 'element-ui'

  import Zearth from './components/Zearth'
  import mainMenuEntry from './components/mainMenuEntry'
  import popupEntry from './components/popupEntry'
  import typhTimelineEntry from './components/model/typhTimeline/typhTimelineEntry'
  import fstTimeLine from './components/model/fstTimeLine'
  import userLogin from './components/userLogin'
  import toolsEntry from './components/toolsEntry'
  import colorBar from './components/colorBar'
  import stationExtremumStat from './components/popup/stationExtremumStat'

  import { typhEleData } from './config/grapesConfig'
  import userManagement from './components/userManagement'

  import warningMessage from './components/popup/warningMessage'

  export default {
    name: 'app',
    data() {
      return {
        typhTimeLineView: null,
        userLoginView: null,
        userManagementView: null,
        timelineTransform: '',
        timelineTransition: '',
        msgFlag: false
      }
    },
    mounted() {
      document.title = this.systemTitle;
    },
    components: {
      Zearth,
      mainMenuEntry,
      popupEntry,
      typhTimelineEntry,
      fstTimeLine,
      userLogin,
      toolsEntry,
      colorBar,
      warningMessage,
      stationExtremumStat
    },
    computed: {
      ...mapGetters([
        'systemTitle',
        'selectedModel',
        'typhTimeLineStatus_global',
        'grapesElementType_global',
        'loginPage',
        'userManagement',
        'infoTip_global',
        'colorTypeData',
        'isColorAdd',
        'isColorDelete',
        'deleteColorType',
        'currentRegion',
        'regionBounds'
      ])
    },
    methods: {
      ...mapActions([
        'toggleModelMenu'
      ])
    },
    watch: {
      'infoTip_global.flag': {
        handler(nv) {
          let ms = new Date().getTime();
          if(ms - this.msgFlag <= 2000 && Message.closeAll) {
            Message.closeAll();
          }

          let infoTip = this.infoTip_global;
          Message({
            message: infoTip.text,
            type: infoTip.type,
            duration: 2000
          });
          this.msgFlag = ms;
        }
      },
      userManagement(nv) {
        if(nv)
          this.userManagementView = userManagement
        else
          this.userManagementView = null
      },
      loginPage(nv) {
        if(nv)
          this.userLoginView = userLogin
        else
          this.userLoginView = false
      },
      selectedModel(nv, ov) {
        if(nv === 'tide') {
          this.typhTimeLineView = typhTimelineEntry
        } else {
          if(ov === 'tide') {
            let entry = document.querySelector('#typh-timeline-entry')
            entry.style.transition = 'transform .3s ease-in-out'
            if(this.typhTimeLineStatus_global === 'search')
              entry.style.transform = 'translateY(50px)'
            else
              entry.style.transform = 'translateY(173px)'
            setTimeout(() => {
              this.typhTimeLineView = null
            }, 400)
          }
        }
      },
    },
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Microsoft YaHei' !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  body,
  html {
    margin: 0;
    padding: 0;
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 62.5%;
    overflow: hidden;
  }

  .ns {
    -webkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .cf:after {
    content: " ";
    /* Older browser do not support empty content */
    visibility: hidden;
    display: block;
    height: 0;
    clear: both;
  }

  #system-title {
    width: 30rem;
    height: 3rem;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -15rem;
    font-size: 1.8rem;
    color: white;
    line-height: 2.8rem;
    text-align: center;
    text-shadow: 0px 1px 3px rgba(0, 0, 0, .9);
    cursor: default;
  }

  .timelineSlideUp-enter-active,
  .timelineSlideUp-leave-active {
    transition: transform .3s ease-in-out
  }

  .timelineSlideUp-enter,
  .timelineSlideUp-leave-active {
    transform: translateY(50px);
  }

  .error-box {
    border-color: #ffbebe !important;
    box-shadow: rgba(255, 202, 202, .7) 0px 0px 5px 1px;
  }

  .submit-btn-global {
    float: right;
    font-size: 12px;
    height: 30px;
    width: 80px;
    box-sizing: border-box;
    border: solid 1px #4cafff;
    line-height: 28px;
    color: #299dff;
    cursor: pointer;
    text-align: center;
    border-radius: 3px;
    &:hover {
      background-color: #299dff;
      color: white;
    }
    &:active {
      background-color: #268ee7;
    }
    &:nth-child(2),
    &:nth-child(3) {
      margin-right: 10px;
    }
  }
</style>
<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateX(525px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease-in
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
