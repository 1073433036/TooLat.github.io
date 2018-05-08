import './index.scss';
import Header from '~common/components/header';
import Models         from '~common/models';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';

export default {
  name: 'studentCreditCard',
  data () {
    return {
      Inslist:[],
      active:0,
       num: 1,
       type:'',
       arr:[
         '全部',
         '综合意外',
         '综合',
         '综合意外',
         '综合意外',
         '综合意',
         '综合意',
         '综合意外',
       ]
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getInsList();
    /* eslint-disable */
    let swiper = new Swiper(this.$refs.swiperRoot, {
      autoplay: 2000,
      pagination : '.swiper-pagination',
      paginationClickable :true,
      bulletActiveClass: 'car-break-bullet-active',
      loop: true
    });
    /* eslint-enable */
  },
  methods:{
    //列表
    InsDetails () {
      this.$router.push({
        name: 'home.insuranceList',
        // params: {
        //   id: '1',
        // },
      });
    },
    //消息中心
    message () {
      this.$router.push({
        name: 'home.insuranceMessageCenter'
      });
    },

    gettags (tags) {
      let tagarr = [];
      if (tags) {
        tagarr = tags.split(',').slice(0, 2);
      }
      return tagarr;
    },
    //获取数据
    async getInsList () {
      let res = await Models.Insure.getInsList({
        params: {
          car_id: '25'
        }
      });
      if (res.code === 1) {
        let data = res.data;
        this.Inslist = data.data;
      }
    },
    // 导航切换
     async toggle (index) {
      this.active = index;
      this.type = this.arr[index];
      console.log(this.type);
       let res = await Models.Insure.getInsList({
         params: {
           type: this.type
         }
       });
       if (res.code === 1) {
        //  let data = res.data;
         // this.Inslist = data.data;
       }
     },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.getInsList();
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
        this.getInsList();
        done();
      }, 1500);
    },
  }
};
