<template>
  <div class="user-invite-page">
    <app-header title="去邀请好友"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container on">
          <div v-if="1 >= level" class="goods">
            <h2 class="title">卡盟金服智能信用卡管家使用保证金</h2>
            <div class="money">
              <!-- <em>￥</em>
              <span>198.00</span> -->
							<span class="general" v-if="level == 1">（您目前还是普通会员）</span>
            </div>
            <router-link :to="{ name: 'user.BuyVip' }" class="item">立即升级</router-link>
          </div>

          <div class="user-info">
            <div class="head">
              <i class="sp sp-invite-01"></i>
              <span>个人推广信息</span>
            </div>
            <div class="body">
              <div class="avatar">
                <img v-if="userInfo.avatar_full" :src="userInfo.avatar_full">
                <img v-else src="~assets/images/default-avatar.png">
              </div>
              <div class="text">
                <div class="item">
                  <span class="name">{{ userInfo.real_name || userInfo.user_nickname }}</span>
                  <span v-if="userInfo.level_name || userInfo.level" class="tye">
                    (
                    {{ userInfo.level_name }}
                    <i v-if="0 < userInfo.level" class="sp" :class="'sp-level-0' + userInfo.level"></i>
                    )
                  </span>
                  <!-- <span class="num">工号：{{ formTemp.manager.job_no || '未知' }}</span> -->
                </div>

                <div class="item">
                  <span class="title">推荐码：</span>
                  <span class="val">{{ userInfo.invite_code || '' }}</span>
                </div>
                <div class="item">
                  <span class="title">手机号：</span>
                  <span class="val">{{ userInfo.mobile || '待完善' }}</span>
                </div>

                <div class="btn-group">
                  <a class="btn-item" v-on:click="addWeChat">
                    <i class="sp sp-invite-02"></i>
                    <span>微信聊</span>
                  </a>
                  <a v-if="userInfo.mobile" :href="'tel:'+ userInfo.mobile" class="btn-item">
                    <i class="sp sp-invite-03"></i>
                    <span>电话聊</span>
                  </a>
                  <a v-else href="javascript:" class="btn-item" @click="noPhone">
                    <i class="sp sp-invite-03"></i>
                    <span>电话聊</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="agree">
            <Checkbox v-model="single">
              <span>我已认真阅读</span>
              <a href="javascript:" class="link" ><span @click="isShow = true">《卡盟金服平台服务协议》</span> <span @click="isShowStandard = true">《推广规范》</span></a>
              <span>，认同平台的经营模式，并自愿接受协议中的条款。</span>
            </Checkbox>
          </div>

          <!-- <div class="profile" v-if="!isWechatClient"> -->
          <div class="profile">
            <img src="~assets/images/invite/2_01.png">
            <img src="~assets/images/invite/2_02.png">
            <img src="~assets/images/invite/2_03.png">
            <img src="~assets/images/invite/2_04.png">
            <img src="~assets/images/invite/2_05.png">
            <img src="~assets/images/invite/2_06.png">
            <img src="~assets/images/invite/2_07.png">
            <img src="~assets/images/invite/2_08.png">
            <!-- <img src="~assets/images/introduce-03.jpg"> -->
          </div>

