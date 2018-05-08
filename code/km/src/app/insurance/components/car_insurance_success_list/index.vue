<template>
  <div class="car-insurance-success-list-page">
    <app-header title="鄣B700888M5">
      <div slot="right" class="filter slot" v-on:click.stop="controlFilterPage">
        <i class="sp sp-choose-img"></i>
        <span>筛选</span>
      </div>
    </app-header>
    <scroller>
      <div class="wrapper">
        <div class="insurance-company-info">
          <div class="company-item" v-for="item in companyList">
            <div class="logo">
              <img src="~assets/images/increase-03.png" alt="">
            </div>
            <div class="insurance-info">
              <h3>{{item.name}}(广州市)</h3>
              <div class="limit">
                <h4>报价成功</h4>
                <p>￥{{item.money}}</p>
              </div>
              <div class="btn-group">
                <router-link :to="{ name: 'insurance.PerfectInsureMessage' }" class="modify-btn" tag="span">马上投保</router-link>
                <router-link :to="{ name: 'insurance.CarInsuranceDetail' }" class="detail-btn" tag="span">查看详情</router-link>
              </div>
            </div>
            <div class="tips">
              <i class="sp sp-money-01"></i>
              <span>佣金说明</span>
              <i class="sp sp-point-bottom"></i>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <transition name="slide">
      <div class="filter-detail" v-show="isShowFilterPage"  v-on:click.stop="isShowFilterPage = false">
        <div class="content-container">
          <ul class="filter-list">
            <li :class="{checked: checkedNum == 1}" v-on:click.stop="hanldFilter(1)">按报价<span>（从低到高）</span></li>
            <li :class="{checked: checkedNum == 2}" v-on:click.stop="hanldFilter(2)">按报价<span>（从高到低）</span></li>
            <li :class="{checked: checkedNum == 3}" v-on:click.stop="hanldFilter(3)">按综合推荐</li>
            <li :class="{checked: checkedNum == 4}" v-on:click.stop="hanldFilter(4)">不限</li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>