<template>
  <div class="loan-share-page">
    <scroller ref="myScroller">
      <div class="container">
        <div class="wrapper">
          <div class="head">
            <div class="bg">
              <img src="~assets/images/loan_card_bg-01.png" alt="">
            </div>
            <div class="company">
              <div class="logo">
                <img :src="detail.thumb" alt="">
              </div>
              <div class="name">{{ detail.name }}</div>
            </div>
            <div class="user">
              <div class="avatar">
                <img v-if="userInfo.avatar_full" :src="userInfo.avatar_full" alt="">
                <img v-else src="~assets/images/default-avatar.png">
              </div>
              <div class="content">
                <div class="name">{{ userInfo.user_nickname }}</div>
                <div class="text">申请人数：{{ detail.apply_num }}人</div>
              </div>
            </div>
            <div class="detail">
              <div class="item">
                <div class="line">日利率：<span class="text">{{ detail.daily_interest }}%</span></div>
                <div class="line">最高额度：<span class="text">{{ detail.quota_limit }}</span></div>
              </div>
              <div class="item">
                <div class="line">还款方式：<span class="text">等额本息</span></div>
                <div class="line">贷款期限：<span class="text">{{ detail.lend_time_limit }}</span></div>
              </div>
            </div>
            <div class="point-weather">
              <div class="weather">
                <i v-if="weatherData.weather" class="sp" :class="'sp-weather-' + weatherData.weather | pinyin"></i>
                <i v-else class="sp sp-weather"></i>
                <span>{{ weatherData.templow || '?' }}°~{{ weatherData.temphigh || '?' }}°</span>
              </div>
              <div class="winddirect">
                <span>{{ weatherData.weather }} -- {{ weatherData.winddirect }}</span>
              </div>
              <div class="point">
                <span>{{ weatherData.city || '未知' }}</span>
              </div>
            </div>
          </div>
          <div class="body">
            <div class="quota">
              <div class="box">
                <div class="list">
                  <div class="item">
                    <div class="money">{{ loanInfo.monthPay }}</div>
                    <div class="text">月还款（元）</div>
                  </div>
                  <div class="item">
                    <div class="money">{{ loanInfo.interest }}</div>
                    <div class="text">总利息（元）</div>
                  </div>
                </div>
                <div class="option">
                  <div class="item">
                    <div class="name">贷款金额</div>
                    <div class="content"><span class="text">{{ loanInfo.loanAmount }}</span>元</div>
                  </div>
                  <div class="item" @click="handleBombBoxChange('loanTerm')">
                    <div class="name">贷款期限</div>
                    <div class="content"><span class="text">{{ loanTerm.name }}</span><i class="icon icon-enter"></i></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="total-money">
              <div class="box">
                <div class="profile">
                  <img src="~assets/images/loan_share_icon01.png" alt="">
                </div>
                <div class="icon-list">
                  <div class="item">
                    <i class="spot"></i>
                    <span class="name">本金</span>
                  </div>
                  <div class="item">
                    <i class="spot"></i>
                    <span class="name">利息</span>
                  </div>
                </div>
                <div class="canvas-box">
                  <div class="canvas" ref="canvas"></div>
                  <div class="total">
                    <div class="line">
                      <div class="money">{{ loanInfo.total }}</div>
                      <div class="text">总还款金额(元)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="require">
            <div class="title">
              <i class="icon"></i>
              <div class="name">申请条件</div>
            </div>
            <div class="content">
              <div class="line">
                <span class="name">年龄要求：</span>
                <div class="box">
                  <span class="text">{{ detail.age_limit }}</span>
                </div>
              </div>
              <div class="line">
                <span class="name">资质要求：</span>
                <div class="box">
                  <span class="text" v-for="(item, index) in detail.data_limit"><span class="sp sp-loan_share_icon02"></span>{{ item }}</span>
                </div>
              </div>
              <div class="line">
                <span class="name">所需材料：</span>
                <div class="box">
                  <span class="text" v-for="(item, index) in detail.work_limit"><span class="sp sp-loan_share_icon03"></span>{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="apply-btn">
            <a href="javascript:" class="step" @click="isStep">申请步骤</a>
            <a href="javascript:" class="apply" @click="isApply = true">立即申请</a>
          </div>
        </div>
      </div>
    </scroller>

<!--     <div class="forecast" :class="{ 'on': isShowForm }">
      <div class="title">
        <i class="icon"></i>
        <div class="name">精准预测贷款额度</div>
      </div>
      <div class="content-box">
        <ul class="list">
          <li class="item">
            <div class="name">本人姓名</div>
            <div class="content">
              <input type="text"
                v-model="formData.name"
                ref="name"
                @focus="isShowForm = true"
                class="input-item"
                placeholder="请输入">
            </div>
            <div class="icon"></div>
          </li>

          <li class="item">
            <div class="name">本人身份证</div>
            <div class="content">
              <input type="text"
                v-model="formData.identity"
                ref="identity"
                @focus="isShowForm = true"
                class="input-item"
                placeholder="请输入">
            </div>
            <div class="icon"></div>
          </li>
        </ul>
        <ul class="list" v-show="isShowForm">
          <li class="item">
            <div class="name">手机号码</div>
            <div class="content">
              <input type="text"
                v-model="formData.mobile"
                ref="mobile"
                class="input-item"
                placeholder="请输入">
            </div>
            <div class="icon"></div>
          </li>

          <li class="item" @click="handleBombBoxChange('education')">
            <div class="name">教育程度</div>
            <div class="content">
              <span class="item-text" :class="{ 'on': formData.education.name }">{{ formData.education.name || '请选择' }}</span>
            </div>
            <div class="icon">
              <span class="sp sp-right"></span>
            </div>
          </li>

          <li class="item" @click="handleBombBoxChange('socialSecurity')">
            <div class="name">是否缴纳社保</div>
            <div class="content">
              <span class="item-text" :class="{ 'on': formData.socialSecurity.name }">{{ formData.socialSecurity.name || '请选择' }}</span>
            </div>
            <div class="icon">
              <span class="sp sp-right"></span>
            </div>
          </li>

          <li class="item" @click="handleBombBoxChange('vehicle')">
            <div class="name">车辆信息</div>
            <div class="content">
              <span class="item-text" :class="{ 'on': formData.vehicle.name }">{{ formData.vehicle.name || '请选择' }}</span>
            </div>
            <div class="icon">
              <span class="sp sp-right"></span>
            </div>
          </li>

          <li class="item" @click="handleBombBoxChange('work')">
            <div class="name">职业信息</div>
            <div class="content">
              <span class="item-text" :class="{ 'on': formData.work.name }">{{ formData.work.name || '请选择' }}</span>
            </div>
            <div class="icon">
              <span class="sp sp-right"></span>
            </div>
          </li>
        </ul>
        <div class="submit-btn">
          <a href="javascript:" class="btn" :class="{ 'on': active }" @click="handleSumbit">提交</a>
        </div>
      </div>
      <i class="icon icon-close" v-show="isShowForm" @click="isShowForm = false"></i>
    </div> -->

    <div v-show="isApply" class="apply-mask">
      <div class="inner">
        <div class="head">
          <span>申请提醒</span>
          <i class="sp sp-close" v-on:click="isApply = false"></i>
        </div>
        <div class="body">
          <p>您好！请问您之前是否注册申请过{{ detail.name }}产品？如果等一下提示您有申请过记录，是无法删除账号的，那么该用户贷款申请成功没有佣金的，谢谢配合！</p>
        </div>

        <div class="foot">
          <div class="btn-group">
            <router-link :to="{ name: 'chat.Home', params: { id: 101 } }" class="btn-item close">联系客服</router-link>
            <router-link :to="{ name: 'home.LoanApply', params: { id: loanId } }" class="btn-item ok">继续申请</router-link>
          </div>
        </div>
      </div>
    </div>

    <BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BombBox>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
