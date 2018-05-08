<template>
  <div class="loan-detail-page">
    <app-header title="贷款详情"></app-header>
    <scroller>
      <div class="banner">
        <img src="~assets/images/loan-detail-bg.png" alt="">
      </div>
      <div class="company">
        <div class="box">
          <div class="info">
            <div class="logo">
              <img :src="formTemp.thumb">
            </div>
            <div class="data">
              <div class="name">{{ formTemp.name }}</div>
              <div class="number">申请人数：<span>{{ formTemp.apply_num }}人</span></div>
              <div class="money">可贷额度：<span class="c">{{ formTemp.quota_limit }}元</span></div>
            </div>
          </div>
          <div class="time">
            <div class="box-f">借款期限：<span class="c">{{ formTemp.lend_time_limit }}</span></div>
            <div class="box-f">平均办理时间：<span class="c">{{ formTemp.deal_time_limit }}</span></div>
          </div>
          <div class="apply">
            <a href="javascript:void(0)" @click="linkToLoanApply">立即申请</a>
          </div>
        </div>
      </div>
      <div class="profile">
        <div class="title">
          <span>申请条件</span>
        </div>
        <div class="content">
          <div class="require">
            <div class="option">
              <div class="name">年龄要求：</div>
              <div class="box">{{ formTemp.age_limit }}</div>
            </div>
            <div class="option">
              <div class="name">资质要求：</div>
              <div class="box">
                <div v-for="(item, index) in formTemp.data_limit" :key="index" class="real">{{ item }}</div>
              </div>
            </div>
            <div class="option">
              <div class="name">身份要求：</div>
              <div class="box">
                <div v-for="(item, index) in formTemp.work_limit" :key="index" class="real">{{ item }}</div>
              </div>
            </div>
            <div class="option">
              <div class="name">所需材料：</div>
              <div class="box">
                <ul class="list">
                  <li v-for="(item, index) in formTemp.data_need" :key="index">
                    <i class="icon">{{ index + 1}}</i>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="profile">
        <div class="title">
          <span>费用说明</span>
        </div>
        <div class="content">
          <div class="terms">
            <div class="text">
              <div class="box-f">贷款金额：10000元</div>
              <div class="box-f">贷款期限：30天</div>
            </div>
            <div class="circle">
              <div class="box">
                <img src="~assets/images/loan-detail-circle.png" alt="">
                <div>{{ formTemp.daily_interest | interest }}元</div>
                <div>（总还款）</div>
              </div>
              <div class="interest">利率：{{ formTemp.daily_interest }}%/天</div>
            </div>
          </div>
        </div>
      </div>
      <div class="profile">
        <div class="title">
          <span>申请攻略</span>
        </div>
        <div class="content">
          <div class="article">
            <div class="big-title">如何快速申请？</div>
            <div class="field" :class="{'on':state.moreFlag}">
              <p>{{ formTemp.desc }}</p>
            </div>
            <a class="more" href="javascript:" v-show="!state.moreFlag" @click="state.moreFlag=true">
              <span>更多详情</span>
            </a>
          </div>
        </div>
      </div>
      <div class="apply-btn">
        <router-link class="step" :to="{ name: 'home.LoanDetailDesc', query: { loanId } }" v-if="44 != loanId">申请步骤</router-link>
        <router-link class="step" :to="{ name: 'home.LoanStepDesc' }" v-if="44 == loanId">申请步骤</router-link>
        <!-- <a href="javascript:" @click="handleShareClick" class="shareNow" v-show="44 == loanId">立即分享</a> -->
        <a href="javascript:" class="apply" @click="linkToLoanApply">立即申请</a>
      </div>


    </scroller>
    <div class="layer" v-show="isShare">
      <div class="mask" @click="isShare = false"></div>
      <div class="share-image" @click="isShare = false">
        <img src="~assets/images/creditcard-share-btn.png">
      </div>
    </div>

    <!-- <div class="guide" v-if="loanId == 27 || loanId == 43 || loanId == 45"> -->
      <!-- <router-link :to="{ name: 'home.LoanDetailDesc', query: { loanId } }">注意事项</router-link> -->
    <!-- </div> -->
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
