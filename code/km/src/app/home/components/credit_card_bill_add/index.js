import './index.scss';

import _        from 'lodash';
import Header   from '~common/components/header';
import Banks    from '~common/components/banks';
import Day    	from './components/day';
import Dates    from '~common/components/dates';
import Models   from '~common/models';

export default {
  name: 'creditCard',
  data () {
    return {
      formData: {
        cardId  : '',
        bankName: '',
        cardNum : '',
        userName: '',
        money   : '',
        billMoney: '',
        repayMoney: '',
        orderDay: '',
        repayTime: '',
        freeDays: '',
      },
      isOpen: false,
      formTemp: {

      },
      active: false,
      changeSelect: false
    };
  },
  components: {
    'app-header': Header,
    Banks,
    Day,
    Dates,
  },
  computed: {
    bankName () {
      return _.get(this.$store.get.state, 'Banks.content.data.name');
    },
    cardId () {
      return _.get(this.$store.get.state, 'Banks.content.data.id');
    },
  },
  mounted () {
  },
  watch: {
    formData: {
      deep: true,
      handler () {
        this.handlePassChange();
        this.getDiff();
      }
    },

    bankName () {
      this.formData = _.assign({}, this.formData, {
        bankName: this.bankName,
      });
    },

    cardId () {
      this.formData = _.assign({}, this.formData, {
        cardId: this.cardId,
      });
    }
  },
  methods: {

    /**
      * 选择发卡银行
      **/
    chnageBank () {
      // this.changeSelect = true;
      this.$store.get.dispatch({
        type  : 'bankData',
        isShow: true
      });
    },

    /**
      * 监测表单变化
      **/
    handlePassChange () {
      this.active = true;
      for (let i in this.formData) {
        if (0 >= this.formData[i].length) {
          this.active = false;
          break;
        }
      }
    },

    /**
      * 下一步
      **/
    handleSumbit () {
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }

      /**
        * @param account_no     stirng  卡号
        * @param account_name   stirng  姓名
        * @param bank_id        int     银行id
        * @param quota          float   额度
        * @param bill_amount    float   账单金额
        * @param repay_amount   float   还款金额
        * @param bill_date      stirng  账单日
        * @param repay_date     stirng  还款日
        * @param free_days      int     免息期
       */
      let obj = {
        account_no:  self.formData.cardNum,
        account_name: self.formData.userName,
        bank_id: self.formData.cardId,
        quota: self.formData.money,
        bill_amount: self.formData.billMoney,
        repay_amount: self.formData.repayMoney,
        bill_date: self.formData.orderDay,
        repay_date: self.formData.repayTime,
        free_days: self.formData.freeDays,
      };

      Models.Bill
      .create(obj)
      .then((res) => {
        if (1 === res.code) {
          self.$toast(res.msg || '添加成功');
          setTimeout(() => {
            let route = { name: 'home.CreditCardRepayment' };
            let routeQuery = _.get(self.$route, 'query.dt');
            try {
              route = JSON.parse(routeQuery);
            }
            catch (err) {
              route = {
                name: 'home.CreditCardRepayment'
              };
            }
            self.$router.push(route);
          }, 2000);
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
      * 日期组件
      **/
    handleDays (item) {
      this.isOpen = true;
      this.formTemp.key = item;
    },

    handleChangeDay (msg) {
      this.isOpen = msg.status || false;
      _.assign(this.formData, msg.content);
    },

    // 信用卡改变
    handleCardNumChange () {
      if (true !== this.$rules.bank(this.formData.cardNum)) {
        this.$toast('请输入正确的信用卡卡号');
        return;
      }
    },

    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isOpen = obj.status;
          _.assign(this.formData, {
            [this.formTemp.key]: obj.content
          });
          return;
        }
      }
    },

    /**
      * 计算两个日期的差
      * @param sDate1     Date  2017-12-16
      * @param sDate2     Date  2018-1-9
      **/
    dateDiff (sDate1,  sDate2) {
      let  aDate,  oDate1,  oDate2,  iDays;
      aDate  =  sDate1.split('-');
      oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
      aDate  =  sDate2.split('-');
      oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
      iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  / 24);
      return  iDays;
    },

    /**
      * 计算免息期
      **/
    getDiff () {
      let self = this;
      if (self.formData.orderDay && self.formData.repayTime) {
        self.formData.freeDays = self.dateDiff(self.formData.orderDay, self.formData.repayTime);
      }
    },
  }
};