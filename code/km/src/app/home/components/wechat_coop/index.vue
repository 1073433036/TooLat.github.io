<template>
  <div class="wechat-coop-page">
    <div class="wrapper">
      <div class="container">
        <div class="swiper-container" ref="mySwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/swiper/wechat-coop-bg01.jpg" alt="">
                <router-link :to="{ name: 'insurance.Home' }" class="jump"></router-link>
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/swiper/wechat-coop-bg02.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="image">
                <img class="swiper-img" src="~assets/images/swiper/wechat-coop-bg03.jpg" alt="">
              </div>
              <div class="upward">
                <span class="sp sp-upward"></span>
              </div>
            </div>
            <div class="swiper-slide">
              <img class="auto-img" src="~assets/images/swiper/wechat-coop-bg04.jpg" alt="">
              <div class="content">
                <div class="title">
                  <span>填写资料，加入合伙人</span>
                </div>
                <form class="form-group" ref="form" @submit.prevent="handleSumbit">

                  <div class="input-item">
                    <input type="text"
                      vd-required
                      v-model.trim="formData.name"
                      vd-notify='{
                        "text": "请输入您的名字"
                      }'
                      class="input-text"
                      placeholder="请输入您的名字">
                  </div>

                  <div class="input-item">
                    <input type="text"
                      vd-required
                      vd-validate
                      v-model.trim="formData.phone"
                      vd-type="phone"
                      vd-notify='{
                        "text": "请输入您的常用手机号码",
                        "patt": "手机号码格式不正确"
                      }'
                      class="input-text"
                      placeholder="请输入您的常用手机号码">
                  </div>

                  <div class="input-item">
                    <input type="text"
                      vd-required
                      v-model.trim="formData.business"
                      vd-notify='{
                        "text": "请输入您所属行业"
                      }'
                      class="input-text"
                      placeholder="请输入您所属行业">
                  </div>

                  <div class="input-item">
                    <textarea class="input-textarea"
                      v-model.trim="formData.reason"
                      placeholder="申请理由"></textarea>
                  </div>

                  <ul class="select-list">
                    <li class="item">
                      <div class="box" @click="handleChangeAddress('prov')">
                        <span class="text">{{ formData.province || '请选择省份' }}</span>
                      </div>
                    </li>
                    <li class="item">
                      <div class="box" @click="handleChangeAddress('city')">
                        <span class="text">{{ formData.city || '请选择城市' }}</span>
                      </div>
                    </li>
                  </ul>

                  <ul class="radio-list">
                    <li class="item">
											<div class="info">是否有办公场所：</div>
											<div class="select">
                        <Radio v-model="formData.has_office" :dataList="formTemp.has_office"></Radio>
											</div>
										</li>
										<li class="item">
                      <div class="info">请上传图片</div>
											<div class="select">
                        <span class="file-state" :class="{ 'on': formData.office_image }">{{ formData.office_image ? '已上传' : '未上传' }}</span>
                      </div>
											<i class="sp sp-right"></i>
                      <input type="file"
                        name="image"
                        ref="file"
                        accept="image/*"
                        v-on:change="setImage($event, 'file')"
                        class="input-file">
										</li>
                  </ul>

                  <ul class="radio-list">
                    <li class="item">
                      <div class="info">是否有营业执照：</div>
                      <div class="select">
                        <Radio v-model="formData.has_license" :dataList="formTemp.has_license"></Radio>
                      </div>
                    </li>
                  </ul>

                  <div class="submit-btn">
                    <button type="submit" class="btn" :class="{ 'on': active }" :disabled="!active">立即提交</button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Selecter v-on:itemClick="dismiss" :change="isShow">
      <ul class="list">
        <li v-for="(item, index) in formTemp.address" class="item" v-on:click="handelClick(item)">{{ item.region_name }}</li>
      </ul>
    </Selecter>
    <cropper v-on:uploadFileClose="fileClose"></cropper>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>