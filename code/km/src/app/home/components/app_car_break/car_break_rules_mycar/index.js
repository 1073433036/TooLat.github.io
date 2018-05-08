import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'myCar',
  data () {
    return {
      userCarList: [],
      LoadingEnterType: 1,
      carId: '',
      isShowDeletePopup: false
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    isShowLoading () {
      return _.get(this.$store.get.state, 'Loading.isShow');
    },
    isShowEmptyImg () {
      if ( _.isEmpty(this.userCarList) ) {
        return true;
      }
      return false;
    }
  },
  created () {
    this.requestMyCarList();
  },
  watch: {
    isShowLoading () {
      if (false === this.isShowLoading) {
        if (1 === this.LoadingEnterType) {
          this.$store.get.dispatch({
            type: 'Loading',
            isShow: true
          });
        }
      }
    }
  },
  methods: {
    requestMyCarList () {
      Models.CarBreak.Mycar().then( res => {
        this.LoadingEnterType = 2;
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          this.userCarList = res.data;
        }
        else {
          this.$toast(res.msg);
        }
      });
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
            self.requestMyCarList();
          }, 600);
        }
        else {
          this.$toast(res.msg);
        }
      });
    },
    goPeccancyPage (item) {
      this.$store.get.commit('saveCarId', {
        carId: item.id
      });
      this.$router.push({name: 'home.AppCarRulesQuery'});
    },
    goCarBreakHomePage () {
      this.$router.push({name: 'home.AppCarBreakRules'});
    }
  }
};