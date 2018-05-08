<template>
  <main class="IntelligentAddCreditCardsV2">
    <app-header title="添加信用卡"></app-header>
    <scroller ref="myscroller">
      <section class="basic_info_-wrapper">
        <form class="info_box" ref="form" @submit.prevent="handleSumbit">
          <ul class="info">
            <li class="detail_list" >
              <em class="cvn2"></em>
              <span class="people">CVN2</span> <i class="query"></i>
                <input type="text"
                class="input-item"
                placeholder="请输入信用卡背后CVN2后3位数"
                v-model="formDta.cvn2">
              <div class="arrow"></div>
            </li>
            <li class="detail_list" >
              <em class="validity"></em>
              <span class="people">有效期</span> <i class="query"></i>
               <input type="text"
                class="input-item"
                placeholder="请输入有效期月年（如0922）"
                v-model="formDta.validity">
              <div class="arrow"></div>
            </li>
            <li class="detail_list"  @click="handleBotSelectChange('bank_list')">
              <em class="billDate"></em>
              <span class="people">发卡银行</span>
              <span class="input-item school date">{{formDta.bank_list.bank_name ? formDta.bank_list.bank_name:'请选择发卡银行' }}</span>
              <div class="arrow"></div>
            </li>
            <li class="detail_list"  @click="handleBotSelectChange('bill_date')">
              <em class="billDate"></em>
              <span class="people">账单日</span>
              <span class="input-item school date">{{formDta.bill_date.name ? formDta.bill_date.name:'请设置账单日' }}</span>
              <div class="arrow"></div>
            </li>
            <li class="detail_list"   @click="handleBotSelectChange('due_date')">
              <em class="dueDate"></em>
              <span class="people" >还款日</span>
              <span class="input-item school date">{{formDta.due_date.name ? formDta.due_date.name:'请设置还款日' }}</span>
              <div class="arrow"></div>
            </li>
            <li class="detail_list"  >
              <em class="phone"></em>
              <span class="people">手机号码</span>
                <input type="text"
                class="input-item"
                placeholder="请输入银行预留号码"
                v-model="formDta.phone">
              <div class="arrow"></div>
            </li>
          </ul>
          <ul class="info">
            <!--<li class="detail_list"  >-->
              <!--<span class="refresh"></span>-->
                <!--<input type="text"-->
                <!--class=" imgcode_input"-->
                <!--placeholder="请输入图像验证码"-->
                <!--v-model="formDta.imgcode">-->
                <!--<p  class="ram_Code">2355</p>-->
              <!--<em class="imgcode"></em>-->
            <!--</li>-->
              <li class="detail_list">
                <em class="code"></em>
                <span class="people">验证码</span>
                <input type="text"
                class="  getCode_input"
                placeholder="请输入验证号码"
                v-model="formDta.code">
                <phoneCode class="getCode" title="获取验证码" :phone="formDta.phone"></phoneCode>
              </li>
          </ul>
        </form>
        <button class="btn" :class="{ 'on': active }" :disabled="!active" @click = "next">添加信用卡</button>
      </section>
    </scroller>
    <BotSelect v-on:onChildClick="botSelectClick" :title="botTitle" :show="Show" :formData="formTemp[formIndex]" :formIndex="formIndex" :isBankList="isBankList"></BotSelect>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
