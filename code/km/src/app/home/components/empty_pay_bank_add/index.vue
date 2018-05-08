<template>
  <div class="addbank-page">
    <app-header title="添加信用卡"></app-header>
      <div class="wrapper" v-if="!hasIntegralChannel">
        <div class="container">
          <div class="form-group">
            <ul class="list">
             <!--  <li class="item">
                <div class="box">
                  <div class="name">户名</div>
                  <div class="content">
                    <input type="text" class="input-item"  v-model="formData.cardName" placeholder="请填写姓名">
                  </div>
                </div>
              </li> -->
              <li class="item">
                <div class="box">
                  <div class="name">卡号</div>
                  <div class="content">
                    <input type="text"
                    class="input-item"
                    v-model="formData.card_no"
                    maxlength="19"
                    placeholder="请填写所持信用卡号码">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box box-bank">
                  <div class="name1">所属银行</div>
                  <div class="content1" v-on:click.stop="chnageBank">
                    <input type="text"
                    class="input-bank"
                    v-model="bankName"
                    readonly
                    placeholder="选择发卡银行">
                    <i class="sp sp-right"></i>
                  </div>
                </div>
              </li>
<!--               <li class="item">
                <div class="box">
                  <div class="name">卡类型</div>
                  <div class="content">
                    <div class="text">信用卡</div>
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">cvn2安全码</div>
                  <div class="content">
                    <input type="text" class="input-item" v-model="formData.cardSafeCode" placeholder="请填写安全码（背面后三位）">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">信用卡有效期</div>
                  <div class="content">
                    <input type="text" class="input-item" v-model="formData.cardPeriod" placeholder="月年，如：0720">
                  </div>
                </div>
              </li> -->
            </ul>
            <div class="submit-btn">
              <div class="btn" :class="{'active': !submitStatus}" v-on:click="submitUserData">确认</div>
            </div>
          </div>
        </div>
      </div>
    <iframe v-else-if="hasIntegralChannel" ref="iframe" class="iframe" :src="myUrl" frameborder="0"></iframe>

    <Banks></Banks>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>