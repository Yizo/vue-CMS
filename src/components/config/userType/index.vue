<template>
  <div id="configUserType">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>收费管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户类型配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ut-wrapper">
      <el-button type="primary" @click="handleAdd" style="margin: 15px 0;">添加</el-button>
      <el-table
        :data="user_groups"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          property="level"
          label="级别">
        </el-table-column>
        <el-table-column
          property="name"
          label="账号类型名称">
        </el-table-column>
        <el-table-column
          property="need_coins"
          label="累计钻石">
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
          label="操作"
          width="150">
          <template scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">修改
            </el-button>
            <!--            <el-button
                          size="small"
                          type="danger"
                          @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>-->
            <el-button size="small" :class="{a:scope.row.is_enabled,b:!scope.row.is_enabled}" @click="star(scope.row)">
              {{scope.row.is_enabled?'禁用':'启用'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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

    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" @close="closeBlock" class="filex_dialog">
      <el-form :model="form" label-position="left" label-width="150px" :rules="rules" ref="userType">
        <el-form-item label="级别" class="dot_tips" prop="level">
          <el-input v-model="form.level" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号类型名称" class="dot_tips" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="累计钻石" class="dot_tips" prop="need_coins">
          <el-input v-model="form.need_coins" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" style="text-align: left">
          <el-radio class="radio" v-model="form.is_enabled" label="true">启用</el-radio>
          <el-radio class="radio" v-model="form.is_enabled" label="false">禁用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import * as API from '../../../api/api'
  import {mapGetters} from 'vuex'
  export default {
    data(){
      let level = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('级别不能为空'));
          }
          setTimeout(() => {
            if (/^\d+$/.test(value) == false) {
              callback(new Error('请输入数字'));
            } else {
              callback()
            }
          }, 1000);
        },
        name = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('账号类型名称不能为空'));
          }
          setTimeout(() => {
            if (String(value).length > 0 && String(value).length <= 50) {
              callback()
            } else {
              callback(new Error('长度必须大于0小于等于50'))
            }
          }, 1000);
        },
        need_coins = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('累计钻石不能为空'));
          }
          setTimeout(() => {
            if (/^\d+$/.test(String(value)) == false) {
              callback(new Error('请输入数字'));
            } else {
              if (parseInt(value) >= 1000) {
                callback(new Error('钻石不能超过1000'));
              } else {
                callback()
              }
            }
          }, 1000);
        };
      return {
        user_groups: [],
        currentPage: 1,
        totalSize: 0,
        pageSize: 20,
        dialogTitle: '',
        dialogFormVisible: false,
        index: 0,
        form: {
          level: null,
          name: '',
          need_coins: null,
          is_enabled: "false"
        },
        rules: {
          level: [
            {validator: level, trigger: 'blur'}
          ],
          name: [
            {validator: name, trigger: 'blur'},
          ],
          need_coins: [
            {validator: need_coins, trigger: 'blur'},
          ]
        }
      }
    },
    components: {},
    methods: {
      cancel(){
        this.dialogFormVisible = false;
      },
      closeBlock(){
        this.$refs.userType.resetFields();
      },
      handleEdit(index, data){
        this.index = index;
        this.form = Object.assign({}, data);
        this.form.is_enabled = String(data.is_enabled)
        this.dialogTitle = '修改';
        this.dialogFormVisible = true;
      },
      handleDelete(){

      },
      handleAdd(){
        this.dialogTitle = '添加';
        this.dialogFormVisible = true;
        this.form = {
          level: null,
          name: '',
          need_coins: null,
          is_enabled: "false"
        }
      },
      handleSave(){
        this.$refs.userType.validate((valid) => {
          if (valid) {
            if (this.dialogTitle == '添加') {
              this.addUserType(this.form).then(res => {
                this.user_groups.push(res.data.data);
                this.dialogFormVisible = false;
                this.$message({
                  duration: 1000,
                  message: '添加成功',
                  type: 'success'
                });
              })
            } else {
              this.updateUserType(this.form).then(res => {
                this.user_groups.splice(this.index, 1, res.data.data);
                this.dialogFormVisible = false;
                this.$message({
                  duration: 1000,
                  message: '修改成功',
                  type: 'success'
                });
              })
            }
          } else {
            return false;
          }
        });
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getUserTypes({page: val, limit: this.pageSize}).then((res) => {
          const data = res.data.data
          this.user_groups = [...data.user_groups];
          this.totalSize = data.total_count;
        });
      },
      //启用或禁用
      star(data){
        this.updateUserType({id: data.id, is_enabled: !data.is_enabled}).then(res => {
          this.user_groups.splice(this.user_groups.indexOf(data), 1, res.data.data)
        })
      },
      /*添加用户类型*/
      addUserType(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'POST',
            url: API.user_types_get,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {

            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      /*修改用户类型*/
      updateUserType(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          let address = API.user_types_updata.replace(/{id}/g, parm.id);
          this.$http({
            method: 'PATCH',
            url: address,
            headers: {'Authorization': token},
            params: parm
          }).then(function (res) {

            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      getUserTypes(){
        const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
        const params = {
          page: this.currentPage,
          limit: this.limit
        };
        return this.$http({
          method: 'GET',
          url: API.user_types_get,
          headers: {'Authorization': token},
          params: params
        });
      }
    },
    mounted(){
      this.getUserTypes({page: 1, limit: this.pageSize}).then((res) => {
        const data = res.data.data
        this.user_groups = [...data.user_groups];
        this.totalSize = data.total_count;
      });
    }
  }
</script>

<style lang="less" scoped>
  #configUserType {
    padding: 10px;
  }

  .a {
    background: #F9C855;
    color: #fff;
    border: #F9C855;
  }

  .b {
    background-color: #42D885;
    border: #42D885;
    color: #fff;
  }

  .ut-wrapper {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }
</style>
