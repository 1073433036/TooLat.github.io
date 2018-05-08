import './index.scss';

import _        from  'lodash';
import Header   from '~common/components/header';
import Models		from '~common/models';

export default {
  name: 'IssueDetail',
  data () {
    return {
      bottom: 20,
      formTemp: {
				issue:[]
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    categories_id () {
      return  _.get(this.$store.get.state, 'IncreaseCheats.id');
    },
		articelTitle () {
			return  _.get(this.$store.get.state, 'IncreaseCheats.articelContent.title');
		},
		content () {
			return _.get(this.$store.get.state, 'IncreaseCheats.articelContent.content');
		},
		articelImg () {
			return _.get(this.$store.get.state, 'IncreaseCheats.articelContent.articelImg');
		}
  },
  mounted () {
  },
  watch: {
  },
  methods:{
		/**
		 * 发布
		 */
		increaseIssue () {
			let self = this;
			Models.Increase
			.save({
					post_title:this.title,
					post_content:this.content,
					cover:this.imgUrl,
					categories:1,
			})
			.then(res => {
        if (1 === res.code) {
					self.$toast(res.msg);
					// this.$router.push({name: 'home.IncreaseList'});
        }
			});
		},
		//点击发布
    handleTest () {
      let data = {
        post_title: this.articelTitle,
        post_content: this.content,
        categories: this.categories_id,
        cover: this.articelImg
      };
      Models.Increase.save(data).then(res => {
        if (1 === res.code) {
          this.$router.back();
        }
        else {
          this.$toast(res.msg);
        }
      });
			// let self = this;
   //    this.$store.get.dispatch({
   //      type  : 'handleChangeDialog',
   //      active: true,
   //      title : '发布成功',
   //      lists : [
   //        {
   //          msg: '确定',
   //          func () {
			// 				self.increaseIssue();
			// 				self.$router.push({ name: 'home.IncreaseList' });
   //          },
   //          class: 'ok',
   //        },
   //      ]
   //    });
    }
  },


};