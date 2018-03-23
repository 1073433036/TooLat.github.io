<template>
  <main id="user-management">
    <header class="main-header cf">
      <h1>{{systemTitle}}</h1>
      <svg width="10px" height="50px">
        <path d="M 0,0 L 10,0 L 0,50 Z"></path>
      </svg>
      <section class="option-wraper cf">
        <div @click.stop="managementType = 'users'" for="main-cate-control"
             :style="{fontWeight: isUserManage ? 'bold' : 'normal'}"
             v-if="isRoot">
          用户管理
        </div>
        <div @click.stop="managementType = 'info'" for="main-cate-control"
             :style="{fontWeight: !isUserManage ? 'bold' : 'normal'}">
          信息管理
        </div>
        <span v-if="managementType !== null" :style="{left: (isUserManage || !isRoot) ? '0px' : '120px' }"></span>
      </section>
      <aside>
        <section class="user-info">
          <a class="user-image"></a>
          <span>{{loginUser.account}}</span>
          <em @click.stop="gotoUserManagement(false)"></em>
        </section>
      </aside>
    </header>
    <section class="content-wraper" id="info-manage" v-show="!isUserManage">
      <header class="content-header">
        <el-select v-model="selectedInfoOption"
                   size="small"
                   class="user-manage-select"
                   placeholder="请选择">
          <el-option v-for="(opt, key) in infoOptions"
                     :key="key"
                     :label="opt.name"
                     :value="key">
          </el-option>
        </el-select>
        <el-select class="user-manage-select" style="margin-left: 10px;"
                   v-if="subOptions.length"
                   size="small"
                   v-model="selectedSubOption"
                   placeholder="请选择">
          <el-option v-for="opt in subOptions"
                     :key="opt.value"
                     :label="opt.name"
                     :value="opt.value">
          </el-option>
        </el-select>
        <el-select class="user-manage-select" style="margin-left: 10px;"
                   v-if="countySel"
                   size="small"
                   v-model="currentCounty"
                   placeholder="请选择">
          <el-option v-for="opt in regionData"
                     :key="opt.countyId"
                     :label="opt.name"
                     :value="opt.countyId">
          </el-option>
        </el-select>
        <aside>
          <ul>
            <li style="color: #1eba90 ; border-color: #1eba90 ;" @click.stop="openPoiOpratePopup('adding')" v-show="addPoiBtnShow">
              <span>新增</span>
              <em></em>
            </li>
            <li style="width: 110px; color: #299dff; border-color: #299dff;" title="批量新增" v-show="addPoiBtnShow">
              <span>批量新增</span>
              <em></em>
              <form id="upload-form" class="upload-file" enctype="multipart/form-data" target="_blank">
                <input id="upload-file" type="file" title="" @change.stop="uploadFile('add')"/>
              </form>
            </li>
            <!--<li style="width: 110px; color: #299dff; border-color: #299dff;" title="批量更新">
              <span>批量更新</span>
              <em></em>
              <form id="update-form" class="upload-file" enctype="multipart/form-data" target="_blank">
                <input id="update-file" type="file" title="" @change.stop="uploadFile('update')"/>
              </form>
            </li>-->
            <li style="color: #299dff; border-color: #299dff;" @click.stop="export2CSV">
              <span>导出</span>
              <em></em>
            </li>
          </ul>
        </aside>
      </header>
      <section class="table-wraper"
               v-loading="!poiTableData"
               element-loading-text="加载中">
        <component :is="poiTableView" :poiTableData="poiTableData" :poiParams="poiParamsData"
                   :selectionChange="selectionChange" :updateFunc="updatePoi" :deleteFunc="deletePoi">
        </component>
      </section>
      <component :is="poiAddingView"
                 :poiType="poiDataType"
                 v-on:closePoi="closePoiOpratePopup"
                 :operateType="poiOprateType"
                 :showOprateTip="showOprateTip"
                 :poiData="poiUpdateData"
                 :poiParams="poiParamsData"
                 :poiRules="poiRulesData"
                 :regionData="currentRegion">
      </component>
    </section>
    <section class="content-wraper" id="user-manage" v-show="isUserManage">
      <header class="content-header">
        <aside>
          <ul>
            <li style="color: #1eba90 ; border-color: #1eba90 ;" @click.stop="openUserOpratePopup('register')">
              <span>新增</span>
              <em></em>
            </li>
          </ul>
        </aside>
      </header>
      <section class="table-wraper">
        <component :is="UserView" :allUserData="allUserData" :selectionChange="selectionChange"
                   :updateFunc="updateUser" :deleteFunc="deleteUser">
        </component>
      </section>
      <component :is="userAddingView" :userOprateType="userOprateType"
                   :showOprateTip="showOprateTip" :updateData="userUpdateData" v-on:closePopup='closeUserAdding'>
      </component>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Message, MessageBox } from 'element-ui'
