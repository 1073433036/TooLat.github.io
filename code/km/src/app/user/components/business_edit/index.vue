<template>
  <div class="business-edit-page">
    <app-header title="编辑名片信息" :other="isCompany" v-on:other="handleOther">
      <div v-show="!isCompany" class="slot" slot="right" @click.prevent="handleSumbit">
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
                  <div class="avatar">
                    <img v-if="formData.avatar" :src="formData.avatar">
                    <img v-else src="~assets/images/avatar.png">
                  </div>
                  <input type="file"
                      class="input-file"
                      name="image"
                      accept="image/*"
                      ref="file"
                      v-on:change="setImage($event, 'file')"/>
                </div>
                <i class="sp sp-right"></i>
              </div>
              <div class="input-item">
                <i class="sp sp-task-name"></i>
                <span>真实姓名</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.name"
                    type="text"
                    vd-notify='{
                      "text": "真实姓名不能为空",
                      "patt": "真实姓名格式不正确"
                    }'
                    placeholder="输入真实姓名">
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-task-mobile"></i>
                <span>手机号码</span>
                <div class="right">
                  <input vd-required
                    vd-validate
                    vd-type="phone"
                    v-model="formData.phone"
                    type="text"
                    vd-notify='{
                      "text": "请输入11位手机号码",
                      "patt": "手机号码格式不正确"
                    }'
                    placeholder="请输入11位手机号码">
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-invite-02"></i>
                <span>微信号</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.wechat_account"
                    type="text"
										vd-notify='{
                      "text": "请填写微信号",
                    }'
                    placeholder="请填写微信号">
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-sex"></i>
                <span>性别</span>
                <div class="right">
                  <Radio :dataList="formTemp.sex" v-model="formData.sex"></Radio>
                </div>
              </div>

              <div class="input-item">
                <i class="sp sp-task-age"></i>
                <span>年龄</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.age"
                    type="text"
                    vd-notify='{
                      "text": "年龄不能为空",
                      "patt": "年龄格式不正确"
                    }'
                    placeholder="输入年龄">
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-business-06"></i>
                <span>业务范围</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.business"
                    type="text"
                    vd-notify='{
                      "text": "业务范围不能为空",
                      "patt": "业务范围格式不正确"
                    }'
                    placeholder="输入业务范围">
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-task-unit"></i>
                <span>公司</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.company"
                    type="text"
                    vd-notify='{
                      "text": "公司名称不能为空",
                      "patt": "公司名称格式不正确"
                    }'
                    placeholder="输入公司名称">
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-business-07"></i>
                <span>公司介绍</span>
                <div class="right" v-on:click="editCompany">
                  <span class="text">{{ formData.company_desc || '请输入公司介绍' }}</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item" v-on:click="handleCityShowChange()">
                <i class="sp sp-business-08"></i>
                <span>家乡</span>
                <div class="right">
                  <span>{{ city.region_name || '请选择' }}</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item" v-on:click="handleBotSelectChange('blood_type')">
                <i class="sp sp-business-03"></i>
                <span>血型</span>
                <div class="right">
                  <span>{{ formData.blood_type.name || '请选择' }}</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

            </div>

          </form>
        </div>
      </div>
    </scroller>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div v-show="isCompany" class="company">
        <scroller>
          <div class="desc">
            <div class="content">
              <div class="title">请输入公司简介</div>
              <textarea class="textarea" maxlength="100" @input="descInput" v-model="formData.company_desc_test"></textarea>
							<div class="number">{{remnant}}/100</div>
            </div>
						<div class="photo">
							<ul class="item">
								<li class="list" v-for="(item, index) in images" :key="index">
									<div class="input">
										<img v-if="item" :src="item" alt="">
										<img src="~assets/images/uploading-02.png" alt="">
                    <span v-if="!item" class="desc-txt">{{ descTxt[index] }}</span>
                  </div>
                  <input type="file"
                      class="input"
                      name="image"
                      accept="image/*"
                      ref="file"
                      v-on:change="upload($event, index)"/>
								</li>
							</ul>
							<div class="clear"></div>
						</div>
            <div class="btn">
              <button type="button" @click="saveDesc">保存</button>
            </div>
          </div>
        </scroller>
      </div>
    </transition>

    <BotSelect v-on:onChildClick="botSelectClick"
      :title="botTitle"
      :show="isShow"
      :formData="formTemp[formIndex]"
      :formIndex="formIndex"></BotSelect>
    <CityList></CityList>
    <cropper v-on:uploadFileClose="fileClose"></cropper>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>