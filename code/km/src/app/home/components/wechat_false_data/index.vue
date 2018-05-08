<template>
  <div class="wechat-false-data">
    <app-header title="生成数据"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container"
          ref="canvas"
          :class="{
            'ios': formData.version == '苹果IOS',
            'android': formData.version == '安卓Android',
            'android2': formData.version == '安卓Android2',
            'android3': formData.version == '安卓Android3'
          }">

          <div class="apple-ios" v-if="formData.version == '苹果IOS'">
            <!-- <div class="image">
              <img src="~assets/images/wechat-bg01.png" alt="">
            </div> -->
            <div class="head-bg">
              <img src="~assets/images/wechat-head-bg01.png" alt="">
            </div>
            <div class="operator">中国{{ formData.operator }}</div>
            <div class="signal-wifi" v-if="formData.network">
              <img src="~assets/images/wechat-wifi.png" alt="">
            </div>
            <div class="signal-4g" v-else>{{ formData.network }}</div>
            <div class="time">{{ formData.systemTime | handleSysTime }}</div>
            <div class="ios-icon">
              <div class="item" v-if="formData.lockScreen">
                <img src="~assets/images/wechat-icon05.png" alt="">
              </div>
              <div class="item" v-if="formData.clock">
                <img src="~assets/images/wechat-ios02.png" alt="">
              </div>
              <div class="item" v-if="formData.location">
                <img src="~assets/images/wechat-icon04.png" alt="">
              </div>
              <div class="item" v-if="formData.bluetooth">
                <img src="~assets/images/wechat-ios01.png" alt="">
              </div>
              <div class="percent">{{ formData.electricity }}%</div>
              <div class="electricity">
                <div class="number" :style="{ width: formData.electricity + '%' }" :class="{ 'on': formData.electricity < 20, 'charge': formData.charge }"></div>
              </div>
              <div class="item on" v-if="formData.charge">
                <img src="~assets/images/wechat-icon06.png" alt="">
              </div>
            </div>
            <div class="company">卡盟U金服</div>
            <div class="edition">返回</div>
            <div class="bg-img">
              <img :src="formData.bgimage" alt="">
            </div>
          </div>

          <div class="android" v-if="formData.version == '安卓Android'">
            <!-- <div class="image">
              <img src="~assets/images/wechat-bg02.png" alt="">
            </div> -->
            <div class="head-bg">
              <img src="~assets/images/wechat-head-bg02.png" alt="">
            </div>
            <div class="head">
              <div class="time">{{ formData.systemTime | handleSysTime }}</div>
              <div class="content"></div>
              <div class="icon" v-show="formData.flow">
                <img src="~assets/images/wechat-android04.png" alt="">
              </div>
              <div class="icon" v-show="formData.bluetooth">
                <img src="~assets/images/wechat-android03.png" alt="">
              </div>
              <div class="icon" v-show="formData.clock">
                <img src="~assets/images/wechat-android01.png" alt="">
              </div>
              <div class="icon" v-show="formData.flow">
                <img src="~assets/images/wechat-android02.png" alt="">
              </div>
              <div class="icon" v-if="formData.network">
                <img src="~assets/images/wechat-icon03.png" alt="">
              </div>
              <div class="icon">
                <img src="~assets/images/wechat-icon02.png" alt="">
              </div>
              <div class="operator">{{ formData.operator }}</div>
              <div class="signal-4g">4G</div>
              <div class="icon" v-if="formData.charge">
                <img src="~assets/images/wechat-android11.png" alt="">
              </div>
              <div class="electricity">
                <div class="box">
                  <div class="number" :style="{ width: formData.electricity + '%' }" :class="{ 'on': formData.electricity < 20, 'charge': formData.charge }"></div>
                </div>
              </div>
              <div class="percent">{{ formData.electricity }}%</div>
            </div>
            <div class="company">卡盟U金服</div>
            <div class="bg-img">
              <img :src="formData.bgimage" alt="">
            </div>
          </div>

          <div class="android2" v-if="formData.version == '安卓Android2'">
            <!-- <div class="image">
              <img src="~assets/images/wechat-bg04.png" alt="">
            </div> -->
            <div class="head-bg">
              <img src="~assets/images/wechat-head-bg03.png" alt="">
            </div>
            <div class="head">
              <div class="content"></div>
              <div class="icon" v-if="formData.bluetooth">
                <img src="~assets/images/wechat-android07.png" alt="">
              </div>
              <div class="icon" v-if="formData.clock">
                <img src="~assets/images/wechat-android06.png" alt="">
              </div>
              <div class="icon" v-if="formData.network">
                <img src="~assets/images/wechat-android05.png" alt="">
              </div>
              <div class="icon" v-else>
                <img src="~assets/images/wechat-android08.png" alt="">
              </div>
              <div class="percent">{{ formData.electricity }}%</div>
              <div class="electricity">
                <div class="box">
                  <div class="number" :style="{ width: formData.electricity + '%' }" :class="{ 'on': formData.electricity < 20 }"></div>
                </div>
              </div>
            </div>
            <div class="time">{{ formData.systemTime | handleSysTime }}</div>
            <div class="company">卡盟U金服</div>
            <div class="bg-img" :class="{ on: formData.version == '安卓Android2' && formData.footer }">
              <img :src="formData.bgimage" alt="">
            </div>
            <div class="b-footer" v-show="formData.version == '安卓Android2' && formData.footer">
              <img src="~assets/images/wechat-android09.png" alt="">
            </div>
          </div>

          <div class="android3" v-if="formData.version == '安卓Android3'">
            <!-- <div class="image">
              <img src="~assets/images/wechat-bg05.png" alt="">
            </div> -->
            <div class="head-bg">
              <img src="~assets/images/wechat-head-bg04.png" alt="">
            </div>
            <div class="head">
              <div class="operator">
                <div class="line">中国{{ formData.operator }}</div>
                <div class="line">中国{{ formData.operator2 }}</div>
              </div>
              <div class="content"></div>
              <div class="icon" v-if="formData.bluetooth">
                <img src="~assets/images/wechat-android3-01.png" alt="">
              </div>
              <div class="icon" v-if="formData.clock">
                <img src="~assets/images/wechat-android3-02.png" alt="">
              </div>
              <div class="icon" v-if="formData.network">
                <img src="~assets/images/wechat-android3-03.png" alt="">
              </div>
              <div class="icon">
                <img src="~assets/images/wechat-android3-05.png" alt="">
              </div>
              <div class="icon">
                <img src="~assets/images/wechat-android3-04.png" alt="">
              </div>
              <div class="percent">{{ formData.electricity }}%</div>
              <div class="electricity">
                <div class="box">
                  <div class="number" :style="{ width: formData.electricity + '%' }" :class="{ 'on': formData.electricity < 20, 'charge': formData.charge }"></div>
                  <img src="~assets/images/wechat-android12.png" v-if="formData.charge" alt="" class="charge">
                </div>
              </div>
              <div class="time">{{ formData.systemTime | handleSysTime }}</div>
            </div>
            <div class="company">卡盟U金服</div>
            <div class="bg-img" :class="{ on: formData.version == '安卓Android3' && formData.footer }">
              <img :src="formData.bgimage" alt="">
            </div>
            <div class="b-footer" v-show="formData.version == '安卓Android3' && formData.footer">
              <img src="~assets/images/wechat-android09.png" alt="">
            </div>
          </div>

          <div class="scroll-box"
            :class="{
              android2: formData.version == '安卓Android2' && formData.footer,
              android3: formData.version == '安卓Android3' && formData.footer,
            }">
            <scroller>
              <ul class="list" ref="list">
                <li class="item info" v-show="formData.isShowInfo && formData.position == '上'">
                  <div class="date" v-if="formData.isShowSTime">
                    <span>{{ formData.sendDate | handlePushTime }} {{ formData.sendTime | handleSysTime }}</span>
                  </div>
                  <div class="user-box">
                    <div class="avatar">
                      <img :src="formData.avatar" alt="">
                    </div>
                    <div class="message">{{ formData.userInfo }}</div>
                  </div>
                </li>

                <li class="item" v-show="formData.isShow1">
                  <div class="date" v-if="formData.isShowDate1">
                    <span>{{ formData.date1 | handlePushTime }} {{ formData.time1 | handleSysTime }}</span>
                  </div>
                  <div class="box">
                    <div class="status">{{ formData.messageType1 }}</div>
                    <div class="day">{{ formData.date1 | handleDate }}</div>

                    <!-- 关注成功通知 Start -->
                    <div v-if="formData.messageType1 == '关注成功通知'">
                      <div class="text">恭喜您成功锁定一位会员！</div>
                      <div class="text">会员昵称：{{ formData.nick1 }}</div>
                      <div class="text">关注时间：{{ formData.date1 }} {{ formData.time1 }}</div>
                      <div class="text">扩大团队，您的佣金也会提高哦！</div>
                    </div>
                    <!-- 关注成功通知 End -->

                    <!-- 精养卡 Start -->
                    <div v-if="formData.messageType1 == '佣金提醒' && formData.source1 == '精养卡'">
                      <div class="text">恭喜您，智能精养卡自动代还订单：</div>
                      <div class="text">{{ formData.order1 }}支付成功，交易金额{{ formData.price1 }}元，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span >{{ formData.commission1 }} 元</span></div>
                      <div class="text">时间：{{ formData.date1 }} {{ formData.time1 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 精养卡 End -->

                    <!-- 信用卡 Start -->
                    <div v-if="formData.messageType1 == '佣金提醒' && formData.source1 == '信用卡'">
                      <div class="text">恭喜您，团队成员 {{ formData.nick1 }} 办理 {{ formData.creditCard1 }} 信用卡，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission1 }} 元</span></div>
                      <div class="text">时间：{{ formData.date1 }} {{ formData.time1 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 信用卡 End -->

                    <!-- 违章代缴 Start -->
                    <div v-if="formData.messageType1 == '佣金提醒' && formData.source1 == '违章代缴'">
                      <div class="text">恭喜您，违章代缴订单：{{ formData.order1 }}支付成功，违章扣分：{{ formData.points1 }}分，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission1 }} 元</span></div>
                      <div class="text">时间：{{ formData.date1 }} {{ formData.time1 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 违章代缴 End -->

                    <!-- 违章处理 Start -->
                    <div v-if="formData.messageType1 == '佣金提醒' && formData.source1 == '违章处理'">
                      <div class="text">恭喜您，违章处理订单：{{ formData.order1 }}处理成功，违章：{{ formData.points1 }}fen，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission1 }} 元</span></div>
                      <div class="text">时间：{{ formData.date1 }} {{ formData.time1 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 违章处理 End -->

                    <!-- 团员升级 Start -->
                    <div v-if="formData.messageType1 == '佣金提醒' && formData.source1 == '团员升级'">
                      <div class="text">恭喜您，团队成员 {{ formData.nick1 }} 支付{{ formData.gradeing1 | handleGrade }}元使用费保证金成功，升级为{{ formData.gradeing1 }}，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission1 }} 元</span></div>
                      <div class="text">时间：{{ formData.date1 }} {{ formData.time1 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 团员升级 End -->

                    <!-- 团队管理奖励 Start -->
                    <div v-if="formData.messageType1 == '佣金提醒' && formData.source1 == '团队管理奖励'">
                      <div class="text">恭喜您，(团队管理奖)团队成员 {{ formData.nick1 }} 支付{{ formData.gradeing1 | handleGrade }}元使用费保证金成功，升级为{{ formData.gradeing1 }}，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission1 }} 元</span></div>
                      <div class="text">时间：{{ formData.date1 }} {{ formData.time1 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 团队管理奖励 End -->

                    <!-- 无卡支付 Start -->
                    <div v-if="formData.messageType1 == '佣金提醒' && formData.source1 == '无卡支付'">
                      <div class="text">恭喜您，(躺赚) 无卡支付订单 (有积分) ： {{ formData.order1 }}支付成功，交易金额{{ formData.price1 }}元，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span span class = "money">{{ formData.commission1 }} 元</span></div>
                      <div class="text">时间：{{ formData.date1 }} {{ formData.time1 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 无卡支付 End -->

                    <!-- 会员等级变更提醒 Start -->
                    <div v-if="formData.messageType1 == '会员等级变更提醒'">
                      <div class="text">您的好友 {{ formData.nick1 }}成功升级为{{ formData.gradeing1 }}</div>
                      <div class="text">原先等级：{{ formData.gradeed1 }}</div>
                      <div class="text">当前等级：{{ formData.gradeing1 }}</div>
                      <div class="text">变更时间：{{ formData.date1 }} {{ formData.time1 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 会员等级变更提醒 End -->

                    <!-- 提现成功通知 Start -->
                    <div v-if="formData.messageType1 == '提现成功通知'">
                      <div class="text">您于 {{ formData.date1 }} 申请提现审核通过</div>
                      <div class="text"><span class = "money">金额：{{ formData.getCash1 }} 元</span></div>
                      <div class="text">时间：{{ formData.date1 }} {{ formData.time1 }}</div>
                      <div class="text">卡盟便民服务平台，系统结算已到账，请注意查收</div>
                    </div>
                    <!-- 提现成功通知 End -->

                    <!-- 贷款 Start -->
                    <div v-if="formData.messageType1 == '佣金提醒' && formData.source1 == '贷款'">
                      <div class="text">恭喜您，团队成员 {{ formData.nick1 }} 申请 宜人贷 贷款{{ formData.price1 }}元，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission1 }} 元</span></div>
                      <div class="text">时间：{{ formData.date1 }} {{ formData.time1 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 贷款 End -->

                    <div class="detail">
                      <span class="name">详情</span>
                      <i class="icon"></i>
                    </div>
                  </div>
                </li>

                <li class="item info" v-show="formData.isShowInfo && formData.position == '中'">
                  <div class="date" v-if="formData.isShowSTime">
                    <span>{{ formData.sendDate | handlePushTime }} {{ formData.sendTime | handleSysTime }}</span>
                  </div>
                  <div class="user-box">
                    <div class="avatar">
                      <img :src="formData.avatar" alt="">
                    </div>
                    <div class="message">{{ formData.userInfo }}</div>
                  </div>
                </li>

                <li class="item" v-show="formData.isShow2">
                  <div class="date" v-if="formData.isShowDate2">
                    <span>{{ formData.date2 | handlePushTime }} {{ formData.time2 | handleSysTime }}</span>
                  </div>
                  <div class="box">
                    <div class="status">{{ formData.messageType2 }}</div>
                    <div class="day">{{ formData.date2 | handleDate }}</div>

                    <!-- 关注成功通知 Start -->
                    <div v-if="formData.messageType2 == '关注成功通知'">
                      <div class="text">恭喜您成功锁定一位会员！</div>
                      <div class="text">会员昵称：{{ formData.nick2 }}</div>
                      <div class="text">关注时间：{{ formData.date2 }} {{ formData.time2 }}</div>
                      <div class="text">扩大团队，您的佣金也会提高哦！</div>
                    </div>
                    <!-- 关注成功通知 End -->

                    <!-- 精养卡 Start -->
                    <div v-if="formData.messageType2 == '佣金提醒' && formData.source2 == '精养卡'">
                      <div class="text">恭喜您，智能精养卡自动代还订单：</div>
                      <div class="text">{{ formData.order2 }}支付成功，交易金额{{ formData.price2 }}元，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission2 }} 元</span></div>
                      <div class="text">时间：{{ formData.date2 }} {{ formData.time2 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 精养卡 End -->

                    <!-- 信用卡 Start -->
                    <div v-if="formData.messageType2 == '佣金提醒' && formData.source2 == '信用卡'">
                      <div class="text">恭喜您，团队成员 {{ formData.nick2 }} 办理 {{ formData.creditCard2 }} 信用卡，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission2 }} 元</span></div>
                      <div class="text">时间：{{ formData.date2 }} {{ formData.time2 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 信用卡 End -->

                    <!-- 违章代缴 Start -->
                    <div v-if="formData.messageType2 == '佣金提醒' && formData.source2 == '违章代缴'">
                      <div class="text">恭喜您，违章代缴订单：{{ formData.order2 }}支付成功，违章扣分：{{ formData.points2 }}分，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission2 }} 元</span></div>
                      <div class="text">时间：{{ formData.date2 }} {{ formData.time2 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 违章代缴 End -->

                    <!-- 违章处理 Start -->
                    <div v-if="formData.messageType2 == '佣金提醒' && formData.source2 == '违章处理'">
                      <div class="text">恭喜您，违章处理订单：{{ formData.order2 }}处理成功，违章：{{ formData.points2 }}fen，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission2 }} 元</span></div>
                      <div class="text">时间：{{ formData.date2 }} {{ formData.time2 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 违章处理 End -->

                    <!-- 团员升级 Start -->
                    <div v-if="formData.messageType2 == '佣金提醒' && formData.source2 == '团员升级'">
                      <div class="text">恭喜您，团队成员 {{ formData.nick2 }} 支付{{ formData.gradeing2 | handleGrade }}元使用费保证金成功，升级为{{ formData.gradeing2 }}，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission2 }} 元</span></div>
                      <div class="text">时间：{{ formData.date2 }} {{ formData.time2 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 团员升级 End -->

                    <!-- 团队管理奖励 Start -->
                    <div v-if="formData.messageType2 == '佣金提醒' && formData.source2 == '团队管理奖励'">
                      <div class="text">恭喜您，(团队管理奖)团队成员 {{ formData.nick2 }} 支付{{ formData.gradeing2 | handleGrade }}元使用费保证金成功，升级为{{ formData.gradeing2 }}，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission2 }} 元</span></div>
                      <div class="text">时间：{{ formData.date2 }} {{ formData.time2 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 团队管理奖励 End -->

                    <!-- 无卡支付 Start -->
                    <div v-if="formData.messageType2 == '佣金提醒' && formData.source2 == '无卡支付'">
                      <div class="text">恭喜您，(躺赚) 无卡支付订单 (有积分) ： {{ formData.order2 }}支付成功，交易金额{{ formData.price2 }}元，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission2 }} 元</span></div>
                      <div class="text">时间：{{ formData.date2 }} {{ formData.time2 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 无卡支付 End -->

                    <!-- 会员等级变更提醒 Start -->
                    <div v-if="formData.messageType2 == '会员等级变更提醒'">
                      <div class="text">您的好友 {{ formData.nick2 }}成功升级为{{ formData.gradeing2 }}</div>
                      <div class="text">原先等级：{{ formData.gradeed2 }}</div>
                      <div class="text">当前等级：{{ formData.gradeing2 }}</div>
                      <div class="text">变更时间：{{ formData.date2 }} {{ formData.time2 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 会员等级变更提醒 End -->

                    <!-- 提现成功通知 Start -->
                    <div v-if="formData.messageType2 == '提现成功通知'">
                      <div class="text">您于 {{ formData.date2 }} 申请提现审核通过</div>
                      <div class="text">金额：<span class = "money">{{ formData.getCash2 }} 元</span></div>
                      <div class="text">时间：{{ formData.date2 }} {{ formData.time2 }}</div>
                      <div class="text">卡盟便民服务平台，系统结算已到账，请注意查收</div>
                    </div>
                    <!-- 提现成功通知 End -->

                    <!-- 贷款 Start -->
                    <div v-if="formData.messageType2 == '佣金提醒' && formData.source2 == '贷款'">
                      <div class="text">恭喜您，团队成员 {{ formData.nick2 }} 申请 宜人贷 贷款{{ formData.price2 }}元，您获得一笔团队佣金奖励</div>
                      <div class="text on">推广佣金：<span class = "money">{{ formData.commission2 }} 元</span></div>
                      <div class="text">时间：{{ formData.date2 }} {{ formData.time2 }}</div>
                      <div class="text">点击查看详情</div>
                    </div>
                    <!-- 贷款 End -->

                    <div class="detail">
                      <span class="name">详情</span>
                      <i class="icon"></i>
                    </div>
                  </div>
                </li>

                <li class="item info" v-show="formData.isShowInfo && formData.position == '下'">
                  <div class="date" v-if="formData.isShowSTime">
                    <span>{{ formData.sendDate | handlePushTime }} {{ formData.sendTime | handleSysTime }}</span>
                  </div>
                  <div class="user-box">
                    <div class="avatar">
                      <img :src="formData.avatar" alt="">
                    </div>
                    <div class="message">{{ formData.userInfo }}</div>
                  </div>
                </li>
              </ul>
            </scroller>
          </div>

          <div class="nav"
            :class="{
              android2: formData.version == '安卓Android2' && formData.footer,
              android3: formData.version == '安卓Android3' && formData.footer
            }">
            <div class="image">
              <img src="~assets/images/wechat-android10.png" alt="">
            </div>
            <a href="javascript:">首页</a>
            <i class="icon-bar"></i>
            <a href="javascript:">下载APP</a>
          </div>
        </div>
      </div>

    </scroller>
    <footer class="footer">
      <a href="javascript:" @click="isEdit = true">编辑图片</a>
      <a href="javascript:" @click="createCanvasImage">生成图片</a>
    </footer>
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

    <Edit v-model="isEdit" v-on:saveData="handleEdit"></Edit>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>