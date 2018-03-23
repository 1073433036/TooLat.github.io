<template>
  <main id="SwanMessageTip">
    <ul>
      <li v-for="(el, key) in swanMessageTip_global" :key="key" :class="{'no-data': !el.hasData}">
        {{ el.time }} {{ key }} {{ el.hasData ? '' : 'NO DATA' }}
      </li>
    </ul>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class SwanMessageTip extends Vue {
    @Getter('systemStore/swanMessageTip_global') swanMessageTip_global

  }
</script>

<style lang='scss' scoped>
#SwanMessageTip {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  ul {
    li {
      padding: 0 20px;
      color: #eee;
      line-height: 24px;
      background: rgba(0, 0, 0, .4);
      &.no-data {
        color: #f00;
      }
      &:first-child { border-radius: 3px 3PX 0 0; }
      &:LAST-child { border-radius: 0 0 3px 3PX; }
    }
  }
}
</style>