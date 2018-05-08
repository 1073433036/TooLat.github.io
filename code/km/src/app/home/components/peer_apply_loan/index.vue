<template>
  <div class="peer-apply-loan-page">
    <app-header title="我要申请" :other="isCompany" v-on:other="isCompany = false"></app-header>
    <scroller>
      <div v-show="!isApplySuccess" class="wrapper">
        <div class="top-content">
          <div class="left">
            <i class="sp sp-horn"></i>
          </div>
          <div class="right">请填写您的产品信息，便于客户直接联系您，暂不能发布信用卡，押车类的广告（带*号项目必填）</div>
        </div>
        <div class="menu-group">
          <ul class="list">
            <li class="item">
              <div class="left">
                <i class="sp sp-task-name"></i>
                <span>姓名</span>
                <span class="required">*</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.name" class="width" placeholder="请填写姓名">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <i class="sp sp-profile-02"></i>
                <span>身份证号码</span>
                <span class="required">*</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.id_card" class="width" maxlength="18" placeholder="身份证号码">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <i class="sp sp-task-unit"></i>
                <span>所在单位</span>
                <span class="required">*</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.company" class="width" placeholder="请填写所在单位">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <i class="sp sp-task-mobile"></i>
                <span>联系方式</span>
                <span class="required">*</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.phone" class="width" placeholder="请填写联系方式">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <i class="sp sp-invite-02"></i>
                <span>微信号</span>
                <span class="required">*</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.wechat_account" class="width" placeholder="未填写">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <i class="sp sp-task-money"></i>
                <span>可贷款金额</span>
                <span class="required">*</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.lender_amount" class="width" placeholder="请填写贷款金额">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <i class="sp sp-task-time"></i>
                <span>贷款期限</span>
                <span class="required">*</span>
              </div>
              <div class="right" v-on:click="handleBotSelectChange('repay_date_limit')">
                <div class="input">
                  <input type="text" class="readyonly-input" v-model="formData.repay_date_limit.name" readonly placeholder="请选择">
                </div>
                <i class="sp sp-right"></i>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <i class="sp sp-interest-rate"></i>
                <span>贷款利率</span>
                <span class="required">*</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" class="readyonly-input" v-model="formData.lender_rate" placeholder="请填写贷款利率">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <i class="sp sp-task-city"></i>
                <span>所在城市</span>
                <span class="required">*</span>
              </div>
              <div class="right" v-on:click.stop="handleCityShowChange">
                <div class="input">
                  <input type="text" class="readyonly-input" v-model="applyBackCity.region_name" readonly placeholder="请选择">
                </div>
                <i class="sp sp-right"></i>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <i class="sp sp-business-10"></i>
                <span>业务范围</span>
                <span class="required">*</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" class="readyonly-input" v-model="formData.business" placeholder="请填写业务范围">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <i class="sp sp-business-06"></i>
                <span>贷款类型</span>
                <span class="required">*</span>
              </div>
              <div class="right" v-on:click="handleBombBoxChange('lender_type')">
                <div class="input">
                  <input type="text" class="readyonly-input" v-model="formData.lender_type.name" readonly placeholder="请选择">
                </div>
                <i class="sp sp-right"></i>
              </div>
            </li>
            <li class="item bordernone">
              <div class="left">
                <i class="sp sp-business-09"></i>
                <span>贷款详情介绍</span>
                <span class="required">*</span>
              </div>
              <div class="right" @click="editCompany">
                <div class="input">
                  <input type="text" class="readyonly-input" v-model="formData.lender_desc" readonly placeholder="请填写贷款详情">
                </div>
                <i class="sp sp-right"></i>
              </div>
            </li>
          </ul>
          <ul class="pass-data-list">
            <li class="item bordernone">
              <div class="left">
                <i class="sp sp-share"></i>
                <span>上传微信二维码</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="file" class="file readyonly-input" name="image" accept="image/*" ref="wx_qrcode" v-on:change="setImage($event, 'wx_qrcode')" />
                </div>
                <img v-show="formData.wx_qrcode" class="sm-img" :src="formData.wx_qrcode">
                <img v-show="!formData.wx_qrcode" class="sm-img" src="~assets/images/uploading-01.png">
                <i class="sp sp-right"></i>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <i class="sp sp-company-license"></i>
                <span>上传公司营业执照</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="file" class="file readyonly-input" name="image" accept="image/*" ref="company_license" v-on:change="setImage($event, 'company_license')" />
                </div>
                <img v-show="formData.company_license" class="sm-img" :src="formData.company_license">
                <img v-show="!formData.company_license" class="sm-img" src="~assets/images/uploading-01.png">
                <i class="sp sp-right"></i>
              </div>
            </li>
            <li class="item bordernone">
              <div class="left">
                <i class="sp sp-work-prove"></i>
                <span>上传工作证明</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="file" class="file readyonly-input" name="image" accept="image/*" ref="work_card" v-on:change="setImage($event, 'work_card')" />
                </div>
                <img v-show="formData.work_card" class="sm-img" :src="formData.work_card">
                <img v-show="!formData.work_card" class="sm-img" src="~assets/images/uploading-01.png">
                <i class="sp sp-right"></i>
              </div>
            </li>
          </ul>
        </div>
        <div class="btn-submit" v-on:click="handleSubmit">提交</div>
      </div>
    </scroller>

    <div v-show="false" class="loan-top">
      <router-link :to="{ name: 'home.LoanStick', params: { id: 1 } }" class="link">我要置顶</router-link>
    </div>

    <div v-if="isApplySuccess" class="apply-submit-success">
      <div class="top">
        <i class="sp sp-pay-complete"></i>
        <h3>恭喜您，提交成功</h3>
        <p>平台将对你的信息进行审核，通过后即可抢单，祝您使用愉快！</p>
      </div>
      <router-link class="btn-loan" :to="{ path: '/'}">
        <div class="btn-backhome">返回首页</div>
      </router-link>
    </div>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div v-show="isCompany" class="company">
        <scroller>
          <div class="desc">
            <div class="content">
              <div class="title">请输入公司简介</div>
              <textarea class="textarea" maxlength="100" v-model="lender_desc_test"></textarea>
              <div class="number">{{ useLen }}/100</div>
            </div>
            <div class="btn">
              <button type="button" @click="saveDesc">保存</button>
            </div>
          </div>
        </scroller>
      </div>
    </transition>

    <BotSelect v-on:onChildClick="botSelectClick" :title="botTitle" :show="isShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BotSelect>
    <BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BombBox>

    <cropper v-on:uploadFileClose="fileClose"></cropper>

    <CityList></CityList>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>