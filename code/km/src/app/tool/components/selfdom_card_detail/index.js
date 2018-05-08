import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import Cropper    from '~common/components/cropper';

export default {
  name: 'SelfdomCardDetail',
  data () {
    return {
      formTemp: {
      },
    };
  },
  components: {
    'app-header': Header,
    Cropper,
  },
  computed: {
    // uploadImage () {
    //   let data = _.get(this.$store.get.state, 'Cropper.content.data');
    //   return data;
    // },
  },
  mounted () {
	},
	watch: {
    // uploadImage (value) {
    //   this.imgUrl = value.preview;
    // }
	},
  methods: {
    // 图片上传组件
    setImage (e) {
      if (!_.isEmpty(e)) {
        const file = e.target.files[0];
        this.$store.get.dispatch({
          type  : 'cropperData',
          isShow: true,
          data: {
            file: file
          }
        });
      }
    },
    // 重置input file值
    fileClose () {
      this.$refs.file.value = '';
    },
  },
};