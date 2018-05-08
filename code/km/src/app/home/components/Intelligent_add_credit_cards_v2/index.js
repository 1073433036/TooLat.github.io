import './index.scss';
import Header           from '~common/components/header';
import phoneCode        from '~common/components/phone_code';
import BotSelect     from '~common/components/bot_select';
import _                  from 'lodash';
import Models   from '~common/models';
export default {
  data () {
    return {
      name: 'IntelligentAddCreditCards',
      formIndex: false,
      botTitle: '',
      isBankList:false,
      Show: false,
      ischeckSms:false,
      formDta: {
        cvn2: '',
        validity: '',
        phone: '',
        // imgcode: '',
        code: '',
        bank_list:{},
        due_date:{},
        bill_date:{}
      },
      formTemp : {
        bank_list:{},
        bill_date : [
          {
            id : 1,
            name     : '每月1日',
            value    : '01'
          },
          {
            id : 2,
            name     : '每月2日',
            value    : '02',
          },
          {
            id : 3,
            name     : '每月3日',
            value    : '03',
          },
          {
            id : 4,
            name     : '每月4日',
            value    : '04',
          },
          {
            id : 5,
            name     : '每月5日',
            value    : '05',
          },
          {
            id : 6,
            name     : '每月6日',
            value    : '06',
          },
          {
            id : 7,
            name     : '每月7日',
            value    : '07',
          },
          {
            id : 8,
            name     : '每月8日',
            value    : '08',
          },
          {
            id : 9,
            name     : '每月9日',
            value    : '09',
          },
          {
            id : 10,
            name     : '每月10日',
            value    : '10',
          },
          {
            id : 11,
            name     : '每月11日',
            value    : '11',
          },
          {
            id : 12,
            name     : '每月12日',
            value    : '12',
          },
          {
            id : 13,
            name     : '每月13日',
            value    : '13',
          },
          {
            id : 14,
            name     : '每月14日',
            value    : '14',
          },
          {
            id : 15,
            name     : '每月15日',
            value    : '15',
          },
          {
            id : 16,
            name     : '每月16日',
            value    : '16',
          },
          {
            id : 17,
            name     : '每月17日',
            value    : '17',
          },
          {
            id : 18,
            name     : '每月18日',
            value    : '18',
          },
          {
            id : 19,
            name     : '每月19日',
            value    : '19',
          },
          {
            id : 20,
            name     : '每月20日',
            value    : '20',
          },
          {
            id : 21,
            name     : '每月21日',
            value    : '21',
          },
          {
            id : 22,
            name     : '每月22日',
            value    : '22',
          },
          {
            id : 23,
            name     : '每月23日',
            value    : '23',
          },
          {
            id : 24,
            name     : '每月24日',
            value    : '24',
          },
          {
            id : 25,
            name     : '每月25日',
            value    : '25',
          },
          {
            id : 26,
            name     : '每月26日',
            value    : '26',
          },
          {
            id : 27,
            name     : '每月27日',
            value    : '27',
          },
          {
            id : 28,
            name     : '每月28日',
            value    : '28',
          },
          {
            id : 29,
            name     : '每月29日',
            value    : '29',
          },
          {
            id : 30,
            name     : '每月30日',
            value    : '30',
          },
          {
            id : 31,
            name     : '每月31日',
            value    : '31',
          },
        ],
        due_date : [
          {
            id : 1,
            name     : '每月1日',
            value    : '01'
          },
          {
            id : 2,
            name     : '每月2日',
            value    : '02',
          },
          {
            id : 3,
            name     : '每月3日',
            value    : '03',
          },
          {
            id : 4,
            name     : '每月4日',
            value    : '04',
          },
          {
            id : 5,
            name     : '每月5日',
            value    : '05',
          },
          {
            id : 6,
            name     : '每月6日',
            value    : '06',
          },
          {
            id : 7,
            name     : '每月7日',
            value    : '07',
          },
          {
            id : 8,
            name     : '每月8日',
            value    : '08',
          },
          {
            id : 9,
            name     : '每月9日',
            value    : '09',
          },
          {
            id : 10,
            name     : '每月10日',
            value    : '10',
          },
          {
            id : 11,
            name     : '每月11日',
            value    : '11',
          },
          {
            id : 12,
            name     : '每月12日',
            value    : '12',
          },
          {
            id : 13,
            name     : '每月13日',
            value    : '13',
          },
          {
            id : 14,
            name     : '每月14日',
            value    : '14',
          },
          {
            id : 15,
            name     : '每月15日',
            value    : '15',
          },
          {
            id : 16,
            name     : '每月16日',
            value    : '16',
          },
          {
            id : 17,
            name     : '每月17日',
            value    : '17',
          },
          {
            id : 18,
            name     : '每月18日',
            value    : '18',
          },
          {
            id : 19,
            name     : '每月19日',
            value    : '19',
          },
          {
            id : 20,
            name     : '每月20日',
            value    : '20',
          },
          {
            id : 21,
            name     : '每月21日',
            value    : '21',
          },
          {
            id : 22,
            name     : '每月22日',
            value    : '22',
          },
          {
            id : 23,
            name     : '每月23日',
            value    : '23',
          },
          {
            id : 24,
            name     : '每月24日',
            value    : '24',
          },
          {
            id : 25,
            name     : '每月25日',
            value    : '25',
          },
          {
            id : 26,
            name     : '每月26日',
            value    : '26',
          },
          {
            id : 27,
            name     : '每月27日',
            value    : '27',
          },
          {
            id : 28,
            name     : '每月28日',
            value    : '28',
          },
          {
            id : 29,
            name     : '每月29日',
            value    : '29',
          },
          {
            id : 30,
            name     : '每月30日',
            value    : '30',
          },
          {
            id : 31,
            name     : '每月31日',
            value    : '31',
          },
        ],
      },
    };
  },
  components: {
     'app-header': Header,
     phoneCode,
     BotSelect
  },
  computed: {
    active () {
      let bool = true;
      for (let i in this.formDta) {
        if (!this.formDta[i]) {
          bool = false;
          break;
        }
      }
      return bool;
    }
  },
  mounted () {
    this.getParams();
    this.getBankList();
  },
  watch: {
  },
  methods: {
    getParams () {
      this.formDta.name = this.$route.params.name;
      this.formDta.id_number = this.$route.params.id_number;
      this.formDta.card_code = this.$route.params.card_code;
    },
    getBankList () {
      let self = this;
      Models.Intelligent
        .bankList()
        .then((res) => {
          self.formTemp.bank_list = res.data.data;
        });
    },
    // 设置账单日
    botSelectClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.Show = obj.status;
          this.isBankList = false;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.formDta, {
              [this.formIndex]: {
                name : obj.content.name || obj.content.bank_name,
                value : obj.content.value || obj.content.id,
                bank_name : obj.content.bank_name || obj.content.name,
                id : obj.content.id || obj.content.value,
              }
            });
          }
          return;
        }
      }
    },
    // 设置账单日
    handleBotSelectChange (index) {
      this.formIndex  = index;
      this.Show     = true;
      if ( index === 'bill_date' ) {
        this.isBankList = false;
        this.botTitle = '设置账单日';
      }
      if ( index === 'due_date' ) {
        this.isBankList = false;
        this.botTitle = '设置还款日';
      }
      if ( index === 'bank_list' ) {
        this.isBankList = true;
        this.botTitle = '设置开户行';
      }
    },
    async next () {
      /* eslint-disable */
      // const identity =/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      // const credit =/^([1-9]{1})(\d{14}|\d{18})$/;

      // if (!identity.test(this.userInfo.identity)) {
      //      this.$toast('身份在格式错误');
      //      return;
      //    }
      //    else if (!credit.test(this.userInfo.cardNumber)) {
      //      this.$toast('信用卡格式错误');
      //      return;
      //    }
      //    else {
      // checkSms
      let self = this;
      
      let checkSmsData = {
        phone:self.formDta.phone,
        code:self.formDta.code
      }
      Models.Intelligent
        .checkSms(checkSmsData)
        .then((res) => {
          if (res.code == 1) {
            postData();
          }else{
            self.$toast(res.msg);
          }
        });
      
      function postData() {
          let cardData ={
            name : self.formDta.name,//用户名
            card_code : self.formDta.card_code ,// 银行卡号
            id_number : self.formDta.id_number,// 身份证
            bank_id : self.formDta.bank_list.id, // 银行ID（从银行列表接口获取）
            cvn2 : self.formDta.cvn2, //  cvn2
            card_date : self.formDta.validity, //  银行卡有效期
            phone : self.formDta.phone, //  手机号
            verification_code : self.formDta.code, //  验证码
            bill_date : self.formDta.bill_date.value, //  还款日
            repay_date : self.formDta.due_date.value, //  账单日
          }
          Models.Intelligent
            .cardOpen(cardData)
            .then((res) => {
              if (res.code == 1) {
                self.$store.get.dispatch({
                  type  : 'handleChangeDialog',
                  active: true,
                  width: '90%',
                  title: '温馨提示',
                  msg   : '信用卡绑定成功',
                  html  : '',
                  lists : [
                    {
                      msg: '确定',
                      func () {
                        self.$router.push({
                          name: 'home.intelligentCreditCardManager',
                        });
                      }
                    },
                  ]
                })
              }else{
                self.$toast(res.msg);
              }
            });
          
      }
     
;

      //    }
         /* eslint-enable */
    }
  }
};
