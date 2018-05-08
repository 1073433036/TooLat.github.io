<template>
  <div class="creditcard-progress-query-page">
    <app-header title="进度查询"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="banner">
            <img :src="formTemp.banner">
          </div>
          <div class="bank-logo">
            <div class="logo">
              <img :src="formTemp.thumb_l">
            </div>
          </div>

          <div class="info-wrapper" v-show="0 < formList.length">
            <ul class="list">
              <transition-group enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
                <li class="item" :class="{'on': formData.id === item.id }" v-for="(item, index) in formList" :key="index">
                  <a @click="handelSelectData(item)">
                    <div class="text"><span>姓名：</span>{{ item.real_name }}</div>
                    <div class="text"><span>证件：</span>{{ item.id_card }}</div>
                    <div class="text"><span>电话：</span>{{ item.mobile }}</div>
                    <div class="select">
                      <i class="icon icon-choice"></i>
                    </div>
                  </a>
                  <i class="icon icon-del" @click="deleteData(item)"></i>
                </li>
              </transition-group>
            </ul>
          </div>

          <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
            <div class="add-wrapper" v-show="0 < formList.length && !state.addFlag">
              <a href="javascript:" @click="handleApply()">
                <i class="icon icon-add"></i>
                <span>添加申请人信息</span>
              </a>
            </div>
          </transition>

          <div v-show="0 < formList.length && !state.addFlag" class="button-item">
            <button type="button" class="btn" v-on:click="handleHistSumbit()">查询</button>
          </div>

          <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
            <form v-show="0 >= formList.length || state.addFlag" class="form-group" ref="form" @submit.prevent="handleSumbit">

              <div class="input-item">
                <i class="icon icon-user"></i>
                <span>申请人</span>
                <input vd-required
                  v-model.trim="formData.real_name"
                  type="text"
                  vd-notify='{
                    "text": "请填写申请人姓名"
                  }'
                  placeholder="请填写申请人姓名">
              </div>

              <div class="input-item">
                <i class="icon icon-id-info"></i>
                <span>身份证号</span>
                <input vd-required
                  vd-validate
                  vd-type="identity"
                  v-model.trim="formData.id_card"
                  type="text"
                  vd-notify='{
                    "text": "请输入身份证号",
                    "patt": "身份证号格式不正确"
                  }'
                  placeholder="证件号如有字母, 请注意区分大小写">
              </div>

              <div class="input-item">
                <i class="icon icon-phone"></i>
                <span>手机号</span>
                <input vd-required
                  vd-validate
                  vd-type="phone"
                  v-model.trim="formData.mobile"
                  type="text"
                  vd-notify='{
                    "text": "请输入11位手机号码",
                    "patt": "手机号码格式不正确"
                  }'
                  placeholder="请输入11位手机号码">
              </div>

              <div class="input-item">
                <i class="icon icon-vali"></i>
                <span>验证码</span>
                <input vd-required
                  vd-validate
                  vd-type="smsCode"
                  v-model.trim="formData.verification_code"
                  type="text"
                  vd-notify='{
                    "text": "请输入短信验证码",
                    "patt": "验证码不正确"
                  }'
                  maxlength="6"
                  placeholder="请输入短信验证码">
                  <div class="code">
                    <phoneCode title="获取验证码" :phone="formData.mobile"></phoneCode>
                  </div>
              </div>

              <div class="button-item">
                <button type="submit" class="btn">查询</button>
              </div>
            </form>
          </transition>


          <div id="mycap" ref="mycap"></div>
        </div>
      </div>
    </scroller>

    <Result v-on:handleClose="handleClose" :show="state.resultFlag" :tempData="formData"></Result>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>