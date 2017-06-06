<template>
  <div class="serertype">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'hardware' }">收费管理</el-breadcrumb-item>
      <el-breadcrumb-item>服务类型配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warp_filter">
      <el-button type="info" size="small" @click="add1" style="margin-bottom: 10px">新增</el-button>
      <!--表格-->
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="level"
          label="级别"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="name"
          label="服务类型名称">
        </el-table-column>
        <el-table-column
          prop="description"
          label="服务类型描述">
        </el-table-column>
        <el-table-column
          prop="user_group_name"
          label="最低账号类型等级">
        </el-table-column>
        <el-table-column
          prop="expense_coins"
          label="所需钻石"
        >
        </el-table-column>
        <el-table-column
          prop="times_for_monthly"
          label="转为包月次数">
        </el-table-column>
        <el-table-column
          label="是否转化包月">
          <template scope="scope">
            <el-tag
              :type="scope.row.is_enabled ? 'success' : 'primary'"
              close-transition>{{scope.row.is_enabled ? '是': '否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="上行限速">
          <template scope="scope">
            {{scope.row.limit_speed_up}}kb/s
          </template>
        </el-table-column>
        <el-table-column
          label="下行限速">
          <template scope="scope">
            {{scope.row.limit_speed_down}}kb/s
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template scope="scope">
            <el-button type="button" size="small" @click="update(scope.$index,scope.row)">修改</el-button>
            <!--<el-button type="danger" size="small" @click="del1(scope.row)">删除</el-button>-->
            <el-button size="small" :class="{a:scope.row.is_enabled,b:!scope.row.is_enabled}" @click="star(scope.row)">
              {{scope.row.is_enabled?'禁用':'启用'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalSize"
        class="page">
      </el-pagination>

      <!--新增弹窗-->
      <el-dialog :title="pageInfo.name" v-model="dialogTableVisible_add" size="tiny" @close="closeBlcok">
        <el-form :model="form" label-width="200px" label-position="left" ref="serverType" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="服务类型名称" prop="name" class="dot_tips">
                <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="服务类型描述" prop="description">
                <el-input v-model="form.description" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="级别" prop="level" class="dot_tips">
                <el-input v-model="form.level" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="最低账号类型" prop="user_group_id" class="dot_tips">
                <el-select v-model="form.user_group_id">
                  <el-option
                    v-for="(item,index) in group"
                    :label="item.name"
                    :value="item.id"
                    :key="index" selected>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="所需钻石" prop="expense_coins" class="dot_tips">
                <el-input v-model="form.expense_coins" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="转为包月次数" prop="times_for_monthly">
                <el-input v-model="form.times_for_monthly" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="上行限速" prop="limit_speed_up">
                <el-input v-model="form.limit_speed_up" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="下行限速" prop="limit_speed_down">
                <el-input v-model="form.limit_speed_down" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="是否启用此类型">
                <el-radio class="radio" v-model="form.is_enabled" label="true">是</el-radio>
                <el-radio class="radio" v-model="form.is_enabled" label="false">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="是否可以转为包月状态">
                <el-radio class="radio" v-model="form.can_be_monthly" label="true">是</el-radio>
                <el-radio class="radio" v-model="form.can_be_monthly" label="false">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible_add = false">取 消</el-button>
          <el-button type="primary">
            <span v-if="is=='增加'?true:false" @click="add">确 定</span>
            <span v-else @click="updateSave">确定</span>
          </el-button>
        </div>
      </el-dialog>
      <!--删除弹窗-->
      <el-dialog title="删除" v-model="dialogVisible_del" size="tiny">
        <span>您确定要删除{{pageInfo.name}}吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible_del = false">取 消</el-button>
          <el-button type="primary" @click="del">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  export default {
    data(){
      /*非必填数字*/
      let number = (rule, value, callback) => {
          setTimeout(() => {
            if (value === '') {
              callback();
            } else if (/^\d+$/.test(String(value)) == false) {
              callback(new Error('请输入数字'));
            } else {
              callback();
            }
          }, 1000);
        },
        /*必填数字*/
        number2 = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('级别不能为空'));
          }
          setTimeout(() => {
            if (/^\d+$/.test(String(value)) == false) {
              callback(new Error('请输入数字'));
            } else {
              callback()
            }
          }, 1000);
        },
        length = (rule, value, callback) => {
          setTimeout(() => {
            if (String(value).length <= 255) {
              callback();
            } else {
              callback(new Error('长度必须小于255'))
            }
          }, 1000);
        }, lengthName = (rule, value, callback) => {
          setTimeout(() => {
            if (String(value).length <= 50) {
              callback();
            } else {
              callback(new Error('长度必须小于50'))
            }
          }, 1000);
        }, group = (rule, value, callback) => {
          if (value) {
            callback();
          } else {
            callback(new Error('请选择最低账号类型'))
          }

        };
      return {
        /*列表*/
        tableData: [],
        /*弹窗*/
        dialogTableVisible_add: false,
        dialogVisible_del: false,
        dialogTable: '',
        //判断是修改还是增加
        is: '增加',
        //表单数据
        form: {
          level: '',
          name: '',
          description: '',
          user_group_id: '',
          expense_coins: '',
          times_for_monthly: '',
          is_enabled: 'true',
          can_be_monthly: 'true',
          limit_speed_up: 0,
          limit_speed_down: 0
        },
        //账号等级
        group: '',
        //当前行数据
        pageInfo: {
          index: 0,
          data: '',
          name: ''
        },
        /*分页*/
        currentPage: 1,
        totalSize: 0,
        pageSize: 20,
        total: 1,
        rules: {
          name: [
            {required: true, message: '服务器类型名称必填', trigger: 'blur'},
            {validator: lengthName, trigger: 'blur'},
          ],
          description: [
            {validator: length, trigger: 'change'},
          ],
          level: [
            {validator: number2, trigger: 'blur'},
          ],
          user_group_id: [
            {validator: group, trigger: 'change'},
          ],
          expense_coins: [
            {validator: number2, trigger: 'blur'},
          ],
          times_for_monthly: [
            {validator: number, trigger: 'change'},
          ],
          limit_speed_up: [
            {validator: number, trigger: 'change'},
          ],
          limit_speed_down: [
            {validator: number, trigger: 'change'},
          ]
        }
      }
    },
    methods: {
      /*获取服务器列表*/
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.server_node_types_update,
            headers: {'Authorization': token},
            params: parm,
          }).then(function (res) {

            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      /*获取账号等级信息*/
      GradeInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.user_types_get,
            headers: {'Authorization': token},
            params: parm,
          }).then(function (res) {

            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      /*新增服务器列表*/
      addServer(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'POST',
            url: API.server_node_types_update,
            headers: {'Authorization': token},
            params: parm,
          }).then(function (res) {

            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      closeBlcok(){
        this.$refs.serverType.resetFields();
      },
      add(){
        let options = {
          name: this.form.name,
          description: this.form.description,
          level: this.form.level,
          user_group_id: this.form.user_group_id,
          expense_coins: this.form.expense_coins,
          can_be_monthly: this.form.is_enabled,
          times_for_monthly: this.form.times_for_monthly,
          is_enabled: this.form.is_enabled,
          limit_speed_up: this.form.limit_speed_up,
          limit_speed_down: this.form.limit_speed_down
        }
        this.$refs.serverType.validate((valid) => {
          if (valid) {
            this.addServer(options).then(res => {
              if (res.data.messages) {
                this.$message({
                  message: res.data.messages[0],
                  type: 'error'
                })
              } else {
                this.dialogTableVisible_add = false;
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.getInfo({null}).then(res => {
                  this.tableData = res.data.data.node_types
                  this.currentPage = res.data.data.current_page
                  this.total = res.data.data.total_pages
                })
              }
            })
          }
        })
      },
      add1(){
        this.dialogTableVisible_add = true;
        this.pageInfo.name = '新增'
        this.is = '增加'
        for (var key in this.form) {
          this.form[key] = ''
        }
        this.form.is_enabled = 'true'
        this.GradeInfo({is_enabled: 'true'}).then(res => {
          this.group = res.data.data.user_groups
        })
      },
      /*更新服务器列表*/
      updateServer(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'PATCH',
            url: API.server_node_types_update + parm.id,
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
      update(index, data){
        this.form = Object.assign({}, data)
        this.form.can_be_monthly = String(data.can_be_monthly)
        this.form.is_enabled = String(data.is_enabled);
        this.pageInfo.index = index
        this.pageInfo.data = data
        this.pageInfo.name = '修改'
        this.is = '修改';
        this.dialogTableVisible_add = true;
        this.GradeInfo({is_enabled: 'true'}).then(res => {
          this.group = res.data.data.user_groups
        })
      },
      updateSave(){
        var options = {
          id: this.pageInfo.data.id,
          name: this.form.name,
          description: this.form.description,
          level: this.form.level,
          user_group_id: this.form.user_group_id,
          expense_coins: this.form.expense_coins,
          can_be_monthly: this.form.can_be_monthly,
          times_for_monthly: this.form.times_for_monthly,
          is_enabled: this.form.is_enabled
        }
        this.$refs.serverType.validate((valid) => {
          if (valid) {
            this.updateServer(options).then(res => {

              if (res.data.messages) {
                this.$message({
                  message: res.data.messages[0],
                  type: 'error'
                })
              } else {
                this.dialogTableVisible_add = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.getInfo({null}).then(res => {
                  this.tableData = res.data.data.node_types
                  this.currentPage = res.data.data.current_page
                  this.total = res.data.data.total_pages
                })
              }
            })
          }
        })
      },
      /*删除服务器列表*/
      delServer(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'DELETE',
            url: API.server_node_types_update + parm.id,
            headers: {'Authorization': token},
            params: {
              id: parm.id
            },
          }).then(function (res) {

            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      del1(data){
        this.pageInfo.name = data.name;
        this.pageInfo.data = data;
        this.dialogVisible_del = true
      },
      del(){
        this.delServer({id: this.pageInfo.data.id}).then(res => {
          if (res.data.messages) {
            this.$message({
              message: res.data.messages[0],
              type: 'error'
            })
          } else {
            this.dialogVisible_del = false;
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getInfo({null}).then(res => {
              this.tableData = res.data.data.node_types
              this.currentPage = res.data.data.current_page
              this.total = res.data.data.total_pages
            })
          }
        })
      },
      //停用或启用
      star(data){
        this.updateServer({id: data.id, is_enabled: !data.is_enabled}).then(res => {
          this.tableData.splice(this.tableData.indexOf(data), 1, res.data.data)
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getUserTypes({page: val, limit: this.pageSize}).then((res) => {
          const data = res.data.data
          this.tableData = [...data.node_types];
          this.totalSize = data.total_count;
        });
      },
    },
    mounted(){
      this.getInfo({page: 1, limit: this.pageSize}).then(res => {
        const data = res.data.data
        this.tableData = [...data.node_types];
        this.totalSize = data.total_count;
      })
    }
  }
</script>

<style scoped>
  .serertype {
    padding: 10px;
  }

  /*导航*/
  .serertype .breadcrumb {
    height: 30px;
    line-height: 30px;
  }

  .warp_filter {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }

  .el-form-item__label {

  }

  .el-select {
    width: 100%;
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
</style>
