import './index.scss';
import Models         from '~common/models';
import Header from '~common/components/header';
export default {
  name: '',
  data () {
    return {
      isShow:  true,
      curIndex:   0,
      status     : 1,
      num        : 1,
      idx        : 1,
      ListDetails:[],
      specialty:[
      ],
      tabContents:[
       '紧急救援保障全',
       '紧急救援保障全',
       '紧急救援保障全',
      ],
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getListDetails();
  },
  methods:{
    //切换
    switchState (index) {
    this.num = index;
    },

    //立即投保
    insure () {
      this.$router.push({
        name: 'home.insuranceInformation'
      });
    },

    //产看更多
    showDetail (index) {
      if (this.curIndex === index) {
        this.curIndex = 999;
      }
      else {
        this.curIndex = index;
      }
      // console.log(this.curIndex, index);
    },

    //获取数据
    getListDetails () {
      let self = this;
      Models.StudentCreditCard
      .creditcardlist({
        params: {
          page:self.page
        }
      })
      .then((res) => {
        if (1 === res.code) {
          // let data = res.data;
          // this.tabContents =  res.data;
          // console.log(data);
        }
      });
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.getListDetails();
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
        this.getListDetails();
        done();
      }, 1500);
    },
  }
};
