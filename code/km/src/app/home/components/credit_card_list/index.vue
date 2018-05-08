<template>
  <div class="creditcard-list-page">
    <app-header :title="formTemp.bank.name || '信用卡列表'" :other="isOther" v-on:other="handleOther"></app-header>
    <div class="creditcard-layer">
      <scroller
        :on-refresh="refresh"
        :on-infinite="infinite"
        ref="my_scroller">
        <div v-if="1 !== cardTye * 1" class="banner">
          <img :src="formTemp.bank.banner_index">

          <div v-if="3 == id
            || 4 == id
            || 5 == id
            || 6 == id
            || 7 == id
            || 8 == id
            || 9 == id
            || 10 == id
            || 11 == id
            || 17 == id" class="share-group">
            <div class="share-item" v-on:click="handleWeChatClick()">
              <div class="body">
                <i class="sp sp-card_share_01"></i>
                <span>二维码</span>
              </div>
            </div>
            <div class="share-item" v-on:click="handleShareClick()">
              <div class="body">
                <i class="sp sp-card_share_02"></i>
                <span>分享</span>
              </div>
            </div>
          </div>
        </div>
  			<div class="tips">
  				<i class="icon icon-horn"></i>
  				<div class="notice">
  					<div class="marquee">
  						卡盟金服信贷流量服务平台：{{ 1 === cardTye * 1 ? '大额' : formTemp.bank.name }}信用卡中心，快速申请通道，不收取任何费用，谨防金融诈骗，举报电话：400-018-8616
            </div>
  				</div>
  			</div>
        <div class="ranking">
          <ul class="ranking-list">
            <li class="item" v-for="(item, index) in formTemp.data" :key="index">
              <div class="box">
                <!-- <router-link :to="{ name: 'home.CreditCardDetail', params:{ bid: item.bank_id, id: item.id } }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({ name: 'home.CreditCardDetail', params:{ bid: item.bank_id, id: item.id } })">
                  <div class="image">
                    <img :src="item.thumb">
                    <div class="quota">{{ item.quota || '0.00' }}</div>
                  </div>
								</a>
                <!-- </router-link> -->
                <div class="content">
                  <!-- <router-link :to="{ name: 'home.CreditCardDetail', params:{ bid: item.bank_id, id: item.id } }"> -->
									<a href="javascript:void(0)" @click="linkToRoute({ name: 'home.CreditCardDetail', params:{ bid: item.bank_id, id: item.id } })">
                    <div class="title">
                      <span class="name">{{ item.name }}</span>
                      <i v-if="1 == item.is_recommend" class="icon icon-recommend"></i>
                    </div>
									</a>
                  <!-- </router-link> -->

                  <!-- <div class="money" v-on:click.stop="handleBonus(item)" v-if="!isWechatClient"> -->
                  <div class="money" v-on:click.stop="handleBonus(item)">
                    <i class="sp sp-money-02"></i>
                    <span>奖金：{{ item.bank.bonus }}</span>
                    <i class="icon sp sp-right-02"></i>
                  </div>
                  <div v-for="(child, key) in item.title" :key="key" class="text">{{ child }}</div>
                  <!-- <div class="text">最高额度：<span>￥{{ item.max_quota }}</span></div> -->
                </div>
                <!-- <router-link :to="{ name: 'home.CreditCardDetail', params:{ bid: item.bank_id, id: item.id } }" tag="div" class="apply-btn"> -->
								<div href="javascript:void(0)" @click="linkToRoute({ name: 'home.CreditCardDetail', params:{ bid: item.bank_id, id: item.id } })" class="apply-btn">
                  <span>免费申请</span>
								</div>
                <!-- </router-link> -->
              </div>
            </li>
          </ul>
        </div>
      </scroller>
  		<div v-if="1 !== cardTye * 1" class="guide">
        <a href="javascript:" @click="apply">申请指南</a>
  		</div>


      <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
        <div v-show="isBonus" class="mask-bonus">
          <div class="inner">
            <div class="colse" v-on:click="isBonus = false"></div>
            <div class="content">
              <div class="colse-body" v-on:click="isBonus = false"></div>
              <div class="backdrop">
                <div class="bank_logo">
                  <img :src="currentBank.bank.thumb">
                </div>
                <h4>{{ currentBank.bank.name }}信用卡总奖金{{ currentBank.bonus }}元</h4>
              </div>
              <div class="head">

                <div class="level-gorup">
                  <div class="item" :class="{ 'active': userInfo.level == item.level }" v-for="(item, index) in currentBank.user_bonus">
                    <i v-show="userInfo.level == item.level" class="sp sp-pointer-01"></i>
                    <div class="name">
                      <i class="sp" :class="'sp-level-0' + item.level"></i>
                    </div>
                    <div class="value">￥{{ item.bonus }}</div>
                  </div>
                </div>

              </div>
              <div class="advanced">
                <span>您当前身份：</span>
                <i v-if="1 < userInfo.level" class="sp" :class="'sp-level-0' + userInfo.level"></i>
                <span v-else class="practice">
                  <i class="sp sp-level-01"></i>
                  <em>(实习)</em>
                </span>
              </div>
              <div class="text" v-show="userInfo.level == 1">抱歉！办卡没有佣金</div>
              <div v-if="1 < userInfo.level" class="formal">
                <div class="body">
                  <div class="cycle">
                    <div v-show="isBankTips" class="tip-text">注：兴业银行需客户去领卡才算佣金</div>
                    <div class="info">
                      <span class="period">结算周期</span>
                      <span class="text">申请的信用卡将不用再查询进度</span>
                    </div>
                    <p class="annotation">注：如以前有此银行的信用卡，将不再享有首卡奖励佣金。一般都是秒出申请结果，用户收到卡片后7-10个工作日左右自动结算佣金。</p>
                  </div>
                  <div class="rules">
                    <div class="info">
                      <div class="period">结算规则</div>
                      <span class="text">
                        首次申请{{ currentBank.name }}信用卡，资料审核通过，并有收到短信通知，算成功办理此业务，没有通过审核则不计奖励。不用查进度。
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
                  <router-link :to="{ name: 'home.Rule' }" class="btn-item">立即查看</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="layer" v-show="isShare">
        <div class="mask" @click="isShare = false"></div>
        <div class="share-image" @click="isShare = false">
          <img src="~assets/images/creditcard-share-btn.png">
        </div>
      </div>
    </div>

    <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
      <div v-show="isWeChat" class="card-share-code-wrapper">
        <div class="share-close" v-on:click="isWeChat = false"></div>
        <div v-show="canvasImage" class="canvasImage">
          <img :src="canvasImage">
        </div>
        <div v-show="('' == canvasImage)" class="card-share-code" :class="'card-share' + id ">
          <div class="content" ref="content">
            <div class="banner-img">
              <img v-if="3 == id" src="~assets/images/card-share-code-003.jpg">
              <img v-else-if="4 == id" src="~assets/images/card-share-code-004.jpg">
              <img v-else-if="5 == id" src="~assets/images/card-share-code-005.jpg">
              <img v-else-if="6 == id" src="~assets/images/card-share-code-006.jpg">
              <img v-else-if="7 == id" src="~assets/images/card-share-code-007.jpg">
              <img v-else-if="8 == id" src="~assets/images/card-share-code-008.jpg">
              <img v-else-if="9 == id" src="~assets/images/card-share-code-009.jpg">
              <img v-else-if="10 == id" src="~assets/images/card-share-code-010.jpg">
              <img v-else-if="11 == id" src="~assets/images/card-share-code-011.jpg">
              <img v-else-if="17 == id" src="~assets/images/card-share-code-017.jpg">
            </div>

            <div class="body">
              <!-- 交通银行 -->
              <div v-if="6 == id" class="user-info">
                <div class="code-img">
                  <div class="img">
                    <img :src="qrCodeUrl">
                  </div>
                  <div class="img">
                    <img src="~assets/images/finger.jpg">
                  </div>
                  <p>长按识别二维码！</p>
                </div>
                <div class="avatar">
                  <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                  <img v-else src="~assets/images/avatar.png">
                </div>

                <h3 class="name">{{ userInfo.name }}</h3>
                <div class="level">
                  <span>级别：{{ userInfo.job }}</span>
                  <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
                </div>
                <div class="text-tips">
                  我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
                </div>

              </div>

              <!-- 平安银行 -->
              <div v-else-if="8 == id" class="user-info">
                <div class="code-img">
                  <div class="img">
                    <img :src="qrCodeUrl">
                  </div>
                </div>

                <div class="infos">
                  <div class="avatar">
                    <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                    <img v-else src="~assets/images/avatar.png">
                  </div>

                  <h3 class="name">{{ userInfo.name }}</h3>
                  <div class="level">
                    <span>级别：{{ userInfo.job }}</span>
                    <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
                  </div>
                  <div class="text-tips">
                    我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
                  </div>
                </div>
              </div>

              <!--工商银行 -->
              <div v-else-if="3 == id" class="user-info">

                <div class="code-img">
                  <div class="img">
                    <img :src="qrCodeUrl">
                  </div>
                  <div class="img">
                    <img src="~assets/images/finger.jpg">
                  </div>
                  <p>长按识别二维码！</p>
                </div>

                <div class="avatar">
                  <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                  <img v-else src="~assets/images/avatar.png">
                </div>
                <h3 class="name">{{ userInfo.name }}</h3>
                <div class="level">
                  <span>级别：{{ userInfo.job }}</span>
                  <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
                </div>
                <div class="text-tips">
                  我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
                </div>
              </div>

              <!-- 光大银行 -->
              <div v-else-if="4 == id" class="user-info">
                <div class="code-img">
                  <div class="img">
                    <img :src="qrCodeUrl">
                    <!-- <qrcode :value="qrCodeUrl" size="45" class="codeurl"></qrcode> -->
                  </div>
                </div>

                <div class="infos">
                  <div class="avatar">
                    <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                    <img v-else src="~assets/images/avatar.png">
                  </div>

                  <h3 class="name">{{ userInfo.name }}</h3>
                  <div class="level">
                    <span>级别：{{ userInfo.job }}</span>
                    <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
                  </div>
                  <div class="text-tips">
                    我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
                  </div>
                </div>
              </div>


              <!-- 华夏银行 -->
              <div v-else-if="5 == id" class="user-info">

                <div class="code-img">
                  <div class="img">
                    <img :src="qrCodeUrl">
                  </div>
                  <div class="img">
                    <img src="~assets/images/finger.jpg">
                  </div>
                  <p>长按识别二维码！</p>
                </div>

                <div class="avatar">
                  <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                  <img v-else src="~assets/images/avatar.png">
                </div>
                <h3 class="name">{{ userInfo.name }}</h3>
                <div class="level">
                  <span>级别：{{ userInfo.job }}</span>
                  <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
                </div>
                <div class="text-tips">
                  我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
                </div>
              </div>

              <!-- 上海银行 -->
              <div v-else-if="10 == id" class="user-info">
                <div class="code-img">
                  <div class="img">
                    <img :src="qrCodeUrl">
                  </div>
                </div>

                <div class="infos">
                  <div class="avatar">
                    <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                    <img v-else src="~assets/images/avatar.png">
                  </div>

                  <h3 class="name">{{ userInfo.name }}</h3>
                  <div class="level">
                    <span>级别：{{ userInfo.job }}</span>
                    <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
                  </div>
                  <div class="text-tips">
                    我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
                  </div>
                </div>
              </div>

              <!-- 兴业银行 -->
              <div v-else-if="11 == id" class="user-info">
                <div class="code-img">
                  <div class="img">
                    <img :src="qrCodeUrl">
                  </div>
                </div>

                <div class="infos">
                  <div class="avatar">
                    <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                    <img v-else src="~assets/images/avatar.png">
                  </div>

                  <h3 class="name">{{ userInfo.name }}</h3>
                  <div class="level">
                    <span>级别：{{ userInfo.job }}</span>
                    <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
                  </div>
                  <div class="text-tips">
                    我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
                  </div>
                </div>
              </div>

              <!-- 光大普通银行 -->
              <div v-else-if="17 == id" class="user-info">
                <div class="code-img">
                  <div class="img">
                    <img :src="qrCodeUrl">
                  </div>
                </div>

                <div class="infos">
                  <div class="avatar">
                    <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                    <img v-else src="~assets/images/avatar.png">
                  </div>

                  <h3 class="name">{{ userInfo.name }}</h3>
                  <div class="level">
                    <span>级别：{{ userInfo.job }}</span>
                    <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
                  </div>
                  <div class="text-tips">
                    我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
                  </div>
                </div>
              </div>

              <!-- 其他银行 -->
              <div v-else class="user-info">
                <div class="avatar">
                  <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                  <img v-else src="~assets/images/avatar.png">
                </div>

                <h3 class="name">{{ userInfo.name }}</h3>
                <div class="level">
                  <span>级别：{{ userInfo.job }}</span>
                  <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
                </div>
                <div class="text-tips">
                  我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
                </div>

                <div class="code-img">
                  <div class="img">
                    <img :src="qrCodeUrl">
                  </div>
                  <div class="img">
                    <img src="~assets/images/finger.jpg">
                  </div>
                  <p>长按识别二维码！</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </transition>


    <!-- <Tips :bankId="id + ''"></Tips> -->

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
