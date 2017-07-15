<template>
  <div class="lock">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>封号日志</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warp_filter">
      <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="编号">
          </el-table-column>
          <el-table-column
            label="账号">
            <template scope="scope">
            <span class="dialog_num"
                  @click="userInfo(scope.row)">{{scope.row.username}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation_type"
            label="操作类型">
          </el-table-column>
          <el-table-column
            prop="admin_name"
            label="操作管理员">
          </el-table-column>
          <el-table-column
            label="操作时间">
            <template scope="scope">
            <span>
              {{scope.row.created_at | Time}}
            </span>
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
    <user-detail :visab="user_dialogVisible" :name="username" @closeDialog="cdialog"></user-detail>
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  import {mapGetters, mapActions} from 'vuex'
  import userDetail from '../../publicView/accoutInfo/index.vue'
  export default {
    data(){
      return {
        tableData: [],
        currentPage: 1,
        totalSize: 0,
        pageSize: 20,
        user_dialogVisible: false,
        username: '姓名',
      }
    },
    components: {
      userDetail
    },
    methods: {
      ...mapActions({
        ud_base: 'UD_base_info',
      }),
      cdialog(){
        this.user_dialogVisible = false
      },
      userInfo(row){
        this.username = row.username
        this.user_dialogVisible = true;
        window.sessionStorage.setItem('userId', row.user_id)
        this.ud_base({limit: 10})
      },
      /*封号日志*/
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.user_status_logs,
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
        this.getInfo({page: val, limit: this.pageSize}).then(res => {
          const data = res.data.data;
          this.totalSize = data.total_count;
          this.currentPage = data.current_page;
          this.tableData = [...data.logs];
        })
      }
    },
    mounted(){
      this.getInfo({page: 1, limit: this.pageSize}).then(res => {
        const data = res.data.data;
        this.totalSize = data.total_count;
        this.currentPage = data.current_page;
        this.tableData = [...data.logs];
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
</style>

