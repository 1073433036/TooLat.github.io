<template>
  <div class="creditcard-share-join-page">
    <app-header title="邀请加盟"></app-header>

    <scroller>
      <div class="wrapper">
        <div class="swiper-container">
          <div class="container">
            <div class="banner">
              <router-link :to="{ name: 'user.BuyVip' }">
                <img src="~assets/images/invite-bg.jpg">
              </router-link>
            </div>
            <div class="referee">
              <div class="title">
                <i class="icon icon-user"></i>
                <span>推荐人信息<em>（专属客服）</em></span>
              </div>
              <div class="content">
                <div class="avatar">
                  <img v-if="formTemp.manager.avatar" :src="formTemp.manager.avatar">
                  <img v-else src="~assets/images/user-avatar.png">
                  <span v-if="formTemp.manager.id_card" class="name">已实名</span>
                  <span v-else class="name no">未实名</span>

                </div>
                <div class="work">

                  <span class="nick">{{ formTemp.manager.real_name || formTemp.manager.user_nickname || '待完善' }}</span>
                  <span v-if="formTemp.manager.level_name" class="tye">
                    (
                    {{ formTemp.manager.level_name }}
                    <i v-if="0 < formTemp.manager.level" class="sp" :class="'sp-level-0' + formTemp.manager.level"></i>s
                    )
                  </span>
                  <span class="green-tip">
                    Hi! 我是 <span class="inner-name">{{ formTemp.manager.real_name || formTemp.manager.user_nickname || '待完善' }} </span>
                    邀请您成为创业合伙人，卡盟大舞台，有梦你就来
                  </span>

                  <!-- <span class="name"><span class="fc">{{ formTemp.manager.level || '待完善' }}</span></span> -->
                </div>
                <div class="info">
                  <span>推荐码：</span>
                  <span v-if="formTemp.manager.job_no" class="num">{{ formTemp.manager.invite_code || '待完善' }}</span>
                  <span v-else class="text">待完善</span>
                </div>
                <div class="contact">
                  <a href="javascript:" class="wechat" @click="addWeChat()">
                    <i class="icon icon-wechat"></i>
                    <span class="name">微信聊</span>
                  </a>
                  <a v-if="formTemp.manager.mobile" :href="'tel:' + formTemp.manager.mobile" class="phone">
                    <i class="icon icon-call"></i>
                    <span class="name">电话聊</span>
                  </a>
                  <a v-else href="javascript:" class="phone" @click="noPhone">
                    <i class="icon icon-call"></i>
                    <span class="name">电话聊</span>
                  </a>
                </div>
              </div>
            </div>
            <div class="agree">
              <div class="checbox"><Checkbox v-model="single"></Checkbox></div>
              <span class="text">我已认真阅读<a href="javascript:" @click="isShow = true">《卡盟金服平台服务协议》</a>，认同平台的经营模式，并自愿接受协议中的条款。</span>
            </div>
          </div>
          <!-- <img src="~assets/images/introduce-01-31.jpg" v-if="!isWechatClient"> -->
          <img src="~assets/images/introduce-01-31.jpg">
          <div class="info-box">
  					<div class="introduce">
  						<div class="top">
  							<i class="sp sp-notice"></i>
  							<span class="title">产品介绍</span>
  						</div>
  						<div class="content">
  							<div class="text">一款集信用卡办理，信用卡还款，小额贷款，违章查询，智能收款及账单管理等于一体的综合金融服务平台。</div>
  						</div>
  					</div>
          </div>
          <div class="info-box">
  					<div class="introduce">
  						<div class="top">
  							<i class="sp sp-like"></i>
  							<span class="title">产品优势</span>
  						</div>
  						<div class="content">
  							<div class="sill">
  								<span class="left">低门槛</span>
  								<span class="right">微投入，只需要缴纳198元/人即可参与</span>
  							</div>
  							<div class="sill">
  								<span class="left">业务多</span>
  								<span class="right">集合了信用卡还款，小额贷款，违章查询，智能收款及账单管理等一体</span>
  							</div>
  							<div class="sill">
  								<span class="left">收益多</span>
  								<span class="right">代理层级制，所属层级内每级都可拿分润</span>
  							</div>
  							<div class="sill">
  								<span class="left">无消费</span>
  								<span class="right">客户无消费压力，分享即可获得收益</span>
  							</div>
  						</div>
  					</div>
          </div>
  				<div class="info-box">
  					<div class="introduce">
  						<div class="top">
  							<i class="sp sp-agent-01"></i>
  							<span class="title">代理权益</span>
  						</div>
  						<div class="content">
  							<div class="text">团队内代理获得相应的分润比</div>
  						</div>
  						<div class="top">
  							<p class="headline">高级会员收益</p>
  						</div>
  						<div class="content">
  							<div class="text">推荐办理车险，享受奖金额度75%的返佣；推荐办理信用卡贷款按奖金总额60%-95%分配；享受刷卡、精养卡费率差收益；推荐升级会员，最高可返佣70%</div>
  						</div>
  						<div class="top">
  							<p class="headline">保险专员</p>
  						</div>
  						<div class="content">
  							<div class="text">推荐办理车险，享受奖金额度85%的返佣；推荐办理信用卡贷款按奖金总额60%-95%分配；享受刷卡、精养卡费率差收益；推荐升级会员，最高可返佣70%</div>
  						</div>
  						<div class="top">
  							<p class="headline">保险经理人</p>
  						</div>
  						<div class="content">
  							<div class="text">推荐办理车险，享受奖金额度95%的返佣；推荐办理信用卡贷款按奖金总额60%-95%分配；享受刷卡、精养卡费率差收益；推荐升级会员，最高可返佣70%</div>
  							<div class="text">（备注：只有成为代理后才能拿对应分润，普通会员不参与）</div>
  						</div>
  					</div>
          </div>
  				<!-- <div class="info-box">
  					<div class="introduce">
  						<div class="top">
  							<i class="sp sp-rule"></i>
  							<span class="title">退款规则</span>
  						</div>
  						<div class="top">
  							<p class="headline">高级会员退款规则</p>
  						</div>
  						<div class="content">
  							<div class="content">
  							<div class="text">A , 直推信用卡30张，并成功拿到佣金。</div>
  							<div class="text">B , 直推汽车保险15单。</div>
  							<div class="text">C , 直接招商5名高级会员或以上身份会员。</div>
  							<div class="text">达到上述3个条件后，会员可在个人中心向平台发起退还保证金申请，工作人员审核后将原数退还保证金198元，退款后会员身份不变，任可享受直推收益。</div>
  						</div>
  						</div>
  						<div class="top">
  							<p class="headline">保险专员退款规则</p>
  						</div>
  						<div class="content">
  							<div class="content">
  							<div class="text">A , 直推信用卡30张，并成功拿到佣金。</div>
  							<div class="text">B , 直推汽车保险20单。</div>
  							<div class="text">C , 直接招商5名高级会员或以上身份会员。</div>
  							<div class="text">达到上述3个条件后，会员可在个人中心向平台发起退还保证金申请，工作人员审核后将原数退还保证金298元，退款后会员身份不变，任可享受直推收益。</div>
  						</div>
  						</div>
  						<div class="top">
  							<p class="headline">保险经理退款规则</p>
  						</div>
  						<div class="content">
  							<div class="content">
  							<div class="text">A , 直推信用卡30张，并成功拿到佣金。</div>
  							<div class="text">B , 直推汽车保险30单。</div>
  							<div class="text">C , 直接招商5名高级会员或以上身份会员。</div>
  							<div class="text">达到上述3个条件后，会员可在个人中心向平台发起退还保证金申请，工作人员审核后将原数退还保证金598元，退款后会员身份不变，任可享受直推收益。</div>
  						</div>
  						</div>
  					</div>
          </div> -->
  				<div class="info-box">
  					<div class="introduce">
  						<div class="top">
  							<i class="sp sp-rule"></i>
  							<span class="title">退款规则</span>
  							<div class="headline">高级会员退款规则</div>
  						</div>
  						<div class="content">
  							<div class="text">A , 直推信用卡30张，并成功拿到佣金。</div>
  							<div class="text">B , 直推汽车保险20单。</div>
  							<div class="text">C , 直接招商10名高级会员或以上身份会员。</div>
  							<div class="text">达到上述3个条件后，会员可在个人中心向平台发起退还保证金申请，工作人员审核后将原数退还保证金198元，退款后会员身份不变，任可享受直推收益。</div>
  						</div>
  					</div>
  					<div class="introduce">
  						<div class="top">
  							<div class="headline">保险经理退款规则</div>
  						</div>
  						<div class="content">
  							<div class="text">A , 直推信用卡40张，并成功拿到佣金。</div>
  							<div class="text">B , 直推汽车保险25单。</div>
  							<div class="text">C , 直接招商15名高级会员或以上身份会员。</div>
  							<div class="text">达到上述3个条件后，会员可在个人中心向平台发起退还保证金申请，工作人员审核后将原数退还保证金298元，退款后会员身份不变，任可享受直推收益。</div>
  						</div>
  					</div>
  					<div class="introduce">
  						<div class="top">
  							<div class="headline">保险主任退款规则</div>
  						</div>
  						<div class="content">
  							<div class="text">A , 直推信用卡40张，并成功拿到佣金。</div>
  							<div class="text">B , 直推汽车保险30单。</div>
  							<div class="text">C , 直接招商25名高级会员或以上身份会员。</div>
  							<div class="text">达到上述3个条件后，会员可在个人中心向平台发起退还保证金申请，工作人员审核后将原数退还保证金598元，退款后会员身份不变，任可享受直推收益。</div>
  						</div>
  					</div>
          </div>
  				<div class="info-bottom">
  					<div class="line"></div>
  					<div class="theme">卡盟金服平台介绍</div>
  					<i class="sp sp-direction"></i>
  				</div>

          <div class="swiper-slide">
            <div class="profile">
              <img src="~assets/images/introduce-01.jpg">
            </div>
          </div>
        </div>
        <!-- <div class="profile">
          <div class="headline">
            <span class="text">注意事项</span>
          </div>
          <div class="white-box">
            <div class="words">卡盟金服平台对所有用户实行无限期永久免费，凡申请信用卡、贷款、以及申请成为平台代理商，均不收取任何费用。</div>
          </div>
          <div class="headline">
            <span class="text">卡盟金服平台介绍</span>
          </div>
          <div class="image-box">
            <img src="~assets/images/kemeng-profile01.jpg" alt="">
          </div>
          <div class="white-box">
            <div class="words">卡盟金服是广州卡盟信息科技有限公司旗下金融综合服务平台，多家国有银行、商业银行战略合作，中国人保承保，对接人民银行征信系统，首创了“普通大众+银行金融服务”合作新模式，通过移动互联网让大众参与银行、金融机构利润分配规则中去，探索全新的互联网金融发展模式。旨在改变银行、金融机构原有的推广及盈利模式，让大众共享金融领域红利，真正实现人人都是金融达人的梦想。</div>
            <div class="words">现已成功与多家国有或股份制商业银行、中国百强金融服务机构达成战略合作，并已取得了良好的合作口碑，在广大代理商伙伴的努力下，推广成绩良好，营收稳步增长，代理商收益丰厚，平台发展势头喜人。后续我们将陆续和国内顶级银行、金融服务机构达成合作，全方位多角度为合作伙伴提供更优质的资源及更专业的服务。</div>
          </div>
          <div class="white-box">
            <div class="words">卡盟金服作为专业的互联网金融服务平台，聚合了全国百余家金融服务机构的核心业务产品，让平台用户真正参与其中，共享金融产品红利分配。</div>
            <div class="title">七大核心金融业务模块</div>
            <ul class="module-list">
              <li class="item">
                <div class="image sp sp-core-module01"></div>
                <div class="name">信用卡</div>
              </li>
              <li class="item">
                <div class="image sp sp-core-module02"></div>
                <div class="name">贷款</div>
              </li>
              <li class="item">
                <div class="image sp sp-core-module03"></div>
                <div class="name">无卡支付</div>
              </li>
              <li class="item">
                <div class="image sp sp-core-module04"></div>
                <div class="name">智能精养卡</div>
              </li>
              <li class="item">
                <div class="image sp sp-core-module05"></div>
                <div class="name">信贷圈</div>
              </li>
              <li class="item">
                <div class="image sp sp-core-module06"></div>
                <div class="name">提额培训</div>
              </li>
              <li class="item">
                <div class="image sp sp-core-module07"></div>
                <div class="name">征信查询</div>
              </li>
            </ul>
          </div>
          <div class="white-box">
            <div class="title">六大核心优势</div>
            <ul class="lead-list">
              <li class="item">
                <div class="box">
                  <div class="image sp sp-core-lead01"></div>
                  <div class="name">门楷低</div>
                  <div class="text">凡认同卡盟金服平台模式的用户均可参与</div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="image sp sp-core-lead02"></div>
                  <div class="name">投资小</div>
                  <div class="text">零投入，轻创业才是卡盟金服的价值所在 </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="image sp sp-core-lead03"></div>
                  <div class="name">无消费</div>
                  <div class="text">客户不需要购物，无消费压力</div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="image sp sp-core-lead04"></div>
                  <div class="name">见效快</div>
                  <div class="text">开通代理权限即可开始获取推广收益</div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="image sp sp-core-lead05"></div>
                  <div class="name">无费用</div>
                  <div class="text">办卡、贷款没有前期，无点数</div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="image sp sp-core-lead06"></div>
                  <div class="name">高回报</div>
                  <div class="text">重新分配银行、金融机构返润，轻松月入3万以上</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="white-box">
            <div class="title">收入才是硬指标</div>
            <div class="words">卡盟金服作为一个综合性金融服务的创业平台，除了帮助大众实现创业的梦想外，更主要的是带领平台代理商，参与金融产品红利的再分配，真正的让代理商从中获取更高额的收益回报。</div>
            <div class="circle">
              <span class="image sp sp-core-circle01"></span>
            </div>
          </div>
          <div class="white-box">
            <div class="words">代理商除了可以推广信用卡外，也可以推荐有资金需求的用户在卡盟金服平台申请无抵押信用贷款和抵押贷款，1000至50万秒批下款。代理商还可以推广银联快捷无卡支付、智能精养卡，方便自己使用的同时，代理商同样可以获得高额的平台奖励，支付费率差，智能养卡返润。雪中送炭同样值得被奖励。</div>
            <div class="circle">
              <span class="image sp sp-core-circle02"></span>
            </div>
            <div class="tips">注：以贷款额度￥200000.00计算，其单笔贷款奖励金将高达￥3000.00</div>
          </div>
          <div class="white-box">
            <div class="title">真正的创业零投入</div>
            <div class="words">加入卡盟金服，无需资金投入、无需从业经验、更不用承担任何创业风险，轻装上阵，快速实现用户裂变，长期稳定的管道收益模式，真正让您实现零投入轻创业高回报之梦。</div>
            <div class="circle">
              <span class="image sp sp-core-circle03"></span>
            </div>
            <div class="tips">成功推广信用卡、贷款三笔就可以免费申请成为平台代理商</div>
          </div>
          <div class="white-box">
            <div class="title">同样申请信用卡</div>
            <div class="tips">选择卡盟金服更方便、更快捷、更安全</div>
            <div class="words">卡盟金服与众多国有或股份制商业银行、中国百强金融服务机构直接签约，达成线上推广合作协议。无需提供工作、收入、社保及银行交易流水证明，只需填写真实有效的个人申请信息，就可以轻松申请各种信用卡。银行官方系统专属通道申请，更安全、更高效、有保障，享受跟线下申请的信用卡同等权益。</div>
          </div>
          <div class="footer-box">
            <div class="line">
              <span class="text"><span class="sp sp-core-logo01"></span>中国人保</span>
              <span class="text"><span class="sp sp-core-logo02"></span>公安网：44011102001044号</span>
            </div>
            <div class="line">
              <span class="text">网站备案号：粤ICP备16059225号</span>
            </div>
          </div>
        </div> -->
      </div>
    </scroller>

    <div class="join-btn">
      <a class="item" href="javascript:" @click="invite">立即加入卡盟金服</a>
    </div>

    <ServiceAgreement v-model="isShow"></ServiceAgreement>

    <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: '专属客户经理二维码', wx_qrcode: formTemp.manager.wx_qrcode, wechat_account: formTemp.manager.wechat_account }"></WechatCode>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
