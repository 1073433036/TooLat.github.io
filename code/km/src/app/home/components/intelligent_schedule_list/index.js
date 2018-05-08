import './index.scss';

// import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';


export default {
  name: 'intelligentschedulelist',
  data () {
    return {
      active:0,
      arrNav:[],
      navCode:'',
      orderlist:{}
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getNavData();
    this.orderLists();
  },
  watch: {
  },
  methods: {
    // 菜单
    getNavData () {
      let self = this;
      Models.Intelligent
        .orderStatusList()
        .then((res) => {
          self.arrNav = res.data;
        });
    },
    // 订单列表
    orderLists (code) {
      let self = this;
      self.navCode = code || 0;
      Models.Intelligent
        .orderLists({
          params: {
            status: self.navCode
          }
        })
        .then((res) => {
          for (let i in res.data.data) {
            res.data.data[i].add_time = timestampToTime(res.data.data[i].add_time);
          }
          function  timestampToTime (timestamp) {
              let date = new Date( timestamp * 1000);
              let Y = date.getFullYear() + '-';
              let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +  '-';
              let D = date.getDate() + ' ';
              let h = date.getHours() + ':';
              let m = date.getMinutes() + ':';
              let s = date.getSeconds();
              return Y + M + D + h + m + s;
          }
          // timestampToTime(res.data.data.add_time);
          self.orderlist = res.data;
        });
    },
    setClass (code) {
      if (code === 10) {
        return '';
      }
      if (code === 20) {
        return 'execution';
      }
      if (code === 30) {
        return 'error';
      }
      if (code === 40) {
        return 'succeed';
      }
    },
    // // 订单暂停
    // orderStop (code) {
    //   Models.Intelligent
    //     .orderCancellist({
    //       id: code
    //     })
    //     .then((res) => {
    //       this.$toast(res.msg);
    //     });
    // },
    //计划列表详情页
    toListDetail (id) {
      this.$router.push({
         name: 'home.intelligentProjectDetails',
         params: {
           id:id
         }
      });
    },
    //删除订单
    orderStop (code, sn) {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        CustomClass: ['grey-header', 'grey-header'],
        active: true,
        width: '90%',
        title: '温馨提示',
        msg   :`是否将停止订单号为：${sn}计划的继续执行！`,
        html  : '',
        lists : [
          {
            msg: '否'
          },
          {
            msg: '是',
            func () {
              Models.Intelligent
                .orderCancellist({
                  id: code
                })
                .then((res) => {
                  self.$toast(res.msg);
                  self.orderLists(self.navCode);
                });
              // self.$router.push({
              //   name: 'home.CarAccreditation',
              //   query: Object.assign({}, self.$route.query ,
              //     {
              //       school: self.cartName ,
              //       id: item.id ,
              //       parentid: item.parentid
              //     })
              // });
            }
          },
        ]
      });
    },
    async loadMore (index, listId) {
      //console.log(index, listId);
      let self = this;
      Models.Intelligent
        .orderLists({
          params: {
            card_id:listId
          }
        })
        .then((res) => {
          for (let i = 0, len = res.data.data.length;i < len; i ++) {
            let oldSN  = self.orderlist.data[index].order_sn;
            self.orderlist.data[index].num = 0;
            if (res.data.data[i].order_sn !== oldSN) {
              self.orderlist.data.push(res.data.data[i]);
            }
          }
          // self.orderlist.data.push(res.data.data);
          // console.log(self.orderlist);
          // for (let i in res.data.data) {
          //   res.data.data[i].add_time = timestampToTime(res.data.data[i].add_time);
          // }
        });
    },
    // 导航切换
     async toggle (index) {
      this.active = index;
      this.type = this.arrNav[index];
      // console.log(this.active);
      // console.log(this.type);
       this.orderLists(index);
       // let res = await Models.Intelligent.orderLists({
       //   params: {
       //     status: this.active
       //   }
       // });
       // console.log(res);
       // if (res.code === 1) {
       //  //  let data = res.data;
       //   // this.Inslist = data.data;
       // }
     },
    addCustom () {
      console.log(event.target.dataset.id);
      // this.$router.push({
      //    name: 'home.intelligentSetCreditCardPayment',
      // });
    }
  }
};
