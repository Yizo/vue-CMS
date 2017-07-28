<template>
  <div id="serverList">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>服务器群组管理</el-breadcrumb-item>
      <el-breadcrumb-item>服务器配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="server-list-wrapper">
      <el-button type="primary" @click="handleAdd" style="margin: 15px 0;">添加</el-button>
      <el-tooltip class="item" effect="light" placement="bottom-end">
        <el-button style="position: absolute;top:70px;right: 20px">增加新的服务器流程</el-button>
        <div slot="content">
          <pre>
          约定:
          - 每个地域有对应的服务类型，每个服务器也有对应的服务类型
          - 同一个代理线路的一级和二级代理的服务类型必须相同
          - 服务器名称格式建议，如一台在日本的第3台二级代理服务器，名称为: 日本03-l2

          流程:
          1 首先在后台管理将服务器配置添加好，状态为禁用(如果地域配置下已有其他正在启用的服务器，则不需要禁用)
          2 得到一级和二级服务器的线路编号，把编号告诉运维同事
          3 运维同事将代理服务器部署完成
          4 到后台管理启用相关地域和服务器配置(如果地域配置下已有其他正在启用的服务器，则不需要做这一步)

          例如: 为至尊服务增加一台代理服务器线路，其中一级代理在青岛，二级代理在日本。

          1 添加一级代理
          1.1 到 服务器群组管理 - 地域配置 检查是否存在服务类型为"至尊服务"的"中国"地域，如不存在，则添加:
          - 服务类型: 至尊服务
          - 地域名称: 中国
          - 国旗图标(简写可百度查询ISO 3166-1二位字母小写简写): cn
          - 是否启用(如果地域配置下已有其他正在启用的服务器，则为是，否则为否): 否
          1.2 到 服务器群组管理 - 服务器配置 添加
          - 服务类型: 至尊服务
          - 地域: 中国
          - 线路名称(假如这是第2台在青岛的服务器): 青岛02-l1
          - 最大连接数(目前不做限制，所以设置的数值较大): 9999999
          - 国外标识: 国内
          - 线路级别: 1级
          - 是否启用: 否
          2 添加二级代理
          2.1 到 服务器群组管理 - 地域配置 检查是否存在服务类型为"至尊服务"的"日本"地域，如不存在，则添加:
          - 服务类型: 至尊服务
          - 地域名称: 中国
          - 国旗图标(简写可百度查询ISO 3166-1二位字母小写简写): cn
          - 是否启用(如果地域配置下已有其他正在启用的服务器，则为是，否则为否): 否
          2.2 到 服务器群组管理 - 服务器配置 添加
          - 服务类型: 至尊服务
          - 地域: 日本
          - 线路名称(假如这是第3台在日本的服务器): 日本03-l1
          - 最大连接数(目前不做限制，所以设置的数值较大): 9999999
          - 国外标识: 国外
          - 线路级别: 2级
          - 是否启用: 否
          </pre>
        </div>
      </el-tooltip>
      <el-table
        :data="nodes"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="线路编号"
          property="id"
          width="100">
        </el-table-column>
        <el-table-column
          label="服务器类型"
          property="node_type_name">
        </el-table-column>
        <el-table-column
          label="所属地域"
          property="region_name">
        </el-table-column>
        <el-table-column
          label="线路名称"
          property="name">
        </el-table-column>
        <el-table-column
          label="服务器IP"
          property="url">
        </el-table-column>
        <el-table-column
          label="最大连接数"
          property="max_connections_count">
        </el-table-column>
        <el-table-column
          label="代理等级"
          property="level">
        </el-table-column>
        <el-table-column
          label="国外标识">
          <template scope="scope">
            <span>{{scope.row.is_domestic ? '国内' : '国外'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否启用"
          property="is_enabled">
          <template scope="scope">
            <el-tag
              :type="scope.row.is_enabled ? 'success' : 'primary'"
              close-transition>{{scope.row.is_enabled ? '是' : '否'}}
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
            <el-button
              size="small"
              :type="scope.row.is_enabled?'warning':'success'"
              @click="handleEnabled(scope.$index, scope.row)">{{scope.row.is_enabled ? '停用' : '启用'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: right;margin: 15px 0">
        <!--分页-->
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalSize"
          class="page">
        </el-pagination>
      </div>
    </div>

    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" @close="closeBlcok" class="filex_dialog">
      <el-form :model="form" label-position="right" label-width="150px" :rules="rules" ref="serverlist">
        <el-form-item label="线路编号" prop="id" class="dot_tips">
          <el-input v-model="form.id" auto-complete="off" class="dot_tips" :disabled="dialogTitle=='修改'"></el-input>
        </el-form-item>
        <el-form-item label="服务器类型" prop="node_type_id">
          <template>
            <el-select v-model="form.node_type_id" placeholder="请选择" class="dot_tips">
              <el-option
                v-for="(item,index) in nodeName2"
                key="index"
                :label="item.name"
                :value="item.level">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="所属地域" prop="node_region_id">
          <template>
            <el-select v-model="form.node_region_id" @visible-change="regionChange()" placeholder="请选择"
                       class="dot_tips">
              <el-option
                v-for="item in areaName2"
                key="item.id"
                :label="item.node_type_name+' - '+item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="线路名称" prop="name">
          <el-input v-model="form.name" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="服务器IP" prop="url">
          <el-input v-model="form.url" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="服务器端口" prop="port" class="dot_tips">
          <el-input v-model="form.port" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务器密码" prop="password">
          <el-input v-model="form.password" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="加密方式" prop="encrypt_method">
          <el-input v-model="form.encrypt_method" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="最大连接数" prop="max_connections_count">
          <el-input v-model="form.max_connections_count" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="国外标识">
          <template scope>
            <el-radio-group v-model="form.is_domestic">
              <el-radio label="true">国内</el-radio>
              <el-radio label="false">国外</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="线路级别">
          <template scope>
            <el-radio-group v-model="form.level">
              <el-radio label="1">1</el-radio>
              <el-radio label="2">2</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="是否启用">
          <template scope>
            <el-radio-group v-model="form.is_enabled">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">暂不处理</el-button>
        <el-button type="primary" @click="handleSave">确定保存</el-button>
      </div>
    </el-dialog>
  </div>

</template>


<script>
  import * as API from '../../../api/api';
  import * as JS from '../../../assets/js/js'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data(){
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
        }, IP = (rule, value, callback) => {
          let is = /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/.test(value)
          if (!is) {
            callback(new Error('请输入合法的IP地址'));
          } else {
            callback();
          }
        }, /*必填数字*/
        number2 = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('端口不能为空'));
          }
          setTimeout(() => {
            if (/^\d+$/.test(String(value)) == false) {
              callback(new Error('请输入数字'));
            } else {
              callback()
            }
          }, 1000);
        }, numberId = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('线路编号不能为空'));
          }
          setTimeout(() => {
            if (/^\d+$/.test(String(value)) == false) {
              callback(new Error('请输入数字'));
            } else {
              callback()
            }
          }, 1000);
        };
      return {
        currentPage: 1,
        pageSize: 20,
        totalSize: 0,
        nodes: [],
        formLabelWidth: '128px',
        form_id: 0,
        form: {
          id: 0,
          node_type_id: '',
          node_region_id: '',
          name: '',
          url: '',
          port: null,
          password: '',
          encrypt_method: '',
          description: '',
          max_connections_count: '',
          is_enabled: 'true',
          is_domestic: 'true',
          level: '1'
        },
        dialogTitle: '',
        dialogFormVisible: false,
        currentRow: null,
        rules: {
          id: [{validator: numberId, trigger: 'blur'}],
          node_type_id: {type: 'number', required: true, message: '服务器类型不能为空', trigger: 'blur'},
          node_region_id: {type: 'number', required: true, message: '所属地域不能为空', trigger: 'blur'},
          name: {required: true, message: '线路名称不能为空', trigger: 'blur'},
          url: [{required: true, message: '服务器IP不能为空', trigger: 'blur'},
            {validator: IP, trigger: 'blur'}],
          port: [{validator: number2, trigger: 'blur'}],
          password: {required: true, message: '服务器密码不能为空', trigger: 'blur'},
          encrypt_method: {required: true, message: '加密方式不能为空', trigger: 'blur'},
          max_connections_count: {validator: number, trigger: 'blur'}
        }
      }
    },
    computed: {
      ...mapGetters({
        nodeName2: 'nodeTypeNames',
        areaName2: 'areaTypeName'
      })
    },
    methods: {
      ...mapActions({
        nodeType: 'getNodeType',
        areaType: 'getArea'
      }),
      closeBlcok(){
        this.$refs.serverlist.resetFields();
      },
      handleAdd(){
        this.serverItem = {
          id: '',
          region_id: '',
          region_name: '',
          url: '',
          max_connections_count: '',
          is_enabled: 'enabled1'
        };
        this.dialogTitle = '添加';
        this.dialogFormVisible = true;
        this.form = {
          node_type_id: '',
          node_region_id: '',
          name: '',
          url: '',
          port: null,
          password: '',
          encrypt_method: '',
          description: '',
          max_connections_count: '',
          is_enabled: 'true',
          is_domestic: 'true',
          level: '1'
        }
      },
      regionChange(){
        if (!arguments[0]) {
          this.serverItem.name = '';
        }
      },
      handleEdit(index, row){
        this.form_id = row.id;
        this.form = {
          id: row.id,
          node_type_id: row.node_type_id,
          node_region_id: row.region_id,
          name: row.name,
          url: row.url,
          port: row.port,
          password: row.password,
          encrypt_method: row.encrypt_method,
          description: row.description,
          max_connections_count: row.max_connections_count,
          is_enabled: String(row.is_enabled),
          is_domestic: String(row.is_domestic),
          level: String(row.level),
        };
        this.dialogFormVisible = true;
        this.dialogTitle = '修改';
      },
      handleEnabled(index, data){
        let title = data.is_enabled ? "停用" : "启用";
        this.$confirm('您在执行' + title + '操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateNodesType({id: data.id, is_enabled: !data.is_enabled}).then(res => {
            this.nodes.splice(index, 1, res.data.data)
            this.$message({
              type: 'success',
              message: title + '成功!'
            });
          }).catch(err => {
            this.$message({
              type: 'error',
              message: title + '失败'
            });
          })
        })
      },
      handleSave(){
        this.$refs.serverlist.validate((valid) => {
          if (valid) {
            this.form.level = parseInt(this.form.level)
            if (this.dialogTitle == '添加') {
              this.addInfo(this.form).then(res => {
                if (res.data.success) {
                  this.getServerList();
                  this.$message({
                    showClose: true,
                    message: '添加成功',
                    type: 'success'
                  });
                  this.dialogFormVisible = false;
                }
              })
            }
            if (this.dialogTitle == '修改') {
              this.upDateInfo(this.form_id, this.form).then(res => {
                if (res.data.success) {
                  this.getServerList();
                  this.$message({
                    showClose: true,
                    message: '修改成功',
                    type: 'success'
                  });
                  this.dialogFormVisible = false;
                }
              })
            }
          }
        })
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.getInfo({page: val, limit: this.pageSize}).then((res) => {
          const data = res.data.data;
          this.totalSize = data.total_count;
          this.nodes = [...data.nodes];
        })
      },
      getServerListPromise(){
        const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
        const page = this.currentPage;
        const limit = this.limit;
        const region_id = this.region_id;
        const method = 'GET';
        const url = API.server_list_get;
        const headers = {'Authorization': token};
        const params = {
          page,
          limit,
          region_id
        };
        return this.$http({
          method,
          url,
          headers,
          params
        })
      },
      getServerList(){
        this.getServerListPromise({page: 1, limit: this.pageSize}).then((res) => {
          const data = res.data.data;
          this.totalSize = data.total_count;
          this.currentPage = data.current_page;
          this.nodes = [...data.nodes];
        })
      },
      /*启用或停用*/
      updateNodesType(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          let address = API.server_list_update.replace(/{id}/g, parm.id);
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
      /*获取列表*/
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.server_list_get,
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
      /*新增*/
      addInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'POST',
            url: API.server_list_add,
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
      /*修改*/
      upDateInfo(id, parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          let address = API.server_list_update.replace(/{id}/g, id);
          this.$http({
            method: 'PATCH',
            url: address,
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
    },
    mounted(){
      this.nodeType({is_enabled: 'true'})
      this.areaType({is_enabled: 'true'})
    },
    beforeMount(){
      this.getServerList();
    }
  }
</script>

<style scoped>
  #serverList {
    padding: 10px;
  }

  .server-list-wrapper {
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #D3DCE6;
    margin-top: 20px;
  }

  .el-dialog__header {
    text-align: left;
  }

  .el-form-item__content {
    text-align: left;
  }

  .el-table th > .cell {
    text-align: left;
  }

  .el-form-item__label {
    text-indent: 30px;
    position: relative;
  }

  .el-select {
    width: 100%;
  }
</style>