import GeoPoi from '../util/GeoPoi'
import { export_json_to_excel } from '../util/Export2Excel'
import disasterPoiParamsConf from '../config/disasterPoiParams'
import basePoiParamsConf from '../config/basePoiParams'
import User from './userManagement/user'
import UserAdding from './userManagement/userAdding'
import poiInfoTable from './userManagement/poiInfoTable'
import poiAddingPopup from './userManagement/poiAddingPopup'

export default {
  data() {
    return {
      infoOptions: {
        'disasterPoi': { name: '灾害隐患点', subMenu: [
          { name: '潮汛关注点', value: 'tide' },
          { name: '内涝关注点', value: 'waterlog' },
          { name: '地质隐患点', value: 'geol' },
          { name: '山洪隐患点', value: 'torrent' }
        ]},
        'geoInfo': { name: '地理信息', subMenu: [
          { name: '学校信息', value: 'school' },
          { name: '医院信息', value: 'hospital' },
          { name: '危化物品', value: 'chemical' },
          { name: '避难场所', value: 'shelter' },
          { name: '人口经济', value: 'economy' },
          { name: '水库信息', value: 'reservoir' },
          { name: '救援队伍', value: 'rescueteam' }
        ]},
        'stationInfo': { name: '站点信息', subMenu: [] }
      },
      subOptions: [],
      selectedInfoOption: 'disasterPoi', //一级选项当前选中的值
      selectedSubOption: 'tide',//二级选项当前选中的值

      poiTableView: null,
      poiParamsData: [],
      poiRulesData: {},
      poiTableData: null,

      roaUrl: 'http://10.148.10.80:8111/',
      prefixUrl: 'http://10.149.3.123:9020/jm',
      userOpratePopup: false,
      userOpratePopupTitle: '',
      managementType: 'users',
      allUserData: [],
      UserView: User,
      userAddingView: null,
      userUpdateData: null,
      userOprateType: 'register',
      poiOprateType: 'adding',
      poiAddingView: null,
      poiUpdateData: null,
      regionData: null, //存储各区县的信息
      addPoiBtnShow: true, //控制新增按钮显示或隐藏
      countySel: false, //区县选项显隐
      currentCounty: null, //默认区县
      countyInfo: []
    }
  },
  components: {
    User,
    UserAdding
  },
  mounted() {
    //默认第一项的选择器
    const subMenu = this.infoOptions[this.selectedInfoOption].subMenu;
    this.subOptions = subMenu;
    if (this.isRoot) {
      this.getAllUserData();
    } else {
      this.managementType = 'info';
    }
    this.$http.get(`http://10.148.83.228:2008/projshare/geo/find/counties/cityid?cityId=${this.currentRegion.cityId}`)
      .then(res => {
        let data = res.data;
        if(data.result !== 'S_OK' || !data.tagObject.length) {
          this.countyInfo = [];
          return;
        }
        let regionData = [];
        for(let item of data.tagObject) {
          let info = {
            countyId: item.countyid,
            name: item.county,
          }
          this.countyInfo.push({
            ...info,
            center: item.center
          });
          regionData.push(info);
        }
        this.regionData = regionData;
        this.currentCounty = regionData[0].countyId;
      });
  },
  computed: {
    ...mapGetters([
      'systemTitle',
      'loginUser',
      'currentRegion',
      'isRoot',
      'regionConfig'
    ]),
    isUserManage() {
      return this.managementType === 'users' && this.isRoot;
    },
    poiDataType() {
      return this.selectedInfoOption === 'stationInfo' ? 'station' : this.selectedSubOption;
    }
  },
  watch: {
    //监视三级选择器的县区分类；
    currentCounty(val){
        if(this.selectedInfoOption === 'geoInfo'){
          this.getPoiData(this.selectedInfoOption, this.selectedSubOption, val);
        }
    },
    //监听当前值是用户管理还是信息管理；
    managementType(val) {
      if(val === 'users')
        return;
      if(this.userAddingView)
        this.userAddingView = null;
      if(!this.poiTableView)
        this.poiTableView = poiInfoTable;
      if(!this.poiTableData)
        this.getPoiData(this.selectedInfoOption, this.selectedSubOption);
    },
    //监听信息管理的一级选择器内容
    selectedInfoOption(val) {
      if(val === 'stationInfo') {
        this.selectedSubOption = null;
        this.subOptions = [];
      } else {
        const subMenu = this.infoOptions[val].subMenu;
        this.subOptions = subMenu;
        this.selectedSubOption = subMenu.length ? subMenu[0].value : val;
      }
      this.addPoiBtnShow = val !== 'stationInfo';
      this.countySel = val === 'geoInfo' && !this.currentRegion.countyId;
    },
    //监听信息管理的二级选器的内容；
    selectedSubOption(val) {
      if (val === '') {
        return;
      }
      //获取信息 管理对应选项的信息
      this.getPoiData(this.selectedInfoOption, val, this.currentCounty);
    }
  },
  methods: {
    ...mapActions([
      'gotoUserManagement',
    ]),
    //表格批量新增信息
    uploadFile(action) {
      let formId, fileBtn, suffix;
      if(action === 'add') {
        formId = 'upload-form';
        fileBtn = 'upload-file';
        suffix = '/insertFile';
      } else {
        formId = 'update-form';
        fileBtn = 'update-file';
        suffix = '/updateFile';
      }
      let formData = new FormData(document.forms[formId]);
      formData.append('table', this.selectedInfoOption === 'stationInfo' ? 'station' : this.selectedSubOption);
      formData.append('file', document.getElementById(fileBtn).files[0]);
      this.$http.post(this.prefixUrl + suffix, formData)
        .then(res => {
          res.text().then(data => {
            let fromIndex = data.indexOf('('),
                strLen = data.length;
            let dataStr = data.slice(fromIndex + 1, strLen - 2);
            let dataObj = JSON.parse(dataStr);
            if(!dataObj || !dataObj.status) {
              Message({
                type: 'warning',
                message: '文件上传失败！'
              });
            } else {
              Message({
                type: 'success',
                message: '文件上传成功！'
              });
              this.getPoiData(this.selectedInfoOption, this.selectedSubOption, this.currentCounty);
            }
          });
        });
    },
    export2CSV() {
      if(!Array.isArray(this.poiTableData) || !this.poiTableData.length) {
        Message({ type: 'error', message: '所选信息类别无数据！' });
        return;
      }
      let seledInfoOpt = this.selectedInfoOption;
      let poiParams = [], excelName = '';
      if(seledInfoOpt === 'geoInfo' || seledInfoOpt === 'stationInfo') {
        poiParams = basePoiParamsConf[seledInfoOpt === 'geoInfo' ? this.selectedSubOption : 'station'];
      } else {
        poiParams = disasterPoiParamsConf[this.selectedSubOption];
      }
      let filterOption = seledInfoOpt === 'stationInfo' ? [this.infoOptions[seledInfoOpt]]
          : this.infoOptions[seledInfoOpt].subMenu.filter(v => v.value === this.selectedSubOption);
      excelName = filterOption[0].name || '基础数据信息';

      let theaderArray = seledInfoOpt === 'stationInfo' ? [] : ['id'], exportData = [];
      for(let i in poiParams) {
        if(i === 'countyName')
          continue;
        if(i === 'expand') {
          for(let r in poiParams[i].threshold) {
            theaderArray.push(poiParams[i]['threshold'][r].label + poiParams[i].label);
            this.poiTableData.forEach((p, index) => {
              if(!exportData[index])
                exportData[index] = [];
              exportData[index].push(p.threshold[0][r]);
            });
          }
        } else {
          theaderArray.push(poiParams[i].label);
          this.poiTableData.forEach((p, index) => {
            if(!exportData[index])
              exportData[index] = seledInfoOpt !== 'stationInfo' ? [p.id] : [];
            exportData[index].push(p[i]);
          });
        }
      }
      exportData.sort((a, b) => { return a[0] - b[0] });
      let dataStr = "\ufeff" + theaderArray.join(',');
      for(let row of exportData) {
        dataStr += '\n' + row.join(',');
      }

      let blob = new Blob([dataStr], { type: 'text/csv,charset=gb2312'});
      let csvUrl = URL.createObjectURL(blob);
      let aLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
      aLink.href = csvUrl;
      aLink.download = excelName + '.csv';
      //自动触发点击事件
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
    },
    //以表格格式导出信息
    exportInfo2Excel() {
      if(!Array.isArray(this.poiTableData) || !this.poiTableData.length) {
        Message({ type: 'error', message: '所选信息类别无数据！' });
        return;
      }
      let seledInfoOpt = this.selectedInfoOption;
      let poiParams = [], excelName = '';
      if(seledInfoOpt === 'geoInfo' || seledInfoOpt === 'stationInfo') {
        poiParams = basePoiParamsConf[seledInfoOpt === 'geoInfo' ? this.selectedSubOption : 'station'];
      } else {
        poiParams = disasterPoiParamsConf[this.selectedSubOption];
      }
      let filterOption = seledInfoOpt === 'stationInfo' ? [this.infoOptions[seledInfoOpt]]
          : this.infoOptions[seledInfoOpt].subMenu.filter(v => v.value === this.selectedSubOption);
      excelName = filterOption[0].name || '基础数据信息';

      let theaderArray = seledInfoOpt === 'stationInfo' ? [] : ['id'], exportData = [];
      for(let i in poiParams) {
        if(i === 'countyName')
          continue;
        if(i === 'expand') {
          for(let r in poiParams[i].threshold) {
            theaderArray.push(poiParams[i]['threshold'][r].label + poiParams[i].label);
            this.poiTableData.forEach((p, index) => {
              if(!exportData[index])
                exportData[index] = [];
              exportData[index].push(p.threshold[0][r]);
            });
          }
        } else {
          theaderArray.push(poiParams[i].label);
          this.poiTableData.forEach((p, index) => {
            if(!exportData[index])
              exportData[index] = seledInfoOpt !== 'stationInfo' ? [p.id] : [];
            exportData[index].push(p[i]);
          });
        }
      }
      exportData.sort((a, b) => { return a[0] - b[0] });
      export_json_to_excel(theaderArray, exportData, excelName);
    },
    //判断点击编辑或添加所需要显示的信息
    openPoiOpratePopup(type, data) {
      this.poiOprateType = type;
      this.computePoiAddingOption(data);
      this.poiAddingView = poiAddingPopup;
    },
    //关闭信息管理弹出的编辑或者新增窗口；
    closePoiOpratePopup(par, operInfo) {
      this.poiAddingView = par;
      if(operInfo === 'success')
        this.getPoiData(this.selectedInfoOption, this.selectedSubOption);
    },
    //关闭用户管理弹出的编辑或者新增窗口；
    closeUserAdding(par) {
      this.userAddingView = null;
    },
    showOprateTip(tipInfo, target) {
      Message(tipInfo);
      if (target === 'user'){
        this.getAllUserData();
      } else{
        if(tipInfo.type === 'success') {
          this.getPoiData(this.selectedInfoOption, target);
        }
      }
    },
    computePoiAddingOption(data) {
      let poiRules = {},
          poiData = {};
      let seledSubOpt = this.selectedSubOption;
      let poiParams;
      if(this.selectedInfoOption === 'disasterPoi') {
        poiParams = JSON.stringify(disasterPoiParamsConf[seledSubOpt]);
      } else {
        poiParams = JSON.stringify(basePoiParamsConf[this.selectedInfoOption === 'stationInfo' ? 'station' : seledSubOpt]);
      }

      poiParams = JSON.parse(poiParams);
      if(data && data.hasOwnProperty('id'))
        poiData.id = data.id;
      for(let i in poiParams) {
        if(i === 'expand') {
          for(let r in poiParams[i].threshold) {
            let rules = poiParams[i]['threshold'][r].rules;
            if(!poiData[i])
              poiData[i] = { threshold: {} };
            poiData[i]['threshold'][r] = data ? data.threshold[0][r] : rules.value;
            if(rules.required) {
              poiRules[`${i}.threshold.${r}`] = rules;
            }
          }
        } else if(i === 'countyName') {
          for(let rg of this.regionData) {
            poiParams[i].rules.options.push({ name: rg.name, key: rg.countyId });
          }
          poiData[i] = this.regionData[0].name;
          if(poiParams[i].rules.required)
            poiRules[i] = poiParams[i].rules;
        } else {
          poiData[i] = data ? data[i] : poiParams[i].rules.value;
          if(poiParams[i].rules.required) {
            if(i === 'lon' || i === 'longitude') {
              poiRules[i] = {
                validator(rule, val, callback) {
                  if(!val)
                    callback('请输入经度');
                  else if(typeof val !== 'number')
                    callback('经度必须为数字类型');
                  else if(!/^(((\d|[1-9]\d|1[1-7]\d|0)\.\d{0,8})|(\d|[1-9]\d|1[1-7]\d|0{1,3})|180\.0{0,8}|180)$/.test(val))
                    callback('请输入正确格式的经度');
                  else
                    callback();
                },
                ...poiParams[i].rules
              };
            } else if(i === 'lat' || i === 'latitude') {
              poiRules[i] = {
                validator(rule, val, callback) {
                  if(!val)
                    callback('请输入纬度');
                  else if(typeof val !== 'number')
                    callback('经度必须为数字类型');
                  else if(!/^([0-8]?\d{1}\.\d{0,8}|90\.0{0,8}|[0-8]?\d{1}|90)$/.test(val))
                    callback('请输入正确格式的纬度');
                  else
                    callback();
                },
                ...poiParams[i].rules
              };
            } else {
              poiRules[i] = poiParams[i].rules;
            }
          }
        }
      }
      this.poiUpdateData = poiData;
      this.poiParamsData = poiParams;
      this.poiRulesData = poiRules;
    },
    updatePoi(data, index) {
      this.openPoiOpratePopup('update', data);
    },
    deletePoi(data, index) {
      MessageBox.confirm('确定要删除此信息点？', '提示', {
        type: 'warning'
      }).then(() => {
        const dataStr = JSON.stringify({id: data.id}),
              tableStr = this.selectedInfoOption === 'stationInfo' ? 'station' : this.selectedSubOption;
        this.$http.jsonp(`${this.prefixUrl}/AddDeleteUpdate`, {
          params: {
            data: dataStr,
            table: tableStr,
            action: 'delete'
          }
        }).then(res => {
            if(res.data) {
              this.poiTableData.splice(index, 1);
              Message({
                type: 'success',
                message: '删除成功'
              });
            } else {
              Message({
                type: 'error',
                message: '删除失败'
              });
            }
          })
          .catch(err => {
            Message({
              type: 'error',
              message: '删除失败'
            });
          });
      });
    },
    //获取信息管理的内容；
    async getPoiData(type, subType, countyId) {
      this.poiTableData = null;
      this.poiTableView = null;
      let curRegion = this.currentRegion;
      let geoPoi = new GeoPoi(this.$http);
      let poiData = await geoPoi.getPois(type === 'stationInfo' ? 'station' : subType, curRegion.cityId, this.countySel ? (countyId || curRegion.countyId) : undefined);

      //灾害隐患点
      if(type === 'disasterPoi') {
        let poiDataArray = [];
        if(subType === 'tide') {
          for (let item of poiData) {
            let threshold = [JSON.parse(item.rainThreshold)];
            poiDataArray.push(Object.assign(item, { threshold }));
          }
        }
        else if(subType === 'waterlog') {
          for (let item of poiData) {
            let threshold = [JSON.parse(item.threshold)];
            let countyName = null;
            for (let county of this.regionData) {
              if (county.countyId == item.countyid) {
                countyName = county.name;
              }
            }
            poiDataArray.push(Object.assign(item, {
              threshold,
              countyName,
            }));
          }
        }
        else if(subType === 'torrent' || subType === 'geol') {
          for (let item of poiData) {
            let threshold = [JSON.parse(item.threshold)];
            poiDataArray.push(Object.assign(item, {
              countyName: item.county,
              threshold
            }));
          }
        }
        this.poiParamsData = disasterPoiParamsConf[subType];
        this.poiTableData = poiDataArray;
        this.poiTableView = poiInfoTable;
      }
      //站点信息
      else if(type === 'stationInfo') {
        let thresholdParams = basePoiParamsConf['station'];
        for(let station of poiData) {
          let threshold = {};
          for(let i in thresholdParams.expand.threshold) {
            threshold[i] = station[i];
          }
          station.threshold = [threshold];
        }

        this.poiParamsData = thresholdParams;
        this.poiTableData = poiData;
        this.poiTableView = poiInfoTable;
      }
      //地理信息\救援队伍
      else if(type === 'geoInfo') {
        let prefix = '';
        switch(subType) {
          case 'school':
            prefix = '学校-';
            break;
          case 'hospital':
            prefix = '医院-';
            break;
          case 'chemical':
            prefix = '重点场所-';
            break;
          case 'shelter':
            prefix = '避难所-';
            break;
          case 'reservoir':
            prefix = '水库名称-'
            break;
          case 'economy':
            prefix = '人口经济-';
            break;
          case 'rescueteam':
            prefix = '救援队-';
            break;
        }
        let params = this.poiParamsData = basePoiParamsConf[subType];
        let filterData = [];
        for(let poi of poiData) {
          let matchEle = this.regionData.find(el => el.countyId === poi.countyId);
          poi.countyName = matchEle ? matchEle.name : '';
          poi.name = poi.name.replace(prefix, '');
          for(let i in poi) {
            if(params.hasOwnProperty(i) && params[i].rules.type === 'number')
              poi[i] = Number(poi[i]);
          }
          filterData.push(poi);
        }
        this.poiTableData = filterData;
        this.poiTableView = poiInfoTable;
      }
      return;
    },
    updateUser(data,index) {
      this.userUpdateData = data;
      this.userOprateType = 'update';
      this.openUserOpratePopup('update');
    },
    deleteUser(data, index) {
      MessageBox.confirm('确定要删除此用户？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$http.jsonp(`${this.prefixUrl}/AddDeleteUpdate`, {
          params: {
            data: JSON.stringify({ id: this.allUserData[index].id }),
            table: 'user',
            action: 'delete'
          }
        }).then(res => {
          if (res.data) {
            this.allUserData.splice(index, 1);
            Message({
              type: 'success',
              message: '删除成功'
            });
          } else {
            Message({
              type: 'error',
              message: '删除失败'
            });
          }
        });
      });
    },
    //判断是增加用户还是修改用户
    openUserOpratePopup(type, updateData) {
      if (type === 'register') {
        this.userOprateType = 'register';
        this.userOpratePopupTitle = '新增用户';
      } else {
        this.userOprateType = 'update';
        this.userOpratePopupTitle = '更新用户信息';
      }
      this.userAddingView = UserAdding;
    },
    //获取用户管理的数据
    getAllUserData() {
      this.allUserData = [];
      this.$http.jsonp(`${this.prefixUrl}/select?table=user`)
        .then(res => {
          let data = res.data;
          if(!data || !data.status || !data.listSql.length)
            return;
          data.listSql.forEach(el => {
            if (el.sign === 'root')
              return;
            this.allUserData.push({
              id: el.id,
              account: el.account,
              res: JSON.parse(el.res),
              sign: el.sign
            });
          })
        })
    },
    selectionChange() {
      console.log('selection change');
    }
  },
}
</script>


