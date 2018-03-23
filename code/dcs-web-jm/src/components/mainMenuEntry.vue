<template>
  <section id="main-menu-container">
    <main class="menu-wraper">
      <ul class="panel-option-wraper">
        <li class="login-option" title="用户登录"
            @click="userLogin">
          <ul v-if="displayUserManagement"
              class="user-management" style="z-index: 20">
            <li>{{loginUser.account}}</li>
            <li></li>
            <li @click="gotoUserManagement">管理</li>
            <li></li>
            <li @click="userLogout">退出</li>
          </ul>
        </li>
        <li class="login-option-division"></li>
        <li v-for="(opt, key) in menu"
            :class="[opt.class, {'selected-option': selectedOption === key }]"
            :title="opt.title"
            @click="selectOption(opt, key)">
        </li>
        <li class="login-option-division"></li>
        <!--<li :class="['warning-option', {'selected-option': selectedOption === 'warning'}]"
            title="应急响应"
            @click="selectOption({ title: '应急响应' }, 'warning')">
          <div class="warning-twinkle"
               v-if="hasWarning">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </li>-->
        <li :class="['flow-option', {'selected-option': selectedOption === 'flow'}]" title="站点实况分析"
            @click="selectOption({ title: '站点实况分析' }, 'flow')">
        </li>
        <li class="selected-option-indicator"
            v-if="selectedOption"
            :class="indicateClass">
        </li>
        <li class="station-warning-option" title="预警站点" @click="toggleStationWarning">
          <div class="warning-twinkle"
               v-if="stationWarningSum > 0">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </li>
        <li class="legend-option" title="图例" @click="toggleLegendPopup_global(true)"></li>
      </ul>
      <div class="panel-wrapper"
           v-show="selectedOption !== null">
        <div class="panel-title">
          <h4>{{panelTitle}}</h4>
          <span @click="closePanel">
            <svg class="close-panel" width="10px" height="10px">
              <path d="M 0,0 L 8,8 M 8,0 L 0, 8" ></path>
            </svg>
          </span>
        </div>
        <date-time-picker v-show="dateTimeShow" :datetimeChange="updateDate"></date-time-picker>
        <model-panel v-show="selectedOption === 'model'"></model-panel>
        <real-time v-show="selectedOption === 'detection'"></real-time>
        <geography v-show="selectedOption === 'basicInfo'"></geography>
        <!--<disaster-warning v-show="selectedOption === 'warning'"></disaster-warning>-->
        <flow-convection v-if="selectedOption === 'flow'"></flow-convection>
      </div>
    </main>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import modelPanel from './menu/modelPanel'
import realTime from './menu/realTime'
import geography from './menu/geography'
//import disasterWarning from './menu/disasterWarning'
import flowConvection from './menu/flowConvection'
import dateTimePicker from './dateTimePicker'

export default {
  data() {
    return {
      menu: {
        model: { title: '模型分析', class: 'model-option' },
        detection: { title: '实况监测', class: 'detection-option' },
        basicInfo: { title: '基础信息', class: 'basic-info-option' },
      },
      panelView: null,
      panelTitle: '模型分析',
      selectedOption: 'model',
      displayUserManagement: false,
      indicateClass: 'indicate-model',

    }
  },
  components: {
    modelPanel,
    realTime,
    geography,
    dateTimePicker,
    //disasterWarning,
    flowConvection
  },
  computed: {
    ...mapGetters([
      'loginUser',
      'hasWarning',
      'stationWarningSum'
    ]),
    dateTimeShow() {
      return this.selectedOption !== 'warning' && this.selectedOption !== 'basicInfo';
    }
  },
  methods: {
    ...mapActions([
      'gotoUserManagement',
      'gotoLoginPage',
      'storeLoginUser',
      'updateDate',
      'toggleStationWarning',
      'toggleLegendPopup_global'
    ]),
    userLogout() {
      this.displayUserManagement = false
      this.storeLoginUser(null)
    },
    userLogin() {
      if (this.loginUser === null)
        this.gotoLoginPage(true)
      else
        this.displayUserManagement = !this.displayUserManagement
    },
    selectOption(el, target) {
      if (this.selectedOption !== target) {
        this.panelTitle = el.title;
        this.selectedOption = target;
        this.indicateClass= `indicate-${target}`;
      }
      else {
        this.selectedOption = null;
        this.indicateClass = '';
      }
    },
    closePanel() {
      this.selectedOption = null;
    }
  }
}
</script>

<style lang="scss">
.menu-wraper {
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 100%;
  background-color: rgba(70, 70, 70, .5);
  font-size: 12px;
}

