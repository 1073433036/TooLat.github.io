<template>
  <div class="message-team-page">
    <app-header title="意向代理"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="controller">
          <div class="nav-tab">
            <div class="nav-item" :class="{ active: '' === direct }" v-on:click="handleDirectChange('')">全部</div>
            <div class="nav-item" :class="{ active: 1 === direct }" v-on:click="handleDirectChange(1)">直接</div>
            <div class="nav-item" :class="{ active: 0 === direct }" v-on:click="handleDirectChange(0)">间接</div>
          </div>
          <ul class="list">
            <!-- <li class="item" v-for="(item, index) in formTemp.list" :key="index">
              <div class="inner">
                <div class="head">{{ item.title }}</div>
                <div class="day">{{ item.day }} {{ item.time }}</div>
                <div class="content">
                  <p>{{ item.msg_content }}</p>
                </div>
              </div>
            </li> -->
            <li class="item" v-for="(item, index) in formTemp.list" :key="index">
              <div class="head">
                <div class="avatar">
                  <img v-if="item.extend.avatar" :src="item.extend.avatar">
                  <img v-else src="~assets/images/avatar.png">
                </div>
                <div class="userinfo">
                  <h3 class="name">{{ item.extend.name }}</h3>
                  <div class="level">
                    <span>级别：{{ item.extend.old_level }}</span>
                    <i class="sp" :class="'sp-level-0' +  item.extend.old_level_id"></i>
                  </div>
                  <div class="time">
                    <span>{{ item.day }} {{ item.time }}</span>

                    <div class="pay_sta">
                      <span v-if="1 === item.extend.is_paid" class="ok">(已付款)</span>
                      <span v-else>(未付款)</span>
                    </div>
                    <div class="direct" :class="{ red: 0 == item.extend.direct }">
                      {{ 1 == item.extend.direct ? '直' : '间' }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="body">
                <p>{{ item.msg_content }}</p>
              </div>

              <div class="foot">
                <!--未输入wechat-->
                <a class="link disabled" v-if=" item.extend.wechat_account === '' " v-on:click="$toast('推荐人未填写微信号')">
                  <i class="sp sp-icon-invite-01"></i>
                  <span>微信聊</span>
                </a>
                <!--输入wechat-->
                <a class="link" v-else v-on:click="handleUserQrcode(item)">
                  <i class="sp sp-icon-invite-01"></i>
                  <span>微信聊</span>
                </a>
                <!-- 直接拨打电聊 -->
                <a v-if="item.extend.mobile" class="link link-02" :href="'tel:' + item.extend.mobile">
                  <i class="sp sp-icon-invite-02"></i>
                  <span>电话聊</span>
                </a>
                <!-- 不能电聊 -->
                <a v-else class="link disabled" v-on:click="$toast('推荐人暂未上传手机号码')">
                  <i class="sp sp-icon-invite-02"></i>
                  <span>电话聊</span>
                </a>
                <router-link :to="{ name: 'chat.Home', params: { id: item.extend.user_id }}" class="link link-03">
                  <i class="sp sp-icon-invite-03"></i>
                  <span>微聊</span>
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroller>
    <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: '长按识别二维码', wx_qrcode: formData.wx_qrcode, wechat_account: formData.wechat_account }"></WechatCode>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
