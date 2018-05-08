import './index.scss';

import Header       from '~common/components/header';

export default {
  name: 'addDepositCard',
  data () {
    return {
      state: {
        active: false,
      },
      formData:{
        phone: '',
      },
    };
  },
  components: {
    'app-header'    : Header,
  },
  computed: {
  },
  mounted () {
  },
  watch: {},
  methods: {
  }
};