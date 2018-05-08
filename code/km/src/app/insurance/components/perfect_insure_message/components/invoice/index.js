import './index.scss';

import _                  from 'lodash';
import BombBox            from '~common/components/bomb_box';

export default {
  name: 'invoice',
  props: {
    value: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      visible             : false,
      /*
       * 底部弹框组件
       * @param  1   bombShow                         组件状态
       * @param  2   formIndex                        组件标记
       * @param  3   invoiceInfo.invoiceType          发票类型：增值税普通发票=0，增值税专用发票=1
       * @param  4   invoiceInfo.bankName             开户银行名称
       * @param  4   invoiceInfo.accountNumber        开户银行账号
       * @param  4   invoiceInfo.identifyNumber       纳税人识别号/统一社会信用代码
       * @param  4   invoiceInfo.registerPhone        纳税登记电话
       * @param  4   invoiceInfo.registerAddress      纳税登记地址
       * @param  4   invoiceInfo.email                电子邮箱
       */
      bombShow             : false,
      formIndex            : '',
      invoiceInfo        : {
        invoiceType      : -1,
        bankName         : '',
        accountNumber    : '',
        identifyNumber   : '',
        registerPhone    : '',
        registerAddress  : '',
        email            : ''
      },

      formTemp             : {
        invoiceType        : [
          {
            name           : '增值税普通发票',
            value          : 0,
          },
          {
            name           : '增值税专用发票',
            value          : 1,
          },
        ],
      },
    };
  },
  components: {
    BombBox,
  },
  computed: {
  },
  mounted () {
    if (this.value) {
      this.visible = true;
		}
  },
  watch: {
    value (val) {
      this.visible = val;
    },
    visible (val) {
      this.$emit('input', val);
		},
  },
  methods: {

    /*
     * 保存
     */
    handleSumbit () {
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }
      self.cancel();
      self.$toast('保存成功');
      self.$emit('saveInvoice', this.invoiceInfo);
		},

    handleSave () {
      let self = this;
      self.cancel();
      self.$toast('保存成功');
      self.$emit('saveInvoice', {
        invoiceType      : 0,
      });
    },

    /*
     * 处理险种 - 底部弹框组件BombBox
     * @param  amount              是否投保   1/保额:投保  0:不投保
     * @param  notDeductible       清空投保不计免赔
     * @param  VehicleDemageIns    车辆损失险=不投保，清空前置条件后的选择
     * @param  ThirdPartyIns       第三者责任险=不投保，清空前置条件后的选择
     */
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            this.invoiceInfo.invoiceType = obj.content.value;
          }
          return;
        }
      }
    },

    /*
     * 所属组件BombBox
     */
    handleBombBoxChange (name) {
      this.formIndex  = name;
      this.bombShow   = true;
    },

    /*
     * 取消设置
     */
    cancel () {
      this.visible = false;
    },

  }
};