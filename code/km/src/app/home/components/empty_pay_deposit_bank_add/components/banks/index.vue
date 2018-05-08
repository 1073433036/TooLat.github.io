<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="banks-page" v-show="isShow">
      <div class="controller">
        <div class="head">
          <div class="search">
            <i class="sp sp-search"></i>
            <input type="text" v-model="search" placeholder="搜索银行">
          </div>
          <div class="close" v-on:click="handleClose()">关闭</div>
        </div>
        <div class="body">
          <scroller
            :on-refresh="refresh"
            :on-infinite="infinite">
            <ul class="list">
              <li v-for="(item, index) in formTemp.bankData" :key="index" class="item" v-on:click="handleClick(item)">
                <div class="icon">
                  <img :src="item.thumb">
                </div>
                <div class="info add-bank">
                  <span class="name">{{ item.name }}</span>
                </div>
                <i v-if="item.id == select.id" class="sp sp-select"></i>
              </li>
            </ul>
            <div class="custom-input">
              <p class="tips">如果没有查找到相关银行，可选择下方按钮手动添加输入</p>
              <div class="custom-btn" v-on:click.stop="customInput">手动输入</div>
            </div>
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