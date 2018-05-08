<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="service_agreement" :value="value" v-show="visible">
      <div class="header">
        <a href="javascript:" class="back" @click="cancel"></a>
        <div class="title">卡盟金服平台推广规则</div>
      </div>
      <scroller>
        <div class="wrapper">
          <div class="container">
            
            <div class="tips">为了进一步规范卡盟金服业务推广宣传的合规性，维护平台与合作机构的权益，提升卡盟平台声誉，推动平台健康稳定发展，必须坚持-合规展业，良性发展。</div>

            <div class="title">一、卡盟金服是一个推广服务平台，我们作为银行、保险公司的拓客推广服务商，与平台上所有银行及保险公司均签署的是互联网推广协议，显示推广仅限于代理商在互联网上进行宣传推广，建议代理商不到街面摆摊设点，当然，大家可以针对性的找公司，写字楼，工厂等机型批量办卡。</div>


           <div class="title">二、卡盟平台为符合条件的用户的个人账户安全险由中国人保承保，保险公司也仅对投保生效的用户提供个人账户的保险服务，并非对平台或是所有用户承保，宣传推广时，一定要明确说明，不得误导客户，以免产生不必要的误会。</div>    
           <div class="title">三、代理商在进行推广时，请务必严格遵守以下规定：</div>



            <div class="content"><p>1、不得发布与国家法律法规相悖的推广内容</p>
                <p>2、不得以任何理由，利用卡盟金服名义在任何平台从事注册账户、发布信息、招聘等活动：例如58或B0SS直聘上招聘<p/>
                <p>3、不得虚假宣传，更不得向任何人信用卡申请或贷款额度承诺<p/>
                <p>4、不得以任何理由向办信用卡、贷款或汽车保险的用户收取任何费用<p/>
                <p>5、不得利用明显带有贬义的内容进行恶意引流。例如：诈骗、骗局、传销等<p/>
                <p>6、不得使用暗示的内容进行宣传或诱导用户做违法违规的行为。例如：信用卡套现等<p/>
                <p>7、不得使用和传播任何未经卡盟平台授权学科的图文资料。例如：公司营业执照、公司合同等<p/>
            </div>

            <div class="title">四、代理商在推广信用卡时，请严格遵守卡盟金服信用卡申请操作规范指南</div>

            <div class="content">
                <p>1、禁止银行黑名单用户在平台申请信用卡</p>
                <p>2、信用卡申请必须由申请人本人填写。禁止代劳</p>
                <p>3、填写申请资料时，务必真实有效，不得伪造虚构信息进行申请。如：暂无业，可以填写上一份工作的单位信息</p>
               <p> 4、如无信用卡需求，请不要随意申请，下卡不激活，照样会影响到诚信记录，严重的将会被列入银行黑名单</p>
            </div>

            <div class="content">卡盟金服代理商在拓客推广服务过程中，凡有违反以上任何一条规范的，一律冻结账号，永不解封！卡盟平台对此不警告，不提示，不作解释。凡因违规推广，给用户、平台或是合作商造成损失的，卡盟金服将直接向有关管理机构举报，并将协助追回所有非法所得，同时，公司还将保留进一步追诉损失的权利。</div>

        

          </div>
        </div>
      </scroller>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>