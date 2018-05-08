<template>
  <div class="houseloan-page">
    <app-header title="房贷"></app-header>
    <scroller>
      <div v-show="!toSubRouter" class="main">
        <navbar :navList="listData" @changeComponent="handleSelfEvent"></navbar>
        <div class="detail">
          <!-- <component :is="isComponent[componentIndex]"
            v-on:sendDownPaymentRatio="handleBotSelectChange"></component> -->

          <business-loan v-if="businessLoan" v-on:sendDownPaymentRatio="handleBotSelectChangeBusinessLoan"></business-loan>
          <business-loan v-if="accumulationLoan" v-on:sendDownPaymentRatio="handleBotSelectChangeAccumulationLoan"></business-loan>

          <combination-loan v-if="combinationLoan"></combination-loan>
        </div>
        <div class="calculate">
          <a class="calculate-btn" v-on:click="">开始计算</a>
        </div>
      </div>
      <keep-alive>
        <router-view v-if="toSubRouter" v-on:sendRateChoiceEvent="handleBotSelectChange"></router-view>
      </keep-alive>
    </scroller>
    <BotSelect v-on:onChildClick="botSelectClick"
      :title="botTitle"
      :show="isShow"
      :formData="formTemp[formIndex]"
      :formIndex="formIndex"></BotSelect>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>