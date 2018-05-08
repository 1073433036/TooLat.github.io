import './index.scss';

// import _            from 'lodash';
import Header       from '~common/components/header';
export default {
  name: 'intelligentauthentication',
  data () {
    return {
      // htmlData:''
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getHtml();
  },
  watch: {
  },
  methods: {
    getHtml () {
      let self = this;
      // document.body.innerHTML = this.$route.params.html;
      //console.log(this.$route.params.html);
      // let ss  = this.$route.params.htmlData;
      setInterval(function () {
        document.writeln(self.$route.params.html);
      }, 500);
    }
  }
};
