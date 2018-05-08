<template>
  <div class="user-team-page">
    <app-header title="我的团队"></app-header>
    <div class="my-team">
      <router-link :to="{ name: 'user.TeamDetail', params: { id: userInfo.id } }" class="team-left" tag="div">
        <div class="userImg">
          <img v-if="userInfo.avatar_full" :src="userInfo.avatar_full">
          <img v-else src="~assets/images/default-avatar.png">
        </div>
        <div class="number">
          <span>团队(人)</span>
          <p>{{ teamTotal }}</p>
        </div>
      </router-link>

      <div class="team-right">
        <span>您的身份：{{ userInfo.level_name }}</span>
        <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
      </div>
      <div class="team-type">
        <div class="type-item">
          <span>直</span>
          <i class="sp sp-level-02"></i>
        </div>
        <div class="type-item">
          <span class="red">直</span>
          <i class="sp sp-level-01"></i>
        </div>
      </div>
      <em class="team-explain" v-on:click="isShowTeamExplain = true">
        <i class="sp sp-course"></i>
        <span>《团队收益说明》</span>
      </em>
    </div>
    <div class="nav-tab">
      <div class="tab-item">
        <div class="item-tit">今日新增（人）</div>
        <div class="item-txt">{{ toDayList.new }}</div>
      </div>
      <div class="tab-item">
        <div class="item-tit">今日人气（人）</div>
        <div class="item-txt">{{ toDayList.buzz }}</div>
      </div>
    </div>

    <div class="search">
      <div class="inner">
        <i class="sp sp-sea"></i>
        <input type="text" v-model="keyword" placeholder="输入手机号、昵称搜索">
        <button class="btn-sea" v-on:click="handleSearch()">搜索</button>
      </div>
      <div class="text" v-on:click="handleMyList()">
        <span>我的直推</span>
      </div>
    </div>

    <div class="nav">
      <div class="nav-group">
         <!-- v-if="handleNav(item)" -->
        <div v-if="handleNav(item)"
          class="item"
          :class="{ active: level == item.level }"
          v-for="(item, index) in formTemp.nav"
          :key="index"
          @click="switchNav(item.level)">

          <div class="content" :class="{ 'tb-xboss': 1 !== item.level * 1 }">
            <span v-if="1 === item.level * 1" class="tye-name">{{ item.name }}</span>
            <i v-if="0 < item.level" class="sp" :class="'sp-level-0' + item.level"></i>
            <span class="color-span2">{{ item.count | filterNumber }}<em v-if="10000 > item.count">人</em></span>
          </div>
        </div>

        <div class="count" @click="isTotal = true">统计</div>
      </div>
    </div>
    <scroller
      :on-refresh="refresh"
      ref="my_scroller">
      <div class="wrapper">
        <div class="container">
          <ul class="list">
            <li class="item" tag="li" v-for="(item, index) in formTemp.data" :key="index">
              <div class="number">
                <span v-if="10 > index + 1">0{{ index + 1}}</span>
                <span v-else>{{ index + 1}}</span>
              </div>
              <router-link :to="{ name: 'user.TeamDetail', params: { id: item.id } }" class="avatar" tag="div">
                <img v-if="item.avatar" :src="item.avatar">
                <img v-else src="~assets/images/default-avatar.png">

                <div class="real">
                  <span v-if="true == item.real">已实名</span>
                  <span v-else class="no">未实名</span>
                </div>
              </router-link>

              <router-link :to="{ name: 'user.TeamDetail', params: { id: item.id, level: level } }" class="info" tag="div">
                <div class="name">
                  <!-- <span v-if="true == item.real" class="h2">{{ item.real_name }}</span> -->
									<span class="h2">{{ item.user_nickname }}</span>
                	<span class="grade">{{ item.level_name }}</span>
                  <i v-if="0 < item.level" class="sp" :class="'sp-level-0' + item.level"></i>
								</div>

                <div class="right">
                  <div class="tips">人数：</div>
                  <div class="money">{{ item.team_num || 0 }}</div>
                  <div class="direct" :class="{ red: item.direct && 1 == item.zt }">{{ item.direct | filterDirect }}</div>
                  <span v-if="level == 1" class="color-span1">{{ handleCompText(item) }}</span>
                </div>
                <div class="add-tiem">
                  <div class="tit">加入时间：</div>
                  <div class="txt">{{ item.create_time | removeSecond }}</div>
                </div>
                <span v-if="level != 1" class="color-span2">{{ handleCompText(item) }}</span>
              </router-link>

              <div class="phone" v-if="level == 1">
								<!-- <div class="p-item call">
									<a v-if="item.mobile" :href="'tel:'+ item.mobile">
										<i class="sp sp-task-call"></i>
                    <span class="item-tit">电话</span>
									</a>
                  <a v-else v-on:click="$toast('没有电话')">
                    <i class="sp sp-task-call-diss"></i>
                    <span class="item-tit">电话</span>
                  </a>
								</div> -->

                <div class="p-item call">
                  <router-link v-if="userInfo.id != item.user_id" :to="{ name: 'chat.Home', params: { id: item.user_id } }" class="chat">
                    <i class="sp sp-wchat"></i>
                    <span class="item-tit">微聊</span>
                  </router-link>
                </div>

                <div v-if="item.wx_qrcode || item.wechat_account" class="p-item wechat" v-on:click.stop="addWeChat(item)">
                  <i class="sp sp-task-wechat"></i>
                  <span class="item-tit">微信</span>
                </div>
                <div v-else class="p-item wechat">
                  <i class="sp sp-task-wechat-diss"></i>
                  <span class="item-tit">微信</span>
                </div>
							</div>

              <div v-else class="income-detail" v-on:click.stop="isShowTeamExplain = true">
                <i class="sp sp-course"></i>
                <span>《团队收益说明》</span>
              </div>

            </li>
          </ul>
          <!-- <General v-show="1 === active"></General> -->
          <div class="change-page" v-show="isShowpagingBtn">
            <div class="front-page" :class="{nochoose: 1 == current_page}" v-on:click.stop="checkedCurrentPage((current_page - 1), 'front')">上一页</div>
            <div class="current-page" ref="currentPage">
              <div class="display-item"  :class="{nochoose: 1 == last_page}"  v-on:click.stop="choosePageSwitch">
                <span>第{{current_page}}/{{last_page}}页</span>
                <span class="choose-btn">
                  <i class="triangle"></i>
                </span>
              </div>
              <div class="choose-page" ref="choosePage" v-show="isShowPaging">
                <scroller ref="pageScroller">
                  <ul ref="pagingUl" class="page-list" :class="{active: isShowPaging}">
                    <li class="item" :class="{'active-item': current_page == item}" v-for="item in last_page" v-on:click.stop="checkedCurrentPage(item)">第{{item}}页</li>
                  </ul>
                </scroller>
              </div>
            </div>
            <div class="next-page" :class="{nochoose: last_page == current_page}" v-on:click.stop="checkedCurrentPage((current_page + 1), 'next')">下一页</div>
          </div>
        </div>
      </div>
    </scroller>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div class="team-explain-content" v-show="isShowTeamExplain">
        <div class="explain-wrap">
          <h2>团队收益说明</h2>
          <i class="sp sp-close" v-on:click.stop="isShowTeamExplain = false"></i>
          <div class="text">
            <p v-if="1 == sameData.level">您目前是{{ sameData.level_name }}<i class="sp" :class="'sp-level-0' + sameData.level"></i>级别，您名下团队有{{ sameData.number }}名跟你同一级别，他们现在的业务推广奖励，你是没有团队奖励收益的，需要加油哦！</p>
           <!--  <p>购买高级会员、保险经理、保险主任直接开通LV1身份。<br>升级到LV2要求：LV1直推办卡3张并成功拿到佣金或成功办理5单保单，并成功拿到佣金或发展3名高级会员、保险经理或保险主任。<br>升级到LV3要求：LV1直推办卡30张并成功拿到佣金或成功办理30单保单并成功拿到佣金或发展30名高级会员、保险经理或保险主任。</p> -->
            <p v-if="2 == sameData.level">当团队成员通过业绩提升身份之后，与您同级别或者超过您的级别身份，您将不在享受该成员下属团队管理奖励，您可以通过业绩提升自己级别身份，当您升级到<i class="sp sp-level-03"></i>或<i class="sp sp-level-04"></i>时，超过该成员身份或同级的时候.您又可以享受该成员下属团队管理奖励。如果该成员是你直推下级成员，当他升到<i class="sp sp-level-03"></i>或者<i class="sp sp-level-04"></i>与您同级别的时候，他每招商高级会员、保险经理或保险主任，您将可以获得7块、12块、25块钱的团队管理奖励</p>

            <!-- <p v-else>当您的直属团队成员通过业绩提升身份到<i class="sp sp-level-03"></i>或<i class="sp sp-level-04"></i>之后，与您同级别时，您可享受与自己身份相对于的团队管理收益，保险主任将获得直属下级团队收益5%的管理费，保险经理获得直属下级团队收益3%的管理费，高级会员获得直属下级团队收益1%的管理费。如果成员是你的直推下级成员，当他升级到<i class="sp sp-level-03"></i>或<i class="sp sp-level-04"></i>与您同级别的时候，他每招商一名高级会员，您将获得7元招商团队管理费，招商一名保险经理，您将获得12元招商团队管理费，招商一名保险主任，您将获得25元招商团队管理费</p> -->
            <p v-else>当您的直属团队成员通过业绩提升到<i class="sp sp-level-03"></i>或<i class="sp sp-level-04"></i>之后，与您同级别或超过您的级别，您可享受1%-5%的直属下级团队的团队管理收益。如果成员是你的直推下级成员，当他升级到<i class="sp sp-level-03"></i>或<i class="sp sp-level-04"></i>与您同级别的时候，他招商一名高级会员，您可获得3元团队管理费，招商一名业务经理，您可获得5元，招商一名业务主任，您可获得10元</p>
            <span>注意：保险业务奖励不涉及业绩考核晋升机制</span>
            <span>（团队管理奖励只属于有能力的领导人）</span>
          </div>
        </div>
      </div>
    </transition>

    <Count v-on:navTabChange="navTabChange" v-model="isTotal" :toDayList="toDayList"></Count>

    <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: '长按识别二维码', wx_qrcode: formTemp.manager.wx_qrcode, wechat_account: formTemp.manager.wechat_account }"></WechatCode>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
