<template>
  <div class="pay-type-page">
    <div class="container">
      <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutLeft">
        <div v-show="show && confirm" class="layer pay-confirm">
          <div class="inner">
            <div class="head">
              <div class="close" v-on:click="handleClose()">
                <i class="sp sp-close"></i>
              </div>
              <span>{{ payTitle }}</span>
            </div>

            <div class="manager">
              <div v-if="isAgent" class="text">
                <p>俺 在卡盟便民服务平台升级{{ goods.goods_name }}，江湖救急，请帮我付个款吧，鄙人感激不尽！感情深不深就看这一回哦！</p>
              </div>
              <!-- <i class="sp sp-invite-01"></i>
              <span>上级推荐人</span>

              <div class="avatar">
                <img v-if="manager.avatar" :src="manager.avatar">
                <img v-else src="~assets/images/avatar.png">
              </div>

              <span class="name">{{ manager.real_name || manager.user_nickname || '无' }}</span> -->

              <section class="avatar-wrapper">
                <div class="manager-avatar">
                  <img v-if="manager.avatar" :src="manager.avatar">
                  <img v-else src="~assets/images/avatar.png">
                </div>

                <div class="manager-name">
                  <div class="top">上级推荐人</div>
                  <div class="bottom">{{ manager.real_name || manager.user_nickname }}</div>
                </div>

                <div class="green-tip" v-if="manager.real_name || manager.user_nickname">
                  Hi! 我是 {{ manager.real_name || manager.user_nickname }} 邀请您成为创业合伙人，卡盟大舞台，有梦你就来
                </div>
              </section>

<!--               <div class="level">
                <span>{{ manager.level_name }}</span>
                <i class="sp" :class="'sp-level-0' + manager.level_number"></i>
              </div> -->

            </div>

            <div class="main">
              <div class="money">￥{{ goods.money | money }}</div>
              <div v-if="2 == query.pay_type" class="user-tips">
                <span>{{ goods.content_title }}¥{{ goods.money }}元</span>
                <p>剩余￥{{ goods.money }}元未付</p>
              </div>
              <ul class="list">
                <li class="item">
                  <span>升级项目</span>
                  <div class="right">{{ goods.goods_name }}</div>
                </li>
                <li v-if="false === isAgent" class="item">
                  <span>付款类型</span>
                  <div class="right">
                    <Radio v-model="formData.payType" :dataList="formTemp.payType"></Radio>
                    <i v-show="false === isSigh" class="sp sp-bottom-01" v-on:click="isSigh = true"></i>
                  </div>
                </li>

                <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
                  <li v-show="1 !== formData.payType" class="item">
                    <span>付款方式</span>
                     <!-- v-on:click="handleChangePay()" -->
                    <div class="right">
<!--                       <span v-show="formData.pay_name">{{ formData.pay_name }}</span>
                      <span v-show="!formData.pay_name">
                        <i v-show="payNameSta" class="sp sp-select-err"></i>
                        请选择付款方式
                      </span>
                      <i class="sp sp-right"></i> -->
                      <div class="pay-group">
                        <div v-for="(item, index) in payTypeData" :key="index"
                          v-on:click="handleSelectType(item)" class="pay-item"
                          :class="{ active: formData.pay_id === item.pay_id}">
                          <i v-if="'ali' === item.type" class="sp sp-pay-alipay1"></i>
                          <i v-else-if="'wechat' === item.type" class="sp sp-pay-wechat"></i>
                          <i v-else class="sp sp-pay-card"></i>
                          <span>{{ item.pay_name }}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </transition>

                <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
                  <li v-show="2 === formData.payType && false === isAgent" class="item">
                    <span>自付金额</span>
                    <div class="right">
                      <div class="input-group">
                        <em>￥</em>
                        <input v-model="formData.money" ref="money" type="text" placeholder="请输入金额">
                      </div>
                    </div>
                  </li>
                </transition>
                <slot name="confirm"></slot>
              </ul>
            </div>

            <div class="foot">
              <div class="pay">
                <button v-on:click="handleSumbitPay()">{{ btnText }}</button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
        <div v-show="payType" class="layer pay-type">
          <div class="inner">
            <div class="head">
              <div class="close" v-on:click="payType = false; confirm = true">
                <i class="sp sp-close"></i>
              </div>
              <span>选择支付方式</span>
            </div>
            <div class="main">
              <scroller>
                <ul class="list">
                  <li v-for="(item, index) in payTypeData" v-on:click="handleSelectType(item)" class="item" :key="index">
                    <i v-if="'ali' === item.type" class="sp sp-pay-alipay1"></i>
                    <i v-else-if="'wechat' === item.type" class="sp sp-pay-wechat"></i>
                    <i v-else class="sp sp-pay-card"></i>
                    <span>{{ item.pay_name }}</span>
                    <i v-if="formData.pay_id === item.pay_id" class="sp sp-active"></i>
                  </li>
                </ul>
              </scroller>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div class="mask-layer" v-show="isShare">
      <div class="mask" @click="isShare = false"></div>
      <div class="share-image" @click="isShare = false">
        <img src="~assets/images/pay-share.png">
      </div>
    </div>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
