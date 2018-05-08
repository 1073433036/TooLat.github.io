

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

            <div class="list-title">银行信息</div>
            <ul class="list">
              <li class="item" @click="handleBombBoxChange('bank')">
                <div class="title">银行</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.bank }">{{ formData.bank || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item">
                <div class="title">电话</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.phone" placeholder="请输入电话">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
                <div class="title">卡片名称</div>
                <div class="card-btn" @click="handleBombBoxChange('cardName')">卡种</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.cardName" placeholder="请输入卡片名称">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
                <div class="title">额度</div>
                <div class="content">
                  <input type="number" class="input-item" v-model="formData.quota" placeholder="请输入额度">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
                <div class="title">验证码</div>
                <div class="content">
                  <input type="number" class="input-item" v-model="formData.code" placeholder="请输入验证码">
                </div>
                <div class="icon"></div>
              </li>

              <li class="item"
                v-show="formData.bank == '交通'">
                <div class="title">密码序号</div>
                <div class="content">
                  <input type="number" class="input-item" v-model="formData.serialNumber" placeholder="请输入密码序号">
                </div>
                <div class="icon"></div>
              </li>
            </ul>

            <div class="list-title">短信信息一</div>
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
              <li class="item">
                <div class="title">是否显示推送时间</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="isShowTime1" v-model="formData.isShowTime1">
                    <label for="isShowTime1" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
                <div class="title">验证码警告</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="codeWarn1" v-model="formData.codeWarn1">
                    <label for="codeWarn1" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item" @click="handleDateChange('date1')">
                <div class="title">日期</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.date1 }">{{ formData.date1 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item" @click="handleSetTimeChange('time1')">
                <div class="title">时间</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.time1 }">{{ formData.time1 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>

            <div class="list-title">短信信息二</div>
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
              <li class="item">
                <div class="title">是否显示推送时间</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="isShowTime2" v-model="formData.isShowTime2">
                    <label for="isShowTime2" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
                <div class="title">验证码警告</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="codeWarn2" v-model="formData.codeWarn2">
                    <label for="codeWarn2" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item" @click="handleDateChange('date2')">
                <div class="title">日期</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.date2 }">{{ formData.date2 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item" @click="handleSetTimeChange('time2')">
                <div class="title">时间</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.time2 }">{{ formData.time2 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>

            <div class="list-title">短信信息三</div>
            <ul class="list" :class="{ 'on': formData.isShow3 }">
              <li class="item">
                <div class="title">是否显示推送消息</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="isShow3" v-model="formData.isShow3">
                    <label for="isShow3" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>
            </ul>
            <ul class="list" v-show="formData.isShow3">
              <li class="item">
                <div class="title">是否显示推送时间</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="isShowTime3" v-model="formData.isShowTime3">
                    <label for="isShowTime3" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
                <div class="title">验证码警告</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="codeWarn3" v-model="formData.codeWarn3">
                    <label for="codeWarn3" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item" @click="handleDateChange('date3')">
                <div class="title">日期</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.date3 }">{{ formData.date3 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item" @click="handleSetTimeChange('time3')">
                <div class="title">时间</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.time3 }">{{ formData.time3 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>

            <div class="list-title">短信信息四</div>
            <ul class="list" :class="{ 'on': formData.isShow4 }">
              <li class="item">
                <div class="title">是否显示推送消息</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="isShow4" v-model="formData.isShow4">
                    <label for="isShow4" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>
            </ul>
            <ul class="list" v-show="formData.isShow4">
              <li class="item">
                <div class="title">是否显示推送时间</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="isShowTime4" v-model="formData.isShowTime4">
                    <label for="isShowTime4" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
                <div class="title">验证码警告</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="codeWarn4" v-model="formData.codeWarn4">
                    <label for="codeWarn4" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item" @click="handleDateChange('date4')">
                <div class="title">日期</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.date4 }">{{ formData.date4 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item" @click="handleSetTimeChange('time4')">
                <div class="title">时间</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.time4 }">{{ formData.time4 || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>

            <div class="list-title">系统信息</div>
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

              <li class="item" @click="handleBombBoxChange('operator')">
                <div class="title">运营商</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.operator }">{{ formData.operator || '请选择' }}</span>
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

              <li class="item" @click="handleBombBoxChange('fontSize')">
                <div class="title">字体大小</div>
                <div class="content">
                  <span class="name" :class="{ 'on': !formData.fontSize }">{{ formData.fontSize || '请选择' }}</span>
                </div>
                <div class="icon">
                  <i class="sp sp-right"></i>
                </div>
              </li>

              <li class="item">
                <div class="title">电量</div>
                <div class="content">
                  <input type="number" class="input-item" v-model="formData.electricity" minlength="1" maxlength="100" placeholder="请输入电量">
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
                <div class="title">定位图标</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="location" v-model="formData.location">
                    <label for="location" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <li class="item">
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

              <li class="item">
                <div class="title">数据图标</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="flow" v-model="formData.flow">
                    <label for="flow" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li>

              <!-- <li class="item">
                <div class="title">底部导航图标</div>
                <div class="content">
                  <div class="switch-checked">
                    <input type="checkbox" class="open_audio" id="footer" v-model="formData.footer">
                    <label for="footer" class="green"></label>
                  </div>
                </div>
                <div class="icon"></div>
              </li> -->
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