.typh-panel-wraper {
  width: 100%;
  position: absolute;
  height: 80px;
  bottom: 0;
  box-sizing: border-box;
  margin-left: 40px;
  background-color: rgba(70, 70, 70, .5);
  padding-right: 40px;
}

.panel-option-wraper {
  width: 100%;
  position: relative;
  height: 100%;
  >li {
    width: 100%;
    height: 40px;
    cursor: pointer;
    background-position: center center;
    background-repeat: no-repeat;
    &:hover {
      background-color: rgba(0, 0, 0, .15)
    }
  }
  li.login-option {
    background-image: url('../assets/mainMenu/login.png');
  }
  li.monitor-option {
    background-image: url('../assets/mainMenu/model.png');
  }
  li.model-option {
    background-image: url('../assets/mainMenu/model.png');
  }
  li.detection-option {
    background-image: url('../assets/mainMenu/detection.png');
  }
  li.basic-info-option {
    background-image: url('../assets/mainMenu/basicInfo.png');
  }
  li.warning-option {
    background-image: url('../assets/mainMenu/warning.png');
  }
  li.flow-option {
    background-image: url('../assets/mainMenu/ringwarn.png');
  }
  li.station-warning-option {
    background-image: url('../assets/mainMenu/station_warning.png');
    position: absolute;
    bottom: 0;
  }
  li.legend-option {
    background-image: url('../assets/mainMenu/legend.png');
    position: absolute;
    bottom: 40px;
  }
  li.login-option-division {
    width: 30px;
    height: 0;
    margin: 0px 5px 19px 5px;
    border-top: solid 1px #8d97a2;
    transform: translateY(-1px);
    &:nth-of-type(6) {
      margin-bottom: 9px!important;
    }
  }
  li.selected-option-indicator {
    height: 38px;
    width: 2px;
    position: absolute;
    background-color: #299dff;
    transition: top .2s ease-out;
  }
}

.selected-option {
  background-color: rgba(0, 0, 0, .15)
}

.indicate-model {
  top: 61px;
}

.indicate-detection {
  top: 101px;
}

.indicate-basicInfo {
  top: 141px;
}

.indicate-warning {
  top: 191px;
}

.indicate-flow {
  top: 191px;
}

.indicate-monitor {
  top: 281px;
}

.panel-wrapper {
  position: absolute;
  top: 60px;
  width: 280px;
  left: 50px;
  border-radius: 6px 6px 4px 4px;
  background-color: white;
  color: #545454;
  box-shadow: 2px 2px 10px -4px #000;
  .panel-title {
    width: 100%;
    height: 30px;
    box-sizing: border-box;
    padding: 0 10px;
    background-color: #263b5c;
    position: relative;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    h4 {
      line-height: 30px;
      margin: 0;
      color: white;
      font-size: 14px;
      display: inline-block;
      font-weight: normal;
    }
    span {
      position: absolute;
      right: 0px;
      top: 0px;
      width: 30px;
      height: 30px;
      cursor: pointer;
      border-top-right-radius: 4px;
      &:hover {
        background-color: #1c3252;
      }
      svg.close-panel {
        position: absolute;
        top: 12px;
        left: 12px;
        path {
          fill: none;
          stroke: white;
          stroke-width: 1px;
          cursor: pointer;
        }
      }
    }
  }
}

.user-management {
  position: absolute;
  color: white;
  background-color: rgba(70, 70, 70, .5);
  width: 101px;
  box-sizing: border-box;
  top: 0;
  left: 40px;
  >li {
    color: white;
    height: 40px;
    line-height: 40px;
    text-align: left;
    padding: 0 10px;
    box-sizing: border-box;
    &:hover {
      background-color: rgba(0, 0, 0, .15);
    }
    &:nth-child(even) {
      height: 0px;
      margin: 0 10px;
      border-top: solid 1px rgba(255, 255, 255, .15);
    }
  }
}
</style>
<style lang="scss" scoped>
@-webkit-keyframes warning-twinkle-multiple {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes warning-twinkle-multiple {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}

.warning-twinkle {
  position: relative;
}

.warning-twinkle:after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background: #ff2323;
  top: 11px;
  right: 9px;
  z-index: 10;
}

.warning-twinkle>div:nth-child(2) {
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}

.warning-twinkle>div:nth-child(3) {
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}

.warning-twinkle>div {
  background-color: red;
  border-radius: 100%;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  position: absolute;
  top: 6px;
  right: 4px;
  opacity: 0;
  margin: 0;
  width: 18px;
  height: 18px;
  -webkit-animation: warning-twinkle-multiple 0.8s 0s linear infinite;
  animation: warning-twinkle-multiple 0.8s 0s linear infinite;
}
</style>
