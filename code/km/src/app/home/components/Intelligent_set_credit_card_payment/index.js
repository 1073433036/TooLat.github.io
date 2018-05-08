import './index.scss';
import Days from '~common/components/days';
import Header from '~common/components/header';
import _ from 'lodash';
import Models         from '~common/models';
import BotSelect from '~common/components/bot_select';

export default {
  data () {
    return {
      name: 'IntelligentSetCreditCardPayment',
      showDaySelect: false,
      Active: true,
      formIndex: false,
      showCitySelect: false,
      paymentNumMax: 10,
      botTitle: '',
      cityInfo:{
        name:'',
        code:''
      },
      date2: [],
      formTemp: {
        date: [],
        city: [],
      },
      formData: {
        card_id: '',
        city_code: '',
        money: '',
        card_money: '',
        paymentNum: 20,
        // rate: '',
        date_str: '',
      },
      showBillList: false,
      cardId: {},
      billList: {},
      // 还款日
      repay_date: '',
      // 账单日
      bill_date: '',
    };
  },
  components: {
    'app-header': Header,
    Days,
    BotSelect,
  },
  filters: {
    allTime (value) {
      function  timestampToTime (timestamp) {
        let date = new Date( timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +  '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y + M + D + h + m + s;
      }
      return timestampToTime(value);
    },
    day (value) {
      return new Date(value * 1000).getDate();
    },
    time (value) {
      return new Date(value * 1000).getHours() + ':' + new Date(value * 1000).getMinutes();
    },
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    dialog () {
      return _.get(this.$store.get.state, 'Dialog') || {};
    },
    active () {
      let bool = true;
      for (let i in this.formData) {
        if (!this.formData[i]) {
          bool = false;
          break;
        }
      }
      return bool;
    },
  },
  mounted () {
    this.getConsumeArea({page: 1});
    this.showSelectAddress();
    this.getIntelligentDate();
  },
  watch: {
    /*repayment (val) {
      // this.paymentNum = parseInt(val) > 50000 ?  60 : 30;
      this.formData.money = val;
      // this.formData.rate = parseInt(val) > 16000 ?  '11%' : '6%';
    }*/
  },
  methods: {
    // 获取信用卡ID
    getCardId () {
      this.cardId = this.$store.get.state.IntelligentInfo.cardId;
      this.cityInfo =  this.$store.get.state.IntelligentInfo.cityInfo;
      this.formData.card_id = this.cardId.id;
      return this.cardId;
    },
    // 获取消费地区
    getConsumeArea (data) {
      let self = this;
      Models.Intelligent
        .consumerArea(data)
        .then(res => {
          if (res.code === 1) {
            res.data.data.forEach((item) => {
              let _item = {value: item.code, name: item.name};
              self.formTemp.city.push(_item);
            });
          }
          else {
            self.$toast(res.msg);
          }
        });
    },
    showSelectAddress () {
      let self = this;
      self.$store.get.dispatch({
        type: 'handleChangeDialog',
        customClass: 'no-foot',
        active: true,
        width: '90%',
        title: '温馨提示',
        msg: '',
        html: '<span class="selectAddress">请选择地区</span><input type="text" id="reg" class="input-city" placeholder="选择消费地区">',
        lists: [
          {
            msg: ''
          }
        ],
      });
      self.$nextTick(() => {
        let reg = document.querySelector('#reg');
        // reg.value =  self.cityInfo.name || '';
        if (self.cityInfo !== undefined) {
          reg.value =  self.cityInfo.name || '';
          self.formData.city_code = self.cityInfo.code;
        }
        // self.formData.city_code = self.cityInfo.code;
        if (reg.value.length > 0) {
          self.$store.get.dispatch({
            type: 'handleChangeDialog',
            active: false,
          });
        }
        if (reg) {
          reg.addEventListener('click', function () {
            self.$router.push({
              name: 'home.cityChoice'
            });
            return;
          });
        }
      });
    },
    handleSelectCity () {
      //cityChoice
      this.$router.push({
        name: 'home.cityChoice',
      });
      // this.formIndex = index;
      // this.showCitySelect = true;
      // if (index === 'city') {
      //   this.botTitle = '地区选择';
      // }
    },
    reduceMax () {
      let num = this.paymentNumMax;
      if (20 >= num && num > 5) {
        this.paymentNumMax--;
      }
      else {
        this.$toast('笔数可选范围为 5-20');
      }
    },
    addMax () {
      let self = this;
      let num = this.paymentNumMax;
      if (20 > num && num >= 5) {
        self.paymentNumMax++;
      }
      else {
        this.$toast('笔数可选范围为 5-20');
      }
    },
    reduce () {
      let num = parseInt(this.formData.paymentNum);
      if (61 > num && num > 10) {
        this.formData.paymentNum -= 2;
      }
      else {
        this.$toast('笔数可选范围为 10-60');
      }
    },
    add () {
      let num = parseInt(this.formData.paymentNum);
      if (60 > num && num > 9) {
        this.formData.paymentNum += 2;
      }
      else {
        this.$toast('笔数可选范围为 10-60');
      }
    },
    // 获取消费日期
    async getIntelligentDate () {
      let self = this;
      let data = await this.getCardId();
      Models.Intelligent
        .consumeDate(data)
        .then(res => {
          if (res.code === 0) {
            self.$toast(res.msg);
            setTimeout(() => {
              self.$router.push({
                name: 'home.intelligentCreditCardManager',
              });
            }, 1000);
          }
          else {
            self.formTemp.date = res.data;
          }
        });
    },
    // 日期选择
    handleDateChange () {
      this.showDaySelect = true;
    },
    // 日期组件回调
    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.showDaySelect = obj.status;
          if (!_.isEmpty(obj.content)) {
            this.date2 = obj.content;
            this.date2.sort();
            this.formData.date_str = this.date2.join(',');
          }
          return;
        }
      }
    },
    pushOrder () {
      let self = this;
      let totalMoney = this.billList.main_order.money_withdraw;
      let data = {token: self.billList.token};
      self.$store.get.dispatch({
        type: 'handleChangeDialog',
        CustomClass: 'show-foot',
        active: true,
        width: '90%',
        title: '温馨提示',
        msg: '',
        html: `执行此计划共需<span class="red">¥${totalMoney}</span>元，请保证此卡金额充足`,
        lists: [
          {
            msg: '否'
          },
          {
            msg: '是',
            func () {
              Models.Intelligent
                .confirmPlan(data)
                .then(res => {
                  self.$toast(res.msg);
                  if (res.code === 1) {
                    setTimeout(() => {
                      self.$router.push({
                        name: 'home.intelligentCreditCardManager',
                      });
                    }, 100);
                  }
                });
            }
          },
        ],
      });
    },
    next () {
      let self = this;
      // let _data = {
      //   paymentNum: this.formData.paymentNum,
      //   paymentNumMax: this.paymentNumMax
      // };
      // let data = _.assign({}, this.formData, _data);
      if (!this.active) {
        self.$toast('未填完资料，请先填完再点击按钮');
        return;
      }

      // 判断用户输入弹提示框
      let rate = this.formData.card_money / this.formData.money * 100;
      // 还款日
      this.repay_date = this.cardId.repay_date;
      // 账单日
      this.bill_date = this.cardId.bill_date;
      let currentDate = new Date().getDate();
      // 计算还款日账单日
      let year = new Date().getFullYear();
      let month = new Date().getMonth();
      if (month === 0) {
        month = 12;
        year = year - 1;
      }
      let lastDate = new Date(year, month, 0).getDate();
      if (this.repay_date < this.bill_date) {
        this.bill_date = this.bill_date - lastDate;
      }
      if (currentDate > this.repay_date) {
        this.repay_date = this.repay_date + new Date(year, month + 1, 0).getDate();
      }
      console.log(this.repay_date, this.bill_date, currentDate, lastDate);
      if (rate < 6) {
        self.$store.get.dispatch({
          type: 'handleChangeDialog',
          customClass: '',
          active: true,
          width: '90%',
          title: '温馨提示',
          msg: '由于您的预留资金低于6%，无法生成代还计划，请您适当的增加预留资金，以便更好的完善您的代还计划。在计划执行期间，确保卡内余额充足，不产生自动扣款、临时额度到期、年费扣款、某些业务代扣等等，否则将无法正常执行计划，由此导致的后果由客户自行承担。',
          html: '',
          lists: [
            {
              msg: '确定'
            }
          ],
        });
        return;
      }
      if (this.repay_date - currentDate <= 3) {
        self.$store.get.dispatch({
          type: 'handleChangeDialog',
          customClass: '',
          active: true,
          width: '90%',
          title: '温馨提示',
          msg: '您的还款日即将到期，代还计划将无法正常全额还款，建议您可以向银行申请分期或先手动还款，感谢您的理解！',
          html: '',
          lists: [
            {
              msg: '确定'
            }
          ],
        });
        return;
      }
      if (currentDate < this.bill_date) {
        self.$store.get.dispatch({
          type: 'handleChangeDialog',
          customClass: '',
          active: true,
          width: '90%',
          title: '温馨提示',
          msg: ' 您的账单尚未生成，暂时无法添加生成代还计划，请您在账单日后一天添加制定计划，祝您用卡愉快！',
          html: '',
          lists: [
            {
              msg: '确定'
            }
          ],
        });
        return;
      }
      if (this.formData.money >= 10000 && this.formData.money <= 30000 && rate < 15) {
        // self.formData.paymentNum = formData.paymentNum;
        self.$store.get.dispatch({
          type: 'handleChangeDialog',
          customClass: '',
          active: true,
          width: '90%',
          title: '温馨提示',
          msg: '为了更好的优化您的账单，根据您卡片的实际情况，建议您的刷卡笔数30笔以上，否则将会消费一笔还款一笔，导致卡容易被银行风控。合理的模拟真实消费，将更有助于你优化您的信用卡账单。',
          html: '',
          lists: [
            {
              msg: '确定'
            }
          ],
        });
      }
      if (this.formData.money >= 30000 && this.formData.money <= 60000 && rate < 20) {
        // self.formData.paymentNum = 60;
        self.$store.get.dispatch({
          type: 'handleChangeDialog',
          customClass: '',
          active: true,
          width: '90%',
          title: '温馨提示',
          msg: '您的信用卡额度比较高，您是银行比较优质的客户，消费能力比较强，根据您卡片的实际情况，建议您的刷卡笔数60笔以上，否则将会消费一笔，还款一笔，导致卡容易被银行风控。合理的模拟真实消费，将更有助于你优化您的信用卡账单。',
          html: '',
          lists: [
            {
              msg: '确定'
            }
          ],
        });
      }
      if (this.formData.money >= 60001) {
        self.formData.paymentNum = 100;
        self.$store.get.dispatch({
          type: 'handleChangeDialog',
          customClass: '',
          active: true,
          width: '90%',
          title: '温馨提示',
          msg: '您的信用卡额度比较高，您是银行比较优质的客户，消费能力比较强，根据您卡片的实际情况，建议您的刷卡笔数60笔以上，否则将会消费一笔，还款一笔，导致卡容易被银行风控。合理的模拟真实消费，将更有助于你优化您的信用卡账单。',
          html: '',
          lists: [
            {
              msg: '确定'
            }
          ],
        });
      }
      if (6 >= this.repay_date - currentDate >= 4) {
        self.$store.get.dispatch({
          type: 'handleChangeDialog',
          customClass: '',
          active: true,
          width: '90%',
          title: '温馨提示',
          msg: '由于您离还款日时间很短了，请您将卡内的预留资金留20%以上，否则可能会导致同一天内6笔以上的多笔消费，对您的卡片不好。同时建议您在计划执行期间，确保卡内余额充足，不产生自动扣款、临时额度到期、年费扣款、某些业务代扣等等，否则将无法正常执行计划，由此导致的后果由客户自行承担。',
          html: '',
          lists: [
            {
              msg: '确定',
              func () {}
            }
          ],
        });
        if (rate > 20) {
          self.nextPush();
        }
        return;
      }
      self.nextPush();
    },
    nextPush () {
      let data = _.assign({}, this.formData);
      let self = this;
      Models.Intelligent
        .submitPlan(data)
        .then(res => {
          if (res.code === 0) {
            self.billList = {};
            self.$toast(res.msg);
          }
          else {
            self.billList = res.data;
            self.paymentNumMax = res.data.payment_num_max;
            this.showBillList = true;
          }
        });
    },
    // 重置计划
    resetPlan () {
      // this.repayment = '';
      this.date2 = '';
      this.formData.money = '';
      this.formData.card_money = '';
      this.formData.date_str = '';
      this.showBillList = false;
    },
  },
};
