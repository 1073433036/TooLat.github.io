<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="edit-false-data" :value="value" v-show="visible">
      <div class="header">
        <a href="javascript:" class="back" @click="cancel"></a>
        <div class="title">编辑</div>
      </div>
      <scroller ref="myscroller">
        <div class="edit-wrapper">
          <div class="box">

            <ul class="list">
              <li class="item" @click="handleBombBoxChange('level')">
                <div class="title">身份</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.level }">{{ formData.level || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>

            <div class="list-title">推送消息一</div>
            <ul class="list" :class="{ 'on': formData.isShow1 }">
              <li class="item">
                <div class="title">是否显示推送消息</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="isShow1" v-model="formData.isShow1">
                    <label for="isShow1" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>
            </ul>
            <ul class="list" v-show="formData.isShow1">
              <li class="item" @click="handleBombBoxChange('messageType1')">
                <div class="title">消息类型</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.messageType1 }">{{ formData.messageType1 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item" @click="handleBombBoxChange('source1')" v-if="formData.messageType1 == '佣金提醒'">
                <div class="title">收益来源</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.source1 }">{{ formData.source1 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item">
                <div class="title">是否显示推送时间</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="isShowDate1" v-model="formData.isShowDate1">
                    <label for="isShowDate1" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>
              <li class="item" @click="handleDateChange('date1')">
                <div class="title">推送日期</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.date1 }">{{ formData.date1 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item" @click="handleSetTimeChange('time1')">
                <div class="title">推送时间</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.time1 }">{{ formData.time1 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item"
                v-show="formData.messageType1 == '关注成功通知'
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '信用卡')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '团员升级')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '团队管理奖励')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '贷款')
                || formData.messageType1 == '会员等级变更提醒'">
                <div class="title">会员昵称</div>
                <div class="content">
                  <a href="javascript:" class="btn" @click="handleBombBoxChange('nick1')">选择昵称</a>
                  <input type="text" class="input-item" v-model="formData.nick1" placeholder="请输入会员昵称">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item"
                v-show="(formData.messageType1 == '佣金提醒' && formData.source1 == '精养卡')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '违章代缴')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '违章处理')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '无卡支付')">
                <div class="title">订单号</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.order1" placeholder="请输入订单号，如 20180306102535450">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item"
                v-show="(formData.messageType1 == '佣金提醒' && formData.source1 == '精养卡')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '信用卡')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '无卡支付')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '贷款')">
                <div class="title">交易金额</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.price1" placeholder="请输入交易金额，如 450.71">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item"
                v-show="(formData.messageType1 == '佣金提醒' && formData.source1 == '违章代缴')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '违章处理')">
                <div class="title">违章扣分</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.points1" placeholder="请输违章扣分，如 3">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item"
                @click="handleBombBoxChange('gradeed1')"
                v-show="formData.messageType1 == '会员等级变更提醒'">
                <div class="title">原先等级</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.gradeed1 }">{{ formData.gradeed1 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item"
                @click="handleBombBoxChange('gradeing1')"
                v-show="(formData.messageType1 == '佣金提醒' && formData.source1 == '团员升级')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '团队管理奖励')
                || formData.messageType1 == '会员等级变更提醒'">
                <div class="title">当前等级</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.gradeing1 }">{{ formData.gradeing1 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item" @click="handleBombBoxChange('creditCard1')" v-show="formData.messageType1 == '佣金提醒' && formData.source1 == '信用卡'">
                <div class="title">信用卡</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.creditCard1 }">{{ formData.creditCard1 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item"
               v-show="formData.messageType1 == '提现成功通知'">
                <div class="title">提现金额</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.getCash1" placeholder="请输入提现金额，如 10000">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item"
                v-show="(formData.messageType1 == '佣金提醒' && formData.source1 == '精养卡')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '信用卡')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '违章代缴')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '违章处理')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '团员升级')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '团队管理奖励')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '无卡支付')
                || (formData.messageType1 == '佣金提醒' && formData.source1 == '贷款')">
                <div class="title">佣金</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.commission1" placeholder="请输入佣金，如 10">
                </div>
                <div class="icon"></div>
              </li>
            </ul>

            <div class="list-title">推送消息二</div>
            <ul class="list" :class="{ 'on': formData.isShow2 }">
              <li class="item">
                <div class="title">是否显示推送消息</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="isShow2" v-model="formData.isShow2">
                    <label for="isShow2" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>
            </ul>
            <ul class="list" v-show="formData.isShow2">
              <li class="item" @click="handleBombBoxChange('messageType2')">
                <div class="title">消息类型</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.messageType2 }">{{ formData.messageType2 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item" @click="handleBombBoxChange('source2')" v-if="formData.messageType2 == '佣金提醒'">
                <div class="title">收益来源</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.source2 }">{{ formData.source2 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item">
                <div class="title">是否显示推送时间</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="isShowDate2" v-model="formData.isShowDate2">
                    <label for="isShowDate2" class="green"></label>
                  </div>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item" @click="handleDateChange('date2')">
                <div class="title">推送日期</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.date2 }">{{ formData.date2 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item" @click="handleSetTimeChange('time2')">
                <div class="title">推送时间</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.time2 }">{{ formData.time2 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item"
                v-show="formData.messageType2 == '关注成功通知'
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '信用卡')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '团员升级')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '团队管理奖励')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '贷款')
                || formData.messageType2 == '会员等级变更提醒'">
                <div class="title">会员昵称</div>
                <div class="content">
                  <a href="javascript:" class="btn" @click="handleBombBoxChange('nick2')">选择昵称</a>
                  <input type="text" class="input-item" v-model="formData.nick2" placeholder="请输入会员昵称">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item"
                v-show="(formData.messageType2 == '佣金提醒' && formData.source2 == '精养卡')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '违章代缴')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '违章处理')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '无卡支付')">
                <div class="title">订单号</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.order2" placeholder="请输入订单号，如 20180306102535450">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item"
                v-show="(formData.messageType2 == '佣金提醒' && formData.source2 == '精养卡')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '信用卡')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '无卡支付')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '贷款')">
                <div class="title">交易金额</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.price2" placeholder="请输入交易金额，如 450.71">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item"
                v-show="(formData.messageType2 == '佣金提醒' && formData.source2 == '违章代缴')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '违章处理')">
                <div class="title">违章扣分</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.points2" placeholder="请输违章扣分，如 3">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item"
                @click="handleBombBoxChange('gradeed2')"
                v-show="formData.messageType2 == '会员等级变更提醒'">
                <div class="title">原先等级</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.gradeed2 }">{{ formData.gradeed2 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item"
                @click="handleBombBoxChange('gradeing2')"
                v-show="(formData.messageType2 == '佣金提醒' && formData.source2 == '团员升级')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '团队管理奖励')
                || formData.messageType2 == '会员等级变更提醒'">
                <div class="title">当前等级</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.gradeing2 }">{{ formData.gradeing2 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item" @click="handleBombBoxChange('creditCard2')" v-show="formData.messageType2 == '佣金提醒' && formData.source2 == '信用卡'">
                <div class="title">信用卡</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.creditCard2 }">{{ formData.creditCard2 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item"
               v-show="formData.messageType2 == '提现成功通知'">
                <div class="title">提现金额</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.getCash2" placeholder="请输入提现金额，如 10000">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item"
                v-show="(formData.messageType2 == '佣金提醒' && formData.source2 == '精养卡')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '信用卡')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '违章代缴')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '违章处理')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '团员升级')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '团队管理奖励')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '无卡支付')
                || (formData.messageType2 == '佣金提醒' && formData.source2 == '贷款')">
                <div class="title">佣金</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.commission2" placeholder="请输入佣金，如 10">
                </div>
                <div class="icon"></div>
              </li>
            </ul>

            <div class="list-title">用户消息</div>
            <ul class="list" :class="{ 'on': formData.isShowInfo }">
              <li class="item">
                <div class="title">是否显示用户消息</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="isShowInfo" v-model="formData.isShowInfo">
                    <label for="isShowInfo" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>
            </ul>
            <ul class="list" v-show="formData.isShowInfo">
              <li class="item" @click="handleBombBoxChange('position')">
                <div class="title">显示位置</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.position }">{{ formData.position || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item">
                <div class="title">是否显示推送时间</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="isShowSTime" v-model="formData.isShowSTime">
                    <label for="isShowSTime" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

               <li class="item" @click="handleDateChange('sendDate')">
                <div class="title">推送日期</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.sendDate }">{{ formData.sendDate || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item" @click="handleSetTimeChange('sendTime')">
                <div class="title">推送时间</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.sendTime }">{{ formData.sendTime || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item">
                <div class="title">内容</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.userInfo" placeholder="请输入消息内容">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
                <div class="title">头像</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.avatar }">{{ formData.avatar ? '已上传' : '请选择' }}</span>
                  <input type="file"
                    class="input-item"
                    accept="image/*"
                    v-on:change="setImage($event, 'avatar')"/>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>

            <ul class="list">
              <li class="item" @click="handleBombBoxChange('version')">
                <div class="title">操作系统</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.version }">{{ formData.version || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item" @click="handleSetTimeChange('systemTime')">
                <div class="title">系统时间</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.systemTime }">{{ formData.systemTime || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item" @click="handleBombBoxChange('operator')">
                <div class="title">运营商</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.operator }">{{ formData.operator || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item"
                v-show="formData.version == '安卓Android3'"
                @click="handleBombBoxChange('operator2')">
                <div class="title">运营商2</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.operator2 }">{{ formData.operator2 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item">
                <div class="title">电量</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.electricity" minlength="1" maxlength="100" placeholder="请输入电量">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
                <div class="title">网络</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="network" v-model="formData.network">
                    <label for="network" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
                <div class="title">充电状态</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="charge" v-model="formData.charge">
                    <label for="charge" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item" v-show="formData.version == '苹果IOS'">
                <div class="title">定位图标</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="location" v-model="formData.location">
                    <label for="location" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item" v-show="formData.version == '苹果IOS'">
                <div class="title">方向锁定图标</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="lockScreen" v-model="formData.lockScreen">
                    <label for="lockScreen" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
                <div class="title">闹钟图标</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="clock" v-model="formData.clock">
                    <label for="clock" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
                <div class="title">蓝牙图标</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="bluetooth" v-model="formData.bluetooth">
                    <label for="bluetooth" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>
              <li class="item" v-show="formData.version == '安卓Android'">
                <div class="title">数据图标</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="flow" v-model="formData.flow">
                    <label for="flow" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item" v-show="formData.version == '安卓Android2' || formData.version == '安卓Android3'">
                <div class="title">底部导航图标</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="footer" v-model="formData.footer">
                    <label for="footer" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>
              <li class="item">
                <div class="title">聊天背景</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.bgimage }">{{ formData.bgimage ? '已上传' : '请选择' }}</span>
                  <input type="file"
                    class="input-item"
                    accept="image/*"
                    v-on:change="setImage($event, 'bgimage')"/>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>

            <div class="submit-btn">
              <a href="javascript:" @click="saveData">保存</a>
            </div>

          </div>
        </div>
      </scroller>

      <BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BombBox>
      <Dates v-on:onDateClick="handelDateClick" :show="isShow" :today="false"></Dates>
      <SetTime v-on:setTimeClick="handleSetTime" :show="setTimeShow" :formData="formData[formIndex]"></SetTime>

    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>