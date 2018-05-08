import './index.scss';

import _                from 'lodash';
import Header           from '~common/components/header';
import Models           from '~common/models';
import Swiper           from 'swiper';

export default {
  name: 'WeChatCardInsuranceSign',
  data () {
    return {
			active:false,
			formData:{
				company:    '',
				quantity:   '',
				sum:        '',
				way:        '',
				name:       '',
				phone:      '',
			},
			swiper          : '',
      swiperOption: {
        scrollbar: this.$refs.scrollbar,
        direction: 'vertical',
        slidesPerView: 'auto',
        mousewheelControl: true,
        freeMode: true,
        nested: true,
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
    this.$nextTick(() => {
      self.swiper = new Swiper(self.$refs.mySwiper, self.swiperOption);
    });
	},
	watch: {
		formData: {
				deep: true,
				handler () {
					this.handlePassChange();
				}
			}
		},
		methods: {
		// 监测必填字段是否已填写
			handlePassChange () {
				if (!_.isEmpty(this.formData.company) && !_.isEmpty(this.formData.quantity) && !_.isEmpty(this.formData.sum) && !_.isEmpty(this.formData.way) && !_.isEmpty(this.formData.name) && !_.isEmpty(this.formData.phone)) {
					this.active = true;
				}
				else {
					this.active = false;
				}
		},
		//提交表单
		handleSumbit () {
			let self = this;
				let tips = self.$validator(self.$refs.form);
				if (0 !== tips.code) {
					self.$toast(tips.data.msg);
					return;
				}
				/**
				 *@param name string 姓名
				 *@param phone int 电话
				 *@param company string 机构名称
				 *@param new_cars_num int 新车投保月考核数量
				 *@param cars_num int 投保车辆考核总台数
				 *@param settle_mode string 佣金结算方式
				 */

				let data = {
					company              : self.formData.company,
					new_cars_num         : self.formData.quantity,
					cars_num             : self.formData.sum,
					settle_mode          : self.formData.way,
					name                 : self.formData.name,
					phone                : self.formData.phone,
				};

				if (true === self.loading) {
					self.$toast('正在为您提交');
					return;
				}
				self.loading = true;
				Models.Public
				.sign(data)
				.then(res => {
					if (1 === res.code) {
						self.$toast(res.msg || '提交成功');
						setTimeout(() => {
							self.formData.company = '';
							self.formData.quantity = '';
							self.formData.sum = '';
							self.formData.way = '';
							self.formData.name = '';
							self.formData.phone = '';
						}, 2000);
					}
					else {
						self.loading = false;
						self.$store.get.dispatch({
							type  : 'handleChangeDialog',
							active: true,
							title : '温馨提示',
							msg   : res.msg,
							lists : [
								{
									msg: '关闭',
								},
							]
						});
					}
				})
				.catch(() => {
					self.loading = false;
				});
		},
  },
};