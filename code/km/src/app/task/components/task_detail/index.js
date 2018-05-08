import './index.scss';

import Header       from '~common/components/header';
import Models       from '~common/models';
import _            from 'lodash';

export default {
  name: 'task-detail',
  data () {
    return {
      state: {},
      item: {},
    };
  },
  components: {
    'app-header'    : Header,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
  },
  mounted () {
    this.getDetail();
  },
  watch: {},
  methods: {

    /*
     * 获取详情
     */
    getDetail () {
      let self = this;

      Models.Task
      .detail({
        params: {
          id: self.$route.params.id,
        },
      })
      .then((res) => {
        if (1 === res.code) {
          self.item = res.data;
        }
      });
    },

    /*
     * 立即抢单
     */
    setTask (id) {
      let self = this;
      if (1 === this.userInfo.level) {
        self.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '目前此功能只针对高级会员及以上身份开放，是否立即升级会员？',
          lists : [
            {
              msg: '关闭',
            },
            {
              msg: '立即升级',
              class: 'ok',
              func () {
                let route = {
                  name: 'user.BuyVip'
                };
                self.$router.push(route);
              },
            }
          ]
        });
      }
      else {
        Models.Task
        .getOrder({
          id: id,
          is_exchange: 1,
        })
        .then((res) => {
          self.$toast(res.msg);
          self.getDetail();
        });
      }
    },
  },
  filters: {
    isMarry (value) {
      return 0 === value ? '未婚' : '已婚';
    },
    companyType (value) {
      let name;
      switch (value) {
        case 1:
          name = '普通';
          break;
        case 2:
          name = '国企';
          break;
        case 3:
          name = '外企';
          break;
        default:
          name = '未知';
          break;
      }
      return name;
    },
    salaryGetType (value) {
      let name;
      switch (value) {
        case 1:
          name = '银行转账';
          break;
        case 2:
          name = '现金';
          break;
        default:
          name = '未知';
          break;
      }
      return name;
    },
  },
};