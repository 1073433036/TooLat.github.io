import './index.scss';

import _          		from 'lodash';
import Header     		from '~common/components/header';
import Radio          from '~common/components/radio';
import BotSelect      from '~common/components/bot_select';
import CityList       from '~common/components/city_list';
import Models         from '~common/models';

export default {
  name: 'loan_loans',
  data () {
    return {
			loading: false,
      active : false,
      /*
       * @param name string 姓名
       * @param company string 所在单位
       * @param phone int 电话号码
       * @param age int 年龄
       * @param amount float 贷款金额（单位：万元）
       * @param repay_date_limit int 还款期限、还款期数（数字）
       * @param house_size float 房屋面积
       * @param house_city_id int 房屋所在城市id
       * @param house_city string 房屋所在城市
       * @param house_price float 房屋价值
       * @param car_ts string 汽车型号
       * @param car_price float 汽车价值
       * @param car_year int 汽车使用年限
       * @param is_ss int 是否有社保 0-无，1-有
       * @param has_public_fund int 是否有公积金 0-无，1-有
       * @param has_fp int 是否有理财产品 0-无，1-有
       */
			formData: {
        name             : '',
        company          : '',
        phone            : '',
        age              : '',
        amount           : '',
        repay_date_limit : '',
        house            : 0,
        house_size       : '',
        house_price      : '',
        car              : 0,
        car_ts           : '',
        car_price        : '',
        car_year         : '',
        is_ss            : '',
        has_public_fund  : '',
        has_fp           : '',
      },
      formTemp: {
        house: [
          {
            name: '否',
            value: 0,
          },
          {
            name: '是',
            value: 1,
          },
        ],
        car: [
          {
            name: '否',
            value: 0,
          },
          {
            name: '是',
            value: 1,
          },
        ],
        is_ss: [
          {
            name: '否',
            value: 0,
          },
          {
            name: '是',
            value: 1,
          },
        ],
        has_public_fund: [
          {
            name: '否',
            value: 0,
          },
          {
            name: '是',
            value: 1,
          },
        ],
        has_fp: [
          {
            name: '否',
            value: 0,
          },
          {
            name: '是',
            value: 1,
          },
        ],
        repay_date_limit: [
          {
            name: '6期',
            value: 6,
          },
          {
            name: '12期',
            value: 12,
          },
          {
            name: '24期',
            value: 24,
          },
          {
            name: '36期',
            value: 36,
          },
          {
            name: '48期',
            value: 48,
          },
        ],
      },
      isShow: false,
      formIndex: '',
    };
  },
  components: {
    'app-header': Header,
		BotSelect,
		CityList,
    Radio,
  },
  computed: {
    city () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
    },
	},
  mounted () {
  },
  watch: {
    formData: {
      deep: true,
      handler () {
        this.handlePassChange();
      }
    },
  },
  methods: {
		descInput () {
			if (100 < this.formData.amount) {
				this.formData.amount = 100;
			}
		},

    // 监测必填字段是否已填写
    handlePassChange () {
      /*let flag = this.formData.is_ss || this.formData.has_fp || this.formData.has_public_fund;
      (this.formData.house || this.formData.car || flag)*/
      if (!_.isEmpty(this.formData.name) && !_.isEmpty(this.formData.company) && !_.isEmpty(this.formData.phone) && !_.isEmpty(this.formData.age) && !_.isEmpty(this.formData.amount) && !_.isEmpty(this.formData.repay_date_limit)) {
        this.active = true;
      }
      else {
        this.active = false;
      }
    },

    // 底部弹框组件1
		botSelectClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
              _.assign(this.formData, {
                [this.formIndex]: obj.content
              });
          }
          return;
        }
      }
		},

    // 所属组件1
    handleBotSelectChange (index) {
      this.formIndex = index;
      this.isShow = true;
    },

		// 城市切换
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
		},

    // 提交申请资料
    handleSumbit () {
      let self = this;

      let tips = self.$validator(self.$refs.form);
      if (0 !== tips.code) {
        self.$toast(tips.data.msg);
        return;
      }

      let flag = this.formData.is_ss && this.formData.has_public_fund || this.formData.is_ss && this.formData.has_fp || this.formData.has_public_fund && this.formData.has_fp;
      let state = this.formData.house || this.formData.car || flag;
      if (!state) {
        this.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '您的资质不符合要求，暂时不符合办理大额贷款的条件，请您以后再次申请',
          lists : [
            {
              msg: '我知道了',
              class: 'ok',
            },
          ]
        });
        return;
      }

      if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }

      self.loading = true;

      let data = {
        name             : self.formData.name,
        company          : self.formData.company,
        phone            : self.formData.phone,
        age              : self.formData.age,
        amount           : self.formData.amount,
        repay_date_limit : self.formData.repay_date_limit.value,
        house_size       : self.formData.house_size,
        house_city_id    : self.city.region_id,
        house_city       : self.city.region_name,
        house_price      : self.formData.house_price,
        car_ts           : self.formData.car_ts,
        car_price        : self.formData.car_price,
        car_year         : self.formData.car_year,
        is_ss            : self.formData.is_ss,
        has_public_fund  : self.formData.has_public_fund,
        has_fp           : self.formData.has_fp,
      };

      Models.Task
      .mortgage(data)
      .then((res) => {
        self.$toast(res.msg);
        if (1 !== res.code) {
          self.loading = false;
          return;
        }
        setTimeout(() => {
          let route = { name: 'home.LoanSucceed', params: {id: res.data.id} };
          self.$router.push(route);
        }, 2000);
      })
      .catch(() => {
        self.loading = false;
      });
		},
  },
};