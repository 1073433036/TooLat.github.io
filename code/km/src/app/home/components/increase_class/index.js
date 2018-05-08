import './index.scss';

import Header   	from '~common/components/header';
import Models     from '~common/models';

export default {
  name: 'IncreaseClass',
  data () {
    return {
      isShow:false,
      bottom: 20,
      formTemp: {
        increaseData:[]
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.increase();
    this.requestUserInfo();
  },
  watch: {
  },
  methods:{
    goToThePage (item) {
      this.$store.get.commit('saveTypeId', {
        id: item.id
      });
      this.$router.push({name: 'home.IncreaseList'});
    },
    //用户信息level
    requestUserInfo () {
      Models.Increase.userInfo().then(res => {
        if (1 === res.code) {
          this.$store.get.commit('saveUserLevel', {
            userLevel: res.data.level
          });
        }
        else {
          this.$toast(res.msg);
        }
      });
    },
    increase () {
      let self = this;
      Models.Increase
      .categories({
        params: {
          type:15
        }
      })
      .then(res => {
        if (1 === res.code) {
          self.formTemp.increaseData = res.data;
        }
        else {
          self.$toast(res.msg);
        }
      });
    },
    change () {
      this.isShow = !this.isShow;
    },
    countermand () {
      this.isShow = false;
    },
  },

};