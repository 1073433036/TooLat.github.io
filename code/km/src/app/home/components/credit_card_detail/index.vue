<template>
  <div class="creditcard-detail-page">
    <app-header title="信用卡介绍"></app-header>
    <scroller>
      <div class="banner">
        <img :src="formTemp.data.thumb" :alt="formTemp.data.name" @click="state.seeFlag=true">
      </div>
      <div class="bank-info">
        <div class="title">{{ formTemp.data.name }}</div>
        <div class="info">
          <div class="text" :class="{ on: state.seeFlag }" v-html="formTemp.data.desc"></div>
        </div>
      </div>

      <div class="profile">
        <div class="big-title">
          <span class="name">告知声明</span>
        </div>
        <div class="content">
          <div class="box">
            <p>本人向{{ formTemp.data.bank.name }}申请信用卡，承诺填写的各项信息均真实、完整，业务申请是否获批及信用卡额度以{{ formTemp.data.bank.name }}信用卡最终审批为准。
            </p>
            <!-- <p>注：用户在哪个账户申请，信用卡佣金就归申请的账号所有。关于信用卡业绩归属的问题，直推的佣金属于谁，业绩就算谁的。</p> -->
            <p v-if="1 >= userInfo.level" class="trial">您当前是实习会员，升级会员后成功办理信用卡最高可以拿{{ formTemp.data.top_bonus }}元的佣金哦！</p>
          </div>
        </div>
      </div>

      <div class="bank-foot">
        <div class="bank-logo">
          <img :src="formTemp.data.bank.thumb_l">
        </div>
        <div class="bank-name">
          <span>单位名称：</span>
          <span>{{ formTemp.data.bank.name }}信用卡中心</span>
        </div>
      </div>

      <div class="apply-btn">
        <a class="btn-item" v-on:click="state.isApply = true">开始申请之旅</a>
      </div>
    </scroller>

    <div v-show="state.isApply" class="apply-mask">
      <div class="inner">
        <div class="head">
          <span class="head_title"><img :src="formTemp.data.bank.thumb" alt="" class="logo_img" /><em class="font">{{ formTemp.data.bank.name }}</em>申请提醒</span>
          <i class="sp sp-close" v-on:click="state.isApply = false"></i>
        </div>
        <div class="body">
          <p>如果您目前持有<em class="font">{{ formTemp.data.bank.name }}</em>信用卡，或在其他平台机构同时申请信用卡，将会影响你的征信查询记录影响下卡率以及卡片额度。<span class="font-red">此次申请银行机构会查询您的个人征信！</span></p>
        </div>

        <div class="foot">
          <div class="btn-group">
            <a class="btn close" v-on:click="state.isApply = false">取消申请</a>
            <router-link :to="{ name: 'home.CreditCardApply', query:{ bid: formTemp.data.bank_id, id: formTemp.data.id,name:this.formTemp.data.bank.name,thumb: this.formTemp.data.bank.thumb }}" class="btn ok">继续申请</router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
