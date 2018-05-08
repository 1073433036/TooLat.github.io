<template>
  <main class="intelligentAuthenticationInformation">
    <app-header title="添加信用卡"></app-header>
    <scroller ref="myscroller">
      <section class="basic_info_-wrapper">
        <header class="bank_code">
          <em class="bank_code_icon"></em>
          <p><span class="people">招商银行</span><span>信用卡</span><span> 谭***</span> <span>6225********4893</span></p>
        </header>
        <form class="info_box" ref="form" @submit.prevent="handleSumbit">
          <ul class="info">
            <li class="detail_list" >
              <em class="cvn2"></em>
              <span class="people">CVN2</span> <i class="query"></i>
                <input type="text"
                class="input-item"
                placeholder="请输入信用卡背后CVN2后3位数"
                v-model="userInfo.cvn2">
              <div class="arrow"></div>
            </li>
            <li class="detail_list" >
              <em class="validity"></em>
              <span class="people">有效期</span> <i class="query"></i>
               <input type="text"
                class="input-item"
                placeholder="请输入有效期月年（如0922）"
                v-model="userInfo.validity">
              <div class="arrow"></div>
            </li>
            <li class="detail_list"  >
              <em class="phone"></em>
              <span class="people">手机号码</span>
                <input type="text"
                class="input-item"
                placeholder="请输入银行预留号码"
                v-model="userInfo.phone">
              <div class="arrow"></div>
            </li>
          </ul>
          <ul class="info">
            <li class="detail_list">
              <em class="code"></em>
              <span class="people">验证码</span>
              <input type="text"
              class="  getCode_input"
              placeholder="请输入验证号码"
              v-model="userInfo.code">
              <phoneCode class="getCode" title="获取验证码" :phone="userInfo.code"></phoneCode>
            </li>
            <!-- <li class="detail_list imgcode_list"  >
              <em class="code"></em>
              <span class="people">验证码</span>
                <input type="text"
                class="  getCode_input"
                placeholder="请输入验证号码"
                v-model="userInfo.phone">
                <button class="getCode">获取验证码</button>
              <div class="arrow"></div>
               <phoneCode class="get-code" title="获取验证码" :phone="userInfo.phone"></phoneCode> -->
            <!-- </li>  -->
          </ul>
        </form>
        <button class="btn" :class="{ 'on': active }" :disabled="!active" @click = "next">确认开通</button>
      </section>
    </scroller>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
