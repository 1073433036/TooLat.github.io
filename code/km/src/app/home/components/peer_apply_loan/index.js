import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import CityList     from '~common/components/city_list';
import BotSelect    from '~common/components/bot_select';
import Cropper      from '~common/components/cropper';
import Models       from '~common/models';
import BombBox      from '~common/components/bomb_box';

export default {
  name: 'ApplyLoan',
  data () {
    return {
      /*
       * @param name string 姓名
       * @param company string 所在单位
       * @param phone int 电话号码
       * @param lender_amount string 贷款金额
       * @param lender_rate string 贷款利率
       * @param repay_date_limit int 还款期限
       * @param city_name string 城市
       * @param city_id int 城市id
       * @param business string 业务范围
       * @param company_license string  公司营业执照 （图片地址）
       * @param work_card string 工作证 （图片地址）
       * @param lender_type string 贷款类型
       * @param lender_desc string 贷款详情说明
       */
      lender_desc_test    : '',
      formData: {
        name              : '',
        id_card           : '',
        company           : '',
        phone             : '',
        wechat_account    : '',
        lender_amount     : '',
        lender_rate       : '',
        repay_date_limit  : '',
        city_name         : '',
        city_id           : '',
        business          : '',
        wx_qrcode         : '',
        company_license   : '',
        work_card         : '',
        lender_type       : '',
        lender_desc       : '',
      },
      formTemp: {
        repay_date_limit: [
          {
            name: '6个月',
            value: 6,
          },
          {
            name: '12个月',
            value: 12,
          },
          {
            name: '24个月',
            value: 24,
          },
          {
            name: '36个月',
            value: 36,
          },
          {
            name: '48个月',
            value: 48,
          },
        ],
        lender_type: [
          {
            name: '房产抵押贷款',
            value: 1,
          },
          {
            name: '汽车抵押贷款',
            value: 2,
          },
          {
            name: '信用贷款',
            value: 3,
          },
        ],
      },
      isApplySuccess: false,
      isShow: false,
      bombShow: false,
      formIndex: '',
      botTitle: '',
      currentFile: '',
      loading: false,
      isCompany: false,
    };
  },
  components: {
    'app-header': Header,
    CityList,
    BotSelect,
    Cropper,
    BombBox,
  },
  computed: {
    applyBackCity () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
    },

    uploadImage () {
      let data = _.get(this.$store.get.state, 'Cropper.content.data');
      return data;
    },

    useLen () {
      return this.lender_desc_test.length;
    },
  },
  mounted () {
    this.getAuthentication();
  },
  watch: {
    formIndex (value) {
      switch (value) {
        case 'loanterm':
          this.botTitle = '还款期限';
        break;
      }
    },

    uploadImage (val) {
      if (!_.isEmpty(val.url) && !_.isEmpty(this.currentFile)) {
        this.formData[this.currentFile] = val.preview;
      }
    },

    applyBackCity (val) {
      if (!_.isEmpty(val)) {
        this.formData.city_name = val.region_name;
        this.formData.city_id   = val.region_id;
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
          this.formData.name            = data.real_name;
          this.formData.phone           = data.mobile;
          this.formData.wechat_account  = data.wechat_account;
        }
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

    // 图片上传组件
    setImage (e, el) {
      if (!_.isEmpty(e)) {
        this.currentFile = el;
        const file = e.target.files[0];
        this.$store.get.dispatch({
          type  : 'cropperData',
          isShow: true,
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

    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
    },

    handleSubmit () {
      let self = this;

      if (true === this.loading) {
        this.$toast('正在提交');
        return;
      }

      if (true !== this.$rules.phone(this.formData.phone)) {
        this.$toast('联系方式不正确');
        return;
      }

      this.loading = true;

      let data = {
        name              : self.formData.name,
        id_card           : self.formData.id_card,
        company           : self.formData.company,
        phone             : self.formData.phone,
        wechat_account    : self.formData.wechat_account,
        lender_amount     : self.formData.lender_amount,
        lender_rate       : self.formData.lender_rate,
        repay_date_limit  : self.formData.repay_date_limit.value,
        city_name         : self.formData.city_name,
        city_id           : self.formData.city_id,
        business          : self.formData.business,
        wx_qrcode         : self.formData.wx_qrcode,
        company_license   : self.formData.company_license,
        work_card         : self.formData.work_card,
        lender_type       : self.formData.lender_type.name,
        lender_desc       : self.formData.lender_desc,
      };
      Models.LenderOrder
      .managerApply(data)
      .then((res) => {
        if (1 === res.code) {
          this.isApplySuccess = true;
        }
        else {
          this.$toast(res.msg || '提交失败');
          this.loading = false;
        }
      })
      .catch(() => {
        this.loading = false;
      });
    },

    /*
     * open公司描述
     */
    editCompany () {
      this.isCompany = true;
      this.lender_desc_test = this.formData.lender_desc;
    },

    /*
     * 保存公司描述
     */
    saveDesc () {
      this.formData.lender_desc = this.lender_desc_test;
      this.isCompany = false;
    },

  }
};