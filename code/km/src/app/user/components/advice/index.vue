<template>
  <main class="advice-page" :class="{ extend: isExtend, resize: reSize }">
    <app-header title="意见反馈" @click="isExtend = false"></app-header>
    <header @click="isExtend = false">
      <p>卡盟是大家，发展靠大家</p>
      <p>欢迎您提宝贵建议</p>
    </header>
    <scroller ref="myscroller" :on-refresh="getMoreFeedBack" refreshText="查看更多消息">
      <section class="wrapper" @click="isExtend = false">
        <div class="text-wrapper">
          <ul class="feed-wrapper">
            <li v-for="(el, index) in feedBackList" :key="index" :class="{ left: el.feedback === 0, right: el.feedback === 1 }">
              <img src="~assets/images/service-01.png" alt="客户头像" v-if="el.feedback === 0">
              <img :src="userInfo.avatar_full" alt="用户头像" v-else-if="el.feedback === 1 && userInfo.avatar_full">
              <img src="~assets/images/feedback-avatar.png" alt="用户头像" v-else>

              <div class="feed cf">
                <div class="top">
                  <template v-if="el.feedback === 0">
                    <span class="name">{{ el.service_name || '客服' }}</span>
                    <span class="time">{{ el.send_time * 1000 | fmtDate }}</span>
                  </template>
                  <template v-else>
                    <span class="time">{{ el.send_time * 1000 | fmtDate }}</span>
                    <span class="name">{{ el.user_nickname || '未知' }}</span>
                  </template>
                </div>
                <div class="bottom">
                  <div class="dialog-content" v-if="el.type === 'text'" v-html="el.content"></div>
                  <div class="dialog-content image-content" v-else>
                    <img :src="el.content" alt="图片消息" @click.stop="enlargeImage(el.content)">
                  </div>
                  <i class="submit-status submit-loading" v-if="el.loading"></i>
                  <i class="submit-status submit-fail" v-if="el.fail" @click.stop="resend(el)"></i>
                </div>
              </div>

            </li>
          </ul>
          <div class="send_message" >
          </div>
        </div>
      </section>
    </scroller>

    <section class="send-msg-wrapper" :class="{ resize: reSize }">
      <div class="send-msg" @click="isExtend = false">
        <textarea v-model="adviceString" placeholder="我也来说两句..."
            @focus="textareaFocus" @blur="reSize = false"></textarea>
        <div class="extend-btn" @click.stop="isExtend = !isExtend"></div>
        <div class="send-btn" @click.stop="submitFeedBack">发送</div>
      </div>
      <div class="extend-wrapper" v-if="isExtend">
        <ul>
          <li class="iamges">
            <input type="file" class="input" name="image" accept="image/*" ref="file" v-on:change="fileChanged($event)"/>
          </li>
        </ul>
      </div>
    </section>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <component :is="cropperCmpt" :file="imageFile" @uploadFileClose="uploadFileClose" @sendImagesInfo="sendImagesInfo"></component>
    </transition>
    <section class="image-layer" v-if="isImageLayerShow" @click="isImageLayerShow = false">
      <img :src="enlargeImageSrc">
    </section>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
