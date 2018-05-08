import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import phoneCode    from '~common/components/phone_code';
import Tips         from '~common/components/tips';
import CityList     from '~common/components/city_list';
import Models       from '~common/models'
;
import Banks        from './components/banks';
import Branch       from './components/branch';
import Cropper      from '~common/components/cropper';

export default {
  name: 'order-pay',
  data () {
    return {
      state: {
        active: true,
      },
      formData:{
        name          : '',
        id_card       : '',
        account_no    : '',
        bank_name     : '',
        cash_bank_id  : '',
        bank_province : '',
        bank_city     : '',
        bank_county   : '',
        bank_branch   : '',
        bank_code     : '',
        phone         : '',
        code          : '',

        id_card_front : '',
        id_card_back  : '',
        id_card_person: '',
        card_front    : ''
      },

      formTemp: {
        id_card_front : '',
        id_card_back  : '',
        id_card_person: '',
        card_front    : ''
      },
      submitStatus: 0
    };
  },
  components: {
    'app-header': Header,
    'app-tips'  : Tips,
    phoneCode,
    Banks,
    CityList,
    Branch,
    Cropper
  },
  computed: {
    bank_name () {
      return _.get(this.$store.get.state, 'Banks.content.data.bank_name');
    },
    cash_bank_id () {
      return _.get(this.$store.get.state, 'Banks.content.data.id');
    },

    cityShow () {
      return _.get(this.$store.get.state, 'CityList.content.isShow') || false;
    },

    bank_province () {
      return _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
    },

    bank_city () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
    },

    area () {
      return _.get(this.$store.get.state, 'CityList.content.data.area') || {};
    },

    branch () {
      return _.get(this.$store.get.state, 'Branch.content.data');
    },

    bank_branch () {
      return this.branch.lName;
    },

    bank_code () {
      return this.branch.bankCode;
    },

    uploadImage () {
      let data = _.get(this.$store.get.state, 'Cropper.content.data');
      return data;
    },

  },
  mounted () {
    this.getAuthentication();
    window.aa = this;
  },
  watch: {
    uploadImage (val) {

      if (!_.isEmpty(val.preview) && !_.isEmpty(val.url)) {
        this.formTemp = _.assign({}, this.formTemp, {
          [this.currentFile]: val.preview
        });

        this.formData = _.assign({}, this.formData, {
          [this.currentFile]: val.url
        });
        this.$toast('上传成功');
      }
    },
  },
  methods: {

    // 获取基本共用字段
    getAuthentication () {
      Models.Profile
      .getAuthentication()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.formData.name    = data.real_name;
          this.formData.id_card = data.id_card;
          this.formData.phone   = data.mobile;
        }
      });
    },

    // 自定义筛选城市切换
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
    },

    /**
      * 选择银行
      **/
    chnageBank () {
      this.$store.get.dispatch({
        type  : 'bankData',
        isShow: true,
        isType: 'cash',
      });
    },

    // 支行列表
    handleBankBranch () {
      if (_.isEmpty(this.bank_name)) {
        this.$toast('请选择发卡行');
        return;
      }
      if (_.isEmpty(this.bank_city.region_name)) {
        this.$toast('请选择支行地区');
        return;
      }

      this.$store.get.dispatch({
        type        : 'branchData',
        isShow      : true,
        bankName    : this.bank_name,
        bankCity    : this.bank_city.region_name,
        bnakProvice : this.bank_province.region_name,
      });

    },

    // 银行卡号失去焦点
    handleBankNoOnBlur () {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '请确认储蓄卡卡号是否正确，否则可能会出现信用卡款项不到账哦',
        lists : [
          {
            msg: '确认',
          },
          {
            msg: '修改',
            class: 'ok',
            func () {
              self.$refs.account_no.focus();
            }
          }
        ]
      });
    },

    submitData () {
      let self = this;
      if (true !== self.$rules.identity(self.formData.id_card) ) {
        self.$toast('请输入正确的身份证号码');
        return;
      }
      else if (true !== self.$rules.bank(self.formData.account_no) ) {
        self.$toast('请输入正确的银行卡号');
        return;
      }
      else if (true !== self.$rules.phone(self.formData.phone) ) {
        self.$toast('请输入正确的手机号码');
        return;
      }

      if (self.submitStatus) {
        self.$toast('请不要重复提交');
        return;
      }

      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
      });

      self.submitStatus = 1;

      let data = _.assign({}, self.formData, {
        bank_name: self.bank_name,
        cash_bank_id: self.cash_bank_id,
        bank_province: self.bank_province.region_name,
        bank_city: self.bank_city.region_name,
        bank_county: self.area.region_name,
        bank_branch: self.branch.lName,
        bank_code: self.bank_code
      });

      Models.Pay
      .applyBundleCard(data)
      .then((res) => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        if ( 1 === res.code) {
          let data  = res.data;

          if (!_.isEmpty(data)) {
            _.each(data, (item, index) => {
              if (1 !== item.code * 1) {
                setTimeout(() => {
                  self.$toast(`${item.name}绑定失败，${_.get(item, 'data.respMsg') || _.get(item, 'data.message') || _.get(item, 'msg') }`);
                }, 3000 * index);
              }
            });
          }
        }
        else {
          self.submitStatus = 0;
          self.$toast(res.msg);
        }
      })
      .catch(() => {
        self.submitStatus = 0;
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
      });
    },

    // 图片上传组件
    setImage (e, el) {
      if (!_.isEmpty(e)) {
        this.currentFile = el;
        const file = e.target.files[0];
        this.$store.get.dispatch({
          type  : 'cropperData',
          isShow: true,
          save  : 1,
          data: {
            file: file
          }
        });
      }
    },

    // 重置input file值
    fileClose () {
      this.$refs[this.currentFile].value = '';
    },


  }
};