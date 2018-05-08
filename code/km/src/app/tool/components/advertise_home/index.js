import './index.scss';

// import _               from 'lodash';
import Models          from '~common/models';
import CheckUserLevel  from '~common/components/check_user_level';

export default {
  name: 'advertiseHome',
  data () {
    return {
      currentArticleList: [],
      typeRemark: '',
      itemRemark: '',
      currentTypeId: 28,
      currentPage: 0,
      lastPage: 0,

      isShowAwardExplain: false,
      articleStatus: 0,
      isHasMyRelease: false,

      requestMyReleaseListCount: 0
    };
  },
  components: {
    'check-user-level': CheckUserLevel
  },
  computed: {
  },
  created () {

    //筛选查询参数，进入对应页面
    let typeId = parseInt(this.$route.query.typeid);
    if (28 === typeId) {
      this.typeRemark = 'financial';
      this.itemRemark = 'article';
    }
    else if (33 === typeId) {
      this.typeRemark = 'financial';
      this.itemRemark = 'photo';
    }
    else if (29 === typeId) {
      this.typeRemark = 'financial';
      this.itemRemark = 'video';
    }
    else if (35 === typeId) {
      this.typeRemark = 'financial';
      this.itemRemark = 'material';
    }

    else if (30 === typeId) {
      this.typeRemark = 'insurance';
      this.itemRemark = 'article';
    }
    else if (34 === typeId) {
      this.typeRemark = 'insurance';
      this.itemRemark = 'photo';
    }
    else if (31 === typeId) {
      this.typeRemark = 'insurance';
      this.itemRemark = 'video';
    }
    else if (36 === typeId) {
      this.typeRemark = 'insurance';
      this.itemRemark = 'material';
    }

    this.requestCategoriesType();
    this.requestMyReleaseList();
  },
  watch: {
   /* 切换文章/图片/视频/公司素材，获取对应列表*/
    itemRemark (val) {
      this.$refs.scroller.scrollTo(0, 0);

      if ('financial' === this.typeRemark) {
        if ('article' === val) {
          this.currentTypeId = 28;
          this.$router.push({name: 'tool.AdvertiseHome', query: {typeid: 28}});
        }
        else if ('photo' === val) {
          this.currentTypeId = 33;
          this.$router.push({name: 'tool.AdvertiseHome', query: {typeid: 33}});
        }
        else if ('video' === val) {
          this.currentTypeId = 29;
          this.$router.push({name: 'tool.AdvertiseHome', query: {typeid: 29}});
        }
        else if ('material' === val) {
          this.currentTypeId = 35;
          this.$router.push({name: 'tool.AdvertiseHome', query: {typeid: 35}});
        }
      }
      else if ('insurance' === this.typeRemark) {
        if ('article' === val) {
          this.currentTypeId = 30;
          this.$router.push({name: 'tool.AdvertiseHome', query: {typeid: 30}});
        }
        else if ('photo' === val) {
          this.currentTypeId = 34;
          this.$router.push({name: 'tool.AdvertiseHome', query: {typeid: 34}});
        }
        else if ('video' === val) {
          this.currentTypeId = 31;
          this.$router.push({name: 'tool.AdvertiseHome', query: {typeid: 31}});
        }
        else if ('material' === val) {
          this.currentTypeId = 36;
          this.$router.push({name: 'tool.AdvertiseHome', query: {typeid: 36}});
        }
      }

      if (this.currentTypeId || 0 === this.currentTypeId) {
        this.requestArticleList(this.currentTypeId);
      }

    }
  },
  methods: {
    /*处理换行符*/
    hanldeTextContent (content) {
      let regu = /\n/g;
      return content.replace(regu, '</br>');
    },

    /*获取爆料资料库分类id*/
    requestCategoriesType () {
      let data = {
        type: 25
      };
      Models.Advertise.categoriesType(data).then( res => {
        if ( 1 === res.code) {
          this.$store.get.commit('saveDataId', {
            financialId: res.data[0].id,
            insuranceId: res.data[1].id
          });
        }
        else {
          this.$toast(res.msg);
        }
      });
    },

    /*获取该分类文章or图片or视频列表*/
    requestArticleList (typeId, page = 1, isInfinite = false) {
      // this.$refs.scroller.finishInfinite(false);
      let data = {
        category_id: typeId,
        page: page
      };
      Models.Advertise.articleList(data).then( res => {
        if ( 1 === res.code) {
          let dataList = res.data.data;
          if (Array.isArray(dataList) && isInfinite) {
            this.currentArticleList = this.currentArticleList.concat(dataList);
          }
          else {
            this.currentArticleList = dataList;
          }

          this.currentPage = res.data.current_page;
          this.lastPage = res.data.last_page;
        }
        else {
          this.$toast(res.msg);
        }
        // this.$refs.scroller.finishInfinite(true);
      });
    },

    /*获取用户发布判断跳转'我的发布'*/
    requestMyReleaseList () {
      Models.Advertise.myPostData().then(res => {
        this.requestMyReleaseListCount += 1;
        if (1 === res.code) {
          if (res.data.num) {
            this.isHasMyRelease = true;
          }
        }
        else {
          if (1 >= this.requestMyReleaseListCount) {
            this.requestMyReleaseList();
          }
        }
      });
    },

    /*刷新模块*/
    refresh (done) {
      this.requestArticleList(this.currentTypeId);
      setTimeout(function () {
        done();
      }, 1500);
    },
    infinite (done) {
      if (this.currentPage >= this.lastPage) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      this.currentPage += 1;
      done();
      this.requestArticleList(this.currentTypeId, this.currentPage, true);
    },

    /*切换金融or保险*/
    turnType (str) {
      if (str === this.typeRemark) {
        return;
      }

      this.typeRemark = str;
      this.itemRemark = 'article';

      if ('financial' === str) {
        this.$router.push({name: 'tool.AdvertiseHome', query: {typeid: 28}});
        this.requestArticleList(28);
      }
      else if ('insurance' === str) {
        this.$router.push({name: 'tool.AdvertiseHome', query: {typeid: 30}});
        this.requestArticleList(30);
      }
    },

    /*切换文章or图片or视频or公司素材*/
    setArticleOrVideo (remarkStr) {
      if (remarkStr === this.itemRemark) {
        return;
      }

      this.itemRemark = remarkStr;
    },
    routerBackHome () {
      this.$router.push('/');
    },
    goMyReleasePage () {
      this.$router.push({name: 'tool.MyList'});
    },
    /*跳转到上传素材页面*/
    goUploadPage () {

      this.$store.get.commit('saveTypeRemark', {
        typeRemark: this.typeRemark
      });
      this.$router.push({name: 'tool.UploadMaterial', query: {typeRemark: this.typeRemark, typeId: this.currentTypeId}});
    },

    /*跳转文章or图片or视频or公司素材详情页面*/
    goDetailPage (id) {
      this.$router.push({name: 'tool.ArticleDetail', query: {itemRemark: this.itemRemark, articleId: id}});
    }
  },
};