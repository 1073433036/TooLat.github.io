<template>
  <div class="auth-photo-page">
    <app-header title="实名认证"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <app-tips title="卡盟金服信贷流量服务平台：申请开通本项功能需进行实名认证，请如实填写信息。"></app-tips>
          <div class="nav">
            <ul class="list">
              <li class="item on">
                <span class="name">储蓄卡实名认证</span>
              </li>
              <li class="item on">
                <span class="name">附件提交</span>
              </li>
            </ul>
          </div>
          <div class="form-group">
            <ul class="upload">
              <li class="item">
                <div class="box">
                  <div class="image">
                    <img v-if="formData.avatarFront" :src="formData.avatarFront">
                    <img v-else src="~assets/images/identity-just.png">
                  </div>
                  <span>身份证正面</span>
                  <input
                  type="file"
                  class="input-item"
                  name="file" accept="image/*"
                  v-on:change="setImage($event,'avatarFront')">
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="image">
                    <img v-if="formData.avatarBack" :src="formData.avatarBack">
                    <img v-else src="~assets/images/identity-back.png">
                  </div>
                  <span>身份证反面</span>
                  <input type="file"
                  class="input-item"
                  name="file"
                  accept="image/*"
                  v-on:change="setImage($event,'avatarBack')">
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="image">
                    <img v-if="formData.avatarHand" :src="formData.avatarHand">
                    <img v-else src="~assets/images/identity-self.png" class="w130">
                  </div>
                  <span>手持身份证</span>
                  <input type="file"
                  class="input-item"
                  name="file"
                  accept="image/*"
                  v-on:change="setImage($event,'avatarHand')">
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="image">
                    <img ref="lastUploadImg" v-if="formData.avatarCard" :src="formData.avatarCard">
                    <img v-else src="~assets/images/identity-bank.png">
                  </div>
                  <span>储蓄卡照片</span>
                  <input type="file"
                  class="input-item"
                  name="file"
                  accept="image/*"
                  v-on:change="setImage($event,'avatarCard')">
                </div>
              </li>
            </ul>
            <div class="submit-btn">
              <button type="button" v-on:click="handleSubmit" class="btn" :class="{'active': state.active}" :disabled="!state.active">下一步</button>
            </div>
          </div>
        </div>
      </div>
    </scroller>

    <cropper :cardId="cardId" :imgMark="imgMark"></cropper>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
