import './index.scss';
import Header           from '~common/components/header';

export default {
  name: 'AppAndriodDownload',
  data () {
    return {

    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    download () {
      window.location.href = 'http://zhushou.360.cn/detail/index/soft_id/3959030';
    }
  },
};
