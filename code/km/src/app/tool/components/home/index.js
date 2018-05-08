import './index.scss';

import Header   from '~common/components/header';
import _        from 'lodash';

export default {
  name: 'toolHome',
  data () {
    return {
      formTemp: {
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo');
    },
  },
  mounted () {
	},
	watch: {
	},
  methods: {

    showUserDialog () {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '请先完善个人资料',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '去完善',
            class: 'ok',
            func () {
              self.$router.push({ name: 'user.Profile', query: { dt: self.$route.path } });
            }
          },
        ]
      });
    },

    linkToRoute (options) {
      // 未完善个人信息
      // if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }
      this.$router.push(options);
    },

		handleDownApp () {
      // 未完善个人信息
      // if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }

      let self = this;
      this.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg:'该功能需要在App里面使用，请下载',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '去下载',
            func () {
              self.$router.push({name: 'home.AppDownLoad'});
            },
            class: 'ok',
          },
        ]
      });
		}

  },
};
