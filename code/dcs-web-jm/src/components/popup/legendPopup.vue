<template>
    <div id="legend-popup" v-drag="{handle: '.legend-popup-title'}">
        <div class="legend-popup-title">
            图例
            <span @click="toggleLegendPopup(false)">✕</span>
        </div>
        <div class="legend-image"></div>
    </div>
</template>
<script>
    export default {
        props: {
            toggleLegendPopup: Function
        }
    }
</script>
<style lang="scss" scoped>
  #legend-popup {
    width: 520px;
    height: 404px;
    position: absolute;
    right: 10px;
    bottom: 10px;
    background-color: white;
    box-shadow: 0px 0px 10px -2px #000;
    .legend-popup-title {
      width: 100%;
      height: 28px;
      position: relative;
      background-color: #263b5c;
      color: white;
      font-size: 1.2rem;
      line-height: 28px;
      text-indent: 1rem;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      cursor: move;
      span {
        width: 28px;
        height: 100%;
        position: absolute;
        display: inline-block;
        right: 0;
        font-size: 10px;
        text-align: center;
        text-indent: 0;
        line-height: 28px;
        cursor: pointer;
        &:hover {
          background: #1c3252;
          border-top-right-radius: 2px;
        }
      }
    }
    .legend-image {
      width: 100%;
      height: 376px;
      position: relative;
      background: url(../../assets/legend.jpg) no-repeat;
    }
  }
</style>
