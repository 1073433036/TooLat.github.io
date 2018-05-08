<template>
  <div class="user-home-page">
    <scroller ref="myscroller">
      <app-header title="个人中心">
        <div class="slot animated shake" slot="right">
          <router-link :to="{ name: 'home.Rule' }">
            <i class="sp sp-mark"></i>
            <!-- <span>签到</span> -->
          </router-link>
        </div>
      </app-header>
      <div class="wrapper">
        <div class="container">
          <!-- <div class="head" :class="{ wechat: isWechatClient }"> -->
          <div class="head">
            <div class="content">
              <div class="top">
                <div class="avatar">
                  <router-link :to="{ name: 'user.Profile' }">
										<img v-if="userInfo.avatar_full" :src="userInfo.avatar_full">
                  	<img v-if="!userInfo.avatar_full" src="~assets/images/default-avatar.png">
									</router-link>
                </div>

                <div class="user-info">
                  <router-link :to="{ name: 'user.Profile' }" class="name" tag="div">
                    <span>{{ userInfo.user_nickname }}</span>
                    <i v-if="1 < userInfo.level" class="sp" :class="'sp-level-0' + userInfo.level"></i>
                    <span v-else class="practice sp-level">
                      <i class="sp sp-level-01"></i>
                      <em>(实习)</em>
                    </span>
                  </router-link>

                  <router-link :to="{ name: 'user.MyScore' }" tag="div" class="evaluate">
                    <i class="sp sp-evaluate"></i>
                    <em>我的评价</em>
                  </router-link>

                  <div class="tags">
                    <!-- <span v-show="userInfo.city_name">{{ userInfo.city_name }}</span> -->
                    <!-- <span>上班族</span> -->
                    <span v-show="pointText.province">{{ pointText.province }}{{ pointText.city }}</span>
                    <span class="inviteCode" :data-clipboard-text="userInfo.invite_code || '无'">
                      推荐码：{{ userInfo.invite_code || '无' }}
                    </span>
                  </div>

                </div>
								<!-- <div class="recommend-code">推荐码：{{ userInfo.invite_code || '无' }}</div> -->
              </div>

              <!-- <div class="bot" v-if="!isWechatClient"> -->
              <div class="bot">
                <div class="tabs">
                  <div class="tab-item">
                    <div class="tit">总收益</div>
                    <p class="desc">
                      <em>￥</em>
                      <span>{{ userInfo.income | money }}</span>
                    </p>
                  </div>
                  <div class="tab-item">
                    <div class="tit">已结算</div>
                    <p class="desc">
                      <em>￥</em>
                      <span>{{ userInfo.settled_income | money }}</span>
                    </p>
                  </div>
                  <!-- <router-link :to="{name: 'user.Account'}"> -->
									<a href="javascript:void(0)" @click="linkToRoute({name: 'user.Account'})">
                    <div class="tab-item">
                      <div class="tit">可结算</div>
                      <p class="desc">
                        <em>￥</em>
                        <span>{{ userInfo.balance | money }}</span>
                      </p>
                    </div>
									</a>
                  <!-- </router-link> -->
                </div>
              </div>
            </div>
          </div>

          <div class="main" :class="{ 'no-filter': !isFilter }">
            <div class="menu-group">
              <!-- <div class="item" v-if="!isWechatClient"> -->
              <div class="item">
                <!-- <router-link :to="{ name: 'user.Account' }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({name: 'user.Account'})">
                  <div class="icon">
                    <i class="sp sp-user-home-01"></i>
                    <div class="prompt" v-show="message.user_account">
                      <span>{{ message.user_account }}</span>
                    </div>
                  </div>
                  <span>账户管理</span>
								</a>
                <!-- </router-link> -->
              </div>
              <!-- <div v-if="'' !== userInfo.invite_code && !isWechatClient" class="item"> -->
              <div v-if="'' !== userInfo.invite_code" class="item">
                <!-- <router-link :to="{ name: 'user.ClassRoomHome' }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({name: 'user.ClassRoomHome'})">
                  <div class="icon" :class="{ 'no-filter': isFilter }">
                    <i class="sp sp-user-home-02"></i>
                  </div>
                  <span>培训课堂</span>
								</a>
                <!-- </router-link> -->
              </div>
              <!-- <div class="item" v-if="(1 < userInfo.level && '' !== userInfo.invite_code || 3 <= teamNum && '' !== userInfo.invite_code) && !isWechatClient"> -->
              <div class="item" v-if="(1 < userInfo.level && '' !== userInfo.invite_code || 3 <= teamNum && '' !== userInfo.invite_code)">
                <!-- <router-link :to="{ name: 'user.Team' }"> -->
                <a href="javascript:" @click="jumpTeam">
                  <div class="icon">
                    <i class="sp sp-user-home-03"></i>
                    <div class="prompt" v-show="message.user_team">
                      <span>{{ message.user_team }}</span>
                    </div>
                  </div>
                  <span>团队管理</span>
                </a>
              </div>
              <div v-if="'' !== userInfo.invite_code" class="item icon-07">
                <!-- <router-link :to="{ name: 'user.Poster' }" class="icon-07"> -->
								<a href="javascript:void(0)" @click="linkToRoute({name: 'user.Poster' })" class="icon-07">
                  <div class="icon icon-07">
                    <i class="sp sp-user-home-07 icon-07"></i>
                  </div>
                  <span class="icon-07">推广海报</span>
								</a>
                <!-- </router-link> -->
              </div>

              <!-- <div v-if="'' !== userInfo.invite_code && !isWechatClient" class="item"> -->
              <div v-if="'' !== userInfo.invite_code" class="item">
                <!-- <router-link :to="{ name: 'user.RankingList' }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({name: 'user.RankingList' })">
                  <div class="icon">
                    <i class="sp sp-user-home-15"></i>
                  </div>
                  <span>排行榜</span>
								</a>
                <!-- </router-link> -->
              </div>

              <div class="item">
                <!-- <router-link :to="{ name: 'user.Invite' }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({name: 'user.Invite' })">
                  <div class="icon">
                    <i class="sp sp-user-home-10"></i>
                  </div>
                  <span>邀请好友</span>
								</a>
                <!-- </router-link> -->
              </div>
              <div v-if="'' !== userInfo.invite_code" class="item icon-11">
                <router-link :to="{ name: 'task.TaskService' }" class="icon-11">
								<!-- <a href="javascript:void(0)" @click="linkToRoute({name: 'task.TaskService' })" class="icon-11"> -->
                  <div class="icon icon-11">
                    <i class="sp sp-user-home-11 icon-11"></i>
                  </div>
                  <span class="icon-11">专属推荐人</span>
								<!-- </a> -->
                </router-link>
              </div>

              <!-- <div v-if="1 < userInfo.level && '' !== userInfo.invite_code && !isWechatClient" class="item"> -->
              <div v-if="1 < userInfo.level && '' !== userInfo.invite_code" class="item">
                <a href="javascript:;" @click="jumpUserYixiang">
                  <div class="icon icon-12">
                    <i class="sp sp-profile-01"></i>
                    <div class="prompt" v-show="message.user_yixiang">
                      <span>{{ message.user_yixiang }}</span>
                    </div>
                  </div>
                  <span class="icon-12">意向代理</span>
                </a>
              </div>
              <!-- <div class="item" v-if="userInfo.level != 1 || isCard">
                <router-link :to="{ name: 'user.Card' }">
                  <div class="icon">
                    <i class="sp sp-user-home-04"></i>
                  </div>
                  <span>办卡查询</span>
                </router-link>
              </div> -->
              <!-- <div class="item" v-if="userInfo.level != 1 || isLoan"> -->
              <div v-if="'' !== userInfo.invite_code" class="item">
                <!-- <router-link :to="{ name: 'home.NoopsycheCreditRefer' }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({name: 'home.NoopsycheCreditRefer' })">
                  <div class="icon" :class="{ 'no-filter': isFilter }">
                    <i class="sp sp-user-home-05"></i>
                  </div>
                  <span>进度查询</span>
								</a>
                <!-- </router-link> -->
              </div>

              <div v-if="1 < userInfo.level && '' !== userInfo.invite_code" class="item">
                <!-- <router-link :to="{ name: 'user.Certificate' }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({name: 'user.Certificate' })">
                  <div class="icon">
                    <i class="sp sp-user-home-09"></i>
                  </div>
                  <span>授权证书</span>
								</a>
                <!-- </router-link> -->
              </div>
              <!-- <div class="item" v-if="userInfo.level != 1">
                <router-link :to="{ name: 'user.videoPlay' }">
                  <div class="icon">
                    <i class="sp sp-user-video"></i>
                  </div>
                  <span>视频讲解</span>
                </router-link>
              </div> -->
              <!-- <div v-if="'' !== userInfo.invite_code && !isWechatClient" class="item"> -->
              <div v-if="'' !== userInfo.invite_code" class="item">
                <!-- <router-link :to="{ name: 'user.UseFlow' }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({name: 'user.UseFlow' })">
                  <div class="icon" :class="{ 'no-filter': isFilter }">
                    <i class="sp sp-user-flow"></i>
                  </div>
                  <span>流程说明</span>
								</a>
                <!-- </router-link> -->
              </div>
              <!-- <div v-if="'' !== userInfo.invite_code && !isWechatClient" class="item"> -->
              <div v-if="'' !== userInfo.invite_code" class="item">
                <!-- <router-link :to="{ name: 'user.Manual' }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({name: 'user.Manual' })">
                  <div class="icon">
                    <i class="sp sp-user-manual"></i>
                  </div>
                  <span>平台手册</span>
								</a>
                <!-- </router-link> -->
              </div>

              <div v-if="1 < userInfo.level && '' !== userInfo.invite_code" class="item">
                <!-- <router-link :to="{ name: 'user.Exchange' }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({name: 'user.Exchange' })">
                  <div class="icon">
                    <i class="sp sp-user-home-14"></i>
                    <i class="tips" v-if="integral > 500"></i>
                  </div>
                  <span>积分抽奖</span>
								</a>
                <!-- </router-link> -->
              </div>

              <!-- <div v-if="3 > userInfo.insurance_level * 1 && '' !== userInfo.invite_code && !isWechatClient" class="item"> -->
              <div v-if="3 > userInfo.insurance_level * 1 && '' !== userInfo.invite_code" class="item">
                <!-- <a href="javascript:" @click="jumpVideoKey"> -->
                <!-- <router-link :to="{ name: 'user.BuyVip' }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({name: 'user.BuyVip' })">
									<div class="icon">
										<i class="sp sp-user-home-17"></i>
