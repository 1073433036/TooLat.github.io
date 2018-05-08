import './index.scss';

import _        from 'lodash';
import Header   from '~common/components/header';
import Banks    from '~common/components/banks';

export default {
  name: 'creditCard',
  data () {
    return {
      formData: {
        cardId  : '',
        bankName: '',
        cardNum : '',
        userName: '',
      },
      active: false,
    };
  },
  components: {
    'app-header': Header,
    Banks,
  },
  computed: {
    bankName () {
      return _.get(this.$store.get.state, 'Banks.content.data.bankName');
    },
    cardId () {
      return _.get(this.$store.get.state, 'Banks.content.data.cardId');
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
        // self.$store.get.dispatch({
        //   type  : 'handleChangeDialog',
        //   active: true,
        //   title : '温馨提示',
        //   msg   : res.data.msg,
        //   lists : [
        //     {
        //       msg: '关闭',
        //     },

        //   ]
        // });
        return;
      }

      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '提交成功',
        lists : [
          {
            msg: '关闭',
          },

        ]
      });

    }
  }
};