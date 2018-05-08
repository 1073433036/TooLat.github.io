<template>
  <div class="creditcard-apply-page">
    <app-header title="办卡申请"></app-header>
    <scroller ref="myscroller">

      <div class="banner">
        <div class="tips">
            <i class="icon icon-horn"></i>
            <div class="notice">
              <div class="marquee">卡盟金服信贷流量服务平台：卡盟金服平台负责互联网拓客推广申请服务，信用卡申请不需要任何费用，办卡成功后由合作银行信用卡中心结算佣金，平台佣金奖励结算方式T+2工作日！谨防电话诈骗。客服电话400-018-8616</div>
            </div>
          </div>
        <div class="images">
          <img :src="data.bank.banner">
        </div>
      </div>

      <div class="explain">
        <div class="title">选择或添加申请人信息</div>
        <div class="content">
          <div class="box remind">注:在平台登记个人的申请信息必须与银行申请填写的信息一致，否则视为无效，与银行申请信息不同，将无法结算佣金!</div>
          <!--<div class="box">请确保选择或添加的申请人信息与信用卡申请表所填信息保持真实一致，以免影响信用卡申请进度；本平台对此信息保密，仅作提交银行工作人员审核,审核通知将以短信形式发送至该号码。</div>-->
        </div>

      </div>

      <div class="info-wrapper">
        <ul class="list" >
          <transition-group enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
            <li class="item" v-for="(item, index) in formList" :key="index"  :class="{ 'on': itemColor === item.name }" v-if="(index===0 && !list) || list" >
              <a  href="javascript:;" @click="handelSelectData(item.name,item.phone,item.id)">
                <div class="text"><span>姓名：</span>{{ item.name }}</div>
                <div class="text"><span>证件：</span>{{ item.id_number }}</div>
                <div class="text"><span>电话：</span>{{ item.phone }}</div>
                <div class="text"><span>所在地：</span>{{ item.address }}</div>
                <span class="selecd kuang" v-show="sselectstatus"  ><em>请勾选</em></span>
                <div class="select selectStatus">
                  <i class="icon-choice" ></i>
                  <span class="selecd">已选择</span>
                </div>
              </a>
              <i class="icon icon-del"  @click="deleteData(item)"></i>
            </li>
          </transition-group>
        </ul>
        <!-- <div @click='rmore' class="more"><p v-if="formList.length > 0">{{status}}</p></div>  -->
      </div>


      <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
        <div class="form-wrapper" v-show="0 >= formList.length || state.addFlag">
          <form class="form-group" ref="form" @submit.prevent="checkForm">
            <ul class="list">
              <li class="item">
                <i class="icon icon-user"></i>
                <div class="title">姓名</div>
                <div class="content">
                  <input type="text"
                    vd-required
                    vd-notify='{
                      "text": "申请人姓名不能为空"
                    }'
                    v-model.trim="formData.name"
                    placeholder="请填写申请人姓名">
                </div>
              </li>
              <li class="item" >
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
                    vd-notify='{
                      "text": "请输入验证码",
                    }'
                    v-model.number="formData.code"
                    placeholder="请输入验证码">
                  <div class="code">
                    <!--<div v-if="checkPhoneSame" class="check-phone">此手机号已注册</div>-->
                    <phoneCode title="获取验证码" :phone="formData.phone"></phoneCode>
                  </div>
                </div>
              </li>

              <li class="item">
                <i class="icon icon-home"></i>
                <div class="title">所在地</div>
                <div class="content" v-on:click="handleCityShowChange()">
                  <span>{{ address || '请选择' }}</span>
                </div>
                <i class="sp sp-right"></i>
              </li>

           <!--    <li class="item">
                <i class="icon icon-bank"></i>
                <div class="title">附近银行</div>
                <div class="content check-near-bank" v-on:click="seeBankShow">
                  <i class="sp sp-location-01"></i>
                  <span class="check-near-bank-span">查看附近签约合作银行</span>
                  <i class="sp sp-right"></i>
                </div>
              </li> -->

            </ul>
            <div class="submit-btn">
              <a href="javascript:" class="on" @click="state.addFlag=false" v-show="0 < formList.length && state.addFlag">取消</a>
              <!-- 老板说：这里面第一个是要填自己的，完全可以获取实名认证的信息，下面那个添加信息，直接就改为：帮他人申请（添加信息） -->
              <button type="submit" ref="submit" class="btn " :class="{ 'on': active }">{{ 0 === formList.length ? '添加信息' : '确认' }}</button>
            </div>
             <!--<div class="submit-btn" v-show="0 < formList.length && state.addFlag">

            </div> -->
          </form>
        </div>
      </transition>

      <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
        <div class="add_content">
          <div @click="rmore" class="more" v-if="formList.length > 1" ><p ><i class="sea"></i>{{status}}</p></div>
          <div class="add" v-show="0 < formList.length && !state.addFlag" :style="{ width: wd }" >
            <a href="javascript:" @click="handleApply()">
              <i class="icon icon-add i "></i>
              <span>新添加申请人信息</span>
            </a>
          </div>
        </div>
      </transition>

      <div class="agree-wrapper">
        <div class="agree">
          <Checkbox v-model="single">
            <span>阅读并同意</span>
            <a class="link" @click.stop="openCardProtocol('card')">《卡盟金服服务协议》</a>
          </Checkbox>
        </div>
        <div class="tips">注：在卡盟申请信用卡一律不收取任何费用，如有向您索要手续费的请拨打电话400-018-8616向平台举报。</div>
      </div>

      <div class="next-step" v-show="0 < formList.length" >
        <a href="javascript:" :class="{ 'active': nextColor}"  @click="handleBankVip()">下一步</a>
      </div>

    </scroller>
    <div class="jump-layer">
      <div class="mask" v-show="state.jumpFlag"></div>
      <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
        <div class="jump-bank" v-show="state.jumpFlag">
        <!--<div class="jump-bank">-->
            <div class="notices">
              <p class="title">【温馨提示】：</p>
              <p class="notice_content">尊敬的会员您好！请确认在平台填写的信息一定要与银行填写的申请信息一致，否则将无法和银行核对账务，将无法结算佣金，请您认真阅读此提示。</p>

            </div>
            <div class="bank-name">
            <i class="icon">
              <img :src="data.bank.thumb" alt="">
            </i>
            <span>{{ data.bank.name }}信用卡中心</span>
          </div>
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
    

