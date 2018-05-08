<template>
  <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
    <div class="policy" :value="value" v-show="visible" @click="cancel">
      <div class="wrapper" @click.stop>
        <div class="title">投保须知</div>
        <scroller>
          <div class="container">
            <ul class="list">

              <li class="item">
                <span class="num">1、</span>
                <div class="content">仅限持卡人本人投保，年龄18-60周岁；</div>
              </li>

              <li class="item">
                <span class="num">2、</span>
                <div class="content">本保险每人限投一份，且投保人和被保险人默认为同一人；</div>
              </li>

              <li class="item">
                <span class="num">3、</span>
                <div class="content">本保险承保的个人账户指被保险人名下的下列银行卡：①被保险人名下的借记卡；②被保险人名下的信用卡主卡；③以被保险人为持卡人的信用卡附属卡。</div>
              </li>

              <li class="item">
                <span class="num">4、</span>
                <div class="content">本保险自投保当日起第6日零时生效 (含本日，即投保日为01月01日，则保险的生效日为01月06日零时)，保险期间为1年；</div>
              </li>

              <li class="item">
                <span class="num">5、</span>
                <div class="content">每次事故按子账户实际损失赔付，如全年发生多次盗刷、盗用事故，可多次赔付，但以保险合同载明的保险金额为限；</div>
              </li>

              <li class="item">
                <span class="num">6、</span>
                <div class="content">如需变更保单信息或退保，请拨打人保客服热线：95518 ；</div>
              </li>

              <li class="item">
                <span class="num">7、</span>
                <div class="content">如发生盗刷、盗用等事故，请尽快拨打发卡银行客服电话进行挂失或冻结，同时向公安机关报案，保留相关证明并拨打人保客服热线：95518报案。</div>
              </li>

              <li class="item">
                <span class="num">8、</span>
                <div class="content">本产品通过互联网在全国区域销售。</div>
              </li>

              <li class="item">
                <span class="num">9、</span>
                <div class="content">同时请您了解，在投保本产品前您应履行相应的如实告知义务，具体如下：投保人或被保险人应如实填写投保信息，并就保险公司体术的询问据实告知，否则保险公司有权限据《中华人民共和国保险法》第十六条的规定解除保险合同且不承担赔偿责任；订立保险合同时，保险公司就保险标的或被保险人的有关情况提出询问的，投保人应如实告知。</div>
              </li>

              <li class="item">
                <div class="content">投保人故意或者因重大过失未履行前款规定的如实告知义务，足以影响保险公司决定是否同意承保或者提高保险费率的，保险公司有权解除合同。投保人故意不履行如实告知义务的，保险公司对于合同解除前发生的保险事故，不承担赔偿责任，并不退还保险费。投保人因重大过失未履行如实告知义务，对保险事故的发生有严重影响的，保险公司对于合同解除前发生的保险事故，不承担赔偿责任，但退还保险费。</div>
              </li>

            </ul>
          </div>
        </scroller>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>