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
  name: 'AgencyProfile',
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
      return _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
    },

    cityObj () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
    },

    areaObj () {
      return _.get(this.$store.get.state, 'CityList.content.data.area') || {};
    },

    address () {
      let data = '';
      let flag = _.get(this.provObj, 'region_name') && _.get(this.cityObj, 'region_name') && _.get(this.areaObj, 'region_name');
      if (flag) {
        data = `${_.get(this.provObj, 'region_name') || ''}${_.get(this.cityObj, 'region_name') || ''}${_.get(this.areaObj, 'region_name') || ''}`;
      }
      else {
        data = `${this.userInfo.province_name || ''}${this.userInfo.city_name || ''}${this.userInfo.district_name || ''}`;
      }
      return data;
    },

    uploadImage () {
      let data = _.get(this.$store.get.state, 'Cropper.content.data');
      return data;
    },

    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  mounted () {
    this.workList();
    this.getUser();
  },
  watch: {
    uploadImage (val) {

      if (!_.isEmpty(val.preview) && !_.isEmpty(val.url)) {
        if ('code' === this.currentFile) {
          this.formData.wx_qrcode = val.preview;
        }
        else {
          this.avatar             = val.preview;
          this.formData.avatar    = val.url;
        }
      }
    },
  },
  methods: {

    /*
     * 获取用户信息
     */
    getUser () {
      this.formData = _.assign({}, this.formData, {
        mobile        : this.userInfo.mobile,
        user_nickname : this.userInfo.user_nickname,
        province      : this.userInfo.province,
        city          : this.userInfo.city,
        district      : this.userInfo.district,
        work          : this.userInfo.work,
        identity      : { name: this.userInfo.work },
        avatar        : this.userInfo.avatar,
        wx_qrcode     : this.userInfo.wx_qrcode,
        real_name     : this.userInfo.real_name,
        has_card      : this.userInfo.has_card,
        has_car       : this.userInfo.has_car,
        wechat_account: this.userInfo.wechat_account,
      });

      this.avatar   = this.userInfo.avatar_full || '';
      this.lastData = _.assign({}, this.lastData, this.formData);
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

      if (true !== this.$rules.phone(this.formData.mobile)) {
        this.$toast('电话格式不正确');
        return;
      }

      if (true === this.loading) {
        this.$toast('正在提交...');
        return;
      }


      this.formData = _.assign({}, this.formData, {
        avatar          : _.get(this.formData, 'avatar') || this.userInfo.avatar,
        province        : _.get(this.provObj, 'region_id') || _.get(this.formData, 'province'),
        city            : _.get(this.cityObj, 'region_id') || _.get(this.formData, 'city'),
        district        : _.get(this.areaObj, 'region_id') || _.get(this.formData, 'district'),
        work            : _.get(this.formData, 'identity.name'),
        wx_qrcode       : _.get(this.formData, 'wx_qrcode') || this.userInfo.wx_qrcode,
        has_card        : _.get(this.formData, 'has_card'),
        has_car         : _.get(this.formData, 'has_car'),
        wechat_account  : _.get(this.formData, 'wechat_account'),
      });

      if (JSON.stringify(this.lastData) === JSON.stringify(this.formData)) {
        this.$toast('请修改数据再保存');
        return;
      }

      this.loading = true;


      Models.Profile
      .update(this.formData)
      .then((res) => {
        this.$toast(res.msg);

        if (1 === res.code) {
          Models.Profile
          .get()
          .then((res) => {
            if (1 === res.code) {
              let data = res.data;
              LocalStorage.set('userInfo', data);
              setTimeout(() => {
                self.$router.go(-1);
              }, 2000);
            }
          });
        }
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
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

    /*
     * 实名认证
     */
    realName () {
      let self = this;
      if (!self.formData.real_name) {
        let route = {
          name: 'user.Certify',
        };
        self.$router.push(route);
      }
    },

  }
};