<template>
  <div class="home-page">
    <!-- <app-start v-if="!isWechatClient"></app-start> -->
    <app-start></app-start>
    <scroller ref="myscroller" v-show="!isStart">
      <div class="wrapper">
        <div class="controller">
          <div class="banner">
            <router-link :to="{ name: 'user.Profile' }" class="avatar" tag="div">
              <img v-if="userInfo.avatar_full" :src="userInfo.avatar_full">
              <img v-else src="~assets/images/default-avatar.png">
              <div class="username">
                <span>{{ userInfo.user_nickname || '路人甲' }}</span>
              </div>
            </router-link>
            <!-- <router-link :to="{ name: 'home.Novice' }" class="company-name" tag="div">
              <i v-if="1 < userInfo.level" class="hp hp-level" :class="'hp-level-0' + userInfo.level"></i>
              <span v-else class="practice hp-level" :class="{ on: 1 >= userInfo.level }">
                <i class="hp hp-level-01"></i>
                <em>(实习)</em>
              </span>
              <span class="name">卡盟V金服</span>
            </router-link> -->
            <div class="company-name" @click="linkToNovice">
              <i v-if="1 < userInfo.level" class="hp hp-level" :class="'hp-level-0' + userInfo.level"></i>
              <span v-else class="practice hp-level" :class="{ on: 1 >= userInfo.level }">
                <i class="hp hp-level-01"></i>
                <em>(实习)</em>
              </span>
              <span class="name">卡盟V金服</span>
            </div>

            <div class="sign">
              <i class="hp-sign"></i>
              <span @click="signIn()">签到</span>
            </div>

            <div class="tit" ref="homeSwiper">
							<ul class="list swiper-wrapper">
								<li class="item swiper-slide">
									<!-- <router-link :to="{ name: 'insurance.AutoBanner' }"> -->
                  <a>
										<img src="~assets/images/home-01.png" alt="">
                  </a>
									<!-- </router-link> -->
								</li>
								<li class="item swiper-slide">
									<!-- <router-link :to="{ name: 'insurance.AutoBanner' }"> -->
                  <a>
										<img src="~assets/images/home-02.png" alt="">
                  </a>
									<!-- </router-link> -->
								</li>
								<li class="item swiper-slide">
									<!-- <router-link :to="{ name: 'insurance.AutoBanner' }"> -->
                  <a>
										<img src="~assets/images/home-04.png" alt="">
                  </a>
									<!-- </router-link> -->
								</li>
							</ul>
							<div class="swiper-pagination"></div>
						</div>
          </div>

          <div class="tips">
						<i class="icon icon-horn"></i>
						<div class="notice">
            	<div class="marquee">卡盟金服信贷流量服务平台：在“卡盟V金服”免费 申请汽车保险、违章查询、信用卡申请、办理贷款、客户抢单、信贷经理圈发布信息，谨防金融诈骗，举报电话：400-018-8616</div>
          	</div>
					</div>

          <div class="menu-group">
            <router-link :to="{ name: 'home.Loan' }" class="item">
              <i class="hp-menu hp-menu-01"></i>
              <em>我要贷款</em>
            </router-link>
            <router-link :to="{ name: 'home.PeerAdd' }" class="item">
              <i class="hp-menu hp-menu-07"></i>
              <em>信贷经理</em>
            </router-link>
            <div class="item" v-on:click.stop="skipPayPage">
              <i class="hp-menu hp-menu-02"></i>
              <em>无卡支付</em>
            </div>
            <!-- <router-link :to="{ name: 'home.Zx' }" class="item"> -->
            <router-link :to="{ name: 'home.QueryCreditForm' }" class="item">
              <i class="hp-menu hp-menu-04"></i>
              <em>征信查询</em>
            </router-link>
            <router-link :to="{ name: 'tool.Home' }" class="item">
              <i class="hp-menu hp-menu-05"></i>
              <em>展业工具</em>
              <!-- <div class="info-tips">
                <span>10</span>
              </div> -->
            </router-link>
            <!-- <router-link :to="{ name: 'user.BuyVip' }" class="item">
              <i class="hp-menu hp-menu-06"></i>
              <em>升级代理</em>
            </router-link> -->
            <a class="item" v-on:click="linkToBuyVip">
              <i class="hp-menu hp-menu-06"></i>
              <em>升级代理</em>
            </a>
            <router-link :to="{ name: 'home.CarBreak' }" class="item">
              <i class="hp-menu hp-menu-11"></i>
              <em>违章查询</em>
            </router-link>
            <!-- <router-link :to="{ name: 'tool.AdvertiseHome', query: {typeid: 28}}" class="item"> -->
            <a class="item" v-on:click="linkToAdvertise">
              <i class="hp-menu hp-menu-08"></i>
              <em>消息提醒</em>
              <div class="info-tips">
                <span>1</span>
              </div>
            </a>
            <!-- </router-link> -->
          </div>
          <div class="nav-group">

            <router-link :to="{ name: 'home.CreditCard' }" class="item">
              <div class="icon">
                <i class="hp-nav-05"></i>
              </div>
              <div class="info">
								<div class="className">
									<i class="hp-hot"></i>
								</div>
                <h3 class="tit">办信用卡</h3>
                <p>快速下卡，额度高</p>
              </div>
            </router-link>

            <router-link :to="{ name: 'home.simulationBank' }" class="item">
              <div class="icon">
                <i class="hp-nav-02"></i>
              </div>
              <div class="info">
                <h3 class="tit">额度评估</h3>
                <p>模拟测试，精准推荐</p>
              </div>
            </router-link>

            <router-link :to="{ name: 'home.studentCreditCard' }" class="item">
              <div class="icon">
                <i class="hp-nav-01"></i>
              </div>
              <div class="info">
                <h3 class="tit">大学生信用卡</h3>
                <p>(全国95%下卡率)</p>
                <div class="info-tips" v-show="message.index_card">
                  <span>{{ message.index_card }}</span>
                </div>
              </div>
            </router-link>

            <router-link :to="{ name: 'home.Increase' }" class="item">
              <div class="icon">
                <i class="hp-nav-08"></i>
              </div>
              <div class="info">
                <h3 class="tit">提额秘籍</h3>
                <p>教你几招快速提额秘籍</p>
                <div class="info-tips" v-if="unreadArticleNum > 0">
                  <span>{{ unreadArticleNum }}</span>
                </div>
              </div>
            </router-link>

            <!-- <router-link v-for="(item, index) in formTemp.catList"
              :key="index"
              :to="{ name: 'home.ArticleList', params: { id: item.id }, query: { name: item.name} }"
              class="item">
              <div class="icon">
                <i class="sp" :class="{'sp-nav-02': item.name === '办卡攻略', 'sp-nav-04': item.name === '提额秘籍'}"></i>
              </div>
              <div class="info">
                <h3 class="tit">{{ item.name }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </router-link> -->

          </div>

          <div class="order-group">
            <div class="left">
              <!--<a href="https://m.kamengjinfu.com/noopsychecultivatecard">-->
              <a href="javascript:;" @click="remaindPay">
                <i class="hp-menu hp-menu-09">
                  <i class="hp-new"></i>
                </i>
              </a>
							<!-- <router-link :to="{name:'home.NoopsycheCultivateCard'}">
                <i class="hp-menu hp-menu-09">
                  <i class="hp-new"></i>
                </i>
              </router-link> -->
              <!-- <a href="javascript:void(0)" @click="stopUse">
                <i class="hp-menu hp-menu-09">
                  <i class="hp-new"></i>
                </i>
              </a> -->
						</div>
            <div class="right">
              <a href="javascript:" @click="isVip">
                <i class="hp-menu hp-menu-10"></i>
                <div class="info-tips" v-show="message.index_loancard">
                  <span>{{ message.index_loancard }}</span>
                </div>
              </a>
						</div>

          </div>
        </div>
			 <app-footing></app-footing>
      </div>
    </scroller>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div v-show="isWechat" class="mask-inner">
        <div class="mask">
          <div class="content">
            <div class="head">
              <span>关注公众号免费送豪礼</span>
              <i v-on:click="isWechat = false" class="hp-close"></i>
            </div>
            <div class="body">
              <div v-if="0 < peerInfo.id" class="avatar">
                <img v-if="peerInfo.avatar" :src="peerInfo.avatar">
                <img v-else src="~assets/images/avatar.png">
                <div class="name">{{ peerInfo.user_nickname || peerInfo.name }}</div>
                <p>邀请您加入卡盟金服</p>
              </div>
              <div class="qr-code">
                <img src="~assets/images/wechat-code.jpg">
              </div>
            </div>
            <div class="foot">
              <h3>长按二维码关注公众号</h3>
              <p>为了更好的服务，请关注平台公众号</p>
              <p class="min-font">请先完善基本资料及手机号码，以便下次可以同账户.快捷登录APP</p>
              <!-- <h2>关注公众号赠送</h2>
              <h2>价值68元大礼包</h2> -->
            </div>
          </div>
        </div>
      </div>
    </transition>

		<!-- <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
      <div v-show="isMaskVip" class="mask-vip">
        <div class="layer">
          <div class="inner">
            <div class="close" v-on:click="isMaskVip = false">
              <i class="icon icon-close"></i>
            </div>
            <div class="images">
              <img src="~assets/images/mask-vip-02.png">
            </div>
						<div class="identity">
							<h3 class="h3">领取大礼包</h3>
							<div class="info">感谢您的关注，您已经获得<strong class="time">价值68元</strong>大礼包，请您填写资料，领取礼包</div>
						</div>
            <div class="btn">
              <button type="button" @click="autonym">立即领取</button>
            </div>
          </div>
        </div>
      </div>
    </transition> -->

    <transition enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutRight">
      <div v-show="isNotice" class="notice-mask">
        <div class="inner">
          <div class="content">
            <div class="head">
              <div class="head-inner">
                <span>温馨提示</span>
                <i class="sp sp-notify-title"></i>
              </div>
              <i class="sp sp-close" v-on:click="isNotice = false"></i>
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
          </div>
        </div>
      </div>
    </transition>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div v-show="isQrCodeShow" class="mask-inner">
        <div class="mask">
          <div class="content">
            <div class="head">
              <span>关注公众号</span>
              <i v-on:click="isQrCodeShow = false" class="hp-close"></i>
            </div>
            <div class="body">
              <div class="qr-code">
                <img :src="qrCodeUrl">
              </div>
            </div>
            <div class="foot">
              <h3>长按关注 备用官方公众号 请惠存</h3>
              <p>仅作发布公告，不作任何用途</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <app-footer></app-footer>
    <GuidePage v-on:onGuideClick="onGuideClick" :stepShow="isGuide"></GuidePage>
    <notify-popup :content="notifyMsg" :isNotice="isNoticeShow" @toggleNotify="toggleNotifyFn"></notify-popup>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
