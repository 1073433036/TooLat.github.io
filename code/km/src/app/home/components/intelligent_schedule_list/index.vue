<template>
  <div class="intelligentschedulelist">
    <app-header title="计划列表"></app-header>
     <div class="Ins_nav">
        <nav>
            <p v-for="(item,$index) in arrNav" :key="$index" @click="toggle($index)" :class="{active:$index==active}">{{item}}</p>
        </nav>
    </div>

      <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="form-group" >
            <ul class="list">
              <li class="item" v-on:click.stop="toListDetail(item.id)" :class="setClass(item.status)" v-for="(item,$index) in orderlist.data" :key="$index">
                <div class="order">
                  <p>
                    <i class="msg_icon"></i>
                    <span class="sn"><em>订单号：{{item.order_sn}}</em>
                      <!--（长按可复制）-->
                    </span>
                    <span :class="['cardCode', { right: item.status == 30 }]">卡尾号：{{ item.card_code }}</span>
                    <i class="delect " v-on:click.stop ="orderStop(item.id,item.order_sn)" :class="{active:item.status == 30}"></i>
                  </p>
                </div>
                <div class="money">
                  <p><span>消费金额 :</span>  <span class="blue">¥{{item.total_fee}}</span></p>
                  <p><span>还款金额 :</span>  <span class="green">¥{{item.money_withdraw}}</span></p>
                </div>
                <div class="service">
                  <p><span>手续费 :</span>  <span class="red">¥{{item.fee}}</span></p>
                </div>
                <div class="date">
                  <span>提交时间：{{item.add_time}}</span>

                  <span v-if="item.status === 10"><i class="waiting"></i>{{item.status_lang}}</span>
                  <span v-else-if="item.status === 20" class="execution_icon"><i class="waiting "></i>{{item.status_lang}}</span>
                  <span v-else-if="item.status === 30" class="error_icon"><i class="waiting "></i>{{item.status_lang}}</span>
                  <span v-else-if="item.status === 40"><i class="succeed_icon "></i>{{item.status_lang}}</span>
                </div>
                <div v-if="item.num >1" class="more-btn" v-on:click.stop="loadMore($index,item.card_id)">
                  <span class="title">查看更多</span>
                </div>
              </li>
             <!--<li class="item" @click="toListDetail">-->
                <!--<div class="order">-->
                  <!--<p>-->
                    <!--<i class="msg_icon"></i>-->
                    <!--<span><em>订单号：T0151161151616</em>（长按可复制）</span>-->
                    <!--<i class="delect "></i>-->
                  <!--</p>-->
                <!--</div>-->
                <!--<div class="money">-->
                  <!--<p><span>消费金额 :</span>  <span>  ¥2000.00</span></p>-->
                  <!--<p><span>还款金额 :</span> <span> ¥2000.00</span></p>-->
                <!--</div>-->
                <!--<div class="service">-->
                  <!--<p><span>消费金额 :</span><span>  ¥2000.00</span></p>-->
                  <!--<p><span>还款金额 :</span><span> ¥2000.00</span></p>-->
                <!--</div>-->
                <!--<div class="date">-->
                  <!--<span>提交时间：2018-4-21  16:20</span>-->
                  <!--<span ><i class="waiting "></i>等待执行</span>-->
                <!--</div>-->
             <!--</li>-->
             <!--<li class="item execution" @click="toListDetail">-->
                <!--<div class="order">-->
                  <!--<p>-->
                    <!--<i class="msg_icon"></i>-->
                    <!--<span><em>订单号：T0151161151616</em>（长按可复制）</span>-->
                    <!--<i class="delect " @click.stop="delectOrder"></i>-->
                  <!--</p>-->
                <!--</div>-->
                <!--<div class="money">-->
                  <!--<p><span>消费金额 :</span>  <span>  ¥2000.00</span></p>-->
                  <!--<p><span>还款金额 :</span> <span> ¥2000.00</span></p>-->
                <!--</div>-->
                <!--<div class="service">-->
                  <!--<p><span>消费金额 :</span><span>  ¥2000.00</span></p>-->
                  <!--<p><span>还款金额 :</span><span> ¥2000.00</span></p>-->
                <!--</div>-->
                <!--<div class="date">-->
                  <!--<span>提交时间：2018-4-21  16:20</span>-->
                  <!--<span class="execution_icon"><i class="waiting "></i>执行中</span>-->
                <!--</div>-->
             <!--</li>-->
             <!--<li class="item error" @click="toListDetail">-->
                <!--<div class="order ">-->
                  <!--<p>-->
                    <!--<i class="msg_icon"></i>-->
                    <!--<span><em>订单号：T0151161151616</em>（长按可复制）</span>-->
                    <!--<i class="delect "  @click.stop="delectOrder"></i>-->
                  <!--</p>-->
                <!--</div>-->
                <!--<div class="money">-->
                  <!--<p><span>消费金额 :</span>  <span>  ¥2000.00</span></p>-->
                  <!--<p><span>还款金额 :</span> <span> ¥2000.00</span></p>-->
                <!--</div>-->
                <!--<div class="service">-->
                  <!--<p><span>消费金额 :</span><span>  ¥2000.00</span></p>-->
                  <!--<p><span>还款金额 :</span><span> ¥2000.00</span></p>-->
                <!--</div>-->
                <!--<div class="date">-->
                  <!--<span>提交时间：2018-4-21  16:20</span>-->
                  <!--<span class="error_icon"><i class="waiting "></i>失败</span>-->
                <!--</div>-->
             <!--</li>-->
             <!--<li class="item succeed" @click="toListDetail">-->
                <!--<div class="order">-->
                  <!--<p>-->
                    <!--<i class="msg_icon"></i>-->
                    <!--<span><em>订单号：T0151161151616</em>（长按可复制）</span>-->
                    <!--<i class="delect "  @click.stop="delectOrder"></i>-->
                  <!--</p>-->
                <!--</div>-->
                <!--<div class="money">-->
                  <!--<p><span>消费金额 :</span>  <span>  ¥2000.00</span></p>-->
                  <!--<p><span>还款金额 :</span> <span> ¥2000.00</span></p>-->
                <!--</div>-->
                <!--<div class="service">-->
                  <!--<p><span>消费金额 :</span><span>  ¥2000.00</span></p>-->
                  <!--<p><span>还款金额 :</span><span> ¥2000.00</span></p>-->
                <!--</div>-->
                <!--<div class="date">-->
                  <!--<span>提交时间：2018-4-21  16:20</span>-->
                  <!--<span class="succeed_icon"><i class="waiting "></i>等待执行</span>-->
                <!--</div>-->
             <!--</li>-->
            </ul>
          </div>

        </div>
      </div>

      <section class="tip-wrapper">
        为了更好的完善您的账单，请您查看计划列表中的刷卡、还款时间，有些计划是第二天才会还款，请知悉！
      </section>
    </scroller>



  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
