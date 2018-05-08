<template>
  <div class="buy-vip-page">
    <app-header title="升级代理"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="mask-interval" v-show="showInterval">
          <div class="jump-loading">
            <div class="spinner">
              <div class="spinner-container container1">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
                <div class="circle4"></div>
              </div>
              <div class="spinner-container container2">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
                <div class="circle4"></div>
              </div>
              <div class="spinner-container container3">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
                <div class="circle4"></div>
              </div>
              <div class="second"></div>
              <!--<div class="second">{{ intervalNum }}s</div>-->
            </div>
          </div>
        </div>

        <div class="container">

          <div class="main">
            <div class="layer">
              <ul class="list">
                <li v-for="(item, index) in formTemp.data" class="item" :key="index">
                  <div class="item-box" :class="handleItemBoxBg(item)">
                    <div class="left">
                      <div class="level">
                        <i class="sp sp-level-02"></i>
                        <!-- <i class="sp" :class="'sp-level-0' + level(item.goods_name)"></i> -->
                        <h2>{{ item.goods_name }}</h2>
                      </div>
                      <div class="txt">
                        <span>时限：{{ item.validity_time | time }}</span>
                      </div>
                      <div class="txt">
                        <span>权限：{{ item.goods_info }}</span>
                      </div>
                      <div class="money">
                        <strong :class="handleTxColor(item)">￥{{ item.price }}</strong>
                        <div class="recommend-index">
                          <span>推荐指数：</span>
                          <i class="sp sp-star-star" v-for="(item, key) in handleStarNum(item)" :key="key"></i>
                        </div>
                      </div>
                    </div>
                    <div class="deposit" v-on:click.stop="popupExplain(item)">
                      <i class="sp sp-bonus-sm"></i>
                      <span>使用费保证金退还说明</span>
                      <i class="sp sp-point-right"></i>
                    </div>
                  </div>
                  <div class="right">
                    <button v-if="true == item.can_buy && false === item.isAgent"
                      :class="handleBtnBg(item)"
                      v-on:click.stop="handleMask(item)"
                      type="button" >立即升级</button>

                    <button v-else-if="true == item.can_buy && true === item.isAgent"
                      v-on:click.stop="handleAgentShare(item)"
                      :class="handleBtnBg(item)">
                      邀请代付
                    </button>

                    <button v-else type="button" :class="handleBtnBg(item)">您已开通</button>
                  </div>
                </li>
              </ul>

              <div class="up-notice">
                <h3>注意事项</h3>
                <p>卡盟金服平台对所有用户实行无限期永久免费，凡申请信用卡、贷款、以及申请成为平台代理商，均不收取任何费用。
                <span>团队业务《晋升机制》<i class="sp sp-point-001"></i></span>
                 <!-- v-on:click.stop="isShowTeamExplain = true" -->
                </p>
              </div>

              <!-- <div class="images" v-if="!isWechatClient"> -->
              <div class="images">
                <img src="~assets/images/introduce-01-31.jpg">
                <img src="~assets/images/buyVipPage/1_01.png">
                <img src="~assets/images/buyVipPage/1_02.png">
                <img src="~assets/images/buyVipPage/1_03.png">
                <img src="~assets/images/buyVipPage/1_04.png">
                <img src="~assets/images/buyVipPage/1_05.png">
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroller>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div class="team-explain-content" v-show="isShowTeamExplain">
        <div class="explain-wrap">
          <h2>晋升机制</h2>
          <i class="sp sp-close" v-on:click.stop="isShowTeamExplain = false"></i>
          <div class="text">
            <p>购买高级会员、保险经理、保险主任直接开通<i class="sp sp-level-02"></i>身份。</p>
            <p><span class="title-span-color">升级到<i class="sp sp-level-03"></i>要求：</span><i class="sp sp-level-02"></i>成功办理10单汽车保险业务并成功拿到佣金或直推招商3名保险主任。</p>
            <p><span class="title-span-color">升级到<i class="sp sp-level-04"></i>要求：</span><i class="sp sp-level-02"></i>直推办卡30张并成功拿到佣金或成功办理30单保单并成功拿到佣金或发展30名高级会员、保险经理或保险主任。（注：完成招商3名升为<i class="sp sp-level-03"></i>，再完成招商27名就可以升<i class="sp sp-level-04"></i>，不用单独计算）</p>
            <!-- <span class="text-tips">（保险业务奖励不涉及业绩考核晋升机制）</span> -->
          </div>
        </div>
      </div>
    </transition>

    <div class="deposit-explain" v-show="isShowDepositExplain">
      <div class="explain-box">
        <h2>
          保证金及退还说明
          <div class="close-btn-wrap">
            <i class="sp sp-close" v-on:click.stop="closeExplain"></i>
          </div>
        </h2>
        <scroller>
          <div class="explain-content">
            <h3>1,为什么要收取保证金？</h3>
            <p>为了保证平台的健康持续发展，为了规范广大会员的互联网推广行为，平台收取的{{ explain.price }}元是{{ explain.goods_name }}的保证金，以确保广大会员能遵守互联网法规，规范市场。</p>
            <h3>2,保证金退还规则：</h3>
            <p>A，直推信用卡{{ explain.carCount }}张，并成功拿到佣金。</p>
            <p>B，直推汽车保险{{ explain.times }}单。</p>
            <p>C，直接招商{{ explain.investment }}名高级会员或以上身份会员。</p>
            <p>达到上述3个条件后，会员可在个人中心向平台发起保证金退还申请，工作人员审核后将原数退还保证金{{ explain.price }}元。退款后会员身份不变，仍可享受直推收益。</p>
            <h3>
              3,卡盟v金服平台规范：
              <span class="check-detail" v-on:click="isShowOtherDetail = !isShowOtherDetail">查看详情<i class="sp sp-deposit-point-bottom"></i></span>
            </h3>
            <div class="other-detail" v-if="isShowOtherDetail">
              <h4>为了进一步规范卡盟金服业务推广宣传的合规性，维护平台与合作机构公司的权益，提升卡盟金服平台声誉，推动平台健康稳定发展，必须坚持-合规展业，良性发展</h4>
              <h6>一、卡盟金服是一个推广服务平台，我们作为银行、保险公司的拓客推广服务商，与平台上所有银行及保险公司均签署的是互联网推广协议，线上推广仅限于代理商在互联网上进行宣传推广，建议代理商不到街面摆摊设点，当然，大家可以针对性的找公司，写字楼，工厂等进行批量办卡。</h6>
              <h6>二、卡盟金服平台为符合条件的用户的个人帐户安全险由中国人民保险公司承保，保险公司也仅对投保生效的用户提供个人帐户的保险服务，并非对平台或是所有用户承保，宣传推广时，一定要明确说明，不得误导客户，以免产生不必要的误会。</h6>
              <h6>三、代理商在进行推广时，请务必严格遵守以下规定：</h6>
              <p>1、不得发布与国家法律法规相悖的推广内容；</p>
              <p>2、不得以任何理由，利用卡盟金服名义在任何平台从事注册帐户、发布信息、招聘等活动；例如：在58或BOSS直聘上的招聘；</p>
              <p>4、不得虚假宣传、更不得向任何人信用卡申请或贷款额度承诺；</p>
              <p>5、不得以任何理由向办信用卡，贷款或汽车保险的用户收取任何费用。</p>
              <p>6、不得利用明显带有贬意的内容进行恶意引流；例如：诈骗、骗局、传销等；</p>
              <p>7、不得使用暗示的内容进行宣传或诱导用户做违法违规的行为；例如：信用卡套现等；</p>
              <p>8、不得使用和传播任何未经卡盟金服平台授权许可的图文资料；例如：公司营业执照、公司合同等。</p>
              <h6>四、代理商在推广信用卡时，请严格遵守卡盟金服信用卡申请操作规范指南</h6>
              <p>1、禁止银行黑名单用户在平台申请信用卡；</p>
              <p>2、信用卡申请必须由申请人本人填写，禁止代劳；</p>
              <p>3、填写申请资料时，务必真实有效，不得伪造虚构信息进行申请；如：暂无业，可以填写上一份工作的单位信息。</p>
              <p>4、如无信用卡需求，请不要随意申请，下卡不激活，照样会影响到诚信记录，严重的将会被列入银行黑名单；</p>
              <h4>卡盟金服代理商在拓客推广服务过程中，凡有违以上任何一条规范的，一律冻结帐号，永不解封！卡盟金服平台对此不警告，不提示，不作解释。凡因违规推广，给用户、平台或是合作商造成损失的，卡盟金服将直接向相关管理机构举报，并将协助追回所有非法所得，同时，公司还将保留进一步追诉损失的权利。</h4>
            </div>
          </div>
        </scroller>
      </div>
    </div>

