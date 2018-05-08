import './index.scss';
import Header           from '~common/components/header';
import Models           from '~common/models';

export default {
  name: 'LoanStepDesc',
  data () {
    return {
      id: 17,
      increaseList: [],
    };
  },

  components: {
    'app-header': Header,
  },

  computed: {
  },

  mounted () {
    this.list();
  },

  watch: {
  },

  methods: {
		async list () {
			let res = await Models.Increase.getListsG();
			if (1 === res.code) {
				this.increaseList = res.data.data;
			}
		}

    /**
		 * 提额秘籍列表
		 */
		// list () {
    //   let self = this;

		// 	Models.Increase
		// 	.list({
    //     params: {
		// 			category_id: self.id,
    //       page: 1,
    //       num: 10
    //     }
    //   })
		// 	.then(res => {
    //     if (1 === res.code) {
    //       let data = res.data.data;
    //       for (let el of data) {
    //         if (el.id === 1008 || el.id === 1102 || el.id === 1104) {
    //           this.increaseList.push(el);
    //         }
    //       }
    //     }
		// 	});
		// },
  },
};
