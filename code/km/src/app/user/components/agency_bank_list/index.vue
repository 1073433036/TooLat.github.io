<template>
  <div class="agency_bank_list-page" v-if="isShowPage">
    <app-header title="银行卡管理"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <ul class="bank-list">
            <transition-group enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
              <li class="item" v-for="(item, index) in bankList" :key="index" v-on:click.stop="saveCardInfo(item)">
                <div class="btn" :style="{backgroundColor: item.color}">
                  <div class="logo">
                    <img :src="item.thumb" alt="">
                  </div>
                  <div class="bank-name">{{ item.bank_name }}</div>
                  <div class="type">{{ handleName(item.real_name) }}</div>
                  <div class="number">{{ handleCardNo(item.bank_card) }}</div>
                  <div class="manage" @click.stop="manage(item)">删除</div>
                </div>
              </li>
            </transition-group>
          </ul>
          <div class="add-bank">
            <router-link class="btn" :to="{ name: 'user.BankAdd' }">
              <i class="icon icon-add"></i>
              <span>添加银行卡</span>
              <i class="icon icon-direction2"></i>
            </router-link>
          </div>
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