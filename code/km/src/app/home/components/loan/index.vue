<template>
  <div class="loan-page">
    <app-header title="信用贷款"></app-header>
    <div class="navbar">
      <div class="box">
        <a href="javascript:" class="select" :class="{'on':state.sortFlag}" @click="state.sortFlag = !state.sortFlag, state.selectFlag = false">
          <span>智能排序</span>
        </a>
        <transition name="fade" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
          <div class="mask" v-show="state.sortFlag">
            <div class="block"></div>
            <ul class="sort-list">
              <li v-for="(item, index) in objects.sortList" :key="index" :class="{'on': sort === item.value}">
                <a href="javascript:" @click="handleSort(item.value)">
                  <span>{{ item.name }}<span class="text">{{ item.mode }}</span></span>
                  <i></i>
                </a>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <div class="box">
        <a href="javascript:" class="select" :class="{'on': state.selectFlag}" @click="state.selectFlag = !state.selectFlag, state.sortFlag = false">
          <span>高级筛选</span>
        </a>
        <transition name="fade" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
          <div class="mask" v-show="state.selectFlag">
            <div class="block"></div>
            <div class="content">
              <scroller>
                <div class="option">
                  <div class="title">贷款额度</div>
                  <ul>
                    <li v-for="(item, index) in formTemp.filter.quota" :key="index" :class="{ 'on': item.value === filter.quota }">
                      <a href="javascript:" @click="quota(item.value)">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
                <div class="option">
                  <div class="title">职业身份</div>
                  <ul>
                    <li v-for="(item, index) in formTemp.filter.work" :key="index" :class="{ 'on': item.value === filter.work }">
                      <a href="javascript:" @click="work(item.value)">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
                <div class="option">
                  <div class="title">个人资质（可多选）</div>
                  <ul>
                    <li v-for="(item, index) in formTemp.filter.data" :key="index"  :class="{'on': -1 !== filterData.indexOf(item.value)}">
                      <a href="javascript:" @click="mortgage(item.value)">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
                <div class="option">
                  <div class="title">办理周期</div>
                  <ul>
                    <li v-for="(item, index) in formTemp.filter.deal" :key="index" :class="{'on': item.value === filter.deal }">
                      <a href="javascript:" @click="cycle(item.value)">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
                <div class="option">
                  <div class="title">借款期限</div>
                  <ul>
                    <li v-for="(item, index) in formTemp.filter.lend" :key="index" :class="{'on': item.value === filter.lend }" >
                      <a href="javascript:"  @click="term(item.value)">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
              </scroller>
            </div>
            <div class="btn">
              <a href="javascript:" class="left" @click="reset">重置</a>
              <a href="javascript:" class="right" @click="submit">完成</a>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
