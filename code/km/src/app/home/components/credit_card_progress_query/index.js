import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import phoneCode  from '~common/components/phone_code';
import Models     from '~common/models';
import Result     from './components/result';

export default {
  name: 'creditcard-progress-query',
  data () {
    return {
      state: {
        active      : false,
        layerFlag   : false,
        resultFlag  : false,
        addFlag     : false,
      },

      formData: {
        real_name         : '',
        id_card           : '',
        mobile            : '',
        verification_code : '',
      },
      formList: [],
      formTemp: {},
      loading : false,
    };
  },
  components: {
    'app-header': Header,
    phoneCode,
    Result,
  },
  computed: {
  },
  mounted () {
    this.bankShow();
    this.queryUserList();
  },
  watch: {
  },
  methods: {

    // 进度查询
    handleSumbit () {
      let res = this.$validator(this.$refs.form);
      if (0 !== res.code) {
        this.$toast(res.data.msg);
        return;
      }

      this.formData.bank_id = _.get(this.$route, 'params.id');
      this.state.resultFlag = !this.state.resultFlag;
    },

    // 历史查询
    handleHistSumbit () {
      let bankId = _.get(this.$route, 'params.id');
      this.formData = {
        bank_id: bankId * 1,
        info_id: this.formData.id,
        id: this.formData.id
      };
      // this.formData.bank_id = _.get(this.$route, 'params.id');
      this.state.resultFlag = !this.state.resultFlag;
    },

    // 银行详情
    bankShow () {
      let id = _.get(this.$route, 'params.id');
      Models.Bank
      .show({
        params: {
          id: id,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          this.formTemp = _.assign({}, this.formTemp, res.data);
        }
        else {
          this.$toast(res.msg);
        }
      });
    },

    // 办卡查询用户记录列表
    queryUserList () {
      Models.Credit
      .queryUserList()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (!_.isEmpty(data)) {
            this.formList = data;
            this.formData = _.assign({}, this.formData, data[0]);
          }
        }
      });
    },

    // 删除用户查询记录
    deleteData (item) {
      let self = this;

      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '是否确认删除申请人信息？',
        lists : [
          {
            msg: '取消',
            func () {
            }
          },
          {
            msg: '删除',
            class: 'ok',
            func () {
              Models.Credit
              .queryUserDelete({
                id: item.id,
              })
              .then((res) => {
                self.$toast(res.msg);
                if (1 === res.code) {
                  self.formList.splice(item, 1);

                  if (_.isEmpty(self.formList)) {
                    self.state.addFlag = true;
                  }
                }
              });
            }
          }
        ]
      });
    },

    // 添加申请人信息按钮
    handleApply () {
      this.state.addFlag  = true;
    },

    // 选中
    handelSelectData (item) {
      this.formData = _.assign({}, this.formData, item);
    },

    // 子组件回调
    handleClose (obj) {
      if (_.isObject(obj)) {
        this.state.resultFlag = obj.status;
      }
    },
  },
};