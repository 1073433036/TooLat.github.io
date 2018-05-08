<template>
  <div class="income-tax-page">
    <app-header :title="title" :other="isOther" v-on:other="hanldeOther"></app-header>
    <scroller>
      <div class="wrapper">
        <div v-show="homePage" class="mianPage">
          <div class="change-btn-group">
            <a class="gone-btn active-btn" @click="goTaxfOrTaxgPage($event, 'taxgone')">计算税后</a>
            <a class="forward-btn" @click="goTaxfOrTaxgPage($event, 'taxforward')">反推税前</a>
          </div>

          <div v-show="isTaxgPage">
            <ul class="list">
              <li class="item">
                <div class="left">
                  <span>税前工资：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.loanAmount" class="width" placeholder="请填写">
                  </div>
                  <div class="tips">元</div>
                </div>
              </li>
              <li class="item" @click="handleCityShowChange">
                <div class="left">
                  <span>城市：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" class="readyonly-input" v-model="loan_forward_province.region_name" readonly placeholder="请选择">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <router-link :to="{ name: 'home.IncomeTax', params: {id: 'rate'}}">
                <li class="item bordernone">
                  <div class="left">
                    <span>社保及公积金比例：</span>
                  </div>
                  <div class="right">
                    <div class="input">
                      <input type="text" class="readyonly-input" v-model="formData.loanDeadline.name" readonly placeholder="请选择">
                    </div>
                    <i class="sp sp-right"></i>
                  </div>
                </li>
              </router-link>
            </ul>
            <div class="calculate">
              <router-link :to="{ name: 'home.IncomeTax', params: {id: 'result'}}">
                <a class="calculate-btn">开始计算</a>
              </router-link>
                <a class="reset-btn" v-on:click="handlereset">重置</a>
            </div>
          </div>

          <div v-show="!isTaxgPage">
            <ul class="list">
              <li class="item">
                <div class="left">
                  <span>税后工资：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.loanAmount" class="width" placeholder="请填写">
                  </div>
                  <div class="tips">元</div>
                </div>
              </li>
              <li class="item" @click="handleCityShowChange">
                <div class="left">
                  <span>城市：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" class="readyonly-input" v-model="loan_back_provice.region_name" readonly placeholder="请选择">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item bordernone" @click="handleBotSelectChange('loanDeadline')">
                <div class="left">
                  <span>社保及公积金比例：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" class="readyonly-input" v-model="formData.loanDeadline.name" readonly placeholder="请选择">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>
            <div class="calculate">
              <a class="calculate-btn" v-on:click="">开始计算</a>
              <a class="reset-btn" v-on:click="handlereset">重置</a>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <div v-show="!homePage" class="components">
      <component :is="componentName" ref="subcomponent" v-on:changeOtherEvent="changeIsother"></component>
    </div>
    <BotSelect v-on:onChildClick="botSelectClick"
      :title="botTitle"
      :show="isShow"
      :formData="formTemp[formIndex]"
      :formIndex="formIndex"></BotSelect>
    <CityList></CityList>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>