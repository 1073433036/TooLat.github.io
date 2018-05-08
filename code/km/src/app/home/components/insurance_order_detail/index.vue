<template>
  <main class="insuranceInformation">
    <app-header title="订单详情"></app-header>
    <scroller ref="myscroller">

      <section class="basic_info_wrapper">
        <div class="info_header">基本信息</div>
        <form class="info_box" ref="form" @submit.prevent="handleSumbit">
          <ul class="info">
            <li class="detail_list" @click="handleBotSelectChange('plan')">
              <span class="people">申根之王-珍珠计划</span>
              <span class="input-item date ">{{userInfo.plan ? userInfo.plan:'请选择' }}</span>
              <div class="arrow"></div>
            </li>
            <li class="detail_list"  @click="handleBotSelectb('details')">
              <span class="people">保障内容</span>
              <span class="input-item date ">{{userInfo.details ? userInfo.details:'请选择' }}</span>
              <div class="arrow"></div>
            </li>

            <li class="detail_list"  @click="handleBotSelectChange('insurePlan')">
              <span class="people">投保计划</span>
              <span class="input-item date ">{{userInfo.insurePlan ? userInfo.insurePlan:'请选择' }}</span>
              <div class="arrow"></div>
            </li>

            <li class="detail_list"  @click="handleDateChange('insureDate')">
              <span class="people">投保日期</span>
              <span class="input-item date ">{{userInfo.insureDate ? userInfo.insureDate:'请选择' }}</span>
              <div class="arrow"></div>
            </li>  
            <li class="detail_list"  @click="handleDateChange('insureDeadline')">
              <span class="people">保障期限</span>
              <span class="input-item date ">{{userInfo.insureDeadline ? userInfo.insureDeadline:'请选择' }}</span>
              <div class="arrow"></div>
            </li>  
          </ul>
          <ul class="info">
            <li class="detail_list">
              <span class="people">姓名</span>
              <input type="text"
                class="input-item"
                placeholder="请输入"
                v-model="userInfo.name">
              <div class="arrow"></div>
            </li> 
             <li class="detail_list">
              <span class="people">被投保人</span>
              <input type="text"
                class="input-item"
                placeholder="请输入"
                v-model="userInfo.insured">
              <div class="arrow"></div>
            </li>
          </ul>
        </form>
        <div class="insure_payment">
          <p class="insure_payment_msg">付款信息</p>
          <p class="content">
            <span>保费</span>
            <span class="price">￥500.00<!-- {{premium}} --></span>
          </p>
        </div>
        <div class="insure_order">
          <p class="insure_order_msg">订单信息</p>
          <div class="content">
            <p>订单号： <span>ANGK122222222<!-- {{orderNumber}} --></span></p>
            <p>下单时间： <span>2018-4-17   16:30:31<!-- {{orderTime}} --></span></p>
          </div>
        </div>
        <div class="foot"></div>
      </section>

    </scroller>
    <div class="information_insure">
       <p class="price"><span>￥320.00</span>&nbsp;起</p>
       <p class="account">(推广费￥15.00)</p>
       <p class="insure" @click="handlePayClick('pay')"><span>立即投保</span></p>
     </div>
    <Dates v-on:onDateClick="handelDateClick" :show="isShow" :today="false"></Dates>
    <BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BombBox>
    <BotSelectB v-on:onChildClick="botSelectbClick" :title="botTitle" :show="Showa" :formData="formTemp[formIndex]" :formIndex="formIndex"></BotSelectB>
    <BotSelect v-on:onChildClick="botSelectClick" :title="botTitle" :show="Show" :formData="formTemp[formIndex]" :formIndex="formIndex"></BotSelect>
    <PayType v-on:payTypeClick="botPayClick" :title="botTitle" :show="Showpay" :formData="formTemp[formIndex]" :formIndex="formIndex">
    </PayType>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
