<template>
  <div class="payslot-page">
    <app-header title="选择支付通道" :other="true" v-on:other="handleother"></app-header>
    <scroller v-if="!hasIntegralChannel">
      <div class="wrapper">
        <div class="top">
          <div class="text">交易金额</div>
          <div class="money">{{ payInfo.money }}</div>
          <div class="text">交易类型：{{payType}}</div>
          <div v-if="limitTips" class="limit-tips">交易金额超过限定额度，请返回重新输入金额</div>
        </div>
        <div class="line-title">
          <div class="title">
						<p>选择通道</p>
						<p>同卡交易，即消费的信用卡应与绑定的结算卡户名一致。</p>
					</div>
          <p class="remain">如出现没到账请您及时联系公众号、QQ客服登记核查，感谢您的理解！</p>
        </div>
        <ul class="bill-list">
          <li class="item" v-if="isWeiXin">
            <router-link :to="{ name: 'home.MoneyCode' }">
              <div class="mode wechat">
                <span class="name">微信</span>
                <i class="icon icon-wechat_pay"></i>
              </div>
              <div class="content">
                <div class="option">
                  <div class="left">额度：<span>10.00-8000.00元/笔</span></div>
                  <div class="right">结算：<span>实时到账</span></div>
                </div>
                <div class="option">
                  <div class="left">时间：<span>XX:XX-XX:XX</span></div>
                  <div class="right">费率：<span class="bc">0.49%/笔</span></div>
                </div>
                <div class="option">
                  <div class="left rk">备注：<span>本通道进行支付没有积分</span></div>
                </div>
              </div>
            </router-link>
          </li>
          <li class="item" v-if="isZhiFuBao">
            <router-link :to="{ name: 'home.MoneyCode' }">
              <div class="mode alipay">
                <span class="name">支付宝</span>
                <i class="icon icon-wechat_pay"></i>
                <i class="icon icon-alipay"></i>
              </div>
              <div class="content">
                <div class="option">
                  <div class="left">额度：<span>10.00-8000.00元/笔</span></div>
                  <div class="right">结算：<span>实时到账</span></div>
                </div>
                <div class="option">
                  <div class="left">时间：<span>XX:XX-XX:XX</span></div>
                  <div class="right">费率：<span class="bc">0.49%/笔</span></div>
                </div>
                <div class="option">
                  <div class="left rk">备注：<span>本通道进行支付没有积分</span></div>
                </div>
              </div>
            </router-link>
          </li>
          <li class="item" v-if="isQuick">
            <div class="item-content" v-for="(item, index) in payRoadInfo" :key="index" v-on:click="goBankListPage(item)">
              <div class="mode unionpay">
                <i class="icon icon-wechat_pay"></i>
                <i class="icon icon-alipay"></i>
                <i class="sp sp-empty-unionpay"></i>
                <span class="name">{{ item.name }}</span>
                <span class="msg" v-if="!item.open && item.status === 3">
                  {{ (item.name && item.name.match(/[a-zA-Z]+/g)) ? item.name.match(/[a-zA-Z]+/g)[0] : '' }}通道暂停使用</span>
              </div>
              <div class="content">
                <div class="option">
                  <div class="left">额度：<span>{{item.quota_limit}}/笔</span></div>
                  <div class="right">结算：<span>{{item.deal_time}}</span></div>
                </div>
                <div class="option">
                  <div class="left">时间：<span>{{item.time_limit}}</span></div>
                  <div class="right">费率：<span class="bc">{{item.rate}}%+{{ item.fee || 2 }}/笔</span></div>
                </div>
                <div class="option">
                  <div class="left rk">备注：<span>{{item.remark == '有积分' ? '本通道进行支付有积分' : '本通道进行支付没有积分'}}</span></div>
                  <div class="right" v-on:click.stop="handleNotice(item)">
                    <span class="red">支持银行查看</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <transition enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutRight">
        <div v-show="isNotice" class="notice-mask">
          <div class="inner">
            <div class="content">
              <div class="notice-head">
                <div class="head-inner">
                  <span>温馨提示</span>
                  <i class="sp sp-notify-title"></i>
                </div>
                <i class="sp sp-close" v-on:click="isNotice = false"></i>
              </div>
              <div class="body">
                <div class="body-inner">
                  <div class="text">
                    <p>{{ noticeText }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <transition enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutRight">
        <div v-show="isNoticeBankShow" class="notice-mask" @click="isNoticeBankShow = false">
          <img class="bank" src="~assets/images/bank-limit-table.jpg" alt="支持银行">
        </div>
      </transition>

    </scroller>



    <iframe v-else-if="hasIntegralChannel" ref="iframe" class="iframe" :src="myUrl" frameborder="0"></iframe>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