<style lang="scss" scoped>
#user-management {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f3f6f9;
  z-index: 999;
  position: absolute;
}

header.main-header {
  width: 100%;
  height: 50px;
  background-color: white;
  position: relative;
  z-index: 99;
  h1 {
    font-size: 18px;
    color: white;
    margin: 0;
    line-height: 50px;
    //width: 230px;
    float: left;
    background-color: #263b5c;
    font-weight: normal;
    box-sizing: border-box;
    padding: 0px 10px 0px 15px;
  }
  svg {
    float: left;
    path {
      fill: #263b5c;
    }
  }
  .option-wraper {
    position: relative;
    float: left;
    margin-left: 60px;
    >div[for=main-cate-control] {
      float: left;
      line-height: 50px;
      width: 120px;
      font-size: 16px;
      color: #545454;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: #299dff;
      }
    }
    span {
      width: 120px;
      height: 4px;
      background-color: #299dff;
      display: block;
      position: absolute;
      top: 46px;
      transition: left .3s ease-out;
    }
  }
  >aside {
    float: right;
    height: 100%;
    section.user-info {
      min-width: 100px;
      box-sizing: border-box;
      padding-left: 10px;
      float: left;
      border-left: solid 1px #e9eff5;
      height: 30px;
      margin: 10px 0;
      cursor: pointer;
      .user-image {
        background: url('../assets/management/user.png') center center no-repeat;
        width: 20px;
        height: 24px;
        float: left;
        transform: translateY(4px);
        margin-right: 10px;
      }
      >span {
        font-size: 12px;
        color: #4cafff;
        line-height: 30px;
        float: left;
        padding-right: 10px;
      }
      em {
        background: url('../assets/management/exit.png') center center no-repeat;
        width: 20px;
        height: 30px;
        float: left;
        padding: 0 10px;
        border-left: solid 1px #e9eff5;
      }
    }
  }
}

