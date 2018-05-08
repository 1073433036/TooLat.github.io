import './index.scss';

import _                from 'lodash';
import Header           from '~common/components/header';
import PeccancyJson     from './peccancy.json';
import CodeList         from './components/code_list';

export default {
  name: 'carBreakCodeQuery',
  data () {
    return {
      codeList: [],
      isShowCodeList: false,
      currentCode: {},
      keyword: '',
      lastData: [],
      isShowQueryTips: false
    };
  },
  components: {
    'app-header': Header,
    CodeList
  },
  computed: {
  },
  mounted () {
    this.codeList   = this.handleJson(PeccancyJson);
    this.lastData   = this.codeList;
  },
  watch: {

    // 搜索
    keyword (val, old) {
      if (val !== old) {
        this.currentCode = {};
        let data =  _.filter(this.lastData, (item) => {
          if (_.isObject(item)) {
            let id = item.id;
            let title = item.title;
            let money = item.money;
            if (-1 !== id.indexOf(val) || -1 !== title.indexOf(val) || -1 !== money.indexOf(val)) {
              return item;
            }
          }
        });
        this.codeList = data;
      }
    },
    //搜索结果
    codeList (val) {
      if (_.isEmpty(val)) {
        this.isShowQueryTips = true;
      }
      else {
        this.isShowQueryTips = false;
      }
    }
  },
  methods: {

    //json数据去重
    handleJson (jsonObj) {
      let targetJson = jsonObj.filter(function (targetItem, index, thisArray) {
        let isRepeat = false;
        let currentItem = targetItem;
        let compareArray = thisArray.slice(index + 1);
        compareArray.forEach(function (compareItem) {
          if (currentItem.id === compareItem.id) {
            isRepeat = true;
          }
        });
        return !isRepeat;
      });
      return targetJson;
    },

    // 抽取json的code代码
    handleJsonPrefix (jsonObj) {
      let targetArr = [];
      jsonObj.forEach((item) => {
        targetArr.push(item.id);
      });
      return targetArr;
    },

    // 选中code
    hanldCodeChoice (code) {
      if ('ensureBtn' === code) {
        this.isShowCodeList = false;
        return;
      }
      let self      = this;
      let index     = _.filter(self.lastData, { id: code.id });
      self.keyword  = '';

      if (!_.isEmpty(index)) {
        self.currentCode = index[0];
        self.$nextTick(() => {
          setTimeout(() => {
            let el = _.get(self.$refs.myCityScroller.$el, 'children[0]');
            el = _.get(el, 'children[0]');
            if (el.querySelector('.active')) {
              self.$refs.myCityScroller.scrollTo(0, el.querySelector('.active').offsetTop * 1, true);
            }
          }, 100);
        });
      }

      self.isShowCodeList = false;
    },

    clickItem (index) {
      this.hanldCodeChoice(this.codeList[index]);
    }
  }
};