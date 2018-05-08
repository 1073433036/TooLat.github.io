<template>
  <div class="wechat_credit_card_sign_page">
    <app-header title="信用卡签约" :isBack="false"></app-header>
    <div class="wrapper">
      <div class="swiper-container" ref="mySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="controller">
              <div class="main">
                <div class="photo">
                  <img src="~assets/images/car-insurance-03.png" alt="">
                </div>
                <form class="form-box" ref="form" @submit.prevent="handleSumbit">
                  <ul class="list">

                    <li class="item">
                      <input type="text"
                        vd-required
                        v-model.trim="formData.company"
                        vd-notify='{
                          "text": "请输入银行卡名称"
                        }'
                        placeholder="请输入银行卡名称">
                    </li>

                    <li class="item">
                      <input type="text"
                        vd-required
                        v-model.trim="formData.card_num"
                        vd-notify='{
                          "text": "请输入月考核下卡张数"
                        }'
                        placeholder="请输入月考核下卡张数">
                    </li>

                    <li class="item">
                      <input type="text"
                        vd-required
                        v-model.trim="formData.total_card"
                        vd-notify='{
                          "text": "请输入月考核激活卡张数"
                        }'
                        placeholder="请输入月考核激活卡张数">
                    </li>

                    <li class="item">
                      <input type="text"
                        vd-required
                        v-model.trim="formData.settle_mode"
                        vd-notify='{
                          "text": "请输入佣金结算方式"
                        }'
                        placeholder="请输入佣金结算方式">
                    </li>

                    <li class="item">
                      <input type="text"
                        vd-required
                        v-model.trim="formData.name"
                        vd-notify='{
                          "text": "请输入联系人"
                        }'
                        placeholder="请输入联系人">
                    </li>

                    <li class="item">
                      <input type="text"
                        vd-required
                        vd-validate
                        v-model.trim="formData.phone"
                        vd-type="phone"
                        vd-notify='{
                          "text": "请输入您的常用手机号码",
                          "patt": "手机号码格式不正确"
                        }'
                        placeholder="请输入您的常用手机号码">
                    </li>

                  </ul>
                  <div class="box">
                    <div class="left box-item" @click="handleChangeAddress('prov')">
                      <div class="text">{{ formData.province || '请选择省份' }}</div>
                      <i class="sp sp-bottom"></i>
                    </div>
                    <div class="right box-item" @click="handleChangeAddress('city')">
                      <div class="text">{{ formData.city || '请选择城市' }}</div>
                      <i class="sp sp-bottom"></i>
                    </div>
                  </div>
                  <div class="affirm">
                    <button type="submit" class="btn" :class="{ 'on': active }" :disabled="!active">立即提交</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-scrollbar" ref="scrollbar"></div>
      </div>
    </div>

		<Selecter v-on:itemClick="dismiss" :change="isShow">
      <ul class="list">
        <li v-for="(item, index) in formTemp.address" class="item" v-on:click="handelClick(item)">{{ item.region_name }}</li>
      </ul>
    </Selecter>

  </div>
</template>

<script>
	import Index from "./index.js";
	export default Index;
</script>