import './index.scss';

import Header from '~common/components/header';
import Models from '~common/models';

export default {
  name: 'apply-guide',
  data () {
    return {
			isShow: false,
      bank: '',
      image: '',
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.guide();
  },
  watch: {
  },
  methods: {

    /*
     * 获取指南
     */
    guide () {
      let self = this;
      Models.Home
      .procedure({
        params: {
          bank_id: self.$route.params.id,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          self.bank = res.data;
        }
      });
    },

    /*
     * 放大图片
     */
    enlarge (img) {
      this.image = img;
      this.isShow = true;
    },

  },
};