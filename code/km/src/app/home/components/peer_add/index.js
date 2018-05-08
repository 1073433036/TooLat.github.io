import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import Models     from '~common/models';
import CityList   from '~common/components/city_list';

export default {
  name: 'peerAdd',
  data () {
    return {
      isComponentInit: false,
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      name: '',
      city_id: '',
      formTemp: {
        data: [],
      },
      isOpen: false,
      isCompany: false,
      timer: '',
      friendList: {},
    };
  },
  computed: {
    userInfo () {
      return this.$user.get() || _.get(this.$store.get.state, 'App.userInfo');
    },
    province () {
      let data = _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
      return data;
    },
    city () {
      let data = _.get(this.$store.get.state, 'CityList.content.data.city') || {};
      return data;
    },
  },
  mounted () {
    this.getAllList();
    this.getFriendList();
    // this.list();
  },
  components: {
    'app-header': Header,
    CityList,
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

    province (val) {
      if (val.region_name === '全国') {
        this.getAllList();
      }
    },

    city (val, old) {
      if (!this.isComponentInit) {
        return;
      }
      if (val !== old) {
        this.list();
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.get.dispatch({
      type: 'cityListData',
      data: {},
      isShow: false,
    });
    next();
  },
  methods: {
    // 未完善个人信息
    linkToRoute (options) {
      // if (!this.userInfo.mobile) {
      //   let self = this;
      //   self.$store.get.dispatch({
      //     type  : 'handleChangeDialog',
      //     active: true,
      //     title : '温馨提示',
      //     msg   : '请先完善个人资料',
      //     lists : [
      //       {
      //         msg: '取消',
      //       },
      //       {
      //         msg: '去完善',
      //         class: 'ok',
      //         func () {
      //           self.$router.push({ name: 'user.Profile', query: { dt: self.$route.path } });
      //         }
      //       },
      //     ]
      //   });
      // }
      // else {
      //   this.$router.push(options);
      // }
      this.$router.push(options);
    },

    // 获取所有同行
    getAllList () {
      /* eslint-disable */
      let self = this;
      Models.Friend
      .peerList()
      .then((res) => {
        let data = res.data;
        if (1 === res.code) {
          self.formTemp.data = data.data;
          // console.log(res);
        }

        this.isComponentInit = true;
      });
       /* eslint-enable */
    },
    // 找同行
    list () {
      let self = this;

      Models.Friend
      .peerList({
        params: {
          page: self.page,
          name: self.name,
          city_id: self.city.region_id,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          self.formTemp.data = data.data;
          // if (1 < self.page) {
          //   // self.formTemp.data = _.concat(self.formTemp.data, data.data);
          //   // Object.assign(self.formTemp.data, data.data);
          // }
          // else {
          //   self.formTemp.data = data.data;
          // }
          self.total        = data.total;
          self.per_page     = data.per_page;
          self.current_page = data.current_page;
          self.last_page    = data.last_page;
        }
      });
    },

    // 获取同行圈好友列表
    getFriendList () {

      Models.Friend
      .list({
        params: {
          page: this.page,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          this.friendList = res.data;
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


    // 定位切换
    locationClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isOpen = obj.status;
          _.assign(this.formData, obj.content);
          return;
        }
      }
    },

    // 自定义筛选城市切换
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
    },

    // 取消公司介绍
    handleOther () {
      this.isCompany = this.isOpen = false;
    },

    // 定位切换
    handlePoint () {
      this.isCompany = this.isOpen = !this.isOpen;
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
