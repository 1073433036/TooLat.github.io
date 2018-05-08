<template>
  <div class="car-rules-order-pay-page">
    <app-header title="支付订单"></app-header>
    <scroller>
      <div class="wrapper">
        <h3 class="item-title">订单信息</h3>
        <ul class="order-info-list">
          <li>
            <span class="item-h fl">总扣分</span>
            <span class="item-c fr span-color1">{{ orderDegree }}分</span>
          </li>
          <li>
            <span class="item-h fl">应付费用</span>
            <span class="item-c fr span-color2">￥{{ orderPrice }}</span>
          </li>
        </ul>
        <h3 class="item-title">选择支付方式</h3>
        <ul class="pay-model-list">
          <li v-for="(item, index) in payList">
            <div class="left fl">
              <i class="icon" :class="{ 'icon-alipay': item.type == 'ali', 'icon-wechat_pay': item.type == 'wechat' }"></i>
              <span class="span-color1">{{ item.pay_name }}</span>
            </div>
            <div class="right fr">
              <div class="input-group">
                <label :for="('radio' + index)">
                  <input :id="('radio' + index)" type="radio" class="radio-input" v-model="payMode" :value="item.pay_id">
                  <span class="shape"></span>
                </label>
              </div>
            </div>
          </li>
        </ul>
        <div class="pay-btn" v-on:click.stop="confirmPay">确认支付</div>
        <div class="pay-statement">
          <div class="input-group">
            <label for="checkbox1">
              <input id="checkbox1" type="checkbox" v-model="isCheckedStatement" class="input-checkbox" value="agree">
              <span class="shape"></span>
            </label>
            <span class="span-color2" v-on:click.stop="isOpenProtocol = true">《支付协议免责声明》</span>
          </div>
        </div>
        <div class="user-tips">
          <div class="hint">【温馨提示】</div>
          <p>如您的订单金额超过10000元，请您用APP打开用支付宝支付，微信支付有限额10000元。</p>
        </div>
      </div>
    </scroller>
    <div class="tips">
      <p>由于各银行的单日，单笔交易会有最高限额。</p>
      <p>如订单超过支付限额，请分批提交缴费订单哦~</p>
    </div>

    <div class="transaction-tips" v-show="isShowTransactionTips">
      <div class="tips-content">
        <h2>【温馨提示】</h2>
        <div class="tips-items">
          <p>近期违章代缴高峰期，需要4-5天时间才能办理完成！</p>
        </div>
        <div class="btn-group">
          <div class="cancel-btn" v-on:click.stop="isShowTransactionTips = false">不同意</div>
          <div class="accept-btn" v-on:click.stop="handleAccept">同意</div>
        </div>
      </div>
    </div>

    <Protocol
      :isOpenProtocol="isOpenProtocol"
      v-on:callProtocolEvent="isOpenProtocol = false">
    </Protocol>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>