<template>
  <main class="student-credit-card-apply-page">
    <app-header :title="bankName + ' 申请'"></app-header>
    <scroller ref="myscroller">

      <!-- <section class="card-type-wrapper">
        <div class="com-header">卡片选择</div>
        <div class="card-selector">
          <ul>
            <li v-for="(el, key) in cards" :key="key"
                :class="{on: key === cardSelected}"
                @click="cardSelected = key">{{ el.name }}</li>
          </ul>
        </div>

        <div class="barner-wrapper">
          <div class="barner" ref="swiperRoot">
            <ul class="swiper-wrapper">
              <li class="swiper-slide">
                <img class="top-img" src="~assets/images/credit-card/card.png" alt="">
              </li>
              <li class="swiper-slide">
                <img class="top-img" src="~assets/images/credit-card/card.png" alt="">
              </li>
            </ul>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
          </div>
        </div>
      </section> -->

      <section class="basic-info-wrapper">
        <div class="info-header com-header">
          <span>基本信息</span>
          <span v-if="userInfo.bankId == 20" @click="goCGB()" class="text">详情</span>
        </div>
        <form class="info_box" ref="form" @submit.prevent="handleSumbit">
          <ul class="info">

            <li class="receiver">
              <em class="name"></em>
              <span class="people">姓名</span>
              <input type="text"
                vd-required
                vd-notify='{
                    "text": "姓名不能为空",
                  }'
                class="input-item"
                placeholder="请输入"
                v-model="userInfo.name">
					  </li>

            <li class="receiver">
              <em class="phone"></em>
              <span class="people">手机号</span>
              <input type="text"
                vd-required
                vd-validate
                vd-type="phone"
                vd-notify='{
                    "text": "手机号不能为空",
                  }'
                class="input-item"
                placeholder="请输入"
                v-model="userInfo.phone">
					  </li>

            <li class="receiver">
              <em class="identity"></em>
              <span class="people">身份证号</span>
              <input type="text"
                vd-required
                vd-notify='{
                    "text": "身份证号不能为空",
                  }'
                class="input-item"
                placeholder="请输入"
                v-model="userInfo.identity">
					  </li>

            <li class="receiver" @click="selectSchool">
              <em class="school"></em>
              <span class="people">大学名称</span>
              <input type="text"
                vd-required
                vd-notify='{
                    "text": "大学名称不能为空",
                  }'
                class="input-item school"
                placeholder="请选择"
                disabled
                v-model="userInfo.school">
              <div class="arrow"></div>
					  </li>

            <!-- <li class="receiver">
              <em class="QQ"></em>
              <span class="people">QQ号码</span>
              <input type="text"
                vd-required
                vd-notify='{
                    "text": "姓名不能为空",
                  }'
                class="input-item"
                placeholder="请输入"
                v-model="userInfo.QQ">
					  </li> -->

            <li class="receiver">
              <em class="studentId"></em>
              <span class="people">学生证号码</span>
              <input type="text"
                vd-required
                vd-notify='{
                    "text": "学生证号码不能为空",
                  }'
                class="input-item"
                placeholder="请输入"
                v-model="userInfo.studentId">
					  </li>

            <li class="receiver">
              <em class="verificationCode"></em>
              <span class="people">验证码</span>
              <input type="text"
                vd-required
                vd-notify='{
                    "text": "验证码不能为空",
                  }'
                class="input-item verificationCode"
                placeholder="请输入"
                v-model="userInfo.verificationCode">
              <phoneCode class="get-code" title="获取验证码" :phone="userInfo.phone"></phoneCode>
					  </li>

          </ul>
          <button type="submit" class="btn" :class="{ 'on': active }" :disabled="!active">立即申请</button>
        </form>
      </section>

    </scroller>

    <section v-show="isApply" class="apply-mask">
      <div class="inner">
        <div class="head">
          <span>申请提醒</span>
          <i class="sp sp-close" v-on:click="isApply = false"></i>
        </div>
        <div class="body">
          <p>大学生网申信用卡，须如实填写直系亲属1（父母或监护人），直系亲属2（父母或监护人）姓名及手机号。</p>
          <p>备注：银行回访电话时，不是其父母或亲属就会被银行拒批。</p>
        </div>

        <div class="foot">
          <div class="btn-group">
            <a class="btn-item close" v-on:click="isApply = false">取消申请</a>
            <span class="btn-item ok" @click="applyCard">继续申请</span>
          </div>
        </div>
      </div>
    </section>

    <notify-popup :content="notifyMsg" :isNotice="isNoticeShow" @toggleNotify="toggleNotifyFn"></notify-popup>

  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
