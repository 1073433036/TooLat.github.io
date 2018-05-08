<template>
  <main>
    <transition name="fade-left">
      <section v-if="isShowOpera">
        <div v-show="isUtilitybarShow" class="utilitybar-page">
          <div class="controller" :class="{hide: !isExtendshow}">
            <transition name="fade">
              <div class="btn-wrapper" v-if="isExtendshow">
                <i>
                  <div class="bg"></div>
                  <router-link :to="{ name: 'home.Home' }" class="home" tag="em"></router-link>
                </i>
                <i v-if="open">
                  <div class="bg"></div>
                  <em @click="isShow = !isShow" class="invite"></em>
                </i>
                <!-- <i>
                  <div class="bg"></div>
                  <em class="back" @click="goBack"></em>
                </i> -->
                <!-- <slot name="btn"></slot> -->
                <div class="et"></div>
              </div>
            </transition>
            <div class="extend-btn" @click="isExtendshow = !isExtendshow"  :class="{ active: isExtendshow }"></div>
          </div>
        </div>
      </section>
    </transition>

    <div v-if="open" class="common-invite-page">
      <div class="controller">
        <!-- <div class="group">
          <div class="item" v-on:click="isShow = !isShow"></div>
        </div> -->

        <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
          <div v-show="isShow" class="body">
            <div class="head">
              <div class="avatar">
                <img v-if="formTemp.avatar" :src="formTemp.avatar">
                <img v-else src="~assets/images/avatar.png">
              </div>
              <div class="invite-info">
                <div class="name">{{ formTemp.user_nickname }}</div>
                <div class="level">
                  <i class="sp" :class="'sp-level-0' + formTemp.level"></i>
                  <span>{{ formTemp.level_name }}</span>
                </div>
              </div>

              <div class="qrcode" v-on:click="handleQrcode()">
                <span>官方二维码</span>
                <i class="sp sp-card_share_01"></i>
              </div>
            </div>

            <div class="foot">
              <a class="link" v-on:click="handleUserQrcode()">
                <i class="sp sp-icon-invite-01"></i>
                <span>微信聊</span>
              </a>
              <a v-if="formTemp.mobile" class="link link-02" :href="'tel:' + formTemp.mobile">
                <i class="sp sp-icon-invite-02"></i>
                <span>电话聊</span>
              </a>
              <a v-else class="link link-02" v-on:click="$toast('推荐人暂未上传手机号码')">
                <i class="sp sp-icon-invite-02"></i>
                <span>电话聊</span>
              </a>
              <div class="link link-03" v-on:click="handleGotoChat()">
                <i class="sp sp-icon-invite-03"></i>
                <span>微聊</span>
              </div>

            </div>
          </div>
        </transition>

      </div>

      <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: '长按识别二维码', wx_qrcode: formTemp.wx_qrcode, wechat_account: formTemp.wechat_account }"></WechatCode>

    </div>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
