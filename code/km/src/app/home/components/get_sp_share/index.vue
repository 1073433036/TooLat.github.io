<template>
  <main class="get_sp_share-page" v-show="isWeChat">
    <div class="share-close" v-on:click="isWeChat = false"></div>

    <div v-show="canvasImage" class="canvasImage">
      <img :src="canvasImage">
    </div>

    <div v-show="('' == canvasImage)" class="card-share-code" :class="'card-share' + id ">
      <div class="content" ref="content">
        <div class="banner-img">
          <img v-if="3 == id" src="~assets/images/card-share-code-003.jpg">
          <img v-else-if="4 == id" src="~assets/images/card-share-code-004.jpg">
          <img v-else-if="5 == id" src="~assets/images/card-share-code-005.jpg">
          <img v-else-if="6 == id" src="~assets/images/card-share-code-006.jpg">
          <img v-else-if="7 == id" src="~assets/images/card-share-code-007.jpg">
          <img v-else-if="8 == id" src="~assets/images/card-share-code-008.jpg">
          <img v-else-if="9 == id" src="~assets/images/card-share-code-009.jpg">
          <img v-else-if="10 == id" src="~assets/images/card-share-code-010.jpg">
          <img v-else-if="11 == id" src="~assets/images/card-share-code-011.jpg">
          <img v-else-if="17 == id" src="~assets/images/card-share-code-017.jpg">
          <img v-else-if="18 == id" src="~assets/images/card-share-code-018.jpg">
          <img v-else-if="19 == id" src="~assets/images/card-share-code-019.jpg">
          <img v-else-if="20 == id" src="~assets/images/card-share-code-020.jpg">
        </div>

        <div class="body">
          <!-- 交通银行 -->
          <div v-if="6 == id" class="user-info">
            <div class="code-img">
              <div class="img">
                <img :src="qrCodeUrl">
              </div>
              <div class="img">
                <img src="~assets/images/finger.jpg">
              </div>
              <p>长按识别二维码！</p>
            </div>
            <div class="avatar">
              <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
              <img v-else src="~assets/images/avatar.png">
            </div>

            <h3 class="name">{{ userInfo.name }}</h3>
            <div class="level">
              <span>级别：{{ userInfo.job }}</span>
              <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
            </div>
            <div class="text-tips">
              我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
            </div>

          </div>

          <!-- 平安银行 -->
          <div v-else-if="8 == id" class="user-info">
            <div class="code-img">
              <div class="img">
                <img :src="qrCodeUrl">
              </div>
            </div>

            <div class="infos">
              <div class="avatar">
                <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                <img v-else src="~assets/images/avatar.png">
              </div>

              <h3 class="name">{{ userInfo.name }}</h3>
              <div class="level">
                <span>级别：{{ userInfo.job }}</span>
                <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
              </div>
              <div class="text-tips">
                我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
              </div>
            </div>
          </div>

          <!--工商银行 -->
          <div v-else-if="3 == id" class="user-info">

            <div class="code-img">
              <div class="img">
                <img :src="qrCodeUrl">
              </div>
              <div class="img">
                <img src="~assets/images/finger.jpg">
              </div>
              <p>长按识别二维码！</p>
            </div>

            <div class="avatar">
              <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
              <img v-else src="~assets/images/avatar.png">
            </div>
            <h3 class="name">{{ userInfo.name }}</h3>
            <div class="level">
              <span>级别：{{ userInfo.job }}</span>
              <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
            </div>
            <div class="text-tips">
              我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
            </div>
          </div>

          <!-- 光大银行 -->
          <div v-else-if="4 == id" class="user-info">
            <div class="code-img">
              <div class="img">
                <img :src="qrCodeUrl">
                <!-- <qrcode :value="qrCodeUrl" size="45" class="codeurl"></qrcode> -->
              </div>
            </div>

            <div class="infos">
              <div class="avatar">
                <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                <img v-else src="~assets/images/avatar.png">
              </div>

              <h3 class="name">{{ userInfo.name }}</h3>
              <div class="level">
                <span>级别：{{ userInfo.job }}</span>
                <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
              </div>
              <div class="text-tips">
                我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
              </div>
            </div>
          </div>


          <!-- 华夏银行 -->
          <div v-else-if="5 == id" class="user-info">

            <div class="code-img">
              <div class="img">
                <img :src="qrCodeUrl">
              </div>
              <div class="img">
                <img src="~assets/images/finger.jpg">
              </div>
              <p>长按识别二维码！</p>
            </div>

            <div class="avatar">
              <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
              <img v-else src="~assets/images/avatar.png">
            </div>
            <h3 class="name">{{ userInfo.name }}</h3>
            <div class="level">
              <span>级别：{{ userInfo.job }}</span>
              <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
            </div>
            <div class="text-tips">
              我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
            </div>
          </div>

          <!-- 上海银行 -->
          <div v-else-if="10 == id" class="user-info">
            <div class="code-img">
              <div class="img">
                <img :src="qrCodeUrl">
              </div>
            </div>

            <div class="infos">
              <div class="avatar">
                <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                <img v-else src="~assets/images/avatar.png">
              </div>

              <h3 class="name">{{ userInfo.name }}</h3>
              <div class="level">
                <span>级别：{{ userInfo.job }}</span>
                <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
              </div>
              <div class="text-tips">
                我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
              </div>
            </div>
          </div>

          <!-- 兴业银行 -->
          <div v-else-if="11 == id" class="user-info">
            <div class="code-img">
              <div class="img">
                <img :src="qrCodeUrl">
              </div>
            </div>

            <div class="infos">
              <div class="avatar">
                <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                <img v-else src="~assets/images/avatar.png">
              </div>

              <h3 class="name">{{ userInfo.name }}</h3>
              <div class="level">
                <span>级别：{{ userInfo.job }}</span>
                <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
              </div>
              <div class="text-tips">
                我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
              </div>
            </div>
          </div>

          <!-- 光大普通银行 -->
          <div v-else-if="17 == id" class="user-info">
            <div class="code-img">
              <div class="img">
                <img :src="qrCodeUrl">
              </div>
            </div>

            <div class="infos">
              <div class="avatar">
                <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                <img v-else src="~assets/images/avatar.png">
              </div>

              <h3 class="name">{{ userInfo.name }}</h3>
              <div class="level">
                <span>级别：{{ userInfo.job }}</span>
                <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
              </div>
              <div class="text-tips">
                我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
              </div>
            </div>
          </div>

          <!-- 民生校园 -->
          <div v-else-if="18 == id" class="user-info">
            <div class="code-img">
              <div class="img">
                <img :src="qrCodeUrl">
              </div>
              <div class="img">
                <img src="~assets/images/finger.jpg">
              </div>
            </div>

            <div class="infos">
              <div class="avatar">
                <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                <img v-else src="~assets/images/avatar.png">
              </div>

              <h3 class="name">{{ userInfo.name }}</h3>
              <div class="level">
                <span>级别：{{ userInfo.job }}</span>
                <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
              </div>
            </div>
          </div>

          <!-- 招商校园 -->
          <div v-else-if="19 == id" class="user-info">
            <div class="code-img">
              <div class="img">
                <img :src="qrCodeUrl">
              </div>
            </div>

            <div class="infos">
              <div class="avatar">
                <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                <img v-else src="~assets/images/avatar.png">
              </div>

              <h3 class="name">{{ userInfo.name }}</h3>
              <div class="level">
                <span>级别：{{ userInfo.job }}</span>
                <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
              </div>
            </div>
          </div>

          <!-- 广发银行 -->
          <div v-else-if="20 == id" class="user-info">
            <div class="code-img">
              <div class="img">
                <img :src="qrCodeUrl">
              </div>
            </div>

            <div class="infos">
              <div class="avatar">
                <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
                <img v-else src="~assets/images/avatar.png">
              </div>

              <h3 class="name">{{ userInfo.name }}</h3>
              <div class="level">
                <span>级别：{{ userInfo.job }}</span>
                <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
              </div>
            </div>
          </div>

          <!-- 其他银行 -->
          <div v-else class="user-info">
            <div class="avatar">
              <img v-if="'' != userInfo.avatar_64" :src="userInfo.avatar_64">
              <img v-else src="~assets/images/avatar.png">
            </div>

            <h3 class="name">{{ userInfo.name }}</h3>
            <div class="level">
              <span>级别：{{ userInfo.job }}</span>
              <i class="sp" :class="'sp-level-0' + userInfo.level"></i>
            </div>
            <div class="text-tips">
              我是您的专属客服，您有任何关于信用卡申请的问题，都可以随时向我咨询
            </div>

            <div class="code-img">
              <div class="img">
                <img :src="qrCodeUrl">
              </div>
              <div class="img">
                <img src="~assets/images/finger.jpg">
              </div>
              <p>长按识别二维码！</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
