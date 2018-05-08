<template>
  <div class="task-detail-page">
    <app-header title="抢单详情"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="top">
            <div class="require on">
              <span class="item"><span class="text">{{ item.amount }}</span>元</span>
              <span class="item"><span class="text">{{ item.repay_date_limit }}</span>个月</span>
            </div>
            <div class="require">
              <div class="avatar">
                <img v-if="item.avatar" :src="item.avatar" alt="">
                <img v-else src="~assets/images/avatar.png" alt="">
              </div>
              <div class="nick">{{ item.name }}</div>
              <div class="label" v-if="item.city_name">{{ item.city_name }}</div>
              <div class="label" v-if="item.salary > 0">上班族</div>
            </div>
          </div>
          <div class="body">
            <div class="option">
              <div class="title">
                <i class="icon sp sp-task-icon3"></i>
                <span>基本信息</span>
              </div>
              <ul class="list">
                <li class="item">
                  <span class="left">年龄：</span>
                  <span class="right">{{ item.age }}</span>
                </li>
                <li class="item">
                  <span class="left">婚姻状况：</span>
                  <span class="right">{{ item.is_marry | isMarry }}</span>
                </li>
                <li class="item">
                  <span class="left">所在城市：</span>
                  <span class="right">{{ item.city_name || '未知' }}</span>
                </li>
                <li class="item">
                  <span class="left">单位：</span>
                  <span class="right">{{ item.company || '未知' }}</span>
                </li>
                <li class="item">
                  <span class="left">联系方式：</span>
                  <span class="right" v-if="item.status">{{ item.phone }}</span>
                  <span class="text" v-else>客户电话已公开，抢单即可看见</span>
                </li>
              </ul>
            </div>
            <div class="option">
              <div class="title">
                <i class="icon sp sp-task-icon2"></i>
                <span>工作信息</span>
              </div>
              <ul class="list">
                <li class="item">
                  <span class="left">工作单位：</span>
                  <span class="right">{{ item.company || '未知' }}</span>
                </li>
                <li class="item">
                  <span class="left">公司性质：</span>
                  <span class="right">{{ item.company_type | companyType }}</span>
                </li>
                <li class="item">
                  <span class="left">工作年限：</span>
                  <span class="right">{{ item.work_age ? item.work_age + '个月' : '未知' }}</span>
                </li>
                <li class="item">
                  <span class="left">社保缴纳：</span>
                  <span class="right">{{ item.ss_card ? '有社保' : '无社保' }}</span>
                </li>
                <li class="item">
                  <span class="left">公积金年限：</span>
                  <span class="right">{{ item.public_fund_age ? item.public_fund_age + '年' : '未知' }}</span>
                </li>
                <li class="item">
                  <span class="left">工资金额（元）：</span>
                  <span class="right">{{ item.salary || '未知' }}</span>
                </li>
                <li class="item">
                  <span class="left">工资发放方式：</span>
                  <span class="right">{{ item.salary_get_type | salaryGetType }}</span>
                </li>
              </ul>
            </div>
            <div class="option">
              <div class="title">
                <i class="icon sp sp-task-icon6"></i>
                <span>信用信息</span>
              </div>
              <ul class="list">
                <!-- <li class="item">
                  <span class="left">信用记录：</span>
                  <span class="right">良好</span>
                </li> -->
                <li class="item">
                  <span class="left">名下车产：</span>
                  <span class="right">{{ item.driving_license ? '有车' : '暂无' }}</span>
                </li>
                <li class="item">
                  <span class="left">家庭资产：</span>
                  <span class="right">{{ item.family_assets ? '有房' : '暂无' }}</span>
                </li>
                <li class="item">
                  <span class="left">公共事业：</span>
                  <span class="right">{{ item.public_bill ? '有' : '暂无' }}</span>
                </li>
                <li class="item">
                  <span class="left">是否接受抵押：</span>
                  <span class="right">{{ item.is_dy ? '接受' : '不接受' }}</span>
                </li>
                <!-- <li class="item">
                  <span class="left">是否按揭：</span>
                  <span class="right">不是</span>
                </li> -->
              </ul>
            </div>
          </div>
          <div class="submit-btn">
            <a href="javascript:" @click="setTask(item.id)">立即抢单</a>
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