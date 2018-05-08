import './index.scss';
import Header           from '~common/components/header';

export default {
  name: 'SystemNotify',
  data () {
    return {
      isPopupOn: false
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    message () {
      return this.$store.get.state.App.systemMessage;
    }
  },
  mounted () {
  },
  watch: {
    message () {
      this.isPopupOn = true;
    },
    '$route' () {
      this.isPopupOn = false;
    }
  },
  methods: {
  },
};
