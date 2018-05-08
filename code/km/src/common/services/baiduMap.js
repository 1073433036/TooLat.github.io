import _            from 'lodash';
import axios        from 'axios';
import LocalStorage from './localStorage.cookie';

class BaiduMap {
  constructor () {
    this.ak   = '9732973d99267fed00a4d373f8aab3ca';
    this.coor = 'bd09ll';
  }

  get () {
    let self = this;
    let asyncData = async function () {
      let data = await LocalStorage.get('pointData');
      if (!_.isEmpty(data) && data.expired > parseInt(new Date().getTime() / 1000)) {
        return data;
      }

      return await self.ajax().then(res => res);
    };

    return asyncData();
  }

  set (name, value) {
    if (!_.isEmpty(name) && !_.isEmpty(value)) {
      LocalStorage.set(name, value, this.expired);
    }
  }

  ajax () {
    return axios.get('http://api.map.baidu.com/location/ip?ip=116.21.94.162', {
      params: {
        ak   : this.ak,
        coor : this.coor,
      }
    })
    .then((res) => {
      if (0 === res.status) {
        this.set('pointData', res.content);
        return res.content;
      }
    })
    .catch(() => {});
  }
}

export default new BaiduMap();