import './index.scss';

import _              from 'lodash';
import Socket         from '~common/components/socket';
import LocalStorage   from '~common/services/localStorage.cookie';

export default {
  name: 'app-footer',
  data () {
    return {
      formTemp: {
        message: 0,
        user   : 0,
      },
      msgNum: 0,
    };
  },
  computed: {
    message () {
      let data = _.get(this.$store.get.state, 'Message.content.msg');

      this.formTemp.message = data.message;
      this.formTemp.user = data.user;
      return data;
    },
    currentRoute () {
      return _.get(this.$store.get.state, 'App.currentRoute') || {};
    },
    userInfo () {
      return this.$user.get() || _.get(this.$store.get.state, 'App.userInfo');
    },
  },
  mounted () {
    let localMessageNum = LocalStorage.get('MessageNum');
    if (!_.isEmpty(localMessageNum)) {
      this.msgNum = localMessageNum.data;
      this.formTemp.message = this.msgNum;
    }
  },
  components: {
    Socket
  },
  watch: {
    message (val, old) {
      if (val !== old) {
        this.formTemp.message = val.message + this.msgNum;
        this.formTemp.user = val.user;
      }
    },
  },
  methods: {

    onsend (key) {
      this.$refs.socket.onsend(key);
    },

    goToHome () {
      if (window.js_obj) {
        /* eslint-disable */
        js_obj.tabHome();
        return;
        /* eslint-enable */
      }
      this.$router.push({
        name: 'home.Home'
      });
    },

    goToMsg () {
      if (window.js_obj) {
        /* eslint-disable */
        js_obj.tabMsg();
        return;
        /* eslint-enable */
      }
      this.$router.push({
        name: 'message.Notify'
      });
    },

    goToChat () {
      if (window.js_obj) {
        /* eslint-disable */
        js_obj.tabChat();
        return;
        /* eslint-enable */
      }
      this.$router.push({
        name: 'message.Info'
      });
    }

  }
};
