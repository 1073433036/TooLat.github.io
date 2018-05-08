import './index.scss';

import Header             from '~common/components/header';

export default {
	name: 'home',
	data () {
		return {
			isPlayVideo: false,
			isIframeLoad: false,
			hiddenForm: false,
			account: '广付科技1',
			password: 123456,
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
		let self = this;
		this.$refs.iframe.addEventListener('load', function () {
			self.isIframeLoad = true;
		}, false);
	},
	created () {
	},
	watch: {
	},
	methods: {
		payVideo () {
			this.isPlayVideo = true;
			this.$refs.video.play();
		},
		pauseVideo () {
			this.isPlayVideo = false;
			this.$refs.video.pause();
		},
		goThirdPage () {
			if (this.isIframeLoad) {
				this.$store.get.dispatch({
					type: 'Loading',
					isShow: true
				});
				this.$refs.form.submit();
			}
			else {
				this.$toast('网络延时，请稍后再登录');
			}
		}
	},
};