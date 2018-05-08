import './index.scss';
import Header from '~common/components/header';
import Models         from '~common/models';

export default {
  name: 'studentCreditCard',
  data () {
    return {
      city: '',
      Destinationlist   : [
          {
            name: 'JJJYYJ瑞士',
            value: 1,
          },
          {
            name: 'FEFEFR西班牙',
            value: 2,
          },
          {
            name: 'JOIJI俄罗斯',
            value: 3,
          },
          {
            name: 'FEFEFR西班牙',
            value: 4,
          },
          {
            name: 'JJJYYJ瑞士',
            value: 5,
          },
        ],
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getDestinationList();
  },
  methods:{
    //确定
    confirm () {
      this.$router.push({
         name: 'home.insuranceInformation',
         query: Object.assign({}, this.$route.query, { city: this.city.name })
       });
    },
    // 选择城市
    handleItemChange (item) {
      this.active = true;
      if (item === this.city) {
        this.city = {};
        return;
      }
      this.city = item;
      console.log(this.city);
      this.$emit('onChildClick', {
        status : false,
        content: this.city
      });
    },
    //获取数据
    async getDestinationList () {
      let res = await Models.Insure.getDestinationList({
        params: {
          car_id: '23'
        }
      });
      if (res.code === 1) {
         // console.log(res);
         // this.Destinationlist = res.data;
      }
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.getDestinationList();
        done();
      }, 1500);
    },

    infinite (done) {
      if (this.last_page * 1 <= this.current_page * 1) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        this.page ++;
        this.getDestinationList();
        done();
      }, 1500);
    },
  }
};
