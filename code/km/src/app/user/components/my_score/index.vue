<template>
  <div class="user-my_score-page">
    <app-header title="我的评价"></app-header>
    <div class="nav-tab">
      <div class="tab-item" :class="{ active: 0 == type }" v-on:click="type = 0">全部</div>
      <div class="tab-item" :class="{ active: 1 == type }" v-on:click="type = 1">好评</div>
      <div class="tab-item" :class="{ active: 2 == type }" v-on:click="type = 2">差评</div>
    </div>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="container">
          <div class="score-group">
            <div class="score-item score-info">
              <div class="title">
                <span>评价信息</span>
              </div>
              <div class="content">
                <div class="speed">
                  <div class="bg" :style="{ width: (formTemp.rating.bad_num / formTemp.rating.count) * 100 + '%' }">
                    <div class="tips">
                      <span>{{ (formTemp.rating.bad_num / formTemp.rating.count) * 100 || 0 }}%</span>
                    </div>
                  </div>
                  <div class="body">
                    <div class="body-item bad">
                      <span>差评：<em>{{ formTemp.rating.bad_num }}</em>人</span>
                    </div>
                    <div class="body-item good">
                      <span>好评：<em>{{ formTemp.rating.good_num }}</em>人</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div class="score-item score-list">
              <div class="title">
                <span>谁评价了我</span>
              </div>

              <ul v-if="0 < formTemp.list.length" class="list">
                <li v-for="(item, index) in formTemp.list" class="item">
                  <div class="head">
                    <div class="avatar">
                      <img v-if="item.user_info.avatar" :src="item.user_info.avatar">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <div class="invite-info">
                      <div class="name">{{ item.user_info.user_nickname }}</div>
                      <div class="level">
                        <span>级别：{{ item.user_info.level_name }}</span>
                        <i class="sp" :class="'sp-level-0' + item.user_info.level"></i>
                      </div>
                    </div>

                    <div class="head-right">
                      <div class="tiem">{{ item.add_time }}</div>
                      <div class="score" :class="1 == item.type ? 'good' : 'bad'">
                        <i class="sp" :class="1 == item.type ? 'sp-good' : 'sp-bad'"></i>
                        <span>{{ item.type | checkScoreType }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="body">
                    <p>您的好友<span>{{ item.user_info.user_nickname }}</span>进行了评价，评价内容：<em>{{ item.content }}</em></p>
                  </div>

                  <div class="foot">
                    <a class="link" v-on:click="handleUserQrcode(item)">
                      <i class="sp sp-icon-invite-01"></i>
                      <span>微信聊</span>
                    </a>
                    <a v-if="item.user_info.mobile" class="link link-02" :href="'tel:' + item.user_info.mobile">
                      <i class="sp sp-icon-invite-02"></i>
                      <span>电话聊</span>
                    </a>
                    <a v-else class="link link-02" v-on:click="$toast('暂未上传手机号码')">
                      <i class="sp sp-icon-invite-02"></i>
                      <span>电话聊</span>
                    </a>
                    <router-link :to="{ name: 'chat.Home', params: { id: item.rating_user_id }}" class="link link-03">
                      <i class="sp sp-icon-invite-03"></i>
                      <span>微聊</span>
                    </router-link>

                  </div>
                </li>

              </ul>

            </div>
          </div>
        </div>
      </div>
    </scroller>

    <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: '长按识别二维码', wx_qrcode: formTemp.wx_qrcode, wechat_account: formTemp.wechat_account }"></WechatCode>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>