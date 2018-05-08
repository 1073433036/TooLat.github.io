<template>
  <div class="card-share-page">
    <scroller>
      <div class="card-head">
        <app-header :logImg="formTemp.thumb" :title="formTemp.name + '信用卡申请'"></app-header>
      </div>
      <div class="banner">
        <img v-if="3 == query.bid" src="~assets/images/share_card_bg-03.jpg">
        <img v-else-if="4 == query.bid" src="~assets/images/share_card_bg-04.jpg">
        <img v-else-if="5 == query.bid" src="~assets/images/share_card_bg-05.jpg">
        <img v-else-if="6 == query.bid" src="~assets/images/share_card_bg-06.jpg">
        <img v-else-if="7 == query.bid" src="~assets/images/share_card_bg-07.jpg">
        <img v-else-if="8 == query.bid" src="~assets/images/share_card_bg-08.jpg">
        <img v-else-if="9 == query.bid" src="~assets/images/share_card_bg-09.jpg">
        <img v-else-if="10 == query.bid" src="~assets/images/share_card_bg-10.jpg">
        <img v-else-if="11 == query.bid" src="~assets/images/share_card_bg-11.jpg">
        <img v-else-if="17 == query.bid" src="~assets/images/share_card_bg-17.jpg">
        <img v-else src="~assets/images/share_card_bg-01.jpg">
        <div class="user-info">
          <i class="sp sp-share_card_09"></i>
          <div class="top">
            <div class="avatar">
              <router-link class="link" :to="{ name: 'home.PeerDetail', params: { id: userInfo.id } }">
                <img v-if="userInfo.avatar_full" :src="userInfo.avatar_full">
                <img v-else src="~assets/images/default-avatar.png">
              </router-link>
            </div>

            <div class="name-num">
              <h3 class="name">{{ userInfo.real_name || userInfo.user_nickname || '卡盟V金服' }}</h3>
              <div class="num">
                <span>您是第<em>{{ formTemp.avg_apply_num + 1 || 1 }}</em>位申请</span>
              </div>
              <div class="day">
                <span>{{ weatherData.date }} {{ weatherData.week }}</span>
              </div>
            </div>

            <div class="point-weather">
              <div class="weather">
                <i v-if="weatherData.weather" class="sp" :class="'sp-weather-' + weatherData.weather | pinyin"></i>
                <i v-else class="sp sp-weather"></i>
                <span>{{ weatherData.templow || '?' }}°~{{ weatherData.temphigh || '?' }}°</span>
              </div>
              <div class="winddirect">
                <span>{{ weatherData.weather }} -- {{ weatherData.winddirect }}</span>
              </div>
              <div class="point">
                <span>{{ weatherData.city || '未知' }}</span>
              </div>
            </div>
          </div>
          <div class="bot">
            <!-- <div class="tag" v-if="!isWechatClient">{{ formTemp.name | bankName }}信用卡首卡奖金：<span>{{ formTemp.bonus || 0 }}元</span></div> -->
            <div class="tag">{{ formTemp.name | bankName }}信用卡首卡奖金：<span>{{ formTemp.bonus || 0 }}元</span></div>
            <div class="tag">最长免息期：<span>{{ formTemp.free_day || 0 }}天</span></div>
          </div>
        </div>
      </div>
      <div class="wrapper">
				<div class="container">
          <div class="block block-01">
            <div v-show="!isStart" class="start">
              <span>银行数据识别中...</span>
            </div>
            <div class="body" :class="{ on: isStart }">
              <div class="left">
                <div class="data" :class="'data-0' + query.bid">
                  <div class="item-groud">
                    <div class="item">
                      <span>{{ formTemp.avg_apply_num || 0 }}人</span>
                      <p>总申请人数</p>
                    </div>
                    <div class="item">
                      <span>{{ formTemp.avg_quota || 0 }}元</span>
                      <p>平均下卡额度</p>
                    </div>
                  </div>
                </div>

                <div class="node-groud">
                  <div class="node">
                    <i class="sp sp-share_card_02"></i>
                    <div class="text">
                      <span class="tit">年费：首年免年费</span>
                      <p class="desc">刷卡{{ formTemp.free_fee_times || 0 }}次免次年年费</p>
                    </div>
                  </div>

                  <div class="node">
                    <i class="sp sp-share_card_03"></i>
                    <div class="text">
                      <span class="tit">批卡不用查进度</span>
                      <p v-if="11 == query.bid" class="desc">需客户领卡激活结佣金</p>
                      <p v-else class="desc">7-12个工作日自动结算</p>
                    </div>
                  </div>

                </div>
              </div>

              <div class="right">
                <img v-if="3 == query.bid" src="~assets/images/miaopi-05.png">
                <img v-else-if="4 == query.bid" src="~assets/images/miaopi-04.png">
                <img v-else-if="5 == query.bid" src="~assets/images/miaopi-05.png">
                <img v-else-if="8 == query.bid" src="~assets/images/miaopi-08.png">
                <img v-else-if="10 == query.bid" src="~assets/images/miaopi-11.png">
                <img v-else-if="11 == query.bid" src="~assets/images/miaopi-11.png">
                <img v-else-if="17 == query.bid" src="~assets/images/miaopi-05.png">
                <img v-else src="~assets/images/miaopi.png">

                <div class="top">
                  <div class="item">
                    <span>通过率</span>
                  </div>
                  <div class="item">
                    <span>拒批率</span>
                  </div>
                </div>

                <div class="bot">
                  <div class="ok">{{ formTemp.avg_apply_num || 0 }}人</div>
                  <canvas width="200" height="100" class="gauge" ref="foo"></canvas>
                  <div class="num">
                    <div class="num-item">
                      通过率：<span>{{ formTemp.pass_rate || 0 }}%</span>
                    </div>
                    <div class="num-item">
                      拒批率：<span>{{ 100 - formTemp.pass_rate || 0 }}%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>


          <div class="help-inner">
            <div class="title">温馨提示：</div>
            <div class="text">
              <p>银行信用卡首卡佣金奖励，本行的信用卡成功销卡满6个月以上，再次申请本行信用卡均属首卡。</p>
              <p v-if="1 >= userInfo.level" class="trial">您当前是实习会员，您升级会员后成功办理信用卡最高可得{{ formTemp.top_bonus }}元佣金奖励哦！</p>
            </div>
          </div>

          <router-link :to="{ name: 'home.NewbieGuide' }" class="block apply" tag="div">
            <div class="title">
              <span>信用卡申请指南</span>
              <i class="sp sp-apply-help"></i>
            </div>
            <i class="sp sp-right"></i>
          </router-link>

          <div class="block block-02">
            <div class="title">申请条件</div>
            <div class="inner">
              <p>{{ formTemp.apply_need }}</p>
            </div>
          </div>

          <div class="block block-03">
            <div class="title">申请流程</div>
            <div class="inner">

              <ul class="icon-group" v-if="isStudentCard">
                <li class="item">
                  <i class="sp sp-share_card_10"></i>
                  <p>在线申请</p>
                  <i class="sp sp-share_card_08"></i>
                </li>
                <li class="item">
                  <i class="sp sp-share_card_11"></i>
                  <p>银行审批</p>
                  <i class="sp sp-share_card_08"></i>
                </li>
                <li class="item">
                  <i class="sp sp-share_card_12"></i>
                  <p>下卡激活</p>
                  <i class="sp sp-share_card_08"></i>
                </li>
                <li class="item">
                  <i class="sp sp-share_card_13"></i>
                  <p>首刷佣金</p>
                </li>
              </ul>

              <ul class="icon-group" v-else>
                <li class="item">
                  <i class="sp sp-share_card_05"></i>
                  <p>实名手机号</p>
                  <i class="sp sp-share_card_08"></i>
                </li>
                <li class="item">
                  <i class="sp sp-share_card_06"></i>
                  <p>芝麻信用</p>
                  <i class="sp sp-share_card_08"></i>
                </li>
                <li class="item">
                  <i class="sp sp-share_card_07"></i>
                  <p>信用卡</p>
                  <i class="sp sp-share_card_08"></i>
                </li>
                <li class="item">
                  <i class="sp sp-share_card_07"></i>
                  <p>银行审核</p>
                </li>
              </ul>

            </div>
          </div>

        </div>
      </div>
    </scroller>

    <div class="btn">
      <a class="link" v-on:click="applyCard">立即申请</a>
    </div>

    <div v-show="isApply" class="apply-mask">
      <div class="inner">
        <div class="head">
          <span>申请提醒</span>
          <i class="sp sp-close" v-on:click="isApply = false"></i>
        </div>
        <div class="body">
          <p>您好！请问您目前是否持有{{ formTemp.name }}信用卡？如果已经拥有{{ formTemp.name }}信用卡，因为额度共享，无需再重复申请谢谢配合！此次申请无需查进度，佣金自动结算。</p>
        </div>

        <div class="foot">
          <div class="btn-group">
            <a class="btn-item close" v-on:click="isApply = false">取消申请</a>
            <span class="btn-item ok" @click="keepApply">继续申请</span>
          </div>
        </div>
      </div>
    </div>

    <audio ref="audio">
      <source :src="'https://cdn.kamengjinfu.com/assets/audio/audio-0' + query.bid + '.mp3'" type="audio/mpeg">
    </audio>

    <notify-popup :content="notifyMsg" :isNotice="isNoticeShow" :noticeTime="noticeTime" @toggleNotify="toggleNotifyFn"></notify-popup>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
