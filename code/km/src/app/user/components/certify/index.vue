<template>
  <div class="user-certify-page">
    <app-header title="实名验证"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">
            <div class="input-group">

              <!-- <div class="input-item">
                <i class="sp sp-task-mobile"></i>
                <span>手机号</span>
                <div class="right">
                  <span>{{ formData.phone }}</span>
                </div>
              </div> -->

              <div class="input-item">
                <i class="sp sp-task-name"></i>
                <span>姓名</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.real_name"
                    type="text"
                    vd-notify='{
                      "text": "姓名不能为空",
                      "patt": "姓名格式不正确"
                    }'
                    :readonly="isVerify"
                    placeholder="请输入姓名">
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-profile-01"></i>
                <span>身份证号</span>
                <div class="right">
                  <input type="text"
                    v-model.trim="formData.id_card"
                    vd-required
                    vd-validate
                    vd-type="identity"
                    vd-notify='{
                      "text": "身份证号不能为空",
                      "patt": "身份证号格式不正确"
                    }'
                    :readonly="isVerify"
                    placeholder="请输入身份证号">
                </div>
                <i class="sp sp-right"></i>
              </div>
            </div>
          </form>

          <div class="certify-content">
            <div class="certify-head">
              <span>请上传身份证照片信息</span>
              <!-- <i class="sp sp-tips"></i> -->
            </div>

            <div class="certify-body">
              <div class="item">
                <div class="img">
                  <img v-if="formData.validate.just" :src="formData.validate.just" @click="zoom(formData.validate.just)">
                  <img v-else src="~assets/images/identity-just.png">
                </div>
                <div class="txt">身份证正面</div>
                <i class="sp sp-right"></i>
                <input v-if="!isVerify" type="file"
                  name="image"
                  accept="image/*"
                  ref="just"
                  v-on:change="setImage($event, 'just')"/>
                <i v-show="isJust || formData.validate.just" class="sp sp-success"></i>
              </div>
              <div class="item">
                <div class="img">
                  <img v-if="formData.validate.body" :src="formData.validate.body" @click="zoom(formData.validate.body)">
                  <img v-else src="~assets/images/identity-self.png">
                </div>
                <div class="txt">手持身份证半身照</div>
                <i class="sp sp-right"></i>
                <input v-if="!isVerify" type="file"
                  name="image"
                  accept="image/*"
                  ref="body"
                  v-on:change="setImage($event, 'body')"/>
                <i v-show="formData.validate.body" class="sp sp-success"></i>
              </div>

            </div>
          </div>

          <div v-if="!isVerify" class="certify-btn">
            <a href="javascript:" @click="submit">提交</a>
          </div>

        </div>
      </div>
    </scroller>

    <cropper v-on:uploadFileClose="fileClose"></cropper>
    <Zoom :image="zoomImage" v-model="isZoom"></Zoom>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>