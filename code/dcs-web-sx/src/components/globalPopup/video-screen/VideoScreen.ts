import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './VideoScreen.html?style=./VideoScreen.scss'

@WithRender
@Component
export default class VideoScreen extends Vue {
  @Getter('systemStore/screenVideoUrl_global') screenVideoUrl_global
  @Action('systemStore/toggleScreenVideo_global') toggleScreenVideo_global

  isScreen: boolean = false

  mounted() {
    document.documentElement.webkitRequestFullScreen()
    document.addEventListener("webkitfullscreenchange", this.screenChange, false);
  }

  screenChange() {
    this.isScreen = !this.isScreen
    if (!this.isScreen)
      this.toggleScreenVideo_global(false)
  }

  beforeDestroy() {
    document.webkitCancelFullScreen()
    document.removeEventListener('webkitfullscreenchange', this.screenChange)
  }
}