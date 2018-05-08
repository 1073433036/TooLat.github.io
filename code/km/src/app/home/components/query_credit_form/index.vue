<template>
  <div class="query-credit-form-page">
    <app-header title="征信查询"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="banner">
            <img src="~assets/images/credit-report/query-credit-form-banner.png" alt="">
          </div>
          <div class="box">
            <div class="form-group">
              <div class="item">
                <i class="icon user-name"></i>
                <span class="name">姓名：</span>
                <div class="content">
                  <input type="text"
                    v-model="formData.name"
                    ref="name"
                    class="input-item"
                    placeholder="请输入姓名">
                </div>
              </div>
              <div class="item">
                <i class="icon user-phone"></i>
                <span class="name">手机号：</span>
                <div class="content">
                  <input type="text"
                    v-model="formData.mobile"
                    ref="mobile"
                    class="input-item"
                    placeholder="请输入手机号">
                </div>
              </div>
              <div class="item">
                <i class="icon user-id"></i>
                <span class="name">身份证号：</span>
                <div class="content">
                  <input type="text"
                    v-model="formData.id_number"
                    ref="id_number"
                    class="input-item"
                    placeholder="请输入身份证号">
                </div>
              </div>
              <div class="item">
                <i class="icon user-email"></i>
                <span class="name">邮箱号码：</span>
                <div class="content">
                  <input type="text"
                    v-model="formData.email"
                    ref="email"
                    class="input-item"
                    placeholder="请输入邮箱号码">
                </div>
              </div>
            </div>
            <!--<ul class="goods-list">-->
              <!--<li class="item">-->
                <!--<img class="image" src="~assets/images/credit-report/1.png">-->
                <!--<div class="content">-->
                  <!--<div class="text">查询大数据，网贷黑名单</div>-->
                  <!--<div class="pirce">-->
                    <!--<span class="new">¥11元</span>-->
                    <!--<span class="old">原价 ¥111</span>-->
                  <!--</div>-->
                  <!--<router-link to="/query_credit_report" class="look-report">查看报告示例</router-link>-->
                <!--</div>-->
                <!--<div class="btn"></div>-->
              <!--</li>-->
            <!--</ul>-->

            <ul class="goods-list">
              <li class="item" v-for="(item, index) in goodsList" :key="index" @click="selectGoods(item)">
                <img class="image" :src="item.goods_img" alt="">
                <div class="content">
                  <div class="text">{{ item.goods_info }}</div>
                  <div class="pirce">
                    <span class="new">¥{{ item.price }}元</span>
                    <span class="old">原价 ¥{{ item.market_price }}</span>
                  </div>
                  <router-link to="/query_credit_report"  class="look-report">查看报告示例</router-link>
                </div>
                <div class="btn" :class="{ 'on': item.goods_id == goodsId }"></div>
              </li>
            </ul>
          </div>
          <a href="http://u5150735.viewer.maka.im/k/ARPMAMEY" class="jump-h5"></a>
        </div>
      </div>
    </scroller>

    <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
      <div class="footer-fixed" v-show="isShowPrice">
        <div class="price">¥{{ goodsPrice }}元</div>
        <div class="content">
          <div class="agree">
            <Checkbox v-model="single">
              <span>我已认真阅读并同意</span>
            </Checkbox>
          </div>
          <div class="agree-title" @click="isSee = true">《用户购买协议》</div>
        </div>
        <a href="javascript:" class="query" @click="getMeMoney">打赏查询</a>
      </div>
    </transition>

    <Agreement v-model="isSee"></Agreement>

    <Payment v-model="isPayment" :price="goodsPrice" :goodsInfo="goodsInfo"></Payment>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
