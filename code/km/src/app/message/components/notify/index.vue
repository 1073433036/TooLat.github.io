<template>
  <div class="message-notify-page">
    <app-header title="通知"></app-header>
    <scroller
      :on-refresh="refresh"
      ref="my_scroller">
      <div class="wrapper">
        <div class="controller">
          <ul class="list">
            <!-- <li class="item" :class="{ 'be': item.is_read }" v-for="(item, index) in formTemp.list" :key="index"
                v-if="!isWechatClient || (isWechatClient && item.send_type != 4)"> -->
            <li class="item" :class="{ 'be': item.is_read }" v-for="(item, index) in formTemp.list" :key="index">
              <a href="javascript:" @click="switchType(item.send_type, item.num)">
                <i class="sp" :class="'sp-message-0' + item.send_type"></i>
                <div class="info">
                  <div class="head">
                    <div class="tit">
                      <span>{{ item.title }}</span>
                      <div class="tips" v-show="item.num">
                        <span>{{ item.num }}</span>
                      </div>
                    </div>
                    <div class="time">{{ item.send_time }}</div>
                  </div>
                  <div class="msg">{{ item.msg_content }}</div>
                </div>
              </a>
            </li>
          </ul>
          <div class="box">
            <!-- <div v-for="(item, index) in formTemp.service" class="box-item" :class="{ filter: 'offline' == item.status }"> -->
            <div v-for="(item, index) in formTemp.service" :key="index" class="box-item">
              <!-- <router-link :to="{ name: 'chat.Home', params: { id: item.user_id }, query: { type: 'kf', id: item.order_sort, t: item.name } }" class="link"> -->
              <a href="javascript:void(0)" @click="linkToRoute({ name: 'chat.Home', params: { id: item.user_id }, query: { type: 'kf', id: item.order_sort, t: item.name } })" class="link">
                <div class="avatar">
                  <img v-if="item.status === 'offline' && item.name === '我的推荐人'" src="~assets/images/service-invite-offline.png">
                  <img v-else-if="item.status === 'offline' && item.name === '商务合作'" src="~assets/images/service-business-offline.png">
                  <img v-else-if="item.status === 'offline'" src="~assets/images/service-offline.png">
                  <img v-else-if="item.avatar" :src="item.avatar">
                  <img v-else src="~assets/images/service-01.png">
                </div>
                <!-- <div class="name" :class="{ filter: 'offline' == item.status }" :style="{ color: item.color, borderColor: item.color }">{{ item.name }}</div> -->
                <div class="name" :class="{ filter: 'offline' == item.status }"
                    :style="{ color: 'offline' == item.status ? '#000' : '#f00', borderColor: 'offline' == item.status ? '#000' : '#f00' }">{{ item.name }}</div>
              </a>
              <!-- </router-link> -->
            </div>
          </div>
        </div>
      </div>
    </scroller>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div v-show="isWechat" class="mask-inner">
        <div class="inner">
          <div class="content">
            <div class="head">
              <span>客服微信二维码</span>
              <i v-on:click="isWechat = false" class="sp sp-close"></i>
            </div>

            <div class="body">
              <div class="qr-code">
                <img v-if="1 === wechatIndex" src="~assets/images/qr_code_kf_01.jpg">
                <img v-else src="~assets/images/qr_code_kf_02.jpg">
              </div>
            </div>
            <div class="foot">
              <h3>长按二维码添加客服</h3>
              <p>为了更好的解决问题，请添加客服微信号</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutRight">
      <div v-show="isNotice" class="notice-mask">
        <div class="inner">
          <div class="content">
            <div class="head">
              <div class="head-inner">
                <span>系统通知</span>
                <i class="sp sp-notify-title"></i>
              </div>
              <i class="sp sp-close" v-on:click="handleNoticeClose()"></i>
            </div>
            <div class="body">
              <div class="body-inner">
                <div class="time">
                  <i class="sp sp-notice"></i>
                  <span>{{ formTemp.notice.start_time * 1000 | fmtNewsDate }}</span>
                </div>
                <div class="text">
                  <p>
                  {{ formTemp.notice.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutRight">
      <div v-show="isSystem" class="system-mask">
        <div class="inner">
          <div class="content">
            <div class="head">
              <div class="close" v-on:click="handleNoticeClose()">
                <i class="sp sp-close"></i>
              </div>
            </div>
            <div class="body">
              <div class="text">{{ formTemp.notice.content }}</div>
            </div>
            <div class="foot">
              <div class="text">
                <img src="~assets/images/seal.png">
                <p>广州卡盟科技有限公司</p>
                <p>卡盟运营中心</p>
                <p>{{ formTemp.notice.start_time * 1000 | fmtDateDay }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <service-cuetomer-popup />
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
                <img src="~assets/images/kf-wechat-code.jpg">
              </div>
            </div>
            <div class="foot">
              <h3>长按关注官方公众号</h3>
              <p>此公众号为客服处理问题用</p>
              <p>不作其他用途</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- qq kefu e-->

    <app-footer ref="footer"></app-footer>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
