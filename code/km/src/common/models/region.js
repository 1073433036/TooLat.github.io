import axios from 'axios';

class Region {
  // 银行列表
  async get (data = 0) {
    return await axios
    .get(`/region/region_id/${data}`)
    .then(res => res);
  }

}

export default new Region();