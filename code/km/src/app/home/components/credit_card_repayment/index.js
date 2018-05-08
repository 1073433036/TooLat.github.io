import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import CreditCardlist from '~common/components/credit_card_list';
import BankList       from '~common/components/bank_list';
import Checkbox       from '~common/components/checkbox';
import Models         from '~common/models';

export default {
  name: 'repayment',
  data () {
    return {
      isDemo    : false,
      active    : false,
      maskStatus: false,
      isPay     : false,
      isSorry   : false,
      headStatus: false,
      creditCard: false,
      bankCard  : false,
      formTemp  : {
        checked: true,
        payData: [
          {
            id: 1,
            name: '储蓄卡'
          },
          {
            id: 2,
            name: '微信'
          },
          {
            id: 3,
            name: '支付宝'
          },
        ],
        listData: [],
      },
      formData: {
        credit: {
          payIndex: 1,
          money: '',
        },
        card: {
          cardId: 1,
          cardNum: '6228480402564898888',
          username: '李华南',
          bankName: '中国银行'
        },
      },
      page: 1,
      current_page: 0,
      last_page: 0,
    };
  },
  filters: {
    payType (value) {
      let str = '';
      switch (value) {
        case 1:
          str = 'sp-pay-card';
          break;
        case 2:
          str = 'sp-pay-wechat';
          break;
        case 3:
          str = 'sp-pay-alipay';
          break;
      }
      return str;
    },

    // 取尾号4位
    sliceCard (value) {
      return value ? value.substr(value.length - 4) : value;
    },

    //截至还款期
    byBillDate (value) {
      let startDate = value.split(' ')[0].split('-');
      let nowDate = new Date().toLocaleDateString().split('/');
      let oDate1  =  new  Date(startDate[1]  +  '-'  +  startDate[2]  +  '-'  +  startDate[0]);
      let oDate2  =  new  Date(nowDate[1]  +  '-'  +  nowDate[2]  +  '-'  +  nowDate[0]);
      let iDays  =  parseInt((oDate1  -  oDate2)  /  1000  /  60  /  60  / 24);
      return 0 < iDays ? iDays : '0';
    },
  },
  components: {
    'app-header': Header,
    CreditCardlist,
    BankList,
    Checkbox
  },
  computed: {
    histData () {
      return _.get(this.$store.get.state, 'App.histData');
    }
  },
  mounted () {
    let self = this;
    let histData = this.histData;
    if (!_.isEmpty(histData) && _.isObject(histData)) {
      for (let [key, val] of Object.entries(histData)) {
        self[key] = val;
      }
    }

    this.handleScroller();
    this.list();
  },
  watch: {
    formData: {
      deep: true,
      handler () {
        this.handlePassChange();
        this.$store.get.dispatch({
          type: 'histData',
          data: this.$data,
        });
      }
    },
    'formTemp.checked' () {
      this.handlePassChange();
    }
  },
  methods: {

    list () {
      let self = this;
      Models.Bill
      .list({
        params: {
          page: self.page,
        },
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          self.formTemp.listData = data.data;
          self.current_page = data.current_page;
          self.last_page    = data.last_page;
        }
        else {
          self.loading = false;
          self.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : res.msg,
            lists : [
              {
                msg: '关闭',
              },
            ]
          });
        }
      })
      .catch(() => {
        self.loading = false;
      });
    },

    /**
      * 监测表单变化
      **/
    handlePassChange () {
      if (!_.isEmpty(this.formData.credit.cardNum) && this.$rules.money(this.formData.credit.money * 1) && 0 < this.formData.credit.money * 1 && true === this.formTemp.checked) {
        this.active = true;
      }
      else {
        this.active = false;
      }
    },

    /**
      * 选择支付方式
      **/
    handlePayChange (item, index) {
      index = index ? index + 1 : 1;
      this.formData.credit.payIndex = index;
    },

    /**
      * 和信用卡子组件通讯
      **/
    handleCreditCardClcik (obj) {
      this.headStatus = false;
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.creditCard = obj.status;
          _.assign(this.formData.credit, obj.content);
          this.handlePassChange();
          return;
        }
      }
    },

    /**
      * 重新选择信用卡
      **/
    handelChangeCredit () {
      this.creditCard = true;
      this.headStatus = true;
    },

    /**
      * 和银行卡子组件通讯
      **/
    handleBankClcik (obj) {
      this.headStatus = false;
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bankCard = obj.status;
          _.assign(this.formData.card, obj.content);
          return;
        }
      }
    },

    /**
      * 重新选择银行卡
      **/
    handelChangeBankCard () {
      this.bankCard   = true;
      this.headStatus = true;
    },

    /**
      * 选择还款
      **/
    handleRepayment (item) {
      this.maskStatus = true;
      _.assign(this.formData.credit, item);
    },

    /**
      * 我要分期
      **/
    instalment (item) {
      this.$router.push({
        name: 'home.CreditCardInstalment',
        params: {
          id: item.bank_id,
        },
      });
    },

    /**
      * 立即支付
      **/
    handlePay () {
      this.maskStatus = false;
      setTimeout(() => {
        this.isPay = true;
      }, 200);
    },

    /**
      * 付款详情返回
      **/
    handleClosePay () {
      this.isPay      = false;
      setTimeout(() => {
        this.maskStatus = true;
      }, 200);
    },

    /**
      * Scroller下拉
      * Todo
      **/
    handleScroller () {
      // let scroller = this.$refs.scroller;
      // scroller.touchMove = () => {
      // };
    },

    /**
      * 分享我的邀请
      **/
    shareInvite () {
      this.$router.push({
        name: 'user.Invite',
        // name: 'home.CreditCardShare',
      });
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.list();
        done();
      }, 1500);
    },

    infinite (done) {
      if (this.last_page <= this.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        this.page ++;
        this.list();
        done();
      }, 1500);
    },
  }
};