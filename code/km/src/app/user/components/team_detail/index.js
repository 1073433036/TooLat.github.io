import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import WechatCode   from '~common/components/wechat_code';
import Models       from '~common/models';

export default {
  name: 'userTeamDetail',
  data () {
    return {
      page: 1,
      progressshow: true,
      formTemp: {
        base: {},
        card: '',
      },
      isWechat: false,
      count: 0,
      progress:0,
      totalRich:0,
      people:0,
      detail:'',
      detail2:'',
      left: 0,
      nextLeve: 0,
      level: 1,
    };
  },
  components: {
    'app-header': Header,
    WechatCode
  },
  computed: {
    userId () {
      return this.$route.params.id;
    },
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
  },
  mounted () {
    this.level = this.$route.params.level;
    this.advance();
    this.getBase();
  },
  watch: {
  },
  methods: {
    advance () {
      /* eslint-disable */
      let self = this;
      Models.User
      .advance()
      .then((res) => {
        console.log(res);
        if (1 === res.code) {
          let data = res.data;
          this.totalRich = data.num;
          this.people = data.h_num;
          this.progress = (this.totalRich - this.people) / this.totalRich *100;
          this.left = this.progress + '%';
          this.detail = data.msg1;
          this.detail2 = data.msg2;
          // data.next_leve = false;
          if (data.next_leve > 0) {
              this.progressshow = true;
          } else {
             this.progressshow = false;
          }

        }
        /* eslint-enable */
      });
    },

    /*
     * 团队成员基本资料
     */
    getBase () {
      let self = this;
      Models.User
      .teamDetail({
        params: {
          id: self.userId
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          self.formTemp.base = data;

          self.count += data.direct + data.indirect;

          _.each(data.level_list, (item) => {
            self.count += item.number ? item.number * 1 : 0;
          });
        }
      });
    },

    /*
     * 团队成员办卡申请
     */
    getCard () {
      let self = this;
      Models.User
      .teamCard({
        params: {
          id: self.userId
        }
      })
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.card = res.data.data;
        }
      });
    },

    // 跳转到团队成员列表
    handleGoToChild (tye, item) {
      if (0 === tye) {
        if (0 >= item.number) {
          this.$toast(`暂无${item.level_name}`);
          return;
        }
        this.$router.push({
          name: 'user.TeamChild',
          params: {
            id: item.type,
          },
          query: {
            count: this.count
          }
        });
      }
      else {
        if (0 >= item.number) {
          this.$toast(`暂无${item.level_name}`);
          return;
        }
        this.$router.push({
          name: 'user.TeamChild',
          params: {
            id: tye,
          }
        });
      }
    },

    // 微信组件回调
    wechatClose (obj) {
      if (_.isObject(obj)) {
        this.isWechat = obj.status;
      }
    },

    refresh (done) {
      // let self = this;
      setTimeout(() => {
        // self.page = 1;
        // this.list();
        done();
      }, 1500);
    },

    infinite (done) {
      let self = this;
      if (1 <= self.page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        // self.page ++;
        // this.list();
        done();
      }, 1500);
    },
  },

  filters: {
    stateText (val) {
      let data = '';
      switch (val) {
        case 1:
          data = '未激活';
          break;
        case 2:
          data = '已激活';
          break;
        case 3:
          data = '失效';
          break;
      }
      return data;
    },
  },
};
