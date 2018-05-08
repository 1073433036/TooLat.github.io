import './index.scss';

import Header   from '~common/components/header';

export default {
  name: 'CardInsurance',
  data () {
    return {
      formTemp: {
      },
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
    refresh (done) {
      setTimeout(() => {
        done();
      }, 1500);
		},

		submint () {
			this.$router.push({name: 'insurance.InsuranceAllocation'});
		},
		hint () {
			let self = this;
			this.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
				title : '温馨提示',
				msg:'请下载APP',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '去下载',
            func () {
							self.$router.push({name: 'home.AppHorizon'});
            },
            class: 'ok',
          },
        ]
      });
		}

  },
};