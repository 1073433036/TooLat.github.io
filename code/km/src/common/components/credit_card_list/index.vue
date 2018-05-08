<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="creditcard-list-page" v-show="change">
      <div class="controller">
        <div class="head">
          <div class="search">
            <i class="sp sp-search"></i>
            <input type="text" placeholder="搜索信用卡">
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
                    <span>{{ item.username }}</span>
                    |
                    <span>尾号{{ item.cardNum | sliceCard }}</span>
                  </div>
                </div>
                <i v-if="item.cardId == select.cardId" class="sp sp-select"></i>
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