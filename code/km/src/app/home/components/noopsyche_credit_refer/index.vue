<template>
  <div class="noopsyche-credit-refer-page">
    <app-header title="信息查询" :other="isOther" v-on:other="goHomePage"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="refer">
					<ul class="item">

						<li class="list" @click="isVipCard">
							<div class="top">
								<div class="title">
                  <div class="name">
                    <span>团队信用卡订单查询</span>
                    <div class="info-tips" v-show="message.index_loancard_card">
                      <span>{{ message.index_loancard_card }}</span>
                    </div>
                  </div>
                </div>
								<div class="state">实时查询最新办卡情况</div>
							</div>
							<div class="photo">
                <img src="~assets/images/refer-01.jpg" alt="">
							</div>
              <!-- <div class="remind">如您满足条件未收到佣金的请联系公众号、QQ客服进行登记配合相关部门核查数据！</div> -->
						</li>

						<li class="list" @click="isVipLoan">
              <div class="top">
                <div class="title">
                  <div class="name">
                    <span>团队贷款订单查询</span>
                    <div class="info-tips" v-show="message.index_loancard_loan">
                      <span>{{ message.index_loancard_loan }}</span>
                    </div>
                  </div>
                </div>
                <div class="state">及时查询贷款订单信息</div>
              </div>
              <div class="photo">
                <img src="~assets/images/refer-02.jpg" alt="">
              </div>
            </li>

            <li class="list"  @click="isCheckData">
							<div class="top">
								<div class="title">
                  <div class="name">
                    <span>核卡查询</span>
                    <div class="info-tips" v-show="message.index_loancard_loan">
                      <span>{{ message.index_loancard_loan }}</span>
                    </div>
                  </div>
                </div>
								<div class="state">上传资料及时查询下卡佣金</div>
							</div>
							<div class="photo">
                <img src="~assets/images/refer-03.jpg" alt="">
							</div>
						</li>

					</ul>
				</div>
      </div>
    </scroller>
    <Socket ref="socket"></Socket>

    <transition enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutRight">
      <div v-show="show" class="notice-mask">
        <div class="inner">
          <div class="content">
            <div class="head">
              <div class="head-inner">
                <span>温馨提示</span>
                <i class="sp sp-notify-title"></i>
              </div>
              <i class="sp sp-close" v-on:click="show = false"></i>
            </div>
            <div class="body">
              <div class="body-inner">
                <div class="text">
                  <p>
                  平台年前对接的银行信用卡通道的核账问题，请广大在2月25日之前在平台申请过信用卡的会员在办卡“进度查询”中查询进度，平台将在7-12个工作日内结清信用卡佣金。现阶段所有银行信用卡都是秒批通道不用查询进度，在近期将实现全部银行不用查询进度。感谢您的配合！
                  </p>
                </div>
              </div>
            </div>
            <div class="foot">
              <div class="btn">
                <router-link :to="{ name: 'home.CreditCardProgress' }" class="link">进度查询</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <service-cuetomer-popup />
  </div>
</template>

<script>
  import Index from "./index.js";
  export default Index;
</script>
