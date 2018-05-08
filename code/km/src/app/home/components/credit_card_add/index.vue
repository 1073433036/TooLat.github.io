<template>
  <div class="credit-card-page">
    <app-header title="添加信用卡"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">
            <div class="input-item">
              <i class="sp sp-card"></i>
              <span>卡号</span>
              <input vd-required
                v-model="formData.cardNum"
                type="text"
                maxlength="19"
                vd-notify='{
                  "text": "信用卡卡号不能为空",
                  "patt": "信用卡卡号格式不正确"
                }'
                placeholder="输入信用卡卡号">
            </div>
            <div class="input-item" v-on:click="chnageBank()">
              <i class="sp sp-bank"></i>
              <i class="sp sp-right"></i>
              <span>银行</span>
              <input vd-required
                v-model="bankName"
                type="text"
                vd-notify='{
                  "text": "请选择发卡银行"
                }'
                readonly
                placeholder="选择发卡银行">
            </div>
            <div class="input-item">
              <i class="sp sp-username"></i>
              <span>姓名</span>
              <input vd-required
                v-model="formData.userName"
                type="text"
                vd-notify='{
                  "text": "请输入持卡人姓名",
                  "patt": "持卡人姓名格式不正确"
                }'
                placeholder="输入持卡人姓名">
            </div>
            <div class="button-item">
              <button type="submit" class="btn" :class="{ transit: active }" :disabled="!active">下一步</button>
            </div>
          </form>
        </div>
      </div>
    </scroller>

    <Banks></Banks>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>