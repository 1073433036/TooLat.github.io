<template>
  <div class="creditcard-page">
    <app-header title="信用卡中心"></app-header>
    <scroller
      :on-refresh="refresh"
      ref="my_scroller">
      <div class="wrapper">
        <div class="fixed-header">
          <div class="tips">
            <i class="icon icon-horn"></i>
  					<div class="notice">
            	<div class="marquee">卡盟金服信贷流量服务平台：卡盟金服平台负责互联网拓客推广申请服务，信用卡申请不需要任何费用，在卡盟平台办理的所有银行信用卡无需查进度，由合作银行信用卡中心结算佣金，平台佣金奖励结算方式下卡后10个工作日左右！谨防电话诈骗。客服电话400-018-8616（近期主推交通信用卡、平安信用卡，没有到达银行考核标准后，佣金奖励可以更高）</div>
          	</div>
          </div>
          <div class="hot">
            <span>签约合作银行信用卡申请通道</span>
            <div class="right">
              <router-link :to="{ name: 'home.NewbieGuide' }">
                <i class="sp sp-query"></i>
                <span>新手指南</span>
              </router-link>
            </div>
          </div>
        </div>
        <ul class="card-list">
          <!-- <router-link :to="{ name: 'home.CreditCardList', params: { id: item.id } }"> -->
          <li class="item" v-for="(item, index) in formTemp.bankData" :key="index">
            <div class="box" v-on:click="isVip(item.id)">
              <div class="logo">
                <img :src="item.thumb">
              </div>
              <div v-if="item.tag" class="tag">{{ item.tag }}</div>
              <div class="content">
                <div class="company">
                  <div class="name">{{ item.name }}</div>
                  <!-- @param         userInfo.level === 1 普通会员
                       @shit          据记录此处修改3次 -->
                  <!-- <div class="money" v-on:click.stop="handleBonus(item)" v-if="!isWechatClient"> -->
                  <div class="money" v-on:click.stop="handleBonus(item)">
                    <i class="sp sp-money-02"></i>
                    <span>奖金：<em>{{ item.bonus }}</em></span>
                    <i class="icon sp sp-right-02"></i>
                  </div>
                	<div class="index">申请人数：<span>{{ item.apply_num | filterNumber }}</span></div>
                </div>
  							<div class="chance">
  								<div class="rate">
  									<div>
  										<span class="name">批卡率：</span>
  										<div class="bar">
  											<span class="progress">
  												<span :style="{ width: item.apply_rate + '%' }"></span>
  											</span>
  										</div>
  									</div>
  								</div>
  								<div class="rate">
                    <div>
                      <span class="name">{{ item.work_day }}</span>
 <!--                      <div class="stars">
                        <span>★★★★★</span>
                      </div> -->
                    </div>
