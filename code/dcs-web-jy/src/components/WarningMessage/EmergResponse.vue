<template>
  <section id="emerg-response">
    <h1 class="section-title">最新应急响应</h1>
    <a class="more-info">更多</a>
    <div class="emerg-response-wrapper" v-loading="isLoading">
      <div class="emerg-response-list">
        <ul>
          <li v-for="(item, index) in emergResList" :key="index" 
              :style="{'width': (100 / emergResList.length) + '%'}">
              <a :style="{'backgroundColor': colors[item.level]}">{{item.level || '—'}}</a>
              <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <!-- <div class="emerg-response-nodata ns" v-else key="emerg-res">当前无应急响应</div> -->
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'

  interface Emerg {
    name: string
    level: number
  }

  @Component
  export default class EmergResponse extends Vue {
    tHeaders: string[] = ['启动时间', '启动原因', '应急响应']
    colors: string[] = ['grey', 'red', 'orange', 'yellow', 'blue']
    emergResList: Emerg[] = [
      { name: '台风', level: 0 },
      { name: '暴雨', level: 0 },
      { name: '高温', level: 0 },
      { name: '寒冷', level: 2 },
      { name: '大雾', level: 0 },
      { name: '灰霾', level: 3 },
      { name: '大风', level: 0 },
      { name: '结冰', level: 2 },
      { name: '干旱', level: 1 },
    ]
    isLoading: boolean = false

    mounted(): void {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/theme.scss';
  $contHeight: 150px;

  #emerg-response {
    width: 100%;
    height: $contHeight;
    position: relative;
    .emerg-response-wrapper {
      width: 100%;
      height: calc(100% - 80px);
      position: relative;
      background-color: white;
      padding-top: 10px;
      .emerg-response-list {
        width: calc(100% - 40px);
        height: 100%;
        position: relative;
        padding: 0 20px;
        >ul {
          width: 100%;
          height: 100%;
          position: relative;
          font-size: 0;
          >li {
            height: 100%;
            position: relative;
            display: inline-block;
            vertical-align: top;
            text-align: center;
            >a {
              width: 30px;
              height: 30px;
              position: relative;
              display: inline-block;
              margin-bottom: 10px;
              line-height: 30px;
              border-radius: 100%;
              color: white;
              font-size: 14px;
            }
            >span {
              width: 100%;
              position: relative;
              display: block;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
</style>
