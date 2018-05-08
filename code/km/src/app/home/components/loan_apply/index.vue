<template>
  <div class="loan-apply-page">
    <app-header title="贷款申请"></app-header>
    <scroller ref="myscroller">

      <!-- <div class="banner">
        <img src="~assets/images/loan-banner.jpg">
      </div> -->

      <div class="banner" ref="mySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="photo-item">
              <img src="~assets/images/loan-banner-1.jpg">
            </div>
          </div>
          <div class="swiper-slide">
            <div class="photo-item">
              <img src="~assets/images/loan-banner-2.jpg">
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>

      <div class="explain">
        <div class="title">选择或添加申请人信息</div>
        <div class="content">
          <div class="box">请确保选择或添加的申请人信息与贷款申请表所填信息保持真实一致，以免影响信用贷款进度；本平台对此信息保密，仅作提交金融机构工作人员审核,审核通知将以短信形式发送至该号码。</div>
        </div>
      </div>

      <div class="info-wrapper" v-show="0 < formList.length">
        <ul class="list">
          <transition-group enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
            <li class="item" :class="{'on': itemColor === item.name }" v-for="(item, index) in formList" :key="index" v-if="(index===0 && !list) || list" >
              <a href="javascript:" @click="handelSelectData(item.name, item.phone, item.id)">
                <div class="text">姓名：{{ item.name }}</div>
                <div class="text">证件：{{ item.id_number }}</div>
                <div class="text">电话：{{ item.phone }}</div>
                <!--<div class="text"><span>所在地：</span>{{ item.address }}</div>-->
                <span class="selecd kuang" v-show="sselectstatus"  ><em>请勾选</em></span>
                <div class="select">
                  <i class="icon icon-choice"></i>
                </div>
                <span class="selected">已选择</span>
              </a>
              <div class="del" @click="deleteData(item)">
                <i class="icon icon-del"></i>
              </div>
            </li>
          </transition-group>
        </ul>
      </div>

      <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
        <div class="form-wrapper" v-show="0 >= formList.length || state.addFlag">
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">
            <ul class="list">

              <li class="item">
                <i class="icon icon-user"></i>
                <div class="title">姓名</div>
                <div class="content">
                  <input type="text"
                    vd-required
                    vd-notify='{
                      "text": "申请人姓名不能为空",
                    }'
                    v-model.trim="formData.name"
                    placeholder="请填写申请人姓名">
                </div>
              </li>

              <li class="item">
                <i class="icon icon-certificates"></i>
                <div class="title">证件</div>
                <div class="content">
                  <input type="text"
                    vd-required
                    vd-validate
                    vd-type="identity"
                    vd-notify='{
                      "text": "身份证不能为空",
                      "patt": "身份证格式不正确"
                    }'
                    v-model.trim="formData.id_number"
                    placeholder="请填写申请人身份证号码">
                </div>
              </li>

              <li class="item">
                <i class="icon icon-phone"></i>
                <div class="title">电话</div>
                <div class="content">
                  <input type="text"
                    vd-required
                    vd-validate
                    vd-type="phone"
                    vd-notify='{
                      "text": "手机号码不能为空",
                      "patt": "手机号码格式不正确"
                    }'
                    v-model.number="formData.phone"
                    placeholder="请填写申请人手机号码">
                </div>
              </li>

              <li class="item">
                <i class="icon icon-vali"></i>
                <div class="title">验证码</div>
                <div class="content">
                  <input type="text"
                    vd-required
                    v-model.number="formData.code"
                    placeholder="请输入验证码">
                  <div class="code">
                    <!--<div v-if="checkPhoneSame" class="check-phone">此手机号已注册</div>-->
                    <phoneCode title="获取验证码" :phone="formData.phone"></phoneCode>
                  </div>
                </div>
              </li>

              <!--<li class="item">
                <i class="icon icon-home"></i>
                <div class="title">所在地</div>
                <div class="content" v-on:click="handleCityShowChange()">
                  <span>{{ address || '请选择' }}</span>
                </div>
                <i class="sp sp-right"></i>
              </li>-->

            </ul>
            <div class="submit-btn">
              <a href="javascript:" class="on" @click="state.addFlag=false">取消</a>
              <button type="submit" ref="submit" class="btn " :class="{ 'on': active }">{{ 0 === formList.length ? '添加信息' : '确认' }}</button>
              <!--<button type="submit" class="btn" :class="{'on': state.active}" :disabled="!state.active">添加信息</button>-->
            </div>
          </form>
        </div>
      </transition>

      <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
        <div class="add_content">
          <div @click="rmore" class="more" v-if="formList.length > 1" ><p ><i class="sea"></i>{{status}}</p></div>
          <div class="add" v-show="0 < formList.length && !state.addFlag">
            <a href="javascript:" @click="handleApply()">
              <i class="icon icon-add"></i>
              <span>新添加申请人信息</span>
            </a>
          </div>
        </div>
      </transition>

      <div class="agree-wrapper">
        <div class="agree">
          <Checkbox v-model="single">
            <span>阅读并同意</span>
            <span class="link" @click.stop="openCardProtocol('card')">《卡盟金服服务协议》</span>
          </Checkbox>
        </div>
        <div class="tips">注：在卡盟申请贷款一律不收取任何费用，如有向您索要手续费的请拨打电话400-018-8616向平台举报。</div>
      </div>

      <div class="next-step" v-show="0 < formList.length">
        <a href="javascript:" :class="{ 'active': nextColor }" v-on:click="sumbit()">提交申请</a>
      </div>

    </scroller>
    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div class="add-message" v-show="showMessage">
        <div class="layer">
          <div class="inner">
            <div class="head">
              <p>
                <!-- <span><i class="waring"></i>{{}}</span> -->
                <!--<span class="head_title"><img :src="formData.credit_card_thumb" alt="" class="logo_img" /><em class="font">{{ formData.credit_card_name }}</em></span>-->
                <span class="head_title">
                  温馨提示
                </span>
              </p>
            </div>
            <div class="body">
              <div class="select-group">
                <!-- <scroller> -->
                <div class="info_box">
                  <p class="message item">你正在给  {{uname}}  手机号:  {{uphone.substring(0,3)+"****"+uphone.substring(8,11)}}    办理小额贷款，请认真核对信息，确认无误！</p>

                  <p class="message_bottom">
                    请申请者本人，在下一步贷款机构填写信息时，确保人名、手机号资料保持一致，否则无法结算佣金，本人手机验证码确认，谢谢配合！
                    <span class="font-red">此次申请贷款机构会查询您的个人征信！</span>
                    <!--请您确保在下一步银行填写申请信息的时候，信息一定要与以上确认信息一直哦，否则将无法核算佣金！-->
                  </p>
                  <p class="phonecode">
                    <input type="text"
                           placeholder="请输入验证码"
                           class="input-item code-input"
                           v-model="pcode"
                           vd-required
                           vd-notify='{
                                  "text": "请输入验证码",
                                }'>
                    <phoneCode class="getCode code_color" title="获取验证码" :phone="uphone"></phoneCode>
                  </p>
                </div>
                <!-- </scroller> -->
              </div>
            </div>

            <div class="bot">
              <p class="close" v-on:click="MessageDismiss()">取消</p>
              <p class="complete" v-on:click="MessageSubmit()">确认</p>
            </div>

          </div>
        </div>
      </div>
    </transition>
    <div class="jump-layer">
      <div class="mask" v-show="state.jumpFlag"></div>
      <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
        <div class="jump-bank" v-show="state.jumpFlag">
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
              <div class="second">{{ second }}</div>
            </div>
          </div>
          <div class="text">正在跳转</div>
        </div>
      </transition>
    </div>
		<!-- <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
			<div v-show="show" class="mask-bank">
				<div class="inner">
					<div class="content">
						<div class="head">
							<span>银行选择</span>
							<i class="sp sp-close" v-on:click="handleClose()"></i>
						</div>
						<div class="main">
							<scroller :on-refresh="refresh" :on-infinite="infinite">
								<ul class="list">
									<li v-for="(item, index) in formTemp.data" :key="index" class="item" v-on:click="handleSelect(item)">
										<div class="img">
											<img :src="item.thumb">
										</div>
										<div class="name">
											<span>{{ item.name }}</span>
										</div>
										<i v-if="current.id !== item.id" class="sp sp-select-no"></i>
										<i v-if="current.id === item.id" class="sp sp-select-ok"></i>
									</li>
								</ul>
							</scroller>
						</div>

					</div>
				</div>
			</div>
  	</transition> -->
		<!--<CityList></CityList>-->
    
    <div class="add-msg" v-show="showM">
      <div class="layer">
        <div class="inner">
           <p>申请人信息已经在
             <i><img :src="EMUserAvatar"></i>
             <span class="accountNumber name">{{EMUserNick}}</span>
             的账号绑定过
              <span class="accountNumber">{{backBank}}</span>
            
             无法对以上贷款机构进行重复绑定，如需办理以上贷款
             可以联系之前注册账号上办理，本账号您只可以绑定其他贷款机构申请账号。
           </p>
        </div>
      </div>
    </div>
		<Protocol
      :isOpenProtocol="isOpenProtocol"
      v-on:callProtocolEvent="isOpenProtocol = false">
    </Protocol>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
