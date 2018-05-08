<template>
  <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
    <div class="agreement-page" :value="value" v-show="visible">
      <div class="agreement-box">
        <scroller>
          <div class="content">
            <div class="title">用户购买协议</div>
            <div class="text indent mb40">如果选择点击“确认授权查询”将视为授权“广州卡盟科技信息有限公司”（以下简称“本公司”）向合法的第三方支付机构/第三方征信机构/金融机构等提交您的信用查询申请，本公司根据查询结果汇总生成您的相关信用数据报告。</div>
            <div class="text indent">您同意本公司？授权协议？服务条款。内容如下：</div>
            <div class="text indent mb40">一，授权服务条款：</div>
            <div class="text">1，本公司报告均需由本人授权查询，依据截止提交查询申请的时间查询所得结果汇总生成该信用报告，本公司有义务为您保密信用报告，在未经您本人的授权同意的情况下不会向任何第三方泄露您的相关信息。</div>
            <div class="text">2，您理解，为了给您提供客观，科学，全面的信用管理及评价，以及其他本协议项下服务的需要，您授权我们可以从合法保存有您信息的第三方，采集及处理您的各类信息，同时为避免每次采集都需要经过您的反复确认而导致过程繁杂，或者因此给您带来的不便，您同意第三方可直接向我们提供您的信息而不需要您的再次授权。采集您的信息包括但不限于您的个人信息，行为信息，交易信息，资产信息，设备信息等，目前采集后展示信息包括：芝麻信用相关，芝麻分，芝麻信用欺诈风险</div>
          </div>
        </scroller>
        <i class="icon icon-close" @click="cancel"></i>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>