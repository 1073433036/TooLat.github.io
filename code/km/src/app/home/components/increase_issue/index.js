import './index.scss';

import _          from 'lodash';
import Header   	from '~common/components/header';
import Radio      from '~common/components/radio';
import BombBox    from '~common/components/bomb_box';
import Cropper    from '~common/components/cropper';

export default {
  name: 'IncreaseIssue',
  data () {
    return {
      name: '111',
			title: '',
			imgUrl:'',
			isShow:false,
			txt:'',
      formTemp: {
			},
			bombShow: false,
      formIndex: '',
      botTitle: '',
			file: '',
			form: [
				{
					text: '',
				}
			],
      inputIndex: 0
    };
  },
  components: {
		'app-header': Header,
		Radio,
		BombBox,
    Cropper,
  },
  computed: {
		uploadImage () {
      let data = _.get(this.$store.get.state, 'Cropper.content.data');
      return data;
    },
  },
  mounted () {
  },
  watch: {
		uploadImage (value) {
			this.imgUrl = value.preview;
		}
  },
  methods: {
		//编辑
		addCharacter (index) {
			this.txt = this.form[index].text;
      this.inputIndex = index;
			this.isShow = true;
		},
		//增加
		addText () {
			this.form.push({
				text: '',
			});
		},
		//删除
		delText (index) {
			if (0 === index) {
				return;
			}
			let self = this;
      this.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '确定删除此段落？',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '确定',
            func () {
							self.form.splice(index, 1);
            },
            class: 'ok',
          },
        ]
      });
		},
		//编辑弹框
    handleTest () {
			let self = this;
      this.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '编辑完成',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '确定',
            func () {
							self.form[self.inputIndex].text = self.txt;
							self.isShow = false;
            },
            class: 'ok',
          },
        ]
      });
		},
		// 底部弹框组件
		handleBomb (obj) {
			if (!_.isNull(obj)) {
				if (_.isObject(obj)) {
					this.bombShow = obj.status;
					if (!_.isEmpty(_.get(obj, 'content'))) {
						_.assign(this.formData, {
							[this.formIndex]: obj.content
						});
					}
					return;
				}
			}
		},
		// 图片上传组件
    setImage (e) {
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
		goThePage () {
			this.$store.get.commit('saveArticelContent', {
				title: this.title,
        content: this.txt,
        articelImg: this.imgUrl
			});
      // console.log(this.$store.get.state);
			// this.$store.get.commit('contentState', {
			// 	content: self.txt
			// });
			// this.$store.get.commit('imagesState', {
			// 	images: self.imgUrl
			// });

			this.$router.push({name: 'home.IssueDetail'});
		}
  },
};