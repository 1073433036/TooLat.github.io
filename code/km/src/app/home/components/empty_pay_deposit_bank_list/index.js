import './index.scss';

// import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'bank',
  data () {
    return {
      state: {
        /*
         * 解绑模态框
         */
        manage: false,
      },
      /*
       * 解绑银行卡下标
       */
      bankList: [],
      unbundIndex: '',
      id: '',
      isShowPage: false
    };
  },
  components: {
    'app-header'    : Header
  },
  computed: {
  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      Models.Pay.userBundleLBankist().then(res => {
        if (1 === res.code) {
          if (!res.data.total) {
            vm.$toast('请添加银行卡');
          }
          vm.bankList = res.data.data;
        }
      });
    });
  },
  mounted () {
  },
  watch: {},
  methods: {
    saveCardId (id) {
      this.$store.get.commit('saveDepositCard', {
        depositCard: id
      });
      this.$router.push({name: 'home.EmptyPay'});
    },
    handleName (value) {
      let arr = [...value];
      arr.splice(0, arr.length - 1, '**');
      return arr.join('');
    },
    handleCardNo (value) {
      let arr = [...value];
      let preArr = arr.slice(0, 4);
      let afterArr = arr.slice(-4);
      let midArr = arr.slice(4, arr.length - 4);
      midArr = midArr.map(function () {
        return '*';
      });
      let result = preArr.concat(midArr, afterArr);
      return result.join('');
    },
    /*
     * 管理银行卡
     */
    manage (item, index) {
      this.state.manage = true;
      this.unbundIndex = index;
      this.id = item.id;
    },
    /*
     * 解绑银行卡
     */
    unbund () {
      let data = {
        id: this.id
      };
      Models.User.userDeleteBank(data).then(res =>{
        if (1 === res.code) {
          this.bankList.splice(this.unbundIndex, 1);
        }
        else {
          this.$toast(res.msg);
        }
      });
    }
  }
};