<!--   									<div v-else>
  										<span class="name">批核速度：</span>
  										<div class="bar">
  											<span class="progress">
  												<span :style="{ width: item.apply_speed + '%' }"></span>
  											</span>
  										</div>
  									</div>
                    <div v-if="item.work_day" class="day">
                      <span>{{ item.work_day }}</span>
                    </div> -->
  								</div>
  							</div>
              </div>
            </div>
          </li>
        </ul>
        <ul class="nva-list">
          <li class="item">
            <router-link :to="{ name: 'home.CreditCardLarge' }">
              <div class="box">
                <div class="left">
                  <div class="name">大额信用卡办理</div>
                  <div class="text">畅享壕生活</div>
                </div>
                <i class="right sp sp-card-nav1"></i>
              </div>
            </router-link>
          </li>
          <li class="item">
            <router-link :to="{ name: 'home.NewbieGuide' }">
              <div class="box">
                <div class="left">
										<div class="className">
											<i class="sp sp-hot"></i>
										</div>

                  <div class="name">新手指南</div>
                  <div class="text">快速掌握办卡秘籍</div>
                </div>
                <i class="right sp sp-card-nav2"></i>
              </div>
            </router-link>
          </li>

          <li class="item" v-for="(item, index) in formTemp.catList" :key="index" v-show="11 == item.id">
            <router-link :to="{ name: 'home.ArticleList', params: { id: item.id }, query: { name: item.name} }">
              <div class="box">
                <div class="left">
                  <div class="name" v-show="11 == item.id">办卡攻略</div>
                  <div class="text">{{ item.description }}</div>
                </div>
                <i class="right sp" :class="{ 'sp-card-nav3': 11 == item.id }"></i>
              </div>
            </router-link>
          </li>

          <li class="item">
            <router-link :to="{ name: 'home.CreditCardProgress' }">
              <div class="box">
                <div class="left">
                  <div class="name">进度查询</div>
                  <div class="text">快速查询办卡详情</div>
                </div>
                <i class="right sp sp-nav-01"></i>
              </div>
            </router-link>
          </li>

        </ul>
        <div class="ranking">
          <div class="big-title">年度热申信用卡排行榜</div>
          <ul class="ranking-list">
            <li class="item" v-for="(item, index) in formTemp.hotBankData" :key="index">
              <router-link :to="{ name: 'home.CreditCardDetail', params:{ bid: item.bank_id, id: item.id } }">
                <div class="box">
                  <div class="image">
                    <img :src="item.thumb">
                  </div>
                  <div class="content">
                    <div class="number"><span>{{ item.apply_num }}</span>人申请</div>
                    <div class="name">{{ item.name }}</div>
                    <div class="text">{{ item.title }}</div>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
			<app-footing></app-footing>
    </scroller>

    <div class="guide" :class="{ on: isWeChatShare }">
      <a @click="handleShareClick()">邀请办卡</a>
    </div>

    <div class="share-layer" v-show="isShare">
      <div class="mask" @click="isShare = false"></div>
      <div class="share-image" @click="isShare = false">
        <img src="~assets/images/creditcard-share-btn.png">
      </div>
    </div>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div v-show="isBonus" class="mask-bonus">
        <div class="inner">
          <div class="colse" v-on:click="isBonus = false"></div>
          <div class="content">
            <div class="colse-body" v-on:click="isBonus = false"></div>
            <div class="backdrop">
              <div class="bank_logo">
                <img :src="currentBank.thumb">
              </div>
              <h4>{{bank_name}}信用卡总奖金{{brokerage}}元</h4>
            </div>
            <div class="head">
              <!-- <div v-if="'广发银行' === currentBank.name" class="level-gorup">
                <div class="item" :class="{ 'active': userInfo.level == item.level }" v-for="(item, index) in currentBank.user_bonus">
                  <i v-show="userInfo.level == item.level" class="sp sp-pointer-01"></i>
                  <div class="name">{{ item.level | levelText }}</div>
                  <div class="value">首刷 ￥{{ item.bonus }}</div>
                  <div class="value">激活 ￥{{ item.use_bonus }}</div>
                </div>
              </div> -->

              <div class="level-gorup">
                <div class="item" :class="{ 'active': userInfo.level == item.level }" v-for="(item, index) in currentBank.user_bonus">
                  <i v-show="userInfo.level == item.level" class="sp sp-pointer-01"></i>
                  <!-- <div class="name">{{ item.level | levelText }}</div> -->
                  <div class="name">
                    <i class="sp" :class="'sp-level-0' + item.level"></i>
                  </div>
                  <div class="value">￥{{ item.bonus }}</div>
                </div>
              </div>
            </div>
							<!-- <div class="advanced">您当前身份：{{ userInfo.level | levelText }}</div> -->
            <div class="advanced">
              <span>您当前身份：</span>
              <i v-if="1 < userInfo.level" class="sp" :class="'sp-level-0' + userInfo.level"></i>
              <span v-else class="practice">
                <i class="sp sp-level-01"></i>
                <em>(实习)</em>
              </span>
            </div>
            <!-- <div class="text" v-show="1 >= userInfo.level">抱歉！办卡没有佣金</div> -->
            <div v-if="1 < userInfo.level" class="formal">
              <div class="body">
  							<div class="cycle">
                  <div v-show="isBankTips" class="tip-text">注：兴业银行需客户去领卡才算佣金</div>
                  <div class="info">
  									<span class="period">结算周期</span>
  									<span class="text">申请的信用卡将不用再查询进度</span>
  								</div>
                  <p class="annotation">注：如以前有此银行的信用卡，将不再享有首卡奖励佣金。一般都是秒出申请结果，用户收到卡片后{{day}}佣金。</p>
                </div>
                <div class="rules">
                  <div class="info">
  									<div class="period">结算规则</div>
  									<span class="text">
                    首次申请{{ currentBank.name}}信用卡，资料审核通过，并有收到短信通知，算成功办理此业务，没有通过审核则不计奖励。不用查进度。
                    </span>
  								</div>
                </div>
              </div>
              <div v-if="1 >= userInfo.level * 1" class="foot">
                <div class="btn">
                  <router-link :to="{ name: 'user.BuyVip' }">
                    立即升级
                  </router-link>
                </div>
              </div>
            </div>

            <div v-else class="formal">
              <div class="btn-group">
                <a class="btn-item" v-on:click="isBonus = false">取消</a>
                <router-link :to="{ name: 'user.UseDetail', query: { id: 9 }}" class="btn-item">立即查看</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

		<transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <!-- <div v-show="!isWechatClient && isMaskVip" class="mask-vip"> -->
      <div v-show="isMaskVip" class="mask-vip">
        <div class="mask" @click="closeVip"></div>
        <div class="inner">
					<div class="close" @click="closeVip">
						<i class="icon icon-close"></i>
					</div>
          <scroller>
            <img src="~assets/images/creditcard-01.jpg">
          </scroller>
        </div>
      </div>
    </transition>

    <Tips></Tips>

    <audio ref="audio">
      <source src="https://cdn.kamengjinfu.com/assets/cardad.mp3" type="audio/mpeg">
    </audio>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
