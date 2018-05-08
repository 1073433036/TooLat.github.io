<template>
  <div class="task-page">
    <div class="header">
      <a href="javascript:" class="back" v-on:click="handleBack()"></a>
      <div class="title">
        <a href="javascript:" class="switch" @click="switchNav(1)" :class="{ 'on': state.nav }">实时抢单</a>
        <a href="javascript:" class="switch" @click="switchNav(2)" :class="{ 'on': !state.nav }">推送抢单</a>
      </div>
      <div class="icon">
        <router-link :to="{ name: 'task.TaskCenter' }" class="icon icon-user"></router-link>
      </div>
    </div>
    <div class="navbar" v-show="state.nav">
      <div class="box">
        <a href="javascript:" class="select" :class="{ 'on': state.type }" @click="select(0)">
          <span>订单类型</span>
        </a>
        <transition name="fade" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
          <div class="mask" v-show="state.type">
            <div class="block"></div>
            <div class="content">
              <scroller>
                <ul class="list">
                  <li class="on" v-for="(item, index) in formTemp.type" :key="index" v-on:click="switchOrderTpey(item)">
                    <a href="javascript:">
                      <span>{{ item.name }}</span>
                      <i class="type" v-if="formData.orderTpye === item.value"></i>
                    </a>
                  </li>
                </ul>
              </scroller>
            </div>
          </div>
        </transition>
      </div>
      <div class="box">
        <a href="javascript:" class="select" :class="{ 'on': state.city }" v-on:click="handleCityShowChange()">
          <span>城市</span>
        </a>
      </div>
      <div class="box">
        <a href="javascript:" class="select" :class="{ 'on': state.define }" @click="select(2)">
          <span>自定筛选</span>
        </a>
        <transition name="fade" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
          <div class="mask" v-show="state.define">
            <div class="block"></div>
            <div class="content">
              <scroller>
                <ul class="list custom">

                  <li class="item">
                    <a v-on:click="handleBotSelectChange('money')">
                      <div class="left">
                        <span>贷款额度</span>
                      </div>
                      <div class="right">
                        <span>{{ formData.money.name }}</span>
                      </div>
                      <i class="sp sp-right"></i>
                    </a>
                  </li>

                  <li class="item">
                    <a v-on:click="handleBotSelectChange('loanterm')">
                      <div class="left">
                        <span>贷款期限</span>
                      </div>
                      <div class="right">
                        <span>{{ formData.loanterm.name }}</span>
                      </div>
                      <i class="sp sp-right"></i>
                    </a>
                  </li>

                  <li class="item">
                    <a v-on:click="handleBombBoxChange('wages')">
                      <div class="left">
                        <span>工资发放形式</span>
                      </div>
                      <div class="right">
                        <span>{{ formData.wages.name }}</span>
                      </div>
                      <i class="sp sp-right"></i>
                    </a>
                  </li>

                  <li class="item">
                    <a v-on:click="handleBombBoxChange('loanType')">
                      <div class="left">
                        <span>贷款方式</span>
                      </div>
                      <div class="right">
                        <span>{{ formData.loanType.name }}</span>
                      </div>
                      <i class="sp sp-right"></i>
                    </a>
                  </li>

                  <li class="item">
                    <a v-on:click="handleBombBoxChange('social')">
                      <div class="left">
                        <span>社保缴纳要求</span>
                      </div>
                      <div class="right">
                        <span>{{ formData.social.name }}</span>
                      </div>
                      <i class="sp sp-right"></i>
                    </a>
                  </li>

                  <li class="item">
                    <a v-on:click="handleBombBoxChange('gjj')">
                      <div class="left">
                        <span>公积金要求</span>
                      </div>
                      <div class="right">
                        <span>{{ formData.gjj.name }}</span>
                      </div>
                      <i class="sp sp-right"></i>
                    </a>
                  </li>
                </ul>

                <div class="btn">
                  <button @click="screen()">立即筛选</button>
                </div>
              </scroller>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <scroller :class="{ 'on': !state.nav }"
      :on-refresh="refresh"
      :on-infinite="infinite">
      <div class="wrapper" :class="{ 'on': !state.nav }">
        <div class="controller">
          <div class="banner">
            <div class="tasking">
              <i class="icon icon-cheats"></i>
              <span>本月已抢单数：</span>
              <span class="num">{{ manager.get_num }}单</span>
            </div>
            <!-- <div class="tasked">
              <span>剩余可抢单数：{{ manager.get_num > 3 ? '0' : 3 - manager.get_num }}单</span>
            </div> -->
          </div>

          <div class="tips">
            <i class="icon icon-horn"></i>
						<div class="notice">
            	<div  class="marquee">卡盟金服信贷流量服务平台：信贷经理在“卡盟V金服”进行抢单业务，客户自己填写真实有效资料，可免费发布信息，让贷款机构、信贷经理快速与您获得联系，解决资金问题，平台不收取任何费用，谨防金融诈骗，举报电话：400-018-8616</div>
          	</div>
          </div>

          <ul class="task-list">
            <li class="item" v-for="(item, index) in list" :key="index">
              <router-link :to="{ name: 'task.TaskDetail', params: {id: item.id} }">
                <div class="person">
                  <span class="name">{{ item.name }}</span>
                  <span class="text">贷款<span class="fc">{{ item.amount }}</span>元</span>
                  <span class="text"><span class="fc">{{ item.repay_date_limit }}</span>期还款</span>
                  <span class="text">{{ item.create_at }}</span>
                </div>
                <div class="company">
                  <div class="line">
                    <i class="icon icon-home"></i>
                    <span>单位：</span>
                    <span>{{ item.company }}</span>
                  </div>
                  <div class="line">
                    <i class="icon icon-purse"></i>
                    <span>月收入：</span>
                    <span>{{ item.salary || '0' }}元</span>
                  </div>
                  <div class="grab">抢单</div>
                  <div class="integral">{{ item.need_integral }}积分</div>
                </div>
                <div class="term-list">
                  <span class="text" v-if="item.city_name"><i class="sp sp-task-icon1"></i>{{ item.city_name }}</span>
                  <span class="text" v-if="item.salary > 0"><i class="sp sp-task-icon2"></i>上班族</span>
                  <span class="text"><i class="sp sp-task-icon6"></i>{{ item.is_marry | isMarry }}</span>
                  <span class="text" v-if="item.family_assets == 1"><i class="sp sp-task-icon3"></i>有房产</span>
                  <span class="text" v-if="item.driving_license == 1"><i class="sp sp-task-icon5"></i>有车</span>
                  <span class="text" v-if="item.ss_card == 1"><i class="sp sp-task-icon5"></i>有社保</span>
                  <span class="text" v-if="item.public_fund_age > 0"><i class="sp sp-task-icon5"></i>有公积金</span>
                  <span class="text" :class="{ 'off': item.is_dy == '0' }"><i class="sp sp-task-icon4"></i>{{ item.is_dy == '0' ? '不抵押' : '抵押' }}</span>
                </div>
                <div class="status">
                  <div class="text">抢单中</div>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
			<app-footing></app-footing>
    </scroller>
    <app-footer></app-footer>
    <BotSelect v-on:onChildClick="botSelectClick"
      :title="botTitle"
      :show="isShow"
      :formData="formTemp[formIndex]"
      :formIndex="formIndex"></BotSelect>

    <BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BombBox>

    <CityList :point="false"></CityList>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
