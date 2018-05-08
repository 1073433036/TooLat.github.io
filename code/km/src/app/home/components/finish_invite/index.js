import './index.scss';
import Header           from '~common/components/header';
import phoneCode        from '~common/components/phone_code';
import Models           from '~common/models';
import _                from 'lodash';
import localStorage     from '~common/services/localStorage.cookie';

export default {
  name: 'finishInvite',
  data () {
    return {
      phoneNumber: '',
      verifyCode: '',
      inviteCode: '',
      password: '',
      disabled: false,
      manager: {},
      toRt: undefined
    };
  },
  components: {
    'app-header': Header,
    phoneCode,
  },
  computed: {
  },
  async mounted () {
    // let res = await Models.User.getParentInviteCode();
    // if (res.code === 1 && res.data.code) {
    //   this.inviteCode = res.data.code;
    //   this.disabled = true;
    // }
    let dt = this.$route.query.dt;
    if (dt) {
      dt = JSON.parse(dt);
      this.toRt = dt;
      if (dt.query && dt.query.invite_code) {
        this.inviteCode = dt.query.invite_code;
        this.disabled = true;
      }
    }
  },
  watch: {
    async inviteCode (val) {
      let res = await Models.User.getInviteCodeInfo({
        invite_code: val
      });
      if (res.code === 1) {
        this.manager = res.data;
      }
      else {
        this.manager = {};
      }
    }
  },
  methods: {
    async saveMsg () {
      if (!this.phoneNumber) {
        this.$toast('请输入手机号码');
        return;
      }
      if (!/^1\d{10}$/.test(this.phoneNumber)) {
        this.$toast('请输入正确的手机号码');
        return;
      }
      if (!this.verifyCode) {
        this.$toast('请输入验证码');
        return;
      }
      if (!this.inviteCode) {
        this.$toast('请输入推荐码');
        return;
      }
      let res = await Models.User.register({
        invite_code: this.inviteCode,
        username: this.phoneNumber,
        password: this.password,
        code: this.verifyCode
      });
      // let res = {
      //   code: 1,
      //   data: {
      //     token: 'ad9a4c82a92a3e2137b5f332b6429046d98661141da3f32cb241f61b52e63ecf'
      //   },
      //   msg: '注册成功,请登录!'
      // };
      if (res.code === 1) {
        this.$toast('操作成功');
        setTimeout(() => {
          localStorage.set('KMToken', {
            token : _.get(res.data, 'token'),
            weChat: 0,
          });
          localStorage.set('KMDeviceType', 'web');
          this.$store.get.dispatch({
            type: 'histData',
            data: _.get(res.data, 'token')
          });

          let route;
          if (this.toRt) {
            route = this.toRt;
          }
          else {
            route = { name: 'home.Home' };
          }
          this.$router.replace(route);
        }, 500);
      }
      else {
        this.$toast(res.msg || '操作失败');
      }
    }
  },
};
