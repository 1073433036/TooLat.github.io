<template>
  <div class="bank-page">
    <app-header title="银行卡管理"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <ul class="bank-list">
            <transition-group enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
              <li class="item" v-for="(item, index) in bankList" :key="index" v-on:click.stop="saveCardId(item.id)">
                <div class="btn" v-bind:style="{ background: item.background ? 'url('+ item.background +')' : item.color, backgroundSize: '100%' }">
                  <div class="logo">
                    <img :src="item.thumb" alt="">
                  </div>
                  <div class="bank-name">{{ item.bank_name }}（储蓄卡）</div>
                  <!-- <div class="type">{{ handleName(item.real_name) }}</div> -->
                  <div class="number">{{ item.account_no }}</div>
                  <!-- <div class="manage" @click.stop="manage(item)">删除</div> -->
                </div>
              </li>
            </transition-group>
          </ul>
          <div class="add-bank">
            <router-link class="btn" :to="{ name: 'home.AuthFlow' }">
              <i class="icon icon-add"></i>
              <span>添加银行卡</span>
              <i class="icon icon-direction2"></i>
            </router-link>
          </div>
        </div>
      </div>
    </scroller>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>