<template>
  <div class="lock">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>后台权限组管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warp_filter">
      <el-button type="primary" style="margin-bottom: 10px" @click="addRole">新增</el-button>
      <template>
        <el-table
          :data="data"

          style="width: 100%">
          <el-table-column
            prop="name"
            label="权限组名"
            width="120px">
          </el-table-column>
          <el-table-column
          prop="username"
          label="新增权限组">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.manage_role_create ? '&#xe649;' : '' }}</i>
            </template>
        </el-table-column>
          <el-table-column
            prop="operation_type"
            label="删除权限组">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.manage_role_delete ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="admin_name"
            label="修改权限组">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.manage_role_update ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="修改管理员密码">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.admin_password_update ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation_type"
            label="修改管理员权限组">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.admin_role_update ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="admin_name"
            label="用户信息修改权限">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.user_info_update ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation_type"
            label="查看用户基础信息页面">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.user_base_info ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="admin_name"
            label="查看用户行为页面">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.user_behaviour ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="查看运营行为页面">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.operation_behaviour ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation_type"
            label="查看收费管理页面">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.charge_manage ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="admin_name"
            label="查看后台管理页面">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.back_stage_manage ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>

          <el-table-column
            prop="operation_type"
            label="查看用户管理页面">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.user_manage ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="admin_name"
            label="查看服务器群组管理页面">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.node_manage ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="查看参数配置页面">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.system_setting ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation_type"
            label="查看渠道版本配置页面">
            <template scope="scope">
              <i class="iconfont">{{ scope.row.system_enum ? '&#xe649;' : '' }}</i>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150px">
            <template scope="scope">
              <el-button size="small" @click="upRole(scope.row)">修改</el-button>
              <el-button type="warning" size="small" @click="delRole(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!--分页-->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalSize"
        class="page">
      </el-pagination>

    <!--增加权限组-->
    <el-dialog title="增加权限组" v-model="add_role.visable" size="tiny">
      <el-form label-position="left"  label-width="150px" class="demo-ruleForm">
        <el-form-item label="权限组名">
          <el-input v-model="roles.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">新增权限组</span>
            <el-checkbox v-model="roles.manage_role_create"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">修改权限组</span>
            <el-checkbox v-model="roles.manage_role_update"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">删除权限组</span>
            <el-checkbox v-model="roles.manage_role_delete"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">修改管理员密码</span>
            <el-checkbox v-model="roles.admin_password_update"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">修改管理员权限组</span>
            <el-checkbox v-model="roles.admin_role_update"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">修改用户信息</span>
            <el-checkbox v-model="roles.user_info_update"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">查看用户基础信息</span>
            <el-checkbox v-model="roles.user_base_info"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">用户行为</span>
            <el-checkbox v-model="roles.user_behaviour"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">运营行为</span>
            <el-checkbox v-model="roles.operation_behaviour"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">收费管理</span>
            <el-checkbox v-model="roles.charge_manage"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">后台管理</span>
            <el-checkbox v-model="roles.back_stage_manage"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">用户管理</span>
            <el-checkbox v-model="roles.user_manage"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">服务器群组管理</span>
            <el-checkbox v-model="roles.node_manage"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">系统配置</span>
            <el-checkbox v-model="roles.system_setting"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">渠道版本配置</span>
            <el-checkbox v-model="roles.system_enum"></el-checkbox>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add_role.visable = false">取消</el-button>
        <el-button type="primary" @click="addRoleSave()">确定</el-button>
      </div>
    </el-dialog>
    <!--修改权限组-->
    <el-dialog title="修改权限组" v-model="up_role.visable" size="tiny">
      <el-form label-position="left"  label-width="150px" class="demo-ruleForm">
        <el-form-item label="权限组名">
          <el-input v-model="roles.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">新增权限组</span>
            <el-checkbox v-model="roles.manage_role_create"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">修改权限组</span>
            <el-checkbox v-model="roles.manage_role_update"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">删除权限组</span>
            <el-checkbox v-model="roles.manage_role_delete"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">修改管理员密码</span>
            <el-checkbox v-model="roles.admin_password_update"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">修改管理员权限组</span>
            <el-checkbox v-model="roles.admin_role_update"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">修改用户信息</span>
            <el-checkbox v-model="roles.user_info_update"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">查看用户基础信息</span>
            <el-checkbox v-model="roles.user_base_info"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">用户行为</span>
            <el-checkbox v-model="roles.user_behaviour"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">运营行为</span>
            <el-checkbox v-model="roles.operation_behaviour"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">收费管理</span>
            <el-checkbox v-model="roles.charge_manage"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">后台管理</span>
            <el-checkbox v-model="roles.back_stage_manage"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">用户管理</span>
            <el-checkbox v-model="roles.user_manage"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">服务器群组管理</span>
            <el-checkbox v-model="roles.node_manage"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <span class="r_lable">系统配置</span>
            <el-checkbox v-model="roles.system_setting"></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <span class="r_lable">渠道版本配置</span>
            <el-checkbox v-model="roles.system_enum"></el-checkbox>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="up_role.visable = false">取消</el-button>
        <el-button type="primary" @click="upRoleSave()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import '../../../assets/fonts/iconfont.css'
  import axios from 'axios'
  export default {
    data(){
      return {
        data:[],
        pageSize:15,
        currentPage:1,
        totalSize:0,
        roles:{
          name:'',
          manage_role_create: false, //新增权限组
          manage_role_update: false, //修改权限组
          manage_role_delete: false, //删除权限组
          admin_password_update: false, //修改管理员密码
          admin_role_update: false, //修改管理员权限组
          user_info_update: false, //修改用户信息
          user_base_info: false, //查看用户基础信息
          user_behaviour: false, //用户行为
          operation_behaviour: false, //运营行为
          charge_manage: false, //收费管理
          back_stage_manage: false, //后台管理
          user_manage: false, //用户管理
          node_manage: false, //服务器群组管理
          system_setting: false, //系统配置
          system_enum: false, //渠道版本配置
        },
        add_role:{
          visable:false,
        },
        up_role:{
          id:0,
          index:0,
          visable:false,
        }
      }
    },
    methods:{
      /*管理权限组管理-列表*/
      roles_list(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          axios({
            method:'GET',
            url:API.admin_roles,
            headers: {'Authorization': token},
            params:parm
          }).then(function(res){
            if(res.status == 200){
              resolve(res)
            }
          }).catch(function(err){
            reject(err)
          })
        })
      },
      /*管理权限组管理-创建*/
      roles_create(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          axios({
            method:'POST',
            url:API.admin_roles,
            headers: {'Authorization': token},
            params:parm
          }).then(function(res){
            if(res.status == 200){
              resolve(res)
            }
          }).catch(function(err){
            reject(err)
          })
        })
      },
      /*管理权限组管理-删除*/
      roles_del(parm){
        let address = API.admin_roles_up.replace(/{id}/g,parm.id);
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          axios({
            method:'DELETE',
            url:address,
            headers: {'Authorization': token},
            params:parm
          }).then(function(res){
            if(res.status == 200){
              resolve(res)
            }
          }).catch(function(err){
            reject(err)
          })
        })
      },
      /*管理权限组管理-更新*/
      roles_up(parm){
        let address = API.admin_roles_up.replace(/{id}/g,parm.id);
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          axios({
            method:'PATCH',
            url:address,
            headers: {'Authorization': token},
            params:parm
          }).then(function(res){
            if(res.status == 200){
              resolve(res)
            }
          }).catch(function(err){
            reject(err)
          })
        })
      },
      getData(val){
          this.roles_list({page:val,limit:this.pageSize}).then(res=>{
            if(res.data.success){
                  let data = res.data.data;
                  this.data = data.roles;
                  this.currentPage = data.current_page
                  this.totalSize = data.total_count
            }else{
              this.$message({
                type: 'error',
                message: '网络异常'
              });
            }
          })
      },
      //格式化参数
      formtParm(data){
        for(var i in data){
            if(i != 'name'){
                data[i] = String(data[i])
            }
        }
      },
      handleCurrentChange(val){
        this.getData(val)
      },
      /*新增权限组*/
      addRole(){
        this.add_role.visable = true
        for(var i in this.roles){
            if(i == 'name'){
              this.roles[i] = ''
            }else{
               this.roles[i] = false
            }
        }
      },
      addRoleSave(){
        this.formtParm(this.roles)
        if(this.roles.name){
          this.roles_create(this.roles).then(res=>{
            if(res.data.success){
              this.add_role.visable = false
              this.data.push(res.data.data)
              this.totalSize = this.totalSize + 1
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              });
            }else{
              this.$message({
                showClose: true,
                message: '添加失败',
                type: 'error'
              });
            }
          })
        }else{
          this.$message({
            type: 'info',
            message: '权限组名不能为空'
          });
        }
      },
      /*修改权限组*/
      upRole(data){
        this.up_role.visable = true
        this.roles = data
        this.up_role.id = data.id
        this.up_role.index = this.data.indexOf(data)
      },
      upRoleSave(){
        this.formtParm(this.roles)
        if(this.roles.name){
          this.roles.id = this.up_role.id
          this.roles_up(this.roles).then(res=>{
            if(res.data.success){
              this.data.splice(this.up_role.index,1,res.data.data);
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              });
              this.up_role.visable = false
            }else{
              this.$message({
                showClose: true,
                message: '添加失败',
                type: 'error'
              });
            }
          })
        }else{
          this.$message({
            type: 'info',
            message: '权限组名不能为空'
          });
        }
      },
      //删除权限组
      delRole(data){
        this.$confirm('您将删除权限组'+data.name+', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.roles_del({id:data.id}).then(res=>{
            if(res.data.success){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.data.splice(this.data.indexOf(data),1)
              this.totalSize = this.totalSize - 1
            }else{
              this.$message({
                type: 'error',
                message: '删除失败'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    },
    mounted(){
      this.getData(1)
    }
  }
</script>

<style scoped>
  .lock{
    padding: 10px;
  }
  .warp_filter{
    text-align: left;
    padding: 10px;
    background-color:#fff;
    border:1px solid #D3DCE6;
    margin-top: 20px;
  }
  .page{
    text-align: right;
    margin-top: 20px;
  }
  .iconfont{
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }
  .el-row{
    height: 40px;
    line-height: 40px;
  }
  .el-col{
    text-align: left;
  }
  .r_lable{
    display: inline-block;
    width: 150px;
  }
  .el-form-item{
    text-align: left;
  }
</style>

