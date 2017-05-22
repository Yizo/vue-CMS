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
            prop="username"
            label="账号">
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
              {{Timestamp(scope.row.created_at)}}
            </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
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
  export default {
    data(){
      return {
        tableData:[],
        currentPage: 1,
        totalSize:10
      }
    },
    methods:{
      /*封号日志*/
      getInfo(parm){
        return  new Promise( (resolve,reject) => {
          const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
          this.$http({
            method:'GET',
            url:API.user_status_logs,
            headers: {'Authorization': token},
            params:parm,
          }).then(function(res){

            if(res.status == 200){
              resolve(res)
            }else{
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
      //时间戳
      Timestamp(row){
        const now = new Date(row*1000);
        var year=now.getFullYear();
        var month=now.getMonth()+1;
        var date=now.getDate();
        var hour=now.getHours();
        var minute=now.getMinutes();
        var second=now.getSeconds();

        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
      },
    },
    mounted(){
      this.getInfo().then(res=>{
          this.tableData = res.data.data.logs
      })
    }
  }
</script>

<style scoped>
  .lock{
    padding: 10px;
  }
  .warp_filter{
    text-align: left;
    padding: 10px;
    background-color:#fff;
    border:1px solid #D3DCE6;
    margin-top: 20px;
  }
</style>

