<template>
  <div class="creditcard-share-info-page">
    <app-header title="个人信息"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="top">
            <div class="require">
              <div class="avatar">
                <img v-if="userInfo.avatar_full" :src="userInfo.avatar_full" alt="">
                <img v-else src="~assets/images/default-avatar.png" alt="">
              </div>
            </div>
            <div class="require">
              <div class="nick">{{ userInfo.user_nickname }}</div>
            </div>
          </div>
          <div class="body">
            <form class="form-group" ref="form" @submit.prevent="handleSumbit">

              <div class="input-item">
                <i class="icon icon-user"></i>
                <span>姓名</span>
                <input vd-required
                  v-model.trim="formData.name"
                  type="text"
                  vd-notify='{
                    "text": "请输入真实姓名",
                  }'
                  placeholder="请输入真实姓名">
              </div>

              <div class="input-item">
                <i class="icon icon-phone"></i>
                <span>手机号</span>
                <input vd-required
                  vd-validate
                  vd-type="phone"
                  v-model.trim="formData.phone"
                  type="text"
                  vd-notify='{
                    "text": "请输常用手机号码",
                    "patt": "手机号码格式不正确"
                  }'
                  placeholder="请输常用手机号码">
              </div>

              <div class="input-item">
                <i class="icon icon-vali"></i>
                <span>验证码</span>
                <input vd-required
                  v-model.trim="formData.code"
                  type="text"
                  vd-notify='{
                    "text": "请输入短信验证码",
                  }'
                  placeholder="请输入短信验证码">
                  <div class="code">
                    <phoneCode title="获取验证码" :phone="formData.phone"></phoneCode>
                  </div>
              </div>

              <div class="input-item">
                <i class="icon icon-password"></i>
                <span>登录密码</span>
                <input vd-required
                  vd-validate
                  vd-type="password"
                  v-model.trim="formData.password"
                  type="password"
                  vd-notify='{
                    "text": "登录密码不能为空",
                    "patt": "登录密码格式不正确"
                  }'
                  placeholder="设置新登录密码">
              </div>

              <div class="input-item">
                <i class="icon icon-wechat"></i>
                <span>微信号</span>
                <input vd-required
                  v-model.trim="formData.wechat_account"
                  type="text"
                  vd-notify='{
                    "text": "请输入微信号",
                  }'
                  placeholder="请输入微信号">
              </div>

              <div class="input-item">
                <i class="icon icon-code"></i>
                <span>上传微信二维码</span>
                <input type="file"
                  class="input-file"
                  name="image"
                  accept="image/*"
                  ref="file"
                  v-on:change="setImage($event, 'code')"/>
                <span class="state" :class="{ 'on': formData.wx_qrcode }">{{ formData.wx_qrcode ? '已上传' : '未上传'}}</span>
                <div class="enter"></div>
              </div>

              <div class="input-item">
                <div id="captcha"></div>
              </div>

              <!-- <div class="input-item">
                <i class="icon icon-certificates"></i>
                <span>工号</span>
                  <div class="code"><span class="text">{{ formData.jobNumber }}</span></div>
              </div> -->

              <!-- <div class="input-item upload" @click="state.authFlag = true"> -->
              <router-link :to="{ name: 'user.Certify' }" class="input-item upload" tag="div">
                <i class="icon icon-id-info"></i>
                <span>上传身份证信息<span class="text">（非必填）</span></span>
                <div class="enter"></div>
              </router-link>

              <div class="button-item">
                <button type="submit" class="btn" :class="{ on: state.active }" :disabled="!state.active">提交资料</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </scroller>
    <transition name="fade" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
      <div class="auth-layer" v-show="state.authFlag">
        <app-header title="验证" :isBack="false">
          <div class="slot" slot="right" @click="state.authFlag = false">
            <span class="text">取消</span>
          </div>
        </app-header>
        <!-- <form class="form-group">
          <ul class="upload">
            <li class="item">
              <div class="box">
                <div class="image">
                  <img src="~assets/images/identity-just.png">
                </div>
                <span>身份证正面</span>
                <input type="file" class="input-item" name="file" accept="image/*">
              </div>
            </li>
            <li class="item">
              <div class="box">
                <div class="image">
                  <img src="~assets/images/identity-back.png">
                </div>
                <span>身份证反面</span>
                <input type="file" class="input-item" name="file" accept="image/*">
              </div>
            </li>
            <li class="item">
              <div class="box">
                <div class="image">
                  <img src="~assets/images/identity-self.png" class="w130">
                </div>
                <span>手持身份证</span>
                <input type="file" class="input-item" name="file" accept="image/*">
              </div>
            </li>
          </ul>
          <div class="submit-btn">
            <button type="submit" class="btn" :class="{'active': state.authSubmit}" :disabled="!state.authSubmit">确定</button>
          </div>
        </form> -->
      </div>
    </transition>
    <cropper v-on:uploadFileClose="fileClose"></cropper>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
