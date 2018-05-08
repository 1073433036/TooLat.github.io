

<template>
  <div class="message-false-data">
    <app-header title="生成短信图片"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container" ref="canvas">

          <div class="ios-screen screen"
            :class="{
              'fs-m': formData.fontSize == '中号',
              'fs-l': formData.fontSize == '大号',
              'fs-xl': formData.fontSize == '超大',
            }"
            v-show="formData.version == '苹果IOS'">
            <div class="message-header">
              <div class="bg">
                <img src="~assets/images/message/message-ios-head.png" alt="">
              </div>
              <div class="top">
                <div class="operator">中国{{ formData.operator }}</div>
                <div class="icon" v-if="formData.network">
                  <img src="~assets/images/message/message-ios-icon06.png" alt="">
                </div>
                <div class="icon" v-else>
                  <img src="~assets/images/message/message-ios-icon07.png" alt="">
                </div>
                <div class="content"></div>
                <div class="icon" v-if="formData.lockScreen">
                  <img src="~assets/images/message/message-ios-icon01.png" alt="">
                </div>
                <div class="icon" v-if="formData.location">
                  <img src="~assets/images/message/message-ios-icon03.png" alt="">
                </div>
                <div class="icon" v-if="formData.clock">
                  <img src="~assets/images/message/message-ios-icon02.png" alt="">
                </div>
                <div class="icon" v-if="formData.bluetooth">
                  <img src="~assets/images/message/message-ios-icon04.png" alt="">
                </div>
                <div class="percent">{{ formData.electricity }}%</div>
                <div class="electricity">
                  <div class="number"
                    :class="{
                      'on': formData.electricity < 20,
                      'charge': formData.charge
                    }"
                    :style="{ width: formData.electricity + '%' }"
                    ></div>
                </div>
                <div class="icon" v-if="formData.charge">
                  <img src="~assets/images/message/message-ios-icon05.png" alt="">
                </div>
              </div>
              <div class="time">{{ formData.systemTime | handleSysTime }}</div>
              <div class="phone">{{ formData.phone }}</div>
            </div>
            <div class="scroll-box">
              <scroller ref="myScrollerIos">
                <div class="scroll-body scroll-ios">
                  <ul class="list">

                    <li class="item"
                      :class="{
                        'noDate1': !formData.isShowTime2 && formData.content2
                      }"
                      v-show="formData.isShow1 && formData.content1">
                      <div class="sys-date" v-if="formData.isShowTime1">
                        <span>{{ formData.date1 | handleIosDate }} {{ formData.time1 | handleSysTime }}</span>
                      </div>
                      <div class="message-box">
                        <div class="message" v-html="formData.content1"></div>
                        <div class="bg-icon">
                          <img src="~assets/images/message/message-ios-icon08.png" alt="">
                        </div>
                      </div>
                    </li>

                    <li class="item"
                      :class="{
                        'noDate2': !formData.isShowTime2,
                        'noDate1': !formData.isShowTime3 && formData.content3 && formData.isShow3,
                      }"
                      v-show="formData.isShow2 && formData.content2">
                      <div class="sys-date" v-if="formData.isShowTime2">
                        <span>{{ formData.date2 | handleIosDate }} {{ formData.time2 | handleSysTime }}</span>
                      </div>
                      <div class="message-box">
                        <div class="message" v-html="formData.content2"></div>
                        <div class="bg-icon">
                          <img src="~assets/images/message/message-ios-icon08.png" alt="">
                        </div>
                      </div>
                    </li>

                    <li class="item"
                      :class="{
                        'noDate2': !formData.isShowTime3,
                        'noDate1': !formData.isShowTime4 && formData.content4 && formData.isShow4,
                      }"
                      v-show="formData.isShow3 && formData.content3">
                      <div class="sys-date" v-if="formData.isShowTime3">
                        <span>{{ formData.date3 | handleIosDate }} {{ formData.time3 | handleSysTime }}</span>
                      </div>
                      <div class="message-box">
                        <div class="message" v-html="formData.content3"></div>
                        <div class="bg-icon">
                          <img src="~assets/images/message/message-ios-icon08.png" alt="">
                        </div>
                      </div>
                    </li>

                    <li class="item"
                      :class="{
                        'noDate2': !formData.isShowTime4,
                      }"
                      v-show="formData.isShow4 && formData.content4">
                      <div class="sys-date" v-if="formData.isShowTime4">
                        <span>{{ formData.date4 | handleIosDate }} {{ formData.time4 | handleSysTime }}</span>
                      </div>
                      <div class="message-box">
                        <div class="message" v-html="formData.content4"></div>
                        <div class="bg-icon">
                          <img src="~assets/images/message/message-ios-icon08.png" alt="">
                        </div>
                      </div>
                    </li>

                  </ul>
                </div>
              </scroller>
            </div>
            <div class="message-footer">
              <div class="bg">
                <img src="~assets/images/message/message-ios-foot1.png" alt="">
              </div>
            </div>
          </div>

          <div class="android1-screen screen"
            :class="{
              'fs-m': formData.fontSize == '中号',
              'fs-l': formData.fontSize == '大号',
              'fs-xl': formData.fontSize == '超大',
            }"
            v-show="formData.version == '安卓Android1'">
            <div class="message-header">
              <div class="bg">
                <img src="~assets/images/message/message-android1-head.png" alt="">
              </div>
              <div class="top">
                <div class="time">{{ formData.systemTime | handleSysTime }}</div>
                <div class="content"></div>
                <div class="icon" v-if="formData.flow">
                  <img src="~assets/images/message/message-android1-icon05.png" alt="">
                </div>
                <div class="icon" v-if="formData.bluetooth">
                  <img src="~assets/images/message/message-android1-icon04.png" alt="">
                </div>
                <div class="icon" v-if="formData.clock">
                  <img src="~assets/images/message/message-android1-icon01.png" alt="">
                </div>
                <div class="icon" v-if="formData.network">
                  <img src="~assets/images/message/message-android1-icon02.png" alt="">
                </div>
                <div class="icon">
                  <img src="~assets/images/message/message-android1-icon03.png" alt="">
                </div>
                <div class="operator">{{ formData.operator }}</div>
                <div class="icon">
                  <img src="~assets/images/message/message-android1-icon06.png" alt="">
                </div>
                <div class="icon" v-if="formData.charge">
                  <img src="~assets/images/message/message-android1-icon07.png" alt="">
                </div>
                <div class="electricity">
                  <div class="box">
                    <div class="number"
                    :class="{
                      'on': formData.electricity < 20,
                      'charge': formData.charge
                    }"
                    :style="{ width: formData.electricity + '%' }"
                    ></div>
                  </div>
                </div>
                <div class="percent">{{ formData.electricity }}%</div>
              </div>
              <div class="phone">{{ formData.phone }}</div>
            </div>
            <div class="scroll-box">
              <scroller ref="myScrollerAndroid1">
                <div class="scroll-body scroll-android1">
                  <div class="message-line">
                    <img src="~assets/images/message/message-android1-icon08.png" alt="">
                  </div>
                  <ul class="list">

                    <li class="item" v-show="formData.isShow1 && formData.content1">
                      <div class="msg-time" v-if="formData.isShowTime1">{{ formData.date1 }} {{ formData.time1 | handleSysTime }}</div>
                      <div class="message-box">
                        <div class="message" v-html="formData.content1"></div>
                      </div>
                      <div class="warn" v-show="formData.codeWarn1">
                        <div class="content">
                          <img src="~assets/images/wechat-icon-warn.png" alt="">
                          任何向您索要验证码的都是骗子，千万别给（系统已禁止第三方应用自动读取验证码）!</div>
                      </div>
                    </li>

                    <li class="item" v-show="formData.isShow2 && formData.content2">
                      <div class="msg-time" v-if="formData.isShowTime2">{{ formData.date2 }} {{ formData.time2 | handleSysTime }}</div>
                      <div class="message-box">
                        <div class="message" v-html="formData.content2"></div>
                      </div>
                      <div class="warn" v-show="formData.codeWarn2">
                        <div class="content">
                          <img src="~assets/images/wechat-icon-warn.png" alt="">
                          任何向您索要验证码的都是骗子，千万别给（系统已禁止第三方应用自动读取验证码）!</div>
                      </div>
                    </li>

                    <li class="item" v-show="formData.isShow3 && formData.content3">
                      <div class="msg-time" v-if="formData.isShowTime3">{{ formData.date3 }} {{ formData.time3 | handleSysTime }}</div>
                      <div class="message-box">
                        <div class="message" v-html="formData.content3"></div>
                      </div>
                      <div class="warn" v-show="formData.codeWarn3">
                        <div class="content">
                          <img src="~assets/images/wechat-icon-warn.png" alt="">
                          任何向您索要验证码的都是骗子，千万别给（系统已禁止第三方应用自动读取验证码）!</div>
                      </div>
                    </li>

                    <li class="item" v-show="formData.isShow4 && formData.content4">
                      <div class="msg-time" v-if="formData.isShowTime4">{{ formData.date4 }} {{ formData.time4 | handleSysTime }}</div>
                      <div class="message-box">
                        <div class="message" v-html="formData.content4"></div>
                      </div>
                      <div class="warn" v-show="formData.codeWarn4">
                        <div class="content">
                          <img src="~assets/images/wechat-icon-warn.png" alt="">
                          任何向您索要验证码的都是骗子，千万别给（系统已禁止第三方应用自动读取验证码）!</div>
                      </div>
                    </li>

                  </ul>
                </div>
              </scroller>
            </div>
            <div class="message-footer">
              <div class="bg">
                <img src="~assets/images/message/message-android1-foot.png" alt="">
              </div>
            </div>
          </div>

          <div class="android2-screen screen"
            :class="{
              'fs-m': formData.fontSize == '中号',
              'fs-l': formData.fontSize == '大号',
              'fs-xl': formData.fontSize == '超大',
            }"
            v-show="formData.version == '安卓Android2'">
            <div class="message-header">
              <div class="bg">
                <img src="~assets/images/message/message-android2-head.png" alt="">
              </div>
              <div class="top">
                <div class="icon">
                  <img src="~assets/images/message/message-android2-icon04.png" alt="">
                </div>
                <div class="icon" v-show="formData.charge">
                  <img src="~assets/images/message/message-android2-icon05.png" alt="">
                </div>
                <div class="icon" v-show="formData.charge">
                  <img src="~assets/images/message/message-android2-icon06.png" alt="">
                </div>
                <div class="content"></div>
                <div class="icon" v-if="formData.bluetooth">
                  <img src="~assets/images/message/message-android2-icon01.png" alt="">
                </div>
                <div class="icon" v-if="formData.clock">
                  <img src="~assets/images/message/message-android2-icon02.png" alt="">
                </div>
                <div class="icon" v-if="formData.network">
                  <img src="~assets/images/message/message-android2-icon03.png" alt="">
                </div>
                <div class="percent">{{ formData.electricity }}%</div>
                <div class="electricity">
                  <div class="box">
                    <div class="number"
                    :class="{
                      'on': formData.electricity < 20
                    }"
                    :style="{ width: formData.electricity + '%' }"
                    ></div>
                    <img v-show="formData.charge" src="~assets/images/message/message-android2-icon07.png" alt="" class="image">
                  </div>
                </div>
              </div>
              <div class="time">{{ formData.systemTime | handleSysTime }}</div>
              <div class="phone">{{ formData.phone }}</div>
            </div>
            <div class="tips">
              <div class="text">呼叫</div>
              <div class="text">添加到联系人</div>
            </div>
            <div class="scroll-box">
              <scroller ref="myScrollerAndroid2">
                <div class="scroll-body scroll-android2">
                  <ul class="list">

                    <li class="item" v-show="formData.isShow1 && formData.content1">
                      <div class="msg-date" v-if="formData.isShowTime1">{{ formData.date1 | handleDate }}</div>
                      <div class="message-wrap">
                        <div class="message-box">
                          <div class="message" v-html="formData.content1"></div>
                          <div class="msg-time">{{ formData.time1 | handleSysTime }}</div>
                        </div>
                      </div>
                      <div class="warn" v-show="formData.codeWarn1">
                        <div class="content">
                          <img src="~assets/images/wechat-icon-warn.png" alt="">
                          任何向您索要验证码的都是骗子，千万别给（系统已禁止第三方应用自动读取验证码）!</div>
                      </div>
                    </li>

                    <li class="item" v-show="formData.isShow2 && formData.content2">
                      <div class="msg-date" v-if="formData.isShowTime2">{{ formData.date2 | handleDate }}</div>
                      <div class="message-wrap">
                        <div class="message-box">
                          <div class="message" v-html="formData.content2"></div>
                          <div class="msg-time">{{ formData.time2 | handleSysTime }}</div>
                        </div>
                      </div>
                      <div class="warn" v-show="formData.codeWarn2">
                        <div class="content">
                          <img src="~assets/images/wechat-icon-warn.png" alt="">
                          任何向您索要验证码的都是骗子，千万别给（系统已禁止第三方应用自动读取验证码）!</div>
                      </div>
                    </li>

                    <li class="item" v-show="formData.isShow3 && formData.content3">
                      <div class="msg-date" v-if="formData.isShowTime3">{{ formData.date3 | handleDate }}</div>
                      <div class="message-wrap">
                        <div class="message-box">
                          <div class="message" v-html="formData.content3"></div>
                          <div class="msg-time">{{ formData.time3 | handleSysTime }}</div>
                        </div>
                      </div>
                      <div class="warn" v-show="formData.codeWarn3">
                        <div class="content">
                          <img src="~assets/images/wechat-icon-warn.png" alt="">
                          任何向您索要验证码的都是骗子，千万别给（系统已禁止第三方应用自动读取验证码）!</div>
                      </div>
                    </li>

                    <li class="item" v-show="formData.isShow4 && formData.content4">
                      <div class="msg-date" v-if="formData.isShowTime4">{{ formData.date4 | handleDate }}</div>
                      <div class="message-wrap">
                        <div class="message-box">
                          <div class="message" v-html="formData.content4"></div>
                          <div class="msg-time">{{ formData.time4 | handleSysTime }}</div>
                        </div>
                      </div>
                      <div class="warn" v-show="formData.codeWarn4">
                        <div class="content">
                          <img src="~assets/images/wechat-icon-warn.png" alt="">
                          任何向您索要验证码的都是骗子，千万别给（系统已禁止第三方应用自动读取验证码）!</div>
                      </div>
                    </li>

                  </ul>
                </div>
              </scroller>
            </div>
            <div class="message-footer">
              <div class="bg">
                <img src="~assets/images/message/message-android2-foot.png" alt="">
              </div>
            </div>
          </div>

        </div>
      </div>
    </scroller>

    <footer class="footer">
      <a href="javascript:" @click="isEdit = true">编辑图片</a>
      <a href="javascript:" @click="createCanvasImage">生成图片</a>
    </footer>

    <Edit v-model="isEdit" v-on:saveData="handleEdit"></Edit>

    <div class="result-image" v-show="isResult">
      <div class="mask" @click="isResult = false"></div>
      <div class="image">
        <img :src="resultImage" alt="">
      </div>
      <div class="tip">
        <div class="box">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <span class="name">长按保存图片</span>
      </div>
    </div>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