.content-wraper {
  width: calc(100% - 40px);
  height: calc(100% - 70px);
  position: relative;
  margin: 10px 20px;
  background: white;
  header {
    height: 50px;
    position: relative;
    margin: 0px 20px;
    border-bottom: solid 1px #e9eff5;
    .user-manage-select {
      width: 140px;
      height: 30px;
      margin: 10px 0px;
    }
  }
  aside {
    float: right;
    li {
      height: 30px;
      position: relative;
      margin: 10px 10px 10px 0px;
      box-sizing: border-box;
      width: 80px;
      border: solid 1px violet;
      border-radius: 3px;
      float: left;
      cursor: pointer;
      &:hover {
        box-shadow: 1px 1px 2px rgba(0, 0, 0, .2);
      }
      &:last-of-type {
        margin-right: 0;
      }
      &:nth-child(1) {
        em {
          background-image: url('../assets/management/add.png');
        }
      }
      &:nth-child(2),
      &:nth-child(3) {
        em {
          background-image: url('../assets/management/import.png');
        }
      }
      &:nth-child(4) {
        em {
          background-image: url('../assets/management/export.png');
        }
      }
      span {
        font-size: 14px;
        float: left;
        margin-left: 15px;
        line-height: 29px;
      }
      em {
        background-position: center center;
        background-repeat: no-repeat;
        margin-left: 10px;
        display: block;
        width: 12px;
        float: left;
        line-height: 29px;
        height: 11px;
        transform: translateY(8px);
      }
      input[type='file'] {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border: none;
        color: transparent;
        opacity: 0;
        filter: alpha(opacity=0);
        cursor: pointer;
      }
    }
  }
}

