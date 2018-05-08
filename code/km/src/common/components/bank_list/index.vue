<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="bank-list-page" v-show="change">
      <div class="controller">
        <div class="head">
          <div class="search">
            <i class="sp sp-search"></i>
            <input type="text" placeholder="搜索银行">
          </div>
          <div class="close" v-on:click="handleClose()">关闭</div>
        </div>
        <div class="body">
          <scroller>
            <ul class="list">
              <li v-for="(item, index) in formTemp.bankData" :key="index" class="item" v-on:click="handleClick(item)">
                <div class="icon">
                  <i class="bank-icon sp sp-bank-gs"></i>
                </div>
                <div class="info">
                  <h2 class="name">{{ item.bankName }}</h2>
                  <div class="username">
                    <span>{{ item.cardNum }}</span>
                  </div>
                </div>
                <i v-if="item.cardId == select.cardId" class="sp sp-select"></i>
              </li>
              <router-link :to="{ name: 'home.CardAdd', query: { dt: url } }" tag="li" class="item">
                <div class="icon">
                  <i class="bank-icon sp sp-add"></i>
                </div>
                <div class="info add-bank">
                  <h2 class="name">添加银行卡</h2>
                </div>
                <i class="sp sp-right"></i>
              </router-link>

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