<!--     <div v-show="explainImg && isExplain" class="mask-explain">
      <div class="layer">
        <div class="inner">
          <div class="close" v-on:click="isExplain = false">
            <i class="icon icon-close"></i>
          </div>
          <div class="body">
            <scroller>
              <div class="images">
                <img :src="explainImg">
              </div>
            </scroller>
          </div>
        </div>
      </div>
    </div> -->

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div v-show="isMaskVip" class="mask-vip">
        <div class="layer">
          <div class="inner">
            <div class="close" v-on:click="isMaskVip = false">
              <i class="icon icon-close"></i>
            </div>
            <div class="images">
              <img src="~assets/images/mask-vip-02.png">
            </div>
						<div class="identity">
							<h3 class="h3">升级{{ currentData.goods_name }}</h3>
							<div class="info">赠送<strong class="time">1年</strong>的视频网站会员，<strong class="time">价值198元</strong>12大主流视频网站VIP会员。</div>
						</div>
            <div class="btn">
              <button type="button" v-on:click="handleBuy()">立即升级</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <PayType v-on:payTypeClick="handlePayClick" :goods="formData.goods" :show="isShow" :query="query">
      <li v-show="isShowInviteCode" class="item" slot="confirm">
        <span>推荐码</span>
        <div class="right">
          <input v-model="invite_code" type="text" placeholder="请输入推荐码">
        </div>
      </li>
    </PayType>

    <div class="df-mask-layer" v-show="isShare">
      <div class="mask" @click="isShare = false"></div>
      <div class="share-image" @click="isShare = false">
        <img src="~assets/images/pay-share.png">
      </div>
    </div>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
