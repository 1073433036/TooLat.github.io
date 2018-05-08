import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'myCar',
  data () {
    return {
      carInfo: {},
      LoadingEnterType: 1,
      carId: '',
      isShowDeletePopup: false
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    isShowLoading () {
      return _.get(this.$store.get.state, 'Loading.isShow');
    },
    isShowEmptyImg () {
      if ( _.isEmpty(this.userCarList) ) {
        return true;
      }
      return false;
    }
  },
  created () {
    if (this.$route.params.info) {
      this.carInfo = this.$route.params.info;
    }
  },
  watch: {

  },
  mounted () {
    /* eslint-disable */
    var address = this.carInfo.location_name + this.carInfo.location.split('-')[0];
    var map = new BMap.Map("allmap");
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(address, point => {
      if (point) {
        map.centerAndZoom(point, 16);
        map.addOverlay(new BMap.Marker(point));
        var marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中
        var opts = {
          width : 100,     // 信息窗口宽度
          height: 50,     // 信息窗口高度
          title : "此处违章：1" , // 信息窗口标题
          enableMessage:true,//设置允许信息窗发送短息
          // message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
        }
        var infoWindow = new BMap.InfoWindow(address, opts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow,point); //开启信息窗口
      } else {
        this.$toast('获取地址位置失败');
      }
    }, "广州市");
    map.enableScrollWheelZoom(true);
    /* eslint-enable */
  },
  methods: {
    setDeleteCarId (id) {
      this.carId = id;
      this.isShowDeletePopup = true;
    },
    deteleCar () {
      let self = this;
      this.isShowDeletePopup = false;
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
      let data = {
        id: this.carId
      };
      Models.CarBreak.deleteCar(data).then( res => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          this.$toast('删除成功');
          setTimeout(() => {
            self.$store.get.dispatch({
              type: 'Loading',
              isShow: true
            });
          }, 600);
        }
        else {
          this.$toast(res.msg);
        }
      });
    },
    goPeccancyPage (item) {
      this.$store.get.commit('saveCarId', {
        carId: item.id,
      });
      this.$router.push({
        name: 'home.CarRulesQuery',
        query: {
          carId: item.id,
          carNumber: item.car_number,
        },
      });
    },
    goCarBreakHomePage () {
      this.$router.push({name: 'home.CarBreakRules'});
    },
    handleIllegal () {
      this.$toast('暂未开放，敬请期待！');
    }
  }
};
