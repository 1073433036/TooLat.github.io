<template>
  <div class="carloan-page">
    <app-header title="房产税"></app-header>
    <scroller>
      <div class="wrapper">
        <ul id="list-2" class="list">
          <li class="item">
            <div class="left">
              <span>已有住房面积：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" v-model="formData.amount" class="width" placeholder="0.00">
              </div>
              <div class="tips1">平米</div>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <span>家庭总人数：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" v-model="formData.amount" class="width" placeholder="0.00">
              </div>
              <div class="tips1">人</div>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <span>新购房总价值：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" v-model="formData.amount" class="width" placeholder="0.00">
              </div>
              <div class="tips1">元</div>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <span>新购房面积：</span>
            </div>
            <div class="right">
              <div class="input">
                <input type="text" v-model="formData.amount" class="width" placeholder="0.00">
              </div>
              <div class="tips1">元</div>
            </div>
          </li>
        </ul>
        <div class="calculate">
          <a class="calculate-btn" v-on:click="">开始计算</a>
          <a class="reset-btn" v-on:click="handlereset('areaPageData')">重置</a>
        </div>
      </div>
    </scroller>
    <BotSelect v-on:onChildClick="botSelectClick"
      :title="botTitle"
      :show="isShow"
      :formData="formTemp[formIndex]"
      :formIndex="formIndex"></BotSelect>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>