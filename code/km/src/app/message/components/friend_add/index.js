import './index.scss';

import _          from 'lodash';
import Header     from '../header';
import Models     from '~common/models';

export default {
  name: 'messageFriendAdd',
  data () {
    return {
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      name: '',
      formTemp: {
        data: [],
        newFriends: [],
      },
      isOpen: false,
      isCompany: false,
      timer: '',

      userId: [],
      newFriends: [],
      newPage  : 1,
      newTotal : 0,
      newPer_page: 0,
      newCurrent_page: 0,
      newLast_page: 0,
    };
  },
  computed: {
    userInfo () {
      return this.$user.get() || _.get(this.$store.get.state, 'App.userInfo');
    },
  },
  mounted () {
    this.index();
    this.list();
  },
  components: {
    'app-header': Header,
  },
  watch: {
    name: {
      deep: true,
      handler () {
        let self = this;
        clearTimeout(self.timer);
        self.timer = setTimeout(() => {
          self.list();
        }, 500);
      },
    },
  },
  methods: {

    // 新朋友好友请求列表
    index () {
      let self    = this;

      Models.Notify
      .index({
        params: {
          page: self.newPage,
          type: 3,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (1 < self.page) {
            self.formTemp.newFriends = _.concat(self.formTemp.data, data.data);
          }
          else {
            self.formTemp.newFriends = data.data;
          }
          self.newTotal         = data.total;
          self.newPer_page      = data.per_page;
          self.newCurrent_page  = data.current_page;
          self.newLast_page     = data.last_page;

          _.each(this.formTemp.newFriends, (item) => {
            item.sta = 0;
            if (-1 === this.userId.indexOf(_.get(item, 'extend.apply_user_id'))) {
              this.userId.push(_.get(item, 'extend.apply_user_id'));
              if (1 < self.page) {
                self.newFriends = _.concat(self.newFriends, item);
              }
              else {
                this.newFriends.push(item);
              }
            }
          });
        }
      });

    },

    // 同意添加好友
    handleAgree (item) {
      let self = this;

      Models.Friend
      .agree({
        user_id: _.get(item, 'extend.apply_user_id'),
      })
      .then((res) => {
        if (1 === res.code) {
          self.handleDelect({
            id : item.id,
            msg: '添加成功',
          });

          self.newFriends = _.filter(self.newFriends, (el) => {
            if (el.id === item.id) {
              el.sta = 2;
            }
            return el;
          });

        }
        else {
          self.$toast(res.msg || '网络请求失败');
        }
      });
    },

    // 拒绝添加好友
    handleDisagree (item) {
      this.newFriends = _.filter(this.newFriends, (el) => {
        if (el.id === item.id) {
          el.sta = 1;
        }
        return el;
      });

      this.handleDelect({
        id : item.id,
        msg: '已拒绝该好友',
      });

    },

    // 删除通知
    handleDelect (option) {
      if (!_.isObject(option)) {
        this.$toast('参数错误');
        return;
      }

      Models.Notify
      .delete({
        id: option.id,
      })
      .then((res) => {
        if (1 === res.code) {
          this.$toast(option.msg);
        }
        else {
          this.$toast(res.msg || '网络请求失败');
        }
      });
    },

    // 找同行
    list () {
      let self = this;

      Models.Friend
      .peerList({
        params: {
          page: self.page,
          name: self.name,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (1 < self.page) {
            self.formTemp.data = _.concat(self.formTemp.data, data.data);
          }
          else {
            self.formTemp.data = data.data;
          }

          self.total        = data.total;
          self.per_page     = data.per_page;
          self.current_page = data.current_page;
          self.last_page    = data.last_page;
        }
      });
    },

    // 添加好友请求
    addFriend (item) {
      if (!_.isNumber(item.user_id * 1)) {
        this.$toast('缺少用户ID');
        return;
      }

      Models.Friend
      .apply({
        user_id: item.user_id,
        message: `${this.userInfo.user_nickname}申请添加您为好友`,
      })
      .then((res) => {
        if (1 === res.code) {
          this.$toast('已发送添加请求');
        }
        else {
          this.$toast(res.msg || '添加好友失败');
        }

      });
    },

    // 自定义筛选城市切换
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.list();
        done();
      }, 1500);
    },

    // 上拉加载
    infinite (done) {
      if (this.last_page <= this.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        this.page ++;
        this.list();
        done();
      }, 1500);
    }
  }
};