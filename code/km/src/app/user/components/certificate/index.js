import './index.scss';

import _            from 'lodash';
import domtoimage   from 'dom-to-image';
import html2canvas  from 'html2canvas';
import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'userCertificate',
  data () {
    return {
      canvasImage: '',
      isCanvas: false,
      formTemp: {},
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  mounted () {
    this.certificate();
    // this.createCanvasImage();
  },
  watch: {
  },
  methods: {

    // 生成授权证书图片
    createCanvasImage () {
      let self = this;
      self.$nextTick(() => {
        setTimeout(() => {
          domtoimage.toPng(self.$refs.content)
          .then((data) => {
            if (!_.isEmpty(data)) {
              self.canvasImage  = data;
              self.isCanvas     = true;
            }
          });

        }, 500);
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
            self.isCanvas     = true;
          });
        }, 500);
      });
    },

    // 获取数据
    certificate () {
      let self = this;
      Models.User
      .myCertificate()
      .then((res) => {
        if (1 === res.code) {
          self.formTemp = res.data;
          let isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
          if (isIos) {
            self.createCanvasImageIos();
          }
          else {
            self.createCanvasImage();
          }
        }
      });
    },

    // 生成授权码
    handleCertificateChange () {
      Models.User
      .authCode()
      .then((res) => {
        if (1 === res.code) {
          this.certificate();
          this.createCanvasImage();
        }
      });
    },

  },
};