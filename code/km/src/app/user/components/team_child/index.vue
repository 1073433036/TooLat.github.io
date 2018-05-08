<template>
  <div class="team-child-page">
    <app-header :title="type | filterTitle"></app-header>
    <div class="my-team">
      <router-link :to="{ name: 'user.TeamDetail', params: { id: userInfo.id }}" class="team-left" tag="div">
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
      <em class="team-explain" v-on:click="isShowTeamExplain = true">
        <i class="sp sp-course"></i>
        <span>《团队收益说明》</span>
      </em>
    </div>
    <div class="child-tab">
      <div class="tab-item" :class="{ active: 0 === direct }" v-on:click="direct = 0">全部</div>
      <div class="tab-item" :class="{ active: 1 === direct }" v-on:click="direct = 1">直推</div>
      <div class="tab-item" :class="{ active: 2 === direct }" v-on:click="direct = 2">间推</div>
    </div>
    <scroller
      :on-refresh="refresh"
      ref="my_scroller">
      <div class="wrapper">
        <div class="container">

          <div class="search">
            <div class="inner">
              <i class="sp sp-sea"></i>
              <input type="text" v-model="keyword" placeholder="输入手机号、昵称搜索">
              <button class="btn-sea" v-on:click="handleSearch()">搜索</button>
            </div>
          </div>

          <ul v-if="0 < formTemp.list.length" class="list">
            <li class="item" tag="li" v-for="(item, index) in formTemp.list" :key="index">
              <div class="number">
                <span v-if="10 > index + 1">0{{ index + 1}}</span>
                <span v-else>{{ index + 1}}</span>
              </div>

              <div class="avatar">
                <router-link :to="{ name: 'user.TeamDetail', params: { id: item.id }}">
                  <img v-if="item.avatar" :src="item.avatar">
                  <img v-else="~assets/images/avatar.png">

                  <div class="real">
                    <span v-if="true == item.real">已实名</span>
                    <span v-else class="no">未实名</span>
                  </div>
                </router-link>
              </div>

              <div class="info">
                <router-link :to="{ name: 'user.TeamDetail', params: { id: item.id }}">
                  <div class="name">
                    <span v-if="true == item.real" class="h2">{{ item.real_name }}</span>
  									<span v-else class="h2">{{ item.user_nickname }}</span>
                  	<span class="grade">{{ item.level_name }}</span>
                    <i v-if="0 < item.level" class="sp" :class="'sp-level-0' + item.level"></i>
  								</div>

                  <div class="right">
                    <div class="tips">人数：</div>
                    <div class="money">{{ item.team_num || 0 }}</div>
                    <div class="direct">{{ item.direct | filterDirect }}</div>
                    <span class="color-span1">{{ handleCompText(item) }}</span>
                  </div>
                  <div class="add-tiem">
                    <div class="tit">加入时间：</div>
                    <div class="txt">{{ item.create_time | removeSecond }}</div>
                  </div>
                </router-link>
              </div>
              <div class="phone">
								<div class="p-item call">
									<a v-if="item.mobile" :href="'tel:'+ item.mobile">
										<i class="sp sp-task-call"></i>
                    <span class="item-tit">电话</span>
									</a>
                  <a v-else v-on:click="$toast('没有电话')">
                    <i class="sp sp-task-call-diss"></i>
                    <span class="item-tit">电话</span>
                  </a>
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
            </li>
          </ul>
          <!-- <General v-show="1 === active"></General> -->
          <div v-if="0 < formTemp.list.length" class="change-page">
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

          <div v-if="0 >= formTemp.list.length" class="no-data">
            <img src="~assets/images/no-data.png">
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
            <p v-show="0 < sameData.number">您目前是{{ sameData.level_name }}<i class="sp" :class="'sp-level-0' + userInfo.level"></i>级别，您名下团队有{{ sameData.number }}名跟你同一级别，他们现在的业务推广奖励，你是没有团队奖励收益的，需要加油哦！</p>
           <!--  <p>购买高级会员、保险经理、保险主任直接开通LV1身份。<br>升级到LV2要求：LV1直推办卡3张并成功拿到佣金或成功办理5单保单，并成功拿到佣金或发展3名高级会员、保险经理或保险主任。<br>升级到LV3要求：LV1直推办卡30张并成功拿到佣金或成功办理30单保单并成功拿到佣金或发展30名高级会员、保险经理或保险主任。</p> -->
            <p>当团队成员通过业绩提升身份之后，与您同级别或者超过您的级别身份，您将不在享受该成员下属团队管理奖励，您可以通过业绩提升自己级别身份，当您再次超过该成员身份的时候.您又可以享受该成员下属团队管理奖励。如果该成员是你直推下级成员，当他升到<i class="sp sp-level-02"></i>或者<i class="sp sp-level-02"></i>与您同级别的时候，他每招商一名会员、保险经理或保险主任，您将可以获得7块钱的团队管理奖励</p>
            <span>注意：保险业务奖励不涉及业绩考核晋升机制</span>
            <span>（团队管理奖励只属于有能力的领导人）</span>
          </div>
        </div>
      </div>
    </transition>

    <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: '长按识别二维码', wx_qrcode: formTemp.manager.wx_qrcode, wechat_account: formTemp.manager.wechat_account }"></WechatCode>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
