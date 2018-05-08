import './index.scss';

import _            from 'lodash';
import axios        from 'axios';
import Header       from '~common/components/header';
import phoneCode    from '~common/components/phone_code';
import Models       from '~common/models';
import                   '~common/plugs/gt.js';
import Cropper      from '~common/components/cropper';

export default {
  name: 'creditcard-share-info',
  data () {
    return {
      loading       : false,
      state: {
        active      : false,
        authFlag    : false,
        authSubmit  : false,
      },
      formData: {
        name              : '',
        phone             : '',
        code              : '',
        password          : '',
        jobNumber         : '9527',
        wechat_account    : '',
        wx_qrcode         : '',
        is_delete_account : '',
      },
      geetestData: {},
      captchaObj: null,

      currentFile: '',
    };
  },
  components: {
    'app-header'    : Header,
    phoneCode,
    Cropper,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    uploadImage () {
      let data = _.get(this.$store.get.state, 'Cropper.content.data');
      return data;
    },
  },
  mounted () {
    this.geetest();
    this.handleCheckUserInfo();
  },
  watch: {
    formData: {
      deep: true,
      handler () {
        this.handlePassChange();
      }
    },
    uploadImage (val) {
      if (!_.isEmpty(val.preview) && !_.isEmpty(val.url)) {
        this.formData.wx_qrcode = val.preview;
      }
    },

  },
  methods: {

    handleCheckUserInfo () {
      let self = this;
      Models.Profile
      .checkUserInfo()
      .then((res) => {
        if (1 === res.code * 1) {
          this.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : '您已是平台会员，无需填写信息',
            lists : [
              {
                msg: '确认',
                class: 'ok',
                func () {
                  self.$router.push({
                    name: 'home.Home'
                  });
                }
              },
            ]
          });

        }
        else {
          self.geetest();
        }
      });
    },

    // 提示框
    // handlePrompt () {
    //   this.$store.get.dispatch({
    //     type  : 'handleChangeDialog',
    //     active: true,
    //     title : '温馨提示',
    //     msg   : '为了感谢广大用户朋友的支持，凡在活动期间注册实名验证后，平台将向会员朋友赠送价值68元的VIP视频月度会员。实名验证后请去个人中心 - 视频账号 查看VIP使用账户',
    //     lists : [
    //       {
    //         msg: '关闭',
    //         class: 'ok',
    //       },
    //     ]
    //   });
    // },

    /*
     * 是否填写信息
     */
    handlePassChange () {
      if (!_.isEmpty(this.formData.name) && !_.isEmpty(this.formData.phone) && !_.isEmpty(this.formData.password) && !_.isEmpty(this.formData.code) && !_.isEmpty(this.formData.wechat_account)) {
        this.state.active = true;
      }
      else {
        this.state.active = false;
      }
    },

    /*
     * 提交资料
     */
    handleSumbit () {
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }

      if (!self.geetestData.geetest_challenge && !self.geetestData.geetest_validate && !self.geetestData.geetest_seccode) {
        self.$toast('请完成拖动验证');
        return;
      }

      if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }

      self.loading = true;

      let data = {
        mobile             : self.formData.phone,
        real_name          : self.formData.name,
        verification_code  : self.formData.code,
        user_pass          : self.formData.password,
        geetest_data       : self.geetestData,
        wechat_account     : self.formData.wechat_account,
        wx_qrcode          : self.formData.wx_qrcode,
      };

      if (1 === self.formData.is_delete_account) {
        data.is_delete_account = 1;
      }

      Models.User
      .ouathReg(data)
      .then((res) => {
        if (-1 === res.code) {
          self.loading = false;
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
          self.$toast(res.msg || '提交成功');
          setTimeout(() => {
            self.$router.push({
              name: 'home.Home',
            });
          }, 1000);
        }
        else {
          self.captchaObj.reset();
          self.$toast(res.msg);
          self.geetestData = {};
          self.loading = false;
        }
      })
      .catch(() => {
        self.loading = false;
      });

      /*this.$store.get.dispatch({
        type  : 'creditCardShare',
        isShow: true,
      });*/
    },

    /*
     * 获取极验接口
     */
    geetest () {
      let self = this;
      Models.User
      .geetest()
      .then((res) => {
        if (1 === res.code) {
          axios.get(res.data).then((result) => {
            self.geetestData = result.geetest_data;
            self.getgeetest(result);
          });
        }
      });
    },

    getgeetest (result) {
      let self = this;
      setTimeout(() => {
        try {
          /* eslint-disable */
          initGeetest({
            gt: result.gt,
            challenge: result.challenge,
            product: 'float',
            offline: !result.success,
          }, self.handler);
          /* eslint-enable */
        }
        catch (e) {
          self.getgeetest();
        }
      }, 500);
    },

    /*
     * 极验处理
     */
    handler (captchaObj) {
      let self = this;
      self.captchaObj = captchaObj;
      captchaObj.appendTo('#captcha');
      captchaObj.onSuccess(function () {
        let validate = captchaObj.getValidate();
        self.geetestData.geetest_challenge  = validate.geetest_challenge;
        self.geetestData.geetest_validate   = validate.geetest_validate;
        self.geetestData.geetest_seccode    = validate.geetest_seccode;

        //验证成功执行
        // 验证成功后，BODY 会出现  三个隐藏域 ,需要将这三个值 合并到 下面 “获取参数” 的 ajax请求返回的 geetest_data
        /*
        <div class="gt_input">
          <input class="geetest_challenge" type="hidden" name="geetest_challenge" value="d58280d5f31039b9c3596094fe466e2d">
          <input class="geetest_validate" type="hidden" name="geetest_validate" value="__">
          <input class="geetest_seccode" type="hidden" name="geetest_seccode" value="__|jordan">
        </div>
        */
       });
      captchaObj.onReady(function () {
      });
    },

    /*
     * 重置input file值
     */
    fileClose () {
      this.$refs[this.currentFile].value = '';
    },

    /*
     * 图片上传组件
     */
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

  }
};