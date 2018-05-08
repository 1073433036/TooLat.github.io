<template>
  <div class="rate-choice-page">
    <ul class="list">
      <li class="item" @click="sendRateChoice('rateChoiceData')">
        <div class="left">
          <span>利率选择：</span>
        </div>
        <div class="right">
          <div class="input">
            <input type="text" class="readyonly-input" v-model="formData.rateChoice" readonly placeholder="请选择">
          </div>
          <i class="sp sp-right"></i>
        </div>
      </li>
      <li class="item" @click="handleRadioChoose">
        <div class="left">
          <span>基准利率</span>
        </div>
        <div class="right">
          <div class="input">
            <input type="radio" name="ratechoice" class="radio-input" v-model="formData.radio" value="basic">
          </div>
          <i class="sp sp-active"></i>
        </div>
      </li>
      <li class="item" @click="handleRadioChoose">
        <div class="left">
          <span>7折基准利率</span>
        </div>
        <div class="right">
          <div class="input">
            <input type="radio" name="ratechoice" class="radio-input" v-model="formData.radio">
          </div>
          <i class="sp"></i>
        </div>
      </li>
      <li class="item" @click="handleRadioChoose">
        <div class="left">
          <span>85折基准利率</span>
        </div>
        <div class="right">
          <div class="input">
            <input type="radio" name="ratechoice" class="radio-input" v-model="formData.radio" value="">
          </div>
          <i class="sp"></i>
        </div>
      </li>
      <li class="item" @click="handleRadioChoose">
        <div class="left">
          <span>1.1倍基准利率</span>
        </div>
        <div class="right">
          <div class="input">
            <input type="radio" name="ratechoice" class="radio-input" v-model="formData.radio">
          </div>
          <i class="sp"></i>
        </div>
      </li>
      <li class="item">
        <div class="left">
          <span style="color:#b8b8b8;">自定义折扣</span>
        </div>
        <div class="right">
          <div class="input">
            <input type="text" v-model="formData.customDiscount" class="width" placeholder="请填写">
          </div>
          <div class="tips">%</div>
          <router-link :to="{name: 'home.Houseloan'}">
            <a id="confirm-btn">确定</a>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>