<!--       <div class="banner" ref="mySwiper">
        <ul class="banner-list swiper-wrapper">
          <li class="banner-item swiper-slide"><img src="~assets/images/banner-01.jpg"></li>
          <li class="banner-item swiper-slide"><img src="~assets/images/banner-02.jpg"></li>
          <li class="banner-item swiper-slide"><img src="~assets/images/banner-03.jpg"></li>
        </ul>
        <div class="swiper-pagination"></div>
      </div> -->
      <div class="tips">
				<i class="icon icon-horn"></i>
				<div class="notice">
					<div class="marquee">
					卡盟金服信贷流量服务平台：卡盟V金服平台负责拓客推广申请贷款服务，卡盟金服与各大贷款公司签约代理，贷款业务推广合作，客户申请贷款成功，与放款机构直接签约，推广客户直接赚取佣金奖励。
					</div>
      	</div>
      </div>
      <ul class="list list_li">
        <li class="item" v-for="(item, index) in formTemp.data" :key="index">
          <div class="box">
            <div class="title">
              <div class="icon">
                <img :src="item.thumb">
              </div>
              <div class="name">
                <router-link :to="{name:'home.LoanDeatil', params:{ id: item.id }}">
                  <span>{{ item.name }}</span>
                </router-link>
              </div>
              <!-- @param         userInfo.level === 1 普通会员 -->
              <!-- <div class="money" v-on:click.stop="handleBonus(item)" v-if="!isWechatClient"> -->
              <div class="money" v-on:click.stop="handleBonus(item)">
                <i class="sp sp-money-02"></i>
                <span>奖金：<em class="moneyColor">{{ item.cms_val }}</em></span>
                <i class="icon sp sp-right-02"></i>
              </div>
              <!-- <div class="striking">
                <span><span>日息低至{{ item.daily_interest }}%</span></span>
              </div> -->
              <div class="number"><span>{{ item.apply_num }}</span>人申请</div>
            </div>
            <div class="content">
              <div class="quota">
                <div class="money"><i class="moneyPic"></i></div>
                <div class="text">最高额度</div>
              </div>
              <div class="profile">
                <div class="text"><span>{{ item. deal_time_limit }}</span>放款</div>
                <div class="text">每天手续费<span>{{ item.daily_fee }}</span>元</div>
                <div class="text">期限<span>{{ item.lend_time_limit }}</span></div>
              </div>
              <div class="apply">
                <router-link :to="{name:'home.LoanDeatil', params:{ id: item.id }}">
                  免费申请
                </router-link>
              </div>
            </div>
            <div class="bottom">
              <span v-for="tag in item.bottom_tags.split(',')">{{ tag }}</span>
            </div>
          </div>
        </li>
      </ul>
		  <app-footing></app-footing>
    </scroller>


    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div v-show="isBonus" class="mask-bonus">
        <div class="inner">
          <div class="colse" v-on:click="isBonus = false"></div>
          <div class="content">
						<div class="backdrop">
							<div>奖金说明：总佣金{{brokerage}}</div>
							<div class="state">{{explain}}</div>
						</div>
            <div class="head">

              <div class="level-gorup">
                <div class="item active" :class="{ 'active': userInfo.level == item.level }" v-for="(item, index) in currentBank.user_bonus">
                  <i v-show="userInfo.level == item.level" class="sp sp-pointer-01"></i>
                  <!-- <div class="name">{{ item.level | levelText }}</div> -->
                  <div class="name">
                    <i v-if="0 < item.level" class="sp" :class="'sp-level-0' + item.level"></i>
                  </div>
                  <div class="value">{{ item.bonus }}</div>
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
            <div class="text" v-show="userInfo.level == 1">抱歉！贷款没有佣金</div>
            <div class="body">
              <div class="cycle">
                <div class="info">
									<span class="period">结算周期</span>
									<span class="text">T+1（不需要查询贷款进度，客户贷款成功且符合平台结算标准，一般两个工作日结算）</span>
								</div>
                <p class="annotation">注：如客户以前有注册过或贷款过的，代理商则无法拿到该奖励金。一般贷款成功后第2个工作日会显示贷款结果，贷款结果会显示放款金额、放款期限，请仔细查看。</p>
              </div>
              <div class="rule">
                <div class="info">
									<div class="period">结算规则</div>
									<span class="text">客户必须为首次注册申请该产品，才算有效申请。贷款奖金按平台分发的标准进行结算，贷款奖金结算时间如遇到重大节假日可能会延迟到工作日。客户是第一次注册并且申请成功方可结算佣金，若客户之前有注册或申请该产品则为无效申请，也无法计入在代理商名下的业绩，也无法拿到贷款奖金。贷款号码必须与平台申请号码一致资料通过审批，但没有放款，也不会有贷款奖金。</span>
									<span class="annotation">注：贷款奖励佣金是由合作平台出资支付</span>
								</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
		<!-- <div class="footer-apply" v-show="isShow"> -->
  <!--     <div class="apply-btn">
        <a href="javascript:" class="step" @click="isStep">申请步骤</a>
        <a href="javascript:" class="apply" @click="isApply = true">立即申请</a>
      </div> -->
		<!-- 	<div class="btn">
        <a href="javascript:" @click="isMember">快速申请</a>
			</div> -->
		<!-- 	<div class="close" @click="close">
				<span class="sp sp-close"></span>
			</div>
		</div> -->

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <!-- <div v-show="!isWechatClient && isMaskVip" class="mask-vip"> -->
      <div v-show="isMaskVip" class="mask-vip">
        <div class="mask" @click="closeVip"></div>
        <div class="inner">
          <div class="close" @click="closeVip">
            <i class="icon icon-close"></i>
          </div>
          <scroller>
            <img src="~assets/images/creditcard-03.jpg">
          </scroller>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