<!--     <transition enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutRight">
      <div v-show="show" class="notice-mask">
        <div class="inner">
          <div class="content">
            <div class="head">
              <div class="head-inner">
                <span>温馨提示</span>
                <i class="sp sp-notify-title"></i>
              </div>
              <i class="sp sp-close" v-on:click="show = false"></i>
            </div>
            <div class="body">
              <div class="body-inner">
                <div class="text">
                  <p>温馨提示：光大银行白金信用卡，目前只针对高端优质客户，有房.有车.有贷款记录者审批通过率高，白户申请须慎重！</p>
                </div>
              </div>
            </div>
            <div class="foot">
              <div class="btn">
                <div class="link" v-on:click="jump()">进度查询</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition> -->
    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div class="add-message" v-show="showMessage">
        <div class="layer">
          <div class="inner">
           <div class="head">
            <p>
              <!-- <span><i class="waring"></i>{{}}</span> -->
              <span class="head_title"><img :src="formData.credit_card_thumb" alt="" class="logo_img" /><em class="font">{{ formData.credit_card_name }}</em></span>
            </p>
           </div>
            <div class="body">
              <div class="select-group">
                <!-- <scroller> -->
                  <div class="info_box">
                      <p class="message item">你正在给  {{uname}}  手机号:  {{uphone.substring(0,3)+"****"+uphone.substring(8,11)}}    办理信用卡，请认真核对信息，确认无误！</p>

                      <p class="message_bottom">
                        请申请者本人，在下一步银行信用卡填写信息时，确保人名、手机号资料保持一致，否则无法结算佣金，本人手机验证码确认，谢谢配合！
                        <span class="font-red">此次申请银行会查询您的个人征信！</span>
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

      <div class="add-msg" v-show="showM">
      <div class="layer">
        <div class="inner">
           <p>申请人信息已经在
             <i><img :src="EMUserAvatar"></i>
             <span class="accountNumber name">{{EMUserNick}}</span>
             的账号绑定过
              <span class="accountNumber">{{backBank}}</span>
            
             无法对以上银行进行重复绑定，如需办理以上银行
             可以联系之前注册账号上办理，本账号您只可以绑定其他银行申请账号。
           </p>
        </div>
      </div>
    </div>

    <CityList></CityList>

    <Bank v-on:bankClick="handleBankClick" :show="isBankShow" :data="areaBankData"></Bank>
    <BankShow v-on:bankClick="handleBankClickShow" :show="isBankShowShow" :data="areaBankDataShow"></BankShow>
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
