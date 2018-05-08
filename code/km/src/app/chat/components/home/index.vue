<template>
  <div class="chat-page">
    <app-header :title="formTemp.friend.user_nickname || formTemp.friend.real_name" :other="true" v-on:other="handleOther">
      <div v-if="true === userInfo.is_service" class="slot" slot="right">
        <span class="lavel_name">{{ formTemp.friend.level_name }}</span>
        <i class="sp" :class="'sp-level-0' + formTemp.friend.level"></i>
      </div>
    </app-header>
    <div class="wrapper">
      <div class="content">
        <scroller ref="myscroller">
          <ul class="list">
            <li v-if="72 == params.id && !$route.query.type" class="item">
              <div class="avatar">
                <!-- <img v-if="formTemp.friend.avatar" :src="formTemp.friend.avatar"> -->
                <img src="~assets/images/km-logo.jpg">
              </div>
              <div class="text">
                <p>您好！欢迎光临卡盟金服商务部，公司目前急需对接一手资质的互联网信贷公司，银行信用卡中心，支付公司，欢迎各界精英人士增加商务交流，拓展业务资源！</p>
                <p>400-018-8616</p>
              </div>
            </li>
            <li v-else-if="'kf' == $route.query.type" class="item">
              <div class="avatar">
                <!-- <img v-if="formTemp.friend.avatar" :src="formTemp.friend.avatar"> -->
                <img src="~assets/images/km-logo.jpg">
              </div>
              <div class="text">
                <p v-if="$route.query.t">您好！我是{{ $route.query.t }}，请问有什么可以帮到您？</p>
                <p v-else>您好！我是卡盟V金服在线客服，请问有什么可以帮到您？</p>
              </div>
            </li>

            <li v-for="(item, index) in formData.data" :key="index" class="item" :class="{ me: 0 === item.act }">
              <div class="avatar">
                <img v-if="true === userInfo.is_service" src="~assets/images/km-logo.jpg">
                <img v-else src="~assets/images/avatar.png">
              </div>
              <div class="text">
                <p v-html="handleChatData(item)" v-on:click="handleEnlarge"></p>
                <div v-if="0 === item.act" class="sta" :class="{ ok: item.isRead }">{{ item.isRead ? '已读' : '未读' }}</div>
              </div>
            </li>
          </ul>
        </scroller>
      </div>
      <div class="input-foot" :class="{ resize: reSize }">
        <div class="input-text">
          <div class="input">
            <textarea class="textarea"
              v-model="textarea"
              ref="textarea"
              :rows="rows"
              v-on:blur="reSize = false"
              v-on:focus="handleResize()">
              </textarea>
          </div>
          <div class="input-icon">
            <i class="sp sp-im-emoji" v-on:click="handleIconEmojiClick()"></i>
            <i class="sp sp-im-add" v-on:click="handleIconAddClick()"></i>
            <i class="send" v-on:click="sendMsgInfo()">
              <span>发送</span>
            </i>
          </div>
        </div>
        <div v-show="toolSta" class="tool-group">
          <div v-show="addSta" class="add-inner">
            <div class="item">
              <input type="file" class="input" name="image" accept="image/*" ref="file" v-on:change="sendImagesInfo($event)"/>
              <i class="sp sp-im-pic"></i>
            </div>
          </div>
          <div v-show="emojiSta" class="emoji-inner">
            <dl>
              <li v-for="(item, index) in emojiObj" :key="index" v-on:click="handleEmojiSelect(item, index)">
                <img :src="item">
              </li>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <Zoom :image="zoomImage" v-model="isZoom" v-on:input="handleInput"></Zoom>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>