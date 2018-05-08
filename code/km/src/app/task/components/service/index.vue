<template>
  <div class="task-service">
    <app-header title="专属客户经理"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="banner">
            <img src="~assets/images/assistant-01.png" alt="">
          </div>

          <div class="inner">

            <div class="superior" @click="mySuperior" v-show="hasSuperior">
              <i class="icon icon-user"></i>
              <span class="name">我的上级</span>
              <i class="icon icon-enter"></i>
            </div>

            <div class="head">
							<div class="photo">
								<img v-if="formTemp.manager.avatar" :src="formTemp.manager.avatar">
                <img v-else src="~assets/images/km-logo.jpg">
							</div>
              <router-link :to="{ name: 'chat.Home', params: { id:  formTemp.manager.id } }" tag="span" class="sp sp-wchat01"></router-link>
						</div>

            <div class="nick">{{ formTemp.manager.real_name || '无专属服务经理' }}</div>

            <div class="score-item score-info">
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

            <div class="detail">
              <div class="item">
                <span>推荐码：</span>
                <span>{{ formTemp.manager.invite_code || '暂无' }}</span>
              </div>
              <div class="item">
                <span>级别：</span>
                <span>{{ formTemp.manager.level || '暂无' }}</span>
              </div>
            </div>

						<div class="info">
              <a v-if="formTemp.manager.mobile" :href="'tel:'+ formTemp.manager.mobile" class="phone">
                <span class="sp sp-task-service-tell"></span>
                <span>给我打电话</span>
              </a>
              <a v-else class="phone" v-on:click="$toast('专属客服经理暂未上传手机号码')">
                <span class="sp sp-task-service-tell"></span>
                <span>给我打电话</span>
              </a>
              <a href="javascript:" class="phone" v-on:click="addWeChat()">
                <span class="sp sp-task-service-wechat"></span>
                <span>加我微信</span>
              </a>
						</div>
          </div>

        </div>

        <div class="tips">
          <h3 class="tit">温馨提示：</h3>
          <p>1、专属客户助理是平台面对用户的第一责任人，在享用平台相关权益的同时，也肩负指导，培训和为用户排忧解惑的责任和义务。投诉电话：400-0188-616</p>
          <!-- <p>2、请如实评分，如果您的专属推荐人服务态度差评率达到10%，他的团队管理收益10元将被取消哦！</p> -->
        </div>
      </div>
    </scroller>

    <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: weChatInfo.title, wx_qrcode: weChatInfo.wx_qrcode, wechat_account: weChatInfo.wechat_account }"></WechatCode>

    <transition name="fade" enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div class="layer-superior" v-show="isSuperior">
        <div class="mask" @click="isSuperior = false"></div>
        <div class="box">
          <div class="head">
            <div class="image">
              <i class="icon icon-user"></i>
            </div>
            <div class="name">我的上级领导</div>
          </div>
          <ul class="list">
            <li class="item" v-for="(item, index) in formTemp.manager.user_list" :key="index">
              <div class="avatar">
                <img :src="item.avatar" alt="">
              </div>
              <div class="content">
                <div class="name">{{ item.real_name || item.user_nickname }}</div>
                <div class="info">
                  <span class="text">级别：</span>
                  <span class="level">{{ item.level_name }}</span>
                  <i class="sp" :class="'sp-level-0' + item.level"></i>
                </div>
              </div>
              <div class="chat wechat" @click="openWeChat(item)">
                <i class="sp sp-wechat01"></i>
                <div class="name">微信聊</div>
              </div>
              <div class="chat wchat" @click="openChat(item.user_id)">
                <i class="sp sp-wchat01"></i>
                <div class="name">微聊</div>
              </div>
              <!-- <router-link :to="{ name: 'chat.Home', params: { id: item.user_id } }" tag="div" class="chat wchat"></router-link> -->
            </li>
          </ul>
          <div class="close" @click="isSuperior = false">
            <i class="icon icon-close"></i>
          </div>
        </div>
      </div>
    </transition>


    <div class="score-btn-group">
      <div class="btn-item">
        <router-link :to="{ name: 'task.MyScore' }" class="link">我的评价</router-link>
      </div>
      <div class="btn-item">
        <router-link :to="{ name: 'task.Score' }" class="link">立即评价</router-link>
      </div>
    </div>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>