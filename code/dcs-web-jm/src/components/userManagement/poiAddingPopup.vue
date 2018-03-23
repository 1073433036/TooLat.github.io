<template>
  <main id="disaster-poi-adding">
    <el-dialog :title="operateTitle + '信息点'" v-model="displayOption"
               size="small" @close="closePopup" class="poi-adding--title"
               :modal="true" :modal-append-to-body="false" top="10%">
      <el-form :model="poiData"
               ref="poiData"
               :rules="poiRules">
        <template v-for="(item, key) in poiParams">
          <el-form-item v-if="key !== 'expand'" :key="key" :label="item.label" :prop="key">
              <el-input v-if="item.rules.type === 'string'"
                        :disabled="item.rules.disabled"
                        type="text"
                        v-model="poiData[key]"></el-input>
              <el-input v-if="item.rules.type === 'number'"
                        :disabled="item.rules.disabled"
                        type="number"
                        v-model.number="poiData[key]"></el-input>
              <el-select v-if="item.rules.options" v-model="poiData[key]" placeholder="请选择">
                <el-option v-for="el in item.rules.options" :key="el.key" :value="el.name" :label="el.name"></el-option>
              </el-select>
          </el-form-item>
          <template v-else>
            <el-form-item class="line" :label='item.label'></el-form-item>
            <el-form-item v-for="(el, subKey) in item.threshold" :key="transProp(subKey)" :label="el.label" :prop="transProp(subKey)">
              <el-input type="number" v-model.number="poiData.expand.threshold[subKey]"></el-input>
            </el-form-item>
          </template>
        </template>
        <el-form-item class="submit-btn">
          <el-button type="primary" class="submit-btn--style" @click.stop="excueUserOprate">提交</el-button>
          <el-button class="reset-btn--style" @click.stop="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </main>
</template>

<script>
export default {
  props: {
    operateType: String,
    showOprateTip: Function,
    poiType: String,
    poiData: Object,
    poiParams: Object,
    poiRules: Object,
    regionData: Object
  },
  data() {
    return {
      displayOption: true
    }
  },
  computed: {
    operateTitle() {
      return this.operateType === 'adding' ? '新增' : '更新';
    }
  },
  methods: {
    transProp(key) {
      return `expand.threshold.${key}`;
    },
    //点击关闭编辑窗口，发送数据给父组件，同时重置表单数据
    closePopup(){
      this.$emit('closePoi',null);
      this.$refs['poiData'].resetFields();
    },
    resetForm() {
      this.$refs['poiData'].resetFields();
    },
    excueUserOprate() {
      this.$refs['poiData'].validate(valid => {
        if (!valid)
          return;
        let params = Object.assign({}, this.poiData);
        if(params.expand) {
          if(this.poiType === 'station') {
            params = Object.assign(params, this.poiData.expand.threshold);
          } else {
            let key = this.poiType === 'tide' ? 'rainThreshold' : 'threshold';
            params[key] = JSON.stringify(this.poiData.expand.threshold);
          }
          delete params.expand;
        }
        if(params.countyName) {
          delete params.countyName;
        }
        params.cityId = this.regionData.cityId;
        if(this.regionData.countyId)
          params.countyId = this.regionData.countyId;
        const dataStr = JSON.stringify(params);
        this.$http.jsonp('http://10.149.65.54:9020/taishan/AddDeleteUpdate', { params: {
          data: dataStr,
          table: this.poiType,
          action: this.operateType === 'adding' ? 'add' : 'update'
        }}).then(res => {
          this.closePopup(null, 'success');
          const operStatus = res.data.status || false;
          const operateTip = this.operateTitle + (operStatus ? '成功' : '失败');
          this.showOprateTip({
            message: operateTip,
            type: operStatus ? 'success' : 'warning',
            duration: 2000
          }, this.poiType);
        })
        .catch(err => {
          this.closePopup(null, 'fail');
          this.showOprateTip({
            message: `${this.operateTitle}失败`,
            type: 'warning',
            duration: 2000
          }, this.poiType);
        });
      })
    },
  }
}
</script>

<style lang="scss">

  .poi-adding--title {
    .el-dialog__headerbtn {
      padding: 8px 15px !important;
    }
  }

  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: rgba(234, 237, 230, .5) !important;
  }

  .el-dialog--small {
    width: 620px !important;
  }
  .line{
    width: calc(100% - 20px) !important;
    height: 30px;
    margin: 0;
    line-height: 30px;
  }
  .line label.el-form-item__label{
    display: inline-block;
    height: 40px;
    margin: 0;
    line-height: 40px;
  }
  .submit-btn {
    width: calc(100% - 20px) !important;
    text-align: right;
    div {
      width: auto !important;
      display: inline-block;
      float: right !important;
    }
  }
</style>
