<template>
  <div class="leader-grade-layer" v-if="isPopupShow">
    <main class="leader-grade">
      <header>
        <span v-if="!isExtendShow">我的直属上级推荐人</span>
        <span class="leaders" v-else>给领导打分</span>
        <i class="sp sp-close" @click="closePopup"></i>
      </header>

      <section class="content" v-if="!isExtendShow">
        <div class="parent-wrapper">
          <div class="detail-wrapper">
            <img :src="managerInfo.avatar" alt="头像">
            <div class="manager-info">
              <div>
                <span class="name">{{ managerInfo.real_name || managerInfo.user_nickname }}</span>
              </div>
              <div>
                <span class="level">级别</span>
                <span>{{ managerInfo.level_name }}</span>
                <i v-if="1 < managerInfo.level_number" class="sp" :class="'sp-level-0' + managerInfo.level_number"></i>
              </div>
            </div>
            <div class="wechat-wrapper c-wrapper" @click="showWechatCode(managerInfo)">
              <i></i>
              <div class="text">微信聊</div>
            </div>
            <div class="talk-wrapper c-wrapper" @click="handleGotoChat(managerInfo.id)">
              <i></i>
              <div class="text">微聊</div>
            </div>
          </div>

          <div class="tip-wrapper">
            <i></i>
            <div class="green-tip">
              Hi! 我是 {{ managerInfo.real_name || managerInfo.user_nickname }} 邀请您成为创业合伙人，卡盟大舞台，有梦你就来
            </div>
          </div>
          <button class="grade-btn" @click="comment">去点评</button>
        </div>

        <p class="grade-tip">
          团队合作创造更多的价值，没有完美的个人，只有完美的团队。您的点评将促进团队更好的服务，请真实的评价您的上级领导！
          <span @click="isTipShow = true">《好评差评规则说明》</span>
        </p>
        <div class="extend-wrapper">
          <p @click="isExtendShow = true">点评更多领导</p>
          <i @click="isExtendShow = true"></i>
        </div>
      </section>

      <section class="content" v-else>
        <div class="extend-wrapper top">
          <p @click="isExtendShow = false">点评上级推荐人</p>
          <i @click="isExtendShow = false"></i>
        </div>

        <div class="detail-wrapper" v-for="(el, index) in parentList" :key="index" v-if="el.user_id !== managerInfo.id && el.rating === 0">
          <img :src="el.avatar" alt="头像">
          <div class="manager-info">
            <div>
              <span class="name">{{ el.real_name || el.user_nickname }}</span>
              <router-link :to="{ name: 'task.Score', query: { fromR: 'leaderGrade', ratingId: el.user_id } }" tag="i" class="btn"></router-link>
            </div>
            <div>
              <span class="level">级别</span>
              <span>{{ el.level_name }}</span>
              <i v-if="1 < el.level" class="sp" :class="'sp-level-0' + el.level"></i>
            </div>
          </div>
          <div class="wechat-wrapper c-wrapper" @click="showWechatCode(el)">
            <i></i>
            <div class="text">微信聊</div>
          </div>
          <div class="talk-wrapper c-wrapper" @click="handleGotoChat(el.user_id)">
            <i></i>
            <div class="text">微聊</div>
          </div>
        </div>

        <div class="no-leader" v-if="!isMordLeader">无未点评领导</div>

        <p class="grade-tip top">
          团队合作创造更多的价值，没有完美的个人，只有完美的团队。您的点评将促进团队更好的服务，请真实的评价您的上级领导！
          <span @click="isTipShow = true">《好评差评规则说明》</span>
        </p>
      </section>
    </main>

    <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: '长按识别二维码', wx_qrcode: wx_qrcode, wechat_account: wechat_account }"></WechatCode>
    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <section v-if="isTipShow" class="tip-popup">
        <div class="tip-popup-inner">
          <header>好评差评规则说明<i class="sp sp-close" @click="isTipShow = false"></i></header>
          <div class="content">
            <p>精诚团结，诚信合作，目标同向，众志成城。没有完美的个人，只有完美的团队，团队协作才能创造价值最大化。帮助他人，成就自己，卡盟金服让您的团队实现梦想！</p>
            <p>1、实习会员没有权限评论。</p>
            <p>2、高级会员以上身份有权对上级3代代理进行评分。</p>
            <p>3、评论人数达到10个起算，差评率达到50%时取消主任10元3代躺赚收益。</p>
            <p>4、当差评率达到80%，3元、5元、10元平级躺赚收益取消，业务团队管理收益取消。</p>
            <p>5、当差评率达到90%，暂时停止所有团队收益。</p>
            <p>6、用户3天有权修改评论，3天内无修改的默认生效，下次修改为10个工作日后。</p>
            <p>7、5个间推评论的算1个直推评论的名额。</p>
            <p>8、情节恶劣者，诋毁、污蔑卡盟者平台有权直接封号，取消所有收益。</p>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
