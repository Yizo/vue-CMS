<template>
  <div class="config">
    <!--导航-->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ name:'start' }">配置管理</el-breadcrumb-item>
      <el-breadcrumb-item>帮助问答</el-breadcrumb-item>
    </el-breadcrumb>

    <!--表格-->
    <div style="padding: 10px;background-color: #fff;text-align: left">
      <div style="position:relative">
        <el-select v-model="filter.platform" placeholder="平台筛选"
                   style="display: inline-block;width: 200px">
          <el-option
            v-for="item in platform"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="filter.app_version" placeholder="版本筛选" style="display: inline-block;width: 200px">
          <el-option
            v-for="(item,index) in versions.app_versions"
            :label="item.name"
            :value="item.name" :key="index">
          </el-option>
        </el-select>
        <el-input v-model="filter.app_version_number" placeholder="版本号"
                  style="display: inline-block;width: 200px"></el-input>
        <el-button type="primary" @click="filterHelp">筛选</el-button>
        <el-button type="primary" @click="add" style="position: absolute;top:0;right: 20px">添加</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%;margin-top: 10px">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          label="平台"
          width="120">
          <template scope="scope">
            {{scope.row.platform == 'all'?'全部':scope.row.platform}}
          </template>
        </el-table-column>
        <el-table-column
          label="版本"
          width="120">
          <template scope="scope">
            {{scope.row.app_version == "all" ?'全部' : scope.row.app_version}}
          </template>
        </el-table-column>
        <el-table-column
          prop="app_version_number"
          label="版本号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="app_version_number"
          label="创建时间"
          width="180">
          <template scope="scope">
            {{scope.row.created_at | Time}}
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="250">
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容">
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template scope="scope">
            <el-button size="small" @click="update(scope.$index,scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="del(scope.$index,scope.row)">删除</el-button>
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

    <el-dialog :title="pageInfo.name" v-model="dialogTableVisible_add" class="filex_dialog">
      <el-form :model="form" label-width="100px" label-position="left" id="form_help">
        <el-form-item label="平台">
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
          <el-select v-model="form.app_version" placeholder="请选择">
            <el-option
              v-for="(item,index) in versions.app_versions"
              :label="item.name"
              :value="item.name" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="form.app_version_number"></el-input>
        </el-form-item>
        <el-form-item label="标题" class="dot_tips">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" class="dot_tips">
          <el-input type="textarea" rows="8" v-model="form.content"></el-input>
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
  import {mapGetters, mapActions} from 'vuex'
  import * as API from '../../../api/api'
  export default {
    data(){
      return {
        tableData: [],
        //分页
        pageSize: 20,
        currentPage: 1,
        totalSize: 0,
        /*弹窗*/
        platform: [
          {label: '全部平台', value: 'all'},
          {label: 'IOS', value: 'ios'},
          {label: 'Android', value: 'android'},
          {label: 'PC', value: 'pc'},
          {label: 'MAC', value: 'mac'},
        ],
        dialogTableVisible_add: false,
        pageInfo: {
          id: 0,
          index: 0,
          name: ''
        },
        form: {
          platform: '',
          app_version: '',
          app_version_number: '',
          title: '',
          content: ''
        },
        filter: {
          app_version: '',
          platform: null,
          app_version_number: ''
        }
      }
    },
    computed: {
      ...mapGetters(['versions']),
    },
    methods: {
      /*获取*/
      getList(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.help_list,
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
      /*添加*/
      addInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'POST',
            url: API.help_create,
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
      /*删除*/
      delInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          let address = API.help_del.replace(/{id}/g, parm.id);
          this.$http({
            method: 'DELETE',
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
      /*更新*/
      upInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          let address = API.help_up.replace(/{id}/g, parm.id);
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
      getData(val){
        let options = {
          page: val,
          limit: this.pageSize,
          platform: this.filter.platform,
          app_version: this.filter.app_version,
          app_version_number: this.filter.app_version_number,
        }
        if (options.platform == '全部平台') {
          options.platform = 'all'
        }
        if (options.app_version == '全部版本') {
          options.app_version = 'all'
        }
        this.getList(options).then((res) => {
          let data = Object.assign({}, res.data.data);
          this.tableData = [...data.help_manuals];
          this.totalSize = data.total_count
        })
      },
      handleCurrentChange(val){
        this.currentPage = val
        this.getData(val)
      },
      filterHelp(){
        this.getData(1)
      },
      add(){
        this.dialogTableVisible_add = true
        this.pageInfo.name = '添加'
        this.form = {
          platform: '',
          app_version: '',
          app_version_number: '',
          title: '',
          content: ''
        }
      },
      update(index, data){
        this.dialogTableVisible_add = true
        this.pageInfo.name = '修改'
        this.pageInfo.id = data.id
        this.pageInfo.index = parseInt(index)
        this.form = Object.assign({}, data)
        if (this.form.platform == 'all') {
          this.form.platform = '全部平台'
        }
        if (this.form.app_version == 'all') {
          this.form.app_version = '全部版本'
        }
      },
      save(){
        if (this.pageInfo.name == '添加') {
          var options = Object.assign({}, this.form);
          if (options.platform == '全部平台') {
            options.platform = 'all'
          }
          if (options.app_version == '全部版本') {
            options.app_version = 'all'
          }
          this.addInfo(options).then((res) => {
            if (res.data.success) {
              this.$message({
                message: '恭喜你，添加成功！',
                duration: 1000,
                type: 'success'
              });
              this.getData(1)
              this.dialogTableVisible_add = false
            }
          })
        } else {
          var options = Object.assign({}, this.form);
          options.id = this.pageInfo.id;
          if (options.platform == '全部平台') {
            options.platform = 'all'
          }
          if (options.app_version == '全部版本') {
            options.app_version = 'all'
          }
          this.upInfo(options).then(res => {
            if (res.data.success) {
              if (res.data.success) {
                this.$message({
                  message: '恭喜你，修改成功！',
                  duration: 1000,
                  type: 'success'
                });
                this.tableData.splice(this.pageInfo.index, 1, res.data.data);
                this.dialogTableVisible_add = false
              }
            }
          })
        }
      },
      del(index, data){
        this.pageInfo.name = '删除'
        this.$confirm('此将删除ID=' + data.id + ',是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delInfo({id: data.id}).then(res => {
            if (res.data.success) {
              this.dialogTableVisible_add = false;
              this.tableData.splice(index, 1);
              this.$message({
                message: '删除成功',
                duration: 1000,
                type: 'success'
              });
            }
          })
        })
      },
    },
    mounted(){
      this.getData(1)
    }
  }
</script>
<style scoped>
  .config {
    padding: 10px;
  }

  .breadcrumb {
    height: 30px;
    line-height: 30px;
  }

  .page {
    text-align: right;
    margin-top: 20px;
  }

  .el-select {
    width: 200px;
  }

  .el-input {
    width: 200px;
  }

  #form_help .el-input, .el-select {
    width: 100%;
  }

  .el-form-item__content {
    text-align: left;
  }
</style>
