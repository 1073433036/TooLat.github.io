import './index.scss';
import Models         from '~common/models';
import accountinPremium    from '~common/components/accountinPremium';
import _          from 'lodash';
export default {
  name: '',
  data () {
    return {
      formIndex: false,
      botTitle:  '',
      Showa:  false,
      isShow:  false,
      status     : 1,
      num        : 1,
      idx        : 1,
      sid        : '',
      userInfo: {
        accounts   : '',
      },
      tabContents:[
       '1',
       '2',
       '3',
      ],
      formTemp       : {
        accounts      : [
          {
            name: '保险期限',
            value: 1,
          },
          {
            name: '起保时间',
            value: 2,
          },
          {
            name: '终保时间',
            value: 3,
          },
        ],
      },
    };
  },
  components: {
    accountinPremium
  },
  computed: {
  },
  mounted () {
    this.getListDetails();
    // this.sid = this.$route.params.id;
  },
  methods:{
    //切换
    switchState (index) {
      this.num = index;
    },

    //立即投保
    insure () {
      this.$router.push({
        name: 'home.insuranceListDetail'
      });
    },

    //更多
    showDetail (index) {
      this.isShow = !this.isShow;
      console.log(index);
    },

    //获取数据
    async getListDetails () {
      let res = await Models.Insure.getListDetails({
        params: {
          // sid = this.sid,
          car_id: '26'
        }
      });
      if (res.code === 1) {
         // console.log(res);
         // this.Destinationlist = res.data;
      }
    },
    // 所属组件1(核算)
    accountinPremiumClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.Showa = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.userInfo, {
              [this.formIndex]: obj.content.name
            });
          }
          return;
        }
      }
    },
    // 所属组件1(核算)
    handlePremiumClick (index) {
      this.formIndex  = index;
      this.Showa     = true;
      if ( index === 'details' ) {
        this.botTitle = '保障内容';
      }
      else if (index === 'insurePlan') {
        this.botTitle = '保障计划';
      }
    },
    //核算保费
    accountingPremium () {
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
