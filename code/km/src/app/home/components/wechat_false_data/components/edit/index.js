import './index.scss';

import _                  from 'lodash';
import BombBox            from '~common/components/bomb_box';
import Dates              from '~common/components/dates';
import SetTime            from '~common/components/set_time';
import LocalStorage       from '~common/services/localStorage.cookie';
import Models             from '~common/models';

export default {
  name: 'edit',
  props: {
    value: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      visible        : false,
      isShow         : false,
      bombShow       : false,
      setTimeShow    : false,
      formIndex      : '',
      formData       : {
        version      : '',
        operator     : '',
        operator2    : '',
        network      : '',
        systemTime   : '',
        electricity  : '',
        location     : '',
        lockScreen   : '',
        clock        : '',
        bluetooth    : '',
        flow         : '',
        footer       : '',
        bgimage      : '',
        charge       : '',

        level        : '',
        isShowInfo   : '',
        position     : '',
        isShowSTime  : '',
        sendDate     : '',
        sendTime     : '',
        avatar       : '',
        userInfo     : '',

        isShow1      : '',
        messageType1 : '',
        source1      : '',
        isShowDate1  : '',
        nick1        : '',
        date1        : '',
        time1        : '',
        order1       : '',
        price1       : '',
        commission1  : '',
        points1      : '',
        gradeed1     : '',
        gradeing1    : '',
        getCash1     : '',
        creditCard1  : '',

        isShow2      : '',
        messageType2 : '',
        source2      : '',
        isShowDate2  : '',
        nick2        : '',
        date2        : '',
        time2        : '',
        order2       : '',
        price2       : '',
        commission2  : '',
        points2      : '',
        gradeed2     : '',
        gradeing2    : '',
        getCash2     : '',
        creditCard2  : '',
      },
      formTemp       : {
        version      : [
          {
            name     : '苹果IOS',
            value    : 1,
          },
          {
            name     : '安卓Android',
            value    : 2,
          },
          {
            name     : '安卓Android2',
            value    : 3,
          },
          {
            name     : '安卓Android3',
            value    : 4,
          },
        ],
        operator     : [
          {
            name     : '移动',
            value    : 1,
          },
          {
            name     : '联通',
            value    : 2,
          },
          {
            name     : '电信',
            value    : 3,
          }
        ],
        operator2    : [
          {
            name     : '移动',
            value    : 1,
          },
          {
            name     : '联通',
            value    : 2,
          },
          {
            name     : '电信',
            value    : 3,
          }
        ],
        network      : [
          {
            name     : '4G',
            value    : 1,
          },
          {
            name     : 'WiFi',
            value    : 2,
          },
        ],
        location     : [
          {
            name     : '显示',
            value    : 1,
          },
          {
            name     : '不显示',
            value    : 2,
          },
        ],
        lockScreen   : [
          {
            name     : '显示',
            value    : 1,
          },
          {
            name     : '不显示',
            value    : 2,
          },
        ],
        clock        : [
          {
            name     : '显示',
            value    : 1,
          },
          {
            name     : '不显示',
            value    : 2,
          },
        ],
        bluetooth    : [
          {
            name     : '显示',
            value    : 1,
          },
          {
            name     : '不显示',
            value    : 2,
          },
        ],
        flow         : [
          {
            name     : '显示',
            value    : 1,
          },
          {
            name     : '不显示',
            value    : 2,
          },
        ],
        charge       : [
          {
            name     : '显示',
            value    : 1,
          },
          {
            name     : '不显示',
            value    : 2,
          },
        ],
        footer       : [
          {
            name     : '显示',
            value    : 1,
          },
          {
            name     : '不显示',
            value    : 2,
          },
        ],
        level        : [
          {
            name     : 'LV1',
            value    : 1,
          },
          {
            name     : 'LV2(直)',
            value    : 2,
          },
          {
            name     : 'LV2(间)',
            value    : 3,
          },
          {
            name     : 'LV3(直)',
            value    : 4,
          },
          {
            name     : 'LV3(间)',
            value    : 5,
          },
        ],
        position     : [
          {
            name     : '上',
            value    : 1,
          },
          {
            name     : '中',
            value    : 2,
          },
          {
            name     : '下',
            value    : 3,
          },
        ],
        isShowInfo   : [
          {
            name     : '显示',
            value    : 1,
          },
          {
            name     : '不显示',
            value    : 2,
          },
        ],
        isShowSTime  : [
          {
            name     : '显示',
            value    : 1,
          },
          {
            name     : '不显示',
            value    : 2,
          },
        ],

        messageType1  : [
          {
            name     : '佣金提醒',
            value    : 1,
          },
          {
            name     : '关注成功通知',
            value    : 2,
          },
          {
            name     : '会员等级变更提醒',
            value    : 3,
          },
          {
            name     : '提现成功通知',
            value    : 4,
          },
        ],
        source1      : [
          {
            name     : '信用卡',
            value    : 1,
          },
          {
            name     : '无卡支付',
            value    : 2,
          },
          {
            name     : '精养卡',
            value    : 3,
          },
          {
            name     : '团员升级',
            value    : 4,
          },
          {
            name     : '团队管理奖励',
            value    : 5,
          },
          {
            name     : '违章代缴',
            value    : 6,
          },
          {
            name     : '违章处理',
            value    : 7,
          },
          {
            name     : '贷款',
            value    : 8,
          },
        ],
        isShowDate1  : [
          {
            name     : '显示',
            value    : 1,
          },
          {
            name     : '不显示',
            value    : 2,
          },
        ],
        gradeed1     : [
          {
            name     : '实习会员Lv1',
            value    : 1,
          },
          {
            name     : '高级会员Lv1',
            value    : 2,
          },
          {
            name     : '保险经理Lv1',
            value    : 3,
          },
          {
            name     : '保险主任Lv1',
            value    : 4,
          },
        ],
        gradeing1    : [
          {
            name     : '实习会员Lv1',
            value    : 1,
          },
          {
            name     : '高级会员Lv1',
            value    : 2,
          },
          {
            name     : '保险经理Lv1',
            value    : 3,
          },
          {
            name     : '保险主任Lv1',
            value    : 4,
          },
        ],
        creditCard1  : [
          {
            name     : '交通银行',
            value    : 110,
          },
          {
            name     : '平安银行',
            value    : 105,
          },
          {
            name     : '兴业银行',
            value    : 70,
          },
          {
            name     : '民生银行',
            value    : 80,
          },
          {
            name     : '浦发银行',
            value    : 100,
          },
          {
            name     : '光大银行',
            value    : 140,
          },
          {
            name     : '工商银行',
            value    : 25,
          },
          {
            name     : '华夏银行',
            value    : 75,
          },
        ],
        nick1        : [],

        messageType2  : [
          {
            name     : '佣金提醒',
            value    : 1,
          },
          {
            name     : '关注成功通知',
            value    : 2,
          },
          {
            name     : '会员等级变更提醒',
            value    : 3,
          },
          {
            name     : '提现成功通知',
            value    : 4,
          },
        ],
        source2      : [
          {
            name     : '信用卡',
            value    : 1,
          },
          {
            name     : '无卡支付',
            value    : 2,
          },
          {
            name     : '精养卡',
            value    : 3,
          },
          {
            name     : '团员升级',
            value    : 4,
          },
          {
            name     : '团队管理奖励',
            value    : 5,
          },
          {
            name     : '违章代缴',
            value    : 6,
          },
          {
            name     : '违章处理',
            value    : 7,
          },
          {
            name     : '贷款',
            value    : 8,
          },
        ],
        isShowDate2  : [
          {
            name     : '显示',
            value    : 1,
          },
          {
            name     : '不显示',
            value    : 2,
          },
        ],
        gradeed2     : [
          {
            name     : '实习会员Lv1',
            value    : 1,
          },
          {
            name     : '高级会员Lv1',
            value    : 2,
          },
          {
            name     : '保险经理Lv1',
            value    : 3,
          },
          {
            name     : '保险主任Lv1',
            value    : 4,
          },
        ],
        gradeing2    : [
          {
            name     : '实习会员Lv1',
            value    : 1,
          },
          {
            name     : '高级会员Lv1',
            value    : 2,
          },
          {
            name     : '保险经理Lv1',
            value    : 3,
          },
          {
            name     : '保险主任Lv1',
            value    : 4,
          },
        ],
        creditCard2  : [
          {
            name     : '交通银行',
            value    : 110,
          },
          {
            name     : '平安银行',
            value    : 105,
          },
          {
            name     : '兴业银行',
            value    : 70,
          },
          {
            name     : '民生银行',
            value    : 80,
          },
          {
            name     : '浦发银行',
            value    : 100,
          },
          {
            name     : '光大银行',
            value    : 140,
          },
          {
            name     : '工商银行',
            value    : 25,
          },
          {
            name     : '华夏银行',
            value    : 75,
          },
        ],
        nick2        : [],
      },
    };
  },
  components: {
    BombBox,
    Dates,
    SetTime,
  },
  computed: {
  },
  mounted () {
    if (this.value) {
      this.visible = true;
    }
    this.getLocalStorage();
    this.getNick();
    this.$scrollerUpdate(this.$refs.myscroller);
  },
  watch: {
    value (val) {
      this.visible = val;
    },
    visible (val) {
      this.$emit('input', val);
    },
    formData: {
      deep: true,
      handler (value) {
        this.handleAutoCalc();
        this.saveEditData(value);
      },
    },
  },
  methods: {

    /*
     * 取消设置
     */
    cancel () {
      this.visible = false;
    },

    saveData () {
      /*if (!this.formData.operator) {
        this.$toast('请选择运营商');
        return;
      }
      if (!this.formData.network) {
        this.$toast('请选择网络');
        return;
      }*/
      if (!this.formData.systemTime) {
        this.$toast('请选择系统时间');
        return;
      }
      if (!this.formData.electricity) {
        this.$toast('请输入电量');
        return;
      }

      if (!this.formData.messageType1) {
        this.$toast('请选择消息类型');
        return;
      }
      if (this.formData.messageType1 && '佣金提醒' === this.formData.messageType1) {
        if (!this.formData.source1) {
          this.$toast('请选择收益来源');
          return;
        }
      }
      /*if (!this.formData.isShowDate1) {
        this.$toast('请选择推送时间');
        return;
      }*/
      if (!this.formData.date1) {
        this.$toast('请选择日期');
        return;
      }
      if (!this.formData.time1) {
        this.$toast('请选择时间');
        return;
      }
      if ('关注成功通知' === this.formData.messageType1
        || '佣金提醒' === this.formData.messageType1 && '信用卡' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '团员升级' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '团队管理奖励' === this.formData.source1
        || '会员等级变更提醒' === this.formData.messageType1) {
        if (!this.formData.nick1) {
          this.$toast('请输入会员昵称');
          return;
        }
      }
      if ('佣金提醒' === this.formData.messageType1 && '精养卡' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '违章代缴' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '违章处理' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '无卡支付' === this.formData.source1) {
        if (!this.formData.order1) {
          this.$toast('请输入订单号');
          return;
        }
      }
      if ('佣金提醒' === this.formData.messageType1 && '精养卡' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '信用卡' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '无卡支付' === this.formData.source1) {
        if (!this.formData.price1) {
          this.$toast('请输入交易金额');
          return;
        }
      }
      if ('佣金提醒' === this.formData.messageType1 && '精养卡' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '信用卡' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '违章代缴' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '违章处理' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '团员升级' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '团队管理奖励' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '无卡支付' === this.formData.source1) {
        if (!this.formData.commission1) {
          this.$toast('请输入佣金');
          return;
        }
      }
      if ('佣金提醒' === this.formData.messageType1 && '违章代缴' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '违章处理' === this.formData.source1) {
        if (!this.formData.points1) {
          this.$toast('请输违章扣分');
          return;
        }
      }
      if ('会员等级变更提醒' === this.formData.messageType1) {
        if (!this.formData.gradeed1) {
          this.$toast('请选择原先等级');
          return;
        }
      }
      if ('佣金提醒' === this.formData.messageType1 && '团员升级' === this.formData.source1
        || '佣金提醒' === this.formData.messageType1 && '团队管理奖励' === this.formData.source1
        || '会员等级变更提醒' === this.formData.messageType1) {
        if (!this.formData.gradeing1) {
          this.$toast('请选择当前等级');
          return;
        }
      }
      if ('提现成功通知' === this.formData.messageType1) {
        if (!this.formData.getCash1) {
          this.$toast('请输入提现金额');
          return;
        }
      }


      if (!this.formData.messageType2) {
        this.$toast('请选择消息类型');
        return;
      }
      if (this.formData.messageType2 && '佣金提醒' === this.formData.messageType2) {
        if (!this.formData.source2) {
          this.$toast('请选择收益来源');
          return;
        }
      }
      /*if (!this.formData.isShowDate2) {
        this.$toast('请选择推送时间');
        return;
      }*/
      if (!this.formData.date2) {
        this.$toast('请选择日期');
        return;
      }
      if (!this.formData.time2) {
        this.$toast('请选择时间');
        return;
      }
      if ('关注成功通知' === this.formData.messageType2
        || '佣金提醒' === this.formData.messageType2 && '信用卡' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '团员升级' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '团队管理奖励' === this.formData.source2
        || '会员等级变更提醒' === this.formData.messageType2) {
        if (!this.formData.nick2) {
          this.$toast('请输入会员昵称');
          return;
        }
      }
      if ('佣金提醒' === this.formData.messageType2 && '精养卡' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '违章代缴' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '违章处理' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '无卡支付' === this.formData.source2) {
        if (!this.formData.order2) {
          this.$toast('请输入订单号');
          return;
        }
      }
      if ('佣金提醒' === this.formData.messageType2 && '精养卡' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '信用卡' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '无卡支付' === this.formData.source2) {
        if (!this.formData.price2) {
          this.$toast('请输入交易金额');
          return;
        }
      }
      if ('佣金提醒' === this.formData.messageType2 && '精养卡' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '信用卡' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '违章代缴' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '违章处理' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '团员升级' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '团队管理奖励' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '无卡支付' === this.formData.source2) {
        if (!this.formData.commission2) {
          this.$toast('请输入佣金');
          return;
        }
      }
      if ('佣金提醒' === this.formData.messageType2 && '违章代缴' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '违章处理' === this.formData.source2) {
        if (!this.formData.points2) {
          this.$toast('请输违章扣分');
          return;
        }
      }
      if ('会员等级变更提醒' === this.formData.messageType2) {
        if (!this.formData.gradeed2) {
          this.$toast('请选择原先等级');
          return;
        }
      }
      if ('佣金提醒' === this.formData.messageType2 && '团员升级' === this.formData.source2
        || '佣金提醒' === this.formData.messageType2 && '团队管理奖励' === this.formData.source2
        || '会员等级变更提醒' === this.formData.messageType2) {
        if (!this.formData.gradeing2) {
          this.$toast('请选择当前等级');
          return;
        }
      }
      if ('提现成功通知' === this.formData.messageType2) {
        if (!this.formData.getCash2) {
          this.$toast('请输入提现金额');
          return;
        }
      }

      this.$emit('saveData', this.formData);
      this.cancel();
    },

    handleAutoCalc () {
      // 信用卡佣金计算
      if ('佣金提醒' === this.formData.messageType1 && '信用卡' === this.formData.source1) {
        this.formTemp.creditCard1.forEach((item) => {
          if (item.name === this.formData.creditCard1) {
            this.formData.price1 = item.value;
          }
        });
        if ('LV1' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 60 * 100 / 100 / 100);
        }
        else if ('LV2(直)' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 85 * 100 / 100 / 100);
        }
        else if ('LV2(间)' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 25 * 100 / 100 / 100);
        }
        else if ('LV3(直)' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 95 * 100 / 100 / 100);
        }
        else if ('LV3(间)' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 35 * 100 / 100 / 100);
        }
      }
      if ('佣金提醒' === this.formData.messageType2 && '信用卡' === this.formData.source2) {
        this.formTemp.creditCard2.forEach((item) => {
          if (item.name === this.formData.creditCard2) {
            this.formData.price2 = item.value;
          }
        });
        if ('LV1' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 60 * 100 / 100 / 100);
        }
        else if ('LV2(直)' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 85 * 100 / 100 / 100);
        }
        else if ('LV2(间)' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 25 * 100 / 100 / 100);
        }
        else if ('LV3(直)' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 95 * 100 / 100 / 100);
        }
        else if ('LV3(间)' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 35 * 100 / 100 / 100);
        }
      }

      // 精养卡佣金计算
      if ('佣金提醒' === this.formData.messageType1 && '精养卡' === this.formData.source1) {
        if ('LV1' === this.formData.level) {
          this.formData.commission1 = this.this.reCalc((this.formData.price1 - 2) * 100 / 100 / 100 * 0.12 + 0.5);
        }
        else if ('LV2(直)' === this.formData.level) {
          this.formData.commission1 = this.reCalc((this.formData.price1 - 2) * 100 / 100 / 100 * 0.17 + 0.8);
        }
        else if ('LV2(间)' === this.formData.level) {
          this.formData.commission1 = this.reCalc((this.formData.price1 - 2) * 100 / 100 / 100 * 0.05 + 0.3);
        }
        else if ('LV3(直)' === this.formData.level) {
          this.formData.commission1 = this.reCalc((this.formData.price1 - 2) * 100 / 100 / 100 * 0.19 + 1);
        }
        else if ('LV3(间)' === this.formData.level) {
          this.formData.commission1 = this.reCalc((this.formData.price1 - 2) * 100 / 100 / 100 * 0.07 + 0.5);
        }
      }
      if ('佣金提醒' === this.formData.messageType2 && '精养卡' === this.formData.source2) {
        if ('LV1' === this.formData.level) {
          this.formData.commission2 = this.reCalc((this.formData.price2 - 2) * 100 / 100 / 100 * 0.12 + 0.5);
        }
        else if ('LV2(直)' === this.formData.level) {
          this.formData.commission2 = this.reCalc((this.formData.price2 - 2) * 100 / 100 / 100 * 0.17 + 0.8);
        }
        else if ('LV2(间)' === this.formData.level) {
          this.formData.commission2 = this.reCalc((this.formData.price2 - 2) * 100 / 100 / 100 * 0.05 + 0.3);
        }
        else if ('LV3(直)' === this.formData.level) {
          this.formData.commission2 = this.reCalc((this.formData.price2 - 2) * 100 / 100 / 100 * 0.19 + 1);
        }
        else if ('LV3(间)' === this.formData.level) {
          this.formData.commission2 = this.reCalc((this.formData.price2 - 2) * 100 / 100 / 100 * 0.07 + 0.5);
        }
      }

      // 推荐会员佣金计算
      if ('佣金提醒' === this.formData.messageType1 && '团员升级' === this.formData.source1 && '保险主任Lv1' === this.formData.gradeing1) {
        if ('LV1' === this.formData.level) {
          this.formData.commission1 = 268;
        }
        else if ('LV2(直)' === this.formData.level) {
          this.formData.commission1 = 358;
        }
        else if ('LV2(间)' === this.formData.level) {
          this.formData.commission1 = 90;
        }
        else if ('LV3(直)' === this.formData.level) {
          this.formData.commission1 = 428;
        }
        else if ('LV3(间)' === this.formData.level) {
          this.formData.commission1 = 70;
        }
      }
      if ('佣金提醒' === this.formData.messageType2 && '团员升级' === this.formData.source2 && '保险主任Lv1' === this.formData.gradeing2) {
        if ('LV1' === this.formData.level) {
          this.formData.commission2 = 268;
        }
        else if ('LV2(直)' === this.formData.level) {
          this.formData.commission2 = 358;
        }
        else if ('LV2(间)' === this.formData.level) {
          this.formData.commission2 = 90;
        }
        else if ('LV3(直)' === this.formData.level) {
          this.formData.commission2 = 428;
        }
        else if ('LV3(间)' === this.formData.level) {
          this.formData.commission2 = 70;
        }
      }

      // 无卡支付佣金计算
      if ('佣金提醒' === this.formData.messageType1 && '无卡支付' === this.formData.source1) {
        if ('LV1' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 100 / 100 / 100 * 0.08);
        }
        else if ('LV2(直)' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 100 / 100 / 100 * 0.1);
        }
        else if ('LV2(间)' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 100 / 100 / 100 * 0.02);
        }
        else if ('LV3(直)' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 100 / 100 / 100 * 0.12);
        }
        else if ('LV3(间)' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 100 / 100 / 100 * 0.04);
        }
      }
      if ('佣金提醒' === this.formData.messageType2 && '无卡支付' === this.formData.source2) {
        if ('LV1' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 100 / 100 / 100 * 0.08);
        }
        else if ('LV2(直)' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 100 / 100 / 100 * 0.1);
        }
        else if ('LV2(间)' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 100 / 100 / 100 * 0.02);
        }
        else if ('LV3(直)' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 100 / 100 / 100 * 0.12);
        }
        else if ('LV3(间)' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 100 / 100 / 100 * 0.04);
        }
      }

      // 贷款佣金计算
      if ('佣金提醒' === this.formData.messageType1 && '贷款' === this.formData.source1) {
        if ('LV1' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 60 * 5 / 100 / 100);
        }
        else if ('LV2(直)' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 85 * 5 / 100 / 100);
        }
        else if ('LV2(间)' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 25 * 5 / 100 / 100);
        }
        else if ('LV3(直)' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 95 * 5 / 100 / 100);
        }
        else if ('LV3(间)' === this.formData.level) {
          this.formData.commission1 = this.reCalc(this.formData.price1 * 10 * 5 / 100 / 100);
        }
      }
      if ('佣金提醒' === this.formData.messageType2 && '贷款' === this.formData.source2) {
        if ('LV1' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 60 * 5 / 100 / 100);
        }
        else if ('LV2(直)' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 85 * 5 / 100 / 100);
        }
        else if ('LV2(间)' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 25 * 5 / 100 / 100);
        }
        else if ('LV3(直)' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 95 * 5 / 100 / 100);
        }
        else if ('LV3(间)' === this.formData.level) {
          this.formData.commission2 = this.reCalc(this.formData.price2 * 10 * 5 / 100 / 100);
        }
      }
    },

    reCalc (money) {
      let value = 0;
      if (/^\d+(\.\d{0,6})?$/.test(money)) {
        value = money;
      }
      else {
        // value = ('' + money).substring(0, ('' + money).indexOf('.') + 7);
        value = parseFloat(money.toFixed(6));
      }
      return value;
    },

    /*
     * 底部弹框组件2
     */
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.formData, {
              [this.formIndex]: obj.content.name,
            });
          }
          return;
        }
      }
    },

    /*
     * 所属组件2
     */
    handleBombBoxChange (index) {
      this.formIndex  = index;
      this.bombShow   = true;
    },

    /*
     * 日期组件回调
     */
    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          _.assign(this.formData, {
            [this.formIndex]: obj.content
          });
          return;
        }
      }
    },

    /*
     * 日期组件改变
     */
    handleDateChange (item) {
      this.isShow     = true;
      this.formIndex  = item;
    },

    /*
     * 设置时间组件回调
     */
    handleSetTime (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.setTimeShow = obj.status;
          _.assign(this.formData, {
            [this.formIndex]: obj.content
          });
          return;
        }
      }
    },

    /*
     * 设置时间组件改变
     */
    handleSetTimeChange (item) {
      this.setTimeShow     = true;
      this.formIndex       = item;
    },

    /*
     * 图片上传组件
     */
    setImage (event, index) {
      let file = event.target.files[0];
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '上传中，请稍等...'
      });
      this.getBase(file, (data) => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        this.formData[index] = data;
        if ('avatar' === index) {
          this.saveLocalStorage('wechatFalseImage', index, data);
        }
      });
    },

    /*
     * 压缩图片
     */
    getBase (file, callback) {
      let reader = new FileReader(),
        image = new Image(),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        data = '';
      reader.readAsDataURL(file);
      reader.onload = function () {
        image.src = this.result;
      };
      image.onload = function () {
        let w = image.naturalWidth,
          h = image.naturalHeight;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(image, 0, 0, w, h, 0, 0, w, h);
        data = canvas.toDataURL('image/jpeg', 1);
        if (callback && 'function' === typeof callback) {
          callback(data);
        }
      };
    },

    /*
     * 本地存储
     */
    saveLocalStorage (name, key, value) {
      let data = LocalStorage.get([name]);
      if (!_.isEmpty(data, 'data')) {
        data.data[key] = value;
        LocalStorage.set([name], data.data);
      }
      else {
        LocalStorage.set([name], {
          [key]: value,
        });
      }
    },

    saveEditData (value) {
      for (let i in this.formData) {
        if ('avatar' !== i && 'bgimage' !== i) {
          this.saveLocalStorage('wechatFalseData', i, value[i]);
        }
      }
    },

    getLocalStorage () {
      let data = _.get(LocalStorage.get('wechatFalseData'), 'data');
      let images = _.get(LocalStorage.get('wechatFalseImage'), 'data');
      if (!_.isEmpty(data)) {
        for (let i in data) {
          this.formData[i] = data[i];
        }
      }
      if (!_.isEmpty(images)) {
        for (let i in images) {
          this.formData[i] = images[i];
        }
      }
      this.$emit('saveData', this.formData);
    },

    getNick () {
      let self = this;
      Models.Public
      .indexV()
      .then((res) => {
        if (1 === res.code) {
          res.data.forEach((item, index) => {
            let data = {
              name: item,
              value: index,
            };
            self.formTemp.nick1.push(data);
            self.formTemp.nick2.push(data);
          });
        }
      });
    },

  }
};