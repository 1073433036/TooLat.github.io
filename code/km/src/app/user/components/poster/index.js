import './index.scss';
import 'swiper/dist/css/swiper.css';

import _            from 'lodash';
import html2canvas  from 'html2canvas';
import Header       from '~common/components/header';
import Models       from '~common/models';
import Swiper       from 'swiper';
import Checkbox           from '~common/components/checkbox';
import posterAgreement   from '~common/components/poster_agreement';
export default {
  name: 'userPoster',
  data () {
    return {
			formTemp: {},
      swiper: '',
			swiperOption: {
        notNextTick: true,
				pagination: '.swiper-pagination',
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev',
				paginationClickable: true,
				lazyLoading:true,
				observer:true,
				observeParents:true,
			},
      canvasDom: [
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
        {
          canvasImage: '',
          isCanvas: '',
        },
      ],
      isShare: false,
      index: 0,
      single: true,
      isShow:false
    };
  },
  components: {
    'app-header': Header,
    Checkbox,
    posterAgreement
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    appShareData () {
      return _.get(this.$store.get.state, 'App.histData.appShareData') || {};
    },
  },
  mounted () {
    let self = this;
    this.getPoster();
		this.$nextTick(() => {
      this.swiper = new Swiper(this.$refs.mySwiper, this.swiperOption);
      setTimeout(() => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: true,
        });
      }, 501);
		});
  },
  watch: {
  },
  methods: {

    /*
     * 生成专属海报
     */
    createCanvasImage (dom, index) {
      let self = this;
      self.$nextTick(() => {
        setTimeout(() => {
          let scale = 2;
          let canvas = document.createElement('canvas'),
            w = dom.offsetWidth,
            h = dom.offsetHeight;
          canvas.width = w * scale;
          canvas.height = h * scale;
          canvas.getContext('2d').scale(scale, scale);
          html2canvas(dom, {
            useCORS: true,
            logging: false,
            canvas: canvas,
            width: w,
            height: h,
            scale: scale,
          }).then(canvas => {
            let context = canvas.getContext('2d');
            context.mozImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            context.msImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;

            self.canvasDom[index].canvasImage = canvas.toDataURL();
            self.canvasDom[index].isCanvas = true;

            self.index++;
            // if (12 === self.index * 1) {
            if (10 === self.index * 1) {
              self.$store.get.dispatch({
                type: 'Loading',
                isShow: false,
              });
            }
          });
        }, 500);
      });
    },

    /*
     * 专属海报
     */
    useCanvasIos () {
      // this.createCanvasImage(document.querySelector('.list .itme-01 .inner'), 0);
      // this.createCanvasImage(document.querySelector('.list .itme-02 .inner'), 1);
      // this.createCanvasImage(document.querySelector('.list .itme-03 .inner'), 2);
      this.createCanvasImage(document.querySelector('.list .itme-04 .inner'), 3);
      this.createCanvasImage(document.querySelector('.list .itme-05 .inner'), 4);
      this.createCanvasImage(document.querySelector('.list .itme-06 .inner'), 5);
      this.createCanvasImage(document.querySelector('.list .itme-07 .inner'), 6);
      this.createCanvasImage(document.querySelector('.list .itme-08 .inner'), 7);
      this.createCanvasImage(document.querySelector('.list .itme-09 .inner'), 8);
      this.createCanvasImage(document.querySelector('.list .itme-10 .inner'), 9);
      this.createCanvasImage(document.querySelector('.list .itme-11 .inner'), 10);
      this.createCanvasImage(document.querySelector('.list .itme-12 .inner'), 11);
      this.createCanvasImage(document.querySelector('.list .itme-13 .inner'), 12);
      this.createCanvasImage(document.querySelector('.list .itme-14 .inner'), 13);
      this.createCanvasImage(document.querySelector('.list .itme-15 .inner'), 14);
    },

    /*
     * 获取数据
     */
    getPoster () {
      let self = this;
      Models.User
      .myPoster()
      .then((res) => {
        if (1 === res.code) {
          this.formTemp = res.data;
          self.useCanvasIos();
        }
      });
    },

    // 点击分享
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
    }

  },
};
