import './index.scss';

import _              from 'lodash';
import Header         from '../header';
import Footer         from '~common/components/footer';
import Models         from '~common/models';
import LocalStorage   from '~common/services/localStorage.cookie';

export default {
  name: 'messageInfo',
  data () {
    return {
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      formTemp: {
      },
      formData: {
        message: [],
      },
      userId: [],
      newFriends: [],
    };
  },
  components: {
    'app-header': Header,
    'app-footer': Footer
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || this.$user.get() || {};
    },
  },
  mounted () {
    this.index();

  },
  watch: {
    userInfo (value) {
      if (!_.isEmpty(value)) {
        this.getMessageList();
      }
    }
  },
  methods: {

    index () {
      let self    = this;

      Models.Notify
      .index({
        params: {
          page: self.page,
          type: 3,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (1 < self.page) {
            self.formTemp = _.concat(self.formTemp.data, data.data);
          }
          else {
            self.formTemp = data.data;
          }

          self.total         = data.total;
          self.per_page      = data.per_page;
          self.current_page  = data.current_page;
          self.last_page     = data.last_page;

          _.each(this.formTemp, (item) => {
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

    // 获取好友聊天信息列表
    getMessageList () {
      let data = LocalStorage.get('chatDataList');
      let user = _.filter(data.data, { id: this.userInfo.id });
      if (!_.isEmpty(user)) {
        this.formData.message = user[0].data;
        _.each(user[0].data, (item) => {
          if (!_.isEmpty(item.data)) {
            let readData = _.filter(item.data, { isRead: false });
            if (!_.isEmpty(readData)) {
              item.isRead = false;
            }
            item.msg = item.data[item.data.length - 1].msg;
            item.type = item.data[item.data.length - 1].type;
          }
        });

        this.formData.message = _.reverse(_.sortBy(this.formData.message, 'time')) || [];
      }
    },

    // 上拉刷新
    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.index();
        done();
      }, 1500);
    },

    infinite (done) {
      if (this.last_page <= this.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        this.page ++;
        this.index();
        done();
      }, 1500);
    },

  },
};