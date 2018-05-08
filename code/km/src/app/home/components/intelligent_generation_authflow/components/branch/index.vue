<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="branch-page" v-show="isShow">
      <div class="controller">
        <div class="head">
          <div class="search">
            <i class="sp sp-search"></i>
            <input type="text" v-model="search" placeholder="搜索支行">
          </div>
          <div class="close" v-on:click="handleClose()">关闭</div>
        </div>
        <div class="body">
          <scroller
            :on-refresh="refresh"
            :on-infinite="infinite">
            <ul class="list" v-if="0 < formTemp.bankData.length">
              <li v-for="(item, index) in formTemp.bankData" :key="index" class="item" v-on:click="handleClick(item)">
                <div class="info">
                  <span class="name">{{ item.lName }}</span>
                </div>
                <i v-if="item.lName == select.lName" class="sp sp-select"></i>
              </li>
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