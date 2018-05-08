import './index.scss';

import _            from 'lodash';
// import domtoimage   from 'dom-to-image';
import html2canvas  from 'html2canvas';
import Header           from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'GetSpShare',
  props: {
    id: {
      type: Number,
      default: 0,
    },
    shareHolder: {
      type: Number,
      default: 0,
    }
  },
  data () {
    return {
      isWeChat: false,
      userInfo: '',
      qrCodeUrl: '',
      canvasImage: '',
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {

  },
  mounted () {
    // this.getPoster();
  },
  watch: {
    id () {
      this.getPoster();
    },
    shareHolder () {
      this.isWeChat = true;
    },
    userInfo (value) {
      if (!_.isEmpty(value)) {
        let data = `${window.location.origin}/card_share?&bid=${this.id}&invite_code=${value.invite_code}`;
        this.createQr(data);
      }
    }
  },
  methods: {

    // 生成二维码
    createQr (url) {
      Models.Home
      .createQr({
        content: url
      })
      .then((res) => {
        if (1 === res.code) {
          this.qrCodeUrl = res.data;
        }
        this.createCanvasImageIos();
      });
    },

    /*
     * 获取数据
     */
    getPoster () {
      let self = this;

      this.canvasImage = '';
      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '正在生成图片...'
      });

      Models.User
      .myPoster()
      .then((res) => {
        if (1 === res.code) {
          self.userInfo = res.data;
          self.qrCodeUrl = `${window.location.origin}/card_share?&bid=${self.id}&invite_code=${self.userInfo.invite_code}`;
        }
      });
    },

    // 生成授权证书图片 - ios
    createCanvasImageIos () {
      let self = this;
      self.$nextTick(() => {
        setTimeout(() => {
          html2canvas(self.$refs.content, {
            useCORS: true,
            allowTaint: false,
            taintTest: true,
          }).then(canvas => {
            self.canvasImage  = canvas.toDataURL();
            self.$forceUpdate();
            self.$store.get.dispatch({
              type: 'Loading',
              isShow: false
            });
          });

        }, 1800);
      });
    },

  }
};
