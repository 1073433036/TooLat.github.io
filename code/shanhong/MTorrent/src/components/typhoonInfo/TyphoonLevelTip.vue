<template>
  <main id="TyphoonLevelTip">
    <transition name="fade">
      <ul v-if="isDetailShow">
        <li v-for="el of levelTip" :key="el.name"><em :style="{background: el.color}"></em>{{ el.name }}</li>
      </ul>
    </transition>
    <div :class="['tip', {'on': isDetailShow}]" @click="isDetailShow = !isDetailShow">图例</div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class TyphoonLevelTip extends Vue {
    isDetailShow: boolean = false
    levelTip: any[] = [
      { name: '热带气压', color: '#aaea90' },
      { name: '热带风暴', color: '#85b5e3' },
      { name: '强热带风暴', color: '#e9eb4c' },
      { name: '台风', color: '#fbc31a' },
      { name: '强台风', color: '#ed3f3f' },
      { name: '超强台风', color: '#814d0f' }
    ]
  }
</script>

<style lang='scss' scoped>
#TyphoonLevelTip{
  position: absolute;
  bottom: 39px;
  left: 10px;
  line-height: 22px;
  .tip {
    width: 100px;
    text-align: center;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.35);
    cursor: pointer;
    &.on { color: #f3ac12; }
  }
  ul {
    margin-bottom: 3px;
    padding: 5px 0;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.35);
    li {
      position: relative;
      text-indent: 27px;
      em {
        position: absolute;
        top: 7px;
        left: 10px;
        width: 8px;
        height: 8px;
        border-radius: 3px;
      }
    }
  }
  .fade-enter-active, .fade-leave-active { transition: all .3s ease; }
  .fade-enter, .fade-leave-to {
    transform: translateY(5px);
    opacity: 0;
  }
}
</style>