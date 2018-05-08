<template>
  <div class="sign_in">
    <app-header title="签到"></app-header>
      <scroller>
        <div class="wrapper">
          <div class="controller">
          	<div class="namenick">{{ userInfo.user_nickname }}</div>
	          <div class="photo">
							<div class="data">
								<ul class="list">
									<li class="item" v-for="(item, index) in formTemp.history" :class="{ 'active': nowDate == item.date && item.status, 'on': item.status }" v-show="(nowDate < 9 && item.date < 9) || (item.date > nowDate - 8 && nowDate + 1 > item.date)">
										<span>{{ item.date }}</span>
										<i v-if="nowDate == item.date && item.status" v-text="monthList[nowMonth]"></i>
									</li>
								</ul>
							</div>
							<div class="integral">
								<span class="figure">{{ integral }}</span>
								<p class="info">
									<span class="present">当前积分</span><span class="add_up">已累计签到{{ times }}天</span>
								</p>
								<div class="sign_box" @click="setSignIn()" :class="{ 'disabled': isDisabled }">
									<p class="sign">{{ stateText }}</p>
									<p class="add">+ {{ send_integral }}分</p>
								</div>
							</div>
	          </div>
            <div class="main">
              <div class="convert_box">
								<div class="convert">积分兑换</div>
								<router-link :to="{  name: 'home.ConvertRecord' }" class="record">兑换记录</router-link>
							</div>
							<div class="box_list">
								<ul class="list">
									<li class="item" v-for="(item, index) in formTemp.goods">
										<router-link :to="{	name:	'home.IntegralConvert', params: { id: item.id }}">
											<img :src="item.img" alt="">
											<div class="name">{{ item.goods_name }}</div>
											<div class="des">{{ item.description }}</div>
											<div class="inte">{{ item.integral }}积分</div>
										</router-link>
									</li>
								</ul>
							</div>
            </div>

						<!-- <div class="award">
							<div class="convert_box">
								<div class="convert">
									<i class="sp sp-integral"></i>
									积分抽奖
								</div>
								<a href="javascript:" class="record" @click="myAward">
									<i class="sp sp-prize-icon"></i>
									我的奖品
								</a>
							</div>
							<div class="draw">

								<div class="draw-area">
									<img class="turnwrap-img" src="~assets/images/raffle-wrapper.png" alt="">
									<img ref="turnimg" class="turnplate" :class="[turnAnimationClass]" src="~assets/images/raffle_turnplate.png" alt="">
									<img class="draw-btn" src="~assets/images/raffle_point.png" v-on:click="drawRaffle" alt="">
								</div> -->

								<!-- <div class="backdrop">
									<div class="consume">积分抽奖每次消耗{{ consume }}积分</div>
									<div class="carousel">
										<div class="item_box" ref="sliderSwiper">
											<ul class="list swiper-wrapper">
												<li class="item swiper-slide" v-for="(item, index) in formTemp.activity">
													<div class="image">
														<img :src="item.img2" alt="">
													</div>
													<div class="info">
														<div class="name">{{ item.prize }}</div>
														<div class="desc">{{ item.description }}</div>
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="btn" @click="luckDraw()">
									<img src="~assets/images/prize-02.png" alt="">
								</div> -->

								<!-- <div class="win_record">
									<p class="win_number">中奖名单</p>
									<div class="winbox-wrap">
										<div class="win_box" ref="mySwiper">
											<ul class="list swiper-wrapper">
													<li v-for="(item, index) in luckyDog" class="item swiper-slide">
														<span class="congratulation">恭喜</span>
														<span class="tel">{{ item.real_name }}</span>
														<span class="shop_name">获得：{{ item.prize }}</span>
													</li>
												</ul>
										</div>
									</div>
								</div>

							</div>
						</div> -->

          </div>
        </div>
      </scroller>

			<div class="member-box" v-show="isShowLucky && isLucky">
        <div class="member">
					<div class="shop_img">
						<img :src="luckyGoods.img" alt="">
					</div>
					<p class="gain">获得： {{ luckyGoods.prize }}</p>
          <span class="abolish">
          	<a href="javascript:" @click="award">马上领取</a>
					</span>
					<i class="icon icon-close" @click="isShowLucky = false"></i>
        </div>
      </div>

			<div class="no_win" v-show="isShowNoLucky && !isLucky">
				<div class="no_photo">
					<span class="abolish" @click="isShowNoLucky = false, luckDraw()">在来一次</span>
					<i class="icon icon-close" @click="isShowNoLucky = false"></i>
				</div>
			</div>

  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
