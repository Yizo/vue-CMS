<template>
  <div class="dynamicip">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>服务器群组管理</el-breadcrumb-item>
      <el-breadcrumb-item>动态IP配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warp_filter">
      <el-row>
        <el-button type="primary" @click="add1" style="margin-bottom: 10px">新增</el-button>
        <el-button type="primary" @click="push" style="margin-bottom: 10px">推送</el-button>
      </el-row>
      <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="url"
            label="IP/域名">
            <template scope="scope">
              <a href="javascrip:void(0)">{{scope.row.url}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="region"
            label="区域">
          </el-table-column>
          <el-table-column
            prop="priority"
            label="优先级">
          </el-table-column>
          <el-table-column
            label="操作功能">
            <template scope="scope">
            <span>
                <el-button size="small" @click="update1(scope.row)">修改</el-button>
                <el-button type="danger" size="small" @click="del1(scope.row)">删除</el-button>
            </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!--新增-->
    <el-dialog :title="pageInfo.name" v-model="dialogVisible" size="tiny">
      <el-form :model="form" label-width="120px" label-position="left">
        <el-form-item label="URL">
          <el-input v-model="form.url" auto-complete="off"></el-input>
          </el-input>
        </el-form-item>
        <el-form-item label="IP区域">
          <el-input v-model="form.region" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="优先级">
          <el-input v-model="form.priority" auto-complete="off" placeholder="数字越小优先级越高"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio class="radio" v-model="form.is_enabled" label="true">是</el-radio>
          <el-radio class="radio" v-model="form.is_enabled" label="false">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary">
          <span @click="add" v-if="is">确定新增</span>
          <span @click="update" v-else>确定修改</span>
        </el-button>
      </div>
    </el-dialog>
    <!--删除-->
    <el-dialog title="删除IP" v-model="dialogVisible_del" size="tiny">
      <span>您确定要删除<b style="color: orangered">{{pageInfo.name}}</b></span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible_del = false">取 消</el-button>
    <el-button type="primary" @click="del">确 定</el-button>
  </span>
    </el-dialog>
    <!--分页-->
    <!--    <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="totalSize"
          class="page">
        </el-pagination>-->
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import * as JS from '../../../assets/js/js'
  export default {
    data(){
      return {
        tableData: [],
        currentPage: 1,
        totalSize: 10,
        /*弹窗*/
        dialogVisible: false,
        dialogVisible_del: false,
        is: true,
        pageInfo: {
          index: 1,
          data: '',
          name: ''
        },
        form: {
          url: '',
          region: '',
          priority: '',
          is_enabled: 'false'
        }
      }
    },
    methods: {
      setForm(data){
        var forms = this.form;
        forms.url = data.url;
        forms.region = data.region;
        forms.priority = data.priority
        forms.is_enabled = String(data.is_enabled);
      },
      /*获取IP/域名信息*/
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.dynamic_servers,
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
      /*新增IP*/
      addInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'POST',
            url: API.dynamic_servers,
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
      /*删除IP*/
      delInfo(id, parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'DELETE',
            url: API.dynamic_servers + '/' + id,
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
      /*修改IP*/
      upInfo(id, parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'PATCH',
            url: API.dynamic_servers + '/' + id,
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
      /*分页*/
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getuser(val)
      },
      add1(){
        this.dialogVisible = true;
        this.pageInfo.name = '新增IP'
        for (var i in this.form) {
          this.form[i] = ''
        }
        this.form.is_enabled = 'false'
        this.is = true
      },
      add(){
        if (JS.checkEmpty(this.form)) {
          if (JS.isDigit(this.form.priority)) {
            this.addInfo(this.form).then(res => {
              if (res.data.success) {
                this.getInfo().then(res => {
                  this.tableData = res.data.data.dynamic_servers
                })
                this.dialogVisible = false;
                this.$message({
                  message: '新增成功',
                  type: 'success'
                });
              } else {
                this.$message({
                  message: '格式错误',
                  type: 'error'
                });
              }
            })
          } else {
            this.$message({
              message: '格式错误',
              type: 'error'
            });
          }
        } else {
          this.$message({
            message: '不能为空',
            type: 'warning'
          });
        }
      },
      update1(data){
        this.dialogVisible = true
        this.pageInfo.name = '修改IP'
        this.pageInfo.data = data;
        this.setForm(data);
        this.is = false
      },
      update(){
        if (JS.checkEmpty(this.form)) {
          this.upInfo(this.pageInfo.data.id, this.form).then(res => {
            if (res.data.success) {
              this.getInfo().then(res => {
                this.tableData = res.data.data.dynamic_servers
              })
              this.dialogVisible = false;
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            } else {
              this.$message({
                message: '格式错误',
                type: 'error'
              });
            }
          })
        } else {
          this.$message({
            message: '不能为空',
            type: 'warning'
          });
        }
      },
      del1(data){
        this.pageInfo.name = data.region
        this.dialogVisible_del = true
        this.pageInfo.data = data;
      },
      del(){
        this.delInfo(this.pageInfo.data.id, this.form).then(res => {
          if (res.data.success) {
            this.getInfo().then(res => {
              this.tableData = res.data.data.dynamic_servers
            })
            this.dialogVisible_del = false;
            this.$message({
              message: '删除成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            });
          }
        })
      },
      pushInfo(){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'POST',
            url: API.dynamic_servers_push,
            headers: {'Authorization': token},
          }).then(function (res) {

            if (res.status == 200) {
              resolve(res)
            } else {
              reject(res)
            }
          })
        })
      },
      push(){
        this.$confirm('您将推送当前动态ip列表到客户端, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.pushInfo().then(res => {
            console.log(res)
            if (res.data.data.result.http_code == 200) {
              this.$message({
                type: 'success',
                duration: 1500,
                message: '推送成功!'
              });
            } else {
              this.$message({
                type: 'error',
                duration: 1500,
                message: '推送失败!'
              });
            }
          })
        })
      }

    },
    mounted(){
      this.getInfo().then(res => {
        this.tableData = res.data.data.dynamic_servers
      })
    }
  }
</script>

<style scoped>
  .dynamicip {
    padding: 10px;
  }

  .warp_filter {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }

  .el-select {
    width: 100%;
  }

  .el-table .cell img {
    height: 30px;
    margin-top: 10px;
  }
</style>

