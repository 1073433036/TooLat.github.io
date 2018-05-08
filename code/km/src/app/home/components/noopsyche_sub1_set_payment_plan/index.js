import './index.scss';

import _                from 'lodash';
import Vue             from 'vue';
import Header          from '~common/components/header';
import AddCreditCard   from './components/add_credit_card';
import AddPaymentPlan  from './components/add_payment_plan';
import Manage          from '~appRoot/user/components/bank_list/components/manage';
import Models          from '~common/models';
import LocalStorage    from '~common/services/localStorage.cookie';


export default {
  name: 'setPaymentPlan',
  data () {
    return {
      state: {
        manage: false,
      },
      /*
       * 解绑银行卡下标
       */
      unbundIndex: '',
      bankList: [
      ],
      isOther: true,

    };
  },
  components: {
    'app-header': Header,
    'app-manage': Manage,
    AddCreditCard,
		AddPaymentPlan,
  },
  computed: {
  },
  mounted () {
    this.loadTips();
  },
  beforeRouteEnter (to, from, next) {
    let data = {
      page: 1
    };
    Models.Cultivate.getCreditCardList(data).then(res => {
      if (1 === res.code) {
        let resData = res.data;
        next(function (vm) {
          if (0 === resData.total) {
            vm.$toast('请添加信用卡');
          }
          else {
            vm.bankList = resData.data;
          }
        });
      }
      else {
        Vue.$toast(res.msg);
      }
    });
  },
  watch: {},
  methods: {

    loadTips () {
      let data = LocalStorage.get('setPayMentLoadTips');
      if (_.isEmpty(data)) {
        data.data = 0;
      }

      if (2 > data.data) {
        this.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '因代还通道调整，请重新制定新计划执行，以前的计划将被终止，感谢您的理解',
          lists : [
            {
              msg: '确定',
              class: 'ok',
              func () {
                LocalStorage.set('setPayMentLoadTips', data.data + 1);
              }
            },
          ]
        });
      }
    },

    goHomePage () {
      this.$router.push( {name: 'home.NoopsycheCultivateCard'} );
    },
    //点击银行卡，传送卡资料到子组件，并跳转
    sendCardMsgToSub (item) {
      this.$store.get.commit('saveCreditCardInfo', item);
      this.$router.push( {name: 'home.SetPaymentPlanAddplan'});
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
     * 解绑银行卡
     */
    manage (item, index) {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '如您已经启动精养计划，请您先去还款进度查询板块终止精养计划，否则卡片解除绑定后精养计划还将继续执行',
        lists : [
          {
            msg: '取消'
          },
          {
            msg: '确定',
            class: 'ok',
            func () {
              self.state.manage = true;
              self.unbundIndex = index;
              self.id = item.id;

              LocalStorage.remove('setPaymentPlanMainInfo');
              LocalStorage.remove('confirmPaymentPlanInfo');
              LocalStorage.remove('addPlanInfo');

            }
          },
        ]
      });

    },
    unbund () {
      let data = {
        id: this.id
      };
      Models.Cultivate.deleteCreditCard(data).then(res => {
        if (1 === res.code) {
          this.bankList.splice(this.unbundIndex, 1);
        }
        else {
          this.$toast(res.msg);
        }
      });
    },
  }
};