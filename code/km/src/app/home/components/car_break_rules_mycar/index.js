import './index.scss';

import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'myCar',
  data () {
    return {
      breakRules: {},
      cid: '',
      carNumber: '',
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {

    isAllSelected () {
      let flag = true;
      if (this.breakRules.peccancy_list && Array.isArray(this.breakRules.peccancy_list)) {
        // for (let el of this.breakRules.peccancy_list) {
        //   // 可代办，未处理的 并且未选中的， flag = false
        //   if (el.can_process === 1 && el.status === 0 && !el.selected) {
        //     flag = false;
        //     break;
        //   }
        // }
        let len = this.breakRules.peccancy_list.length;
        let useful = 0,
            use = 0;
        for (let el of this.breakRules.peccancy_list) {
          if (el.can_process !== 1 || el.status !== 0) {
            useful ++;
          }
          else {
            if (el.selected) {
              use ++;
            }
          }
        }
        if (len - useful === use && use !== 0) {
          flag = true;
        }
        else {
          flag = false;
        }
      }
      else {
        flag = false;
      }
      return flag;
    },

    countOfSelected () {
      let count = 0;
      if (this.breakRules.peccancy_list && Array.isArray(this.breakRules.peccancy_list)) {
        for (let el of this.breakRules.peccancy_list) {
          if (el.selected) {
            count += 1;
          }
        }
      }
      return count;
    },

    pointOfSelected () {
      let point = 0;
      if (this.breakRules.peccancy_list && Array.isArray(this.breakRules.peccancy_list)) {
        for (let el of this.breakRules.peccancy_list) {
          if (el.selected) {
            point += el.actual_degree;
          }
        }
      }
      return point;
    },

    priceOfSelected () {
      let price = 0;
      if (this.breakRules.peccancy_list && Array.isArray(this.breakRules.peccancy_list)) {
        for (let el of this.breakRules.peccancy_list) {
          if (el.selected) {
            price += el.count + el.latefine + el.servicePrice;
          }
        }
      }
      return price;
    },

    hasSelected () {
      let flag = false;
      for (let el of this.breakRules.peccancy_list) {
        if (el.selected) {
          flag = true;
          break;
        }
      }
      return flag;
    },

    violationSelected () {
      let arr = [];
      if (this.breakRules.peccancy_list && Array.isArray(this.breakRules.peccancy_list)) {
        for (let el of this.breakRules.peccancy_list) {
          if (el.selected) {
            arr.push(el.violation_id);
          }
        }
      }
      return arr;
    }

  },

  mounted () {
    let carSelected = this.$store.get.state.CarBreakInfo.carSelected;
    this.cid = carSelected.cid;
    if (!this.cid) {
      return;
    }
    this.carNumber = carSelected.carNumber;

    let info = this.$store.get.state.CarBreakInfo.violation;
    let data = info[this.cid] || {};
    data = JSON.parse(JSON.stringify(data));
    if (data.peccancy_list && data.peccancy_list.length) {
      for (let el of data.peccancy_list) {
        // 从完善信息页面跳转过来
        let v = this.$route.query.violationId;
        if (v && Array.isArray(v)) {
          el.selected = v.includes(el.violation_id);
        }
        else {
          el.selected = false;
        }
      }
    }
    this.breakRules = data;
  },

  watch: {
  },

  methods: {
    // 选中取消
    toggleSingle (el) {
      if (el.can_process === 0) {
        this.$toast(el.canprocess_msg || '该违章不支持代缴');
        return;
      }
      el.selected = !el.selected;
    },

    // 查看更多
    goCarDetails (el) {
      this.$router.push({
        name:'home.CarDetails',
        params: { info: el }
      });
    },

    // 全选取消
    toggleAllSelected () {
      let flag = !this.isAllSelected;
      if (flag) {
        // 可处理违章数量
        let useLen = 0;
        for (let el of this.breakRules.peccancy_list) {
          if (el.status === 0 && el.can_process === 1) {
            useLen ++;
          }
        }
        if (!useLen) {
          this.$toast('无可代缴违章');
          return;
        }
      }
      for (let el of this.breakRules.peccancy_list) {
        // 排除已处理、不可以代办
        if (el.status === 1 || el.can_process === 0) {
          continue;
        }
        el.selected = flag;
      }
    },

    // 办理违章
    async dealIllegal () {
      if (!this.hasSelected) {
        return;
      }
      let self = this;

      let res = await Models.CarVio.illegalIncome({
        params: { car_id: this.cid }
      });

      if (res.code !== 1) {
        this.$toast('驾照、车辆信息获取失败，请稍后重试');
        return;
      }

      let further = res.data;

      // 判断驾照信息是否完善
      if (!further.name || !further.driver_number || !further.archive_number || !further.first_license_date || !further.phone
            || !further.qrcode_number || !further.driver_url || !further.driver_second_url) {
        self.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '请先完善驾照信息，才可以继续办理',
          lists : [
            {
              msg: '取消',
            },
            {
              msg: '去完善',
              class: 'ok',
              func () {
                self.$router.push({ name: 'home.AddLicence', query: { fromRoute: 'deal', violationId: self.violationSelected } });
              }
            }
          ]
        });
        return;
      }

      // 判断车辆信息是否完善
      // if (!further.car_code  || !further.car_reg_date  || !further.car_check_date  || !further.brand_id  || !further.car_license_back
      //       || !further.car_license_face  || !further.car_license_number  || !further.car_dj_number) {
      if (!further.car_code  || !further.car_reg_date  || !further.car_check_date  || !further.brand_id  || !further.car_license_back
          || !further.car_license_face) {
        self.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '请先完成车辆验证，才可以继续办理',
          lists : [
            {
              msg: '取消',
            },
            {
              msg: '去完善',
              class: 'ok',
              func () {
                self.$router.push({ name: 'home.CarAccreditation', query: { fromRoute: 'deal', violationId: self.violationSelected } });
              }
            }
          ]
        });
        return;
      }

      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        width : '85%',
        title : '办理须知',
        html  : `
          <ul class="car-break-notify-wrapper">
            <li>
              <em>1 、</em>
              <div>本服务能办理私人小型汽车在全国产生的大部分交通违法，针对扣分业务只能办理本人本车，个人驾驶证累积分不能超过<span style="color: #f00;">12分（含）。</span></div>
            </li>
            <li>
              <em>2 、</em>
              <div>订单支付城后，正常<span style="color: #f00;">2-7个工作日</span>办结。如您的车辆急需办理违章，建议您自行办理。</div>
            </li>
            <li>
              <em>3 、</em>
              <div>本服务不提供相关票据，如遇特殊情况无法办理将由客服联系退款，如有疑问可致电客服<span style="color: rgb(52, 140, 193);">400-018-8616。</span></div>
            </li>
            <li>
              <em>4 、</em>
              <div>付款成功后请勿通过其他渠道<span style="color: #f00;">重复处理</span>，生产的纠纷<span style="color: #f00;">不作退款</span>，请自行通过行政复议处理。</div>
            </li>
            <li>
              <em>5 、</em>
              <div>省外产生的交通违法<span style="color: #f00;">处罚条款</span>与车牌所在地有异时，本服务按<span style="color: #f00;">车牌所在地</span>法规处理。如对违章有
              <span style="color: #f00;">异议</span>，请到<span style="color: #f00;">当地交警大队</span>核实处理。</div>
            </li>
          </ul>
        `,
        lists : [
          {
            msg: '不同意',
          },
          {
            msg: '同意',
            class: 'ok',
            func () {
              let orderList = [];
              for (let el of self.breakRules.peccancy_list) {
                if (el.selected) {
                  orderList.push(el.violation_id);
                }
              }
              self.$store.get.commit('setOrderSelected', orderList);
              self.$router.push({ name:'home.CarBreakOrderConfirm' });

              // 只要有扣分的 先跳转到 IllegalIncome 路由
              // let flag = false;
              // for (let el of self.breakRules.peccancy_list) {
              //   if (el.selected && el.actual_degree > 0) {
              //     flag = true;
              //     break;
              //   }
              // }
              // if (flag) {
              //   self.$router.push({
              //     name:'home.IllegalIncome',
              //     query: {
              //       id: self.cid,
              //       carNumber: self.carNumber
              //     }
              //   });
              // }
              // else {
              //   self.$router.push({ name:'home.CarBreakOrderConfirm' });
              // }
            }
          },
        ]
      });

    }

  }
};
