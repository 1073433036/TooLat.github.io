<template>
  <div class="auth-flow-page">
    <app-header title="实名认证"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <!-- <app-tips title="申请开通本项功能需进行实名认证，请如实填写信息。"></app-tips> -->

          <div class="container-head">
            <div class="line-box">
              <div class="line line-l "></div>
              <div class="line line-r"></div>
            </div>
            <ul class="step-box">
              <li class="step active">
                <img class="step-btn" src="~assets/images/intelligent_generation/auth_03.png" alt="">
                <p>身份证</p>
              </li>
              <li class="step">
                <img class="step-btn" src="~assets/images/intelligent_generation/auth_05.png" alt="">
                <p>储蓄卡</p>
              </li>
              <li class="step">
                <img class="step-btn" src="~assets/images/intelligent_generation/auth_05.png" alt="">
                <p>手持身份证</p>
              </li>
            </ul>
          </div>
          <div class="form-group">
            <ul class="list">
              <li class="item">
                <div class="box">
                  <div class="head-add-car">
                    <img v-if="idPic" class="photo-cont" alt="图片" :src="idPic"/>
                    <img v-else class="photo-cont" alt="图片" src="~assets/images/intelligent_generation/auth_10.png"/>
                    <input type="file"
                           class="photo-cont"
                           name="image"
                           accept="image/*"
                           ref="file"
                           v-on:change="setImage($event, 'file')"/>
                    <!--<input class="photo-cont" type="file" accept="image/*" @change="uploadLocalPhoto">-->
                  </div>
                </div>
              </li>
            </ul>
            <ul class="list">
              <li class="item">
                <div class="box input-box">
                  <i class="sp-icon sp-user"></i>
                  <div class="name">您的姓名</div>
                  <div class="content">
                    <input type="text"
                           ref="name"
                           class="input-item"
                           v-model="formData.name"
                           placeholder="可编辑">
                    <i class="sp sp-right"></i>
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box input-box">
                  <i class="sp-icon sp-card"></i>
                  <div class="name">身份证号</div>
                  <div class="content">
                    <!--<div class="select">-->
                    <input type="text"
                           class="input-item"
                           placeholder="可编辑"
                           v-model="formData.id_number"/>
                    <i class="sp sp-right"></i>
                    <!--<span>{{'不可编辑' }}</span>-->
                  </div>
                </div>
              </li>
            </ul>

            <div class="submit-btn">
              <button class="btn"
                      :class="{ 'active': active }"
                      :disabled="!active"
                      @click="submitData">
                下一步
              </button>
              <!--<div type="button" class="btn" :class="{active: !submitStatus}" v-on:click.stop="submitData">下一步</div>-->
            </div>
          </div>

        </div>
      </div>
    </scroller>
    <cropper v-on:uploadFileClose="fileClose"></cropper>
  </div>
</template>

<script>
  import Index from './index.js';

  export default Index;
</script>
