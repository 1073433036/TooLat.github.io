import './index.scss';
import Header   from '~common/components/header';
import _        from 'lodash';

export default {
  name: 'carBreakCodeQuery',
  data () {
    return {
      codeList: [],
      isShowCodeList: false,
      currentCode: {},
      keyword: '',
      lastData: [],
      isShowQueryTips: false
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
		userInfo () {
      return this.$user.get() || _.get(this.$store.get.state, 'App.userInfo');
    },
  },
  mounted () {
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
	}
};
