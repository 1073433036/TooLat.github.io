<template>
  <div class="car-insurance-limt-page">
    <app-header :title="carLicenseNo"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="insurance-company-info">

          <div class="company-item" v-for="(item, index) in formTemp.list">
            <div class="logo">
              <img v-if="item.i" :src="item.i.logo" alt="">
              <img v-else src="~assets/images/increase-03.png" alt="">
            </div>
            <div class="insurance-info">
              <h3 v-if="item.i">{{ item.i.name }}</h3>
              <h3 v-else-if="item.q">{{ item.q.prvName }}</h3>
              <div class="limit">
                <h4>
                  <span class="name" v-if="item.q">{{ item.q.taskStateDescription }}</span>
                  <span class="img-icon">
                    <img v-if="item.q && item.q.taskState == 2" src="~assets/images/quoteinfo/status2.png" alt="">
                    <img v-if="item.q && item.q.taskState == 13" src="~assets/images/quoteinfo/status13.png" alt="">
                    <img v-if="item.q && item.q.taskState == 14" src="~assets/images/quoteinfo/status14.png" alt="">
                    <img v-if="item.q && item.q.taskState == 16" src="~assets/images/quoteinfo/status16.png" alt="">
                    <img v-if="item.q && item.q.taskState == 19" src="~assets/images/quoteinfo/status19.png" alt="">
                    <img v-if="item.q && item.q.taskState == 20" src="~assets/images/quoteinfo/status20.png" alt="">
                    <img v-if="item.q && item.q.taskState == 23" src="~assets/images/quoteinfo/status23.png" alt="">
                    <img v-if="item.q && item.q.taskState == 25" src="~assets/images/quoteinfo/status25.png" alt="">
                    <img v-if="item.q && item.q.taskState == 30" src="~assets/images/quoteinfo/status30.png" alt="">
                    <img v-if="item.q && item.q.taskState == 33" src="~assets/images/quoteinfo/status33.png" alt="">
                    <img v-if="item.q && item.q.taskState == 51" src="~assets/images/quoteinfo/status51.png" alt="">
                  </span>
                  <span class="time">{{ item.q.update_time }}</span>
                </h4>
                <p v-if="item.q.errorMsg">{{ item.q.errorMsg }}</p>
                <p v-if="item.q.taskState == 16">正常核保时间1至5小时，请您耐心等待</p>
              </div>
              <div class="btn-group">
                <router-link :to="{ name: 'insurance.CarInsuranceDetail', query: { taskId: taskId, prvId: item.q.prvId } }"
                  v-if="item.q.taskState != 2"
                  class="detail-btn"
                  tag="span">查看详情</router-link>

                <span class="modify-btn" v-if="item.q.taskState == 20" @click="handleInsure(item.q.prvId, item.q)">去支付</span>
                <span class="replace-pay" v-if="item.q.taskState == 20" @click="handleShareClick(item.q.prvId)">找人代付</span>

                <router-link :to="{ name: 'insurance.InsuranceAllocation', query: { taskId: taskId, prvId: item.q.prvId } }"
                  class="modify-btn"
                  v-if="item.q.taskState == 51"
                  tag="span">修改配置</router-link>

                <span class="modify-btn" v-if="item.q.taskState == 14" @click="checkInsur(item.q.prvId)">立即核保</span>

                <router-link :to="{ name: 'insurance.PerfectInsureMessage', query: { taskId: taskId, prvId: item.q.prvId } }"
                  class="modify-btn"
                  v-if="item.q.taskState == 19"
                  tag="span">补充信息</router-link>

              </div>
              <div class="tips-info" v-if="item.q.taskState == 14">温馨提示：此报价为系统初步评估报价，以保险公司核保价格为准（通常核保价格会比初步评估报价便宜哦）</div>
            </div>
            <div class="price" v-if="item.q && item.q.insureInfo && item.q.insureInfo.totalPremium">{{ '¥' + item.q.insureInfo.totalPremium }}</div>
            <!-- <div class="tips" @click="$toast('功能待开放')">
              <i class="sp sp-money-01"></i>
              <span>佣金说明</span>
              <i class="sp sp-point-bottom"></i>
            </div> -->
          </div>

        </div>
      </div>
    </scroller>
    <div class="layer" v-show="isShare">
      <div class="mask" @click="isShare = false"></div>
      <div class="share-image" @click="isShare = false">
        <img src="~assets/images/replace-pay.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>