.poi-select-wraper {
  background-color: white;
  display: inline-block;
  position: absolute;
  top: 45px;
  left: 0px;
  z-index: 100;
  width: 94px;
  border: 1px solid #e9eff5;
  border-radius: 3px;
  box-shadow: 0px 1px 10px -6px #000;
  li {
    width: 100%;
    box-sizing: border-box;
    padding-left: 10px;
    color: #545454;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    &:hover {
      background-color: #dfe7f2;
    }
  }
}

.table-wraper {
  height: calc(100% - 91px);
  position: relative;
  background-color: white;
  margin: 20px;
}

.user-register-popup {
  li {
    text-align: left;
    width: 190px;
    margin: 0 auto;
    height: 26px;
    margin-bottom: 10px;
  }
  label {
    font-size: 14px;
    display: inline-block;
    width: 60px;
    line-height: 26px;
    margin-right: 10px;
  }
  input,
  select {
    line-height: 26px;
    height: 26px;
    font-size: 12px;
    border-radius: 2px;
    border: solid 1px #dcdcdc;
    box-sizing: border-box;
    width: 120px;
    color: #545454;
  }
  input {
    padding-left: 6px;
  }
  select {
    padding-left: 1px;
  }
}

.register-btn-wraper {
  width: 190px;
  margin: 20px auto 0 auto;
  li {
    // float: left;
    width: 100%;
    height: 30px;
    line-height: 29px;
    font-size: 12px;
    margin: auto;
    border-radius: 3px;
    box-sizing: border-box;
    border: solid 1px #4cafff;
    color: #299dff;
    cursor: pointer;
    &:hover {
      color: white;
      background-color: #299dff;
    }
  }
}

