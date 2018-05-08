import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import Radio      from '~common/components/radio';
import BotSelect  from '~common/components/bot_select';
import BombBox    from '~common/components/bomb_box';
import CityList   from '~common/components/city_list';
import Cropper    from '~common/components/cropper';
import Models     from '~common/models';

export default {
  name: 'taskAdd',
  data () {
    return {
      active: false,
      /**
        * @param name string 姓名
        * @param company string 所在单位
        * @param phone int 电话号码
        * @param age int 年龄
        * @param amount float 贷款金额
        * @param repay_date_limit int 还款期限、还款期数（数字）
        */
      /**
        * @param is_marry int 是否已婚 0-否，1-是
        * @param city_id int 城市id（对应：通用-地区列表）
        * @param city_name string 城市名称
        * @param company_type int 公司性质，1-普通，2-国企，3-外企
        * @param work_age int 工龄
        * @param salary float 薪资金额
        * @param public_fund_age int 公积金年限
        * @param ss_card string 社保卡照片            (对应：通用-上传base64图片返回的url字段)
        * @param driving_license string 行驶证       (对应：通用-上传base64图片返回的url字段)
        * @param family_assets string 房产证         (对应：通用-上传base64图片返回的url字段)
        * @param public_bill string 公共事业缴费单    (对应：通用-上传base64图片返回的url字段)
        * @param salary_get_type int 工资发放形式，1-银行转账，2-现金
        * @param phone_name_list string 手机通讯录   //经和UI沟通去掉此项
        */
      formData: {
        name               : '',
        company            : '',
        phone              : '',
        age                : '',
        amount             : '',
        repay_date_limit   : '',
        is_marry           : 0,
        company_type       : {},
        work_age           : '',
        salary             : '',
        public_fund_age    : '',
        ss_card            : '',
        driving_license    : '',
        family_assets      : '',
        public_bill        : '',
        salary_get_type    : '',
      },
      formTemp: {
        is_marry: [
          {
            name: '未婚',
            value: 0,
          },
          {
            name: '已婚',
            value: 1,
          }
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
        company_type: [
          {
            name: '普通企业',
            value: 1,
          },
          {
            name: '国有企业',
            value: 2,
          },
          {
            name: '外资企业',
            value: 3,
          },
        ],

        ss_card: [
          {
            name: '无社保',
            value: 0,
          },
        ],

        salary_get_type: [
          {
            name: '银行转账',
            value: 1,
          },
          {
            name: '现金',
            value: 2,
          },
        ],

        driving_license: [
          {
            name: '无车',
            value: 0,
          },
        ],

        family_assets: [
          {
            name: '无房产',
            value: 0,
          },
        ],

        public_bill: [
          {
            name: '暂无公益事业',
            value: 0,
          },
        ],
      },
      isShow: false,
      bombShow: false,
      formIndex: '',
      botTitle: '',
    };
  },
  components: {
    'app-header': Header,
    Radio,
    BotSelect,
    BombBox,
    CityList,
    Cropper,
  },
  computed: {
    cityShow () {
      return _.get(this.$store.get.state, 'CityList.content.isShow') || false;
    },

    prov () {
      return _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
    },

    city () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
    },

    area () {
      return _.get(this.$store.get.state, 'CityList.content.data.area') || {};
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
    }
  },
  methods: {

    // 监测必填字段是否已填写
    handlePassChange () {
      if (!_.isEmpty(this.formData.name) && !_.isEmpty(this.formData.company) && !_.isEmpty(this.formData.phone) && !_.isEmpty(this.formData.age) && !_.isEmpty(this.formData.amount) && !_.isEmpty(this.formData.repay_date_limit)) {
        this.active = true;
      }
      else {
        this.active = false;
      }
    },

    // 城市切换
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
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
      this.formIndex  = index;
      this.isShow     = true;
    },

    // 底部弹框组件2
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.formData, {
              [this.formIndex]: obj.content
            });
          }
          return;
        }
      }
    },

    // 所属组件2
    handleBombBoxChange (index) {
      this.formIndex  = index;
      this.bombShow   = true;
    },

    // input选择图片
    upload (event, text) {
      let self = this;
      let file = event.target.files[0];
      if (file.size < 1024 * 1024 * 10) {
        self.bombShow = false;
        self.$toast('上传中，请稍等');
        self.getBase(file, function (data) {
          Models.Upload
          .uploadImage({
            image: data,
          })
          .then((res) => {
            self.$toast(res.msg);
            if (1 === res.code) {
              _.assign(self.formData, {
                [self.formIndex]: {
                  name: text,
                  value: 1,
                  url: res.data.url,
                },
              });
            }
          });
        });
      }
      else {
        self.$toast('注意:每张图片大小不超过10M');
      }
    },

    // 压缩图片
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
        data = canvas.toDataURL('image/jpeg', 0.8);
        if (callback && 'function' === typeof callback) {
          callback(data);
        }
      };
    },

    // 提交表单
    handleSumbit () {
      let self = this;
      let tips = self.$validator(self.$refs.form);
      if (0 !== tips.code) {
        self.$toast(tips.data.msg);
        return;
      }

      let data = {
        name               : self.formData.name,
        company            : self.formData.company,
        phone              : self.formData.phone,
        age                : self.formData.age,
        amount             : self.formData.amount,
        repay_date_limit   : self.formData.repay_date_limit.value,

        is_marry           : _.get(this.formData, 'is_marry') || 0,
        city_id            : _.get(this.city, 'region_id') || '',
        city_name          : _.get(this.city, 'region_name') || '',
        company_type       : _.get(this.formData, 'company_type.value') || '',
        work_age           : _.get(this.formData, 'work_age') || '',
        salary             : _.get(this.formData, 'salary') || '',
        public_fund_age    : _.get(this.formData, 'public_fund_age') || '',
        ss_card            : _.get(this.formData, 'ss_card.url') || '',
        driving_license    : _.get(this.formData, 'driving_license.url') || '',
        family_assets      : _.get(this.formData, 'family_assets.url') || '',
        public_bill        : _.get(this.formData, 'public_bill.url') || '',
        salary_get_type    : _.get(this.formData, 'salary_get_type.value') || '',
      };

      if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }
      self.loading = true;
      Models.Task
      .add(data)
      .then( res => {
        if (1 === res.code) {
          self.$toast(res.msg || '提交成功');

          setTimeout(() => {
            self.$router.go(-1);
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
  }
};