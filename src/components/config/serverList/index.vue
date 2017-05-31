<template>
  <div id="serverList">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>服务器群组管理</el-breadcrumb-item>
      <el-breadcrumb-item>服务器配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="server-list-wrapper">
      <el-button type="primary" @click="handleAdd" style="margin: 15px 0;">添加</el-button>
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
            <span>{{scope.row.is_domestic?'国内':'国外'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="启用"
          property="is_enabled">
          <template scope="scope">
            <span>{{scope.row.is_enabled?'是':'否'}}</span>
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
              @click="handleEnabled(scope.$index, scope.row)">{{scope.row.is_enabled?'停用':'启用'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: right;margin: 15px 0">
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

    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" size="tiny">
      <el-form :model="form" label-position="left" label-width="150px">
        <el-form-item label="服务器类型">
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
        <el-form-item label="所属地域">
          <template>
            <el-select v-model="form.node_region_id" @visible-change="regionChange()" placeholder="请选择"
                       class="dot_tips">
              <el-option
                v-for="item in areaName2"
                key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="线路名称">
          <el-input v-model="form.name" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="服务器IP">
          <el-input v-model="form.url" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="服务器端口">
          <el-input v-model="form.port" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="服务器密码">
          <el-input v-model="form.password" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="加密方式">
          <el-input v-model="form.encrypt_method" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="最大连接数">
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
      return {
        currentPage: 1,
        pageSize: 15,
        totalSize: 0,
        nodes: [],
        formLabelWidth: '128px',
        form_id: 0,
        form: {
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
        currentRow: null
      }
    },
    computed: {
      ...mapGetters({
        nodeName2: 'nodeTypeNames',
        areaName2: 'areaTypeName',
        token: 'token'
      })
    },
    methods: {
      ...mapActions({
        nodeType: 'getNodeType',
        areaType: 'getArea'
      }),
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
        console.log(this.form)
        this.dialogFormVisible = true;
        this.dialogTitle = '修改';
      },
      handleEnabled(index, data){
        this.updateNodesType({id: data.id, is_enabled: !data.is_enabled}).then(res => {
          this.nodes.splice(index, 1, res.data.data)
        })
      },
      handleSave(){
        this.form.level = parseInt(this.form.level)
        if (this.dialogTitle = '添加') {
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
        if (this.dialogTitle = '修改') {
          this.upDateInfo(this.form_id, this.form).then(res => {
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
      },
      handleCurrentChange(val){
        this.currentPage = val;
        console.log(val)
        this.getInfo({page: val, limit: 15}).then((res) => {
          const data = res.data.data;
          this.totalSize = data.total_count;
          this.currentPage = data.current_page;
          this.nodes = [...data.nodes];
        })
      },
      getServerListPromise(){
        const page = this.currentPage;
        const limit = this.limit;
        const region_id = this.region_id;
        const method = 'GET';
        const token = this.token;
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
        this.getServerListPromise({page: 1, limit: 15}).then((res) => {
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

<style scope>
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
