import './index.scss';

import _      from 'lodash';
import Models from '~common/models';
import Radio  from '~common/components/radio';

export default {
  name: 'payType',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    goods: {
      type: Object,
      default: {},
    },
    query: {
      type: Object,
      default: {},
    },
  },
  data () {
    return {
      confirm: true,
      payType: false,
      formData: {
        payType: 0
      },
      formTemp: {
        payType: [
          {
            name: '在线支付',
            value: 0,
          }
        ]
      },
      payTypeData: [],

      manager: {},
      btnText: '立即支付',
      payNameSta: false,
      isShare: false,
      isAgent: false,
      payTitle: '确认升级',
      isSigh: false,
    };
  },
  mounted () {
    this.payment();
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo');
    },
  },
  components: {
    Radio
  },
  watch: {
    show (val) {
      if (true === val) {
        this.handleMyManager();
      }
    },

    'formData.payType' (val, old) {
      if (val !== old) {

        if (0 !== this.formData.payType * 1) {
          this.payTitle = `${this.userInfo.user_nickname}升级${this.goods.goods_name}请您代付`;
        }
        else {
          this.payTitle = '确认升级';
        }

        if (1 === this.formData.payType * 1) {
          this.btnText  = '立即代付';
        }
        else {
          this.btnText  = '立即支付';
        }

        if (0 === this.formData.payType * 1) {
          this.isSigh = false;
          this.formTemp = _.assign({}, this.formTemp, {
            payType: [
              {
                name: '在线支付',
                value: 0,
              }
            ]
          });
        }
      }
    },

    'formData.pay_name' (val, old) {
      if (true === old) {
        this.payNameSta = false;
      }
    },

    'formData.money' (val, old) {
      if (val !== old) {
        if (val * 1 > this.goods.money * 1) {
          this.$toast(`自付金额不能大于${this.goods.money}元`);
          this.formData.money = '';
          return;
        }
      }
    },

    query () {
      this.payTitle = '确认升级';
    },

    goods (val, old) {
      if (val !== old) {
        this.getQueryOrder();
      }
    },

    isSigh (val, old) {
      if (val !== old && true === val) {
        this.formTemp = _.assign({}, this.formTemp, {
          payType: [
            {
              name: '在线支付',
              value: 0,
            },
            {
              name: '全额代付',
              value: 1,
            },
            {
              name: '部分代付',
              value: 2,
            },
          ]
        });
      }
    },

  },
  methods: {

    // 获取订单编号，如果存在，表示是代付链接
    getQueryOrder () {
      let self = this;

      self.$nextTick(() => {
        setTimeout(() => {

          if (!_.isEmpty(self.query.order_id)) {
            self.isAgent  = true;
            self.payTitle = this.goods.content_title;
          }
          else {
            self.isAgent  = false;
            self.payTitle = '确认升级';
          }
        }, 500);
      });

    },

    // 获取支付方式
    payment () {
      Models.Payment
      .get({
        channel: true === this.device.is('WeChat') ? 'wechat' : 'wap',
      })
      .then((res) => {
        if (1 === res.code) {
          let arr = [];
          for (let el of res.data) {
            if (el.type === 'wechat') {
              arr.unshift(el);
            }
            else {
              arr.push(el);
            }
          }
          this.payTypeData = arr;
          _.each(this.payTypeData, (item) => {
            if ('wechat' === item.type) {
              this.formData.pay_id = item.pay_id;
            }
          });
          if (!this.formData.pay_id && this.payTypeData.length) {
            this.formData.pay_id = this.payTypeData[0].pay_id;
          }
        }
      });
    },

    // 关闭
    handleClose () {
      this.isAgent = false;
      this.$emit('payTypeClick', {
        status: false,
      });
    },

    // 选择新的支付方式
    handleSelectType (data) {
      if (this.formData.pay_id !== data.pay_id) {
        this.formData = _.assign({}, this.formData, data);
        this.confirm = true;
        this.payType = false;
      }
    },

    // 更换支付方式
    handleChangePay () {
      this.confirm = !this.confirm;
      this.payType = true;
      if (_.isEmpty(this.payTypeData)) {
        this.payment();
      }
    },

    // 立即支付
    handleSumbitPay () {
      if (2 === this.formData.payType && true !== this.$rules.money(this.formData.money)) {
        this.$toast('请输入正确的金额');
        this.$refs.money.focus();
        return;
      }

      // if (1 !== this.formData.payType) {
      //   this.$toast('请选择支付方式');
      //   this.payNameSta = true;
      //   return;
      // }

      // 弹出全额代付邀请，同时下单
      if (1 === this.formData.payType) {
        let data = {
          goods_id    : _.get(this.goods, 'goods_id'),
          pay_method  : 1,
          invite_code : this.manager.invite_code || this.goods.invite_code
        };

        this.handleCreateOrder(data);
        return;
      }

      // 部分代付，先支队部分，再分享
      else if (2 === this.formData.payType) {
        let data = {
          goods_id    : _.get(this.goods, 'goods_id'),
          pay_method  : 2,
          invite_code : this.manager.invite_code || this.goods.invite_code,
          df_fee      : this.formData.money,
        };

        this.handleCreateOrder(data);
        return;
      }

      this.$emit('payTypeClick', {
        status: false,
        content: this.formData,
      });
    },

    // 创建订单
    handleCreateOrder (data = {}) {

      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '正在生成订单...'
      });

      Models.Order
      .create(data)
      .then((res) => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        if (1 === res.code) {
          if (2 === this.formData.payType * 1) {
            this.$emit('payTypeClick', {
              status: false,
              content: {
                pay_type: 2,
                data: _.assign({}, res.data, this.formData)
              },
            });
          }
          else {
            this.isShare = true;
          }
          this.$store.get.dispatch({
            type: 'histData',
            data: {
              agentOrder: res.data
            },
          });
        }
        else {
          this.$toast(res.msg || '下单失败');
        }

      });
    },

    // 获取上级推荐人
    handleMyManager () {
      if (_.isEmpty(this.query.order_id)) {
        Models.User
        .myManager()
        .then((res) => {
          if (1 === res.code) {
            this.manager = res.data;
          }
          else {
            this.$toast(res.msg || '获取上级推荐码失败');
          }
        });
      }
    }
  }
};
