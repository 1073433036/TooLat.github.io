<template>
  <main class="DepartmentEditPopup">
    <div v-drag>
      <header class="infoFormPopup_header">
        部门管理
        <i class="el-icon-close userPopup_close" @click="editDepartClose"></i>
      </header>
      <section class="DepartmentEditPopup_main">
        <header class="Dem_header">
          <span>部门列表</span>
        </header>
        <div class="table_depart_title">
          <span class="span_1">部门</span>
          <span class="span_2">传真号</span>
          <span class="span_3">操作</span>
        </div>
        <ul class="table_depart">
          <li class="table_depart_content" v-for="(item,key) in tableData" :key="key">
            <div class="div_1">
              {{item.department}}
              <input type="text" v-model="inputDatas[key].department" v-if="item.editFlag">
            </div>
            <div class="div_2">
              {{item.scan}}
              <input type="tel" v-model="inputDatas[key].scan" v-if="item.editFlag">
            </div>
            <div class="div_3">
              <i class="el-icon-edit-outline" title="编辑" v-if="!item.editFlag" @click="clickHandle('edit',item,key)"></i>
              <i class="el-icon-close" title="删除" v-if="!item.editFlag" @click="clickHandle('delete',item,key)"></i>
              <i class="el-icon-circle-check-outline" title="确认"
                 v-if="item.editFlag"
                 @click="clickHandle('success',item,key)"></i>
              <i class="el-icon-circle-close-outline" title="取消"
                 v-if="item.editFlag"
                 @click="clickHandle('cancel',item,key)"></i>
            </div>
          </li>
        </ul>
        <div class="table_depart_add">
          <h5 class="">添加部门</h5>
          <section class="table_depart_add_main">
            <div class="div_1">
              <input type="text" placeholder="输入部门名称" v-model="addDepartmentData.department">
            </div>
            <div class="div_2">
              <input type="tel"  placeholder="输入部门传真号" v-model.number="addDepartmentData.scan">
            </div>
            <div class="div_3">
              <small class="small_ok" title="确认" @click="addDepartment">确认</small>
              <small class="small_resize" title="取消"  @click="resizeDepartment">清空</small>
            </div>
          </section>
        </div>
      </section>
    </div>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop } from 'vue-property-decorator'
  import departmentInfoHttp from "../../../util/DepartmentInfoHttp"
  import InfoFormPopup from "../InfoManagePopup/InfoFormPopup.vue"
  const DepartmentInfoHttp = new departmentInfoHttp()
  @Component({
    components:{

    }
  })
  export default class DepartmentEditPopup extends Vue {
    tableData: { did?: number, department: string, scan: string,office:string, editFlag:boolean }[]= []
    inputDatas:{ department: string, scan: string,office:string }[]=[]
    addDepartmentData:any={
      department: "",
      scan: "",
      office: ""
    }
    @Prop()
    editDepartClose
    //点击部门信息
    async clickHandle(par:string,item:any,key:number){
      switch(par){
        case 'edit' ://编辑
          item.editFlag=true
          this.inputDatas[key].department=item.department
          this.inputDatas[key].scan=item.scan
          break
        case 'delete'://删除
          let resDel= await DepartmentInfoHttp.deleteDerpartment({dids:[item.did]})
          if(resDel){
            this.$message.success(`${item.department}部门已删除`);
            this.getDepartmentTypes()
          }else{
            this.$message.error(`${item.department}部门删除失败`)
          }
          break
        case 'cancel' ://取消
          item.editFlag=false
          break
        case 'success' ://确认
          if(item.department==this.inputDatas[key].department&&item.scan==this.inputDatas[key].scan){
            item.editFlag=false
            return
          }
          item.editFlag=false
          item.department=this.inputDatas[key].department
          item.scan=this.inputDatas[key].scan
          let resEdit= await DepartmentInfoHttp.editDepartment({ did: item.did, department: item.department, scan: item.scan,office:item.office})
          if(resEdit){
            this.$message.success(`${item.department}部门已修改`);
            this.getDepartmentTypes()
          }else{
            this.$message.error(`${item.department}部门修改失败`)
          }
          break
      }
    }
    //获取部门信息
    async getDepartmentTypes(){
      let arr:any=[]
      this.inputDatas=[]
      let res = await DepartmentInfoHttp.getDepartmentTypes({})
      res.forEach(v=>{
        arr.push({
          did: v.did,
          department: v.department,
          scan: v.scan,
          office:v.office,
          editFlag:false
        })
        this.inputDatas.push({
          department: v.department,
          scan: v.scan,
          office:v.office,
        })
      })
      this.tableData=arr
      arr=null
    }

    //添加添加部门确认
    async addDepartment(){
      if(!this.addDepartmentData.department)return
      let res = await DepartmentInfoHttp.addDerpartment({departmentInfos: [this.addDepartmentData]})
      if(res){
        this.$message.success('部门添加成功');
        this.addDepartmentData={department: "", scan: "", office: ""}
        this.getDepartmentTypes()
      }else{
        this.$message.error('部门添加失败')
      }
    }
    //清空输入框填写部门的内容
    resizeDepartment(){
      this.addDepartmentData={department: "", scan: "", office: ""}
    }
    mounted(){
      this.getDepartmentTypes()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/theme.scss';
  .DepartmentEditPopup{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99;
    background: rgba(204, 204, 204, 0.01);
    >div{
      position: absolute;
      width: 700px;
      max-height: 600px;
      left: 50%;
      top: 200px;
      margin-left: -350px;
      background: white;
      box-shadow: 0 0 10px #ccc;
      .infoFormPopup_header{
        position: relative;
        line-height: 36px;
        height: 36px;
        color: white;
        background: #11A9F5;
        cursor: move;
        padding-left: 18px;
        font-family: "Microsoft YaHei";
        padding-right: 40px;
        overflow: hidden;
        .userPopup_close{
          position: absolute;
          text-align: center;
          cursor: pointer;
          font-size: 18px;
          top: 0;
          right: 0;
          height: 36px;
          width: 36px;
          color: white;
          line-height: 36px;
        }
      }
      .DepartmentEditPopup_main{
        padding: 0px 20px 20px 20px;
        box-sizing: border-box;
        width: 100%;
        .Dem_header{
          height: 30px;
          padding: 10px 0px;
          color: #11A9F5;
          span{
            line-height: 30px;
            font-size: 14px;
          }
        }
        .table_depart_title{
          width: 100%;
          height: 38px;
          background: #ebeef5;
          line-height: 38px;
          box-shadow: 0px 3px 10px #dfe4ed;/*no*/
          span{
            float: left;
            text-align: left;
            text-indent: 10px;
          }
          .span_1{
            width: 40%;
            margin-right: 5%;
          }
          .span_2{
            width: 30%;
            margin-right: 5%;
          }
          .span_3{
            width: 20%;
            text-align: center;
          }
        }
        .table_depart{
          max-height: 300px;
          overflow-y: auto;
          padding-bottom: 10px;
          @include scrollStyle;
          li{
            height: 30px;
            width: 100%;
            line-height: 30px;
          }
          .table_depart_content{
            margin-top: 5px;
            height: 36px;
            div{
              float: left;
              height: 100%;
              position: relative;
              text-indent: 10px;
              line-height: 38px;
              font-size: 12px;
              font-family: "Microsoft YaHei";
              input{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                line-height: 34px;
                outline: none;
                border: none;
                background: white;
                border:1px solid #ebeef5;
                text-indent: 9px;
                font-size: 12px;
                font-family: "Microsoft YaHei";
              }
            }
            .div_1{
              width: 40%;
              margin-right: 5%;
            }
            .div_2{
              width: 30%;
              margin-right: 5%;
            }
            .div_3{
              width: 20%;
              line-height: 36px;
              font-size: 16px;/*no*/
              text-align: center;
              i{
                cursor: pointer;
              }
            }
          }
        }
        .table_depart_add{
          h5{
            height: 30px;
            width: 100%;
            display: block;
            line-height: 30px;
            padding: 10px 0px;
            font-size: 14px;
            color: #11A9F5;
          }
          .table_depart_add_main{
            overflow: hidden;
            >div{
              float: left;
              line-height: 36px;
              position: relative;
              height: 36px;
              input{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                line-height: 34px;
                outline: none;
                border: none;
                background: white;
                border:1px solid #ebeef5;
                text-indent: 9px;
                font-size: 12px;
                font-family: "Microsoft YaHei";
              }
            }
            .div_1{
              width: 40%;
              margin-right: 5%;
            }
            .div_2{
              width: 30%;
              margin-right: 5%;
            }
            .div_3{
              width: 20%;
              line-height: 36px;
              font-size: 16px;/*no*/
              text-align: center;
              small{
                cursor: pointer;
              }
              .small_resize:hover{
                color: red;
              }
              .small_ok:hover{
                color: #11A9F5;
              }
            }
          }
        }
      }
    }

  }

</style>
