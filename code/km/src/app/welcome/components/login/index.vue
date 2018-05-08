<template>
  <div class="login-page">
    <scroller>
      <div class="wrapper">
        <div class="login-bg">
          <img src="~assets/images/login-bg.jpg" alt="">
        </div>
        <div class="company-logo">
          <div class="image">
            <img src="~assets/images/register-logo.png" alt="">
          </div>
        </div>
				<div class="KaMun">
					<div class="photo">
						<img src="~assets/images/kamengjinfu-02.png" alt="">
					</div>
				</div>
        <div class="login-box">
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">
            <ul class="list">

              <li class="item">
                <div class="content">
                  <i class="icon icon-phone"></i>
                  <input type="text"
                    v-model.trim="formData.username"
                    vd-required
                    vd-validate
                    vd-type="phone"
                    vd-notify='{
                      "text": "手机号码不能为空",
                      "patt": "手机号码格式不正确"
                    }'
                    placeholder="请输入手机号码">
                </div>
              </li>

              <li class="item">
                <div class="content">
                  <i class="icon icon-password"></i>
                  <input type="password"
                    v-model.trim="formData.password"
                    vd-required
                    placeholder="请输入密码">
                  <router-link :to="{ name: 'welcome.Findpwd' }" class="getpass">忘记密码</router-link>
                </div>
              </li>

<!--               <li class="item">
                <div class="content">
                  <i class="icon icon-vali"></i>
                  <input vd-required
										v-model.trim="formData.code"
										type="text"
										vd-notify='{
											"text": "请输入短信验证码",
										}'
										maxlength="6"
                    placeholder="请输入短信验证码">
                  <div class="code">
										<phoneCode title="获取验证码" :phone="formData.username"></phoneCode>
									</div>
                </div>
              </li> -->

            </ul>
            <div class="submit-btn">
              <button type="submit" class="btn" :class="{ 'on': active }" :disabled="!active">登录</button>
            </div>
          </form>
<!--           <div class="go-register">
            <span>还不是卡盟v金服的会员？</span>
            <router-link :to="{ name: 'welcome.Register' }">去注册</router-link>
          </div> -->
        </div>
        <!-- <div class="regsiter-btn" @click="linkToRegister">注册账号</div> -->
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
