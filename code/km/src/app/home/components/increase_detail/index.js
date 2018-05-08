import './index.scss';

import Header   from '~common/components/header';
import Models      from '~common/models';

export default {
  name: 'IncreaseDetail',
  data () {
    return {
      formTemp: {
				detail: {}
      },
      isShowPage: false,
      isShare: false,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
		this.increaseDetail();

  },
  watch: {
  },
  methods:{
		/**
		 * 文章详情
		 */
		increaseDetail () {
			let self = this;
			Models.Increase
			.show({
        params: {
					id:self.$route.params.id,
        }
      })
			.then(res => {
        if (1 === res.code) {
					this.formTemp.detail = res.data;
          document.title = this.formTemp.detail.post_title;
          this.isShowPage = true;
        }
        else {
          this.$toast(res.msg);
        }
			});
		},
		/**
		 * 文章点赞
		 */
		increaseLike () {
      let data = {
        id: this.$route.params.id
      };
			Models.Increase.like(data).then(res => {
				if (1 === res.code) {
          this.formTemp.detail.post_like = parseInt(this.formTemp.detail.post_like) + 1;
				}
        else {
          this.$toast(res.msg);
        }
			});

		},
  },
};