<template>
  <div class="intelligentProjectDetails">
    <app-header title="计划详情"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="container_header">
              <div class="item">
                <p>¥{{orderList.extend.pay}}</p>
                <p>已消费金额</p>
              </div>
              <div class="item">
                <p>¥{{orderList.extend.repay}}</p>
                <p>已还款总金额</p>
              </div>
              <div class="item">
                <p>¥{{orderList.extend.o}}</p>
                <p>手动可提金额</p>
              </div>
          </div>

          <section class="tip-wrapper">
            为了更好的完善您的账单，请您查看计划列表中的刷卡、还款时间，有些计划是第二天才会还款，请知悉！
          </section>

          <div class="form-group" >
            <ul class="list">
              <li class="item" v-for="(item,index) in orderList.data" :key="index">
                <div class="date">
                  <span>日期：</span>
                  <span>{{item.plan_pay_time}}</span>
                  <span class="money"> ¥{{item.total_fee}}</span>
                </div>
                <div class="bill"><i class="msg_icon"></i>
                  <span>{{item.order_type == 1 ? '消费账单' : '还款账单'}}</span>
                  <span class="status" v-if="item.status == 10"><i class="waiting "></i>等待执行</span>
                  <span class="status" v-if="item.status == 20">执行中</span>
                  <span class="status error_icon error" v-if="item.status == 30"><i class="waiting "></i>执行失败</span>
                  <span class="status green succeed_icon" v-if="item.status == 40"><i class="waiting "></i>执行成功</span>
                </div>
              </li>
              <!--<li class="item">-->
                <!--<div class="date">-->
                  <!--<span>日期：</span>-->
                  <!--<span>2018/4/19 </span>-->
                  <!--<span>12:20:21</span>-->
                  <!--<span class="money"> ¥ 152.88</span>-->
               <!--</div>-->
               <!--<div class="bill"><i class="msg_icon"></i><span>消费账单</span><span class="status">执行成功</span></div>-->
              <!--</li>-->
             <!--<li class="item">-->
                <!--<div class="date">-->
                   <!--<span>日期：</span>-->
                   <!--<span>2018/4/19 </span>-->
                   <!--<span>12:20:21</span>-->
                   <!--<span class="money"> ¥ 152.88</span>-->
                <!--</div>-->
                <!--<div class="bill">-->
                  <!--<i class="msg_icon"></i>-->
                  <!--<span>消费账单</span>-->
                  <!--<span class="status error">执行成功</span>-->
                  <!--<span class="cancel">(手动取消)</span>-->
                <!--</div>-->
               <!--</li>-->
            </ul>
          </div>
          <!--<button type="submit" class="resume">继续执行</button>-->
        </div>
      </div>
    </scroller>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
