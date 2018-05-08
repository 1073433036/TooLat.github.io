

import './index.scss';
import Footer       from '~common/components/footer';
import Header       from '~common/components/header';
import Models         from '~common/models';
export default {
  name: 'login',
  data () {
    return {
      loading: false,
      active: false,
      schoolName      : '',
      goodsList       : [],
      schoolList      : [],
      rankList        : [],
      workList        : [],
      subtitle:[],
      formData: {
        goodsId        : undefined,
        goodsPrice     : 0,
        orderId        : 0,
        payId          : 0,
        isOpenProtocol : false,
        checkFlag      : true,
        bank_id        : '',
      },
    };
  },
  components: {
    'app-header' : Header,
    'app-footer' : Footer,
  },
  computed: {

  },
  mounted () {
    this.bank_id = this.$route.query.bankId;
    this.getGoods();
    let a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.subtitle = a;
    // console.log(this.bank_id);

  },
  watch: {

  },
  methods: {
  /* eslint-disable */
    scrollToByTag (name) {
      this.$nextTick ( () =>{
        let el = document.getElementById(name);
        if (el) {
          setTimeout( () => {
            let posy = this.getElementViewTop(el);

            this.$refs.my_scroller.scrollTo(0, posy, false)
          },500)
        }
      })

    },
    getElementViewTop (element) {
        let actualTop = element.offsetTop;
        let current = element.offsetParent;
        let elementScrollTop = 0;
        let headheight = document.querySelector(".header").clientHeight;

　　　　while (current !== null){
　　　　　　actualTop += current.offsetTop;
　　　　　　current = current.offsetParent;
　　　　}

　　　　 if (document.compatMode == "BackCompat"){
          elementScrollTop = document.body.scrollTop;
　　　　} else {
          elementScrollTop = document.documentElement.scrollTop;
　　　　}

　　　　return actualTop-elementScrollTop-headheight;
　　},
  /* eslint-enable */
    getGoods () {
      let self = this;
      Models.Goods
      .schoolList({
          params: {
            bank_id : this.bank_id,
          }
      })
      .then((res) => {
          self.goodsList = res.data;
          for (let i in self.goodsList) {
            self.rankList.push(self.goodsList[i]);
            self.workList.push(i);
            for (let el of self.goodsList[i]) {
              if (el.hot === true) {
                self.schoolList.push(el);
              }
            }
          }
      });
    },

    selectGoods (item) {
      this.formData.goodsId = item.id;
      this.schoolName = item.name;
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : self.schoolName,
        msg   : '',
        html  : '',
        lists : [
          {
            msg: '取消'
          },
          {
            msg: '确定',
            class: 'ok',
            func () {
              self.$router.push({
                name: 'home.StudentCreditCardApply',
                query: Object.assign({}, self.$route.query, { school: self.schoolName })
              });
            }
          },
        ]
      });
    },
    refresh (done) {
      setTimeout(() => {
        done();
      }, 1500);
    },
    infinite (done) {
      if ( 30 <= this.bottom) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }
      setTimeout(() => {
        this.bottom = this.bottom + 10;
        done();
      }, 1500);
    },
  },
};
