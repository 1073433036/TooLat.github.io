<template>
  <div class="app-car-rules-query-page">
    <app-header title="违章查询"></app-header>
      <scroller>
        <div class="wrapper">
          <div class="query-top">
            <div class="top-nav">
              <span class="active">实时报价</span>
             <!--  <span>待报价</span>
              <span>不可代办</span> -->
            </div>
            <div class="top-title" v-if="isShowPage">
              <img :src="userInfo.avatar_full" alt="">
              <p>您的违章还不多，赶紧处理吧~</p>
            </div>
          </div>
          <div class="query-list" v-if="isShowPage">
            <div class="query-item" v-for="(item, index) in peccancyList" :key="index">
              <div class="input-group">
                <span class="rect"></span>
              </div>
              <ul class="detail-list">
                <li>
                  <span class="item-h">违章状态：</span>
                  <span class="item-c item-c-color1">未处理</span>
                </li>
                <li>
                  <span class="item-h">违章地点：</span>
                  <span class="item-c">{{ item.location }}</span>
                </li>
                <li>
                  <span class="item-h">违章时间：</span>
                  <span class="item-c">{{ item.time }}</span>
                </li>
                <li>
                  <span class="item-h">违章行为：</span>
                  <span class="item-c">{{ item.reason }}</span>
                </li>
                <li>
                  <span class="item-h">提示：</span>
                  <span class="item-c"></span>
                </li>
              </ul>
              <ul class="car-rules-detail-list">
                <li>
                  <h4>扣分</h4>
                  <span class="item-c-color1">{{ item.actual_degree }}</span>
                </li>
                <li>
                  <h4>服务费</h4>
                  <span class="item-c-color1">￥{{ item.servicePrice }}</span>
                </li>
                <li>
                  <h4>罚款</h4>
                  <span class="item-c-color1">￥{{ item.count }}</span>
                </li>
                <li>
                  <h4>滞纳金</h4>
                  <span class="item-c-color1">￥{{ item.latefine }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="query-tips" v-else>
            <div class="box" >
              <div class="left" @click="handleWechatCode(2)">
                <i class="sp sp-service-01"></i>
                <div class="service">客服1号</div>
              </div>
              <div class="right" @click="handleWechatCode(2)">
                <i class="sp sp-service-02"></i>
                <div class="service">客服2号</div>
              </div>
            </div>
            <div class="user-tips">
              <div class="hint">【温馨提示】</div>
              <p>违章处理周期需要1-3个工作日，请您安排好处理时间，以免到期产生滞纳金，感谢您的配合！</p>
            </div>
          </div>
        </div>
      </scroller>

      <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
        <div v-show="isWechat" class="mask-inner">
          <div class="inner">
            <div class="content">
              <div class="head">
                <span>客服微信二维码</span>
                <i v-on:click="isWechat = false" class="sp sp-close"></i>
              </div>

              <div class="body">
                <div class="qr-code">
                  <img src="~assets/images/qr_code_kf_03.jpg">
                  <!-- <img v-else src="~assets/images/qr_code_kf_02.jpg"> -->
                </div>
              </div>
              <div class="foot">
                <h3>长按二维码添加客服</h3>
                <p>为了更好的解决问题，请添加客服微信号</p>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="nocarbreak-tips" v-if="isShowNoPeccancyTips">
        <div class="tips-content">
          <h3>提示</h3>
          <p>查询当前车辆无违章信息！因个别地区数据更新存在差异，如您对查询信息有疑问，可以联系客服进行人工服务处理，感谢您的配合！</p>
          <!-- <div class="cancel-btn">取消</div> -->
          <div class="confirm" v-on:click.stop="isShowNoPeccancyTips = false">确定</div>
        </div>
      </div>

      <div class="bottom-bar" v-if="isShowPage">
        <div class="left">
          <p class="amount">共计费用：<span class="color-span1">￥{{ totalCount }}</span></p>
          <div class="degree">
            <span>扣分：<em>{{ totalDegree }}</em>分</span>
            <span>罚款：<em>￥{{ punishMoney }}</em></span>
          </div>
          <!-- <p class="tips">
            <span class="service-tips" v-on:click.stop="popupTransactionTips">
              <i class="sp sp-help-info"></i>
              服务须知
            </span>
            已选<span class="color-span2">1</span>条
          </p> -->
        </div>
        <div class="right">
          <div class="submit-btn" v-on:click.stop="submitOrder">提交订单</div>
        </div>
      </div>

      <div class="query-order-detail" v-if="isShowOrderDetail">
        <div class="order-detail-wrapper">
          <header class="head">
            <div class="back-btn" v-on:click.stop="closeOrderDetailPage"></div>
            订单详情
          </header>
          <scroller>
            <div class="wrapper">
              <ul class="order-list" v-for="(item, index) in peccancyList">
                <div class="order-index">{{index + 1}}/1</div>
                <li>
                  <span class="item-h">违章内容：</span>
                  <span class="item-c">{{ item.reason }}</span>
                </li>
                <li>
                  <span class="item-h">违章地点：</span>
                  <span class="item-c span-color1">{{ item.location }}</span>
                </li>
                <li>
                  <span class="item-h">违章时间：</span>
                  <span class="item-c">{{ item.time }}</span>
                </li>
                <li>
                  <span class="item-h">罚款金额：</span>
                  <span class="item-c">￥{{ item.count }}</span>
                </li>
                <li>
                  <span class="item-h">扣分情况：</span>
                  <span class="item-c">{{ item.actual_degree }}分</span>
                </li>
                <li>
                  <span class="item-h">服务费用：</span>
                  <span class="item-c span-color2">￥{{ item.servicePrice }}</span>
                </li>
              </ul>
            </div>
          </scroller>
          <footer class="footer">
            <div class="amount">
              <p class="fl">总金额：<span class="span-color1">￥{{ totalCount }}</span></p>
              <p class="fr">总扣分：<span class="span-color1">{{ totalDegree }}</span></p>
            </div>
            <div class="pay-btn" v-on:click.stop="goOrderPayPage">去支付</div>
          </footer>
        </div>
      </div>

      <div class="transaction-tips" v-if="isShowTransactionTips">
        <div class="tips-content">
          <h2>办理须知</h2>
          <div class="tips-items">
            <h3>一、订单说明</h3>
            <p>1、付款成功后请勿通过其他渠道重复处理，产生的纠纷不作退款。</p>
            <p>2、周期一年以内已经使用过三本证为同一台车处理后，后续需要在处理简称超证。</p>
            <h3>二、以下情况可能会产生订单金额外的补款费用，届时客服会联系您商议补款相关事宜，敬请留意：</h3>
            <p>1、车辆发生超证或0分0罚款违章</p>
            <p>2、车辆在机场路段违章</p>
            <p>3、公司车0分订单</p>
            <p>4、粤XYE字母开头车牌在外省违章</p>
            <p>5、提交的违章与实际处理违章罚款金额不一致</p>
          </div>
          <div class="btn-group">
            <div class="cancel-btn" v-on:click.stop="handleCancel">不同意</div>
            <div class="accept-btn" v-on:click.stop="handleAccept">同意并创建订单</div>
          </div>
        </div>
      </div>

      <div class="repair-popup" v-if="isShowRepairPopup">
        <div class="repair-content">
          <h3>根据交通管理局的违章处理需求，您若需要下单处理，则需要补充此车车主的行驶证、驾驶证等相关资料。</h3>
          <div class="cancel-btn" v-on:click.stop="isShowRepairPopup = false">取消</div>
          <router-link :to="{name: 'home.AppRepairData'}">
            <div class="confirm-btn">补充资料</div>
          </router-link>
        </div>
      </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>