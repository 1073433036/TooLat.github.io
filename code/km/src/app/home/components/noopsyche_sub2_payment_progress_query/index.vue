<template>
  <div class="payment_progress_query_page">
    <app-header title="还款进度查询" :other="true" v-on:other="goHomePage"></app-header>
      <scroller>
        <div class="wrapper">
          <div class="container">
            <ul class="bank-list">
              <transition-group enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
                <li class="item" v-for="(item, index) in bankList" :key="index" v-on:click="bundleSendItem(item)">
                  <div class="btn" :style="{backgroundColor: item.color}">
                    <div class="logo">
                      <img :src="item.thumb" alt="">
                    </div>
                    <div class="bank-name">{{ item.bank_name }}</div>
                    <div class="number">{{ handleCardNo(item.card_no) }}</div>
                    <div class="payment-amount">还款总金额￥{{item.total}}</div>
                    <div v-if="1 !== item.status" class="del" v-on:click.stop="handleDelete(item)">
                      <span>终止计划</span>
                    </div>
                    <div class="date">
                      <span>开始时间：{{item.start_time}}</span>
                      <span class="cutline">结束时间：{{item.end_time}}</span>
                    </div>
                    <div :class="(item.status === 1 ? 'state' : 'state underway-state')">{{item.status ===1 ? '完成': '进行中'}}</div>
                  </div>
                </li>
              </transition-group>
            </ul>
          </div>
        </div>
      </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>