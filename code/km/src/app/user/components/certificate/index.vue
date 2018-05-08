<template>
  <div class="user-certificate-page">
    <app-header title="授权证书"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div v-show="isCanvas" class="canvasImg">
            <img :src="canvasImage">
          </div>

          <div v-show="!isCanvas" class="content" ref="content">
            <img src="~assets/images/certificate.png">
            <div class="user-name">
              <span class="name">{{ formTemp.name }}</span>
              <span class="tips">(工号：{{ formTemp.job_no }})</span>
            </div>
            <div class="jobs">
              <!-- <span>职位：{{ formTemp.job }}</span> -->
              <span>职位：{{ userInfo.level_name }}</span>
            </div>

            <div class="desc" v-if="userInfo.level == 1">
              <p>尊敬的用户您尚未成为高级会员，暂不享受代理权限，无法享受推广银行信用卡、贷款、账单管理汽车保险等业务的推广收益。</p>
            </div>
            <div class="desc" v-else>
              <p>为卡盟金服正式用户，尊享代理特权。办理推广银行信用卡，贷款，账单管理，征信查询，汽车保险等互联网拓客推广业务。</p>
            </div>

            <div class="info">
              <div class="title">授权信息：</div>
              <div class="txt">
                <p>
                  <em>授权码</em>
                  <span>{{ formTemp.auth_code }}</span>
                </p>
                <p>
                  <em>有效期</em>
                  <span>{{ formTemp.auth_code_start }}—{{ formTemp.auth_code_end }}</span>
                </p>
              </div>
            </div>

            <div class="company">
              <img src="~assets/images/seal.png">
              <span>广州卡盟信息科技有限公司</span>
            </div>
          </div>

          <div class="foot">
            <button type="button" v-on:click="certificate()">更新授权证书</button>
          </div>
        </div>
      </div>
    </scroller>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>