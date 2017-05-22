<template>
  <div class="config">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'start' }">配置管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数配置</el-breadcrumb-item>
    </el-breadcrumb>

    <!--表格-->
    <div style="padding: 10px;background-color: #fff;text-align: left">
      <el-button type="primary" @click="add">添加</el-button>
      <el-table
        :data="tableData"
        border
        style="width: 100%;margin-top: 10px">
        <el-table-column
          prop="id"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="key"
          label="键名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="value"
          label="键值">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          label="操作">
          <template scope="scope">
            <el-button size="small" @click="update(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="15"
      layout="total, prev, pager, next, jumper"
      :total="totalSize"
      class="page">
    </el-pagination>
    <!--新增弹窗-->
    <el-dialog :title="pageInfo.name" v-model="dialogTableVisible_add" size="tiny">
      <el-form :model="form" label-width="100px" label-position="left">
        <el-form-item label="平台">
          <span class="bj-rot">*</span>
          <el-select v-model="form.platform" placeholder="请选择">
            <el-option
              v-for="item in platform"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本">
          <span class="bj-rot">*</span>
          <el-select v-model="form.app_version" placeholder="请选择">
            <el-option
              v-for="(item,index) in versions.app_versions"
              :label="item.name"
              :value="item.name" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="键名">
          <span class="bj-rot">*</span>
          <el-input v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item label="键值">
          <span class="bj-rot">*</span>
          <el-input v-model="form.value"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible_add = false">取 消</el-button>
        <el-button type="primary">
          <span @click="save">确定</span>
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { mapGetters,mapActions } from 'vuex'
  import * as API from '../../../api/api'
  export default {
      data(){
          return {
            tableData:[],
            //分页
            currentPage:0,
            totalSize:0,
            /*弹窗*/
            platform:[
              {label:'全部',value:'all'},
              {label:'IOS',value:'ios'},
              {label:'Android',value:'android'},
              {label:'PC',value:'pc'},
              {label:'MAC',value:'mac'},
            ],
            pageInfo:{
                id:0,
                name:''
            },
            dialogTableVisible_add:false,
            form:{
              platform:'',
              app_version:'',
              key:'',
              value:'',
              description:''
            }
          }
      },
      computed:{
        ...mapGetters(['versions']),
      },
      methods:{
        /*获取*/
        getList(parm){
          return  new Promise( (resolve,reject) => {
            const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
            this.$http({
              method:'GET',
              url:API.system_settings,
              headers: {'Authorization': token},
              params:parm,
            }).then(function(res){

              if(res.status == 200){
                resolve(res)
              }else{
                reject(res)
              }
            })
          })
        },
        /*添加*/
        addInfo(parm){
          return  new Promise( (resolve,reject) => {
            const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
            this.$http({
              method:'POST',
              url:API.system_settings,
              headers: {'Authorization': token},
              params:parm,
            }).then(function(res){

              if(res.status == 200){
                resolve(res)
              }else{
                reject(res)
              }
            })
          })
        },
        /*删除*/
        delInfo(parm){
          return  new Promise( (resolve,reject) => {
            const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
            let address = API.system_settings_up.replace(/{id}/g,parm.id);
            this.$http({
              method:'DELETE',
              url:address,
              headers: {'Authorization': token},
              params:parm,
            }).then(function(res){

              if(res.status == 200){
                resolve(res)
              }else{
                reject(res)
              }
            })
          })
        },
        /*更新*/
        upInfo(parm){
          return  new Promise( (resolve,reject) => {
            const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
            let address = API.system_settings_up.replace(/{id}/g,parm.id);
            this.$http({
              method:'PATCH',
              url:address,
              headers: {'Authorization': token},
              params:parm,
            }).then(function(res){

              if(res.status == 200){
                resolve(res)
              }else{
                reject(res)
              }
            })
          })
        },
        getData(val){
          this.getList({page:val,limit:15}).then(res=>{
            this.tableData = res.data.data.settings;
            this.currentPage = res.data.data.current_page;
            this.totalSize = res.data.data.total_count
          })
        },
        handleCurrentChange(val){
          this.getData(val)
        },
        add(){
          this.pageInfo.name = '添加配置'
          this.dialogTableVisible_add = true
          this.form = {
            platform:'',
            app_version:'',
            key:'',
            value:'',
            description:''
          }
        },
        update(data){
          this.pageInfo.name = '修改配置'
          this.pageInfo.id = data.id
          this.dialogTableVisible_add = true
          this.form = data
        },
        del(data){
          this.pageInfo.name = '删除配置'
          this.$confirm('此将删除删除配置'+data.key+',是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var options = this.form;
            options.id = data.id;
            this.delInfo(options).then(res=>{
              this.getData(1)
              this.dialogTableVisible_add = false;
              this.$message({
                message: '恭喜你，添加成功',
                duration:1000,
                type: 'success'
              });
            })
          })
        },
        save(){
            /*保存添加*/
            if(this.pageInfo.name === '添加配置'){
              if(this.form.app_version == '全部版本'){
                this.form.app_version = 'all'
              }
              this.addInfo(this.form).then(res=>{
                  this.getData(1)
                  this.dialogTableVisible_add = true;
                  this.$message({
                    message: '恭喜你，添加成功',
                    duration:1000,
                    type: 'success'
                  });
              })
            }
            /*保存修改*/
            if(this.pageInfo.name === '修改配置'){
              var options = this.form;
              options.id = this.pageInfo.id;
              if(this.form.app_version == '全部版本'){
                this.form.app_version = 'all'
              }
              this.upInfo(options).then(res=>{
                this.getData(1)
                this.dialogTableVisible_add = false;
                this.$message({
                  message: '恭喜你，添加成功',
                  duration:1000,
                  type: 'success'
                });
              })
            }
        }
      },
      mounted(){
        this.getData(1)
      }
  }
</script>
<style scope>
  .config{
    padding: 10px;
  }
  .breadcrumb{
    height: 30px;
    line-height: 30px;
  }
  .page{
    text-align: right;
    margin-top: 20px;
  }
  .el-form-item__content{
    text-align: left;
  }
</style>
