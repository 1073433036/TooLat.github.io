import './index.scss';
// import Dates              from '~common/components/dates';
import Header           from '~common/components/header';
// import _                  from 'lodash';
import LocalStorage   from '~common/services/localStorage.cookie';
// import SessionStorage from '~common/services/sessionStorage.cookie';
import Models         from '~common/models';
export default {
  data () {
    return {
      name: 'intelligentCreditCardManager',
      cardList:{},
      other:true,
      userInfo:{}
    };
  },
  components: {
     'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getUserInfo();
    this.getCareList();
  },
  watch: {
  },
  methods: {
    getUserInfo () {
      let info = LocalStorage.get('userInfo').data;
      this.userInfo = info;
    },
    handleBack () {
      this.$router.push({
        name: 'home.Generation'
      });
    },
    //信用卡列表
    getCareList () {
      let self = this;
      Models.Intelligent
        .cardList()
        .then((res) => {
          for (let i in res.data.data) {
            let reg = /^(\d{4})\d+(\d{4})$/;
            let reg2 = /^([^\x00-\xff]{1})[^\x00-\xff]+([^\x00-\xff]{1})$/;
            res.data.data[i].card_code =   res.data.data[i].card_code.replace(reg, '$1****$2');
            res.data.data[i].name =   res.data.data[i].name.replace(reg2, '$1**$2');
          }
          self.cardList = res.data.data;
        });
    },
    // 添加信用卡
    addCreditcar () {
      if (this.userInfo.level === 1 && this.cardList.length >= 3) {
        this.$toast('实习会员最多只能绑定3张信用卡');
      }
      else {
        this.$router.push({
          name: 'home.IntelligentAddCreditCards'
        });
      }
    },
    // 信用卡认证
    authentication (index) {
      let self = this;
      let cartId = {
        id : self.cardList[index].id
      };
      Models.Intelligent
        .cardBind(cartId)
        .then((res) => {
          if (res.code === 1) {
            let htmlData = {
              html : res.data
            };
            self.$router.push({
              name: 'home.intelligentAuthentication',
              params : htmlData
            });
          }
          else {
            self.$toast(res.msg);
          }
      });
    },
    // 删除卡
    removeCard (event) {
      let self = this;
      let cartId = {
        id : event.target.dataset.id,
      };
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title: '温馨提示',
        msg   : '请您确认是否删除',
        html  : '',
        lists : [
          {
            msg: '取消'
          },
          {
            msg: '确定',
            class: 'ok',
            func () {
              Models.Intelligent
                .cardDel(cartId)
                .then((res) => {
                  if (res.code === 1) {
                    self.$toast(res.msg);
                    self.getCareList();
                  }
                  else {
                    self.$toast(res.msg);
                  }
                });
            }
          },
        ]
      });
    },
    // 预约列表
    appointmentList (index) {
      let self = this;
      let cartId = {
        id : self.cardList[index].id,
        index: index,
        bill_date:self.cardList[index].bill_date,
        repay_date:self.cardList[index].repay_date,
        type: 'list'
      };
     self.isBind(cartId);
    },
    // 预约还款
    appointmentReservation (index) {
      let self = this;
      let cartId = {
        id : self.cardList[index].id,
        index: index,
        bill_date:self.cardList[index].bill_date,
        repay_date:self.cardList[index].repay_date,
        type: 'reservation'
      };
      self.isBind(cartId);
    },
    // 是否绑定
    isBind (data) {
      let self = this;
      let bindId = self.cardList[data.index].is_bind;
      if (bindId === 0) {
       self.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          width: '90%',
          title: '温馨提示',
          msg   : '该信用卡未认证',
          html  : '',
          lists : [
           {
             msg: '确定',
             func () {
             }
           },
         ]
        });
      }
      else {
        typeChoice();
      }
      function typeChoice ()  {
        if (data.type === 'list') {
          self.$router.push({
            name: 'home.intelligentschedulelist',
          });
        }
        if (data.type === 'reservation') {
          self.$store.get.commit('setCardId', data);
          self.$router.push({
            name: 'home.intelligentPlanningMode',
          });
        }
      }
    },
  }
};
