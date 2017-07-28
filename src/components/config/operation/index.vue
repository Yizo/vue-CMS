<template>
  <div class="lock">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员钻石操作日志</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warp_filter">
      <template>
        <el-table
          :data="data"
          style="width: 100%">
          <el-table-column
            label="操作日期">
            <template scope="scope">{{scope.row.created_at | Time}}</template>
          </el-table-column>
          <el-table-column
            prop="admin_id"
            label="管理员ID">
          </el-table-column>
          <el-table-column
            prop="admin_name"
            label="管理员名称">
          </el-table-column>
          <el-table-column
            prop="user_id"
            label="被操作用户ID">
          </el-table-column>
          <el-table-column
            prop="username"
            label="被操作用户名">
          </el-table-column>
          <el-table-column
            prop="original_coins"
            label="操作前钻石数量">
          </el-table-column>
          <el-table-column
            prop="current_coins"
            label="操作后钻石数量">
          </el-table-column>
          <el-table-column
            label="新增数量">
            <template scope="scope">
              {{scope.row.increased_coins == 0 ? '' : scope.row.increased_coins}}
            </template>
          </el-table-column>
          <el-table-column
            prop="operation_type"
            label="操作类型">
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
  </div>
</template>

<script>
  import * as API from '../../../api/api'
  export default {
    data(){
      return {
        data: [],
        pageSize: 15,
        currentPage: 1,
        totalSize: 0,
      }
    },
    methods: {
      /*封号日志*/
      getInfo(parm){
        return new Promise((resolve, reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method: 'GET',
            url: API.coin_operation_logs,
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
        this.getInfo({page: val, limit: this.pageSize}).then(res => {
          let data = res.data.data;
          this.data = data.logs;
          this.currentPage = data.current_page
          this.totalSize = data.total_count;
        })
      },
      handleSizeChange(val){
        this.getData(val)
      }
    },
    mounted(){
      this.getData(1)
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

  .page {
    text-align: right;
    margin-top: 20px;
  }
</style>
