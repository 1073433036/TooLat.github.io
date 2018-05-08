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
      unbundItem: {},
      bankList: [],
      unbundIndex: '',
      id: ''
    };
  },
  components: {
    'app-header'    : Header,
    'app-manage'    : Manage,
  },
  computed: {
    card_id () {
      return _.get(this.$store.get.state, 'EmptyPay.payInfo.depositCard');
    },
    channel_id () {
      return _.get(this.$store.get.state, 'EmptyPay.emptyOrderData.channel_id');
    },
  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      if (!vm.card_id) {
        vm.$router.push({name: 'home.AuthFlow'});
        return;
      }
      let userBankList = [];
      let data = {
        card_id: vm.card_id,
        channel_id: vm.channel_id
      };
      Models.Pay.userCreditCardList(data).then( res => {
        if ( 1 === res.code ) {
          userBankList = res.data;
          if (!userBankList.total) {
            vm.$toast('请添加银行卡');
          }
          else if (userBankList.total) {
            vm.bankList = userBankList.data;
          }
        }
        else {
          vm.$toast(res.msg);
        }
      });
    });
  },
  mounted () {
  },
  watch: {},
  methods: {
    goEmptyPayPage (item) {
      this.$store.get.commit('saveCreditCardInfo', item);
      this.$router.push({ name: 'home.EmptyPayOrderpay' });
    },
    /*处理银行卡用户信息*/
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
      this.id = item.credit_card_id;
    },
    /*
     * 解绑银行卡
     */
    unbund () {
      let data = {
        credit_card_id: this.id
      };
      Models.Pay.deleteCreditCard(data).then(res =>{
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