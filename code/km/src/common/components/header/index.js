import './index.scss';

import _                from 'lodash';
import locationSelecter from './components/location_selecter';

export default {
  name: 'app-header',
  data () {
    return {
      jsObj: false,
    };
  },
  props: {
    title : {
      type: String,
      default: '',
    },
    logImg : {
      type: String,
      default: '',
    },
    status: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    isBack: {
      type: Boolean,
      default: true,
    },
    other: {
      type: Boolean,
      default: false,
    },
    goBack:{
      type: Function,
      default:function () {}
    },
  },
  computed: {
    historyRoute () {
      return _.get(this.$store.get.state, 'App.historyRoute');
    },

    lastRoute () {
      return _.get(this.$store.get.state, 'App.histData.lastRoute') || '';
    },

    appShareData () {
      return _.get(this.$store.get.state, 'App.histData.appShareData') || {};
    },

    isReferrer () {
      let data = _.isEmpty(this.historyRoute) ? false : true;
      if (this.lastRoute === this.$route.name) {
        data = false;
      }
      return data;
    }
  },
  mounted () {

  },
  watch: {
    // App右上角分享
    /* eslint-disable */
    appShareData (val) {
      if (!_.isEmpty(val) && window.js_obj && 'home.insuranceDestinationChoice'!= this.$route.name) {
        this.jsObj = true;
      }
    }
    /* eslint-enable */
  },

  components: {
    locationSelecter
  },

  methods: {
    handleBack () {

      if (false === this.other) {
        this.$router.go(-1);
      }
      else {
        this.$emit('other');
      }
      if (this.goBack !== undefined) {
        return this.goBack();
      }
    },

    locationClick (data) {
      this.$emit('locationClick', data);
    },

    // 这里是App分享触发事件
    handleShareClick () {
      if (false === this.device.is('WeChat') && window.js_obj) {
        /* eslint-disable */
        let data = {
          title     : this.appShareData.title,
          desc      : this.appShareData.desc,
          url       : this.appShareData.link,
          share_img : this.appShareData.imgUrl
        };

        js_obj.shareWeb(JSON.stringify(data));
        /* eslint-enable */
      }
    }

  }
};
