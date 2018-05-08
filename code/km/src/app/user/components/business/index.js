import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import Models     from '~common/models';

export default {
  name: 'userBusiness',
  data () {
    return {
      isShare: false,
			whole: false,
			imgUrl:[],
      formTemp: {
        company_images: []
      },
      photoSrc: '',
      isShowCompanyImg: false,
      isMore: false,
      isShowBtn: true,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    appShareData () {
      return _.get(this.$store.get.state, 'App.histData.appShareData') || {};
    },
  },
  mounted () {
		this.show();
    let obj = this.parseQueryString(window.location.href);
    if (obj.invite_code) {
      this.isShowBtn = false;
    }
    else {
      this.isShowBtn = true;
    }
  },
  watch: {
    photoSrc () {
      if (this.photoSrc) {
        this.isShowCompanyImg = true;
      }
      else {
        this.isShowCompanyImg = false;
      }
    }
  },
  methods: {
    goEditPage (value) {
      if (!value) {
        this.$router.push({ name: 'user.BusinessEdit' });
      }
    },
    show () {
      Models.User
      .nameCardShow()
      .then((res) => {
        if (1 === res.code) {
          this.formTemp = _.assign({}, res.data);
          if (_.isEmpty(this.formTemp.company_images)) {
            this.formTemp.company_images = [];
          }
        }
      });
		},
    scalePhoto (imgSrc) {
      this.photoSrc = imgSrc;
    },
    chooseFixed () {
      this.photoSrc = '';
    },

    /*
     * 未完善跳转
     */
    perfect () {
      let route = {
        name: 'user.BusinessEdit'
      };
      this.$router.push(route);
    },

    /*
     * 解析url里面参数为Json
     */
    parseQueryString (url) {
      let regUrl   = /^[^\?]+\?([\w\W]+)$/;
      let regPara  = /([^&=]+)=([\w\W]*?)(&|$|#)/g;
      let arrUrl =  regUrl.exec(url);
      let ret     = {};

      if (arrUrl && arrUrl[1]) {
       let strPara = arrUrl[1];
       let result;
       while (null !== (result = regPara.exec(strPara))) {
        ret[result[1]] = result[2];
       }
      }
      return ret;
    },

    // 点击分享按钮
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
      else {
        this.isShare = true;
      }
    },

  },
};