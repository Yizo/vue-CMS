<template>
  <div class="lock">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warp_filter">
      <el-button type="primary" @click="addAdmin" style="margin-bottom: 10px">新增管理员</el-button>
      <template>
        <el-table
          :data="data"
          style="width: 100%">
          <el-table-column
            prop="username"
            label="管理员账号">
          </el-table-column>
          <el-table-column
            prop="role.name"
            label="权限组">
          </el-table-column>
          <el-table-column
            prop="operation_type"
            label="最后登录时间">
            <template scope="scope">
              <span v-if="scope.row.last_signin_at">{{scope.row.last_signin_at | Time}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="admin_name"
            label="最后登录IP">
            <template scope="scope">{{scope.row.last_signin_ip}}</template>
          </el-table-column>
          <el-table-column
            label="是否启用">
            <template scope="scope">
              <el-tag
                :type="scope.row.is_enabled ? 'success' : 'primary'"
                close-transition>{{scope.row.is_enabled ? '是': '否'}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template scope="scope">
              <el-button size="small" @click="upPass(scope.row)">修改密码</el-button>
              <el-button size="small" @click="upRole(scope.row)">修改权限组</el-button>
              <el-button size="small" :disabled="!scope.row.is_enabled"
                         :class="{a:scope.row.is_enabled,b:!scope.row.is_enabled}" @click="del(scope.row)">
                {{scope.row.is_enabled?'禁用':'启用'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!--分页-->
    <el-pagination
      @current-change="handleSizeChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalSize"
      class="page">
    </el-pagination>
    <!--新增管理员-->
    <el-dialog title="新增管理员" v-model="add.visable" size="tiny" @close="closeBlcok">
      <el-form :model="add.form" :rules="add_rules" ref="add" label-position="left" label-width="180px">
        <el-form-item label="管理员用户名" prop="username">
          <el-input v-model="add.form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input v-model="add.form.password"></el-input>
        </el-form-item>
        <el-form-item label="管理员确认密码" prop="password_confirmation">
          <el-input v-model="add.form.password_confirmation"></el-input>
        </el-form-item>
        <el-form-item label="管理员权限组" prop="role_id">
          <el-select v-model="add.form.role_id" placeholder="请选择">
            <el-option
              v-for="item in roles"
              key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add.visable = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-dialog>
    <!--修改权限组-->
    <el-dialog title="修改权限组" v-model="up_role.visable" size="tiny">
      <el-form label-position="left" label-width="150px" class="demo-ruleForm">
        <el-form-item label="管理员用户名" prop="username">
          <el-input v-model="up_role.username" auto-complete="off" disabled style="width:217px"></el-input>
        </el-form-item>
        <el-form-item label="管理员权限组" prop="role_id">
          <el-select v-model="up_role.role_id" placeholder="请选择">
            <el-option
              v-for="item in roles"
              key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="up_role.visable = false">取消</el-button>
        <el-button type="primary" @click="upRoleSave()">确定</el-button>
      </div>
    </el-dialog>
    <!--修改密码-->
    <el-dialog title="修改密码" v-model="pw_visable" size="tiny" @close="closeBlcok_up">
      <el-form label-position="left" label-width="150px" :model="pw" :rules="up_pass" ref="up">
        <el-form-item label="管理员旧密码" prop="old_password">
          <el-input v-model="pw.old_password" auto-complete="off" style="width:217px"></el-input>
        </el-form-item>
        <el-form-item label="管理员新密码" prop="new_password">
          <el-input v-model="pw.new_password" auto-complete="off" style="width:217px"></el-input>
        </el-form-item>
        <el-form-item label="管理员确认密码" prop="password_confirmation">
          <el-input v-model="pw.password_confirmation" auto-complete="off" style="width:217px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pw_visable = false">取消</el-button>
        <el-button type="primary" @click="upPassHave()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import axios from 'axios'
  export default {
    data(){
      let confirm = (rule, value, callback) => {
        if (value === this.add.form.password) {
          callback()
        } else {
          callback(new Error('两次输入密码不一致'))
        }
      }, confirm2 = (rule, value, callback) => {
        if (value === this.pw.new_password) {
          callback()
        } else {
          callback(new Error('两次输入密码不一致'))
        }
      };
      return {
        data: [],
        pageSize: 20,
        currentPage: 1,
        totalSize: 0,
        roles: [],
        //新增校验
        add_rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'},
            {min: 5, message: '用户名长度至少为5', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {min: 6, message: '密码长度至少为6', trigger: 'blur'}
          ],
          password_confirmation: [
            {required: true, message: '确认密码不能为空', trigger: 'blur'},
            {min: 6, message: '确认密码长度至少为6', trigger: 'blur'},
            {validator: confirm, trigger: 'blur'}
          ],
          role_id: [
            {type: 'number', required: true, message: '权限组不能为空', trigger: 'blur'},
          ]
        },
        //修改密码校验
        up_pass: {
          old_password: [
            {required: true, message: '旧密码不能为空', trigger: 'blur'},
            {min: 5, message: '旧密码长度至少为6', trigger: 'blur'}
          ],
          new_password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {min: 6, message: '密码长度至少为6', trigger: 'blur'}
          ],
          password_confirmation: [
            {required: true, message: '确认密码不能为空', trigger: 'blur'},
            {min: 6, message: '确认密码长度至少为6', trigger: 'blur'},
            {validator: confirm2, trigger: 'blur'}
          ]
        },
        add: {
          visable: false,
          form: {
            username: '',
            password: '',
            password_confirmation: '',
            role_id: null
          },
        },
        //修改权限组
        up_role: {
          index: 0,
          visable: false,
          username: '',
          id: 0,
          role_id: null
        },
        //修改密码
        pw_visable: false,
        pw: {
          id: 0,
          old_password: '',
          new_password: '',
          password_confirmation: ''
        }
      }
    },
    computed: {
      formName(){
        return this.add.form
      }
    },
    methods: {
      /*管理员管理-列表*/
      admin_list(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          axios({
            method: 'GET',
            url: API.admins,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {
            if (res.status == 200) {
              resolve(res)
            }
          }).catch(function (err) {
            reject(err)
          })
        })
      },
      /*管理员管理-禁用*/
      admin_disable(parm){
        let address = API.admins_disable.replace(/{id}/g, parm.id);
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          axios({
            method: 'POST',
            url: address,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {
            if (res.status == 200) {
              resolve(res)
            }
          }).catch(function (err) {
            reject(err)
          })
        })
      },
      /*管理员管理-创建*/
      admin_create(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          axios({
            method: 'POST',
            url: API.admins,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {
            if (res.status == 200) {
              resolve(res)
            }
          }).catch(function (err) {
            reject(err)
          })
        })
      },
      /*管理员管理-更新*/
      admin_up(parm){
        let address = API.admins_up.replace(/{id}/g, parm.id);
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          axios({
            method: 'PATCH',
            url: address,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {
            if (res.status == 200) {
              resolve(res)
            }
          }).catch(function (err) {
            reject(err)
          })
        })
      },
      /*管理权限组管理-列表*/
      roles_list(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          axios({
            method: 'GET',
            url: API.admin_roles,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {
            if (res.status == 200) {
              resolve(res)
            }
          }).catch(function (err) {
            reject(err)
          })
        })
      },
      getData(val){
        return new Promise((resolve, reject) => {
          this.admin_list({page: val, limit: this.pageSize}).then(res => {
            let data = res.data.data;
            this.data = data.admins;
            this.currentPage = data.current_page
            this.totalSize = data.total_count;
            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      closeBlcok(){
        this.$refs.add.resetFields();
      },
      closeBlcok_up(){
        this.$refs.up.resetFields();
      },
      handleSizeChange(val){
        this.getData(val)
      },
      //新增
      addAdmin(){
        this.add.visable = true;
      },
      //保存新增
      handleSave(){
        this.$refs.add.validate((valid) => {
          if (valid) {
            this.admin_create(this.add.form).then(res => {
              if (res.data.success) {
                this.add.visable = false;
                this.data.push(res.data.data)
                this.totalSize = this.totalSize + 1
              }
            })
          } else {
            return false;
          }
        });
      },
      //启用或禁用
      del(data){
        let star = '';
        if (data.is_enabled) {
          star = '禁用'
        } else {
          star = '启用'
        }
        this.$confirm('您将' + star + '账号' + data.username + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.admin_disable({id: data.id}).then(res => {
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: star + '成功!'
              });
              this.data[this.data.indexOf(data)].is_enabled = false;
            } else {
              this.$message({
                type: 'error',
                message: star + '失败'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      //修改密码
      upPass(data){
        this.pw.id = data.id;
        this.pw_visable = true
      },
      //确认修改密码
      upPassHave(){
        this.$refs.up.validate((valid) => {
          if (valid) {
            this.admin_up(this.pw).then(res => {
              let ID = res.data.data.id;
              let adminID = JSON.parse(window.sessionStorage.getItem('loginInfo')).admin_id;
              if (res.data.success) {
                this.$message({
                  duration: 1000,
                  type: 'success',
                  message: '修改成功',
                  onClose: () => {
                    if (ID === adminID) {
                      window.sessionStorage.removeItem('loginInfo');
                      this.$router.push({path: '/login'})
                    }
                  }
                });
                this.pw_visable = false
              }
            })
          }
        })
      },
      //修改权限组
      upRole(data){
        this.up_role.visable = true;
        this.up_role.username = data.username;
        this.up_role.role_id = data.role.id
        this.up_role.id = data.id
        this.index = this.data.indexOf(data)
      },
      upRoleSave(){
        this.admin_up({id: this.up_role.id, role_id: this.up_role.role_id}).then(res => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.up_role.visable = false;
            this.data.splice(this.index, 1, res.data.data)
          }
        })
      }
    },
    mounted(){
      this.getData(1).then(res => {
        this.roles_list().then(res => {
          this.roles = res.data.data.roles;
        })
      })
    }
  }
</script>

<style scoped>
  .lock {
    padding: 10px;
  }

  .warp_filter {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }

  .a {
    background: #F9C855;
    color: #fff;
    border: #F9C855;
  }

  .b {
    background-color: #ccc;
    border: #ccc;
    color: #fff;
  }
</style>

