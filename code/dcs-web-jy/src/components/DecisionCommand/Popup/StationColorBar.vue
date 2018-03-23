<template>
  <main id="StationColorBar" :class="key"></main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class StationColorBar extends Vue {
    @Getter('decisionStore/stationColorBar_global') key
  }
</script>

<style lang='scss' scoped>
#StationColorBar {
  position: absolute;
  bottom: 20px;
  left: 100px;
  background-size: 100% 100%;
  background-position: 0 0;
  background-repeat: no-repeat;
  &.temp, &.tempdaymax, &.tempdaymin {
    width: 334px;
    height: 50px;
    background-image: url(~Img/DecisionCommand/ColorBar/temp.png);
  }
  &.rh {
    width: 270px;
    height: 50px;
    background-image: url(~Img/DecisionCommand/ColorBar/rh.png);
  }
  &.wd3smaxdf {
    width: 325px;
    height: 50px;
    background-image: url(~Img/DecisionCommand/ColorBar/wd3smaxdf.png);
  }
  &.rfhour {
    width: 210px;
    height: 50px;
    background-image: url(~Img/DecisionCommand/ColorBar/rfhour.png);
  }
  &.rfday {
    width: 270px;
    height: 50px;
    background-image: url(~Img/DecisionCommand/ColorBar/rfday.png);
  }
}
</style>