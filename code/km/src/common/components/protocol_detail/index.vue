<template>
  <transition name="slide">
  <div v-if="isOpenProtocol" class="protocol_detail_page">
    <h3 v-if="hasTitle" class="protocol-title">{{title}}</h3>
    <div class="protocol-content">
      <div class="wrapper">
        <scroller>
          <div class="detail" v-if="isHtml" v-html="protocolContent"></div>
          <div class="detail" else>
            <h1 class="h1">卡盟v金服支付协议</h1>
            <ul class="protocol-list">
              <h3>一、声明与承诺</h3>
              <li>（一） 请您确认，在您注册成为“卡盟v金服”用户以接受本服务，使用本服务前，您已充分阅读、理解并接受本协议的全部内容，一旦您使用本服务，即表示您同意遵循本协议之所有约定。
              </li>
              <li>（二）您同意，本公司有权随时对本协议内容进行单方面的变更，并以在本网站公告的方式予以公布，无需另行单独通知您；若您在本协议内容公告变更后继续使用本服务的，表示您已充分阅读、理解并接受修改后的协议内容，也将遵循修改后的协议内容使用本服务；若您不同意修改后的协议内容，您应停止使用本服务。
              </li>
              <li>（三）您保证，在您同意接受本协议并注册成为“卡盟v金服”的用户时，您已经年满18周岁，或者您是在中国大陆地区合法开展经营活动或其他业务的法人或其他组织；本协议内容不受您所属国家或地区法律的排斥。不具备前述条件的，您应立即终止注册或停止使用本服务。您在使用支付宝或网银服务时，应自行判断对方是否是完全民事行为能力人并自行决定是否与对方进行交易或转账给对方等，且您应自行承担与此相关的所有风险。
              </li>
              <li>（四）您同意，您在“卡盟v金服”，域名为（www.kamengjinfu.com）上发生的所有交易，同时本公司有权从“卡盟v金服”获取您的相关信息。本公司按照“卡盟v金服”的指令进行资金的冻结、扣划完全来自于您的授权，本公司对因此给您造成的任何损失均不承担责任。
              </li>
              <h3>二、关于“卡盟v金服”收费说明</h3>
              <li>（一）所有在“卡盟v金服”购买的产品，都不允许任何形式的退换。</li>
              <li>（二）用户付完款后可以在个人中心-看到已买到的产品，之后可以进行使用。</li>
              <li>（三）在“卡盟v金服”充值的金额仅能作为在“卡盟v金服”购买产品使用，不找零，不进行兑换现金服务。</li>
              <h3>三、支付服务使用限制</h3>
              <li>（一） 您在使用本服务时应遵守中华人民共和国相关法律法规、您所在国家或地区之法令及相关国际惯例,不将本服务用于任何非法目的（包括用于禁止或限制交易物品的交易），也不以任何非法方式使用本服务。
              </li>
              <li>
                <span>
                  （二）您不得利用本服务从事侵害他人合法权益之行为，否则本公司有权拒绝提供本服务，且您应承担所有相关法律责任，因此导致本公司或本公司雇员或其他方受损的，您应承担赔偿责任。上述行为包括但不限于：
                </span>
                <p>1、侵害他人名誉权、隐私权、商业秘密、商标权、著作权、专利权等合法权益。</p>
                <p>2、违反依法定或约定之保密义务。</p>
                <p>3、冒用他人名义使用本服务。</p>
                <p>4、从事不法交易行为，提供黄色、赌博、暴力等不良信息。</p>
              </li>
            </ul>
          </div>
        </scroller>
      </div>
    </div>
    <!-- <div class="protocol-choose">
      <div class="input-group">
        <input type="checkbox" id="checkbox" v-model="isAccept" value="accept" ref="checkbox">
        <label for="checkbox">
          <em class="rect"></em>
          <span class="tx-span">我已阅读并接受该协议</span>
        </label>
      </div>
    </div> -->
    <div class="protocol-end-btn" v-on:click.stop="closeProtocol">关闭</div>
  </div>
  </transition>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>