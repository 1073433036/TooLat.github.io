import './index.scss';
import Header from '~common/components/header';
import Models         from '~common/models';

export default {
  name: '',
  data () {
    return {
      messageList:[],
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getmessageList();
  },
  methods:{
    InsDetails () {
      this.$router.push({
        name: ''
      });
    },

    //消息中心
    message () {
      this.$router.push({
        name: ''
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
    async getmessageList () {
      let res = await Models.Insure.getmessageList({
        params: {
          car_id: '24'
        }
      });
      if (res.code === 1) {
         // console.log(res);
         // this.messageList = res.data;
      }
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.getmessageList();
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
        this.getmessageList();
        done();
      }, 1500);
    },
  }
};
