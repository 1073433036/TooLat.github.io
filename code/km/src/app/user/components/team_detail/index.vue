<template>
  <div class="user-team-detail-page">
    <app-header title="团队详情"></app-header>
    <div class="banner">
      <div class="user-info">
        <div class="avatar">
          <img v-if="formTemp.base.avatar" :src="formTemp.base.avatar">
          <img v-else src="~assets/images/avatar.png">
        </div>
        <div class="info">
          <h2 class="name">{{ formTemp.base.real_name || '待完善' }}</h2>
          <i class="sp" :class="'sp-level-0' + formTemp.base.level"></i>
          <span class="grade">{{ formTemp.base.level_name || '待完善' }}</span>
          <!-- <p class="phone">{{ formTemp.base.mobile || '待完善' }}</p> -->

          <div class="phone" v-if="level <= 1">
            <a v-if="formTemp.base.mobile" :href="'tel:'+ formTemp.base.mobile">
              <i class="sp sp-task-call"></i>
            </a>
            <i v-else class="sp sp-task-call-diss"></i>
            <i v-if="formTemp.base.wx_qrcode || formTemp.base.wechat_account" class="sp sp-task-wechat" v-on:click="isWechat = true"></i>
            <i v-else class="sp sp-task-wechat-diss"></i>
            <router-link v-if="userInfo.id != userId" :to="{ name: 'chat.Home', params: { id: userId } }" class="chat">
              <i class="sp sp-wchat"></i>
            </router-link>
          </div>
        </div>


      </div>

      <div class="money">
        <i class="sp sp-task-money-02"></i>
        <span>总收益：</span>
        <em>
          <span>￥</span>
          <span>{{ formTemp.base.commission }}</span>
        </em>
      </div>
    </div>
    <scroller
      ref="my_scroller">
      <div class="wrapper">
        <div class="container">
          <div class="advance">
            <p class="advance_title"><i class="arrow"></i><span>进阶之路</span></p>
            <div class="advance_content"><p  v-html="detail"></p></div>
            <div class="progressContainer" v-if ="progressshow"><p class="tips" :style="{left:left}"><span>还差<em>{{people}}</em>名保险<br/>主任可升级</span></p>
               <div class="progress" :style="{width:progress+'%'}">
                  <!-- <div class="tips_wrap"></div> -->
                  <!-- <b>{{progress}}%</b>   -->
               </div>
            </div>
          </div>
          <div class="head-1" v-if="formTemp.base.level == 1">
            <span>实习会员：</span>
            <span class="span-title">已办卡：</span>
            <em>{{formTemp.base.card_number}}张</em>
            <span class="span-title span-cut">招代理：</span>
            <em>{{formTemp.base.agent}}名</em>
          </div>
          <h3>今日锁粉：{{formTemp.base.today_fans }}&nbsp;人</h3>

          <div class="head" v-on:click="handleGoToChild(1, { number: formTemp.base.direct, level_name: '直推锁粉' })">
            <span class="tit">直推锁粉：</span>
            <em>{{formTemp.base.direct}}人</em>
          </div>
          <div class="head" v-on:click="handleGoToChild(2, { number: formTemp.base.indirect, level_name: '间接锁粉' })">
            <span class="tit">间接锁粉：</span>
            <em>{{formTemp.base.indirect}}人</em>
          </div>
          <div v-for="(item, index) in formTemp.base.level_list" class="head" v-on:click="handleGoToChild(0, item)">
            <span class="tit">{{ item.level_name }}<i class="sp" :class="'sp-level-0' + item.level"></i>：</span>
            <em>{{ item.number }}人</em>
            <div class="tye">
              <span>直</span>
              <em>{{ item.zt_number || 0 }}人</em>
            </div>
            <div class="tye tye1">
              <span>直</span>
              <em>{{ item.sx_number || 0 }}人<em>实习</em></em>
            </div>
          </div>

 <!--          <ul class="list">
            <li class="item" v-for="(item, index) in formTemp.card">
              <div class="title">{{ item.credit_card.name }}</div>
              <div class="body">
                <div class="images">
                  <img :src="item.credit_card.thumb">
                  <i class="sp sp-team-01"></i>
                </div>
                <div class="txt">
                  <div class="txt-item">
                    <div class="tit">申请时间</div>
                    <div class="time">{{ item.create_at }}</div>
                  </div>
                  <div class="txt-item">
                    <div class="tit">状态</div>
                    <div class="time">{{ item.status | stateText }}</div>
                  </div>
                </div>
              </div>
            </li>

            <li class="item">
              <div class="title">交通银行标准信用卡普卡</div>
              <div class="body">
                <div class="images">
                  <img src="~assets/images/creditcard-bg.png">
                  <i class="sp sp-team-01"></i>
                </div>
                <div class="txt">
                  <div class="txt-item">
                    <div class="tit">申请时间</div>
                    <div class="time">2017-11-10 13:30:31</div>
                  </div>
                  <div class="txt-item">
                    <div class="tit">通过时间</div>
                    <div class="time">2017-11-10 13:30:31</div>
                  </div>
                </div>
              </div>
            </li>

          </ul> -->
        </div>
      </div>
    </scroller>

    <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: '长按识别二维码', wx_qrcode: formTemp.base.wx_qrcode, wechat_account: formTemp.base.wechat_account }"></WechatCode>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
