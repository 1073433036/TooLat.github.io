<template>
  <main class="finish-invite-page">
    <!-- <app-header title="注册"></app-header> -->
    <scroller ref="myscroller">
      <section class="wrapper">
        <div class="header">
          <div class="header-logo"></div>
          <div class="desc-top"></div>
          <div class="desc-bottom">卡盟金服便民服务平台 实用赚钱工具</div>
        </div>

        <div class="content">
          <div class="manager-wrapper" v-if="Object.keys(manager).length">
            <div class="avatar">
              <img v-if="manager.avatar" :src="manager.avatar">
              <img v-else src="~assets/images/avatar.png">
            </div>
            <div class="nickName">{{ manager.user_nickname }}</div>
            <div class="invite-info">
              <div class="name"><i class="sp" :class="'sp-level-0' + manager.level"></i></div>
              <div class="level">
                <span>{{ manager.level_name }}</span>
              </div>
            </div>
            <div class="green-tip">
              Hi! 我是 {{ manager.user_nickname }} 邀请您成为创业合伙人，卡盟大舞台，有梦你就来
            </div>
          </div>

          <div class="info-wrapper">
            <div class="item">
              <span>手机号</span>
              <input type="text" placeholder="输入11位手机号码" v-model="phoneNumber">
            </div>
            <div class="item">
              <span>验证码</span>
              <input type="text" placeholder="注意查收短信" v-model="verifyCode">
              <div class="code-wrapper">
                <phoneCode title="获取" :phone="phoneNumber"></phoneCode>
              </div>
            </div>
            <div class="item">
              <span>密&nbsp;&nbsp;码</span>
              <input type="password" placeholder="输入密码" v-model="password">
            </div>
            <div class="pwd-tip">* 密码要与APP登入账号、密码同步</div>
            <div class="item">
              <span>推荐码</span>
              <span class="val" v-if="disabled">{{ inviteCode }}</span>
              <input type="text" placeholder="请输入推荐码" v-model="inviteCode" v-else>
            </div>
          </div>
          <div class="register-btn" @click="saveMsg">注册</div>
          <p>账号注册与APP公用</p>
        </div>
      </section>
    </scroller>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
