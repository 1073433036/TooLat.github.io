import './index.scss';

// import _                from 'lodash';
import Header           from '~common/components/header';

export default {
  name: 'codeList',
  props: ['codeList', 'isShow'],
  data () {
    return {
      formTemp: {

      },
    };
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    isShow (val) {
      if (val) {
        this.$nextTick( () => {
          this.$refs.myCodeListScroller.scrollTo(0, 0);
        });
      }
    }
  },
  components: {
    'app-header': Header,
  },
  methods: {
    //关闭
    closeCodeList () {
      this.$emit('chooseCodeEvent', 'ensureBtn');
    },

    // 选中code
    chooseCodeItem (item) {
      this.$emit('chooseCodeEvent', item);
    },
  }
};