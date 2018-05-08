<template>
  <div class="peer-detail-page">
    <app-header title="详细资料"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">

          <div class="main">
            <ul class="list">
              <li class="item">
                <div class="avatar">
                  <img v-if="formTemp.avatar" :src="formTemp.avatar" @click="zoom(formTemp.avatar)">
                  <img v-else src="~assets/images/avatar.png">
                </div>
                <div class="userinfo">
                  <div class="name">{{ formTemp.name }}</div>
                  <div class="chat">
                    <router-link :to="{ name: 'chat.Home', params: { id: formTemp.user_id } }" class="link">
                      <i class="sp sp-wchat01"></i>
                      <span>微聊</span>
                    </router-link>
                  </div>
                  <div class="text company">{{ formTemp.company }}</div>
                  <div class="text">最高<span class="fc">{{formTemp.apply.lender_amount}}元</span>，贷款利率：<span class="fc">{{formTemp.apply.lender_rate}}</span></div>
                </div>
                <div class="tags">
                  <!-- <em class="item">{{ formTemp.business }}</em> -->
                  <div class="tag" v-show="formTemp.apply.repay_date_limit">{{ formTemp.apply.repay_date_limit }}期还款</div>
                  <div class="tag" v-show="formTemp.apply.lender_type">{{ formTemp.apply.lender_type }}</div>
                  <div class="tag" v-show="formTemp.business">{{ formTemp.business }}</div>
                </div>
              </li>
            </ul>
          </div>

          <div class="base-info">基础信息</div>
          <ul class="list-group on">
            <li class="item">
              <span class="icon"><i class="sp sp-peer01"></i></span>
              <span class="name">地区</span>
              <strong v-if="formTemp.position">{{ formTemp.position }}</strong>
							<strong v-else class="write">未填写</strong>
            </li>
            <li class="item">
              <span class="icon"><i class="sp sp-peer02"></i></span>
              <span class="name">电话</span>
              <strong v-if="formTemp.mobile">{{ formTemp.mobile | hidePhone }}</strong>
							<strong v-else class="write">未填写</strong>
            </li>
            <li class="item">
              <span class="icon"><i class="sp sp-peer03"></i></span>
              <span class="name">微信</span>
              <strong v-if="formTemp.wechat_account" v-on:click="isWechat = true">
                <i v-if="formTemp.wx_qrcode" class="sp sp-share"></i>
                <span>{{formTemp.wechat_account }}</span>
              </strong>
							<strong v-else class="write">
                <i v-if="formTemp.wx_qrcode" class="sp sp-share"></i>
                <span>未填写</span>
              </strong>
            </li>
          </ul>

          <div class="base-info">公司信息</div>
          <ul class="list-group">
            <li class="item">
              <span class="icon"><i class="sp sp-peer04"></i></span>
              <span class="name">所在公司及工作证明：</span>
            </li>
          </ul>
          <ul class="image-list">
            <li class="item">
              <div class="image">
								<img v-if="formTemp.apply.work_card" :src="formTemp.apply.work_card" @click="zoom(formTemp.apply.work_card)">
                  <img v-else src="~assets/images/uploading-01.png">
              </div>
              <div class="name">工作证明</div>
            </li>
            <li class="item">
              <div class="image">
                <img v-if="formTemp.apply.company_license" :src="formTemp.apply.company_license" @click="zoom(formTemp.apply.company_license)">
                <img v-else src="~assets/images/uploading-01.png">
              </div>
              <div class="name">营业执照</div>
            </li>
          </ul>

          <ul class="list-group">
            <li class="item">
              <span class="icon"><i class="sp sp-peer05"></i></span>
              <span class="name">贷款信息详情：</span>
            </li>
          </ul>
          <div class="loan-require">
            <div class="title">贷款要求：</div>
            <div class="content">{{ formTemp.apply.lender_desc || '暂无' }}</div>
          </div>

          <div class="btn-add">
            <router-link v-if="1 === formTemp.is_friend * 1" :to="{ name: 'chat.Home', params: { id: formTemp.user_id } }" tag="button">聊天</router-link>
            <button v-if="0 === formTemp.is_friend * 1" type="button" v-on:click="addFriend()">加好友</button>
            <!-- <button type="button">加好友</button> -->
          </div>

        </div>
      </div>
    </scroller>

    <Zoom :image="zoomImage" v-model="isZoom"></Zoom>

    <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: '微信二维码', wx_qrcode: formTemp.wx_qrcode, wechat_account: formTemp.wechat_account }"></WechatCode>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
