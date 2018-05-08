<template>
  <div class="car_break_rules_verify">
    <app-header title="身份验证" :other="true" v-on:other="goCarBreakHomePage"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="add-car-main">
          <div class="carinfo-title">以下信息仅供交管局查询，我们将严格保密</div>
          <ul class="carinfo-list mar-bottom">
            <li class="list-item">
              <span>车牌号</span>
              <span class="car-number">{{formData.carPrefix}}{{formData.carNumber}}</span>
              <span class="icon"><img src="~assets/images/break-icon-xiangji.png" alt=""></span>
            </li>
            <li class="list-item icon">
              <span class="title">车身架号<img src="~assets/images/break-icon-tanhao.png" alt=""></span>
              <span><input type="text" placeholder="请输入车身架号" v-model="formData.carCode"></span>
            </li>
            <li class="list-item icon">
              <span class="title">发动机号<img src="~assets/images/break-icon-tanhao.png" alt=""></span>
              <span><input type="text" placeholder="请输入发动机号" v-model="formData.carDriveNumber"></span>
            </li>
          </ul>
          <ul class="carinfo-list">
            <li class="item">
              <div class="title">违章通知及年检提醒</div>
              <div class="content">
                <div class="switch-checked">
                  <input type="checkbox" class="open_audio" id="isShowTime1" v-model="formData.isShowTime1">
                  <label for="isShowTime1" class="green"></label>
                </div>
              </div>
              <div class="icon"></div>
            </li>
            <li class="list-item icon">
              <span class="title">手机号码</span>
              <span><input type="text" placeholder="请输入手机号码"></span>
            </li>
          </ul>
        </div>
        <button @click="saveInquire">保存并查询</button>
      </div>
      </scroller>
      <CityList :remark="cityRemark"></CityList>

      <botSelect :show="isShowBotSelect"
      :formData="carPrefixList"
      v-on:dismissEvent="isShowBotSelect = false"
      v-on:chenkedItemEvent="checkedCarPrefix"></botSelect>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>