<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="banks-page" v-show="isShowBank">
      <div class="controller">
        <div class="head">
          <div class="search">
            <i class="sp sp-search"></i>
            <input type="text" v-model="search" placeholder="搜索银行">
          </div>
          <div class="close" v-on:click.stop="handleClose">关闭</div>
        </div>
        <div class="body">
          <scroller>
            <ul class="list">
              <li v-for="(item, index) in currentData" :key="index" class="item" v-on:click="handleClick(item)">
                <!-- <div class="icon">
                  <img :src="item.thumb">
                </div> -->
                <div class="info add-bank">
                  <span class="name">{{ item.name }}</span>
                </div>
                <!-- <i v-if="item.id == select.id" class="sp sp-select"></i> -->
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