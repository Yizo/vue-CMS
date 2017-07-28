<template>
  <div class="lock">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>服务器群组管理</el-breadcrumb-item>
      <el-breadcrumb-item>地域配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warp_filter">
      <el-button type="primary" @click="add" style="margin-bottom: 10px">新增</el-button>
      <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="地域编号">
          </el-table-column>
          <el-table-column
            prop="node_type_name"
            label="服务器类型">
          </el-table-column>
          <el-table-column
            prop="name"
            label="地域名称">
          </el-table-column>
          <el-table-column
            label="国旗图标">
            <template scope="scope">
              <img :src="url+'/flags/'+scope.row.abbr+'.png'" alt="">
            </template>
          </el-table-column>
          <el-table-column
            label="是否启用">
            <template scope="scope">
              <el-tag
                :type="scope.row.is_enabled ? 'success' : 'primary'"
                close-transition>{{scope.row.is_enabled ? '是' : '否'}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作功能">
            <template scope="scope">
            <span>
                <el-button size="small" @click="update(scope.row)">修改</el-button>
                <el-button size="small" @click="star(scope.row)"
                           :class="{a:scope.row.is_enabled,b:!scope.row.is_enabled}">{{isEnable(scope.row.is_enabled)}}</el-button>
            </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!--新增-->
    <el-dialog title="新增地域" v-model="dialogVisible" @close="closeBlock_add" class="filex_dialog">
      <el-form :model="form" label-width="150px" label-position="left" :rules="add_rules" ref="add">
        <el-form-item label="服务器类型" prop="node_type_id">
          <el-select v-model="form.node_type_id" style="width: 100%" class="dot_tips">
            <el-option
              v-for="(item,index) in pageInfo.data"
              :label="item.name"
              :value="item.id"
              :key="index">
            </el-option>
          </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="地域名称" prop="name">
          <el-input v-model="form.name" auto-complete="off" class="dot_tips"></el-input>
        </el-form-item>
        <el-form-item label="国旗图标" prop="abbr">
          <el-input v-model="form.abbr" auto-complete="off" placeholder="填写国家或地区简写代码" class="dot_tips"></el-input>
          <a href="http://baike.baidu.com/item/ISO%203166-1" target="_blank" class="iso">参照ISO 3166-1二位字段小写命名</a>
        </el-form-item>
        <el-form-item label="是否启用" style="text-align: left">
          <el-radio class="radio" v-model="form.is_enabled" label="true">启用</el-radio>
          <el-radio class="radio" v-model="form.is_enabled" label="false">禁用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary">
          <span @click="addSave">确定</span>
        </el-button>
      </div>
    </el-dialog>
    <!--修改-->
    <el-dialog title="修改地域" v-model="dialogVisible_update" @close="closeBlock_up" class="filex_dialog">
      <el-form :model="form2" label-width="120px" label-position="left" :rules="up_rules" ref="up">
        <el-form-item label="地域编号">
          <el-input v-model="form2.id" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="服务器类型" prop="node_type_id">
          <el-select v-model="form2.node_type_id" style="width: 100%">
            <el-option
              v-for="(item,index) in pageInfo.data"
              :label="item.name"
              :value="item.id"
              :key="index">
            </el-option>
          </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="地域名称" prop="name">
          <el-input v-model="form2.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="国旗缩写" prop="abbr">
          <el-input v-model="form2.abbr" auto-complete="off" placeholder="填写国家或地区简写代码"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" style="text-align: left">
          <el-radio class="radio" v-model="form2.is_enabled" label="true">启用</el-radio>
          <el-radio class="radio" v-model="form2.is_enabled" label="false">禁用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_update = false">取 消</el-button>
        <el-button type="primary">
          <span @click="updateSave">确定</span>
        </el-button>
      </div>
    </el-dialog>
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
</template>

<script>
  import * as API from '../../../api/api'
  import * as JS from '../../../assets/js/js'
  export default {
    data(){
      let abbr = (rule, value, callback) => {
        if (/^[a-zA-Z]{2}$/.test(value)) {
          callback()
        } else {
          callback(new Error('正确格式为2位字母'))
        }
      };
      return {
        tableData: [],
        enabled_type: '',//按钮类型
        currentPage: 1,
        pageSize: 20,
        totalSize: 0,
        url: API.url,
        /*弹窗*/
        dialogVisible: false,
        dialogVisible_update: false,
        pageInfo: {
          index: 1,
          data: '',//服务器节点类型,
          up_data: ''
        },
        form: {
          node_type_id: '',
          name: '',
          abbr: '',
          is_enabled: 'false'
        },
        form2: {
          id: '',
          node_type_id: '',
          name: '',
          abbr: '',
          is_enabled: 'false'
        },
        //新增校验
        add_rules: {
          node_type_id: [
            {type: 'number', required: true, message: '服务器类型必填', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '地域名称不能为空', trigger: 'blur'},
          ],
          abbr: [
            {required: true, message: '图标不能为空', trigger: 'blur'},
            {validator: abbr, trigger: 'blur'}
          ]
        },
        //修改校验
        up_rules: {
          node_type_id: [
            {type: 'number', required: true, message: '服务器类型必填', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '地域名称不能为空', trigger: 'blur'},
          ],
          abbr: [
            {required: true, message: '图标不能为空', trigger: 'blur'},
            {validator: abbr, trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      /*是否启用*/
      isEnable(data){
        if (data) {
          return '禁用'
        } else {
          return '启用'
        }
      },
      closeBlock_add(){
        this.$refs.add.resetFields();
      },
      closeBlock_up(){
        this.$refs.up.resetFields();
      },
      /*获取地域信息*/
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.area_node_regions,
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
      /*新增地域*/
      addInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'POST',
            url: API.area_node_regions,
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
      /*启用/禁用*/
      enable(id, parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'PATCH',
            url: API.area_update + '/' + id,
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
      /*修改地域*/
      update_area_node_regions(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'PATCH',
            url: API.area_update + parm.id,
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
        this.getInfo({page: val, limit: this.pageSize}).then((res) => {
          const data = res.data.data;
          this.totalSize = data.total_count;
          this.tableData = [...data.regions];
        })
      },
      add(){
        for (let i in this.form) {
          this.form[i] = null
        }
        this.dialogVisible = true;
        JS.getNodeType({is_enabled: 'true'}).then(res => {
          this.pageInfo.data = res.data.data.node_types;
        })
      },
      addSave(){
        this.$refs.add.validate((valid) => {
          if (valid) {
            this.addInfo(this.form).then(res => {
              if (res.data.success) {
                this.getInfo().then(res => {
                  this.tableData = res.data.data.regions
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
          }
        })
      },
      update(data){
        this.dialogVisible_update = true
        this.form2.id = data.id;
        this.form2.name = data.name;
        this.form2.node_type_id = data.node_type_id;
        this.form2.abbr = data.abbr;
        this.form2.is_enabled = String(data.is_enabled);
        JS.getNodeType({is_enabled: 'true'}).then(res => {
          this.pageInfo.data = res.data.data.node_types;
        })
      },
      updateSave(){
        this.$refs.up.validate((valid) => {
          if (valid) {
            this.update_area_node_regions(this.form2).then(res => {
              if (res.data.success) {
                this.getInfo().then(res => {
                  this.tableData = res.data.data.regions
                })
                this.dialogVisible_update = false;
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
          }
        })
      },
      star(data){
        this.enable(data.id, {id: data.id, is_enabled: !data.is_enabled}).then(res => {
          this.tableData.splice(this.tableData.indexOf(data), 1, res.data.data)
        })
      }
    },
    mounted(){
      this.getInfo({page: 1, limit: this.pageSize}).then(res => {
        this.tableData = res.data.data.regions;
        this.totalSize = res.data.data.total_count;
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

  .el-table .cell img {
    height: 30px;
    margin-top: 10px;
  }

  .iso {
    display: block;
    font-size: 10px;
    text-decoration: underline;
    color: #20A0FF;
  }
</style>

