<template>
  <div class="intelligentIdentity">
    <app-header title="实名认证"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <!-- <app-tips title="申请开通本项功能需进行实名认证，请如实填写信息。"></app-tips> -->
          <div class="container-head">
            <div class="line-box">
              <div class="line line-l "></div>
              <div class="line line-r" ></div>
            </div>
            <ul class="step-box">
              <li class="step active">
                <img class="step-btn" src="~assets/images/intelligent_generation/auth_03.png" alt="">
                <p>身份证</p>
              </li>
              <li class="step">
                <img class="step-btn" src="~assets/images/intelligent_generation/auth3_03.png" alt=""/>
                <!-- <img class="step-btn" src="~assets/images/intelligent_generation/auth_05.png" alt=""> -->
                <p>储蓄卡</p>
              </li>
              <li class="step">
                <img class="step-btn" src="~assets/images/intelligent_generation/auth3_05.png" alt=""/>
                <!-- <img class="step-btn" src="~assets/images/intelligent_generation/auth_05.png" alt=""> -->
                <p>手持身份证</p>
              </li>
            </ul>
          </div>

          <div class="form-group" >
            <ul class="list">
              <li class="item">
                <div class="box">
                  <div class="head-add-car">
                    <img class="photo-cont" alt="图片" src="~assets/images/intelligent_generation/auth3_10.png" />
                  </div>
                </div>
              </li>
            </ul>
            <ul class="list">
              <li class="item">
                <div class="box">
                  <div class="head-add-car">
                    <img v-if="handIdPic" class="photo-cont" alt="图片" :src="handIdPic"/>
                    <img v-else class="photo-cont" alt="图片" src="~assets/images/intelligent_generation/auth3_13.png" />
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

            <div class="submit-btn">
              <button class="btn"
                      :class="{ 'active': active }"
                      :disabled="!active"
                      @click="submitData">提交</button>
              <!--<div type="button" class="btn" v-on:click.stop="submitData">提交</div>-->
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
