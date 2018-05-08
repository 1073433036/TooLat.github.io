<template>
  <div class="set_payment_plan_page">
    <app-header title="设置精养卡计划" :other="isOther" v-on:other="goHomePage"></app-header>
      <scroller>
        <div class="wrapper">
          <div class="container">
            <ul class="bank-list">
              <transition-group enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
                <li class="item" v-for="(item, index) in bankList" :key="index" v-on:click="sendCardMsgToSub(item)">
                    <div class="btn-block" v-bind:style="{ background: item.background ? 'url('+ item.background +')' : item.color, backgroundSize: '100%' }">
                      <div class="logo">
                        <img :src="item.thumb" alt="">
                      </div>
                      <div class="bank-name">
                        <h4>{{ item.bank_name }}</h4>
                        <i class="sp sp-payment"></i>
                        <!-- <h5>快捷<span :style="{color: item.color}">支付</span></h5> -->
                      </div>
                      <div class="type">
                        <h4>信用卡</h4>
                        <h5>{{handleName(item.name)}}</h5>
                      </div>
                      <div class="number">{{ handleCardNo(item.card_no) }}</div>
                      <div class="date">
                        <span>还款日：{{item.repay_date}}</span>
                        <span>账单日：{{item.bill_date}}</span>
                      </div>
                      <div class="manage" v-on:click.stop="manage(item, index)">
                        <i class="sp sp-bank-delete"></i>
                        <span>删除</span>
                      </div>
                    </div>
                </li>
              </transition-group>
            </ul>
            <div class="add-bank">
              <router-link class="btn" :to="{ name: 'home.SetPaymentPlanAddCard'}">
                <i class="icon icon-add"></i>
                <span>添加信用卡</span>
                <i class="icon icon-direction2"></i>
              </router-link>
            </div>
            <div class="prenent-theft">
              <router-link class="btn" :to="{ name: 'user.UseDetail', query: { id: 2, name: '精养卡操作步骤' } }">精养卡步骤</router-link>
              <router-link class="btn" :to="{ name: 'home.PrenentTheft'}">防盗刷保险</router-link>
            </div>

            <div class="tips">
              <span>平台高级会员免费赠送账户盗刷险</span>
            </div>
            <div class="user-notice">注：为了更好维护您信用卡的评分，精养代还消费成功后将在1-2小时内还款。请您耐心等待！</div>
            <div class="user-tips">
              <div class="hint">【温馨提示】</div>
              <p>如您需要使用精养代还功能，请您先拨打信用卡客服中心电话，开通卡片银联无卡自助交易功能，否则可能出现无法正常使用精养代还功能哦！</p>
            </div>
            <div class="user-tips">
              <div class="hint">【目前支持精养代还的银行】</div>
              <p>工商银行、农业银行、中国银行、邮储银行、光大银行、中信银行、华夏银行、浦发银行、民生银行、广发银行、兴业银行、上海银行、北京银行、平安银行</p>
            </div>
          </div>
        </div>
      </scroller>

      <app-manage v-model="state.manage" @unbund="unbund"></app-manage>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>