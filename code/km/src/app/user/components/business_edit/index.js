import './index.scss';

import _                from 'lodash';
import Header           from '~common/components/header';
import Radio            from '~common/components/radio';
import BotSelect        from '~common/components/bot_select';
import CityList         from '~common/components/city_list';
import Cropper          from '~common/components/cropper';
import Models           from '~common/models';
import LocalStorage     from '~common/services/localStorage.cookie';

export default {
  name: 'businessEdit',
  data () {
    return {
			remove:false,
			remnant: 0,
      loading: false,
			avatar: '',
			images:[0, 0, 0, 0],
      descTxt: ['营业执照', '工作证明', '个人与公司门头合影', '工作场地'],
      /*
       * @param avatar string 头像
       * @param name string 姓名
       * @param phone string 手机
       * @param wechat_account string 微信号
       * @param sex int 性别，1-男，2-女
       * @param age int 年龄
       * @param business  string 业务范围
       * @param company string 公司
       * @param company_desc  string 公司描述
       * @param hometown string 家乡
       * @param blood_type string 血型
			 * @param company_images array 公司图片，数组形式
       */
      formData: {
        avatar             : '',
        name               : '',
        phone              : '',
        wechat_account     : '',
        sex                : 1,
        age                : '',
        business           : '',
        company            : '',
        company_desc       : '',
        company_desc_test  : '',
				blood_type         : '',
				company_images     : '',
      },
      formTemp: {
        blood_type: [
          {
            name: 'A型',
            value: 0,
          },
          {
            name: 'B型',
            value: 1,
          },
          {
            name: 'AB型',
            value: 2,
          },
          {
            name: 'O型',
            value: 3,
          },
        ],
        sex: [
          {
            name: '男',
            value: 1,
          },
          {
            name: '女',
            value: 2,
          },
        ],
      },
      isShow: false,
      isCompany: false,
      formIndex: '',
      botTitle: '',
      currentFile: '',
      uploadingFile: '',
    };
  },
  components: {
    'app-header': Header,
    Radio,
    BotSelect,
    CityList,
    Cropper,
  },
  computed: {
    cityShow () {
      return _.get(this.$store.get.state, 'CityList.content.isShow') || false;
    },

    prov () {
      return _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
    },

    city () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
    },

    area () {
      return _.get(this.$store.get.state, 'CityList.content.data.area') || {};
    },

    uploadImage () {
      let data = _.get(this.$store.get.state, 'Cropper.content.data');
      return data;
    },
  },
  mounted () {
    this.getAuthentication();
		this.show();
  },
  watch: {
    formIndex (value) {
      switch (value) {
        case 'Blood':
          this.botTitle = '血型选择';
        break;
      }
    },
    uploadImage (val) {
      if (!_.isEmpty(val.preview) && !_.isEmpty(val.url)) {
				if ('file' === this.currentFile) {
					this.avatar           = val.url;
					this.formData.avatar  = val.preview;
				}
				else {
          this.images.push(val.preview);
				}
      }
    },
  },
  methods: {

    // 获取基本共用字段
    getAuthentication () {
      Models.Profile
      .getAuthentication()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.formData.name    = data.real_name;
          this.formData.phone   = data.mobile;
        }
      });
    },

    /*
     * 获取名片详情
     */
    show () {
      Models.User
      .nameCardShow()
      .then((res) => {
        if (1 === res.code) {
          this.formData = _.assign({}, this.formData, res.data);
          this.images = this.formData.company_images;
          this.city.region_name = res.data.hometown;
          this.formData.blood_type = {
            name: res.data.blood_type,
					};
        }
      });
    },

    /*
     * 保存微名片
     */
    handleSumbit () {
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }

      if (!self.formData.company_desc) {
        self.$toast('公司介绍不能为空');
        return;
      }

      if (!self.city.region_name) {
        self.$toast('家乡不能为空');
        return;
      }

      if (!self.formData.blood_type.name) {
        self.$toast('血型不能为空');
        return;
			}

      if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }

      self.loading = true;

      /*
       * @param name string 姓名
       * @param phone string 手机
       * @param sex int 性别，1-男，2-女
       * @param age int 年龄
       * @param business  string 业务范围
       * @param company string 公司
       * @param company_desc  string 公司描述
       * @param hometown string 家乡
       * @param blood_type string 血型
       */

      let data = {
        avatar               : self.formData.avatar,
        name                 : self.formData.name,
        phone                : self.formData.phone,
        wechat_account       : self.formData.wechat_account,
        sex                  : self.formData.sex,
        age                  : self.formData.age,
        business             : self.formData.business,
        company              : self.formData.company,
        company_desc         : self.formData.company_desc,
        hometown             : self.city.region_name,
				blood_type           : self.formData.blood_type.name,
				company_images       : self.images,
      };

      Models.User
      .nameCardSave(data)
      .then((res) => {
        if (1 === res.code) {
          self.$toast(res.msg);
          LocalStorage.remove('userInfo');
          setTimeout(() => {
            self.$router.go(-1);
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

		/*
     * open公司描述
     */
		editCompany () {
			this.isCompany = true;
			this.formData.company_desc_test = this.formData.company_desc;
			this.remnant = this.formData.company_desc_test.length;
		},

    /*
     * 保存公司描述
     */
    saveDesc () {
      this.formData.company_desc = this.formData.company_desc_test;
			this.isCompany = false;
    },

    // 城市切换
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
    },

    // 底部弹框组件1
    botSelectClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.formData, {
              [this.formIndex]: obj.content
            });
          }
          return;
        }
      }
    },

    // 所属组件1
    handleBotSelectChange (index) {
      this.formIndex  = index;
      this.isShow     = true;
    },

    // 取消公司介绍
    handleOther () {
      this.isCompany = false;
    },

    // 图片上传组件
    setImage (e, el) {
      if (!_.isEmpty(e)) {
        this.currentFile = el;
        const file = e.target.files[0];
        this.$store.get.dispatch({
          type  : 'cropperData',
          isShow: true,
          data: {
            file: file
          }
        });
      }
    },

    // 重置input file值
    fileClose () {
      this.$refs[this.currentFile].value = '';
		},

		appear () {
			this.remove = !this.remove;
		},

		descInput () {
			let txtVal = this.formData.company_desc_test.length;
			this.remnant = 0 + txtVal;
		},

		// 图片上传组件
    uploading (e, el) {
			this.uploadingFile = el;
      if (!_.isEmpty(e)) {
        const file = e.target.files[0];
        this.$store.get.dispatch({
          type  : 'cropperData',
          isShow: true,
          data: {
            file: file
          }
        });
      }
		},
		// 重置input file值
    fileClose () {
      this.$refs.file.value = '';
		},
		//删除图片
		del (index) {
			this.images.splice(index, 1);
		},

    /*上传图片模块(新)*/
    // input选择图片
    upload (event, index) {
      if (!event.target.files[0]) {
        return;
      }
      let self = this;
      let file = event.target.files[0];
      if (file.size < 1024 * 1024 * 10) {
        self.$toast('上传中，请稍等');
        self.getBase(file, function (data) {
          Models.Upload
          .uploadImage({
            image: data,
          })
          .then((res) => {
            self.$toast(res.msg);
            if (1 === res.code) {
              self.images[index] = res.data.preview;
              self.$forceUpdate();
            }
          });
        });
      }
      else {
        self.$toast('注意:每张图片大小不超过10M');
      }
    },
    // 压缩图片
    getBase (file, callback) {
      let reader = new FileReader(),
        image = new Image(),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        data = '';
      reader.readAsDataURL(file);
      reader.onload = function () {
        image.src = this.result;
      };
      image.onload = function () {
        let w = image.naturalWidth,
          h = image.naturalHeight;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(image, 0, 0, w, h, 0, 0, w, h);
        data = canvas.toDataURL('image/jpeg', 0.8);
        if (callback && 'function' === typeof callback) {
          callback(data);
        }
      };
    }

  },
};