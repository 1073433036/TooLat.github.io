<template>
  <section id="typhoon-warning" v-if="warningMsgs.length">
    <div class="warning-icon"></div>
    <div class="warning-msg" v-html="warningMsgs[0]"></div>
  </section>
</template>
<script lang="ts">
  import Vue from 'vue'
  import axios from 'axios'
  import { Component, Prop } from 'vue-property-decorator'
  import { Getter } from 'vuex-class'
  import TyphoonMonitor from '../../util/TyphoonMonitor'

  @Component
  export default class TyphoonWarning extends Vue {
    @Prop()
    showPanel: Function
    @Getter('systemStore/bounds_global') bounds_global

    warningMsgs: string[] = []

    mounted(): void {
      this.typhoonMonitor();
      setInterval(this.typhoonMonitor, 600000); //10分钟
    }

    async typhoonMonitor(): Promise<void> {
      console.log('typhoonwarning');
      let tyMonitor = new TyphoonMonitor();
      let data = await tyMonitor.typhoonMonitor(this.bounds_global);
      console.log(data);
      if(data.length) {
        this.warningMsgs = data.map(el => el.msg);
        this.showPanel(true);
      } else {
        this.warningMsgs = [];
        this.showPanel(false);
      }
    }
  }
</script>
<style lang="scss" scoped>
#typhoon-warning {
  width: 100%;
  height: 50px;
  position: relative;
  .warning-icon {
    width: 50px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: url(~Img/warningMsg/warning.png) center center no-repeat;
  }
  .warning-msg {
    width: calc(100% - 50px);
    position: relative;
    padding-left: 50px;
    line-height: 50px;
    font-size: 14px;
    color: red;
  }
}
</style>
