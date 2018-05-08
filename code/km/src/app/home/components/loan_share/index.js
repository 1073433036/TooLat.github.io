import './index.scss';

import                'pinyin4js';
import TWEEN          from '@tweenjs/tween.js';
import _              from 'lodash';
import Echarts        from 'echarts';
import BombBox        from '~common/components/bomb_box';
import Models         from '~common/models';
import LocalStorage   from '~common/services/localStorage.cookie';

export default {
  name: 'loanShare',
  data () {
    return {
      myChart             : '',
      active              : false,
      bombShow            : false,
      isApply             : false,
      isShowForm          : false,
      formIndex           : '',
      formData            : {
        name              : '',
        identity          : '',
        mobile            : '',
        education         : {},
        socialSecurity    : {},
        vehicle           : {},
        work              : {},
      },
      formTemp            : {
        education         : [
          {
            name          : '大专以下',
            value         : 1,
          },
          {
            name          : '大专',
            value         : 2,
          },
          {
            name          : '本科',
            value         : 3,
          },
          {
            name          : '本科以上',
            value         : 4,
          },
        ],
        socialSecurity    : [
          {
            name          : '有社保',
            value         : 1,
          },
          {
            name          : '无社保',
            value         : 2,
          },
        ],
        vehicle           : [
          {
            name          : '有车',
            value         : 1,
          },
          {
            name          : '无车',
            value         : 2,
          },
        ],
        work              : [
          {
            name          : '普通员工',
            value         : 1,
          },
          {
            name          : '部门主管',
            value         : 2,
          },
          {
            name          : '经理',
            value         : 3,
          },
          {
            name          : '企业主',
            value         : 4,
          },
        ],
        loanTerm          : [
          {
            name          : '3个月',
            value         : 3,
          },
          {
            name          : '6个月',
            value         : 6,
          },
          {
            name          : '12个月',
            value         : 12,
          },
        ],
      },
      loanTerm            : {
        name              : '12个月',
        value             : 12,
      },
      weatherData         : '',
      detail              : {},
      loanInfo            : {
        loanAmount        : '',
        monthPay          : '',
        interest          : '',
        total             : '',
      },
    };
  },
  components: {
    BombBox,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    loanId () {
      return this.$route.query.loan_id;
    },
  },
  mounted () {
    this.handleWeather();
    this.getDetail();
  },
  watch: {
  },
  filters: {
    pinyin (value) {
      /* eslint-disable */
      let data = PinyinHelper.convertToPinyinString(value, '', PinyinFormat.WITHOUT_TONE);
      return data.toLowerCase();
      /* eslint-enable */
    },
  },
  methods: {
    //申请步骤
    isStep () {
      this.$router.push({
        name: 'home.LoanDetailDesc',
      });
    },

    init (amount, interest) {
      let option = {
        series: [
          {
            type:'pie',
            radius: ['45%', '75%'],
            label: {
              normal: {
                position: 'center'
              },
            },
            color: ['#1787f6', '#ec762b'],
            data:[
              {
                value: amount,
                itemStyle: {
                  normal: {
                    color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0, color: '#1b8df6',
                      },
                      {
                        offset: 1, color: '#2ca9f3',
                      }
                    ], false)
                  }
                }
              },
              {
                value: interest,
                itemStyle: {
                  normal: {
                    color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0, color: '#ec561f',
                      },
                      {
                        offset: 1, color: '#ecb33f',
                      }
                    ], false)
                  }
                }
              },
            ]
          }
        ]
      };
      this.$nextTick(() => {
        this.myChart = Echarts.init(this.$refs.canvas);
        this.myChart.setOption(option);
      });
    },

    handleSumbit () {

      if (!this.formData.name) {
        this.$toast('请输入姓名');
        this.$refs.name.focus();
        return;
      }

      if (!this.formData.identity) {
        this.$toast('请输入身份证');
        this.$refs.identity.focus();
        return;
      }
      else if (true !== this.$rules.identity(this.formData.identity)) {
        this.$toast('请输入正确的身份证');
        this.$refs.identity.focus();
        return;
      }

      if (!this.formData.mobile) {
        this.$toast('请输入手机号码');
        this.$refs.mobile.focus();
        return;
      }
      else if (true !== this.$rules.phone(this.formData.mobile)) {
        this.$toast('请输入正确的手机号码');
        this.$refs.mobile.focus();
        return;
      }

      if (!this.formData.education.value) {
        this.$toast('请选择教育程度');
        return;
      }

      if (!this.formData.socialSecurity.value) {
        this.$toast('请选择是否缴纳社保');
        return;
      }

      if (!this.formData.vehicle.value) {
        this.$toast('请选择车辆信息');
        return;
      }

      if (!this.formData.work.value) {
        this.$toast('请选择职业信息');
        return;
      }

      /*
       * @param lender_id int 信贷机构id
       * @param deadline string 贷款期限
       * @param user_true_name string 姓名
       * @param user_card string 身份证号码
       * @param mobile string 手机号码
       * @param education int 教育程度
       * @param work int 职业信息
       * @param social_security int 是否缴纳社保
       * @param vehicle int 是否有车
       */

      let data = {
        lender_id: this.loanId * 1,
        deadline: this.loanTerm.value + '',
        user_true_name: this.formData.name,
        user_card: this.formData.identity,
        mobile: this.formData.mobile,
        education: this.formData.education.value,
        work: this.formData.work.value,
        social_security: this.formData.socialSecurity.value,
        vehicle: this.formData.vehicle.value,
      };

      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '正在预测，请稍等...',
      });

      Models.Lender
      .shareApply({
        params: data
      })
      .then((res) => {

        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        this.isShowForm = false;

        if (1 === res.code) {
          this.loanInfo.loanAmount = res.data.loan_limit * 1;
          let amout = res.data.loan_limit * 1;
          this.loanInfo.loanAmount = this.animatedNum(0, amout, 'loanAmount');
          this.calcInterest(amout);

          this.$toast(`您预测额度为${amout}元`);
          this.$refs.myScroller.scrollTo(0, 0, true);
        }
        else {
          this.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : res.msg,
            lists : [
              {
                msg: '确定'
              },
            ]
          });
        }
      })
      .catch(() => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        this.isShowForm = false;
      });
    },

    calcInterest (value) {
      let monthPay = (value / this.loanTerm.value + value * this.detail.daily_interest / 100 * 30).toFixed(2);
      let interest = value * this.detail.daily_interest * 30 * this.loanTerm.value / 100;
      let total = value * 1 + interest * 1;
      this.animatedNum(0, monthPay, 'monthPay');
      this.animatedNum(0, interest, 'interest');
      this.animatedNum(0, total, 'total');
      this.init(value, interest);
    },

    /*
     * 底部弹框组件2
     */
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {

            if ('loanTerm' === this.formIndex) {
              this.loanTerm = obj.content;
              let amout = this.loanInfo.loanAmount;
              this.loanInfo.loanAmount = this.animatedNum(0, amout, 'loanAmount');
              this.calcInterest(amout);
              return;
            }

            _.assign(this.formData, {
              [this.formIndex]: obj.content,
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
     * 获取天气预报信息
     */
    handleWeather () {
      let data  = LocalStorage.get('home.Weather');

      let date  = new Date();
      let year  = date.getFullYear();
      let month = date.getMonth() + 1;
      let day   = date.getDate();

      let Time  = parseInt(new Date(`${year}-${month}-${day}`) / 1000);

      if (_.isEmpty(data.data) || !_.isEmpty(_.get(data, 'data.date')) && new Date(_.get(data, 'data.date')).getTime() / 1000 < Time) {
        Models.Home
        .weather()
        .then((res) => {
          if (1 === res.code) {
            LocalStorage.set('home.Weather', res.data, 60 * 60 * 24);
            this.weatherData = res.data;
          }
        });
      }
      else {
        this.weatherData = data.data;
      }
    },

    /*
     * 数字滚动
     */
    animatedNum (start = 0, value = 100, formIndex, time = 1500) {

      let self = this;
      let objNum = { tweenNum: start };
      let tween = new TWEEN.Tween(objNum);
      tween.to({ tweenNum: value * 1 }, time)
      .onUpdate(function () {
        self.loanInfo[formIndex] = objNum.tweenNum.toFixed(2);
      })
      .start();

      function animate () {
        requestAnimationFrame(animate);
        TWEEN.update();
      }
      animate();
    },

    /*
     * 获取贷款信息
     */
    getDetail () {
      Models.Lender
      .show({
        params: {
          id: this.loanId,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data      = res.data;
          let amout     = 50000 || data.min_quota * 1;
          this.detail = _.assign({}, this.detail, data);

          this.loanInfo.loanAmount = this.animatedNum(0, amout, 'loanAmount');
          this.calcInterest(amout);

          this.$store.get.dispatch({
            type: 'histData',
            data: {
              loanShareData: {
                loanId: this.loanId,
                name: data.name,
                logo: data.thumb,
              }
            },
          });
          document.title = data.name || '贷款额度预测';
        }
        else {
          this.loanInfo.loanAmount = this.animatedNum(0, 50000, 'loanAmount');
          this.calcInterest(50000);
        }
      })
      .catch(() => {
        this.loanInfo.loanAmount = this.animatedNum(0, 50000, 'loanAmount');
        this.calcInterest(50000);
      });
    },

  }
};