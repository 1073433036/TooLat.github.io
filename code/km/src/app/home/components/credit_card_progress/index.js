import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import Footing    from '~common/components/page_footing';
import Socket     from '~common/components/socket';
import Models     from '~common/models';

export default {
  name: 'creditcard-progress',
  data () {
    return {
      bankList: [
        {
          name: '工商',
        },
        {
          name: '光大',
        },
        {
          name: '广发',
        },
        {
          name: '广州',
        },
        {
          name: '华夏',
        },
        {
          name: '交通',
        },
        {
          name: '民生',
        },
        {
          name: '平安',
        },
        {
          name: '浦发',
        },
        {
          name: '上海',
        },
        {
          name: '兴业',
        },
        {
          name: '招商',
        },
        {
          name: '中信',
        },
      ],
      bankList: [],
    };
  },
  components: {
		'app-header': Header,
		'app-footing': Footing,
    Socket,
  },
  computed: {
    message () {
      let data = _.get(this.$store.get.state, 'Message.content.msg');
      this.bankList.forEach((item) => {
        item.num = data[item.tips_key];
      });
      return data;
    },
  },
  mounted () {
    this.getBank();
    this.bottom = 10;
  },
  watch: {
    message (data) {
      this.bankList.forEach((item) => {
        item.num = data[item.tips_key];
      });
    },
  },
  methods: {

    /*
     * 发送socket消息
     */
    onsend (key) {
      this.$refs.socket.onsend(key);
    },

    /*
     * 跳转查询
     */
    jumpQuery (item) {
      if (item.num) {
        this.onsend(item.tips_key);
      }
      this.$router.push({ name: 'home.CreditCardProgressQuery', params: { id: item.id } });
    },

    /*
     * 获取银行列表
     */
    getBank () {
      Models.Bank
      .list({
        params: {
          page: 1,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.bankList = data.data;
        }
      });
    },

    refresh (done) {
      setTimeout(() => {
        done();
      }, 1500);
    },
    infinite (done) {
      if ( 30 <= this.bottom) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }
      setTimeout(() => {
        this.bottom = this.bottom + 10;
        done();
      }, 1500);
    },
  },
};