<!--                     <div class="prompt" v-show="message.user_video">
                      <span>{{ message.user_video }}</span>
                    </div> -->
									</div>
									<span>升级会员</span>
								</a>
								<!-- </router-link> -->
              </div>

              <div v-if="'' !== userInfo.invite_code" class="item">
                <router-link :to="{ name: 'user.HelpCenter' }">
									<div class="icon">
										<i class="sp sp-user-home-16"></i>
									</div>
									<span>帮助中心</span>
								</router-link>
              </div>

              <!-- <div class="item" v-if="isWechatClient"> -->
              <div class="item">
                <router-link :to="{ name: 'home.AppDownLoad' }">
                  <div class="icon">
                    <i class="sp sp-user-appdown"></i>
                  </div>
                  <span>APP下载</span>
                </router-link>
              </div>

              <div class="item">
                <router-link :to="{ name: 'user.Advice' }">
                <!-- <a href="javascript:" @click="$toast('敬请期待')"> -->
									<div class="icon">
										<i class="sp sp-user-home-18"></i>
									</div>
									<span>意见反馈</span>
                <!-- </a> -->
								</router-link>
              </div>

              <!-- <div class="item">
                <router-link :to="{ name: 'user.Wallet' }">
                  <div class="icon">
                    <i class="sp sp-user-home-12"></i>
                  </div>
                  <span>代理</span>
                </router-link>
              </div> -->
            </div>
            <div class="tiptxt" v-if="isWechatClient">下载卡盟APP，享受更好体验</div>
          </div>
        </div>
      </div>
    </scroller>

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
                  <p>
                  亲爱的卡盟家人：如果您是卡盟的正式会员LV1，为了您能够更好的理解卡盟推广卡盟，现在实行分群培训管理，卡盟的每一位LV3的团队领导人，都会建一个卡盟正式会员培训群。找到你的专属推荐人进入专业的业务培训群。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutRight">
      <div v-show="isSenior" class="notice-mask">
        <div class="inner">
          <div class="content">
            <div class="notice-head">
              <div class="head-inner">
                <span>温馨提示</span>
                <i class="sp sp-notify-title"></i>
              </div>
              <i class="sp sp-close" v-on:click="isSenior = false"></i>
            </div>
            <div class="body">
              <div class="body-inner">
                <div class="text">
                  <p>
                  您好！目前您已是平台业务主任<i class="sp" :class="'sp-level-0' + userInfo.level"></i>级别，享受平台额外赠送的团队管理佣金10块钱奖励，您有义务管理培训自己的业务团队成员。也可以通过上下级合作组建团队，启用自动小U群管家，还可以邀请公司客服入驻微信群解说培训。因为平台业务板块众多，可以让你的团队快速熟悉业务，让您后期享受更多业务佣金躺赚！
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <service-cuetomer-popup />
    <app-footer ref="footer"></app-footer>
    <!-- <GuidePage v-on:onGuideClick="onGuideClick" :stepShow="isGuide"></GuidePage> -->

    <audio ref="audio">
      <source src="https://cdn.kamengjinfu.com/assets/welcome.mp3" type="audio/mpeg">
    </audio>
    <leader-grade></leader-grade>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
