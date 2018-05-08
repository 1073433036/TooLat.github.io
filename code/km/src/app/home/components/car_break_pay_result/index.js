import './index.scss';

export default {
  name: 'CarBreakPayResult',
  data () {
    return {
      isSuccess: true,
    };
  },
  components: {
  },
  computed: {
  },
  mounted () {
    this.isSuccess = this.$route.query.isSuccess;
    setTimeout(() => {
      this.$router.replace({ name: 'home.carBreakRulesAllorder' });
    }, 4000);
  },
  watch: {
  },
  methods: {
  },
};
