<template>
  <div class="agency_profile-page">
    <app-header title="个人设置" :other="isEditPhone" v-on:other="handleOther">
      <div v-show="!isEditPhone" class="slot" slot="right" v-on:click="handleSumbit()">
        <span>保存</span>
      </div>
    </app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">
            <div class="input-group">

              <div class="input-item">
                <i class="sp sp-business-05"></i>
                <span>头像</span>
                <div class="right">
                  <div class="file-avatar">
                    <div class="avatar">
                      <img v-if="avatar" :src="avatar">
                      <img v-else src="~assets/images/avatar.png">
                    </div>
                    <input type="file"
                      class="input"
                      name="image"
                      accept="image/*"
                      ref="file"
                      v-on:change="setImage($event, 'file')"/>
                  </div>
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-task-name"></i>
                <span>昵称</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.user_nickname"
                    type="text"
                    vd-notify='{
                      "text": "昵称不能为空",
                      "patt": "昵称格式不正确"
                    }'
                    placeholder="请输入昵称">
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-task-mobile"></i>
                <span>手机号</span>
                <div class="right">
                  <!-- <span>{{ formData.phone || '请输入联系方式' }}</span> -->
                  <input vd-required
                    v-model="formData.mobile"
                    type="text"
                    vd-notify='{
                      "text": "手机号不能为空",
                      "patt": "手机号格式不正确"
                    }'
                    placeholder="请输入常用手机号码">
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item" v-on:click="handleCityShowChange()">
                <i class="sp sp-address"></i>
                <span>所在地</span>
                <div class="right">
                  <span v-if="address">{{ address }}</span>
                  <span v-else class="fc">请选择</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item" v-on:click="handleBombBoxChange('identity')">
                <i class="sp sp-profile-01"></i>
                <span>身份情况</span>
                <div class="right">
                  <span v-if="formData.identity.name">{{ formData.identity.name }}</span>
                  <span v-else class="fc">请选择</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

              <!-- <div class="input-item">
                <i class="sp sp-profile-05"></i>
                <span>是否有信用卡</span>
                <div class="right">
                  <Radio :dataList="formTemp.has_card" v-model="formData.has_card"></Radio>
                </div>
              </div> -->

              <!-- <div class="input-item">
                <i class="sp sp-profile-06"></i>
                <span>是否有车</span>
                <div class="right">
                  <Radio :dataList="formTemp.has_car" v-model="formData.has_car"></Radio>
                </div>
              </div> -->

              <!-- <div class="input-item">
                <i class="sp sp-profile-07"></i>
                <span>微信号</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.wechat_account"
                    type="text"
                    vd-notify='{
                      "text": "微信号不能为空",
                    }'
                    placeholder="请输入微信号">
                </div>
                <i class="sp sp-right"></i>
              </div> -->

              <!-- <div class="input-item" @click="isWeChatCode = true">
                <i class="sp sp-profile-03"></i>
                <span>上传微信二维码</span>
                <div class="right">
                  <span v-if="formData.wx_qrcode">已上传</span>
                  <span v-else class="fc">请上传</span>
                </div>
                <i class="sp sp-right"></i>
              </div> -->

            </div>

            <div class="input-group">
              <div class="input-item" @click="realName">
                <i class="sp sp-profile-02"></i>
                <span>实名认证</span>
                <div class="right">
                  <span v-if="formData.real_name">已认证</span>
                  <span v-else class="fc">未认证</span>
                </div>
                <i class="sp sp-right"></i>
              </div>
              <div class="input-item" @click="isWeChatCode = true">
                <i class="sp sp-profile-03"></i>
                <span>上传微信二维码</span>
                <div class="right">
                  <span v-if="formData.wx_qrcode">已上传</span>
                  <span v-else class="fc">请上传</span>
                </div>
                <i class="sp sp-right"></i>
              </div>
            </div>

          </form>
          <div class="logout-btn">
            <a href="javascript:" @click="logout">退出登录</a>
          </div>
        </div>
      </div>
    </scroller>

    <!-- 下面的暂时保留 -->
    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div v-show="isEditPhone" class="mask-mobile">
        <div class="inner">
          <scroller>
            <div class="content">
              <form class="form-group" ref="form" @submit.prevent="handleMobile">
                <div class="input-group">
                  <div class="input-item">
                    <i class="sp sp-phone"></i>
                    <span>手机号</span>
                    <input vd-required
                      vd-validate
                      vd-type="phone"
                      v-model.trim="formData.username"
                      type="text"
                      vd-notify='{
                        "text": "请输入11位手机号码",
                        "patt": "手机号码格式不正确"
                      }'
                      placeholder="请输入11位手机号码">
                  </div>

                  <div class="input-item">
                    <i class="sp sp-phone-code"></i>
                    <span>验证码</span>
                    <input vd-required
                      v-model.trim="formData.code"
                      type="text"
                      vd-notify='{
                        "text": "请输入验证码",
                      }'
                      placeholder="请输入验证码">
                      <div class="code">
                        <phoneCode title="获取验证码" :phone="formData.username"></phoneCode>
                      </div>
                  </div>
                  <div class="button-item">
                    <button type="submit" class="btn transit">修改</button>
                  </div>
                </div>
              </form>
            </div>
          </scroller>
        </div>
      </div>
    </transition>
    <!-- End -->
    <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
      <div class="wechat-code" v-show="isWeChatCode">
        <div class="header">
          <a href="javascript:" class="back" @click="isWeChatCode = false"></a>
          <div class="title">上传微信二维码</div>
        </div>
        <scroller>
          <div class="body">
            <div class="box">
              <div class="image">
                <div class="code">
                  <img :src="formData.wx_qrcode" alt="">
                  <input type="file"
                    name="image"
                    accept="image/*"
                    ref="code"
                    v-on:change="setImage($event, 'code')"/>
                </div>
              </div>
              <div class="text">点击二维码可重新上传</div>
            </div>
          </div>
        </scroller>
      </div>
    </transition>

    <BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BombBox>
    <CityList></CityList>
    <cropper v-on:uploadFileClose="fileClose"></cropper>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>