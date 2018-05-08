<template>
  <div class="simulate4-page">
    <app-header title="模拟结果">
      <div class="slot next" slot="right">
        <router-link :to="{ name: 'home.Home' }">
          <i class="sp sp-home-white"></i>
        </router-link>
      </div>
    </app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="header">
            <div class="center">
              <i class="sp sp-simulate"></i>
              <h2 class="tips">{{ formTemp.title }}</h2>
            </div>
          </div>

          <div class="main">
            <div class="text">
              <p>本平台根据您填写的资料信息进行模拟计算得出以下结果（仅供参考，真实结果以各银行实际评估为准，感谢您的使用！）</p>
            </div>

            <div class="content">
              <div class="item">
                <span>推荐办理：</span>
                <div class="bank-gorup">

                  <div v-for="(item, index) in formTemp.bank_list" class="bank">
                    <router-link :to="{ name: 'home.CreditCardList', params: { bid: item.id } }">
                      <img :src="item.thumb">
                      <span>{{ item.name }}</span>
                    </router-link>
                    <i v-if="item.t" class="sp sp-bank-recommend"></i>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="bank-money">
            <div class="content" v-on:click="handleBankChange()">
              <i class="sp sp-unionpay-01"></i>
              <span>银行预审额度查询</span>
							<i class="sp sp-sea"></i>
              <i class="sp sp-right"></i>
            </div>
          </div>

          <div class="footer">
            <router-link :to="{ name: 'home.Simulate1' }" class="link">
              重新评估
            </router-link>
          </div>

        </div>
      </div>
    </scroller>

    <Bank v-on:bankClick="handleBankClick" :show="isBankShow"></Bank>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>