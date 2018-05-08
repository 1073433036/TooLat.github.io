<template>
  <div class="prize_get">
    <app-header title="我要置顶">
    </app-header>
      <scroller>
        <div class="wrapper">
          <div class="controller">
            <div class="main">
							<div class="tips">
								<i class="icon sp sp-horn"></i>
                <div class="notice">
  								<div class="marquee">卡盟金服信贷流量服务平台：信息置顶，排名到第一页，获得更多曝光</div>
                </div>
							</div>
							<div class="content">
								<div class="body-info">
									<h4 class="duration">置顶时长</h4>
									<div class="amount">
										<ul class="item">
											<li class="list" v-for="(item, index) in goodsList" @click="selectGoods(item)" :key="index" :class="{ 'select': item.__ob__.dep.id == formData.goodsId }">
												<p class="one">{{ item.day }}天</p>
												<p class="money">{{ item.money }}元</p>
											</li>
										</ul>
									</div>
									<p class="pay">总需支付：{{ formData.goodsPrice }}元  </p>
								</div>
								<div class="pattern">
									<ul class="item">
										<li class="list" v-for="(item, index) in formTemp.payList" @click="selectPay(item.pay_id)" :key="index" :class="{ 'active': item.pay_id == formData.payId }">
											<span class="way sp" :class="{ 'sp-pay-wechat': item.type == 'wechat', 'sp-pay-alipay': item.type == 'ali' }"></span>
											{{ item.pay_name }}
										</li>
									</ul>
								</div>
								<div class="pact">
                  <Checkbox v-model="formData.checkFlag">
                    <span class="agree">点击即同意</span>
                  </Checkbox>
									<span class="rules" @click.stop="formData.isOpenProtocol = true">《卡盟V金服支付协议》</span>
								</div>
								<div class="btn" @click="submit">
                                    <a href="javascript:">马上置顶</a>
								</div>

							</div>
							<div class="info">
								<div class="title">置顶说明：</div>
								<div class="text">卡盟V金服的置顶服务将按置顶时间的先后顺序排序，即前面用户的置顶服务结束，后面的按时间的先后顺序自动上浮排名。</div>
							</div>
            </div>
          </div>
        </div>
      </scroller>
			<Protocol
        :isOpenProtocol="formData.isOpenProtocol"
        v-on:callProtocolEvent="formData.isOpenProtocol = false">
      </Protocol>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
