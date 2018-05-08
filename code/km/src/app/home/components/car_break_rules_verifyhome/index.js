import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'myCar',
  data () {
    return {
      cartCode:'',
      breakRules: [],
      LoadingEnterType: 1,
      carId: '',
      isDialogShow: false,
      identityShow: false,
      codeShow: false,
      isVinShow: false,
      isShowDeletePopup: false
    };
  },
  beforeRouteEnter (to, from, next) {
    if ('home.AddCar' === from.name ) {
      next(vm => {
        vm.isDialogShow = true;
      });
    }
    else {
      next();
    }
  },
  components: {
    'app-header': Header,
  },
  computed: {
    isShowLoading () {
      return _.get(this.$store.get.state, 'Loading.isShow');
    },
    isShowEmptyImg () {
      if ( _.isEmpty(this.breakRules) ) {
        return true;
      }
      return false;
    }
  },
  created () {

  },
  mounted () {
    this.cartCode = this.$route.query.carCode;
    console.log(this.cartCode);
  },
  watch: {

  },
  methods: {
    closeDialog () {
      this.identityShow = false;
      this.isVinShow = false;
      this.isDialogShow = false;
    },
    identityDialog () {
      this.identityShow = true;
      this.isDialogShow = true;
    },
    codeDialog () {
      this.codeShow = true;
      this.isDialogShow = true;
    },
    complete () {
      console.log(6666);
    },

    setDeleteCarId (id) {
      this.carId = id;
      this.isShowDeletePopup = true;
    },
    deteleCar () {
      let self = this;
      this.isShowDeletePopup = false;
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
      let data = {
        id: this.carId
      };
      Models.CarBreak.deleteCar(data).then( res => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          this.$toast('删除成功');
          setTimeout(() => {
            self.$store.get.dispatch({
              type: 'Loading',
              isShow: true
            });
            // self.requestMyCarList();
          }, 600);
        }
        else {
          this.$toast(res.msg);
        }
      });
    },
    goCarInfoVerify () {
      this.$router.push({
        name:'home.CarVerification',
        query: { carCode: this.$route.query.carCode }
      });
    },
    goCarDetails () {
      this.$router.push({
        name:'home.CarDetails'
      });
    },
    goPeccancyPage (item) {
      this.$store.get.commit('saveCarId', {
        carId: item.id,
      });
      this.$router.push({
        name: 'home.CarRulesQuery',
        query: {
          carId: item.id,
          carNumber: item.car_number,
        },
      });
    },
    goCarBreakHomePage () {
      window.history.go(-1);
    }
  }
};
