<template>
  <main class="intelligentCreditCardManager">
    <app-header title="添加信用卡" :other = "other" :goBack = "handleBack"></app-header>
    <scroller ref="myscroller">
      <section class="basic_info_-wrapper">
          <div class="card_list"  v-for="(item, index) in cardList"
               :key="index" :style="{background:`url(${item.bank.background})`}">
            <div class="logo"> <img :src="item.bank.thumb"></div>
            <div class="card_detail">
                <ul>
                  <li>
                    <p>{{item.bank_name}}</p>
                    <p  :class="item.act === 2 ? 'red' : 'green'">
                      <span class="bg-wiite">{{item.act === 2 ? '未执行' : '已执行'}}</span>
                    </p>
                    <p>还款日：<span>{{item.repay_date}}</span></p>
                  </li>
                  <li>
                    <p class="fontcolor">信用卡</p>
                    <p>{{item.name}} </p>
                    <p>账单日：<span >{{item.bill_date}}</span></p>
                  </li>
                  <li>
                    <p>{{item.card_code}}</p>
                    <p class="delect"><i></i><span :data-id="item.id" @click="removeCard" class="fontcolor">删除</span></p>
                  </li>
                </ul>
            </div>
              <div class="card-bottom">
                <div><p><i class="msg_icon approve "></i><span :data-id="item.id" @click = "authentication(index)">{{item.is_bind === 0 ? '点击认证' : '已认证'}}</span></p></div>
                <div><p><i class="msg_icon list"></i><span :data-id="item.id" :data-index = 'index' @click="appointmentList(index)">预约列表</span></p></div>
                <div><p><i class="msg_icon refund"></i><span :data-id="item.id" :data-index = 'index'  @click="appointmentReservation(index)">预约还款</span></p></div>
              </div>
          </div>
          <div class="submit_add">
            <div type="button" class="btn" v-on:click.stop="addCreditcar()"><i class="sp sp-add"></i>添加信用卡</div>
          </div>

        <div class="tip-wrapper">
          <ul class="step">
            <li>认证信用卡</li>
            <li>预约还款</li>
            <li>预约列表</li>
          </ul>
          <ul class="step-text">
            <li>第一步：认证信用卡</li>
            <li>第二步：制定计划</li>
            <li>第三步：查看计划</li>
          </ul>
        </div>

        <div class="ad-print">
          <div class="title">温馨提示</div>
          <div class="sm-title">尊敬的用户您好！本通道为落地商户通道，为了更好的完善您信用卡账单，建议您最好预留11%-12%的预留资金，同时要确保在执行计划期间卡内有足够的金额（如自己绑定微信、支付宝消费、卡内临时额度到期、卡内产生分期费用等），否则可能会导致计划执行失败。</div>
        </div>
      </section>
    </scroller>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