<!--           <div class="profile">
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
              <div class="title">八大核心金融业务模块</div>
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
                <li class="item">
                  <div class="image sp sp-core-module08"></div>
                  <div class="name">展业工具</div>
                </li>
              </ul>
            </div>
            <div class="white-box">
              <div class="title">八大核心优势</div>
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
                <li class="item">
                  <div class="box">
                    <div class="image sp sp-core-lead07"></div>
                    <div class="name">批卡快</div>
                    <div class="text">跟国家商业银行签约合作，内部批卡</div>
                  </div>
                </li>
                <li class="item">
                  <div class="box">
                    <div class="image sp sp-core-lead08"></div>
                    <div class="name">收益多</div>
                    <div class="text">专业金融服务平台，有多个板块推广服务收益</div>
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
							<div class="card-info">
								<p class="text">全国8.5亿张信用卡，660个城市，平均每个城市1200万张信用卡！全国除去老人小孩人均2张信用卡，需要以卡办卡，需要刷卡支付，需要智能养卡，这就是市场 ！这么大的市场，你要不要占领！</p>
								<p class="salute">—— 致一直在迷茫方向的您</p>
							</div>
            </div>
            <div class="white-box">
              <div class="title">跑马圈地 + 建立团队的重要性</div>
							<div class="earnings">三级收益模式  团队开启自动裂变</div>
              <div class="info">暂且不算我们平时推广会员加盟代理费，直推奖金和间推奖金的收入。我们举例来算一笔以后躺赚收益的账单！</div>
							<div class="example"><strong>例：</strong>您推荐50个人成功下卡，那么您是专员身份，直推办卡佣金 <i>50 人x 60元x 85%=2550元</i>（每张卡平均佣金按60元算）</div>
							<div class="example">您推荐的50人又每人推荐30人成功下卡，得间推办卡佣金 <i>50人x 30人 x 60元 x 25%=22500元</i></div>
							<div class="example">那团队下面的30人又去推荐办卡，您又可以得到更多的佣金…</div>
              <div class="photo">
								<img src="~assets/images/people-01.png" alt="">
							</div>
            </div>
            <div class="white-box">
              <div class="rate">团队每个用户后面就以卡办卡的方式，99% 下卡率，就人均 3万总额度的信用卡，那么50人+50 x30=1550人，总信用卡额度4650万，那么按0.2%的智能养卡或支付费率差算，一个月智能养卡和支付的费率差:</div>
							<div class="profit">
								<div>月利润</div>
								<div class="number">4650万 x 0.2%=93000元</div>
								<div class="result">
									<span>总额度</span>
									<span>费率差</span>
									<span>利润</span>
								</div>
							</div>
              <div class="rate">那么每个月至少可以躺赚 93000元，加上推荐办卡收入25000元+不断裂变的推广收益一年至少躺赚 111万元，五年就是 555万，加上后期下级用户的不断积累数字会越来越庞大。</div>
							<div class="circle">
                <span class="image sp sp-core-circle04"></span>
              </div>
              <div class="rate">退一步来说，我们把收益率除以一半50%  来计算，那么您一年的躺赚收益也有55万元，五年就是 277万,十年就是554万，全部都是被动收益，真正的躺赚模式!</div>
            </div>
						<div class="white-box">
              <div class="title">同样申请信用卡</div>
							<div class="earnings">选择卡盟金服更方便、更快捷、更安全</div>
							<div class="rate">卡盟金服与众多国有或股份制商业银行、中国百强金融服务机构直接签约，达成线上推广合作协议。无需提供工作、收入、社保及银行交易流水证明，只需填写真实有效的个人申请信息，就可以轻松申请各种信用卡。银行官方系统专属通道申请，更安全、更高效、有保障，享受跟线下申请的信用卡同等权益。</div>
            </div>
						<div class="white-box">
              <div class="title">卡盟金服未来目标</div>
							<div class="rate">平台做大做强，有真实会员数据体量，申请自己正规的国家级支付牌照，布局全国移动互联网支付渠道!</div>
							<div class="circle">
                <span class="image sp sp-core-circle05">
									<span class="layout">布局全国</span>
								</span>
              </div>
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
      </div>
    </scroller>

    <div class="join-btn">
      <a class="btn" href="javascript:" @click="invite">立即邀请好友加入</a>
      <div class="pib_rotate">
        <div></div>
        <div></div>
        <div></div>
      </div>

    </div>

    <ServiceAgreement v-model="isShow"></ServiceAgreement>
    <posterAgreement v-model="isShowStandard"></posterAgreement>

    <WechatCode v-on:wechatClose="wechatClose" :show="isWechat" :formTemp="{ title: '微信二维码', wx_qrcode: userInfo.wx_qrcode, wechat_account: userInfo.wechat_account }"></WechatCode>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
