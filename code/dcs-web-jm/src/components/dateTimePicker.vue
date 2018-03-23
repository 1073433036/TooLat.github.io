<template>
  <div class="datetime-wraper ns">
    <div class="date">
      <el-date-picker v-model="datetime.date"
                      type="date"
                      popper-class="test-class"
                      :picker-options="pickerOptions"
                      @change="changeDate">
      </el-date-picker>
      <span class="svg-tri-wraper">
        <svg :class="['svg-up', { 'disable-up': disableUpDate }]" id="date-up" @click="handDate('for', 'date')">
          <path class="tri-option" id="tri-up" d="M 0,4 L 8,4 L 4,0 Z"></path>
        </svg>
        <svg class="svg-down" id="date-down" @click="handDate('back', 'date')">
          <path class="tri-option" id="tri-down" d="M 0,0 L 8,0 L 4,4 Z"></path>
        </svg>
      </span>
    </div>
    <span class="datetime-text">日</span>
    <div class="hour">
      <select v-model="datetime.hour">
        <option v-for="h in 24">{{ h < 11 ? ('0' + (h - 1)) : (h - 1) }}</option>
      </select>
      <span class="svg-tri-wraper">
        <svg :class="['svg-up', { 'disable-up': disableUpHour }]" id="hour-up" @click="handDate('for', 'hour')">
          <path class="tri-option" id="tri-up" d="M 0,4 L 8,4 L 4,0 Z"></path>
        </svg>
        <svg class="svg-down" id="hour-down" @click="handDate('back', 'hour')">
          <path class="tri-option" id="tri-down" d="M 0,0 L 8,0 L 4,4 Z"></path>
        </svg>
      </span>
    </div>
    <span class="datetime-text">时</span>
    <div class="minute">
      <select v-model="datetime.minute">
        <option v-for="m in minuteOptions">{{m}}</option>
      </select>
      <span class="svg-tri-wraper">
        <svg :class="['svg-up', { 'disable-up': disableUpMinute }]" id="hour-up" @click="handDate('for', 'minute')">
          <path class="tri-option" id="tri-up" d="M 0,4 L 8,4 L 4,0 Z"></path>
        </svg>
        <svg class="svg-down" id="hour-down" @click="handDate('back', 'minute')">
          <path class="tri-option" id="tri-down" d="M 0,0 L 8,0 L 4,4 Z"></path>
        </svg>
      </span>
    </div>
    <span class="datetime-text" style="padding-right: 0">分</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datetime: {
        date: '',
        hour: '00',
        minute: '00'
      },
      minuteOptions: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      disableUpMinute: true
    }
  },
  props: ['datetimeChange'],
  mounted() {
    const dt = new Date();
    const hour = dt.getHours();
    let minute = dt.getMinutes();
    minute -= minute%5;
    this.datetime.date = dt.Format('yyyy-MM-dd');
    this.datetime.hour = hour < 10 ? `0${hour}` : hour;
    this.datetime.minute = minute < 10 ? `0${minute}` : minute;
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0)
        continue;
      let m = i < 10 ? `0${i}` : i;
      this.minuteOptions.push(m);
    }
  },
  computed: {
    disableUpHour() {
      let datetime = this.datetime;
      let nowDate = new Date(`${datetime.date} ${datetime.hour}:${datetime.minute}`).getTime();
      let nextDate = nowDate + 3600000;
      return new Date().Format('yyyy-MM-dd HH') === `${datetime.date} ${datetime.hour}` || nextDate >= new Date().getTime();
    },
    disableUpDate() {
      return new Date().Format('yyyy-MM-dd') === this.datetime.date;
    }
  },
  methods: {
    changeDate(dt) {
      this.datetime.date = dt;
    },
    handDate(dir, type) {
      if(dir === 'for' && this.disableUpMinute)
        return;
      if(dir === 'for' && type === 'date' && this.disableUpDate)
        return;
      if(dir === 'for' && type === 'hour' && this.disableUpHour)
        return;

      let ms;

      if (type === 'date') {
        ms = 24 * 3600000;
      } else if (type === 'hour') {
        ms = 3600000;
      } else {
        ms = 5 * 60000;
      }
      let dateObj = this.datetime;
      let dt = new Date(`${dateObj.date} ${dateObj.hour}:${dateObj.minute}`).getTime();
      if (dir === 'for') {
        dt += ms;
      } else {
        dt -= ms;
      }

      let nowMinute = new Date().getMinutes();
      nowMinute -= nowMinute%5;
      const nowDate = new Date().Format('yyyy/MM/dd HH');
      const nowMs = new Date(`${nowDate}:${nowMinute < 10 ? '0' + nowMinute : nowMinute}`).getTime();

      if(nowMs <= dt) {
        this.disableUpMinute = true;
        if(nowMs < dt)
          return;
      } else {
        this.disableUpMinute = false;
      }
      dt = new Date(dt).Format('yyyy-MM-dd HH:mm');
      this.datetime = {
        date: dt.slice(0, 10),
        hour: dt.slice(11, 13),
        minute: dt.slice(14)
      };
    }
  },
  watch: {
    'datetime': {
      handler(nv, oldVal) {
        this.datetimeChange(nv, oldVal);
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.datetime-wraper {
  width: 100%;
  height: 44px;
  position: relative;
  box-sizing: border-box;
  padding: 10px;
  border-bottom: solid 1px #dfe7f3;
  div {
    float: left;
    border: solid 1px #eeeeee;
    border-radius: 3px;
    height: 24px;
    box-sizing: border-box;
    padding: 0 4px 0 6px;
    position: relative;
    span {
      position: absolute;
      top: 0px;
      right: 0px;
      display: block;
      width: 18px !important;
      height: 22px !important;
      background-color: white;
      svg {
        position: absolute;
        width: 18px;
        height: 12px;
        margin: 0;
      }
    }
  }
  input {
    font-size: 12px;
    line-height: 24px;
    background-color: transparent;
    transform: translateY(-1px);
    border: none;
    padding: 0;
    color: #545454;
    &:focus {
      outline: none;
    }
  }
  div.date {
    width: 100px;
    input {
      width: 65px;
    }
  }
  div.hour,
  div.minute {
    width: 40px;
    select {
      width: 36px;
      height: 100%;
      border: none;
      margin-left: -5px;
      font-size: 12px;
      outline: none;
    }
  }
}

.datetime-text {
  float: left;
  line-height: 24px;
  font-size: 12px;
  color: #545454;
  padding: 0 8px;
}

.svg-up{
  padding: 5px 5px 2px 5px;
  cursor: pointer;
  &:hover {
    path {
      fill: #4cafff;
    }
  }
}

.svg-down {
  transform: translateY(12px);
  padding: 2px 5px 4px 5px;
  cursor: pointer;
  &:hover {
    path {
      fill: #4cafff;
    }
  }
}

.disable-up {
  path {
    fill: #ddd;
  }
  &:hover {
    path {
      fill: #ddd;
    }
  }
}
</style>
<style lang="scss" >
.date .el-date-editor {
  width: auto!important;
  border: none!important;
  height: 22px!important;
  padding: 0!important;
  input.el-input__inner {
    height: 22px!important;
    border: none!important;
    padding: 0!important;
    font-size: 12px!important;
  }
  .el-input__icon+.el-input__inner {
    padding: 0!important;
  }
  .el-input__icon {
    display: none!important;
  }
}
</style>
