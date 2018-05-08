<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="code-list-page" v-show="isShow">
      <div class="location-layer">
          <div class="inner">
            <app-header title="选择查询代码" :isBack="false">
              <div class="slot" slot="right" v-on:click="closeCodeList">
                <span>关闭</span>
              </div>
            </app-header>
            <scroller ref="myCodeListScroller">
              <ul class="list">
                <li v-for="(item, index) in codeList" class="item"
                  :key="index"
                  v-on:click="chooseCodeItem(item)">{{ item.id }}</li>
              </ul>
            </scroller>
          </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>