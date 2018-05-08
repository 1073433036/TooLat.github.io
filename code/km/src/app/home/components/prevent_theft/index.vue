<template>
  <div class="prevent-theft">
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="image">
            <img src="~assets/images/burglar_brush01.png" alt="">
          </div>
          <div class="image">
            <img src="~assets/images/burglar_brush02.png" alt="">
          </div>
          <div class="image">
            <img src="~assets/images/burglar_brush03.png" alt="">
          </div>
          <div class="image">
            <img src="~assets/images/burglar_brush04.png" alt="">
          </div>
          <div class="image">
            <img src="~assets/images/burglar_brush05.png" alt="">
          </div>
          <div class="image">
            <img src="~assets/images/burglar_brush06.png" alt="">
          </div>
          <div class="common-problem">
            <div class="title">常见问题</div>
            <div class="content">
              <div class="q">Q：银行卡个人账户盗刷具体指什么？</div>
              <div class="a">A：保障你的银行卡被盗刷或被他人胁迫，从而导致银行卡账户内的资金损失。</div>

              <div class="q">Q：保额是是五万说明只能保障我五万的资金？</div>
              <div class="a">A：是的，1年内，银行卡资金损失的上限不得超过保额。</div>

              <div class="q">Q：你们承保的范围是？</div>
              <div class="a">A：本保险承保的个人账户指被保险人名下的下列银行卡：</div>
              <div class="a index">( 1 )  被保险人名下的借记卡；</div>
              <div class="a index">( 2 )  被保险人名下的信用卡卡主卡；</div>
              <div class="a index">( 3 )  以被保险人为持卡人的信用卡附属卡。</div>

              <div class="q">Q：被保险人误信电信 (网络) 诈骗，转款给骗子账户，是否能保？</div>
              <div class="a">A：不可以。承保责任是被盗刷；如果被骗主动打款不在保障范围内。</div>

              <div class="q">Q：什么是除外责任？</div>
              <div class="a">A：又称责任免除，指保险人依照法律规定或合同约定，不承担保险责任的范围，是对保险责任的限制。详见条款。</div>

              <div class="q">Q：如何索取发票？</div>
              <div class="a">A：您可以拨打中国人保客服热线 95518 索取。</div>

              <div class="q">Q：电子保单靠谱么？</div>
              <div class="a">A：中国人保采用电子保险单承保，法律效力等同于纸质保单。</div>

              <div class="q">Q：如何变更保险合同？</div>
              <div class="a">A：如需更新您的客户信息或变更保险合同，请拨打中国人保客服热线 95518。</div>

              <div class="q">Q：退保流程是怎样的？</div>
              <div class="a">A：在本保险合同成立后，您可以以书面形式通知中国人保解除本保险合同，您解除本保险合同时，应提供下列文件和资料：</div>
              <div class="a index">( 1 )  退保申请书 (可通过拨打客服热线获得)；</div>
              <div class="a index">( 2 )  投保人身份证明；</div>
              <div class="a index">您要求解除本保险合同，自中国人保接到保险合同解除申请书之日起，保险合同的效力终止。中国人保收到上述证明文件和资料之日起10个工作日内退还保险单的未满期净保险费；</div>
              <div class="a index">退保险费的计算详见条款；</div>
              <div class="a index">退保金将支付至支付保费的账户；</div>

              <div class="q">Q：我的隐私安全吗？</div>
              <div class="a">A：请放心！我们严格遵守现行的关于个人信息、数据及隐私保护的法律法规，采取充分的技术手段和制度管理，保护您提供给我们的人信息、数据和隐私不受到非法的泄露或披露给未获授权的第三方。您还可以登录中国人保官网：www.epicc.com.cn 查阅人保隐私声明。</div>
              <div class="more">更多详情，请阅读<a href="javascript:" @click.stop="policy = true">《投保须知》</a>和<a href="javascript:">《保险条款》</a></div>
            </div>
          </div>
          <Footing></Footing>
        </div>
      </div>
    </scroller>
    <div class="now-insure">
      <div class="content">
        <div class="money">
          <span>高级会员免费投保:￥</span>
          <span class="name">0.00</span>
        </div>
        <div class="btn">
          <a href="javascript:" @click="payment = true">立即投保</a>
        </div>
      </div>
    </div>

    <Policy v-model="policy"></Policy>
    <Payment v-model="payment"></Payment>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>