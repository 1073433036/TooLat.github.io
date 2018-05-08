<template>
  <div class="bank-page">
    <app-header title="银行卡管理"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="tips">
          <i class="icon icon-horn"></i>
          <span>注：目前只支持12家银行信用卡，详细请浏览下面表格</span>
        </div>
        <div class="container">
          <ul class="bank-list">
            <transition-group enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
              <li class="item" v-for="(item, index) in bankList" :key="index" v-on:click.stop="goEmptyPayPage(item)">
                <div class="btn" :style="{backgroundColor: item.color}">
                  <div class="logo">
                    <img :src="item.thumb" alt="">
                  </div>
                  <div class="bank-name">{{ item.bank_name }}</div>
                  <div class="type">{{ item.type }}</div>
                  <div class="number">{{ handleCardNo(item.card_no) }}</div>
                  <div class="manage" @click.stop="manage(item, index)">删除</div>
                </div>
              </li>
            </transition-group>
          </ul>
          <div class="add-bank">
            <router-link class="btn" :to="{ name: 'home.EmptyPayBankAdd' }">
              <i class="icon icon-add"></i>
              <span>添加信用卡</span>
              <i class="icon icon-direction2"></i>
            </router-link>
          </div>
        </div>
        <div class="add-card-tips">
          <img src="~assets/images/empty-pay-bank-tips.jpg" alt="">
        </div>
      </div>
    </scroller>

    <app-manage v-model="state.manage" @unbund="unbund"></app-manage>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>