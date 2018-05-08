import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Manage       from './components/manage';
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
    'app-header'    : Header,
    'app-manage'    : Manage,
  },
  computed: {
    withdrawStatus () {
      return _.get(this.$store.get.state, 'Acount.withdrawStatus');
    },
    integralWithdrawStatus () {
      return _.get(this.$store.get.state, 'Acount.integralWithdrawStatus');
    },
  },
  beforeRouteEnter (to, from, next) {
    let data = {
      page: 1
    };
    next(function (vm) {
      Models.User.userBankList(data).then(res => {
        if (1 === res.code) {
          if (!res.data.total) {
            vm.$toast('请添加银行卡');
          }
          vm.bankList = res.data.data;
          vm.isShowPage = true;
        }
      });
    });
  },
  mounted () {
  },
  watch: {},
  methods: {
    saveCardInfo (item) {
      if (1 === this.withdrawStatus) {
        this.$store.get.commit('saveUserBankCarInfo', item);
        this.$router.push({name: 'user.WithdrawDeposit'});
      }
      else if (1 === this.integralWithdrawStatus) {
        this.$store.get.commit('saveUserBankCarInfo', item);
        this.$router.push({name: 'user.Integralwithdraw'});
      }
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