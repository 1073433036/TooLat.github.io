import './index.scss';

import _                from 'lodash';
import Header           from '~common/components/header';
import Radio            from '~common/components/radio';
import BombBox          from '~common/components/bomb_box';
import CityList         from '~common/components/city_list';
import Cropper          from '~common/components/cropper';
import phoneCode        from '~common/components/phone_code';
import Models           from '~common/models';
import LocalStorage     from '~common/services/localStorage.cookie';

export default {
  name: 'userProfile',
  data () {
    return {
      avatar: '',
      loading: false,
      formData: {
        mobile        : '',
        user_nickname : '',
        province      : '',
        city          : '',
        district      : '',
        work          : '',
        avatar        : '',
        identity      : {},
        address       : {},
        wx_qrcode     : '',
        real_name     : '',
        wechat_account: '',
        has_card      : '',
        has_car       : '',
        user_pass     : '',
        app_msg_push  : 1,
      },
      formTemp: {
        identity: [],
        has_card: [
          {
            name: '有',
            value: 1,
          },
          {
            name: '无',
            value: 2,
          },
        ],
        has_car: [
          {
            name: '有',
            value: 1,
          },
          {
            name: '无',
            value: 2,
          },
        ],
      },

      lastData: {},

      // lastPhone: '',
      bombShow: false,
      isEditPhone: false,
      formIndex: '',
      botTitle: '',
      currentFile: '',
      isWeChatCode: false,
      isPerfect: true,
      isMaskVip: false,
      isEdit: false,
      parent_id: '',
      address: '',
    };
  },
  components: {
    'app-header': Header,
    Radio,
    BombBox,
    CityList,
    Cropper,
    phoneCode,
  },
  computed: {
    cityShow () {
      return _.get(this.$store.get.state, 'CityList.content.isShow') || false;
    },

    provObj () {
      let data = _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
      this.formData = _.assign({}, this.formData, {
        province: data.region_id,
        city: '',
        district: '',
      });

      // this.isEdit = true;

      return data;
    },

    cityObj () {
      let data = _.get(this.$store.get.state, 'CityList.content.data.city') || {};
      this.formData = _.assign({}, this.formData, {
        city: data.region_id,
        district: '',
      });

      // this.isEdit = true;
      return data;
    },

    areaObj () {
      let data = _.get(this.$store.get.state, 'CityList.content.data.area') || {};
      this.formData = _.assign({}, this.formData, {
        district: data.region_id,
      });

      // this.isEdit = true;

      return data;
    },

    address1 () {
      let data = `${_.get(this.provObj, 'region_name') || ''}${_.get(this.cityObj, 'region_name') || ''}${_.get(this.areaObj, 'region_name') || ''}`;
      // if (false === this.isEdit || _.isEmpty(data)) {
      //   data = `${this.userInfo.province_name || ''}${this.userInfo.city_name || ''}${this.userInfo.district_name || ''}`;
      // }

      return data;
    },

    uploadImage () {
      let data = _.get(this.$store.get.state, 'Cropper.content.data');
      return data;
    },

    userInfo () {
      return this.$user.get() ||  _.get(this.$store.get.state, 'App.userInfo');
    }
  },
  mounted () {

    this.$nextTick(() => {
      this.getAuthentication();

      this.workList();
      if (0 === _.get(this.$route, 'query.type') * 1) {
        this.isPerfect = false;
      }
      else {
        this.isPerfect = true;
      }

      this.getUser();
    });

    this.$scrollerUpdate(this.$refs.myscroller);
  },

  watch: {
    uploadImage (val) {

      if (!_.isEmpty(val.preview) && !_.isEmpty(val.url)) {
        if ('code' === this.currentFile) {
          this.$toast('上传成功');
          this.formData.wx_qrcode = val.preview;
        }
        else {
          this.avatar             = val.preview;
          this.formData.avatar    = val.url;
        }
      }
    },
    userInfo () {
      this.getUser();
    },

    address1 (val, old) {
      if (!_.isEmpty(this.formData.province_name)) {
        this.address = `${this.formData.province_name}${this.formData.city_name}${this.formData.district_name}`;

        if (!_.isEmpty(old)) {
          if (false === this.isEdit) {
            this.address = old;
            this.isEdit = true;
          }
          else {
            this.address = val;
          }
        }
      }
      else {
        this.address = val;
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    let self = this;
    if (self.lastData.wx_qrcode !== self.formData.wx_qrcode) {
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '二维码已更新，是否保存？',
        lists : [
          {
            msg: '取消',
            func () {
              next();
            },
          },
          {
            msg: '保存',
            class: 'ok',
            func () {
              self.handleSumbit();
            }
          },
        ]
      });
    }
    else {
      next();
    }
  },
  methods: {

    // 获取基本共用字段
    getAuthentication () {
      Models.Profile
      .getAuthentication()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.formData.user_nickname = _.isEmpty(this.formData.user_nickname) ? data.real_name : this.formData.user_nickname;
          this.formData.mobile        = data.mobile;
        }
      });
    },

    /*
     * 获取用户信息
     */
    getUser () {

      this.formData = _.assign({}, this.formData, this.userInfo, {
        // mobile        : this.userInfo.mobile || '',
        // user_nickname : this.userInfo.user_nickname || '',
        // province      : this.userInfo.province || '',
        // city          : this.userInfo.city || '',
        // district      : this.userInfo.district || '',
        // work          : this.userInfo.work || '',
        identity      : { name: this.userInfo.work },
        // avatar        : this.userInfo.avatar || '',
        // wx_qrcode     : this.userInfo.wx_qrcode,
        // real_name     : this.userInfo.real_name || '',
        // id_card       : this.userInfo.id_card || '',
        // has_card      : this.userInfo.has_card || '',
        // has_car       : this.userInfo.has_car || '',
        // wechat_account: this.userInfo.wechat_account || '',
      });

      // if (_.isEmpty(this.formData.province_name)) {
      //   this.address = `${this.formData.province_name}${this.formData.district_name}${this.formData.city_name}`;
      // }
      // else {
      //   this.address = `${_.get(this.provObj, 'region_name') || ''}${_.get(this.cityObj, 'region_name') || ''}${_.get(this.areaObj, 'region_name') || ''}`;
      // }

      // console.log(this.address);

      this.parent_id = this.formData.parent_id;
      this.formData.parent_id = 0 >= this.formData.parent_id ? '' : this.formData.parent_id;

      // 未完善邀请码，点击了别人分享的链接
      if (!this.formData.parent_id && this.$route.query.inviteCode) {
        this.formData.parent_id = this.$route.query.inviteCode;
        this.$refs.parentidInput && this.$refs.parentidInput.focus();
      }


      this.avatar   = this.userInfo.avatar_full || '';

      if (_.isEmpty(this.lastData)) {
        this.lastData = _.assign({}, this.lastData, this.formData);
      }
    },

    // 职业列表
    workList () {
      Models.User
      .workList()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          _.each(data, (item, key) => {
            this.formTemp.identity.push({
              name: item,
              value: key,
            });

          });
        }
      });

    },

    // 城市切换
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
    },

    // 底部弹框组件
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.formData, {
              [this.formIndex]: obj.content
            });
          }
          return;
        }
      }
    },

    // 所属组件
    handleBombBoxChange (index) {
      this.formIndex  = index;
      this.bombShow   = true;
    },

    // 保存
    handleSumbit () {
      let self = this;

      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }

      let data = _.assign({}, self.formData, {
        avatar          : _.get(self.formData, 'avatar') || self.userInfo.avatar,
        province        : _.get(self.formData, 'province'),
        city            : _.get(self.formData, 'city'),
        district        : _.get(self.formData, 'district'),
        work            : _.get(self.formData, 'identity.name'),
        wx_qrcode       : _.get(self.formData, 'wx_qrcode') || self.userInfo.wx_qrcode,
        has_card        : _.get(self.formData, 'has_card'),
        has_car         : _.get(self.formData, 'has_car'),
        wechat_account  : _.get(self.formData, 'wechat_account'),
        app_msg_push    : true === _.get(self.formData, 'app_msg_push') ? 1 : 0,
      });
      // console.log(data.app_msg_push);
      // if (!_.isEmpty(self.formData.user_pass) || !_.isEmpty(self.formData.user_pass1)) {
      //   if (self.formData.user_pass1 !== self.formData.user_pass) {
      //     self.$toast('两次输入的密码不一致');
      //     return;
      //   }
      //   data.user_pass = self.formData.user_pass;
      // }

      // if (self.formData.verification_code) {
      //   data.verification_code = self.formData.verification_code;
      // }

      // if (self.formData.parent_id) {
      //   data.invite_code = self.formData.parent_id;
      // }

      // if (1 === self.formData.is_delete_account) {
      //   data.is_delete_account = 1;
      // }


      // if (true === self.loading) {
      //   self.$toast('正在提交...');
      //   return;
      // }


      self.loading = true;


      Models.Profile
      .update(data)
      .then((res) => {
        self.loading = false;

        if (-1 === res.code) {
          self.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : res.msg,
            lists : [
              {
                msg: '取消'
              },
              {
                msg: '删除',
                class: 'ok',
                func () {
                  self.formData.is_delete_account = 1;
                  self.handleSumbit();
                }
              }
            ]
          });
        }
        else if (1 === res.code) {
          self.$toast(res.msg);
          self.lastData.wx_qrcode = self.formData.wx_qrcode;
          LocalStorage.remove('userInfo');
          setTimeout(() => {
            let dt = self.$route.query.dt;
            if (dt) {
              self.$router.push(dt);
            }
            else {
              self.$router.push({
                name: 'user.Home',
              });
            }
          }, 2000);
        }
        else {
          self.$toast(res.msg || '更新失败');
        }

      })
      .catch(() => {
        self.loading = false;
      });
    },

    // Todo更换手机
    handleMobile () {
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }
    },

    // Todo返回按钮
    handleOther () {
      this.formData.mobile  = this.lastPhone;
      this.isEditPhone      = false;
    },

    // 图片上传组件
    setImage (e, el) {
      if (!_.isEmpty(e)) {
        this.currentFile = el;
        const file = e.target.files[0];
        this.$store.get.dispatch({
          type  : 'cropperData',
          isShow: true,
          data: {
            file: file
          }
        });
      }
    },

    // 重置input file值
    fileClose () {
      this.$refs[this.currentFile].value = '';
    },

    /*
     * 退出
     */
    logout () {
      let self = this;

      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '是否退出登录？',
        lists : [
          {
            msg: '取消'
          },
          {
            msg   : '确认',
            class : 'ok',
            func () {
              Models.User
              .logout()
              .then((res) => {

                if (1 === res.code) {
                  self.$toast(res.msg || '退出成功');
                  LocalStorage.remove('KMToken');
                  LocalStorage.remove('KMDeviceType');
                  LocalStorage.remove('userInfo');
                  /* eslint-disable */
                  if (window.js_obj) {
                    js_obj.logout();
                  }
                  /* eslint-enable */

                  setTimeout(() => {
                    let route = { name: 'welcome.Login' };
                    let routeQuery = _.get(self.$route, 'query.dt');
                    try {
                      route = JSON.parse(routeQuery);
                    }
                    catch (err) {
                      route = {
                        name: 'welcome.Login'
                      };
                    }

                    self.$router.push(route);
                  }, 1000);
                }
                else {
                  self.$store.get.dispatch({
                    type  : 'handleChangeDialog',
                    active: true,
                    title : '温馨提示',
                    msg   : res.msg || '退出失败',
                    lists : [
                      {
                        msg: '关闭',
                      },
                    ]
                  });
                }
              });
            },
          },
        ]
      });


    },

    /*
     * 实名认证
     */
    realName () {
      // if (_.isEmpty(this.formData.id_card)) {
      let route = {
        name: 'user.Certify',
      };
      this.$router.push(route);
      // }
    },

    // 虚假确认按钮
    handleWeChatUpload () {
      if (_.isEmpty(this.formData.wx_qrcode)) {
        this.$toast('请先上传二维码');
        return;
      }

      this.isWeChatCode = false;

    }

  }
};
