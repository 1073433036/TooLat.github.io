<template>
  <div id="map-lnglat" :style="offset" v-text="lnglat"></div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop } from 'vue-property-decorator'

  interface Position {
    left?: number,
    right?: number,
    top?: number,
    bottom?: number
  }

  @Component
  export default class Lnglat extends Vue {
    @Prop()
    map: any
    @Prop({ default: { left: 10, bottom: 10 } })
    position: Position

    lnglat: string = '112.234, 21.332'
    offset: any = {}

    async mounted() {
      for(let i in this.position) {
        this.offset[i] = this.position[i] + 'px';
      }
      if(this.map) {
        this.map.on('mousemove', pos => {
          this.lnglat = pos.latlng.lng.toFixed(3) + ', ' + pos.latlng.lat.toFixed(3);
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  #map-lnglat {
    position: absolute;
    padding: 0 10px;
    line-height: 24px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 0 3px rgba(0, 0, 0, .35);
  }
</style>

