import './index.scss';

import _ 					from 'lodash';
import Header     from '~common/components/header';
import Models     from '~common/models';

export default {
  name: 'userBusiness',
  data () {
    return {
      isShare: false,
			whole: false,
			imgUrl:[],
			formData:{
				company_images:[]
			},
      photoSrc: '',
      isShowCompanyImg: false,
      isMore: false,
			isShowBtn: true,
			isMuch:false,
			more:true,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
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
		many () {
			let self = this;
			this.isMuch = true;
			this.more 	= false;

			setTimeout(() => {
				self.$refs.myscroller.scrollTo(0, window.innerHeight + 600, true);
			}, 500);

		},
    goEditPage (value) {
      if (!value) {
        this.$router.push({ name: 'user.BusinessEdit' });
      }
    },
    show () {
			let uid = _.get(this.$route, 'query.id');

			if (!_.isNumber(uid * 1) || 0 >= uid * 1) {
				this.$toast('名片id错误');
				setTimeout(() => {
					this.$router.push({
						name: 'home.Home',
					});
				}, 2000);
				return;
			}

      Models.User
      .nameCardShare({
				params: {
					id:  uid,
				}
			})
      .then((res) => {
        if (1 === res.code) {
					this.formData = res.data;
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

  },
};