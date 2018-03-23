<template>
  <main id="ShipManage">
    <ul class="opts">
      <li></li>
      <li :class="['opt', 'return', {on: isReturnManagerOn}]">
        <div class="header" @click="isReturnManagerOn = !isReturnManagerOn">
          <span>回港管理</span>
          <div class="icon"></div>
        </div>
        <!-- <component :is="waterMonitorView"></component> -->
      </li>
    </ul>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import {  } from '../../../util/ClientHelper'

  @Component
  export default class ShipManage extends Vue {
    isAisManagerOn: boolean = true
    isReturnManagerOn: boolean = true
  }
</script>

<style lang='scss' scoped>
@import '../../../styles/theme.scss';
#ShipManage {
  z-index: 1;
  position: absolute;
  top: 116px; /*no*/
  right: 80px; /*no*/
  width: 376px;
  padding: 10px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 0 10px #8d9db5; /*no*/
  ul.opts {
    li.opt {
      position: relative;
      padding: 10px 0;
      &::after {
        position: absolute;
        top: 10px;
        left: 0;
        width: 2px;
        height: 20px;
        content: '';
      }
      &.ais::after { background: #33bf9f; }
      &.return::after { background: #3594d2; }
      &.on {
        background: #f5f5f5;
        &::after {
          top: 0;
          height: 100%;
        }
        .header {
          .icon {
            background: url(~Img/DecisionCommand/extend.png) no-repeat 33.3% 0 / 400% 100%;
            transform: rotate(-90deg);
          }
        }
      }
      .header {
        position: relative;
        width: 100%;
        height: 20px;
        cursor: pointer;
        span {
          position: absolute;
          top: 0;
          left: 20px;
          display: inline-block;
          line-height: 20px;
        }
        .switch {
          position: absolute;
          top: 0;
          left: 196px;
          .track {
            position: absolute;
            top: 2px;
            left: 0;
            width: 40px;
            height: 16px;
            background: #9b9b9b;
            border-radius: 8px;
            cursor: pointer;
            transition: all .15s linear;
          }
          .btn {
            position: absolute;
            top: -2px;
            left: 0;
            width: 24px;
            height: 24px;
            border-radius: 12px;
            background: #fff;
            box-shadow: 0 0 5px #8d9db5; 
            cursor: pointer;
            transition: all .15s linear;
          }
          &.on {
            .track {
              background: #8dd4f8;
            }
            .btn {
              left: 16px;
              box-shadow: none;
              background: $themeColor;
            }
          }
        }
        .icon {
          position: absolute;
          top: 4px;
          left: 212px;
          width: 8px;
          height: 12px;
          transform: rotate(90deg);
          background: url(~Img/DecisionCommand/extend.png) no-repeat 0 0 / 400% 100%;
        }
      }
      .wrapper {
        margin-top: 10px;
        padding: 0 20px;
      }
    }
  }
}
</style>