</style>
<style lang="scss">

  .el-dialog--small {
    width: 620px!important;
  }
  .el-dialog__header {
    padding: 0;
    height:30px;
    width:100%;
    background-color: #263B5C;
    line-height: 30px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .el-dialog__title{
    color: white;
    font-size: 14px;
    line-height: 30px;
  }
  .el-dialog__headerbtn {
    float: right;
    padding: 0 15px;
    font-size: 12px;
    cursor: pointer;
  }
  .el-dialog__body{
    width: calc(100% - 20px);
    position: relative;
    padding: 20px 0px 0px 20px;
    color: #48576a;
    font-size: 12px;
    overflow: hidden;
  }
  .el-dialog__body form{
    overflow: hidden;
    font-size: 0;
  }
  .el-dialog__body form >div{
    width: 280px;
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
    clear: left;
    display: inline-block;
    vertical-align: top;
  }
  .el-dialog__body form >div label{
    width: 100px;
    font-size: 12px;
    float: left;
    text-align: left;
    padding: 0px;
    line-height: 24px;
    height: 24px;

  }
  .el-dialog__body form >div >*{
    float: left;
  }
  .el-dialog__body form >div >div{
    width: 180px;
    line-height: 24px;
  }
  .el-dialog__body form >div >div >div inout{
    height: 24px;
  }
  .el-input__inner{
    height: 24px;
  }
  .el-button .el-button--default{
    margin: 0;
  }
  .tijiao > div{
    width:100%!important;
    margin-left: 300px;
    text-align: right;
  }
  .tijia button{
    margin-right:30px;
  }

  .upload-file {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .el-upload {
      width: 100%;
      height: 100%;
    }
  }

  .delete {
    color: #ff4f51;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  .edit {
    color: #1dae37;
    cursor: pointer;
    margin-right: 10px;
    &:hover {
      text-decoration: underline;
    }
  }
</style>

