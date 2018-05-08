<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="result-wrapper" v-show="layerFlag && visible">
      <div class="header">
        <a href="javascript:" class="back" @click="handleClose"></a>
        <div class="title"> 查询结果</div>
      </div>
      <scroller v-if="0 < formTemp.data.length"
        :on-refresh="refresh"
        :on-infinite="infinite"
        ref="my_scroller">
        <div class="body">
          <div class="top">
            <div v-for="(item, index) in formTemp.data" class="box">
              <div class="item">
                <div class="name">申请卡种</div>
                <div class="content">{{ item.name }}</div>
              </div>
              <div class="item">
                <div class="name">申请日期</div>
                <div class="content">{{ item.add_time | formatTime }}</div>
              </div>
              <div class="item">
                <div class="name">申请状态</div>
                <div class="content">{{ item.status }}</div>
              </div>
            </div>
          </div>
          <div class="state">
            <div class="title">状态说明</div>
            <div class="box">
              <div class="line">
                <span class="name">已通过：</span>
                <span class="text">查询银行已核卡通过，代理可以拿到佣金奖励</span>
              </div>
              <div class="line">
                <span class="name">未通过：</span>
                <span class="text">被银行拒绝或不满足平台条件</span>
              </div>
              <div class="line">
                <span class="name">等待银行审批：</span>
                <span class="text">银行数据还未同步或银行还未更新，请过2个工作日再查询</span>
              </div>
            </div>
          </div>
        </div>
      </scroller>

      <div v-if="0 >= formTemp.data.length" class="layer">
        <div class="mask" v-show="true === layerFlag"></div>
        <transition name="fade" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
          <div class="box" v-show="true === layerFlag">
            <div class="icon">
              <span class="sp sp-progress-query-icon01"></span>
            </div>
            <div class="title">很抱歉！无查询结果</div>
            <div class="text">未查询到您的申请记录有如下原因：</div>
            <div class="text">1、请确认是否已经收到银行下卡的申请信用卡成功短信。</div>
            <div class="text">2、收到短信后是否已经等了2个工作日。</div>
            <div class="text">3、您查询进度1时用的身份证号码或手机号码是否与在银行官网上申请所填写的资料一致。</div>
            <div class="text">4、银行网上查询数据还未同步，请耐心在等2-5个工作日后再查询。</div>
            <div class="text on">5、是否有去面签，面签后2-5个工作日后银行数据才能查到进度。</div>
            <a href="javascript:" class="btn" @click="handleClose()">确定</a>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>