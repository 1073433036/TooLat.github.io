<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div v-show="show" class="mask-bank">
      <div class="inner">
        <div class="content">
          <div class="head">
            <span>银行选择</span>
            <i class="sp sp-close" v-on:click="handleClose()"></i>
          </div>
          <div class="main">
            <scroller :on-refresh="refresh" :on-infinite="infinite">
              <ul class="list">
                <li v-for="(item, index) in formTemp.data" :key="index" class="item" v-on:click="handleSelect(item)">
                  <div class="img">
                    <img :src="item.thumb">
                  </div>
                  <div class="name">
                    <span>{{ item.name }}</span>
                  </div>
                  <i v-if="current.id !== item.id" class="sp sp-select-no"></i>
                  <i v-if="current.id === item.id" class="sp sp-select-ok"></i>
                </li>
              </ul>
            </scroller>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>