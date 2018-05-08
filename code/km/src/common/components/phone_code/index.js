
import './index.scss';

import _ 						from 'lodash';
import LocalStorage from '~common/services/localStorage.cookie';

export default {
  name: 'phoneCode',
  props: ['title', 'phone'],
	data () {
		return {
			name: this.title,
			active: false,
		};
	},
	computed: {},
  mounted () {
		if (!_.isEmpty(this.getTimeCount())) {
			this.timer();
		}
		else {
			this.active = false;
		}
  },
  methods: {
		getTimeCount () {
			let time = LocalStorage.get('timeCount');
			if (!_.isEmpty(time)) {
				return time.data;
			}

			return {};
		},
		timer () {
			let self 	= this;
			let t 		= setInterval(function () {
				if (_.isEmpty(self.getTimeCount())) {
					self.name 	= self.title;
					self.active = false;
					clearInterval(t);
					return;
				}

				let expired = parseInt(new Date().getTime() / 1000);
				let num 		= self.getTimeCount().expired - expired;

				if (0 >= num) {
					self.name 	= self.title;
					self.active = false;
					clearInterval(t);
					return;
				}

				self.active = true;
				self.name = `(${num}s)重新获取`;

			}, 1000);
		},
    getPhoneCode () {
			let self = this;
			if (self.phone) {
				if (true === self.$rules.phone(self.phone)) {
					let phone = self.phone + '';
					let str = phone.slice(0, 3);
					if (str && true === self.$rules.checkPhone(str)) {
						self.$store.get.dispatch({
							type  : 'handleChangeDialog',
							active: true,
							title : '温馨提示',
							msg   : '您输入的手机号段可能不支持接收短信，请悉知，如有不便，请更换手机号码。',
							lists : [
								{
									msg: '确定',
									class: 'ok',
									func () {
										self.handleSubmit();
									}
								},
							]
						});
					}
					else {
						self.handleSubmit();
					}
				}
				else {
					self.$toast('请输入正确的手机号码');
				}
			}
			else {
				self.$toast('请填写手机号码');
			}

		},

		// handleSubmit
		handleSubmit () {
			let self = this;
			let local = LocalStorage.get('timeCount');

      if (_.isEmpty(local)) {
        local.data = _.assign({}, local.data, { num: 0 });
      }

      let data = local.data.num;

    //   if (5 <= data) {
				// self.$toast('短信发送已达最大限，请30分钟后再试');
				// return;
    //   }

      let duration = 0;
			if (3 <= data) {
				duration = 3000;
				self.$toast(`30分钟内只允许发送5条，你目前已发送${data}条`, { duration: 6000 });
			}

			setTimeout(() => {
				self.$store.get.dispatch({
					type: 'Loading',
					isShow: true,
					Text: '正在请求...'
				});

				self.axios.post('/user/sms_code/send', {
					phone: self.phone,
				})
				.then((res) => {
					if (1 === res.code) {
						// LocalStorage.set('timeCount', 60, 60);
						let expired = parseInt(new Date().getTime() / 1000);
						LocalStorage.set('timeCount', { expired: expired + 60, num: local.data.num + 1 }, 60 * 30);

						self.$toast('短信验证码已发送');
						self.timer();
					}
					else {
						self.$toast(res.msg || '发送失败');
					}

					self.$store.get.dispatch({
						type: 'Loading',
						isShow: false
					});
				});
			}, duration);

		},
  }
};