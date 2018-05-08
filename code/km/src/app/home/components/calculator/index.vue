<template>
  <div class="calculator-page">
    <app-header title="计算工具"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="top">
          <router-link :to="{ name: 'home.Houseloan' }" class="item">
            <div class="house"><i class="sp sp-house_loan-01"></i></div>
            <em>房贷</em>
          </router-link>
          <router-link :to="{ name: 'home.Carloan' }" class="item">
            <div class="house"><i class="sp sp-car_loan-01"></i></div>
            <em>车贷</em>
          </router-link>
          <router-link :to="{ name: 'home.Equalfund', params: {id: 'home'}}" class="item">
            <div class="house"><i class="sp sp-equality_gold-01"></i></div>
            <em>等额本金</em>
          </router-link>
          <router-link :to="{ name: 'home.Equalinterest' }" class="item">
            <div class="house"><i class="sp sp-equality_interest-01"></i></div>
            <em>等额本息</em>
          </router-link>
        </div>
        <div class="menu-group">
          <router-link :to="{ name: 'home.SecondhandHouseLoan' }" class="item">
            <i class="sp sp-second_hand_house_loan"></i>
            <em>二手房贷款</em>
            <i class="sp sp-right"></i>
          </router-link>
          <div class="item" v-on:click.stop="lockItem">
            <i class="sp sp-car_appraisement"></i>
            <em>车价估值</em>
            <i class="sp sp-right"></i>
          </div>
          <router-link :to="{ name: 'home.AccumulationLoan' }" class="item">
            <i class="sp sp-accumulation_loan"></i>
            <em>公积金贷款</em>
            <i class="sp sp-right"></i>
          </router-link>
          <router-link :to="{ name: 'home.IncomeTax', params:{id: 'home'} }" class="item">
            <i class="sp sp-income_tax"></i>
            <em>个人所得税</em>
            <i class="sp sp-right"></i>
          </router-link>
          <router-link :to="{ name: 'home.HousePropertyTax' }" class="item">
            <i class="sp sp-building_taxes"></i>
            <em>房产税</em>
            <i class="sp sp-right"></i>
          </router-link>
          <router-link :to="{ name: 'home.BusinessLoan' }" class="item">
            <i class="sp sp-business_loan"></i>
            <em>商业贷款</em>
            <i class="sp sp-right"></i>
          </router-link>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>