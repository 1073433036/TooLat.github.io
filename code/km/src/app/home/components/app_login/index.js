import localStorage   from '~common/services/localStorage.cookie';
import _              from 'lodash';

export default {
  name: 'app-login',
  data () {
    return {
      KMToken: '',
      KMType: '',
    };
  },
  components: {
  },
  computed: {
    token () {
      return this.$route.query.KMToken;
    },
    deviceType () {
      return this.$route.query.KMType;
    },
  },
  mounted () {
    this.ken();
	},
	watch: {
  },
  methods: {
    /*
     * 获取token
     */
    ken () {
      if (this.token) {
        localStorage.set('KMToken', {
          token : this.token,
          weChat: 0,
        });
      }
      if (this.deviceType) {
        localStorage.set('KMDeviceType', this.deviceType);
      }
      let token = localStorage.get('KMToken');
      let type  = localStorage.get('KMDeviceType');

      this.KMToken = _.get(token, 'data.token');
      this.KMType = _.get(type, 'data');
    },
  },
};